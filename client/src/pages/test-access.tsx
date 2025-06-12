import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Settings, Users, FileText, Shield, Eye, Download, Trash2, Edit, Plus } from "lucide-react";

// Mock user data for testing
const testUsers = {
  admin: {
    id: "1",
    username: "admin_user",
    role: "admin" as const,
    name: "Administrador Sistema",
    email: "admin@geolab.com"
  },
  manager: {
    id: "2", 
    username: "manager_user",
    role: "manager" as const,
    name: "Gerente Laboratório",
    email: "manager@geolab.com"
  },
  supervisor: {
    id: "3",
    username: "supervisor_user", 
    role: "supervisor" as const,
    name: "Supervisor Técnico",
    email: "supervisor@geolab.com"
  },
  technician: {
    id: "4",
    username: "technician_user",
    role: "technician" as const,
    name: "Técnico Laboratório",
    email: "technician@geolab.com"
  },
  viewer: {
    id: "5",
    username: "viewer_user",
    role: "viewer" as const,
    name: "Visualizador",
    email: "viewer@geolab.com"
  }
};

const PERMISSIONS = {
  // User management
  MANAGE_USERS: 'manage_users',
  VIEW_USERS: 'view_users',
  MANAGE_ORGANIZATIONS: 'manage_organizations',
  
  // Test management
  CREATE_TESTS: 'create_tests',
  EDIT_TESTS: 'edit_tests',
  DELETE_TESTS: 'delete_tests',
  VIEW_TESTS: 'view_tests',
  APPROVE_TESTS: 'approve_tests',
  
  // Reports
  GENERATE_REPORTS: 'generate_reports',
  VIEW_ANALYTICS: 'view_analytics',
  EXPORT_DATA: 'export_data',
  
  // System
  VIEW_SYSTEM_LOGS: 'view_system_logs',
  MANAGE_SETTINGS: 'manage_settings'
} as const;

const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS),
  manager: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_TESTS,
    PERMISSIONS.EDIT_TESTS,
    PERMISSIONS.DELETE_TESTS,
    PERMISSIONS.VIEW_TESTS,
    PERMISSIONS.APPROVE_TESTS,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.MANAGE_SETTINGS
  ],
  supervisor: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_TESTS,
    PERMISSIONS.EDIT_TESTS,
    PERMISSIONS.VIEW_TESTS,
    PERMISSIONS.APPROVE_TESTS,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_DATA
  ],
  technician: [
    PERMISSIONS.CREATE_TESTS,
    PERMISSIONS.EDIT_TESTS,
    PERMISSIONS.VIEW_TESTS,
    PERMISSIONS.GENERATE_REPORTS
  ],
  viewer: [
    PERMISSIONS.VIEW_TESTS,
    PERMISSIONS.VIEW_ANALYTICS
  ]
};

const permissionIcons = {
  [PERMISSIONS.MANAGE_USERS]: Users,
  [PERMISSIONS.VIEW_USERS]: Eye,
  [PERMISSIONS.MANAGE_ORGANIZATIONS]: Settings,
  [PERMISSIONS.CREATE_TESTS]: Plus,
  [PERMISSIONS.EDIT_TESTS]: Edit,
  [PERMISSIONS.DELETE_TESTS]: Trash2,
  [PERMISSIONS.VIEW_TESTS]: FileText,
  [PERMISSIONS.APPROVE_TESTS]: CheckCircle,
  [PERMISSIONS.GENERATE_REPORTS]: FileText,
  [PERMISSIONS.VIEW_ANALYTICS]: Eye,
  [PERMISSIONS.EXPORT_DATA]: Download,
  [PERMISSIONS.VIEW_SYSTEM_LOGS]: FileText,
  [PERMISSIONS.MANAGE_SETTINGS]: Settings
};

const permissionLabels = {
  [PERMISSIONS.MANAGE_USERS]: 'Gerenciar Usuários',
  [PERMISSIONS.VIEW_USERS]: 'Visualizar Usuários',
  [PERMISSIONS.MANAGE_ORGANIZATIONS]: 'Gerenciar Organizações',
  [PERMISSIONS.CREATE_TESTS]: 'Criar Ensaios',
  [PERMISSIONS.EDIT_TESTS]: 'Editar Ensaios',
  [PERMISSIONS.DELETE_TESTS]: 'Excluir Ensaios',
  [PERMISSIONS.VIEW_TESTS]: 'Visualizar Ensaios',
  [PERMISSIONS.APPROVE_TESTS]: 'Aprovar Ensaios',
  [PERMISSIONS.GENERATE_REPORTS]: 'Gerar Relatórios',
  [PERMISSIONS.VIEW_ANALYTICS]: 'Ver Analytics',
  [PERMISSIONS.EXPORT_DATA]: 'Exportar Dados',
  [PERMISSIONS.VIEW_SYSTEM_LOGS]: 'Ver Logs Sistema',
  [PERMISSIONS.MANAGE_SETTINGS]: 'Gerenciar Configurações'
};

export default function TestAccess() {
  const [currentUser, setCurrentUser] = useState<keyof typeof testUsers>('admin');
  const [testResults, setTestResults] = useState<{[key: string]: boolean}>({});

  const user = testUsers[currentUser];
  const userPermissions = ROLE_PERMISSIONS[currentUser];

  const hasPermission = (permission: string) => {
    return userPermissions.includes(permission as any);
  };

  const runPermissionTest = (permission: string, description: string) => {
    const hasAccess = hasPermission(permission);
    setTestResults(prev => ({
      ...prev,
      [`${currentUser}_${permission}`]: hasAccess
    }));
    return hasAccess;
  };

  const runAllTests = () => {
    const results: {[key: string]: boolean} = {};
    
    Object.values(PERMISSIONS).forEach(permission => {
      const hasAccess = hasPermission(permission);
      results[`${currentUser}_${permission}`] = hasAccess;
    });
    
    setTestResults(prev => ({ ...prev, ...results }));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'manager': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'supervisor': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'technician': return 'bg-green-100 text-green-800 border-green-200';
      case 'viewer': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teste de Controle de Acesso</h1>
            <p className="text-gray-600 mt-2">Verificação de permissões por nível de usuário</p>
          </div>
          <Shield className="h-10 w-10 text-blue-600" />
        </div>

        {/* User Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Usuário Atual</CardTitle>
            <CardDescription>Selecione o tipo de usuário para testar as permissões</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(testUsers).map(([key, userData]) => (
                <Button
                  key={key}
                  variant={currentUser === key ? "default" : "outline"}
                  onClick={() => setCurrentUser(key as keyof typeof testUsers)}
                  className="flex items-center gap-2"
                >
                  <Badge className={getRoleColor(userData.role)}>
                    {userData.role.toUpperCase()}
                  </Badge>
                  {userData.name}
                </Button>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permission Tests */}
        <Tabs defaultValue="permissions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="permissions">Permissões</TabsTrigger>
            <TabsTrigger value="functional">Testes Funcionais</TabsTrigger>
            <TabsTrigger value="summary">Resumo</TabsTrigger>
          </TabsList>

          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Verificação de Permissões</CardTitle>
                  <CardDescription>Status das permissões para o usuário atual</CardDescription>
                </div>
                <Button onClick={runAllTests}>
                  Testar Todas Permissões
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(PERMISSIONS).map(([key, permission]) => {
                    const hasAccess = hasPermission(permission);
                    const testKey = `${currentUser}_${permission}`;
                    const tested = testResults[testKey] !== undefined;
                    const Icon = permissionIcons[permission];
                    
                    return (
                      <div
                        key={permission}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          hasAccess 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon className={`h-5 w-5 ${hasAccess ? 'text-green-600' : 'text-red-600'}`} />
                          {hasAccess ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <h4 className="font-medium text-sm mb-1">
                          {permissionLabels[permission]}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          {permission}
                        </p>
                        <Badge 
                          variant={hasAccess ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {hasAccess ? "PERMITIDO" : "NEGADO"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="functional" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Laboratory Tests Access */}
              <Card>
                <CardHeader>
                  <CardTitle>Ensaios de Laboratório</CardTitle>
                  <CardDescription>Acesso aos módulos de ensaios</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span>Density In Situ</span>
                    {hasPermission(PERMISSIONS.VIEW_TESTS) ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span>Real Density</span>
                    {hasPermission(PERMISSIONS.VIEW_TESTS) ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span>Max Min Density</span>
                    {hasPermission(PERMISSIONS.VIEW_TESTS) ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Equipment Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Gestão de Equipamentos</CardTitle>
                  <CardDescription>Acesso ao controle de equipamentos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span>Gerenciar Cápsulas</span>
                    {hasPermission(PERMISSIONS.MANAGE_SETTINGS) ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span>Gerenciar Cilindros</span>
                    {hasPermission(PERMISSIONS.MANAGE_SETTINGS) ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span>Conferências Trimestrais</span>
                    {hasPermission(PERMISSIONS.APPROVE_TESTS) ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Administrative Functions */}
              <Card>
                <CardHeader>
                  <CardTitle>Funções Administrativas</CardTitle>
                  <CardDescription>Controles administrativos do sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span>Gestão de Usuários</span>
                    {hasPermission(PERMISSIONS.MANAGE_USERS) ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span>Configurações Sistema</span>
                    {hasPermission(PERMISSIONS.MANAGE_SETTINGS) ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span>Logs do Sistema</span>
                    {hasPermission(PERMISSIONS.VIEW_SYSTEM_LOGS) ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Reports and Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios e Análises</CardTitle>
                  <CardDescription>Acesso a relatórios e dados</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span>Gerar Relatórios</span>
                    {hasPermission(PERMISSIONS.GENERATE_REPORTS) ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span>Analytics</span>
                    {hasPermission(PERMISSIONS.VIEW_ANALYTICS) ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span>Exportar Dados</span>
                    {hasPermission(PERMISSIONS.EXPORT_DATA) ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              {Object.entries(testUsers).map(([key, userData]) => {
                const rolePermissions = ROLE_PERMISSIONS[key as keyof typeof ROLE_PERMISSIONS];
                const permissionCount = rolePermissions.length;
                const totalPermissions = Object.values(PERMISSIONS).length;
                
                return (
                  <Card key={key} className={currentUser === key ? 'ring-2 ring-blue-500' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-bold text-sm">
                            {userData.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm truncate">{userData.name}</CardTitle>
                          <Badge className={`${getRoleColor(userData.role)} text-xs`}>
                            {userData.role.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Permissões:</span>
                          <span className="font-medium">{permissionCount}/{totalPermissions}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all" 
                            style={{ width: `${(permissionCount / totalPermissions) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round((permissionCount / totalPermissions) * 100)}% de acesso
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Hierarquia de Permissões:</strong><br />
                • <strong>Admin:</strong> Acesso total ao sistema<br />
                • <strong>Manager:</strong> Gestão de usuários, ensaios e configurações<br />
                • <strong>Supervisor:</strong> Aprovação de ensaios e supervisão técnica<br />
                • <strong>Technician:</strong> Execução de ensaios e relatórios<br />
                • <strong>Viewer:</strong> Visualização apenas
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}