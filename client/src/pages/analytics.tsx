import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FlaskRound } from 'lucide-react';
import PerformanceDashboard from '@/components/analytics/performance-dashboard';

export default function Analytics() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 mr-4">
                  <ArrowLeft size={16} />
                  Voltar ao Laboratório
                </Button>
              </Link>
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">
                  <FlaskRound className="inline mr-2 text-blue-600" size={20} />
                  Laboratório Ev.C.S - Analytics
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PerformanceDashboard />
      </div>
    </div>
  );
}