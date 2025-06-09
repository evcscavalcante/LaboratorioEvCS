import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Building, Settings, BarChart3, Shield, Activity, Plus, ArrowRight } from 'lucide-react';
import type { User, Organization } from '@shared/schema';

const QUICK_STATS = [
  {
    title: 'Usuários Ativos',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    endpoint: '/api/users',
    filter: (data: User[]) => data.filter(user => user.active).length
  },
  {
    title: 'Organizações',
    icon: Building,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    endpoint: '/api/organizations',
    filter: (data: Organization[]) => data.length
  },
  {
    title: 'Administradores',
    icon: Shield,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    endpoint: '/api/users',
    filter: (data: User[]) => data.filter(user => user.role === 'admin').length
  }
];

const MANAGEMENT_MODULES = [
  {
    title: 'Gerenciar Usuários',
    description: 'Criar, editar e gerenciar contas de usuários do sistema',
    icon: Users,
    path: '/admin/users',
    color: 'border-blue-200 hover:border-blue-300',
    actions: ['Criar usuário', 'Editar perfis', 'Controlar acesso']
  },
  {
    title: 'Gerenciar Organizações',
    description: 'Administrar empresas, laboratórios e instituições',
    icon: Building,
    path: '/admin/organizations',
    color: 'border-green-200 hover:border-green-300',
    actions: ['Nova organização', 'Editar dados', 'Vincular usuários']
  },
  {
    title: 'Relatórios e Analytics',
    description: 'Visualizar estatísticas e relatórios do sistema',
    icon: BarChart3,
    path: '/analytics',
    color: 'border-purple-200 hover:border-purple-300',
    actions: ['Ver estatísticas', 'Exportar dados', 'Monitorar atividade']
  }
];

export default function AdminDashboard() {
  // Fetch users for statistics
  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      return response.json();
    }
  });

  // Fetch organizations for statistics
  const { data: organizations = [] } = useQuery({
    queryKey: ['/api/organizations'],
    queryFn: async () => {
      const response = await fetch('/api/organizations');
      return response.json();
    }
  });

  const getStatValue = (endpoint: string, filter: (data: any[]) => number) => {
    if (endpoint === '/api/users') {
      return filter(users);
    } else if (endpoint === '/api/organizations') {
      return filter(organizations);
    }
    return 0;
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Painel Administrativo
          </h1>
          <p className="text-muted-foreground">
            Gerencie usuários, organizações e configurações do sistema
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Sistema Ativo
          </Badge>
        </div>
      </div>

      {/* Quick Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {QUICK_STATS.map((stat, index) => {
          const Icon = stat.icon;
          const value = getStatValue(stat.endpoint, stat.filter);
          
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">
                      {value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Management Modules */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Módulos de Gerenciamento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MANAGEMENT_MODULES.map((module, index) => {
            const Icon = module.icon;
            
            return (
              <Card key={index} className={`transition-colors ${module.color}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon className="h-8 w-8 text-muted-foreground" />
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {module.actions.map((action, actionIndex) => (
                      <div key={actionIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full" />
                        {action}
                      </div>
                    ))}
                  </div>
                  
                  <Link href={module.path}>
                    <Button className="w-full">
                      Acessar Módulo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Atividade Recente
          </CardTitle>
          <CardDescription>
            Últimas ações realizadas no sistema administrativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <span className="text-sm">Sistema inicializado com sucesso</span>
              </div>
              <span className="text-xs text-muted-foreground">Agora</span>
            </div>
            
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2" />
              <p>Nenhuma atividade adicional registrada</p>
              <p className="text-xs">As ações administrativas aparecerão aqui</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Tarefas administrativas mais comuns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Criar Novo Usuário
              </Button>
            </Link>
            
            <Link href="/admin/organizations">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Criar Nova Organização
              </Button>
            </Link>
            
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Visualizar Todos os Usuários
              </Button>
            </Link>
            
            <Link href="/analytics">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Ver Relatórios do Sistema
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}