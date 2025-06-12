import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Calculator, 
  Target,
  Beaker,
  ClipboardList
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { useToast } from '@/hooks/use-toast';

interface DensityInSituTest {
  id: number;
  sampleId: string;
  location: string;
  depth: number;
  equipmentUsed: string;
  testDate: string;
  technician: string;
  supervisor: string;
  moistureContent: number;
  wetDensity: number;
  dryDensity: number;
  voidRatio: number;
  porosity: number;
  degreeOfSaturation: number;
  compactionDegree: number;
  observations: string;
  status: string;
  createdAt: string;
}

interface RealDensityTest {
  id: number;
  sampleId: string;
  location: string;
  testDate: string;
  technician: string;
  supervisor: string;
  methodUsed: string;
  sampleMass: number;
  volumetricFlaskVolume: number;
  waterTemperature: number;
  realDensity: number;
  observations: string;
  status: string;
  createdAt: string;
}

interface MaxMinDensityTest {
  id: number;
  sampleId: string;
  location: string;
  testDate: string;
  technician: string;
  supervisor: string;
  maxDensity: number;
  minDensity: number;
  maxDensityMoisture: number;
  minDensityMoisture: number;
  relativeCompaction: number;
  observations: string;
  status: string;
  createdAt: string;
}

export default function DensityTestsPage() {
  const permissions = usePermissions();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('in-situ');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);

  // States for different test types
  const [inSituTests, setInSituTests] = useState<DensityInSituTest[]>([]);
  const [realDensityTests, setRealDensityTests] = useState<RealDensityTest[]>([]);
  const [maxMinTests, setMaxMinTests] = useState<MaxMinDensityTest[]>([]);
  
  // Form states
  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTests();
  }, [activeTab]);

  const loadTests = async () => {
    setIsLoading(true);
    try {
      let endpoint = '';
      switch (activeTab) {
        case 'in-situ':
          endpoint = '/api/tests/density-in-situ';
          break;
        case 'real-density':
          endpoint = '/api/tests/real-density';
          break;
        case 'max-min':
          endpoint = '/api/tests/max-min-density';
          break;
      }
      
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        
        switch (activeTab) {
          case 'in-situ':
            setInSituTests(Array.isArray(data) ? data : []);
            break;
          case 'real-density':
            setRealDensityTests(Array.isArray(data) ? data : []);
            break;
          case 'max-min':
            setMaxMinTests(Array.isArray(data) ? data : []);
            break;
        }
      }
    } catch (error) {
      console.error('Error loading tests:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os ensaios",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTest = () => {
    setEditingTest(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEditTest = (test: any) => {
    setEditingTest(test);
    setFormData(test);
    setIsDialogOpen(true);
  };

  const handleDeleteTest = async (testId: number) => {
    if (!confirm('Tem certeza que deseja excluir este ensaio?')) return;
    
    try {
      let endpoint = '';
      switch (activeTab) {
        case 'in-situ':
          endpoint = `/api/tests/density-in-situ/${testId}`;
          break;
        case 'real-density':
          endpoint = `/api/tests/real-density/${testId}`;
          break;
        case 'max-min':
          endpoint = `/api/tests/max-min-density/${testId}`;
          break;
      }
      
      const response = await fetch(endpoint, { method: 'DELETE' });
      
      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Ensaio excluído com sucesso",
        });
        loadTests();
      } else {
        throw new Error('Failed to delete test');
      }
    } catch (error) {
      console.error('Error deleting test:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o ensaio",
        variant: "destructive",
      });
    }
  };

  const handleSaveTest = async () => {
    try {
      setIsLoading(true);
      
      let endpoint = '';
      switch (activeTab) {
        case 'in-situ':
          endpoint = '/api/tests/density-in-situ';
          break;
        case 'real-density':
          endpoint = '/api/tests/real-density';
          break;
        case 'max-min':
          endpoint = '/api/tests/max-min-density';
          break;
      }
      
      const method = editingTest ? 'PUT' : 'POST';
      const url = editingTest ? `${endpoint}/${editingTest.id}` : endpoint;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast({
          title: "Sucesso",
          description: editingTest ? "Ensaio atualizado com sucesso" : "Ensaio criado com sucesso",
        });
        setIsDialogOpen(false);
        loadTests();
      } else {
        throw new Error('Failed to save test');
      }
    } catch (error) {
      console.error('Error saving test:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o ensaio",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'pending': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'in_progress': return 'Em Andamento';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const renderInSituTestForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sampleId">ID da Amostra</Label>
          <Input
            id="sampleId"
            value={formData.sampleId || ''}
            onChange={(e) => setFormData({...formData, sampleId: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="location">Local</Label>
          <Input
            id="location"
            value={formData.location || ''}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="depth">Profundidade (m)</Label>
          <Input
            id="depth"
            type="number"
            step="0.01"
            value={formData.depth || ''}
            onChange={(e) => setFormData({...formData, depth: parseFloat(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="equipmentUsed">Equipamento</Label>
          <Select value={formData.equipmentUsed || ''} onValueChange={(value) => setFormData({...formData, equipmentUsed: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o equipamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cilindro_cravacao">Cilindro de Cravação</SelectItem>
              <SelectItem value="metodo_areia">Método da Areia</SelectItem>
              <SelectItem value="densimetro_nuclear">Densímetro Nuclear</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="testDate">Data do Ensaio</Label>
          <Input
            id="testDate"
            type="date"
            value={formData.testDate || ''}
            onChange={(e) => setFormData({...formData, testDate: e.target.value})}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="technician">Técnico</Label>
          <Input
            id="technician"
            value={formData.technician || ''}
            onChange={(e) => setFormData({...formData, technician: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="supervisor">Supervisor</Label>
          <Input
            id="supervisor"
            value={formData.supervisor || ''}
            onChange={(e) => setFormData({...formData, supervisor: e.target.value})}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="moistureContent">Umidade (%)</Label>
          <Input
            id="moistureContent"
            type="number"
            step="0.01"
            value={formData.moistureContent || ''}
            onChange={(e) => setFormData({...formData, moistureContent: parseFloat(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="wetDensity">Densidade Úmida (g/cm³)</Label>
          <Input
            id="wetDensity"
            type="number"
            step="0.001"
            value={formData.wetDensity || ''}
            onChange={(e) => setFormData({...formData, wetDensity: parseFloat(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="dryDensity">Densidade Seca (g/cm³)</Label>
          <Input
            id="dryDensity"
            type="number"
            step="0.001"
            value={formData.dryDensity || ''}
            onChange={(e) => setFormData({...formData, dryDensity: parseFloat(e.target.value)})}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="observations">Observações</Label>
        <Input
          id="observations"
          value={formData.observations || ''}
          onChange={(e) => setFormData({...formData, observations: e.target.value})}
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status || 'pending'} onValueChange={(value) => setFormData({...formData, status: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="in_progress">Em Andamento</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ensaios de Densidade</h1>
        <Button onClick={handleCreateTest} disabled={!permissions.canCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Ensaio
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="in-situ" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Densidade In Situ
          </TabsTrigger>
          <TabsTrigger value="real-density" className="flex items-center gap-2">
            <Beaker className="h-4 w-4" />
            Densidade Real
          </TabsTrigger>
          <TabsTrigger value="max-min" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Densidade Máx/Mín
          </TabsTrigger>
        </TabsList>

        {/* Density In Situ Tab */}
        <TabsContent value="in-situ" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Ensaios de Densidade In Situ
              </CardTitle>
              <CardDescription>
                Determinação da densidade do solo no campo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p>Carregando ensaios...</p>
                </div>
              ) : inSituTests.length === 0 ? (
                <div className="text-center py-8">
                  <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum ensaio encontrado</h3>
                  <p className="text-gray-500 mb-4">
                    Comece criando seu primeiro ensaio de densidade in situ.
                  </p>
                  <Button onClick={handleCreateTest} disabled={!permissions.canCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Ensaio
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Amostra</TableHead>
                      <TableHead>Local</TableHead>
                      <TableHead>Profundidade</TableHead>
                      <TableHead>Densidade Seca</TableHead>
                      <TableHead>Umidade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inSituTests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell className="font-medium">{test.sampleId}</TableCell>
                        <TableCell>{test.location}</TableCell>
                        <TableCell>{test.depth}m</TableCell>
                        <TableCell>{test.dryDensity} g/cm³</TableCell>
                        <TableCell>{test.moistureContent}%</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(test.status)}>
                            {getStatusLabel(test.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTest(test)}
                              disabled={!permissions.canEdit}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTest(test.id)}
                              disabled={!permissions.canDelete}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Real Density Tab */}
        <TabsContent value="real-density" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                Ensaios de Densidade Real
              </CardTitle>
              <CardDescription>
                Determinação da densidade real dos grãos do solo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Funcionalidade em desenvolvimento</h3>
                <p className="text-gray-500">
                  Os ensaios de densidade real estarão disponíveis em breve.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Max/Min Density Tab */}
        <TabsContent value="max-min" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Ensaios de Densidade Máxima/Mínima
              </CardTitle>
              <CardDescription>
                Determinação das densidades máxima e mínima do solo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Funcionalidade em desenvolvimento</h3>
                <p className="text-gray-500">
                  Os ensaios de densidade máxima/mínima estarão disponíveis em breve.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTest ? 'Editar' : 'Criar'} Ensaio de Densidade In Situ
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do ensaio de densidade in situ
            </DialogDescription>
          </DialogHeader>
          
          {activeTab === 'in-situ' && renderInSituTestForm()}
          
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTest} disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}