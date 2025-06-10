import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Shield, User, Crown, Eye, Settings } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface UserRole {
  id: string;
  username: string;
  password: string;
  role: 'ADMIN' | 'MANAGER' | 'SUPERVISOR' | 'TECHNICIAN' | 'VIEWER';
  createdAt: string;
}

export default function UserRoles() {
  const { isAdmin } = usePermissions();
  const [users, setUsers] = useState<UserRole[]>([
    { id: '1', username: 'admin', password: 'admin123', role: 'ADMIN', createdAt: '2024-01-01' },
    { id: '2', username: 'manager', password: 'manager123', role: 'MANAGER', createdAt: '2024-01-01' },
    { id: '3', username: 'supervisor', password: 'super123', role: 'SUPERVISOR', createdAt: '2024-01-01' },
    { id: '4', username: 'viewer', password: 'view123', role: 'VIEWER', createdAt: '2024-01-01' },
  ]);

  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'TECHNICIAN' as UserRole['role']
  });

  const [showPasswords, setShowPasswords] = useState(false);

  if (!isAdmin) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Negado</h2>
            <p className="text-gray-600">Apenas administradores podem gerenciar usuários e roles.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateUser = () => {
    if (!newUser.username || !newUser.password) {
      alert('Preencha usuário e senha');
      return;
    }

    if (users.some(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
      alert('Usuário já existe');
      return;
    }

    const user: UserRole = {
      id: Date.now().toString(),
      username: newUser.username,
      password: newUser.password,
      role: newUser.role,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers([...users, user]);
    setNewUser({ username: '', password: '', role: 'TECHNICIAN' });
    
    // Update the actual authentication system
    const authData = {
      [newUser.username.toLowerCase()]: {
        password: newUser.password,
        role: newUser.role
      }
    };
    
    localStorage.setItem('custom_users', JSON.stringify({
      ...JSON.parse(localStorage.getItem('custom_users') || '{}'),
      ...authData
    }));
  };

  const handleDeleteUser = (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    if (user.username === 'admin') {
      alert('Não é possível excluir o usuário administrador principal');
      return;
    }

    if (confirm(`Excluir usuário ${user.username}?`)) {
      setUsers(users.filter(u => u.id !== id));
      
      // Remove from custom users
      const customUsers = JSON.parse(localStorage.getItem('custom_users') || '{}');
      delete customUsers[user.username.toLowerCase()];
      localStorage.setItem('custom_users', JSON.stringify(customUsers));
    }
  };

  const getRoleIcon = (role: UserRole['role']) => {
    switch (role) {
      case 'ADMIN': return <Crown className="h-4 w-4" />;
      case 'MANAGER': return <Settings className="h-4 w-4" />;
      case 'SUPERVISOR': return <Shield className="h-4 w-4" />;
      case 'TECHNICIAN': return <User className="h-4 w-4" />;
      case 'VIEWER': return <Eye className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: UserRole['role']) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'MANAGER': return 'bg-purple-100 text-purple-800';
      case 'SUPERVISOR': return 'bg-blue-100 text-blue-800';
      case 'TECHNICIAN': return 'bg-green-100 text-green-800';
      case 'VIEWER': return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleName = (role: UserRole['role']) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'MANAGER': return 'Gerente';
      case 'SUPERVISOR': return 'Supervisor';
      case 'TECHNICIAN': return 'Técnico';
      case 'VIEWER': return 'Visualizador';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
          <p className="text-gray-600">Configure usuários e seus níveis de acesso ao sistema</p>
        </div>
      </div>

      {/* Create User */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Criar Novo Usuário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                placeholder="Nome do usuário"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                placeholder="Senha"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="role">Nível de Acesso</Label>
              <Select value={newUser.role} onValueChange={(value: UserRole['role']) => setNewUser({...newUser, role: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="MANAGER">Gerente</SelectItem>
                  <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                  <SelectItem value="TECHNICIAN">Técnico</SelectItem>
                  <SelectItem value="VIEWER">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleCreateUser} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Criar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Usuários Cadastrados</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPasswords(!showPasswords)}
            >
              {showPasswords ? 'Ocultar' : 'Mostrar'} Senhas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user.role)}
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-500">
                        Senha: {showPasswords ? user.password : '••••••••'}
                      </div>
                    </div>
                  </div>
                  <Badge className={getRoleColor(user.role)}>
                    {getRoleName(user.role)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Criado: {user.createdAt}
                  </span>
                  {user.username !== 'admin' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Info */}
      <Card>
        <CardHeader>
          <CardTitle>Níveis de Permissão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold">Administrador</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Acesso total ao sistema</li>
                <li>• Gerenciar usuários</li>
                <li>• Criar, editar, excluir ensaios</li>
                <li>• Aprovar ensaios</li>
                <li>• Exportar relatórios</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold">Gerente</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Gerenciar usuários</li>
                <li>• Criar, editar, excluir ensaios</li>
                <li>• Aprovar ensaios</li>
                <li>• Exportar relatórios</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Supervisor</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Criar e editar ensaios</li>
                <li>• Aprovar ensaios</li>
                <li>• Exportar relatórios</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Técnico</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Criar e editar ensaios</li>
                <li>• Visualizar ensaios</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold">Visualizador</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Apenas visualizar ensaios</li>
                <li>• Sem permissões de edição</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}