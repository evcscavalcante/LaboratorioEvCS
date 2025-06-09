import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 15,
    fontFamily: 'Helvetica',
    fontSize: 7,
  },
  headerBox: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoGrid: {
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  lastRow: {
    flexDirection: 'row',
  },
  cell: {
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 2,
    fontSize: 6,
  },
  cellLast: {
    padding: 2,
    fontSize: 6,
  },
  headerCell: {
    backgroundColor: '#F0F0F0',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#E0E0E0',
    padding: 2,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 2,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 5,
  },
  compactSection: {
    flexDirection: 'row',
    marginBottom: 5,
  },
});

const DensityInSituFinalDocument: React.FC<{ data: any; calculations: any }> = ({ data, calculations }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Cabeçalho Principal */}
      <View style={styles.headerBox}>
        <Text style={{fontSize: 12, fontWeight: 'bold', marginBottom: 2}}>DETERMINAÇÃO DA COMPACIDADE RELATIVA</Text>
        <Text style={{fontSize: 8}}>NBR 6457:2024: NBR 9813:2016</Text>
      </View>

      {/* Informações Gerais */}
      <View style={styles.infoGrid}>
        <View style={styles.row}>
          <View style={[styles.cell, styles.headerCell, {width: '12%'}]}>
            <Text>OPERADOR:</Text>
          </View>
          <View style={[styles.cell, {width: '13%'}]}>
            <Text>{data.operator || ''}</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '8%'}]}>
            <Text>NORTE:</Text>
          </View>
          <View style={[styles.cell, {width: '12%'}]}>
            <Text>7.795.866,093</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '8%'}]}>
            <Text>CAMADA:</Text>
          </View>
          <View style={[styles.cell, {width: '7%'}]}>
            <Text>21ª</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '5%'}]}>
            <Text>FVS:</Text>
          </View>
          <View style={[styles.cellLast, {width: '35%'}]}>
            <Text>202</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={[styles.cell, styles.headerCell, {width: '12%'}]}>
            <Text>RESPONSÁVEL:</Text>
          </View>
          <View style={[styles.cell, {width: '13%'}]}>
            <Text>KLAIVERTY</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '8%'}]}>
            <Text>ESTE:</Text>
          </View>
          <View style={[styles.cell, {width: '12%'}]}>
            <Text>686.769,643</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '8%'}]}>
            <Text>MATERIAL:</Text>
          </View>
          <View style={[styles.cellLast, {width: '47%'}]}>
            <Text>{data.material || 'REJEITO FILTRADO'}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={[styles.cell, styles.headerCell, {width: '12%'}]}>
            <Text>VERIFICADOR:</Text>
          </View>
          <View style={[styles.cell, {width: '13%'}]}>
            <Text>EVANDRO</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '8%'}]}>
            <Text>COTA:</Text>
          </View>
          <View style={[styles.cell, {width: '12%'}]}>
            <Text>797,618</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '8%'}]}>
            <Text>ORIGEM:</Text>
          </View>
          <View style={[styles.cellLast, {width: '47%'}]}>
            <Text>{data.origin || 'EDVC'}</Text>
          </View>
        </View>
        <View style={styles.lastRow}>
          <View style={[styles.cell, styles.headerCell, {width: '12%'}]}>
            <Text>DATA:</Text>
          </View>
          <View style={[styles.cell, {width: '13%'}]}>
            <Text>{data.date || ''}</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '8%'}]}>
            <Text>QUADRANTE:</Text>
          </View>
          <View style={[styles.cell, {width: '12%'}]}>
            <Text>A/B, FAIXA 1</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '8%'}]}>
            <Text>REGISTRO:</Text>
          </View>
          <View style={[styles.cellLast, {width: '47%'}]}>
            <Text>{data.registrationNumber || ''}</Text>
          </View>
        </View>
      </View>

      {/* Informações de Tempo e Dispositivos */}
      <View style={styles.infoGrid}>
        <View style={styles.lastRow}>
          <View style={[styles.cell, styles.headerCell, {width: '8%'}]}>
            <Text>TEMPO:</Text>
          </View>
          <View style={[styles.cell, {width: '25%'}]}>
            <Text>● SOL FORTE  ○ CHUVA  ○ NUBLADO</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '6%'}]}>
            <Text>HORA:</Text>
          </View>
          <View style={[styles.cell, {width: '8%'}]}>
            <Text>{data.time || '15:11'}</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '8%'}]}>
            <Text>BALANÇA:</Text>
          </View>
          <View style={[styles.cell, {width: '8%'}]}>
            <Text>{data.balanceId || '46916'}</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '7%'}]}>
            <Text>ESTUFA:</Text>
          </View>
          <View style={[styles.cellLast, {width: '30%'}]}>
            <Text>{data.ovenId || '718'}</Text>
          </View>
        </View>
      </View>

      {/* Seção de Densidades - Lado a Lado */}
      <View style={styles.compactSection}>
        {/* Densidade Máxima */}
        <View style={{width: '48%', marginRight: '2%'}}>
          <Text style={styles.sectionTitle}>DENSIDADE SECA MÁXIMA</Text>
          <View style={styles.tableContainer}>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '50%'}]}>
                <Text>DETERMINAÇÃO Nº</Text>
              </View>
              <View style={[styles.cell, {width: '16.7%'}]}>
                <Text style={{textAlign: 'center'}}>1</Text>
              </View>
              <View style={[styles.cell, {width: '16.6%'}]}>
                <Text style={{textAlign: 'center'}}>2</Text>
              </View>
              <View style={[styles.cellLast, {width: '16.7%'}]}>
                <Text style={{textAlign: 'center'}}>3</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '50%'}]}>
                <Text>MOLDE+SOLO (g)</Text>
              </View>
              <View style={[styles.cell, {width: '16.7%'}]}>
                <Text style={{textAlign: 'center'}}>{(data.maxDensity1?.moldeSolo || 0).toFixed(0)}</Text>
              </View>
              <View style={[styles.cell, {width: '16.6%'}]}>
                <Text style={{textAlign: 'center'}}>{(data.maxDensity2?.moldeSolo || 0).toFixed(0)}</Text>
              </View>
              <View style={[styles.cellLast, {width: '16.7%'}]}>
                <Text style={{textAlign: 'center'}}>{(data.maxDensity3?.moldeSolo || 0).toFixed(0)}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '50%'}]}>
                <Text>MOLDE (g)</Text>
              </View>
              <View style={[styles.cell, {width: '16.7%'}]}>
                <Text style={{textAlign: 'center'}}>{(data.maxDensity1?.molde || 0).toFixed(0)}</Text>
              </View>
              <View style={[styles.cell, {width: '16.6%'}]}>
                <Text style={{textAlign: 'center'}}>{(data.maxDensity2?.molde || 0).toFixed(0)}</Text>
              </View>
              <View style={[styles.cellLast, {width: '16.7%'}]}>
                <Text style={{textAlign: 'center'}}>{(data.maxDensity3?.molde || 0).toFixed(0)}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '50%'}]}>
                <Text>γd(g/cm³)</Text>
              </View>
              <View style={[styles.cell, {width: '16.7%'}]}>
                <Text style={{textAlign: 'center'}}>{(calculations.maxDensity?.det1?.gammaDMax || 0).toFixed(3)}</Text>
              </View>
              <View style={[styles.cell, {width: '16.6%'}]}>
                <Text style={{textAlign: 'center'}}>{(calculations.maxDensity?.det2?.gammaDMax || 0).toFixed(3)}</Text>
              </View>
              <View style={[styles.cellLast, {width: '16.7%'}]}>
                <Text style={{textAlign: 'center'}}>{(calculations.maxDensity?.det3?.gammaDMax || 0).toFixed(3)}</Text>
              </View>
            </View>
            <View style={styles.lastRow}>
              <View style={[styles.cell, styles.headerCell, {width: '50%'}]}>
                <Text>γdmáx(g/cm³)</Text>
              </View>
              <View style={[styles.cellLast, {width: '50%', backgroundColor: '#E0E0E0', textAlign: 'center'}]}>
                <Text style={{fontWeight: 'bold'}}>{(calculations.maxDensity?.average || 0).toFixed(3)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Densidade Mínima */}
        <View style={{width: '50%'}}>
          <Text style={styles.sectionTitle}>DENSIDADE SECA MÍNIMA</Text>
          <View style={styles.tableContainer}>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '50%'}]}>
                <Text>CILINDRO Nº</Text>
              </View>
              <View style={[styles.cell, {width: '16.7%'}]}>
                <Text style={{textAlign: 'center'}}>1</Text>
              </View>
              <View style={[styles.cell, {width: '16.6%'}]}>
                <Text style={{textAlign: 'center'}}>2</Text>
              </View>
              <View style={[styles.cellLast, {width: '16.7%'}]}>
                <Text style={{textAlign: 'center'}}>3</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '50%'}]}>
                <Text>MOLDE+SOLO (g)</Text>
              </View>
              <View style={[styles.cell, {width: '16.7%'}]}>
                <Text style={{textAlign: 'center'}}>{(data.minDensity1?.moldeSolo || 0).toFixed(0)}</Text>
              </View>
              <View style={[styles.cell, {width: '16.6%'}]}>
                <Text style={{textAlign: 'center'}}>{(data.minDensity2?.moldeSolo || 0).toFixed(0)}</Text>
              </View>
              <View style={[styles.cellLast, {width: '16.7%'}]}>
                <Text style={{textAlign: 'center'}}>{(data.minDensity3?.moldeSolo || 0).toFixed(0)}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '50%'}]}>
                <Text>MOLDE (g)</Text>
              </View>
              <View style={[styles.cell, {width: '16.7%'}]}>
                <Text style={{textAlign: 'center'}}>{(data.minDensity1?.molde || 0).toFixed(0)}</Text>
              </View>
              <View style={[styles.cell, {width: '16.6%'}]}>
                <Text style={{textAlign: 'center'}}>{(data.minDensity2?.molde || 0).toFixed(0)}</Text>
              </View>
              <View style={[styles.cellLast, {width: '16.7%'}]}>
                <Text style={{textAlign: 'center'}}>{(data.minDensity3?.molde || 0).toFixed(0)}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '50%'}]}>
                <Text>γd(g/cm³)</Text>
              </View>
              <View style={[styles.cell, {width: '16.7%'}]}>
                <Text style={{textAlign: 'center'}}>{(calculations.minDensity?.det1?.gammaDMin || 0).toFixed(3)}</Text>
              </View>
              <View style={[styles.cell, {width: '16.6%'}]}>
                <Text style={{textAlign: 'center'}}>{(calculations.minDensity?.det2?.gammaDMin || 0).toFixed(3)}</Text>
              </View>
              <View style={[styles.cellLast, {width: '16.7%'}]}>
                <Text style={{textAlign: 'center'}}>{(calculations.minDensity?.det3?.gammaDMin || 0).toFixed(3)}</Text>
              </View>
            </View>
            <View style={styles.lastRow}>
              <View style={[styles.cell, styles.headerCell, {width: '50%'}]}>
                <Text>γdmín(g/cm³)</Text>
              </View>
              <View style={[styles.cellLast, {width: '50%', backgroundColor: '#E0E0E0', textAlign: 'center'}]}>
                <Text style={{fontWeight: 'bold'}}>{(calculations.minDensity?.average || 0).toFixed(3)}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Densidade In Situ e Umidade */}
      <View style={styles.compactSection}>
        {/* Densidade In Situ */}
        <View style={{width: '30%', marginRight: '2%'}}>
          <Text style={styles.sectionTitle}>DENSIDADE "IN SITU"</Text>
          <Text style={{fontSize: 5, textAlign: 'center', marginBottom: 2}}>NBR 9813:2016</Text>
          <View style={styles.tableContainer}>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '60%'}]}>
                <Text>CILINDRO Nº</Text>
              </View>
              <View style={[styles.cell, {width: '20%'}]}>
                <Text style={{textAlign: 'center'}}>{data.det1?.cylinderNumber || '1'}</Text>
              </View>
              <View style={[styles.cellLast, {width: '20%'}]}>
                <Text style={{textAlign: 'center'}}>{data.det2?.cylinderNumber || '2'}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '60%'}]}>
                <Text>MOLDE+SOLO (g)</Text>
              </View>
              <View style={[styles.cell, {width: '20%'}]}>
                <Text style={{textAlign: 'center'}}>{(data.det1?.moldeSolo || 0).toFixed(0)}</Text>
              </View>
              <View style={[styles.cellLast, {width: '20%'}]}>
                <Text style={{textAlign: 'center'}}>{(data.det2?.moldeSolo || 0).toFixed(0)}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '60%'}]}>
                <Text>γd(g/cm³)</Text>
              </View>
              <View style={[styles.cell, {width: '20%'}]}>
                <Text style={{textAlign: 'center'}}>{(calculations.det1?.gammaDry || 0).toFixed(3)}</Text>
              </View>
              <View style={[styles.cellLast, {width: '20%'}]}>
                <Text style={{textAlign: 'center'}}>{(calculations.det2?.gammaDry || 0).toFixed(3)}</Text>
              </View>
            </View>
            <View style={styles.lastRow}>
              <View style={[styles.cell, styles.headerCell, {width: '60%'}]}>
                <Text>γd MÉDIA</Text>
              </View>
              <View style={[styles.cellLast, {width: '40%', backgroundColor: '#E0E0E0', textAlign: 'center'}]}>
                <Text style={{fontWeight: 'bold'}}>{(calculations.results?.averageGammaDry || 0).toFixed(3)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Teor de Umidade */}
        <View style={{width: '68%'}}>
          <Text style={styles.sectionTitle}>TEOR DE UMIDADE</Text>
          <View style={styles.tableContainer}>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '25%'}]}>
                <Text></Text>
              </View>
              <View style={[styles.cell, {width: '37.5%', backgroundColor: '#4CAF50', textAlign: 'center'}]}>
                <Text style={{color: '#FFF', fontWeight: 'bold'}}>TOPO</Text>
              </View>
              <View style={[styles.cellLast, {width: '37.5%', backgroundColor: '#FF9800', textAlign: 'center'}]}>
                <Text style={{color: '#FFF', fontWeight: 'bold'}}>BASE</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '25%'}]}>
                <Text>CÁPSULA Nº</Text>
              </View>
              <View style={[styles.cell, {width: '37.5%', textAlign: 'center'}]}>
                <Text>{data.moistureTop1?.capsule || '-'} | {data.moistureTop2?.capsule || '-'} | {data.moistureTop3?.capsule || '-'}</Text>
              </View>
              <View style={[styles.cellLast, {width: '37.5%', textAlign: 'center'}]}>
                <Text>{data.moistureBase1?.capsule || '-'} | {data.moistureBase2?.capsule || '-'} | {data.moistureBase3?.capsule || '-'}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '25%'}]}>
                <Text>UMIDADE (%)</Text>
              </View>
              <View style={[styles.cell, {width: '37.5%', textAlign: 'center'}]}>
                <Text>{(calculations.moistureTop?.det1?.moisture || 0).toFixed(1)} | {(calculations.moistureTop?.det2?.moisture || 0).toFixed(1)} | {(calculations.moistureTop?.det3?.moisture || 0).toFixed(1)}</Text>
              </View>
              <View style={[styles.cellLast, {width: '37.5%', textAlign: 'center'}]}>
                <Text>{(calculations.moistureBase?.det1?.moisture || 0).toFixed(1)} | {(calculations.moistureBase?.det2?.moisture || 0).toFixed(1)} | {(calculations.moistureBase?.det3?.moisture || 0).toFixed(1)}</Text>
              </View>
            </View>
            <View style={styles.lastRow}>
              <View style={[styles.cell, styles.headerCell, {width: '25%'}]}>
                <Text>MÉDIA (%)</Text>
              </View>
              <View style={[styles.cell, {width: '37.5%', backgroundColor: '#4CAF50', textAlign: 'center'}]}>
                <Text style={{color: '#FFF', fontWeight: 'bold'}}>{(calculations.moistureTop?.average || 0).toFixed(1)}</Text>
              </View>
              <View style={[styles.cellLast, {width: '37.5%', backgroundColor: '#FF9800', textAlign: 'center'}]}>
                <Text style={{color: '#FFF', fontWeight: 'bold'}}>{(calculations.moistureBase?.average || 0).toFixed(1)}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Resultados e Cálculos */}
      <View style={{marginBottom: 5}}>
        <Text style={{fontSize: 6, fontWeight: 'bold', marginBottom: 2}}>MASSA ESPECÍFICA REAL DOS GRÃOS: {data.realDensityRef || '3.172'} g/cm³</Text>
        
        {/* Resultados TOPO */}
        <View style={{backgroundColor: '#4CAF50', padding: 1, marginBottom: 1}}>
          <Text style={{fontSize: 6, fontWeight: 'bold', color: '#FFF', textAlign: 'center'}}>TOPO</Text>
        </View>
        <View style={{flexDirection: 'row', backgroundColor: '#F0F0F0', padding: 1, marginBottom: 2}}>
          <Text style={{fontSize: 5}}>CR = {((calculations.results?.relativeCompactnessTop || 0) * 100).toFixed(1)}%</Text>
          <Text style={{fontSize: 5, marginLeft: 20}}>IV = {(calculations.results?.voidIndexTop || 0).toFixed(2)}</Text>
          <Text style={{fontSize: 5, marginLeft: 20}}>γd = {(calculations.det1?.gammaDry || 0).toFixed(3)} g/cm³</Text>
        </View>

        {/* Resultados BASE */}
        <View style={{backgroundColor: '#FF9800', padding: 1, marginBottom: 1}}>
          <Text style={{fontSize: 6, fontWeight: 'bold', color: '#FFF', textAlign: 'center'}}>BASE</Text>
        </View>
        <View style={{flexDirection: 'row', backgroundColor: '#F0F0F0', padding: 1, marginBottom: 3}}>
          <Text style={{fontSize: 5}}>CR = {((calculations.results?.relativeCompactnessBase || 0) * 100).toFixed(1)}%</Text>
          <Text style={{fontSize: 5, marginLeft: 20}}>IV = {(calculations.results?.voidIndexBase || 0).toFixed(2)}</Text>
          <Text style={{fontSize: 5, marginLeft: 20}}>γd = {(calculations.det2?.gammaDry || 0).toFixed(3)} g/cm³</Text>
        </View>
      </View>

      {/* Status e Observações */}
      <View style={{flexDirection: 'row', marginBottom: 3}}>
        <Text style={{fontSize: 6, fontWeight: 'bold', marginRight: 10}}>STATUS:</Text>
        <View style={{backgroundColor: calculations.results?.status === 'APROVADO' ? '#4CAF50' : '#FFF', borderWidth: 1, borderColor: '#000', padding: 2, marginRight: 5}}>
          <Text style={{color: calculations.results?.status === 'APROVADO' ? '#FFF' : '#000', fontSize: 5, fontWeight: 'bold'}}>APROVADO</Text>
        </View>
        <View style={{backgroundColor: calculations.results?.status === 'REPROVADO' ? '#F44336' : '#FFF', borderWidth: 1, borderColor: '#000', padding: 2}}>
          <Text style={{color: calculations.results?.status === 'REPROVADO' ? '#FFF' : '#000', fontSize: 5, fontWeight: 'bold'}}>REPROVADO</Text>
        </View>
      </View>

      <View>
        <Text style={{fontSize: 6, fontWeight: 'bold', marginBottom: 1}}>OBSERVAÇÕES:</Text>
        <View style={{height: 15, borderWidth: 1, borderColor: '#CCC'}}></View>
      </View>
    </Page>
  </Document>
);

export async function generateDensityInSituPDFFinal(data: any, calculations: any): Promise<void> {
  try {
    const pdfDocument = <DensityInSituFinalDocument data={data} calculations={calculations} />;
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