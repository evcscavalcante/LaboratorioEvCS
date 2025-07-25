import { useState, useEffect } from "react";
import { Info, Settings, Link, Calculator, Droplet, BarChart, Save, FileText, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusIndicator from "./status-indicator";
import { calculateMoistureContent, calculateDensityInSitu } from "@/lib/calculations";
import { generateDensityInSituVerticalPDF } from "@/lib/pdf-vertical-tables";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { localDataManager } from "@/lib/local-storage";

interface DensityInSituData {
  registrationNumber: string;
  date: string;
  time: string;
  operator: string;
  technicalResponsible: string;
  verifier: string;
  material: string;
  origin: string;
  coordinates: string;
  quadrant: string;
  layer: string;
  balanceId: string;
  ovenId: string;
  realDensityRef: string;
  maxMinDensityRef: string;
  
  det1: {
    cylinderNumber: string;
    moldeSolo: number;
    molde: number;
    volume: number;
  };
  det2: {
    cylinderNumber: string;
    moldeSolo: number;
    molde: number;
    volume: number;
  };
  
  moistureTop1: { capsule: string; wetTare: number; dryTare: number; tare: number; };
  moistureTop2: { capsule: string; wetTare: number; dryTare: number; tare: number; };
  moistureTop3: { capsule: string; wetTare: number; dryTare: number; tare: number; };
  
  moistureBase1: { capsule: string; wetTare: number; dryTare: number; tare: number; };
  moistureBase2: { capsule: string; wetTare: number; dryTare: number; tare: number; };
  moistureBase3: { capsule: string; wetTare: number; dryTare: number; tare: number; };
}

interface DensityInSituProps {
  testId?: number;
  mode?: 'view' | 'edit' | 'new';
}

export default function DensityInSitu({ testId, mode = 'new' }: DensityInSituProps) {
  const { toast } = useToast();
  const [equipamentos, setEquipamentos] = useState<{capsulas: any[], cilindros: any[]}>({
    capsulas: [],
    cilindros: []
  });

  // Query para buscar dados do ensaio específico
  const { data: testData, isLoading: loadingTest } = useQuery({
    queryKey: ['/api/tests/density-in-situ/temp', testId],
    queryFn: async () => {
      if (!testId) return null;
      const response = await apiRequest('GET', `/api/tests/density-in-situ/temp`);
      const tests = await response.json();
      return tests.find((test: any) => test.id === testId) || null;
    },
    enabled: !!testId
  });

  // Buscar ensaios de densidade real salvos
  const { data: realDensityTests = [] } = useQuery({
    queryKey: ["/api/tests/real-density/temp"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/tests/real-density/temp");
      return response.json();
    }
  });

  // Buscar ensaios de densidade máx/mín salvos
  const { data: maxMinDensityTests = [] } = useQuery({
    queryKey: ["/api/tests/max-min-density/temp"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/tests/max-min-density/temp");
      return response.json();
    }
  });

  // Mutation para salvar ensaio
  const saveTestMutation = useMutation({
    mutationFn: async (testData: any) => {
      console.log("🔄 Enviando dados do ensaio:", testData);
      const response = await apiRequest("POST", "/api/tests/density-in-situ/temp", testData);
      console.log("📡 Resposta da API:", response);
      return response.json();
    },
    onSuccess: (result) => {
      console.log("✅ Ensaio salvo com sucesso:", result);
      toast({
        title: "Ensaio salvo com sucesso",
        description: "O ensaio foi salvo no banco de dados.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tests/density-in-situ/temp"] });
      localStorage.removeItem('density-in-situ-progress');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao salvar ensaio:', error);
      toast({
        title: "Erro ao salvar ensaio",
        description: "Não foi possível salvar o ensaio no banco de dados.",
        variant: "destructive",
      });
    },
  });

  // Função para carregar dados salvos
  const loadSavedData = (): DensityInSituData => {
    try {
      const saved = localStorage.getItem('density-in-situ-progress');
      if (saved) {
        const parsedData = JSON.parse(saved);
        return {
          ...parsedData,
          date: parsedData.date || new Date().toISOString().split('T')[0],
          time: parsedData.time || new Date().toTimeString().slice(0, 5),
        };
      }
    } catch (error) {
      console.error('Erro ao carregar dados salvos:', error);
    }
    
    return {
      registrationNumber: "",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      operator: "",
      technicalResponsible: "",
      verifier: "",
      material: "",
      origin: "",
      coordinates: "",
      quadrant: "",
      layer: "",
      balanceId: "",
      ovenId: "",
      realDensityRef: "",
      maxMinDensityRef: "",
      det1: { cylinderNumber: "", moldeSolo: 0, molde: 0, volume: 0 },
      det2: { cylinderNumber: "", moldeSolo: 0, molde: 0, volume: 0 },
      moistureTop1: { capsule: "", wetTare: 0, dryTare: 0, tare: 0 },
      moistureTop2: { capsule: "", wetTare: 0, dryTare: 0, tare: 0 },
      moistureTop3: { capsule: "", wetTare: 0, dryTare: 0, tare: 0 },
      moistureBase1: { capsule: "", wetTare: 0, dryTare: 0, tare: 0 },
      moistureBase2: { capsule: "", wetTare: 0, dryTare: 0, tare: 0 },
      moistureBase3: { capsule: "", wetTare: 0, dryTare: 0, tare: 0 },
    };
  };

  const [data, setData] = useState<DensityInSituData>(loadSavedData());

  // Salvamento automático
  useEffect(() => {
    const saveProgress = () => {
      try {
        localStorage.setItem('density-in-situ-progress', JSON.stringify(data));
        console.log('💾 Progresso do ensaio salvo automaticamente');
      } catch (error) {
        console.error('Erro ao salvar progresso:', error);
      }
    };

    const timeoutId = setTimeout(saveProgress, 500);
    return () => clearTimeout(timeoutId);
  }, [data]);

  // Carregar equipamentos
  useEffect(() => {
    const loadEquipamentos = async () => {
      try {
        const [capsulas, cilindros] = await Promise.all([
          localDataManager.getCapsulas(),
          localDataManager.getCilindros()
        ]);
        setEquipamentos({ capsulas, cilindros });
      } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
      }
    };

    loadEquipamentos();
  }, []);

  const [calculations, setCalculations] = useState({
    det1: { soil: 0, gammaNatWet: 0, gammaNatDry: 0 },
    det2: { soil: 0, gammaNatWet: 0, gammaNatDry: 0 },
    moistureTop1: 0,
    moistureTop2: 0,
    moistureTop3: 0,
    moistureBase1: 0,
    moistureBase2: 0,
    moistureBase3: 0,
    results: {
      averageMoistureTop: 0,
      averageMoistureBase: 0,
      averageGammaNatDry: 0,
      relativeCompactness: 0
    }
  });

  // Recalcular sempre que os dados mudarem
  useEffect(() => {
    const det1Soil = data.det1.moldeSolo - data.det1.molde;
    const det2Soil = data.det2.moldeSolo - data.det2.molde;
    
    const det1GammaNatWet = data.det1.volume > 0 ? det1Soil / data.det1.volume : 0;
    const det2GammaNatWet = data.det2.volume > 0 ? det2Soil / data.det2.volume : 0;

    // Calculate moisture content for each determination manually
    const moistureTop1 = data.moistureTop1.dryTare > data.moistureTop1.tare ? 
      ((data.moistureTop1.wetTare - data.moistureTop1.dryTare) / (data.moistureTop1.dryTare - data.moistureTop1.tare)) * 100 : 0;
    const moistureTop2 = data.moistureTop2.dryTare > data.moistureTop2.tare ? 
      ((data.moistureTop2.wetTare - data.moistureTop2.dryTare) / (data.moistureTop2.dryTare - data.moistureTop2.tare)) * 100 : 0;
    const moistureTop3 = data.moistureTop3.dryTare > data.moistureTop3.tare ? 
      ((data.moistureTop3.wetTare - data.moistureTop3.dryTare) / (data.moistureTop3.dryTare - data.moistureTop3.tare)) * 100 : 0;
    
    const moistureBase1 = data.moistureBase1.dryTare > data.moistureBase1.tare ? 
      ((data.moistureBase1.wetTare - data.moistureBase1.dryTare) / (data.moistureBase1.dryTare - data.moistureBase1.tare)) * 100 : 0;
    const moistureBase2 = data.moistureBase2.dryTare > data.moistureBase2.tare ? 
      ((data.moistureBase2.wetTare - data.moistureBase2.dryTare) / (data.moistureBase2.dryTare - data.moistureBase2.tare)) * 100 : 0;
    const moistureBase3 = data.moistureBase3.dryTare > data.moistureBase3.tare ? 
      ((data.moistureBase3.wetTare - data.moistureBase3.dryTare) / (data.moistureBase3.dryTare - data.moistureBase3.tare)) * 100 : 0;

    const avgMoistureTop = (moistureTop1 + moistureTop2 + moistureTop3) / 3;
    const avgMoistureBase = (moistureBase1 + moistureBase2 + moistureBase3) / 3;

    const det1GammaNatDry = det1GammaNatWet / (1 + avgMoistureTop / 100);
    const det2GammaNatDry = det2GammaNatWet / (1 + avgMoistureBase / 100);
    const gammaNatDryAvg = (det1GammaNatDry + det2GammaNatDry) / 2;

    // Calculate relative compactness using real density references
    let relativeCompactness = 0;
    // This would need real density reference data from the database
    
    setCalculations({
      det1: { soil: det1Soil, gammaNatWet: det1GammaNatWet, gammaNatDry: det1GammaNatDry },
      det2: { soil: det2Soil, gammaNatWet: det2GammaNatWet, gammaNatDry: det2GammaNatDry },
      moistureTop1: isNaN(moistureTop1) ? 0 : moistureTop1,
      moistureTop2: isNaN(moistureTop2) ? 0 : moistureTop2,
      moistureTop3: isNaN(moistureTop3) ? 0 : moistureTop3,
      moistureBase1: isNaN(moistureBase1) ? 0 : moistureBase1,
      moistureBase2: isNaN(moistureBase2) ? 0 : moistureBase2,
      moistureBase3: isNaN(moistureBase3) ? 0 : moistureBase3,
      results: {
        averageMoistureTop: isNaN(avgMoistureTop) ? 0 : avgMoistureTop,
        averageMoistureBase: isNaN(avgMoistureBase) ? 0 : avgMoistureBase,
        averageGammaNatDry: isNaN(gammaNatDryAvg) ? 0 : gammaNatDryAvg,
        relativeCompactness: isNaN(relativeCompactness) ? 0 : relativeCompactness
      }
    });
  }, [data]);

  const updateData = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedData = (parent: string, field: string, value: any) => {
    setData(prev => {
      const parentData = prev[parent as keyof DensityInSituData];
      if (typeof parentData === 'object' && parentData !== null) {
        return {
          ...prev,
          [parent]: { ...parentData, [field]: value }
        };
      }
      return prev;
    });
  };

  const handleSave = () => {
    // Validação básica dos campos obrigatórios
    if (!data.registrationNumber || !data.operator || !data.material) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos Registro, Operador e Material",
        variant: "destructive"
      });
      return;
    }

    const testData = {
      registrationNumber: data.registrationNumber,
      date: data.date,
      time: data.time,
      operator: data.operator,
      technicalResponsible: data.technicalResponsible,
      verifier: data.verifier,
      material: data.material,
      origin: data.origin,
      coordinates: data.coordinates,
      quadrant: data.quadrant,
      layer: data.layer,
      balanceId: data.balanceId,
      ovenId: data.ovenId,
      realDensityRef: data.realDensityRef,
      maxMinDensityRef: data.maxMinDensityRef,
      determinations: {
        det1: data.det1,
        det2: data.det2
      },
      moistureTop: {
        det1: data.moistureTop1,
        det2: data.moistureTop2,
        det3: data.moistureTop3
      },
      moistureBase: {
        det1: data.moistureBase1,
        det2: data.moistureBase2,
        det3: data.moistureBase3
      },
      results: {
        gammaDTop: calculations.det1.gammaNatDry || 0,
        gammaDBase: calculations.det2.gammaNatDry || 0,
        voidIndex: 0,
        relativeCompactness: calculations.results.relativeCompactness || 0,
        voidIndexTop: 0,
        voidIndexBase: 0,
        relativeCompactnessTop: 0,
        relativeCompactnessBase: 0,
        status: "AGUARDANDO" as const
      }
    };

    console.log("🔄 Preparando para salvar ensaio:", testData);
    saveTestMutation.mutate(testData);
  };

  return (
    <div className="laboratory-page space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-2 text-blue-600" size={20} />
            Ensaio de Densidade In Situ - Método do Cilindro de Cravação
            <StatusIndicator status="active" className="ml-auto" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="registrationNumber">Registro</Label>
              <Input
                id="registrationNumber"
                value={data.registrationNumber}
                onChange={(e) => updateData("registrationNumber", e.target.value)}
                placeholder="DIS-001"
              />
            </div>
            <div>
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={data.date}
                onChange={(e) => updateData("date", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="time">Hora</Label>
              <Input
                id="time"
                type="time"
                value={data.time}
                onChange={(e) => updateData("time", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referencias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Link className="mr-2 text-blue-600" size={20} />
            Referências
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="realDensityRef">Registro de Densidade Real</Label>
              <Select value={data.realDensityRef} onValueChange={(value) => updateData("realDensityRef", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar registro..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum registro selecionado</SelectItem>
                  {realDensityTests.filter((test: any) => test.registrationNumber && test.registrationNumber.trim() !== "").map((test: any) => (
                    <SelectItem key={test.id} value={test.registrationNumber.trim()}>
                      {test.registrationNumber} - {test.material}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="maxMinDensityRef">Registro de Densidade Máx/Mín</Label>
              <Select value={data.maxMinDensityRef} onValueChange={(value) => updateData("maxMinDensityRef", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar registro..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum registro selecionado</SelectItem>
                  {maxMinDensityTests.filter((test: any) => test.registrationNumber && test.registrationNumber.trim() !== "").map((test: any) => (
                    <SelectItem key={test.id} value={test.registrationNumber.trim()}>
                      {test.registrationNumber} - {test.material}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Density In Situ Determinations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="mr-2 text-blue-600" size={20} />
            Densidade In Situ (2 Determinações)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          <div className="mobile-responsive-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Parâmetro</TableHead>
                  <TableHead className="text-center">Determinação 1</TableHead>
                  <TableHead className="text-center">Determinação 2</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Cilindro nº</TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={data.det1.cylinderNumber}
                      onChange={(e) => updateData("det1", { ...data.det1, cylinderNumber: e.target.value })}
                      placeholder="Número do cilindro"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={data.det2.cylinderNumber}
                      onChange={(e) => updateData("det2", { ...data.det2, cylinderNumber: e.target.value })}
                      placeholder="Número do cilindro"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Molde + Solo (g)</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.det1.moldeSolo}
                      onChange={(e) => updateData("det1", { ...data.det1, moldeSolo: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.det2.moldeSolo}
                      onChange={(e) => updateData("det2", { ...data.det2, moldeSolo: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Molde (g)</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.det1.molde}
                      onChange={(e) => updateData("det1", { ...data.det1, molde: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.det2.molde}
                      onChange={(e) => updateData("det2", { ...data.det2, molde: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                </TableRow>
                <TableRow className="bg-blue-50">
                  <TableCell className="font-medium">Solo (g) <Calculator className="inline ml-1" size={12} /></TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={calculations.det1.soil.toFixed(2)}
                      readOnly
                      className="bg-blue-50 border-blue-200 font-mono"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={calculations.det2.soil.toFixed(2)}
                      readOnly
                      className="bg-blue-50 border-blue-200 font-mono"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Volume (cm³)</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.det1.volume}
                      onChange={(e) => updateData("det1", { ...data.det1, volume: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.det2.volume}
                      onChange={(e) => updateData("det2", { ...data.det2, volume: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                </TableRow>
                <TableRow className="bg-blue-50">
                  <TableCell className="font-medium">γnat úmido (g/cm³) <Calculator className="inline ml-1" size={12} /></TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.001"
                      value={calculations.det1.gammaNatWet.toFixed(3)}
                      readOnly
                      className="bg-blue-50 border-blue-200 font-mono"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.001"
                      value={calculations.det2.gammaNatWet.toFixed(3)}
                      readOnly
                      className="bg-blue-50 border-blue-200 font-mono"
                    />
                  </TableCell>
                </TableRow>
                <TableRow className="bg-blue-50">
                  <TableCell className="font-medium">γnat seco (g/cm³) <Calculator className="inline ml-1" size={12} /></TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.001"
                      value={calculations.det1.gammaNatDry.toFixed(3)}
                      readOnly
                      className="bg-blue-50 border-blue-200 font-mono"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.001"
                      value={calculations.det2.gammaNatDry.toFixed(3)}
                      readOnly
                      className="bg-blue-50 border-blue-200 font-mono"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Moisture Content Top */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Droplet className="mr-2 text-blue-500" size={20} />
            Teor de Umidade - Topo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          <div className="mobile-responsive-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Parâmetro</TableHead>
                  <TableHead className="text-center">Determinação 1</TableHead>
                  <TableHead className="text-center">Determinação 2</TableHead>
                  <TableHead className="text-center">Determinação 3</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Cápsula nº</TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={data.moistureTop1.capsule}
                      onChange={(e) => updateData("moistureTop1", { ...data.moistureTop1, capsule: e.target.value })}
                      placeholder="Ex: CAP-001"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={data.moistureTop2.capsule}
                      onChange={(e) => updateData("moistureTop2", { ...data.moistureTop2, capsule: e.target.value })}
                      placeholder="Ex: CAP-002"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={data.moistureTop3.capsule}
                      onChange={(e) => updateData("moistureTop3", { ...data.moistureTop3, capsule: e.target.value })}
                      placeholder="Ex: CAP-003"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Úmido + Tara (g)</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.moistureTop1.wetTare}
                      onChange={(e) => updateData("moistureTop1", { ...data.moistureTop1, wetTare: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.moistureTop2.wetTare}
                      onChange={(e) => updateData("moistureTop2", { ...data.moistureTop2, wetTare: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.moistureTop3.wetTare}
                      onChange={(e) => updateData("moistureTop3", { ...data.moistureTop3, wetTare: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Seco + Tara (g)</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.moistureTop1.dryTare}
                      onChange={(e) => updateData("moistureTop1", { ...data.moistureTop1, dryTare: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.moistureTop2.dryTare}
                      onChange={(e) => updateData("moistureTop2", { ...data.moistureTop2, dryTare: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.moistureTop3.dryTare}
                      onChange={(e) => updateData("moistureTop3", { ...data.moistureTop3, dryTare: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tara (g)</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.moistureTop1.tare}
                      onChange={(e) => updateData("moistureTop1", { ...data.moistureTop1, tare: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.moistureTop2.tare}
                      onChange={(e) => updateData("moistureTop2", { ...data.moistureTop2, tare: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.moistureTop3.tare}
                      onChange={(e) => updateData("moistureTop3", { ...data.moistureTop3, tare: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                </TableRow>
                <TableRow className="bg-blue-50">
                  <TableCell className="font-medium">Umidade (%) <Calculator className="inline ml-1" size={12} /></TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={calculations.moistureTop1.toFixed(2)}
                      readOnly
                      className="bg-blue-50 border-blue-200 font-mono"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={calculations.moistureTop2.toFixed(2)}
                      readOnly
                      className="bg-blue-50 border-blue-200 font-mono"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={calculations.moistureTop3.toFixed(2)}
                      readOnly
                      className="bg-blue-50 border-blue-200 font-mono"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Moisture Content Base */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Droplet className="mr-2 text-green-500" size={20} />
            Teor de Umidade - Base
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          <div className="mobile-responsive-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Parâmetro</TableHead>
                  <TableHead className="text-center">Determinação 1</TableHead>
                  <TableHead className="text-center">Determinação 2</TableHead>
                  <TableHead className="text-center">Determinação 3</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Cápsula nº</TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={data.moistureBase1.capsule}
                      onChange={(e) => updateData("moistureBase1", { ...data.moistureBase1, capsule: e.target.value })}
                      placeholder="Ex: CAP-B01"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={data.moistureBase2.capsule}
                      onChange={(e) => updateData("moistureBase2", { ...data.moistureBase2, capsule: e.target.value })}
                      placeholder="Ex: CAP-B02"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={data.moistureBase3.capsule}
                      onChange={(e) => updateData("moistureBase3", { ...data.moistureBase3, capsule: e.target.value })}
                      placeholder="Ex: CAP-B03"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Úmido + Tara (g)</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.moistureBase1.wetTare}
                      onChange={(e) => updateData("moistureBase1", { ...data.moistureBase1, wetTare: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.moistureBase2.wetTare}
                      onChange={(e) => updateData("moistureBase2", { ...data.moistureBase2, wetTare: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.moistureBase3.wetTare}
                      onChange={(e) => updateData("moistureBase3", { ...data.moistureBase3, wetTare: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Seco + Tara (g)</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.moistureBase1.dryTare}
                      onChange={(e) => updateData("moistureBase1", { ...data.moistureBase1, dryTare: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.moistureBase2.dryTare}
                      onChange={(e) => updateData("moistureBase2", { ...data.moistureBase2, dryTare: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.moistureBase3.dryTare}
                      onChange={(e) => updateData("moistureBase3", { ...data.moistureBase3, dryTare: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tara (g)</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.moistureBase1.tare}
                      onChange={(e) => updateData("moistureBase1", { ...data.moistureBase1, tare: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.moistureBase2.tare}
                      onChange={(e) => updateData("moistureBase2", { ...data.moistureBase2, tare: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.moistureBase3.tare}
                      onChange={(e) => updateData("moistureBase3", { ...data.moistureBase3, tare: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </TableCell>
                </TableRow>
                <TableRow className="bg-blue-50">
                  <TableCell className="font-medium">Umidade (%) <Calculator className="inline ml-1" size={12} /></TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={calculations.moistureBase1.toFixed(2)}
                      readOnly
                      className="bg-blue-50 border-blue-200 font-mono"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={calculations.moistureBase2.toFixed(2)}
                      readOnly
                      className="bg-blue-50 border-blue-200 font-mono"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={calculations.moistureBase3.toFixed(2)}
                      readOnly
                      className="bg-blue-50 border-blue-200 font-mono"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Final Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="mr-2 text-green-600" size={20} />
            Resultados Finais
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <Label className="text-sm font-medium text-blue-700">Umidade Média Topo (%)</Label>
              <p className="text-2xl font-bold text-blue-900 font-mono">
                {calculations.results.averageMoistureTop.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <Label className="text-sm font-medium text-green-700">Umidade Média Base (%)</Label>
              <p className="text-2xl font-bold text-green-900 font-mono">
                {calculations.results.averageMoistureBase.toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <Label className="text-sm font-medium text-purple-700">γnat seco médio (g/cm³)</Label>
              <p className="text-2xl font-bold text-purple-900 font-mono">
                {calculations.results.averageGammaNatDry.toFixed(3)}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <Label className="text-sm font-medium text-orange-700">Compacidade Relativa (%)</Label>
              <p className="text-2xl font-bold text-orange-900 font-mono">
                {calculations.results.relativeCompactness.toFixed(1)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleSave}
              disabled={saveTestMutation.isPending}
              className="flex-1 min-w-[200px]"
            >
              <Save className="mr-2" size={16} />
              {saveTestMutation.isPending ? "Salvando..." : "Salvar Ensaio"}
            </Button>
            <Button 
              onClick={() => generateDensityInSituVerticalPDF(data, calculations)}
              variant="outline"
              className="flex-1 min-w-[200px]"
            >
              <FileText className="mr-2" size={16} />
              Gerar PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}