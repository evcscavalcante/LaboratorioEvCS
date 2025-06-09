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
  Area,
  AreaChart
} from 'recharts';
import {
  Wrench,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { getQueryFn } from '@/lib/queryClient';

export default function EquipmentAnalytics() {
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

  // Equipment utilization analysis
  const equipmentMetrics = useMemo(() => {
    const allTests = [
      ...(Array.isArray(densityInSituTests) ? densityInSituTests : []),
      ...(Array.isArray(realDensityTests) ? realDensityTests : []),
      ...(Array.isArray(maxMinDensityTests) ? maxMinDensityTests : [])
    ];

    // Balance utilization
    const balanceUsage: { [key: string]: number } = {};
    const ovenUsage: { [key: string]: number } = {};
    
    allTests.forEach(test => {
      if (test.balanceId) {
        balanceUsage[test.balanceId] = (balanceUsage[test.balanceId] || 0) + 1;
      }
      if (test.ovenId) {
        ovenUsage[test.ovenId] = (ovenUsage[test.ovenId] || 0) + 1;
      }
    });

    // Equipment efficiency (tests per equipment per day)
    const equipmentEfficiency = Object.entries(balanceUsage).map(([equipment, count]) => ({
      equipment: `Balança ${equipment}`,
      tests: count,
      type: 'balance',
      efficiency: Math.min(100, (count / Math.max(1, allTests.length / Object.keys(balanceUsage).length)) * 100),
      status: count > 5 ? 'high' : count > 2 ? 'medium' : 'low'
    }));

    const ovenEfficiency = Object.entries(ovenUsage).map(([equipment, count]) => ({
      equipment: `Estufa ${equipment}`,
      tests: count,
      type: 'oven',
      efficiency: Math.min(100, (count / Math.max(1, allTests.length / Object.keys(ovenUsage).length)) * 100),
      status: count > 5 ? 'high' : count > 2 ? 'medium' : 'low'
    }));

    const allEquipment = [...equipmentEfficiency, ...ovenEfficiency];

    // Time-based analysis (mock processing times based on test complexity)
    const processingTimes = allTests.map(test => {
      let baseTime = 0;
      if (test.type === 'Densidade In Situ') baseTime = 45;
      else if (test.type === 'Densidade Real') baseTime = 60;
      else if (test.type === 'Densidade Máx/Mín') baseTime = 90;
      
      return {
        date: test.createdAt || new Date().toISOString(),
        processingTime: baseTime + (Math.random() * 20 - 10), // ±10 min variation
        testType: test.type || 'Unknown'
      };
    });

    // Daily processing trends
    const dailyProcessing: { [key: string]: { total: number; avgTime: number; count: number } } = {};
    processingTimes.forEach(({ date, processingTime }) => {
      const day = new Date(date).toDateString();
      if (!dailyProcessing[day]) {
        dailyProcessing[day] = { total: 0, avgTime: 0, count: 0 };
      }
      dailyProcessing[day].total += processingTime;
      dailyProcessing[day].count += 1;
      dailyProcessing[day].avgTime = dailyProcessing[day].total / dailyProcessing[day].count;
    });

    const trendData = Object.entries(dailyProcessing)
      .slice(-7) // Last 7 days
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
        avgTime: Math.round(data.avgTime),
        tests: data.count,
        efficiency: Math.max(0, 100 - (data.avgTime - 60)) // Efficiency based on time vs target
      }));

    return {
      allEquipment,
      balanceCount: Object.keys(balanceUsage).length,
      ovenCount: Object.keys(ovenUsage).length,
      totalUtilization: allTests.length,
      avgProcessingTime: processingTimes.length > 0 ? 
        processingTimes.reduce((sum, t) => sum + t.processingTime, 0) / processingTimes.length : 0,
      trendData
    };
  }, [densityInSituTests, realDensityTests, maxMinDensityTests]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'high': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'low': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Equipment Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Balanças Ativas</p>
                <p className="text-3xl font-bold text-gray-900">{equipmentMetrics.balanceCount}</p>
                <div className="flex items-center mt-2">
                  <Wrench className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600">Em operação</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Wrench className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estufas Ativas</p>
                <p className="text-3xl font-bold text-gray-900">{equipmentMetrics.ovenCount}</p>
                <div className="flex items-center mt-2">
                  <Wrench className="h-4 w-4 text-orange-500 mr-1" />
                  <span className="text-sm text-orange-600">Em operação</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Wrench className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilização Total</p>
                <p className="text-3xl font-bold text-gray-900">{equipmentMetrics.totalUtilization}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">Ensaios processados</span>
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
                <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                <p className="text-3xl font-bold text-gray-900">{equipmentMetrics.avgProcessingTime.toFixed(0)}min</p>
                <div className="flex items-center mt-2">
                  <Clock className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-sm text-purple-600">Por ensaio</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Utilização de Equipamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={equipmentMetrics.allEquipment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="equipment" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tests" fill="#8884d8" name="Ensaios Realizados" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Processing Time Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tendência de Tempo de Processamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={equipmentMetrics.trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="avgTime" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                  name="Tempo Médio (min)"
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

      {/* Equipment Details Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Status Detalhado dos Equipamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Equipamento</th>
                  <th className="text-center p-3">Tipo</th>
                  <th className="text-center p-3">Ensaios Realizados</th>
                  <th className="text-center p-3">Eficiência de Uso</th>
                  <th className="text-center p-3">Status Operacional</th>
                  <th className="text-center p-3">Recomendação</th>
                </tr>
              </thead>
              <tbody>
                {equipmentMetrics.allEquipment.map((equipment) => (
                  <tr key={equipment.equipment} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{equipment.equipment}</td>
                    <td className="p-3 text-center">
                      <Badge variant="outline">
                        {equipment.type === 'balance' ? 'Balança' : 'Estufa'}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">{equipment.tests}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Progress value={equipment.efficiency} className="flex-1" />
                        <span className="text-xs">{equipment.efficiency.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {getStatusIcon(equipment.status)}
                        <Badge className={getStatusColor(equipment.status)}>
                          {equipment.status === 'high' ? 'Ótimo' : 
                           equipment.status === 'medium' ? 'Normal' : 'Baixo'}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-xs text-gray-600">
                        {equipment.status === 'high' ? 'Manter uso atual' :
                         equipment.status === 'medium' ? 'Monitorar uso' : 'Verificar manutenção'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Cronograma de Manutenção Sugerido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipmentMetrics.allEquipment.map((equipment) => (
              <div key={equipment.equipment} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{equipment.equipment}</h4>
                  {getStatusIcon(equipment.status)}
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>Última calibração: há 30 dias</div>
                  <div>Próxima manutenção: 
                    <span className={equipment.status === 'low' ? 'text-red-600 font-medium' : 'text-green-600'}>
                      {equipment.status === 'low' ? ' Urgente' : ' 15 dias'}
                    </span>
                  </div>
                  <div>Uso atual: {equipment.tests} ensaios</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}