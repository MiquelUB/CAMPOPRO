'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [km, setKm] = useState('145.832');
  const [isEditing, setIsEditing] = useState(false);

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
        <div className="flex flex-col w-full">
          {/* Vehicle Identity Card */}
          <div className="px-margin-mobile py-stack-md">
            <div className="bg-surface-container-high rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined">local_shipping</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Vehicle Assignat</span>
                <span className="font-headline-md text-headline-md text-primary">B-1234-CD</span>
                <span className="font-body-md text-body-md text-on-surface-variant">Ford Transit • Flota Nord</span>
              </div>
            </div>
          </div>

          {/* Camera Viewfinder Section */}
          <div className="relative px-margin-mobile flex-grow">
            <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-inverse-surface shadow-xl">
              {/* Camera Feed Placeholder */}
              <img className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK716SDQXzKwdPp_gz_XIv2WB1-uOEmnXGfO8YP8i1Lzy611upvDio7Pzq6X_s9jkZX8K1lHuXHhH4poWNrlghkOoYXnt2Lv-49v207SIC5ZKH2HWr8laRij1QgZMMmOF9uhVn0U7ULpxDURjkwsGLbTn8ztDTQY_phbRbEmrEd2YY9pWdoX6Fg3m_wLJP3fqc2fMYLA6P7b9i8CXmsLshI49lcOFf3IznkUBhGp3PE41Q-lwCgn-g" />
              
              {/* Viewfinder Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-secondary-container rounded-tl-lg"></div>
                <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-secondary-container rounded-tr-lg"></div>
                <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-secondary-container rounded-bl-lg"></div>
                <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-secondary-container rounded-br-lg"></div>
                
                {/* Scanning Line */}
                <div className="absolute left-0 right-0 h-1 bg-secondary-container/50 shadow-[0_0_15px_rgba(254,147,44,0.8)] z-10 animate-[scan_3s_ease-in-out_infinite]" style={{ top: '40%' }}></div>
                
                {/* Instructions Overlay */}
                <div className="bg-primary/80 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container animate-pulse">center_focus_strong</span>
                  <span className="font-button-text text-button-text text-on-primary">Enfoca el comptador</span>
                </div>
              </div>

              {/* IA Status Badge */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface-container-lowest/90 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg scale-110">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-label-bold text-label-bold text-primary">Verificat per IA ✓</span>
              </div>
            </div>
          </div>

          {/* Data Entry & Action */}
          <div className="px-margin-mobile py-stack-lg flex flex-col gap-stack-md">
            <div className="flex flex-col gap-2">
              <label className="font-label-bold text-label-bold text-on-surface-variant ml-1">Km Sortida</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center text-primary">
                  <span className="material-symbols-outlined">speed</span>
                </div>
                <input 
                  className="w-full h-14 bg-surface-container-low rounded-2xl pl-12 pr-14 font-headline-md text-headline-md text-primary outline-none focus:ring-2 focus:ring-secondary-container" 
                  readOnly={!isEditing}
                  type="text" 
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                />
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="absolute inset-y-0 right-2 w-12 flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined">{isEditing ? 'check' : 'edit'}</span>
                </button>
              </div>
              <p className="text-[12px] text-on-surface-variant px-1">Capturat automàticament fa 2 segons</p>
            </div>

            <button 
              onClick={() => router.push('/operari/feines')}
              className="w-full h-[72px] bg-secondary-container text-on-secondary-fixed font-headline-md text-headline-md rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined">check_circle</span>
              CONFIRMAR
            </button>
          </div>
        </div>
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
