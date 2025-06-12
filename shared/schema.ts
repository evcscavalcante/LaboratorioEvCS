import { pgTable, text, serial, json, timestamp, real, varchar, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User Management Tables
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  address: text("address"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire").notNull(),
  }
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username").unique().notNull(),
  email: varchar("email").unique(),
  password: varchar("password"),
  name: varchar("name").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { length: 50 }).notNull().default("technician"),
  organizationId: integer("organization_id").references(() => organizations.id),
  permissions: json("permissions"),
  active: boolean("active").default(true),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  deviceInfo: text("device_info"),
  ipAddress: varchar("ip_address", { length: 45 }),
  loginAt: timestamp("login_at").defaultNow(),
  logoutAt: timestamp("logout_at"),
  active: boolean("active").default(true)
});

// Test Tables with User References
export const densityInSituTests = pgTable("density_in_situ_tests", {
  id: serial("id").primaryKey(),
  registrationNumber: text("registration_number").notNull(),
  date: text("date").notNull(),
  time: text("time"),
  operator: text("operator").notNull(),
  technicalResponsible: text("technical_responsible"),
  verifier: text("verifier"),
  material: text("material").notNull(),
  origin: text("origin"),
  coordinates: text("coordinates"),
  quadrant: text("quadrant"),
  layer: text("layer"),
  balanceId: text("balance_id"),
  ovenId: text("oven_id"),
  realDensityRef: text("real_density_ref"),
  maxMinDensityRef: text("max_min_density_ref"),
  userId: integer("user_id").references(() => users.id),
  createdBy: varchar("created_by", { length: 255 }),
  updatedBy: varchar("updated_by", { length: 255 }),
  determinations: json("determinations").$type<{
    det1: {
      cylinderNumber: string;
      moldeSolo: number;
      molde: number;
      volume: number;
    };
    det2: {
      cylinderNumber: string;
      moldeSolo: number;
      molde: number;
      volume: number;
    };
  }>(),
  moistureTop: json("moisture_top").$type<{
    det1: { capsule: string; wetTare: number; dryTare: number; tare: number; };
    det2: { capsule: string; wetTare: number; dryTare: number; tare: number; };
    det3: { capsule: string; wetTare: number; dryTare: number; tare: number; };
  }>(),
  moistureBase: json("moisture_base").$type<{
    det1: { capsule: string; wetTare: number; dryTare: number; tare: number; };
    det2: { capsule: string; wetTare: number; dryTare: number; tare: number; };
    det3: { capsule: string; wetTare: number; dryTare: number; tare: number; };
  }>(),
  results: json("results").$type<{
    gammaDTop: number;
    gammaDBase: number;
    voidIndex: number;
    relativeCompactness: number;
    voidIndexTop: number;
    voidIndexBase: number;
    relativeCompactnessTop: number;
    relativeCompactnessBase: number;
    status: "AGUARDANDO" | "APROVADO" | "REPROVADO";
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const realDensityTests = pgTable("real_density_tests", {
  id: serial("id").primaryKey(),
  registrationNumber: text("registration_number").notNull(),
  date: text("date").notNull(),
  operator: text("operator").notNull(),
  material: text("material").notNull(),
  origin: text("origin"),
  userId: integer("user_id").references(() => users.id),
  createdBy: varchar("created_by", { length: 255 }),
  updatedBy: varchar("updated_by", { length: 255 }),
  moisture: json("moisture").$type<{
    det1: { capsule: string; wetTare: number; dryTare: number; tare: number; };
    det2: { capsule: string; wetTare: number; dryTare: number; tare: number; };
    det3: { capsule: string; wetTare: number; dryTare: number; tare: number; };
  }>(),
  picnometer: json("picnometer").$type<{
    det1: {
      massaPicnometro: number;
      massaPicAmostraAgua: number;
      massaPicAgua: number;
      temperatura: number;
      massaSoloUmido: number;
    };
    det2: {
      massaPicnometro: number;
      massaPicAmostraAgua: number;
      massaPicAgua: number;
      temperatura: number;
      massaSoloUmido: number;
    };
  }>(),
  results: json("results").$type<{
    difference: number;
    average: number;
    status: "AGUARDANDO" | "APROVADO" | "REPROVADO";
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const maxMinDensityTests = pgTable("max_min_density_tests", {
  id: serial("id").primaryKey(),
  registrationNumber: text("registration_number").notNull(),
  date: text("date").notNull(),
  operator: text("operator").notNull(),
  material: text("material").notNull(),
  origin: text("origin"),
  userId: integer("user_id").references(() => users.id),
  createdBy: varchar("created_by", { length: 255 }),
  updatedBy: varchar("updated_by", { length: 255 }),
  maxDensity: json("max_density").$type<{
    det1: { moldeSolo: number; molde: number; volume: number; moisture?: number; };
    det2: { moldeSolo: number; molde: number; volume: number; moisture?: number; };
    det3: { moldeSolo: number; molde: number; volume: number; moisture?: number; };
  }>(),
  minDensity: json("min_density").$type<{
    det1: { moldeSolo: number; molde: number; volume: number; moisture?: number; };
    det2: { moldeSolo: number; molde: number; volume: number; moisture?: number; };
    det3: { moldeSolo: number; molde: number; volume: number; moisture?: number; };
  }>(),
  results: json("results").$type<{
    gammaDMax: number;
    gammaDMin: number;
    emax: number;
    emin: number;
    status: "AGUARDANDO" | "APROVADO" | "REPROVADO";
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users)
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id]
  }),
  sessions: many(userSessions),
  densityInSituTests: many(densityInSituTests),
  realDensityTests: many(realDensityTests),
  maxMinDensityTests: many(maxMinDensityTests)
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id]
  })
}));

export const densityInSituTestsRelations = relations(densityInSituTests, ({ one }) => ({
  user: one(users, {
    fields: [densityInSituTests.userId],
    references: [users.id]
  })
}));

export const realDensityTestsRelations = relations(realDensityTests, ({ one }) => ({
  user: one(users, {
    fields: [realDensityTests.userId],
    references: [users.id]
  })
}));

export const maxMinDensityTestsRelations = relations(maxMinDensityTests, ({ one }) => ({
  user: one(users, {
    fields: [maxMinDensityTests.userId],
    references: [users.id]
  })
}));

// Equipment Management Tables
export const capsulas = pgTable("capsulas", {
  id: serial("id").primaryKey(),
  codigo: varchar("codigo", { length: 50 }).notNull().unique(),
  descricao: text("descricao"),
  peso: real("peso").notNull(),
  material: varchar("material", { length: 100 }),
  fabricante: varchar("fabricante", { length: 255 }),
  dataAquisicao: timestamp("data_aquisicao"),
  status: varchar("status", { length: 50 }).notNull().default("ATIVO"),
  localizacao: varchar("localizacao", { length: 255 }),
  observacoes: text("observacoes"),
  proximaConferencia: timestamp("proxima_conferencia"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const cilindros = pgTable("cilindros", {
  id: serial("id").primaryKey(),
  codigo: varchar("codigo", { length: 50 }).notNull().unique(),
  tipo: varchar("tipo", { length: 50 }).notNull(), // 'biselado', 'proctor', 'cbr', 'vazios_minimos'
  descricao: text("descricao"),
  peso: real("peso").notNull(),
  volume: real("volume").notNull(),
  altura: real("altura"),
  diametro: real("diametro"),
  material: varchar("material", { length: 100 }),
  fabricante: varchar("fabricante", { length: 255 }),
  dataAquisicao: timestamp("data_aquisicao"),
  status: varchar("status", { length: 50 }).notNull().default("ATIVO"),
  localizacao: varchar("localizacao", { length: 255 }),
  observacoes: text("observacoes"),
  proximaConferencia: timestamp("proxima_conferencia"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const conferenciaEquipamentos = pgTable("conferencia_equipamentos", {
  id: serial("id").primaryKey(),
  equipamentoTipo: varchar("equipamento_tipo", { length: 50 }).notNull(), // 'capsula' ou 'cilindro'
  equipamentoId: integer("equipamento_id").notNull(),
  dataConferencia: timestamp("data_conferencia").notNull(),
  responsavel: varchar("responsavel", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(), // 'APROVADO', 'REPROVADO', 'PENDENTE'
  observacoes: text("observacoes"),
  
  // Dados específicos para cápsulas
  pesoAferido: real("peso_aferido"),
  desvioToleranciaPeso: real("desvio_tolerancia_peso"),
  
  // Dados específicos para cilindros
  volumeAferido: real("volume_aferido"),
  alturaAferida: real("altura_aferida"),
  diametroAferido: real("diametro_aferido"),
  desvioToleranciaVolume: real("desvio_tolerancia_volume"),
  desvioToleranciaAltura: real("desvio_tolerancia_altura"),
  desvioToleranciaDiametro: real("desvio_tolerancia_diametro"),
  
  aprovado: boolean("aprovado").notNull(),
  proximaConferencia: timestamp("proxima_conferencia"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Equipment relations
export const capsulasRelations = relations(capsulas, ({ many }) => ({
  conferencias: many(conferenciaEquipamentos)
}));

export const cilindrosRelations = relations(cilindros, ({ many }) => ({
  conferencias: many(conferenciaEquipamentos)
}));

// Equipment Schemas
export const insertCapsulaSchema = createInsertSchema(capsulas).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCilindroSchema = createInsertSchema(cilindros).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConferenciaEquipamentoSchema = createInsertSchema(conferenciaEquipamentos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schemas
export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
});

export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  loginAt: true,
  logoutAt: true,
});

export const insertDensityInSituTestSchema = createInsertSchema(densityInSituTests).omit({
  id: true,
  createdAt: true,
});

export const insertRealDensityTestSchema = createInsertSchema(realDensityTests).omit({
  id: true,
  createdAt: true,
});

export const insertMaxMinDensityTestSchema = createInsertSchema(maxMinDensityTests).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;

export type Organization = typeof organizations.$inferSelect;
export type User = typeof users.$inferSelect;
export type UserSession = typeof userSessions.$inferSelect;

export type InsertDensityInSituTest = z.infer<typeof insertDensityInSituTestSchema>;
export type InsertRealDensityTest = z.infer<typeof insertRealDensityTestSchema>;
export type InsertMaxMinDensityTest = z.infer<typeof insertMaxMinDensityTestSchema>;

export type InsertCapsula = z.infer<typeof insertCapsulaSchema>;
export type InsertCilindro = z.infer<typeof insertCilindroSchema>;
export type InsertConferenciaEquipamento = z.infer<typeof insertConferenciaEquipamentoSchema>;

export type DensityInSituTest = typeof densityInSituTests.$inferSelect;
export type RealDensityTest = typeof realDensityTests.$inferSelect;
export type MaxMinDensityTest = typeof maxMinDensityTests.$inferSelect;

export type Capsula = typeof capsulas.$inferSelect;
export type Cilindro = typeof cilindros.$inferSelect;
export type ConferenciaEquipamento = typeof conferenciaEquipamentos.$inferSelect;

// User role definitions
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager', 
  SUPERVISOR: 'supervisor',
  TECHNICIAN: 'technician',
  VIEWER: 'viewer'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Permission system
export const PERMISSIONS = {
  // User management
  MANAGE_USERS: 'manage_users',
  VIEW_USERS: 'view_users',
  MANAGE_ORGANIZATIONS: 'manage_organizations',
  
  // Test management
  CREATE_TESTS: 'create_tests',
  EDIT_TESTS: 'edit_tests',
  DELETE_TESTS: 'delete_tests',
  VIEW_TESTS: 'view_tests',
  APPROVE_TESTS: 'approve_tests',
  
  // Reports
  GENERATE_REPORTS: 'generate_reports',
  VIEW_ANALYTICS: 'view_analytics',
  EXPORT_DATA: 'export_data',
  
  // System
  VIEW_SYSTEM_LOGS: 'view_system_logs',
  MANAGE_SETTINGS: 'manage_settings'
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [USER_ROLES.ADMIN]: Object.values(PERMISSIONS),
  [USER_ROLES.MANAGER]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_TESTS,
    PERMISSIONS.EDIT_TESTS,
    PERMISSIONS.DELETE_TESTS,
    PERMISSIONS.VIEW_TESTS,
    PERMISSIONS.APPROVE_TESTS,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.MANAGE_SETTINGS
  ],
  [USER_ROLES.SUPERVISOR]: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_TESTS,
    PERMISSIONS.EDIT_TESTS,
    PERMISSIONS.VIEW_TESTS,
    PERMISSIONS.APPROVE_TESTS,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_DATA
  ],
  [USER_ROLES.TECHNICIAN]: [
    PERMISSIONS.CREATE_TESTS,
    PERMISSIONS.EDIT_TESTS,
    PERMISSIONS.VIEW_TESTS,
    PERMISSIONS.GENERATE_REPORTS
  ],
  [USER_ROLES.VIEWER]: [
    PERMISSIONS.VIEW_TESTS,
    PERMISSIONS.VIEW_ANALYTICS
  ]
};