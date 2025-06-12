import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, Scale, FlaskRound, Thermometer, Search, Download, Upload, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { localDataManager } from '@/lib/local-storage';

interface Equipamento {
  id: string;
  codigo: string;
  tipo: 'capsula' | 'cilindro';
  peso?: number;
  volume?: number;
  status: 'ativo' | 'inativo';
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors = {
  ativo: 'bg-green-100 text-green-800 border-green-200',
  inativo: 'bg-gray-100 text-gray-800 border-gray-200',
  manutencao: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  calibracao: 'bg-blue-100 text-blue-800 border-blue-200'
};

const statusLabels = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  manutencao: 'Manutenção',
  calibracao: 'Calibração'
};

const tipoIcons = {
  capsula: FlaskRound,
  cilindro: FlaskRound,
  balanca: Scale,
  estufa: Thermometer
};

const tipoLabels = {
  capsula: 'Cápsula',
  cilindro: 'Cilindro',
  balanca: 'Balança',
  estufa: 'Estufa'
};

export default function Equipamentos() {
  const { toast } = useToast();
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [equipamentoEdit, setEquipamentoEdit] = useState<Equipamento | null>(null);
  const [formData, setFormData] = useState<Partial<Equipamento>>({
    codigo: '',
    tipo: 'capsula',
    status: 'ativo'
  });

  useEffect(() => {
    carregarEquipamentos();
  }, []);

  const carregarEquipamentos = async () => {
    try {
      // Carregar cápsulas do localStorage
      const capsulas: Equipamento[] = [];
      const cilindros: Equipamento[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('capsula_')) {
          const item = localStorage.getItem(key);
          if (item) {
            capsulas.push({ ...JSON.parse(item), tipo: 'capsula' as const });
          }
        } else if (key?.startsWith('cilindro_')) {
          const item = localStorage.getItem(key);
          if (item) {
            cilindros.push({ ...JSON.parse(item), tipo: 'cilindro' as const });
          }
        }
      }

      setEquipamentos([...capsulas, ...cilindros]);
    } catch (error) {
      console.error('Erro ao carregar equipamentos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar equipamentos",
        variant: "destructive"
      });
    }
  };

  const equipamentosFiltrados = equipamentos.filter(eq => {
    const matchTipo = filtroTipo === 'todos' || eq.tipo === filtroTipo;
    const matchStatus = filtroStatus === 'todos' || eq.status === filtroStatus;
    const matchBusca = !busca || 
      eq.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      eq.fabricante?.toLowerCase().includes(busca.toLowerCase()) ||
      eq.modelo?.toLowerCase().includes(busca.toLowerCase());
    
    return matchTipo && matchStatus && matchBusca;
  });

  const handleSalvar = async () => {
    if (!formData.codigo || !formData.tipo) {
      toast({
        title: "Erro",
        description: "Código e tipo são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const agora = new Date().toISOString();
      const equipamento: Equipamento = {
        ...formData,
        id: equipamentoEdit?.id || crypto.randomUUID(),
        codigo: formData.codigo!,
        tipo: formData.tipo!,
        status: formData.status!,
        createdAt: equipamentoEdit?.createdAt || agora,
        updatedAt: agora
      } as Equipamento;

      // Salvar no localStorage específico por tipo
      switch (equipamento.tipo) {
        case 'capsula':
          localStorage.setItem(`capsula_${equipamento.codigo}`, JSON.stringify(equipamento));
          break;
        case 'cilindro':
          localStorage.setItem(`cilindro_${equipamento.codigo}`, JSON.stringify(equipamento));
          break;
      }

      await carregarEquipamentos();
      setIsDialogOpen(false);
      setEquipamentoEdit(null);
      setFormData({ codigo: '', tipo: 'capsula', status: 'ativo' });

      toast({
        title: "Sucesso",
        description: equipamentoEdit ? "Equipamento atualizado" : "Equipamento cadastrado"
      });
    } catch (error) {
      console.error('Erro ao salvar equipamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar equipamento",
        variant: "destructive"
      });
    }
  };

  const handleEditar = (equipamento: Equipamento) => {
    setEquipamentoEdit(equipamento);
    setFormData(equipamento);
    setIsDialogOpen(true);
  };

  const handleExcluir = async (equipamento: Equipamento) => {
    if (!confirm('Tem certeza que deseja excluir este equipamento?')) return;

    try {
      // Remover do localStorage específico por tipo
      switch (equipamento.tipo) {
        case 'capsula':
          localStorage.removeItem(`capsula_${equipamento.codigo}`);
          break;
        case 'cilindro':
          localStorage.removeItem(`cilindro_${equipamento.codigo}`);
          break;
      }

      await carregarEquipamentos();
      toast({
        title: "Sucesso",
        description: "Equipamento removido"
      });
    } catch (error) {
      console.error('Erro ao excluir equipamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir equipamento",
        variant: "destructive"
      });
    }
  };

  const proximasCalibracoes = equipamentos.filter(eq => {
    if (!eq.proximaCalibração) return false;
    const proxima = new Date(eq.proximaCalibração);
    const hoje = new Date();
    const umMes = new Date();
    umMes.setMonth(hoje.getMonth() + 1);
    return proxima <= umMes;
  });

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Equipamentos</h1>
        <p className="text-gray-600">Controle e cadastro de equipamentos do laboratório</p>
      </div>

      {/* Alertas */}
      {proximasCalibracoes.length > 0 && (
        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>{proximasCalibracoes.length} equipamento(s)</strong> com calibração vencendo ou vencida.
            Verifique a aba "Calibrações" para mais detalhes.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="equipamentos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
          <TabsTrigger value="calibracoes">Calibrações</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="equipamentos" className="space-y-6">
          {/* Filtros e Busca */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Filtros</span>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEquipamentoEdit(null);
                      setFormData({ codigo: '', tipo: 'capsula', status: 'ativo' });
                    }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Equipamento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {equipamentoEdit ? 'Editar Equipamento' : 'Novo Equipamento'}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      {/* Campos básicos - sempre visíveis */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Código *</Label>
                          <Input
                            value={formData.codigo || ''}
                            onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                            placeholder="Ex: CAP001, CIL001"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Tipo *</Label>
                          <Select 
                            value={formData.tipo} 
                            onValueChange={(value) => setFormData({...formData, tipo: value as any})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="capsula">Cápsula</SelectItem>
                              <SelectItem value="cilindro">Cilindro</SelectItem>
                              <SelectItem value="balanca">Balança</SelectItem>
                              <SelectItem value="estufa">Estufa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Campos específicos para cápsulas */}
                      {formData.tipo === 'capsula' && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-3 text-blue-800">Dados da Cápsula</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Peso (g) *</Label>
                              <Input
                                type="number"
                                step="0.001"
                                value={formData.peso || ''}
                                onChange={(e) => setFormData({...formData, peso: parseFloat(e.target.value)})}
                                placeholder="Ex: 15.234"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <Select 
                                value={formData.status} 
                                onValueChange={(value) => setFormData({...formData, status: value as any})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ativo">Ativo</SelectItem>
                                  <SelectItem value="inativo">Inativo</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Campos específicos para cilindros */}
                      {formData.tipo === 'cilindro' && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-3 text-green-800">Dados do Cilindro</h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Peso (g) *</Label>
                              <Input
                                type="number"
                                step="0.001"
                                value={formData.peso || ''}
                                onChange={(e) => setFormData({...formData, peso: parseFloat(e.target.value)})}
                                placeholder="Ex: 125.678"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Volume (cm³) *</Label>
                              <Input
                                type="number"
                                step="0.001"
                                value={formData.volume || ''}
                                onChange={(e) => setFormData({...formData, volume: parseFloat(e.target.value)})}
                                placeholder="Ex: 50.265"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <Select 
                                value={formData.status} 
                                onValueChange={(value) => setFormData({...formData, status: value as any})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ativo">Ativo</SelectItem>
                                  <SelectItem value="inativo">Inativo</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Campos específicos para balanças */}
                      {formData.tipo === 'balanca' && (
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-3 text-purple-800">Dados da Balança</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Fabricante</Label>
                              <Input
                                value={formData.fabricante || ''}
                                onChange={(e) => setFormData({...formData, fabricante: e.target.value})}
                                placeholder="Ex: Mettler Toledo"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Modelo</Label>
                              <Input
                                value={formData.modelo || ''}
                                onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                                placeholder="Ex: AG245"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Precisão</Label>
                              <Input
                                value={formData.precisao || ''}
                                onChange={(e) => setFormData({...formData, precisao: e.target.value})}
                                placeholder="Ex: 0.1mg"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <Select 
                                value={formData.status} 
                                onValueChange={(value) => setFormData({...formData, status: value as any})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ativo">Ativo</SelectItem>
                                  <SelectItem value="inativo">Inativo</SelectItem>
                                  <SelectItem value="manutencao">Manutenção</SelectItem>
                                  <SelectItem value="calibracao">Calibração</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Última Calibração</Label>
                              <Input
                                type="date"
                                value={formData.dataCalibração || ''}
                                onChange={(e) => setFormData({...formData, dataCalibração: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Próxima Calibração</Label>
                              <Input
                                type="date"
                                value={formData.proximaCalibração || ''}
                                onChange={(e) => setFormData({...formData, proximaCalibração: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Campos específicos para estufas */}
                      {formData.tipo === 'estufa' && (
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-3 text-orange-800">Dados da Estufa</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Fabricante</Label>
                              <Input
                                value={formData.fabricante || ''}
                                onChange={(e) => setFormData({...formData, fabricante: e.target.value})}
                                placeholder="Ex: Nova Ética"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Modelo</Label>
                              <Input
                                value={formData.modelo || ''}
                                onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                                placeholder="Ex: 400/3ND"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Capacidade</Label>
                              <Input
                                value={formData.capacidade || ''}
                                onChange={(e) => setFormData({...formData, capacidade: parseFloat(e.target.value)})}
                                placeholder="Ex: 42 litros"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <Select 
                                value={formData.status} 
                                onValueChange={(value) => setFormData({...formData, status: value as any})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ativo">Ativo</SelectItem>
                                  <SelectItem value="inativo">Inativo</SelectItem>
                                  <SelectItem value="manutencao">Manutenção</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleSalvar}>
                        {equipamentoEdit ? 'Atualizar' : 'Salvar'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      className="pl-10"
                      placeholder="Código, fabricante, modelo..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="capsula">Cápsulas</SelectItem>
                      <SelectItem value="cilindro">Cilindros</SelectItem>
                      <SelectItem value="balanca">Balanças</SelectItem>
                      <SelectItem value="estufa">Estufas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                      <SelectItem value="manutencao">Manutenção</SelectItem>
                      <SelectItem value="calibracao">Calibração</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Equipamentos */}
          <Card>
            <CardHeader>
              <CardTitle>
                Equipamentos ({equipamentosFiltrados.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fabricante/Modelo</TableHead>
                    <TableHead>Especificações</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Calibração</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipamentosFiltrados.map((equipamento) => {
                    const Icon = tipoIcons[equipamento.tipo];
                    return (
                      <TableRow key={equipamento.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-gray-500" />
                            {equipamento.codigo}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {tipoLabels[equipamento.tipo]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{equipamento.fabricante || '-'}</div>
                            <div className="text-gray-500">{equipamento.modelo || '-'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {equipamento.peso && <div>Peso: {equipamento.peso}g</div>}
                            {equipamento.volume && <div>Volume: {equipamento.volume}cm³</div>}
                            {equipamento.capacidade && <div>Capacidade: {equipamento.capacidade}</div>}
                            {equipamento.precisao && <div>Precisão: {equipamento.precisao}</div>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[equipamento.status]}>
                            {statusLabels[equipamento.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {equipamento.proximaCalibração ? (
                              <div className={`${new Date(equipamento.proximaCalibração) <= new Date() ? 'text-red-600 font-medium' : ''}`}>
                                {new Date(equipamento.proximaCalibração).toLocaleDateString('pt-BR')}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditar(equipamento)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleExcluir(equipamento)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calibracoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Controle de Calibrações</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipamento</TableHead>
                    <TableHead>Última Calibração</TableHead>
                    <TableHead>Próxima Calibração</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dias Restantes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipamentos
                    .filter(eq => eq.proximaCalibração)
                    .sort((a, b) => new Date(a.proximaCalibração!).getTime() - new Date(b.proximaCalibração!).getTime())
                    .map((equipamento) => {
                      const hoje = new Date();
                      const proxima = new Date(equipamento.proximaCalibração!);
                      const diasRestantes = Math.ceil((proxima.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
                      
                      let statusCalibracao = 'em-dia';
                      let statusColor = 'bg-green-100 text-green-800';
                      
                      if (diasRestantes <= 0) {
                        statusCalibracao = 'vencida';
                        statusColor = 'bg-red-100 text-red-800';
                      } else if (diasRestantes <= 30) {
                        statusCalibracao = 'vencendo';
                        statusColor = 'bg-yellow-100 text-yellow-800';
                      }

                      return (
                        <TableRow key={equipamento.id}>
                          <TableCell className="font-medium">
                            {equipamento.codigo} - {tipoLabels[equipamento.tipo]}
                          </TableCell>
                          <TableCell>
                            {equipamento.dataCalibração ? 
                              new Date(equipamento.dataCalibração).toLocaleDateString('pt-BR') : 
                              '-'
                            }
                          </TableCell>
                          <TableCell>
                            {new Date(equipamento.proximaCalibração!).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColor}>
                              {statusCalibracao === 'vencida' ? 'Vencida' : 
                               statusCalibracao === 'vencendo' ? 'Vencendo' : 'Em dia'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={diasRestantes <= 0 ? 'text-red-600 font-medium' : 
                                           diasRestantes <= 30 ? 'text-yellow-600 font-medium' : ''}>
                              {diasRestantes <= 0 ? `${Math.abs(diasRestantes)} dias vencida` : 
                               `${diasRestantes} dias`}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{equipamentos.length}</p>
                    <p className="text-sm text-gray-600">Total de Equipamentos</p>
                  </div>
                  <FlaskRound className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {equipamentos.filter(eq => eq.status === 'ativo').length}
                    </p>
                    <p className="text-sm text-gray-600">Ativos</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {equipamentos.filter(eq => eq.status === 'manutencao').length}
                    </p>
                    <p className="text-sm text-gray-600">Em Manutenção</p>
                  </div>
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {proximasCalibracoes.length}
                    </p>
                    <p className="text-sm text-gray-600">Calibrações Pendentes</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(tipoLabels).map(([tipo, label]) => {
                  const count = equipamentos.filter(eq => eq.tipo === tipo).length;
                  const Icon = tipoIcons[tipo as keyof typeof tipoIcons];
                  
                  return (
                    <div key={tipo} className="text-center p-4 border rounded-lg">
                      <Icon className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-sm text-gray-600">{label}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}