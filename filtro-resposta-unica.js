// ============================================
// FILTRO DE RESPOSTA ÚNICA - CASAL GARCIA
// Garante que apenas 1 mensagem seja enviada
// ============================================

try {
    // Recebe os dados do AI Agent
    const inputData = $json || {};
    
    // Extrai a resposta do AI Agent
    let response = inputData.output || inputData.message || inputData.text || "";
    
    // ============================================
    // FILTROS PARA GARANTIR RESPOSTA ÚNICA
    // ============================================
    
    // Se a resposta é um array, pega apenas o primeiro item
    if (Array.isArray(response)) {
        response = response[0] || "";
    }
    
    // Se a resposta contém múltiplas linhas, pega apenas a primeira
    if (typeof response === 'string' && response.includes('\n')) {
        const lines = response.split('\n').filter(line => line.trim() !== '');
        response = lines[0] || response;
    }
    
    // Remove caracteres de controle e espaços extras
    if (typeof response === 'string') {
        response = response.trim();
        // Remove quebras de linha duplas
        response = response.replace(/\n\n+/g, '\n');
        // Remove espaços múltiplos
        response = response.replace(/\s+/g, ' ');
    }
    
    // ============================================
    // VALIDAÇÕES DE SEGURANÇA
    // ============================================
    
    // Se não há resposta válida, usar fallback
    if (!response || response.length === 0) {
        response = "Recebi sua mensagem e estou processando. Como posso ajudar você hoje?";
    }
    
    // Limitar tamanho da resposta (máximo 1000 caracteres)
    if (response.length > 1000) {
        response = response.substring(0, 997) + "...";
    }
    
    // ============================================
    // ESTRUTURA DE RESPOSTA PADRONIZADA
    // ============================================
    
    const finalResponse = {
        // Resposta principal (única)
        message: response,
        
        // Metadados para debug
        metadata: {
            originalInputType: typeof inputData.output,
            wasArray: Array.isArray(inputData.output),
            hadMultipleLines: (inputData.output || "").includes('\n'),
            finalLength: response.length,
            timestamp: new Date().toISOString(),
            source: "ai_agent_filtered"
        },
        
        // Dados originais preservados (para debug)
        originalData: {
            ...inputData
        },
        
        // Status do processamento
        status: "success",
        filtered: true
    };
    
    // ============================================
    // RETORNA RESPOSTA ÚNICA E LIMPA
    // ============================================
    
    return finalResponse;

} catch (error) {
    // Em caso de erro, retorna resposta de fallback
    console.error("Erro no filtro de resposta única:", error);
    
    return {
        message: "Estou aqui para ajudar! Como posso auxiliar você hoje?",
        status: "error",
        error: error.message,
        timestamp: new Date().toISOString(),
        filtered: true,
        fallback: true
    };
}

// ============================================
// INSTRUÇÕES DE USO:
// ============================================
// 1. Adicione este nó Code ENTRE o "AI Agent" e "Respond to Webhook"
// 2. Configure o Respond to Webhook para usar: {{ $json.message }}
// 3. Isso garantirá apenas 1 resposta por interação
// ============================================