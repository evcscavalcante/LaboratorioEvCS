import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { DensityInSituTest, RealDensityTest, MaxMinDensityTest } from '@shared/schema';

// Unified PDF generation for all test types
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    borderBottom: '2 solid #2563eb'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 20
  },
  section: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 5
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5
  },
  label: {
    fontSize: 11,
    color: '#6b7280',
    width: '50%'
  },
  value: {
    fontSize: 11,
    color: '#1f2937',
    fontWeight: 'bold',
    width: '50%'
  },
  resultSection: {
    backgroundColor: '#ecfdf5',
    border: '1 solid #10b981',
    borderRadius: 5,
    padding: 10,
    marginTop: 20
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 10
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#6b7280',
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10
  }
});

interface PDFGeneratorProps {
  testData: DensityInSituTest | RealDensityTest | MaxMinDensityTest;
  testType: 'density-in-situ' | 'real-density' | 'max-min-density';
  calculations: any;
}

export function generateUnifiedPDF({ testData, testType, calculations }: PDFGeneratorProps) {
  const getTitle = () => {
    switch (testType) {
      case 'density-in-situ': return 'Relatório - Densidade In Situ (NBR 9813)';
      case 'real-density': return 'Relatório - Densidade Real (Picnômetro)';
      case 'max-min-density': return 'Relatório - Densidade Máxima e Mínima';
      default: return 'Relatório Geotécnico';
    }
  };

  const renderTestData = () => {
    switch (testType) {
      case 'density-in-situ':
        const inSituData = testData as DensityInSituTest;
        return (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dados do Ensaio</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Amostra:</Text>
                <Text style={styles.value}>{inSituData.sampleId}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Localização:</Text>
                <Text style={styles.value}>{inSituData.location}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Data:</Text>
                <Text style={styles.value}>{new Date(inSituData.testDate).toLocaleDateString()}</Text>
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dados Coletados</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Massa Solo Úmido (g):</Text>
                <Text style={styles.value}>{inSituData.wetSoilMass}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Volume Cilindro (cm³):</Text>
                <Text style={styles.value}>{inSituData.cylinderVolume}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Umidade (%):</Text>
                <Text style={styles.value}>{inSituData.moistureContent}</Text>
              </View>
            </View>
          </>
        );
        
      case 'real-density':
        const realData = testData as RealDensityTest;
        return (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dados do Ensaio</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Amostra:</Text>
                <Text style={styles.value}>{realData.sampleId}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Data:</Text>
                <Text style={styles.value}>{new Date(realData.testDate).toLocaleDateString()}</Text>
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dados do Picnômetro</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Massa Picnômetro (g):</Text>
                <Text style={styles.value}>{realData.pycnometerMass}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Massa Picnômetro + Solo (g):</Text>
                <Text style={styles.value}>{realData.pycnometerSoilMass}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Massa Total + Água (g):</Text>
                <Text style={styles.value}>{realData.pycnometerSoilWaterMass}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Temperatura (°C):</Text>
                <Text style={styles.value}>{realData.temperature}</Text>
              </View>
            </View>
          </>
        );
        
      case 'max-min-density':
        const maxMinData = testData as MaxMinDensityTest;
        return (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dados do Ensaio</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Amostra:</Text>
                <Text style={styles.value}>{maxMinData.sampleId}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Data:</Text>
                <Text style={styles.value}>{new Date(maxMinData.testDate).toLocaleDateString()}</Text>
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Estado Solto</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Massa Solo Seco (g):</Text>
                <Text style={styles.value}>{maxMinData.looseDrySoilMass}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Volume (cm³):</Text>
                <Text style={styles.value}>{maxMinData.looseVolume}</Text>
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Estado Compacto</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Massa Solo Seco (g):</Text>
                <Text style={styles.value}>{maxMinData.denseDrySoilMass}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Volume (cm³):</Text>
                <Text style={styles.value}>{maxMinData.denseVolume}</Text>
              </View>
            </View>
          </>
        );
        
      default:
        return null;
    }
  };

  const renderResults = () => {
    switch (testType) {
      case 'density-in-situ':
        return (
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>Resultados - NBR 9813</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Densidade Úmida:</Text>
              <Text style={styles.value}>{calculations.wetDensity?.toFixed(3)} g/cm³</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Densidade Seca:</Text>
              <Text style={styles.value}>{calculations.dryDensity?.toFixed(3)} g/cm³</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>{calculations.status}</Text>
            </View>
          </View>
        );
        
      case 'real-density':
        return (
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>Resultados - Densidade Real</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Massa do Solo:</Text>
              <Text style={styles.value}>{calculations.soilMass?.toFixed(2)} g</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Densidade Real:</Text>
              <Text style={styles.value}>{calculations.realDensity?.toFixed(3)} g/cm³</Text>
            </View>
          </View>
        );
        
      case 'max-min-density':
        return (
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>Resultados - Densidade Máx/Mín</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Densidade Mínima:</Text>
              <Text style={styles.value}>{calculations.minDensity?.toFixed(3)} g/cm³</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Densidade Máxima:</Text>
              <Text style={styles.value}>{calculations.maxDensity?.toFixed(3)} g/cm³</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Índice Vazios Máximo:</Text>
              <Text style={styles.value}>{calculations.maxVoidRatio?.toFixed(3)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Índice Vazios Mínimo:</Text>
              <Text style={styles.value}>{calculations.minVoidRatio?.toFixed(3)}</Text>
            </View>
          </View>
        );
        
      default:
        return null;
    }
  };

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{getTitle()}</Text>
          <Text style={styles.subtitle}>Laboratório Ev.C.S - Sistema Geotécnico</Text>
        </View>

        {renderTestData()}
        {renderResults()}

        <View style={styles.footer}>
          <Text>
            Relatório gerado automaticamente - {new Date().toLocaleDateString()} às {new Date().toLocaleTimeString()}
          </Text>
          <Text>Laboratório Ev.C.S - Cálculos seguindo normas ABNT</Text>
        </View>
      </Page>
    </Document>
  );

  return pdf(<MyDocument />);
}

export async function downloadPDF(props: PDFGeneratorProps, filename?: string) {
  const pdfBlob = await generateUnifiedPDF(props);
  const url = URL.createObjectURL(await pdfBlob.blob());
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `relatorio-${props.testType}-${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}