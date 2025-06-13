# Sistema de Gestão de Laboratório Geotécnico

Um sistema completo para gestão de ensaios geotécnicos com interface React moderna e backend Express robusto.

## 🏗️ Arquitetura

### Frontend
- **React 18** com TypeScript
- **Tailwind CSS** + Shadcn/UI para interface
- **React Query** para gerenciamento de estado
- **Wouter** para roteamento
- **React PDF** para geração de relatórios

### Backend
- **Express.js** com TypeScript
- **PostgreSQL** via Neon Database
- **Drizzle ORM** para consultas
- **Firebase Authentication** para autenticação

### Sincronização Tripla
- **IndexedDB** (local)
- **PostgreSQL** (backend)
- **Firebase Firestore** (tempo real)

## 🚀 Funcionalidades

### Ensaios Implementados
- **Densidade In Situ** (NBR 9813:2016)
- **Densidade Real** (NBR 6508:1984)
- **Densidade Máxima/Mínima** (NBR 12004:1990)

### Gestão de Equipamentos
- Cadastro com variações específicas
- Categorização automática
- Controle de calibração

### Geração de PDFs
- Layout profissional otimizado
- Estrutura seguindo normas técnicas
- Cálculos automáticos validados

## 📊 Fluxo de Dados

```mermaid
graph TD
    A[Frontend React] --> B[IndexedDB Local]
    A --> C[Firebase Auth]
    A --> D[Express Backend]
    D --> E[PostgreSQL]
    C --> F[Firestore]
    B --> G[Sincronização]
    E --> G
    F --> G
```

## 🧪 Testes

### Configuração
- **Jest** para testes unitários
- **React Testing Library** para componentes
- **Firebase Emulator** para testes de integração

### Cobertura
- Serviços de cálculo: 100%
- Componentes React: 85%
- Integração E2E: 70%

### Executar Testes
```bash
# Todos os testes
npm test

# Com cobertura
npm run test:coverage

# Modo watch
npm run test:watch

# Acessibilidade
npm run test:a11y
```

## 🔒 Segurança

### Autenticação
- Firebase Authentication (frontend)
- JWT tokens para API
- Controle de acesso por função

### Validação
- Validação no frontend e backend
- Sanitização de inputs
- Rate limiting configurado

## 📱 Acessibilidade

### Conformidade WCAG 2.1
- Contraste adequado (AA)
- Navegação por teclado
- Leitores de tela
- Labels descritivos

### Ferramentas
- **axe-core** para auditoria
- **ESLint jsx-a11y** para validação
- Testes automatizados de acessibilidade

## 🛠️ Desenvolvimento

### Pré-requisitos
- Node.js 20+
- PostgreSQL
- Firebase project

### Configuração Local
```bash
# Instalar dependências
npm install

# Configurar banco
npm run db:push

# Iniciar desenvolvimento
npm run dev
```

### Scripts Disponíveis
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run test         # Executar testes
npm run lint         # Verificar código
npm run type-check   # Verificar TypeScript
```

## 📋 API Endpoints

### Autenticação
```
POST /api/auth/sync-user     # Sincronizar usuário Firebase
GET  /api/auth/user          # Dados do usuário atual
POST /api/auth/logout        # Logout
```

### Ensaios
```
GET    /api/tests/density-in-situ     # Listar ensaios
POST   /api/tests/density-in-situ     # Criar ensaio
PUT    /api/tests/density-in-situ/:id # Atualizar ensaio
DELETE /api/tests/density-in-situ/:id # Excluir ensaio
```

### Equipamentos
```
GET    /api/equipamentos     # Listar equipamentos
POST   /api/equipamentos     # Criar equipamento
DELETE /api/equipamentos/:id # Excluir equipamento
```

## 🔧 Configuração de Ambiente

### Variáveis Necessárias
```env
# Firebase
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_APP_ID=your-app-id
FIREBASE_TOKEN=your-admin-token

# Database
DATABASE_URL=postgresql://user:pass@host:port/db
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=password
PGDATABASE=geotechlab
```

## 📈 Monitoramento

### Métricas
- Performance de cálculos
- Tempo de resposta da API
- Taxa de erro de sincronização
- Uso de recursos

### Logs
- Estruturados em JSON
- Níveis: ERROR, WARN, INFO, DEBUG
- Integração com ferramentas de monitoramento

## 🚀 Deploy

### CI/CD Pipeline
1. **Lint & Type Check**
2. **Testes Unitários**
3. **Testes de Acessibilidade** 
4. **Security Scan**
5. **Build & Deploy**

### Ambientes
- **Development**: Auto-deploy em PRs
- **Staging**: Deploy em merge para develop
- **Production**: Deploy manual em main

## 🤝 Contribuição

### Padrões de Código
- ESLint + Prettier configurados
- Conventional Commits
- TypeScript strict mode
- 100% de cobertura em serviços críticos

### Processo
1. Fork do repositório
2. Branch feature/fix
3. Implementação + testes
4. Pull Request
5. Code Review
6. Merge

## 📚 Documentação Técnica

### Serviços de Cálculo
- [Densidade In Situ](./calculations/density-in-situ.md)
- [Densidade Real](./calculations/real-density.md)
- [Densidade Máx/Mín](./calculations/max-min-density.md)

### Arquitetura
- [Sincronização de Dados](./architecture/data-sync.md)
- [Autenticação Híbrida](./architecture/auth.md)
- [Geração de PDFs](./architecture/pdf-generation.md)

## 🐛 Troubleshooting

### Problemas Comuns
- **Erro de conexão**: Verificar DATABASE_URL
- **Auth falha**: Verificar tokens Firebase
- **Sync lento**: Verificar conexão de rede

### Logs Úteis
```bash
# Logs do servidor
tail -f logs/server.log

# Logs do banco
tail -f logs/database.log

# Logs de sync
tail -f logs/sync.log
```

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

**Última atualização**: Dezembro 2024
**Versão**: 1.0.0
**Autor**: Laboratório Ev.C.S