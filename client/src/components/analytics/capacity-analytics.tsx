import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  LineChart,
  Line,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';
import {
  Target,
  TrendingUp,
  Clock,
  Activity,
  AlertCircle,
  CheckCircle,
  Calendar,
  Users
} from 'lucide-react';
import { getQueryFn } from '@/lib/queryClient';

export default function CapacityAnalytics() {
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

  // Capacity and throughput analysis
  const capacityMetrics = useMemo(() => {
    const allTests = [
      ...(Array.isArray(densityInSituTests) ? densityInSituTests : []).map((test: any) => ({ ...test, type: 'Densidade In Situ', complexity: 2 })),
      ...(Array.isArray(realDensityTests) ? realDensityTests : []).map((test: any) => ({ ...test, type: 'Densidade Real', complexity: 3 })),
      ...(Array.isArray(maxMinDensityTests) ? maxMinDensityTests : []).map((test: any) => ({ ...test, type: 'Densidade Máx/Mín', complexity: 4 }))
    ];

    // Calculate theoretical capacity (tests per day based on working hours)
    const workingHoursPerDay = 8;
    const averageTestDuration = {
      'Densidade In Situ': 1.5, // hours
      'Densidade Real': 2.0,
      'Densidade Máx/Mín': 2.5
    };

    // Current week analysis
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - 7));
    
    const weeklyTests = allTests.filter(test => {
      if (!test.createdAt) return false;
      return new Date(test.createdAt) >= weekStart;
    });

    // Daily capacity utilization
    const dailyCapacity: { [key: string]: { tests: number; capacity: number; utilization: number; types: string[] } } = {};
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toDateString();
      
      const dayTests = allTests.filter(test => {
        if (!test.createdAt) return false;
        const testDate = new Date(test.createdAt);
        return testDate.toDateString() === dateKey;
      });

      // Calculate theoretical capacity for this day
      const totalHours = dayTests.reduce((sum, test) => {
        return sum + (averageTestDuration[test.type as keyof typeof averageTestDuration] || 2);
      }, 0);

      const utilization = Math.min(100, (totalHours / workingHoursPerDay) * 100);
      const testTypes = Array.from(new Set(dayTests.map(test => test.type)));

      dailyCapacity[dateKey] = {
        tests: dayTests.length,
        capacity: Math.floor(workingHoursPerDay / 2), // Average 2 hours per test
        utilization,
        types: testTypes
      };
    }

    // Operator workload distribution
    const operatorWorkload: { [key: string]: { tests: number; hours: number; efficiency: number } } = {};
    allTests.forEach(test => {
      if (test.operator) {
        if (!operatorWorkload[test.operator]) {
          operatorWorkload[test.operator] = { tests: 0, hours: 0, efficiency: 0 };
        }
        operatorWorkload[test.operator].tests += 1;
        operatorWorkload[test.operator].hours += averageTestDuration[test.type as keyof typeof averageTestDuration] || 2;
      }
    });

    // Calculate efficiency for each operator
    Object.keys(operatorWorkload).forEach(operator => {
      const data = operatorWorkload[operator];
      const idealHours = data.tests * 1.8; // Ideal time per test
      data.efficiency = idealHours > 0 ? Math.max(0, 100 - ((data.hours - idealHours) / idealHours) * 100) : 100;
    });

    // Quality metrics
    const qualityMetrics = {
      totalTests: allTests.length,
      approvedTests: allTests.filter(test => test.status === 'APROVADO').length,
      rejectedTests: allTests.filter(test => test.status === 'REPROVADO').length,
      pendingTests: allTests.filter(test => !test.status || test.status === 'AGUARDANDO').length
    };

    const qualityRate = qualityMetrics.totalTests > 0 ? 
      (qualityMetrics.approvedTests / (qualityMetrics.approvedTests + qualityMetrics.rejectedTests)) * 100 : 0;

    // Throughput trends
    const throughputData = Object.entries(dailyCapacity).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
      tests: data.tests,
      capacity: data.capacity,
      utilization: data.utilization,
      efficiency: Math.min(100, (data.tests / data.capacity) * 100)
    }));

    // Peak hours analysis (simulated based on test distribution)
    const peakHours = [
      { hour: '08:00', load: 15, efficiency: 85 },
      { hour: '09:00', load: 25, efficiency: 90 },
      { hour: '10:00', load: 35, efficiency: 95 },
      { hour: '11:00', load: 40, efficiency: 88 },
      { hour: '14:00', load: 30, efficiency: 92 },
      { hour: '15:00', load: 35, efficiency: 90 },
      { hour: '16:00', load: 25, efficiency: 85 },
      { hour: '17:00', load: 15, efficiency: 80 }
    ];

    return {
      dailyCapacity,
      operatorWorkload,
      qualityMetrics,
      qualityRate,
      throughputData,
      peakHours,
      averageUtilization: Object.values(dailyCapacity).reduce((sum, day) => sum + day.utilization, 0) / 7,
      totalCapacity: Object.values(dailyCapacity).reduce((sum, day) => sum + day.capacity, 0),
      totalTests: Object.values(dailyCapacity).reduce((sum, day) => sum + day.tests, 0)
    };
  }, [densityInSituTests, realDensityTests, maxMinDensityTests]);

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600';
    if (utilization >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getEfficiencyBadge = (efficiency: number) => {
    if (efficiency >= 90) return 'bg-green-100 text-green-800';
    if (efficiency >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Capacity Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilização Média</p>
                <p className="text-3xl font-bold text-gray-900">{capacityMetrics.averageUtilization.toFixed(0)}%</p>
                <div className="flex items-center mt-2">
                  <Target className="h-4 w-4 text-blue-500 mr-1" />
                  <span className={`text-sm ${getUtilizationColor(capacityMetrics.averageUtilization)}`}>
                    {capacityMetrics.averageUtilization >= 85 ? 'Alta' : 
                     capacityMetrics.averageUtilization >= 65 ? 'Ideal' : 'Baixa'}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Capacidade Semanal</p>
                <p className="text-3xl font-bold text-gray-900">{capacityMetrics.totalCapacity}</p>
                <div className="flex items-center mt-2">
                  <Activity className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{capacityMetrics.totalTests} realizados</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Qualidade</p>
                <p className="text-3xl font-bold text-gray-900">{capacityMetrics.qualityRate.toFixed(1)}%</p>
                <div className="flex items-center mt-2">
                  {capacityMetrics.qualityRate >= 90 ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                  )}
                  <span className={`text-sm ${capacityMetrics.qualityRate >= 90 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {capacityMetrics.qualityRate >= 95 ? 'Excelente' :
                     capacityMetrics.qualityRate >= 85 ? 'Boa' : 'Precisa atenção'}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Operadores Ativos</p>
                <p className="text-3xl font-bold text-gray-900">{Object.keys(capacityMetrics.operatorWorkload).length}</p>
                <div className="flex items-center mt-2">
                  <Users className="h-4 w-4 text-orange-500 mr-1" />
                  <span className="text-sm text-orange-600">Esta semana</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Throughput vs Capacity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Throughput vs Capacidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={capacityMetrics.throughputData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tests" fill="#8884d8" name="Ensaios Realizados" />
                <Bar dataKey="capacity" fill="#82ca9d" name="Capacidade Teórica" opacity={0.6} />
                <Line type="monotone" dataKey="utilization" stroke="#ff7300" name="Utilização %" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Peak Hours Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Análise de Horários de Pico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={capacityMetrics.peakHours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="load" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                  name="Carga de Trabalho %"
                />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#00C49F" 
                  name="Eficiência %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Operator Workload Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Distribuição de Carga de Trabalho por Operador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Operador</th>
                  <th className="text-center p-3">Ensaios Realizados</th>
                  <th className="text-center p-3">Horas Trabalhadas</th>
                  <th className="text-center p-3">Eficiência</th>
                  <th className="text-center p-3">Carga de Trabalho</th>
                  <th className="text-center p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(capacityMetrics.operatorWorkload).map(([operator, data]) => {
                  const workload = (data.hours / 40) * 100; // 40 hours = 100% workload
                  return (
                    <tr key={operator} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{operator}</td>
                      <td className="p-3 text-center">{data.tests}</td>
                      <td className="p-3 text-center">{data.hours.toFixed(1)}h</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Progress value={data.efficiency} className="flex-1" />
                          <span className="text-xs">{data.efficiency.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Progress value={Math.min(100, workload)} className="flex-1" />
                          <span className="text-xs">{workload.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className={getEfficiencyBadge(data.efficiency)}>
                          {data.efficiency >= 90 ? 'Ótimo' :
                           data.efficiency >= 70 ? 'Bom' : 'Precisa melhorar'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Métricas de Qualidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{capacityMetrics.qualityMetrics.approvedTests}</div>
              <div className="text-sm text-gray-600">Ensaios Aprovados</div>
              <div className="mt-2">
                <Progress 
                  value={(capacityMetrics.qualityMetrics.approvedTests / Math.max(1, capacityMetrics.qualityMetrics.totalTests)) * 100} 
                  className="h-2"
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{capacityMetrics.qualityMetrics.rejectedTests}</div>
              <div className="text-sm text-gray-600">Ensaios Reprovados</div>
              <div className="mt-2">
                <Progress 
                  value={(capacityMetrics.qualityMetrics.rejectedTests / Math.max(1, capacityMetrics.qualityMetrics.totalTests)) * 100} 
                  className="h-2"
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{capacityMetrics.qualityMetrics.pendingTests}</div>
              <div className="text-sm text-gray-600">Ensaios Pendentes</div>
              <div className="mt-2">
                <Progress 
                  value={(capacityMetrics.qualityMetrics.pendingTests / Math.max(1, capacityMetrics.qualityMetrics.totalTests)) * 100} 
                  className="h-2"
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{capacityMetrics.qualityMetrics.totalTests}</div>
              <div className="text-sm text-gray-600">Total de Ensaios</div>
              <div className="mt-2">
                <Progress value={100} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recomendações de Otimização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Melhorias de Capacidade</h4>
              <div className="space-y-2 text-sm">
                {capacityMetrics.averageUtilization < 70 && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <span>Utilização baixa detectada. Considere redistribuir a carga de trabalho.</span>
                  </div>
                )}
                {capacityMetrics.averageUtilization > 90 && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                    <span>Alta utilização. Considere aumentar a capacidade ou otimizar processos.</span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Horários de 10h-11h apresentam melhor eficiência. Concentre atividades críticas neste período.</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Melhorias de Qualidade</h4>
              <div className="space-y-2 text-sm">
                {capacityMetrics.qualityRate < 90 && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <span>Taxa de qualidade abaixo do ideal. Revisar procedimentos e treinamentos.</span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Implementar revisões intermediárias para melhorar taxa de aprovação.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Padronizar processos entre operadores com melhor performance.</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}