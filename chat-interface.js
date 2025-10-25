// Interface do Chat - Funções para interação com o usuário

// Configuração do webhook do n8n
const N8N_CONFIG = {
    webhookUrl: 'https://chatbotdataride-n8n.nbjqkb.easypanel.host/webhook/72f76f07-574a-4a12-91ae-de7ad98cde04', // URL do webhook do n8n
    timeout: 30000, // 30 segundos
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Adicione headers de autenticação se necessário
        // 'Authorization': 'Bearer seu-token-aqui'
    }
};

// Variáveis de controle da conversação
let sessionId = null;
let conversationHistory = [];
let isConnected = false;
let isTyping = false;

// Função principal para enviar mensagem
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message || isTyping) return;
    
    // Adicionar mensagem do usuário
    addMessage(message, 'user');
    input.value = '';
    input.style.height = 'auto';
    document.getElementById('sendButton').disabled = true;
    
    // Mostrar indicador de digitação
    showTypingIndicator();
    isTyping = true;
    
    try {
        // Enviar mensagem para o webhook do n8n
        const response = await sendToN8N(message);
        
        // Esconder indicador de digitação
        hideTypingIndicator();
        
        // Processar resposta
        if (response && response.message) {
            // Verificar se a mensagem é muito longa e dividir se necessário
            if (isMessageTooLong(response.message)) {
                const messageParts = splitLongMessage(response.message);
                await addMultipleMessages(messageParts, 'bot');
            } else {
                addMessage(response.message, 'bot');
            }
            
            // Adicionar sugestões se disponíveis
            if (response.suggestions && response.suggestions.length > 0) {
                addQuickReplies(response.suggestions);
            }
        } else if (response && response.response) {
            // Verificar se a mensagem é muito longa e dividir se necessário
            if (isMessageTooLong(response.response)) {
                const messageParts = splitLongMessage(response.response);
                await addMultipleMessages(messageParts, 'bot');
            } else {
                addMessage(response.response, 'bot');
            }
            
            // Adicionar sugestões se disponíveis
            if (response.suggestions && response.suggestions.length > 0) {
                addQuickReplies(response.suggestions);
            }
        } else {
            // Fallback se não houver mensagem válida
            addMessage('Recebi sua mensagem, mas não consegui gerar uma resposta adequada. Tente reformular sua pergunta.', 'bot');
        }
        
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        hideTypingIndicator();
        
        // Mostrar mensagem de erro amigável
        addMessage('Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.', 'bot');
        
    } finally {
        isTyping = false;
        document.getElementById('sendButton').disabled = false;
    }
}

// Função para enviar mensagem para o webhook do n8n
async function sendToN8N(message) {
    const payload = {
        message: message,
        sessionId: sessionId,
        timestamp: new Date().toISOString(),
        context: {
            conversationHistory: conversationHistory.slice(-5), // Últimas 5 mensagens
            userAgent: navigator.userAgent,
            url: window.location.href
        }
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), N8N_CONFIG.timeout);

    try {
        const response = await fetch(N8N_CONFIG.webhookUrl, {
            method: 'POST',
            headers: N8N_CONFIG.headers,
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Tentar ler a resposta como texto primeiro
        const responseText = await response.text();
        
        // Verificar se a resposta está vazia
        if (!responseText || responseText.trim() === '') {
            console.warn('Resposta vazia do webhook');
            return { message: 'Desculpe, não consegui processar sua mensagem. Tente novamente.' };
        }

        // Tentar fazer parse do JSON
        try {
            const data = JSON.parse(responseText);
            
            // Verificar se a resposta tem a estrutura esperada
            if (data && (data.message || data.response)) {
                return data;
            } else {
                // Estrutura inesperada, mas não logar erro
                return { message: 'Recebi sua mensagem, mas a resposta está em um formato inesperado.' };
            }
            
        } catch (jsonError) {
            // Remover logs de erro para evitar spam no console
            // Tratamento silencioso dos erros de JSON
            
            // Se o JSON está malformado, tentar extrair uma mensagem útil
            if (responseText.includes('"message"')) {
                // Tentar extrair a mensagem mesmo com JSON malformado
                const messageMatch = responseText.match(/"message"\s*:\s*"([^"]+)"/);
                if (messageMatch && messageMatch[1]) {
                    return { message: messageMatch[1] };
                }
            }
            
            // Se a resposta parece ser texto simples (não JSON)
            if (!responseText.startsWith('{') && !responseText.startsWith('[')) {
                return { message: responseText.substring(0, 500) }; // Limitar a 500 caracteres
            }
            
            // Fallback final - sem log de erro
            return { 
                message: responseText.length > 0 ? responseText.substring(0, 500) : 'Resposta recebida com sucesso.'
            };
        }

    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            return { 
                message: 'A resposta está demorando mais que o esperado. Tente novamente em alguns instantes.' 
            };
        }
        
        if (error.message.includes('Failed to fetch') || error.message.includes('net::ERR')) {
            return { 
                message: 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.' 
            };
        }
        
        console.error('Erro na requisição:', error);
        return { 
            message: 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.' 
        };
    }
}

// Função para gerar ID de sessão único
function generateSessionId() {
    return 'garcia_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Função removida - apenas mensagens do agente serão exibidas

// Função para adicionar mensagem ao chat
function addMessage(text, sender, isWelcome = false) {
    const messagesContainer = document.getElementById('chatMessages');
    
    // Verificar se o elemento existe antes de tentar usá-lo
    if (!messagesContainer) {
        console.warn('Elemento chatMessages não encontrado');
        return;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message ${isWelcome ? 'welcome-message' : ''}`;
    
    const currentTime = new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            ${sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>'}
        </div>
        <div class="message-content">
            <div class="message-text">${text}</div>
            <div class="message-time">${currentTime}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Adicionar ao histórico
    conversationHistory.push({
        text: text,
        sender: sender,
        timestamp: new Date()
    });
}

// Função para mostrar indicador de digitação
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Função para esconder indicador de digitação
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Função para enviar mensagem rápida
function sendQuickMessage(message) {
    const input = document.getElementById('messageInput');
    input.value = message;
    sendMessage();
}

// Função para lidar com teclas pressionadas
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Função para redimensionar textarea automaticamente
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

// Função para adicionar sugestões rápidas
function addQuickReplies(suggestions) {
    const chatMessages = document.getElementById('chatMessages');
    
    // Remover sugestões anteriores se existirem
    const existingQuickReplies = chatMessages.querySelector('.quick-replies');
    if (existingQuickReplies) {
        existingQuickReplies.remove();
    }
    
    // Criar container de sugestões
    const quickRepliesContainer = document.createElement('div');
    quickRepliesContainer.className = 'quick-replies';
    quickRepliesContainer.innerHTML = `
        <div class="quick-replies-title">Sugestões:</div>
        <div class="quick-replies-buttons">
            ${suggestions.map(suggestion => 
                `<button class="quick-reply-btn" onclick="sendQuickMessage('${suggestion.replace(/'/g, "\'")}')">${suggestion}</button>`
            ).join('')}
        </div>
    `;
    
    chatMessages.appendChild(quickRepliesContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Função para inicializar o chat
async function initializeChat() {
    // Inicializar variáveis de sessão
    sessionId = generateSessionId();
    conversationHistory = [];
    
    // Mostrar mensagem de boas-vindas personalizada
    addMessage('Olá! 👋 Conte para nossa atendente o que você busca. Estou aqui para ajudar!', 'bot', true);
    
    // Tentar conectar com o n8n em segundo plano
    try {
        const response = await sendToN8N('__INIT__');
        isConnected = true;
        
        // Adicionar sugestões se fornecidas pelo n8n
        if (response && response.suggestions && response.suggestions.length > 0) {
            setTimeout(() => {
                addQuickReplies(response.suggestions);
            }, 1000);
        }
        
    } catch (error) {
        console.warn('Não foi possível conectar com o n8n:', error.message);
        isConnected = false;
    }
    
    // Configurar handlers de input
    setupInputHandlers();
}

// Função para configurar event listeners
function setupInputHandlers() {
    const input = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    
    // Verificar se os elementos existem antes de adicionar event listeners
    if (!input || !sendButton) {
        console.warn('Elementos de input não encontrados');
        return;
    }
    
    input.addEventListener('input', function() {
        sendButton.disabled = this.value.trim() === '';
        autoResize(this);
    });
    
    input.addEventListener('keypress', handleKeyPress);
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeChat();
});


// Configuração para divisão de mensagens
const MESSAGE_CONFIG = {
    maxLength: 300, // Máximo de caracteres por mensagem
    delayBetweenMessages: 1500, // Delay entre mensagens em ms (1.5 segundos)
    splitPatterns: [
        /\.\s+/g,    // Pontos seguidos de espaço
        /\!\s+/g,    // Exclamações seguidas de espaço
        /\?\s+/g,    // Interrogações seguidas de espaço
        /\;\s+/g,    // Ponto e vírgula seguidos de espaço
        /\:\s+/g,    // Dois pontos seguidos de espaço
        /\n\n/g,     // Quebras de linha duplas
        /\n/g        // Quebras de linha simples
    ]
};

// Função para detectar se uma mensagem é muito longa
function isMessageTooLong(message) {
    return message && message.length > MESSAGE_CONFIG.maxLength;
}

// Função para dividir mensagem em partes menores
function splitLongMessage(message) {
    if (!isMessageTooLong(message)) {
        return [message];
    }

    const parts = [];
    let remainingText = message.trim();

    while (remainingText.length > MESSAGE_CONFIG.maxLength) {
        let splitPoint = MESSAGE_CONFIG.maxLength;
        let bestSplit = -1;

        // Tentar encontrar um ponto de divisão natural
        for (const pattern of MESSAGE_CONFIG.splitPatterns) {
            const matches = [...remainingText.substring(0, MESSAGE_CONFIG.maxLength).matchAll(pattern)];
            if (matches.length > 0) {
                const lastMatch = matches[matches.length - 1];
                const potentialSplit = lastMatch.index + lastMatch[0].length;
                if (potentialSplit > bestSplit && potentialSplit < MESSAGE_CONFIG.maxLength) {
                    bestSplit = potentialSplit;
                }
            }
        }

        // Se encontrou um ponto de divisão natural, usar ele
        if (bestSplit > 0) {
            splitPoint = bestSplit;
        } else {
            // Caso contrário, procurar o último espaço antes do limite
            const lastSpace = remainingText.substring(0, MESSAGE_CONFIG.maxLength).lastIndexOf(' ');
            if (lastSpace > MESSAGE_CONFIG.maxLength * 0.7) { // Pelo menos 70% do limite
                splitPoint = lastSpace + 1;
            }
        }

        // Extrair a parte e adicionar ao array
        const part = remainingText.substring(0, splitPoint).trim();
        if (part.length > 0) {
            parts.push(part);
        }

        // Atualizar o texto restante
        remainingText = remainingText.substring(splitPoint).trim();
    }

    // Adicionar a parte final se houver
    if (remainingText.length > 0) {
        parts.push(remainingText);
    }

    return parts.length > 0 ? parts : [message];
}

// Função para adicionar múltiplas mensagens com delay
async function addMultipleMessages(messageParts, sender, isWelcome = false) {
    for (let i = 0; i < messageParts.length; i++) {
        const part = messageParts[i];
        
        // Adicionar indicador se não for a primeira mensagem
        if (i > 0) {
            showTypingIndicator();
            await new Promise(resolve => setTimeout(resolve, MESSAGE_CONFIG.delayBetweenMessages));
            hideTypingIndicator();
        }
        
        // Adicionar a mensagem
        addMessage(part, sender, isWelcome && i === 0);
        
        // Pequeno delay adicional para melhor UX (exceto na última mensagem)
        if (i < messageParts.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
}