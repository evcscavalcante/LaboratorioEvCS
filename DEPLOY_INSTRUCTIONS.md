# Deploy Rápido - Firebase Hosting

## Seu projeto Firebase já está configurado! ✅

Configurações encontradas no código:
- Project ID: `laboratorio-evcs`
- Auth Domain: `laboratorio-evcs.firebaseapp.com`
- API Key e outras configurações já estão no código

## Comandos para Deploy (Execute em ordem):

### 1. Login no Firebase
```bash
firebase login
```

### 2. Build para produção
```bash
npx vite build --outDir dist
```

### 3. Deploy
```bash
firebase deploy --only hosting
```

## Resultado Final
Sua aplicação estará disponível em:
- **https://laboratorio-evcs.web.app**
- **https://laboratorio-evcs.firebaseapp.com**

## Se der erro:
1. Execute: `firebase use laboratorio-evcs`
2. Tente novamente: `firebase deploy --only hosting`

## Configurações Firebase Necessárias (no Console):

### Authentication
1. Ative Authentication no Firebase Console
2. Método de login: Google
3. Domínios autorizados: adicione seu domínio `.web.app`

### Firestore (para dados)
1. Ative Firestore Database
2. Modo: produção
3. Região: us-central1

## Pronto! 🚀
Todos os recursos funcionarão:
- ✅ Calculadoras de densidade
- ✅ Geração de PDFs
- ✅ Sistema administrativo
- ✅ Sincronização offline/online
- ✅ Autenticação Google