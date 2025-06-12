import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Beaker, User, Lock, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Secure login with enhanced authentication
export default function SecureLogin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      if (!credentials.username || !credentials.password) {
        setError("Por favor, preencha todos os campos.");
        return;
      }

      // Login via API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro durante o login');
        return;
      }

      if (data.success) {
        // Store authentication data
        localStorage.setItem("auth_token", `session_${Date.now()}`);
        localStorage.setItem("user_data", JSON.stringify(data.user));
        
        // Clear form
        setCredentials({ username: "", password: "" });
        window.location.reload();
      } else {
        setError("Falha na autenticação.");
      }

    } catch (error) {
      console.error("Login error:", error);
      setError("Erro durante o login. Verifique sua conexão.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/logo-compact.svg" 
              alt="Laboratório Ev.C.S" 
              className="w-16 h-16"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Laboratório Ev.C.S
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sistema Seguro para Ensaios Geotécnicos
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                <User className="h-4 w-4 inline mr-2" />
                Email Corporativo
              </Label>
              <Input
                id="username"
                type="email"
                placeholder="usuario@laboratorio-evcs.com"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                <Lock className="h-4 w-4 inline mr-2" />
                Senha Segura
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Autenticando...
                </div>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Entrar no Sistema
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-2">Sistema de Autenticação Segura</p>
              <p className="mb-2">Use seu email corporativo e senha para acessar.</p>
              <p className="text-xs">
                <strong>Níveis de acesso por email:</strong><br/>
                • admin@laboratorio-evcs.com (Administrador)<br/>
                • manager@laboratorio-evcs.com (Gerente)<br/>
                • supervisor@laboratorio-evcs.com (Supervisor)<br/>
                • tecnico@laboratorio-evcs.com (Técnico)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}