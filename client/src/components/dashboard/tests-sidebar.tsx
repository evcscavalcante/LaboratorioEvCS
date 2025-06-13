import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Search, 
  FileText, 
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface TestsSidebarProps {
  onSelectTest?: (testId: number, testType: string) => void;
  onEditTest?: (testId: number, testType: string) => void;
}

export default function TestsSidebar({ onSelectTest, onEditTest }: TestsSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [testTypeFilter, setTestTypeFilter] = useState('all');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Buscar ensaios dos três tipos
  const { data: densityInSituTests = [] } = useQuery({
    queryKey: ['/api/tests/density-in-situ'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/tests/density-in-situ');
        return response;
      } catch (error) {
        console.error('Erro ao buscar ensaios density-in-situ:', error);
        return [];
      }
    }
  });

  const { data: realDensityTests = [] } = useQuery({
    queryKey: ['/api/tests/real-density'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/tests/real-density');
        return response;
      } catch (error) {
        console.error('Erro ao buscar ensaios real-density:', error);
        return [];
      }
    }
  });

  const { data: maxMinDensityTests = [] } = useQuery({
    queryKey: ['/api/tests/max-min-density'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/tests/max-min-density');
        return response;
      } catch (error) {
        console.error('Erro ao buscar ensaios max-min-density:', error);
        return [];
      }
    }
  });

  // Mutations para deletar ensaios
  const deleteDensityInSituMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/tests/density-in-situ/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tests/density-in-situ'] });
      toast({ title: "Ensaio excluído com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir ensaio", variant: "destructive" });
    }
  });

  const deleteRealDensityMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/tests/real-density/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tests/real-density'] });
      toast({ title: "Ensaio excluído com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir ensaio", variant: "destructive" });
    }
  });

  const deleteMaxMinDensityMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/tests/max-min-density/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tests/max-min-density'] });
      toast({ title: "Ensaio excluído com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir ensaio", variant: "destructive" });
    }
  });

  const handleDeleteTest = (testId: number, testType: string) => {
    switch (testType) {
      case 'density-in-situ':
        deleteDensityInSituMutation.mutate(testId);
        break;
      case 'real-density':
        deleteRealDensityMutation.mutate(testId);
        break;
      case 'max-min-density':
        deleteMaxMinDensityMutation.mutate(testId);
        break;
    }
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

  const handleNewTest = (testType: string) => {
    const routes = {
      'density-in-situ': '/solos/densidade-in-situ',
      'real-density': '/solos/densidade-real', 
      'max-min-density': '/solos/densidade-max-min'
    };
    
    const route = routes[testType as keyof typeof routes];
    if (route) {
      setLocation(route);
    }
  };

  // Combinar todos os ensaios em uma lista única
  const allTests = [
    ...(Array.isArray(densityInSituTests) ? (densityInSituTests as any[]) : []).map((test: any) => ({
      ...test,
      type: 'density-in-situ',
      typeName: 'Densidade In Situ',
      icon: '⚖️'
    })),
    ...(Array.isArray(realDensityTests) ? (realDensityTests as any[]) : []).map((test: any) => ({
      ...test,
      type: 'real-density', 
      typeName: 'Densidade Real',
      icon: '⚛️'
    })),
    ...(Array.isArray(maxMinDensityTests) ? (maxMinDensityTests as any[]) : []).map((test: any) => ({
      ...test,
      type: 'max-min-density',
      typeName: 'Densidade Máx/Mín',
      icon: '↕️'
    }))
  ];

  // Filtrar todos os ensaios
  const filteredTests = allTests.filter(test => {
    const matchesSearch = !searchTerm || 
      test.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.operator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.work?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = testTypeFilter === 'all' || test.type === testTypeFilter;
    
    return matchesSearch && matchesType;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <FileText size={20} />
          Ensaios Salvos ({allTests.length})
        </CardTitle>
        
        {/* Botões para Novos Ensaios */}
        <div className="grid grid-cols-1 gap-2 mb-4">
          <Button
            onClick={() => handleNewTest('density-in-situ')}
            className="flex items-center justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white h-12"
          >
            <Plus size={16} />
            <span className="text-lg">⚖️</span>
            Densidade In Situ - Cilindro de Cravação
          </Button>
          <Button
            onClick={() => handleNewTest('real-density')}
            className="flex items-center justify-start gap-2 bg-green-600 hover:bg-green-700 text-white h-12"
          >
            <Plus size={16} />
            <span className="text-lg">⚛️</span>
            Densidade Real dos Grãos
          </Button>
          <Button
            onClick={() => handleNewTest('max-min-density')}
            className="flex items-center justify-start gap-2 bg-purple-600 hover:bg-purple-700 text-white h-12"
          >
            <Plus size={16} />
            <span className="text-lg">↕️</span>
            Densidade Máx/Mín
          </Button>
        </div>
        
        {/* Filtros */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ensaios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select value={testTypeFilter} onValueChange={setTestTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="density-in-situ">Densidade In Situ</SelectItem>
              <SelectItem value="real-density">Densidade Real</SelectItem>
              <SelectItem value="max-min-density">Densidade Máx/Mín</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="p-4 space-y-2">
            {filteredTests.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <FileText size={48} className="mx-auto mb-2 opacity-50" />
                <p>Nenhum ensaio encontrado</p>
              </div>
            ) : (
              filteredTests.map((test: any) => (
                <div 
                  key={`${test.type}-${test.id}`}
                  className="group p-3 bg-white border border-gray-200 rounded hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
                  onClick={() => handleOpenTest(test.id, test.type)}
                >
                  {/* Ícone e Nome do Arquivo */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-50 rounded">
                      <span className="text-lg">{test.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {test.registrationNumber || test.testNumber || `Ensaio_${test.id}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {test.typeName} • ID: {test.id}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {formatDate(test.date || test.createdAt)}
                    </Badge>
                  </div>
                  
                  {/* Informações resumidas */}
                  <div className="text-xs text-gray-600 mb-2 space-y-1">
                    {test.client && <div>📋 {test.client}</div>}
                    {test.work && <div>🏗️ {test.work}</div>}
                    {test.operator && <div>👤 {test.operator}</div>}
                  </div>
                  
                  {/* Botões de ação */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenTest(test.id, test.type);
                      }}
                    >
                      <Edit size={12} className="mr-1" />
                      Abrir
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este ensaio? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteTest(test.id, test.type)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}