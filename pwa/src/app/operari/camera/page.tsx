'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [photoState, setPhotoState] = useState<'INICIAL' | 'DURANT' | 'FINAL'>('FINAL');
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('ca-ES', { hour12: false });
      const dateStr = now.toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
      setTimestamp(`${dateStr} • ${timeStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCapture = () => {
    const flash = document.createElement('div');
    flash.className = 'fixed inset-0 bg-white z-[100] transition-opacity duration-150';
    document.body.appendChild(flash);
    setTimeout(() => { flash.style.opacity = '0'; }, 50);
    setTimeout(() => { flash.remove(); }, 200);

    if (typeof window !== 'undefined' && window.navigator?.vibrate) {
      window.navigator.vibrate([50, 30, 50]);
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
            <span className="font-headline-md text-headline-md text-primary tracking-tight">Càmera Inspecció</span>
            <div className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-pulse" title="Offline"></div>
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
        <div className="flex flex-col w-full relative overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
          {/* Camera Viewport Container */}
          <div className="absolute inset-0 bg-surface-dim">
            <div className="relative w-full h-full overflow-hidden">
              {/* Mock Camera Feed Background */}
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB7KDMjlAt9xBcdK5h9UfGrEd1p7AG4GqsEZFMc_uSAVQG-jxiflsHvGy4XICeL-9i34_vr-3-ffo0i4Dcd8xP3nUoe7Ec1jrhXHRxLfQAO7FanRGHVOmqbDdTC_FsItU2KeZaq3j_Q1R-mfsQBXdxVdHcMSYzvYfPjUS7S6ED6Da3bWAzaIAzXL04vwXM2c1qpwr2z538ef3s0vBSv6cjThyJ_TmSDBENp65ErGibINijexKF9uwbh')` }}></div>
              
              {/* Scanning/Focus Animation Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border-2 border-white/30 rounded-3xl relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                  
                  {/* Scanning line */}
                  <div className="absolute inset-x-4 h-0.5 bg-secondary/50 shadow-[0_0_15px_rgba(254,147,44,0.8)] animate-[scan_3s_ease-in-out_infinite]" style={{ top: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Overlay: Telemetry */}
          <div className="absolute top-0 inset-x-0 p-gutter bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-white">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                <span className="font-label-bold text-label-bold tracking-widest uppercase">41.3851° N, 2.1734° E</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                <span className="font-label-bold text-label-bold" id="timestamp">{timestamp || '14 DE MAIG, 2024 • 11:24:02'}</span>
              </div>
            </div>
          </div>

          {/* Bottom Controls Container */}
          <div className="absolute bottom-0 inset-x-0 pb-12 pt-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-margin-mobile">
            {/* State Selector (Toggles) */}
            <div className="flex justify-center mb-8">
              <div className="flex bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10">
                {(['INICIAL', 'DURANT', 'FINAL'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setPhotoState(st)}
                    className={`px-6 py-2 rounded-full font-label-bold text-label-bold transition-all active:scale-95 ${
                      photoState === st ? 'bg-secondary text-primary shadow-lg scale-105' : 'text-white/60'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Action Row */}
            <div className="flex items-center justify-between">
              {/* Last Photo Thumbnail */}
              <div className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-white/50 shadow-xl group active:scale-90 transition-transform">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1pfGgFatLvdpwyAHJ9GU9riXKne0mEavsCOGuj4v5OLv4Vmat4Eu6flqySJv1sR8kWcLwnbkU-Z6M7BSKMaoXxtGiI9D8sLHgDqgJWM5OXv4vEYjtg2zoIg8-xPlihuZV_KULyhYxsJQ3so5Q9ABBvM5L7W-vO4xb3qlEJDq8NVDEQVRBlX2JQbwi8cZuhOpr9yvsy7m7Gszj5BK-oq3W6O7TlhpocK_58gEfj-GwL3Ov3SF3nNDk" />
                <div className="absolute inset-0 bg-black/20 group-active:bg-transparent"></div>
              </div>

              {/* Capture Button */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-24 h-24 rounded-full border-4 border-white/30 animate-pulse"></div>
                <button onClick={handleCapture} className="w-20 h-20 bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-90 active:bg-surface-container-high transition-all flex items-center justify-center" id="capture-btn">
                  <div className="w-16 h-16 rounded-full border-2 border-primary/10"></div>
                </button>
              </div>

              {/* Camera Switch */}
              <button className="w-14 h-14 flex items-center justify-center text-white active:rotate-180 transition-transform duration-500">
                <span className="material-symbols-outlined text-[32px]">sync</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex justify-around items-center h-20 px-4">
          <Link className="flex flex-col items-center justify-center gap-1 w-16 h-16 text-on-surface-variant hover:text-primary transition-colors" href="/operari/feines">
            <span className="material-symbols-outlined">content_paste</span>
            <span className="font-label-bold text-[10px] uppercase tracking-wider">Feines</span>
          </Link>
          <Link className="flex flex-col items-center justify-center gap-1 w-16 h-16 text-primary font-bold" href="/operari/camera">
            <span className="material-symbols-outlined">photo_camera</span>
            <span className="font-label-bold text-[10px] uppercase tracking-wider">Càmera</span>
          </Link>
          <Link className="flex flex-col items-center justify-center gap-1 w-16 h-16 text-on-surface-variant hover:text-primary transition-colors" href="/operari/material">
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
