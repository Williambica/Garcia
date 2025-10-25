// ========================================
// CÓDIGO PARA USAR NO N8N - LIMITADOR DE MENSAGENS
// ========================================
// Cole este código no nó "Code" do n8n antes do nó "Responder ao Webhook"

// CONFIGURAÇÕES
const MAX_MESSAGE_LENGTH = 1500; // Máximo de caracteres por mensagem
const SPLIT_INDICATOR = "... (continua)"; // Indicador de mensagem dividida
const FINAL_INDICATOR = "... (fim)"; // Indicador de fim da mensagem

// Função principal para limitar tamanho da mensagem
function limitMessageSize(originalMessage) {
    // Se a mensagem for menor que o limite, retorna como está
    if (!originalMessage || originalMessage.length <= MAX_MESSAGE_LENGTH) {
        return {
            message: originalMessage || "Desculpe, não consegui gerar uma resposta.",
            isTruncated: false,
            totalParts: 1,
            currentPart: 1
        };
    }
    
    // Se for maior, trunca e adiciona indicador
    const truncatedMessage = originalMessage.substring(0, MAX_MESSAGE_LENGTH - SPLIT_INDICATOR.length) + SPLIT_INDICATOR;
    
    return {
        message: truncatedMessage,
        isTruncated: true,
        originalLength: originalMessage.length,
        truncatedLength: truncatedMessage.length,
        totalParts: Math.ceil(originalMessage.length / MAX_MESSAGE_LENGTH),
        currentPart: 1
    };
}

// Função alternativa para dividir em múltiplas mensagens (use se preferir)
function splitMessageIntoParts(originalMessage) {
    if (!originalMessage || originalMessage.length <= MAX_MESSAGE_LENGTH) {
        return [{
            message: originalMessage || "Desculpe, não consegui gerar uma resposta.",
            partNumber: 1,
            totalParts: 1,
            isLastPart: true
        }];
    }
    
    const parts = [];
    const totalParts = Math.ceil(originalMessage.length / MAX_MESSAGE_LENGTH);
    
    for (let i = 0; i < totalParts; i++) {
        const start = i * MAX_MESSAGE_LENGTH;
        const end = Math.min(start + MAX_MESSAGE_LENGTH, originalMessage.length);
        const isLastPart = i === totalParts - 1;
        
        let messagePart = originalMessage.substring(start, end);
        
        // Adicionar indicadores
        if (!isLastPart) {
            messagePart += ` ${SPLIT_INDICATOR}`;
        } else if (totalParts > 1) {
            messagePart += ` ${FINAL_INDICATOR}`;
        }
        
        parts.push({
            message: messagePart,
            partNumber: i + 1,
            totalParts: totalParts,
            isLastPart: isLastPart
        });
    }
    
    return parts;
}

// ========================================
// CÓDIGO PARA USAR NO N8N
// ========================================

// OPÇÃO 1: TRUNCAR MENSAGEM (RECOMENDADO)
// Cole este código no nó "Code" antes do "Responder ao Webhook":

const aiOutput = $('AI Agent').first().json.output || '';
const limitedResponse = limitMessageSize(aiOutput);

return {
    json: {
        message: limitedResponse.message,
        status: "success",
        metadata: {
            isTruncated: limitedResponse.isTruncated,
            originalLength: limitedResponse.originalLength || aiOutput.length,
            truncatedLength: limitedResponse.truncatedLength || aiOutput.length
        }
    }
};

// ========================================
// OPÇÃO 2: DIVIDIR EM MÚLTIPLAS PARTES
// ========================================
// Se quiser enviar múltiplas mensagens, use este código:

/*
const aiOutput = $('AI Agent').first().json.output || '';
const messageParts = splitMessageIntoParts(aiOutput);

// Retorna apenas a primeira parte (você pode configurar para enviar todas)
const firstPart = messageParts[0];

return {
    json: {
        message: firstPart.message,
        status: "success",
        metadata: {
            partNumber: firstPart.partNumber,
            totalParts: firstPart.totalParts,
            isLastPart: firstPart.isLastPart,
            hasMoreParts: !firstPart.isLastPart
        }
    }
};
*/

// ========================================
// INSTRUÇÕES DE USO NO N8N:
// ========================================
/*
1. Adicione um nó "Code" entre o "AI Agent" e "Responder ao Webhook"
2. Cole o código da OPÇÃO 1 (recomendado) no nó "Code"
3. Configure o nó "Responder ao Webhook" para usar:
   - Response Body: {{ $json.message }}
   - Response Headers: Content-Type = application/json
4. Salve e ative o workflow
5. Teste o chat

CONFIGURAÇÕES PERSONALIZÁVEIS:
- MAX_MESSAGE_LENGTH: Altere para o tamanho máximo desejado
- SPLIT_INDICATOR: Personalize o texto que indica continuação
- FINAL_INDICATOR: Personalize o texto que indica fim da mensagem
*/