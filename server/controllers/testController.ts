import { Request, Response } from 'express';
import { storage } from '../storage';
import { insertDensityInSituTestSchema, insertRealDensityTestSchema, insertMaxMinDensityTestSchema } from '@shared/schema';
import { calculateDensityInSitu, calculateRealDensity, calculateVoidParameters } from '../../client/src/lib/calculations';

export class TestController {
  // Density In Situ Tests
  static async createDensityInSituTest(req: Request, res: Response) {
    try {
      const validatedData = insertDensityInSituTestSchema.parse(req.body);
      const test = await storage.createDensityInSituTest(validatedData);
      
      // Calculate results
      const calculations = calculateDensityInSitu({
        wetSoilMass: test.wetSoilMass,
        cylinderVolume: test.cylinderVolume,
        moistureContent: test.moistureContent
      });
      
      res.status(201).json({ test, calculations });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid data' });
    }
  }

  static async getDensityInSituTests(req: Request, res: Response) {
    try {
      const tests = await storage.getDensityInSituTests();
      res.json(tests);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tests' });
    }
  }

  static async getDensityInSituTest(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const test = await storage.getDensityInSituTest(id);
      
      if (!test) {
        return res.status(404).json({ error: 'Test not found' });
      }
      
      const calculations = calculateDensityInSitu({
        wetSoilMass: test.wetSoilMass,
        cylinderVolume: test.cylinderVolume,
        moistureContent: test.moistureContent
      });
      
      res.json({ test, calculations });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch test' });
    }
  }

  static async updateDensityInSituTest(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertDensityInSituTestSchema.partial().parse(req.body);
      const test = await storage.updateDensityInSituTest(id, validatedData);
      
      if (!test) {
        return res.status(404).json({ error: 'Test not found' });
      }
      
      const calculations = calculateDensityInSitu({
        wetSoilMass: test.wetSoilMass,
        cylinderVolume: test.cylinderVolume,
        moistureContent: test.moistureContent
      });
      
      res.json({ test, calculations });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid data' });
    }
  }

  // Real Density Tests
  static async createRealDensityTest(req: Request, res: Response) {
    try {
      const validatedData = insertRealDensityTestSchema.parse(req.body);
      const test = await storage.createRealDensityTest(validatedData);
      
      const calculations = calculateRealDensity({
        pycnometerMass: test.pycnometerMass,
        pycnometerSoilMass: test.pycnometerSoilMass,
        pycnometerSoilWaterMass: test.pycnometerSoilWaterMass,
        temperature: test.temperature
      });
      
      res.status(201).json({ test, calculations });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid data' });
    }
  }

  static async getRealDensityTests(req: Request, res: Response) {
    try {
      const tests = await storage.getRealDensityTests();
      res.json(tests);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tests' });
    }
  }

  static async getRealDensityTest(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const test = await storage.getRealDensityTest(id);
      
      if (!test) {
        return res.status(404).json({ error: 'Test not found' });
      }
      
      const calculations = calculateRealDensity({
        pycnometerMass: test.pycnometerMass,
        pycnometerSoilMass: test.pycnometerSoilMass,
        pycnometerSoilWaterMass: test.pycnometerSoilWaterMass,
        temperature: test.temperature
      });
      
      res.json({ test, calculations });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch test' });
    }
  }

  static async updateRealDensityTest(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertRealDensityTestSchema.partial().parse(req.body);
      const test = await storage.updateRealDensityTest(id, validatedData);
      
      if (!test) {
        return res.status(404).json({ error: 'Test not found' });
      }
      
      const calculations = calculateRealDensity({
        pycnometerMass: test.pycnometerMass,
        pycnometerSoilMass: test.pycnometerSoilMass,
        pycnometerSoilWaterMass: test.pycnometerSoilWaterMass,
        temperature: test.temperature
      });
      
      res.json({ test, calculations });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid data' });
    }
  }

  // Max Min Density Tests
  static async createMaxMinDensityTest(req: Request, res: Response) {
    try {
      const validatedData = insertMaxMinDensityTestSchema.parse(req.body);
      const test = await storage.createMaxMinDensityTest(validatedData);
      
      const calculations = calculateVoidParameters({
        looseDrySoilMass: test.looseDrySoilMass,
        looseVolume: test.looseVolume,
        denseDrySoilMass: test.denseDrySoilMass,
        denseVolume: test.denseVolume,
        specificGravity: test.specificGravity || 2.65
      });
      
      res.status(201).json({ test, calculations });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid data' });
    }
  }

  static async getMaxMinDensityTests(req: Request, res: Response) {
    try {
      const tests = await storage.getMaxMinDensityTests();
      res.json(tests);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tests' });
    }
  }

  static async getMaxMinDensityTest(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const test = await storage.getMaxMinDensityTest(id);
      
      if (!test) {
        return res.status(404).json({ error: 'Test not found' });
      }
      
      const calculations = calculateVoidParameters({
        looseDrySoilMass: test.looseDrySoilMass,
        looseVolume: test.looseVolume,
        denseDrySoilMass: test.denseDrySoilMass,
        denseVolume: test.denseVolume,
        specificGravity: test.specificGravity || 2.65
      });
      
      res.json({ test, calculations });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch test' });
    }
  }

  static async updateMaxMinDensityTest(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertMaxMinDensityTestSchema.partial().parse(req.body);
      const test = await storage.updateMaxMinDensityTest(id, validatedData);
      
      if (!test) {
        return res.status(404).json({ error: 'Test not found' });
      }
      
      const calculations = calculateVoidParameters({
        looseDrySoilMass: test.looseDrySoilMass,
        looseVolume: test.looseVolume,
        denseDrySoilMass: test.denseDrySoilMass,
        denseVolume: test.denseVolume,
        specificGravity: test.specificGravity || 2.65
      });
      
      res.json({ test, calculations });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid data' });
    }
  }
}