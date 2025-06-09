# Deploy Firebase - Laboratório Ev.C.S

## 🚀 Comandos Corretos para Deploy

### 1. Login no Firebase
```bash
firebase login
```

### 2. Verificar Projeto
```bash
firebase projects:list
firebase use laboratorio-evcs
```

### 3. Build do Projeto
```bash
npm install
npm run build
```

### 4. Deploy
```bash
firebase deploy --only hosting
```

## 🔧 Se der Erro de Build

### Instalar Dependências
```bash
npm install vite esbuild --save-dev
```

### Build Alternativo
```bash
npx vite build
```

## 📋 Verificar Configuração

### firebase.json
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### .firebaserc
```json
{
  "projects": {
    "default": "laboratorio-evcs"
  }
}
```

## 🌐 URLs de Deploy

- **Site Principal**: https://laboratorio-evcs.web.app
- **Alternativo**: https://laboratorio-evcs.firebaseapp.com

## 🔍 Verificar Deploy

```bash
firebase hosting:sites:list
```

## ⚡ Comandos Resumidos

```bash
# Login
firebase login

# Build
npm run build

# Deploy
firebase deploy --only hosting
```

## 📝 Troubleshooting

### Erro de Login
```bash
firebase logout
firebase login --reauth
```

### Erro de Build
```bash
rm -rf node_modules
npm install
npm run build
```

### Erro de Projeto
```bash
firebase use --add
# Selecionar: laboratorio-evcs
```

### Verificar Status
```bash
firebase projects:list
firebase use
```

O deploy vai subir o site para https://laboratorio-evcs.web.app com todas as funcionalidades do sistema funcionando.