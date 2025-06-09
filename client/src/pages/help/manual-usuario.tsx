import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Book, 
  Calculator, 
  FileText, 
  Users, 
  Shield, 
  Cloud, 
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function ManualUsuario() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Book className="h-8 w-8" />
          Manual do Usuário - Laboratório Ev.C.S
        </h1>
        <p className="text-muted-foreground">
          Guia completo para uso do sistema geotécnico profissional
        </p>
      </div>

      {/* Visão Geral */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Visão Geral do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            O Laboratório Ev.C.S é um sistema web completo para laboratórios geotécnicos que automatiza 
            cálculos, gera relatórios profissionais e gerencia dados com segurança.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Principais Recursos
              </h4>
              <ul className="list-disc list-inside text-sm space-y-1 ml-6">
                <li>3 Calculadoras Profissionais</li>
                <li>Relatórios ABNT em PDF</li>
                <li>Sistema Multi-usuário</li>
                <li>Funciona Offline</li>
                <li>Interface Responsiva</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                Níveis de Usuário
              </h4>
              <div className="space-y-1">
                <Badge variant="destructive" className="mr-2">Administrador</Badge>
                <Badge variant="default" className="mr-2">Gerente</Badge>
                <Badge variant="secondary" className="mr-2">Supervisor</Badge>
                <Badge variant="outline" className="mr-2">Técnico</Badge>
                <Badge variant="outline">Visualizador</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculadoras */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculadoras Geotécnicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Densidade In Situ */}
          <div>
            <h4 className="font-semibold mb-3 text-lg">Densidade In Situ (NBR 9813)</h4>
            <p className="text-sm text-muted-foreground mb-3">
              <strong>Acesso:</strong> Menu {">"} Solos {">"} Densidade In Situ
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium mb-2">Campos Obrigatórios:</h5>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Data do ensaio</li>
                  <li>Número de registro</li>
                  <li>Operador responsável</li>
                  <li>Material analisado</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-medium mb-2">Dados do Ensaio:</h5>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Massa úmida topo/base (g)</li>
                  <li>Volume cilindro topo/base (cm³)</li>
                  <li>Temperatura da água (°C)</li>
                  <li>Umidade (3 amostras mínimo)</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h5 className="font-medium text-green-800 mb-2">Resultado Automático:</h5>
              <p className="text-sm text-green-700">
                O sistema calcula automaticamente: densidade aparente seca, índice de vazios, 
                grau de compactação e determina o status (APROVADO/REPROVADO) baseado em critérios ABNT.
              </p>
            </div>
          </div>

          <Separator />

          {/* Densidade Real */}
          <div>
            <h4 className="font-semibold mb-3 text-lg">Densidade Real (Picnômetro)</h4>
            <p className="text-sm text-muted-foreground mb-3">
              <strong>Acesso:</strong> Menu {">"} Solos {">"} Densidade Real
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium mb-2">Dados Necessários:</h5>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Informações básicas do ensaio</li>
                  <li>Massa solo seco (g)</li>
                  <li>Volume picnômetro (ml)</li>
                  <li>Temperatura ensaio (°C)</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-medium mb-2">Determinação de Umidade:</h5>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Dados de 3 amostras para precisão</li>
                  <li>Cálculo automático da média</li>
                  <li>Validação conforme norma</li>
                </ul>
              </div>
            </div>
          </div>

          <Separator />

          {/* Densidade Máx/Mín */}
          <div>
            <h4 className="font-semibold mb-3 text-lg">Densidade Máxima e Mínima</h4>
            <p className="text-sm text-muted-foreground mb-3">
              <strong>Acesso:</strong> Menu {">"} Solos {">"} Densidade Máx/Mín
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium mb-2">Ensaio Densidade Máxima:</h5>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Massa solo + molde (g)</li>
                  <li>Massa molde (g)</li>
                  <li>Volume molde (cm³)</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-medium mb-2">Ensaio Densidade Mínima:</h5>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Altura solo no molde (cm)</li>
                  <li>Dados de umidade</li>
                  <li>Cálculos automáticos de índices</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Relatórios PDF */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Geração de Relatórios PDF
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">Quando Gerar:</h5>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Após completar qualquer ensaio</li>
                <li>Botão "Gerar PDF" em cada calculadora</li>
                <li>Formato profissional seguindo ABNT</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Conteúdo Incluído:</h5>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Logo da organização</li>
                <li>Dados do laboratório</li>
                <li>Cálculos detalhados</li>
                <li>Conclusões técnicas</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sincronização */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Sincronização de Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">Como Funciona:</h5>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li><span className="text-green-600">●</span> Online: Dados salvos na nuvem</li>
                <li><span className="text-yellow-600">●</span> Offline: Dados salvos localmente</li>
                <li><span className="text-blue-600">●</span> Sincronização automática</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Indicadores Visuais:</h5>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li><span className="text-green-600">🟢</span> Verde: Sincronizado</li>
                <li><span className="text-yellow-600">🟡</span> Amarelo: Sincronizando</li>
                <li><span className="text-red-600">🔴</span> Vermelho: Sem conexão</li>
                <li><span className="text-gray-600">📱</span> Offline: Funcionando local</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problemas Comuns */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Resolução de Problemas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
              <h5 className="font-medium text-yellow-800 mb-2">Não consigo fazer login</h5>
              <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                <li>Verifique conexão com internet</li>
                <li>Use conta Google válida</li>
                <li>Limpe cache do navegador</li>
              </ul>
            </div>
            
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <h5 className="font-medium text-blue-800 mb-2">Dados não aparecem</h5>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li>Aguarde sincronização</li>
                <li>Verifique indicador de status</li>
                <li>Recarregue a página (F5)</li>
              </ul>
            </div>
            
            <div className="p-4 border-l-4 border-red-500 bg-red-50">
              <h5 className="font-medium text-red-800 mb-2">PDF não gera</h5>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                <li>Preencha todos campos obrigatórios</li>
                <li>Verifique se ensaio está completo</li>
                <li>Tente em outro navegador</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Melhores Práticas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Melhores Práticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium mb-3">Para Técnicos:</h5>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Preencha todos os campos obrigatórios</li>
                <li>Confira dados antes de salvar</li>
                <li>Gere PDFs após cada ensaio</li>
                <li>Mantenha dados organizados por projeto</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium mb-3">Para Supervisores:</h5>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Supervisione trabalho da equipe</li>
                <li>Valide relatórios importantes</li>
                <li>Configure permissões adequadas</li>
                <li>Monitore produtividade</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}