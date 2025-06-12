import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Edit, Trash2, Search, FlaskRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Equipamento {
  id: string;
  codigo: string;
  tipo: 'capsula' | 'cilindro';
  subtipo?: string;
  peso?: number;
  volume?: number;
  altura?: number;
  status: 'ativo' | 'inativo';
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors = {
  ativo: 'bg-green-100 text-green-800 border-green-200',
  inativo: 'bg-gray-100 text-gray-800 border-gray-200'
};

const tipoIcons = {
  capsula: '🧪',
  cilindro: '⚫'
};

export default function Equipamentos() {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [equipamentoEdit, setEquipamentoEdit] = useState<Equipamento | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [formData, setFormData] = useState<Partial<Equipamento>>({
    codigo: '',
    tipo: 'capsula',
    subtipo: '',
    peso: undefined,
    volume: undefined,
    altura: undefined,
    status: 'ativo',
    observacoes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    carregarEquipamentos();
  }, []);

  const carregarEquipamentos = async () => {
    try {
      const equipamentos: Equipamento[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Carregar equipamentos com a nova estrutura (tipo_codigo_subtipo)
        if (key?.startsWith('capsula_') || key?.startsWith('cilindro_')) {
          const item = localStorage.getItem(key);
          if (item) {
            const equipamento = JSON.parse(item);
            equipamentos.push(equipamento);
          }
        }
      }

      setEquipamentos(equipamentos);
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
    let matchTipo = false;
    
    if (filtroTipo === 'todos') {
      matchTipo = true;
    } else if (filtroTipo === 'capsula') {
      matchTipo = eq.tipo === 'capsula';
    } else if (filtroTipo === 'cilindro') {
      matchTipo = eq.tipo === 'cilindro';
    } else if (filtroTipo.startsWith('capsula_')) {
      const subtipo = filtroTipo.replace('capsula_', '');
      matchTipo = eq.tipo === 'capsula' && eq.subtipo === subtipo;
    } else if (filtroTipo.startsWith('cilindro_')) {
      const subtipo = filtroTipo.replace('cilindro_', '');
      matchTipo = eq.tipo === 'cilindro' && eq.subtipo === subtipo;
    }
    
    const matchStatus = filtroStatus === 'todos' || eq.status === filtroStatus;
    const matchBusca = eq.codigo.toLowerCase().includes(busca.toLowerCase()) ||
                     eq.observacoes?.toLowerCase().includes(busca.toLowerCase()) ||
                     eq.subtipo?.toLowerCase().includes(busca.toLowerCase());
    return matchTipo && matchStatus && matchBusca;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.codigo?.trim()) {
      toast({
        title: "Erro",
        description: "Código é obrigatório",
        variant: "destructive"
      });
      return;
    }

    try {
      const agora = new Date().toISOString();
      const equipamento: Equipamento = {
        id: equipamentoEdit?.id || crypto.randomUUID(),
        codigo: formData.codigo.trim(),
        tipo: formData.tipo || 'capsula',
        peso: formData.peso,
        volume: formData.volume,
        status: formData.status || 'ativo',
        observacoes: formData.observacoes?.trim(),
        createdAt: equipamentoEdit?.createdAt || agora,
        updatedAt: agora
      } as Equipamento;

      // Salvar no localStorage com chave única incluindo tipo e subtipo
      const chaveUnica = `${equipamento.tipo}_${equipamento.codigo}_${equipamento.subtipo || 'padrao'}`;
      localStorage.setItem(chaveUnica, JSON.stringify(equipamento));



      await carregarEquipamentos();
      setIsDialogOpen(false);
      setEquipamentoEdit(null);
      setFormData({
        codigo: '',
        tipo: 'capsula',
        subtipo: '',
        peso: undefined,
        volume: undefined,
        altura: undefined,
        status: 'ativo',
        observacoes: ''
      });

      toast({
        title: "Sucesso",
        description: equipamentoEdit ? "Equipamento atualizado com sucesso!" : "Equipamento cadastrado com sucesso!"
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
      // Remover usando a nova estrutura de chaves
      const chaveUnica = `${equipamento.tipo}_${equipamento.codigo}_${equipamento.subtipo || 'padrao'}`;
      localStorage.removeItem(chaveUnica);

      await carregarEquipamentos();
      toast({
        title: "Sucesso",
        description: "Equipamento excluído com sucesso!"
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

  const resetDialog = () => {
    setEquipamentoEdit(null);
    setFormData({
      codigo: '',
      tipo: 'capsula',
      subtipo: '',
      peso: undefined,
      volume: undefined,
      altura: undefined,
      status: 'ativo',
      observacoes: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Equipamentos</h1>
          <p className="text-gray-600">Gerencie cápsulas e cilindros do laboratório</p>
        </div>

        {/* Filtros e busca */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-60">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por código ou observações..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="capsula">Todas as Cápsulas</SelectItem>
                  <SelectItem value="capsula_pequena">Cápsula Pequena</SelectItem>
                  <SelectItem value="capsula_media">Cápsula Média</SelectItem>
                  <SelectItem value="capsula_grande">Cápsula Grande</SelectItem>
                  <SelectItem value="cilindro">Todos os Cilindros</SelectItem>
                  <SelectItem value="cilindro_biselado">Cilindro Biselado</SelectItem>
                  <SelectItem value="cilindro_proctor">Cilindro de Proctor</SelectItem>
                  <SelectItem value="cilindro_cbr">Cilindro de CBR</SelectItem>
                  <SelectItem value="cilindro_padrao">Cilindro Padrão</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>

              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetDialog();
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
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

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Código *</Label>
                        <Input
                          value={formData.codigo || ''}
                          onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                          placeholder="Ex: CAP001, CIL001"
                          required
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
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Variação/Modelo</Label>
                        <Select
                          value={formData.subtipo || ''}
                          onValueChange={(value) => setFormData({...formData, subtipo: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a variação" />
                          </SelectTrigger>
                          <SelectContent>
                            {formData.tipo === 'capsula' && (
                              <>
                                <SelectItem value="pequena">Cápsula Pequena</SelectItem>
                                <SelectItem value="media">Cápsula Média</SelectItem>
                                <SelectItem value="grande">Cápsula Grande</SelectItem>
                              </>
                            )}
                            {formData.tipo === 'cilindro' && (
                              <>
                                <SelectItem value="biselado">Cilindro Biselado</SelectItem>
                                <SelectItem value="proctor">Cilindro de Proctor</SelectItem>
                                <SelectItem value="cbr">Cilindro de CBR</SelectItem>
                                <SelectItem value="padrao">Cilindro Padrão</SelectItem>
                              </>
                            )}
                            <SelectItem value="outro">Outro (personalizado)</SelectItem>
                          </SelectContent>
                        </Select>
                        {formData.subtipo === 'outro' && (
                          <Input
                            placeholder="Digite a variação personalizada"
                            onChange={(e) => setFormData({...formData, subtipo: e.target.value})}
                            className="mt-2"
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Peso (g)</Label>
                        <Input
                          type="number"
                          step="0.001"
                          value={formData.peso || ''}
                          onChange={(e) => setFormData({...formData, peso: e.target.value ? parseFloat(e.target.value) : undefined})}
                          placeholder="Ex: 25.456"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Volume (cm³)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.volume || ''}
                          onChange={(e) => setFormData({...formData, volume: e.target.value ? parseFloat(e.target.value) : undefined})}
                          placeholder="Ex: 50.25"
                        />
                      </div>

                      {formData.subtipo === 'cbr' && (
                        <div className="space-y-2">
                          <Label>Altura (cm)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={formData.altura || ''}
                            onChange={(e) => setFormData({...formData, altura: e.target.value ? parseFloat(e.target.value) : undefined})}
                            placeholder="Ex: 11.64"
                          />
                        </div>
                      )}

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

                    <div className="space-y-2">
                      <Label>Observações</Label>
                      <Textarea
                        value={formData.observacoes || ''}
                        onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                        placeholder="Observações sobre o equipamento..."
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        {equipamentoEdit ? 'Atualizar' : 'Cadastrar'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Lista de equipamentos */}
        <div className="grid gap-4">
          {equipamentosFiltrados.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FlaskRound className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum equipamento encontrado
                </h3>
                <p className="text-gray-600 mb-4">
                  {equipamentos.length === 0 
                    ? 'Comece cadastrando seu primeiro equipamento'
                    : 'Tente ajustar os filtros de busca'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            equipamentosFiltrados.map((equipamento) => (
              <Card key={equipamento.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {tipoIcons[equipamento.tipo]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{equipamento.codigo}</h3>
                          <Badge variant="outline" className={statusColors[equipamento.status]}>
                            {equipamento.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {equipamento.tipo === 'capsula' ? 'Cápsula' : 'Cilindro'}
                          </Badge>
                          {equipamento.subtipo && (
                            <Badge variant="outline" className="text-xs capitalize">
                              {equipamento.subtipo}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {equipamento.peso && `${equipamento.peso}g`}
                          {equipamento.volume && ` • ${equipamento.volume}cm³`}
                          {equipamento.altura && ` • ${equipamento.altura}cm altura`}
                        </p>
                        {equipamento.observacoes && (
                          <p className="text-sm text-gray-500 mt-1">
                            {equipamento.observacoes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditar(equipamento)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExcluir(equipamento)}
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Estatísticas */}
        {equipamentos.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {equipamentos.length}
                  </div>
                  <div className="text-sm text-blue-600">Total</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {equipamentos.filter(e => e.status === 'ativo').length}
                  </div>
                  <div className="text-sm text-green-600">Ativos</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {equipamentos.filter(e => e.tipo === 'capsula').length}
                  </div>
                  <div className="text-sm text-purple-600">Cápsulas</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {equipamentos.filter(e => e.tipo === 'cilindro').length}
                  </div>
                  <div className="text-sm text-orange-600">Cilindros</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}