# Deploy GitHub - Laboratório Ev.C.S

## 🔄 Substituir Repositório Existente

Para substituir o projeto no GitHub: https://github.com/evcscavalcante/LaboratorioEvCS.git

## 📋 Passos para Deploy

### 1. Clone o Repositório Atual (Backup)
```bash
git clone https://github.com/evcscavalcante/LaboratorioEvCS.git backup-old
```

### 2. Prepare o Novo Projeto
```bash
# Baixar todos os arquivos do projeto atual para uma pasta local
# Copiar todos os arquivos do Replit para pasta local
```

### 3. Configurar Git
```bash
git init
git remote add origin https://github.com/evcscavalcante/LaboratorioEvCS.git
```

### 4. Adicionar Arquivos
```bash
git add .
git commit -m "Sistema Laboratório Ev.C.S - Versão Completa

✅ Calculadoras geotécnicas (Densidade In Situ, Real, Máx/Mín)
✅ Sistema administrativo completo
✅ Manuais integrados na interface
✅ Geração automática de PDFs
✅ Sincronização offline/online
✅ Autenticação Firebase
✅ Banco PostgreSQL configurado
✅ Documentação completa"
```

### 5. Push Forçado (Substitui Tudo)
```bash
git push -f origin main
```

## 📁 Arquivos Principais a Incluir

### Frontend
- `client/` - Aplicação React completa
- `components/` - Componentes UI
- `pages/` - Páginas da aplicação
- `lib/` - Bibliotecas e utilitários

### Backend
- `server/` - API Express
- `shared/` - Esquemas compartilhados
- `drizzle.config.ts` - Configuração banco

### Configuração
- `package.json` - Dependências
- `vite.config.ts` - Build
- `tailwind.config.ts` - Estilos
- `firebase.json` - Deploy Firebase
- `.firebaserc` - Projeto Firebase

### Documentação
- `MANUAL_COMPLETO.md` - Manual completo
- `MANUAL_ADMINISTRADOR.md` - Manual admin
- `GUIA_TREINAMENTO.md` - Guia treinamento
- `RESUMO_EXECUTIVO.md` - Resumo do projeto
- `DEPLOY_FIREBASE.md` - Instruções Firebase
- `README.md` - Documentação projeto

## 🚀 Alternativa: Deploy Direto do Replit

### Via Replit Git
1. Conectar Replit ao GitHub
2. Usar integração Git do Replit
3. Push automático para repositório

### Via Download/Upload
1. Baixar projeto completo do Replit
2. Fazer upload para repositório GitHub
3. Substituir todos os arquivos

## 📊 Estrutura Final no GitHub

```
LaboratorioEvCS/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── contexts/
│   └── index.html
├── server/                 # Backend Express
│   ├── index.ts
│   ├── routes.ts
│   └── storage.ts
├── shared/                 # Esquemas compartilhados
│   └── schema.ts
├── docs/                   # Documentação
│   ├── MANUAL_COMPLETO.md
│   ├── MANUAL_ADMINISTRADOR.md
│   └── GUIA_TREINAMENTO.md
├── package.json
├── firebase.json
├── vite.config.ts
└── README.md
```

## 📝 README.md Sugerido

```markdown
# Laboratório Ev.C.S - Sistema Geotécnico

Sistema web completo para laboratórios geotécnicos com calculadoras automáticas, geração de relatórios PDF e gerenciamento de usuários.

## Funcionalidades

- 3 Calculadoras geotécnicas seguindo normas ABNT
- Sistema administrativo completo
- Geração automática de PDFs profissionais
- Sincronização offline/online
- Manuais integrados na interface

## Deploy

### Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

### Desenvolvimento
```bash
npm install
npm run dev
```

## URLs
- **Produção**: https://laboratorio-evcs.web.app
- **Repositório**: https://github.com/evcscavalcante/LaboratorioEvCS.git
```

## ⚡ Resultado Final

Após o push, o repositório GitHub terá:
- ✅ Código fonte completo
- ✅ Documentação detalhada
- ✅ Instruções de deploy
- ✅ Sistema funcional
- ✅ Manuais integrados

O projeto estará pronto para clonagem e deploy em qualquer ambiente.