import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  QrCode,
  Receipt,
  DollarSign,
  FileText
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface Plan {
  id: string;
  name: string;
  description: string;
  basePrice: string;
  maxUsers: number | null;
  maxEnsaios: number | null;
  features: string[];
}

interface BillingCycle {
  id: string;
  name: string;
  months: number;
  discountPercent: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  provider: string;
  lastFour?: string;
  brand?: string;
  isDefault: boolean;
}

export default function SubscriptionPage() {
  const permissions = usePermissions();
  const [activeTab, setActiveTab] = useState('overview');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [cycles, setCycles] = useState<BillingCycle[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [selectedCycle, setSelectedCycle] = useState<string>('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentType, setPaymentType] = useState('pix');
  const [pixData, setPixData] = useState<any>(null);

  // Load initial data
  useEffect(() => {
    loadPlans();
    loadCycles();
    loadCurrentSubscription();
    loadPaymentMethods();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await fetch('/api/subscription/plans');
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const loadCycles = async () => {
    try {
      const response = await fetch('/api/subscription/cycles');
      const data = await response.json();
      setCycles(data);
    } catch (error) {
      console.error('Error loading cycles:', error);
    }
  };

  const loadCurrentSubscription = async () => {
    try {
      const response = await fetch('/api/subscription/current');
      const data = await response.json();
      setCurrentSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const response = await fetch('/api/payment/methods');
      const data = await response.json();
      setPaymentMethods(data);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const calculatePrice = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    const cycle = cycles.find(c => c.id === selectedCycle);
    
    if (!plan || !cycle) return { finalPrice: 0, discount: 0 };
    
    const basePrice = parseFloat(plan.basePrice);
    const discountPercent = parseFloat(cycle.discountPercent);
    const discount = basePrice * (discountPercent / 100);
    const finalPrice = basePrice - discount;
    
    return { finalPrice, discount, basePrice, discountPercent };
  };

  const handleSubscribe = async () => {
    if (!selectedPlan || !selectedCycle) return;
    
    setIsLoading(true);
    try {
      // Create subscription
      const subResponse = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan,
          cycleId: selectedCycle,
          trialDays: 7
        })
      });
      
      if (!subResponse.ok) throw new Error('Failed to create subscription');
      const subscription = await subResponse.json();
      
      // Create invoice
      const pricing = calculatePrice();
      const invoiceResponse = await fetch('/api/payment/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          amount: pricing.finalPrice,
          description: `Assinatura ${plans.find(p => p.id === selectedPlan)?.name} - ${cycles.find(c => c.id === selectedCycle)?.name}`
        })
      });
      
      if (!invoiceResponse.ok) throw new Error('Failed to create invoice');
      const invoice = await invoiceResponse.json();
      
      // Process payment based on type
      if (paymentType === 'pix') {
        await handlePixPayment(invoice.id);
      } else if (paymentType === 'boleto') {
        await handleBoletoPayment(invoice.id);
      }
      
      await loadCurrentSubscription();
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('Erro ao criar assinatura. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePixPayment = async (invoiceId: string) => {
    try {
      const response = await fetch('/api/payment/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId,
          provider: 'mercadopago',
          customerData: {
            name: 'Cliente Laboratório',
            email: 'cliente@laboratorio-evcs.com',
            document: '12345678901'
          }
        })
      });
      
      if (!response.ok) throw new Error('Failed to process PIX payment');
      const data = await response.json();
      setPixData(data);
      setActiveTab('payment');
    } catch (error) {
      console.error('Error processing PIX payment:', error);
      throw error;
    }
  };

  const handleBoletoPayment = async (invoiceId: string) => {
    try {
      const response = await fetch('/api/payment/boleto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId,
          provider: 'pagseguro',
          customerData: {
            name: 'Cliente Laboratório',
            email: 'cliente@laboratorio-evcs.com',
            document: '12345678901'
          }
        })
      });
      
      if (!response.ok) throw new Error('Failed to process boleto payment');
      const data = await response.json();
      
      // Open boleto in new window
      if (data.boletoUrl) {
        window.open(data.boletoUrl, '_blank');
      }
    } catch (error) {
      console.error('Error processing boleto payment:', error);
      throw error;
    }
  };

  const pricing = calculatePrice();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciar Assinatura</h1>
        {currentSubscription && (
          <Badge variant={currentSubscription.status === 'active' ? 'default' : 'secondary'}>
            {currentSubscription.status === 'active' ? 'Ativa' : 'Inativa'}
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="plans">Planos</TabsTrigger>
          <TabsTrigger value="payment">Pagamento</TabsTrigger>
          <TabsTrigger value="billing">Faturas</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {currentSubscription ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Assinatura Ativa
                </CardTitle>
                <CardDescription>
                  Sua assinatura está ativa e funcionando normalmente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Calendar className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600">Próximo Pagamento</p>
                    <p className="font-semibold">
                      {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-center">
                    <Users className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <p className="text-sm text-gray-600">Usuários</p>
                    <p className="font-semibold">-/-</p>
                  </div>
                  <div className="text-center">
                    <DollarSign className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                    <p className="text-sm text-gray-600">Valor Mensal</p>
                    <p className="font-semibold">-</p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                    <p className="text-sm text-gray-600">Ensaios Este Mês</p>
                    <p className="font-semibold">-/-</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Você não possui uma assinatura ativa. Escolha um plano para começar.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          {plans.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum plano disponível</h3>
                <p className="text-gray-500 mb-6">
                  Os planos de assinatura não estão configurados no momento. Entre em contato com o administrador do sistema.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <Card key={plan.id} className={`cursor-pointer transition-all ${
                  selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''
                }`} onClick={() => setSelectedPlan(plan.id)}>
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="text-2xl font-bold">
                      R$ {parseFloat(plan.basePrice).toFixed(2)}
                      <span className="text-sm font-normal text-gray-600">/mês</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-600">
                        <Users className="h-4 w-4 inline mr-1" />
                        {plan.maxUsers ? `Até ${plan.maxUsers} usuários` : 'Usuários ilimitados'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <Receipt className="h-4 w-4 inline mr-1" />
                        {plan.maxEnsaios ? `Até ${plan.maxEnsaios} ensaios/mês` : 'Ensaios ilimitados'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {selectedPlan && (
            <Card>
              <CardHeader>
                <CardTitle>Ciclo de Cobrança</CardTitle>
                <CardDescription>Escolha a frequência de pagamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  {cycles.map((cycle) => (
                    <div
                      key={cycle.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedCycle === cycle.id ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedCycle(cycle.id)}
                    >
                      <div className="font-semibold">{cycle.name}</div>
                      {parseFloat(cycle.discountPercent) > 0 && (
                        <Badge variant="secondary" className="mt-2">
                          {cycle.discountPercent}% desconto
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>

                {selectedPlan && selectedCycle && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Resumo do Pedido</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Plano {plans.find(p => p.id === selectedPlan)?.name}:</span>
                        <span>R$ {pricing.basePrice?.toFixed(2)}</span>
                      </div>
                      {pricing.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Desconto ({pricing.discountPercent}%):</span>
                          <span>-R$ {pricing.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold pt-2 border-t">
                        <span>Total:</span>
                        <span>R$ {pricing.finalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPlan && selectedCycle && (
                  <div className="space-y-4">
                    <Label>Forma de Pagamento</Label>
                    <Select value={paymentType} onValueChange={setPaymentType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pix">PIX (Instantâneo)</SelectItem>
                        <SelectItem value="boleto">Boleto Bancário</SelectItem>
                        <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button 
                      onClick={handleSubscribe} 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processando...' : 'Assinar Agora'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-6">
          {pixData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Pagamento PIX
                </CardTitle>
                <CardDescription>
                  Escaneie o QR Code ou copie o código PIX abaixo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="inline-block p-4 bg-white border rounded-lg">
                    <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Código PIX (Copia e Cola)</Label>
                  <div className="flex gap-2 mt-2">
                    <Input 
                      value={pixData.pixCopyPaste || 'Código PIX aqui'} 
                      readOnly 
                      className="font-mono text-xs"
                    />
                    <Button 
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(pixData.pixCopyPaste)}
                    >
                      Copiar
                    </Button>
                  </div>
                </div>

                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Este PIX expira em 30 minutos. Após o pagamento, sua assinatura será ativada automaticamente.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Faturas</CardTitle>
              <CardDescription>Suas faturas e pagamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma fatura encontrada</h3>
                <p className="text-gray-500 mb-6">
                  Suas faturas aparecerão aqui quando você ativar uma assinatura.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}