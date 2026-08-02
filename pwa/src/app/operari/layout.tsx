'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function OperariLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show bottom nav on the login page
  if (pathname === '/operari/login') {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex justify-around items-center h-20 px-4">
          <Link href="/operari/feines" className={`flex flex-col items-center justify-center gap-1 w-16 h-16 transition-colors ${pathname.includes('/feines') ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
            <span className="material-symbols-outlined">content_paste</span>
            <span className="font-label-bold text-[10px] uppercase tracking-wider">Feines</span>
          </Link>
          <Link href="/operari/camera" className={`flex flex-col items-center justify-center gap-1 w-16 h-16 transition-colors ${pathname.includes('/camera') ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
            <span className="material-symbols-outlined">photo_camera</span>
            <span className="font-label-bold text-[10px] uppercase tracking-wider">Càmera</span>
          </Link>
          <Link href="/operari/eines/checkin" className={`flex flex-col items-center justify-center gap-1 w-16 h-16 transition-colors ${pathname.includes('/material') || pathname.includes('/eines') ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="font-label-bold text-[10px] uppercase tracking-wider">Eines</span>
          </Link>
          <Link href="/operari/perfil" className={`flex flex-col items-center justify-center gap-1 w-16 h-16 transition-colors ${pathname.includes('/perfil') ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
            <span className="material-symbols-outlined">person</span>
            <span className="font-label-bold text-[10px] uppercase tracking-wider">Perfil</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
