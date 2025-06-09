# Manual Completo - Laboratório Ev.C.S
## Sistema Geotécnico Profissional

---

## 📚 ÍNDICE
1. [Visão Geral](#visão-geral)
2. [Acesso ao Sistema](#acesso-ao-sistema)
3. [Calculadoras Geotécnicas](#calculadoras-geotécnicas)
4. [Sistema Administrativo](#sistema-administrativo)
5. [Gerenciamento de Usuários](#gerenciamento-de-usuários)
6. [Relatórios e PDFs](#relatórios-e-pdfs)
7. [Sincronização de Dados](#sincronização-de-dados)
8. [Suporte Técnico](#suporte-técnico)

---

## 1. VISÃO GERAL

### O que é o Laboratório Ev.C.S?
Sistema web completo para laboratórios geotécnicos que automatiza:
- Cálculos de densidade do solo
- Geração de relatórios técnicos em PDF
- Gerenciamento de usuários e organizações
- Sincronização automática de dados

### Principais Recursos
✅ **3 Calculadoras Profissionais**: Densidade In Situ, Real e Máx/Mín  
✅ **Relatórios ABNT**: PDFs automáticos seguindo normas técnicas  
✅ **Sistema Multi-usuário**: Controle de acesso por níveis  
✅ **Funciona Offline**: Dados salvos localmente  
✅ **Interface Responsiva**: Desktop, tablet e mobile  

---

## 2. ACESSO AO SISTEMA

### 2.1 Login Inicial
1. Acesse: `https://laboratorio-evcs.web.app`
2. Clique em "Entrar com Google"
3. Autorize o acesso com sua conta Google

### 2.2 Níveis de Usuário
- **👑 Administrador**: Acesso total ao sistema
- **🏢 Gerente**: Gerencia sua organização
- **👨‍💼 Supervisor**: Supervisiona técnicos
- **🔬 Técnico**: Realiza ensaios e cálculos
- **👁️ Visualizador**: Apenas visualiza dados

### 2.3 Primeira Configuração
- Ao fazer login, você será associado automaticamente
- Administradores podem alterar seu nível de acesso
- Configure sua organização no painel administrativo

---

## 3. CALCULADORAS GEOTÉCNICAS

### 3.1 Densidade In Situ (NBR 9813)

**Onde encontrar**: Menu > Solos > Densidade In Situ

**Campos obrigatórios**:
- Data do ensaio
- Número de registro
- Operador responsável
- Material analisado

**Dados do ensaio**:
- Massa úmida topo/base (g)
- Volume cilindro topo/base (cm³)
- Temperatura da água (°C)

**Determinação de umidade** (3 amostras mínimo):
- Massa cápsula + solo úmido (g)
- Massa cápsula + solo seco (g)
- Massa da cápsula (g)

**Resultado automático**:
- Densidade aparente seca
- Índice de vazios
- Grau de compactação
- Status: APROVADO/REPROVADO (baseado em critérios ABNT)

### 3.2 Densidade Real (Picnômetro)

**Onde encontrar**: Menu > Solos > Densidade Real

**Dados necessários**:
- Informações básicas do ensaio
- Massa solo seco (g)
- Volume picnômetro (ml)
- Temperatura ensaio (°C)

**Determinação umidade**:
- Dados de 3 amostras para precisão
- Cálculo automático da média

**Resultado**:
- Densidade real dos grãos
- Diferença entre determinações
- Validação conforme norma

### 3.3 Densidade Máxima e Mínima

**Onde encontrar**: Menu > Solos > Densidade Máx/Mín

**Ensaio densidade máxima**:
- Massa solo + molde (g)
- Massa molde (g)
- Volume molde (cm³)

**Ensaio densidade mínima**:
- Altura solo no molde (cm)
- Dados de umidade

**Cálculos automáticos**:
- Densidade máxima/mínima
- Índices de vazios extremos
- Compacidade relativa

---

## 4. SISTEMA ADMINISTRATIVO

### 4.1 Acesso Admin
**Onde encontrar**: Menu > Administração > Painel Admin

**Funcionalidades**:
- Dashboard com estatísticas
- Visão geral do sistema
- Ações rápidas
- Monitoramento de atividades

### 4.2 Gerenciamento de Organizações
**Onde encontrar**: Administração > Organizações

**Como criar organização**:
1. Clique "Nova Organização"
2. Preencha:
   - Nome da organização
   - Descrição
   - Endereço completo
   - Telefone
   - Email
3. Marque como "Ativa"
4. Clique "Criar Organização"

**Editar organização**:
1. Localize a organização no painel
2. Clique "Editar"
3. Modifique os dados necessários
4. Salve as alterações

**Excluir organização**:
⚠️ **Atenção**: Só é possível excluir organizações sem usuários vinculados

---

## 5. GERENCIAMENTO DE USUÁRIOS

### 5.1 Criar Novo Usuário
**Onde encontrar**: Administração > Usuários

**Passo a passo**:
1. Clique "Novo Usuário"
2. Preencha:
   - Nome completo
   - Email válido
   - Perfil de acesso (Admin, Gerente, etc.)
   - Organização (opcional)
3. Defina se estará ativo
4. Clique "Criar Usuário"

### 5.2 Editar Usuário
1. Localize usuário na lista
2. Clique no ícone "Editar"
3. Modifique:
   - Dados pessoais
   - Nível de acesso
   - Organização vinculada
   - Status (ativo/inativo)
4. Salve alterações

### 5.3 Controle de Permissões

**Administrador**:
- Acesso total ao sistema
- Gerencia todos usuários
- Configura organizações
- Visualiza todos os dados

**Gerente**:
- Gerencia usuários de sua organização
- Acessa todos ensaios da organização
- Gera relatórios completos

**Supervisor**:
- Supervisiona técnicos
- Valida ensaios
- Aprova/reprova resultados

**Técnico**:
- Realiza ensaios
- Preenche calculadoras
- Gera relatórios básicos

**Visualizador**:
- Apenas consulta dados
- Não pode modificar
- Acesso limitado

---

## 6. RELATÓRIOS E PDFs

### 6.1 Geração Automática
- **Quando**: Após completar qualquer ensaio
- **Localização**: Botão "Gerar PDF" em cada calculadora
- **Formato**: PDF profissional seguindo normas ABNT

### 6.2 Conteúdo dos Relatórios

**Cabeçalho**:
- Logo da organização
- Dados do laboratório
- Número do ensaio
- Data e responsáveis

**Corpo do relatório**:
- Dados do ensaio
- Cálculos detalhados
- Resultados obtidos
- Gráficos (quando aplicável)

**Conclusão**:
- Status do ensaio
- Observações técnicas
- Assinaturas digitais

### 6.3 Personalização
- Logotipo personalizado por organização
- Dados específicos do laboratório
- Campos adicionais conforme necessidade

---

## 7. SINCRONIZAÇÃO DE DADOS

### 7.1 Como Funciona
- **Online**: Dados salvos automaticamente na nuvem
- **Offline**: Dados salvos localmente no dispositivo
- **Sincronização**: Automática quando volta a conexão

### 7.2 Indicadores Visuais
- 🟢 **Verde**: Dados sincronizados
- 🟡 **Amarelo**: Sincronizando
- 🔴 **Vermelho**: Problema de conexão
- 📱 **Offline**: Funcionando sem internet

### 7.3 Backup e Segurança
- Backup automático na nuvem (Firebase)
- Dados criptografados
- Acesso controlado por usuário
- Histórico de alterações

---

## 8. SUPORTE TÉCNICO

### 8.1 Problemas Comuns

**Não consigo fazer login**:
- Verifique conexão com internet
- Use conta Google válida
- Limpe cache do navegador

**Dados não aparecem**:
- Aguarde sincronização
- Verifique indicador de status
- Recarregue a página (F5)

**PDF não gera**:
- Preencha todos campos obrigatórios
- Verifique se ensaio está completo
- Tente em outro navegador

**Erro de permissão**:
- Verifique seu nível de acesso
- Contate administrador
- Confirme organização correta

### 8.2 Requisitos do Sistema

**Navegadores suportados**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Dispositivos**:
- Desktop/Laptop
- Tablets (iPad, Android)
- Smartphones (iOS, Android)

**Conexão**:
- Internet para sincronização
- Funciona offline para uso local

### 8.3 Contato para Suporte

**Para administradores**:
1. Acesse painel administrativo
2. Monitore logs de erro
3. Verifique status dos usuários
4. Configure organizações

**Para usuários**:
1. Contate seu administrador
2. Verifique manual de uso
3. Reporte problemas específicos

---

## 9. MELHORES PRÁTICAS

### 9.1 Para Administradores
- Mantenha usuários organizados por função
- Configure organizações antes de criar usuários
- Monitore regularmente o painel administrativo
- Faça backup periódico dos dados

### 9.2 Para Técnicos
- Preencha todos os campos obrigatórios
- Confira dados antes de salvar
- Gere PDFs após cada ensaio
- Mantenha dados organizados por projeto

### 9.3 Para Gerentes
- Supervisione trabalho da equipe
- Valide relatórios importantes
- Configure permissões adequadas
- Monitore produtividade

---

## 10. ATUALIZAÇÕES E NOVIDADES

### Funcionalidades Futuras
- Módulo de Asfalto
- Módulo de Concreto
- Relatórios estatísticos avançados
- Integração com equipamentos

### Versionamento
- Atualizações automáticas
- Backup antes de atualizações
- Changelog disponível
- Rollback se necessário

---

**© 2024 Laboratório Ev.C.S - Sistema Geotécnico Profissional**  
*Desenvolvido seguindo normas ABNT para excelência técnica*