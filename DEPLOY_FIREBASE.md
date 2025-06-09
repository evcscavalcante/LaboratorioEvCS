# Deploy no Firebase Hosting - Laboratório Ev.C.S

## Informações Necessárias

### 1. Conta Google
- Uma conta Google para acessar o Firebase Console

### 2. Configuração do Projeto Firebase

#### Passo 1: Criar Projeto Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em "Adicionar projeto"
3. Nome sugerido: `laboratorio-evcs`
4. Desative Google Analytics (opcional)
5. Clique em "Criar projeto"

#### Passo 2: Configurar Hosting
1. No painel do projeto, clique em "Hosting"
2. Clique em "Começar"
3. Siga as instruções de instalação

#### Passo 3: Configurar Authentication (Necessário para o sistema)
1. No painel, clique em "Authentication"
2. Vá para a aba "Sign-in method"
3. Ative "Google" como provedor
4. Configure o email de suporte

#### Passo 4: Obter Configuração do App
1. Vá para "Configurações do projeto" (ícone de engrenagem)
2. Clique em "Adicionar app" > "Web"
3. Nome do app: `Laboratório Ev.C.S`
4. Copie a configuração Firebase (apiKey, authDomain, projectId, etc.)

## Comandos para Deploy

### 1. Instalar Firebase CLI (se não tiver)
```bash
npm install -g firebase-tools
```

### 2. Fazer Login no Firebase
```bash
firebase login
```

### 3. Inicializar Projeto
```bash
firebase init hosting
```
- Selecione o projeto criado
- Public directory: `dist`
- Single-page app: `Yes`
- Set up automatic builds: `No`

### 4. Configurar Variáveis de Ambiente
Crie arquivo `.env` com as configurações do Firebase:
```
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=laboratorio-evcs.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=laboratorio-evcs
VITE_FIREBASE_STORAGE_BUCKET=laboratorio-evcs.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

### 5. Build e Deploy
```bash
# Build para produção
npm run build

# Deploy para Firebase
firebase deploy
```

## Configurações Necessárias Pós-Deploy

### 1. Atualizar Configuração Firebase no Código
Após obter as configurações, atualize o arquivo `client/src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "laboratorio-evcs.firebaseapp.com",
  projectId: "laboratorio-evcs",
  storageBucket: "laboratorio-evcs.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

### 2. Configurar Domínios Autorizados
No Firebase Console > Authentication > Settings > Authorized domains:
- Adicione seu domínio Firebase: `laboratorio-evcs.web.app`
- Adicione `laboratorio-evcs.firebaseapp.com`

### 3. Banco de Dados (Opcional)
Para persistência completa na nuvem:
1. Ative Firestore Database no Firebase Console
2. Configure regras de segurança para permitir acesso autenticado

## URLs Finais
Após o deploy, sua aplicação estará disponível em:
- `https://laboratorio-evcs.web.app`
- `https://laboratorio-evcs.firebaseapp.com`

## Notas Importantes
- O sistema administrativo funcionará localmente com PostgreSQL
- No Firebase, os dados serão salvos no Firestore
- A autenticação Firebase substituirá o sistema local
- Todas as calculadoras e PDFs funcionarão normalmente
- A sincronização offline/online será mantida

## Custos
- Firebase Hosting: Gratuito até 10GB/mês
- Firebase Authentication: Gratuito até 10.000 usuários
- Firestore: Gratuito até 1GB e 20.000 leituras/dia