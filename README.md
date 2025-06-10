# Laboratório Ev.C.S - Sistema Geotécnico Profissional

Sistema web completo para laboratórios geotécnicos que automatiza cálculos de densidade do solo, gera relatórios técnicos profissionais e gerencia usuários com controle de acesso hierárquico.

## 🚀 Funcionalidades

### Calculadoras Geotécnicas
- **Densidade In Situ** (NBR 9813): Cálculos automáticos com validação ABNT
- **Densidade Real** (Picnômetro): Determinação precisa com controle de temperatura  
- **Densidade Máxima e Mínima**: Índices de vazios e compacidade relativa

### Sistema Administrativo
- Dashboard com estatísticas em tempo real
- Gerenciamento completo de usuários e organizações
- Controle de permissões por níveis hierárquicos
- Monitoramento de atividades do laboratório

### Relatórios Profissionais
- Geração automática de PDFs seguindo normas ABNT
- Formatação técnica padrão laboratorial
- Logo personalizado por organização
- Dados reais dos ensaios (não valores simulados)

### Recursos Avançados
- Sincronização automática offline/online
- Autenticação segura via Google
- Interface responsiva (desktop, tablet, mobile)
- Manuais integrados na aplicação
- Backup automático na nuvem

## 🏗️ Tecnologias

### Frontend
- React 18 com TypeScript
- Vite para build otimizado
- Tailwind CSS + shadcn/ui para interface moderna
- React Query para gerenciamento de estado
- Wouter para roteamento

### Backend
- Express.js com TypeScript
- PostgreSQL com Drizzle ORM
- Firebase para autenticação e storage
- Zod para validação de dados

### Deploy
- Firebase Hosting para frontend
- PostgreSQL para banco de dados
- Configuração para ambiente de produção

## 📦 Instalação

### Pré-requisitos
- Node.js 20+
- PostgreSQL
- Conta Firebase

### Configuração Local
```bash
# Clone o repositório
git clone https://github.com/evcscavalcante/LaboratorioEvCS.git
cd LaboratorioEvCS

# Instale dependências
npm install

# Configure variáveis de ambiente
# DATABASE_URL=sua_url_postgresql
# FIREBASE_CONFIG=sua_config_firebase

# Execute em desenvolvimento
npm run dev
```

### Build para Produção
```bash
# Build do projeto
npm run build

# Deploy no Firebase
firebase deploy --only hosting
```

### Deploy Automático (GitHub Actions)
Este repositório possui o workflow [`firebase-deploy.yml`](.github/workflows/firebase-deploy.yml)
que realiza o build e publica no Firebase sempre que houver push na branch `main`.
Para funcionar, adicione a chave de serviço do Firebase como secret
`FIREBASE_SERVICE_ACCOUNT` no GitHub.

### Deploy para GitHub Pages
Também é possível publicar os arquivos estáticos no GitHub Pages.
Utilize o workflow [`github-pages.yml`](.github/workflows/github-pages.yml),
que envia o conteúdo de `dist/public` para a branch `gh-pages`.
Habilite o GitHub Pages apontando para essa branch nas configurações do repositório.

## 🌐 URLs de Produção

- **Site Principal**: https://laboratorio-evcs.web.app
- **Alternativo**: https://laboratorio-evcs.firebaseapp.com

## 👥 Sistema de Usuários

Para acessar o sistema utilize a tela de login em `/login`, onde é possível realizar o login, criar uma nova conta e recuperar a senha.

### Níveis de Acesso
- **Administrador**: Acesso total ao sistema
- **Gerente**: Gerencia sua organização completa
- **Supervisor**: Supervisiona técnicos e valida ensaios
- **Técnico**: Realiza ensaios e gera relatórios
- **Visualizador**: Consulta dados apenas

### Estrutura Organizacional
```
Administrador
├── Gerente (Por laboratório)
│   ├── Supervisor (Por equipe)
│   │   ├── Técnico (Operacional)
│   │   └── Técnico (Operacional)
│   └── Visualizador (Consultores)
```

## 📊 Fluxo de Trabalho

### Para Técnicos
1. Login com conta Google
2. Selecionar calculadora apropriada
3. Preencher dados do ensaio
4. Sistema calcula automaticamente
5. Gerar PDF profissional
6. Dados salvos automaticamente

### Para Administradores
1. Acessar painel administrativo
2. Gerenciar usuários e organizações
3. Monitorar atividades do laboratório
4. Configurar permissões de acesso

## 📚 Documentação

### Manuais Integrados
- **Manual do Usuário**: Acessível via menu "Ajuda" na aplicação
- **Manual Administrativo**: Guia completo de gerenciamento
- **Guia de Treinamento**: Como treinar equipes em 30 minutos

### Arquivos de Documentação
- `MANUAL_COMPLETO.md`: Manual completo do sistema
- `MANUAL_ADMINISTRADOR.md`: Gestão e administração
- `GUIA_TREINAMENTO.md`: Treinamento de usuários
- `RESUMO_EXECUTIVO.md`: Visão geral do projeto

## 🔧 Configuração Firebase

### Autenticação
- Google Sign-in habilitado
- Controle de acesso por usuário
- Backup automático de sessões

### Hosting
- Projeto: `laboratorio-evcs`
- Configuração SPA com redirecionamentos
- Cache otimizado para performance

### Firestore
- Sincronização automática de dados
- Funcionamento offline
- Backup incremental

## 💡 Recursos Técnicos

### Validações ABNT
- Critérios automáticos de aprovação/reprovação
- Cálculos seguindo normas técnicas
- Verificação de dados obrigatórios

### Performance
- Build otimizado com Vite
- Lazy loading de componentes
- Cache inteligente de dados

### Segurança
- Autenticação via Firebase
- Dados criptografados em transmissão
- Controle granular de permissões

## 🚀 Deploy

### Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

### Variáveis de Ambiente
```env
DATABASE_URL=postgresql://...
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

## 📈 Benefícios

### Operacionais
- Redução de 70% no tempo de cálculo
- Eliminação de erros manuais
- Padronização de relatórios
- Rastreabilidade completa

### Técnicos
- Conformidade automática com ABNT
- Cálculos validados e precisos
- Backup seguro na nuvem
- Acesso multiplataforma

### Gerenciais
- Controle total de usuários
- Visibilidade da produtividade
- Relatórios profissionais instantâneos
- Escalabilidade para crescimento

## 🤝 Contribuição

Para contribuir com o projeto:
1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é proprietário e desenvolvido para uso em laboratórios geotécnicos.

## 📞 Suporte

Para suporte técnico ou dúvidas sobre implementação, consulte os manuais integrados na aplicação ou a documentação completa no repositório.

---

**Laboratório Ev.C.S** - Sistema Geotécnico Profissional  
*Desenvolvido seguindo normas ABNT para excelência técnica*