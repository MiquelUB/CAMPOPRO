'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  return (
    <>
<main className="relative pt-32 p-xl bg-surface min-h-screen"><nav className="mb-lg flex items-center text-xs text-on-surface-variant gap-xs"><span className="material-symbols-outlined text-[14px]">home</span><span>/</span><span className="hover:text-primary cursor-pointer">Dashboard</span></nav><div className="flex flex-col w-full">
{/* Header Controls & Filters */}
<div className="flex items-center justify-between gap-lg mb-lg">
<div className="flex items-center gap-md">
<div className="bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm flex items-center gap-sm">
<span className="material-symbols-outlined text-outline text-[18px]">calendar_today</span>
<span className="font-body-strong text-on-surface">Avui, 24 de Maig</span>
<span className="material-symbols-outlined text-outline cursor-pointer">expand_more</span>
</div>
<div className="flex bg-surface-container-high rounded-lg p-xs">
<button className="px-md py-xs bg-surface-container-lowest rounded-md shadow-sm font-label-caps text-primary">TOTS</button>
<button className="px-md py-xs font-label-caps text-on-surface-variant hover:text-primary transition-colors">ACTIUS</button>
<button className="px-md py-xs font-label-caps text-on-surface-variant hover:text-primary transition-colors">INCIDÈNCIES</button>
</div>
</div>
<div className="flex items-center gap-md">
<div className="relative group">
<input className="bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-md py-sm w-64 text-sm focus:outline-none focus:border-primary transition-all" placeholder="Filtrar per operari o zona..." type="text"/>
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
</div>
<button className="bg-primary text-on-primary px-lg py-sm rounded-lg font-body-strong flex items-center gap-sm hover:bg-primary-container transition-all">
<span className="material-symbols-outlined text-[18px]">person_add</span>
                Assignar Nou
            </button>
</div>
</div>
{/* Main Map Workspace */}
<div className="flex gap-lg h-[calc(100vh-280px)] min-h-[600px] relative">
{/* Left Panel: Crew List */}
<div className="w-80 flex flex-col bg-surface-container-low rounded-xl overflow-hidden shadow-sm border border-surface-container-highest">
<div className="p-md border-b border-surface-container-highest flex justify-between items-center bg-surface-container-lowest/50">
<h3 className="font-section-title text-sm uppercase tracking-wider text-outline">Equips Actius</h3>
<span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded text-[10px] font-bold">12 TOTAL</span>
</div>
<div className="flex-1 overflow-y-auto custom-scrollbar">
{/* Crew Item: Working */}
<div className="p-md border-b border-surface-container-highest hover:bg-surface-container-lowest transition-colors cursor-pointer group">
<div className="flex items-start gap-md">
<div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center border-2 border-success text-success font-display-lg text-sm">JS</div>
<div className="flex-1 min-w-0">
<div className="flex justify-between items-start">
<p className="font-body-strong text-on-surface truncate">Jordi Soler</p>
<span className="text-[10px] text-outline">2 min</span>
</div>
<p className="text-xs text-on-surface-variant truncate">Parcel·la 42 - Sega</p>
<div className="mt-xs flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-success"></span>
<span className="text-[10px] font-label-caps text-success">TREBALLANT</span>
</div>
</div>
</div>
</div>
{/* Crew Item: Transit */}
<div className="p-md border-b border-surface-container-highest hover:bg-surface-container-lowest transition-colors cursor-pointer group bg-surface-container-lowest/30">
<div className="flex items-start gap-md">
<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary text-primary font-display-lg text-sm">MA</div>
<div className="flex-1 min-w-0">
<div className="flex justify-between items-start">
<p className="font-body-strong text-on-surface truncate">Marc Andreu</p>
<span className="text-[10px] text-outline">Ara mateix</span>
</div>
<p className="text-xs text-on-surface-variant truncate">Ruta: Sector Nord</p>
<div className="mt-xs flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="text-[10px] font-label-caps text-primary">EN TRÀNSIT</span>
</div>
</div>
</div>
</div>
{/* Crew Item: Incident */}
<div className="p-md border-b border-surface-container-highest hover:bg-surface-container-lowest transition-colors cursor-pointer group">
<div className="flex items-start gap-md">
<div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center border-2 border-error text-error font-display-lg text-sm">PR</div>
<div className="flex-1 min-w-0">
<div className="flex justify-between items-start">
<p className="font-body-strong text-on-surface truncate">Pau Ribas</p>
<span className="text-[10px] text-error font-bold italic">ALERTA</span>
</div>
<p className="text-xs text-on-surface-variant truncate">Avaria: Tractor T-12</p>
<div className="mt-xs flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
<span className="text-[10px] font-label-caps text-error">INCIDÈNCIA</span>
</div>
</div>
</div>
</div>
{/* Crew Item: Idle */}
<div className="p-md border-b border-surface-container-highest hover:bg-surface-container-lowest transition-colors cursor-pointer group">
<div className="flex items-start gap-md">
<div className="w-10 h-10 rounded-full bg-outline/10 flex items-center justify-center border-2 border-outline text-outline font-display-lg text-sm">LC</div>
<div className="flex-1 min-w-0">
<div className="flex justify-between items-start">
<p className="font-body-strong text-on-surface truncate">Laia Costa</p>
<span className="text-[10px] text-outline">15 min</span>
</div>
<p className="text-xs text-on-surface-variant truncate">Magatzem Central</p>
<div className="mt-xs flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-outline"></span>
<span className="text-[10px] font-label-caps text-outline">INACTIU</span>
</div>
</div>
</div>
</div>
</div>
<div className="p-md bg-surface-container-highest/30">
<div className="flex items-center justify-between text-[11px] font-label-caps text-on-surface-variant mb-xs">
<span>Càrrega de treball</span>
<span>84%</span>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
<div className="bg-secondary-container h-full w-[84%] rounded-full"></div>
</div>
</div>
</div>
{/* Map Viewport */}
<div className="flex-1 relative rounded-xl overflow-hidden shadow-xl border border-surface-container-highest group">
{/* Simulated Map Background */}
<div className="w-full h-full bg-cover bg-center grayscale-[0.2] brightness-95" data-location="Lleida, Spain Agricultural Fields" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDlm9jUfgnuweYEJ-Ww6p0-5mXPnyp0zXCLllonK5Qegx18rx94wdqGJI_ntB1_e0udMbidzpT5RLBQ1z_UNctJvsP90nPLwbZo1iOpplpn_jYp2zck0S52xgvq_XcN0tp_wMezFkUKREo_hgnXMFkdW_kpfhKAymAZfc0KjY44ZlbOD8PpiuEn46P61w00hOIcU2prSwejTH9B8GYZqpwCSRNyqdKobNk0lNzQbt2yt5kGDTrR6t_U')` }}>
{/* Overlay for data contrast */}
<div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
{/* Map Markers */}
{/* Green Marker */}
<div className="absolute top-[30%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transform hover:scale-110 transition-transform">
<div className="bg-surface-container-lowest p-1 rounded-lg shadow-lg mb-1 flex items-center gap-sm">
<span className="text-[10px] font-body-strong px-sm">JS - Sega</span>
</div>
<div className="w-10 h-10 rounded-full bg-success flex items-center justify-center border-4 border-surface-container-lowest shadow-xl text-on-primary font-body-strong">JS</div>
<div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-surface-container-lowest -mt-1"></div>
</div>
{/* Blue Marker */}
<div className="absolute top-[60%] left-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transform hover:scale-110 transition-transform">
<div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-4 border-surface-container-lowest shadow-xl text-on-primary font-body-strong">MA</div>
<div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-surface-container-lowest -mt-1"></div>
</div>
{/* Red Marker */}
<div className="absolute top-[45%] left-[75%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer animate-bounce">
<div className="bg-error p-1 rounded-lg shadow-lg mb-1">
<span className="text-[10px] font-bold text-on-error px-sm">ALERTA MECÀNICA</span>
</div>
<div className="w-10 h-10 rounded-full bg-error flex items-center justify-center border-4 border-surface-container-lowest shadow-xl text-on-error font-body-strong">PR</div>
<div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-error -mt-1"></div>
</div>
{/* SVG Path (Route) */}
<svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600">
<path d="M200,360 L250,400 L300,380 L350,420" fill="none" stroke="rgba(2, 36, 72, 0.4)" strokeDasharray="8,8" strokeWidth="3"></path>
</svg>
</div>
{/* Map Controls Overlay */}
<div className="absolute top-md right-md flex flex-col gap-xs">
<button className="w-10 h-10 bg-surface-container-lowest rounded-lg shadow-md flex items-center justify-center text-on-surface hover:text-primary transition-colors">
<span className="material-symbols-outlined">add</span>
</button>
<button className="w-10 h-10 bg-surface-container-lowest rounded-lg shadow-md flex items-center justify-center text-on-surface hover:text-primary transition-colors">
<span className="material-symbols-outlined">remove</span>
</button>
<div className="h-4"></div>
<button className="w-10 h-10 bg-surface-container-lowest rounded-lg shadow-md flex items-center justify-center text-on-surface hover:text-primary transition-colors">
<span className="material-symbols-outlined">layers</span>
</button>
<button className="w-10 h-10 bg-surface-container-lowest rounded-lg shadow-md flex items-center justify-center text-on-surface hover:text-primary transition-colors">
<span className="material-symbols-outlined">my_location</span>
</button>
</div>
{/* Legend Overlay */}
<div className="absolute bottom-md left-md bg-surface-container-lowest/90 backdrop-blur-md p-md rounded-xl shadow-2xl border border-surface-container-highest min-w-[180px]">
<p className="font-label-caps text-on-surface-variant mb-sm">LLEGENDA D'ESTATS</p>
<div className="space-y-xs">
<div className="flex items-center gap-sm">
<span className="w-3 h-3 rounded-full bg-success"></span>
<span className="text-xs text-on-surface">Treballant</span>
</div>
<div className="flex items-center gap-sm">
<span className="w-3 h-3 rounded-full bg-primary"></span>
<span className="text-xs text-on-surface">En trànsit</span>
</div>
<div className="flex items-center gap-sm">
<span className="w-3 h-3 rounded-full bg-outline"></span>
<span className="text-xs text-on-surface">Inactiu / Pausa</span>
</div>
<div className="flex items-center gap-sm">
<span className="w-3 h-3 rounded-full bg-error"></span>
<span className="text-xs text-on-surface font-bold text-error">Incidència</span>
</div>
</div>
</div>
{/* Live Status Bar */}
<div className="absolute bottom-md right-md bg-primary text-on-primary px-md py-sm rounded-full flex items-center gap-sm shadow-xl animate-pulse">
<span className="relative flex h-2 w-2">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75"></span>
<span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-container"></span>
</span>
<span className="text-xs font-label-caps tracking-widest">TRANSMISSIÓ EN DIRECTE</span>
</div>
</div>
</div>
{/* Bottom Statistics */}
<div className="grid grid-cols-4 gap-lg mt-lg">
<div className="bg-surface-container-low p-lg rounded-xl flex items-center justify-between border border-surface-container-highest">
<div>
<p className="font-label-caps text-on-surface-variant">OPERARIS ACTIUS</p>
<p className="font-display-lg text-primary">8<span className="text-lg text-on-surface-variant">/12</span></p>
</div>
<span className="material-symbols-outlined text-primary-container text-4xl opacity-20">engineering</span>
</div>
<div className="bg-surface-container-low p-lg rounded-xl flex items-center justify-between border border-surface-container-highest">
<div>
<p className="font-label-caps text-on-surface-variant">CONSUM COMBUSTIBLE</p>
<p className="font-display-lg text-primary">142L</p>
</div>
<span className="material-symbols-outlined text-primary-container text-4xl opacity-20">local_gas_station</span>
</div>
<div className="bg-surface-container-low p-lg rounded-xl flex items-center justify-between border border-surface-container-highest">
<div>
<p className="font-label-caps text-on-surface-variant">TEMPS MITJÀ RUTA</p>
<p className="font-display-lg text-primary">18m</p>
</div>
<span className="material-symbols-outlined text-primary-container text-4xl opacity-20">timer</span>
</div>
<div className="bg-surface-container-low p-lg rounded-xl flex items-center justify-between border border-surface-container-highest">
<div>
<p className="font-label-caps text-on-surface-variant">TASQUES COMPLETADES</p>
<p className="font-display-lg text-success">24</p>
</div>
<div className="flex items-center text-success">
<span className="material-symbols-outlined">trending_up</span>
<span className="text-xs font-bold">+12%</span>
</div>
</div>
</div>
</div>

<style dangerouslySetInnerHTML={{__html: `
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #e3e2e6;
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #c4c6cf;
    }
`}} /></main>
    </>
  );
}
