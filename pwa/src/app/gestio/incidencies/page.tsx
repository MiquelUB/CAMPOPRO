'use client';

import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, Play, Pause, FileText, CheckCircle2, Clock, XCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Mock data for the dashboard
const MOCK_INCIDENTS: any[] = [];

export default function GestioIncidenciesPage() {
  const [selectedIncident, setSelectedIncident] = useState<typeof MOCK_INCIDENTS[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fake audio toggle
  const toggleAudio = () => setIsPlaying(!isPlaying);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendent': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'processat': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'resolt': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (prio: string) => {
    switch (prio) {
      case 'Alta': return 'text-red-600 bg-red-50';
      case 'Mitjana': return 'text-orange-600 bg-orange-50';
      case 'Baixa': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-gray-50">
      
      {/* Sidebar Llista Incidències */}
      <div className={`w-full md:w-1/3 border-r bg-white flex flex-col ${selectedIncident ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Incidències IA</h1>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cercar incidència..." 
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {MOCK_INCIDENTS.map((inc) => (
            <div 
              key={inc.id}
              onClick={() => setSelectedIncident(inc)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selectedIncident?.id === inc.id ? 'bg-primary-50/50 border-l-4 border-l-primary-500' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-gray-900">{inc.id}</span>
                <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(inc.estat)}`}>
                  {inc.estat.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">{inc.categoria} • {inc.operari}</div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center text-gray-400"><Clock className="w-3 h-3 mr-1" /> {inc.data}</span>
                <span className={`px-2 py-0.5 rounded ${getPriorityColor(inc.prioritat)} font-medium`}>{inc.prioritat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Detall de la incidència */}
      <div className={`flex-1 flex flex-col ${!selectedIncident ? 'hidden md:flex' : 'flex'} bg-gray-50`}>
        {selectedIncident ? (
          <>
            {/* Header del detall */}
            <div className="bg-white border-b p-6">
              <button 
                onClick={() => setSelectedIncident(null)}
                className="md:hidden flex items-center text-gray-500 hover:text-gray-900 mb-4 text-sm font-medium"
              >
                <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Torna a la llista
              </button>
              
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedIncident.id}</h2>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(selectedIncident.estat)}`}>
                      {selectedIncident.estat.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-500 flex items-center gap-2">
                    Reportat per <span className="font-medium text-gray-700">{selectedIncident.operari}</span> • {selectedIncident.data}
                  </p>
                </div>
                
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm transition">
                  Convertir a Feina (F-XXXX)
                </button>
              </div>
            </div>

            {/* Contingut principal scrolleable */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Columna Esquerra: Àudio original */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white rounded-xl border shadow-sm p-5">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MicIcon className="w-5 h-5 text-gray-400" /> Àudio Original
                    </h3>
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border">
                      <button 
                        onClick={toggleAudio}
                        className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center hover:bg-primary-200 transition"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                      </button>
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full bg-primary-500 ${isPlaying ? 'w-1/3' : 'w-0'} transition-all duration-1000`}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>0:00</span>
                          <span>0:24</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl border shadow-sm p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">Informació Metadata</h3>
                    <ul className="text-sm space-y-3 text-gray-600">
                      <li className="flex justify-between"><span>Categoria:</span> <span className="font-medium text-gray-900">{selectedIncident.categoria}</span></li>
                      <li className="flex justify-between"><span>Prioritat IA:</span> <span className={`font-medium ${getPriorityColor(selectedIncident.prioritat)}`}>{selectedIncident.prioritat}</span></li>
                      <li className="flex justify-between"><span>Model de veu:</span> <span>Whisper v3 (Català)</span></li>
                    </ul>
                  </div>
                </div>

                {/* Columna Dreta: El Memòndum (IA) */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-xl border-2 border-indigo-100 shadow-sm overflow-hidden">
                    <div className="bg-indigo-50/50 border-b border-indigo-100 p-4 flex items-center justify-between">
                      <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" /> El Memòndum IA
                      </h3>
                      <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Generat automàticament</span>
                    </div>
                    
                    <div className="p-5 space-y-5">
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Transcripció / Resum</h4>
                        <p className="text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                          {selectedIncident.memondum.resum}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Decisió de la IA</h4>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`w-5 h-5 ${selectedIncident.prioritat === 'Alta' ? 'text-red-500' : selectedIncident.prioritat === 'Mitjana' ? 'text-orange-500' : 'text-green-500'}`} />
                          <span className={`font-bold text-lg ${selectedIncident.prioritat === 'Alta' ? 'text-red-700' : selectedIncident.prioritat === 'Mitjana' ? 'text-orange-700' : 'text-green-700'}`}>
                            {selectedIncident.memondum.decisio}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pla d'Acció Suggerit</h4>
                        <p className="text-gray-800 leading-relaxed">
                          {selectedIncident.memondum.accio}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Materials Identificats</h4>
                          <ul className="list-disc pl-4 text-sm text-gray-700 space-y-1">
                            {selectedIncident.memondum.materials_necessaris.map((mat, i) => (
                              <li key={i}>{mat}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Estimació Cost</h4>
                          <span className="inline-block px-3 py-1 bg-gray-100 rounded text-sm font-semibold text-gray-800">
                            {selectedIncident.memondum.cost_estimat}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <FileText className="w-16 h-16 mb-4 text-gray-200" />
            <h2 className="text-xl font-medium text-gray-600 mb-2">Cap incidència seleccionada</h2>
            <p className="max-w-sm">Selecciona una incidència de la llista per veure'n els detalls, escoltar l'àudio i llegir el Memòndum de la IA.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Inline Mic icon since it wasn't imported from lucide-react in GestioIncidenciesPage
function MicIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}
