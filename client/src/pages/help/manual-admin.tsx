import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Users, 
  Building, 
  Settings, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  Monitor,
  Database,
  Clock
} from 'lucide-react';

export default function ManualAdmin() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Shield className="h-8 w-8" />
          Manual do Administrador
        </h1>
        <p className="text-muted-foreground">
          Gerenciamento completo do sistema Laboratório Ev.C.S
        </p>
      </div>

      {/* Acesso Administrativo */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Acesso Administrativo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">Como Acessar:</h5>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Login no sistema</li>
                <li>Menu: <strong>Administração > Painel Admin</strong></li>
                <li>Visão geral com estatísticas</li>
                <li>Acesso a todas as funcionalidades</li>
              </ol>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Primeiros Passos:</h5>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Configure organizações</li>
                <li>Defina hierarquia de usuários</li>
                <li>Teste funcionalidades</li>
                <li>Monitore atividades</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gerenciamento de Usuários */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gerenciamento de Usuários
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div>
            <h4 className="font-semibold mb-3">Criação de Usuários</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium mb-2">Fluxo Recomendado:</h5>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>Administração > Usuários > "Novo Usuário"</li>
                  <li>Nome completo real</li>
                  <li>Email de trabalho válido</li>
                  <li>Perfil baseado na função</li>
                </ol>
              </div>
              
              <div>
                <h5 className="font-medium mb-2">Perfis Disponíveis:</h5>
                <div className="space-y-2">
                  <div><Badge variant="destructive">Administrador</Badge> - Gestores do sistema</div>
                  <div><Badge variant="default">Gerente</Badge> - Coordenadores de laboratório</div>
                  <div><Badge variant="secondary">Supervisor</Badge> - Responsáveis técnicos</div>
                  <div><Badge variant="outline">Técnico</Badge> - Operadores de ensaios</div>
                  <div><Badge variant="outline">Visualizador</Badge> - Consultores externos</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3">Estrutura Hierárquica</h4>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-mono text-sm">
                <div>Administrador (Você)</div>
                <div className="ml-4">├── Gerente (Por laboratório/filial)</div>
                <div className="ml-8">│&nbsp;&nbsp;&nbsp;├── Supervisor (Por equipe)</div>
                <div className="ml-12">│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├── Técnico (Operacional)</div>
                <div className="ml-12">│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└── Técnico (Operacional)</div>
                <div className="ml-8">│&nbsp;&nbsp;&nbsp;└── Visualizador (Clientes/Consultores)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gerenciamento de Organizações */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Configuração de Organizações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">Criação Estratégica:</h5>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Nome: Razão social ou nome comercial</li>
                <li>Descrição: Tipo de serviços oferecidos</li>
                <li>Dados completos: Endereço, telefone, email</li>
                <li>Status ativo: Sempre marcar como ativa</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Exemplos de Organizações:</h5>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>"Laboratório Geotécnico Central - Matriz SP"</li>
                <li>"Instituto de Solos Avançados - Filial RJ"</li>
                <li>"Consultoria Terra Firme - Escritório BH"</li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
            <h5 className="font-medium text-blue-800 mb-2">Sequência Importante:</h5>
            <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
              <li>Crie organização primeiro</li>
              <li>Depois vincule usuários</li>
              <li>Gerentes só gerenciam sua organização</li>
              <li>Técnicos só veem ensaios de sua organização</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Monitoramento */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Monitoramento e Controle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">Dashboard Administrativo:</h5>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Número de usuários ativos</li>
                <li>Organizações cadastradas</li>
                <li>Ensaios realizados por período</li>
                <li>Relatórios gerados</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Indicadores de Saúde:</h5>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Usuários online</li>
                <li>Status de sincronização</li>
                <li>Erros reportados</li>
                <li>Performance do sistema</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manutenção */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Tarefas de Manutenção
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div>
            <h4 className="font-semibold mb-3">Tarefas Diárias</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Verificar dashboard de atividades</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Monitorar status de sincronização</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Responder solicitações de usuários</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Validar novos ensaios críticos</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Tarefas Semanais</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Revisar lista de usuários ativos</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Verificar relatórios gerados</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Análise de uso por organização</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Backup de dados importantes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problemas Comuns */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Resolução de Problemas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
              <h5 className="font-medium text-yellow-800 mb-2">"Não consigo acessar"</h5>
              <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
                <li>Verificar se usuário está ativo</li>
                <li>Confirmar email correto</li>
                <li>Resetar permissões se necessário</li>
                <li>Orientar sobre login com Google</li>
              </ol>
            </div>
            
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <h5 className="font-medium text-blue-800 mb-2">"Dados não aparecem"</h5>
              <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                <li>Verificar organização do usuário</li>
                <li>Confirmar permissões de acesso</li>
                <li>Checar status de sincronização</li>
                <li>Reprocessar dados se necessário</li>
              </ol>
            </div>
            
            <div className="p-4 border-l-4 border-red-500 bg-red-50">
              <h5 className="font-medium text-red-800 mb-2">"PDF não gera"</h5>
              <ol className="list-decimal list-inside text-sm text-red-700 space-y-1">
                <li>Verificar se ensaio está completo</li>
                <li>Validar dados obrigatórios</li>
                <li>Confirmar permissões de geração</li>
                <li>Testar em ambiente admin</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Segurança e Backup */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Segurança e Backup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">Controles de Segurança:</h5>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Autenticação Google (mais segura)</li>
                <li>Permissões granulares</li>
                <li>Auditoria completa</li>
                <li>Dados criptografados</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Estratégia de Backup:</h5>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Automático: Firebase backup diário</li>
                <li>Manual: Exportar dados mensalmente</li>
                <li>Local: Cópia de relatórios importantes</li>
                <li>Teste: Verificar backups periodicamente</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Checklist de Implementação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium mb-3">Fase 1 - Preparação (1 semana):</h5>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Configurar Firebase Authentication</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Criar primeira organização</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Configurar usuário admin</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Testar todas calculadoras</span>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium mb-3">Fase 2 - Configuração (1 semana):</h5>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Criar organizações do laboratório</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Cadastrar gerentes principais</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Definir estrutura hierárquica</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Treinar primeiros usuários</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h5 className="font-medium text-green-800 mb-2">Objetivo Final:</h5>
            <p className="text-sm text-green-700">
              Laboratório operando 100% digital com todos ensaios no sistema, 
              relatórios automáticos, equipe treinada e dados seguros na nuvem.
            </p>
            <p className="text-sm text-green-700 font-medium mt-2">
              Tempo estimado para implementação completa: 30 dias
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}