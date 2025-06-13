import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  FileText,
  Scale,
  Target,
  Calendar,
  Settings,
  Bell,
  Plus,
  BarChart3,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Test {
  id: number;
  registrationNumber: string;
  date: string;
  operator: string;
  material: string;
  origin: string;
  results?: {
    status?: string;
  };
}

export default function Dashboard() {
  const [savedTests, setSavedTests] = useState<Test[]>([]);
  const [testsLoading, setTestsLoading] = useState(false);
  const { toast } = useToast();

  // Carregar ensaios salvos
  const loadSavedTests = async () => {
    setTestsLoading(true);
    try {
      const response = await fetch('/api/tests/density-in-situ/temp');
      if (response.ok) {
        const data = await response.json();
        setSavedTests(data || []);
      }
    } catch (error) {
      console.error('Error loading tests:', error);
      setSavedTests([]);
    }
    setTestsLoading(false);
  };

  // Deletar ensaio
  const deleteTest = async (testId: number) => {
    try {
      const response = await fetch(`/api/tests/density-in-situ/${testId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast({
          title: "Ensaio excluído",
          description: "O ensaio foi removido com sucesso.",
        });
        loadSavedTests();
      } else {
        throw new Error('Falha ao excluir');
      }
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir o ensaio.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadSavedTests();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das atividades do laboratório
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ensaios</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedTests.length}</div>
            <p className="text-xs text-muted-foreground">
              Ensaios salvos no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {savedTests.filter(test => {
                const today = new Date().toISOString().split('T')[0];
                return test.date === today;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ensaios realizados hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {savedTests.filter(test => test.results?.status === 'APROVADO').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ensaios aprovados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {savedTests.filter(test => !test.results?.status || test.results?.status === 'AGUARDANDO').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ensaios pendentes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Ações Rápidas
          </h2>
          <div className="space-y-4">
            <Card className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <Link href="/solos/densidade-in-situ" className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Novo Ensaio de Densidade In Situ</h3>
                    <p className="text-sm text-muted-foreground">Iniciar um novo teste de densidade in situ</p>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <Link href="/balanca-verificacao" className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Scale className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Verificação de Balança</h3>
                    <p className="text-sm text-muted-foreground">Realizar verificação de equipamento</p>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <Link href="/relatorios" className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Gerar Relatório</h3>
                    <p className="text-sm text-muted-foreground">Visualizar e exportar relatórios</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ensaios Salvos */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Ensaios Salvos ({savedTests.length})
          </h2>
          <Card>
            <CardContent className="p-6">
              {testsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                  <p className="text-muted-foreground">Carregando ensaios...</p>
                </div>
              ) : savedTests.length > 0 ? (
                <div className="space-y-3">
                  {savedTests.slice(0, 5).map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">Densidade In Situ</span>
                          <Badge variant={
                            test.results?.status === 'APROVADO' ? 'default' : 
                            test.results?.status === 'REPROVADO' ? 'destructive' : 
                            'secondary'
                          }>
                            {test.results?.status || 'AGUARDANDO'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Registro: {test.registrationNumber} | Operador: {test.operator}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(test.date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link href={`/solos/densidade-in-situ?view=${test.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link href={`/solos/densidade-in-situ?edit=${test.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o ensaio "{test.registrationNumber}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteTest(test.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                  {savedTests.length > 5 && (
                    <div className="text-center pt-2">
                      <Button variant="outline" size="sm" onClick={loadSavedTests}>
                        Ver todos os {savedTests.length} ensaios
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Nenhum ensaio salvo</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Crie seu primeiro ensaio para vê-lo aqui
                  </p>
                  <Button asChild>
                    <Link href="/solos/densidade-in-situ">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Ensaio
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}