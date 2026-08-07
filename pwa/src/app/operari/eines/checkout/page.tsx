'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  
  // Track status of assigned tools: 'agafada' | 'deixada'
  const [toolsState, setToolsState] = useState<Record<string, 'agafada' | 'deixada'>>({
    't1': 'agafada',
    't2': 'agafada',
    't3': 'deixada',
    't4': 'agafada',
    't5': 'agafada',
  });

  const [extraTools, setExtraTools] = useState<string[]>([]);
  const [newExtraTool, setNewExtraTool] = useState('');
  const [showExtraInput, setShowExtraInput] = useState(false);

  const toggleToolState = (id: string) => {
    setToolsState((prev) => ({
      ...prev,
      [id]: prev[id] === 'agafada' ? 'deixada' : 'agafada',
    }));
  };

  const handleAddExtra = () => {
    if (newExtraTool.trim()) {
      setExtraTools((prev) => [...prev, newExtraTool.trim()]);
      setNewExtraTool('');
      setShowExtraInput(false);
    }
  };

  const assignedTools: any[] = [];

  const totalTaken = Object.values(toolsState).filter((s) => s === 'agafada').length + extraTools.length;

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button onClick={() => router.back()} className="w-touch-target-min h-touch-target-min flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <h1 className="font-headline-md text-headline-md text-primary">Recollida d'Eines (Inici)</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-pulse" title="Mode Sense Connexió"></div>
            <img alt="Perfil" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtwAZlJ75l9Gw7pVmLavb2QKnvmYPQzuB7phJke9yAcUDJ0ztQ8WKH1aqTSsG9RjFbewqzbEh-lpqwTHesciQLh-qbsV4tYLsupEKFm7oOf0sL5pPPZZfit0r2O40scG79F3SCHYEILi2EYMC9D21dG8DnWYtR4tBbsR8N2U6Oy6eYrwYpqtfZnePxyU5FByZqiyvjMKkJtFc53nau3eo2EdKYZf_iDBhz7w5J3AxQQ7sEhi2PPI3N" />
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-16 pb-36 bg-surface min-h-screen">
        <div className="flex flex-col w-full">
          {/* Status Header */}
          <div className="px-margin-mobile pt-stack-lg pb-stack-md flex flex-col gap-1">
            <span className="font-label-bold text-label-bold text-outline uppercase tracking-wider">PAS 1 — INICI DE JORNADA</span>
            <h2 className="font-headline-lg text-headline-lg text-primary">Selecció d'Eines Assignades</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Comprova la llista d'eines assignades per a avui. Marca quines t'emportes a la furgoneta i quines deixes al magatzem.
            </p>
          </div>

          {/* Summary Box */}
          <div className="px-margin-mobile mb-4">
            <div className="bg-primary-container/10 border border-primary/20 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">handyman</span>
                <div>
                  <span className="font-body-strong text-primary block">Eines a la furgoneta</span>
                  <span className="text-xs text-on-surface-variant">{totalTaken} eines seleccionades en total</span>
                </div>
              </div>
              <span className="font-headline-md text-primary bg-white px-3 py-1 rounded-lg border border-primary/10">
                {totalTaken} / {assignedTools.length + extraTools.length}
              </span>
            </div>
          </div>

          {/* Tools List */}
          <div className="px-margin-mobile flex flex-col gap-stack-md">
            {assignedTools.map((tool) => {
              const isTaken = toolsState[tool.id] === 'agafada';
              return (
                <div
                  key={tool.id}
                  onClick={() => toggleToolState(tool.id)}
                  className={`p-4 rounded-xl flex items-center justify-between border cursor-pointer transition-all ${
                    isTaken
                      ? 'bg-surface-container-low border-primary/30 shadow-sm'
                      : 'bg-surface-container-lowest border-outline-variant/30 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isTaken ? 'bg-primary text-white' : 'bg-surface-container-high text-outline'}`}>
                      <span className="material-symbols-outlined text-2xl">build</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-md text-[16px] text-primary">{tool.name}</span>
                      <span className="text-[12px] text-on-surface-variant">Codi: {tool.code} • {tool.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-label-bold px-2 py-1 rounded-full ${isTaken ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                      {isTaken ? 'AGAFADA' : 'DEIXADA'}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isTaken ? 'bg-primary text-white' : 'bg-surface-container-high text-outline'}`}>
                      <span className="material-symbols-outlined text-[20px]">{isTaken ? 'check' : 'close'}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Extra Tools Added */}
            {extraTools.map((toolName, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-secondary-container/10 border border-secondary-container/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-2xl">add_circle</span>
                  <div className="flex flex-col">
                    <span className="font-headline-md text-[16px] text-primary">{toolName}</span>
                    <span className="text-[12px] text-secondary font-bold">EINA EXTRA FORA DE LLISTAT</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExtraTools(extraTools.filter((_, i) => i !== idx));
                  }}
                  className="text-error p-1 hover:bg-error/10 rounded-full"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            ))}

            {/* Add Extra Tool Form */}
            {showExtraInput ? (
              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/50 flex flex-col gap-3">
                <label className="font-label-bold text-xs text-on-surface-variant uppercase">Nom de l'Eina Extra</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 p-3 bg-white border border-outline-variant rounded-lg font-body-base outline-none focus:border-primary"
                    placeholder="Ex: Bomba d'Aigua Portàtil"
                    value={newExtraTool}
                    onChange={(e) => setNewExtraTool(e.target.value)}
                  />
                  <button onClick={handleAddExtra} className="px-4 py-3 bg-primary text-white rounded-lg font-body-strong">Afegir</button>
                  <button onClick={() => setShowExtraInput(false)} className="px-3 py-3 bg-surface-container-high text-on-surface rounded-lg">Cancel·lar</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowExtraInput(true)}
                className="p-4 rounded-xl border-2 border-dashed border-outline-variant/60 flex items-center justify-center gap-2 text-primary font-body-strong hover:bg-surface-container-low transition-colors mt-2"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Agafar eina extra no assignada
              </button>
            )}
          </div>

          {/* Bottom Action Button */}
          <div className="fixed bottom-0 inset-x-0 bg-surface/90 backdrop-blur-xl p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40">
            <button
              onClick={() => router.push('/operari/feines')}
              className="w-full h-[64px] bg-secondary-container text-on-secondary-container rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all font-headline-md text-headline-md uppercase tracking-wide"
            >
              <span className="material-symbols-outlined text-[28px]">check_circle</span>
              Confirmar Recollida d'Eines
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
