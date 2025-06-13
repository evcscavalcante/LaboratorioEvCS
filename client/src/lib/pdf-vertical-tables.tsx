import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

// Estilos otimizados para tabelas verticais
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 9,
  },
  header: {
    marginBottom: 15,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#1976D2',
    paddingBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 3,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
    marginTop: 12,
    backgroundColor: '#F5F5F5',
    padding: 4,
    textAlign: 'center',
  },
  verticalTable: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: 'row',
    minHeight: 18,
  },
  labelCell: {
    width: '40%',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#000000',
    padding: 4,
    backgroundColor: '#F0F0F0',
  },
  dataCell: {
    width: '60%',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#000000',
    padding: 4,
  },
  labelText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000000',
  },
  dataText: {
    fontSize: 8,
    color: '#000000',
  },
  multiColumnTable: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 12,
  },
  headerCell: {
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#000000',
    padding: 4,
    backgroundColor: '#1976D2',
  },
  headerText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  resultSection: {
    backgroundColor: '#F8F9FA',
    padding: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  resultTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 6,
    textAlign: 'center',
  },
  resultValue: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 3,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: 'center',
    fontSize: 7,
    color: '#666666',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
  },
});

// Componente para informações básicas do ensaio
const BasicInfoTable: React.FC<{ data: any }> = ({ data }) => (
  <View style={styles.verticalTable}>
    <Text style={styles.sectionTitle}>INFORMAÇÕES GERAIS</Text>
    <View style={styles.tableRow}>
      <View style={styles.labelCell}>
        <Text style={styles.labelText}>Número de Registro:</Text>
      </View>
      <View style={styles.dataCell}>
        <Text style={styles.dataText}>{data.registrationNumber || '-'}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.labelCell}>
        <Text style={styles.labelText}>Data do Ensaio:</Text>
      </View>
      <View style={styles.dataCell}>
        <Text style={styles.dataText}>{data.date || '-'}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.labelCell}>
        <Text style={styles.labelText}>Horário:</Text>
      </View>
      <View style={styles.dataCell}>
        <Text style={styles.dataText}>{data.time || '-'}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.labelCell}>
        <Text style={styles.labelText}>Operador:</Text>
      </View>
      <View style={styles.dataCell}>
        <Text style={styles.dataText}>{data.operator || '-'}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.labelCell}>
        <Text style={styles.labelText}>Responsável Técnico:</Text>
      </View>
      <View style={styles.dataCell}>
        <Text style={styles.dataText}>{data.technicalResponsible || '-'}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.labelCell}>
        <Text style={styles.labelText}>Verificador:</Text>
      </View>
      <View style={styles.dataCell}>
        <Text style={styles.dataText}>{data.verifier || '-'}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.labelCell}>
        <Text style={styles.labelText}>Material:</Text>
      </View>
      <View style={styles.dataCell}>
        <Text style={styles.dataText}>{data.material || '-'}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.labelCell}>
        <Text style={styles.labelText}>Origem:</Text>
      </View>
      <View style={styles.dataCell}>
        <Text style={styles.dataText}>{data.origin || '-'}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.labelCell}>
        <Text style={styles.labelText}>Coordenadas:</Text>
      </View>
      <View style={styles.dataCell}>
        <Text style={styles.dataText}>{data.coordinates || '-'}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.labelCell}>
        <Text style={styles.labelText}>Quadrante:</Text>
      </View>
      <View style={styles.dataCell}>
        <Text style={styles.dataText}>{data.quadrant || '-'}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.labelCell}>
        <Text style={styles.labelText}>Camada:</Text>
      </View>
      <View style={styles.dataCell}>
        <Text style={styles.dataText}>{data.layer || '-'}</Text>
      </View>
    </View>
  </View>
);

// Componente para dados de densidade in situ
const DensityInSituTable: React.FC<{ data: any }> = ({ data }) => (
  <View style={styles.multiColumnTable}>
    <Text style={styles.sectionTitle}>DETERMINAÇÕES DE DENSIDADE IN SITU</Text>
    <View style={styles.tableRow}>
      <View style={[styles.headerCell, { width: '50%' }]}>
        <Text style={styles.headerText}>Campo</Text>
      </View>
      <View style={[styles.headerCell, { width: '25%' }]}>
        <Text style={styles.headerText}>Det 1</Text>
      </View>
      <View style={[styles.headerCell, { width: '25%' }]}>
        <Text style={styles.headerText}>Det 2</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={[styles.labelCell, { width: '50%' }]}>
        <Text style={styles.labelText}>Cilindro</Text>
      </View>
      <View style={[styles.dataCell, { width: '25%' }]}>
        <Text style={styles.dataText}>{data.det1?.cylinder || '-'}</Text>
      </View>
      <View style={[styles.dataCell, { width: '25%' }]}>
        <Text style={styles.dataText}>{data.det2?.cylinder || '-'}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={[styles.labelCell, { width: '50%' }]}>
        <Text style={styles.labelText}>Solo + Cilindro (g)</Text>
      </View>
      <View style={[styles.dataCell, { width: '25%' }]}>
        <Text style={styles.dataText}>{data.det1?.soilCylinder || '-'}</Text>
      </View>
      <View style={[styles.dataCell, { width: '25%' }]}>
        <Text style={styles.dataText}>{data.det2?.soilCylinder || '-'}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={[styles.labelCell, { width: '50%' }]}>
        <Text style={styles.labelText}>Cilindro (g)</Text>
      </View>
      <View style={[styles.dataCell, { width: '25%' }]}>
        <Text style={styles.dataText}>{data.det1?.cylinderWeight || '-'}</Text>
      </View>
      <View style={[styles.dataCell, { width: '25%' }]}>
        <Text style={styles.dataText}>{data.det2?.cylinderWeight || '-'}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={[styles.labelCell, { width: '50%' }]}>
        <Text style={styles.labelText}>Volume (cm³)</Text>
      </View>
      <View style={[styles.dataCell, { width: '25%' }]}>
        <Text style={styles.dataText}>{data.det1?.volume || '-'}</Text>
      </View>
      <View style={[styles.dataCell, { width: '25%' }]}>
        <Text style={styles.dataText}>{data.det2?.volume || '-'}</Text>
      </View>
    </View>
  </View>
);

// Componente para dados de umidade
const MoistureTable: React.FC<{ title: string; data1: any; data2: any; data3: any; calculations: any }> = ({ 
  title, data1, data2, data3, calculations 
}) => (
  <View style={styles.multiColumnTable}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.tableRow}>
      <View style={[styles.headerCell, { width: '40%' }]}>
        <Text style={styles.headerText}>Campo</Text>
      </View>
      <View style={[styles.headerCell, { width: '20%' }]}>
        <Text style={styles.headerText}>Det 1</Text>
      </View>
      <View style={[styles.headerCell, { width: '20%' }]}>
        <Text style={styles.headerText}>Det 2</Text>
      </View>
      <View style={[styles.headerCell, { width: '20%' }]}>
        <Text style={styles.headerText}>Det 3</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={[styles.labelCell, { width: '40%' }]}>
        <Text style={styles.labelText}>Cápsula</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{data1?.capsule || '-'}</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{data2?.capsule || '-'}</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{data3?.capsule || '-'}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={[styles.labelCell, { width: '40%' }]}>
        <Text style={styles.labelText}>Úmido + Tara (g)</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{(data1?.wetTare || 0).toFixed(2)}</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{(data2?.wetTare || 0).toFixed(2)}</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{(data3?.wetTare || 0).toFixed(2)}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={[styles.labelCell, { width: '40%' }]}>
        <Text style={styles.labelText}>Seco + Tara (g)</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{(data1?.dryTare || 0).toFixed(2)}</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{(data2?.dryTare || 0).toFixed(2)}</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{(data3?.dryTare || 0).toFixed(2)}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={[styles.labelCell, { width: '40%' }]}>
        <Text style={styles.labelText}>Tara (g)</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{(data1?.tare || 0).toFixed(2)}</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{(data2?.tare || 0).toFixed(2)}</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{(data3?.tare || 0).toFixed(2)}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={[styles.labelCell, { width: '40%' }]}>
        <Text style={styles.labelText}>Umidade (%)</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{(calculations?.det1?.moisture || 0).toFixed(2)}</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{(calculations?.det2?.moisture || 0).toFixed(2)}</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{(calculations?.det3?.moisture || 0).toFixed(2)}</Text>
      </View>
    </View>
  </View>
);

// Componente para resultados finais
const ResultsTable: React.FC<{ calculations: any }> = ({ calculations }) => (
  <View style={styles.resultSection}>
    <Text style={styles.resultTitle}>RESULTADOS FINAIS</Text>
    <View style={styles.verticalTable}>
      <View style={styles.tableRow}>
        <View style={styles.labelCell}>
          <Text style={styles.labelText}>Densidade Úmida (g/cm³):</Text>
        </View>
        <View style={styles.dataCell}>
          <Text style={styles.resultValue}>{(calculations?.results?.wetDensity || 0).toFixed(3)}</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.labelCell}>
          <Text style={styles.labelText}>Densidade Seca (g/cm³):</Text>
        </View>
        <View style={styles.dataCell}>
          <Text style={styles.resultValue}>{(calculations?.results?.dryDensity || 0).toFixed(3)}</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.labelCell}>
          <Text style={styles.labelText}>Umidade Média (%):</Text>
        </View>
        <View style={styles.dataCell}>
          <Text style={styles.resultValue}>{(calculations?.results?.averageMoisture || 0).toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.labelCell}>
          <Text style={styles.labelText}>Compacidade Relativa (%):</Text>
        </View>
        <View style={styles.dataCell}>
          <Text style={styles.resultValue}>{(calculations?.results?.relativeCompactness || 0).toFixed(1)}</Text>
        </View>
      </View>
    </View>
  </View>
);

// Documento principal para Densidade In Situ
export const DensityInSituVerticalDocument: React.FC<{ data: any; calculations: any }> = ({ data, calculations }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>LABORATÓRIO Ev.C.S - SISTEMA GEOTÉCNICO</Text>
        <Text style={styles.subtitle}>ENSAIO DE DENSIDADE IN SITU</Text>
        <Text style={styles.subtitle}>NBR 9813:2016</Text>
      </View>

      {/* Informações Básicas */}
      <BasicInfoTable data={data} />

      {/* Dados de Densidade */}
      <DensityInSituTable data={data.determinations || data} />

      {/* Umidade do Topo */}
      <MoistureTable 
        title="DETERMINAÇÃO DE UMIDADE - TOPO"
        data1={data.moistureTop?.det1 || data.moistureTop1}
        data2={data.moistureTop?.det2 || data.moistureTop2}
        data3={data.moistureTop?.det3 || data.moistureTop3}
        calculations={calculations?.moistureTop}
      />

      {/* Umidade da Base */}
      <MoistureTable 
        title="DETERMINAÇÃO DE UMIDADE - BASE"
        data1={data.moistureBase?.det1 || data.moistureBase1}
        data2={data.moistureBase?.det2 || data.moistureBase2}
        data3={data.moistureBase?.det3 || data.moistureBase3}
        calculations={calculations?.moistureBase}
      />

      {/* Resultados */}
      <ResultsTable calculations={calculations} />

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Laboratório Ev.C.S - Sistema Geotécnico | Gerado em: {new Date().toLocaleDateString('pt-BR')}</Text>
      </View>
    </Page>
  </Document>
);

// Componente para ensaio de densidade máxima e mínima
const MaxMinDensityTable: React.FC<{ data: any; type: 'max' | 'min' }> = ({ data, type }) => (
  <View style={styles.multiColumnTable}>
    <Text style={styles.sectionTitle}>
      {type === 'max' ? 'DENSIDADE MÁXIMA' : 'DENSIDADE MÍNIMA'} - 3 DETERMINAÇÕES
    </Text>
    <View style={styles.tableRow}>
      <View style={[styles.headerCell, { width: '40%' }]}>
        <Text style={styles.headerText}>Campo</Text>
      </View>
      <View style={[styles.headerCell, { width: '20%' }]}>
        <Text style={styles.headerText}>Det 1</Text>
      </View>
      <View style={[styles.headerCell, { width: '20%' }]}>
        <Text style={styles.headerText}>Det 2</Text>
      </View>
      <View style={[styles.headerCell, { width: '20%' }]}>
        <Text style={styles.headerText}>Det 3</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={[styles.labelCell, { width: '40%' }]}>
        <Text style={styles.labelText}>Número do Cilindro</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{data?.det1?.cylinderNumber || data?.cylinderNumber1 || '-'}</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{data?.det2?.cylinderNumber || data?.cylinderNumber2 || '-'}</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{data?.det3?.cylinderNumber || data?.cylinderNumber3 || '-'}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={[styles.labelCell, { width: '40%' }]}>
        <Text style={styles.labelText}>Molde + Solo (g)</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{(data?.det1?.moldeSolo || data?.moldeSolo1 || 0).toFixed(2)}</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{(data?.det2?.moldeSolo || data?.moldeSolo2 || 0).toFixed(2)}</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{(data?.det3?.moldeSolo || data?.moldeSolo3 || 0).toFixed(2)}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={[styles.labelCell, { width: '40%' }]}>
        <Text style={styles.labelText}>Molde (g)</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{(data?.det1?.molde || data?.molde1 || 0).toFixed(2)}</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{(data?.det2?.molde || data?.molde2 || 0).toFixed(2)}</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{(data?.det3?.molde || data?.molde3 || 0).toFixed(2)}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={[styles.labelCell, { width: '40%' }]}>
        <Text style={styles.labelText}>Volume (cm³)</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{(data?.det1?.volume || data?.volume1 || 0).toFixed(2)}</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{(data?.det2?.volume || data?.volume2 || 0).toFixed(2)}</Text>
      </View>
      <View style={[styles.dataCell, { width: '20%' }]}>
        <Text style={styles.dataText}>{(data?.det3?.volume || data?.volume3 || 0).toFixed(2)}</Text>
      </View>
    </View>
  </View>
);

// Documento para Densidade Máxima e Mínima
export const MaxMinDensityVerticalDocument: React.FC<{ data: any; calculations: any }> = ({ data, calculations }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>LABORATÓRIO Ev.C.S - SISTEMA GEOTÉCNICO</Text>
        <Text style={styles.subtitle}>ENSAIO DE DENSIDADE MÁXIMA E MÍNIMA</Text>
        <Text style={styles.subtitle}>NBR 12004:2021 / NBR 12051:2021</Text>
      </View>

      {/* Informações Básicas */}
      <BasicInfoTable data={data} />

      {/* Densidade Máxima */}
      <MaxMinDensityTable data={data.maxDensity || data} type="max" />

      {/* Densidade Mínima */}
      <MaxMinDensityTable data={data.minDensity || data} type="min" />

      {/* Umidade */}
      <MoistureTable 
        title="DETERMINAÇÃO DE UMIDADE"
        data1={data.moisture1}
        data2={data.moisture2}
        data3={data.moisture3}
        calculations={calculations?.moisture}
      />

      {/* Resultados Específicos para Max/Min */}
      <View style={styles.resultSection}>
        <Text style={styles.resultTitle}>RESULTADOS FINAIS</Text>
        <View style={styles.verticalTable}>
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>Densidade Máxima (g/cm³):</Text>
            </View>
            <View style={styles.dataCell}>
              <Text style={styles.resultValue}>{(calculations?.results?.gammaDMax || 0).toFixed(3)}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>Densidade Mínima (g/cm³):</Text>
            </View>
            <View style={styles.dataCell}>
              <Text style={styles.resultValue}>{(calculations?.results?.gammaDMin || 0).toFixed(3)}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>Índice de Vazios Máximo:</Text>
            </View>
            <View style={styles.dataCell}>
              <Text style={styles.resultValue}>{(calculations?.results?.emax || 0).toFixed(3)}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>Índice de Vazios Mínimo:</Text>
            </View>
            <View style={styles.dataCell}>
              <Text style={styles.resultValue}>{(calculations?.results?.emin || 0).toFixed(3)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Laboratório Ev.C.S - Sistema Geotécnico | Gerado em: {new Date().toLocaleDateString('pt-BR')}</Text>
      </View>
    </Page>
  </Document>
);

// Documento para Densidade Real
export const RealDensityVerticalDocument: React.FC<{ data: any; calculations: any }> = ({ data, calculations }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>LABORATÓRIO Ev.C.S - SISTEMA GEOTÉCNICO</Text>
        <Text style={styles.subtitle}>ENSAIO DE DENSIDADE REAL DOS GRÃOS</Text>
        <Text style={styles.subtitle}>NBR 6508:2021</Text>
      </View>

      {/* Informações Básicas */}
      <BasicInfoTable data={data} />

      {/* Dados específicos do ensaio de densidade real */}
      <View style={styles.multiColumnTable}>
        <Text style={styles.sectionTitle}>DETERMINAÇÕES - DENSIDADE REAL</Text>
        <View style={styles.tableRow}>
          <View style={[styles.headerCell, { width: '40%' }]}>
            <Text style={styles.headerText}>Campo</Text>
          </View>
          <View style={[styles.headerCell, { width: '20%' }]}>
            <Text style={styles.headerText}>Det 1</Text>
          </View>
          <View style={[styles.headerCell, { width: '20%' }]}>
            <Text style={styles.headerText}>Det 2</Text>
          </View>
          <View style={[styles.headerCell, { width: '20%' }]}>
            <Text style={styles.headerText}>Det 3</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.labelCell, { width: '40%' }]}>
            <Text style={styles.labelText}>Picnômetro</Text>
          </View>
          <View style={[styles.dataCell, { width: '20%' }]}>
            <Text style={styles.dataText}>{data.det1?.picnometer || '-'}</Text>
          </View>
          <View style={[styles.dataCell, { width: '20%' }]}>
            <Text style={styles.dataText}>{data.det2?.picnometer || '-'}</Text>
          </View>
          <View style={[styles.dataCell, { width: '20%' }]}>
            <Text style={styles.dataText}>{data.det3?.picnometer || '-'}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.labelCell, { width: '40%' }]}>
            <Text style={styles.labelText}>Pic + Solo + Água (g)</Text>
          </View>
          <View style={[styles.dataCell, { width: '20%' }]}>
            <Text style={styles.dataText}>{(data.det1?.picSoilWater || 0).toFixed(2)}</Text>
          </View>
          <View style={[styles.dataCell, { width: '20%' }]}>
            <Text style={styles.dataText}>{(data.det2?.picSoilWater || 0).toFixed(2)}</Text>
          </View>
          <View style={[styles.dataCell, { width: '20%' }]}>
            <Text style={styles.dataText}>{(data.det3?.picSoilWater || 0).toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.labelCell, { width: '40%' }]}>
            <Text style={styles.labelText}>Picnômetro + Água (g)</Text>
          </View>
          <View style={[styles.dataCell, { width: '20%' }]}>
            <Text style={styles.dataText}>{(data.det1?.picWater || 0).toFixed(2)}</Text>
          </View>
          <View style={[styles.dataCell, { width: '20%' }]}>
            <Text style={styles.dataText}>{(data.det2?.picWater || 0).toFixed(2)}</Text>
          </View>
          <View style={[styles.dataCell, { width: '20%' }]}>
            <Text style={styles.dataText}>{(data.det3?.picWater || 0).toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.labelCell, { width: '40%' }]}>
            <Text style={styles.labelText}>Peso do Solo Seco (g)</Text>
          </View>
          <View style={[styles.dataCell, { width: '20%' }]}>
            <Text style={styles.dataText}>{(data.det1?.drySoilWeight || 0).toFixed(2)}</Text>
          </View>
          <View style={[styles.dataCell, { width: '20%' }]}>
            <Text style={styles.dataText}>{(data.det2?.drySoilWeight || 0).toFixed(2)}</Text>
          </View>
          <View style={[styles.dataCell, { width: '20%' }]}>
            <Text style={styles.dataText}>{(data.det3?.drySoilWeight || 0).toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.labelCell, { width: '40%' }]}>
            <Text style={styles.labelText}>Temperatura (°C)</Text>
          </View>
          <View style={[styles.dataCell, { width: '20%' }]}>
            <Text style={styles.dataText}>{(data.det1?.temperature || 0).toFixed(1)}</Text>
          </View>
          <View style={[styles.dataCell, { width: '20%' }]}>
            <Text style={styles.dataText}>{(data.det2?.temperature || 0).toFixed(1)}</Text>
          </View>
          <View style={[styles.dataCell, { width: '20%' }]}>
            <Text style={styles.dataText}>{(data.det3?.temperature || 0).toFixed(1)}</Text>
          </View>
        </View>
      </View>

      {/* Resultados */}
      <View style={styles.resultSection}>
        <Text style={styles.resultTitle}>RESULTADOS FINAIS</Text>
        <View style={styles.verticalTable}>
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>Densidade Real Média (g/cm³):</Text>
            </View>
            <View style={styles.dataCell}>
              <Text style={styles.resultValue}>{(calculations?.results?.realDensity || 0).toFixed(3)}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>Desvio Padrão:</Text>
            </View>
            <View style={styles.dataCell}>
              <Text style={styles.resultValue}>{(calculations?.results?.standardDeviation || 0).toFixed(4)}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>Coeficiente de Variação (%):</Text>
            </View>
            <View style={styles.dataCell}>
              <Text style={styles.resultValue}>{(calculations?.results?.coefficientVariation || 0).toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Laboratório Ev.C.S - Sistema Geotécnico | Gerado em: {new Date().toLocaleDateString('pt-BR')}</Text>
      </View>
    </Page>
  </Document>
);

// Função para gerar PDF de Densidade In Situ
export async function generateDensityInSituVerticalPDF(data: any, calculations: any): Promise<void> {
  try {
    const pdfDocument = <DensityInSituVerticalDocument data={data} calculations={calculations} />;
    const asPdf = pdf(pdfDocument);
    const blob = await asPdf.toBlob();
    
    const url = URL.createObjectURL(blob);
    const link = globalThis.document.createElement('a');
    link.href = url;
    link.download = `densidade-in-situ-${data.registrationNumber || 'ensaio'}-${new Date().toISOString().split('T')[0]}.pdf`;
    globalThis.document.body.appendChild(link);
    link.click();
    globalThis.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
}

// Função para gerar PDF de Densidade Máxima e Mínima
export async function generateMaxMinDensityVerticalPDF(data: any, calculations: any): Promise<void> {
  try {
    const pdfDocument = <MaxMinDensityVerticalDocument data={data} calculations={calculations} />;
    const asPdf = pdf(pdfDocument);
    const blob = await asPdf.toBlob();
    
    const url = URL.createObjectURL(blob);
    const link = globalThis.document.createElement('a');
    link.href = url;
    link.download = `densidade-max-min-${data.registrationNumber || 'ensaio'}-${new Date().toISOString().split('T')[0]}.pdf`;
    globalThis.document.body.appendChild(link);
    link.click();
    globalThis.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
}

// Função para gerar PDF de Densidade Real
export async function generateRealDensityVerticalPDF(data: any, calculations: any): Promise<void> {
  try {
    const pdfDocument = <RealDensityVerticalDocument data={data} calculations={calculations} />;
    const asPdf = pdf(pdfDocument);
    const blob = await asPdf.toBlob();
    
    const url = URL.createObjectURL(blob);
    const link = globalThis.document.createElement('a');
    link.href = url;
    link.download = `densidade-real-${data.registrationNumber || 'ensaio'}-${new Date().toISOString().split('T')[0]}.pdf`;
    globalThis.document.body.appendChild(link);
    link.click();
    globalThis.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
}