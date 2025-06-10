import React, { useState, useEffect } from "react";
import { FlaskRound, Users, Calendar, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import TestsSidebar from "@/components/dashboard/tests-sidebar";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [, setLocation] = useLocation();

  const handleSelectTest = (testId: number, testType: string) => {
    setLocation(`/laboratory?test=${testType}&id=${testId}&mode=view`);
  };

  const handleEditTest = (testId: number, testType: string) => {
    setLocation(`/laboratory?test=${testType}&id=${testId}&mode=edit`);
  };

  // Fetch all test data for dashboard metrics
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

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentDateTime(formatted);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate dashboard metrics
  const allTests = [
    ...(Array.isArray(densityInSituTests) ? densityInSituTests : []),
    ...(Array.isArray(realDensityTests) ? realDensityTests : []),
    ...(Array.isArray(maxMinDensityTests) ? maxMinDensityTests : [])
  ];

  const todayTests = allTests.filter(test => {
    if (!test.createdAt) return false;
    const testDate = new Date(test.createdAt);
    const today = new Date();
    return testDate.toDateString() === today.toDateString();
  });

  const approvedTests = allTests.filter(test => test.status === 'APROVADO');
  const pendingTests = allTests.filter(test => !test.status || test.status === 'AGUARDANDO');

  // Get unique operators
  const operators = Array.from(new Set(allTests.map(test => test.operator).filter(Boolean)));

  const recentTests = allTests
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5);

  const getTestTypeDisplay = (test: any) => {
    if (densityInSituTests.includes(test)) return 'Densidade In Situ';
    if (realDensityTests.includes(test)) return 'Densidade Real';
    if (maxMinDensityTests.includes(test)) return 'Densidade Máx/Mín';
    return 'Desconhecido';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APROVADO':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'REPROVADO':
        return <Badge className="bg-red-100 text-red-800">Reprovado</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Aguardando</Badge>;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              <FlaskRound className="inline mr-3 text-blue-600" size={32} />
              Dashboard - Laboratório Ev.C.S
            </h1>
            <p className="text-gray-600">
              Sistema de Ensaios Geotécnicos - ABNT NBR 6457 e NBR 9813
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">{currentDateTime}</div>
            <div className="text-sm text-gray-500">Atualização em tempo real</div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Ensaios</p>
                <p className="text-3xl font-bold text-gray-900">{allTests.length}</p>
                <div className="flex items-center mt-2">
                  <Activity className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600">Todos os tipos</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FlaskRound className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ensaios Hoje</p>
                <p className="text-3xl font-bold text-gray-900">{todayTests.length}</p>
                <div className="flex items-center mt-2">
                  <Calendar className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">Últimas 24h</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aprovados</p>
                <p className="text-3xl font-bold text-gray-900">{approvedTests.length}</p>
                <div className="flex items-center mt-2">
                  <Activity className="h-4 w-4 text-emerald-500 mr-1" />
                  <span className="text-sm text-emerald-600">
                    {allTests.length > 0 ? Math.round((approvedTests.length / allTests.length) * 100) : 0}% do total
                  </span>
                </div>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Operadores Ativos</p>
                <p className="text-3xl font-bold text-gray-900">{operators.length}</p>
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

      {/* Recent Tests and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tests */}
        <Card>
          <CardHeader>
            <CardTitle>Ensaios Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTests.length > 0 ? recentTests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{test.registrationNumber || `Ensaio #${index + 1}`}</div>
                    <div className="text-sm text-gray-600">{getTestTypeDisplay(test)}</div>
                    <div className="text-xs text-gray-500">
                      {test.operator && `Operador: ${test.operator}`}
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(test.status)}
                    <div className="text-xs text-gray-500 mt-1">
                      {test.createdAt ? new Date(test.createdAt).toLocaleDateString('pt-BR') : 'Hoje'}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <FlaskRound className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum ensaio realizado ainda</p>
                  <p className="text-sm">Use o menu lateral para iniciar um novo ensaio</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas por Tipo de Ensaio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded">
                    <FlaskRound className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">Densidade In Situ</div>
                    <div className="text-sm text-gray-600">NBR 6457</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{Array.isArray(densityInSituTests) ? densityInSituTests.length : 0}</div>
                  <div className="text-xs text-gray-500">ensaios</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded">
                    <FlaskRound className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Densidade Real</div>
                    <div className="text-sm text-gray-600">NBR 6508</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{Array.isArray(realDensityTests) ? realDensityTests.length : 0}</div>
                  <div className="text-xs text-gray-500">ensaios</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded">
                    <FlaskRound className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">Densidade Máx/Mín</div>
                    <div className="text-sm text-gray-600">NBR 12004</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{Array.isArray(maxMinDensityTests) ? maxMinDensityTests.length : 0}</div>
                  <div className="text-xs text-gray-500">ensaios</div>
                </div>
              </div>

              {pendingTests.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <Activity className="h-4 w-4" />
                    <span className="font-medium">{pendingTests.length} ensaios aguardando aprovação</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests Management Sidebar */}
      <div className="mt-8">
        <TestsSidebar 
          onSelectTest={handleSelectTest}
          onEditTest={handleEditTest}
        />
      </div>
    </div>
  );
}