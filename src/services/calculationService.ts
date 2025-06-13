// Modular calculation services for geotechnical tests

export interface MoistureData {
  wetWeight: number;
  dryWeight: number;
  tare: number;
  capsule?: string;
}

export interface DensityInSituData {
  cylinderVolume: number;
  wetWeight: number;
  moistureTop?: MoistureData[];
  moistureBase?: MoistureData[];
}

export interface RealDensityData {
  picnometerWeight: number;
  picnometerSoilWeight: number;
  picnometerSoilWaterWeight: number;
  picnometerWaterWeight: number;
  temperature: number;
}

export interface MaxMinDensityData {
  maxDensity: {
    cylinderWeight: number;
    cylinderSoilWeight: number;
    cylinderVolume: number;
  };
  minDensity: {
    containerWeight: number;
    containerSoilWeight: number;
    containerVolume: number;
  };
}

// Validation service
export class ValidationService {
  static validateDensity(density: number): boolean {
    return density > 0 && density < 4.0 && !isNaN(density);
  }

  static validateMoisture(moisture: number): boolean {
    return moisture >= 0 && moisture < 100 && !isNaN(moisture);
  }

  static validateWeight(weight: number): boolean {
    return weight > 0 && !isNaN(weight);
  }

  static validateVolume(volume: number): boolean {
    return volume > 0 && !isNaN(volume);
  }

  static validateTemperature(temperature: number): boolean {
    return temperature >= -50 && temperature <= 100 && !isNaN(temperature);
  }
}

// Moisture calculation service
export class MoistureCalculationService {
  static calculateMoisture(data: MoistureData): number {
    if (!ValidationService.validateWeight(data.wetWeight) ||
        !ValidationService.validateWeight(data.dryWeight) ||
        !ValidationService.validateWeight(data.tare)) {
      throw new Error('Invalid weight values for moisture calculation');
    }

    const waterWeight = data.wetWeight - data.dryWeight;
    const dryMaterial = data.dryWeight - data.tare;
    
    if (dryMaterial <= 0) {
      throw new Error('Dry material weight must be positive');
    }

    return (waterWeight / dryMaterial) * 100;
  }

  static calculateAverageMoisture(moistureData: MoistureData[]): number {
    if (!moistureData || moistureData.length === 0) {
      throw new Error('No moisture data provided');
    }

    const moistures = moistureData.map(data => this.calculateMoisture(data));
    const validMoistures = moistures.filter(m => ValidationService.validateMoisture(m));
    
    if (validMoistures.length === 0) {
      throw new Error('No valid moisture calculations');
    }

    return validMoistures.reduce((sum, m) => sum + m, 0) / validMoistures.length;
  }
}

// Density In Situ calculation service
export class DensityInSituCalculationService {
  static calculateWetDensity(cylinderVolume: number, wetWeight: number): number {
    if (!ValidationService.validateVolume(cylinderVolume) ||
        !ValidationService.validateWeight(wetWeight)) {
      throw new Error('Invalid volume or weight values');
    }

    return wetWeight / cylinderVolume;
  }

  static calculateDryDensity(wetDensity: number, moisture: number): number {
    if (!ValidationService.validateDensity(wetDensity) ||
        !ValidationService.validateMoisture(moisture)) {
      throw new Error('Invalid density or moisture values');
    }

    return wetDensity / (1 + moisture / 100);
  }

  static calculateResults(data: DensityInSituData) {
    const wetDensity = this.calculateWetDensity(data.cylinderVolume, data.wetWeight);
    
    let averageMoisture = 0;
    if (data.moistureTop && data.moistureBase) {
      const topMoisture = MoistureCalculationService.calculateAverageMoisture(data.moistureTop);
      const baseMoisture = MoistureCalculationService.calculateAverageMoisture(data.moistureBase);
      averageMoisture = (topMoisture + baseMoisture) / 2;
    }

    const dryDensity = this.calculateDryDensity(wetDensity, averageMoisture);

    return {
      wetDensity,
      averageMoisture,
      dryDensity,
      isValid: ValidationService.validateDensity(dryDensity)
    };
  }
}

// Real Density calculation service
export class RealDensityCalculationService {
  static calculateRealDensity(data: RealDensityData): number {
    if (!ValidationService.validateWeight(data.picnometerWeight) ||
        !ValidationService.validateWeight(data.picnometerSoilWeight) ||
        !ValidationService.validateWeight(data.picnometerSoilWaterWeight) ||
        !ValidationService.validateWeight(data.picnometerWaterWeight) ||
        !ValidationService.validateTemperature(data.temperature)) {
      throw new Error('Invalid input values for real density calculation');
    }

    const soilWeight = data.picnometerSoilWeight - data.picnometerWeight;
    const waterDisplaced = (data.picnometerSoilWeight + data.picnometerWaterWeight) - data.picnometerSoilWaterWeight;
    
    if (waterDisplaced <= 0) {
      throw new Error('Water displaced must be positive');
    }

    const realDensity = soilWeight / waterDisplaced;
    
    // Apply temperature correction
    const correctedDensity = this.applyTemperatureCorrection(realDensity, data.temperature);
    
    return correctedDensity;
  }

  static applyTemperatureCorrection(density: number, temperature: number): number {
    // Temperature correction factor based on water density changes
    // Reference temperature is 20°C
    const referenceTemp = 20;
    const correctionFactor = 1 + (temperature - referenceTemp) * 0.000214;
    
    return density * correctionFactor;
  }
}

// Max/Min Density calculation service
export class MaxMinDensityCalculationService {
  static calculateMaxDensity(cylinderWeight: number, cylinderSoilWeight: number, cylinderVolume: number): number {
    if (!ValidationService.validateWeight(cylinderWeight) ||
        !ValidationService.validateWeight(cylinderSoilWeight) ||
        !ValidationService.validateVolume(cylinderVolume)) {
      throw new Error('Invalid input values for maximum density calculation');
    }

    const soilWeight = cylinderSoilWeight - cylinderWeight;
    
    if (soilWeight <= 0) {
      throw new Error('Soil weight must be positive');
    }

    return soilWeight / (cylinderVolume / 1000); // Convert cm³ to L
  }

  static calculateMinDensity(containerWeight: number, containerSoilWeight: number, containerVolume: number): number {
    if (!ValidationService.validateWeight(containerWeight) ||
        !ValidationService.validateWeight(containerSoilWeight) ||
        !ValidationService.validateVolume(containerVolume)) {
      throw new Error('Invalid input values for minimum density calculation');
    }

    const soilWeight = containerSoilWeight - containerWeight;
    
    if (soilWeight <= 0) {
      throw new Error('Soil weight must be positive');
    }

    return soilWeight / (containerVolume / 1000); // Convert cm³ to L
  }

  static calculateRelativeCompactness(currentDensity: number, minDensity: number, maxDensity: number): number {
    if (!ValidationService.validateDensity(currentDensity) ||
        !ValidationService.validateDensity(minDensity) ||
        !ValidationService.validateDensity(maxDensity)) {
      throw new Error('Invalid density values for relative compactness calculation');
    }

    if (maxDensity <= minDensity) {
      throw new Error('Maximum density must be greater than minimum density');
    }

    return ((currentDensity - minDensity) / (maxDensity - minDensity)) * 100;
  }

  static calculateResults(data: MaxMinDensityData) {
    const maxDensity = this.calculateMaxDensity(
      data.maxDensity.cylinderWeight,
      data.maxDensity.cylinderSoilWeight,
      data.maxDensity.cylinderVolume
    );

    const minDensity = this.calculateMinDensity(
      data.minDensity.containerWeight,
      data.minDensity.containerSoilWeight,
      data.minDensity.containerVolume
    );

    return {
      maxDensity,
      minDensity,
      isValid: ValidationService.validateDensity(maxDensity) && ValidationService.validateDensity(minDensity)
    };
  }
}

// Central calculation service
export class CalculationService {
  static densityInSitu = DensityInSituCalculationService;
  static realDensity = RealDensityCalculationService;
  static maxMinDensity = MaxMinDensityCalculationService;
  static moisture = MoistureCalculationService;
  static validation = ValidationService;
}