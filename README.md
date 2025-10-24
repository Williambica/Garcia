# 🏠 Chat GarcIA - Casal Garcia Imóveis

Uma aplicação web moderna para demonstração do agente de IA **GarcIA**, especialista em imóveis da Casal Garcia Imóveis.

## 🌟 Características

- **Interface Moderna**: Design responsivo e intuitivo
- **Integração n8n**: Conecta diretamente com workflows do n8n
- **Tempo Real**: Indicadores de digitação e respostas instantâneas
- **Ações Rápidas**: Botões para interações comuns
- **Seguro**: Configurações de segurança e validação
- **Responsivo**: Funciona perfeitamente em desktop e mobile

## 🚀 Demonstração

![Chat GarcIA](https://via.placeholder.com/800x600/2c3e50/ffffff?text=Chat+GarcIA+Demo)

### Funcionalidades Principais

- ✅ Chat interativo com a GarcIA
- ✅ Análise de viabilidade financeira
- ✅ Recomendações personalizadas de imóveis
- ✅ Conexão com corretores especializados
- ✅ Interface moderna e responsiva
- ✅ Suporte a markdown básico
- ✅ Histórico de conversas

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com gradientes e animações
- **JavaScript ES6+**: Funcionalidades interativas
- **Font Awesome**: Ícones vetoriais

### Backend
- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web
- **Helmet**: Segurança HTTP
- **CORS**: Controle de acesso
- **Morgan**: Logging de requisições

### Deploy
- **Docker**: Containerização
- **EasyPanel**: Plataforma de deploy
- **Hostinger VPS**: Hospedagem

## 📦 Instalação Local

### Pré-requisitos

- Node.js 16+ 
- npm 8+
- Git

### Passos

1. **Clone o repositório**
   ```bash
   git clone https://github.com/casal-garcia/chat-demo.git
   cd chat-demo
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o webhook**
   Edite o arquivo `chatbot.js` e substitua a URL do webhook:
   ```javascript
   const CHAT_CONFIG = {
       webhookUrl: 'https://sua-instancia-n8n.com/webhook/chat-garcia',
       // ...
   };
   ```

4. **Inicie o servidor**
   ```bash
   npm start
   ```

5. **Acesse a aplicação**
   
   Abra http://localhost:3000 no seu navegador

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` (opcional):

```env
NODE_ENV=production
PORT=3000
WEBHOOK_URL=https://sua-instancia-n8n.com/webhook/chat-garcia
ALLOWED_ORIGINS=https://seu-dominio.com
```

### Configuração do n8n

1. **Crie um webhook no n8n**
2. **Configure o workflow da GarcIA**
3. **Atualize a URL no `chatbot.js`**

## 🚀 Deploy

### Deploy no EasyPanel (Hostinger)

Consulte o arquivo [DEPLOY.md](./DEPLOY.md) para instruções detalhadas de deploy no EasyPanel.

### Deploy com Docker

```bash
# Build da imagem
docker build -t casal-garcia-chat .

# Executar container
docker run -p 3000:3000 casal-garcia-chat
```

## 📱 Uso

### Interface do Chat

1. **Acesse a aplicação** no navegador
2. **Use as ações rápidas** para começar rapidamente
3. **Digite mensagens** no campo de input
4. **Pressione Enter** ou clique no botão enviar
5. **Aguarde a resposta** da GarcIA

### Ações Rápidas Disponíveis

- 🛒 **Comprar Imóvel**: Inicia busca por imóveis para compra
- 🏷️ **Vender Imóvel**: Processo de avaliação e venda
- 🧮 **Simulação**: Análise de viabilidade financeira
- 👔 **Falar com Corretor**: Conexão com especialista humano

## 🔍 API Endpoints

### GET /
Página principal do chat

### GET /health
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0"
}
```

### GET /api/info
```json
{
  "name": "Casal Garcia Chat",
  "description": "Chat web para demonstração do agente GarcIA",
  "version": "1.0.0",
  "environment": "production",
  "features": [...]
}
```

### POST /api/config/webhook
Configurar URL do webhook (desenvolvimento)

## 🧪 Desenvolvimento

### Executar em modo desenvolvimento

```bash
npm run dev
```

### Estrutura do Projeto

```
├── index.html          # Interface principal
├── styles.css          # Estilos CSS
├── chatbot.js          # Lógica do chat
├── server.js           # Servidor Express
├── package.json        # Dependências
├── Dockerfile          # Configuração Docker
├── .dockerignore       # Arquivos ignorados
├── DEPLOY.md           # Guia de deploy
└── README.md           # Este arquivo
```

### Debug

No console do navegador:

```javascript
// Ver estado do chat
debugChat();

// Atualizar URL do webhook
updateWebhookUrl('nova-url');

// Ver configurações
console.log(CHAT_CONFIG);
```

## 🔒 Segurança

- **Helmet.js**: Headers de segurança HTTP
- **CORS**: Controle de origem cruzada
- **CSP**: Content Security Policy
- **Rate Limiting**: Proteção contra spam
- **Input Validation**: Validação de entrada
- **HTTPS**: Comunicação criptografada

## 📊 Monitoramento

### Logs

```bash
# Ver logs em tempo real
docker logs -f casal-garcia-chat

# Logs do servidor
tail -f /var/log/casal-garcia-chat.log
```

### Métricas

- **Uptime**: Disponibilidade da aplicação
- **Response Time**: Tempo de resposta
- **Error Rate**: Taxa de erros
- **User Interactions**: Interações dos usuários

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

### Contato Comercial
- **Telefone**: (51) 9 9283-9262
- **Email**: contato@casalgarcia.com.br
- **Website**: https://casalgarcia.com.br

### Suporte Técnico
- **Email**: suporte@casalgarcia.com.br
- **Issues**: https://github.com/casal-garcia/chat-demo/issues

## 🙏 Agradecimentos

- **Equipe Casal Garcia Imóveis**
- **Comunidade n8n**
- **Desenvolvedores Open Source**

---

**Desenvolvido com ❤️ pela equipe Casal Garcia Imóveis**

*Transformando sonhos em lares desde 1985*