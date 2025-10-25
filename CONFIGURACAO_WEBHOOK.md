# Configuração do Webhook N8N

## Passos para configurar:

### 1. No N8N:
1. Abra o nó "Webhook" no seu workflow
2. Configure:
   - **Método HTTP**: POST
   - **Caminho**: /webhook/casal-garcia-chat (ou o caminho que preferir)
   - **Responder**: Immediately
   - **Tipo de resposta**: JSON

3. Copie a URL completa que aparece (algo como: `https://sua-instancia-n8n.com/webhook/casal-garcia-chat`)

### 2. No código (chat-interface.js):
Substitua a linha 5 com a URL real:
```javascript
webhookUrl: 'SUA_URL_REAL_AQUI',
```

### 3. Exemplo de payload que será enviado:
```json
{
  "message": "mensagem do usuário",
  "sessionId": "id-unico-da-sessao",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "conversationHistory": [
    {
      "role": "user",
      "content": "mensagem anterior",
      "timestamp": "2024-01-01T11:59:00.000Z"
    }
  ]
}
```

### 4. Resposta esperada do N8N:
```json
{
  "response": "resposta do agente",
  "suggestions": ["sugestão 1", "sugestão 2", "sugestão 3"]
}
```

## Testando a configuração:
1. Salve e ative o workflow no N8N
2. Atualize a URL no código
3. Teste enviando uma mensagem no chat