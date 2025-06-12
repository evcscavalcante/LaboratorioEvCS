import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Users, Shield, Settings, Database, Award } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";

export default function Dashboard() {
  const { user, userProfile } = useAuth();
  const userPermissions = usePermissions();

  // Fetch subscription plans
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['/api/subscription/plans']
  });

  // Fetch admin users (only if user has permission)
  const { data: adminUsers, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    enabled: !!user && userPermissions?.canManageUsers
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              Faça login para acessar o dashboard
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800 border-red-200';
      case 'MANAGER': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'SUPERVISOR': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'TECHNICIAN': return 'bg-green-100 text-green-800 border-green-200';
      case 'VIEWER': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'MANAGER': return 'Gerente';
      case 'SUPERVISOR': return 'Supervisor';
      case 'TECHNICIAN': return 'Técnico';
      case 'VIEWER': return 'Visualizador';
      default: return 'Carregando...';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard - Sistema Geotécnico
              </h1>
              <p className="text-gray-600 mt-1">
                Bem-vindo ao sistema híbrido de gestão laboratorial
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getRoleBadgeColor(userProfile?.role || 'VIEWER')}>
                {getRoleDisplayName(userProfile?.role || 'VIEWER')}
              </Badge>
              <div className="text-right">
                <p className="font-medium">{userProfile?.name || user?.displayName || 'Usuário'}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Permissions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permissões do Usuário
            </CardTitle>
            <CardDescription>
              Controle de acesso baseado em funções hierárquicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries({
                'Criar': userPermissions.canCreate,
                'Editar': userPermissions.canEdit,
                'Excluir': userPermissions.canDelete,
                'Visualizar': userPermissions.canView,
                'Gerenciar Usuários': userPermissions.canManageUsers,
                'Aprovar Ensaios': userPermissions.canApproveTests,
                'Exportar Relatórios': userPermissions.canExportReports
              }).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">
                    {key}
                  </span>
                  <Badge variant={value ? "default" : "secondary"}>
                    {value ? "Permitido" : "Negado"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Subscription Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Planos de Assinatura
              </CardTitle>
              <CardDescription>
                Planos disponíveis para organizações
              </CardDescription>
            </CardHeader>
            <CardContent>
              {plansLoading ? (
                <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
              ) : (
                <div className="space-y-3">
                  {plans?.slice(0, 3).map((plan: any) => (
                    <div key={plan.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{plan.name}</div>
                        <div className="text-sm text-gray-500">
                          {plan.maxUsers} usuários • {plan.maxTests} ensaios/mês
                        </div>
                      </div>
                      <Badge variant="outline">
                        R$ {plan.price}/mês
                      </Badge>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">
                      Nenhum plano disponível
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Estatísticas do Sistema
              </CardTitle>
              <CardDescription>
                Informações do sistema híbrido
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status do Sistema</span>
                  <Badge variant="default">Operacional</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Autenticação</span>
                  <Badge variant="outline">Firebase + PostgreSQL</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Usuários Cadastrados</span>
                  <Badge variant="secondary">
                    {adminUsers?.length || 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Admin Users */}
        {userPermissions?.canManageUsers && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usuários do Sistema
              </CardTitle>
              <CardDescription>
                Gerenciamento de usuários cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
              ) : (
                <div className="space-y-3">
                  {adminUsers?.slice(0, 5).map((adminUser: any) => (
                    <div key={adminUser.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{adminUser.name}</div>
                        <div className="text-sm text-gray-500">{adminUser.email}</div>
                      </div>
                      <Badge className={getRoleBadgeColor(adminUser.role)}>
                        {getRoleDisplayName(adminUser.role)}
                      </Badge>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">
                      Nenhum usuário encontrado
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userPermissions?.canCreate && (
                <Button variant="outline" className="h-16">
                  Novo Ensaio
                </Button>
              )}
              {userPermissions?.canExportReports && (
                <Button variant="outline" className="h-16">
                  Gerar Relatório
                </Button>
              )}
              {userPermissions?.canManageUsers && (
                <Button variant="outline" className="h-16">
                  Gerenciar Usuários
                </Button>
              )}
              <Button variant="outline" className="h-16">
                Configurações
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}