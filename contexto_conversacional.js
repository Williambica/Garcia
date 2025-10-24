// ===================================================================
// SISTEMA DE CONTEXTO CONVERSACIONAL PARA GARCIA - CASAL GARCIA IMÓVEIS
// ===================================================================
// Este código permite que o agente GarcIA mantenha o contexto completo
// da conversa, lembrando informações importantes e conduzindo diálogos
// mais naturais e inteligentes.

// Classe principal para gerenciar o contexto da conversa
class ContextoConversacional {
    constructor() {
        this.inicializarContexto();
    }

    // Inicializa o contexto com valores padrão
    inicializarContexto() {
        this.contexto = {
            // Identificação da sessão
            sessionId: this.gerarSessionId(),
            inicioConversa: new Date().toISOString(),
            
            // Estado atual da conversa
            etapaAtual: 'saudacao', // saudacao, coleta_preferencias, coleta_financeira, analise, apresentacao, encerramento
            subEtapa: null, // Para etapas mais específicas
            
            // Histórico completo da conversa
            historicoMensagens: [],
            
            // Informações do cliente coletadas
            dadosCliente: {
                nome: null,
                contato: null,
                preferencias: {
                    tipoImovel: null,
                    localizacao: null,
                    faixaPreco: null,
                    quartos: null,
                    caracteristicas: []
                },
                dadosFinanceiros: {
                    rendaMensal: null,
                    rendaExtra: null,
                    financiamentosAtuais: null,
                    cartaoCredito: null,
                    outrasContas: null,
                    comprometimentoCalculado: null,
                    perfilRisco: null
                }
            },
            
            // Estado da análise financeira
            analiseFinanceira: {
                realizada: false,
                resultado: null,
                capacidadePagamento: null,
                valorMaximoImovel: null
            },
            
            // Imóveis apresentados
            imoveisApresentados: [],
            
            // Intenções detectadas
            intencoes: {
                principal: null, // comprar, vender, alugar, investir
                urgencia: null, // baixa, media, alta
                interesse: null // baixo, medio, alto
            },
            
            // Flags de controle
            flags: {
                primeiraInteracao: true,
                analiseFinanceiraOfertada: false,
                contatoHumanoSolicitado: false,
                informacoesCompletas: false
            },
            
            // Métricas da conversa
            metricas: {
                numeroMensagens: 0,
                tempoTotalConversa: 0,
                perguntasFeitas: 0,
                informacoesColetadas: 0
            }
        };
    }

    // Gera um ID único para a sessão
    gerarSessionId() {
        return 'garcia_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Processa uma nova mensagem e atualiza o contexto
    processarMensagem(mensagemUsuario, dadosEntrada = {}) {
        try {
            // Atualiza métricas
            this.contexto.metricas.numeroMensagens++;
            this.contexto.metricas.tempoTotalConversa = Date.now() - new Date(this.contexto.inicioConversa).getTime();

            // Adiciona mensagem ao histórico
            this.adicionarMensagemHistorico('usuario', mensagemUsuario);

            // Extrai informações da mensagem
            const informacoesExtraidas = this.extrairInformacoes(mensagemUsuario);
            this.atualizarDadosCliente(informacoesExtraidas);

            // Detecta intenções
            this.detectarIntencoes(mensagemUsuario);

            // Determina próxima etapa
            this.determinarProximaEtapa(mensagemUsuario);

            // Gera resposta contextualizada
            const resposta = this.gerarRespostaContextualizada(mensagemUsuario);

            // Adiciona resposta ao histórico
            this.adicionarMensagemHistorico('garcia', resposta.response);

            return resposta;

        } catch (erro) {
            console.error('Erro ao processar mensagem:', erro);
            return this.gerarRespostaErro();
        }
    }

    // Adiciona mensagem ao histórico
    adicionarMensagemHistorico(remetente, mensagem) {
        this.contexto.historicoMensagens.push({
            remetente: remetente,
            mensagem: mensagem,
            timestamp: new Date().toISOString(),
            etapa: this.contexto.etapaAtual
        });
    }

    // Extrai informações importantes da mensagem do usuário
    extrairInformacoes(mensagem) {
        const informacoes = {};
        const mensagemLower = mensagem.toLowerCase();

        // Extrai tipo de imóvel
        if (mensagemLower.includes('apartamento') || mensagemLower.includes('apto')) {
            informacoes.tipoImovel = 'apartamento';
        } else if (mensagemLower.includes('casa')) {
            informacoes.tipoImovel = 'casa';
        } else if (mensagemLower.includes('terreno')) {
            informacoes.tipoImovel = 'terreno';
        }

        // Extrai localização
        const localizacoes = ['moinhos de vento', 'três figueiras', 'bela vista', 'mont serrat', 'petrópolis', 'centro', 'zona sul', 'zona norte'];
        for (const loc of localizacoes) {
            if (mensagemLower.includes(loc)) {
                informacoes.localizacao = loc;
                break;
            }
        }

        // Extrai número de quartos
        const matchQuartos = mensagem.match(/(\d+)\s*(quarto|dormitório|suíte)/i);
        if (matchQuartos) {
            informacoes.quartos = parseInt(matchQuartos[1]);
        }

        // Extrai valores monetários
        const matchValor = mensagem.match(/r\$?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i);
        if (matchValor) {
            const valor = parseFloat(matchValor[1].replace(/\./g, '').replace(',', '.'));
            if (valor > 100000) {
                informacoes.faixaPreco = valor;
            } else if (valor > 1000) {
                informacoes.rendaMensal = valor;
            }
        }

        // Extrai nome
        const matchNome = mensagem.match(/meu nome é (\w+)|eu sou (\w+)|me chamo (\w+)/i);
        if (matchNome) {
            informacoes.nome = matchNome[1] || matchNome[2] || matchNome[3];
        }

        return informacoes;
    }

    // Atualiza dados do cliente com novas informações
    atualizarDadosCliente(novasInformacoes) {
        for (const [chave, valor] of Object.entries(novasInformacoes)) {
            if (this.contexto.dadosCliente.preferencias.hasOwnProperty(chave)) {
                this.contexto.dadosCliente.preferencias[chave] = valor;
            } else if (this.contexto.dadosCliente.hasOwnProperty(chave)) {
                this.contexto.dadosCliente[chave] = valor;
            }
        }

        // Atualiza flag de informações completas
        this.verificarInformacoesCompletas();
    }

    // Verifica se as informações básicas estão completas
    verificarInformacoesCompletas() {
        const prefs = this.contexto.dadosCliente.preferencias;
        this.contexto.flags.informacoesCompletas = 
            prefs.tipoImovel && prefs.localizacao && (prefs.faixaPreco || prefs.quartos);
    }

    // Detecta intenções do usuário
    detectarIntencoes(mensagem) {
        const mensagemLower = mensagem.toLowerCase();

        // Detecta intenção principal
        if (mensagemLower.includes('comprar') || mensagemLower.includes('adquirir')) {
            this.contexto.intencoes.principal = 'comprar';
        } else if (mensagemLower.includes('vender')) {
            this.contexto.intencoes.principal = 'vender';
        } else if (mensagemLower.includes('alugar') || mensagemLower.includes('locação')) {
            this.contexto.intencoes.principal = 'alugar';
        } else if (mensagemLower.includes('investir') || mensagemLower.includes('investimento')) {
            this.contexto.intencoes.principal = 'investir';
        }

        // Detecta urgência
        if (mensagemLower.includes('urgente') || mensagemLower.includes('rápido') || mensagemLower.includes('logo')) {
            this.contexto.intencoes.urgencia = 'alta';
        } else if (mensagemLower.includes('sem pressa') || mensagemLower.includes('futuro')) {
            this.contexto.intencoes.urgencia = 'baixa';
        }

        // Detecta interesse
        if (mensagemLower.includes('muito interessado') || mensagemLower.includes('adorei')) {
            this.contexto.intencoes.interesse = 'alto';
        } else if (mensagemLower.includes('talvez') || mensagemLower.includes('não sei')) {
            this.contexto.intencoes.interesse = 'baixo';
        }
    }

    // Determina a próxima etapa da conversa
    determinarProximaEtapa(mensagem) {
        const mensagemLower = mensagem.toLowerCase();

        // Verifica se usuário quer falar com humano
        if (mensagemLower.includes('corretor') || mensagemLower.includes('humano') || 
            mensagemLower.includes('atendente') || mensagemLower.includes('especialista')) {
            this.contexto.flags.contatoHumanoSolicitado = true;
            this.contexto.etapaAtual = 'encerramento';
            return;
        }

        // Lógica de progressão das etapas
        switch (this.contexto.etapaAtual) {
            case 'saudacao':
                if (this.contexto.flags.primeiraInteracao) {
                    this.contexto.etapaAtual = 'coleta_preferencias';
                    this.contexto.flags.primeiraInteracao = false;
                }
                break;

            case 'coleta_preferencias':
                if (this.contexto.flags.informacoesCompletas && !this.contexto.flags.analiseFinanceiraOfertada) {
                    this.contexto.etapaAtual = 'coleta_financeira';
                    this.contexto.flags.analiseFinanceiraOfertada = true;
                }
                break;

            case 'coleta_financeira':
                if (this.temDadosFinanceiros()) {
                    this.contexto.etapaAtual = 'analise';
                }
                break;

            case 'analise':
                if (this.contexto.analiseFinanceira.realizada) {
                    this.contexto.etapaAtual = 'apresentacao';
                }
                break;

            case 'apresentacao':
                // Mantém na apresentação até solicitar encerramento
                break;
        }
    }

    // Verifica se tem dados financeiros suficientes
    temDadosFinanceiros() {
        const dados = this.contexto.dadosCliente.dadosFinanceiros;
        return dados.rendaMensal && (dados.financiamentosAtuais !== null || dados.cartaoCredito !== null);
    }

    // Gera resposta contextualizada baseada no estado atual
    gerarRespostaContextualizada(mensagemUsuario) {
        const nomeCliente = this.contexto.dadosCliente.nome || '';
        const saudacaoPersonalizada = nomeCliente ? `${nomeCliente}, ` : '';

        switch (this.contexto.etapaAtual) {
            case 'saudacao':
                return this.gerarSaudacaoInicial();

            case 'coleta_preferencias':
                return this.gerarPerguntaPreferencias();

            case 'coleta_financeira':
                return this.gerarPerguntaFinanceira();

            case 'analise':
                return this.gerarAnaliseFinanceira();

            case 'apresentacao':
                return this.gerarApresentacaoImoveis();

            case 'encerramento':
                if (this.contexto.flags.contatoHumanoSolicitado) {
                    return this.gerarTransferenciaHumano();
                }
                return this.gerarDespedida();

            default:
                return this.gerarRespostaGenerica();
        }
    }

    // Gera saudação inicial variada
    gerarSaudacaoInicial() {
        const saudacoes = [
            "Eu sou a GarcIA, sua especialista em imóveis da Casal Garcia Imóveis. Como posso ajudar você a encontrar o seu próximo lar ou o melhor investimento para o seu futuro?",
            "Seja bem-vindo(a)! Sou a GarcIA da Casal Garcia Imóveis. Estou aqui para ajudar você a encontrar o imóvel dos seus sonhos!",
            "Que prazer recebê-lo(a)! Sou a GarcIA, especialista em transformar sonhos em lares. Como posso ajudar?",
            "Bem-vindo(a) à Casal Garcia Imóveis! Eu sou a GarcIA e estou aqui para tornar seu sonho do imóvel ideal uma realidade."
        ];

        const saudacao = saudacoes[Math.floor(Math.random() * saudacoes.length)];

        return {
            success: true,
            response: saudacao,
            suggestions: ["Buscar apartamento", "Buscar casa", "Análise financeira", "Falar com corretor"],
            context: this.contexto,
            personality_active: true,
            contact_info: "(51) 9 9283-9262"
        };
    }

    // Gera pergunta sobre preferências baseada no que já foi coletado
    gerarPerguntaPreferencias() {
        const prefs = this.contexto.dadosCliente.preferencias;
        let pergunta = "";
        let sugestoes = [];

        if (!prefs.tipoImovel) {
            pergunta = "Para começar, que tipo de imóvel você está procurando?";
            sugestoes = ["Apartamento", "Casa", "Terreno"];
        } else if (!prefs.localizacao) {
            pergunta = `Perfeito! Você está interessado em ${prefs.tipoImovel}. Em qual região de Porto Alegre você gostaria de morar?`;
            sugestoes = ["Moinhos de Vento", "Três Figueiras", "Bela Vista", "Centro"];
        } else if (!prefs.quartos && prefs.tipoImovel !== 'terreno') {
            pergunta = `Ótima escolha de região! Quantos dormitórios você precisa no seu ${prefs.tipoImovel}?`;
            sugestoes = ["1 quarto", "2 quartos", "3 quartos", "4+ quartos"];
        } else {
            pergunta = "Excelente! Para que eu possa te guiar da melhor forma e encontrar as opções perfeitas com total segurança, podemos fazer uma rápida simulação da sua capacidade de financiamento?";
            sugestoes = ["Sim, vamos fazer", "Prefiro ver imóveis primeiro", "Falar com corretor"];
        }

        return {
            success: true,
            response: pergunta,
            suggestions: sugestoes,
            context: this.contexto,
            personality_active: true,
            contact_info: "(51) 9 9283-9262"
        };
    }

    // Gera pergunta financeira
    gerarPerguntaFinanceira() {
        const dados = this.contexto.dadosCliente.dadosFinanceiros;
        let pergunta = "";
        let sugestoes = [];

        if (!dados.rendaMensal) {
            pergunta = "Para fazer uma análise precisa, qual é sua renda mensal bruta aproximada?";
            sugestoes = ["R$ 3.000 - R$ 5.000", "R$ 5.000 - R$ 10.000", "R$ 10.000 - R$ 20.000", "Acima de R$ 20.000"];
        } else if (dados.financiamentosAtuais === null) {
            pergunta = "Você possui algum financiamento ativo atualmente? Se sim, qual o valor da parcela?";
            sugestoes = ["Não tenho", "R$ 500 - R$ 1.000", "R$ 1.000 - R$ 2.000", "Acima de R$ 2.000"];
        } else {
            pergunta = "Perfeito! Agora vou fazer sua análise financeira personalizada.";
            sugestoes = ["Fazer análise", "Ver imóveis", "Falar com especialista"];
        }

        return {
            success: true,
            response: pergunta,
            suggestions: sugestoes,
            context: this.contexto,
            personality_active: true,
            contact_info: "(51) 9 9283-9262"
        };
    }

    // Gera análise financeira
    gerarAnaliseFinanceira() {
        // Aqui você integraria com o código de análise financeira existente
        this.contexto.analiseFinanceira.realizada = true;
        
        return {
            success: true,
            response: "Com base nos seus dados, sua capacidade de financiamento está dentro dos parâmetros ideais! Agora posso apresentar imóveis que combinam perfeitamente com seu perfil financeiro e suas preferências.",
            suggestions: ["Ver imóveis recomendados", "Ajustar critérios", "Falar com especialista"],
            context: this.contexto,
            personality_active: true,
            contact_info: "(51) 9 9283-9262"
        };
    }

    // Gera apresentação de imóveis
    gerarApresentacaoImoveis() {
        return {
            success: true,
            response: "Baseado no seu perfil e análise financeira, encontrei algumas opções perfeitas para você! Gostaria de ver os detalhes dos imóveis que selecionei?",
            suggestions: ["Ver imóveis", "Agendar visita", "Ajustar busca", "Falar com corretor"],
            context: this.contexto,
            personality_active: true,
            contact_info: "(51) 9 9283-9262"
        };
    }

    // Gera transferência para humano
    gerarTransferenciaHumano() {
        return {
            success: true,
            response: "Claro! Vou conectar você com um dos nossos especialistas. Eles terão acesso a todo nosso histórico de conversa e poderão dar continuidade ao atendimento personalizado.",
            suggestions: ["Aguardar contato", "Deixar recado"],
            context: this.contexto,
            personality_active: true,
            contact_info: "(51) 9 9283-9262",
            transfer_to_human: true
        };
    }

    // Gera despedida
    gerarDespedida() {
        return {
            success: true,
            response: "Foi um prazer atender você! Lembre-se: seu futuro imobiliário começa aqui, com quem entende que um bom lar é também um legado. Até breve!",
            suggestions: ["Nova consulta", "Falar com corretor"],
            context: this.contexto,
            personality_active: true,
            contact_info: "(51) 9 9283-9262"
        };
    }

    // Gera resposta genérica
    gerarRespostaGenerica() {
        return {
            success: true,
            response: "Entendo! Como posso ajudar você da melhor forma? Estou aqui para encontrar o imóvel perfeito para você.",
            suggestions: ["Buscar imóvel", "Análise financeira", "Falar com corretor"],
            context: this.contexto,
            personality_active: true,
            contact_info: "(51) 9 9283-9262"
        };
    }

    // Gera resposta de erro
    gerarRespostaErro() {
        return {
            success: false,
            response: "Eu sou a GarcIA da Casal Garcia Imóveis. Houve um pequeno problema técnico, mas estou aqui para ajudar! Como posso auxiliar você a encontrar o imóvel ideal?",
            suggestions: ["Buscar imóvel", "Falar com corretor", "Tentar novamente"],
            context: this.contexto,
            personality_active: true,
            contact_info: "(51) 9 9283-9262",
            error_details: "Erro no processamento do contexto"
        };
    }

    // Obtém resumo do contexto atual
    obterResumoContexto() {
        return {
            etapa: this.contexto.etapaAtual,
            informacoesColetadas: this.contexto.dadosCliente,
            numeroMensagens: this.contexto.metricas.numeroMensagens,
            tempoConversa: this.contexto.metricas.tempoTotalConversa,
            intencoes: this.contexto.intencoes
        };
    }

    // Exporta contexto completo para análise
    exportarContexto() {
        return JSON.stringify(this.contexto, null, 2);
    }
}

// ===================================================================
// FUNÇÃO PRINCIPAL PARA USO NO N8N
// ===================================================================

// Inicializa ou recupera contexto existente
let contextoGlobal = null;

// Função principal para processar mensagens no n8n
function processarMensagemComContexto() {
    try {
        // Obtém dados de entrada
        const mensagemUsuario = $json.message || $json.text || '';
        const contextoExistente = $json.context || null;

        // Inicializa ou recupera contexto
        if (!contextoGlobal || !contextoExistente) {
            contextoGlobal = new ContextoConversacional();
        } else {
            // Restaura contexto existente se fornecido
            if (contextoExistente && typeof contextoExistente === 'object') {
                contextoGlobal.contexto = { ...contextoGlobal.contexto, ...contextoExistente };
            }
        }

        // Processa a mensagem
        const resultado = contextoGlobal.processarMensagem(mensagemUsuario, $json);

        return resultado;

    } catch (erro) {
        console.error('Erro no sistema de contexto:', erro);
        return {
            success: false,
            response: "Eu sou a GarcIA da Casal Garcia Imóveis. Houve um problema técnico, mas estou aqui para ajudar! Como posso auxiliar você?",
            suggestions: ["Buscar imóvel", "Falar com corretor", "Tentar novamente"],
            context: { etapa: "saudacao" },
            personality_active: true,
            contact_info: "(51) 9 9283-9262",
            error_details: erro.message
        };
    }
}

// Executa a função principal e retorna o resultado
return processarMensagemComContexto();