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

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firebaseUid: varchar("firebase_uid", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("technician"), // admin, manager, supervisor, technician, viewer
  organizationId: integer("organization_id").references(() => organizations.id),
  permissions: json("permissions"), // JSON object with specific permissions
  active: boolean("active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
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

// Updated test tables to include user tracking
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
  userId: integer("user_id").references(() => users.id),
  createdBy: varchar("created_by", { length: 255 }),
  updatedBy: varchar("updated_by", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const maxMinDensityTests = pgTable("max_min_density_tests", {
  id: serial("id").primaryKey(),
  registrationNumber: text("registration_number").notNull(),
  date: text("date").notNull(),
  operator: text("operator").notNull(),
  material: text("material").notNull(),
  origin: text("origin"),
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
  userId: integer("user_id").references(() => users.id),
  createdBy: varchar("created_by", { length: 255 }),
  updatedBy: varchar("updated_by", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// User management schemas
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

// Test schemas
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

// User management types
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;

export type Organization = typeof organizations.$inferSelect;
export type User = typeof users.$inferSelect;
export type UserSession = typeof userSessions.$inferSelect;

// Test types
export type InsertDensityInSituTest = z.infer<typeof insertDensityInSituTestSchema>;
export type InsertRealDensityTest = z.infer<typeof insertRealDensityTestSchema>;
export type InsertMaxMinDensityTest = z.infer<typeof insertMaxMinDensityTestSchema>;

export type DensityInSituTest = typeof densityInSituTests.$inferSelect;
export type RealDensityTest = typeof realDensityTests.$inferSelect;
export type MaxMinDensityTest = typeof maxMinDensityTests.$inferSelect;

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
