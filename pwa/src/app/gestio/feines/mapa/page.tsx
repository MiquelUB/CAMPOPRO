'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DynamicMap from '@/components/map/DynamicMap';

export default function Page() {
  const [filter, setFilter] = useState<'TOTS' | 'ACTIUS' | 'INCIDÈNCIES'>('TOTS');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Map Mode Toggle: 'VECTOR' (100% robust vector satellite), 'LEAFLET' (OpenStreetMap/CartoDB tiles)
  const [mapMode, setMapMode] = useState<'VECTOR' | 'LEAFLET'>('VECTOR');

  // Selected Crew State
  const [selectedCrewId, setSelectedCrewId] = useState<string | null>('js');

  // Live Mobile GPS State
  const [userGps, setUserGps] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [isGpsActive, setIsGpsActive] = useState(false);

  // Active Crews Dataset with Coordinates
  const crews = [
    {
      id: 'js',
      initials: 'JS',
      name: 'Jordi Soler',
      task: 'Parcel·la 42 - Sega i Manteniment',
      status: 'TREBALLANT',
      vehicle: 'Tractor John Deere 6R',
      time: '2 min',
      lat: 41.6521,
      lng: 1.8322,
      topPercent: 34,
      leftPercent: 48,
      colorHex: '#16a34a',
      badgeColor: 'bg-green-100 text-green-800 border-green-300'
    },
    {
      id: 'ma',
      initials: 'MA',
      name: 'Marc Andreu',
      task: 'Ruta: Sector Nord • Fertilització',
      status: 'EN TRÀNSIT',
      vehicle: 'Ford Transit B-1234-CD',
      time: 'Ara mateix',
      lat: 41.6710,
      lng: 1.8150,
      topPercent: 58,
      leftPercent: 28,
      colorHex: '#2563eb',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      id: 'pr',
      initials: 'PR',
      name: 'Pau Ribas',
      task: 'Avaria: Escomesa principal d\'aigua',
      status: 'INCIDÈNCIES',
      vehicle: 'Toyota Hilux 3341-KLM',
      time: 'ALERTA',
      lat: 41.6400,
      lng: 1.8600,
      topPercent: 42,
      leftPercent: 76,
      colorHex: '#dc2626',
      badgeColor: 'bg-red-100 text-red-800 border-red-300'
    },
    {
      id: 'lc',
      initials: 'LC',
      name: 'Laia Costa',
      task: 'Magatzem Central • Preparació Material',
      status: 'INACTIU',
      vehicle: 'Furgoneta Magatzem 02',
      time: '15 min',
      lat: 41.6300,
      lng: 1.8400,
      topPercent: 72,
      leftPercent: 54,
      colorHex: '#6b7280',
      badgeColor: 'bg-gray-100 text-gray-800 border-gray-300'
    }
  ];

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
        () => {
          setIsGpsActive(false);
        },
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
      alert(`📍 Centrant el mapa interactiu al teu GPS mòbil en temps real:\nLat: ${userGps.lat.toFixed(4)}° N | Lng: ${userGps.lng.toFixed(4)}° E\nPrecisió: ${userGps.accuracy} metres`);
    } else {
      alert("Obtinint la ubicació del GPS del mòbil...");
    }
  };

  return (
    <main className="relative pt-32 p-xl bg-surface min-h-screen">
      <nav className="mb-lg flex items-center text-xs text-on-surface-variant gap-xs">
        <span className="material-symbols-outlined text-[14px]">home</span>
        <span>/</span>
        <Link href="/gestio" className="hover:text-primary cursor-pointer">Dashboard</Link>
        <span>/</span>
        <span className="text-primary font-body-strong">Mapa en Temps Real de CampoPro</span>
      </nav>

      <div className="flex flex-col w-full gap-lg">
        {/* Header Controls, Filters & Map Mode Switcher */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-md bg-surface-container-lowest p-md rounded-2xl border border-outline-variant/30 shadow-sm">
          <div className="flex flex-wrap items-center gap-md">
            <div className="bg-surface-container-low border border-outline-variant rounded-xl px-md py-sm flex items-center gap-sm">
              <span className="material-symbols-outlined text-outline text-[18px]">calendar_today</span>
              <span className="font-body-strong text-on-surface text-sm">Avui, 24 de Maig</span>
            </div>

            {/* Filter Pills */}
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

            {/* Map Mode Toggle Switch (Vector Satellite vs Leaflet Tiles) */}
            <div className="flex items-center gap-1 bg-primary/10 p-1 rounded-xl border border-primary/20">
              <button
                onClick={() => setMapMode('VECTOR')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  mapMode === 'VECTOR' 
                    ? 'bg-primary text-white shadow-md scale-105' 
                    : 'text-primary hover:bg-primary/10'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">map</span>
                🛰️ Satèl·lit Vactorial
              </button>

              <button
                onClick={() => setMapMode('LEAFLET')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  mapMode === 'LEAFLET' 
                    ? 'bg-primary text-white shadow-md scale-105' 
                    : 'text-primary hover:bg-primary/10'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">layers</span>
                🗺️ Leaflet OpenStreetMap
              </button>
            </div>
          </div>

          <div className="flex items-center gap-md w-full md:w-auto">
            {/* Mobile GPS Status Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              <span className="material-symbols-outlined text-[16px]">my_location</span>
              {isGpsActive && userGps 
                ? `GPS Mòbil: ${userGps.lat.toFixed(3)}°, ${userGps.lng.toFixed(3)}°`
                : 'GPS Mòbil Actiu'}
            </div>

            <div className="relative flex-1 md:flex-initial">
              <input 
                type="text" 
                placeholder="Cercar operari, vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-md py-2.5 text-sm focus:outline-none focus:border-primary transition-all" 
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            </div>
          </div>
        </div>

        {/* Main Workspace Layout */}
        <div className="flex flex-col lg:flex-row gap-lg w-full items-start">
          
          {/* Left Panel: Active Crew List */}
          <div className="w-full lg:w-88 flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30 flex-shrink-0 min-h-[620px]">
            <div className="p-md border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low">
              <div>
                <h3 className="font-section-title text-sm uppercase tracking-wider text-primary font-bold">Equips Actius</h3>
                <p className="text-[11px] text-on-surface-variant">Prem qualsevol equip per destacar-lo al mapa</p>
              </div>
              <span className="bg-primary text-white px-2.5 py-1 rounded-full text-xs font-bold">
                {filteredCrews.length} Actius
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/20">
              {filteredCrews.map((crew) => {
                const isSelected = selectedCrewId === crew.id;
                return (
                  <div 
                    key={crew.id}
                    onClick={() => setSelectedCrewId(crew.id)}
                    className={`p-md transition-all cursor-pointer group flex items-start gap-md ${
                      isSelected 
                        ? 'bg-primary-container/15 border-l-4 border-primary font-bold shadow-inner' 
                        : 'hover:bg-surface-container-low border-l-4 border-transparent'
                    }`}
                  >
                    <div 
                      style={{ backgroundColor: crew.colorHex }}
                      className="w-11 h-11 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-md flex-shrink-0"
                    >
                      {crew.initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-headline-md text-sm text-primary truncate">{crew.name}</p>
                        <span className="text-[10px] text-outline">{crew.time}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant truncate mt-0.5">{crew.task}</p>
                      <p className="text-[11px] text-outline truncate">{crew.vehicle}</p>

                      <div className="mt-2 flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${crew.badgeColor}`}>
                          {crew.status}
                        </span>
                        {isSelected && (
                          <span className="text-xs text-primary font-bold flex items-center gap-1 animate-pulse">
                            Destacat al mapa <span className="material-symbols-outlined text-[14px]">my_location</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Workload Indicator */}
            <div className="p-md bg-surface-container-low border-t border-outline-variant/20">
              <div className="flex items-center justify-between text-xs font-label-caps text-on-surface-variant mb-1">
                <span>Càrrega de treball de la flota</span>
                <span className="font-bold text-primary">84%</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-full w-[84%] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Right Panel: Universal Responsive Interactive Map Container */}
          <div className="flex-1 w-full min-w-0 relative rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/40 min-h-[620px] bg-slate-900">
            
            {/* Mode 1: High-Performance Vector Satellite Canvas Map (100% Robust across all screens & maximize) */}
            {mapMode === 'VECTOR' ? (
              <div className="w-full h-[620px] min-h-[620px] relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black border-0">
                
                {/* Topo Satellite Grid Background Effect */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-all duration-700" 
                  style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDlm9jUfgnuweYEJ-Ww6p0-5mXPnyp0zXCLllonK5Qegx18rx94wdqGJI_ntB1_e0udMbidzpT5RLBQ1z_UNctJvsP90nPLwbZo1iOpplpn_jYp2zck0S52xgvq_XcN0tp_wMezFkUKREo_hgnXMFkdW_kpfhKAymAZfc0KjY44ZlbOD8PpiuEn46P61w00hOIcU2prSwejTH9B8GYZqpwCSRNyqdKobNk0lNzQbt2yt5kGDTrR6t_U')` }}
                ></div>

                {/* Radar Grid Overlay Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  {/* Tactical GPS Connecting Route Line */}
                  <path d="M 280 350 L 480 210 L 760 260 L 540 440" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="6 6" className="animate-pulse" />
                </svg>

                {/* Interactive Map Crew Markers */}
                {filteredCrews.map((crew) => {
                  const isSelected = selectedCrewId === crew.id;
                  return (
                    <div
                      key={crew.id}
                      onClick={() => setSelectedCrewId(crew.id)}
                      style={{ top: `${crew.topPercent}%`, left: `${crew.leftPercent}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition-all duration-300 z-20 ${
                        isSelected ? 'scale-125 z-30' : 'hover:scale-110 opacity-90'
                      }`}
                    >
                      {/* Badge Header */}
                      <div className={`px-3 py-1 rounded-xl shadow-2xl mb-1 flex items-center gap-1.5 transition-all text-xs border ${
                        isSelected 
                          ? 'bg-primary text-white font-bold ring-4 ring-primary/30 scale-105 border-white' 
                          : 'bg-white/95 text-slate-900 border-slate-200'
                      }`}>
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="font-body-strong">{crew.initials} • {crew.name}</span>
                      </div>

                      {/* Circular Pin */}
                      <div 
                        style={{ backgroundColor: crew.colorHex }}
                        className="w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-2xl text-white font-bold text-sm relative"
                      >
                        {crew.initials}
                        {isSelected && (
                          <div className="absolute -inset-2 rounded-full border-4 border-green-400 animate-ping"></div>
                        )}
                      </div>
                      <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white -mt-1 shadow-md"></div>
                    </div>
                  );
                })}

                {/* Mobile Live GPS Marker */}
                {userGps && (
                  <div 
                    style={{ top: '50%', left: '50%' }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer z-30"
                    onClick={handleCenterOnUserGps}
                  >
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-xl mb-1 flex items-center gap-1 border border-white">
                      <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                      📍 El Teu GPS (Mòbil)
                    </div>
                    <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center border-4 border-white shadow-2xl text-white relative">
                      <span className="material-symbols-outlined text-[22px]">my_location</span>
                      <div className="absolute -inset-3 rounded-full border-2 border-blue-400 animate-ping"></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Mode 2: Leaflet Dynamic Map Component */
              <div className="w-full h-[620px] min-h-[620px]">
                <DynamicMap
                  locations={filteredCrews}
                  selectedId={selectedCrewId}
                  onSelectLocation={(id) => setSelectedCrewId(id)}
                  userGps={userGps}
                  center={[selectedCrew.lat, selectedCrew.lng]}
                  zoom={14}
                />
              </div>
            )}

            {/* Floating Info Card for Currently Selected Crew */}
            {selectedCrew && (
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-outline-variant/30 max-w-xs z-[400]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                    Equip Seleccionat
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${selectedCrew.badgeColor}`}>
                    {selectedCrew.status}
                  </span>
                </div>
                <h4 className="font-headline-md text-base text-primary font-bold">{selectedCrew.name}</h4>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">{selectedCrew.task}</p>
                <p className="text-[11px] text-outline mt-1">{selectedCrew.vehicle}</p>
                <div className="mt-3 pt-2 border-t border-outline-variant/20 flex justify-between items-center text-[11px] text-on-surface-variant">
                  <span>GPS: {selectedCrew.lat.toFixed(4)}° N, {selectedCrew.lng.toFixed(4)}° E</span>
                  <span className="text-primary font-bold">Temps real ✓</span>
                </div>
              </div>
            )}

            {/* GPS Mobile Location Trigger Button */}
            <button
              onClick={handleCenterOnUserGps}
              className="absolute top-4 right-4 bg-white text-primary px-4 py-3 rounded-xl shadow-2xl z-[400] hover:bg-primary hover:text-white transition-all active:scale-95 flex items-center gap-2 text-xs font-bold border border-slate-200"
              title="Centrar al Teu GPS Mòbil"
            >
              <span className="material-symbols-outlined text-[20px]">my_location</span>
              Centrar al Teu GPS
            </button>
          </div>
        </div>

        {/* Bottom Fleet Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md mt-sm">
          <div className="bg-surface-container-lowest p-md rounded-xl flex items-center justify-between border border-outline-variant/30 shadow-sm">
            <div>
              <p className="font-label-caps text-xs text-on-surface-variant">OPERARIS EN PARCEL·LA</p>
              <p className="font-display-lg text-2xl text-primary font-bold">8 <span className="text-xs text-on-surface-variant font-normal">/ 12</span></p>
            </div>
            <span className="material-symbols-outlined text-primary text-3xl opacity-30">engineering</span>
          </div>

          <div className="bg-surface-container-lowest p-md rounded-xl flex items-center justify-between border border-outline-variant/30 shadow-sm">
            <div>
              <p className="font-label-caps text-xs text-on-surface-variant">CONSUM COMBUSTIBLE</p>
              <p className="font-display-lg text-2xl text-primary font-bold">142 L</p>
            </div>
            <span className="material-symbols-outlined text-primary text-3xl opacity-30">local_gas_station</span>
          </div>

          <div className="bg-surface-container-lowest p-md rounded-xl flex items-center justify-between border border-outline-variant/30 shadow-sm">
            <div>
              <p className="font-label-caps text-xs text-on-surface-variant">TEMPS MITJÀ RUTA</p>
              <p className="font-display-lg text-2xl text-primary font-bold">18 min</p>
            </div>
            <span className="material-symbols-outlined text-primary text-3xl opacity-30">timer</span>
          </div>

          <div className="bg-surface-container-lowest p-md rounded-xl flex items-center justify-between border border-outline-variant/30 shadow-sm">
            <div>
              <p className="font-label-caps text-xs text-on-surface-variant">TASQUES COMPLETADES</p>
              <p className="font-display-lg text-2xl text-green-600 font-bold">24</p>
            </div>
            <span className="material-symbols-outlined text-green-600 text-3xl opacity-30">task_alt</span>
          </div>
        </div>
      </div>
    </main>
  );
}
