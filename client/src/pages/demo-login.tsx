import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// Usuários demo para teste do sistema
const DEMO_USERS = [
  {
    id: 1,
    email: "developer@sistema.com",
    password: "dev123",
    role: "DEVELOPER",
    name: "Sistema Developer"
  },
  {
    id: 2,
    email: "admin@empresa.com", 
    password: "admin123",
    role: "ADMIN",
    name: "Administrador"
  },
  {
    id: 3,
    email: "manager@empresa.com",
    password: "manager123", 
    role: "MANAGER",
    name: "Gerente"
  },
  {
    id: 4,
    email: "supervisor@empresa.com",
    password: "super123",
    role: "SUPERVISOR", 
    name: "Supervisor"
  },
  {
    id: 5,
    email: "tecnico@empresa.com",
    password: "tec123",
    role: "TECHNICIAN",
    name: "Técnico"
  }
];

export default function DemoLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simular autenticação com usuários demo
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Simular token de autenticação local
      localStorage.setItem('demo_user', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: getRolePermissions(user.role)
      }));
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${user.name}`,
      });
      
      // Recarregar a página para ativar o usuário autenticado
      window.location.reload();
    } else {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  const getRolePermissions = (role: string) => {
    const permissions: Record<string, string[]> = {
      DEVELOPER: ["ALL_ACCESS", "SYSTEM_ADMIN", "USER_MANAGEMENT", "ORGANIZATION_MANAGEMENT"],
      ADMIN: ["USER_MANAGEMENT", "ORGANIZATION_MANAGEMENT", "REPORTS", "SETTINGS"],
      MANAGER: ["TEAM_MANAGEMENT", "REPORTS", "TESTS_APPROVAL"],
      SUPERVISOR: ["TESTS_SUPERVISION", "REPORTS"],
      TECHNICIAN: ["TESTS_EXECUTION", "BASIC_REPORTS"],
      VIEWER: ["VIEW_ONLY"]
    };
    return permissions[role] || ["VIEW_ONLY"];
  };

  const loginWithDemo = (user: typeof DEMO_USERS[0]) => {
    setEmail(user.email);
    setPassword(user.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Sistema de Gestão Organizacional</CardTitle>
            <p className="text-gray-600">Ambiente de Demonstração</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usuários Demo</CardTitle>
            <p className="text-sm text-gray-600">Clique para preencher automaticamente:</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {DEMO_USERS.map((user) => (
              <Button
                key={user.id}
                variant="outline"
                className="w-full text-left justify-start"
                onClick={() => loginWithDemo(user)}
              >
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role} - {user.email}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}