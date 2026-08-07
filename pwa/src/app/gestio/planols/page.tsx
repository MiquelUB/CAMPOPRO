'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PlanolItem {
  id: string;
  name: string;
  clientName: string;
  municipality: string;
  version: string;
  lastModified: string;
  url?: string;
}

export default function Page() {
  const [opacity, setOpacity] = useState(85);
  const [planols] = useState<PlanolItem[]>([]);
  const [selectedPlanol, setSelectedPlanol] = useState<PlanolItem | null>(null);

  return (
    <main className="relative pt-32 p-xl bg-surface min-h-screen">
      <nav className="mb-lg flex items-center text-xs text-on-surface-variant gap-xs">
        <span className="material-symbols-outlined text-[14px]">home</span>
        <span>/</span>
        <Link href="/gestio" className="hover:text-primary cursor-pointer">Dashboard</Link>
        <span>/</span>
        <span className="text-primary font-body-strong">Biblioteca de Plànols</span>
      </nav>

      <div className="flex flex-col w-full">
        {/* Main Workspace */}
        <div className="flex h-[calc(100vh-160px)] gap-lg overflow-hidden">
          {/* Left Sidebar: Tree Navigation & Search */}
          <div className="w-[400px] flex flex-col bg-surface-container-low rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="p-md space-y-md border-b border-outline-variant/30 bg-surface-container-highest/20">
              <div className="flex items-center justify-between">
                <h2 className="font-section-title text-section-title text-on-surface">Biblioteca de Plànols</h2>
                <button className="p-xs hover:bg-surface-container-high rounded-full transition-colors">
                  <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
                </button>
              </div>
              <div className="flex items-center bg-surface-container-lowest px-md py-sm rounded-lg border border-outline-variant focus-within:border-primary transition-all group shadow-sm">
                <span className="material-symbols-outlined text-outline group-focus-within:text-primary">search</span>
                <input className="bg-transparent border-none outline-none ml-sm w-full text-body-base" placeholder="Cerca per nom, client o codi..." type="text" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-md space-y-lg custom-scrollbar">
              {/* Client Tree */}
              <section>
                <div className="flex items-center gap-sm mb-sm text-primary">
                  <span className="material-symbols-outlined text-[20px]">person_pin_circle</span>
                  <span className="font-label-caps text-label-caps tracking-widest">PER CLIENT</span>
                </div>
                {planols.length === 0 ? (
                  <p className="text-xs text-on-surface-variant italic px-2 py-1">Sense clients amb plànols</p>
                ) : (
                  <div className="space-y-1">
                    {/* Rendered dynamically when planols exist */}
                  </div>
                )}
              </section>
              {/* Municipality Tree */}
              <section>
                <div className="flex items-center gap-sm mb-sm text-outline">
                  <span className="material-symbols-outlined text-[20px]">map</span>
                  <span className="font-label-caps text-label-caps tracking-widest">PER MUNICIPI</span>
                </div>
                {planols.length === 0 ? (
                  <p className="text-xs text-on-surface-variant italic px-2 py-1">Sense municipis registrats</p>
                ) : (
                  <div className="space-y-1">
                    {/* Rendered dynamically */}
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* Right Sidebar: Selected Plan View */}
          <div className="flex-1 flex flex-col bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 relative overflow-hidden">
            {/* Top Bar */}
            <div className="p-md flex items-center justify-between border-b border-outline-variant/20">
              <div className="flex flex-col">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">description</span>
                  <h1 className="font-section-title text-section-title">
                    {selectedPlanol ? selectedPlanol.name : "Selecciona o carrega un plànol"}
                  </h1>
                </div>
                {selectedPlanol && (
                  <div className="flex items-center gap-md mt-xs">
                    <span className="text-data-tabular bg-secondary-container/20 text-on-secondary-container px-2 py-0.5 rounded font-body-strong">
                      {selectedPlanol.version}
                    </span>
                    <span className="text-data-tabular text-on-surface-variant">
                      Última modificació: {selectedPlanol.lastModified}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-sm">
                <button className="flex items-center gap-sm px-md py-sm bg-primary text-on-primary rounded-lg font-body-strong hover:bg-primary-container transition-all">
                  <span className="material-symbols-outlined">upload_file</span>
                  Pujar nou plànol
                </button>
              </div>
            </div>

            {/* Map & Controls / Empty State */}
            <div className="flex-1 relative bg-surface-dim flex items-center justify-center">
              {!selectedPlanol ? (
                <div className="flex flex-col items-center gap-md text-on-surface-variant p-xl text-center">
                  <span className="material-symbols-outlined text-6xl text-outline">map</span>
                  <p className="font-body-strong text-lg">Cap plànol seleccionat</p>
                  <p className="font-body-base text-sm max-w-sm">
                    Selecciona un plànol del menú de l'esquerra o utilitza el botó per pujar-ne un de nou en format DWG/PDF.
                  </p>
                </div>
              ) : (
                <div className="w-full h-full relative">
                  {/* Render Planol View */}
                  <div className="absolute top-md right-md flex flex-col gap-sm">
                    <div className="bg-surface/90 backdrop-blur-md p-md rounded-xl shadow-xl border border-outline-variant/30 w-64">
                      <div className="flex items-center justify-between mb-md">
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Capes d'Informació</span>
                        <span className="material-symbols-outlined text-primary">layers</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-data-tabular">
                          <span>Opacitat Planimetria</span>
                          <span>{opacity}%</span>
                        </div>
                        <input 
                          className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={opacity} 
                          onChange={(e) => setOpacity(Number(e.target.value))} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
