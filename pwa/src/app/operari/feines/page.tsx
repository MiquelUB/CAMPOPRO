"use client";

import Link from "next/link";
import { Search, Filter, Sync, ChevronRight, Plus, MapPin, Clock } from "lucide-react";

export default function FeinesAvuiPage() {
  const jobs = [
    {
      id: "1",
      title: "Reparació Escomesa d'Aigua",
      client: "Ajuntament de Vilanova",
      address: "Carrer de la Marina, 200",
      time: "08:30",
      distance: "2.3 km",
      priority: "Urgència Alta",
      statusColor: "bg-error", // Red/Urgent
    },
    {
      id: "2",
      title: "Manteniment reg Parc Central",
      client: "Parcs i Jardins SL",
      address: "Av. del Parc, 15",
      time: "11:00",
      distance: "4.1 km",
      priority: "Normal",
      statusColor: "bg-primary", // Blue/Pending
    },
    {
      id: "3",
      title: "Revisió quadre elèctric",
      client: "Comunitat Propietaris",
      address: "Carrer Nou, 45",
      time: "15:30",
      distance: "1.2 km",
      priority: "Baixa",
      statusColor: "bg-outline", // Gray/Idle
    }
  ];

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen pb-safe">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl shadow-sm pt-safe">
        <div className="h-16 px-margin-mobile flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-bold text-[12px] text-on-surface-variant uppercase tracking-wider">Avui</span>
            <h1 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
              Dijous 31 Jul
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" title="Online" />
            </h1>
          </div>
          <button className="w-touch-target-min h-touch-target-min flex items-center justify-center text-primary active:bg-primary/10 rounded-full transition-colors">
            <span className="material-symbols-outlined">sync</span>
          </button>
        </div>
      </header>

      <main className="px-margin-mobile py-stack-md flex flex-col gap-stack-md pb-24">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              type="text" 
              placeholder="Cercar feina..." 
              className="w-full h-touch-target-min pl-12 pr-4 bg-surface-container-high rounded-full outline-none focus:ring-2 focus:ring-primary/20 transition-all font-body-md"
            />
          </div>
          <button className="w-touch-target-min h-touch-target-min bg-surface-container-high rounded-full flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>

        {/* Jobs List */}
        <div className="flex flex-col gap-3">
          {jobs.map((job) => (
            <Link key={job.id} href={`/operari/feines/${job.id}`} className="block">
              <div className="bg-surface-container-low rounded-xl overflow-hidden flex shadow-sm active:scale-[0.98] transition-transform relative">
                {/* Status Bar */}
                <div className={`w-1.5 shrink-0 ${job.statusColor}`} />
                
                <div className="p-4 flex-1 flex flex-col gap-1">
                  <h3 className="font-headline-md text-[18px] text-on-surface leading-tight mb-1">{job.title}</h3>
                  <p className="font-body-md text-[14px] text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">business</span>
                    {job.client}
                  </p>
                  <p className="font-body-md text-[14px] text-on-surface-variant flex items-center gap-1.5 mb-2">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {job.address}
                  </p>
                  
                  {/* Badges Row */}
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="bg-surface-container-highest px-2 py-1 rounded-md text-[12px] font-label-bold flex items-center gap-1 text-on-surface">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {job.time}
                    </span>
                    <span className="bg-surface-container-highest px-2 py-1 rounded-md text-[12px] font-label-bold flex items-center gap-1 text-on-surface">
                      <span className="material-symbols-outlined text-[14px]">near_me</span>
                      {job.distance}
                    </span>
                    <span className={`px-2 py-1 rounded-md text-[12px] font-label-bold uppercase tracking-wider ${
                      job.priority.includes('Alta') ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'
                    }`}>
                      {job.priority}
                    </span>
                  </div>
                </div>
                
                <div className="w-12 flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined">chevron_right</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-[88px] right-6 w-14 h-14 bg-secondary text-secondary-foreground rounded-2xl shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40">
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 h-[72px] bg-surface/90 backdrop-blur-md border-t border-surface-variant flex items-center justify-around pb-safe z-50">
        <button className="flex flex-col items-center justify-center w-16 gap-1 text-secondary">
          <div className="w-16 h-8 rounded-full bg-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>assignment</span>
          </div>
          <span className="text-[12px] font-label-bold">Feines</span>
        </button>
        <button className="flex flex-col items-center justify-center w-16 gap-1 text-on-surface-variant hover:text-on-surface transition-colors">
          <div className="w-16 h-8 flex items-center justify-center">
            <span className="material-symbols-outlined">photo_camera</span>
          </div>
          <span className="text-[12px] font-label-bold">Càmera</span>
        </button>
        <button className="flex flex-col items-center justify-center w-16 gap-1 text-on-surface-variant hover:text-on-surface transition-colors">
          <div className="w-16 h-8 flex items-center justify-center">
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
          <span className="text-[12px] font-label-bold">Material</span>
        </button>
        <button className="flex flex-col items-center justify-center w-16 gap-1 text-on-surface-variant hover:text-on-surface transition-colors">
          <div className="w-16 h-8 flex items-center justify-center">
            <span className="material-symbols-outlined">person</span>
          </div>
          <span className="text-[12px] font-label-bold">Perfil</span>
        </button>
      </nav>
    </div>
  );
}
