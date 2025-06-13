import { describe, it, expect } from '@jest/globals';

// Test calculation services for density tests
describe('Density Calculation Services', () => {
  describe('Density In Situ Calculations', () => {
    it('should calculate wet density correctly', () => {
      const testData = {
        cylinderVolume: 100,
        wetWeight: 180.5
      };
      
      const wetDensity = testData.wetWeight / testData.cylinderVolume;
      expect(wetDensity).toBeCloseTo(1.805, 3);
    });

    it('should calculate dry density from wet density and moisture', () => {
      const wetDensity = 1.805;
      const moisture = 12.5; // percentage
      
      const dryDensity = wetDensity / (1 + moisture / 100);
      expect(dryDensity).toBeCloseTo(1.604, 3);
    });

    it('should calculate average moisture from multiple determinations', () => {
      const moistureData = [
        { wetWeight: 25.5, dryWeight: 22.1, tare: 8.2 },
        { wetWeight: 28.3, dryWeight: 24.8, tare: 9.1 },
        { wetWeight: 26.7, dryWeight: 23.2, tare: 8.8 }
      ];

      const moistures = moistureData.map(data => {
        const waterWeight = data.wetWeight - data.dryWeight;
        const dryMaterial = data.dryWeight - data.tare;
        return (waterWeight / dryMaterial) * 100;
      });

      const averageMoisture = moistures.reduce((sum, m) => sum + m, 0) / moistures.length;
      expect(averageMoisture).toBeCloseTo(12.5, 1);
    });

    it('should handle edge cases with zero values', () => {
      const testData = {
        cylinderVolume: 0,
        wetWeight: 180.5
      };
      
      // Should not divide by zero
      const wetDensity = testData.cylinderVolume === 0 ? 0 : testData.wetWeight / testData.cylinderVolume;
      expect(wetDensity).toBe(0);
    });
  });

  describe('Real Density Calculations', () => {
    it('should calculate real density using picnometer method', () => {
      const testData = {
        picnometerWeight: 25.5,
        picnometerSoilWeight: 35.8,
        picnometerSoilWaterWeight: 85.2,
        picnometerWaterWeight: 75.3,
        temperature: 23.5
      };

      const soilWeight = testData.picnometerSoilWeight - testData.picnometerWeight;
      const waterDisplaced = (testData.picnometerSoilWeight + testData.picnometerWaterWeight) - testData.picnometerSoilWaterWeight;
      const realDensity = soilWeight / waterDisplaced;
      
      expect(realDensity).toBeCloseTo(2.65, 2);
    });

    it('should apply temperature correction factor', () => {
      const baseDensity = 2.65;
      const temperature = 25.0;
      
      // Simplified temperature correction (actual formula may vary)
      const correctionFactor = 1 + (temperature - 20) * 0.0002;
      const correctedDensity = baseDensity * correctionFactor;
      
      expect(correctedDensity).toBeGreaterThan(baseDensity);
    });
  });

  describe('Max/Min Density Calculations', () => {
    it('should calculate maximum density from compaction test', () => {
      const testData = {
        cylinderWeight: 2.5,
        cylinderSoilWeight: 4.8,
        cylinderVolume: 1000
      };

      const soilWeight = testData.cylinderSoilWeight - testData.cylinderWeight;
      const maxDensity = soilWeight / (testData.cylinderVolume / 1000); // Convert cm³ to L
      
      expect(maxDensity).toBeCloseTo(2.3, 1);
    });

    it('should calculate minimum density from loose state', () => {
      const testData = {
        containerWeight: 1.2,
        containerSoilWeight: 2.8,
        containerVolume: 1000
      };

      const soilWeight = testData.containerSoilWeight - testData.containerWeight;
      const minDensity = soilWeight / (testData.containerVolume / 1000);
      
      expect(minDensity).toBeCloseTo(1.6, 1);
    });

    it('should calculate relative compactness', () => {
      const currentDensity = 1.85;
      const minDensity = 1.6;
      const maxDensity = 2.3;
      
      const relativeCompactness = ((currentDensity - minDensity) / (maxDensity - minDensity)) * 100;
      expect(relativeCompactness).toBeCloseTo(35.7, 1);
    });
  });

  describe('Validation Tests', () => {
    it('should validate density ranges', () => {
      const validDensities = [1.2, 1.8, 2.5, 2.8];
      const invalidDensities = [0, -1, 5.0, NaN];

      validDensities.forEach(density => {
        expect(density).toBeGreaterThan(0);
        expect(density).toBeLessThan(4.0);
      });

      invalidDensities.forEach(density => {
        expect(density <= 0 || density > 4.0 || isNaN(density)).toBe(true);
      });
    });

    it('should validate moisture content ranges', () => {
      const validMoistures = [5, 12, 25, 35];
      const invalidMoistures = [-5, 100, 150];

      validMoistures.forEach(moisture => {
        expect(moisture).toBeGreaterThanOrEqual(0);
        expect(moisture).toBeLessThan(100);
      });

      invalidMoistures.forEach(moisture => {
        expect(moisture < 0 || moisture >= 100).toBe(true);
      });
    });
  });
});