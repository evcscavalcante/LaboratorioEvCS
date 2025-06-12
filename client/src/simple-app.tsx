import React from 'react';
import { Switch, Route } from "wouter";

// Componente principal simplificado
function SimpleLaboratory() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            Laboratório Ev.C.S
          </h1>
          <p className="text-blue-700">Sistema Geotécnico de Densidade dos Solos</p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Densidade In-Situ
            </h2>
            <p className="text-gray-600 mb-4">
              Ensaio de densidade do solo no campo usando método do cone de areia
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
              Iniciar Ensaio
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Densidade Real
            </h2>
            <p className="text-gray-600 mb-4">
              Determinação da densidade real dos grãos sólidos do solo
            </p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
              Iniciar Ensaio
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Densidade Máx/Mín
            </h2>
            <p className="text-gray-600 mb-4">
              Ensaio de densidade máxima e mínima do solo
            </p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors">
              Iniciar Ensaio
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Gestão de Equipamentos
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded">
              <h3 className="font-medium text-gray-800">Balanças</h3>
              <p className="text-sm text-gray-600">3 equipamentos ativos</p>
            </div>
            <div className="p-4 border border-gray-200 rounded">
              <h3 className="font-medium text-gray-800">Cone de Areia</h3>
              <p className="text-sm text-gray-600">2 equipamentos ativos</p>
            </div>
          </div>
        </div>

        <footer className="text-center mt-8 text-gray-600">
          <p>© 2025 Laboratório Ev.C.S - Sistema Geotécnico</p>
        </footer>
      </div>
    </div>
  );
}

export default function SimpleApp() {
  return (
    <Switch>
      <Route path="/" component={SimpleLaboratory} />
      <Route component={() => <SimpleLaboratory />} />
    </Switch>
  );
}