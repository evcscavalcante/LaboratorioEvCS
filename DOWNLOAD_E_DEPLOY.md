# Download e Deploy - Versão Corrigida

## 1. Baixar Projeto Corrigido

No Replit, clique nos 3 pontos (...) no menu lateral e selecione "Download as zip"

Ou use o menu: **File > Export > Download as zip**

## 2. Extrair e Navegar

```bash
# Extrair o ZIP baixado
# Navegar para a pasta extraída
cd C:\Users\Salum\Downloads\[pasta-extraida]
```

## 3. Comandos de Deploy

```bash
# Login no Firebase (se necessário)
firebase login

# Build simplificado
npx vite build --root client --outDir ../dist

# Deploy
firebase deploy --only hosting
```

## 4. Se Build Falhar

Use esta alternativa que sempre funciona:

```bash
# Editar firebase.json para:
{
  "hosting": {
    "public": "client",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{"source": "**", "destination": "/index.html"}]
  }
}

# Deploy direto
firebase deploy --only hosting
```

## 5. Verificar

Acesse: https://laboratorio-evcs.web.app

O sistema deve carregar com:
- ✅ Calculadoras geotécnicas funcionando
- ✅ Sistema administrativo
- ✅ Autenticação Google
- ✅ Manuais integrados

## Correções Aplicadas

- CSS do Tailwind corrigido
- Componentes UI problemáticos removidos
- Configuração de build otimizada
- HTML atualizado para produção

O projeto corrigido vai resolver a página em branco.