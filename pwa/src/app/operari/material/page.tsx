'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [tubQty, setTubQty] = useState(45);
  const [valvQty, setValvQty] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 px-margin-mobile flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-touch-target-min h-touch-target-min flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="font-headline-md text-headline-md text-primary tracking-tight">Gestió Material</span>
            <div className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-pulse" title="Mode Sense Connexió"></div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-touch-target-min h-touch-target-min flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <img alt="Perfil" className="w-8 h-8 rounded-full border border-outline-variant object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtwAZlJ75l9Gw7pVmLavb2QKnvmYPQzuB7phJke9yAcUDJ0ztQ8WKH1aqTSsG9RjFbewqzbEh-lpqwTHesciQLh-qbsV4tYLsupEKFm7oOf0sL5pPPZZfit0r2O40scG79F3SCHYEILi2EYMC9D21dG8DnWYtR4tBbsR8N2U6Oy6eYrwYpqtfZnePxyU5FByZqiyvjMKkJtFc53nau3eo2EdKYZf_iDBhz7w5J3AxQQ7sEhi2PPI3N" />
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-16 pb-24 min-h-screen bg-surface">
        <div className="flex flex-col w-full">
          {/* Material List Container */}
          <div className="px-margin-mobile flex flex-col gap-stack-lg">
            {/* Summary Header */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex flex-col">
                <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-widest">Resum actual</span>
                <span className="font-headline-md text-headline-md text-primary">2 Articles</span>
              </div>
              <div className="bg-primary-container text-on-primary-container px-4 py-2 rounded-full flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                <span className="font-label-bold text-label-bold">Estoc actiu</span>
              </div>
            </div>

            {/* Inventory Cards */}
            <div className="flex flex-col gap-stack-md">
              {/* Item 1 */}
              <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3 transition-all active:scale-[0.98]">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h3 className="font-headline-md text-headline-md text-primary">Tub PE 25mm</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">Canonada polietilè d'alta densitat</p>
                  </div>
                  <span className="material-symbols-outlined text-primary/30">water_drop</span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex-1 bg-surface-container-highest h-3 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${Math.min(tubQty, 100)}%` }}></div>
                  </div>
                  <span className="font-label-bold text-label-bold text-primary">{tubQty} / 100m</span>
                </div>
                <div className="flex items-center justify-between bg-surface-container-lowest rounded-lg p-2 mt-2">
                  <button onClick={() => setTubQty(Math.max(0, tubQty - 1))} className="w-12 h-12 flex items-center justify-center bg-surface-container-high rounded-lg active:bg-outline-variant transition-colors">
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <div className="flex flex-col items-center">
                    <span className="font-headline-lg text-headline-lg text-primary">{tubQty}</span>
                    <span className="font-label-bold text-[10px] text-on-surface-variant uppercase">Metres</span>
                  </div>
                  <button onClick={() => setTubQty(tubQty + 1)} className="w-12 h-12 flex items-center justify-center bg-surface-container-high rounded-lg active:bg-outline-variant transition-colors">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>

              {/* Item 2 */}
              <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h3 className="font-headline-md text-headline-md text-primary">Vàlvula Esfera 1"</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">Pas total llautó</p>
                  </div>
                  <span className="material-symbols-outlined text-primary/30">settings_input_component</span>
                </div>
                <div className="flex items-center justify-between bg-surface-container-lowest rounded-lg p-2 mt-2">
                  <button onClick={() => setValvQty(Math.max(0, valvQty - 1))} className="w-12 h-12 flex items-center justify-center bg-surface-container-high rounded-lg active:bg-outline-variant transition-colors">
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <div className="flex flex-col items-center">
                    <span className="font-headline-lg text-headline-lg text-primary">{valvQty}</span>
                    <span className="font-label-bold text-[10px] text-on-surface-variant uppercase">Unitats</span>
                  </div>
                  <button onClick={() => setValvQty(valvQty + 1)} className="w-12 h-12 flex items-center justify-center bg-surface-container-high rounded-lg active:bg-outline-variant transition-colors">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Add Material Button */}
            <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 py-4 bg-surface-container-highest rounded-xl text-primary font-button-text text-button-text active:scale-95 transition-transform">
              <span className="material-symbols-outlined">add_circle</span>
              Afegir material
            </button>

            {/* Voice Annotation Note Section */}
            <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between border border-outline-variant/30">
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
                <div className="flex flex-col">
                  <span className="font-body-strong text-primary text-sm">
                    {isRecording ? 'Gravant la teva explicació...' : "Dicta una nota de veu del material utilitzat"}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {isRecording ? `00:${voiceSeconds < 10 ? '0' + voiceSeconds : voiceSeconds} / 00:30` : 'Prem el micròfon per parlar'}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="flex flex-col gap-stack-sm mt-1">
              <label className="font-label-bold text-label-bold text-on-surface-variant ml-1 uppercase text-xs">NOTES ESCRITES D'ÚS (OPCIONAL)</label>
              <textarea className="w-full bg-surface-container-low rounded-xl p-4 font-body-md text-body-md text-on-surface outline-none focus:bg-white transition-colors" placeholder="Anotacions escrites addicionals sobre el material..." rows={2}></textarea>
            </div>

            {/* Save Action */}
            <button onClick={() => router.push('/operari/feines')} className="w-full h-14 bg-secondary text-on-secondary rounded-xl font-button-text text-button-text flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform mb-8">
              <span className="material-symbols-outlined">save</span>
              GUARDAR CONSUM
            </button>
          </div>
        </div>

        {/* Warehouse Search Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-end">
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative w-full bg-surface rounded-t-[32px] p-margin-mobile flex flex-col gap-stack-lg animate-in slide-in-from-bottom duration-300 max-h-[751px] overflow-y-auto">
              <div className="w-12 h-1.5 bg-outline-variant rounded-full mx-auto mb-2"></div>
              <div className="flex justify-between items-center">
                <h2 className="font-headline-md text-headline-md text-primary">Cercar al Magatzem</h2>
                <button className="p-2 text-on-surface-variant" onClick={() => setIsModalOpen(false)}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              {/* Search Input */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">search</span>
                <input className="w-full h-14 pl-12 pr-4 bg-surface-container-high rounded-xl font-body-md text-body-md outline-none focus:ring-2 ring-primary/20" placeholder="Referència o nom..." type="text" />
              </div>

              {/* Search Results */}
              <div className="flex flex-col gap-stack-sm">
                <div onClick={() => setIsModalOpen(false)} className="p-4 bg-surface-container rounded-xl flex items-center justify-between active:bg-primary-fixed transition-colors cursor-pointer">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">bolt</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-bold text-label-bold text-primary">Cable Unipolar 2.5mm</span>
                      <span className="text-[12px] text-on-surface-variant">Estoc: 450m</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary">chevron_right</span>
                </div>

                <div onClick={() => setIsModalOpen(false)} className="p-4 bg-surface-container rounded-xl flex items-center justify-between active:bg-primary-fixed transition-colors cursor-pointer">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">plumbing</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-bold text-label-bold text-primary">Colze 90º PVC 50mm</span>
                      <span className="text-[12px] text-on-surface-variant">Estoc: 24 uts</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary">chevron_right</span>
                </div>

                <div className="p-4 bg-surface-container rounded-xl flex items-center justify-between opacity-60">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-error">
                      <span className="material-symbols-outlined">error</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-bold text-label-bold text-primary">Manòmetre 0-10 bar</span>
                      <span className="text-[12px] text-error font-semibold uppercase">Sense Estoc</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pb-safe"></div>
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex justify-around items-center h-20 px-4">
          <Link className="flex flex-col items-center justify-center gap-1 w-16 h-16 text-on-surface-variant hover:text-primary transition-colors" href="/operari/feines">
            <span className="material-symbols-outlined">content_paste</span>
            <span className="font-label-bold text-[10px] uppercase tracking-wider">Feines</span>
          </Link>
          <Link className="flex flex-col items-center justify-center gap-1 w-16 h-16 text-on-surface-variant hover:text-primary transition-colors" href="/operari/camera">
            <span className="material-symbols-outlined">photo_camera</span>
            <span className="font-label-bold text-[10px] uppercase tracking-wider">Càmera</span>
          </Link>
          <Link className="flex flex-col items-center justify-center gap-1 w-16 h-16 text-primary font-bold" href="/operari/material">
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="font-label-bold text-[10px] uppercase tracking-wider">Material</span>
          </Link>
          <Link className="flex flex-col items-center justify-center gap-1 w-16 h-16 text-on-surface-variant hover:text-primary transition-colors" href="/operari/login">
            <span className="material-symbols-outlined">person</span>
            <span className="font-label-bold text-[10px] uppercase tracking-wider">Perfil</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
