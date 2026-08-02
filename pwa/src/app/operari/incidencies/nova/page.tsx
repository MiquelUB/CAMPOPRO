'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [selectedIncident, setSelectedIncident] = useState('material');
  const [severity, setSeverity] = useState('med');
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setSeconds(0);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button onClick={() => router.back()} className="w-touch-target-min h-touch-target-min flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <h1 className="font-headline-md text-headline-md text-primary">Report d'Incidència</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-pulse"></div>
            <img alt="Perfil" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtwAZlJ75l9Gw7pVmLavb2QKnvmYPQzuB7phJke9yAcUDJ0ztQ8WKH1aqTSsG9RjFbewqzbEh-lpqwTHesciQLh-qbsV4tYLsupEKFm7oOf0sL5pPPZZfit0r2O40scG79F3SCHYEILi2EYMC9D21dG8DnWYtR4tBbsR8N2U6Oy6eYrwYpqtfZnePxyU5FByZqiyvjMKkJtFc53nau3eo2EdKYZf_iDBhz7w5J3AxQQ7sEhi2PPI3N" />
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-16 pb-safe bg-surface min-h-screen">
        <div className="flex flex-col w-full pb-stack-lg p-margin-mobile">
          {/* Status & Context */}
          <div className="py-stack-md flex flex-col gap-1">
            <span className="font-label-bold text-label-bold text-outline uppercase tracking-wider">Feina #44920</span>
            <h2 className="font-headline-lg text-headline-lg text-primary">Què ha passat?</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Selecciona el tipus d'incidència i aporta detalls.</p>
          </div>

          {/* 3x2 Icon Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button 
              onClick={() => setSelectedIncident('material')}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                selectedIncident === 'material' ? 'bg-secondary-container/20 border-secondary-container shadow-md' : 'bg-surface-container-low border-transparent'
              }`}
            >
              <span className={`material-symbols-outlined text-[32px] mb-1 ${selectedIncident === 'material' ? 'text-secondary' : 'text-primary'}`}>inventory_2</span>
              <span className="font-button-text text-button-text text-on-surface text-center">Material insuficient</span>
            </button>

            <button 
              onClick={() => setSelectedIncident('client')}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                selectedIncident === 'client' ? 'bg-secondary-container/20 border-secondary-container shadow-md' : 'bg-surface-container-low border-transparent'
              }`}
            >
              <span className={`material-symbols-outlined text-[32px] mb-1 ${selectedIncident === 'client' ? 'text-secondary' : 'text-primary'}`}>person_off</span>
              <span className="font-button-text text-button-text text-on-surface text-center">Client absent</span>
            </button>

            <button 
              onClick={() => setSelectedIncident('avaria')}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                selectedIncident === 'avaria' ? 'bg-secondary-container/20 border-secondary-container shadow-md' : 'bg-surface-container-low border-transparent'
              }`}
            >
              <span className={`material-symbols-outlined text-[32px] mb-1 ${selectedIncident === 'avaria' ? 'text-secondary' : 'text-primary'}`}>build_circle</span>
              <span className="font-button-text text-button-text text-on-surface text-center">Avaria eina/vehicle</span>
            </button>

            <button 
              onClick={() => setSelectedIncident('extra')}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                selectedIncident === 'extra' ? 'bg-secondary-container/20 border-secondary-container shadow-md' : 'bg-surface-container-low border-transparent'
              }`}
            >
              <span className={`material-symbols-outlined text-[32px] mb-1 ${selectedIncident === 'extra' ? 'text-secondary' : 'text-primary'}`}>add_task</span>
              <span className="font-button-text text-button-text text-on-surface text-center">Treball extra</span>
            </button>

            <button 
              onClick={() => setSelectedIncident('meteo')}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                selectedIncident === 'meteo' ? 'bg-secondary-container/20 border-secondary-container shadow-md' : 'bg-surface-container-low border-transparent'
              }`}
            >
              <span className={`material-symbols-outlined text-[32px] mb-1 ${selectedIncident === 'meteo' ? 'text-secondary' : 'text-primary'}`}>thunderstorm</span>
              <span className="font-button-text text-button-text text-on-surface text-center">Condicions meteo</span>
            </button>

            <button 
              onClick={() => setSelectedIncident('seguretat')}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                selectedIncident === 'seguretat' ? 'bg-secondary-container/20 border-secondary-container shadow-md' : 'bg-surface-container-low border-transparent'
              }`}
            >
              <span className={`material-symbols-outlined text-[32px] mb-1 ${selectedIncident === 'seguretat' ? 'text-secondary' : 'text-primary'}`}>shield</span>
              <span className="font-button-text text-button-text text-on-surface text-center">Seguretat</span>
            </button>
          </div>

          {/* Voice Note & Description */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="bg-surface-container-low p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleRecording}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    isRecording ? 'bg-error text-white scale-110 animate-pulse' : 'bg-primary-container text-on-primary-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">{isRecording ? 'stop' : 'mic'}</span>
                </button>
                <div className="flex flex-col">
                  <span className="font-body-strong text-primary">{isRecording ? 'Gravant veu...' : 'Grava una nota de veu'}</span>
                  <span className="text-xs text-on-surface-variant">{isRecording ? `00:${seconds < 10 ? '0' + seconds : seconds} / 00:30` : 'Màxim 30 segons'}</span>
                </div>
              </div>
            </div>

            <textarea 
              className="w-full p-4 bg-surface-container-low rounded-2xl text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline" 
              placeholder="Descriu la incidència amb més detall si cal..." 
              rows={3}
            ></textarea>
          </div>

          {/* Severity Selector */}
          <div className="flex flex-col gap-3 mb-6">
            <span className="font-label-bold text-label-bold text-on-surface-variant ml-1">Gravetat de l'incident</span>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setSeverity('low')}
                className={`py-3 rounded-xl font-button-text text-button-text transition-all active:scale-95 ${
                  severity === 'low' ? 'bg-primary-fixed text-on-primary-fixed-variant font-bold' : 'bg-surface-container-low text-on-surface'
                }`}
              >
                Baixa
              </button>
              <button 
                onClick={() => setSeverity('med')}
                className={`py-3 rounded-xl font-button-text text-button-text transition-all active:scale-95 ${
                  severity === 'med' ? 'bg-secondary-container text-on-secondary-container font-bold' : 'bg-surface-container-low text-on-surface'
                }`}
              >
                Mitjana
              </button>
              <button 
                onClick={() => setSeverity('high')}
                className={`py-3 rounded-xl font-button-text text-button-text transition-all active:scale-95 ${
                  severity === 'high' ? 'bg-error text-on-error font-bold' : 'bg-surface-container-low text-on-surface'
                }`}
              >
                Alta
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button onClick={() => router.push('/operari/feines')} className="mt-4 w-full h-[64px] bg-secondary text-on-secondary rounded-2xl font-button-text text-button-text flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all">
            <span className="material-symbols-outlined">send</span>
            ENVIAR INCIDÈNCIA
          </button>
        </div>
      </main>
    </>
  );
}
