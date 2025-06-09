# Comandos Deploy Firebase - Página em Branco

## Problema
A página está em branco porque o build não está funcionando devido a componentes UI faltantes.

## Solução Rápida

Execute estes comandos na pasta do projeto:

```bash
# 1. Na pasta: C:\Users\Salum\Downloads\Laboratorio-EvCS\Laboratorio-EvCS

# 2. Fazer build simplificado apenas do frontend
npx vite build --outDir ../dist

# 3. Verificar se criou arquivos
dir dist

# 4. Deploy no Firebase
firebase deploy --only hosting
```

## Se não funcionar

### Alternativa 1: Build manual
```bash
# Copiar HTML base
copy client\index.html dist\index.html

# Compilar apenas JS essencial
npx esbuild client/src/main.tsx --bundle --outfile=dist/main.js --format=esm --loader:.tsx=tsx

# Deploy
firebase deploy --only hosting
```

### Alternativa 2: Deploy direto dos arquivos
```bash
# Usar pasta client como fonte
# Alterar firebase.json:
{
  "hosting": {
    "public": "client"
  }
}

# Deploy
firebase deploy --only hosting
```

## Verificar Resultado

Após deploy, acesse:
- https://laboratorio-evcs.web.app

O sistema deve carregar as calculadoras e interface completa.

## Debug no Navegador

Se ainda estiver em branco:
1. Pressionar F12
2. Aba Console - ver erros
3. Aba Network - ver se arquivos carregam
4. Aba Sources - verificar se main.js existe

O problema principal é o build complexo. A solução simplificada deve resolver.