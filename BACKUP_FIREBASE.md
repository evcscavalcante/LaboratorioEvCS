# ⚠️ ATENÇÃO: Backup Firebase

## Status Atual
- Projeto Firebase: `laboratorio-evcs`
- O deploy SOBRESCREVERÁ qualquer site existente

## Antes do Deploy (IMPORTANTE)

### 1. Verificar se existe site atual
```bash
# Verificar se há um site ativo
firebase hosting:sites:list
```

### 2. Fazer backup do site atual (se existir)
```bash
# Baixar o site atual
mkdir backup-site-atual
cd backup-site-atual
# Use o console Firebase para baixar os arquivos manualmente
```

### 3. Opções disponíveis:

#### Opção A: Criar novo projeto Firebase
```bash
# Criar novo projeto para não sobrescrever
firebase projects:create laboratorio-evcs-novo
firebase use laboratorio-evcs-novo
```

#### Opção B: Usar site secundário no mesmo projeto
```bash
# Criar site adicional no mesmo projeto
firebase hosting:sites:create laboratorio-evcs-v2 --project laboratorio-evcs
```

#### Opção C: Sobrescrever o site atual
```bash
# Usar o projeto atual (SOBRESCREVERÁ tudo)
firebase use laboratorio-evcs
```

## Deploy Seguro

### 1. Build do projeto
```bash
npm run build
```

### 2. Deploy
```bash
firebase deploy --only hosting
```

### 3. URLs resultantes
- **Site principal**: https://laboratorio-evcs.web.app
- **Alternativa**: https://laboratorio-evcs.firebaseapp.com

## Reversão (se necessário)
- Mantenha backup dos arquivos antigos
- Use `firebase hosting:rollback` se disponível
- Ou restaure manualmente os arquivos anteriores

## Recomendação
**VERIFIQUE** se existe conteúdo importante no projeto `laboratorio-evcs` antes de fazer o deploy!