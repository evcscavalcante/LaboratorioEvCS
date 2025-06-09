import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FlaskRound, BarChart3, Wrench, Target } from 'lucide-react';
import PerformanceDashboard from '@/components/analytics/performance-dashboard';
import EquipmentAnalytics from '@/components/analytics/equipment-analytics';
import CapacityAnalytics from '@/components/analytics/capacity-analytics';

export default function Analytics() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 mr-4">
                  <ArrowLeft size={16} />
                  Voltar ao Laboratório
                </Button>
              </Link>
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">
                  <FlaskRound className="inline mr-2 text-blue-600" size={20} />
                  Laboratório Ev.C.S - Analytics
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    </div>
  );
}