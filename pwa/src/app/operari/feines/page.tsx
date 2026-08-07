'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 700);
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 px-margin-mobile flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-headline-md text-headline-md text-primary tracking-tight">Llista Feines</span>
            <div className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-pulse" title="Offline"></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push('/operari/tiquets')} className="w-touch-target-min h-touch-target-min flex items-center justify-center text-on-surface-variant hover:text-primary" title="Tiquets i Despeses">
              <span className="material-symbols-outlined">receipt_long</span>
            </button>
            <img alt="Perfil" className="w-8 h-8 rounded-full border border-outline-variant object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtwAZlJ75l9Gw7pVmLavb2QKnvmYPQzuB7phJke9yAcUDJ0ztQ8WKH1aqTSsG9RjFbewqzbEh-lpqwTHesciQLh-qbsV4tYLsupEKFm7oOf0sL5pPPZZfit0r2O40scG79F3SCHYEILi2EYMC9D21dG8DnWYtR4tBbsR8N2U6Oy6eYrwYpqtfZnePxyU5FByZqiyvjMKkJtFc53nau3eo2EdKYZf_iDBhz7w5J3AxQQ7sEhi2PPI3N" />
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-16 pb-24 min-h-screen bg-surface">
        <div className="flex flex-col w-full">
          {/* Header & Sync Section */}
          <div className="px-margin-mobile py-stack-md flex justify-between items-end">
            <div className="flex flex-col">
              <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-widest">Agenda</span>
              <h1 className="font-headline-lg text-headline-lg text-primary">Avui, Dilluns 03 Agost</h1>
            </div>
            <button onClick={handleSync} className="w-12 h-12 flex items-center justify-center bg-surface-container-high rounded-full text-primary active:scale-95 transition-transform" id="sync-btn">
              <span className={`material-symbols-outlined transition-transform duration-700 ${isSyncing ? 'rotate-[360deg]' : ''}`} id="sync-icon">sync</span>
            </button>
          </div>

          {/* FIELD WORKER MANUAL CHECK-IN CARD -> GOES TO /operari/jornada */}
          <div className="px-margin-mobile mb-4">
            <div 
              onClick={() => router.push('/operari/jornada')}
              className="bg-gradient-to-r from-emerald-900 via-teal-900 to-primary text-white p-4 rounded-2xl shadow-lg border border-emerald-700 flex flex-col gap-3 cursor-pointer hover:scale-[1.01] transition-transform"
            >
              <div className="flex justify-between items-center border-b border-emerald-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400">schedule</span>
                  <h3 className="font-bold text-sm text-emerald-200">Control Horari Manual (Inici / Final de Jornada)</h3>
                </div>
                <span className="text-[9px] font-bold bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full uppercase">
                  RDL 8/2019
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[11px] text-emerald-300 block font-medium">Estat de la Jornada Avui:</span>
                  <span className="font-extrabold text-sm text-white flex items-center gap-1.5 mt-0.5">
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono block mt-1">
                  </span>
                </div>

                <button
                  type="button"
                  className="px-4 py-2.5 bg-emerald-500 text-emerald-950 rounded-xl font-bold text-xs shadow-md flex items-center gap-1"
                >
                  Obrir Fitxatge ➔
                </button>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="px-margin-mobile mb-stack-lg">
            <div className="flex gap-3 h-14">
              <div className="flex-1 bg-surface-container-low rounded-xl flex items-center px-4 gap-3 group focus-within:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-outline">search</span>
                <input 
                  className="bg-transparent border-none outline-none w-full text-body-md text-on-surface placeholder:text-outline-variant" 
                  placeholder="Cerca feines o clients..." 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="w-14 h-14 bg-surface-container-low rounded-xl flex items-center justify-center text-primary active:bg-primary-container active:text-on-primary-container transition-colors">
                <span className="material-symbols-outlined">tune</span>
              </button>
            </div>
          </div>

          {/* Job List */}
          <div className="flex flex-col gap-stack-md px-margin-mobile pb-32">


            {/* Empty State / Footer Illustration */}
            <div className="mt-8 flex flex-col items-center opacity-40">
              <div className="w-24 h-1 bg-surface-container-highest rounded-full mb-6"></div>
              <span className="material-symbols-outlined text-[48px] mb-2">task_alt</span>
              <p className="font-label-bold text-label-bold">Has revisat totes les tasques</p>
            </div>
          </div>

          {/* FAB */}
          <button onClick={() => router.push('/operari/incidencies/nova')} className="fixed right-6 bottom-28 w-16 h-16 bg-secondary-container text-on-secondary-container rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-transform z-40">
            <span className="material-symbols-outlined text-[32px]">add</span>
          </button>
        </div>
      </main>

      {/* PWA Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex justify-around items-center h-20 px-2">
          <Link className="flex flex-col items-center justify-center gap-1 w-14 h-16 text-primary font-bold" href="/operari/feines">
            <span className="material-symbols-outlined">content_paste</span>
            <span className="font-label-bold text-[9px] uppercase tracking-wider">Feines</span>
          </Link>
          
          <Link className="flex flex-col items-center justify-center gap-1 w-14 h-16 text-on-surface-variant hover:text-primary transition-colors" href="/operari/jornada">
            <span className="material-symbols-outlined">schedule</span>
            <span className="font-label-bold text-[9px] uppercase tracking-wider">Jornada</span>
          </Link>

          <Link className="flex flex-col items-center justify-center gap-1 w-14 h-16 text-on-surface-variant hover:text-primary transition-colors" href="/operari/tiquets">
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="font-label-bold text-[9px] uppercase tracking-wider">Tiquets</span>
          </Link>

          <Link className="flex flex-col items-center justify-center gap-1 w-14 h-16 text-on-surface-variant hover:text-primary transition-colors" href="/operari/camera">
            <span className="material-symbols-outlined">photo_camera</span>
            <span className="font-label-bold text-[9px] uppercase tracking-wider">Càmera</span>
          </Link>

          <Link className="flex flex-col items-center justify-center gap-1 w-14 h-16 text-on-surface-variant hover:text-primary transition-colors" href="/operari/material">
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="font-label-bold text-[9px] uppercase tracking-wider">Material</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
