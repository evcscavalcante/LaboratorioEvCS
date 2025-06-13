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
import { format, startOfMonth, endOfMonth, subMonths, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { localDataManager } from '@/lib/local-storage';
import { 
  exportDensidadeInSituCSV, 
  exportDensidadeRealCSV, 
  exportDensidadeMaxMinCSV,
  exportConsolidatedReport 
} from '@/lib/data-export';
import { useToast } from '@/hooks/use-toast';

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

export default function Relatorios() {
  const [filters, setFilters] = useState<ReportFilters>({
    dateStart: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    dateEnd: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    location: '',
    responsible: '',
    testType: 'all'
  });

  const [statistics, setStatistics] = useState<{
    densityInSitu: TestStatistics;
    densityReal: TestStatistics;
    densityMaxMin: TestStatistics;
  } | null>(null);

  const [allData, setAllData] = useState<{
    densityInSitu: any[];
    densityReal: any[];
    densityMaxMin: any[];
  }>({
    densityInSitu: [],
    densityReal: [],
    densityMaxMin: []
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (allData.densityInSitu.length > 0 || allData.densityReal.length > 0 || allData.densityMaxMin.length > 0) {
      calculateStatistics();
    }
  }, [allData, filters]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [densityInSitu, densityReal, densityMaxMin] = await Promise.all([
        localDataManager.getDensityInSituTests(),
        localDataManager.getDensityRealTests(),
        localDataManager.getDensityMaxMinTests()
      ]);

      setAllData({
        densityInSitu,
        densityReal,
        densityMaxMin
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

  const calculateStatistics = () => {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const calculateForTestType = (data: any[]): TestStatistics => {
      const filtered = filterData(data);
      
      const thisMonth = data.filter(test => {
        const testDate = new Date(test.dataEnsaio);
        return testDate >= thisMonthStart;
      }).length;

      const lastMonth = data.filter(test => {
        const testDate = new Date(test.dataEnsaio);
        return testDate >= lastMonthStart && testDate <= lastMonthEnd;
      }).length;

      const byLocation: Record<string, number> = {};
      const byResponsible: Record<string, number> = {};
      const byMonth: Record<string, number> = {};

      filtered.forEach(test => {
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

  const filterData = (data: any[]) => {
    return data.filter(test => {
      const testDate = new Date(test.dataEnsaio);
      const startDate = new Date(filters.dateStart);
      const endDate = new Date(filters.dateEnd);

      const dateInRange = testDate >= startDate && testDate <= endDate;
      const locationMatch = !filters.location || test.localizacao?.toLowerCase().includes(filters.location.toLowerCase());
      const responsibleMatch = !filters.responsible || test.responsavel?.toLowerCase().includes(filters.responsible.toLowerCase());

      return dateInRange && locationMatch && responsibleMatch;
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
          if (filteredData.densityInSitu.length === 0) {
            toast({
              title: "Sem dados",
              description: "Não há dados de densidade in situ para exportar com os filtros aplicados.",
              variant: "destructive",
            });
            return;
          }
          exportDensidadeInSituCSV(filteredData.densityInSitu, `densidade-in-situ_${dateRange}.csv`);
          break;
        case 'densityReal':
          if (filteredData.densityReal.length === 0) {
            toast({
              title: "Sem dados",
              description: "Não há dados de densidade real para exportar com os filtros aplicados.",
              variant: "destructive",
            });
            return;
          }
          exportDensidadeRealCSV(filteredData.densityReal, `densidade-real_${dateRange}.csv`);
          break;
        case 'densityMaxMin':
          if (filteredData.densityMaxMin.length === 0) {
            toast({
              title: "Sem dados",
              description: "Não há dados de densidade máx/mín para exportar com os filtros aplicados.",
              variant: "destructive",
            });
            return;
          }
          exportDensidadeMaxMinCSV(filteredData.densityMaxMin, `densidade-max-min_${dateRange}.csv`);
          break;
        case 'all':
          exportConsolidatedReport(
            filteredData.densityInSitu,
            filteredData.densityReal,
            filteredData.densityMaxMin,
            `relatorio-consolidado_${dateRange}.json`
          );
          break;
      }

      toast({
        title: "Exportação concluída",
        description: "O arquivo foi baixado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados.",
        variant: "destructive",
      });
    }
  };

  const updateFilter = (key: keyof ReportFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      dateStart: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
      dateEnd: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
      location: '',
      responsible: '',
      testType: 'all'
    });
  };

  const StatCard: React.FC<{ title: string; value: number; change?: number; icon: React.ReactNode }> = ({
    title,
    value,
    change,
    icon
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {change !== undefined && (
              <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '+' : ''}{change} vs mês anterior
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TopItemsList: React.FC<{ title: string; data: Record<string, number>; icon: React.ReactNode }> = ({
    title,
    data,
    icon
  }) => {
    const sortedData = Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sortedData.map(([key, value], index) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate">{key}</span>
                <Badge variant="secondary">{value}</Badge>
              </div>
            ))}
            {sortedData.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Nenhum dado disponível</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="w-8 h-8" />
          Relatórios e Análises
        </h1>
        <p className="text-gray-600 mt-2">
          Visualize e exporte dados dos ensaios realizados no laboratório
        </p>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateStart">Data Início</Label>
              <Input
                id="dateStart"
                type="date"
                value={filters.dateStart}
                onChange={(e) => updateFilter('dateStart', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateEnd">Data Fim</Label>
              <Input
                id="dateEnd"
                type="date"
                value={filters.dateEnd}
                onChange={(e) => updateFilter('dateEnd', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                placeholder="Filtrar por local"
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsible">Responsável</Label>
              <Input
                id="responsible"
                placeholder="Filtrar por responsável"
                value={filters.responsible}
                onChange={(e) => updateFilter('responsible', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testType">Tipo de Ensaio</Label>
              <Select value={filters.testType} onValueChange={(value) => updateFilter('testType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="densityInSitu">Densidade In Situ</SelectItem>
                  <SelectItem value="densityReal">Densidade Real</SelectItem>
                  <SelectItem value="densityMaxMin">Densidade Máx/Mín</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={resetFilters} variant="outline" size="sm">
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="exports" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {statistics && (
            <>
              {/* Cards de Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Densidade In Situ"
                  value={statistics.densityInSitu.total}
                  change={statistics.densityInSitu.thisMonth - statistics.densityInSitu.lastMonth}
                  icon={<Target className="w-6 h-6 text-blue-600" />}
                />
                <StatCard
                  title="Densidade Real"
                  value={statistics.densityReal.total}
                  change={statistics.densityReal.thisMonth - statistics.densityReal.lastMonth}
                  icon={<TrendingUp className="w-6 h-6 text-green-600" />}
                />
                <StatCard
                  title="Densidade Máx/Mín"
                  value={statistics.densityMaxMin.total}
                  change={statistics.densityMaxMin.thisMonth - statistics.densityMaxMin.lastMonth}
                  icon={<BarChart3 className="w-6 h-6 text-purple-600" />}
                />
                <StatCard
                  title="Total de Ensaios"
                  value={statistics.densityInSitu.total + statistics.densityReal.total + statistics.densityMaxMin.total}
                  icon={<CheckCircle className="w-6 h-6 text-orange-600" />}
                />
              </div>

              {/* Gráficos e Listas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <TopItemsList
                  title="Por Localização"
                  data={{
                    ...statistics.densityInSitu.byLocation,
                    ...Object.fromEntries(
                      Object.entries(statistics.densityReal.byLocation).map(([k, v]) => [
                        k,
                        v + (statistics.densityInSitu.byLocation[k] || 0)
                      ])
                    )
                  }}
                  icon={<Map className="w-4 h-4" />}
                />
                <TopItemsList
                  title="Por Responsável"
                  data={{
                    ...statistics.densityInSitu.byResponsible,
                    ...Object.fromEntries(
                      Object.entries(statistics.densityReal.byResponsible).map(([k, v]) => [
                        k,
                        v + (statistics.densityInSitu.byResponsible[k] || 0)
                      ])
                    )
                  }}
                  icon={<Users className="w-4 h-4" />}
                />
                <TopItemsList
                  title="Por Mês"
                  data={{
                    ...statistics.densityInSitu.byMonth,
                    ...Object.fromEntries(
                      Object.entries(statistics.densityReal.byMonth).map(([k, v]) => [
                        k,
                        v + (statistics.densityInSitu.byMonth[k] || 0)
                      ])
                    )
                  }}
                  icon={<Calendar className="w-4 h-4" />}
                />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="exports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Densidade In Situ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Exportar dados de ensaios de densidade in situ
                </p>
                <Button
                  onClick={() => handleExportCSV('densityInSitu')}
                  className="w-full flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Densidade Real</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Exportar dados de ensaios de densidade real
                </p>
                <Button
                  onClick={() => handleExportCSV('densityReal')}
                  className="w-full flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Densidade Máx/Mín</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Exportar dados de ensaios de densidade máxima e mínima
                </p>
                <Button
                  onClick={() => handleExportCSV('densityMaxMin')}
                  className="w-full flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Relatório Consolidado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Exportar todos os dados em um arquivo único
                </p>
                <Button
                  onClick={() => handleExportCSV('all')}
                  className="w-full flex items-center gap-2"
                  variant="outline"
                >
                  <Download className="w-4 h-4" />
                  Exportar JSON
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}