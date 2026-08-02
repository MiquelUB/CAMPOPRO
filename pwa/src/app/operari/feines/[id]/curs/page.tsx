"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Package, AlertTriangle, Map, Edit3, StopCircle, PauseCircle, PlayCircle, ChevronDown } from 'lucide-react';

export default function FeinaEnCursPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  // Fake Timer logic
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isPaused) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    // Redirigir cap al checkout (podria passar per signatura primer)
    router.push(`/operari/feines`);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col">
      {/* Header with Timer */}
      <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-xl shadow-sm pt-safe border-b border-surface-variant">
        <div className="p-4 flex flex-col items-center justify-center relative">
          <div className="absolute left-4 top-4">
            <div className={`px-2 py-1 rounded-full text-[12px] font-label-bold flex items-center gap-1.5 shadow-sm border border-outline-variant
              ${isPaused ? 'bg-surface-variant text-on-surface' : 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]'}
            `}>
              <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-outline-variant' : 'bg-[#16a34a] animate-pulse'}`}></div>
              {isPaused ? 'PAUSADA' : 'EN CURS'}
            </div>
          </div>
          
          <h1 className="font-label-bold text-[14px] text-on-surface-variant uppercase tracking-wider mb-1 mt-6">Temps de feina</h1>
          <div className="font-headline-lg text-[48px] font-bold text-secondary tracking-tight tabular-nums leading-none mb-2">
            {formatTime(seconds)}
          </div>
          <h2 className="font-headline-md text-[18px] font-bold text-primary truncate max-w-[80%]">Reparació Escomesa d&apos;Aigua</h2>
        </div>
      </header>

      <main className="flex flex-col flex-1 relative w-full p-margin-mobile gap-stack-lg pb-32">
        
        {/* Map Collapsible */}
        <div className="bg-surface-container-low rounded-xl border border-surface-variant overflow-hidden">
          <div className="p-3 flex justify-between items-center bg-surface-container-highest cursor-pointer active:bg-surface-variant">
            <div className="flex items-center gap-2 text-primary font-label-bold">
              <span className="material-symbols-outlined text-[20px]">my_location</span>
              Ubicació Actual (Precisió: 4m)
            </div>
            <ChevronDown size={20} className="text-on-surface-variant" />
          </div>
          <div className="h-[120px] bg-surface-variant relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800&h=400" 
              alt="Map view" 
              className="w-full h-full object-cover opacity-60 mix-blend-multiply"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center animate-ping absolute"></div>
              <div className="w-4 h-4 bg-primary rounded-full border-2 border-white relative z-10 shadow-md"></div>
            </div>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button className="aspect-square bg-[#eff6ff] rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm border border-[#bfdbfe] active:scale-95 transition-transform text-[#1e3a8a]">
            <div className="w-12 h-12 rounded-full bg-[#dbeafe] flex items-center justify-center">
              <Camera size={28} />
            </div>
            <span className="font-label-bold text-[16px] font-bold">Foto</span>
          </button>
          
          <button className="aspect-square bg-[#f5f3ff] rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm border border-[#ddd6fe] active:scale-95 transition-transform text-[#4c1d95]">
            <div className="w-12 h-12 rounded-full bg-[#ede9fe] flex items-center justify-center">
              <Package size={28} />
            </div>
            <span className="font-label-bold text-[16px] font-bold">Material</span>
          </button>
          
          <button className="aspect-square bg-[#fef2f2] rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm border border-[#fecaca] active:scale-95 transition-transform text-[#991b1b]">
            <div className="w-12 h-12 rounded-full bg-[#fee2e2] flex items-center justify-center">
              <AlertTriangle size={28} />
            </div>
            <span className="font-label-bold text-[16px] font-bold">Incidència</span>
          </button>
          
          <button className="aspect-square bg-[#f0fdfa] rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm border border-[#a7f3d0] active:scale-95 transition-transform text-[#115e59]">
            <div className="w-12 h-12 rounded-full bg-[#ccfbf1] flex items-center justify-center">
              <Map size={28} />
            </div>
            <span className="font-label-bold text-[16px] font-bold">Plànol</span>
          </button>
          
          <button className="col-span-2 h-[88px] bg-surface-container-highest rounded-2xl flex items-center justify-center gap-3 shadow-sm border border-outline-variant active:scale-95 transition-transform text-on-surface">
            <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center">
              <Edit3 size={24} />
            </div>
            <span className="font-label-bold text-[16px] font-bold">Anotar Notes de Camp</span>
          </button>
        </div>

      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 inset-x-0 bg-surface/90 backdrop-blur-xl p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40 border-t border-surface-variant flex flex-col gap-3 pb-safe">
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="w-full h-[48px] rounded-xl flex items-center justify-center gap-2 font-label-bold text-[16px] text-on-surface-variant bg-surface-container-high border border-outline-variant active:scale-[0.98] transition-all"
        >
          {isPaused ? <PlayCircle size={20} /> : <PauseCircle size={20} />}
          {isPaused ? "REPRENDRE FEINA" : "PAUSAR TEMPORALMENT"}
        </button>

        <button 
          onClick={handleFinish}
          className="w-full h-[64px] rounded-2xl flex items-center justify-center gap-3 font-headline-md text-[20px] font-bold tracking-wide transition-all bg-[#16a34a] text-white active:scale-[0.98] shadow-lg"
        >
          <StopCircle size={28} className="fill-white text-[#16a34a]" />
          FINALITZAR
        </button>
      </div>
    </div>
  );
}
