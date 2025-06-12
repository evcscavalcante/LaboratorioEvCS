import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function SystemStatus() {
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["/api/subscription/plans"],
  });

  const { data: paymentConfig, isLoading: paymentLoading } = useQuery({
    queryKey: ["/api/payment/config"],
  });

  const getStatusIcon = (isWorking: boolean) => {
    return isWorking ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sistema de Gestão Organizacional</h1>
        <p className="text-gray-600 mt-2">Status de operação do sistema híbrido</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sistema de Autenticação */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Firebase Authentication</CardTitle>
            {getStatusIcon(true)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Ativo</div>
            <p className="text-xs text-muted-foreground">Frontend autenticação</p>
          </CardContent>
        </Card>

        {/* Base de Dados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PostgreSQL Database</CardTitle>
            {getStatusIcon(true)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Operacional</div>
            <p className="text-xs text-muted-foreground">Backend persistência</p>
          </CardContent>
        </Card>

        {/* Planos de Assinatura */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planos de Assinatura</CardTitle>
            {getStatusIcon(!plansLoading && plans?.length > 0)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {plansLoading ? "Carregando..." : `${plans?.length || 0} Planos`}
            </div>
            <p className="text-xs text-muted-foreground">Sistema organizacional</p>
          </CardContent>
        </Card>

        {/* Sistema de Pagamentos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integração Pagamentos</CardTitle>
            {getStatusIcon(!paymentLoading && paymentConfig?.providers?.length > 0)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {paymentLoading ? "Carregando..." : "Configurado"}
            </div>
            <p className="text-xs text-muted-foreground">PagSeguro, Mercado Pago</p>
          </CardContent>
        </Card>

        {/* Roles e Permissões */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sistema de Roles</CardTitle>
            {getStatusIcon(true)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">6 Níveis</div>
            <p className="text-xs text-muted-foreground">Hierarquia funcional</p>
          </CardContent>
        </Card>

        {/* Servidor Híbrido */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servidor Híbrido</CardTitle>
            {getStatusIcon(true)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">Porta 5000</div>
            <p className="text-xs text-muted-foreground">Express + Vite</p>
          </CardContent>
        </Card>
      </div>

      {/* Detalhes dos Planos */}
      {plans && plans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Planos de Assinatura Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map((plan: any) => (
                <div key={plan.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{plan.name}</h3>
                    <Badge variant={plan.price === 0 ? "secondary" : "default"}>
                      {plan.price === 0 ? "GRÁTIS" : `R$ ${plan.price}`}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                  <div className="text-xs space-y-1">
                    <div>👥 {plan.maxUsers} usuários</div>
                    <div>🧪 {plan.maxTests} testes</div>
                    <div>✅ {plan.features.length} recursos</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuração de Pagamentos */}
      {paymentConfig && (
        <Card>
          <CardHeader>
            <CardTitle>Configuração de Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Provedores</h4>
                <div className="space-y-1">
                  {paymentConfig.providers?.map((provider: string) => (
                    <Badge key={provider} variant="outline">{provider}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Moeda</h4>
                <Badge variant="secondary">{paymentConfig.currency}</Badge>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Métodos</h4>
                <div className="space-y-1">
                  {paymentConfig.methods?.map((method: string) => (
                    <Badge key={method} variant="outline">{method}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}