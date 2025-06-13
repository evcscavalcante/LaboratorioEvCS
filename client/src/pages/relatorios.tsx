import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  BarChart3,
  TrendingUp,
  PieChart,
  Map,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Target
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { localDataManager } from '@/lib/local-storage';
import { 
  exportDensidadeInSituCSV, 
  exportDensidadeRealCSV, 
  exportDensidadeMaxMinCSV,
  exportConsolidatedReport 
} from '@/lib/data-export';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ReportFilters {
  dateStart: string;
  dateEnd: string;
  location: string;
  responsible: string;
  testType: 'all' | 'densityInSitu' | 'densityReal' | 'densityMaxMin';
}

interface TestStatistics {
  total: number;
  thisMonth: number;
  lastMonth: number;
  averagePerDay: number;
  byLocation: Record<string, number>;
  byResponsible: Record<string, number>;
  byMonth: Record<string, number>;
}

interface AllData {
  densityInSitu: any[];
  densityReal: any[];
  densityMaxMin: any[];
}

export default function Relatorios() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState<AllData>({
    densityInSitu: [],
    densityReal: [],
    densityMaxMin: []
  });
  
  const [filters, setFilters] = useState<ReportFilters>({
    dateStart: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
    dateEnd: format(new Date(), 'yyyy-MM-dd'),
    location: '',
    responsible: '',
    testType: 'all'
  });

  const [statistics, setStatistics] = useState<{
    densityInSitu: TestStatistics;
    densityReal: TestStatistics;
    densityMaxMin: TestStatistics;
  }>({
    densityInSitu: { total: 0, thisMonth: 0, lastMonth: 0, averagePerDay: 0, byLocation: {}, byResponsible: {}, byMonth: {} },
    densityReal: { total: 0, thisMonth: 0, lastMonth: 0, averagePerDay: 0, byLocation: {}, byResponsible: {}, byMonth: {} },
    densityMaxMin: { total: 0, thisMonth: 0, lastMonth: 0, averagePerDay: 0, byLocation: {}, byResponsible: {}, byMonth: {} }
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (allData.densityInSitu.length > 0 || allData.densityReal.length > 0 || allData.densityMaxMin.length > 0) {
      calculateStatistics();
    }
  }, [allData, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados da API
      const [densityInSituResponse, densityRealResponse, densityMaxMinResponse] = await Promise.all([
        apiRequest('GET', '/api/tests/density-in-situ/temp'),
        apiRequest('GET', '/api/tests/real-density'),
        apiRequest('GET', '/api/tests/max-min-density')
      ]);

      const densityInSitu = await densityInSituResponse.json();
      const densityReal = await densityRealResponse.json();
      const densityMaxMin = await densityMaxMinResponse.json();

      setAllData({
        densityInSitu: Array.isArray(densityInSitu) ? densityInSitu : [],
        densityReal: Array.isArray(densityReal) ? densityReal : [],
        densityMaxMin: Array.isArray(densityMaxMin) ? densityMaxMin : []
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados dos testes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterData = (data: any[]) => {
    return data.filter((test: any) => {
      const testDate = new Date(test.dataEnsaio);
      const startDate = new Date(filters.dateStart);
      const endDate = new Date(filters.dateEnd);

      const dateInRange = testDate >= startDate && testDate <= endDate;
      const locationMatch = !filters.location || test.localizacao?.toLowerCase().includes(filters.location.toLowerCase());
      const responsibleMatch = !filters.responsible || test.responsavel?.toLowerCase().includes(filters.responsible.toLowerCase());

      return dateInRange && locationMatch && responsibleMatch;
    });
  };

  const calculateStatistics = () => {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const calculateForTestType = (data: any[]): TestStatistics => {
      const filtered = filterData(data);
      
      const thisMonth = data.filter((test: any) => {
        const testDate = new Date(test.dataEnsaio);
        return testDate >= thisMonthStart;
      }).length;

      const lastMonth = data.filter((test: any) => {
        const testDate = new Date(test.dataEnsaio);
        return testDate >= lastMonthStart && testDate <= lastMonthEnd;
      }).length;

      const byLocation: Record<string, number> = {};
      const byResponsible: Record<string, number> = {};
      const byMonth: Record<string, number> = {};

      filtered.forEach((test: any) => {
        // Por localização
        const location = test.localizacao || 'Não informado';
        byLocation[location] = (byLocation[location] || 0) + 1;

        // Por responsável
        const responsible = test.responsavel || 'Não informado';
        byResponsible[responsible] = (byResponsible[responsible] || 0) + 1;

        // Por mês
        const month = format(new Date(test.dataEnsaio), 'yyyy-MM');
        byMonth[month] = (byMonth[month] || 0) + 1;
      });

      const daysInPeriod = Math.max(1, Math.ceil((new Date(filters.dateEnd).getTime() - new Date(filters.dateStart).getTime()) / (1000 * 60 * 60 * 24)));
      const averagePerDay = filtered.length / daysInPeriod;

      return {
        total: filtered.length,
        thisMonth,
        lastMonth,
        averagePerDay,
        byLocation,
        byResponsible,
        byMonth
      };
    };

    setStatistics({
      densityInSitu: calculateForTestType(allData.densityInSitu),
      densityReal: calculateForTestType(allData.densityReal),
      densityMaxMin: calculateForTestType(allData.densityMaxMin)
    });
  };

  const getFilteredData = () => {
    const filtered = {
      densityInSitu: filterData(allData.densityInSitu),
      densityReal: filterData(allData.densityReal),
      densityMaxMin: filterData(allData.densityMaxMin)
    };

    switch (filters.testType) {
      case 'densityInSitu':
        return { densityInSitu: filtered.densityInSitu, densityReal: [], densityMaxMin: [] };
      case 'densityReal':
        return { densityInSitu: [], densityReal: filtered.densityReal, densityMaxMin: [] };
      case 'densityMaxMin':
        return { densityInSitu: [], densityReal: [], densityMaxMin: filtered.densityMaxMin };
      default:
        return filtered;
    }
  };

  const handleExportCSV = (testType: string) => {
    const filteredData = getFilteredData();
    const dateRange = `${format(new Date(filters.dateStart), 'yyyy-MM-dd')}_${format(new Date(filters.dateEnd), 'yyyy-MM-dd')}`;

    try {
      switch (testType) {
        case 'densityInSitu':
          exportDensidadeInSituCSV(filteredData.densityInSitu, `densidade_in_situ_${dateRange}`);
          break;
        case 'densityReal':
          exportDensidadeRealCSV(filteredData.densityReal, `densidade_real_${dateRange}`);
          break;
        case 'densityMaxMin':
          exportDensidadeMaxMinCSV(filteredData.densityMaxMin, `densidade_max_min_${dateRange}`);
          break;
        case 'consolidated':
          exportConsolidatedReport(
            filteredData.densityInSitu, 
            filteredData.densityReal, 
            filteredData.densityMaxMin, 
            `relatorio_consolidado_${dateRange}.json`
          );
          break;
      }
      
      toast({
        title: "Exportação concluída",
        description: `Relatório ${testType} exportado com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o relatório.",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = (testType: string) => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A exportação em PDF estará disponível em breve.",
    });
  };

  const updateFilter = (key: keyof ReportFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      dateStart: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
      dateEnd: format(new Date(), 'yyyy-MM-dd'),
      location: '',
      responsible: '',
      testType: 'all'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  const totalTests = statistics.densityInSitu.total + statistics.densityReal.total + statistics.densityMaxMin.total;
  const thisMonthTotal = statistics.densityInSitu.thisMonth + statistics.densityReal.thisMonth + statistics.densityMaxMin.thisMonth;
  const lastMonthTotal = statistics.densityInSitu.lastMonth + statistics.densityReal.lastMonth + statistics.densityMaxMin.lastMonth;
  const averagePerDayTotal = (statistics.densityInSitu.averagePerDay + statistics.densityReal.averagePerDay + statistics.densityMaxMin.averagePerDay);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatórios e Análises</h1>
          <p className="text-gray-600">Análise detalhada dos ensaios realizados</p>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="dateStart">Data Início</Label>
                <Input
                  id="dateStart"
                  type="date"
                  value={filters.dateStart}
                  onChange={(e) => updateFilter('dateStart', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dateEnd">Data Fim</Label>
                <Input
                  id="dateEnd"
                  type="date"
                  value={filters.dateEnd}
                  onChange={(e) => updateFilter('dateEnd', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  placeholder="Filtrar por local..."
                  value={filters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="responsible">Responsável</Label>
                <Input
                  id="responsible"
                  placeholder="Filtrar por responsável..."
                  value={filters.responsible}
                  onChange={(e) => updateFilter('responsible', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="testType">Tipo de Ensaio</Label>
                <Select value={filters.testType} onValueChange={(value) => updateFilter('testType', value as ReportFilters['testType'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="densityInSitu">Densidade In Situ</SelectItem>
                    <SelectItem value="densityReal">Densidade Real</SelectItem>
                    <SelectItem value="densityMaxMin">Densidade Máx/Min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={resetFilters}>
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Ensaios</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTests}</div>
              <p className="text-xs text-muted-foreground">
                No período selecionado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{thisMonthTotal}</div>
              <p className="text-xs text-muted-foreground">
                {thisMonthTotal > lastMonthTotal ? '+' : ''}{thisMonthTotal - lastMonthTotal} vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média Diária</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averagePerDayTotal.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Ensaios por dia
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Densidade In Situ</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.densityInSitu.total}</div>
              <p className="text-xs text-muted-foreground">
                {((statistics.densityInSitu.total / totalTests) * 100 || 0).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Exportações */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Exportar Relatórios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button onClick={() => handleExportCSV('densityInSitu')} variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Densidade In Situ (CSV)
              </Button>
              <Button onClick={() => handleExportCSV('densityReal')} variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Densidade Real (CSV)
              </Button>
              <Button onClick={() => handleExportCSV('densityMaxMin')} variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Densidade Máx/Min (CSV)
              </Button>
              <Button onClick={() => handleExportCSV('consolidated')} className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Relatório Consolidado (CSV)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detalhes por Tipo de Ensaio */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="density-in-situ">Densidade In Situ</TabsTrigger>
            <TabsTrigger value="density-real">Densidade Real</TabsTrigger>
            <TabsTrigger value="density-max-min">Densidade Máx/Min</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Tipo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Densidade In Situ</span>
                      <Badge variant="secondary">{statistics.densityInSitu.total}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Densidade Real</span>
                      <Badge variant="secondary">{statistics.densityReal.total}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Densidade Máx/Min</span>
                      <Badge variant="secondary">{statistics.densityMaxMin.total}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tendência Mensal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Este Mês</span>
                      <div className="flex items-center gap-2">
                        <Badge>{thisMonthTotal}</Badge>
                        {thisMonthTotal > lastMonthTotal ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Mês Anterior</span>
                      <Badge variant="outline">{lastMonthTotal}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Variação</span>
                      <Badge variant={thisMonthTotal > lastMonthTotal ? "default" : "secondary"}>
                        {thisMonthTotal > lastMonthTotal ? '+' : ''}{thisMonthTotal - lastMonthTotal}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="density-in-situ">
            <Card>
              <CardHeader>
                <CardTitle>Densidade In Situ - Detalhes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{statistics.densityInSitu.total}</div>
                      <p className="text-sm text-muted-foreground">Total de Ensaios</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{statistics.densityInSitu.thisMonth}</div>
                      <p className="text-sm text-muted-foreground">Este Mês</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{statistics.densityInSitu.averagePerDay.toFixed(1)}</div>
                      <p className="text-sm text-muted-foreground">Média/Dia</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Por Localização</h4>
                    <div className="space-y-2">
                      {Object.entries(statistics.densityInSitu.byLocation).map(([location, count]) => (
                        <div key={location} className="flex items-center justify-between">
                          <span className="text-sm">{location}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="density-real">
            <Card>
              <CardHeader>
                <CardTitle>Densidade Real - Detalhes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{statistics.densityReal.total}</div>
                      <p className="text-sm text-muted-foreground">Total de Ensaios</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{statistics.densityReal.thisMonth}</div>
                      <p className="text-sm text-muted-foreground">Este Mês</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{statistics.densityReal.averagePerDay.toFixed(1)}</div>
                      <p className="text-sm text-muted-foreground">Média/Dia</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Por Localização</h4>
                    <div className="space-y-2">
                      {Object.entries(statistics.densityReal.byLocation).map(([location, count]) => (
                        <div key={location} className="flex items-center justify-between">
                          <span className="text-sm">{location}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="density-max-min">
            <Card>
              <CardHeader>
                <CardTitle>Densidade Máxima/Mínima - Detalhes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{statistics.densityMaxMin.total}</div>
                      <p className="text-sm text-muted-foreground">Total de Ensaios</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{statistics.densityMaxMin.thisMonth}</div>
                      <p className="text-sm text-muted-foreground">Este Mês</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{statistics.densityMaxMin.averagePerDay.toFixed(1)}</div>
                      <p className="text-sm text-muted-foreground">Média/Dia</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Por Localização</h4>
                    <div className="space-y-2">
                      {Object.entries(statistics.densityMaxMin.byLocation).map(([location, count]) => (
                        <div key={location} className="flex items-center justify-between">
                          <span className="text-sm">{location}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}