# Configuração Firebase para Single Page Application (React)

## Problema Identificado
O projeto React precisa de configuração específica para SPA no Firebase Hosting.

## Configuração Correta

### 1. firebase.json para React SPA
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
    ],
    "headers": [
      {
        "source": "**/*.@(eot|otf|ttf|ttc|woff|font.css)",
        "headers": [
          {
            "key": "Access-Control-Allow-Origin",
            "value": "*"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=604800"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=604800"
          }
        ]
      }
    ]
  }
}
```

### 2. Build de Produção Correto
```bash
# Instalar dependências
npm install

# Build para produção
npm run build

# O Vite vai criar dist/ com:
# - index.html
# - assets/index-[hash].js
# - assets/index-[hash].css
```

### 3. Verificar Estrutura dist/
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [outros assets]
└── favicon.ico
```

### 4. Deploy
```bash
firebase deploy --only hosting
```

## Comandos Específicos para o Projeto

```bash
# Na pasta do projeto React
npm install --legacy-peer-deps
npm run build
firebase deploy --only hosting
```

O `--legacy-peer-deps` resolve conflitos de dependências que podem impedir o build.