'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function GestioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Notification state
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: "Nova Incidència: Finca Sud", desc: "L'operari Jordi S. ha enviat una nota de veu.", link: "/gestio/incidencies", muted: false, resolved: false, type: "error" },
    { id: 'n2', title: "Alerta Flota: ITV John Deere 6R", desc: "Caduca en 2 dies — 6 d'Agost.", link: "/gestio/flota", muted: false, resolved: false, type: "warning" },
    { id: 'n3', title: "Estoc Baix: Fertilitzant N-12", desc: "Queden 0 unitats al magatzem central.", link: "/gestio/magatzem", muted: false, resolved: false, type: "info" }
  ]);

  const searchableItems = [
    { id: 's1', title: "Adobat de finques 'La Vall'", category: "Feina", link: "/gestio/feines/mapa", details: "Pendent • Sector 4" },
    { id: 's2', title: "Revisió sistemes de reg", category: "Feina", link: "/gestio/feines/mapa", details: "Programat • Zona Nord" },
    { id: 's3', title: "Tractament fitosanitari", category: "Feina", link: "/gestio/feines/completades", details: "En espera • Masia Vella" },
    { id: 's4', title: "Jordi S. (Operari)", category: "Operari", link: "/gestio/operaris", details: "En camp • Tractor 04" },
    { id: 's5', title: "Carles T. (Operari)", category: "Operari", link: "/gestio/operaris", details: "En camp • Manteniment" },
    { id: 's6', title: "AgroServei Ponent", category: "Client", link: "/gestio/clients", details: "3 finques meves" },
    { id: 's7', title: "Cooperativa d'Ivars", category: "Client", link: "/gestio/clients", details: "Contracte de manteniment" },
    { id: 's8', title: "Fertilitzant N-12", category: "Magatzem", link: "/gestio/magatzem", details: "Estoc baix" },
    { id: 's9', title: "Tractor John Deere 6R", category: "Flota", link: "/gestio/flota", details: "ITV pendent" },
  ];

  const filteredResults = searchQuery.trim() === '' 
    ? [] 
    : searchableItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.details.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeBadgeCount = notifications.filter(n => !n.resolved && !n.muted).length;

  const handleMuteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, muted: !n.muted } : n));
  };

  const handleResolveNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, resolved: true } : n));
  };

  if (pathname === '/gestio/login') {
    return <>{children}</>;
  }

  const navLinks = [
    { name: 'Dashboard', path: '/gestio', icon: 'dashboard' },
    { name: 'Operaris', path: '/gestio/operaris', icon: 'engineering' },
    { name: 'Clients', path: '/gestio/clients', icon: 'group' },
    { name: 'Proveïdors', path: '/gestio/proveidors', icon: 'storefront' },
    { name: 'Magatzem', path: '/gestio/magatzem', icon: 'inventory_2' },
    { name: 'Seguiment Feines', path: '/gestio/feines/mapa', icon: 'map' },
    { name: 'Vehicles / Flota', path: '/gestio/flota', icon: 'local_shipping' },
    { name: 'Incidències', path: '/gestio/incidencies', icon: 'report_problem' },
    { name: 'Comptabilitat & Facturació', path: '/gestio/comptabilitat', icon: 'payments' },
    { name: 'Notificacions Telegram', path: '/gestio/notificacions', icon: 'send' },
    { name: 'Plànols', path: '/gestio/planols', icon: 'architecture' },
    { name: 'Configuració & Auth', path: '/gestio/configuracio', icon: 'settings' },
  ];

  return (
    <div className="bg-surface font-body-base text-on-surface min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-16 md:w-[240px] bg-primary text-on-primary z-50 flex flex-col transition-all duration-200 shadow-xl overflow-hidden hover:w-[240px] md:hover:w-[240px] group">
        <div className="p-4 md:p-md flex items-center gap-sm mb-lg justify-center md:justify-start">
          <img alt="Logo" className="h-8 w-auto object-contain flex-shrink-0" src="https://lh3.googleusercontent.com/aida/AP1WRLsEXFuQ4rmmM6G9GiP2Wc1vF-mvbIxAj1gCebc33OvQEY7pafglJcHcVF_69XfQ1M8JO4wJAGm547Zj0L19kbIe10YNOcBQmYBueHpTMNBGCnoXSQ_alln7Z5WFWt5-Cn97yJ9ffWW7LBpeIOnWV8-8x8PXbHS-fNYeuGaX55ts_6UD_U6P0o4YF6hNTWbkFh-qoGbwhbYw1ZCycoonB_94NWgX5mSb5y8Pa65DRzMGc9oydmf8LpzkT7I"/>
          <span className="font-display-lg text-lg text-white tracking-tight hidden md:inline group-hover:inline whitespace-nowrap">CampoPro</span>
        </div>
        
        <nav className="flex-1 space-y-1 overflow-y-auto">
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
            {/* Header Search Bar (Interactive & Functional) */}
            <div ref={searchContainerRef} className="relative w-full max-w-sm">
              <div className="flex items-center bg-surface-container-low px-md py-xs rounded-lg border border-outline-variant focus-within:border-primary transition-all shadow-sm">
                <span className="material-symbols-outlined text-outline">search</span>
                <input 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  className="bg-transparent border-none outline-none ml-sm w-full text-sm placeholder:text-on-surface-variant/70" 
                  placeholder="Cerca feines, operaris, clients o eines..." 
                  type="text"
                />
                {searchQuery && (
                  <button 
                    onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
                    className="text-on-surface-variant hover:text-primary p-0.5 rounded-full"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-xl shadow-2xl border border-outline-variant/40 overflow-hidden z-50 animate-in fade-in duration-150">
                  <div className="p-xs bg-surface-container-low border-b border-outline-variant/20 flex justify-between items-center text-xs text-on-surface-variant px-md">
                    <span>Resultats per &quot;{searchQuery}&quot;</span>
                    <span>{filteredResults.length} trobats</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-outline-variant/10">
                    {filteredResults.length > 0 ? (
                      filteredResults.map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => {
                            router.push(item.link);
                            setShowSearchResults(false);
                            setSearchQuery('');
                          }}
                          className="p-md hover:bg-primary/5 cursor-pointer transition-colors flex items-center justify-between group"
                        >
                          <div>
                            <p className="font-body-strong text-sm text-primary group-hover:underline">{item.title}</p>
                            <p className="text-xs text-on-surface-variant">{item.details}</p>
                          </div>
                          <span className="text-[10px] font-label-caps font-bold px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded">
                            {item.category}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-lg text-center text-xs text-on-surface-variant">
                        No s'han trobat coincidències
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                {activeBadgeCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {activeBadgeCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="h-16 px-4 md:px-xl flex items-center justify-start gap-xl overflow-x-auto">
            <nav className="flex h-full gap-lg">
              <Link href="/gestio" className={`flex items-center h-full px-sm font-label-caps transition-all whitespace-nowrap ${pathname === '/gestio' ? 'text-secondary-container border-b-2 border-secondary-container font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
                FEINA (DASHBOARD)
              </Link>

              <Link href="/gestio/operaris" className={`flex items-center h-full px-sm font-label-caps transition-all whitespace-nowrap ${pathname === '/gestio/operaris' ? 'text-secondary-container border-b-2 border-secondary-container font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
                OPERARIS
              </Link>

              <Link href="/gestio/feines/crear" className={`flex items-center h-full px-sm font-label-caps transition-all whitespace-nowrap ${pathname === '/gestio/feines/crear' ? 'text-secondary-container border-b-2 border-secondary-container font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
                REDACTAR FEINA
              </Link>

              <Link href="/gestio/feines/mapa" className={`flex items-center h-full px-sm font-label-caps transition-all whitespace-nowrap ${pathname === '/gestio/feines/mapa' ? 'text-secondary-container border-b-2 border-secondary-container font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
                SEGUIMENT MAPA
              </Link>

              <Link href="/gestio/comptabilitat" className={`flex items-center h-full px-sm font-label-caps transition-all whitespace-nowrap ${pathname === '/gestio/comptabilitat' ? 'text-secondary-container border-b-2 border-secondary-container font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
                COMPTABILITAT
              </Link>

              <Link href="/gestio/proveidors" className={`flex items-center h-full px-sm font-label-caps transition-all whitespace-nowrap ${pathname.startsWith('/gestio/proveidors') ? 'text-secondary-container border-b-2 border-secondary-container font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
                PROVEÏDORS
              </Link>

              <Link href="/gestio/configuracio" className={`flex items-center h-full px-sm font-label-caps transition-all whitespace-nowrap ${pathname === '/gestio/configuracio' ? 'text-secondary-container border-b-2 border-secondary-container font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
                CONFIGURACIÓ
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
                  <li><strong>Operaris & Fitxatge Llei:</strong> Registre d'entrada/sortida geolocalitzat.</li>
                  <li><strong>Configuració:</strong> Gestió d'enginyers, caps de personal i permisos d'accés.</li>
                  <li><strong>Redacció de Feines:</strong> Crea ordres i assigna materials/eines.</li>
                </ul>
              </div>
              <button onClick={() => setShowHelpModal(false)} className="mt-5 w-full py-3 bg-primary text-white rounded-xl font-body-strong">
                Entesos
              </button>
            </div>
          </div>
        )}

        {/* Popover: Notifications Bell (🔔) with Mute & Resolved Actions */}
        {showNotificationsModal && (
          <div className="fixed top-16 right-6 z-[100] w-96 bg-surface rounded-2xl p-4 shadow-2xl border border-outline-variant animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-outline-variant/20">
              <h4 className="font-headline-md text-sm text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[20px]">notifications</span>
                Alertes Actives ({notifications.filter(n => !n.resolved).length})
              </h4>
              <button onClick={() => setShowNotificationsModal(false)} className="text-xs text-on-surface-variant hover:text-primary">Tancar</button>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {notifications.filter(n => !n.resolved).length > 0 ? (
                notifications.filter(n => !n.resolved).map((item) => (
                  <div 
                    key={item.id}
                    className={`p-3 rounded-xl border transition-all ${
                      item.muted 
                        ? 'bg-surface-container-low border-outline-variant/30 opacity-70' 
                        : item.type === 'error' 
                          ? 'bg-error-container/10 border-error/20' 
                          : 'bg-orange-50/50 border-orange-200'
                    }`}
                  >
                    <div 
                      onClick={() => { setShowNotificationsModal(false); router.push(item.link); }}
                      className="cursor-pointer mb-2"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className={`font-bold text-xs ${item.muted ? 'text-on-surface-variant' : item.type === 'error' ? 'text-error' : 'text-secondary'}`}>
                          {item.title}
                        </p>
                        {item.muted && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-surface-container-high rounded text-on-surface-variant flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">volume_off</span> Silenciat
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant">{item.desc}</p>
                    </div>

                    {/* Action buttons: Silenciar & Tasca resolta */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                      <button
                        onClick={(e) => handleMuteNotification(item.id, e)}
                        className="px-2.5 py-1 text-[11px] font-body-strong rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant flex items-center gap-1 transition-colors"
                        title={item.muted ? "Activar so/alertes" : "Silenciar aquesta alerta"}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {item.muted ? 'volume_up' : 'volume_off'}
                        </span>
                        {item.muted ? 'Activar' : 'Silenciar'}
                      </button>

                      <button
                        onClick={(e) => handleResolveNotification(item.id, e)}
                        className="px-2.5 py-1 text-[11px] font-body-strong rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center gap-1 transition-colors shadow-xs"
                        title="Marcar tasca com a resolta"
                      >
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Tasca resolta
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-on-surface-variant flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-3xl">task_alt</span>
                  <span>🎉 Totes les notificacions estan resoltes!</span>
                </div>
              )}
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

