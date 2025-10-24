# 🧠 SISTEMA DE CONTEXTO CONVERSACIONAL - GARCIA

## 📋 **Visão Geral**

O sistema de contexto conversacional permite que o agente GarcIA mantenha memória completa das conversas, entenda o contexto atual e conduza diálogos mais naturais e inteligentes.

## 🚀 **Principais Funcionalidades**

### ✅ **Memória Conversacional Completa**
- Histórico completo de todas as mensagens
- Rastreamento de informações coletadas
- Continuidade entre diferentes interações

### ✅ **Estados Inteligentes da Conversa**
- **Saudação**: Apresentação inicial variada
- **Coleta de Preferências**: Tipo, localização, quartos, etc.
- **Coleta Financeira**: Renda, financiamentos, análise
- **Análise**: Processamento dos dados financeiros
- **Apresentação**: Exibição de imóveis compatíveis
- **Encerramento**: Despedida ou transferência humana

### ✅ **Extração Automática de Informações**
- Detecta automaticamente tipo de imóvel mencionado
- Identifica localização preferida
- Extrai valores monetários e número de quartos
- Reconhece nome do cliente quando mencionado

### ✅ **Detecção de Intenções**
- **Principal**: Comprar, vender, alugar, investir
- **Urgência**: Baixa, média, alta
- **Interesse**: Baixo, médio, alto

## 🔧 **Como Usar no n8n**

### **1. Configuração do Nó Code**
```javascript
// Cole o código do arquivo contexto_conversacional.js
// Configure como "Run Once for Each Item"
```

### **2. Dados de Entrada Esperados**
```json
{
  "message": "Mensagem do usuário",
  "context": {
    // Contexto anterior (opcional)
  }
}
```

### **3. Dados de Saída**
```json
{
  "success": true,
  "response": "Resposta contextualizada do GarcIA",
  "suggestions": ["Sugestão 1", "Sugestão 2"],
  "context": {
    // Contexto completo atualizado
  },
  "personality_active": true,
  "contact_info": "(51) 9 9283-9262"
}
```

## 📊 **Estrutura do Contexto**

### **Informações da Sessão**
- `sessionId`: ID único da conversa
- `inicioConversa`: Timestamp do início
- `etapaAtual`: Estado atual da conversa

### **Dados do Cliente**
```javascript
dadosCliente: {
  nome: "Nome do cliente",
  preferencias: {
    tipoImovel: "apartamento/casa/terreno",
    localizacao: "região preferida",
    faixaPreco: 500000,
    quartos: 3,
    caracteristicas: ["garagem", "piscina"]
  },
  dadosFinanceiros: {
    rendaMensal: 8000,
    rendaExtra: 2000,
    financiamentosAtuais: 1200,
    cartaoCredito: 500,
    comprometimentoCalculado: 0.25,
    perfilRisco: "atenção"
  }
}
```

### **Histórico de Mensagens**
```javascript
historicoMensagens: [
  {
    remetente: "usuario",
    mensagem: "Olá, procuro apartamento",
    timestamp: "2024-01-15T10:30:00Z",
    etapa: "saudacao"
  }
]
```

## 🎯 **Fluxo de Conversa Inteligente**

### **1. Saudação Inicial**
- Apresentação variada do GarcIA
- Identificação da intenção inicial
- Transição natural para coleta

### **2. Coleta Progressiva**
- Pergunta apenas o que ainda não foi coletado
- Adapta perguntas baseado no que já sabe
- Valida informações automaticamente

### **3. Análise Contextual**
- Integra com sistema de análise financeira
- Considera histórico completo
- Personaliza recomendações

### **4. Apresentação Inteligente**
- Mostra apenas imóveis compatíveis
- Referencia preferências mencionadas
- Mantém contexto financeiro

## 🔄 **Integração com Sistemas Existentes**

### **Com Análise Financeira**
```javascript
// O contexto pode ser passado para analise_financeira.js
const dadosFinanceiros = contexto.dadosCliente.dadosFinanceiros;
```

### **Com Chatbot Existente**
```javascript
// Substitui ou complementa o chatbot.js atual
// Mantém compatibilidade com n8n
```

## 📈 **Métricas e Monitoramento**

### **Métricas Automáticas**
- Número de mensagens na conversa
- Tempo total de conversa
- Informações coletadas
- Etapa atual da conversa

### **Flags de Controle**
- `primeiraInteracao`: Se é o primeiro contato
- `analiseFinanceiraOfertada`: Se análise foi oferecida
- `contatoHumanoSolicitado`: Se cliente quer falar com humano
- `informacoesCompletas`: Se dados básicos estão completos

## 🛠️ **Personalização e Extensão**

### **Adicionando Novas Etapas**
```javascript
// No método determinarProximaEtapa()
case 'nova_etapa':
    // Lógica da nova etapa
    break;
```

### **Novas Extrações de Informação**
```javascript
// No método extrairInformacoes()
if (mensagemLower.includes('nova_info')) {
    informacoes.novaInfo = 'valor';
}
```

### **Personalizando Respostas**
```javascript
// Adicione novos métodos de geração de resposta
gerarNovaResposta() {
    return {
        success: true,
        response: "Nova resposta personalizada",
        // ...
    };
}
```

## 🚨 **Tratamento de Erros**

### **Recuperação Automática**
- Try/catch em todas as operações críticas
- Fallback para respostas genéricas
- Manutenção do contexto mesmo com erros

### **Logs Detalhados**
- Console.error para debugging
- Detalhes do erro na resposta
- Contexto preservado para análise

## 📝 **Exemplo de Uso Completo**

```javascript
// Primeira mensagem
Input: { "message": "Olá, procuro apartamento em Moinhos de Vento" }
Output: {
  "response": "Que prazer recebê-lo! Apartamento em Moinhos de Vento é uma excelente escolha...",
  "context": {
    "etapaAtual": "coleta_preferencias",
    "dadosCliente": {
      "preferencias": {
        "tipoImovel": "apartamento",
        "localizacao": "moinhos de vento"
      }
    }
  }
}

// Segunda mensagem
Input: { 
  "message": "Preciso de 3 quartos, até R$ 800.000",
  "context": { /* contexto anterior */ }
}
Output: {
  "response": "Perfeito! 3 quartos até R$ 800.000 em Moinhos de Vento. Para garantir a melhor opção...",
  "context": {
    "etapaAtual": "coleta_financeira",
    // Contexto atualizado com novas informações
  }
}
```

## 🎉 **Benefícios**

✅ **Conversas mais naturais e fluidas**
✅ **Redução de perguntas repetitivas**
✅ **Melhor qualificação de leads**
✅ **Experiência personalizada**
✅ **Integração perfeita com n8n**
✅ **Escalabilidade e manutenibilidade**

---

**🏠 Casal Garcia Imóveis - Transformando sonhos em lares com inteligência artificial!**