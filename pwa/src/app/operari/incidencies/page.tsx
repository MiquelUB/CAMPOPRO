'use client';

import React, { useState } from 'react';
import { Tractor, Wrench, Droplet, Bug, Zap, HelpCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import AudioRecorder from '@/components/AudioRecorder';

const INCIDENT_CATEGORIES = [
  { id: 'maquinaria', name: 'Maquinària', icon: Tractor, color: 'bg-orange-100 text-orange-600' },
  { id: 'eines', name: 'Eines', icon: Wrench, color: 'bg-blue-100 text-blue-600' },
  { id: 'reg', name: 'Aigua / Reg', icon: Droplet, color: 'bg-cyan-100 text-cyan-600' },
  { id: 'cultiu', name: 'Plagues', icon: Bug, color: 'bg-green-100 text-green-600' },
  { id: 'electricitat', name: 'Electricitat', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'altres', name: 'Altres', icon: HelpCircle, color: 'bg-gray-100 text-gray-600' },
];

export default function IncidenciesOperariPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 shadow-sm flex items-center sticky top-0 z-10">
        <Link href="/feines" className="p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="ml-2 text-xl font-bold text-gray-800">Reportar Incidència</h1>
      </header>

      <main className="p-4 max-w-md mx-auto">
        {!selectedCategory ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Què ha passat?</h2>
              <p className="text-gray-500 mt-2">Selecciona la categoria del problema perquè puguem ajudar-te més ràpid.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {INCIDENT_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100 active:scale-95 transition-transform"
                  >
                    <div className={`p-5 rounded-full mb-4 ${cat.color}`}>
                      <Icon className="w-10 h-10" />
                    </div>
                    <span className="font-semibold text-gray-800">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="p-1 -ml-1 text-gray-400 hover:text-gray-600 rounded-full bg-gray-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                Gravar Detalls
              </h2>
            </div>
            
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-6 flex items-center gap-4">
              {(() => {
                const cat = INCIDENT_CATEGORIES.find(c => c.id === selectedCategory);
                if (!cat) return null;
                const Icon = cat.icon;
                return (
                  <>
                    <div className={`p-3 rounded-2xl ${cat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Categoria seleccionada</p>
                      <p className="font-semibold text-gray-900">{cat.name}</p>
                    </div>
                  </>
                );
              })}
            </div>

            <AudioRecorder />
          </div>
        )}
      </main>
    </div>
  );
}
