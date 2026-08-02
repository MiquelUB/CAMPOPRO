'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [checkedTools, setCheckedTools] = useState<Record<string, boolean>>({
    't1': true,
    't2': true,
    't3': false,
    't4': true,
    't5': false,
  });

  const toggleCheck = (id: string) => {
    setCheckedTools((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button onClick={() => router.back()} className="w-touch-target-min h-touch-target-min flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <h1 className="font-headline-md text-headline-md text-primary">Check-out Eines</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-pulse"></div>
            <img alt="Perfil" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtwAZlJ75l9Gw7pVmLavb2QKnvmYPQzuB7phJke9yAcUDJ0ztQ8WKH1aqTSsG9RjFbewqzbEh-lpqwTHesciQLh-qbsV4tYLsupEKFm7oOf0sL5pPPZZfit0r2O40scG79F3SCHYEILi2EYMC9D21dG8DnWYtR4tBbsR8N2U6Oy6eYrwYpqtfZnePxyU5FByZqiyvjMKkJtFc53nau3eo2EdKYZf_iDBhz7w5J3AxQQ7sEhi2PPI3N" />
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-16 pb-32 bg-surface min-h-screen">
        <div className="flex flex-col w-full">
          {/* Status Header */}
          <div className="px-margin-mobile pt-stack-lg pb-stack-md flex flex-col gap-1">
            <span className="font-label-bold text-label-bold text-outline uppercase tracking-wider">Inici de Jornada</span>
            <h2 className="font-headline-lg text-headline-lg text-primary">Verificació d'Eines Carregades</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Revisa que portes totes les eines necessàries a la furgoneta.</p>
          </div>

          {/* Tools List */}
          <div className="px-margin-mobile flex flex-col gap-stack-md">
            {/* Tool Item 1 */}
            <div 
              onClick={() => toggleCheck('t1')}
              className={`p-4 rounded-xl flex items-center justify-between border cursor-pointer transition-all ${
                checkedTools['t1'] ? 'bg-surface-container-low border-primary/20 shadow-sm' : 'bg-surface-container-lowest border-outline-variant/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">build</span>
                <div className="flex flex-col">
                  <span className="font-headline-md text-[16px] text-primary">Trepant Bosch GSR-18</span>
                  <span className="text-[12px] text-on-surface-variant">Codi: EIN-0142</span>
                </div>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${checkedTools['t1'] ? 'bg-primary text-white' : 'bg-surface-container-high text-outline'}`}>
                <span className="material-symbols-outlined text-[20px]">check</span>
              </div>
            </div>

            {/* Tool Item 2 */}
            <div 
              onClick={() => toggleCheck('t2')}
              className={`p-4 rounded-xl flex items-center justify-between border cursor-pointer transition-all ${
                checkedTools['t2'] ? 'bg-surface-container-low border-primary/20 shadow-sm' : 'bg-surface-container-lowest border-outline-variant/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">handyman</span>
                <div className="flex flex-col">
                  <span className="font-headline-md text-[16px] text-primary">Radial Makita 125mm</span>
                  <span className="text-[12px] text-on-surface-variant">Codi: EIN-0089</span>
                </div>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${checkedTools['t2'] ? 'bg-primary text-white' : 'bg-surface-container-high text-outline'}`}>
                <span className="material-symbols-outlined text-[20px]">check</span>
              </div>
            </div>

            {/* Tool Item 3 */}
            <div 
              onClick={() => toggleCheck('t3')}
              className={`p-4 rounded-xl flex items-center justify-between border cursor-pointer transition-all ${
                checkedTools['t3'] ? 'bg-surface-container-low border-primary/20 shadow-sm' : 'bg-surface-container-lowest border-outline-variant/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">square_foot</span>
                <div className="flex flex-col">
                  <span className="font-headline-md text-[16px] text-primary">Nivell Làser DeWalt</span>
                  <span className="text-[12px] text-on-surface-variant">Codi: EIN-0301</span>
                </div>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${checkedTools['t3'] ? 'bg-primary text-white' : 'bg-surface-container-high text-outline'}`}>
                <span className="material-symbols-outlined text-[20px]">check</span>
              </div>
            </div>

            {/* Tool Item 4 */}
            <div 
              onClick={() => toggleCheck('t4')}
              className={`p-4 rounded-xl flex items-center justify-between border cursor-pointer transition-all ${
                checkedTools['t4'] ? 'bg-surface-container-low border-primary/20 shadow-sm' : 'bg-surface-container-lowest border-outline-variant/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">plumbing</span>
                <div className="flex flex-col">
                  <span className="font-headline-md text-[16px] text-primary">Joc de Claus Stillson</span>
                  <span className="text-[12px] text-on-surface-variant">Codi: EIN-0012</span>
                </div>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${checkedTools['t4'] ? 'bg-primary text-white' : 'bg-surface-container-high text-outline'}`}>
                <span className="material-symbols-outlined text-[20px]">check</span>
              </div>
            </div>

            {/* Tool Item 5 */}
            <div 
              onClick={() => toggleCheck('t5')}
              className={`p-4 rounded-xl flex items-center justify-between border cursor-pointer transition-all ${
                checkedTools['t5'] ? 'bg-surface-container-low border-primary/20 shadow-sm' : 'bg-surface-container-lowest border-outline-variant/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">cable</span>
                <div className="flex flex-col">
                  <span className="font-headline-md text-[16px] text-primary">Detector de Metalls i Cables</span>
                  <span className="text-[12px] text-on-surface-variant">Codi: EIN-0419</span>
                </div>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${checkedTools['t5'] ? 'bg-primary text-white' : 'bg-surface-container-high text-outline'}`}>
                <span className="material-symbols-outlined text-[20px]">check</span>
              </div>
            </div>

            {/* Extra tool option */}
            <button className="p-4 rounded-xl border-2 border-dashed border-outline-variant/50 flex items-center justify-center gap-2 text-primary font-button-text active:scale-95 transition-transform mt-2">
              <span className="material-symbols-outlined">add</span>
              Agafar eina extra (fora del llistat)
            </button>
          </div>

          {/* Bottom Action Scrim */}
          <div className="fixed bottom-0 inset-x-0 bg-surface/80 backdrop-blur-xl p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40">
            <button 
              onClick={() => router.push('/operari/feines')}
              className="w-full h-[64px] bg-secondary-container text-on-secondary-container rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all font-headline-md text-headline-md uppercase tracking-wide"
            >
              <span className="material-symbols-outlined text-[28px]">check_circle</span>
              Confirmar Sortida Eines
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
