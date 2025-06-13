import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Target, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { Link } from 'wouter';

export default function Dashboard() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      const response = await fetch('/api/tests/density-in-situ/temp');
      const data = await response.json();
      setTests(data || []);
    } catch (error) {
      console.error('Error:', error);
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteTest = async (id) => {
    if (!confirm('Excluir este ensaio?')) return;
    
    try {
      await fetch(`/api/tests/density-in-situ/${id}`, { method: 'DELETE' });
      loadTests();
    } catch (error) {
      alert('Erro ao excluir ensaio');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-8">Carregando dados...</p>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Visão geral das atividades do laboratório</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total de Ensaios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tests.filter(t => t.results && t.results.status === 'APROVADO').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Aguardando</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {tests.filter(t => !t.results || !t.results.status || t.results.status === 'AGUARDANDO').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Ação Rápida</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/solos/densidade-in-situ">
                <Plus className="w-4 h-4 mr-2" />
                Novo Ensaio
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Ensaios Salvos ({tests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tests.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Nenhum ensaio encontrado</p>
              <Button asChild>
                <Link href="/solos/densidade-in-situ">Criar Primeiro Ensaio</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tests.map((test) => (
                <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Densidade In Situ</span>
                      <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                        {(test.results && test.results.status) || 'AGUARDANDO'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Registro: {test.registrationNumber} | Operador: {test.operator}
                    </p>
                    <p className="text-xs text-gray-500">
                      Data: {test.date} | Material: {test.material}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/solos/densidade-in-situ?view=${test.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/solos/densidade-in-situ?edit=${test.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteTest(test.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}