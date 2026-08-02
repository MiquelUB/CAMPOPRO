'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GestioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  if (pathname === '/gestio/login') {
    return <>{children}</>;
  }

  const navLinks = [
    { name: 'Dashboard', path: '/gestio', icon: 'dashboard' },
    { name: 'Clients', path: '/gestio/clients', icon: 'group' },
    { name: 'Magatzem', path: '/gestio/magatzem', icon: 'inventory_2' },
    { name: 'Seguiment Feines', path: '/gestio/feines/mapa', icon: 'map' },
    { name: 'Vehicles', path: '/gestio/flota', icon: 'local_shipping' },
    { name: 'Operaris', path: '/gestio/operaris', icon: 'engineering' },
    { name: 'Plànols', path: '/gestio/planols', icon: 'map' },
    { name: 'Configuració', path: '/gestio/configuracio', icon: 'settings' },
  ];

  return (
    <div className="bg-surface font-body-base text-on-surface min-h-screen">
      <aside className="fixed left-0 top-0 h-full w-16 md:w-[240px] bg-primary text-on-primary z-50 flex flex-col transition-all duration-200 shadow-xl overflow-hidden hover:w-[240px] md:hover:w-[240px] group">
        <div className="p-4 md:p-md flex items-center gap-sm mb-lg justify-center md:justify-start">
          <img alt="Logo" className="h-8 w-auto object-contain flex-shrink-0" src="https://lh3.googleusercontent.com/aida/AP1WRLsEXFuQ4rmmM6G9GiP2Wc1vF-mvbIxAj1gCebc33OvQEY7pafglJcHcVF_69XfQ1M8JO4wJAGm547Zj0L19kbIe10YNOcBQmYBueHpTMNBGCnoXSQ_alln7Z5WFWt5-Cn97yJ9ffWW7LBpeIOnWV8-8x8PXbHS-fNYeuGaX55ts_6UD_U6P0o4YF6hNTWbkFh-qoGbwhbYw1ZCycoonB_94NWgX5mSb5y8Pa65DRzMGc9oydmf8LpzkT7I"/>
          <span className="font-display-lg text-lg text-white tracking-tight hidden md:inline group-hover:inline whitespace-nowrap">CampoPro</span>
        </div>
        <nav className="flex-1 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.path || (link.path !== '/gestio' && pathname.startsWith(link.path));
            return (
              <Link 
                key={link.path}
                href={link.path} 
                className={`flex items-center px-4 md:px-md py-sm transition-colors gap-md ${isActive ? 'border-l-4 border-secondary-container bg-primary-container text-white' : 'text-on-primary-container hover:bg-primary-container hover:text-white border-l-4 border-transparent'}`}
              >
                <span className="material-symbols-outlined flex-shrink-0">{link.icon}</span>
                <span className="font-body-strong hidden md:inline group-hover:inline whitespace-nowrap">{link.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-4 md:p-md border-t border-primary-container flex items-center gap-md justify-center md:justify-start">
          <img alt="Profile" className="w-8 h-8 rounded-full object-cover border border-outline-variant flex-shrink-0" src="https://lh3.googleusercontent.com/aida/AP1WRLvC0NhAQrwYAX6nh6T-hT7M0Wn_hHUfIJAx0VqXTbjGzUqcNEgowwgqSwH7RaEwGU3PcaFYfnmHvVjqqYTS3yLXlz_K9YDTBgshZ7TskFMOyZIr4Xq6VQlldOiwMbHY1ssDuRA8rwBREstMqXFP0-wucF1YvkaOkIqHDK3bygjBOsCZu34gHZmRlIWBedrzbUVieFMX95ym1v_WGJfsF9blT0V0s_sQ6i85YI5091kotfSCsppcuijjcQ"/>
          <div className="flex-col hidden md:flex group-hover:flex whitespace-nowrap">
            <span className="font-body-strong text-white">Marc</span>
            <span className="text-xs text-on-primary-container">Enginyer</span>
          </div>
        </div>
      </aside>
      
      <div className="pl-16 md:pl-[240px] flex flex-col min-h-screen">
        <header className="sticky top-0 h-32 bg-surface/80 backdrop-blur-md z-40 flex flex-col shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="h-16 px-4 md:px-xl flex items-center justify-between border-b border-surface-container-highest">
            <div className="flex items-center bg-surface-container-low px-md py-xs rounded-lg w-full max-w-sm border border-outline-variant">
              <span className="material-symbols-outlined text-outline">search</span>
              <input className="bg-transparent border-none outline-none ml-sm w-full text-sm" placeholder="Cerca global..." type="text"/>
            </div>
            <div className="flex items-center gap-md ml-4">
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors hidden sm:block">help</span>
              <div className="relative">
                <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">notifications</span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
              </div>
            </div>
          </div>
          <div className="h-16 px-4 md:px-xl flex items-center justify-start gap-xl overflow-x-auto">
            <nav className="flex h-full gap-lg">
              <Link href="/gestio" className="flex items-center h-full px-sm font-label-caps text-secondary-container border-b-2 border-secondary-container transition-all whitespace-nowrap">FEINA</Link>
              <Link href="/gestio/completades" className="flex items-center h-full px-sm font-label-caps text-on-surface-variant hover:text-primary border-b-2 border-transparent transition-all whitespace-nowrap">RESULTATS</Link>
            </nav>
          </div>
        </header>
        <div className="flex-1 overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
