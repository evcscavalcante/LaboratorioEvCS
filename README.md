# Laboratório Ev.C.S - Sistema Geotécnico

Sistema web especializado para cálculos geotécnicos de densidade do solo seguindo normas ABNT.

## Funcionalidades

### Calculadoras Geotécnicas
- **Densidade In Situ (NBR 9813)**: Determinação da densidade do solo em campo
- **Densidade Real (Picnômetro)**: Densidade real dos grãos pelo método do picnômetro
- **Densidade Máxima e Mínima**: Índices de vazios para análise de compacidade

### Sistema de Autenticação
- Login Google via Firebase
- Autenticação email/senha
- Modo demonstração para testes

### Geração de Relatórios
- PDFs técnicos profissionais
- Cálculos automáticos conforme ABNT
- Validação de resultados

## Configuração do Ambiente

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta Firebase (para autenticação)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/evcscavalcante/LaboratorioEvCS.git
cd LaboratorioEvCS

# Instale dependências
npm install --legacy-peer-deps

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais Firebase

# Execute em desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Configuração Firebase

1. Crie projeto no Firebase Console
2. Habilite Authentication (Google + Email/Senha)
3. Configure domínios autorizados
4. Adicione credenciais ao .env:

```
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_APP_ID=seu_app_id
```

## Deploy

### Firebase Hosting
```bash
firebase login
firebase init hosting
firebase deploy
```

### Outros Provedores
O sistema é compatível com Vercel, Netlify e outros hosts estáticos.

## Estrutura do Projeto

```
├── client/          # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── pages/       # Páginas da aplicação
│   │   ├── lib/         # Utilitários e configurações
│   │   └── contexts/    # Contextos React
├── server/          # Backend Express
│   ├── routes.ts    # Rotas da API
│   ├── storage.ts   # Camada de dados
│   └── index.ts     # Servidor principal
├── shared/          # Tipos e schemas compartilhados
│   └── schema.ts    # Definições TypeScript
└── dist/            # Build de produção
```

## Testes

```bash
# Executar testes unitários
npm test

# Testes de integração
npm run test:integration

# Coverage
npm run test:coverage
```

## Contribuição

1. Fork o projeto
2. Crie branch para feature (`git checkout -b feature/nova-calculadora`)
3. Commit mudanças (`git commit -m 'Add: nova calculadora'`)
4. Push para branch (`git push origin feature/nova-calculadora`)
5. Abra Pull Request

## Licença

MIT License - veja LICENSE.md para detalhes.

## Suporte

Para suporte técnico:
- Issues: https://github.com/evcscavalcante/LaboratorioEvCS/issues
- Email: suporte@laboratorio-evcs.com

## Normas Técnicas

Sistema desenvolvido seguindo:
- NBR 9813 - Densidade in situ
- NBR 6508 - Densidade real dos grãos
- NBR 12004 - Densidade máxima e mínima