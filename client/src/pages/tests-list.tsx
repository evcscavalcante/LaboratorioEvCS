import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Search, 
  FileText, 
  Calendar, 
  Eye,
  Edit,
  Download,
  Trash2,
  Plus
} from 'lucide-react';
import { getQueryFn, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation } from 'wouter';

export default function TestsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [testTypeFilter, setTestTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [, setLocation] = useLocation();
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar ensaios de densidade in situ
  const { data: densityInSituTests = [] } = useQuery({
    queryKey: ['/api/tests/density-in-situ/temp'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  // Buscar ensaios de densidade real
  const { data: realDensityTests = [] } = useQuery({
    queryKey: ['/api/real-density'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  // Buscar ensaios de densidade máx/mín
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
      return apiRequest("DELETE", `/api/tests/density-in-situ/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Ensaio excluído com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['/api/tests/density-in-situ/temp'] });
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
      default:
        toast({
          title: "Tipo de ensaio não suportado",
          variant: "destructive"
        });
    }
  };

  const handleViewTest = (testId: number, testType: string) => {
    setLocation(`/laboratory?test=${testType}&id=${testId}&mode=view`);
  };

  const handleEditTest = (testId: number, testType: string) => {
    setLocation(`/laboratory?test=${testType}&id=${testId}&mode=edit`);
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
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ensaios Salvos</h1>
            <p className="text-gray-600 mt-2">
              Gerencie todos os ensaios salvos no sistema
            </p>
          </div>
          <Link href="/laboratory">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Novo Ensaio
            </Button>
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </CardContent>
      </Card>

      {/* Lista de Ensaios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTests.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-12">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">Nenhum ensaio encontrado</p>
            <p className="text-sm">Ajuste os filtros ou crie um novo ensaio</p>
          </div>
        ) : (
          filteredTests.map((test) => (
            <Card key={`${test.type}-${test.id}`} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {test.typeName}
                  </Badge>
                  <Badge className={`text-xs ${getStatusColor(test.status)}`}>
                    {test.status || 'AGUARDANDO'}
                  </Badge>
                </div>
                <CardTitle className="text-lg">
                  {test.registrationNumber || 'Sem registro'}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar size={12} />
                    {formatDate(test.date)}
                  </div>
                  {test.operator && (
                    <div className="text-sm">
                      <strong>Operador:</strong> {test.operator}
                    </div>
                  )}
                  {test.material && (
                    <div className="text-sm">
                      <strong>Material:</strong> {test.material}
                    </div>
                  )}
                </div>
                
                {/* Ações */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleViewTest(test.id, test.type)}
                  >
                    <Eye size={12} className="mr-1" />
                    Ver
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEditTest(test.id, test.type)}
                  >
                    <Edit size={12} className="mr-1" />
                    Editar
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
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o ensaio "{test.registrationNumber}"?
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
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Estatísticas */}
      {filteredTests.length > 0 && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="text-center text-sm text-muted-foreground">
              Exibindo {filteredTests.length} de {allTests.length} ensaios
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}