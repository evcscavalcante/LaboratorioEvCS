# Deploy Firebase - Comandos Corretos para React SPA

## Configuração Correta (Seguindo Documentação Firebase)

Na pasta do projeto, execute:

```bash
# 1. Instalar dependências (evitar conflitos)
npm install --legacy-peer-deps

# 2. Build otimizado para produção
npm run build -- --mode production

# 3. Verificar se criou dist/
ls dist/

# 4. Deploy
firebase deploy --only hosting
```

## Se Build Falhar - Alternativa Simples

```bash
# 1. Usar pasta de desenvolvimento
# Editar firebase.json:
{
  "hosting": {
    "public": "client",
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}

# 2. Deploy direto
firebase deploy --only hosting
```

## Verificação Final

Após deploy, teste:
- https://laboratorio-evcs.web.app
- Abrir F12 → Console para ver erros
- Verificar se carrega interface React

A configuração está correta para SPA React. O problema está no build das dependências.