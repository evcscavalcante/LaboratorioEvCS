import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Plus } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

export default function SimpleTestsSidebar() {
  const [, setLocation] = useLocation();

  // Buscar ensaios
  const { data: densityInSituTests = [] } = useQuery({
    queryKey: ['/api/tests/density-in-situ'],
    queryFn: () => apiRequest('GET', '/api/tests/density-in-situ').catch(() => [])
  });

  const { data: realDensityTests = [] } = useQuery({
    queryKey: ['/api/tests/real-density'],
    queryFn: () => apiRequest('GET', '/api/tests/real-density').catch(() => [])
  });

  const { data: maxMinDensityTests = [] } = useQuery({
    queryKey: ['/api/tests/max-min-density'],
    queryFn: () => apiRequest('GET', '/api/tests/max-min-density').catch(() => [])
  });

  const allTests = [
    ...(Array.isArray(densityInSituTests) ? densityInSituTests : []).map((test: any) => ({ ...test, type: 'density-in-situ', icon: '⚖️', typeName: 'Densidade In Situ' })),
    ...(Array.isArray(realDensityTests) ? realDensityTests : []).map((test: any) => ({ ...test, type: 'real-density', icon: '⚛️', typeName: 'Densidade Real' })),
    ...(Array.isArray(maxMinDensityTests) ? maxMinDensityTests : []).map((test: any) => ({ ...test, type: 'max-min-density', icon: '↕️', typeName: 'Densidade Máx/Mín' }))
  ];

  const handleNewTest = (type: string) => {
    const routes = {
      'density-in-situ': '/solos/densidade-in-situ',
      'real-density': '/solos/densidade-real',
      'max-min-density': '/solos/densidade-max-min'
    };
    setLocation(routes[type as keyof typeof routes]);
  };

  const handleOpenTest = (testId: number, testType: string) => {
    const routes = {
      'density-in-situ': '/solos/densidade-in-situ',
      'real-density': '/solos/densidade-real',
      'max-min-density': '/solos/densidade-max-min'
    };
    const route = routes[testType as keyof typeof routes];
    if (route) {
      setLocation(`${route}?load=${testId}`);
    }
  };

  return (
    <div className="w-80 bg-white border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText size={20} />
          Ensaios Salvos ({allTests.length})
        </h2>
        
        {/* Três botões para novos ensaios */}
        <div className="space-y-2 mb-4">
          <Button
            onClick={() => handleNewTest('density-in-situ')}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-start gap-3"
          >
            <Plus size={16} />
            <span className="text-lg">⚖️</span>
            <span className="text-sm">Densidade In Situ</span>
          </Button>
          
          <Button
            onClick={() => handleNewTest('real-density')}
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white flex items-center justify-start gap-3"
          >
            <Plus size={16} />
            <span className="text-lg">⚛️</span>
            <span className="text-sm">Densidade Real</span>
          </Button>
          
          <Button
            onClick={() => handleNewTest('max-min-density')}
            className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-start gap-3"
          >
            <Plus size={16} />
            <span className="text-lg">↕️</span>
            <span className="text-sm">Densidade Máx/Mín</span>
          </Button>
        </div>
      </div>
      
      {/* Lista de ensaios */}
      <div className="flex-1 p-4">
        <ScrollArea className="h-full">
          {allTests.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <FileText size={48} className="mx-auto mb-2 opacity-50" />
              <p>Nenhum ensaio salvo</p>
            </div>
          ) : (
            <div className="space-y-2">
              {allTests.map((test: any) => (
                <div
                  key={`${test.type}-${test.id}`}
                  onClick={() => handleOpenTest(test.id, test.type)}
                  className="p-3 border rounded cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{test.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {test.registrationNumber || test.testNumber || `Ensaio_${test.id}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {test.typeName} • ID: {test.id}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}