import { useState, useEffect } from "react";
import { FlaskRound, Save, PanelLeftOpen, PanelLeftClose, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import DensityInSitu from "@/components/laboratory/density-in-situ";
import DensityReal from "@/components/laboratory/density-real";
import DensityMaxMin from "@/components/laboratory/density-max-min";
import TestsSidebar from "@/components/dashboard/tests-sidebar";

export default function Laboratory() {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  
  // Parse URL parameters
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const testType = urlParams.get('test');
  const testId = urlParams.get('id');
  const mode = urlParams.get('mode'); // 'view' or 'edit'
  
  // Set initial tab based on URL hash or parameters
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.substring(1);
    if (hash) return hash;
    if (testType === 'density-in-situ') return 'density-in-situ';
    if (testType === 'real-density') return 'density-real';
    if (testType === 'max-min-density') return 'density-max-min';
    return 'density-in-situ';
  });

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash && ['density-in-situ', 'density-real', 'density-max-min'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dateTimeString = now.toLocaleString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      setCurrentDateTime(dateTimeString);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectTest = (testId: number, testType: string) => {
    console.log('Visualizar ensaio:', testId, testType);
    // Implementar navegação para visualizar ensaio
  };

  const handleEditTest = (testId: number, testType: string) => {
    console.log('Editar ensaio:', testId, testType);
    // Implementar navegação para editar ensaio
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-0'} overflow-hidden border-r bg-white`}>
        {sidebarOpen && (
          <TestsSidebar 
            onSelectTest={handleSelectTest}
            onEditTest={handleEditTest}
          />
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-xl font-bold text-gray-900">
                    <FlaskRound className="inline mr-2 text-blue-600" size={20} />
                    Laboratório Ev.C.S
                  </h1>
                </div>
                <div className="hidden md:block ml-6">
                  <div className="text-sm text-gray-500">
                    Sistema de Ensaios Geotécnicos - ABNT NBR 6457 e NBR 9813
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{currentDateTime}</span>
                <Link href="/analytics">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <BarChart3 size={16} />
                    Analytics
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="flex items-center gap-2"
                >
                  {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
                  {sidebarOpen ? 'Fechar' : 'Ensaios Salvos'}
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="mr-2" size={16} />
                  Salvar Dados
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white border sticky top-0 z-10">
              <TabsTrigger 
                value="density-in-situ" 
                className="py-4 px-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                <span className="mr-2">⚖️</span>Densidade In Situ
              </TabsTrigger>
              <TabsTrigger 
                value="density-real"
                className="py-4 px-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                <span className="mr-2">⚛️</span>Densidade Real dos Grãos
              </TabsTrigger>
              <TabsTrigger 
                value="density-max-min"
                className="py-4 px-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                <span className="mr-2">↕️</span>Densidade Máx/Mín
              </TabsTrigger>
            </TabsList>

            <TabsContent value="density-in-situ">
              <DensityInSitu />
            </TabsContent>

            <TabsContent value="density-real">
              <DensityReal />
            </TabsContent>

            <TabsContent value="density-max-min">
              <DensityMaxMin />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
