'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  return (
    <>
<main className="relative pt-32 p-xl bg-surface min-h-screen"><nav className="mb-lg flex items-center text-xs text-on-surface-variant gap-xs"><span className="material-symbols-outlined text-[14px]">home</span><span>/</span><span className="hover:text-primary cursor-pointer">Dashboard</span></nav><div className="flex flex-col w-full gap-xl">
{/* Header Section: Typographic Focus */}
<header className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-md">
<div className="flex flex-col gap-xs">
<div className="flex items-center gap-sm">
<span className="w-1.5 h-6 bg-secondary-container rounded-full animate-pulse"></span>
<span className="font-label-caps text-on-surface-variant uppercase tracking-[0.2em]">PANEL DE CONTROL</span>
</div>
<h1 className="font-display-lg text-display-lg text-primary tracking-tight">Bon dia, Marc 👋</h1>
<p className="text-on-surface-variant font-body-base">Dimecres, 22 de Maig de 2024 — El camp no espera.</p>
</div>
<div className="flex items-center gap-md">
<button className="px-md py-sm bg-primary text-on-primary rounded-lg font-body-strong flex items-center gap-sm shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5">
<span className="material-symbols-outlined text-[20px]">add</span>
                Nova Ordre de Treball
            </button>
</div>
</header>
{/* KPI Grid: Tonal Layering */}
<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
<div className="group relative overflow-hidden bg-surface-container-lowest p-xl rounded-xl shadow-sm border-b-2 border-primary transition-all hover:shadow-md">
<div className="flex justify-between items-start mb-md">
<div className="p-sm bg-primary/5 rounded-lg text-primary">
<span className="material-symbols-outlined">assignment</span>
</div>
<span className="text-xs font-label-caps text-primary bg-primary/10 px-2 py-0.5 rounded-full">+3 avui</span>
</div>
<h3 className="font-label-caps text-on-surface-variant mb-xs">FEINES AVUI</h3>
<div className="flex items-baseline gap-xs">
<span className="font-display-lg text-display-lg text-primary">8</span>
<span className="text-on-surface-variant font-body-base">assignades</span>
</div>
<div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
<span className="material-symbols-outlined text-[96px]">assignment</span>
</div>
</div>
<div className="group relative overflow-hidden bg-surface-container-lowest p-xl rounded-xl shadow-sm border-b-2 border-success transition-all hover:shadow-md" style={{ borderBottomColor: '#10b981' }}>
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
<div className="group relative overflow-hidden bg-surface-container-lowest p-xl rounded-xl shadow-sm border-b-2 border-secondary-container transition-all hover:shadow-md">
<div className="flex justify-between items-start mb-md">
<div className="p-sm bg-orange-50 rounded-lg text-orange-600">
<span className="material-symbols-outlined">report_problem</span>
</div>
<span className="text-xs font-label-caps text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Prioritat alta</span>
</div>
<h3 className="font-label-caps text-on-surface-variant mb-xs">INCIDÈNCIES</h3>
<div className="flex items-baseline gap-xs">
<span className="font-display-lg text-display-lg text-on-surface">2</span>
<span className="text-on-surface-variant font-body-base">pendents</span>
</div>
</div>
<div className="group relative overflow-hidden bg-surface-container-lowest p-xl rounded-xl shadow-sm border-b-2 border-primary-container transition-all hover:shadow-md">
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
{/* Main Content: Map & Jobs */}
<div className="grid grid-cols-1 lg:grid-cols-10 gap-xl">
{/* Map Preview (60%) */}
<section className="lg:col-span-6 flex flex-col gap-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-md">
<h2 className="font-section-title text-section-title text-primary">Seguiment de Colles</h2>
<span className="px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant font-label-caps text-[10px]">REAL-TIME</span>
</div>
<button className="text-primary font-body-strong flex items-center gap-xs hover:underline text-sm">
                    Veure mapa complet
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</div>
<div className="relative group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm h-[420px] border border-outline-variant/30">
<div className="w-full h-full grayscale-[0.3] contrast-[1.1]" data-location="Lleida, Spain Agricultural Fields"></div>
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
{/* Upcoming Jobs (40%) */}
<section className="lg:col-span-4 flex flex-col gap-md">
<div className="flex items-center justify-between">
<h2 className="font-section-title text-section-title text-primary">Properes feines</h2>
<span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary">more_vert</span>
</div>
<div className="flex flex-col gap-sm">
{/* Job Card 1 */}
<div className="bg-surface-container-lowest p-md rounded-xl border-l-4 border-secondary-container shadow-sm flex gap-md items-center group hover:bg-surface-container-low transition-colors">
<div className="flex-shrink-0 text-center w-12 py-2 bg-surface-container rounded-lg group-hover:bg-white transition-colors">
<p className="text-[10px] font-label-caps text-on-surface-variant">MAI</p>
<p className="text-lg font-display-lg text-primary">23</p>
</div>
<div className="flex-1 min-w-0">
<div className="flex justify-between items-start mb-xs">
<h4 className="font-body-strong text-primary truncate">Adobat de finques 'La Vall'</h4>
<span className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-label-caps bg-orange-50 text-orange-600">PENDENT</span>
</div>
<p className="text-xs text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">location_on</span>
                            Sector 4 - Polígon 12
                        </p>
</div>
</div>
{/* Job Card 2 */}
<div className="bg-surface-container-lowest p-md rounded-xl border-l-4 border-primary shadow-sm flex gap-md items-center group hover:bg-surface-container-low transition-colors">
<div className="flex-shrink-0 text-center w-12 py-2 bg-surface-container rounded-lg group-hover:bg-white transition-colors">
<p className="text-[10px] font-label-caps text-on-surface-variant">MAI</p>
<p className="text-lg font-display-lg text-primary">24</p>
</div>
<div className="flex-1 min-w-0">
<div className="flex justify-between items-start mb-xs">
<h4 className="font-body-strong text-primary truncate">Revisió sistemes de reg</h4>
<span className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-label-caps bg-blue-50 text-blue-600">PROGRAMAT</span>
</div>
<p className="text-xs text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">location_on</span>
                            Zona Nord - Bassa 2
                        </p>
</div>
</div>
{/* Job Card 3 */}
<div className="bg-surface-container-lowest p-md rounded-xl border-l-4 border-primary-container shadow-sm flex gap-md items-center group hover:bg-surface-container-low transition-colors opacity-80">
<div className="flex-shrink-0 text-center w-12 py-2 bg-surface-container rounded-lg">
<p className="text-[10px] font-label-caps text-on-surface-variant">MAI</p>
<p className="text-lg font-display-lg text-primary">24</p>
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
</div>
<button className="w-full py-md border-2 border-dashed border-outline-variant rounded-xl text-outline font-body-strong hover:bg-surface-container-low hover:text-primary hover:border-primary transition-all">
                + Explorar calendari de maig
            </button>
</section>
</div>
{/* Bottom Section: Alerts & Activity */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-xl mb-xl">
{/* Alerts (Left) */}
<section className="flex flex-col gap-md">
<h2 className="font-section-title text-section-title text-primary flex items-center gap-md">
                Alertes de Manteniment
                <span className="bg-error text-on-error px-2 py-0.5 rounded-full text-[10px] font-label-caps">3 CRÍTIQUES</span>
</h2>
<div className="space-y-sm">
<div className="bg-error-container/10 p-md rounded-xl flex items-center gap-md group hover:bg-error-container/20 transition-all cursor-pointer">
<div className="w-10 h-10 rounded-full bg-error text-on-error flex items-center justify-center">
<span className="material-symbols-outlined">directions_car</span>
</div>
<div className="flex-1">
<p className="text-sm font-body-strong text-on-error-container">Caducitat ITV: John Deere 6R</p>
<p className="text-xs text-on-error-container/70 font-body-base">Faltan 4 dies — 26 de Maig</p>
</div>
<button className="bg-error text-on-error px-md py-1 rounded text-xs font-body-strong">RESERVAR</button>
</div>
<div className="bg-orange-50 p-md rounded-xl flex items-center gap-md group hover:bg-orange-100 transition-all cursor-pointer">
<div className="w-10 h-10 rounded-full bg-secondary-container text-white flex items-center justify-center">
<span className="material-symbols-outlined">inventory_2</span>
</div>
<div className="flex-1">
<p className="text-sm font-body-strong text-secondary">Estoc baix: Fertilitzant N-12</p>
<p className="text-xs text-secondary/70 font-body-base">Queden 2 unitats al magatzem central</p>
</div>
<span className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 transition-opacity">shopping_cart</span>
</div>
<div className="bg-surface-container-low p-md rounded-xl flex items-center gap-md group hover:bg-surface-container-high transition-all cursor-pointer">
<div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center">
<span className="material-symbols-outlined">oil_barrel</span>
</div>
<div className="flex-1">
<p className="text-sm font-body-strong text-on-surface">Manteniment preventiu: Cisterna</p>
<p className="text-xs text-on-surface-variant font-body-base">Recomanat cada 500h de treball</p>
</div>
<span className="material-symbols-outlined text-outline">chevron_right</span>
</div>
</div>
</section>
{/* Activity (Right) */}
<section className="flex flex-col gap-md">
<h2 className="font-section-title text-section-title text-primary">Activitat recent</h2>
<div className="relative pl-8 space-y-lg before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container-highest">
{/* Activity 1 */}
<div className="relative">
<span className="absolute -left-8 w-6 h-6 rounded-full bg-primary border-4 border-surface flex items-center justify-center">
<span className="w-1 h-1 bg-white rounded-full"></span>
</span>
<div className="bg-white p-md rounded-xl shadow-sm">
<p className="text-sm font-body-base text-on-surface">
<span className="font-body-strong">Jordi S.</span> ha completat la feina 
                            <span className="text-primary font-body-strong underline decoration-primary/30">#OT-442</span>
</p>
<p className="text-[11px] text-on-surface-variant mt-1">Fa 15 minuts • Sector C-12</p>
</div>
</div>
{/* Activity 2 */}
<div className="relative">
<span className="absolute -left-8 w-6 h-6 rounded-full bg-secondary-container border-4 border-surface flex items-center justify-center">
<span className="w-1 h-1 bg-white rounded-full"></span>
</span>
<div className="bg-white p-md rounded-xl shadow-sm">
<p className="text-sm font-body-base text-on-surface">
                            Nova incidència reportada per <span className="font-body-strong">Colla A</span>: 
                            Dany estructural en vàlvula de reg.
                        </p>
<p className="text-[11px] text-on-surface-variant mt-1">Fa 2 hores • Finca Sud</p>
</div>
</div>
{/* Activity 3 */}
<div className="relative">
<span className="absolute -left-8 w-6 h-6 rounded-full bg-surface-container-highest border-4 border-surface flex items-center justify-center">
<span className="w-1 h-1 bg-primary rounded-full"></span>
</span>
<div className="bg-white p-md rounded-xl shadow-sm">
<p className="text-sm font-body-base text-on-surface">
<span className="font-body-strong">Marc (Tu)</span> has editat la planificació setmanal.
                        </p>
<p className="text-[11px] text-on-surface-variant mt-1">Fa 3 hores • Oficina</p>
</div>
</div>
</div>
</section>
</div>
</div>

<style dangerouslySetInnerHTML={{__html: `
    @keyframes pulse-soft {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(0.95); }
    }
    .animate-pulse-soft {
        animation: pulse-soft 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
`}} /></main>
    </>
  );
}
