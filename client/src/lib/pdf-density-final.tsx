import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 25,
    paddingTop: 30,
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
            <Text>{data.coordinates || ''}</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '8%'}]}>
            <Text>CAMADA:</Text>
          </View>
          <View style={[styles.cell, {width: '7%'}]}>
            <Text>{data.layer || ''}</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '5%'}]}>
            <Text>FVS:</Text>
          </View>
          <View style={[styles.cellLast, {width: '35%'}]}>
            <Text></Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.cell, styles.headerCell, {width: '12%'}]}>
            <Text>RESP. CÁLCULO:</Text>
          </View>
          <View style={[styles.cell, {width: '13%'}]}>
            <Text>{data.technicalResponsible || ''}</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '8%'}]}>
            <Text>ESTE:</Text>
          </View>
          <View style={[styles.cell, {width: '12%'}]}>
            <Text></Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '8%'}]}>
            <Text>MATERIAL:</Text>
          </View>
          <View style={[styles.cellLast, {width: '47%'}]}>
            <Text>{data.material || ''}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.cell, styles.headerCell, {width: '12%'}]}>
            <Text>VERIFICADOR:</Text>
          </View>
          <View style={[styles.cell, {width: '13%'}]}>
            <Text>{data.verifier || ''}</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '8%'}]}>
            <Text>COTA:</Text>
          </View>
          <View style={[styles.cell, {width: '12%'}]}>
            <Text></Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '8%'}]}>
            <Text>ORIGEM:</Text>
          </View>
          <View style={[styles.cellLast, {width: '47%'}]}>
            <Text>{data.origin || ''}</Text>
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
            <Text>{data.quadrant || ''}</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '8%'}]}>
            <Text>REGISTRO:</Text>
          </View>
          <View style={[styles.cellLast, {width: '47%'}]}>
            <Text>{data.registrationNumber || ''}</Text>
          </View>
        </View>
      </View>

      {/* Seção Tempo e Dispositivos */}
      <View style={styles.infoGrid}>
        <View style={styles.row}>
          <View style={[styles.cell, styles.headerCell, {width: '10%'}]}>
            <Text>TEMPO:</Text>
          </View>
          <View style={[styles.cell, {width: '50%'}]}>
            <Text>● SOL FORTE  ○ CHUVA FRACA  ○ CHUVA FORTE  ○ NUBLADO</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '8%'}]}>
            <Text>HORA:</Text>
          </View>
          <View style={[styles.cell, {width: '10%'}]}>
            <Text>{data.time || ''}</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '12%'}]}>
            <Text>REENSAIADA:</Text>
          </View>
          <View style={[styles.cellLast, {width: '10%'}]}>
            <Text>○ SIM ● NÃO</Text>
          </View>
        </View>

        <View style={styles.lastRow}>
          <View style={[styles.cell, styles.headerCell, {width: '20%'}]}>
            <Text>DISPOSITIVOS:</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '10%'}]}>
            <Text>BALANÇA:</Text>
          </View>
          <View style={[styles.cell, {width: '15%'}]}>
            <Text>{data.balanceId || ''}</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '10%'}]}>
            <Text>ESTUFA:</Text>
          </View>
          <View style={[styles.cellLast, {width: '45%'}]}>
            <Text>{data.ovenId || ''}</Text>
          </View>
        </View>
      </View>

      {/* Seção Densidades Máxima e Mínima */}
      <View style={styles.compactSection}>
        {/* Densidade Máxima */}
        <View style={{width: '48%', marginRight: '2%'}}>
          <View style={styles.sectionTitle}>
            <Text>DENSIDADE SECA MÁXIMA</Text>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '30%'}]}>
                <Text>DET. Nº</Text>
              </View>
              <View style={[styles.cell, {width: '23%'}]}>
                <Text>1</Text>
              </View>
              <View style={[styles.cell, {width: '23%'}]}>
                <Text>2</Text>
              </View>
              <View style={[styles.cellLast, {width: '24%'}]}>
                <Text>3</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '30%'}]}>
                <Text>MOLDE+SOLO</Text>
              </View>
              <View style={[styles.cell, {width: '23%'}]}>
                <Text>{data.maxDensity?.det1?.moldeSolo || ''}</Text>
              </View>
              <View style={[styles.cell, {width: '23%'}]}>
                <Text>{data.maxDensity?.det2?.moldeSolo || ''}</Text>
              </View>
              <View style={[styles.cellLast, {width: '24%'}]}>
                <Text>{data.maxDensity?.det3?.moldeSolo || ''}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '30%'}]}>
                <Text>MOLDE</Text>
              </View>
              <View style={[styles.cell, {width: '23%'}]}>
                <Text>{data.maxDensity?.det1?.molde || ''}</Text>
              </View>
              <View style={[styles.cell, {width: '23%'}]}>
                <Text>{data.maxDensity?.det2?.molde || ''}</Text>
              </View>
              <View style={[styles.cellLast, {width: '24%'}]}>
                <Text>{data.maxDensity?.det3?.molde || ''}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '30%'}]}>
                <Text>SOLO</Text>
              </View>
              <View style={[styles.cell, {width: '23%'}]}>
                <Text>{((data.maxDensity?.det1?.moldeSolo || 0) - (data.maxDensity?.det1?.molde || 0)).toFixed(0)}</Text>
              </View>
              <View style={[styles.cell, {width: '23%'}]}>
                <Text>{((data.maxDensity?.det2?.moldeSolo || 0) - (data.maxDensity?.det2?.molde || 0)).toFixed(0)}</Text>
              </View>
              <View style={[styles.cellLast, {width: '24%'}]}>
                <Text>{((data.maxDensity?.det3?.moldeSolo || 0) - (data.maxDensity?.det3?.molde || 0)).toFixed(0)}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '30%'}]}>
                <Text>γd(g/cm³)</Text>
              </View>
              <View style={[styles.cell, {width: '23%'}]}>
                <Text>{(((data.maxDensity?.det1?.moldeSolo || 0) - (data.maxDensity?.det1?.molde || 0)) / (data.maxDensity?.det1?.volume || 1000)).toFixed(3)}</Text>
              </View>
              <View style={[styles.cell, {width: '23%'}]}>
                <Text>{(((data.maxDensity?.det2?.moldeSolo || 0) - (data.maxDensity?.det2?.molde || 0)) / (data.maxDensity?.det2?.volume || 1000)).toFixed(3)}</Text>
              </View>
              <View style={[styles.cellLast, {width: '24%'}]}>
                <Text>{(((data.maxDensity?.det3?.moldeSolo || 0) - (data.maxDensity?.det3?.molde || 0)) / (data.maxDensity?.det3?.volume || 1000)).toFixed(3)}</Text>
              </View>
            </View>
            <View style={styles.lastRow}>
              <View style={[styles.cell, styles.headerCell, {width: '30%'}]}>
                <Text>γdmáx</Text>
              </View>
              <View style={[styles.cellLast, {width: '70%', backgroundColor: '#E0E0E0', textAlign: 'center'}]}>
                <Text>{calculations?.results?.gammaDMax?.toFixed(3) || ''}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Densidade Mínima */}
        <View style={{width: '50%'}}>
          <View style={styles.sectionTitle}>
            <Text>DENSIDADE SECA MÍNIMA</Text>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '30%'}]}>
                <Text>CILINDRO Nº</Text>
              </View>
              <View style={[styles.cell, {width: '23%'}]}>
                <Text>1</Text>
              </View>
              <View style={[styles.cell, {width: '23%'}]}>
                <Text>2</Text>
              </View>
              <View style={[styles.cellLast, {width: '24%'}]}>
                <Text>3</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '30%'}]}>
                <Text>MOLDE+SOLO</Text>
              </View>
              <View style={[styles.cell, {width: '23%'}]}>
                <Text>{data.minDensity?.det1?.moldeSolo || ''}</Text>
              </View>
              <View style={[styles.cell, {width: '23%'}]}>
                <Text>{data.minDensity?.det2?.moldeSolo || ''}</Text>
              </View>
              <View style={[styles.cellLast, {width: '24%'}]}>
                <Text>{data.minDensity?.det3?.moldeSolo || ''}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '30%'}]}>
                <Text>MOLDE</Text>
              </View>
              <View style={[styles.cell, {width: '23%'}]}>
                <Text>{data.minDensity?.det1?.molde || ''}</Text>
              </View>
              <View style={[styles.cell, {width: '23%'}]}>
                <Text>{data.minDensity?.det2?.molde || ''}</Text>
              </View>
              <View style={[styles.cellLast, {width: '24%'}]}>
                <Text>{data.minDensity?.det3?.molde || ''}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '30%'}]}>
                <Text>SOLO</Text>
              </View>
              <View style={[styles.cell, {width: '23%'}]}>
                <Text>{((data.minDensity?.det1?.moldeSolo || 0) - (data.minDensity?.det1?.molde || 0)).toFixed(0)}</Text>
              </View>
              <View style={[styles.cell, {width: '23%'}]}>
                <Text>{((data.minDensity?.det2?.moldeSolo || 0) - (data.minDensity?.det2?.molde || 0)).toFixed(0)}</Text>
              </View>
              <View style={[styles.cellLast, {width: '24%'}]}>
                <Text>{((data.minDensity?.det3?.moldeSolo || 0) - (data.minDensity?.det3?.molde || 0)).toFixed(0)}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '30%'}]}>
                <Text>γd(g/cm³)</Text>
              </View>
              <View style={[styles.cell, {width: '23%'}]}>
                <Text>{(((data.minDensity?.det1?.moldeSolo || 0) - (data.minDensity?.det1?.molde || 0)) / (data.minDensity?.det1?.volume || 1000)).toFixed(3)}</Text>
              </View>
              <View style={[styles.cell, {width: '23%'}]}>
                <Text>{(((data.minDensity?.det2?.moldeSolo || 0) - (data.minDensity?.det2?.molde || 0)) / (data.minDensity?.det2?.volume || 1000)).toFixed(3)}</Text>
              </View>
              <View style={[styles.cellLast, {width: '24%'}]}>
                <Text>{(((data.minDensity?.det3?.moldeSolo || 0) - (data.minDensity?.det3?.molde || 0)) / (data.minDensity?.det3?.volume || 1000)).toFixed(3)}</Text>
              </View>
            </View>
            <View style={styles.lastRow}>
              <View style={[styles.cell, styles.headerCell, {width: '30%'}]}>
                <Text>γdmín</Text>
              </View>
              <View style={[styles.cellLast, {width: '70%', backgroundColor: '#E0E0E0', textAlign: 'center'}]}>
                <Text>{calculations?.results?.gammaDMin?.toFixed(3) || ''}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Densidade In Situ */}
      <View style={styles.compactSection}>
        <View style={{width: '35%', marginRight: '3%'}}>
          <View style={styles.sectionTitle}>
            <Text>DENSIDADE "IN SITU" - CILINDRO</Text>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '50%'}]}>
                <Text>CILINDRO Nº</Text>
              </View>
              <View style={[styles.cell, {width: '25%'}]}>
                <Text>{data.det1?.cylinderNumber || ''}</Text>
              </View>
              <View style={[styles.cellLast, {width: '25%'}]}>
                <Text>{data.det2?.cylinderNumber || ''}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '50%'}]}>
                <Text>MOLDE+SOLO</Text>
              </View>
              <View style={[styles.cell, {width: '25%'}]}>
                <Text>{data.det1?.moldeSolo || ''}</Text>
              </View>
              <View style={[styles.cellLast, {width: '25%'}]}>
                <Text>{data.det2?.moldeSolo || ''}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '50%'}]}>
                <Text>γd(g/cm³)</Text>
              </View>
              <View style={[styles.cell, {width: '25%'}]}>
                <Text>{calculations?.gammaDTop?.toFixed(3) || ''}</Text>
              </View>
              <View style={[styles.cellLast, {width: '25%'}]}>
                <Text>{calculations?.gammaDBase?.toFixed(3) || ''}</Text>
              </View>
            </View>
            <View style={styles.lastRow}>
              <View style={[styles.cell, styles.headerCell, {width: '50%'}]}>
                <Text>γd MÉDIA</Text>
              </View>
              <View style={[styles.cellLast, {width: '50%', backgroundColor: '#E0E0E0', textAlign: 'center'}]}>
                <Text>{((calculations?.gammaDTop + calculations?.gammaDBase) / 2).toFixed(3) || ''}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Teor de Umidade */}
        <View style={{width: '62%'}}>
          <View style={styles.sectionTitle}>
            <Text>TEOR DE UMIDADE (%)</Text>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '25%'}]}>
                <Text>CÁPSULA</Text>
              </View>
              <View style={[styles.cell, {width: '15%'}]}>
                <Text>{data.moistureTop1?.capsule || ''}</Text>
              </View>
              <View style={[styles.cell, {width: '15%'}]}>
                <Text>{data.moistureTop2?.capsule || ''}</Text>
              </View>
              <View style={[styles.cell, {width: '15%'}]}>
                <Text>{data.moistureTop3?.capsule || ''}</Text>
              </View>
              <View style={[styles.cellLast, {width: '30%'}]}>
                <Text>MÉDIA</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '25%'}]}>
                <Text>ÚMIDO+TARA</Text>
              </View>
              <View style={[styles.cell, {width: '15%'}]}>
                <Text>{data.moistureTop1?.wetTare || ''}</Text>
              </View>
              <View style={[styles.cell, {width: '15%'}]}>
                <Text>{data.moistureTop2?.wetTare || ''}</Text>
              </View>
              <View style={[styles.cell, {width: '15%'}]}>
                <Text>{data.moistureTop3?.wetTare || ''}</Text>
              </View>
              <View style={[styles.cellLast, {width: '30%'}]}>
                <Text>-</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '25%'}]}>
                <Text>SECO+TARA</Text>
              </View>
              <View style={[styles.cell, {width: '15%'}]}>
                <Text>{data.moistureTop1?.dryTare || ''}</Text>
              </View>
              <View style={[styles.cell, {width: '15%'}]}>
                <Text>{data.moistureTop2?.dryTare || ''}</Text>
              </View>
              <View style={[styles.cell, {width: '15%'}]}>
                <Text>{data.moistureTop3?.dryTare || ''}</Text>
              </View>
              <View style={[styles.cellLast, {width: '30%'}]}>
                <Text>-</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, {width: '25%'}]}>
                <Text>TARA</Text>
              </View>
              <View style={[styles.cell, {width: '15%'}]}>
                <Text>{data.moistureTop1?.tare || ''}</Text>
              </View>
              <View style={[styles.cell, {width: '15%'}]}>
                <Text>{data.moistureTop2?.tare || ''}</Text>
              </View>
              <View style={[styles.cell, {width: '15%'}]}>
                <Text>{data.moistureTop3?.tare || ''}</Text>
              </View>
              <View style={[styles.cellLast, {width: '30%'}]}>
                <Text>-</Text>
              </View>
            </View>
            <View style={styles.lastRow}>
              <View style={[styles.cell, styles.headerCell, {width: '25%'}]}>
                <Text>UMIDADE (%)</Text>
              </View>
              <View style={[styles.cell, {width: '15%'}]}>
                <Text>{calculations?.moistureTop1?.toFixed(2) || ''}</Text>
              </View>
              <View style={[styles.cell, {width: '15%'}]}>
                <Text>{calculations?.moistureTop2?.toFixed(2) || ''}</Text>
              </View>
              <View style={[styles.cell, {width: '15%'}]}>
                <Text>{calculations?.moistureTop3?.toFixed(2) || ''}</Text>
              </View>
              <View style={[styles.cellLast, {width: '30%', backgroundColor: '#E0E0E0', textAlign: 'center'}]}>
                <Text>{calculations?.moistureTopAverage?.toFixed(2) || ''}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Resultados Finais */}
      <View style={styles.infoGrid}>
        <View style={styles.row}>
          <View style={[styles.cell, styles.headerCell, {width: '20%'}]}>
            <Text>γd "in situ" (g/cm³)</Text>
          </View>
          <View style={[styles.cell, {width: '15%'}]}>
            <Text>{((calculations?.gammaDTop + calculations?.gammaDBase) / 2).toFixed(3) || ''}</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '15%'}]}>
            <Text>emáx</Text>
          </View>
          <View style={[styles.cell, {width: '15%'}]}>
            <Text>{calculations?.results?.emax?.toFixed(2) || ''}</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '15%'}]}>
            <Text>CR (%)</Text>
          </View>
          <View style={[styles.cellLast, {width: '20%', backgroundColor: '#E0E0E0', textAlign: 'center', fontWeight: 'bold'}]}>
            <Text>{(calculations?.relativeCompactness * 100).toFixed(1) || ''}</Text>
          </View>
        </View>
        <View style={styles.lastRow}>
          <View style={[styles.cell, styles.headerCell, {width: '20%'}]}>
            <Text>e "in situ"</Text>
          </View>
          <View style={[styles.cell, {width: '15%'}]}>
            <Text>{calculations?.voidIndex?.toFixed(2) || ''}</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '15%'}]}>
            <Text>emín</Text>
          </View>
          <View style={[styles.cell, {width: '15%'}]}>
            <Text>{calculations?.results?.emin?.toFixed(2) || ''}</Text>
          </View>
          <View style={[styles.cell, styles.headerCell, {width: '15%'}]}>
            <Text>STATUS:</Text>
          </View>
          <View style={[styles.cellLast, {width: '20%', backgroundColor: calculations?.results?.status === 'APROVADO' ? '#4CAF50' : '#F44336', textAlign: 'center'}]}>
            <Text style={{color: '#FFFFFF', fontWeight: 'bold'}}>{calculations?.results?.status || 'AGUARDANDO'}</Text>
          </View>
        </View>
      </View>

      {/* Observações */}
      <View style={{marginTop: 10}}>
        <View style={styles.sectionTitle}>
          <Text>OBSERVAÇÕES</Text>
        </View>
        <View style={{height: 30, borderWidth: 1, borderColor: '#000', padding: 5}}>
          <Text style={{fontSize: 6}}></Text>
        </View>
      </View>
    </Page>
  </Document>
);

export async function generateDensityInSituPDFFinal(data: any, calculations: any): Promise<void> {
  const doc = <DensityInSituFinalDocument data={data} calculations={calculations} />;
  
  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `densidade-in-situ-${data.registrationNumber || 'teste'}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}