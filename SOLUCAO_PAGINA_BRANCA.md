# Solução para Página Branca no Firebase

## 🔧 Problema Identificado
A página está em branco porque há incompatibilidade entre onde o Vite compila (`dist/public`) e onde o Firebase procura os arquivos (`dist`).

## ✅ Comandos para Corrigir

### 1. Fazer Build Novamente
```bash
npx vite build && npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
```

### 2. Verificar se os Arquivos Foram Criados
```bash
dir dist\public
```

### 3. Deploy Novamente
```bash
firebase deploy --only hosting
```

## 📋 Verificações

### Se `dist/public` existir:
- Firebase já está configurado para `"public": "dist/public"`
- Faça apenas o deploy

### Se não existir `dist/public`:
```json
# Mudar firebase.json para:
{
  "hosting": {
    "public": "dist"
  }
}
```

## 🌐 URLs para Testar
- https://laboratorio-evcs.web.app
- https://laboratorio-evcs.firebaseapp.com

## 🔍 Debugar Problemas

### Console do Navegador
1. Abrir F12 no site
2. Ver erros em Console
3. Verificar se arquivos JS/CSS carregaram

### Arquivos Essenciais
- `index.html` deve existir
- Arquivos `.js` compilados
- Arquivos `.css` de estilo

O sistema deve carregar corretamente após o novo build e deploy.