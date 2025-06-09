import { useState, useEffect } from "react";
import { Info, ArrowUp, ArrowDown, BarChart, Save, FileText, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusIndicator from "./status-indicator";
import { generateMaxMinDensityPDF } from "@/lib/pdf-generator";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface MaxMinDensityData {
  registrationNumber: string;
  date: string;
  operator: string;
  material: string;
  origin: string;
  
  // Maximum density determinations
  maxDensity1: { moldeSolo: number; molde: number; volume: number; moisture?: number; };
  maxDensity2: { moldeSolo: number; molde: number; volume: number; moisture?: number; };
  maxDensity3: { moldeSolo: number; molde: number; volume: number; moisture?: number; };
  
  // Minimum density determinations
  minDensity1: { moldeSolo: number; molde: number; volume: number; moisture?: number; };
  minDensity2: { moldeSolo: number; molde: number; volume: number; moisture?: number; };
  minDensity3: { moldeSolo: number; molde: number; volume: number; moisture?: number; };
}

export default function DensityMaxMin() {
  const { toast } = useToast();
  const [data, setData] = useState<MaxMinDensityData>({
    registrationNumber: "",
    date: new Date().toISOString().split('T')[0],
    operator: "",
    material: "",
    origin: "",
    maxDensity1: { moldeSolo: 0, molde: 0, volume: 0, moisture: 0 },
    maxDensity2: { moldeSolo: 0, molde: 0, volume: 0, moisture: 0 },
    maxDensity3: { moldeSolo: 0, molde: 0, volume: 0, moisture: 0 },
    minDensity1: { moldeSolo: 0, molde: 0, volume: 0, moisture: 0 },
    minDensity2: { moldeSolo: 0, molde: 0, volume: 0, moisture: 0 },
    minDensity3: { moldeSolo: 0, molde: 0, volume: 0, moisture: 0 },
  });

  const [calculations, setCalculations] = useState({
    maxDensity: {
      det1: { soil: 0, gammaDMax: 0 },
      det2: { soil: 0, gammaDMax: 0 },
      det3: { soil: 0, gammaDMax: 0 },
      average: 0
    },
    minDensity: {
      det1: { soil: 0, gammaDMin: 0 },
      det2: { soil: 0, gammaDMin: 0 },
      det3: { soil: 0, gammaDMin: 0 },
      average: 0
    },
    results: {
      gammaDMax: 0,
      gammaDMin: 0,
      emax: 0,
      emin: 0,
      status: "AGUARDANDO" as const
    }
  });

  const saveTestMutation = useMutation({
    mutationFn: async (testData: any) => {
      return apiRequest("POST", "/api/max-min-density", testData);
    },
    onSuccess: () => {
      toast({ title: "Ensaio salvo com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/max-min-density"] });
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
    // Calculate maximum density determinations
    const maxDet1Soil = data.maxDensity1.moldeSolo - data.maxDensity1.molde;
    const maxDet2Soil = data.maxDensity2.moldeSolo - data.maxDensity2.molde;
    const maxDet3Soil = data.maxDensity3.moldeSolo - data.maxDensity3.molde;

    const maxDet1GammaD = data.maxDensity1.volume > 0 ? maxDet1Soil / data.maxDensity1.volume : 0;
    const maxDet2GammaD = data.maxDensity2.volume > 0 ? maxDet2Soil / data.maxDensity2.volume : 0;
    const maxDet3GammaD = data.maxDensity3.volume > 0 ? maxDet3Soil / data.maxDensity3.volume : 0;

    const maxDensities = [maxDet1GammaD, maxDet2GammaD, maxDet3GammaD].filter(d => d > 0);
    const maxAverage = maxDensities.length > 0 ? maxDensities.reduce((a, b) => a + b, 0) / maxDensities.length : 0;

    // Calculate minimum density determinations
    const minDet1Soil = data.minDensity1.moldeSolo - data.minDensity1.molde;
    const minDet2Soil = data.minDensity2.moldeSolo - data.minDensity2.molde;
    const minDet3Soil = data.minDensity3.moldeSolo - data.minDensity3.molde;

    const minDet1GammaD = data.minDensity1.volume > 0 ? minDet1Soil / data.minDensity1.volume : 0;
    const minDet2GammaD = data.minDensity2.volume > 0 ? minDet2Soil / data.minDensity2.volume : 0;
    const minDet3GammaD = data.minDensity3.volume > 0 ? minDet3Soil / data.minDensity3.volume : 0;

    const minDensities = [minDet1GammaD, minDet2GammaD, minDet3GammaD].filter(d => d > 0);
    const minAverage = minDensities.length > 0 ? minDensities.reduce((a, b) => a + b, 0) / minDensities.length : 0;

    // Calculate void indices (assuming γs = 2.67 g/cm³ for typical soil)
    const gammaS = 2.67;
    const emin = maxAverage > 0 ? (gammaS / maxAverage) - 1 : 0;
    const emax = minAverage > 0 ? (gammaS / minAverage) - 1 : 0;

    // Determine status based on consistency
    const isConsistent = (maxAverage - minAverage) > 0.1 && maxAverage > 0 && minAverage > 0;
    const status = isConsistent ? "APROVADO" : 
                   maxAverage === 0 && minAverage === 0 ? "AGUARDANDO" : "REPROVADO";

    setCalculations({
      maxDensity: {
        det1: { soil: maxDet1Soil, gammaDMax: maxDet1GammaD },
        det2: { soil: maxDet2Soil, gammaDMax: maxDet2GammaD },
        det3: { soil: maxDet3Soil, gammaDMax: maxDet3GammaD },
        average: maxAverage
      },
      minDensity: {
        det1: { soil: minDet1Soil, gammaDMin: minDet1GammaD },
        det2: { soil: minDet2Soil, gammaDMin: minDet2GammaD },
        det3: { soil: minDet3Soil, gammaDMin: minDet3GammaD },
        average: minAverage
      },
      results: {
        gammaDMax: maxAverage,
        gammaDMin: minAverage,
        emax,
        emin,
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
      [parent]: { ...prev[parent as keyof MaxMinDensityData], [field]: value }
    }));
  };

  const handleSave = () => {
    const testData = {
      registrationNumber: data.registrationNumber,
      date: data.date,
      operator: data.operator,
      material: data.material,
      origin: data.origin,
      maxDensity: {
        det1: data.maxDensity1,
        det2: data.maxDensity2,
        det3: data.maxDensity3
      },
      minDensity: {
        det1: data.minDensity1,
        det2: data.minDensity2,
        det3: data.minDensity3
      },
      results: calculations.results
    };

    saveTestMutation.mutate(testData);
  };

  const handleGeneratePDF = () => {
    generateMaxMinDensityPDF(data, calculations);
  };

  const handleClear = () => {
    setData({
      registrationNumber: "",
      date: new Date().toISOString().split('T')[0],
      operator: "",
      material: "",
      origin: "",
      maxDensity1: { moldeSolo: 0, molde: 0, volume: 0, moisture: 0 },
      maxDensity2: { moldeSolo: 0, molde: 0, volume: 0, moisture: 0 },
      maxDensity3: { moldeSolo: 0, molde: 0, volume: 0, moisture: 0 },
      minDensity1: { moldeSolo: 0, molde: 0, volume: 0, moisture: 0 },
      minDensity2: { moldeSolo: 0, molde: 0, volume: 0, moisture: 0 },
      minDensity3: { moldeSolo: 0, molde: 0, volume: 0, moisture: 0 },
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Densidade Máxima e Mínima</h2>
        <p className="text-gray-600">Determinação dos índices de vazios máximo e mínimo</p>
      </div>

      {/* Status */}
      <StatusIndicator status={calculations.results.status} description="Avaliação da consistência das determinações" />

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
                placeholder="Ex: DM-001/2024"
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
              <Label htmlFor="operator">Operador</Label>
              <Input
                id="operator"
                value={data.operator}
                onChange={(e) => updateData("operator", e.target.value)}
                placeholder="Nome do operador"
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
          </div>
        </CardContent>
      </Card>

      {/* Maximum Density */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ArrowUp className="mr-2 text-blue-600" size={20} />
            Densidade Máxima (3 Determinações)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-left">Campo</TableHead>
                <TableHead className="text-center">Det 1</TableHead>
                <TableHead className="text-center">Det 2</TableHead>
                <TableHead className="text-center">Det 3</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Molde + Solo (g)</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.maxDensity1.moldeSolo || ""}
                    onChange={(e) => updateNestedData("maxDensity1", "moldeSolo", parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.maxDensity2.moldeSolo || ""}
                    onChange={(e) => updateNestedData("maxDensity2", "moldeSolo", parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.maxDensity3.moldeSolo || ""}
                    onChange={(e) => updateNestedData("maxDensity3", "moldeSolo", parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Molde (g)</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.maxDensity1.molde || ""}
                    onChange={(e) => updateNestedData("maxDensity1", "molde", parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.maxDensity2.molde || ""}
                    onChange={(e) => updateNestedData("maxDensity2", "molde", parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.maxDensity3.molde || ""}
                    onChange={(e) => updateNestedData("maxDensity3", "molde", parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </TableCell>
              </TableRow>
              <TableRow className="bg-blue-50">
                <TableCell className="font-medium">Solo (g) <span className="text-xs text-blue-600">📊</span></TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={calculations.maxDensity.det1.soil.toFixed(2)}
                    readOnly
                    className="bg-blue-50 border-blue-200 font-mono text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={calculations.maxDensity.det2.soil.toFixed(2)}
                    readOnly
                    className="bg-blue-50 border-blue-200 font-mono text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={calculations.maxDensity.det3.soil.toFixed(2)}
                    readOnly
                    className="bg-blue-50 border-blue-200 font-mono text-sm"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Volume (cm³)</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.maxDensity1.volume || ""}
                    onChange={(e) => updateNestedData("maxDensity1", "volume", parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.maxDensity2.volume || ""}
                    onChange={(e) => updateNestedData("maxDensity2", "volume", parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.maxDensity3.volume || ""}
                    onChange={(e) => updateNestedData("maxDensity3", "volume", parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </TableCell>
              </TableRow>
              <TableRow className="bg-blue-50">
                <TableCell className="font-medium">γd (g/cm³) <span className="text-xs text-blue-600">📊</span></TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.001"
                    value={calculations.maxDensity.det1.gammaDMax.toFixed(3)}
                    readOnly
                    className="bg-blue-50 border-blue-200 font-mono text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.001"
                    value={calculations.maxDensity.det2.gammaDMax.toFixed(3)}
                    readOnly
                    className="bg-blue-50 border-blue-200 font-mono text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.001"
                    value={calculations.maxDensity.det3.gammaDMax.toFixed(3)}
                    readOnly
                    className="bg-blue-50 border-blue-200 font-mono text-sm"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Umidade (%)</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.maxDensity1.moisture || ""}
                    onChange={(e) => updateNestedData("maxDensity1", "moisture", parseFloat(e.target.value) || 0)}
                    placeholder="Opcional"
                    className="text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.maxDensity2.moisture || ""}
                    onChange={(e) => updateNestedData("maxDensity2", "moisture", parseFloat(e.target.value) || 0)}
                    placeholder="Opcional"
                    className="text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.maxDensity3.moisture || ""}
                    onChange={(e) => updateNestedData("maxDensity3", "moisture", parseFloat(e.target.value) || 0)}
                    placeholder="Opcional"
                    className="text-sm"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">γdmax (g/cm³):</span>
              <span className="text-lg font-bold text-blue-600 font-mono">{calculations.maxDensity.average.toFixed(3)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Minimum Density */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ArrowDown className="mr-2 text-blue-600" size={20} />
            Densidade Mínima (3 Determinações)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-left">Campo</TableHead>
                <TableHead className="text-center">Det 1</TableHead>
                <TableHead className="text-center">Det 2</TableHead>
                <TableHead className="text-center">Det 3</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Molde + Solo (g)</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.minDensity1.moldeSolo || ""}
                    onChange={(e) => updateNestedData("minDensity1", "moldeSolo", parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.minDensity2.moldeSolo || ""}
                    onChange={(e) => updateNestedData("minDensity2", "moldeSolo", parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.minDensity3.moldeSolo || ""}
                    onChange={(e) => updateNestedData("minDensity3", "moldeSolo", parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Molde (g)</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.minDensity1.molde || ""}
                    onChange={(e) => updateNestedData("minDensity1", "molde", parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.minDensity2.molde || ""}
                    onChange={(e) => updateNestedData("minDensity2", "molde", parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.minDensity3.molde || ""}
                    onChange={(e) => updateNestedData("minDensity3", "molde", parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </TableCell>
              </TableRow>
              <TableRow className="bg-blue-50">
                <TableCell className="font-medium">Solo (g) <span className="text-xs text-blue-600">📊</span></TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={calculations.minDensity.det1.soil.toFixed(2)}
                    readOnly
                    className="bg-blue-50 border-blue-200 font-mono text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={calculations.minDensity.det2.soil.toFixed(2)}
                    readOnly
                    className="bg-blue-50 border-blue-200 font-mono text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={calculations.minDensity.det3.soil.toFixed(2)}
                    readOnly
                    className="bg-blue-50 border-blue-200 font-mono text-sm"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Volume (cm³)</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.minDensity1.volume || ""}
                    onChange={(e) => updateNestedData("minDensity1", "volume", parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.minDensity2.volume || ""}
                    onChange={(e) => updateNestedData("minDensity2", "volume", parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.minDensity3.volume || ""}
                    onChange={(e) => updateNestedData("minDensity3", "volume", parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </TableCell>
              </TableRow>
              <TableRow className="bg-blue-50">
                <TableCell className="font-medium">γd (g/cm³) <span className="text-xs text-blue-600">📊</span></TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.001"
                    value={calculations.minDensity.det1.gammaDMin.toFixed(3)}
                    readOnly
                    className="bg-blue-50 border-blue-200 font-mono text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.001"
                    value={calculations.minDensity.det2.gammaDMin.toFixed(3)}
                    readOnly
                    className="bg-blue-50 border-blue-200 font-mono text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.001"
                    value={calculations.minDensity.det3.gammaDMin.toFixed(3)}
                    readOnly
                    className="bg-blue-50 border-blue-200 font-mono text-sm"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Umidade (%)</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.minDensity1.moisture || ""}
                    onChange={(e) => updateNestedData("minDensity1", "moisture", parseFloat(e.target.value) || 0)}
                    placeholder="Opcional"
                    className="text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.minDensity2.moisture || ""}
                    onChange={(e) => updateNestedData("minDensity2", "moisture", parseFloat(e.target.value) || 0)}
                    placeholder="Opcional"
                    className="text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.minDensity3.moisture || ""}
                    onChange={(e) => updateNestedData("minDensity3", "moisture", parseFloat(e.target.value) || 0)}
                    placeholder="Opcional"
                    className="text-sm"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">γdmin (g/cm³):</span>
              <span className="text-lg font-bold text-blue-600 font-mono">{calculations.minDensity.average.toFixed(3)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <div className="text-sm text-gray-600 mb-1">γdmax (g/cm³)</div>
              <div className="text-xl font-bold text-gray-900 font-mono">{calculations.results.gammaDMax.toFixed(3)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">γdmin (g/cm³)</div>
              <div className="text-xl font-bold text-gray-900 font-mono">{calculations.results.gammaDMin.toFixed(3)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">emax</div>
              <div className="text-xl font-bold text-gray-900 font-mono">{calculations.results.emax.toFixed(3)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">emin</div>
              <div className="text-xl font-bold text-gray-900 font-mono">{calculations.results.emin.toFixed(3)}</div>
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
