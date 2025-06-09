import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

// Estilos profissionais para relatórios técnicos
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 15,
    fontFamily: 'Helvetica',
    fontSize: 8,
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

// Componente para Densidade In Situ - Formato Vale/SCL Compacto
const DensityInSituDocument: React.FC<{ data: any; calculations: any }> = ({ data, calculations }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Principal Compacto */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 5}}>
        <View style={{width: '15%', backgroundColor: '#00A651', padding: 3}}>
          <Text style={{color: '#FFFFFF', fontSize: 12, fontWeight: 'bold', textAlign: 'center'}}>VALE</Text>
        </View>
        <View style={{width: '70%', textAlign: 'center'}}>
          <Text style={{fontSize: 11, fontWeight: 'bold'}}>DETERMINAÇÃO DA COMPACIDADE RELATIVA</Text>
          <Text style={{fontSize: 9}}>NBR 6457:2024: NBR 9813:2016.</Text>
        </View>
        <View style={{width: '15%', backgroundColor: '#1976D2', padding: 3}}>
          <Text style={{color: '#FFFFFF', fontSize: 8, textAlign: 'center'}}>SCL</Text>
          <Text style={{color: '#FFFFFF', fontSize: 7, textAlign: 'center'}}>CONSTRUÇÕES</Text>
        </View>
      </View>

      {/* Seção de Identificação */}
      <View style={{flexDirection: 'row', marginBottom: 10}}>
        {/* Coluna Esquerda */}
        <View style={{width: '50%', paddingRight: 5}}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, {width: '40%', backgroundColor: '#F0F0F0'}]}>
              <Text style={{fontSize: 8, fontWeight: 'bold'}}>OPERADOR:</Text>
            </View>
            <View style={[styles.tableCol, {width: '60%'}]}>
              <Text style={{fontSize: 8}}>{data.operator || 'DYALISSON'}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, {width: '40%', backgroundColor: '#F0F0F0'}]}>
              <Text style={{fontSize: 8, fontWeight: 'bold'}}>RESPONSÁVEL PELO CÁLCULO:</Text>
            </View>
            <View style={[styles.tableCol, {width: '60%'}]}>
              <Text style={{fontSize: 8}}>KLAVERTY</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, {width: '40%', backgroundColor: '#F0F0F0'}]}>
              <Text style={{fontSize: 8, fontWeight: 'bold'}}>VERIFICADOR:</Text>
            </View>
            <View style={[styles.tableCol, {width: '60%'}]}>
              <Text style={{fontSize: 8}}>EVANDRO</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, {width: '40%', backgroundColor: '#F0F0F0'}]}>
              <Text style={{fontSize: 8, fontWeight: 'bold'}}>DATA:</Text>
            </View>
            <View style={[styles.tableCol, {width: '60%'}]}>
              <Text style={{fontSize: 8}}>{data.date || '20/05/2025'}</Text>
            </View>
          </View>
        </View>

        {/* Coluna Direita */}
        <View style={{width: '50%', paddingLeft: 5}}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, {width: '30%', backgroundColor: '#F0F0F0'}]}>
              <Text style={{fontSize: 8, fontWeight: 'bold'}}>NORTE:</Text>
            </View>
            <View style={[styles.tableCol, {width: '30%'}]}>
              <Text style={{fontSize: 8}}>7.795.968.318</Text>
            </View>
            <View style={[styles.tableCol, {width: '20%', backgroundColor: '#F0F0F0'}]}>
              <Text style={{fontSize: 8, fontWeight: 'bold'}}>CAMADA Nº:</Text>
            </View>
            <View style={[styles.tableCol, {width: '20%'}]}>
              <Text style={{fontSize: 8}}>19º</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, {width: '30%', backgroundColor: '#F0F0F0'}]}>
              <Text style={{fontSize: 8, fontWeight: 'bold'}}>ESTE:</Text>
            </View>
            <View style={[styles.tableCol, {width: '30%'}]}>
              <Text style={{fontSize: 8}}>690.853.569</Text>
            </View>
            <View style={[styles.tableCol, {width: '20%', backgroundColor: '#F0F0F0'}]}>
              <Text style={{fontSize: 8, fontWeight: 'bold'}}>MATERIAL:</Text>
            </View>
            <View style={[styles.tableCol, {width: '20%'}]}>
              <Text style={{fontSize: 8}}>{data.material || 'REJEITO FILTRADO'}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, {width: '30%', backgroundColor: '#F0F0F0'}]}>
              <Text style={{fontSize: 8, fontWeight: 'bold'}}>COTA:</Text>
            </View>
            <View style={[styles.tableCol, {width: '30%'}]}>
              <Text style={{fontSize: 8}}>766.919</Text>
            </View>
            <View style={[styles.tableCol, {width: '20%', backgroundColor: '#F0F0F0'}]}>
              <Text style={{fontSize: 8, fontWeight: 'bold'}}>ORIGEM:</Text>
            </View>
            <View style={[styles.tableCol, {width: '20%'}]}>
              <Text style={{fontSize: 8}}>{data.origin || 'EDVC'}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, {width: '30%', backgroundColor: '#F0F0F0'}]}>
              <Text style={{fontSize: 8, fontWeight: 'bold'}}>QUADRANTE:</Text>
            </View>
            <View style={[styles.tableCol, {width: '30%'}]}>
              <Text style={{fontSize: 8}}>A, B, FAIXA 1</Text>
            </View>
            <View style={[styles.tableCol, {width: '20%', backgroundColor: '#F0F0F0'}]}>
              <Text style={{fontSize: 8, fontWeight: 'bold'}}>REGISTRO:</Text>
            </View>
            <View style={[styles.tableCol, {width: '20%'}]}>
              <Text style={{fontSize: 8}}>{data.registrationNumber || 'CR-215'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Seção TEMPO e DISPOSITIVOS */}
      <View style={{flexDirection: 'row', marginBottom: 10}}>
        <View style={{width: '60%'}}>
          <View style={[styles.tableColHeader, {backgroundColor: '#F0F0F0', padding: 3}]}>
            <Text style={{fontSize: 9, fontWeight: 'bold', color: '#000'}}>TEMPO</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', padding: 5}}>
            <View style={{alignItems: 'center'}}>
              <View style={{width: 15, height: 15, borderRadius: 7.5, backgroundColor: '#000', marginBottom: 2}}></View>
              <Text style={{fontSize: 7}}>SOL FORTE</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <View style={{width: 15, height: 15, borderRadius: 7.5, borderWidth: 1, borderColor: '#000', marginBottom: 2}}></View>
              <Text style={{fontSize: 7}}>CHUVA FRACA</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <View style={{width: 15, height: 15, borderRadius: 7.5, borderWidth: 1, borderColor: '#000', marginBottom: 2}}></View>
              <Text style={{fontSize: 7}}>CHUVA FORTE</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <View style={{width: 15, height: 15, borderRadius: 7.5, borderWidth: 1, borderColor: '#000', marginBottom: 2}}></View>
              <Text style={{fontSize: 7}}>NUBLADO</Text>
            </View>
          </View>
        </View>
        <View style={{width: '20%', textAlign: 'center'}}>
          <View style={[styles.tableColHeader, {backgroundColor: '#F0F0F0', padding: 3}]}>
            <Text style={{fontSize: 9, fontWeight: 'bold', color: '#000'}}>HORA:</Text>
          </View>
          <Text style={{fontSize: 10, padding: 5}}>11:35</Text>
        </View>
        <View style={{width: '20%'}}>
          <View style={[styles.tableColHeader, {backgroundColor: '#F0F0F0', padding: 3}]}>
            <Text style={{fontSize: 9, fontWeight: 'bold', color: '#000'}}>CAMADA REENSAMADA:</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center', padding: 5}}>
            <View style={{alignItems: 'center', marginRight: 10}}>
              <View style={{width: 12, height: 12, borderRadius: 6, borderWidth: 1, borderColor: '#000'}}></View>
              <Text style={{fontSize: 7}}>SIM</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <View style={{width: 12, height: 12, borderRadius: 6, backgroundColor: '#000'}}></View>
              <Text style={{fontSize: 7}}>NÃO</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Dispositivos de Precisão */}
      <View style={{flexDirection: 'row', marginBottom: 15}}>
        <View style={{width: '30%'}}>
          <Text style={{fontSize: 9, fontWeight: 'bold', marginBottom: 3}}>DISPOSITIVOS DE PRECISÃO</Text>
        </View>
        <View style={{width: '35%'}}>
          <Text style={{fontSize: 9, fontWeight: 'bold', marginBottom: 3}}>BALANÇA:</Text>
          <Text style={{fontSize: 9}}>46916</Text>
        </View>
        <View style={{width: '35%'}}>
          <Text style={{fontSize: 9, fontWeight: 'bold', marginBottom: 3}}>ESTUFA:</Text>
          <Text style={{fontSize: 9}}>718</Text>
        </View>
      </View>

      {/* Tabelas de Densidade Máxima e Mínima */}
      <View style={{flexDirection: 'row', marginBottom: 15}}>
        {/* Densidade Seca Máxima */}
        <View style={{width: '48%', marginRight: '2%'}}>
          <View style={[styles.tableColHeader, {backgroundColor: '#E0E0E0', padding: 3}]}>
            <Text style={{fontSize: 9, fontWeight: 'bold', color: '#000', textAlign: 'center'}}>DENSIDADE SECA MÁXIMA</Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8, fontWeight: 'bold'}}>DETERMINAÇÃO Nº</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>MOLDE + SOLO (g)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>6012</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>6017</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>6023</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>MOLDE (g)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>4114</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>4114</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>4114</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>SOLO (g)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1898</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1903</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1909</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>VOLUME (cm³)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1007</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1007</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1007</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>γₕ(g/cm³)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1.885</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1.890</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1.895</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>w (%)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>0.0</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>0.0</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>0.0</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>γd(g/cm³)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1.885</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1.890</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1.895</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>γd,máx(g/cm³)</Text>
              </View>
              <View style={[styles.tableCol, {borderRightWidth: 0}]}><Text style={{fontSize: 8}}></Text></View>
              <View style={[styles.tableCol, {backgroundColor: '#E0E0E0', borderLeftWidth: 0, borderRightWidth: 0}]}><Text style={{fontSize: 8, textAlign: 'center'}}>1.890</Text></View>
              <View style={[styles.tableCol, {borderLeftWidth: 0}]}><Text style={{fontSize: 8}}></Text></View>
            </View>
          </View>
        </View>

        {/* Densidade Seca Mínima */}
        <View style={{width: '48%', marginLeft: '2%'}}>
          <View style={[styles.tableColHeader, {backgroundColor: '#E0E0E0', padding: 3}]}>
            <Text style={{fontSize: 9, fontWeight: 'bold', color: '#000', textAlign: 'center'}}>DENSIDADE SECA MÍNIMA</Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8, fontWeight: 'bold'}}>NÚMERO DO CILINDRO</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>MOLDE + SOLO (g)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>5671</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>5683</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>5675</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>MOLDE (g)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>4114</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>4114</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>4114</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>SOLO (g)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1557</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1569</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1561</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>VOLUME (cm³)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1007</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1007</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1007</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>γₕ(g/cm³)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1.546</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1.558</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1.550</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>w (%)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>0.0</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>0.0</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>0.0</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>γd(g/cm³)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1.546</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1.558</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1.550</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>γd,mín(g/cm³)</Text>
              </View>
              <View style={[styles.tableCol, {borderRightWidth: 0}]}><Text style={{fontSize: 8}}></Text></View>
              <View style={[styles.tableCol, {backgroundColor: '#E0E0E0', borderLeftWidth: 0, borderRightWidth: 0}]}><Text style={{fontSize: 8, textAlign: 'center'}}>1.551</Text></View>
              <View style={[styles.tableCol, {borderLeftWidth: 0}]}><Text style={{fontSize: 8}}></Text></View>
            </View>
          </View>
        </View>
      </View>

      {/* Densidade In Situ */}
      <View style={{flexDirection: 'row', marginBottom: 15}}>
        {/* Densidade In Situ - Cilindro de Cravação */}
        <View style={{width: '48%', marginRight: '2%'}}>
          <View style={[styles.tableColHeader, {backgroundColor: '#E0E0E0', padding: 3}]}>
            <Text style={{fontSize: 9, fontWeight: 'bold', color: '#000', textAlign: 'center'}}>DENSIDADE "IN SITU" - CILINDRO DE CRAVAÇÃO</Text>
            <Text style={{fontSize: 8, color: '#000', textAlign: 'center'}}>NBR 9813:2016</Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8, fontWeight: 'bold'}}>NÚMERO DO CILINDRO</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>1</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>2</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>MOLDE + SOLO (g)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>{(data.det1?.moldeSolo || 3200).toFixed(0)}</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>{(data.det2?.moldeSolo || 3184).toFixed(0)}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>MOLDE (g)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>{(data.det1?.molde || 1132).toFixed(0)}</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>{(data.det2?.molde || 1146).toFixed(0)}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>SOLO (g)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>{((data.det1?.moldeSolo || 3200) - (data.det1?.molde || 1132)).toFixed(0)}</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>{((data.det2?.moldeSolo || 3184) - (data.det2?.molde || 1146)).toFixed(0)}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>VOLUME (cm³)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>{(data.det1?.volume || 1003).toFixed(0)}</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>{(data.det2?.volume || 1000).toFixed(0)}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>γₕ(g/cm³)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>{(calculations.det1?.gammaNat || 2.062).toFixed(3)}</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>{(calculations.det2?.gammaNat || 2.038).toFixed(3)}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>γd(g/cm³)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>{(calculations.det1?.gammaDry || 1.964).toFixed(3)}</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>{(calculations.det2?.gammaDry || 1.828).toFixed(3)}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>γd(g/cm³) Média</Text>
              </View>
              <View style={[styles.tableCol, {borderRightWidth: 0}]}><Text style={{fontSize: 8}}></Text></View>
              <View style={[styles.tableCol, {backgroundColor: '#E0E0E0', borderLeftWidth: 0}]}><Text style={{fontSize: 8, textAlign: 'center'}}>1.846</Text></View>
            </View>
          </View>
        </View>

        {/* Teor de Umidade */}
        <View style={{width: '48%', marginLeft: '2%'}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '60%'}}>
              <View style={[styles.tableColHeader, {backgroundColor: '#E0E0E0', padding: 3}]}>
                <Text style={{fontSize: 9, fontWeight: 'bold', color: '#000', textAlign: 'center'}}>TEOR DE UMIDADE</Text>
              </View>
            </View>
            <View style={{width: '20%'}}>
              <View style={[styles.tableColHeader, {backgroundColor: '#4CAF50', padding: 3}]}>
                <Text style={{fontSize: 9, fontWeight: 'bold', color: '#FFF', textAlign: 'center'}}>TOPO</Text>
              </View>
            </View>
            <View style={{width: '20%'}}>
              <View style={[styles.tableColHeader, {backgroundColor: '#FF9800', padding: 3}]}>
                <Text style={{fontSize: 9, fontWeight: 'bold', color: '#FFF', textAlign: 'center'}}>BASE</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0', width: '40%'}]}>
                <Text style={{fontSize: 8, fontWeight: 'bold'}}>CÁPSULA Nº</Text>
              </View>
              <View style={[styles.tableCol, {width: '10%'}]}><Text style={{fontSize: 8}}>46</Text></View>
              <View style={[styles.tableCol, {width: '10%'}]}><Text style={{fontSize: 8}}>37</Text></View>
              <View style={[styles.tableCol, {width: '10%'}]}><Text style={{fontSize: 8}}>55</Text></View>
              <View style={[styles.tableCol, {width: '10%'}]}><Text style={{fontSize: 8}}>7</Text></View>
              <View style={[styles.tableCol, {width: '10%'}]}><Text style={{fontSize: 8}}>9</Text></View>
              <View style={[styles.tableCol, {width: '10%'}]}><Text style={{fontSize: 8}}>8</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>SOLO ÚMIDO + TARA (g)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>250.78</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>250.52</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>249.28</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>245.82</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>247.29</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>243.84</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>SOLO SECO + TARA (g)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>229.49</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>230.90</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>228.32</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>224.19</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>224.84</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>222.99</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>TARA (g)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>32.92</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>37.05</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>36.64</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>35.29</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>32.88</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>37.88</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>SOLO SECO (g)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>196.57</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>193.85</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>191.68</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>188.90</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>191.96</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>185.11</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>ÁGUA (g)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>21.29</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>19.62</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>20.96</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>21.63</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>22.44</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>20.85</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>UMIDADE (%)</Text>
              </View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>10.8</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>10.1</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>10.9</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>11.5</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>11.7</Text></View>
              <View style={styles.tableCol}><Text style={{fontSize: 8}}>11.3</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {backgroundColor: '#F0F0F0'}]}>
                <Text style={{fontSize: 8}}>UMIDADE MÉDIA (%)</Text>
              </View>
              <View style={[styles.tableCol, {borderRightWidth: 0, borderLeftWidth: 0}]}><Text style={{fontSize: 8}}></Text></View>
              <View style={[styles.tableCol, {backgroundColor: '#4CAF50', borderRightWidth: 0, borderLeftWidth: 0}]}><Text style={{fontSize: 8, textAlign: 'center', color: '#FFF'}}>10.6</Text></View>
              <View style={[styles.tableCol, {borderRightWidth: 0, borderLeftWidth: 0}]}><Text style={{fontSize: 8}}></Text></View>
              <View style={[styles.tableCol, {borderRightWidth: 0, borderLeftWidth: 0}]}><Text style={{fontSize: 8}}></Text></View>
              <View style={[styles.tableCol, {backgroundColor: '#FF9800', borderRightWidth: 0, borderLeftWidth: 0}]}><Text style={{fontSize: 8, textAlign: 'center', color: '#FFF'}}>11.5</Text></View>
              <View style={[styles.tableCol, {borderRightWidth: 0, borderLeftWidth: 0}]}><Text style={{fontSize: 8}}></Text></View>
            </View>
          </View>
        </View>
      </View>

      {/* Resultados Finais - TOPO e BASE */}
      <View style={{marginBottom: 15}}>
        <View style={[styles.tableColHeader, {backgroundColor: '#4CAF50', padding: 8, marginBottom: 5}]}>
          <Text style={{fontSize: 14, fontWeight: 'bold', color: '#FFF', textAlign: 'center'}}>TOPO</Text>
        </View>
        
        <View style={{flexDirection: 'row', backgroundColor: '#F0F0F0', padding: 5, marginBottom: 5}}>
          <Text style={{fontSize: 9, fontWeight: 'bold'}}>MASSA ESPECÍFICA REAL DOS GRÃOS (g/cm³):</Text>
          <View style={{flexDirection: 'row', marginLeft: 10}}>
            <Text style={{fontSize: 9}}>( 1.864 - 1.551 ) X 1.890 = 0.590</Text>
            <Text style={{fontSize: 9, marginLeft: 20, fontWeight: 'bold'}}>CR</Text>
            <Text style={{fontSize: 9, marginLeft: 20, fontWeight: 'bold'}}>IV</Text>
          </View>
        </View>
        
        <View style={{flexDirection: 'row', backgroundColor: '#F0F0F0', padding: 5, marginBottom: 10}}>
          <Text style={{fontSize: 9, marginLeft: 50}}>( 1.890 - 1.551 ) X 1.864 = 0.631</Text>
          <Text style={{fontSize: 9, marginLeft: 20, fontWeight: 'bold'}}>93.5%</Text>
          <Text style={{fontSize: 9, marginLeft: 20, fontWeight: 'bold'}}>0.70</Text>
        </View>

        <View style={[styles.tableColHeader, {backgroundColor: '#FF9800', padding: 8, marginBottom: 5}]}>
          <Text style={{fontSize: 14, fontWeight: 'bold', color: '#FFF', textAlign: 'center'}}>BASE</Text>
        </View>
        
        <View style={{flexDirection: 'row', backgroundColor: '#F0F0F0', padding: 5, marginBottom: 5}}>
          <Text style={{fontSize: 9, fontWeight: 'bold'}}>REGISTRO: MRG-019</Text>
          <View style={{flexDirection: 'row', marginLeft: 10}}>
            <Text style={{fontSize: 9}}>( 1.828 - 1.551 ) X 1.890 = 0.523</Text>
            <Text style={{fontSize: 9, marginLeft: 20, fontWeight: 'bold'}}>CR</Text>
            <Text style={{fontSize: 9, marginLeft: 20, fontWeight: 'bold'}}>IV</Text>
          </View>
        </View>
        
        <View style={{flexDirection: 'row', backgroundColor: '#F0F0F0', padding: 5}}>
          <Text style={{fontSize: 9, marginLeft: 50}}>( 1.890 - 1.551 ) X 1.828 = 0.619</Text>
          <Text style={{fontSize: 9, marginLeft: 20, fontWeight: 'bold'}}>84.5%</Text>
          <Text style={{fontSize: 9, marginLeft: 20, fontWeight: 'bold'}}>0.79</Text>
        </View>
      </View>

      {/* Status do Ensaio */}
      <View style={{flexDirection: 'row', marginTop: 20}}>
        <Text style={{fontSize: 10, fontWeight: 'bold', marginRight: 20}}>STATUS DO ENSAIO:</Text>
        <View style={{flexDirection: 'row'}}>
          <View style={{backgroundColor: '#4CAF50', padding: 5, marginRight: 10}}>
            <Text style={{color: '#FFF', fontSize: 9, fontWeight: 'bold'}}>APROVADO</Text>
          </View>
          <View style={{borderWidth: 1, borderColor: '#000', padding: 5}}>
            <Text style={{fontSize: 9, fontWeight: 'bold'}}>REPROVADO</Text>
          </View>
        </View>
      </View>

      {/* Observações */}
      <View style={{marginTop: 15, borderTopWidth: 1, borderTopColor: '#000', paddingTop: 10}}>
        <Text style={{fontSize: 9, fontWeight: 'bold', marginBottom: 5}}>OBSERVAÇÕES:</Text>
        <View style={{height: 30, borderWidth: 1, borderColor: '#CCC'}}></View>
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