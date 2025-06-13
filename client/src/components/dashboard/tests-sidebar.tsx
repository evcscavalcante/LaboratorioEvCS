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
  Eye,
  Edit,
  Download,
  Trash2
} from 'lucide-react';
import { getQueryFn, apiRequest } from '@/lib/queryClient';
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

  // Buscar ensaios dos três tipos
  const { data: densityInSituTests = [] } = useQuery({
    queryKey: ['/api/tests/density-in-situ'],
    queryFn: async () => {
      const response = await fetch('/api/tests/density-in-situ');
      return response.json();
    }
  });

  const { data: realDensityTests = [] } = useQuery({
    queryKey: ['/api/tests/real-density'],
    queryFn: async () => {
      const response = await fetch('/api/tests/real-density');
      return response.json();
    }
  });

  const { data: maxMinDensityTests = [] } = useQuery({
    queryKey: ['/api/tests/max-min-density'],
    queryFn: async () => {
      const response = await fetch('/api/tests/max-min-density');
      return response.json();
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

  const handleDownloadPDF = async (testId: number, testType: string) => {
    try {
      // Implementar download de PDF aqui se necessário
      toast({ title: "Download iniciado" });
    } catch (error) {
      toast({ title: "Erro no download", variant: "destructive" });
    }
  };

  // Combinar todos os ensaios
  const allTests = [
    ...(Array.isArray(densityInSituTests) ? (densityInSituTests as any[]) : []).map((test: any) => ({ 
      ...test, 
      type: 'density-in-situ', 
      typeName: 'Densidade In Situ' 
    })),
    ...(Array.isArray(realDensityTests) ? (realDensityTests as any[]) : []).map((test: any) => ({ 
      ...test, 
      type: 'real-density', 
      typeName: 'Densidade Real' 
    })),
    ...(Array.isArray(maxMinDensityTests) ? (maxMinDensityTests as any[]) : []).map((test: any) => ({ 
      ...test, 
      type: 'max-min-density', 
      typeName: 'Densidade Máx/Mín' 
    }))
  ];

  // Filtrar ensaios
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
          Ensaios Salvos ({filteredTests.length})
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
                <div key={`${test.type}-${test.id}`} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  {/* Cabeçalho com tipo e ID */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-medium">
                        {test.typeName}
                      </Badge>
                      <span className="text-sm font-bold text-gray-900">
                        ID: {test.id || 'N/A'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(test.date || test.createdAt)}
                    </div>
                  </div>
                  
                  {/* Informações de identificação */}
                  <div className="space-y-2 mb-3">
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Registro:</span> 
                      <span className="ml-2">{test.registrationNumber || test.testNumber || 'Sem registro'}</span>
                    </div>
                    {test.operator && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Operador:</span>
                        <span className="ml-2">{test.operator}</span>
                      </div>
                    )}
                    {test.client && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Cliente:</span>
                        <span className="ml-2">{test.client}</span>
                      </div>
                    )}
                    {test.work && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Obra:</span>
                        <span className="ml-2">{test.work}</span>
                      </div>
                    )}
                    {test.location && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Local:</span>
                        <span className="ml-2">{test.location}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Botões de ação */}
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => onSelectTest?.(test.id, test.type)}
                    >
                      <Eye size={12} className="mr-1" />
                      Ver
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => onEditTest?.(test.id, test.type)}
                    >
                      <Edit size={12} className="mr-1" />
                      Editar
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadPDF(test.id, test.type)}
                    >
                      <Download size={12} />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                            <strong>Registro:</strong> {test.registrationNumber || test.testNumber || 'Sem registro'}
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
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}