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

  // Fetch user permissions from API
  const { data: apiPermissions, isLoading: permissionsLoading } = useQuery({
    queryKey: ['/api/user/permissions'],
    enabled: !!user
  });

  // Fetch subscription plans
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['/api/subscription/plans']
  });

  // Fetch admin users (only if user has permission)
  const { data: adminUsers, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    enabled: !!user && userPermissions?.canManageUsers
  });

  // Fetch developer info (only if user has permission)
  const { data: developerInfo, isLoading: devLoading } = useQuery({
    queryKey: ['/api/developer/system-info'],
    enabled: !!user && userPermissions?.isAdmin
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
      case 'DEVELOPER': return 'bg-purple-500 text-white';
      case 'SUPER_ADMIN': return 'bg-red-500 text-white';
      case 'ADMIN': return 'bg-orange-500 text-white';
      case 'MANAGER': return 'bg-blue-500 text-white';
      case 'SUPERVISOR': return 'bg-green-500 text-white';
      case 'TECHNICIAN': return 'bg-yellow-500 text-black';
      case 'VIEWER': return 'bg-gray-500 text-white';
      default: return 'bg-gray-300 text-black';
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
                {userProfile?.role === 'ADMIN' && 'Administrador'}
                {userProfile?.role === 'MANAGER' && 'Gerente'}
                {userProfile?.role === 'SUPERVISOR' && 'Supervisor'}
                {userProfile?.role === 'TECHNICIAN' && 'Técnico'}
                {userProfile?.role === 'VIEWER' && 'Visualizador'}
                {!userProfile?.role && 'Carregando...'}
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
                Planos disponíveis no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {plansLoading ? (
                <div className="animate-pulse space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {plans?.map((plan: any) => (
                    <div key={plan.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{plan.name}</h4>
                        <Badge variant="outline">
                          {plan.price === 0 ? 'Gratuito' : `R$ ${plan.price}/mês`}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                      <div className="text-xs text-gray-500">
                        {plan.maxUsers} usuários • {plan.maxTests} testes/mês
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Status do Sistema
              </CardTitle>
              <CardDescription>
                Informações técnicas e operacionais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Autenticação</span>
                  <Badge variant="default">Firebase Híbrido</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Banco de Dados</span>
                  <Badge variant="default">PostgreSQL</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Sistema</span>
                  <Badge variant="default">Operacional</Badge>
                </div>
                
                {permissions?.permissions?.canAccessDeveloperTools && (
                  <>
                    <Separator />
                    <div className="text-sm font-medium text-purple-600">
                      Informações do Desenvolvedor:
                    </div>
                    {devLoading ? (
                      <div className="animate-pulse h-12 bg-gray-200 rounded"></div>
                    ) : (
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>Versão: {developerInfo?.version}</div>
                        <div>Ambiente: {developerInfo?.environment}</div>
                        <div>Features: {developerInfo?.features?.join(', ')}</div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Panel */}
        {permissions?.permissions?.canManageUsers && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Painel Administrativo
              </CardTitle>
              <CardDescription>
                Gestão de usuários e sistema (acesso restrito)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {adminUsers?.length || 0}
                      </div>
                      <div className="text-sm text-blue-600">Total de Usuários</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {adminUsers?.filter((u: any) => u.active)?.length || 0}
                      </div>
                      <div className="text-sm text-green-600">Usuários Ativos</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {new Set(adminUsers?.map((u: any) => u.role))?.size || 0}
                      </div>
                      <div className="text-sm text-purple-600">Níveis de Acesso</div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 font-medium text-sm">
                      Usuários Recentes
                    </div>
                    <div className="divide-y">
                      {adminUsers?.slice(0, 5).map((user: any) => (
                        <div key={user.id} className="p-4 flex items-center justify-between">
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}