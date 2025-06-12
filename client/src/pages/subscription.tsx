import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Check, 
  Users, 
  Receipt, 
  CreditCard, 
  QrCode, 
  Clock, 
  FileText
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  maxUsers: number | null;
  maxTests: number | null;
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
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
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
      setPlans(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading plans:', error);
      setPlans([]);
    }
  };

  const loadCycles = async () => {
    try {
      const response = await fetch('/api/subscription/cycles');
      const data = await response.json();
      setCycles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading cycles:', error);
      setCycles([]);
    }
  };

  const loadCurrentSubscription = async () => {
    try {
      const response = await fetch('/api/subscription/current');
      if (response.ok) {
        const data = await response.json();
        setCurrentSubscription(data);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const response = await fetch('/api/payment/methods');
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
      setPaymentMethods([]);
    }
  };

  const calculatePrice = () => {
    const plan = plans?.find(p => p.id === selectedPlan);
    const cycle = cycles?.find(c => c.id === selectedCycle);
    
    if (!plan || !cycle) return { finalPrice: 0, discount: 0 };
    
    const basePrice = plan.price;
    const discountPercent = parseFloat(cycle.discountPercent);
    const discount = basePrice * (discountPercent / 100);
    const finalPrice = basePrice - discount;
    
    return { finalPrice, discount, basePrice, discountPercent };
  };

  const handleSubscribe = async () => {
    if (!selectedPlan || !selectedCycle) return;
    
    setIsLoading(true);
    try {
      const pricing = calculatePrice();
      
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
      
      // Create payment
      const paymentResponse = await fetch(`/api/payment/${paymentType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice.id,
          amount: pricing.finalPrice
        })
      });
      
      if (!paymentResponse.ok) throw new Error('Failed to create payment');
      const payment = await paymentResponse.json();
      
      if (paymentType === 'pix') {
        setPixData(payment);
        setActiveTab('payment');
      }
      
    } catch (error) {
      console.error('Error creating subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pricing = calculatePrice();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciar Assinatura</h1>
        {currentSubscription && (
          <Badge variant={currentSubscription.status === 'active' ? 'default' : 'destructive'}>
            {currentSubscription.status === 'active' ? 'Ativo' : 'Inativo'}
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="plans">Planos</TabsTrigger>
          <TabsTrigger value="payment">Pagamento</TabsTrigger>
          <TabsTrigger value="billing">Cobrança</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status da Assinatura</CardTitle>
              <CardDescription>
                Informações sobre sua assinatura atual
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentSubscription ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Plano Atual</Label>
                      <p className="text-lg font-semibold">{currentSubscription.planName}</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge variant={currentSubscription.status === 'active' ? 'default' : 'destructive'}>
                        {currentSubscription.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <div>
                      <Label>Próxima Cobrança</Label>
                      <p>{new Date(currentSubscription.currentPeriodEnd).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <Label>Valor Mensal</Label>
                      <p className="text-lg font-semibold">R$ {currentSubscription.amount}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">Nenhuma assinatura ativa</h3>
                  <p className="text-gray-500 mb-4">
                    Escolha um plano para começar a usar o sistema
                  </p>
                  <Button onClick={() => setActiveTab('plans')}>
                    Ver Planos Disponíveis
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          {plans.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Planos Indisponíveis</CardTitle>
              </CardHeader>
              <CardContent>
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
                      R$ {plan.price.toFixed(2)}
                      <span className="text-sm font-normal text-gray-600">/mês</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <p className="text-sm text-gray-600">
                        <Users className="h-4 w-4 inline mr-1" />
                        {plan.maxUsers ? `Até ${plan.maxUsers} usuários` : 'Usuários ilimitados'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <Receipt className="h-4 w-4 inline mr-1" />
                        {plan.maxTests ? `Até ${plan.maxTests} ensaios/mês` : 'Ensaios ilimitados'}
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
                  Pagamento via PIX
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
              <CardTitle>Histórico de Cobrança</CardTitle>
              <CardDescription>
                Suas faturas e pagamentos anteriores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma fatura encontrada</h3>
                <p className="text-gray-500">
                  Quando você tiver assinaturas ativas, as faturas aparecerão aqui.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}