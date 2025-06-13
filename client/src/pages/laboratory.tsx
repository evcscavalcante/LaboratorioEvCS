import { useState, useEffect } from "react";
import { FlaskRound, Save, PanelLeftOpen, PanelLeftClose, BarChart3, FileText } from "lucide-react";
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
  
  // Parse URL parameters from hash
  const [testId, setTestId] = useState<number | undefined>();
  const [mode, setMode] = useState<'view' | 'edit' | 'new'>('new');
  
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('?')) {
      const params = new URLSearchParams(hash.split('?')[1]);
      const id = params.get('id');
      const urlMode = params.get('mode');
      
      if (id) setTestId(parseInt(id));
      if (urlMode === 'view' || urlMode === 'edit') setMode(urlMode);
    } else {
      setTestId(undefined);
      setMode('new');
    }
  }, [location]);
  
  // Set initial tab based on URL hash or parameters
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.substring(1).split('?')[0];
    if (hash && ['density-in-situ', 'density-real', 'density-max-min'].includes(hash)) {
      return hash;
    }
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
    const tabMap: { [key: string]: string } = {
      'density-in-situ': 'density-in-situ',
      'real-density': 'density-real',
      'max-min-density': 'density-max-min'
    };
    
    const tab = tabMap[testType];
    if (tab) {
      setActiveTab(tab);
      setTestId(testId);
      setMode('view');
      setSidebarOpen(false);
      window.location.hash = `${tab}?id=${testId}&mode=view`;
    }
  };

  const handleEditTest = (testId: number, testType: string) => {
    const tabMap: { [key: string]: string } = {
      'density-in-situ': 'density-in-situ',
      'real-density': 'density-real',
      'max-min-density': 'density-max-min'
    };
    
    const tab = tabMap[testType];
    if (tab) {
      setActiveTab(tab);
      setTestId(testId);
      setMode('edit');
      setSidebarOpen(false);
      window.location.hash = `${tab}?id=${testId}&mode=edit`;
    }
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
                  className="flex items-center gap-2 relative"
                >
                  {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
                  {sidebarOpen ? 'Fechar Lista' : 'Ver Ensaios Salvos'}
                  <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </div>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setTestId(undefined);
                    setMode('new');
                    window.location.hash = activeTab;
                  }}
                  className="mr-2"
                >
                  <FileText className="mr-2" size={16} />
                  Novo Ensaio
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
          {/* Botão para ensaios salvos - mais visível */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ensaios de Laboratório</h2>
              <p className="text-gray-600">Gerencie e execute ensaios geotécnicos</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center gap-2"
              >
                <FileText size={16} />
                {sidebarOpen ? 'Fechar Lista' : 'Ensaios Salvos (3)'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setTestId(undefined);
                  setMode('new');
                  window.location.hash = activeTab;
                }}
              >
                <span className="mr-2">+</span>
                Novo Ensaio
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white border sticky top-0 z-10">
              <TabsTrigger 
                value="density-in-situ" 
                className="py-4 px-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                <span className="mr-2">⚖️</span>Densidade In Situ - Cilindro de Cravação
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
              <DensityInSitu 
                testId={testId}
                mode={mode}
              />
            </TabsContent>

            <TabsContent value="density-real">
              <DensityReal 
                testId={testId}
                mode={mode}
              />
            </TabsContent>

            <TabsContent value="density-max-min">
              <DensityMaxMin 
                testId={testId}
                mode={mode}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
