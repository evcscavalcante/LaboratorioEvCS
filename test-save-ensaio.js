// Teste de salvamento de ensaio de densidade in situ
const testData = {
  registrationNumber: "TEST-2025-001",
  date: "2025-06-13",
  time: "15:30",
  operator: "João Silva",
  technicalResponsible: "Dr. Maria Santos",
  verifier: "Carlos Oliveira",
  material: "Areia Fina",
  origin: "Obra Teste - São Paulo",
  coordinates: "23°33'S 46°38'W",
  quadrant: "Q1",
  layer: "Camada Superior",
  balanceId: "BAL-001",
  ovenId: "EST-001",
  realDensityRef: "RD-2025-001",
  maxMinDensityRef: "MM-2025-001",
  determinations: {
    det1: { 
      cylinderNumber: "CIL-001", 
      moldeSolo: 2500.5, 
      molde: 450.2, 
      volume: 1000.0 
    },
    det2: { 
      cylinderNumber: "CIL-002", 
      moldeSolo: 2480.3, 
      molde: 455.1, 
      volume: 1000.0 
    }
  },
  moistureTop: {
    det1: { capsule: "CAP-T1", wetTare: 150.5, dryTare: 140.2, tare: 50.1 },
    det2: { capsule: "CAP-T2", wetTare: 160.3, dryTare: 148.7, tare: 52.2 },
    det3: { capsule: "CAP-T3", wetTare: 155.8, dryTare: 143.4, tare: 51.3 }
  },
  moistureBase: {
    det1: { capsule: "CAP-B1", wetTare: 145.2, dryTare: 135.6, tare: 48.5 },
    det2: { capsule: "CAP-B2", wetTare: 158.9, dryTare: 146.3, tare: 50.8 },
    det3: { capsule: "CAP-B3", wetTare: 152.1, dryTare: 141.7, tare: 49.2 }
  },
  results: {
    gammaDTop: 2.05,
    gammaDBase: 2.02,
    voidIndex: 0,
    relativeCompactness: 85.5,
    voidIndexTop: 0,
    voidIndexBase: 0,
    relativeCompactnessTop: 0,
    relativeCompactnessBase: 0,
    status: "AGUARDANDO"
  }
};

console.log("Dados preparados para teste:", JSON.stringify(testData, null, 2));