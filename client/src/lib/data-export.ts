import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipos para exportação de dados
export interface ExportableTest {
  id: number;
  identificacao: string;
  dataEnsaio: string;
  localizacao: string;
  responsavel?: string;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DensidadeInSituExport extends ExportableTest {
  profundidade: number;
  massaCilindro: number;
  massaCilindroSolo: number;
  volumeCilindro: number;
  umidadeNaturalCap1: number;
  umidadeNaturalCap2: number;
  umidadeNaturalCap3?: number;
  densidadeUmida: number;
  umidadeMedia: number;
  densidadeSeca: number;
}

export interface DensidadeRealExport extends ExportableTest {
  massaSeca: number;
  volumePicnometro: number;
  massaPicnometroAgua: number;
  massaPicnometroAguaSolo: number;
  temperaturaEnsaio: number;
  densidadeReal: number;
}

export interface DensidadeMaxMinExport extends ExportableTest {
  massaMolde: number;
  volumeMolde: number;
  massaMoldeSoloSeco: number;
  numeroGolpes: number;
  massaSoloSolto: number;
  volumeRecipiente: number;
  densidadeMaxima: number;
  densidadeMinima: number;
  indiceVazios: number;
}

// Função para converter dados para CSV
export const exportToCSV = <T extends ExportableTest>(
  data: T[],
  filename: string,
  headers: { [key in keyof T]?: string }
): void => {
  if (data.length === 0) {
    throw new Error('Nenhum dado disponível para exportação');
  }

  // Criar cabeçalhos
  const headerKeys = Object.keys(headers) as (keyof T)[];
  const headerRow = headerKeys.map(key => headers[key] || String(key)).join(',');

  // Criar linhas de dados
  const dataRows = data.map(item => 
    headerKeys.map(key => {
      const value = item[key];
      if (value instanceof Date) {
        return format(value, 'dd/MM/yyyy HH:mm', { locale: ptBR });
      }
      if (typeof value === 'number') {
        return value.toFixed(3).replace('.', ',');
      }
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    }).join(',')
  );

  // Combinar cabeçalhos e dados
  const csvContent = [headerRow, ...dataRows].join('\n');

  // Adicionar BOM para UTF-8
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Download do arquivo
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Função para converter dados para JSON
export const exportToJSON = <T extends ExportableTest>(
  data: T[],
  filename: string
): void => {
  if (data.length === 0) {
    throw new Error('Nenhum dado disponível para exportação');
  }

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Headers específicos para cada tipo de teste
export const densidadeInSituHeaders: { [key in keyof DensidadeInSituExport]?: string } = {
  id: 'ID',
  identificacao: 'Identificação',
  dataEnsaio: 'Data do Ensaio',
  localizacao: 'Localização',
  profundidade: 'Profundidade (m)',
  massaCilindro: 'Massa do Cilindro (g)',
  massaCilindroSolo: 'Massa Cilindro + Solo (g)',
  volumeCilindro: 'Volume do Cilindro (cm³)',
  umidadeNaturalCap1: 'Umidade Cápsula 1 (%)',
  umidadeNaturalCap2: 'Umidade Cápsula 2 (%)',
  umidadeNaturalCap3: 'Umidade Cápsula 3 (%)',
  densidadeUmida: 'Densidade Úmida (g/cm³)',
  umidadeMedia: 'Umidade Média (%)',
  densidadeSeca: 'Densidade Seca (g/cm³)',
  responsavel: 'Responsável',
  observacoes: 'Observações',
  createdAt: 'Data de Criação',
  updatedAt: 'Última Atualização'
};

export const densidadeRealHeaders: { [key in keyof DensidadeRealExport]?: string } = {
  id: 'ID',
  identificacao: 'Identificação',
  dataEnsaio: 'Data do Ensaio',
  localizacao: 'Localização',
  massaSeca: 'Massa Seca (g)',
  volumePicnometro: 'Volume do Picnômetro (ml)',
  massaPicnometroAgua: 'Massa Picnômetro + Água (g)',
  massaPicnometroAguaSolo: 'Massa Picnômetro + Água + Solo (g)',
  temperaturaEnsaio: 'Temperatura do Ensaio (°C)',
  densidadeReal: 'Densidade Real (g/cm³)',
  responsavel: 'Responsável',
  observacoes: 'Observações',
  createdAt: 'Data de Criação',
  updatedAt: 'Última Atualização'
};

export const densidadeMaxMinHeaders: { [key in keyof DensidadeMaxMinExport]?: string } = {
  id: 'ID',
  identificacao: 'Identificação',
  dataEnsaio: 'Data do Ensaio',
  localizacao: 'Localização',
  massaMolde: 'Massa do Molde (g)',
  volumeMolde: 'Volume do Molde (cm³)',
  massaMoldeSoloSeco: 'Massa Molde + Solo Seco (g)',
  numeroGolpes: 'Número de Golpes',
  massaSoloSolto: 'Massa Solo Solto (g)',
  volumeRecipiente: 'Volume do Recipiente (cm³)',
  densidadeMaxima: 'Densidade Máxima (g/cm³)',
  densidadeMinima: 'Densidade Mínima (g/cm³)',
  indiceVazios: 'Índice de Vazios',
  responsavel: 'Responsável',
  observacoes: 'Observações',
  createdAt: 'Data de Criação',
  updatedAt: 'Última Atualização'
};

// Funções específicas para cada tipo de teste
export const exportDensidadeInSituCSV = (data: DensidadeInSituExport[], filename?: string) => {
  const defaultFilename = `densidade-in-situ-${format(new Date(), 'yyyy-MM-dd', { locale: ptBR })}.csv`;
  exportToCSV(data, filename || defaultFilename, densidadeInSituHeaders);
};

export const exportDensidadeRealCSV = (data: DensidadeRealExport[], filename?: string) => {
  const defaultFilename = `densidade-real-${format(new Date(), 'yyyy-MM-dd', { locale: ptBR })}.csv`;
  exportToCSV(data, filename || defaultFilename, densidadeRealHeaders);
};

export const exportDensidadeMaxMinCSV = (data: DensidadeMaxMinExport[], filename?: string) => {
  const defaultFilename = `densidade-max-min-${format(new Date(), 'yyyy-MM-dd', { locale: ptBR })}.csv`;
  exportToCSV(data, filename || defaultFilename, densidadeMaxMinHeaders);
};

export const exportDensidadeInSituJSON = (data: DensidadeInSituExport[], filename?: string) => {
  const defaultFilename = `densidade-in-situ-${format(new Date(), 'yyyy-MM-dd', { locale: ptBR })}.json`;
  exportToJSON(data, filename || defaultFilename);
};

export const exportDensidadeRealJSON = (data: DensidadeRealExport[], filename?: string) => {
  const defaultFilename = `densidade-real-${format(new Date(), 'yyyy-MM-dd', { locale: ptBR })}.json`;
  exportToJSON(data, filename || defaultFilename);
};

export const exportDensidadeMaxMinJSON = (data: DensidadeMaxMinExport[], filename?: string) => {
  const defaultFilename = `densidade-max-min-${format(new Date(), 'yyyy-MM-dd', { locale: ptBR })}.json`;
  exportToJSON(data, filename || defaultFilename);
};

// Função para gerar relatório consolidado
export const generateConsolidatedReport = (
  densidadeInSitu: DensidadeInSituExport[],
  densidadeReal: DensidadeRealExport[],
  densidadeMaxMin: DensidadeMaxMinExport[]
): string => {
  const reportData = {
    relatorio: {
      titulo: 'Relatório Consolidado de Ensaios de Densidade',
      dataGeracao: format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
      resumo: {
        totalEnsaios: densidadeInSitu.length + densidadeReal.length + densidadeMaxMin.length,
        ensaiosDensidadeInSitu: densidadeInSitu.length,
        ensaiosDensidadeReal: densidadeReal.length,
        ensaiosDensidadeMaxMin: densidadeMaxMin.length
      }
    },
    densidadeInSitu: densidadeInSitu,
    densidadeReal: densidadeReal,
    densidadeMaxMin: densidadeMaxMin
  };

  return JSON.stringify(reportData, null, 2);
};

export const exportConsolidatedReport = (
  densidadeInSitu: DensidadeInSituExport[],
  densidadeReal: DensidadeRealExport[],
  densidadeMaxMin: DensidadeMaxMinExport[],
  filename?: string
) => {
  const defaultFilename = `relatorio-consolidado-${format(new Date(), 'yyyy-MM-dd', { locale: ptBR })}.json`;
  const reportContent = generateConsolidatedReport(densidadeInSitu, densidadeReal, densidadeMaxMin);
  
  const blob = new Blob([reportContent], { type: 'application/json;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename || defaultFilename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Função para importar dados de CSV
export const importFromCSV = <T>(
  file: File,
  parser: (row: string[]) => T
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        const lines = csvContent.split('\n');
        
        if (lines.length < 2) {
          throw new Error('Arquivo CSV deve conter pelo menos uma linha de cabeçalho e uma linha de dados');
        }

        // Pular a primeira linha (cabeçalho)
        const dataLines = lines.slice(1).filter(line => line.trim() !== '');
        
        const parsedData = dataLines.map((line, index) => {
          try {
            const row = line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
            return parser(row);
          } catch (error) {
            throw new Error(`Erro na linha ${index + 2}: ${error instanceof Error ? error.message : 'Formato inválido'}`);
          }
        });
        
        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler o arquivo'));
    };
    
    reader.readAsText(file, 'UTF-8');
  });
};

export default {
  exportToCSV,
  exportToJSON,
  exportDensidadeInSituCSV,
  exportDensidadeRealCSV,
  exportDensidadeMaxMinCSV,
  exportDensidadeInSituJSON,
  exportDensidadeRealJSON,
  exportDensidadeMaxMinJSON,
  exportConsolidatedReport,
  importFromCSV,
  generateConsolidatedReport
};