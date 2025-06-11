import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer';

// Register fonts for better PDF rendering
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      fontWeight: 300,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
      fontWeight: 500,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    fontFamily: 'Roboto',
    fontSize: 10,
    padding: 30,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    borderBottom: 2,
    borderBottomColor: '#2c3e50',
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#34495e',
    marginBottom: 3,
  },
  section: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2c3e50',
    marginBottom: 8,
    borderBottom: 1,
    borderBottomColor: '#bdc3c7',
    paddingBottom: 3,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontWeight: 500,
    width: '40%',
    color: '#2c3e50',
  },
  value: {
    width: '60%',
    color: '#34495e',
  },
  resultSection: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 5,
    border: 2,
  },
  approvedSection: {
    backgroundColor: '#d5f4e6',
    borderColor: '#27ae60',
  },
  rejectedSection: {
    backgroundColor: '#fadbd8',
    borderColor: '#e74c3c',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 10,
  },
  approvedTitle: {
    color: '#27ae60',
  },
  rejectedTitle: {
    color: '#e74c3c',
  },
  calculationBox: {
    backgroundColor: '#ecf0f1',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontFamily: 'Courier',
  },
  calculationTitle: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 5,
    color: '#2c3e50',
  },
  calculationItem: {
    marginBottom: 3,
    fontSize: 9,
  },
  table: {
    marginTop: 10,
    border: 1,
    borderColor: '#bdc3c7',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ecf0f1',
    borderBottom: 1,
    borderBottomColor: '#bdc3c7',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#bdc3c7',
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 9,
    textAlign: 'center',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 5,
    fontSize: 9,
    fontWeight: 600,
    textAlign: 'center',
    color: '#2c3e50',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#7f8c8d',
    borderTop: 1,
    borderTopColor: '#bdc3c7',
    paddingTop: 10,
  },
  recommendations: {
    backgroundColor: '#e8f4fd',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  recommendationTitle: {
    fontSize: 11,
    fontWeight: 600,
    marginBottom: 5,
    color: '#2c3e50',
  },
  recommendationItem: {
    marginBottom: 3,
    fontSize: 9,
    marginLeft: 10,
  },
  actions: {
    backgroundColor: '#fef3c7',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  actionTitle: {
    fontSize: 11,
    fontWeight: 600,
    marginBottom: 5,
    color: '#d68910',
  },
  actionItem: {
    marginBottom: 3,
    fontSize: 9,
    marginLeft: 10,
  },
});

interface BalancaVerificacaoData {
  conforme: boolean;
  erro: number;
  emaGramas: number;
  emaMultiplicador: number;
  cargaEmE: number;
  faixaAplicavel: {
    min: number;
    max: number;
    aprovacao: number;
    verificacao: number;
  };
  pesoPadraoGramas: number;
  resultadoMedicaoGramas: number;
  classe: string;
  tipoAvaliacao: string;
  e: number;
  dataVerificacao?: string;
  responsavel?: string;
  equipamento?: string;
  numeroSerie?: string;
  local?: string;
}

const getClasseDescricao = (classe: string): string => {
  const descricoes: Record<string, string> = {
    'I': 'Especial - Alta precisão',
    'II': 'Fina - Precisão elevada',
    'III': 'Média - Uso geral',
    'IIII': 'Ordinária - Menor precisão'
  };
  return descricoes[classe] || '';
};

const TabelaReferenciaPDF: React.FC<{ classe: string; faixaAplicavel: any }> = ({ classe, faixaAplicavel }) => {
  const tabela5: Record<string, any> = {
    'I': {
      faixas: [
        { min: 0, max: 50000, aprovacao: 0.5, verificacao: 1.0 },
        { min: 50000, max: 200000, aprovacao: 1.0, verificacao: 2.0 },
        { min: 200000, max: Infinity, aprovacao: 1.5, verificacao: 2.0 }
      ]
    },
    'II': {
      faixas: [
        { min: 0, max: 5000, aprovacao: 0.5, verificacao: 1.0 },
        { min: 5000, max: 20000, aprovacao: 1.0, verificacao: 2.0 },
        { min: 20000, max: 100000, aprovacao: 1.5, verificacao: 2.0 }
      ]
    },
    'III': {
      faixas: [
        { min: 0, max: 500, aprovacao: 0.5, verificacao: 1.0 },
        { min: 500, max: 2000, aprovacao: 1.0, verificacao: 2.0 },
        { min: 2000, max: 10000, aprovacao: 1.5, verificacao: 2.0 }
      ]
    },
    'IIII': {
      faixas: [
        { min: 0, max: 50, aprovacao: 0.5, verificacao: 1.0 },
        { min: 50, max: 200, aprovacao: 1.0, verificacao: 2.0 },
        { min: 200, max: 1000, aprovacao: 1.5, verificacao: 2.0 }
      ]
    }
  };

  const faixas = tabela5[classe]?.faixas || [];

  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderCell}>Faixa de Carga (m)</Text>
        <Text style={styles.tableHeaderCell}>Aprovação de Modelo</Text>
        <Text style={styles.tableHeaderCell}>Verificação</Text>
      </View>
      {faixas.map((faixa: any, index: number) => {
        const faixaTexto = faixa.max === Infinity 
          ? `${faixa.min}e < m`
          : `${faixa.min}e < m ≤ ${faixa.max}e`;
        
        return (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{faixaTexto}</Text>
            <Text style={styles.tableCell}>±{faixa.aprovacao}e</Text>
            <Text style={styles.tableCell}>±{faixa.verificacao}e</Text>
          </View>
        );
      })}
    </View>
  );
};

const BalancaVerificacaoPDF: React.FC<{ data: BalancaVerificacaoData }> = ({ data }) => {
  const {
    conforme,
    erro,
    emaGramas,
    emaMultiplicador,
    cargaEmE,
    faixaAplicavel,
    pesoPadraoGramas,
    resultadoMedicaoGramas,
    classe,
    tipoAvaliacao,
    e,
    dataVerificacao = new Date().toLocaleDateString('pt-BR'),
    responsavel = 'Não informado',
    equipamento = 'Não informado',
    numeroSerie = 'Não informado',
    local = 'Não informado'
  } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>RELATÓRIO DE VERIFICAÇÃO DE BALANÇA</Text>
          <Text style={styles.subtitle}>Portaria INMETRO nº 157/2022 - Tabela 5</Text>
          <Text style={styles.subtitle}>Erros Máximos Admissíveis</Text>
        </View>

        {/* Informações do Equipamento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMAÇÕES DO EQUIPAMENTO</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Equipamento:</Text>
            <Text style={styles.value}>{equipamento}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Número de Série:</Text>
            <Text style={styles.value}>{numeroSerie}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Classe de Exatidão:</Text>
            <Text style={styles.value}>{classe} ({getClasseDescricao(classe)})</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Divisão de Verificação (e):</Text>
            <Text style={styles.value}>{e} g</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Local da Verificação:</Text>
            <Text style={styles.value}>{local}</Text>
          </View>
        </View>

        {/* Informações da Verificação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMAÇÕES DA VERIFICAÇÃO</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Data da Verificação:</Text>
            <Text style={styles.value}>{dataVerificacao}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Responsável:</Text>
            <Text style={styles.value}>{responsavel}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tipo de Avaliação:</Text>
            <Text style={styles.value}>{tipoAvaliacao === 'aprovacao' ? 'Aprovação de Modelo' : 'Verificação'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Peso Padrão:</Text>
            <Text style={styles.value}>{(pesoPadraoGramas / 1000).toFixed(3)} kg</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Resultado da Medição:</Text>
            <Text style={styles.value}>{(resultadoMedicaoGramas / 1000).toFixed(3)} kg</Text>
          </View>
        </View>

        {/* Cálculos Realizados */}
        <View style={styles.calculationBox}>
          <Text style={styles.calculationTitle}>CÁLCULOS REALIZADOS</Text>
          <Text style={styles.calculationItem}>• Peso Padrão: {pesoPadraoGramas.toFixed(3)} g</Text>
          <Text style={styles.calculationItem}>• Resultado da Medição: {resultadoMedicaoGramas.toFixed(3)} g</Text>
          <Text style={styles.calculationItem}>• Erro Calculado: {erro > 0 ? '+' : ''}{erro.toFixed(3)} g</Text>
          <Text style={styles.calculationItem}>• Carga em múltiplos de 'e': {cargaEmE.toFixed(1)}e</Text>
          <Text style={styles.calculationItem}>• EMA Aplicável: ±{emaMultiplicador}e = ±{emaGramas.toFixed(3)} g</Text>
          <Text style={styles.calculationItem}>• Faixa de Carga: {faixaAplicavel.min}e &lt; m ≤ {faixaAplicavel.max === Infinity ? '∞' : faixaAplicavel.max}e</Text>
        </View>

        {/* Resultado da Verificação */}
        <View style={[styles.resultSection, conforme ? styles.approvedSection : styles.rejectedSection]}>
          <Text style={[styles.resultTitle, conforme ? styles.approvedTitle : styles.rejectedTitle]}>
            {conforme ? '✓ BALANÇA APROVADA' : '✗ BALANÇA REPROVADA'}
          </Text>
          
          <Text style={styles.calculationTitle}>ANÁLISE DO RESULTADO:</Text>
          {conforme ? (
            <View>
              <Text style={styles.calculationItem}>
                • O erro medido de {erro > 0 ? '+' : ''}{erro.toFixed(3)} g está dentro do limite permitido de ±{emaGramas.toFixed(3)} g
              </Text>
              <Text style={styles.calculationItem}>
                • A balança atende aos requisitos da Tabela 5 da Portaria INMETRO nº 157/2022
              </Text>
              <Text style={styles.calculationItem}>
                • O instrumento está adequado para uso legal nas aplicações para as quais foi projetado
              </Text>
              <Text style={styles.calculationItem}>
                • A precisão está em conformidade com a classe de exatidão {classe}
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.calculationItem}>
                • O erro medido de {erro > 0 ? '+' : ''}{erro.toFixed(3)} g excede o limite permitido de ±{emaGramas.toFixed(3)} g
              </Text>
              <Text style={styles.calculationItem}>
                • Excesso de erro: {(Math.abs(erro) - emaGramas).toFixed(3)} g acima do limite
              </Text>
              <Text style={styles.calculationItem}>
                • A balança NÃO atende aos requisitos da Tabela 5 da Portaria INMETRO nº 157/2022
              </Text>
              <Text style={styles.calculationItem}>
                • O instrumento NÃO está adequado para uso legal
              </Text>
            </View>
          )}
        </View>

        {/* Recomendações ou Ações */}
        {conforme ? (
          <View style={styles.recommendations}>
            <Text style={styles.recommendationTitle}>RECOMENDAÇÕES:</Text>
            <Text style={styles.recommendationItem}>• Mantenha a calibração em dia</Text>
            <Text style={styles.recommendationItem}>• Realize verificações periódicas</Text>
            <Text style={styles.recommendationItem}>• Proteja o instrumento de condições adversas</Text>
            <Text style={styles.recommendationItem}>• Documente os resultados da verificação</Text>
          </View>
        ) : (
          <View style={styles.actions}>
            <Text style={styles.actionTitle}>AÇÕES NECESSÁRIAS:</Text>
            <Text style={styles.actionItem}>• IMEDIATA: Suspender o uso da balança para fins legais</Text>
            <Text style={styles.actionItem}>• CALIBRAÇÃO: Procurar um laboratório acreditado para ajuste</Text>
            <Text style={styles.actionItem}>• MANUTENÇÃO: Verificar se há problemas mecânicos ou eletrônicos</Text>
            <Text style={styles.actionItem}>• REAVALIAÇÃO: Realizar nova verificação após os ajustes</Text>
            <Text style={styles.actionItem}>• DOCUMENTAÇÃO: Registrar a não conformidade</Text>
          </View>
        )}

        {/* Tabela de Referência */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TABELA 5 - PORTARIA INMETRO 157/2022 - CLASSE {classe}</Text>
          <TabelaReferenciaPDF classe={classe} faixaAplicavel={faixaAplicavel} />
          <Text style={{ fontSize: 8, marginTop: 5, textAlign: 'center', color: '#7f8c8d' }}>
            Valores expressos em múltiplos da divisão de verificação (e)
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Relatório gerado em {new Date().toLocaleString('pt-BR')}</Text>
          <Text>Sistema de Gestão de Laboratório Geotécnico - Desenvolvido por Evandro Cavalcante Souza</Text>
          <Text>Baseado na Portaria INMETRO nº 157/2022</Text>
        </View>
      </Page>
    </Document>
  );
};

export const generateBalancaVerificacaoPDF = async (data: BalancaVerificacaoData) => {
  try {
    const blob = await pdf(<BalancaVerificacaoPDF data={data} />).toBlob();
    return blob;
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Falha ao gerar relatório PDF');
  }
};

export const downloadBalancaVerificacaoPDF = async (data: BalancaVerificacaoData, filename?: string) => {
  try {
    const blob = await generateBalancaVerificacaoPDF(data);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `relatorio-balanca-verificacao-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao baixar PDF:', error);
    throw new Error('Falha ao baixar relatório PDF');
  }
};

export default BalancaVerificacaoPDF;