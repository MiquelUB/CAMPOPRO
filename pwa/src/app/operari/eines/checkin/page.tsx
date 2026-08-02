'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  
  // Track tool status: 'ok' | 'reparacio' | 'perdut'
  const [toolStatuses, setToolStatuses] = useState<Record<string, 'ok' | 'reparacio' | 'perdut'>>({
    't1': 'ok',
    't2': 'reparacio',
    't3': 'ok',
    't4': 'ok',
  });

  const [isRecording, setIsRecording] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setVoiceSeconds(0);
    } else {
      setIsRecording(false);
    }
  };

  const handleStatusChange = (id: string, status: 'ok' | 'reparacio' | 'perdut') => {
    setToolStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const returnedTools = [
    { id: 't1', name: 'Trepant Bosch GSR-18', code: 'EIN-0142' },
    { id: 't2', name: 'Radial Makita 125mm', code: 'EIN-0089' },
    { id: 't3', name: 'Joc de Claus Stillson', code: 'EIN-0012' },
    { id: 't4', name: 'Detector de Metalls i Cables', code: 'EIN-0419' },
  ];

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
            <h2 className="font-headline-lg text-headline-lg text-primary">Retorn i Estat de les Eines</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Indica l'estat de cada eina retornada (OK, necessita reparació o perduda/malmesa).
            </p>
          </div>

          {/* Tools List with Status Selector */}
          <div className="px-margin-mobile flex flex-col gap-stack-md">
            {returnedTools.map((tool) => {
              const currentStatus = toolStatuses[tool.id] || 'ok';
              return (
                <div 
                  key={tool.id}
                  className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-2xl">build_circle</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-md text-[16px] text-primary">{tool.name}</span>
                        <span className="text-[12px] text-on-surface-variant">Codi: {tool.code}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Selection Buttons */}
                  <div className="grid grid-cols-3 gap-2 bg-white p-1 rounded-xl border border-outline-variant/30">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(tool.id, 'ok')}
                      className={`py-2 px-1 rounded-lg text-xs font-label-bold flex items-center justify-center gap-1 transition-all ${
                        currentStatus === 'ok'
                          ? 'bg-green-600 text-white font-bold shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      OK (Correcte)
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(tool.id, 'reparacio')}
                      className={`py-2 px-1 rounded-lg text-xs font-label-bold flex items-center justify-center gap-1 transition-all ${
                        currentStatus === 'reparacio'
                          ? 'bg-amber-500 text-white font-bold shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">build</span>
                      Avaria / Rep.
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(tool.id, 'perdut')}
                      className={`py-2 px-1 rounded-lg text-xs font-label-bold flex items-center justify-center gap-1 transition-all ${
                        currentStatus === 'perdut'
                          ? 'bg-red-600 text-white font-bold shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">report</span>
                      Perdut / Malmès
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Voice Annotation Note Section */}
            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 flex flex-col gap-3 mt-2">
              <label className="font-label-bold text-xs text-on-surface-variant uppercase tracking-wider">Anotació de Veu sobre l'Estat</label>
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={toggleRecording}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isRecording ? 'bg-error text-white scale-110 animate-pulse' : 'bg-primary text-white shadow-md'
                  }`}
                >
                  <span className="material-symbols-outlined">{isRecording ? 'stop' : 'mic'}</span>
                </button>
                <div className="flex flex-col flex-1">
                  <span className="font-body-strong text-primary text-sm">
                    {isRecording ? 'Gravant nota de veu...' : 'Grava una explicació en veu sobre avaries o eines perdudes'}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {isRecording ? `00:${voiceSeconds < 10 ? '0' + voiceSeconds : voiceSeconds} / 00:30` : 'Clica per parlar'}
                  </span>
                </div>
              </div>
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
