import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Beaker, AlertTriangle } from "lucide-react";
import { signInWithGoogle, auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError("");
      await signInWithGoogle();
    } catch (error: any) {
      console.error("Login error:", error);
      setError("Erro durante o login. Verifique sua conexão e tente novamente.");
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