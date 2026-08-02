'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  
  const [checkedTools, setCheckedTools] = useState<Record<string, boolean>>({
    't1': true,
    't2': true,
    't3': true,
    't4': false,
  });

  const toggleCheck = (id: string) => {
    setCheckedTools((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const returnedTools = [
    { id: 't1', name: 'Trepant Bosch GSR-18', code: 'EIN-0142' },
    { id: 't2', name: 'Radial Makita 125mm', code: 'EIN-0089' },
    { id: 't3', name: 'Joc de Claus Stillson', code: 'EIN-0012' },
    { id: 't4', name: 'Detector de Metalls i Cables', code: 'EIN-0419' },
  ];

  const countReturned = Object.values(checkedTools).filter(Boolean).length;

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button onClick={() => router.back()} className="w-touch-target-min h-touch-target-min flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <h1 className="font-headline-md text-headline-md text-primary">Retorn d'Eines (Final)</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-pulse" title="Mode Sense Connexió"></div>
            <img alt="Perfil" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtwAZlJ75l9Gw7pVmLavb2QKnvmYPQzuB7phJke9yAcUDJ0ztQ8WKH1aqTSsG9RjFbewqzbEh-lpqwTHesciQLh-qbsV4tYLsupEKFm7oOf0sL5pPPZZfit0r2O40scG79F3SCHYEILi2EYMC9D21dG8DnWYtR4tBbsR8N2U6Oy6eYrwYpqtfZnePxyU5FByZqiyvjMKkJtFc53nau3eo2EdKYZf_iDBhz7w5J3AxQQ7sEhi2PPI3N" />
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-16 pb-36 bg-surface min-h-screen">
        <div className="flex flex-col w-full">
          {/* Progress Header */}
          <div className="px-margin-mobile pt-stack-lg pb-stack-md flex flex-col gap-1">
            <span className="font-label-bold text-label-bold text-outline uppercase tracking-wider">PAS 2 — FINAL DE JORNADA</span>
            <h2 className="font-headline-lg text-headline-lg text-primary">Retorn d'Eines al Magatzem</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Verifica que tornes totes les eines que vas agafar al matí abans de tancar la jornada.
            </p>
          </div>

          {/* Info Banner */}
          <div className="px-margin-mobile mb-stack-md">
            <div className="bg-secondary-container/10 border border-secondary-container/30 p-4 rounded-xl flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary text-2xl">info</span>
              <p className="text-body-md text-on-surface leading-tight">
                Marca cadascuna de les eines que tornes a dipositar al magatzem o a la furgoneta de l'empresa.
              </p>
            </div>
          </div>

          {/* Tools List */}
          <div className="px-margin-mobile flex flex-col gap-stack-md">
            {returnedTools.map((tool) => {
              const isChecked = !!checkedTools[tool.id];
              return (
                <div 
                  key={tool.id}
                  onClick={() => toggleCheck(tool.id)}
                  className={`p-4 rounded-xl flex items-center justify-between border cursor-pointer transition-all ${
                    isChecked ? 'bg-surface-container-low border-primary/20 shadow-sm' : 'bg-surface-container-lowest border-outline-variant/30 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">build_circle</span>
                    <div className="flex flex-col">
                      <span className="font-headline-md text-[16px] text-primary">{tool.name}</span>
                      <span className="text-[12px] text-on-surface-variant">Codi: {tool.code}</span>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isChecked ? 'bg-primary text-white' : 'bg-surface-container-high text-outline'}`}>
                    <span className="material-symbols-outlined text-[20px]">{isChecked ? 'check' : 'close'}</span>
                  </div>
                </div>
              );
            })}

            {/* Summary Card */}
            <div className="bg-surface-container-low p-4 rounded-xl flex justify-between items-center mt-2 border border-outline-variant/30">
              <span className="font-label-bold text-on-surface-variant uppercase text-xs">Eines Retornades Correctament</span>
              <span className="font-headline-md text-primary bg-white px-3 py-1 rounded-lg border border-outline-variant">
                {countReturned} / {returnedTools.length}
              </span>
            </div>
          </div>

          {/* Finalize Button */}
          <div className="fixed bottom-0 inset-x-0 bg-surface/90 backdrop-blur-xl p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40">
            <button 
              onClick={() => router.push('/operari/feines')}
              className="w-full h-[64px] bg-[#2e7d32] text-white rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all font-headline-md text-headline-md uppercase tracking-wide"
            >
              <span className="material-symbols-outlined text-[28px]">check_circle</span>
              Finalitzar Retorn d'Eines
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
