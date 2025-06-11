import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, Calculator, Scale, AlertTriangle, Info, Download } from 'lucide-react';
import { downloadBalancaVerificacaoPDF } from '@/lib/pdf-balanca-verificacao';

// Definição de tipos
interface FaixaTabela {
  min: number;
  max: number;
  aprovacao: number;
  verificacao: number;
}

interface ClasseExatidao {
  faixas: FaixaTabela[];
}

interface ResultadoVerificacao {
  conforme: boolean;
  erro: number;
  emaGramas: number;
  emaMultiplicador: number;
  cargaEmE: number;
  faixaAplicavel: FaixaTabela;
  pesoPadraoGramas: number;
  resultadoMedicaoGramas: number;
  classe: string;
  tipoAvaliacao: string;
  e: number;
}

// Tabela 5 da Portaria INMETRO 157/2022
const tabela5: Record<string, ClasseExatidao> = {
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

const getClasseDescricao = (classe: string): string => {
  const descricoes: Record<string, string> = {
    'I': 'Especial - Alta precisão',
    'II': 'Fina - Precisão elevada',
    'III': 'Média - Uso geral',
    'IIII': 'Ordinária - Menor precisão'
  };
  return descricoes[classe] || '';
};

const TabelaReferencia: React.FC<{ classe: string }> = ({ classe }) => {
  const faixas = tabela5[classe]?.faixas || [];

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <Scale className="w-4 h-4" />
        Tabela 5 - Portaria INMETRO 157/2022
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-center">Faixa de Carga (m)</th>
              <th className="border border-gray-300 p-2 text-center">Aprovação de Modelo</th>
              <th className="border border-gray-300 p-2 text-center">Verificação</th>
            </tr>
          </thead>
          <tbody>
            {faixas.map((faixa, index) => {
              const faixaTexto = faixa.max === Infinity 
                ? `${faixa.min}e < m`
                : `${faixa.min}e < m ≤ ${faixa.max}e`;
              
              return (
                <tr key={index}>
                  <td className="border border-gray-300 p-2 text-center">{faixaTexto}</td>
                  <td className="border border-gray-300 p-2 text-center">±{faixa.aprovacao}e</td>
                  <td className="border border-gray-300 p-2 text-center">±{faixa.verificacao}e</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="text-xs text-gray-600 mt-2">
          <strong>Classe {classe}</strong> - Valores expressos em múltiplos da divisão de verificação (e)
        </p>
      </div>
    </div>
  );
};

const ResultadoCard: React.FC<{ resultado: ResultadoVerificacao }> = ({ resultado }) => {
  const handleDownloadPDF = async () => {
    try {
      await downloadBalancaVerificacaoPDF(resultado, `verificacao-balanca-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar relatório PDF. Tente novamente.');
    }
  };
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
    e
  } = resultado;

  return (
    <Card className={`${conforme ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
      <CardHeader className="pb-3">
        <div className={`flex items-center gap-3 p-4 rounded-lg ${conforme ? 'bg-green-100' : 'bg-red-100'}`}>
          {conforme ? (
            <>
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="text-lg font-bold text-green-800">BALANÇA APROVADA</h3>
                <p className="text-sm text-green-700">Atende aos requisitos da Portaria INMETRO 157/2022</p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <h3 className="text-lg font-bold text-red-800">BALANÇA REPROVADA</h3>
                <p className="text-sm text-red-700">Não atende aos requisitos da Portaria INMETRO 157/2022</p>
              </div>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cálculos Realizados */}
        <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Cálculos Realizados:
          </h4>
          <div className="space-y-1">
            <div>• Peso Padrão: {pesoPadraoGramas.toFixed(3)} g</div>
            <div>• Resultado da Medição: {resultadoMedicaoGramas.toFixed(3)} g</div>
            <div>• Erro Calculado: {erro > 0 ? '+' : ''}{erro.toFixed(3)} g</div>
            <div>• Carga em múltiplos de 'e': {cargaEmE.toFixed(1)}e</div>
            <div>• EMA Aplicável: ±{emaMultiplicador}e = ±{emaGramas.toFixed(3)} g</div>
          </div>
        </div>

        {/* Análise Detalhada */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Info className="w-4 h-4" />
            Análise Detalhada:
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Classe de Exatidão:</strong> {classe} ({getClasseDescricao(classe)})
            </div>
            <div>
              <strong>Divisão de Verificação (e):</strong> {e} g
            </div>
            <div>
              <strong>Tipo de Avaliação:</strong> {tipoAvaliacao === 'aprovacao' ? 'Aprovação de Modelo' : 'Verificação'}
            </div>
            <div>
              <strong>Faixa de Carga:</strong> {faixaAplicavel.min}e &lt; m ≤ {faixaAplicavel.max === Infinity ? '∞' : faixaAplicavel.max}e
            </div>
          </div>

          <Separator />

          <div>
            <h5 className="font-medium mb-2">Erro Máximo Admissível (EMA):</h5>
            <p className="text-sm">
              Para a Classe {classe}, na faixa identificada, o EMA para {tipoAvaliacao === 'aprovacao' ? 'aprovação de modelo' : 'verificação'} é:
            </p>
            <Badge variant="outline" className="mt-1">
              ±{emaMultiplicador}e = ±{emaGramas.toFixed(3)} g
            </Badge>
          </div>

          <Separator />

          {/* Resultado da Verificação */}
          <div>
            <h5 className="font-medium mb-2">Resultado da Verificação:</h5>
            {conforme ? (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>BALANÇA APROVADA</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• O erro medido de <strong>{erro > 0 ? '+' : ''}{erro.toFixed(3)} g</strong> está dentro do limite permitido de <strong>±{emaGramas.toFixed(3)} g</strong></li>
                    <li>• A balança atende aos requisitos da Tabela 5 da Portaria INMETRO nº 157/2022</li>
                    <li>• O instrumento está adequado para uso legal nas aplicações para as quais foi projetado</li>
                    <li>• A precisão está em conformidade com a classe de exatidão {classe}</li>
                  </ul>
                  
                  <div className="mt-3 p-3 bg-green-100 rounded-md">
                    <h6 className="font-medium text-green-800 mb-1">Recomendações:</h6>
                    <ul className="text-xs space-y-1">
                      <li>• Mantenha a calibração em dia</li>
                      <li>• Realize verificações periódicas</li>
                      <li>• Proteja o instrumento de condições adversas</li>
                      <li>• Documente os resultados da verificação</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="w-4 h-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>BALANÇA REPROVADA</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• O erro medido de <strong>{erro > 0 ? '+' : ''}{erro.toFixed(3)} g</strong> excede o limite permitido de <strong>±{emaGramas.toFixed(3)} g</strong></li>
                    <li>• Excesso de erro: <strong>{(Math.abs(erro) - emaGramas).toFixed(3)} g</strong> acima do limite</li>
                    <li>• A balança NÃO atende aos requisitos da Tabela 5 da Portaria INMETRO nº 157/2022</li>
                    <li>• O instrumento NÃO está adequado para uso legal</li>
                  </ul>
                  
                  <div className="mt-3 p-3 bg-red-100 rounded-md">
                    <h6 className="font-medium text-red-800 mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Ações Necessárias:
                    </h6>
                    <ul className="text-xs space-y-1">
                      <li>• <strong>Imediata:</strong> Suspender o uso da balança para fins legais</li>
                      <li>• <strong>Calibração:</strong> Procurar um laboratório acreditado para ajuste</li>
                      <li>• <strong>Manutenção:</strong> Verificar se há problemas mecânicos ou eletrônicos</li>
                      <li>• <strong>Reavaliação:</strong> Realizar nova verificação após os ajustes</li>
                      <li>• <strong>Documentação:</strong> Registrar a não conformidade</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Tabela de Referência */}
        <TabelaReferencia classe={classe} />

        {/* Botão para Download do PDF */}
        <div className="mt-4 pt-4 border-t">
          <Button 
            onClick={handleDownloadPDF}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            size="lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar Relatório em PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function BalancaVerificacao() {
  const [formData, setFormData] = useState({
    classExatidao: '',
    divisaoVerificacao: '',
    tipoAvaliacao: '',
    pesoPadrao: '',
    resultadoMedicao: ''
  });

  const [resultado, setResultado] = useState<ResultadoVerificacao | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset resultado quando campos mudarem
    setShowResult(false);
    setResultado(null);
  };

  const calcularConformidade = () => {
    const { classExatidao, divisaoVerificacao, tipoAvaliacao, pesoPadrao, resultadoMedicao } = formData;

    // Validar campos
    if (!classExatidao || !divisaoVerificacao || !tipoAvaliacao || !pesoPadrao || !resultadoMedicao) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const e = parseFloat(divisaoVerificacao);
    const pesoPadraoNum = parseFloat(pesoPadrao);
    const resultadoMedicaoNum = parseFloat(resultadoMedicao);

    // Converter para gramas
    const pesoPadraoGramas = pesoPadraoNum * 1000;
    const resultadoMedicaoGramas = resultadoMedicaoNum * 1000;

    // Calcular erro
    const erro = resultadoMedicaoGramas - pesoPadraoGramas;

    // Calcular carga em múltiplos de e
    const cargaEmE = pesoPadraoGramas / e;

    // Encontrar faixa aplicável
    const faixasClasse = tabela5[classExatidao].faixas;
    let faixaAplicavel: FaixaTabela | null = null;
    
    for (let faixa of faixasClasse) {
      if (cargaEmE > faixa.min && cargaEmE <= faixa.max) {
        faixaAplicavel = faixa;
        break;
      }
    }

    if (!faixaAplicavel) {
      alert('Carga fora das faixas especificadas na Tabela 5.');
      return;
    }

    // Obter EMA aplicável
    const emaMultiplicador = tipoAvaliacao === 'aprovacao' ? faixaAplicavel.aprovacao : faixaAplicavel.verificacao;
    const emaGramas = emaMultiplicador * e;

    // Verificar conformidade
    const conforme = Math.abs(erro) <= emaGramas;

    // Preparar resultado
    const novoResultado: ResultadoVerificacao = {
      conforme,
      erro,
      emaGramas,
      emaMultiplicador,
      cargaEmE,
      faixaAplicavel,
      pesoPadraoGramas,
      resultadoMedicaoGramas,
      classe: classExatidao,
      tipoAvaliacao,
      e
    };

    setResultado(novoResultado);
    setShowResult(true);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
        <div className="text-center">
          <h1 className="text-3xl font-light mb-2 flex items-center justify-center gap-3">
            <Scale className="w-8 h-8" />
            Verificação de Balança
          </h1>
          <p className="text-blue-100">
            Portaria INMETRO nº 157/2022 - Tabela 5: Erros Máximos Admissíveis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white p-6 rounded-b-lg shadow-lg">
        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Dados da Verificação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="classExatidao">Classe de Exatidão da Balança:</Label>
              <Select onValueChange={(value) => handleInputChange('classExatidao', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="I">Classe I (Especial)</SelectItem>
                  <SelectItem value="II">Classe II (Fina)</SelectItem>
                  <SelectItem value="III">Classe III (Média)</SelectItem>
                  <SelectItem value="IIII">Classe IIII (Ordinária)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="divisaoVerificacao">Divisão de Verificação (e) em gramas:</Label>
              <Input
                id="divisaoVerificacao"
                type="number"
                step="0.001"
                min="0.001"
                placeholder="Ex: 1, 0.1, 0.01"
                value={formData.divisaoVerificacao}
                onChange={(e) => handleInputChange('divisaoVerificacao', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoAvaliacao">Tipo de Avaliação:</Label>
              <Select onValueChange={(value) => handleInputChange('tipoAvaliacao', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aprovacao">Aprovação de Modelo</SelectItem>
                  <SelectItem value="verificacao">Verificação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pesoPadrao">Peso Padrão (kg):</Label>
              <Input
                id="pesoPadrao"
                type="number"
                step="0.001"
                min="0"
                placeholder="Ex: 9.900"
                value={formData.pesoPadrao}
                onChange={(e) => handleInputChange('pesoPadrao', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resultadoMedicao">Resultado da Medição (kg):</Label>
              <Input
                id="resultadoMedicao"
                type="number"
                step="0.001"
                min="0"
                placeholder="Ex: 9.905"
                value={formData.resultadoMedicao}
                onChange={(e) => handleInputChange('resultadoMedicao', e.target.value)}
              />
            </div>

            <Button 
              onClick={calcularConformidade}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              size="lg"
            >
              <Scale className="w-4 h-4 mr-2" />
              Verificar Conformidade
            </Button>

            {/* Info Box */}
            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription>
                <strong>Informações Importantes:</strong>
                <ul className="mt-2 text-sm space-y-1">
                  <li><strong>Divisão de Verificação (e):</strong> Menor graduação confiável para fins metrológicos</li>
                  <li><strong>Classe I:</strong> Alta precisão (laboratórios, pesquisa)</li>
                  <li><strong>Classe II:</strong> Precisão elevada (farmácias, joalherias)</li>
                  <li><strong>Classe III:</strong> Uso geral (comércio, indústria)</li>
                  <li><strong>Classe IIII:</strong> Menor precisão (materiais de construção)</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resultado da Verificação</CardTitle>
            </CardHeader>
            <CardContent>
              {showResult && resultado ? (
                <ResultadoCard resultado={resultado} />
              ) : (
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Preencha os dados ao lado</strong>
                    <p className="mt-1 text-sm">
                      Insira todos os dados necessários no formulário ao lado e clique em "Verificar Conformidade" 
                      para obter o resultado da análise baseada na Tabela 5 da Portaria INMETRO nº 157/2022.
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Desenvolvido por Evandro Cavalcante Souza
        </p>
      </div>
    </div>
  );
}