import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Beaker, AlertTriangle } from "lucide-react";
import { signInWithGoogle } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

export default function FirebaseLogin() {
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

          <div className="space-y-4">
            <Button 
              onClick={handleGoogleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Conectando...
                </div>
              ) : (
                <>
                  <Shield className="h-5 w-5 mr-2" />
                  Entrar com Google
                </>
              )}
            </Button>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-2">Sistema de Autenticação Segura</p>
                <p className="mb-2">Use sua conta Google para acessar o sistema.</p>
                <p className="text-xs">
                  <strong>Níveis de acesso baseados no email:</strong><br/>
                  • Admin: admin@laboratorio-evcs.com<br/>
                  • Manager: manager@laboratorio-evcs.com<br/>
                  • Supervisor: supervisor@laboratorio-evcs.com<br/>
                  • Técnico: outros emails autorizados
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}