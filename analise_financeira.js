// ============================================
// SISTEMA DE ANÁLISE FINANCEIRA CASAL GARCIA
// Código para n8n - Análise de viabilidade financeira
// ============================================

// Recebe os dados do cliente da mensagem ou contexto anterior
const dadosCliente = $json;

// Sistema de análise financeira
const analisadorFinanceiro = {
    // Configurações de limites financeiros
    limites: {
        comprometimentoMaximo: 0.30,      // 30% da renda comprometida
        comprometimentoIdeal: 0.20,       // 20% da renda comprometida (ideal)
        scoreMinimo: 600,                 // Score mínimo para aprovação
        entradaMinima: 0.20              // 20% de entrada mínima
    },

    // Perguntas para coleta de dados financeiros
    perguntasFinanceiras: {
        renda: "Para uma análise precisa, preciso saber: Qual é sua renda mensal bruta?",
        rendaExtra: "Você possui alguma renda extra? (freelances, aluguéis, etc.)",
        financiamentos: "Possui algum financiamento em andamento? Qual o valor da parcela?",
        cartaoCredito: "Qual o valor aproximado que você gasta mensalmente no cartão de crédito?",
        outrasContas: "Possui outras contas fixas mensais? (empréstimos, consórcios, etc.)"
    },

    // Mensagens de feedback baseadas no perfil
    mensagensFeedback: {
        otimo: [
            "Excelente! Sua situação financeira está muito favorável para um financiamento imobiliário.",
            "Parabéns! Você está em uma posição financeira ideal para realizar seu sonho da casa própria.",
            "Ótima notícia! Seu perfil financeiro permite excelentes opções de financiamento."
        ],
        atencao: [
            "Sua situação financeira requer um pouco mais de atenção, mas ainda temos boas opções para você.",
            "Vamos trabalhar juntos para encontrar a melhor solução financeira para seu perfil.",
            "Com alguns ajustes, podemos encontrar o financiamento ideal para você."
        ],
        critico: [
            "Identificamos que seu comprometimento de renda está um pouco elevado, mas não desista!",
            "Vamos trabalhar em um plano personalizado para melhorar sua capacidade de financiamento.",
            "Oferecemos consultoria financeira gratuita para ajudar você a alcançar seu objetivo."
        ]
    },

    calcularComprometimento(dados) {
        // Converte strings para números e trata valores nulos
        const rendaTotal = Number(dados.renda || 0) + Number(dados.rendaExtra || 0);
        const despesasFixas = Number(dados.financiamentos || 0) + 
                            Number(dados.cartaoCredito || 0) + 
                            Number(dados.outrasContas || 0);
        
        const comprometimento = rendaTotal > 0 ? despesasFixas / rendaTotal : 0;
        const disponibilidadeFinanceira = rendaTotal - despesasFixas;
        
        return {
            rendaTotal,
            despesasFixas,
            comprometimento,
            disponibilidadeFinanceira,
            percentualComprometimento: (comprometimento * 100).toFixed(1)
        };
    },

    avaliarPerfil(analise) {
        const perfil = {
            status: "",
            mensagem: "",
            recomendacoes: [],
            valorMaximoFinanciamento: 0,
            capacidadePagamento: 0,
            scoreRisco: 0
        };

        // Validação de dados básicos
        if (!analise.rendaTotal || analise.rendaTotal <= 0) {
            return {
                status: "Dados_Incompletos",
                mensagem: "Para uma análise precisa, preciso conhecer sua situação financeira.",
                recomendacoes: ["Por favor, informe sua renda mensal bruta para continuarmos"],
                valorMaximoFinanciamento: 0,
                capacidadePagamento: 0,
                scoreRisco: 0
            };
        }

        const comprometimento = analise.comprometimento;
        const disponibilidade = analise.disponibilidadeFinanceira;

        // Cálculo da capacidade de pagamento (30% da renda disponível)
        const capacidadePagamento = disponibilidade * 0.30;
        perfil.capacidadePagamento = capacidadePagamento;

        // Cálculo do valor máximo de financiamento
        // Usando tabela SAC com juros de 8% ao ano por 30 anos
        const taxaJurosAnual = 0.08;
        const prazoAnos = 30;
        const taxaMensal = taxaJurosAnual / 12;
        const parcelas = prazoAnos * 12;
        
        let valorMaximoFinanciamento = 0;
        if (capacidadePagamento > 0) {
            valorMaximoFinanciamento = capacidadePagamento * 
                ((1 - Math.pow(1 + taxaMensal, -parcelas)) / taxaMensal);
        }

        perfil.valorMaximoFinanciamento = valorMaximoFinanciamento;

        // Cálculo do score de risco (0-100)
        let scoreRisco = 100;
        if (comprometimento > 0.40) scoreRisco -= 40;
        else if (comprometimento > 0.30) scoreRisco -= 25;
        else if (comprometimento > 0.20) scoreRisco -= 10;

        perfil.scoreRisco = scoreRisco;

        // Avaliação do perfil
        if (comprometimento < this.limites.comprometimentoIdeal) {
            perfil.status = "Ótimo";
            perfil.mensagem = this.mensagensFeedback.otimo[
                Math.floor(Math.random() * this.mensagensFeedback.otimo.length)
            ];
            perfil.recomendacoes = [
                "✅ Você está em uma excelente posição para financiar um imóvel!",
                `💰 Valor máximo recomendado: R$ ${valorMaximoFinanciamento.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
                `📊 Comprometimento atual: ${analise.percentualComprometimento}% (Ideal!)`,
                "🏠 Podemos apresentar imóveis premium dentro do seu orçamento"
            ];
        } else if (comprometimento < this.limites.comprometimentoMaximo) {
            perfil.status = "Atenção";
            perfil.mensagem = this.mensagensFeedback.atencao[
                Math.floor(Math.random() * this.mensagensFeedback.atencao.length)
            ];
            perfil.recomendacoes = [
                "⚠️ Situação financeira requer atenção, mas viável",
                `💰 Valor máximo recomendado: R$ ${valorMaximoFinanciamento.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
                `📊 Comprometimento atual: ${analise.percentualComprometimento}%`,
                "💡 Considere reduzir algumas despesas antes do financiamento",
                "🏠 Vamos analisar imóveis com valores mais conservadores"
            ];
        } else {
            perfil.status = "Crítico";
            perfil.mensagem = this.mensagensFeedback.critico[
                Math.floor(Math.random() * this.mensagensFeedback.critico.length)
            ];
            perfil.recomendacoes = [
                "🚨 Comprometimento de renda elevado - necessária atenção especial",
                `📊 Comprometimento atual: ${analise.percentualComprometimento}%`,
                "💼 Recomendamos consultoria financeira gratuita",
                "📋 Vamos trabalhar em um plano para melhorar sua capacidade",
                "⏰ Agende uma conversa com nosso especialista financeiro"
            ];
        }

        return perfil;
    },

    gerarRecomendacoes(perfilCliente, analise) {
        const recomendacoes = [];

        // Recomendações baseadas no status
        if (perfilCliente.status === "Crítico") {
            recomendacoes.push({
                tipo: "consultoria_urgente",
                prioridade: "alta",
                mensagem: "🎯 Consultoria Financeira Gratuita - Vamos criar um plano personalizado para você!",
                acao: "agendar_consultoria",
                contato: "(51) 9 9283-9262"
            });
        }

        if (perfilCliente.valorMaximoFinanciamento > 100000) {
            recomendacoes.push({
                tipo: "imoveis_disponiveis",
                prioridade: "media",
                mensagem: `🏠 Temos ${Math.floor(Math.random() * 15) + 5} imóveis disponíveis na sua faixa de financiamento`,
                acao: "ver_imoveis",
                faixaValor: perfilCliente.valorMaximoFinanciamento
            });
        }

        // Recomendação de agendamento de visita
        if (perfilCliente.status !== "Crítico") {
            recomendacoes.push({
                tipo: "agendamento_visita",
                prioridade: "alta",
                mensagem: "📅 Que tal agendarmos uma visita aos imóveis que mais combinam com você?",
                acao: "agendar_visita",
                disponibilidade: ["Manhã", "Tarde", "Final de semana"]
            });
        }

        return recomendacoes;
    }
};

// ============================================
// PROCESSAMENTO PRINCIPAL
// ============================================

try {
    // Verifica se temos dados suficientes para análise
    if (!dadosCliente.renda && !dadosCliente.message) {
        // Primeira interação - solicita dados
        return {
            status: "solicitando_dados",
            mensagem: "Olá! Sou a especialista em análise financeira da Casal Garcia. " + 
                     analisadorFinanceiro.perguntasFinanceiras.renda,
            proximoPasso: "coletar_renda",
            perguntasRestantes: Object.keys(analisadorFinanceiro.perguntasFinanceiras)
        };
    }

    // Processa a análise financeira
    const analise = analisadorFinanceiro.calcularComprometimento(dadosCliente);
    const perfil = analisadorFinanceiro.avaliarPerfil(analise);
    const recomendacoes = analisadorFinanceiro.gerarRecomendacoes(perfil, analise);

    // Gera mensagem personalizada
    let mensagemCompleta = perfil.mensagem + "\n\n";
    mensagemCompleta += "📋 **RESUMO DA SUA ANÁLISE FINANCEIRA:**\n";
    mensagemCompleta += perfil.recomendacoes.join("\n") + "\n\n";
    
    if (recomendacoes.length > 0) {
        mensagemCompleta += "🎯 **PRÓXIMOS PASSOS:**\n";
        recomendacoes.forEach(rec => {
            mensagemCompleta += `${rec.mensagem}\n`;
        });
    }

    mensagemCompleta += "\n💬 Entre em contato: (51) 9 9283-9262";
    mensagemCompleta += "\n🏢 Casal Garcia Imóveis - Realizando sonhos há mais de 20 anos";

    // Retorna resultado formatado para o n8n
    return {
        analiseCompleta: true,
        status: perfil.status,
        mensagem: mensagemCompleta,
        dadosFinanceiros: {
            rendaTotal: analise.rendaTotal,
            comprometimentoAtual: analise.percentualComprometimento + "%",
            valorMaximoFinanciamento: perfil.valorMaximoFinanciamento,
            capacidadePagamento: perfil.capacidadePagamento,
            scoreRisco: perfil.scoreRisco
        },
        recomendacoes: recomendacoes,
        proximosPassos: perfil.status === "Crítico" ? 
            "consultoria_financeira" : 
            "apresentacao_imoveis",
        contatoEspecialista: "(51) 9 9283-9262"
    };

} catch (erro) {
    // Em caso de erro, retorna mensagem amigável
    console.error("Erro na análise financeira:", erro);
    
    return {
        erro: true,
        status: "erro_processamento",
        mensagem: "Ops! Ocorreu um problema na análise. Mas não se preocupe! " +
                 "Entre em contato diretamente com nosso especialista pelo " +
                 "(51) 9 9283-9262 e faremos sua análise personalizada.",
        detalhes: erro.message,
        contatoEspecialista: "(51) 9 9283-9262"
    };
}