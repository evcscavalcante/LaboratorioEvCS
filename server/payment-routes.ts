import { Express, Request, Response } from 'express';
import { PaymentService, DEFAULT_PLANS, DEFAULT_CYCLES } from './services/payment-service.js';
import { PAYMENT_TYPES, PAYMENT_PROVIDERS } from '../shared/payment-schema.js';

export async function registerPaymentRoutes(app: Express): Promise<void> {
  // Initialize payment service with configuration
  const paymentService = new PaymentService({
    pagseguro: {
      email: process.env.PAGSEGURO_EMAIL || 'vendas@laboratorio-evcs.com',
      token: process.env.PAGSEGURO_TOKEN || 'sandbox_token',
      sandbox: process.env.NODE_ENV !== 'production'
    },
    mercadopago: {
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'sandbox_access_token',
      publicKey: process.env.MERCADOPAGO_PUBLIC_KEY || 'sandbox_public_key',
      sandbox: process.env.NODE_ENV !== 'production'
    }
  });

  // Get available subscription plans
  app.get('/api/subscription/plans', async (req: Request, res: Response) => {
    try {
      const plans = await paymentService.getPlans();
      res.json(plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      res.status(500).json({ error: 'Erro ao buscar planos' });
    }
  });

  // Get billing cycles
  app.get('/api/subscription/cycles', async (req: Request, res: Response) => {
    try {
      const cycles = await paymentService.getBillingCycles();
      res.json(cycles);
    } catch (error) {
      console.error('Error fetching cycles:', error);
      res.status(500).json({ error: 'Erro ao buscar ciclos de cobrança' });
    }
  });

  // Calculate subscription price
  app.post('/api/subscription/calculate-price', async (req: Request, res: Response) => {
    try {
      const { basePrice, cycleDiscountPercent, additionalUsers } = req.body;
      
      const pricing = paymentService.calculateSubscriptionPrice(
        basePrice,
        cycleDiscountPercent || 0,
        additionalUsers || 0
      );
      
      res.json(pricing);
    } catch (error) {
      console.error('Error calculating price:', error);
      res.status(500).json({ error: 'Erro ao calcular preço' });
    }
  });

  // Get current subscription
  app.get('/api/subscription/current', async (req: Request, res: Response) => {
    try {
      const organizationId = req.body.organizationId || 1; // From auth middleware
      const subscription = await paymentService.getSubscription(organizationId);
      res.json(subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      res.status(500).json({ error: 'Erro ao buscar assinatura' });
    }
  });

  // Create subscription
  app.post('/api/subscription/create', async (req: Request, res: Response) => {
    try {
      const { planId, cycleId, trialDays } = req.body;
      const organizationId = req.body.organizationId || 1; // From auth middleware
      
      const subscription = await paymentService.createSubscription({
        organizationId,
        planId,
        cycleId,
        trialDays
      });
      
      res.json(subscription);
    } catch (error) {
      console.error('Error creating subscription:', error);
      res.status(500).json({ error: 'Erro ao criar assinatura' });
    }
  });

  // Get payment methods
  app.get('/api/payment/methods', async (req: Request, res: Response) => {
    try {
      const organizationId = req.body.organizationId || 1; // From auth middleware
      const methods = await paymentService.getPaymentMethods(organizationId);
      res.json(methods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      res.status(500).json({ error: 'Erro ao buscar métodos de pagamento' });
    }
  });

  // Add payment method
  app.post('/api/payment/methods', async (req: Request, res: Response) => {
    try {
      const organizationId = req.body.organizationId || 1; // From auth middleware
      const methodData = { ...req.body, organizationId };
      
      const method = await paymentService.addPaymentMethod(methodData);
      res.json(method);
    } catch (error) {
      console.error('Error adding payment method:', error);
      res.status(500).json({ error: 'Erro ao adicionar método de pagamento' });
    }
  });

  // Get invoices
  app.get('/api/payment/invoices', async (req: Request, res: Response) => {
    try {
      const organizationId = req.body.organizationId || 1; // From auth middleware
      const invoices = await paymentService.getInvoices(organizationId);
      res.json(invoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ error: 'Erro ao buscar faturas' });
    }
  });

  // Create invoice
  app.post('/api/payment/invoices', async (req: Request, res: Response) => {
    try {
      const organizationId = req.body.organizationId || 1; // From auth middleware
      const invoiceData = { ...req.body, organizationId };
      
      const invoice = await paymentService.createInvoice(invoiceData);
      res.json(invoice);
    } catch (error) {
      console.error('Error creating invoice:', error);
      res.status(500).json({ error: 'Erro ao criar fatura' });
    }
  });

  // Process payment
  app.post('/api/payment/process', async (req: Request, res: Response) => {
    try {
      const { invoiceId, paymentType, provider, customerData } = req.body;
      
      if (!invoiceId || !paymentType || !provider) {
        return res.status(400).json({ error: 'Dados de pagamento incompletos' });
      }

      const result = await paymentService.processPayment({
        invoiceId,
        paymentType,
        provider,
        customerData
      });
      
      res.json(result);
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ error: 'Erro ao processar pagamento' });
    }
  });

  // PIX payment endpoint
  app.post('/api/payment/pix', async (req: Request, res: Response) => {
    try {
      const { invoiceId, provider, customerData } = req.body;
      
      const result = await paymentService.processPayment({
        invoiceId,
        paymentType: PAYMENT_TYPES.PIX,
        provider: provider || PAYMENT_PROVIDERS.MERCADOPAGO,
        customerData
      });
      
      res.json({
        success: true,
        transactionId: result.transaction.id,
        pixQrCode: result.paymentInfo.pixQrCode,
        pixCopyPaste: result.paymentInfo.pixCopyPaste,
        expiresAt: result.paymentInfo.expiresAt
      });
    } catch (error) {
      console.error('Error processing PIX payment:', error);
      res.status(500).json({ error: 'Erro ao processar pagamento PIX' });
    }
  });

  // Credit card payment endpoint
  app.post('/api/payment/credit-card', async (req: Request, res: Response) => {
    try {
      const { invoiceId, provider, customerData, cardData } = req.body;
      
      const result = await paymentService.processPayment({
        invoiceId,
        paymentType: PAYMENT_TYPES.CREDIT_CARD,
        provider: provider || PAYMENT_PROVIDERS.PAGSEGURO,
        customerData
      });
      
      res.json({
        success: true,
        transactionId: result.transaction.id,
        status: result.transaction.status
      });
    } catch (error) {
      console.error('Error processing credit card payment:', error);
      res.status(500).json({ error: 'Erro ao processar pagamento com cartão' });
    }
  });

  // Boleto payment endpoint
  app.post('/api/payment/boleto', async (req: Request, res: Response) => {
    try {
      const { invoiceId, provider, customerData } = req.body;
      
      const result = await paymentService.processPayment({
        invoiceId,
        paymentType: PAYMENT_TYPES.BOLETO,
        provider: provider || PAYMENT_PROVIDERS.PAGSEGURO,
        customerData
      });
      
      res.json({
        success: true,
        transactionId: result.transaction.id,
        boletoUrl: result.paymentInfo.boletoUrl,
        boletoBarcode: result.paymentInfo.boletoBarcode,
        expiresAt: result.paymentInfo.expiresAt
      });
    } catch (error) {
      console.error('Error processing boleto payment:', error);
      res.status(500).json({ error: 'Erro ao processar boleto' });
    }
  });

  // Webhook endpoints for payment providers
  app.post('/api/webhooks/pagseguro', async (req: Request, res: Response) => {
    try {
      const result = await paymentService.processWebhook(PAYMENT_PROVIDERS.PAGSEGURO, req.body);
      res.json(result);
    } catch (error) {
      console.error('Error processing PagSeguro webhook:', error);
      res.status(500).json({ error: 'Erro no webhook PagSeguro' });
    }
  });

  app.post('/api/webhooks/mercadopago', async (req: Request, res: Response) => {
    try {
      const result = await paymentService.processWebhook(PAYMENT_PROVIDERS.MERCADOPAGO, req.body);
      res.json(result);
    } catch (error) {
      console.error('Error processing MercadoPago webhook:', error);
      res.status(500).json({ error: 'Erro no webhook MercadoPago' });
    }
  });

  // Usage tracking
  app.post('/api/usage/track', async (req: Request, res: Response) => {
    try {
      const { subscriptionId, metric, quantity } = req.body;
      const organizationId = req.body.organizationId || 1; // From auth middleware
      
      await paymentService.trackUsage(subscriptionId, organizationId, metric, quantity);
      res.json({ success: true });
    } catch (error) {
      console.error('Error tracking usage:', error);
      res.status(500).json({ error: 'Erro ao registrar uso' });
    }
  });

  // Initialize default data if needed
  app.post('/api/subscription/initialize', async (req: Request, res: Response) => {
    try {
      // Create default plans if they don't exist
      const existingPlans = await paymentService.getPlans();
      if (existingPlans.length === 0) {
        for (const plan of DEFAULT_PLANS) {
          await paymentService.createPlan(plan);
        }
      }

      // Create default cycles if they don't exist
      const existingCycles = await paymentService.getBillingCycles();
      if (existingCycles.length === 0) {
        for (const cycle of DEFAULT_CYCLES) {
          await paymentService.createBillingCycle(cycle);
        }
      }

      res.json({ success: true, message: 'Sistema de pagamentos inicializado' });
    } catch (error) {
      console.error('Error initializing payment system:', error);
      res.status(500).json({ error: 'Erro ao inicializar sistema de pagamentos' });
    }
  });

  // Get payment configuration for frontend
  app.get('/api/payment/config', async (req: Request, res: Response) => {
    try {
      const config = {
        providers: [
          {
            id: PAYMENT_PROVIDERS.PAGSEGURO,
            name: 'PagSeguro',
            methods: [PAYMENT_TYPES.CREDIT_CARD, PAYMENT_TYPES.PIX, PAYMENT_TYPES.BOLETO]
          },
          {
            id: PAYMENT_PROVIDERS.MERCADOPAGO,
            name: 'Mercado Pago',
            methods: [PAYMENT_TYPES.CREDIT_CARD, PAYMENT_TYPES.PIX, PAYMENT_TYPES.BOLETO]
          }
        ],
        paymentTypes: [
          { id: PAYMENT_TYPES.CREDIT_CARD, name: 'Cartão de Crédito' },
          { id: PAYMENT_TYPES.PIX, name: 'PIX' },
          { id: PAYMENT_TYPES.BOLETO, name: 'Boleto Bancário' }
        ]
      };
      
      res.json(config);
    } catch (error) {
      console.error('Error fetching payment config:', error);
      res.status(500).json({ error: 'Erro ao buscar configuração de pagamentos' });
    }
  });
}