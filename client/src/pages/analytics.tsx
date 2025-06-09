import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FlaskRound, BarChart3, Wrench, Target } from 'lucide-react';
import PerformanceDashboard from '@/components/analytics/performance-dashboard';
import EquipmentAnalytics from '@/components/analytics/equipment-analytics';
import CapacityAnalytics from '@/components/analytics/capacity-analytics';

export default function Analytics() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <BarChart3 className="inline mr-3 text-blue-600" size={32} />
          Analytics do Laboratório
        </h1>
        <p className="text-gray-600">
          Análise de performance, equipamentos e capacidade do sistema geotécnico
        </p>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white border sticky top-0 z-10 mb-6">
          <TabsTrigger 
            value="performance" 
            className="flex items-center gap-2 py-4 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
          >
            <BarChart3 size={16} />
            Performance Geral
          </TabsTrigger>
          <TabsTrigger 
            value="equipment"
            className="flex items-center gap-2 py-4 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
          >
            <Wrench size={16} />
            Equipamentos
          </TabsTrigger>
          <TabsTrigger 
            value="capacity"
            className="flex items-center gap-2 py-4 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
          >
            <Target size={16} />
            Capacidade & Qualidade
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <PerformanceDashboard />
        </TabsContent>

        <TabsContent value="equipment">
          <EquipmentAnalytics />
        </TabsContent>

        <TabsContent value="capacity">
          <CapacityAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}