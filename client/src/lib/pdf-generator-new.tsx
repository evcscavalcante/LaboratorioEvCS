import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

// Estilos organizados para o relatório
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 8,
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
  },
  table: {
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 3,
    fontSize: 7,
  },
  tableCellLast: {
    padding: 3,
    fontSize: 7,
  },
  headerCell: {
    backgroundColor: '#F0F0F0',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#E0E0E0',
    padding: 3,
    marginBottom: 2,
  },
});

// Componente para Densidade In Situ organizado
const DensityInSituDocument: React.FC<{ data: any; calculations: any }> = ({ data, calculations }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Principal */}
      <View style={styles.header}>
        <Text style={{fontSize: 14, fontWeight: 'bold'}}>DETERMINAÇÃO DA COMPACIDADE RELATIVA</Text>
        <Text style={{fontSize: 10, marginTop: 2}}>NBR 6457:2024: NBR 9813:2016.</Text>
      </View>

      {/* Informações Gerais */}
      <View style={styles.table}>
        <View style={[styles.tableRow, {borderBottomWidth: 1, borderBottomColor: '#000'}]}>
          <View style={[styles.tableCell, styles.headerCell, {width: '12%'}]}>
            <Text>OPERADOR:</Text>
          </View>
          <View style={[styles.tableCell, {width: '18%'}]}>
            <Text>{data.operator || 'ALEXANDRE'}</Text>
          </View>
          <View style={[styles.tableCell, styles.headerCell, {width: '8%'}]}>
            <Text>NORTE:</Text>
          </View>
          <View style={[styles.tableCell, {width: '12%'}]}>
            <Text>7.795.866,093</Text>
          </View>
          <View style={[styles.tableCell, styles.headerCell, {width: '10%'}]}>
            <Text>CAMADA N°:</Text>
          </View>
          <View style={[styles.tableCell, {width: '6%'}]}>
            <Text>21ª</Text>
          </View>
          <View style={[styles.tableCell, styles.headerCell, {width: '6%'}]}>
            <Text>FVS:</Text>
          </View>
          <View style={[styles.tableCellLast, {width: '28%'}]}>
            <Text>202</Text>
          </View>
        </View>

        <View style={[styles.tableRow, {borderBottomWidth: 1, borderBottomColor: '#000'}]}>
          <View style={[styles.tableCell, styles.headerCell, {width: '12%'}]}>
            <Text>RESPONSÁVEL PELO CÁLCULO:</Text>
          </View>
          <View style={[styles.tableCell, {width: '18%'}]}>
            <Text>KLAIVERTY</Text>
          </View>
          <View style={[styles.tableCell, styles.headerCell, {width: '8%'}]}>
            <Text>ESTE:</Text>
          </View>
          <View style={[styles.tableCell, {width: '12%'}]}>
            <Text>686.769,643</Text>
          </View>
          <View style={[styles.tableCell, styles.headerCell, {width: '10%'}]}>
            <Text>MATERIAL:</Text>
          </View>
          <View style={[styles.tableCellLast, {width: '40%'}]}>
            <Text>{data.material || 'REJEITO FILTRADO'}</Text>
          </View>
        </View>

        <View style={[styles.tableRow, {borderBottomWidth: 1, borderBottomColor: '#000'}]}>
          <View style={[styles.tableCell, styles.headerCell, {width: '12%'}]}>
            <Text>VERIFICADOR:</Text>
          </View>
          <View style={[styles.tableCell, {width: '18%'}]}>
            <Text>EVANDRO</Text>
          </View>
          <View style={[styles.tableCell, styles.headerCell, {width: '8%'}]}>
            <Text>COTA:</Text>
          </View>
          <View style={[styles.tableCell, {width: '12%'}]}>
            <Text>797,618</Text>
          </View>
          <View style={[styles.tableCell, styles.headerCell, {width: '10%'}]}>
            <Text>ORIGEM:</Text>
          </View>
          <View style={[styles.tableCellLast, {width: '40%'}]}>
            <Text>{data.origin || 'EDVC'}</Text>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.headerCell, {width: '12%'}]}>
            <Text>DATA:</Text>
          </View>
          <View style={[styles.tableCell, {width: '18%'}]}>
            <Text>{data.date || '04/06/2025'}</Text>
          </View>
          <View style={[styles.tableCell, styles.headerCell, {width: '8%'}]}>
            <Text>QUADRANTE:</Text>
          </View>
          <View style={[styles.tableCell, {width: '12%'}]}>
            <Text>A/B, FAIXA 1</Text>
          </View>
          <View style={[styles.tableCell, styles.headerCell, {width: '10%'}]}>
            <Text>REGISTRO:</Text>
          </View>
          <View style={[styles.tableCellLast, {width: '40%'}]}>
            <Text>{data.registrationNumber || 'CR-250'}</Text>
          </View>
        </View>
      </View>

      {/* Tempo e Dispositivos */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.headerCell, {width: '15%'}]}>
            <Text>TEMPO</Text>
          </View>
          <View style={[styles.tableCell, {width: '35%'}]}>
            <Text>● SOL FORTE   ○ CHUVA FRACA   ○ CHUVA FORTE   ○ NUBLADO</Text>
          </View>
          <View style={[styles.tableCell, styles.headerCell, {width: '8%'}]}>
            <Text>HORA:</Text>
          </View>
          <View style={[styles.tableCell, {width: '8%'}]}>
            <Text>{data.time || '15:11'}</Text>
          </View>
          <View style={[styles.tableCell, styles.headerCell, {width: '15%'}]}>
            <Text>CAMADA REENSAIADA:</Text>
          </View>
          <View style={[styles.tableCellLast, {width: '19%'}]}>
            <Text>○ SIM   ● NÃO</Text>
          </View>
        </View>
      </View>

      <View style={{flexDirection: 'row', marginBottom: 8}}>
        <Text style={{fontSize: 7, fontWeight: 'bold'}}>DISPOSITIVOS DE PRECISÃO</Text>
        <Text style={{fontSize: 7, marginLeft: 20}}>BALANÇA: {data.balanceId || '46916'}</Text>
        <Text style={{fontSize: 7, marginLeft: 20}}>ESTUFA: {data.ovenId || '718'}</Text>
      </View>

      {/* Tabelas de Densidade Máxima e Mínima */}
      <View style={{flexDirection: 'row', marginBottom: 8}}>
        {/* Densidade Máxima */}
        <View style={{width: '48%', marginRight: '2%'}}>
          <Text style={styles.sectionTitle}>DENSIDADE SECA MÁXIMA</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, {borderBottomWidth: 1, borderBottomColor: '#000'}]}>
              <View style={[styles.tableCell, styles.headerCell, {width: '40%'}]}>
                <Text>DETERMINAÇÃO Nº</Text>
              </View>
              <View style={[styles.tableCell, {width: '20%', textAlign: 'center'}]}>
                <Text>1</Text>
              </View>
              <View style={[styles.tableCell, {width: '20%', textAlign: 'center'}]}>
                <Text>1</Text>
              </View>
              <View style={[styles.tableCellLast, {width: '20%', textAlign: 'center'}]}>
                <Text>1</Text>
              </View>
            </View>
            <View style={[styles.tableRow, {borderBottomWidth: 1, borderBottomColor: '#000'}]}>
              <View style={[styles.tableCell, styles.headerCell, {width: '40%'}]}>
                <Text>MOLDE + SOLO (g)</Text>
              </View>
              <View style={[styles.tableCell, {width: '20%', textAlign: 'center'}]}>
                <Text>{(data.maxDensity1?.moldeSolo || 0).toFixed(0)}</Text>
              </View>
              <View style={[styles.tableCell, {width: '20%', textAlign: 'center'}]}>
                <Text>{(data.maxDensity2?.moldeSolo || 0).toFixed(0)}</Text>
              </View>
              <View style={[styles.tableCellLast, {width: '20%', textAlign: 'center'}]}>
                <Text>{(data.maxDensity3?.moldeSolo || 0).toFixed(0)}</Text>
              </View>
            </View>
            <View style={[styles.tableRow, {borderBottomWidth: 1, borderBottomColor: '#000'}]}>
              <View style={[styles.tableCell, styles.headerCell, {width: '40%'}]}>
                <Text>MOLDE (g)</Text>
              </View>
              <View style={[styles.tableCell, {width: '20%', textAlign: 'center'}]}>
                <Text>{(data.maxDensity1?.molde || 0).toFixed(0)}</Text>
              </View>
              <View style={[styles.tableCell, {width: '20%', textAlign: 'center'}]}>
                <Text>{(data.maxDensity2?.molde || 0).toFixed(0)}</Text>
              </View>
              <View style={[styles.tableCellLast, {width: '20%', textAlign: 'center'}]}>
                <Text>{(data.maxDensity3?.molde || 0).toFixed(0)}</Text>
              </View>
            </View>
            <View style={[styles.tableRow, {borderBottomWidth: 1, borderBottomColor: '#000'}]}>
              <View style={[styles.tableCell, styles.headerCell, {width: '40%'}]}>
                <Text>SOLO (g)</Text>
              </View>
              <View style={[styles.tableCell, {width: '20%', textAlign: 'center'}]}>
                <Text>{((data.maxDensity1?.moldeSolo || 0) - (data.maxDensity1?.molde || 0)).toFixed(0)}</Text>
              </View>
              <View style={[styles.tableCell, {width: '20%', textAlign: 'center'}]}>
                <Text>{((data.maxDensity2?.moldeSolo || 0) - (data.maxDensity2?.molde || 0)).toFixed(0)}</Text>
              </View>
              <View style={[styles.tableCellLast, {width: '20%', textAlign: 'center'}]}>
                <Text>{((data.maxDensity3?.moldeSolo || 0) - (data.maxDensity3?.molde || 0)).toFixed(0)}</Text>
              </View>
            </View>
            <View style={[styles.tableRow, {borderBottomWidth: 1, borderBottomColor: '#000'}]}>
              <View style={[styles.tableCell, styles.headerCell, {width: '40%'}]}>
                <Text>γd(g/cm³)</Text>
              </View>
              <View style={[styles.tableCell, {width: '20%', textAlign: 'center'}]}>
                <Text>{(calculations.maxDensity?.det1?.gammaDMax || 0).toFixed(3)}</Text>
              </View>
              <View style={[styles.tableCell, {width: '20%', textAlign: 'center'}]}>
                <Text>{(calculations.maxDensity?.det2?.gammaDMax || 0).toFixed(3)}</Text>
              </View>
              <View style={[styles.tableCellLast, {width: '20%', textAlign: 'center'}]}>
                <Text>{(calculations.maxDensity?.det3?.gammaDMax || 0).toFixed(3)}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.headerCell, {width: '40%'}]}>
                <Text>γdmáx(g/cm³)</Text>
              </View>
              <View style={[styles.tableCellLast, {width: '60%', textAlign: 'center', backgroundColor: '#E0E0E0', fontWeight: 'bold'}]}>
                <Text>{(calculations.maxDensity?.average || 0).toFixed(3)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Densidade Mínima */}
        <View style={{width: '48%', marginLeft: '2%'}}>
          <Text style={styles.sectionTitle}>DENSIDADE SECA MÍNIMA</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, {borderBottomWidth: 1, borderBottomColor: '#000'}]}>
              <View style={[styles.tableCell, styles.headerCell, {width: '40%'}]}>
                <Text>NÚMERO DO CILINDRO</Text>
              </View>
              <View style={[styles.tableCell, {width: '20%', textAlign: 'center'}]}>
                <Text>1</Text>
              </View>
              <View style={[styles.tableCell, {width: '20%', textAlign: 'center'}]}>
                <Text>1</Text>
              </View>
              <View style={[styles.tableCellLast, {width: '20%', textAlign: 'center'}]}>
                <Text>1</Text>
              </View>
            </View>
            <View style={[styles.tableRow, {borderBottomWidth: 1, borderBottomColor: '#000'}]}>
              <View style={[styles.tableCell, styles.headerCell, {width: '40%'}]}>
                <Text>MOLDE + SOLO (g)</Text>
              </View>
              <View style={[styles.tableCell, {width: '20%', textAlign: 'center'}]}>
                <Text>{(data.minDensity1?.moldeSolo || 0).toFixed(0)}</Text>
              </View>
              <View style={[styles.tableCell, {width: '20%', textAlign: 'center'}]}>
                <Text>{(data.minDensity2?.moldeSolo || 0).toFixed(0)}</Text>
              </View>
              <View style={[styles.tableCellLast, {width: '20%', textAlign: 'center'}]}>
                <Text>{(data.minDensity3?.moldeSolo || 0).toFixed(0)}</Text>
              </View>
            </View>
            <View style={[styles.tableRow, {borderBottomWidth: 1, borderBottomColor: '#000'}]}>
              <View style={[styles.tableCell, styles.headerCell, {width: '40%'}]}>
                <Text>MOLDE (g)</Text>
              </View>
              <View style={[styles.tableCell, {width: '20%', textAlign: 'center'}]}>
                <Text>{(data.minDensity1?.molde || 0).toFixed(0)}</Text>
              </View>
              <View style={[styles.tableCell, {width: '20%', textAlign: 'center'}]}>
                <Text>{(data.minDensity2?.molde || 0).toFixed(0)}</Text>
              </View>
              <View style={[styles.tableCellLast, {width: '20%', textAlign: 'center'}]}>
                <Text>{(data.minDensity3?.molde || 0).toFixed(0)}</Text>
              </View>
            </View>
            <View style={[styles.tableRow, {borderBottomWidth: 1, borderBottomColor: '#000'}]}>
              <View style={[styles.tableCell, styles.headerCell, {width: '40%'}]}>
                <Text>SOLO (g)</Text>
              </View>
              <View style={[styles.tableCell, {width: '20%', textAlign: 'center'}]}>
                <Text>{((data.minDensity1?.moldeSolo || 0) - (data.minDensity1?.molde || 0)).toFixed(0)}</Text>
              </View>
              <View style={[styles.tableCell, {width: '20%', textAlign: 'center'}]}>
                <Text>{((data.minDensity2?.moldeSolo || 0) - (data.minDensity2?.molde || 0)).toFixed(0)}</Text>
              </View>
              <View style={[styles.tableCellLast, {width: '20%', textAlign: 'center'}]}>
                <Text>{((data.minDensity3?.moldeSolo || 0) - (data.minDensity3?.molde || 0)).toFixed(0)}</Text>
              </View>
            </View>
            <View style={[styles.tableRow, {borderBottomWidth: 1, borderBottomColor: '#000'}]}>
              <View style={[styles.tableCell, styles.headerCell, {width: '40%'}]}>
                <Text>γd(g/cm³)</Text>
              </View>
              <View style={[styles.tableCell, {width: '20%', textAlign: 'center'}]}>
                <Text>{(calculations.minDensity?.det1?.gammaDMin || 0).toFixed(3)}</Text>
              </View>
              <View style={[styles.tableCell, {width: '20%', textAlign: 'center'}]}>
                <Text>{(calculations.minDensity?.det2?.gammaDMin || 0).toFixed(3)}</Text>
              </View>
              <View style={[styles.tableCellLast, {width: '20%', textAlign: 'center'}]}>
                <Text>{(calculations.minDensity?.det3?.gammaDMin || 0).toFixed(3)}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.headerCell, {width: '40%'}]}>
                <Text>γdmín(g/cm³)</Text>
              </View>
              <View style={[styles.tableCellLast, {width: '60%', textAlign: 'center', backgroundColor: '#E0E0E0', fontWeight: 'bold'}]}>
                <Text>{(calculations.minDensity?.average || 0).toFixed(3)}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Densidade In Situ e Umidade */}
      <View style={{flexDirection: 'row', marginBottom: 8}}>
        {/* Densidade In Situ */}
        <View style={{width: '35%', marginRight: '2%'}}>
          <Text style={styles.sectionTitle}>DENSIDADE "IN SITU" - CILINDRO DE CRAVAÇÃO</Text>
          <Text style={{fontSize: 6, textAlign: 'center', marginBottom: 2}}>NBR 9813:2016</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, {borderBottomWidth: 1, borderBottomColor: '#000'}]}>
              <View style={[styles.tableCell, styles.headerCell, {width: '50%'}]}>
                <Text>NÚMERO DO CILINDRO</Text>
              </View>
              <View style={[styles.tableCell, {width: '25%', textAlign: 'center'}]}>
                <Text>{data.det1?.cylinderNumber || '3'}</Text>
              </View>
              <View style={[styles.tableCellLast, {width: '25%', textAlign: 'center'}]}>
                <Text>{data.det2?.cylinderNumber || '4'}</Text>
              </View>
            </View>
            <View style={[styles.tableRow, {borderBottomWidth: 1, borderBottomColor: '#000'}]}>
              <View style={[styles.tableCell, styles.headerCell, {width: '50%'}]}>
                <Text>MOLDE + SOLO (g)</Text>
              </View>
              <View style={[styles.tableCell, {width: '25%', textAlign: 'center'}]}>
                <Text>{(data.det1?.moldeSolo || 0).toFixed(0)}</Text>
              </View>
              <View style={[styles.tableCellLast, {width: '25%', textAlign: 'center'}]}>
                <Text>{(data.det2?.moldeSolo || 0).toFixed(0)}</Text>
              </View>
            </View>
            <View style={[styles.tableRow, {borderBottomWidth: 1, borderBottomColor: '#000'}]}>
              <View style={[styles.tableCell, styles.headerCell, {width: '50%'}]}>
                <Text>MOLDE (g)</Text>
              </View>
              <View style={[styles.tableCell, {width: '25%', textAlign: 'center'}]}>
                <Text>{(data.det1?.molde || 0).toFixed(0)}</Text>
              </View>
              <View style={[styles.tableCellLast, {width: '25%', textAlign: 'center'}]}>
                <Text>{(data.det2?.molde || 0).toFixed(0)}</Text>
              </View>
            </View>
            <View style={[styles.tableRow, {borderBottomWidth: 1, borderBottomColor: '#000'}]}>
              <View style={[styles.tableCell, styles.headerCell, {width: '50%'}]}>
                <Text>γd(g/cm³)</Text>
              </View>
              <View style={[styles.tableCell, {width: '25%', textAlign: 'center'}]}>
                <Text>{(calculations.det1?.gammaDry || 0).toFixed(3)}</Text>
              </View>
              <View style={[styles.tableCellLast, {width: '25%', textAlign: 'center'}]}>
                <Text>{(calculations.det2?.gammaDry || 0).toFixed(3)}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.headerCell, {width: '50%'}]}>
                <Text>γd(g/cm³) Média</Text>
              </View>
              <View style={[styles.tableCellLast, {width: '50%', textAlign: 'center', backgroundColor: '#E0E0E0', fontWeight: 'bold'}]}>
                <Text>{(calculations.results?.averageGammaDry || 0).toFixed(3)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Teor de Umidade */}
        <View style={{width: '63%'}}>
          <View style={{flexDirection: 'row', marginBottom: 2}}>
            <Text style={[styles.sectionTitle, {width: '30%'}]}>TEOR DE UMIDADE</Text>
            <Text style={[styles.sectionTitle, {width: '35%', backgroundColor: '#4CAF50', color: '#FFF'}]}>TOPO</Text>
            <Text style={[styles.sectionTitle, {width: '35%', backgroundColor: '#FF9800', color: '#FFF'}]}>BASE</Text>
          </View>
          <View style={styles.table}>
            <View style={[styles.tableRow, {borderBottomWidth: 1, borderBottomColor: '#000'}]}>
              <View style={[styles.tableCell, styles.headerCell, {width: '20%'}]}>
                <Text>CÁPSULA Nº</Text>
              </View>
              <View style={[styles.tableCell, {width: '13.3%', textAlign: 'center'}]}>
                <Text>{data.moistureTop1?.capsule || '-'}</Text>
              </View>
              <View style={[styles.tableCell, {width: '13.3%', textAlign: 'center'}]}>
                <Text>{data.moistureTop2?.capsule || '-'}</Text>
              </View>
              <View style={[styles.tableCell, {width: '13.4%', textAlign: 'center'}]}>
                <Text>{data.moistureTop3?.capsule || '-'}</Text>
              </View>
              <View style={[styles.tableCell, {width: '13.3%', textAlign: 'center'}]}>
                <Text>{data.moistureBase1?.capsule || '-'}</Text>
              </View>
              <View style={[styles.tableCell, {width: '13.3%', textAlign: 'center'}]}>
                <Text>{data.moistureBase2?.capsule || '-'}</Text>
              </View>
              <View style={[styles.tableCellLast, {width: '13.4%', textAlign: 'center'}]}>
                <Text>{data.moistureBase3?.capsule || '-'}</Text>
              </View>
            </View>
            <View style={[styles.tableRow, {borderBottomWidth: 1, borderBottomColor: '#000'}]}>
              <View style={[styles.tableCell, styles.headerCell, {width: '20%'}]}>
                <Text>UMIDADE (%)</Text>
              </View>
              <View style={[styles.tableCell, {width: '13.3%', textAlign: 'center'}]}>
                <Text>{(calculations.moistureTop?.det1?.moisture || 0).toFixed(1)}</Text>
              </View>
              <View style={[styles.tableCell, {width: '13.3%', textAlign: 'center'}]}>
                <Text>{(calculations.moistureTop?.det2?.moisture || 0).toFixed(1)}</Text>
              </View>
              <View style={[styles.tableCell, {width: '13.4%', textAlign: 'center'}]}>
                <Text>{(calculations.moistureTop?.det3?.moisture || 0).toFixed(1)}</Text>
              </View>
              <View style={[styles.tableCell, {width: '13.3%', textAlign: 'center'}]}>
                <Text>{(calculations.moistureBase?.det1?.moisture || 0).toFixed(1)}</Text>
              </View>
              <View style={[styles.tableCell, {width: '13.3%', textAlign: 'center'}]}>
                <Text>{(calculations.moistureBase?.det2?.moisture || 0).toFixed(1)}</Text>
              </View>
              <View style={[styles.tableCellLast, {width: '13.4%', textAlign: 'center'}]}>
                <Text>{(calculations.moistureBase?.det3?.moisture || 0).toFixed(1)}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.headerCell, {width: '20%'}]}>
                <Text>UMIDADE MÉDIA (%)</Text>
              </View>
              <View style={[styles.tableCell, {width: '40%', textAlign: 'center', backgroundColor: '#4CAF50', color: '#FFF', fontWeight: 'bold'}]}>
                <Text>{(calculations.moistureTop?.average || 0).toFixed(1)}</Text>
              </View>
              <View style={[styles.tableCellLast, {width: '40%', textAlign: 'center', backgroundColor: '#FF9800', color: '#FFF', fontWeight: 'bold'}]}>
                <Text>{(calculations.moistureBase?.average || 0).toFixed(1)}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Resultados Finais */}
      <View style={{marginBottom: 8}}>
        <View style={{flexDirection: 'row', marginBottom: 3}}>
          <Text style={{fontSize: 7, fontWeight: 'bold'}}>MASSA ESPECÍFICA REAL DOS GRÃOS (g/cm³): {data.realDensityRef || '3.172'}</Text>
        </View>
        
        {/* TOPO */}
        <View style={{backgroundColor: '#4CAF50', padding: 2, marginBottom: 2}}>
          <Text style={{fontSize: 7, fontWeight: 'bold', color: '#FFF', textAlign: 'center'}}>TOPO</Text>
        </View>
        <View style={{flexDirection: 'row', backgroundColor: '#F0F0F0', padding: 2, marginBottom: 1}}>
          <Text style={{fontSize: 6}}>( {(calculations.results?.gammaDTop || 0).toFixed(3)} - {(calculations.results?.emin || 0).toFixed(3)} ) X {(calculations.maxDensity?.average || 0).toFixed(3)} = {(calculations.results?.relativeCompactnessTop || 0).toFixed(3)}</Text>
          <Text style={{fontSize: 6, marginLeft: 10, fontWeight: 'bold'}}>CR    IV</Text>
        </View>
        <View style={{flexDirection: 'row', backgroundColor: '#F0F0F0', padding: 2, marginBottom: 3}}>
          <Text style={{fontSize: 6}}>( {(calculations.maxDensity?.average || 0).toFixed(3)} - {(calculations.results?.emin || 0).toFixed(3)} ) X {(calculations.results?.gammaDTop || 0).toFixed(3)} = {(calculations.results?.voidIndexTop || 0).toFixed(3)}</Text>
          <Text style={{fontSize: 6, marginLeft: 10, fontWeight: 'bold'}}>{((calculations.results?.relativeCompactnessTop || 0) * 100).toFixed(1)}%    {(calculations.results?.voidIndexTop || 0).toFixed(2)}</Text>
        </View>

        {/* BASE */}
        <View style={{backgroundColor: '#FF9800', padding: 2, marginBottom: 2}}>
          <Text style={{fontSize: 7, fontWeight: 'bold', color: '#FFF', textAlign: 'center'}}>BASE</Text>
        </View>
        <View style={{flexDirection: 'row', backgroundColor: '#F0F0F0', padding: 2, marginBottom: 1}}>
          <Text style={{fontSize: 6, fontWeight: 'bold'}}>REGISTRO: {data.registrationNumber || 'MRG-020'}</Text>
          <Text style={{fontSize: 6, marginLeft: 10}}>( {(calculations.results?.gammaDBase || 0).toFixed(3)} - {(calculations.results?.emin || 0).toFixed(3)} ) X {(calculations.maxDensity?.average || 0).toFixed(3)} = {(calculations.results?.relativeCompactnessBase || 0).toFixed(3)}</Text>
          <Text style={{fontSize: 6, marginLeft: 10, fontWeight: 'bold'}}>CR    IV</Text>
        </View>
        <View style={{flexDirection: 'row', backgroundColor: '#F0F0F0', padding: 2}}>
          <Text style={{fontSize: 6, marginLeft: 70}}>( {(calculations.maxDensity?.average || 0).toFixed(3)} - {(calculations.results?.emin || 0).toFixed(3)} ) X {(calculations.results?.gammaDBase || 0).toFixed(3)} = {(calculations.results?.voidIndexBase || 0).toFixed(3)}</Text>
          <Text style={{fontSize: 6, marginLeft: 10, fontWeight: 'bold'}}>{((calculations.results?.relativeCompactnessBase || 0) * 100).toFixed(1)}%    {(calculations.results?.voidIndexBase || 0).toFixed(2)}</Text>
        </View>
      </View>

      {/* Status e Observações */}
      <View style={{flexDirection: 'row', marginBottom: 5}}>
        <Text style={{fontSize: 7, fontWeight: 'bold', marginRight: 20}}>STATUS DO ENSAIO:</Text>
        <View style={{backgroundColor: calculations.results?.status === 'APROVADO' ? '#4CAF50' : '#FFF', borderWidth: calculations.results?.status === 'APROVADO' ? 0 : 1, borderColor: '#000', padding: 3, marginRight: 10}}>
          <Text style={{color: calculations.results?.status === 'APROVADO' ? '#FFF' : '#000', fontSize: 6, fontWeight: 'bold'}}>APROVADO</Text>
        </View>
        <View style={{backgroundColor: calculations.results?.status === 'REPROVADO' ? '#F44336' : '#FFF', borderWidth: calculations.results?.status === 'REPROVADO' ? 0 : 1, borderColor: '#000', padding: 3}}>
          <Text style={{color: calculations.results?.status === 'REPROVADO' ? '#FFF' : '#000', fontSize: 6, fontWeight: 'bold'}}>REPROVADO</Text>
        </View>
      </View>

      <View style={{marginTop: 5}}>
        <Text style={{fontSize: 7, fontWeight: 'bold', marginBottom: 2}}>OBSERVAÇÕES:</Text>
        <View style={{height: 20, borderWidth: 1, borderColor: '#CCC'}}></View>
      </View>
    </Page>
  </Document>
);

// Exportar função usando os dados reais
export async function generateDensityInSituPDFNew(data: any, calculations: any): Promise<void> {
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