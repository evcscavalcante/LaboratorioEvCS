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
import { generateDensityInSituPDF } from "@/lib/pdf-generator";
import { useMutation, queryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DensityInSituData {
  // General Info
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
  
  // Determinations
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
  
  // Moisture Top
  moistureTop1: { capsule: string; wetTare: number; dryTare: number; tare: number; };
  moistureTop2: { capsule: string; wetTare: number; dryTare: number; tare: number; };
  moistureTop3: { capsule: string; wetTare: number; dryTare: number; tare: number; };
  
  // Moisture Base
  moistureBase1: { capsule: string; wetTare: number; dryTare: number; tare: number; };
  moistureBase2: { capsule: string; wetTare: number; dryTare: number; tare: number; };
  moistureBase3: { capsule: string; wetTare: number; dryTare: number; tare: number; };
}

export default function DensityInSitu() {
  const { toast } = useToast();
  const [data, setData] = useState<DensityInSituData>({
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
  });

  const [calculations, setCalculations] = useState({
    det1: { soil: 0, gammaNatWet: 0, gammaNatDry: 0 },
    det2: { soil: 0, gammaNatWet: 0, gammaNatDry: 0 },
    gammaNatDryAvg: 0,
    moistureTop: { det1: { dryWeight: 0, water: 0, moisture: 0 }, det2: { dryWeight: 0, water: 0, moisture: 0 }, det3: { dryWeight: 0, water: 0, moisture: 0 }, average: 0 },
    moistureBase: { det1: { dryWeight: 0, water: 0, moisture: 0 }, det2: { dryWeight: 0, water: 0, moisture: 0 }, det3: { dryWeight: 0, water: 0, moisture: 0 }, average: 0 },
    results: { gammaDTop: 0, gammaDBase: 0, voidIndex: 0.65, relativeCompactness: 75, status: "AGUARDANDO" as const }
  });

  const saveTestMutation = useMutation({
    mutationFn: async (testData: any) => {
      return apiRequest("POST", "/api/density-in-situ", testData);
    },
    onSuccess: () => {
      toast({ title: "Ensaio salvo com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/density-in-situ"] });
    },
    onError: (error) => {
      toast({ 
        title: "Erro ao salvar ensaio", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  useEffect(() => {
    // Calculate determinations
    const det1Soil = data.det1.moldeSolo - data.det1.molde;
    const det2Soil = data.det2.moldeSolo - data.det2.molde;
    
    const det1GammaNatWet = data.det1.volume > 0 ? det1Soil / data.det1.volume : 0;
    const det2GammaNatWet = data.det2.volume > 0 ? det2Soil / data.det2.volume : 0;

    // Calculate moisture content
    const moistureTopResults = calculateMoistureContent([
      data.moistureTop1,
      data.moistureTop2,
      data.moistureTop3
    ]);

    const moistureBaseResults = calculateMoistureContent([
      data.moistureBase1,
      data.moistureBase2,
      data.moistureBase3
    ]);

    // Calculate dry densities
    const det1GammaNatDry = moistureTopResults.average > 0 ? det1GammaNatWet / (1 + moistureTopResults.average / 100) : 0;
    const det2GammaNatDry = moistureTopResults.average > 0 ? det2GammaNatWet / (1 + moistureTopResults.average / 100) : 0;
    
    const gammaNatDryAvg = (det1GammaNatDry + det2GammaNatDry) / 2;

    // Determine status
    const status = gammaNatDryAvg > 1.5 ? "APROVADO" : gammaNatDryAvg === 0 ? "AGUARDANDO" : "REPROVADO";

    setCalculations({
      det1: { soil: det1Soil, gammaNatWet: det1GammaNatWet, gammaNatDry: det1GammaNatDry },
      det2: { soil: det2Soil, gammaNatWet: det2GammaNatWet, gammaNatDry: det2GammaNatDry },
      gammaNatDryAvg,
      moistureTop: moistureTopResults,
      moistureBase: moistureBaseResults,
      results: {
        gammaDTop: gammaNatDryAvg,
        gammaDBase: gammaNatDryAvg,
        voidIndex: 0.65, // Would be calculated with reference values
        relativeCompactness: 75, // Would be calculated with reference values
        status
      }
    });
  }, [data]);

  const updateData = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedData = (parent: string, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [parent]: { ...prev[parent as keyof DensityInSituData], [field]: value }
    }));
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

  const handleGeneratePDF = () => {
    generateDensityInSituPDF(data, calculations);
  };

  const handleClear = () => {
    setData({
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
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculadora de Densidade In Situ</h2>
        <p className="text-gray-600">Determinação da densidade natural do solo em campo</p>
      </div>

      {/* Status */}
      <StatusIndicator status={calculations.results.status} />

      {/* General Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-2 text-blue-600" size={20} />
            Informações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="registrationNumber">Número do Registro</Label>
              <Input
                id="registrationNumber"
                value={data.registrationNumber}
                onChange={(e) => updateData("registrationNumber", e.target.value)}
                placeholder="Ex: EG-001/2024"
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
            <div>
              <Label htmlFor="operator">Operador</Label>
              <Input
                id="operator"
                value={data.operator}
                onChange={(e) => updateData("operator", e.target.value)}
                placeholder="Nome do operador"
              />
            </div>
            <div>
              <Label htmlFor="technicalResponsible">Responsável Técnico</Label>
              <Input
                id="technicalResponsible"
                value={data.technicalResponsible}
                onChange={(e) => updateData("technicalResponsible", e.target.value)}
                placeholder="Nome do responsável"
              />
            </div>
            <div>
              <Label htmlFor="verifier">Verificador</Label>
              <Input
                id="verifier"
                value={data.verifier}
                onChange={(e) => updateData("verifier", e.target.value)}
                placeholder="Nome do verificador"
              />
            </div>
            <div>
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                value={data.material}
                onChange={(e) => updateData("material", e.target.value)}
                placeholder="Tipo de material"
              />
            </div>
            <div>
              <Label htmlFor="origin">Origem</Label>
              <Input
                id="origin"
                value={data.origin}
                onChange={(e) => updateData("origin", e.target.value)}
                placeholder="Local de origem"
              />
            </div>
            <div>
              <Label htmlFor="coordinates">Norte / Este / Cota</Label>
              <Input
                id="coordinates"
                value={data.coordinates}
                onChange={(e) => updateData("coordinates", e.target.value)}
                placeholder="Coordenadas"
              />
            </div>
            <div>
              <Label htmlFor="quadrant">Quadrante</Label>
              <Input
                id="quadrant"
                value={data.quadrant}
                onChange={(e) => updateData("quadrant", e.target.value)}
                placeholder="Quadrante"
              />
            </div>
            <div>
              <Label htmlFor="layer">Camada</Label>
              <Input
                id="layer"
                value={data.layer}
                onChange={(e) => updateData("layer", e.target.value)}
                placeholder="Identificação da camada"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 text-blue-600" size={20} />
            Dispositivos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="balanceId">Identificação da Balança</Label>
              <Input
                id="balanceId"
                value={data.balanceId}
                onChange={(e) => updateData("balanceId", e.target.value)}
                placeholder="Ex: BAL-001"
              />
            </div>
            <div>
              <Label htmlFor="ovenId">Identificação da Estufa</Label>
              <Input
                id="ovenId"
                value={data.ovenId}
                onChange={(e) => updateData("ovenId", e.target.value)}
                placeholder="Ex: EST-001"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* References */}
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
                  <SelectItem value="DR-001">DR-001 - Material A (2.67 g/cm³)</SelectItem>
                  <SelectItem value="DR-002">DR-002 - Material B (2.65 g/cm³)</SelectItem>
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
                  <SelectItem value="DM-001">DM-001 - Material A (1.85/1.45 g/cm³)</SelectItem>
                  <SelectItem value="DM-002">DM-002 - Material B (1.92/1.52 g/cm³)</SelectItem>
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
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-left">Campo</TableHead>
                <TableHead className="text-center">Det 1</TableHead>
                <TableHead className="text-center">Det 2</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Número do Cilindro</TableCell>
                <TableCell>
                  <Input
                    value={data.det1.cylinderNumber}
                    onChange={(e) => updateNestedData("det1", "cylinderNumber", e.target.value)}
                    placeholder="CIL-01"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={data.det2.cylinderNumber}
                    onChange={(e) => updateNestedData("det2", "cylinderNumber", e.target.value)}
                    placeholder="CIL-02"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Molde + Solo (g)</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.det1.moldeSolo || ""}
                    onChange={(e) => updateNestedData("det1", "moldeSolo", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.det2.moldeSolo || ""}
                    onChange={(e) => updateNestedData("det2", "moldeSolo", parseFloat(e.target.value) || 0)}
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
                    value={data.det1.molde || ""}
                    onChange={(e) => updateNestedData("det1", "molde", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.det2.molde || ""}
                    onChange={(e) => updateNestedData("det2", "molde", parseFloat(e.target.value) || 0)}
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
                    value={data.det1.volume || ""}
                    onChange={(e) => updateNestedData("det1", "volume", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.det2.volume || ""}
                    onChange={(e) => updateNestedData("det2", "volume", parseFloat(e.target.value) || 0)}
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
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Média γnat seco (g/cm³):</span>
              <span className="text-lg font-bold text-blue-600 font-mono">{calculations.gammaNatDryAvg.toFixed(3)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Moisture Content Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Moisture Top */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Droplet className="mr-2 text-blue-600" size={20} />
              Teor de Umidade - Topo (3 Det.)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-left">Det.</TableHead>
                  <TableHead className="text-center">1</TableHead>
                  <TableHead className="text-center">2</TableHead>
                  <TableHead className="text-center">3</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Cápsula Nº</TableCell>
                  <TableCell><Input value={data.moistureTop1.capsule} onChange={(e) => updateNestedData("moistureTop1", "capsule", e.target.value)} placeholder="C-01" className="text-xs" /></TableCell>
                  <TableCell><Input value={data.moistureTop2.capsule} onChange={(e) => updateNestedData("moistureTop2", "capsule", e.target.value)} placeholder="C-02" className="text-xs" /></TableCell>
                  <TableCell><Input value={data.moistureTop3.capsule} onChange={(e) => updateNestedData("moistureTop3", "capsule", e.target.value)} placeholder="C-03" className="text-xs" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Solo Úmido+Tara</TableCell>
                  <TableCell><Input type="number" step="0.01" value={data.moistureTop1.wetTare || ""} onChange={(e) => updateNestedData("moistureTop1", "wetTare", parseFloat(e.target.value) || 0)} className="text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={data.moistureTop2.wetTare || ""} onChange={(e) => updateNestedData("moistureTop2", "wetTare", parseFloat(e.target.value) || 0)} className="text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={data.moistureTop3.wetTare || ""} onChange={(e) => updateNestedData("moistureTop3", "wetTare", parseFloat(e.target.value) || 0)} className="text-xs" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Solo Seco+Tara</TableCell>
                  <TableCell><Input type="number" step="0.01" value={data.moistureTop1.dryTare || ""} onChange={(e) => updateNestedData("moistureTop1", "dryTare", parseFloat(e.target.value) || 0)} className="text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={data.moistureTop2.dryTare || ""} onChange={(e) => updateNestedData("moistureTop2", "dryTare", parseFloat(e.target.value) || 0)} className="text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={data.moistureTop3.dryTare || ""} onChange={(e) => updateNestedData("moistureTop3", "dryTare", parseFloat(e.target.value) || 0)} className="text-xs" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tara</TableCell>
                  <TableCell><Input type="number" step="0.01" value={data.moistureTop1.tare || ""} onChange={(e) => updateNestedData("moistureTop1", "tare", parseFloat(e.target.value) || 0)} className="text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={data.moistureTop2.tare || ""} onChange={(e) => updateNestedData("moistureTop2", "tare", parseFloat(e.target.value) || 0)} className="text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={data.moistureTop3.tare || ""} onChange={(e) => updateNestedData("moistureTop3", "tare", parseFloat(e.target.value) || 0)} className="text-xs" /></TableCell>
                </TableRow>
                <TableRow className="bg-blue-50">
                  <TableCell className="font-medium">Solo Seco (g)</TableCell>
                  <TableCell><Input type="number" step="0.01" value={calculations.moistureTop.det1.dryWeight.toFixed(2)} readOnly className="bg-blue-50 border-blue-200 font-mono text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={calculations.moistureTop.det2.dryWeight.toFixed(2)} readOnly className="bg-blue-50 border-blue-200 font-mono text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={calculations.moistureTop.det3.dryWeight.toFixed(2)} readOnly className="bg-blue-50 border-blue-200 font-mono text-xs" /></TableCell>
                </TableRow>
                <TableRow className="bg-blue-50">
                  <TableCell className="font-medium">Água (g)</TableCell>
                  <TableCell><Input type="number" step="0.01" value={calculations.moistureTop.det1.water.toFixed(2)} readOnly className="bg-blue-50 border-blue-200 font-mono text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={calculations.moistureTop.det2.water.toFixed(2)} readOnly className="bg-blue-50 border-blue-200 font-mono text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={calculations.moistureTop.det3.water.toFixed(2)} readOnly className="bg-blue-50 border-blue-200 font-mono text-xs" /></TableCell>
                </TableRow>
                <TableRow className="bg-blue-50">
                  <TableCell className="font-medium">Umidade (%)</TableCell>
                  <TableCell><Input type="number" step="0.01" value={calculations.moistureTop.det1.moisture.toFixed(2)} readOnly className="bg-blue-50 border-blue-200 font-mono text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={calculations.moistureTop.det2.moisture.toFixed(2)} readOnly className="bg-blue-50 border-blue-200 font-mono text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={calculations.moistureTop.det3.moisture.toFixed(2)} readOnly className="bg-blue-50 border-blue-200 font-mono text-xs" /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Umidade Média Topo (%):</span>
                <span className="text-base font-bold text-blue-600 font-mono">{calculations.moistureTop.average.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Moisture Base */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Droplet className="mr-2 text-blue-600" size={20} />
              Teor de Umidade - Base (3 Det.)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-left">Det.</TableHead>
                  <TableHead className="text-center">1</TableHead>
                  <TableHead className="text-center">2</TableHead>
                  <TableHead className="text-center">3</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Cápsula Nº</TableCell>
                  <TableCell><Input value={data.moistureBase1.capsule} onChange={(e) => updateNestedData("moistureBase1", "capsule", e.target.value)} placeholder="C-04" className="text-xs" /></TableCell>
                  <TableCell><Input value={data.moistureBase2.capsule} onChange={(e) => updateNestedData("moistureBase2", "capsule", e.target.value)} placeholder="C-05" className="text-xs" /></TableCell>
                  <TableCell><Input value={data.moistureBase3.capsule} onChange={(e) => updateNestedData("moistureBase3", "capsule", e.target.value)} placeholder="C-06" className="text-xs" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Solo Úmido+Tara</TableCell>
                  <TableCell><Input type="number" step="0.01" value={data.moistureBase1.wetTare || ""} onChange={(e) => updateNestedData("moistureBase1", "wetTare", parseFloat(e.target.value) || 0)} className="text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={data.moistureBase2.wetTare || ""} onChange={(e) => updateNestedData("moistureBase2", "wetTare", parseFloat(e.target.value) || 0)} className="text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={data.moistureBase3.wetTare || ""} onChange={(e) => updateNestedData("moistureBase3", "wetTare", parseFloat(e.target.value) || 0)} className="text-xs" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Solo Seco+Tara</TableCell>
                  <TableCell><Input type="number" step="0.01" value={data.moistureBase1.dryTare || ""} onChange={(e) => updateNestedData("moistureBase1", "dryTare", parseFloat(e.target.value) || 0)} className="text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={data.moistureBase2.dryTare || ""} onChange={(e) => updateNestedData("moistureBase2", "dryTare", parseFloat(e.target.value) || 0)} className="text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={data.moistureBase3.dryTare || ""} onChange={(e) => updateNestedData("moistureBase3", "dryTare", parseFloat(e.target.value) || 0)} className="text-xs" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tara</TableCell>
                  <TableCell><Input type="number" step="0.01" value={data.moistureBase1.tare || ""} onChange={(e) => updateNestedData("moistureBase1", "tare", parseFloat(e.target.value) || 0)} className="text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={data.moistureBase2.tare || ""} onChange={(e) => updateNestedData("moistureBase2", "tare", parseFloat(e.target.value) || 0)} className="text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={data.moistureBase3.tare || ""} onChange={(e) => updateNestedData("moistureBase3", "tare", parseFloat(e.target.value) || 0)} className="text-xs" /></TableCell>
                </TableRow>
                <TableRow className="bg-blue-50">
                  <TableCell className="font-medium">Solo Seco (g)</TableCell>
                  <TableCell><Input type="number" step="0.01" value={calculations.moistureBase.det1.dryWeight.toFixed(2)} readOnly className="bg-blue-50 border-blue-200 font-mono text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={calculations.moistureBase.det2.dryWeight.toFixed(2)} readOnly className="bg-blue-50 border-blue-200 font-mono text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={calculations.moistureBase.det3.dryWeight.toFixed(2)} readOnly className="bg-blue-50 border-blue-200 font-mono text-xs" /></TableCell>
                </TableRow>
                <TableRow className="bg-blue-50">
                  <TableCell className="font-medium">Água (g)</TableCell>
                  <TableCell><Input type="number" step="0.01" value={calculations.moistureBase.det1.water.toFixed(2)} readOnly className="bg-blue-50 border-blue-200 font-mono text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={calculations.moistureBase.det2.water.toFixed(2)} readOnly className="bg-blue-50 border-blue-200 font-mono text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={calculations.moistureBase.det3.water.toFixed(2)} readOnly className="bg-blue-50 border-blue-200 font-mono text-xs" /></TableCell>
                </TableRow>
                <TableRow className="bg-blue-50">
                  <TableCell className="font-medium">Umidade (%)</TableCell>
                  <TableCell><Input type="number" step="0.01" value={calculations.moistureBase.det1.moisture.toFixed(2)} readOnly className="bg-blue-50 border-blue-200 font-mono text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={calculations.moistureBase.det2.moisture.toFixed(2)} readOnly className="bg-blue-50 border-blue-200 font-mono text-xs" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={calculations.moistureBase.det3.moisture.toFixed(2)} readOnly className="bg-blue-50 border-blue-200 font-mono text-xs" /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Umidade Média Base (%):</span>
                <span className="text-base font-bold text-blue-600 font-mono">{calculations.moistureBase.average.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="mr-2 text-blue-600" size={20} />
            Resultados Finais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">γd Topo (g/cm³)</div>
              <div className="text-xl font-bold text-gray-900 font-mono">{calculations.results.gammaDTop.toFixed(3)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">γd Base (g/cm³)</div>
              <div className="text-xl font-bold text-gray-900 font-mono">{calculations.results.gammaDBase.toFixed(3)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Índice de Vazios (e)</div>
              <div className="text-xl font-bold text-gray-900 font-mono">{calculations.results.voidIndex.toFixed(3)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Compacidade Relativa (%)</div>
              <div className="text-xl font-bold text-gray-900 font-mono">{calculations.results.relativeCompactness.toFixed(1)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={handleSave}
              disabled={saveTestMutation.isPending}
              className="flex-1 min-w-[200px] bg-blue-600 hover:bg-blue-700"
            >
              <Save className="mr-2" size={16} />
              {saveTestMutation.isPending ? "Salvando..." : "Salvar Ensaio"}
            </Button>
            <Button 
              onClick={handleGeneratePDF}
              className="flex-1 min-w-[200px] bg-green-600 hover:bg-green-700"
            >
              <FileText className="mr-2" size={16} />
              Gerar PDF
            </Button>
            <Button 
              onClick={handleClear}
              variant="outline"
              className="flex-1 min-w-[200px]"
            >
              <RotateCcw className="mr-2" size={16} />
              Limpar Dados
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
