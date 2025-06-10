import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Calendar, 
  Filter,
  Eye,
  Edit,
  Download,
  Trash2
} from 'lucide-react';
import { getQueryFn, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { generateDensityInSituPDF, generateRealDensityPDF, generateMaxMinDensityPDF } from '@/lib/pdf-generator';
import { calculateDensityInSitu, calculateRealDensity, calculateVoidParameters } from '@/lib/calculations';
import StatusIndicator from '@/components/laboratory/status-indicator';

interface TestsSidebarProps {
  onSelectTest?: (testId: number, testType: string) => void;
  onEditTest?: (testId: number, testType: string) => void;
}

export default function TestsSidebar({ onSelectTest, onEditTest }: TestsSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [testTypeFilter, setTestTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDownloadPDF = async (testId: number, testType: string) => {
    try {
      let testData;
      let calculations = null;

      // Buscar dados do teste específico usando a API
      if (testType === 'density-in-situ') {
        const response = await fetch(`/api/density-in-situ/${testId}`);
        if (!response.ok) throw new Error('Erro ao buscar dados do ensaio');
        testData = await response.json();
        
        // Tentar calcular resultados se houver dados suficientes
        try {
          if (testData.det1 && testData.det2) {
            const moistureTop = [testData.moistureTop1, testData.moistureTop2, testData.moistureTop3].filter(m => m && m.capsule);
            const moistureBase = [testData.moistureBase1, testData.moistureBase2, testData.moistureBase3].filter(m => m && m.capsule);
            
            if (moistureTop.length > 0 && moistureBase.length > 0) {
              calculations = calculateDensityInSitu(
                testData.det1,
                testData.det2,
                moistureTop,
                moistureBase
              );
            }
          }
        } catch (calcError) {
          console.warn('Erro nos cálculos, gerando PDF sem resultados:', calcError);
        }
        
        await generateDensityInSituPDF(testData, calculations);
        
      } else if (testType === 'real-density') {
        const response = await fetch(`/api/real-density/${testId}`);
        if (!response.ok) throw new Error('Erro ao buscar dados do ensaio');
        testData = await response.json();
        
        try {
          if (testData.moisture1 && testData.picnometer1) {
            const moisture = [testData.moisture1, testData.moisture2, testData.moisture3].filter(m => m && m.capsule);
            const picnometer = [testData.picnometer1, testData.picnometer2].filter(p => p && p.massaPicnometro);
            
            if (moisture.length > 0 && picnometer.length > 0) {
              calculations = calculateRealDensity(moisture, picnometer);
            }
          }
        } catch (calcError) {
          console.warn('Erro nos cálculos, gerando PDF sem resultados:', calcError);
        }
        
        await generateRealDensityPDF(testData, calculations);
        
      } else if (testType === 'max-min-density') {
        const response = await fetch(`/api/max-min-density/${testId}`);
        if (!response.ok) throw new Error('Erro ao buscar dados do ensaio');
        testData = await response.json();
        
        try {
          if (testData.maxDensity1 && testData.minDensity1) {
            const maxDensity = [testData.maxDensity1, testData.maxDensity2, testData.maxDensity3].filter(d => d && d.moldeSolo);
            const minDensity = [testData.minDensity1, testData.minDensity2, testData.minDensity3].filter(d => d && d.moldeSolo);
            
            if (maxDensity.length > 0 && minDensity.length > 0) {
              calculations = calculateVoidParameters(
                maxDensity,
                minDensity,
                parseFloat(testData.realDensityRef) || 2.65
              );
            }
          }
        } catch (calcError) {
          console.warn('Erro nos cálculos, gerando PDF sem resultados:', calcError);
        }
        
        await generateMaxMinDensityPDF(testData, calculations);
      }

      toast({
        title: "PDF gerado com sucesso",
        description: "O relatório foi baixado para seu dispositivo.",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao gerar o relatório.",
        variant: "destructive",
      });
    }
  };

  // Buscar todos os ensaios
  const { data: densityInSituTests = [] } = useQuery({
    queryKey: ['/api/density-in-situ'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  const { data: realDensityTests = [] } = useQuery({
    queryKey: ['/api/real-density'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  const { data: maxMinDensityTests = [] } = useQuery({
    queryKey: ['/api/max-min-density'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  // Delete mutations
  const deleteDensityInSituMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/density-in-situ/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Ensaio excluído com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['/api/density-in-situ'] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao excluir ensaio", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const deleteRealDensityMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/real-density/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Ensaio excluído com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['/api/real-density'] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao excluir ensaio", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const deleteMaxMinDensityMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/max-min-density/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Ensaio excluído com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['/api/max-min-density'] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao excluir ensaio", 
        description: error.message,
        variant: "destructive" 
      });
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

  // Combinar todos os ensaios
  const allTests = [
    ...densityInSituTests.map((test: any) => ({ ...test, type: 'density-in-situ', typeName: 'Densidade In Situ' })),
    ...realDensityTests.map((test: any) => ({ ...test, type: 'real-density', typeName: 'Densidade Real' })),
    ...maxMinDensityTests.map((test: any) => ({ ...test, type: 'max-min-density', typeName: 'Densidade Máx/Mín' }))
  ];

  // Filtrar ensaios
  const filteredTests = allTests.filter(test => {
    const matchesSearch = !searchTerm || 
      test.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.operator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.material?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = testTypeFilter === 'all' || test.type === testTypeFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      (test.status && test.status.toLowerCase() === statusFilter.toLowerCase());
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'reprovado': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

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
          Ensaios Salvos
        </CardTitle>
        
        {/* Filtros */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por registro, operador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Select value={testTypeFilter} onValueChange={setTestTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="density-in-situ">Densidade In Situ</SelectItem>
                <SelectItem value="real-density">Densidade Real</SelectItem>
                <SelectItem value="max-min-density">Densidade Máx/Mín</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="reprovado">Reprovado</SelectItem>
                <SelectItem value="aguardando">Aguardando</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="p-4 space-y-3">
            {filteredTests.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <FileText size={48} className="mx-auto mb-2 opacity-50" />
                <p>Nenhum ensaio encontrado</p>
              </div>
            ) : (
              filteredTests.map((test) => (
                <Card key={`${test.type}-${test.id}`} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="space-y-2">
                    {/* Header com tipo e status */}
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {test.typeName}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(test.status)}`}>
                        {test.status || 'AGUARDANDO'}
                      </Badge>
                    </div>
                    
                    {/* Informações principais */}
                    <div className="space-y-1">
                      <div className="font-medium text-sm">
                        {test.registrationNumber || 'Sem registro'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(test.date)}
                        </div>
                        {test.operator && (
                          <div>Operador: {test.operator}</div>
                        )}
                        {test.material && (
                          <div>Material: {test.material}</div>
                        )}
                      </div>
                    </div>
                    
                    {/* Ações */}
                    <div className="flex gap-1 pt-2 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTest?.(test.id, test.type);
                        }}
                      >
                        <Eye size={12} className="mr-1" />
                        Ver
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTest?.(test.id, test.type);
                        }}
                      >
                        <Edit size={12} className="mr-1" />
                        Editar
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadPDF(test.id, test.type);
                        }}
                      >
                        <Download size={12} />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 size={12} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir este ensaio? Esta ação não pode ser desfeita.
                              <br />
                              <strong>Registro:</strong> {test.registrationNumber || 'Sem registro'}
                              <br />
                              <strong>Tipo:</strong> {test.typeName}
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
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}