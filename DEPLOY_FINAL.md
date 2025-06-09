# Deploy Firebase - Laboratório Ev.C.S

## 🚀 Sistema Pronto para Deploy

O sistema está completamente funcional e configurado:
- ✅ Todas as calculadoras geotécnicas
- ✅ Sistema administrativo completo
- ✅ Manuais integrados na interface
- ✅ Banco PostgreSQL configurado
- ✅ Autenticação Firebase

## 📋 Passos para Deploy

### 1. Login no Firebase
```bash
firebase login
```

### 2. Build do Projeto
```bash
npm run build
```

### 3. Deploy no Firebase
```bash
firebase deploy --only hosting
```

## 🌐 URLs após Deploy

**Site principal**: https://laboratorio-evcs.web.app
**Alternativo**: https://laboratorio-evcs.firebaseapp.com

## 📂 Estrutura do Sistema

### Páginas Principais
- `/` - Dashboard principal
- `/solos/densidade-in-situ` - Calculadora NBR 9813
- `/solos/densidade-real` - Densidade real (picnômetro)
- `/solos/densidade-max-min` - Densidade máx/mín
- `/admin` - Painel administrativo
- `/help/manual-usuario` - Manual do usuário
- `/help/manual-admin` - Manual administrativo

### Funcionalidades Implementadas
- **Calculadoras**: 3 calculadoras completas com validação ABNT
- **PDFs**: Geração automática de relatórios profissionais
- **Usuários**: Sistema completo de gerenciamento
- **Organizações**: Controle por empresa/laboratório
- **Sincronização**: Funcionamento offline/online
- **Manuais**: Documentação integrada na interface

## 🔧 Configurações Firebase

### Autenticação
- Google Sign-in configurado
- Controle de acesso por níveis

### Hosting
- Projeto: laboratorio-evcs
- Pasta build: dist/
- Redirecionamento SPA configurado

### Firestore
- Backup automático de dados
- Sincronização em tempo real

## 📊 Sistema Administrativo

### Acesso Admin
1. Login com conta Google
2. Menu: Administração > Painel Admin
3. Gerenciar usuários e organizações

### Níveis de Usuário
- **Administrador**: Acesso total
- **Gerente**: Gerencia organização
- **Supervisor**: Supervisiona técnicos
- **Técnico**: Realiza ensaios
- **Visualizador**: Consulta apenas

## 📱 Acesso aos Manuais

Após o deploy, os manuais estarão disponíveis em:
- Menu lateral > Ajuda > Manual do Usuário
- Menu lateral > Ajuda > Manual Administrativo

## ⚡ Deploy Rápido (Resumo)

```bash
# 1. Login
firebase login

# 2. Build
npm run build

# 3. Deploy
firebase deploy --only hosting
```

**Tempo estimado**: 5-10 minutos

O sistema estará online e funcionando em:
https://laboratorio-evcs.web.app