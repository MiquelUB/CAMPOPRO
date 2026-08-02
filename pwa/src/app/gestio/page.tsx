"use client";

import React from "react";
import Link from "next/link";
import { 
  Plus, 
  ClipboardList, 
  Users, 
  AlertTriangle, 
  CreditCard,
  Map as MapIcon,
  Navigation,
  MoreVertical,
  MapPin,
  Calendar,
  Package,
  Wrench,
  ChevronRight,
  Car,
  Truck
} from "lucide-react";

export default function GestioDashboardPage() {
  return (
    <div className="flex flex-col w-full gap-8 p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-secondary-container rounded-full animate-pulse"></span>
            <span className="font-bold text-[11px] text-on-surface-variant uppercase tracking-[0.2em]">PANEL DE CONTROL</span>
          </div>
          <h1 className="text-[32px] font-semibold text-primary tracking-tight leading-tight">Bon dia, Marc 👋</h1>
          <p className="text-on-surface-variant text-[14px]">Dimecres, 22 de Maig de 2024 — El camp no espera.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/gestio/feines/crear"
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium flex items-center gap-2 shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Nova Ordre de Treball
          </Link>
        </div>
      </header>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group relative overflow-hidden bg-white p-6 rounded-xl shadow-sm border-b-2 border-primary transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/5 rounded-lg text-primary">
              <ClipboardList size={24} />
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">+3 avui</span>
          </div>
          <h3 className="font-bold text-[11px] text-on-surface-variant mb-1 tracking-wider uppercase">FEINES AVUI</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-semibold text-primary">8</span>
            <span className="text-on-surface-variant text-[14px]">assignades</span>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ClipboardList size={96} />
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white p-6 rounded-xl shadow-sm border-b-2 border-green-500 transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <Users size={24} className="animate-pulse" />
            </div>
            <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              <span className="text-xs font-bold text-green-600 uppercase tracking-wider">En directe</span>
            </div>
          </div>
          <h3 className="font-bold text-[11px] text-on-surface-variant mb-1 tracking-wider uppercase">OPERARIS ACTIUS</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-semibold text-on-surface">12</span>
            <span className="text-on-surface-variant text-[14px]">al camp</span>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white p-6 rounded-xl shadow-sm border-b-2 border-secondary-container transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <AlertTriangle size={24} />
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Prioritat alta</span>
          </div>
          <h3 className="font-bold text-[11px] text-on-surface-variant mb-1 tracking-wider uppercase">INCIDÈNCIES</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-semibold text-on-surface">2</span>
            <span className="text-on-surface-variant text-[14px]">pendents</span>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white p-6 rounded-xl shadow-sm border-b-2 border-purple-500 transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <CreditCard size={24} />
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full uppercase tracking-wider">92% objectiu</span>
          </div>
          <h3 className="font-bold text-[11px] text-on-surface-variant mb-1 tracking-wider uppercase">FACTURACIÓ MES</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-semibold text-on-surface">12.450 €</span>
          </div>
        </div>
      </section>

      {/* Main Content: Map & Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        
        {/* Map Preview (60%) */}
        <section className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-[22px] font-semibold text-primary">Seguiment de Colles</h2>
              <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant font-bold text-[10px] tracking-wider">REAL-TIME</span>
            </div>
            <Link href="/gestio/feines/mapa" className="text-primary font-medium flex items-center gap-1 hover:underline text-sm">
              Veure mapa complet
              <ChevronRight size={18} />
            </Link>
          </div>
          
          <div className="relative group bg-white rounded-xl overflow-hidden shadow-sm h-[420px] border border-outline-variant/30">
            <img 
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1200&h=800" 
              alt="Map" 
              className="w-full h-full object-cover grayscale-[0.3] contrast-[1.1]" 
            />
            {/* Floating Map Overlays */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <div className="bg-surface/90 backdrop-blur-md p-4 rounded-lg shadow-xl border border-white/20">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <Truck size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-medium">Colla B - Tractor 04</p>
                    <p className="text-[10px] text-on-surface-variant">Sessió: Sembrat de blat</p>
                  </div>
                </div>
                <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[65%] transition-all duration-1000"></div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
              <Navigation size={18} className="text-green-400 animate-pulse" />
              <span className="text-xs font-medium">12 Sensors actius</span>
            </div>
          </div>
        </section>

        {/* Upcoming Jobs (40%) */}
        <section className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-semibold text-primary">Properes feines</h2>
            <button className="text-outline hover:text-primary"><MoreVertical size={20} /></button>
          </div>
          
          <div className="flex flex-col gap-3">
            {/* Job Card 1 */}
            <div className="bg-white p-4 rounded-xl border-l-4 border-secondary-container shadow-sm flex gap-4 items-center group hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex-shrink-0 text-center w-12 py-2 bg-surface-container rounded-lg group-hover:bg-white transition-colors">
                <p className="text-[10px] font-bold tracking-wider text-on-surface-variant">MAI</p>
                <p className="text-[20px] font-semibold text-primary">23</p>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-primary truncate">Adobat de finques &apos;La Vall&apos;</h4>
                  <span className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-orange-50 text-orange-600">PENDENT</span>
                </div>
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <MapPin size={14} /> Sector 4 - Polígon 12
                </p>
              </div>
            </div>

            {/* Job Card 2 */}
            <div className="bg-white p-4 rounded-xl border-l-4 border-primary shadow-sm flex gap-4 items-center group hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex-shrink-0 text-center w-12 py-2 bg-surface-container rounded-lg group-hover:bg-white transition-colors">
                <p className="text-[10px] font-bold tracking-wider text-on-surface-variant">MAI</p>
                <p className="text-[20px] font-semibold text-primary">24</p>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-primary truncate">Revisió sistemes de reg</h4>
                  <span className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-blue-50 text-blue-600">PROGRAMAT</span>
                </div>
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <MapPin size={14} /> Zona Nord - Bassa 2
                </p>
              </div>
            </div>

            {/* Job Card 3 */}
            <div className="bg-white p-4 rounded-xl border-l-4 border-primary-container shadow-sm flex gap-4 items-center group hover:bg-surface-container-low transition-colors opacity-80 cursor-pointer">
              <div className="flex-shrink-0 text-center w-12 py-2 bg-surface-container rounded-lg">
                <p className="text-[10px] font-bold tracking-wider text-on-surface-variant">MAI</p>
                <p className="text-[20px] font-semibold text-primary">24</p>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-primary truncate">Tractament fitosanitari</h4>
                  <span className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-surface-container-highest text-outline">EN ESPERA</span>
                </div>
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <MapPin size={14} /> Finca Masia Vella
                </p>
              </div>
            </div>
          </div>
          
          <button className="w-full py-4 border-2 border-dashed border-outline-variant rounded-xl text-outline font-medium hover:bg-surface-container-low hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-2">
            <Calendar size={18} /> Explorar calendari de maig
          </button>
        </section>
      </div>

      {/* Bottom Section: Alerts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Alerts (Left) */}
        <section className="flex flex-col gap-4">
          <h2 className="text-[22px] font-semibold text-primary flex items-center gap-4">
            Alertes de Manteniment
            <span className="bg-error text-white px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider">3 CRÍTIQUES</span>
          </h2>
          <div className="space-y-2">
            
            <div className="bg-red-50 p-4 rounded-xl flex items-center gap-4 group hover:bg-red-100 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-error text-white flex items-center justify-center">
                <Car size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">Caducitat ITV: John Deere 6R</p>
                <p className="text-xs text-red-700">Falten 4 dies — 26 de Maig</p>
              </div>
              <button className="bg-error text-white px-4 py-1 rounded text-xs font-medium">RESERVAR</button>
            </div>

            <div className="bg-orange-50 p-4 rounded-xl flex items-center gap-4 group hover:bg-orange-100 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-white flex items-center justify-center">
                <Package size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-900">Estoc baix: Fertilitzant N-12</p>
                <p className="text-xs text-orange-700">Queden 2 unitats al magatzem central</p>
              </div>
              <ChevronRight size={20} className="text-orange-900 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-4 group hover:bg-surface-container-high transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center">
                <Wrench size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-on-surface">Manteniment preventiu: Cisterna</p>
                <p className="text-xs text-on-surface-variant">Recomanat cada 500h de treball</p>
              </div>
              <ChevronRight size={20} className="text-outline" />
            </div>
            
          </div>
        </section>

        {/* Activity (Right) */}
        <section className="flex flex-col gap-4">
          <h2 className="text-[22px] font-semibold text-primary">Activitat recent</h2>
          
          <div className="relative pl-8 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container-highest">
            
            <div className="relative">
              <span className="absolute -left-8 w-6 h-6 rounded-full bg-primary border-4 border-surface flex items-center justify-center">
                <span className="w-1 h-1 bg-white rounded-full"></span>
              </span>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-sm text-on-surface">
                  <span className="font-medium">Jordi S.</span> ha completat la feina <span className="text-primary font-medium underline decoration-primary/30">#OT-442</span>
                </p>
                <p className="text-[11px] text-on-surface-variant mt-1">Fa 15 minuts • Sector C-12</p>
              </div>
            </div>

            <div className="relative">
              <span className="absolute -left-8 w-6 h-6 rounded-full bg-secondary-container border-4 border-surface flex items-center justify-center">
                <span className="w-1 h-1 bg-white rounded-full"></span>
              </span>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-sm text-on-surface">
                  Nova incidència reportada per <span className="font-medium">Colla A</span>: Dany estructural en vàlvula de reg.
                </p>
                <p className="text-[11px] text-on-surface-variant mt-1">Fa 2 hores • Finca Sud</p>
              </div>
            </div>

            <div className="relative">
              <span className="absolute -left-8 w-6 h-6 rounded-full bg-surface-container-highest border-4 border-surface flex items-center justify-center">
                <span className="w-1 h-1 bg-primary rounded-full"></span>
              </span>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-sm text-on-surface">
                  <span className="font-medium">Marc (Tu)</span> has editat la planificació setmanal.
                </p>
                <p className="text-[11px] text-on-surface-variant mt-1">Fa 3 hores • Oficina</p>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
