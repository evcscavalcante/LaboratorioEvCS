import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Beaker, User, Lock } from "lucide-react";

export default function Login() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (credentials.username && credentials.password) {
        let userRole = "TECHNICIAN"; // Default role
        
        // Check custom users first
        const customUsers = JSON.parse(localStorage.getItem('custom_users') || '{}');
        const customUser = customUsers[credentials.username.toLowerCase()];
        
        if (customUser && customUser.password === credentials.password) {
          userRole = customUser.role;
        }
        // Strict admin credentials - exact match required
        else if (credentials.username === "admin" && credentials.password === "admin123@Lab2025!") {
          userRole = "ADMIN";
        } else if (credentials.username === "administrador" && credentials.password === "admin123@Lab2025!") {
          userRole = "ADMIN";
        } else if (credentials.username === "manager" && credentials.password === "manager123@Lab2025!") {
          userRole = "MANAGER";
        } else if (credentials.username === "gerente" && credentials.password === "manager123@Lab2025!") {
          userRole = "MANAGER";
        } else if (credentials.username === "supervisor" && credentials.password === "super123@Lab2025!") {
          userRole = "SUPERVISOR";
        } else if (credentials.username === "viewer" && credentials.password === "view123@Lab2025!") {
          userRole = "VIEWER";
        } else if (credentials.username === "visualizador" && credentials.password === "view123@Lab2025!") {
          userRole = "VIEWER";
        } else if (credentials.password === "demo123") {
          // Technician access only for demo password
          userRole = "TECHNICIAN";
        } else {
          // Invalid credentials
          alert("Credenciais inválidas. Verifique o usuário e senha.");
          setIsLoading(false);
          return;
        }
        
        localStorage.setItem("auth_token", "authenticated");
        localStorage.setItem("user_role", userRole);
        localStorage.setItem("user_name", credentials.username);
        
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Beaker className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Laboratório Ev.C.S
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sistema Ativo para Ensaios Geotécnicos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center mb-6">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Acesso Restrito
            </h3>
            <p className="text-sm text-gray-600">
              Este sistema é destinado apenas para técnicos autorizados do laboratório.
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="text-xs text-gray-500 text-center mt-4 space-y-2">
            <div className="bg-blue-50 p-3 rounded border">
              <p className="font-semibold text-blue-800 mb-2">Credenciais de Acesso:</p>
              <div className="text-left space-y-1">
                <p><strong>Administrador:</strong> admin / admin123</p>
                <p><strong>Gerente:</strong> manager / manager123</p>
                <p><strong>Supervisor:</strong> supervisor / super123</p>
                <p><strong>Visualizador:</strong> viewer / view123</p>
                <p><strong>Técnico:</strong> qualquer usuário / demo123</p>
              </div>
            </div>
            <div className="bg-amber-50 p-2 rounded border border-amber-200">
              <p className="text-amber-700 text-xs">⚠️ Para acesso administrativo, use as credenciais exatas acima.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}