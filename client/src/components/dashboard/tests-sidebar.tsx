import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Search, 
  FileText, 
  Calendar, 
  Eye,
  Edit,
  Download,
  Trash2,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown
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
  const [expandedFolders, setExpandedFolders] = useState({
    'density-in-situ': true,
    'real-density': true,
    'max-min-density': true
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar ensaios dos três tipos usando apiRequest com autenticação
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

  const handleDownloadPDF = async (testId: number, testType: string) => {
    try {
      // Implementar download de PDF aqui se necessário
      toast({ title: "Download iniciado" });
    } catch (error) {
      toast({ title: "Erro no download", variant: "destructive" });
    }
  };

  // Organizar ensaios por tipo (pastas)
  const testFolders = [
    {
      id: 'density-in-situ',
      name: 'Densidade In Situ',
      icon: Folder,
      iconOpen: FolderOpen,
      tests: (Array.isArray(densityInSituTests) ? (densityInSituTests as any[]) : []).map((test: any) => ({
        ...test,
        type: 'density-in-situ',
        typeName: 'Densidade In Situ'
      }))
    },
    {
      id: 'real-density', 
      name: 'Densidade Real',
      icon: Folder,
      iconOpen: FolderOpen,
      tests: (Array.isArray(realDensityTests) ? (realDensityTests as any[]) : []).map((test: any) => ({
        ...test,
        type: 'real-density', 
        typeName: 'Densidade Real'
      }))
    },
    {
      id: 'max-min-density',
      name: 'Densidade Máx/Mín', 
      icon: Folder,
      iconOpen: FolderOpen,
      tests: (Array.isArray(maxMinDensityTests) ? (maxMinDensityTests as any[]) : []).map((test: any) => ({
        ...test,
        type: 'max-min-density',
        typeName: 'Densidade Máx/Mín'
      }))
    }
  ];

  // Filtrar ensaios dentro de cada pasta
  const filteredFolders = testFolders.map(folder => ({
    ...folder,
    tests: folder.tests.filter(test => {
      const matchesSearch = !searchTerm || 
        test.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.testNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.operator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.work?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = testTypeFilter === 'all' || test.type === testTypeFilter;
      
      return matchesSearch && matchesType;
    })
  })).filter(folder => folder.tests.length > 0 || testTypeFilter === 'all');

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId as keyof typeof prev]
    }));
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
          <Folder size={20} />
          Pasta de Ensaios
        </CardTitle>
        
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
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="p-4 space-y-2">
            {filteredFolders.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Folder size={48} className="mx-auto mb-2 opacity-50" />
                <p>Nenhuma pasta encontrada</p>
              </div>
            ) : (
              filteredFolders.map((folder) => (
                <div key={folder.id} className="space-y-1">
                  {/* Cabeçalho da Pasta */}
                  <Collapsible 
                    open={expandedFolders[folder.id as keyof typeof expandedFolders]} 
                    onOpenChange={() => toggleFolder(folder.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center gap-2 p-2 bg-blue-50 hover:bg-blue-100 rounded cursor-pointer transition-colors">
                        <div className="flex items-center gap-1">
                          {expandedFolders[folder.id as keyof typeof expandedFolders] ? (
                            <ChevronDown size={16} className="text-gray-600" />
                          ) : (
                            <ChevronRight size={16} className="text-gray-600" />
                          )}
                          {expandedFolders[folder.id as keyof typeof expandedFolders] ? (
                            <FolderOpen size={16} className="text-blue-600" />
                          ) : (
                            <Folder size={16} className="text-blue-600" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{folder.name}</span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {folder.tests.length}
                        </Badge>
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="space-y-1 pl-6 mt-1">
                      {folder.tests.map((test: any) => (
                        <div 
                          key={`${test.type}-${test.id}`}
                          className="group p-3 bg-white border border-gray-200 rounded hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
                          onClick={() => onEditTest?.(test.id, test.type)}
                        >
                          {/* Ícone e Nome do Arquivo */}
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-7 h-7 flex items-center justify-center bg-green-100 rounded">
                              <FileText size={14} className="text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate text-sm">
                                {test.registrationNumber || test.testNumber || `Ensaio_${test.id}`}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {test.id} • {formatDate(test.date || test.createdAt)}
                              </div>
                            </div>
                          </div>
                          
                          {/* Informações resumidas */}
                          <div className="text-xs text-gray-600 mb-2 space-y-1">
                            {test.client && <div>📋 {test.client}</div>}
                            {test.work && <div>🏗️ {test.work}</div>}
                            {test.operator && <div>👤 {test.operator}</div>}
                          </div>
                          
                          {/* Botões de ação - aparecem no hover */}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-xs flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditTest?.(test.id, test.type);
                              }}
                            >
                              <Edit size={12} className="mr-1" />
                              Abrir
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-xs"
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
                                  variant="ghost"
                                  className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Trash2 size={12} />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir Ensaio</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir este ensaio?
                                    <br />
                                    <strong>{test.registrationNumber || test.testNumber || `Ensaio_${test.id}`}</strong>
                                    <br />
                                    Esta ação não pode ser desfeita.
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
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}