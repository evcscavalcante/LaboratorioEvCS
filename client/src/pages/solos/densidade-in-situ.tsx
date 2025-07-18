import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import DensityInSitu from '@/components/laboratory/density-in-situ';

export default function DensidadeInSituPage() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Detectar parâmetro load na URL para carregamento automático
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const loadId = urlParams.get('load');
    
    if (loadId) {
      // Disparar evento personalizado para a calculadora carregar o ensaio
      const event = new CustomEvent('loadTest', { 
        detail: { testId: parseInt(loadId), testType: 'density-in-situ' } 
      });
      window.dispatchEvent(event);
    }
  }, [location]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Densidade In Situ - Método Cilindro de Cravação</h1>
        <p className="text-gray-600">ABNT NBR 6457 - Determinação da densidade in situ pelo método do cilindro de cravação</p>
      </div>
      <DensityInSitu />
    </div>
  );
}