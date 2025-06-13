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

export default function DensityInSitu() {
  const { toast } = useToast();
  const [equipamentos, setEquipamentos] = useState<{capsulas: any[], cilindros: any[]}>({
    capsulas: [],
    cilindros: []
  });

  // Buscar ensaios de densidade real salvos
  const { data: realDensityTests = [] } = useQuery({
    queryKey: ["/api/tests/real-density"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/tests/real-density");
      return response.json();
    }
  });

  // Buscar ensaios de densidade máx/mín salvos
  const { data: maxMinDensityTests = [] } = useQuery({
    queryKey: ["/api/tests/max-min-density"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/tests/max-min-density");
      return response.json();
    }
  });

  // Mutation para salvar ensaio
  const saveTestMutation = useMutation({
    mutationFn: async (testData: any) => {
      const response = await apiRequest("POST", "/api/tests/density-in-situ", testData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Ensaio salvo com sucesso",
        description: "O ensaio foi salvo no banco de dados.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tests/density-in-situ"] });
      localStorage.removeItem('density-in-situ-progress');
    },
    onError: (error: any) => {
      console.error('Erro ao salvar ensaio:', error);
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
    gammaNatDryAvg: 0,
    moistureTop: { det1: { dryWeight: 0, water: 0, moisture: 0 }, det2: { dryWeight: 0, water: 0, moisture: 0 }, det3: { dryWeight: 0, water: 0, moisture: 0 }, average: 0 },
    moistureBase: { det1: { dryWeight: 0, water: 0, moisture: 0 }, det2: { dryWeight: 0, water: 0, moisture: 0 }, det3: { dryWeight: 0, water: 0, moisture: 0 }, average: 0 },
    results: { 
      gammaDTop: 0, 
      gammaDBase: 0, 
      voidIndex: 0, 
      relativeCompactness: 0, 
      status: "AGUARDANDO" 
    }
  });

  // Recalcular sempre que os dados mudarem
  useEffect(() => {
    const det1Soil = data.det1.moldeSolo - data.det1.molde;
    const det2Soil = data.det2.moldeSolo - data.det2.molde;
    
    const det1GammaNatWet = data.det1.volume > 0 ? det1Soil / data.det1.volume : 0;
    const det2GammaNatWet = data.det2.volume > 0 ? det2Soil / data.det2.volume : 0;

    const moistureTopCalcs = [data.moistureTop1, data.moistureTop2, data.moistureTop3].map(m => {
      const dryWeight = m.dryTare - m.tare;
      const water = m.wetTare - m.dryTare;
      const moisture = dryWeight > 0 ? (water / dryWeight) * 100 : 0;
      return { dryWeight, water, moisture };
    });

    const moistureBaseCalcs = [data.moistureBase1, data.moistureBase2, data.moistureBase3].map(m => {
      const dryWeight = m.dryTare - m.tare;
      const water = m.wetTare - m.dryTare;
      const moisture = dryWeight > 0 ? (water / dryWeight) * 100 : 0;
      return { dryWeight, water, moisture };
    });

    const avgMoistureTop = moistureTopCalcs.reduce((sum, calc) => sum + calc.moisture, 0) / 3;
    const avgMoistureBase = moistureBaseCalcs.reduce((sum, calc) => sum + calc.moisture, 0) / 3;

    const det1GammaNatDry = det1GammaNatWet / (1 + avgMoistureTop / 100);
    const det2GammaNatDry = det2GammaNatWet / (1 + avgMoistureBase / 100);
    const gammaNatDryAvg = (det1GammaNatDry + det2GammaNatDry) / 2;

    setCalculations({
      det1: { soil: det1Soil, gammaNatWet: det1GammaNatWet, gammaNatDry: det1GammaNatDry },
      det2: { soil: det2Soil, gammaNatWet: det2GammaNatWet, gammaNatDry: det2GammaNatDry },
      gammaNatDryAvg,
      moistureTop: {
        det1: moistureTopCalcs[0],
        det2: moistureTopCalcs[1],
        det3: moistureTopCalcs[2],
        average: avgMoistureTop
      },
      moistureBase: {
        det1: moistureBaseCalcs[0],
        det2: moistureBaseCalcs[1],
        det3: moistureBaseCalcs[2],
        average: avgMoistureBase
      },
      results: {
        gammaDTop: det1GammaNatDry,
        gammaDBase: det2GammaNatDry,
        voidIndex: 0,
        relativeCompactness: 0,
        status: "AGUARDANDO"
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
      results: calculations.results
    };

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
                  {realDensityTests.map((test: any) => (
                    <SelectItem key={test.id} value={test.registrationNumber}>
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
                  {maxMinDensityTests.map((test: any) => (
                    <SelectItem key={test.id} value={test.registrationNumber}>
                      {test.registrationNumber} - {test.material}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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