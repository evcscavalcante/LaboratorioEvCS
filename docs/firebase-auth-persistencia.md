# Autenticação e Persistência de Dados com Firebase

Este projeto usa Firebase para autenticação de usuários e armazenamento de testes geotécnicos. A configuração padrão permite que os dados fiquem disponíveis offline e sejam sincronizados assim que a conexão for restabelecida.

## Configuração do Firebase
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2. Ative a autenticação por e‑mail/senha e Google.
3. Copie as credenciais Web fornecidas pelo console e substitua no código abaixo.

```ts
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'API_KEY_AQUI',
  authDomain: 'laboratorio-evcs.firebaseapp.com',
  projectId: 'laboratorio-evcs',
  storageBucket: 'laboratorio-evcs.firebasestorage.app',
  messagingSenderId: '53045134219',
  appId: '1:53045134219:web:e80d49f77f58870ac8e58e',
  measurementId: 'G-R8M9D9H8XB'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Habilita cache offline do Firestore
enableIndexedDbPersistence(db).catch(() => {
  console.warn('Persistência offline indisponível');
});
```

As funções `auth` e `db` são utilizadas pelos `contexts` da aplicação para realizar login e salvar documentos. A chamada `enableIndexedDbPersistence` garante que as alterações sejam armazenadas localmente quando o usuário estiver sem conexão.

Para utilizar esta configuração, defina as variáveis `VITE_FIREBASE_*` no arquivo `.env` conforme explicado no README.
