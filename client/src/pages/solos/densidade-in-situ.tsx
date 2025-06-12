import React from 'react';
import DensityInSitu from '@/components/laboratory/density-in-situ';

export default function DensidadeInSituPage() {
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