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

  // Unified Kanban & Upcoming Tasks State (Structured by Date)
  const [kanbanTasks, setKanbanTasks] = useState<any[]>([]);

  // View toggle for jobs: Kanban vs Llista
  const [activeView, setActiveView] = useState<'kanban' | 'llista'>('kanban');

  // Maintenance Alerts State (3 Critical with "Resolt" button)
  const [maintenanceAlerts, setMaintenanceAlerts] = useState<any[]>([]);

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    
    let g = 'Bon dia';
    if (hour >= 20 || hour < 6) {
      g = 'Bona nit';
    } else if (hour >= 13) {
      g = 'Bona tarda';
    }

    const formatted = now.toLocaleDateString('ca-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
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

  // Toggle Incident status on a completed task
  const toggleIncidentStatus = (id: string) => {
    setKanbanTasks(prev => prev.map(t => t.id === id ? { ...t, hasIncident: !t.hasIncident } : t));
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
          {/* Header Section */}
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

          {/* KPI Grid */}
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
              onClick={() => router.push('/gestio/comptabilitat')}
              className="group relative overflow-hidden bg-surface-container-lowest p-xl rounded-xl shadow-sm border-b-2 border-primary-container transition-all hover:shadow-md cursor-pointer"
            >
              <div className="flex justify-between items-start mb-md">
                <div className="p-sm bg-purple-50 rounded-lg text-purple-600">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <span className="text-xs font-label-caps text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                  {kanbanTasks.filter(t => t.status === 'COMPLETAT' && !t.hasIncident).length} a Facturació
                </span>
              </div>
              <h3 className="font-label-caps text-on-surface-variant mb-xs">FACTURACIÓ MES</h3>
              <div className="flex items-baseline gap-xs">
                <span className="font-display-lg text-display-lg text-on-surface">12.450 €</span>
              </div>
            </div>
          </section>

          {/* Unified Kanban Block: "Ordres de treball" (Structured by Dates, with Nova Ordre button & Incident -> Billing Logic) */}
          <section className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm pb-sm border-b border-outline-variant/20">
              <div className="flex items-center gap-md">
                <h2 className="font-section-title text-section-title text-primary">
                  Ordres de treball
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-xs">
                  Estructurat per dates ({kanbanTasks.length})
                </span>
              </div>

              <div className="flex items-center gap-md">
                <button 
                  onClick={() => router.push('/gestio/feines/crear')}
                  className="px-md py-1.5 bg-primary text-white rounded-lg text-xs font-body-strong flex items-center gap-1 shadow-xs hover:bg-primary-container transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Nova ordre de treball
                </button>

                <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg">
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
            </div>

            {activeView === 'kanban' ? (
              /* 3 Column Kanban Board: PENDENT/PROPERES | EN CURS | COMPLETAT */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                
                {/* Column 1: Pendent / Properes (Structured by Date) */}
                <div className="bg-surface-container-low/60 p-md rounded-xl border border-outline-variant/20 flex flex-col gap-sm">
                  <div className="flex items-center justify-between pb-xs border-b border-outline-variant/20">
                    <span className="font-body-strong text-sm text-orange-700 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-orange-500 rounded-full"></span>
                      PENDENT / PROPERES
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full">
                      {pendingCount}
                    </span>
                  </div>

                  <div className="space-y-sm min-h-[160px]">
                    {kanbanTasks
                      .filter(t => t.status === 'PENDENT')
                      .sort((a, b) => a.dateOffset - b.dateOffset)
                      .map(task => {
                        const dateBadge = getFormattedDateForOffset(task.dateOffset);
                        return (
                          <div key={task.id} className="bg-surface p-md rounded-lg border border-outline-variant/30 shadow-xs flex flex-col gap-2 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center">
                              {/* Date Badge */}
                              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 rounded text-primary text-xs font-bold">
                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                <span>{dateBadge.day} {dateBadge.month}</span>
                              </div>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded">
                                {task.priority}
                              </span>
                            </div>

                            <div>
                              <span className="text-[11px] font-bold text-on-surface-variant block">{task.code}</span>
                              <h4 className="font-body-strong text-sm text-on-surface">{task.title}</h4>
                            </div>

                            <p className="text-xs text-on-surface-variant flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">location_on</span>
                              {task.location}
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10 text-xs">
                              <span className="text-on-surface-variant">👤 {task.operator}</span>
                              <button 
                                onClick={() => moveTaskStatus(task.id, 'EN_CURS')}
                                className="px-2.5 py-1 text-[11px] bg-primary text-white rounded-lg font-body-strong hover:bg-primary-container transition-colors flex items-center gap-1"
                              >
                                Iniciar <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}

                    {pendingCount === 0 && (
                      <div className="p-lg text-center text-xs text-on-surface-variant border-2 border-dashed border-outline-variant/30 rounded-lg">
                        Sense feines pendents
                      </div>
                    )}

                    <button 
                      onClick={() => router.push('/gestio/feines/crear')}
                      className="w-full py-2 border border-dashed border-outline-variant rounded-lg text-xs text-primary font-body-strong hover:bg-primary/5 transition-colors flex items-center justify-center gap-1 mt-2"
                    >
                      <span className="material-symbols-outlined text-[14px]">add</span>
                      Afegir ordre de treball
                    </button>
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

                  <div className="space-y-sm min-h-[160px]">
                    {kanbanTasks.filter(t => t.status === 'EN_CURS').map(task => {
                      const dateBadge = getFormattedDateForOffset(task.dateOffset);
                      return (
                        <div key={task.id} className="bg-surface p-md rounded-lg border border-blue-200 shadow-xs flex flex-col gap-2 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 rounded text-blue-700 text-xs font-bold">
                              <span className="material-symbols-outlined text-[14px]">schedule</span>
                              <span>{dateBadge.day} {dateBadge.month}</span>
                            </div>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                              Activa
                            </span>
                          </div>

                          <div>
                            <span className="text-[11px] font-bold text-on-surface-variant block">{task.code}</span>
                            <h4 className="font-body-strong text-sm text-on-surface">{task.title}</h4>
                          </div>

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
                                className="px-2.5 py-1 text-[11px] bg-green-600 text-white rounded-lg font-body-strong hover:bg-green-700 transition-colors flex items-center gap-1"
                              >
                                Finalitzar <span className="material-symbols-outlined text-[12px]">check</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {inProgressCount === 0 && (
                      <div className="p-lg text-center text-xs text-on-surface-variant border-2 border-dashed border-outline-variant/30 rounded-lg">
                        Cap feina en curs
                      </div>
                    )}
                  </div>
                </div>

                {/* Column 3: Completat (Valoració d'Incidència & Passa a Facturació) */}
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

                  <div className="space-y-sm min-h-[160px]">
                    {kanbanTasks.filter(t => t.status === 'COMPLETAT').map(task => {
                      return (
                        <div 
                          key={task.id} 
                          className={`bg-surface p-md rounded-lg border shadow-xs flex flex-col gap-2 transition-all ${
                            task.hasIncident 
                              ? 'border-error/40 bg-error-container/5' 
                              : 'border-green-300 bg-green-50/20'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] font-bold text-primary">{task.code}</span>
                            
                            {/* Toggle Incident status for testing/management */}
                            <button
                              onClick={() => toggleIncidentStatus(task.id)}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1 ${
                                task.hasIncident
                                  ? 'bg-error text-white hover:bg-error/90'
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }`}
                              title="Fes clic per canviar estat d'incidència"
                            >
                              <span className="material-symbols-outlined text-[12px]">
                                {task.hasIncident ? 'report_problem' : 'verified'}
                              </span>
                              {task.hasIncident ? 'Amb Incidència' : 'Sense Incidència'}
                            </button>
                          </div>

                          <div>
                            <h4 className="font-body-strong text-sm text-on-surface">{task.title}</h4>
                            <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                              <span className="material-symbols-outlined text-[14px]">location_on</span>
                              {task.location}
                            </p>
                          </div>

                          {/* Incident vs Billing Status Banner */}
                          {task.hasIncident ? (
                            <div className="p-2 bg-error-container/20 rounded-lg border border-error/30 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5 text-error font-bold">
                                <span className="material-symbols-outlined text-[16px]">warning</span>
                                <span>Incidència pendent</span>
                              </div>
                              <button 
                                onClick={() => router.push('/gestio/incidencies')}
                                className="px-2 py-0.5 bg-error text-white rounded text-[11px] font-body-strong hover:bg-error/90"
                              >
                                Revisar
                              </button>
                            </div>
                          ) : (
                            <div className="p-2 bg-purple-50 rounded-lg border border-purple-200 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5 text-purple-700 font-bold">
                                <span className="material-symbols-outlined text-[16px]">payments</span>
                                <span>Passa a Facturació</span>
                              </div>
                              <button 
                                onClick={() => router.push('/gestio/comptabilitat')}
                                className="px-2 py-0.5 bg-purple-600 text-white rounded text-[11px] font-body-strong hover:bg-purple-700"
                              >
                                {task.billed ? 'Facturat' : 'Facturar'}
                              </button>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-1 border-t border-outline-variant/10 text-xs">
                            <span className="text-on-surface-variant">👤 {task.operator}</span>
                            <button 
                              onClick={() => moveTaskStatus(task.id, 'EN_CURS')}
                              className="text-[11px] text-on-surface-variant hover:text-primary underline"
                            >
                              Reobrir feina
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {completedCount === 0 && (
                      <div className="p-lg text-center text-xs text-on-surface-variant border-2 border-dashed border-outline-variant/30 rounded-lg">
                        Encara cap feina finalitzada
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              /* List View Fallback */
              <div className="divide-y divide-outline-variant/10">
                {kanbanTasks.map(task => {
                  const dateBadge = getFormattedDateForOffset(task.dateOffset);
                  return (
                    <div key={task.id} className="p-md hover:bg-surface-container-low flex items-center justify-between">
                      <div className="flex items-center gap-md">
                        <div className="px-2.5 py-1 bg-surface-container rounded text-center min-w-[50px]">
                          <span className="text-[10px] block font-bold text-on-surface-variant">{dateBadge.month}</span>
                          <span className="text-sm font-bold text-primary">{dateBadge.day}</span>
                        </div>
                        <div>
                          <span className="font-bold text-xs text-primary mr-2">{task.code}</span>
                          <span className="font-body-strong text-sm text-on-surface">{task.title}</span>
                          <p className="text-xs text-on-surface-variant">{task.location} • Assignat a {task.operator}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-md">
                        {task.status === 'COMPLETAT' && (
                          <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                            task.hasIncident ? 'bg-error/10 text-error border border-error/30' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {task.hasIncident ? 'Amb Incidència' : 'Facturació OK'}
                          </span>
                        )}
                        <span className={`px-2.5 py-0.5 text-xs rounded-full font-bold ${
                          task.status === 'PENDENT' ? 'bg-orange-100 text-orange-800' :
                          task.status === 'EN_CURS' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Bottom Grid: Real-time Map & Maintenance Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-xl mb-xl">
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
                className="relative group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm h-[380px] border border-outline-variant/30 cursor-pointer"
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

            {/* Maintenance Alerts (40%) */}
            <section className="lg:col-span-4 flex flex-col gap-md">
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
                          className="bg-green-600 hover:bg-green-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-body-strong flex items-center gap-1 transition-colors shadow-xs"
                          title="Marcar alerta com a resolta"
                        >
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          Resolt
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
          </div>
        </div>
      </main>
    </>
  );
}
