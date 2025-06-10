# Como Obter as Credenciais Corretas do Firebase

Para fazer o Firebase funcionar completamente, você precisa das credenciais corretas do seu projeto.

## Passos para Obter as Credenciais:

1. **Acesse o Firebase Console:**
   - Vá para: https://console.firebase.google.com
   - Faça login com sua conta Google

2. **Selecione seu projeto:**
   - Clique no projeto "laboratorio-evcs"

3. **Configurações do Projeto:**
   - Clique no ícone da engrenagem (⚙️) no menu lateral
   - Selecione "Configurações do projeto"

4. **Aplicativo Web:**
   - Role para baixo até "Seus aplicativos"
   - Clique no app web (ícone </>)
   - Você verá um código similar a este:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "laboratorio-evcs.firebaseapp.com",
  projectId: "laboratorio-evcs",
  storageBucket: "laboratorio-evcs.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID",
  measurementId: "SEU_MEASUREMENT_ID"
};
```

5. **Copie apenas os valores:**
   - apiKey: "AIza..."
   - messagingSenderId: "530..."
   - appId: "1:530..."
   - measurementId: "G-..."

## Habilitar Autenticação:

1. No Firebase Console, vá em "Authentication"
2. Clique em "Método de login"
3. Habilite:
   - Google (recomendado)
   - Email/senha

Depois de obter essas informações, me forneça as credenciais para atualizar o sistema.