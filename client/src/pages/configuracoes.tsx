import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Database, 
  Download, 
  Upload, 
  Shield, 
  User, 
  Bell, 
  Palette,
  FileText,
  Save,
  RotateCcw,
  Trash2,
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { localDataManager } from '@/lib/local-storage';
import { useToast } from '@/hooks/use-toast';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en-US' | 'es-ES';
  autoSave: boolean;
  notifications: boolean;
  precision: number;
  defaultLocation: string;
  defaultResponsible: string;
  backupInterval: number;
  exportFormat: 'pdf' | 'csv' | 'json';
  dateFormat: 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd';
  temperatureUnit: 'celsius' | 'fahrenheit';
  measurementSystem: 'metric' | 'imperial';
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'pt-BR',
  autoSave: true,
  notifications: true,
  precision: 3,
  defaultLocation: '',
  defaultResponsible: '',
  backupInterval: 7, // dias
  exportFormat: 'pdf',
  dateFormat: 'dd/MM/yyyy',
  temperatureUnit: 'celsius',
  measurementSystem: 'metric'
};

export default function Configuracoes() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [dataStats, setDataStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [backupFile, setBackupFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPreferences();
    loadDataStatistics();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedPrefs = await localDataManager.getUserPreference('userPreferences');
      if (savedPrefs) {
        setPreferences({ ...defaultPreferences, ...savedPrefs });
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    }
  };

  const loadDataStatistics = async () => {
    try {
      const stats = await localDataManager.getDataStatistics();
      setDataStats(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const savePreferences = async () => {
    setLoading(true);
    try {
      await localDataManager.saveUserPreference('userPreferences', preferences);
      toast({
        title: "Configurações salvas",
        description: "Suas preferências foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    toast({
      title: "Configurações redefinidas",
      description: "As configurações foram restauradas para os valores padrão.",
    });
  };

  const handleDownloadBackup = async () => {
    setLoading(true);
    try {
      await localDataManager.downloadBackup();
      toast({
        title: "Backup criado",
        description: "O backup dos dados foi baixado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro no backup",
        description: "Não foi possível criar o backup dos dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreBackup = async () => {
    if (!backupFile) {
      toast({
        title: "Arquivo necessário",
        description: "Selecione um arquivo de backup para restaurar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const fileContent = await backupFile.text();
      await localDataManager.restoreBackup(fileContent);
      await loadDataStatistics();
      setBackupFile(null);
      toast({
        title: "Backup restaurado",
        description: "Os dados foram restaurados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na restauração",
        description: "Não foi possível restaurar o backup. Verifique se o arquivo é válido.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearAllData = async () => {
    if (!confirm('Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.')) {
      return;
    }

    setLoading(true);
    try {
      await localDataManager.restoreBackup('{"data": {}}');
      await loadDataStatistics();
      toast({
        title: "Dados apagados",
        description: "Todos os dados foram removidos com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao apagar dados",
        description: "Não foi possível apagar os dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="w-8 h-8" />
          Configurações do Sistema
        </h1>
        <p className="text-gray-600 mt-2">
          Gerencie suas preferências, dados e configurações do laboratório
        </p>
      </div>

      <Tabs defaultValue="preferences" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Preferências
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Dados
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        {/* Aba de Preferências */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Configurações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultLocation">Localização Padrão</Label>
                  <Input
                    id="defaultLocation"
                    value={preferences.defaultLocation}
                    onChange={(e) => updatePreference('defaultLocation', e.target.value)}
                    placeholder="Ex: Laboratório Principal"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultResponsible">Responsável Padrão</Label>
                  <Input
                    id="defaultResponsible"
                    value={preferences.defaultResponsible}
                    onChange={(e) => updatePreference('defaultResponsible', e.target.value)}
                    placeholder="Ex: João Silva"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="precision">Precisão (casas decimais)</Label>
                  <Select
                    value={preferences.precision.toString()}
                    onValueChange={(value) => updatePreference('precision', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 casa decimal</SelectItem>
                      <SelectItem value="2">2 casas decimais</SelectItem>
                      <SelectItem value="3">3 casas decimais</SelectItem>
                      <SelectItem value="4">4 casas decimais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) => updatePreference('language', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Formato e Unidades
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Formato de Data</Label>
                  <Select
                    value={preferences.dateFormat}
                    onValueChange={(value) => updatePreference('dateFormat', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                      <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                      <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperatureUnit">Unidade de Temperatura</Label>
                  <Select
                    value={preferences.temperatureUnit}
                    onValueChange={(value) => updatePreference('temperatureUnit', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celsius">Celsius (°C)</SelectItem>
                      <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="measurementSystem">Sistema de Medidas</Label>
                  <Select
                    value={preferences.measurementSystem}
                    onValueChange={(value) => updatePreference('measurementSystem', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Métrico</SelectItem>
                      <SelectItem value="imperial">Imperial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exportFormat">Formato de Exportação Padrão</Label>
                  <Select
                    value={preferences.exportFormat}
                    onValueChange={(value) => updatePreference('exportFormat', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Configurações de Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoSave">Salvamento Automático</Label>
                  <p className="text-sm text-gray-500">
                    Salva automaticamente os dados conforme você digita
                  </p>
                </div>
                <Switch
                  id="autoSave"
                  checked={preferences.autoSave}
                  onCheckedChange={(checked) => updatePreference('autoSave', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notificações</Label>
                  <p className="text-sm text-gray-500">
                    Receba notificações sobre atualizações e lembretes
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={preferences.notifications}
                  onCheckedChange={(checked) => updatePreference('notifications', checked)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="backupInterval">Intervalo de Backup (dias)</Label>
                <Select
                  value={preferences.backupInterval.toString()}
                  onValueChange={(value) => updatePreference('backupInterval', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Diário</SelectItem>
                    <SelectItem value="3">A cada 3 dias</SelectItem>
                    <SelectItem value="7">Semanal</SelectItem>
                    <SelectItem value="15">Quinzenal</SelectItem>
                    <SelectItem value="30">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={savePreferences} disabled={loading} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Salvar Configurações
            </Button>
            <Button onClick={resetPreferences} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Restaurar Padrões
            </Button>
          </div>
        </TabsContent>

        {/* Aba de Dados */}
        <TabsContent value="data" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Estatísticas dos Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dataStats ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total de Ensaios:</span>
                      <Badge variant="secondary">{dataStats.totalTests}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Densidade In Situ:</span>
                      <span className="text-sm">{dataStats.densityInSituCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Densidade Real:</span>
                      <span className="text-sm">{dataStats.densityRealCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Densidade Máx/Mín:</span>
                      <span className="text-sm">{dataStats.densityMaxMinCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Verificações de Balança:</span>
                      <span className="text-sm">{dataStats.balanceVerificationCount}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Armazenamento Usado:</span>
                      <span className="text-sm">{formatBytes(dataStats.storageUsed)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Carregando estatísticas...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Backup e Restauração
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    Faça backup regular dos seus dados para evitar perda de informações importantes.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleDownloadBackup}
                  disabled={loading}
                  className="w-full flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Baixar Backup Completo
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="backupFile">Restaurar Backup</Label>
                  <Input
                    id="backupFile"
                    type="file"
                    accept=".json"
                    onChange={(e) => setBackupFile(e.target.files?.[0] || null)}
                  />
                  {backupFile && (
                    <p className="text-sm text-gray-500">
                      Arquivo selecionado: {backupFile.name}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleRestoreBackup}
                  disabled={loading || !backupFile}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Restaurar Backup
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Trash2 className="w-5 h-5" />
                Zona de Perigo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  As ações abaixo são irreversíveis. Certifique-se de ter um backup antes de prosseguir.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleClearAllData}
                disabled={loading}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Apagar Todos os Dados
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Aparência */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Tema e Aparência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Tema</Label>
                <Select
                  value={preferences.theme}
                  onValueChange={(value) => updatePreference('theme', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="system">Seguir sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  Mais opções de personalização serão adicionadas em futuras atualizações.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Segurança */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configurações de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle className="w-4 h-4" />
                <AlertDescription>
                  Todos os dados são armazenados localmente no seu dispositivo e criptografados.
                  Nenhuma informação sensível é enviada para servidores externos sem sua autorização.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h4 className="font-medium">Medidas de Segurança Ativas:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Armazenamento local criptografado</li>
                  <li>• Validação de dados em tempo real</li>
                  <li>• Backup automático opcional</li>
                  <li>• Auditoria de alterações</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}