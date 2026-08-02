'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function OperariLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showPagesDrawer, setShowPagesDrawer] = useState(false);
  
  if (pathname === '/operari/login') {
    return <>{children}</>;
  }

  const pagesList = [
    { num: '1', title: 'Login PIN', path: '/operari/login', icon: 'lock' },
    { num: '2', title: "Feines d'Avui", path: '/operari/feines', icon: 'content_paste' },
    { num: '3', title: 'Detall de Feina', path: '/operari/feines/1', icon: 'info' },
    { num: '4', title: 'Feina en Curs (Timer)', path: '/operari/feines/1/curs', icon: 'timer' },
    { num: '5', title: "Recollida d'Eines (Inici)", path: '/operari/eines/checkout', icon: 'handyman' },
    { num: '6', title: "Retorn d'Eines (Final)", path: '/operari/eines/checkin', icon: 'build_circle' },
    { num: '7', title: 'Km del Vehicle', path: '/operari/vehicles/km', icon: 'speed' },
    { num: '8', title: 'Consum de Material', path: '/operari/material', icon: 'inventory_2' },
    { num: '9', title: "Report d'Incidència", path: '/operari/incidencies/nova', icon: 'report_problem' },
    { num: '10', title: 'Anotació de Plànol', path: '/operari/planols/1/anotar', icon: 'architecture' },
    { num: '11', title: 'Signatura Client', path: '/operari/feines/1/signatura', icon: 'draw' },
    { num: '12', title: "Càmera d'Inspecció", path: '/operari/camera', icon: 'photo_camera' },
  ];

  return (
    <>
      <div className="pb-24">
        {children}
      </div>

      {/* Drawer with All 12 Stitch Pages */}
      {showPagesDrawer && (
        <div className="fixed inset-0 z-[100] flex items-end">
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm" onClick={() => setShowPagesDrawer(false)}></div>
          <div className="relative w-full bg-surface rounded-t-[32px] p-6 max-h-[85vh] overflow-y-auto z-10 shadow-2xl border-t border-outline-variant/30">
            <div className="w-12 h-1.5 bg-outline-variant/50 rounded-full mx-auto mb-4"></div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-headline-md text-headline-md text-primary">Les 12 Planes de l'Operari (Stitch)</h2>
                <p className="text-xs text-on-surface-variant font-body-base">Navega directament a qualsevol de les 12 vistes d'Stitch</p>
              </div>
              <button onClick={() => setShowPagesDrawer(false)} className="p-2 text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pagesList.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setShowPagesDrawer(false)}
                  className={`p-3 rounded-xl flex items-center gap-3 border transition-all ${
                    pathname === item.path
                      ? 'bg-primary-container text-on-primary-container border-primary font-bold shadow-md'
                      : 'bg-surface-container-low hover:bg-surface-container-high border-outline-variant/30 text-on-surface'
                  }`}
                >
                  <span className="w-7 h-7 rounded-full bg-secondary-container/20 text-secondary text-xs flex items-center justify-center font-bold">
                    {item.num}
                  </span>
                  <span className="material-symbols-outlined text-[20px] text-primary">{item.icon}</span>
                  <span className="text-sm flex-1 truncate">{item.title}</span>
                  <span className="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/95 backdrop-blur-xl shadow-[0_-1px_12px_rgba(0,0,0,0.08)] border-t border-outline-variant/20">
        <div className="flex justify-around items-center h-20 px-2 max-w-lg mx-auto">
          <Link href="/operari/feines" className={`flex flex-col items-center justify-center gap-1 w-14 h-14 transition-colors ${pathname.includes('/feines') && !pathname.includes('/curs') && !pathname.includes('/signatura') ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
            <span className="material-symbols-outlined text-[22px]">content_paste</span>
            <span className="font-label-bold text-[9px] uppercase tracking-wider">Feines</span>
          </Link>
          
          <Link href="/operari/eines/checkout" className={`flex flex-col items-center justify-center gap-1 w-14 h-14 transition-colors ${pathname.includes('/eines') ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
            <span className="material-symbols-outlined text-[22px]">handyman</span>
            <span className="font-label-bold text-[9px] uppercase tracking-wider">Eines</span>
          </Link>

          {/* Center Button to open all 12 Pages menu */}
          <button 
            onClick={() => setShowPagesDrawer(true)} 
            className="flex flex-col items-center justify-center w-14 h-14 bg-secondary-container text-on-secondary-container rounded-2xl shadow-lg active:scale-95 transition-transform"
            title="Les 12 Planes d'Stitch"
          >
            <span className="material-symbols-outlined text-[24px]">grid_view</span>
            <span className="font-label-bold text-[8px] uppercase tracking-wider font-bold">12 Planes</span>
          </button>

          <Link href="/operari/material" className={`flex flex-col items-center justify-center gap-1 w-14 h-14 transition-colors ${pathname.includes('/material') ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
            <span className="material-symbols-outlined text-[22px]">inventory_2</span>
            <span className="font-label-bold text-[9px] uppercase tracking-wider">Material</span>
          </Link>

          <Link href="/operari/camera" className={`flex flex-col items-center justify-center gap-1 w-14 h-14 transition-colors ${pathname.includes('/camera') ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
            <span className="material-symbols-outlined text-[22px]">photo_camera</span>
            <span className="font-label-bold text-[9px] uppercase tracking-wider">Càmera</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
