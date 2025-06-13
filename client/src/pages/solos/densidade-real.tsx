import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import DensityReal from '@/components/laboratory/density-real';

export default function DensidadeRealPage() {
  const [location] = useLocation();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const loadId = urlParams.get('load');
    
    if (loadId) {
      const event = new CustomEvent('loadTest', { 
        detail: { testId: parseInt(loadId), testType: 'real-density' } 
      });
      window.dispatchEvent(event);
    }
  }, [location]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ensaio de Densidade Real dos Grãos</h1>
        <p className="text-gray-600">ABNT NBR 6508 - Determinação da densidade real dos grãos pelo picnômetro</p>
      </div>
      <DensityReal />
    </div>
  );
}