import { pgTable, text, serial, json, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
  createdAt: timestamp("created_at").defaultNow(),
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

export type InsertDensityInSituTest = z.infer<typeof insertDensityInSituTestSchema>;
export type InsertRealDensityTest = z.infer<typeof insertRealDensityTestSchema>;
export type InsertMaxMinDensityTest = z.infer<typeof insertMaxMinDensityTestSchema>;

export type DensityInSituTest = typeof densityInSituTests.$inferSelect;
export type RealDensityTest = typeof realDensityTests.$inferSelect;
export type MaxMinDensityTest = typeof maxMinDensityTests.$inferSelect;
