import { pgTable, text, integer, timestamp, boolean, decimal, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Subscription Plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(), // "Básico", "Profissional", "Enterprise"
  description: text("description"),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  maxUsers: integer("max_users").default(3),
  maxEnsaios: integer("max_ensaios"), // null = ilimitado
  features: text("features").array().default([]), // JSON array de features
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Billing Cycles
export const billingCycles = pgTable("billing_cycles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(), // "Mensal", "Semestral", "Anual"
  months: integer("months").notNull(), // 1, 6, 12
  discountPercent: decimal("discount_percent", { precision: 5, scale: 2 }).default("0"),
  active: boolean("active").default(true)
});

// Organization Subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: integer("organization_id").notNull(),
  planId: uuid("plan_id").notNull(),
  cycleId: uuid("cycle_id").notNull(),
  status: text("status").notNull(), // "active", "cancelled", "past_due", "unpaid"
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  trialEnd: timestamp("trial_end"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Payment Methods
export const paymentMethods = pgTable("payment_methods", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: integer("organization_id").notNull(),
  type: text("type").notNull(), // "credit_card", "pix", "boleto"
  provider: text("provider").notNull(), // "pagseguro", "mercadopago"
  providerMethodId: text("provider_method_id"), // ID no provedor
  lastFour: text("last_four"), // últimos 4 dígitos do cartão
  brand: text("brand"), // Visa, Mastercard, etc
  expiryMonth: integer("expiry_month"),
  expiryYear: integer("expiry_year"),
  isDefault: boolean("is_default").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// Invoices
export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  subscriptionId: uuid("subscription_id").notNull(),
  organizationId: integer("organization_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("BRL"),
  status: text("status").notNull(), // "draft", "open", "paid", "void", "uncollectible"
  dueDate: timestamp("due_date").notNull(),
  paidAt: timestamp("paid_at"),
  attemptCount: integer("attempt_count").default(0),
  description: text("description"),
  invoiceNumber: text("invoice_number").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Payment Transactions
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id").notNull(),
  paymentMethodId: uuid("payment_method_id"),
  provider: text("provider").notNull(), // "pagseguro", "mercadopago"
  providerTransactionId: text("provider_transaction_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(), // "pending", "processing", "paid", "failed", "cancelled"
  paymentType: text("payment_type").notNull(), // "credit_card", "pix", "boleto"
  pixQrCode: text("pix_qr_code"), // Para pagamentos PIX
  pixCopyPaste: text("pix_copy_paste"), // Código PIX copia e cola
  boletoUrl: text("boleto_url"), // URL do boleto
  boletoBarcode: text("boleto_barcode"), // Código de barras do boleto
  paidAt: timestamp("paid_at"),
  expiresAt: timestamp("expires_at"),
  metadata: text("metadata"), // JSON com dados extras do provedor
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Usage Tracking
export const usageRecords = pgTable("usage_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  subscriptionId: uuid("subscription_id").notNull(),
  organizationId: integer("organization_id").notNull(),
  metric: text("metric").notNull(), // "users", "ensaios", "storage_mb"
  quantity: integer("quantity").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: text("metadata") // JSON com dados extras
});

// Relations
export const subscriptionPlansRelations = relations(subscriptionPlans, ({ many }) => ({
  subscriptions: many(subscriptions)
}));

export const billingCyclesRelations = relations(billingCycles, ({ many }) => ({
  subscriptions: many(subscriptions)
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  plan: one(subscriptionPlans, {
    fields: [subscriptions.planId],
    references: [subscriptionPlans.id]
  }),
  cycle: one(billingCycles, {
    fields: [subscriptions.cycleId],
    references: [billingCycles.id]
  }),
  invoices: many(invoices),
  usageRecords: many(usageRecords)
}));

export const paymentMethodsRelations = relations(paymentMethods, ({ many }) => ({
  transactions: many(transactions)
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  subscription: one(subscriptions, {
    fields: [invoices.subscriptionId],
    references: [subscriptions.id]
  }),
  transactions: many(transactions)
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  invoice: one(invoices, {
    fields: [transactions.invoiceId],
    references: [invoices.id]
  }),
  paymentMethod: one(paymentMethods, {
    fields: [transactions.paymentMethodId],
    references: [paymentMethods.id]
  })
}));

export const usageRecordsRelations = relations(usageRecords, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [usageRecords.subscriptionId],
    references: [subscriptions.id]
  })
}));

// Zod Schemas
export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans);
export const insertBillingCycleSchema = createInsertSchema(billingCycles);
export const insertSubscriptionSchema = createInsertSchema(subscriptions);
export const insertPaymentMethodSchema = createInsertSchema(paymentMethods);
export const insertInvoiceSchema = createInsertSchema(invoices);
export const insertTransactionSchema = createInsertSchema(transactions);
export const insertUsageRecordSchema = createInsertSchema(usageRecords);

// Types
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type BillingCycle = typeof billingCycles.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type UsageRecord = typeof usageRecords.$inferSelect;

export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type InsertBillingCycle = z.infer<typeof insertBillingCycleSchema>;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertUsageRecord = z.infer<typeof insertUsageRecordSchema>;

// Payment Status Types
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  PAST_DUE: 'past_due',
  UNPAID: 'unpaid',
  TRIALING: 'trialing'
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  PAID: 'paid',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired'
} as const;

export const PAYMENT_TYPES = {
  CREDIT_CARD: 'credit_card',
  PIX: 'pix',
  BOLETO: 'boleto'
} as const;

export const PAYMENT_PROVIDERS = {
  PAGSEGURO: 'pagseguro',
  MERCADOPAGO: 'mercadopago'
} as const;