'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Page() {
  const [filter, setFilter] = useState<'TOTS' | 'ACTIUS' | 'INCIDÈNCIES'>('TOTS');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selected Crew State (Highlights marker and zooms canvas)
  const [selectedCrewId, setSelectedCrewId] = useState<string | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(1);

  // Live Mobile GPS State
  const [userGps, setUserGps] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [isGpsActive, setIsGpsActive] = useState(false);

  // Active Crews Dataset with Map Coordinates
  const crews: Array<{
    id: string;
    initials: string;
    name: string;
    task: string;
    status: string;
    vehicle: string;
    time: string;
    top: number;
    left: number;
    lat: number;
    lng: number;
    avatarClass: string;
    badgeClass: string;
    markerClass: string;
  }> = [];

  // Mobile GPS Geolocation Listener
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserGps({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: Math.round(position.coords.accuracy)
          });
          setIsGpsActive(true);
        },
        () => setIsGpsActive(false),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const filteredCrews = crews.filter((c) => {
    const matchesFilter = filter === 'TOTS' || c.status === filter;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.task.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const selectedCrew = crews.find((c) => c.id === selectedCrewId) || crews[0];

  const handleCenterOnUserGps = () => {
    if (userGps) {
      alert(`📍 Centrant mapa al teu GPS en temps real:\nLat: ${userGps.lat.toFixed(4)}° N | Lng: ${userGps.lng.toFixed(4)}° E\nPrecisió: ${userGps.accuracy}m`);
      setMapZoom(1.2);
    } else {
      alert("Llegint posició GPS del mòbil...");
    }
  };

  return (
    <main className="relative pt-32 p-xl bg-surface min-h-screen">
      <nav className="mb-lg flex items-center text-xs text-on-surface-variant gap-xs">
        <span className="material-symbols-outlined text-[14px]">home</span>
        <span>/</span>
        <Link href="/gestio" className="hover:text-primary cursor-pointer">Dashboard</Link>
        <span>/</span>
        <span className="text-primary font-body-strong">Mapa en Temps Real</span>
      </nav>

      <div className="flex flex-col w-full gap-lg">
        {/* Header Controls & Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-md bg-surface-container-lowest p-md rounded-2xl border border-outline-variant/30 shadow-sm">
          <div className="flex flex-wrap items-center gap-md">
            <div className="bg-surface-container-low border border-outline-variant rounded-xl px-md py-sm flex items-center gap-sm">
              <span className="material-symbols-outlined text-outline text-[18px]">calendar_today</span>
              <span className="font-body-strong text-on-surface text-sm">Avui, 24 de Maig</span>
              <span className="material-symbols-outlined text-outline text-[18px]">expand_more</span>
            </div>

            <div className="flex bg-surface-container-high rounded-xl p-xs border border-outline-variant/20">
              {(['TOTS', 'ACTIUS', 'INCIDÈNCIES'] as const).map((f) => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg font-label-caps text-xs transition-all ${
                    filter === f ? 'bg-white shadow-md text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Mobile GPS Status Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              <span className="material-symbols-outlined text-[16px]">my_location</span>
              {isGpsActive && userGps 
                ? `GPS Mòbil: ${userGps.lat.toFixed(3)}°, ${userGps.lng.toFixed(3)}°`
                : 'GPS Mòbil Actiu'}
            </div>
          </div>

          <div className="flex items-center gap-md w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <input 
                type="text" 
                placeholder="Filtrar per operari o zona..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-md py-2.5 text-sm focus:outline-none focus:border-primary transition-all" 
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            </div>

            <Link
              href="/gestio/feines/crear"
              className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-body-strong flex items-center gap-2 hover:bg-primary-container transition-all shadow-md text-sm whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Assignar Nou
            </Link>
          </div>
        </div>

        {/* Main Map Workspace (Stitch Design 1:1 - Fully Visible on Maximized Screens) */}
        <div className="flex flex-col lg:flex-row gap-lg h-[calc(100vh-280px)] min-h-[620px] w-full relative">
          
          {/* Left Panel: Active Crew List */}
          <div className="w-full lg:w-80 flex flex-col bg-surface-container-low rounded-xl overflow-hidden shadow-sm border border-surface-container-highest flex-shrink-0">
            <div className="p-md border-b border-surface-container-highest flex justify-between items-center bg-surface-container-lowest/50">
              <h3 className="font-section-title text-sm uppercase tracking-wider text-outline font-bold">Equips Actius</h3>
              <span className="bg-primary-container text-on-primary-container px-2.5 py-0.5 rounded text-[10px] font-bold">
                {filteredCrews.length} TOTAL
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-surface-container-highest">
              {filteredCrews.map((crew) => {
                const isSelected = selectedCrewId === crew.id;
                return (
                  <div 
                    key={crew.id}
                    onClick={() => setSelectedCrewId(crew.id)}
                    className={`p-md transition-all cursor-pointer group flex items-start gap-md ${
                      isSelected 
                        ? 'bg-surface-container-lowest border-l-4 border-primary font-bold shadow-sm' 
                        : 'hover:bg-surface-container-lowest border-l-4 border-transparent'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display-lg text-sm flex-shrink-0 ${crew.avatarClass}`}>
                      {crew.initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-body-strong text-on-surface truncate">{crew.name}</p>
                        <span className="text-[10px] text-outline">{crew.time}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant truncate">{crew.task}</p>

                      <div className="mt-xs flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${crew.markerClass}`}></span>
                        <span className="text-[10px] font-label-caps text-on-surface font-bold">
                          {crew.status}
                        </span>
                        {isSelected && (
                          <span className="ml-auto text-[10px] text-primary font-bold">✓ Al mapa</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Workload Progress Bar */}
            <div className="p-md bg-surface-container-highest/30">
              <div className="flex items-center justify-between text-[11px] font-label-caps text-on-surface-variant mb-xs">
                <span>Càrrega de treball</span>
                <span className="font-bold text-primary">84%</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                <div className="bg-secondary-container h-full w-[84%] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Map Viewport Area (100% Reliable Aerial Satellite Stitch Canvas) */}
          <div className="flex-1 min-w-0 relative rounded-xl overflow-hidden shadow-xl border border-surface-container-highest group bg-slate-900 h-full">
            
            {/* Satellite Map Container */}
            <div 
              className="w-full h-full bg-cover bg-center grayscale-[0.1] brightness-95 transition-transform duration-500 origin-center"
              style={{ 
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDlm9jUfgnuweYEJ-Ww6p0-5mXPnyp0zXCLllonK5Qegx18rx94wdqGJI_ntB1_e0udMbidzpT5RLBQ1z_UNctJvsP90nPLwbZo1iOpplpn_jYp2zck0S52xgvq_XcN0tp_wMezFkUKREo_hgnXMFkdW_kpfhKAymAZfc0KjY44ZlbOD8PpiuEn46P61w00hOIcU2prSwejTH9B8GYZqpwCSRNyqdKobNk0lNzQbt2yt5kGDTrR6t_U')`,
                transform: `scale(${mapZoom})`
              }}
            >
              {/* Overlay for Contrast */}
              <div className="absolute inset-0 bg-primary/10 pointer-events-none"></div>

              {/* Render Animated Crew Markers */}
              {filteredCrews.map((crew) => {
                const isSelected = selectedCrewId === crew.id;
                return (
                  <div 
                    key={crew.id}
                    onClick={() => setSelectedCrewId(crew.id)}
                    style={{ top: `${crew.top}%`, left: `${crew.left}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition-all duration-300 z-20 ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                  >
                    {/* Header Label Pill */}
                    <div className={`px-2.5 py-1 rounded-lg shadow-xl mb-1 flex items-center gap-1.5 transition-all text-xs ${
                      isSelected ? 'bg-primary text-white font-bold ring-4 ring-white/40' : 'bg-surface-container-lowest text-primary'
                    }`}>
                      <span className="text-[10px] font-body-strong">{crew.initials} - {crew.task.split('-')[0]}</span>
                    </div>

                    {/* Circular Marker */}
                    <div className={`w-10 h-10 rounded-full ${crew.markerClass} flex items-center justify-center border-4 border-surface-container-lowest shadow-xl text-white font-body-strong relative`}>
                      {crew.initials}
                      {isSelected && (
                        <div className="absolute -inset-2 rounded-full border-4 border-secondary-container animate-ping"></div>
                      )}
                    </div>
                    <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-surface-container-lowest -mt-1"></div>
                  </div>
                );
              })}

              {/* Live User Mobile GPS Marker */}
              {userGps && (
                <div 
                  style={{ top: '50%', left: '50%' }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer z-30"
                  onClick={handleCenterOnUserGps}
                >
                  <div className="bg-blue-600 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-lg mb-1 flex items-center gap-1 border border-white">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                    📍 El Teu GPS (Mòbil)
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center border-4 border-white shadow-2xl text-white relative">
                    <span className="material-symbols-outlined text-[20px]">my_location</span>
                    <div className="absolute -inset-3 rounded-full border-2 border-blue-400 animate-ping"></div>
                  </div>
                </div>
              )}

              {/* SVG Route Connection Path */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60" viewBox="0 0 800 600">
                <path d="M200,360 L250,400 L300,380 L350,420" fill="none" stroke="rgba(254, 147, 44, 0.8)" strokeDasharray="8,8" strokeWidth="3.5" />
              </svg>
            </div>

            {/* Selected Crew Info Card Overlay */}
            {selectedCrew && (
              <div className="absolute top-md left-md bg-surface-container-lowest/95 backdrop-blur-md p-md rounded-2xl shadow-2xl border border-surface-container-highest max-w-xs z-30 animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Equip Destacat al Mapa
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedCrew.badgeClass}`}>
                    {selectedCrew.status}
                  </span>
                </div>
                <h4 className="font-headline-md text-base text-primary font-bold">{selectedCrew.name}</h4>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">{selectedCrew.task}</p>
                <p className="text-[11px] text-outline mt-1">{selectedCrew.vehicle}</p>
                <div className="mt-2 pt-2 border-t border-outline-variant/20 flex justify-between items-center text-[11px] text-on-surface-variant">
                  <span>GPS: {selectedCrew.lat.toFixed(4)}° N, {selectedCrew.lng.toFixed(4)}° E</span>
                  <span className="text-primary font-bold">Actiu ✓</span>
                </div>
              </div>
            )}

            {/* Map Controls Overlay (Zoom In, Zoom Out, My Location) */}
            <div className="absolute top-md right-md flex flex-col gap-xs z-30">
              <button 
                onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 1.8))}
                className="w-10 h-10 bg-surface-container-lowest rounded-lg shadow-md flex items-center justify-center text-on-surface hover:text-primary transition-colors active:scale-90"
                title="Apropar Zoom"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
              <button 
                onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 0.8))}
                className="w-10 h-10 bg-surface-container-lowest rounded-lg shadow-md flex items-center justify-center text-on-surface hover:text-primary transition-colors active:scale-90"
                title="Allunyar Zoom"
              >
                <span className="material-symbols-outlined">remove</span>
              </button>
              <div className="h-2"></div>
              <button 
                onClick={handleCenterOnUserGps}
                className="w-10 h-10 bg-primary text-white rounded-lg shadow-md flex items-center justify-center hover:bg-primary-container transition-colors active:scale-90"
                title="Centrar al Teu GPS Mòbil"
              >
                <span className="material-symbols-outlined">my_location</span>
              </button>
            </div>

            {/* Legend Overlay */}
            <div className="absolute bottom-md left-md bg-surface-container-lowest/90 backdrop-blur-md p-md rounded-xl shadow-2xl border border-surface-container-highest min-w-[180px] z-30">
              <p className="font-label-caps text-on-surface-variant mb-sm text-xs font-bold">LLEGENDA D'ESTATS</p>
              <div className="space-y-xs text-xs">
                <div className="flex items-center gap-sm">
                  <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                  <span className="text-on-surface">Treballant</span>
                </div>
                <div className="flex items-center gap-sm">
                  <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                  <span className="text-on-surface">En trànsit</span>
                </div>
                <div className="flex items-center gap-sm">
                  <span className="w-3 h-3 rounded-full bg-slate-500"></span>
                  <span className="text-on-surface">Inactiu / Pausa</span>
                </div>
                <div className="flex items-center gap-sm">
                  <span className="w-3 h-3 rounded-full bg-rose-600"></span>
                  <span className="text-on-surface font-bold text-rose-600">Incidència</span>
                </div>
              </div>
            </div>

            {/* Live Telemetry Status Bar */}
            <div className="absolute bottom-md right-md bg-primary text-on-primary px-md py-sm rounded-full flex items-center gap-sm shadow-xl animate-pulse z-30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-container"></span>
              </span>
              <span className="text-xs font-label-caps tracking-widest">TRANSMISSIÓ EN DIRECTE</span>
            </div>
          </div>
        </div>

        {/* Bottom Fleet Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-lg mt-lg">
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
              <p className="font-display-lg text-emerald-600 font-bold">24</p>
            </div>
            <div className="flex items-center text-emerald-600">
              <span className="material-symbols-outlined">trending_up</span>
              <span className="text-xs font-bold">+12%</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
