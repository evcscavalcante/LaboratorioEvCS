# Como Gerar/Obter API Key Válida no Firebase

## Problema Atual
A configuração mostra `GOOGLE_API_KEY` como placeholder, mas precisa da API key real.

## Solução:

### 1. No Firebase Console
- Acesse: https://console.firebase.google.com
- Projeto: laboratorio-evcs
- Configurações do projeto → Seus aplicativos → App web

### 2. Se a API key não aparecer:
- Clique em "Adicionar aplicativo" → Web
- Registre um novo app web
- Isso gerará uma API key válida automaticamente

### 3. Habilitar Authentication:
- No menu lateral: Authentication
- Método de login → Ativar:
  - Google
  - Email/senha

### 4. Configurar domínios autorizados:
- Authentication → Settings → Authorized domains
- Adicionar: localhost, 127.0.0.1, seu-dominio.web.app

Com esses passos, obterá uma API key válida que começará com "AIza" e permitirá autenticação completa.