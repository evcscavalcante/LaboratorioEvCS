// Canvas-based report generator for high-quality technical reports

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 5,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 5,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '33.33%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableColHeader: {
    width: '33.33%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    backgroundColor: '#F5F5F5',
  },
  tableCell: {
    fontSize: 9,
    textAlign: 'center',
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 5,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 12,
    marginBottom: 5,
  },
  statusApproved: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: 10,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 15,
  },
  statusRejected: {
    backgroundColor: '#F44336',
    color: 'white',
    padding: 10,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 15,
  },
  statusPending: {
    backgroundColor: '#FF9800',
    color: 'white',
    padding: 10,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666666',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    width: '30%',
  },
  infoValue: {
    fontSize: 10,
    width: '70%',
  },
});

// Componente para PDF de Densidade In Situ
const DensityInSituPDF: React.FC<{ data: any; calculations: any }> = ({ data, calculations }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Laboratório Ev.C.S</Text>
        <Text style={styles.subtitle}>Relatório de Densidade In Situ</Text>
        <Text style={styles.description}>Determinação da Densidade Natural - ABNT NBR 9813</Text>
        <Text style={styles.description}>Data de geração: {new Date().toLocaleString('pt-BR')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações Gerais</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Registro:</Text>
          <Text style={styles.infoValue}>{data.registrationNumber}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Data:</Text>
          <Text style={styles.infoValue}>{data.date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Operador:</Text>
          <Text style={styles.infoValue}>{data.operator}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Material:</Text>
          <Text style={styles.infoValue}>{data.material}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Origem:</Text>
          <Text style={styles.infoValue}>{data.origin || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Coordenadas:</Text>
          <Text style={styles.infoValue}>{data.coordinates || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.section}>
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
              <Text style={styles.tableCell}>Molde + Solo (g)</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{data.det1?.moldeSolo?.toFixed(2) || '0.00'}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{data.det2?.moldeSolo?.toFixed(2) || '0.00'}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Volume (cm³)</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{data.det1?.volume?.toFixed(2) || '0.00'}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{data.det2?.volume?.toFixed(2) || '0.00'}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>γnat seco (g/cm³)</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{calculations.det1?.gammaNatDry?.toFixed(3) || '0.000'}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{calculations.det2?.gammaNatDry?.toFixed(3) || '0.000'}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.resultSection}>
        <Text style={styles.resultTitle}>Resultados Finais</Text>
        <Text style={styles.resultText}>γd Topo: {calculations.results?.gammaDTop?.toFixed(3) || '0.000'} g/cm³</Text>
        <Text style={styles.resultText}>γd Base: {calculations.results?.gammaDBase?.toFixed(3) || '0.000'} g/cm³</Text>
        <Text style={styles.resultText}>Índice de Vazios Topo: {calculations.results?.voidIndexTop?.toFixed(3) || 'N/A'}</Text>
        <Text style={styles.resultText}>Índice de Vazios Base: {calculations.results?.voidIndexBase?.toFixed(3) || 'N/A'}</Text>
        <Text style={styles.resultText}>Compacidade Relativa Topo: {calculations.results?.relativeCompactnessTop?.toFixed(1) || 'N/A'}%</Text>
        <Text style={styles.resultText}>Compacidade Relativa Base: {calculations.results?.relativeCompactnessBase?.toFixed(1) || 'N/A'}%</Text>
        
        <View style={
          calculations.results?.status === 'APROVADO' ? styles.statusApproved :
          calculations.results?.status === 'REPROVADO' ? styles.statusRejected :
          styles.statusPending
        }>
          <Text>STATUS DO ENSAIO: {calculations.results?.status || 'AGUARDANDO'}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>Relatório gerado automaticamente pelo Sistema Laboratório Ev.C.S</Text>
        <Text>Conforme normas ABNT NBR 6457 e NBR 9813</Text>
      </View>
    </Page>
  </Document>
);

/**
 * Generate PDF for Density In Situ test
 */
export async function generateDensityInSituPDF(data: any, calculations: any): Promise<void> {
  try {
    const doc = React.createElement(DensityInSituPDF, { data, calculations });
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `densidade-in-situ-${data.registrationNumber || 'relatorio'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
}

/**
 * Generate PDF for Real Density test
 */
export async function generateRealDensityPDF(data: any, calculations: any): Promise<void> {
  try {
    // Simple PDF generation for Real Density
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');
    
    canvas.width = 800;
    canvas.height = 600;
    
    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Header
    ctx.fillStyle = '#1976D2';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Laboratório Ev.C.S', canvas.width / 2, 50);
    
    ctx.fillStyle = '#666666';
    ctx.font = '18px Arial';
    ctx.fillText('Relatório de Densidade Real dos Grãos', canvas.width / 2, 80);
    
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.fillText('Determinação por Picnometria - ABNT NBR 6457', canvas.width / 2, 105);
    
    // Information
    ctx.textAlign = 'left';
    ctx.font = '12px Arial';
    let y = 150;
    ctx.fillText(`Registro: ${data.registrationNumber}`, 50, y);
    y += 25;
    ctx.fillText(`Data: ${data.date}`, 50, y);
    y += 25;
    ctx.fillText(`Operador: ${data.operator}`, 50, y);
    y += 25;
    ctx.fillText(`Material: ${data.material}`, 50, y);
    
    // Results
    y += 50;
    ctx.fillStyle = '#1976D2';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Resultados Finais', 50, y);
    
    y += 30;
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.fillText(`Densidade Real Média: ${calculations.results?.average?.toFixed(3) || '0.000'} g/cm³`, 50, y);
    y += 25;
    ctx.fillText(`Diferença entre Determinações: ${calculations.results?.difference?.toFixed(3) || '0.000'} g/cm³`, 50, y);
    y += 25;
    ctx.fillText('Critério de Aprovação: Diferença ≤ 0.02 g/cm³', 50, y);
    
    // Status
    y += 50;
    const status = calculations.results?.status || 'AGUARDANDO';
    let statusColor = status === 'APROVADO' ? '#4CAF50' : status === 'REPROVADO' ? '#F44336' : '#FF9800';
    
    ctx.fillStyle = statusColor;
    ctx.fillRect(50, y - 20, canvas.width - 100, 40);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`STATUS DO ENSAIO: ${status}`, canvas.width / 2, y);
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `densidade-real-${data.registrationNumber || 'relatorio'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    throw error;
  }
}

/**
 * Generate PDF for Max/Min Density test
 */
export async function generateMaxMinDensityPDF(data: any, calculations: any): Promise<void> {
  try {
    // Simple PDF generation for Max/Min Density
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');
    
    canvas.width = 800;
    canvas.height = 600;
    
    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Header
    ctx.fillStyle = '#1976D2';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Laboratório Ev.C.S', canvas.width / 2, 50);
    
    ctx.fillStyle = '#666666';
    ctx.font = '18px Arial';
    ctx.fillText('Relatório de Densidade Máxima e Mínima', canvas.width / 2, 80);
    
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.fillText('Determinação dos Índices de Vazios - ABNT NBR 9813', canvas.width / 2, 105);
    
    // Information
    ctx.textAlign = 'left';
    ctx.font = '12px Arial';
    let y = 150;
    ctx.fillText(`Registro: ${data.registrationNumber}`, 50, y);
    y += 25;
    ctx.fillText(`Data: ${data.date}`, 50, y);
    y += 25;
    ctx.fillText(`Operador: ${data.operator}`, 50, y);
    y += 25;
    ctx.fillText(`Material: ${data.material}`, 50, y);
    
    // Results
    y += 50;
    ctx.fillStyle = '#1976D2';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Resultados Finais', 50, y);
    
    y += 30;
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.fillText(`γdmax Média: ${calculations.maxDensity?.average?.toFixed(3) || '0.000'} g/cm³`, 50, y);
    y += 25;
    ctx.fillText(`γdmin Média: ${calculations.minDensity?.average?.toFixed(3) || '0.000'} g/cm³`, 50, y);
    y += 25;
    ctx.fillText(`emax: ${calculations.results?.emax?.toFixed(3) || '0.000'}`, 50, y);
    y += 25;
    ctx.fillText(`emin: ${calculations.results?.emin?.toFixed(3) || '0.000'}`, 50, y);
    
    // Status
    y += 50;
    const status = calculations.results?.status || 'AGUARDANDO';
    let statusColor = status === 'APROVADO' ? '#4CAF50' : status === 'REPROVADO' ? '#F44336' : '#FF9800';
    
    ctx.fillStyle = statusColor;
    ctx.fillRect(50, y - 20, canvas.width - 100, 40);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`STATUS DO ENSAIO: ${status}`, canvas.width / 2, y);
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `densidade-max-min-${data.registrationNumber || 'relatorio'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    throw error;
  }
}