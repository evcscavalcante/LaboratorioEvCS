# Deploy Final - Comandos Necessários

Execute na pasta do projeto baixado:

## 1. Login no Firebase
```bash
firebase login
```

## 2. Deploy do Sistema
```bash
firebase deploy --only hosting
```

## Configuração Atual
- ✅ Arquivo `dist/index.html` atualizado com credenciais corretas
- ✅ Sistema completo com 3 calculadoras geotécnicas  
- ✅ Autenticação Firebase configurada
- ✅ Interface profissional responsiva

## Sistema Inclui:
1. **Densidade In Situ (NBR 9813)**
   - Cálculo densidade úmida e seca
   - Validação automática ABNT
   
2. **Densidade Real (Picnômetro)**  
   - Método picnômetro completo
   - Correção por temperatura
   
3. **Densidade Máxima e Mínima**
   - Índices de vazios máximo/mínimo
   - Análise de compacidade

Após o deploy, acesse: https://laboratorio-evcs.web.app