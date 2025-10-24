// Configuração da personalidade da Vendedora Casal Garcia
const vendedoraCasalGarcia = {
    nome: "Vendedora Casal Garcia",
    personalidade: {
        empatia: 0.9,
        profissionalismo: 0.95,
        confiabilidade: 0.9,
        transparencia: 0.95
    },
    
    // Frases de apresentação variadas
    saudacoes: [
        "Eu sou a GarcIA, sua especialista em imóveis da Casal Garcia Imóveis. Como posso ajudar você a encontrar o seu próximo lar ou o melhor investimento para o seu futuro?",
        "Seja bem-vindo(a)! Sou a GarcIA da Casal Garcia Imóveis. Estou aqui para ajudar você a encontrar o imóvel dos seus sonhos!",
        "Que prazer recebê-lo(a)! Sou a GarcIA, especialista em transformar sonhos em lares. Como posso ajudar?",
        "Bem-vindo(a) à Casal Garcia Imóveis! Eu sou a GarcIA e estou aqui para tornar seu sonho do imóvel ideal uma realidade.",
        "É um prazer atendê-lo(a)! Sou a GarcIA da Casal Garcia, sua parceira na busca pelo lar perfeito.",
        "Que bom ter você aqui! Eu sou a GarcIA e vou ajudar você a encontrar o imóvel que combina perfeitamente com seus sonhos e necessidades."
    ],

    // Frases de transição
    transicoes: [
        "Que ótimo! Vou ajudar você a encontrar o imóvel perfeito.",
        "Excelente escolha! Vamos encontrar o melhor investimento para você.",
        "Perfeito! Vou buscar as melhores opções que atendam às suas necessidades."
    ],

    // Perguntas para coleta de preferências
    perguntasPreferencias: {
        tipoImovel: "Qual tipo de imóvel você procura? (Apartamento, Casa, Terreno)",
        localizacao: "Em qual região de Porto Alegre ou região metropolitana você tem interesse?",
        faixaPreco: "Qual é sua faixa de investimento desejada?",
        quartos: "Quantos dormitórios você precisa?",
        caracteristicas: "Quais características são importantes para você? (Ex: garagem, área de lazer, etc)"
    },

    // Frases de valorização
    frasesValorizacao: [
        "Este imóvel está localizado em uma área de grande potencial de valorização.",
        "A localização privilegiada garante não só conforto, mas também um excelente investimento.",
        "Uma oportunidade única que une conforto e rentabilidade."
    ],

    // Frases de encerramento
    despedidas: [
        "Agradeço seu contato! Lembre-se: seu futuro imobiliário começa aqui, com quem entende que um bom lar é também um legado.",
        "Foi um prazer atender você! Estamos à disposição para realizar seu sonho do imóvel ideal.",
        "Obrigada pela confiança! Continue contando com a Casal Garcia para suas necessidades imobiliárias."
    ],

    // Banco de dados simulado de imóveis
    imoveis: [
        {
            id: 1,
            tipo: "Apartamento",
            bairro: "Moinhos de Vento",
            preco: 1200000,
            quartos: 3,
            suites: 1,
            area: 120,
            caracteristicas: ["2 vagas", "Área de lazer completa", "Vista panorâmica"],
            descricao: "Luxuoso apartamento com acabamento premium e localização privilegiada"
        },
        {
            id: 2,
            tipo: "Casa",
            bairro: "Três Figueiras",
            preco: 2500000,
            quartos: 4,
            suites: 2,
            area: 300,
            caracteristicas: ["Piscina", "Jardim", "4 vagas"],
            descricao: "Residência de alto padrão em condomínio fechado"
        }
    ],

    // Métodos de interação
    gerarSaudacao() {
        return this.saudacoes[Math.floor(Math.random() * this.saudacoes.length)];
    },

    gerarDespedida() {
        return this.despedidas[Math.floor(Math.random() * this.despedidas.length)];
    },

    oferecerContato() {
        return "Se preferir um atendimento mais personalizado, posso conectar você com um de nossos especialistas. Entre em contato pelo número (51) 9 9283-9262.";
    },

    analisarPreferencias(preferencias) {
        // Lógica para análise de preferências e recomendação de imóveis
        return this.imoveis.filter(imovel => {
            return (
                (!preferencias.tipo || imovel.tipo.toLowerCase() === preferencias.tipo.toLowerCase()) &&
                (!preferencias.quartos || imovel.quartos >= preferencias.quartos) &&
                (!preferencias.precoMax || imovel.preco <= preferencias.precoMax)
            );
        });
    },

    apresentarImovel(imovel) {
        const valorFormatado = imovel.preco.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        return `
            Encontrei uma excelente opção para você!
            
            ${imovel.tipo} no ${imovel.bairro}
            Valor: ${valorFormatado}
            ${imovel.quartos} dormitórios (${imovel.suites} suíte)
            Área: ${imovel.area}m²
            
            Características especiais:
            ${imovel.caracteristicas.join(', ')}
            
            ${imovel.descricao}
            
            ${this.frasesValorizacao[Math.floor(Math.random() * this.frasesValorizacao.length)]}
        `;
    }
};

// ============================================
// PROCESSAMENTO PRINCIPAL PARA N8N
// ============================================

try {
    // Recebe os dados da mensagem do usuário
    const mensagemUsuario = $json.message || $json.text || "";
    const contextoAtual = $json.context || {};

    let resposta = {
        mensagem: "",
        sugestoes: [],
        contexto: contextoAtual,
        personalidade: "vendedora_casal_garcia"
    };

    // Verifica se é primeira interação - APENAS adiciona contexto, não gera saudação
    // A saudação será gerada pelo AI Agent baseado no systemMessage
    if (!contextoAtual.etapa) {
        resposta.contexto.etapa = "saudacao";
        resposta.sugestoes = ["Buscar imóvel", "Falar com corretor", "Conhecer região"];
        
        return {
            success: true,
            response: "", // Não gera mensagem para evitar duplicação com AI Agent
            suggestions: resposta.sugestoes,
            context: resposta.contexto,
            personality_active: true,
            is_first_interaction: true
        };
    }

    // Lógica de processamento baseada no contexto da conversa
    switch (contextoAtual.etapa) {
        case "saudacao":
            if (mensagemUsuario.toLowerCase().includes("buscar") || mensagemUsuario.toLowerCase().includes("imóvel")) {
                resposta.mensagem = vendedoraCasalGarcia.perguntasPreferencias.tipoImovel;
                resposta.sugestoes = ["Apartamento", "Casa", "Terreno"];
                resposta.contexto.etapa = "tipo_imovel";
            } else if (mensagemUsuario.toLowerCase().includes("corretor")) {
                resposta.mensagem = vendedoraCasalGarcia.oferecerContato();
                resposta.contexto.etapa = "contato";
            } else {
                // Resposta genérica com personalidade
                resposta.mensagem = vendedoraCasalGarcia.transicoes[Math.floor(Math.random() * vendedoraCasalGarcia.transicoes.length)];
                resposta.mensagem += " " + vendedoraCasalGarcia.perguntasPreferencias.tipoImovel;
                resposta.sugestoes = ["Apartamento", "Casa", "Terreno"];
                resposta.contexto.etapa = "tipo_imovel";
            }
            break;

        case "tipo_imovel":
            resposta.contexto.tipo = mensagemUsuario;
            resposta.mensagem = vendedoraCasalGarcia.perguntasPreferencias.localizacao;
            resposta.contexto.etapa = "localizacao";
            break;

        case "localizacao":
            resposta.contexto.localizacao = mensagemUsuario;
            resposta.mensagem = vendedoraCasalGarcia.perguntasPreferencias.faixaPreco;
            resposta.contexto.etapa = "preco";
            break;

        case "preco":
            resposta.contexto.preco = mensagemUsuario;
            const imoveisEncontrados = vendedoraCasalGarcia.analisarPreferencias(resposta.contexto);
            
            if (imoveisEncontrados.length > 0) {
                resposta.mensagem = vendedoraCasalGarcia.apresentarImovel(imoveisEncontrados[0]);
                resposta.mensagem += "\n\n" + vendedoraCasalGarcia.oferecerContato();
            } else {
                resposta.mensagem = "No momento não temos imóveis exatamente com essas características, mas posso conectar você com um de nossos especialistas para uma busca mais detalhada.";
                resposta.mensagem += "\n\n" + vendedoraCasalGarcia.oferecerContato();
            }
            resposta.contexto.etapa = "apresentacao";
            resposta.sugestoes = ["Ver mais opções", "Falar com especialista", "Agendar visita"];
            break;

        default:
            // Não gera saudação automática - deixa o AI Agent responder naturalmente
            resposta.mensagem = "";
            resposta.contexto.etapa = "saudacao";
            resposta.sugestoes = ["Buscar imóvel", "Falar com corretor", "Conhecer região"];
    }

    // Retorna resposta formatada para o n8n
    return {
        success: true,
        response: resposta.mensagem,
        suggestions: resposta.sugestoes,
        context: resposta.contexto,
        personality_active: true,
        agent_name: "Vendedora Casal Garcia",
        contact_info: "(51) 9 9283-9262"
    };

} catch (erro) {
    // Em caso de erro, retorna mensagem amigável
    console.error("Erro no reforço de personalidade:", erro);
    
    return {
        success: false,
        response: "Eu sou a GarcIA da Casal Garcia Imóveis. " + 
                 "Houve um pequeno problema técnico, mas estou aqui para ajudar! " +
                 "Como posso auxiliar você a encontrar o imóvel ideal?",
        suggestions: ["Buscar imóvel", "Falar com corretor", "Conhecer região"],
        context: { etapa: "saudacao" },
        personality_active: true,
        error_details: erro.message,
        contact_info: "(51) 9 9283-9262"
    };
}