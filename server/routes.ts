import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { users, organizations, userSessions } from "@shared/schema";
import { 
  insertDensityInSituTestSchema,
  insertRealDensityTestSchema,
  insertMaxMinDensityTestSchema,
  insertUserSchema,
  insertOrganizationSchema
} from "@shared/schema";
import { eq, count } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Density In Situ Routes
  app.get("/api/density-in-situ", async (req, res) => {
    try {
      const tests = await storage.getDensityInSituTests();
      res.json(tests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch density in situ tests" });
    }
  });

  app.get("/api/density-in-situ/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const test = await storage.getDensityInSituTest(id);
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
      res.json(test);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch density in situ test" });
    }
  });

  app.post("/api/density-in-situ", async (req, res) => {
    try {
      const validated = insertDensityInSituTestSchema.parse(req.body);
      const test = await storage.createDensityInSituTest(validated);
      res.status(201).json(test);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create density in situ test" });
      }
    }
  });

  app.put("/api/density-in-situ/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertDensityInSituTestSchema.partial().parse(req.body);
      const test = await storage.updateDensityInSituTest(id, updates);
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
      res.json(test);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update density in situ test" });
      }
    }
  });

  // Real Density Routes
  app.get("/api/real-density", async (req, res) => {
    try {
      const tests = await storage.getRealDensityTests();
      res.json(tests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch real density tests" });
    }
  });

  app.get("/api/real-density/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const test = await storage.getRealDensityTest(id);
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
      res.json(test);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch real density test" });
    }
  });

  app.post("/api/real-density", async (req, res) => {
    try {
      const validated = insertRealDensityTestSchema.parse(req.body);
      const test = await storage.createRealDensityTest(validated);
      res.status(201).json(test);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create real density test" });
      }
    }
  });

  app.put("/api/real-density/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertRealDensityTestSchema.partial().parse(req.body);
      const test = await storage.updateRealDensityTest(id, updates);
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
      res.json(test);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update real density test" });
      }
    }
  });

  // Max Min Density Routes
  app.get("/api/max-min-density", async (req, res) => {
    try {
      const tests = await storage.getMaxMinDensityTests();
      res.json(tests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch max min density tests" });
    }
  });

  app.get("/api/max-min-density/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const test = await storage.getMaxMinDensityTest(id);
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
      res.json(test);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch max min density test" });
    }
  });

  app.post("/api/max-min-density", async (req, res) => {
    try {
      const validated = insertMaxMinDensityTestSchema.parse(req.body);
      const test = await storage.createMaxMinDensityTest(validated);
      res.status(201).json(test);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create max min density test" });
      }
    }
  });

  app.put("/api/max-min-density/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertMaxMinDensityTestSchema.partial().parse(req.body);
      const test = await storage.updateMaxMinDensityTest(id, updates);
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
      res.json(test);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update max min density test" });
      }
    }
  });

  // User Management Routes
  app.get("/api/users", async (req, res) => {
    try {
      const allUsers = await db.select().from(users);
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validated = insertUserSchema.parse(req.body);
      const [user] = await db.insert(users).values(validated).returning();
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update user" });
      }
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(users).where(eq(users.id, id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Organization Management Routes
  app.get("/api/organizations", async (req, res) => {
    try {
      const allOrgs = await db.select().from(organizations);
      res.json(allOrgs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch organizations" });
    }
  });

  app.get("/api/organizations/user-counts", async (req, res) => {
    try {
      const userCounts = await db
        .select({
          organizationId: users.organizationId,
          count: count()
        })
        .from(users)
        .where(eq(users.active, true))
        .groupBy(users.organizationId);
      
      const countsMap = userCounts.reduce((acc, item) => {
        if (item.organizationId) {
          acc[item.organizationId] = item.count;
        }
        return acc;
      }, {} as Record<number, number>);
      
      res.json(countsMap);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user counts" });
    }
  });

  app.post("/api/organizations", async (req, res) => {
    try {
      const validated = insertOrganizationSchema.parse(req.body);
      const [org] = await db.insert(organizations).values(validated).returning();
      res.status(201).json(org);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create organization" });
      }
    }
  });

  app.patch("/api/organizations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const [org] = await db.update(organizations).set(updates).where(eq(organizations.id, id)).returning();
      if (!org) {
        return res.status(404).json({ message: "Organization not found" });
      }
      res.json(org);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update organization" });
      }
    }
  });

  app.delete("/api/organizations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(organizations).where(eq(organizations.id, id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete organization" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
