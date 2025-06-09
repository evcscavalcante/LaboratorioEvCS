import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FlaskRound, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

const resetSchema = z.object({
  email: z.string().email('Email inválido'),
});

type ResetFormData = z.infer<typeof resetSchema>;

interface ResetPasswordFormProps {
  onSwitchToLogin: () => void;
}

export default function ResetPasswordForm({ onSwitchToLogin }: ResetPasswordFormProps) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormData) => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await resetPassword(data.email);
      setSuccess(
        'Link de redefinição de senha enviado! Verifique seu email (incluindo a pasta de spam).'
      );
    } catch (error: any) {
      console.error('Erro ao resetar senha:', error);
      
      let errorMessage = 'Erro desconhecido';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Email não encontrado no sistema';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Aguarde antes de tentar novamente';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Erro de conexão. Verifique sua internet';
          break;
        default:
          errorMessage = error.message || 'Erro ao enviar link de redefinição';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <FlaskRound className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Recuperar Senha</CardTitle>
        <CardDescription className="text-center">
          Digite seu email para receber um link de redefinição
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="pl-10"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Link de Redefinição'}
          </Button>
        </form>

        <div className="mt-6">
          <Button
            variant="link"
            className="w-full text-sm text-blue-600 hover:text-blue-800"
            onClick={onSwitchToLogin}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Login
          </Button>
        </div>

        {success && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Próximos passos:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>1. Verifique sua caixa de entrada</li>
              <li>2. Procure um email do Firebase</li>
              <li>3. Clique no link para redefinir sua senha</li>
              <li>4. Não encontrou? Verifique a pasta de spam</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}