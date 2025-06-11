import { z } from 'zod';

// Schema de validação para verificação de balança
export const balancaVerificacaoSchema = z.object({
  classExatidao: z.enum(['I', 'II', 'III', 'IIII'], {
    required_error: 'Classe de exatidão é obrigatória',
    invalid_type_error: 'Classe de exatidão inválida'
  }),
  divisaoVerificacao: z.number({
    required_error: 'Divisão de verificação é obrigatória',
    invalid_type_error: 'Divisão de verificação deve ser um número'
  }).positive('Divisão de verificação deve ser positiva').min(0.001, 'Valor mínimo é 0.001g'),
  tipoAvaliacao: z.enum(['aprovacao', 'verificacao'], {
    required_error: 'Tipo de avaliação é obrigatório',
    invalid_type_error: 'Tipo de avaliação inválido'
  }),
  pesoPadrao: z.number({
    required_error: 'Peso padrão é obrigatório',
    invalid_type_error: 'Peso padrão deve ser um número'
  }).positive('Peso padrão deve ser positivo'),
  resultadoMedicao: z.number({
    required_error: 'Resultado da medição é obrigatório',
    invalid_type_error: 'Resultado da medição deve ser um número'
  }).positive('Resultado da medição deve ser positivo'),
  equipamento: z.string().optional(),
  numeroSerie: z.string().optional(),
  responsavel: z.string().optional(),
  local: z.string().optional()
});

// Schema para densidade in situ
export const densidadeInSituSchema = z.object({
  identificacao: z.string().min(1, 'Identificação é obrigatória'),
  dataEnsaio: z.string().min(1, 'Data do ensaio é obrigatória'),
  localizacao: z.string().min(1, 'Localização é obrigatória'),
  profundidade: z.number().positive('Profundidade deve ser positiva'),
  massaCilindro: z.number().positive('Massa do cilindro deve ser positiva'),
  massaCilindroSolo: z.number().positive('Massa do cilindro + solo deve ser positiva'),
  volumeCilindro: z.number().positive('Volume do cilindro deve ser positivo'),
  umidadeNaturalCap1: z.number().min(0, 'Umidade deve ser não negativa'),
  umidadeNaturalCap2: z.number().min(0, 'Umidade deve ser não negativa'),
  umidadeNaturalCap3: z.number().min(0, 'Umidade deve ser não negativa').optional(),
  responsavel: z.string().optional(),
  observacoes: z.string().optional()
}).refine(data => data.massaCilindroSolo > data.massaCilindro, {
  message: 'Massa do cilindro + solo deve ser maior que a massa do cilindro',
  path: ['massaCilindroSolo']
});

// Schema para densidade real
export const densidadeRealSchema = z.object({
  identificacao: z.string().min(1, 'Identificação é obrigatória'),
  dataEnsaio: z.string().min(1, 'Data do ensaio é obrigatória'),
  localizacao: z.string().min(1, 'Localização é obrigatória'),
  massaSeca: z.number().positive('Massa seca deve ser positiva'),
  volumePicnometro: z.number().positive('Volume do picnômetro deve ser positivo'),
  massaPicnometroAgua: z.number().positive('Massa do picnômetro + água deve ser positiva'),
  massaPicnometroAguaSolo: z.number().positive('Massa do picnômetro + água + solo deve ser positiva'),
  temperaturaEnsaio: z.number().min(15, 'Temperatura mínima é 15°C').max(35, 'Temperatura máxima é 35°C'),
  responsavel: z.string().optional(),
  observacoes: z.string().optional()
});

// Schema para densidade máxima e mínima
export const densidadeMaxMinSchema = z.object({
  identificacao: z.string().min(1, 'Identificação é obrigatória'),
  dataEnsaio: z.string().min(1, 'Data do ensaio é obrigatória'),
  localizacao: z.string().min(1, 'Localização é obrigatória'),
  // Densidade Máxima
  massaMolde: z.number().positive('Massa do molde deve ser positiva'),
  volumeMolde: z.number().positive('Volume do molde deve ser positivo'),
  massaMoldeSoloSeco: z.number().positive('Massa do molde + solo seco deve ser positiva'),
  numeroGolpes: z.number().int().min(1, 'Número de golpes deve ser no mínimo 1'),
  // Densidade Mínima
  massaSoloSolto: z.number().positive('Massa do solo solto deve ser positiva'),
  volumeRecipiente: z.number().positive('Volume do recipiente deve ser positivo'),
  responsavel: z.string().optional(),
  observacoes: z.string().optional()
}).refine(data => data.massaMoldeSoloSeco > data.massaMolde, {
  message: 'Massa do molde + solo deve ser maior que a massa do molde',
  path: ['massaMoldeSoloSeco']
});

// Tipos inferenciais dos schemas
export type BalancaVerificacaoData = z.infer<typeof balancaVerificacaoSchema>;
export type DensidadeInSituData = z.infer<typeof densidadeInSituSchema>;
export type DensidadeRealData = z.infer<typeof densidadeRealSchema>;
export type DensidadeMaxMinData = z.infer<typeof densidadeMaxMinSchema>;

// Funções de validação
export const validateBalancaVerificacao = (data: unknown) => {
  return balancaVerificacaoSchema.safeParse(data);
};

export const validateDensidadeInSitu = (data: unknown) => {
  return densidadeInSituSchema.safeParse(data);
};

export const validateDensidadeReal = (data: unknown) => {
  return densidadeRealSchema.safeParse(data);
};

export const validateDensidadeMaxMin = (data: unknown) => {
  return densidadeMaxMinSchema.safeParse(data);
};

// Função para formatar erros de validação
export const formatValidationErrors = (errors: z.ZodError) => {
  return errors.errors.map(error => ({
    field: error.path.join('.'),
    message: error.message
  }));
};

// Validações específicas de negócio
export const validateClasseExatidaoRange = (classe: string, cargaEmE: number): boolean => {
  const ranges: Record<string, { min: number; max: number }> = {
    'I': { min: 0, max: 200000 },
    'II': { min: 0, max: 100000 },
    'III': { min: 0, max: 10000 },
    'IIII': { min: 0, max: 1000 }
  };
  
  const range = ranges[classe];
  return range ? cargaEmE >= range.min && cargaEmE <= range.max : false;
};

export const validateTemperatureCorrection = (temperatura: number): number => {
  // Fator de correção da densidade da água com a temperatura
  const waterDensityCorrections: Record<number, number> = {
    15: 0.99913,
    16: 0.99897,
    17: 0.99880,
    18: 0.99862,
    19: 0.99843,
    20: 0.99823,
    21: 0.99802,
    22: 0.99780,
    23: 0.99757,
    24: 0.99733,
    25: 0.99707,
    26: 0.99681,
    27: 0.99654,
    28: 0.99626,
    29: 0.99597,
    30: 0.99567
  };
  
  return waterDensityCorrections[Math.round(temperatura)] || 0.99823; // Default para 20°C
};

// Função para validar consistência de dados de umidade
export const validateUmidadeConsistency = (umidades: number[]): boolean => {
  if (umidades.length < 2) return false;
  
  const media = umidades.reduce((sum, val) => sum + val, 0) / umidades.length;
  const desvio = Math.sqrt(umidades.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) / umidades.length);
  
  // Desvio padrão não deve exceder 2% da média
  return desvio <= (media * 0.02);
};

// Função para validar precisão de instrumentos
export const validateInstrumentPrecision = (valor: number, precisao: number): boolean => {
  const decimals = (valor.toString().split('.')[1] || '').length;
  const expectedDecimals = Math.abs(Math.log10(precisao));
  return decimals <= expectedDecimals;
};

export default {
  balancaVerificacaoSchema,
  densidadeInSituSchema,
  densidadeRealSchema,
  densidadeMaxMinSchema,
  validateBalancaVerificacao,
  validateDensidadeInSitu,
  validateDensidadeReal,
  validateDensidadeMaxMin,
  formatValidationErrors,
  validateClasseExatidaoRange,
  validateTemperatureCorrection,
  validateUmidadeConsistency,
  validateInstrumentPrecision
};