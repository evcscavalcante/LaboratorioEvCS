import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

// Estilos profissionais para relatórios técnicos
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#1976D2',
    paddingBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 3,
  },
  description: {
    fontSize: 10,
    color: '#000000',
    marginBottom: 3,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
    marginTop: 15,
    backgroundColor: '#F5F5F5',
    padding: 5,
    textAlign: 'center',
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#1976D2',
    padding: 4,
    flex: 1,
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 4,
    flex: 1,
  },
  tableCellHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 8,
    textAlign: 'center',
  },
  tableCellLeft: {
    fontSize: 8,
    textAlign: 'left',
  },
  moistureTableHeader: {
    backgroundColor: '#4CAF50',
  },
  moistureTableHeaderBase: {
    backgroundColor: '#FF9800',
  },
  resultSection: {
    backgroundColor: '#F8F9FA',
    padding: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  resultTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusApproved: {
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
    padding: 8,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 10,
  },
  statusRejected: {
    backgroundColor: '#F44336',
    color: '#FFFFFF',
    padding: 8,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 10,
  },
  statusPending: {
    backgroundColor: '#FF9800',
    color: '#FFFFFF',
    padding: 8,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666666',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
  },
  infoTable: {
    marginBottom: 15,
  },
});

// Componente para tabela de informações gerais
const InfoTable: React.FC<{ data: any }> = ({ data }) => (
  <View style={[styles.table, styles.infoTable]}>
    <View style={styles.tableRow}>
      <View style={styles.tableColHeader}>
        <Text style={styles.tableCellHeader}>Informações Gerais</Text>
      </View>
      <View style={styles.tableColHeader}>
        <Text style={styles.tableCellHeader}>Dados</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellLeft}>Registro:</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{data.registrationNumber || '-'}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellLeft}>Data:</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{data.date || '-'}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellLeft}>Operador:</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{data.operator || '-'}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellLeft}>Material:</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{data.material || '-'}</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellLeft}>Origem:</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{data.origin || '-'}</Text>
      </View>
    </View>
  </View>
);

// Componente para tabela de umidade
const MoistureTable: React.FC<{ 
  title: string; 
  data1: any; 
  data2: any; 
  data3: any; 
  calculations: any;
  isBase?: boolean;
}> = ({ title, data1, data2, data3, calculations, isBase = false }) => (
  <View style={styles.table}>
    <View style={styles.tableRow}>
      <View style={[styles.tableColHeader, isBase ? styles.moistureTableHeaderBase : styles.moistureTableHeader]}>
        <Text style={styles.tableCellHeader}>{title}</Text>
      </View>
      <View style={[styles.tableColHeader, isBase ? styles.moistureTableHeaderBase : styles.moistureTableHeader]}>
        <Text style={styles.tableCellHeader}>Det 1</Text>
      </View>
      <View style={[styles.tableColHeader, isBase ? styles.moistureTableHeaderBase : styles.moistureTableHeader]}>
        <Text style={styles.tableCellHeader}>Det 2</Text>
      </View>
      <View style={[styles.tableColHeader, isBase ? styles.moistureTableHeaderBase : styles.moistureTableHeader]}>
        <Text style={styles.tableCellHeader}>Det 3</Text>
      </View>
      <View style={[styles.tableColHeader, isBase ? styles.moistureTableHeaderBase : styles.moistureTableHeader]}>
        <Text style={styles.tableCellHeader}>Média</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellLeft}>Cápsula</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{data1?.capsule || '-'}</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{data2?.capsule || '-'}</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{data3?.capsule || '-'}</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>-</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellLeft}>Peso úmido + tara (g)</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{(data1?.wetTare || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{(data2?.wetTare || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{(data3?.wetTare || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>-</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellLeft}>Peso seco + tara (g)</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{(data1?.dryTare || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{(data2?.dryTare || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{(data3?.dryTare || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>-</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellLeft}>Tara (g)</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{(data1?.tare || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{(data2?.tare || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{(data3?.tare || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>-</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellLeft}>Peso água (g)</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{(calculations?.det1?.water || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{(calculations?.det2?.water || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{(calculations?.det3?.water || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>-</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellLeft}>Peso solo seco (g)</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{(calculations?.det1?.dryWeight || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{(calculations?.det2?.dryWeight || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{(calculations?.det3?.dryWeight || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>-</Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellLeft}>Umidade (%)</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{(calculations?.det1?.moisture || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{(calculations?.det2?.moisture || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{(calculations?.det3?.moisture || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCell}>{(calculations?.average || 0).toFixed(2)}</Text>
      </View>
    </View>
  </View>
);

// Componente para Densidade In Situ
const DensityInSituDocument: React.FC<{ data: any; calculations: any }> = ({ data, calculations }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Laboratório Ev.C.S</Text>
        <Text style={styles.subtitle}>Relatório de Densidade In Situ</Text>
        <Text style={styles.description}>Determinação da Densidade Natural - ABNT NBR 9813</Text>
        <Text style={styles.description}>Data de geração: {new Date().toLocaleString('pt-BR')}</Text>
      </View>

      {/* Informações Gerais */}
      <InfoTable data={data} />

      {/* Determinações de Densidade */}
      <Text style={styles.sectionTitle}>Determinações de Densidade</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Campo</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Det 1</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Det 2</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellLeft}>Cilindro Nº</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{data.det1?.cylinderNumber || '-'}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{data.det2?.cylinderNumber || '-'}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellLeft}>Molde + Solo (g)</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{(data.det1?.moldeSolo || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{(data.det2?.moldeSolo || 0).toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellLeft}>Volume (cm³)</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{(data.det1?.volume || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{(data.det2?.volume || 0).toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellLeft}>γnat seco (g/cm³)</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{(calculations.det1?.gammaNatDry || 0).toFixed(3)}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{(calculations.det2?.gammaNatDry || 0).toFixed(3)}</Text>
          </View>
        </View>
      </View>

      {/* Tabelas de Umidade */}
      <Text style={styles.sectionTitle}>Determinação da Umidade</Text>
      <MoistureTable 
        title="Umidade - Topo"
        data1={data.moistureTop1}
        data2={data.moistureTop2}
        data3={data.moistureTop3}
        calculations={calculations.moistureTop}
      />
      
      <MoistureTable 
        title="Umidade - Base"
        data1={data.moistureBase1}
        data2={data.moistureBase2}
        data3={data.moistureBase3}
        calculations={calculations.moistureBase}
        isBase={true}
      />

      {/* Resultados Finais */}
      <View style={styles.resultSection}>
        <Text style={styles.resultTitle}>Resultados Finais</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Parâmetro</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Topo</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Base</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellLeft}>γd (g/cm³)</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{(calculations.results?.gammaDTop || 0).toFixed(3)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{(calculations.results?.gammaDBase || 0).toFixed(3)}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellLeft}>Índice de Vazios</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{calculations.results?.voidIndexTop?.toFixed(3) || 'N/A'}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{calculations.results?.voidIndexBase?.toFixed(3) || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellLeft}>Compacidade Relativa (%)</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{calculations.results?.relativeCompactnessTop?.toFixed(1) || 'N/A'}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{calculations.results?.relativeCompactnessBase?.toFixed(1) || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Status */}
      <View style={
        calculations.results?.status === 'APROVADO' ? styles.statusApproved :
        calculations.results?.status === 'REPROVADO' ? styles.statusRejected :
        styles.statusPending
      }>
        <Text>STATUS DO ENSAIO: {calculations.results?.status || 'AGUARDANDO'}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Relatório gerado automaticamente pelo Sistema Laboratório Ev.C.S</Text>
        <Text>Conforme normas ABNT NBR 6457 e NBR 9813</Text>
      </View>
    </Page>
  </Document>
);

// Componente para Densidade Real
const RealDensityDocument: React.FC<{ data: any; calculations: any }> = ({ data, calculations }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Laboratório Ev.C.S</Text>
        <Text style={styles.subtitle}>Relatório de Densidade Real dos Grãos</Text>
        <Text style={styles.description}>Determinação por Picnometria - ABNT NBR 6457</Text>
        <Text style={styles.description}>Data de geração: {new Date().toLocaleString('pt-BR')}</Text>
      </View>

      {/* Informações Gerais */}
      <InfoTable data={data} />

      {/* Tabela de Umidade */}
      <Text style={styles.sectionTitle}>Determinação da Umidade</Text>
      <MoistureTable 
        title="Teor de Umidade"
        data1={data.moisture1}
        data2={data.moisture2}
        data3={data.moisture3}
        calculations={calculations.moisture}
      />

      {/* Picnômetro */}
      <Text style={styles.sectionTitle}>Picnômetro - Determinações</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Campo</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Det 1</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Det 2</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellLeft}>Massa do Picnômetro (g)</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{(data.picnometer1?.massaPicnometro || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{(data.picnometer2?.massaPicnometro || 0).toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellLeft}>Massa Pic + Amostra + Água (g)</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{(data.picnometer1?.massaPicAmostraAgua || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{(data.picnometer2?.massaPicAmostraAgua || 0).toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellLeft}>Densidade Real (g/cm³)</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{(calculations.picnometer?.det1?.realDensity || 0).toFixed(3)}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{(calculations.picnometer?.det2?.realDensity || 0).toFixed(3)}</Text>
          </View>
        </View>
      </View>

      {/* Resultados */}
      <View style={styles.resultSection}>
        <Text style={styles.resultTitle}>Resultados Finais</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Parâmetro</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Valor</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellLeft}>Densidade Real Média (g/cm³)</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{(calculations.results?.average || 0).toFixed(3)}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellLeft}>Diferença entre Determinações (g/cm³)</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{(calculations.results?.difference || 0).toFixed(3)}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellLeft}>Critério de Aprovação</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Diferença ≤ 0.02 g/cm³</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Status */}
      <View style={
        calculations.results?.status === 'APROVADO' ? styles.statusApproved :
        calculations.results?.status === 'REPROVADO' ? styles.statusRejected :
        styles.statusPending
      }>
        <Text>STATUS DO ENSAIO: {calculations.results?.status || 'AGUARDANDO'}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Relatório gerado automaticamente pelo Sistema Laboratório Ev.C.S</Text>
        <Text>Conforme norma ABNT NBR 6457</Text>
      </View>
    </Page>
  </Document>
);

// Componente para Densidade Máxima/Mínima
const MaxMinDensityDocument: React.FC<{ data: any; calculations: any }> = ({ data, calculations }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Laboratório Ev.C.S</Text>
        <Text style={styles.subtitle}>Relatório de Densidade Máxima e Mínima</Text>
        <Text style={styles.description}>Determinação dos Índices de Vazios - ABNT NBR 9813</Text>
        <Text style={styles.description}>Data de geração: {new Date().toLocaleString('pt-BR')}</Text>
      </View>

      {/* Informações Gerais */}
      <InfoTable data={data} />

      {/* Densidade Máxima */}
      <Text style={styles.sectionTitle}>Densidade Máxima</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Campo</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Det 1</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Det 2</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Det 3</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Média</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellLeft}>γd (g/cm³)</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{(calculations.maxDensity?.det1?.gammaDMax || 0).toFixed(3)}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{(calculations.maxDensity?.det2?.gammaDMax || 0).toFixed(3)}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{(calculations.maxDensity?.det3?.gammaDMax || 0).toFixed(3)}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{(calculations.maxDensity?.average || 0).toFixed(3)}</Text>
          </View>
        </View>
      </View>

      {/* Densidade Mínima */}
      <Text style={styles.sectionTitle}>Densidade Mínima</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Campo</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Det 1</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Det 2</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Det 3</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Média</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellLeft}>γd (g/cm³)</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{(calculations.minDensity?.det1?.gammaDMin || 0).toFixed(3)}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{(calculations.minDensity?.det2?.gammaDMin || 0).toFixed(3)}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{(calculations.minDensity?.det3?.gammaDMin || 0).toFixed(3)}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{(calculations.minDensity?.average || 0).toFixed(3)}</Text>
          </View>
        </View>
      </View>

      {/* Resultados */}
      <View style={styles.resultSection}>
        <Text style={styles.resultTitle}>Resultados Finais</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Parâmetro</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Valor</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellLeft}>emax</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{(calculations.results?.emax || 0).toFixed(3)}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellLeft}>emin</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{(calculations.results?.emin || 0).toFixed(3)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Status */}
      <View style={
        calculations.results?.status === 'APROVADO' ? styles.statusApproved :
        calculations.results?.status === 'REPROVADO' ? styles.statusRejected :
        styles.statusPending
      }>
        <Text>STATUS DO ENSAIO: {calculations.results?.status || 'AGUARDANDO'}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Relatório gerado automaticamente pelo Sistema Laboratório Ev.C.S</Text>
        <Text>Conforme norma ABNT NBR 9813</Text>
      </View>
    </Page>
  </Document>
);

// Funções de exportação
export async function generateDensityInSituPDF(data: any, calculations: any): Promise<void> {
  try {
    const pdfDocument = <DensityInSituDocument data={data} calculations={calculations} />;
    const asPdf = pdf(pdfDocument);
    const blob = await asPdf.toBlob();
    
    const url = URL.createObjectURL(blob);
    const link = globalThis.document.createElement('a');
    link.href = url;
    link.download = `densidade-in-situ-${data.registrationNumber || 'relatorio'}.pdf`;
    globalThis.document.body.appendChild(link);
    link.click();
    globalThis.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
}

export async function generateRealDensityPDF(data: any, calculations: any): Promise<void> {
  try {
    const pdfDocument = <RealDensityDocument data={data} calculations={calculations} />;
    const asPdf = pdf(pdfDocument);
    const blob = await asPdf.toBlob();
    
    const url = URL.createObjectURL(blob);
    const link = globalThis.document.createElement('a');
    link.href = url;
    link.download = `densidade-real-${data.registrationNumber || 'relatorio'}.pdf`;
    globalThis.document.body.appendChild(link);
    link.click();
    globalThis.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
}

export async function generateMaxMinDensityPDF(data: any, calculations: any): Promise<void> {
  try {
    const pdfDocument = <MaxMinDensityDocument data={data} calculations={calculations} />;
    const asPdf = pdf(pdfDocument);
    const blob = await asPdf.toBlob();
    
    const url = URL.createObjectURL(blob);
    const link = globalThis.document.createElement('a');
    link.href = url;
    link.download = `densidade-max-min-${data.registrationNumber || 'relatorio'}.pdf`;
    globalThis.document.body.appendChild(link);
    link.click();
    globalThis.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
}