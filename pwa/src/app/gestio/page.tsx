'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  // Dynamic Date & Greeting State
  const [dateTimeInfo, setDateTimeInfo] = useState({
    greeting: 'Bon dia',
    formattedDate: '',
    dayNum: '',
    monthStr: '',
    yearNum: ''
  });

  // Kanban Tasks State (Interactive & Dynamic)
  const [kanbanTasks, setKanbanTasks] = useState([
    { id: 'kt-1', code: '#OT-440', title: "Adobat de finques 'La Vall'", location: "Sector 4 - Polígon 12", operator: "Jordi S.", status: "PENDENT", priority: "Alta", dateOffset: 0 },
    { id: 'kt-2', code: '#OT-441', title: "Revisió sistemes de reg", location: "Zona Nord - Bassa 2", operator: "Carles T.", status: "EN_CURS", priority: "Mitjana", dateOffset: 1 },
    { id: 'kt-3', code: '#OT-443', title: "Sembrat i anivellat de terra", location: "Sector B4 - Camp Sud", operator: "Marc M.", status: "EN_CURS", priority: "Alta", dateOffset: 1 },
    { id: 'kt-4', code: '#OT-442', title: "Tractament fitosanitari", location: "Finca Masia Vella", operator: "Maria P.", status: "COMPLETAT", priority: "Normal", dateOffset: 2 },
  ]);

  // View toggle for jobs: Kanban vs Llista
  const [activeView, setActiveView] = useState<'kanban' | 'llista'>('kanban');

  // Maintenance Alerts State (3 Critical with "Resolt" button)
  const [maintenanceAlerts, setMaintenanceAlerts] = useState([
    { id: 'm1', title: "Caducitat ITV: John Deere 6R", detail: "Falten 2 dies — Requerit urgent", icon: "directions_car", link: "/gestio/flota", actionText: "RESERVAR" },
    { id: 'm2', title: "Nivell Oli Motor Crític: Fendt 724", detail: "Sensor GPS: Pressió d'oli sota el mínim permès", icon: "build", link: "/gestio/flota", actionText: "REVISAR" },
    { id: 'm3', title: "Estoc buit: Fertilitzant N-12", detail: "Queden 0 unitats al magatzem central", icon: "inventory_2", link: "/gestio/magatzem", actionText: "DISSENYAR ORDRE" }
  ]);

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    
    let g = 'Bon dia';
    if (hour >= 20 || hour < 6) {
      g = 'Bona nit';
    } else if (hour >= 13) {
      g = 'Bona tarda';
    }

    // Format date in Catalan: "Dimarts, 4 d'Agost de 2026"
    const formatted = now.toLocaleDateString('ca-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    // Capitalize first letter of string
    const capFormatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    
    const day = String(now.getDate()).padStart(2, '0');
    const month = now.toLocaleDateString('ca-ES', { month: 'short' }).toUpperCase().replace('.', '');
    const year = String(now.getFullYear());

    setDateTimeInfo({
      greeting: g,
      formattedDate: capFormatted,
      dayNum: day,
      monthStr: month,
      yearNum: year
    });
  }, []);

  // Helper to format date offset relative to today
  const getFormattedDateForOffset = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleDateString('ca-ES', { month: 'short' }).toUpperCase().replace('.', '');
    return { day, month };
  };

  // Move task status in Kanban
  const moveTaskStatus = (id: string, newStatus: string) => {
    setKanbanTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  // Mark maintenance alert as resolved
  const resolveAlert = (id: string) => {
    setMaintenanceAlerts(prev => prev.filter(a => a.id !== id));
  };

  const pendingCount = kanbanTasks.filter(t => t.status === 'PENDENT').length;
  const inProgressCount = kanbanTasks.filter(t => t.status === 'EN_CURS').length;
  const completedCount = kanbanTasks.filter(t => t.status === 'COMPLETAT').length;

  return (
    <>
      <main className="relative pt-6 px-4 md:px-xl pb-xl bg-surface min-h-screen">
        <div className="flex flex-col w-full gap-xl">
          {/* Header Section (Updated with night/day greeting & dynamic date, no breadcrumb caseta, no orange bar) */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xs">
            <div className="flex flex-col gap-xs">
              <h1 className="font-display-lg text-display-lg text-primary tracking-tight flex items-center gap-2">
                {dateTimeInfo.greeting}, Marc {dateTimeInfo.greeting.includes('nit') ? '🌙' : '👋'}
              </h1>
              <p className="text-on-surface-variant font-body-base">
                {dateTimeInfo.formattedDate || "Carregant data..."}
              </p>
            </div>
            <div className="flex items-center gap-md">
              <button 
                onClick={() => router.push('/gestio/feines/crear')}
                className="px-md py-sm bg-primary text-on-primary rounded-lg font-body-strong flex items-center gap-sm shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                Nova Ordre de Treball
              </button>
            </div>
          </header>

          {/* KPI Grid: Interactive Cards responding to live logic */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
            {/* KPI 1 */}
            <div 
              onClick={() => router.push('/gestio/feines/mapa')}
              className="group relative overflow-hidden bg-surface-container-lowest p-xl rounded-xl shadow-sm border-b-2 border-primary transition-all hover:shadow-md cursor-pointer"
            >
              <div className="flex justify-between items-start mb-md">
                <div className="p-sm bg-primary/5 rounded-lg text-primary">
                  <span className="material-symbols-outlined">assignment</span>
                </div>
                <span className="text-xs font-label-caps text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {pendingCount + inProgressCount} Actives
                </span>
              </div>
              <h3 className="font-label-caps text-on-surface-variant mb-xs">FEINES AVUI</h3>
              <div className="flex items-baseline gap-xs">
                <span className="font-display-lg text-display-lg text-primary">{kanbanTasks.length}</span>
                <span className="text-on-surface-variant font-body-base">assignades</span>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-[96px]">assignment</span>
              </div>
            </div>

            {/* KPI 2 */}
            <div 
              onClick={() => router.push('/gestio/feines/mapa')}
              className="group relative overflow-hidden bg-surface-container-lowest p-xl rounded-xl shadow-sm border-b-2 border-green-500 transition-all hover:shadow-md cursor-pointer"
            >
              <div className="flex justify-between items-start mb-md">
                <div className="p-sm bg-green-50 rounded-lg text-green-600">
                  <span className="material-symbols-outlined animate-pulse">engineering</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                  <span className="text-xs font-label-caps text-green-600">En directe</span>
                </div>
              </div>
              <h3 className="font-label-caps text-on-surface-variant mb-xs">OPERARIS ACTIUS</h3>
              <div className="flex items-baseline gap-xs">
                <span className="font-display-lg text-display-lg text-on-surface">12</span>
                <span className="text-on-surface-variant font-body-base">al camp</span>
              </div>
            </div>

            {/* KPI 3 */}
            <div 
              onClick={() => router.push('/gestio/incidencies')}
              className="group relative overflow-hidden bg-surface-container-lowest p-xl rounded-xl shadow-sm border-b-2 border-secondary-container transition-all hover:shadow-md cursor-pointer"
            >
              <div className="flex justify-between items-start mb-md">
                <div className="p-sm bg-orange-50 rounded-lg text-orange-600">
                  <span className="material-symbols-outlined">report_problem</span>
                </div>
                <span className="text-xs font-label-caps text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Prioritat alta</span>
              </div>
              <h3 className="font-label-caps text-on-surface-variant mb-xs">ALERTES MANTENIMENT</h3>
              <div className="flex items-baseline gap-xs">
                <span className="font-display-lg text-display-lg text-on-surface">{maintenanceAlerts.length}</span>
                <span className="text-on-surface-variant font-body-base">pendents</span>
              </div>
            </div>

            {/* KPI 4 */}
            <div 
              onClick={() => router.push('/gestio/feines/completades')}
              className="group relative overflow-hidden bg-surface-container-lowest p-xl rounded-xl shadow-sm border-b-2 border-primary-container transition-all hover:shadow-md cursor-pointer"
            >
              <div className="flex justify-between items-start mb-md">
                <div className="p-sm bg-purple-50 rounded-lg text-purple-600">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <span className="text-xs font-label-caps text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">92% objectiu</span>
              </div>
              <h3 className="font-label-caps text-on-surface-variant mb-xs">FACTURACIÓ MES</h3>
              <div className="flex items-baseline gap-xs">
                <span className="font-display-lg text-display-lg text-on-surface">12.450 €</span>
              </div>
            </div>
          </section>

          {/* Interactive Kanban Board for Real Data */}
          <section className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm pb-sm border-b border-outline-variant/20">
              <div className="flex items-center gap-md">
                <h2 className="font-section-title text-section-title text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">view_kanban</span>
                  Kanban d'Ordres de Treball
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-xs">
                  {kanbanTasks.length} Feines Reals
                </span>
              </div>

              <div className="flex items-center gap-2 bg-surface-container p-1 rounded-lg">
                <button 
                  onClick={() => setActiveView('kanban')}
                  className={`px-3 py-1 text-xs font-body-strong rounded-md transition-all ${activeView === 'kanban' ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  Vista Kanban
                </button>
                <button 
                  onClick={() => setActiveView('llista')}
                  className={`px-3 py-1 text-xs font-body-strong rounded-md transition-all ${activeView === 'llista' ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  Vista Llista
                </button>
              </div>
            </div>

            {activeView === 'kanban' ? (
              /* 3 Column Kanban Board */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                {/* Column 1: Pendent */}
                <div className="bg-surface-container-low/60 p-md rounded-xl border border-outline-variant/20 flex flex-col gap-sm">
                  <div className="flex items-center justify-between pb-xs border-b border-outline-variant/20">
                    <span className="font-body-strong text-sm text-orange-700 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-orange-500 rounded-full"></span>
                      PENDENT
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full">
                      {pendingCount}
                    </span>
                  </div>

                  <div className="space-y-sm min-h-[140px]">
                    {kanbanTasks.filter(t => t.status === 'PENDENT').map(task => (
                      <div key={task.id} className="bg-surface p-md rounded-lg border border-outline-variant/30 shadow-xs flex flex-col gap-2 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <span className="text-[11px] font-bold text-primary">{task.code}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded">
                            {task.priority}
                          </span>
                        </div>
                        <h4 className="font-body-strong text-sm text-on-surface">{task.title}</h4>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          {task.location}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10 text-xs">
                          <span className="text-on-surface-variant">👤 {task.operator}</span>
                          <button 
                            onClick={() => moveTaskStatus(task.id, 'EN_CURS')}
                            className="px-2 py-1 text-[11px] bg-primary text-white rounded font-body-strong hover:bg-primary-container transition-colors flex items-center gap-1"
                          >
                            Iniciar <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                          </button>
                        </div>
                      </div>
                    ))}
                    {pendingCount === 0 && (
                      <div className="p-lg text-center text-xs text-on-surface-variant border-2 border-dashed border-outline-variant/30 rounded-lg">
                        Sense feines pendents
                      </div>
                    )}
                  </div>
                </div>

                {/* Column 2: En Curs */}
                <div className="bg-surface-container-low/60 p-md rounded-xl border border-outline-variant/20 flex flex-col gap-sm">
                  <div className="flex items-center justify-between pb-xs border-b border-outline-variant/20">
                    <span className="font-body-strong text-sm text-blue-700 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping"></span>
                      EN CURS
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                      {inProgressCount}
                    </span>
                  </div>

                  <div className="space-y-sm min-h-[140px]">
                    {kanbanTasks.filter(t => t.status === 'EN_CURS').map(task => (
                      <div key={task.id} className="bg-surface p-md rounded-lg border border-blue-200 shadow-xs flex flex-col gap-2 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <span className="text-[11px] font-bold text-primary">{task.code}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
                            {task.priority}
                          </span>
                        </div>
                        <h4 className="font-body-strong text-sm text-on-surface">{task.title}</h4>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          {task.location}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10 text-xs">
                          <span className="text-on-surface-variant">👤 {task.operator}</span>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => moveTaskStatus(task.id, 'PENDENT')}
                              className="px-2 py-1 text-[11px] bg-surface-container-high text-on-surface-variant rounded hover:bg-surface-container-highest"
                              title="Tornar a Pendent"
                            >
                              <span className="material-symbols-outlined text-[12px]">arrow_back</span>
                            </button>
                            <button 
                              onClick={() => moveTaskStatus(task.id, 'COMPLETAT')}
                              className="px-2 py-1 text-[11px] bg-green-600 text-white rounded font-body-strong hover:bg-green-700 transition-colors flex items-center gap-1"
                            >
                              Finalitzar <span className="material-symbols-outlined text-[12px]">check</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {inProgressCount === 0 && (
                      <div className="p-lg text-center text-xs text-on-surface-variant border-2 border-dashed border-outline-variant/30 rounded-lg">
                        Cap feina en curs
                      </div>
                    )}
                  </div>
                </div>

                {/* Column 3: Completat */}
                <div className="bg-surface-container-low/60 p-md rounded-xl border border-outline-variant/20 flex flex-col gap-sm">
                  <div className="flex items-center justify-between pb-xs border-b border-outline-variant/20">
                    <span className="font-body-strong text-sm text-green-700 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                      COMPLETAT
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                      {completedCount}
                    </span>
                  </div>

                  <div className="space-y-sm min-h-[140px]">
                    {kanbanTasks.filter(t => t.status === 'COMPLETAT').map(task => (
                      <div key={task.id} className="bg-surface p-md rounded-lg border border-green-200 shadow-xs flex flex-col gap-2 opacity-90 hover:opacity-100 transition-opacity">
                        <div className="flex justify-between items-start">
                          <span className="text-[11px] font-bold text-primary">{task.code}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-green-50 text-green-600 rounded">
                            Resolt
                          </span>
                        </div>
                        <h4 className="font-body-strong text-sm text-on-surface line-through text-on-surface-variant">{task.title}</h4>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          {task.location}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10 text-xs">
                          <span className="text-on-surface-variant">👤 {task.operator}</span>
                          <button 
                            onClick={() => moveTaskStatus(task.id, 'EN_CURS')}
                            className="px-2 py-1 text-[11px] bg-surface-container-high text-on-surface-variant rounded hover:bg-surface-container-highest"
                            title="Reobrir feina"
                          >
                            Reobrir
                          </button>
                        </div>
                      </div>
                    ))}
                    {completedCount === 0 && (
                      <div className="p-lg text-center text-xs text-on-surface-variant border-2 border-dashed border-outline-variant/30 rounded-lg">
                        Encara cap feina finalitzada
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* List View fallback */
              <div className="divide-y divide-outline-variant/10">
                {kanbanTasks.map(task => (
                  <div key={task.id} className="p-md hover:bg-surface-container-low flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-primary mr-2">{task.code}</span>
                      <span className="font-body-strong text-sm text-on-surface">{task.title}</span>
                      <p className="text-xs text-on-surface-variant">{task.location} • Assignat a {task.operator}</p>
                    </div>
                    <div className="flex items-center gap-md">
                      <span className={`px-2.5 py-0.5 text-xs rounded-full font-bold ${
                        task.status === 'PENDENT' ? 'bg-orange-100 text-orange-800' :
                        task.status === 'EN_CURS' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Main Content: Map & Upcoming Jobs */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-xl">
            {/* Map Preview (60%) */}
            <section className="lg:col-span-6 flex flex-col gap-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-md">
                  <h2 className="font-section-title text-section-title text-primary">Seguiment de Colles en Temps Real</h2>
                  <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant font-label-caps text-[10px]">TEMPS REAL</span>
                </div>
                <button 
                  onClick={() => router.push('/gestio/feines/mapa')}
                  className="text-primary font-body-strong flex items-center gap-xs hover:underline text-sm cursor-pointer"
                >
                  Veure mapa complet
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>

              <div 
                onClick={() => router.push('/gestio/feines/mapa')}
                className="relative group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm h-[420px] border border-outline-variant/30 cursor-pointer"
              >
                <div className="w-full h-full bg-cover bg-center grayscale-[0.2] contrast-[1.05]" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCvbJjUps0q9YpuQkGaY5sRz2m_ti7khbFlM6-CHmI8ykOmRLmMra7akOY7vF9x65dHzRdZQqeacIz_LPhVHInJ6E5g_v9awm4ReTUw-3hPNQx830GX3GzrxqwDyK6kSXn8aKLHSmKwRXY8OuBTccG5OdGUf_k9PET1PNq96ySs7M2WQDY9UzJh9kW2ZeGatQwHH-6Msl2sF7P22CxWNJs7BHja5JGG0qkVly74n-qHHixvQx472LXu')` }}></div>
                
                {/* Floating Map Overlays */}
                <div className="absolute top-md left-md flex flex-col gap-sm">
                  <div className="bg-surface/90 backdrop-blur-md p-md rounded-lg shadow-xl border border-white/20">
                    <div className="flex items-center gap-md mb-sm">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
                        <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                      </div>
                      <div>
                        <p className="text-xs font-body-strong">Colla B - Tractor 04</p>
                        <p className="text-[10px] text-on-surface-variant">Sessió: Sembrat de blat</p>
                      </div>
                    </div>
                    <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[65%] transition-all duration-1000"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-md right-md bg-primary text-on-primary px-md py-sm rounded-full shadow-lg flex items-center gap-md">
                  <span className="material-symbols-outlined text-green-400 animate-pulse">sensors</span>
                  <span className="text-xs font-body-strong">12 Sensores actius</span>
                </div>
              </div>
            </section>

            {/* Upcoming Jobs with Dynamic Updated Calendar Dates (40%) */}
            <section className="lg:col-span-4 flex flex-col gap-md">
              <div className="flex items-center justify-between">
                <h2 className="font-section-title text-section-title text-primary">Properes feines</h2>
                <Link href="/gestio/feines/mapa" className="material-symbols-outlined text-outline cursor-pointer hover:text-primary">more_vert</Link>
              </div>

              <div className="flex flex-col gap-sm">
                {/* Dynamic Calendar Job Card 1 */}
                {(() => {
                  const d1 = getFormattedDateForOffset(0);
                  return (
                    <div 
                      onClick={() => router.push('/gestio/feines/crear')}
                      className="bg-surface-container-lowest p-md rounded-xl border-l-4 border-secondary-container shadow-sm flex gap-md items-center group hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <div className="flex-shrink-0 text-center w-12 py-2 bg-surface-container rounded-lg group-hover:bg-white transition-colors">
                        <p className="text-[10px] font-label-caps text-on-surface-variant">{d1.month}</p>
                        <p className="text-lg font-display-lg text-primary">{d1.day}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-xs">
                          <h4 className="font-body-strong text-primary truncate">Adobat de finques 'La Vall'</h4>
                          <span className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-label-caps bg-orange-50 text-orange-600 font-bold">PENDENT</span>
                        </div>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          Sector 4 - Polígon 12
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Dynamic Calendar Job Card 2 */}
                {(() => {
                  const d2 = getFormattedDateForOffset(1);
                  return (
                    <div 
                      onClick={() => router.push('/gestio/feines/mapa')}
                      className="bg-surface-container-lowest p-md rounded-xl border-l-4 border-primary shadow-sm flex gap-md items-center group hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <div className="flex-shrink-0 text-center w-12 py-2 bg-surface-container rounded-lg group-hover:bg-white transition-colors">
                        <p className="text-[10px] font-label-caps text-on-surface-variant">{d2.month}</p>
                        <p className="text-lg font-display-lg text-primary">{d2.day}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-xs">
                          <h4 className="font-body-strong text-primary truncate">Revisió sistemes de reg</h4>
                          <span className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-label-caps bg-blue-50 text-blue-600 font-bold">PROGRAMAT</span>
                        </div>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          Zona Nord - Bassa 2
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Dynamic Calendar Job Card 3 */}
                {(() => {
                  const d3 = getFormattedDateForOffset(2);
                  return (
                    <div 
                      onClick={() => router.push('/gestio/feines/completades')}
                      className="bg-surface-container-lowest p-md rounded-xl border-l-4 border-primary-container shadow-sm flex gap-md items-center group hover:bg-surface-container-low transition-colors opacity-80 cursor-pointer"
                    >
                      <div className="flex-shrink-0 text-center w-12 py-2 bg-surface-container rounded-lg">
                        <p className="text-[10px] font-label-caps text-on-surface-variant">{d3.month}</p>
                        <p className="text-lg font-display-lg text-primary">{d3.day}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-xs">
                          <h4 className="font-body-strong text-primary truncate">Tractament fitosanitari</h4>
                          <span className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-label-caps bg-surface-container-highest text-outline">EN ESPERA</span>
                        </div>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          Finca Masia Vella
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <button 
                onClick={() => router.push('/gestio/feines/crear')}
                className="w-full py-md border-2 border-dashed border-outline-variant rounded-xl text-outline font-body-strong hover:bg-surface-container-low hover:text-primary hover:border-primary transition-all cursor-pointer"
              >
                + Redactar nova feina
              </button>
            </section>
          </div>

          {/* Bottom Section: Maintenance Alerts (With "Resolt" button & 3 Critical Items) & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl mb-xl">
            {/* Maintenance Alerts */}
            <section className="flex flex-col gap-md">
              <div className="flex items-center justify-between">
                <h2 className="font-section-title text-section-title text-primary flex items-center gap-md">
                  Alertes de Manteniment
                  {maintenanceAlerts.length > 0 ? (
                    <span className="bg-error text-on-error px-2.5 py-0.5 rounded-full text-[10px] font-label-caps font-bold animate-pulse">
                      {maintenanceAlerts.length} CRÍTIQUES
                    </span>
                  ) : (
                    <span className="bg-green-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-label-caps font-bold">
                      TOT RESOLT
                    </span>
                  )}
                </h2>
              </div>
              
              <div className="space-y-sm">
                {maintenanceAlerts.length > 0 ? (
                  maintenanceAlerts.map((alert) => (
                    <div 
                      key={alert.id}
                      className="bg-error-container/10 p-md rounded-xl flex items-center justify-between gap-md group hover:bg-error-container/20 transition-all border border-error/20"
                    >
                      <div 
                        onClick={() => router.push(alert.link)} 
                        className="flex items-center gap-md flex-1 cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-full bg-error text-on-error flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined">{alert.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-body-strong text-on-error-container">{alert.title}</p>
                          <p className="text-xs text-on-error-container/70 font-body-base">{alert.detail}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-sm">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            resolveAlert(alert.id);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-md py-1.5 rounded-lg text-xs font-body-strong flex items-center gap-1 transition-colors shadow-xs"
                          title="Marcar alerta com a resolta"
                        >
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          Resolt
                        </button>

                        <button 
                          onClick={() => router.push(alert.link)}
                          className="bg-error hover:bg-error/90 text-white px-sm py-1.5 rounded-lg text-xs font-body-strong transition-colors"
                        >
                          {alert.actionText}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-xl bg-surface-container-lowest border border-green-200 rounded-xl text-center flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
                    <p className="font-body-strong text-sm text-green-700">Totes les alertes de manteniment han estat resoltes!</p>
                  </div>
                )}
              </div>
            </section>

            {/* Recent Activity */}
            <section className="flex flex-col gap-md">
              <h2 className="font-section-title text-section-title text-primary">Activitat recent</h2>
              <div className="relative pl-8 space-y-lg before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container-highest">
                <div className="relative">
                  <span className="absolute -left-8 w-6 h-6 rounded-full bg-primary border-4 border-surface flex items-center justify-center">
                    <span className="w-1 h-1 bg-white rounded-full"></span>
                  </span>
                  <div className="bg-white p-md rounded-xl shadow-sm border border-outline-variant/30">
                    <p className="text-sm font-body-base text-on-surface">
                      <span className="font-body-strong">Jordi S.</span> ha completat la feina 
                      <span className="text-primary font-body-strong underline decoration-primary/30"> #OT-442</span>
                    </p>
                    <p className="text-[11px] text-on-surface-variant mt-1">Fa 15 minuts • Sector C-12</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
