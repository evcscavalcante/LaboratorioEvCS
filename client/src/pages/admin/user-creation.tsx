import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, CheckCircle, AlertTriangle, Eye, EyeOff } from "lucide-react";

export default function UserCreation() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "technician"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username é obrigatório";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username deve ter pelo menos 3 caracteres";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: formData.role
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Erro ao criar usuário",
          description: data.error || "Erro interno do servidor",
          variant: "destructive",
        });
        return;
      }

      if (data.success) {
        toast({
          title: "Usuário criado com sucesso",
          description: `${formData.name} foi adicionado ao sistema`,
        });

        // Clear form
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          name: "",
          role: "technician"
        });
        setErrors({});
      }

    } catch (error) {
      console.error('User creation error:', error);
      toast({
        title: "Erro ao criar usuário",
        description: "Erro de conexão. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <UserPlus className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Criar Novo Usuário</h1>
            <p className="text-gray-600">Adicione um novo usuário ao sistema</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Usuário</CardTitle>
            <CardDescription>
              Preencha os dados do novo usuário. O usuário poderá fazer login com o username e senha fornecidos.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="ex: joao.silva"
                    className={errors.username ? "border-red-500" : ""}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-600">{errors.username}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="joao.silva@laboratorio-evcs.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="João Silva"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Função *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="technician">Técnico</SelectItem>
                    <SelectItem value="viewer">Visualizador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirme a senha"
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Credenciais de Acesso:</strong><br />
                  O usuário poderá fazer login usando:<br />
                  • Username: {formData.username || "(será definido)"}<br />
                  • Senha: (a senha definida acima)
                </AlertDescription>
              </Alert>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Criando usuário...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Criar Usuário
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Usuários Padrão do Sistema:</strong><br />
            • admin / admin123 (Administrador)<br />
            • manager / manager123 (Gerente)<br />
            • supervisor / supervisor123 (Supervisor)<br />
            • technician / technician123 (Técnico)
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}