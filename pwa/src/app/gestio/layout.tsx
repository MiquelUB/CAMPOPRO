'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function GestioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  if (pathname === '/gestio/login') {
    return <>{children}</>;
  }

  const navLinks = [
    { name: 'Dashboard', path: '/gestio', icon: 'dashboard' },
    { name: 'Clients', path: '/gestio/clients', icon: 'group' },
    { name: 'Magatzem', path: '/gestio/magatzem', icon: 'inventory_2' },
    { name: 'Seguiment Feines', path: '/gestio/feines/mapa', icon: 'map' },
    { name: 'Vehicles / Flota', path: '/gestio/flota', icon: 'local_shipping' },
    { name: 'Incidències', path: '/gestio/incidencies', icon: 'report_problem' },
    { name: 'Notificacions Telegram', path: '/gestio/notificacions', icon: 'send' },
    { name: 'Plànols', path: '/gestio/planols', icon: 'architecture' },
  ];

  return (
    <div className="bg-surface font-body-base text-on-surface min-h-screen">
      {/* Sidebar Navigation */}
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
                className={`flex items-center px-4 md:px-md py-sm transition-colors gap-md ${isActive ? 'border-l-4 border-secondary-container bg-primary-container text-white font-bold' : 'text-on-primary-container hover:bg-primary-container hover:text-white border-l-4 border-transparent'}`}
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
            <span className="text-xs text-on-primary-container">Enginyer de Camp</span>
          </div>
        </div>
      </aside>
      
      {/* Header Container */}
      <div className="pl-16 md:pl-[240px] flex flex-col min-h-screen">
        <header className="sticky top-0 h-32 bg-surface/80 backdrop-blur-md z-40 flex flex-col shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="h-16 px-4 md:px-xl flex items-center justify-between border-b border-surface-container-highest">
            <div className="flex items-center bg-surface-container-low px-md py-xs rounded-lg w-full max-w-sm border border-outline-variant">
              <span className="material-symbols-outlined text-outline">search</span>
              <input className="bg-transparent border-none outline-none ml-sm w-full text-sm" placeholder="Cerca feines, clients o eines..." type="text"/>
            </div>

            {/* Header Right Action Icons */}
            <div className="flex items-center gap-md ml-4">
              {/* Help Icon (?) */}
              <button 
                onClick={() => setShowHelpModal(!showHelpModal)} 
                className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors relative"
                title="Ajuda i Suport de la Plataforma"
              >
                <span className="material-symbols-outlined text-[22px]">help</span>
              </button>

              {/* Notification Icon (Bell) */}
              <button 
                onClick={() => setShowNotificationsModal(!showNotificationsModal)} 
                className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors relative"
                title="Alertes de Notificació"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full animate-ping"></span>
              </button>
            </div>
          </div>

          <div className="h-16 px-4 md:px-xl flex items-center justify-start gap-xl overflow-x-auto">
            <nav className="flex h-full gap-lg">
              <Link href="/gestio" className={`flex items-center h-full px-sm font-label-caps transition-all whitespace-nowrap ${pathname === '/gestio' ? 'text-secondary-container border-b-2 border-secondary-container font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
                FEINA (DASHBOARD)
              </Link>
              <Link href="/gestio/feines/crear" className={`flex items-center h-full px-sm font-label-caps transition-all whitespace-nowrap ${pathname === '/gestio/feines/crear' ? 'text-secondary-container border-b-2 border-secondary-container font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
                REDACTAR FEINA
              </Link>
              <Link href="/gestio/feines/mapa" className={`flex items-center h-full px-sm font-label-caps transition-all whitespace-nowrap ${pathname === '/gestio/feines/mapa' ? 'text-secondary-container border-b-2 border-secondary-container font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
                SEGUIMENT MAPA
              </Link>
              <Link href="/gestio/feines/completades" className={`flex items-center h-full px-sm font-label-caps transition-all whitespace-nowrap ${pathname === '/gestio/feines/completades' ? 'text-secondary-container border-b-2 border-secondary-container font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
                RESULTATS
              </Link>
            </nav>
          </div>
        </header>

        {/* Modal: Help & Documentation (?) */}
        {showHelpModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
            <div className="bg-surface rounded-2xl p-6 max-w-md w-full shadow-2xl border border-outline-variant">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined">help</span>
                  <h3 className="font-headline-md text-headline-md">Ajuda i Suport CampoPro</h3>
                </div>
                <button onClick={() => setShowHelpModal(false)} className="text-on-surface-variant hover:text-primary">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="space-y-3 text-sm text-on-surface-variant leading-relaxed">
                <p><strong>Aquesta icona (?)</strong> ofereix l'accés directe al manual d'usuari i la guia del Portal d'Enginyer de CampoPro.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Redacció de Feines:</strong> Crea ordres i assigna materials/eines.</li>
                  <li><strong>Seguiment en Mapa:</strong> Monitoritza les colles sobre el terreny.</li>
                  <li><strong>Telegram:</strong> Comunicació directa amb clients via Bot.</li>
                </ul>
              </div>
              <button onClick={() => setShowHelpModal(false)} className="mt-5 w-full py-3 bg-primary text-white rounded-xl font-body-strong">
                Entesos
              </button>
            </div>
          </div>
        )}

        {/* Popover: Notifications Bell (🔔) */}
        {showNotificationsModal && (
          <div className="fixed top-16 right-6 z-[100] w-80 bg-surface rounded-2xl p-4 shadow-2xl border border-outline-variant animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-headline-md text-sm text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-error">notifications</span>
                Notificacions Actives
              </h4>
              <button onClick={() => setShowNotificationsModal(false)} className="text-xs text-on-surface-variant">Tancar</button>
            </div>
            <div className="space-y-2 text-xs">
              <div onClick={() => { setShowNotificationsModal(false); router.push('/gestio/incidencies'); }} className="p-3 bg-error-container/10 border border-error/20 rounded-xl cursor-pointer hover:bg-error-container/20">
                <p className="font-bold text-error">Nova Incidència: Finca Sud</p>
                <p className="text-on-surface-variant">L'operari Jordi S. ha enviat una nota de veu.</p>
              </div>
              <div onClick={() => { setShowNotificationsModal(false); router.push('/gestio/notificacions'); }} className="p-3 bg-blue-50 border border-blue-200 rounded-xl cursor-pointer hover:bg-blue-100">
                <p className="font-bold text-blue-800">Bot Telegram: Resposta Client</p>
                <p className="text-on-surface-variant">Agro Riera SL ha confirmat l'arribada.</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
