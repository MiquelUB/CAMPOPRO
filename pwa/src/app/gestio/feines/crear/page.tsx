'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [jobType, setJobType] = useState('jardineria');
  const [priority, setPriority] = useState('NORMAL');

  return (
    <main className="relative pt-32 p-xl bg-surface min-h-screen">
      <nav className="mb-lg flex items-center text-xs text-on-surface-variant gap-xs">
        <span className="material-symbols-outlined text-[14px]">home</span>
        <span>/</span>
        <Link href="/gestio" className="hover:text-primary cursor-pointer">Dashboard</Link>
        <span>/</span>
        <span className="text-primary font-body-strong">Nova Feina</span>
      </nav>
      
      <div className="flex flex-col w-full gap-xl">
        {/* Step Progress Indicator */}
        <div className="w-full flex items-center justify-between px-xl py-lg bg-surface-container-low rounded-xl shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 h-1 bg-secondary-container transition-all duration-500" style={{ width: '25%' }}></div>
          <div className="flex items-center gap-md group cursor-default">
            <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md ring-4 ring-primary/10">
              <span className="font-body-strong">1</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-primary">PAS 1</span>
              <span className="font-body-strong text-on-surface">Client i Lloc</span>
            </div>
          </div>
          <div className="h-px bg-outline-variant flex-1 mx-lg"></div>
          <div className="flex items-center gap-md opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all duration-300">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center">
              <span className="font-body-strong">2</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-on-surface-variant">PAS 2</span>
              <span className="font-body-strong text-on-surface-variant">Plànol i Material</span>
            </div>
          </div>
          <div className="h-px bg-outline-variant flex-1 mx-lg"></div>
          <div className="flex items-center gap-md opacity-40 grayscale">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center">
              <span className="font-body-strong">3</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-on-surface-variant">PAS 3</span>
              <span className="font-body-strong text-on-surface-variant">Eines i Vehicle</span>
            </div>
          </div>
          <div className="h-px bg-outline-variant flex-1 mx-lg"></div>
          <div className="flex items-center gap-md opacity-40 grayscale">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center">
              <span className="font-body-strong">4</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-on-surface-variant">PAS 4</span>
              <span className="font-body-strong text-on-surface-variant">Assignar Quadrilla</span>
            </div>
          </div>
        </div>

        {/* Main Interaction Area */}
        <div className="grid grid-cols-12 gap-xl">
          {/* Left Column: Form Details */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-lg">
            <div className="p-xl bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-highest">
              <div className="flex items-center justify-between mb-xl">
                <h2 className="font-section-title text-on-surface flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">person_pin_circle</span>
                  Detalls de la Ubicació
                </h2>
                <div className="flex gap-xs">
                  <button 
                    onClick={() => setPriority('URGENT')} 
                    className={`px-md py-xs rounded-full font-label-caps transition-all ${priority === 'URGENT' ? 'bg-error text-white font-bold scale-105' : 'bg-error-container text-error'}`}
                  >
                    URGENT
                  </button>
                  <button 
                    onClick={() => setPriority('NORMAL')} 
                    className={`px-md py-xs rounded-full font-label-caps transition-all ${priority === 'NORMAL' ? 'bg-secondary-container text-white font-bold scale-105' : 'bg-secondary-container/20 text-secondary border-2 border-secondary-container'}`}
                  >
                    NORMAL
                  </button>
                  <button 
                    onClick={() => setPriority('BAIXA')} 
                    className={`px-md py-xs rounded-full font-label-caps transition-all ${priority === 'BAIXA' ? 'bg-outline text-white font-bold scale-105' : 'bg-surface-container text-on-surface-variant'}`}
                  >
                    BAIXA
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-lg">
                <div className="col-span-2 flex flex-col gap-xs">
                  <label className="font-label-caps text-on-surface-variant ml-xs">CLIENT</label>
                  <div className="relative group">
                    <select className="w-full bg-surface p-md rounded-lg border border-outline-variant appearance-none focus:ring-2 ring-primary/10 outline-none transition-all cursor-pointer">
                      <option>Selecciona un client existent...</option>
                      <option>Ajuntament de Girona</option>
                      <option>Residencial Parc del Sud</option>
                      <option>Construccions Riba S.A.</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
                  </div>
                </div>
                <div className="col-span-2 flex flex-col gap-xs">
                  <label className="font-label-caps text-on-surface-variant ml-xs">ADREÇA DEL PROJECTE</label>
                  <div className="flex items-center bg-surface border border-outline-variant rounded-lg px-md focus-within:ring-2 ring-primary/10 transition-all">
                    <span className="material-symbols-outlined text-outline">location_on</span>
                    <input className="bg-transparent border-none outline-none p-md w-full text-body-base" defaultValue="Carrer de la Marina, 200, Barcelona" placeholder="Carrer, número, codi postal..." type="text" />
                  </div>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-on-surface-variant ml-xs">DATA D'INICI</label>
                  <input className="bg-surface p-md rounded-lg border border-outline-variant outline-none focus:ring-2 ring-primary/10" defaultValue="2024-05-24" type="date" />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-on-surface-variant ml-xs">HORA PREVISTA</label>
                  <input className="bg-surface p-md rounded-lg border border-outline-variant outline-none focus:ring-2 ring-primary/10" defaultValue="08:00" type="time" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-md">
              <label className="font-label-caps text-on-surface-variant ml-xs uppercase tracking-widest">Tipus de Feina</label>
              <div className="grid grid-cols-3 gap-md">
                <button 
                  onClick={() => setJobType('jardineria')} 
                  className={`flex flex-col items-center gap-md p-lg rounded-xl transition-all group overflow-hidden relative ${jobType === 'jardineria' ? 'bg-surface-container-lowest border-2 border-secondary-container shadow-md' : 'bg-surface-container-lowest border border-surface-container-highest hover:border-outline'}`}
                >
                  {jobType === 'jardineria' && <div className="absolute inset-0 bg-secondary-container/5"></div>}
                  <span className={`material-symbols-outlined text-[40px] relative z-10 ${jobType === 'jardineria' ? 'text-secondary' : 'text-outline group-hover:text-primary'}`}>forest</span>
                  <span className={`font-body-strong relative z-10 ${jobType === 'jardineria' ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'}`}>Jardineria</span>
                </button>
                
                <button 
                  onClick={() => setJobType('muntatge')} 
                  className={`flex flex-col items-center gap-md p-lg rounded-xl transition-all group overflow-hidden relative ${jobType === 'muntatge' ? 'bg-surface-container-lowest border-2 border-secondary-container shadow-md' : 'bg-surface-container-lowest border border-surface-container-highest hover:border-outline'}`}
                >
                  {jobType === 'muntatge' && <div className="absolute inset-0 bg-secondary-container/5"></div>}
                  <span className={`material-symbols-outlined text-[40px] relative z-10 ${jobType === 'muntatge' ? 'text-secondary' : 'text-outline group-hover:text-primary'}`}>construction</span>
                  <span className={`font-body-strong relative z-10 ${jobType === 'muntatge' ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'}`}>Muntatge</span>
                </button>

                <button 
                  onClick={() => setJobType('manteniment')} 
                  className={`flex flex-col items-center gap-md p-lg rounded-xl transition-all group overflow-hidden relative ${jobType === 'manteniment' ? 'bg-surface-container-lowest border-2 border-secondary-container shadow-md' : 'bg-surface-container-lowest border border-surface-container-highest hover:border-outline'}`}
                >
                  {jobType === 'manteniment' && <div className="absolute inset-0 bg-secondary-container/5"></div>}
                  <span className={`material-symbols-outlined text-[40px] relative z-10 ${jobType === 'manteniment' ? 'text-secondary' : 'text-outline group-hover:text-primary'}`}>engineering</span>
                  <span className={`font-body-strong relative z-10 ${jobType === 'manteniment' ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'}`}>Manteniment</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Map and Preview */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-lg">
            <div className="relative h-[420px] rounded-xl overflow-hidden shadow-xl group border-4 border-surface-container-lowest">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCvbJjUps0q9YpuQkGaY5sRz2m_ti7khbFlM6-CHmI8ykOmRLmMra7akOY7vF9x65dHzRdZQqeacIz_LPhVHInJ6E5g_v9awm4ReTUw-3hPNQx830GX3GzrxqwDyK6kSXn8aKLHSmKwRXY8OuBTccG5OdGUf_k9PET1PNq96ySs7M2WQDY9UzJh9kW2ZeGatQwHH-6Msl2sF7P22CxWNJs7BHja5JGG0qkVly74n-qHHixvQx472LXu')` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-lg left-lg right-lg p-md bg-surface/90 backdrop-blur-md rounded-lg flex items-center justify-between border border-white/20">
                <div className="flex items-center gap-sm">
                  <div className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></div>
                  <span className="text-xs font-body-strong text-primary">UBICACIÓ VERIFICADA</span>
                </div>
                <span className="text-xs font-data-tabular text-on-surface-variant">41.9794° N, 2.8214° E</span>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center group-hover:-translate-y-[110%] transition-transform duration-300">
                <div className="px-md py-xs bg-primary text-on-primary rounded-full text-[10px] font-bold mb-xs shadow-lg whitespace-nowrap">Punt de Treball</div>
                <span className="material-symbols-outlined text-secondary-container text-5xl drop-shadow-2xl">location_on</span>
              </div>
            </div>

            <div className="p-lg bg-surface-container rounded-xl border border-dashed border-outline-variant opacity-80 group hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between mb-md">
                <span className="font-label-caps text-on-surface-variant">PREVISUALITZACIÓ PAS 2</span>
                <span className="material-symbols-outlined text-sm text-outline">lock</span>
              </div>
              <div className="flex items-center gap-md bg-surface-container-lowest p-md rounded-lg shadow-inner">
                <div className="w-12 h-12 bg-primary-container/20 rounded flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined">map</span>
                </div>
                <div className="flex flex-col flex-1">
                  <div className="h-2 w-32 bg-surface-container-high rounded mb-2"></div>
                  <div className="h-2 w-20 bg-surface-container-high rounded"></div>
                </div>
                <div className="flex items-center gap-sm px-sm py-xs bg-secondary-container/10 rounded">
                  <span className="material-symbols-outlined text-secondary text-[16px]">psychology</span>
                  <span className="font-label-caps text-secondary">IA ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-lg pt-lg border-t border-surface-container-highest flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-sm px-xl py-md text-on-surface-variant font-body-strong hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
            Cancel·lar
          </button>
          <div className="flex items-center gap-xl">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs text-on-surface-variant font-label-caps">PROPER PAS</span>
              <span className="font-body-strong text-on-surface">Càrrega de Plànols i Materials</span>
            </div>
            <button onClick={() => router.push('/gestio/planols')} className="bg-secondary-container text-on-secondary-container px-12 py-md rounded-lg font-body-strong shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-md">
              Següent
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
