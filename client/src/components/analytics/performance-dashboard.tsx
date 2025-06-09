import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  TestTube,
  Calendar,
  BarChart3,
  Activity
} from 'lucide-react';
import { getQueryFn } from '@/lib/queryClient';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function PerformanceDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Fetch all test data
  const { data: densityInSituTests = [] } = useQuery({
    queryKey: ['/api/density-in-situ'],
    queryFn: getQueryFn({ on401: 'returnNull' })
  });

  const { data: realDensityTests = [] } = useQuery({
    queryKey: ['/api/real-density'],
    queryFn: getQueryFn({ on401: 'returnNull' })
  });

  const { data: maxMinDensityTests = [] } = useQuery({
    queryKey: ['/api/max-min-density'],
    queryFn: getQueryFn({ on401: 'returnNull' })
  });

  // Combine all tests with type information
  const allTests = useMemo(() => {
    const combined = [
      ...(Array.isArray(densityInSituTests) ? densityInSituTests : []).map((test: any) => ({ ...test, type: 'Densidade In Situ' })),
      ...(Array.isArray(realDensityTests) ? realDensityTests : []).map((test: any) => ({ ...test, type: 'Densidade Real' })),
      ...(Array.isArray(maxMinDensityTests) ? maxMinDensityTests : []).map((test: any) => ({ ...test, type: 'Densidade Máx/Mín' }))
    ];

    // Filter by time range
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case '24h':
        cutoffDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      default:
        cutoffDate.setDate(now.getDate() - 7);
    }

    return combined.filter(test => {
      if (!test.createdAt) return true;
      return new Date(test.createdAt) >= cutoffDate;
    });
  }, [densityInSituTests, realDensityTests, maxMinDensityTests, timeRange]);

  // Calculate performance metrics from real data
  const metrics = useMemo(() => {
    const totalTests = allTests.length;
    const completedTests = allTests.filter(test => test.status && test.status !== 'AGUARDANDO').length;
    const approvedTests = allTests.filter(test => test.status === 'APROVADO').length;
    
    // Operator efficiency (tests per operator)
    const operatorCounts: { [key: string]: number } = {};
    const operatorApproved: { [key: string]: number } = {};
    allTests.forEach(test => {
      if (test.operator) {
        operatorCounts[test.operator] = (operatorCounts[test.operator] || 0) + 1;
        if (test.status === 'APROVADO') {
          operatorApproved[test.operator] = (operatorApproved[test.operator] || 0) + 1;
        }
      }
    });

    // Test type distribution
    const typeDistribution: { [key: string]: number } = {};
    allTests.forEach(test => {
      typeDistribution[test.type] = (typeDistribution[test.type] || 0) + 1;
    });

    // Status distribution
    const statusDistribution: { [key: string]: number } = {};
    allTests.forEach(test => {
      const status = test.status || 'AGUARDANDO';
      statusDistribution[status] = (statusDistribution[status] || 0) + 1;
    });

    // Daily trends based on actual creation dates
    const dailyTrends: Array<{ date: string; tests: number; approved: number; rejected: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dayTests = allTests.filter(test => {
        if (!test.createdAt) return false;
        const testDate = new Date(test.createdAt);
        return testDate.toDateString() === date.toDateString();
      });
      
      const approvedCount = dayTests.filter(test => test.status === 'APROVADO').length;
      const rejectedCount = dayTests.filter(test => test.status === 'REPROVADO').length;
      
      dailyTrends.push({
        date: date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
        tests: dayTests.length,
        approved: approvedCount,
        rejected: rejectedCount
      });
    }

    // Calculate operator efficiency based on approval rate
    const operatorEfficiency: { [key: string]: { tests: number; approvalRate: number; efficiency: number } } = {};
    Object.keys(operatorCounts).forEach(operator => {
      const tests = operatorCounts[operator];
      const approved = operatorApproved[operator] || 0;
      const approvalRate = tests > 0 ? (approved / tests) * 100 : 0;
      const efficiency = Math.min(100, (tests * 0.7) + (approvalRate * 0.3)); // Combined metric
      
      operatorEfficiency[operator] = {
        tests,
        approvalRate,
        efficiency
      };
    });

    return {
      totalTests,
      completedTests,
      approvalRate: completedTests > 0 ? (approvedTests / completedTests) * 100 : 0,
      operatorEfficiency,
      testTypeDistribution: typeDistribution,
      dailyTrends,
      statusDistribution
    };
  }, [allTests]);

  // Format chart data
  const operatorData = Object.entries(metrics.operatorEfficiency).map(([operator, data]) => ({
    operator,
    tests: data.tests,
    approvalRate: data.approvalRate,
    efficiency: data.efficiency
  }));

  const typeData = Object.entries(metrics.testTypeDistribution).map(([type, count]) => ({
    name: type,
    value: count,
    percentage: metrics.totalTests > 0 ? ((count / metrics.totalTests) * 100).toFixed(1) : '0'
  }));

  const statusData = Object.entries(metrics.statusDistribution).map(([status, count]) => ({
    name: status,
    value: count,
    percentage: metrics.totalTests > 0 ? ((count / metrics.totalTests) * 100).toFixed(1) : '0'
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APROVADO': return '#00C49F';
      case 'REPROVADO': return '#FF8042';
      case 'AGUARDANDO': return '#FFBB28';
      default: return '#8884D8';
    }
  };

  // Calculate trends (compare with previous period)
  const previousPeriodTests = allTests.length; // Would need historical data for real comparison
  const testsTrend = previousPeriodTests > 0 ? ((metrics.totalTests - previousPeriodTests) / previousPeriodTests) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard de Performance</h2>
          <p className="text-gray-600">Análise de eficiência e produtividade do laboratório</p>
        </div>
        
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Últimas 24h</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as métricas</SelectItem>
              <SelectItem value="efficiency">Eficiência</SelectItem>
              <SelectItem value="quality">Qualidade</SelectItem>
              <SelectItem value="productivity">Produtividade</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Ensaios</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.totalTests}</p>
                <div className="flex items-center mt-2">
                  {testsTrend >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${testsTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(testsTrend).toFixed(1)}% período atual
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TestTube className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conclusão</p>
                <p className="text-3xl font-bold text-gray-900">
                  {metrics.totalTests > 0 ? ((metrics.completedTests / metrics.totalTests) * 100).toFixed(1) : 0}%
                </p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-gray-600">{metrics.completedTests} de {metrics.totalTests}</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Operadores Ativos</p>
                <p className="text-3xl font-bold text-gray-900">{Object.keys(metrics.operatorEfficiency).length}</p>
                <div className="flex items-center mt-2">
                  <Users className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600">No período selecionado</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Aprovação</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.approvalRate.toFixed(1)}%</p>
                <div className="flex items-center mt-2">
                  {metrics.approvalRate >= 80 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                  )}
                  <span className={`text-sm ${metrics.approvalRate >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {metrics.approvalRate >= 80 ? 'Excelente' : 'Atenção necessária'}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Tendência Diária de Ensaios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metrics.dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="tests" 
                  stackId="1"
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                  name="Total"
                />
                <Area 
                  type="monotone" 
                  dataKey="approved" 
                  stackId="2"
                  stroke="#00C49F" 
                  fill="#00C49F" 
                  fillOpacity={0.6}
                  name="Aprovados"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Test Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Distribuição por Tipo de Ensaio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operator Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Performance por Operador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={operatorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="operator" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tests" fill="#8884d8" name="Ensaios Realizados" />
                <Bar dataKey="approvalRate" fill="#00C49F" name="Taxa Aprovação %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Distribuição de Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: getStatusColor(item.name) }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{item.value} ensaios</span>
                    <Badge variant="outline">{item.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operator Details Table */}
      {operatorData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Detalhes de Performance dos Operadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Operador</th>
                    <th className="text-center p-3">Ensaios Realizados</th>
                    <th className="text-center p-3">Taxa de Aprovação</th>
                    <th className="text-center p-3">Eficiência Geral</th>
                    <th className="text-center p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {operatorData.map((operator) => (
                    <tr key={operator.operator} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{operator.operator}</td>
                      <td className="p-3 text-center">{operator.tests}</td>
                      <td className="p-3 text-center">{operator.approvalRate.toFixed(1)}%</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Progress value={operator.efficiency} className="flex-1" />
                          <span className="text-xs">{operator.efficiency.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <Badge 
                          variant={operator.efficiency >= 80 ? "default" : operator.efficiency >= 60 ? "secondary" : "destructive"}
                        >
                          {operator.efficiency >= 80 ? "Excelente" : operator.efficiency >= 60 ? "Bom" : "Precisa melhorar"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}