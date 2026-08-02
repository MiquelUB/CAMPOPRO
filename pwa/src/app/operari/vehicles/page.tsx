"use client";
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Camera, Edit2, CheckCircle2 } from 'lucide-react';

export default function OperariVehiclesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [km, setKm] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setKm(null);

    // Mock response per a la validació visual ràpida (evitem el timeout de l'OCR real pel disseny)
    setTimeout(() => {
      setKm(145832);
      setLoading(false);
    }, 1500);
  };

  const handleConfirm = () => {
    // Aquí saltaríem directament a "Feina en Curs" (ex: /operari/feines/1/curs)
    // Com que no tenim l'ID de la feina a vehicles/page.tsx de forma natural (sense param), 
    // farem un mock redirect cap a la feina 1.
    router.push('/operari/feines/1/curs'); 
  };

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-sm pt-safe">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button 
              className="w-touch-target-min h-touch-target-min flex items-center justify-center text-primary" 
              onClick={() => router.back()}
            >
              <ChevronLeft size={28} />
            </button>
            <h1 className="font-headline-md text-[22px] font-bold text-primary">Km Sortida</h1>
          </div>
        </div>
      </header>

      <main className="flex flex-col flex-1 relative w-full pt-20 pb-safe bg-surface px-margin-mobile">
        <p className="font-label-bold text-on-surface-variant text-[16px] mb-6 flex items-center gap-2">
          <span>Furgoneta Ford Transit</span>
          <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
          <span>B-1234-CD</span>
        </p>

        {/* Camera Viewfinder Area */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`relative w-full aspect-square rounded-2xl overflow-hidden mb-8 flex items-center justify-center cursor-pointer transition-colors
            ${km ? 'bg-surface-container-highest border border-surface-variant' : 'bg-surface-container-highest border-2 border-dashed border-outline-variant'}
          `}
        >
          {loading ? (
            <div className="flex flex-col items-center text-primary">
              <svg className="animate-spin h-10 w-10 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="font-label-bold">Llegint comtador...</span>
            </div>
          ) : km ? (
            <div className="absolute inset-0">
               {/* Mock image taken by user */}
               <img src="https://images.unsplash.com/photo-1549399478-f739678148eb?auto=format&fit=crop&q=80&w=800&h=800" alt="Dashboard" className="w-full h-full object-cover opacity-60 mix-blend-multiply" />
               <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                 <span className="bg-surface/90 text-primary px-4 py-2 rounded-full font-label-bold flex items-center gap-2">
                   <Camera size={18} /> Repetir foto
                 </span>
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-on-surface-variant p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-surface mb-4 flex items-center justify-center shadow-sm">
                <Camera size={32} className="text-primary" />
              </div>
              <span className="font-headline-md text-[20px] font-bold text-primary mb-2">Fes una foto</span>
              <span className="font-body-md text-[14px]">Enfoca el comptador on es vegin clarament els quilòmetres.</span>
            </div>
          )}
        </div>

        <input 
          type="file" 
          accept="image/*" 
          capture="environment"
          ref={fileInputRef}
          onChange={handleCapture}
          className="hidden"
        />

        {/* Results Area */}
        <div className={`transition-all duration-300 ${km ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none'}`}>
          <div className="bg-surface-container-low p-4 rounded-xl border border-surface-variant flex justify-between items-center">
            <div className="flex flex-col">
              <label className="font-label-bold text-on-surface-variant text-[12px] uppercase tracking-wider">Lectura Quilòmetres</label>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-headline-lg text-[32px] font-bold text-primary">{km ? km.toLocaleString() : '---.---'}</span>
                <span className="text-on-surface-variant font-label-bold">km</span>
              </div>
              {km && (
                <p className="text-[12px] text-[#16a34a] font-label-bold mt-2 flex items-center gap-1 font-semibold">
                  <CheckCircle2 size={16} /> Verificat per IA
                </p>
              )}
            </div>
            
            <button className="w-12 h-12 bg-surface-container-highest rounded-full flex items-center justify-center text-primary active:scale-95 transition-transform">
              <Edit2 size={20} />
            </button>
          </div>
        </div>

        {/* Spacer to push button down if needed */}
        <div className="flex-1 min-h-[40px]"></div>

        {/* Bottom Action */}
        <div className="fixed bottom-0 inset-x-0 bg-surface/90 backdrop-blur-xl p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40 border-t border-surface-variant">
          <button 
            disabled={!km}
            onClick={handleConfirm}
            className={`w-full h-[64px] rounded-2xl flex items-center justify-center font-headline-md text-[20px] font-bold tracking-wide transition-all
              ${km ? 'bg-secondary text-secondary-foreground active:scale-[0.98] shadow-lg' : 'bg-surface-container-highest text-on-surface-variant opacity-70'}
            `}
          >
            CONFIRMAR
          </button>
        </div>
      </main>
    </div>
  );
}
