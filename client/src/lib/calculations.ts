// Water density lookup table based on temperature (°C)
const waterDensityTable: Record<number, number> = {
  20: 0.99823,
  21: 0.99802,
  22: 0.99780,
  23: 0.99757,
  24: 0.99733,
  25: 0.99708,
  26: 0.99681,
  27: 0.99654,
  28: 0.99626,
  29: 0.99597,
  30: 0.99568
};

/**
 * Get water density based on temperature with linear interpolation
 */
export function getWaterDensity(temperature: number): number {
  // If exact temperature exists in table
  if (waterDensityTable[temperature]) {
    return waterDensityTable[temperature];
  }

  // Linear interpolation for temperatures not in table
  const temps = Object.keys(waterDensityTable).map(t => parseFloat(t)).sort((a, b) => a - b);
  
  // Clamp temperature to table bounds
  if (temperature <= temps[0]) {
    return waterDensityTable[temps[0]];
  }
  if (temperature >= temps[temps.length - 1]) {
    return waterDensityTable[temps[temps.length - 1]];
  }

  // Find interpolation bounds
  let lowerTemp = temps[0];
  let upperTemp = temps[temps.length - 1];
  
  for (let i = 0; i < temps.length - 1; i++) {
    if (temperature >= temps[i] && temperature <= temps[i + 1]) {
      lowerTemp = temps[i];
      upperTemp = temps[i + 1];
      break;
    }
  }
  
  const lowerDensity = waterDensityTable[lowerTemp];
  const upperDensity = waterDensityTable[upperTemp];
  
  // Linear interpolation
  return lowerDensity + (upperDensity - lowerDensity) * (temperature - lowerTemp) / (upperTemp - lowerTemp);
}

/**
 * Calculate moisture content from moisture determination data
 */
export function calculateMoistureContent(moistureData: Array<{
  wetTare: number;
  dryTare: number;
  tare: number;
}>): {
  det1: { dryWeight: number; water: number; moisture: number };
  det2: { dryWeight: number; water: number; moisture: number };
  det3: { dryWeight: number; water: number; moisture: number };
  average: number;
} {
  const results = moistureData.map(data => {
    const dryWeight = data.dryTare - data.tare;
    const water = data.wetTare - data.dryTare;
    const moisture = dryWeight > 0 ? (water / dryWeight) * 100 : 0;
    
    return { dryWeight, water, moisture };
  });

  // Calculate average moisture content
  const validMoistures = results.filter(r => r.moisture > 0).map(r => r.moisture);
  const average = validMoistures.length > 0 ? 
    validMoistures.reduce((a, b) => a + b, 0) / validMoistures.length : 0;

  return {
    det1: results[0] || { dryWeight: 0, water: 0, moisture: 0 },
    det2: results[1] || { dryWeight: 0, water: 0, moisture: 0 },
    det3: results[2] || { dryWeight: 0, water: 0, moisture: 0 },
    average
  };
}

/**
 * Calculate density in situ parameters
 */
export function calculateDensityInSitu(
  det1: { moldeSolo: number; molde: number; volume: number },
  det2: { moldeSolo: number; molde: number; volume: number },
  moistureAverage: number
): {
  det1: { soil: number; gammaNatWet: number; gammaNatDry: number };
  det2: { soil: number; gammaNatWet: number; gammaNatDry: number };
  gammaNatDryAvg: number;
} {
  // Calculate soil masses
  const det1Soil = det1.moldeSolo - det1.molde;
  const det2Soil = det2.moldeSolo - det2.molde;

  // Calculate wet densities
  const det1GammaNatWet = det1.volume > 0 ? det1Soil / det1.volume : 0;
  const det2GammaNatWet = det2.volume > 0 ? det2Soil / det2.volume : 0;

  // Calculate dry densities
  const det1GammaNatDry = moistureAverage > 0 ? 
    det1GammaNatWet / (1 + moistureAverage / 100) : det1GammaNatWet;
  const det2GammaNatDry = moistureAverage > 0 ? 
    det2GammaNatWet / (1 + moistureAverage / 100) : det2GammaNatWet;

  // Calculate average dry density
  const gammaNatDryAvg = (det1GammaNatDry + det2GammaNatDry) / 2;

  return {
    det1: { soil: det1Soil, gammaNatWet: det1GammaNatWet, gammaNatDry: det1GammaNatDry },
    det2: { soil: det2Soil, gammaNatWet: det2GammaNatWet, gammaNatDry: det2GammaNatDry },
    gammaNatDryAvg
  };
}

/**
 * Calculate real density using picnometer method
 */
export function calculateRealDensity(
  picnometerData: {
    massaPicnometro: number;
    massaPicAmostraAgua: number;
    massaPicAgua: number;
    temperatura: number;
    massaSoloUmido: number;
  },
  moistureAverage: number
): {
  waterDensity: number;
  dryWeight: number;
  realDensity: number;
} {
  const waterDensity = getWaterDensity(picnometerData.temperatura);
  
  // Calculate dry soil weight
  const dryWeight = moistureAverage > 0 ? 
    picnometerData.massaSoloUmido / (1 + moistureAverage / 100) : 
    picnometerData.massaSoloUmido;

  // Calculate real density using picnometer formula
  // ρs = ms / [Vs] where Vs is calculated from volume displacement
  let realDensity = 0;
  
  if (dryWeight > 0 && picnometerData.massaPicAmostraAgua > picnometerData.massaPicAgua) {
    // Volume of water displaced by sample
    const volumeDisplaced = (picnometerData.massaPicAmostraAgua - picnometerData.massaPicAgua) / waterDensity;
    
    // Volume of soil solids (subtracting volume of water absorbed by soil)
    const soilVolume = volumeDisplaced - (dryWeight / waterDensity);
    
    if (soilVolume > 0) {
      realDensity = dryWeight / soilVolume;
    }
  }

  return {
    waterDensity,
    dryWeight,
    realDensity
  };
}

/**
 * Calculate void index and relative compactness
 */
export function calculateVoidParameters(
  gammaDry: number,
  gammaS: number,
  gammaDMax?: number,
  gammaDMin?: number
): {
  voidIndex: number;
  relativeCompactness?: number;
} {
  // Calculate void index: e = (γs / γd) - 1
  const voidIndex = gammaS > 0 && gammaDry > 0 ? (gammaS / gammaDry) - 1 : 0;

  // Calculate relative compactness if max/min densities are provided
  let relativeCompactness: number | undefined;
  
  if (gammaDMax && gammaDMin && gammaDMax > gammaDMin) {
    const emax = (gammaS / gammaDMin) - 1;
    const emin = (gammaS / gammaDMax) - 1;
    
    if (emax > emin) {
      relativeCompactness = ((emax - voidIndex) / (emax - emin)) * 100;
      // Clamp between 0 and 100
      relativeCompactness = Math.max(0, Math.min(100, relativeCompactness));
    }
  }

  return {
    voidIndex,
    relativeCompactness
  };
}

/**
 * Determine test status based on ABNT standards
 */
export function determineTestStatus(
  testType: "density-in-situ" | "real-density" | "max-min-density",
  values: any
): "AGUARDANDO" | "APROVADO" | "REPROVADO" {
  switch (testType) {
    case "density-in-situ":
      if (values.gammaDry === 0) return "AGUARDANDO";
      return values.gammaDry > 1.5 ? "APROVADO" : "REPROVADO";
      
    case "real-density":
      if (values.difference === 0) return "AGUARDANDO";
      // Corrected criteria: APPROVED if difference ≤ 0.02 g/cm³ (not 0.05)
      return values.difference <= 0.02 && values.average > 0 ? "APROVADO" : "REPROVADO";
      
    case "max-min-density":
      if (values.gammaDMax === 0 && values.gammaDMin === 0) return "AGUARDANDO";
      // Check if there's a reasonable difference between max and min
      return (values.gammaDMax - values.gammaDMin) > 0.1 && values.gammaDMax > 0 && values.gammaDMin > 0 ? 
        "APROVADO" : "REPROVADO";
        
    default:
      return "AGUARDANDO";
  }
}
