'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Page() {
  const [filter, setFilter] = useState<'TOTS' | 'ACTIUS' | 'INCIDÈNCIES'>('TOTS');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selected Crew State (for highlighting on map)
  const [selectedCrewId, setSelectedCrewId] = useState<string | null>('js');

  // Live Mobile GPS Geolocation State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isGpsActive, setIsGpsActive] = useState(false);

  // Active Crews Dataset with Map Coordinates (%)
  const crews = [
    {
      id: 'js',
      initials: 'JS',
      name: 'Jordi Soler',
      task: 'Parcel·la 42 - Sega i Manteniment',
      status: 'TREBALLANT',
      vehicle: 'Tractor John Deere 6R',
      time: '2 min',
      top: '32%',
      left: '46%',
      lat: 41.6521,
      lng: 1.8322,
      color: 'bg-green-600',
      borderColor: 'border-green-600',
      badgeColor: 'bg-green-100 text-green-800'
    },
    {
      id: 'ma',
      initials: 'MA',
      name: 'Marc Andreu',
      task: 'Ruta: Sector Nord • Fertilització',
      status: 'EN TRÀNSIT',
      vehicle: 'Ford Transit B-1234-CD',
      time: 'Ara mateix',
      top: '58%',
      left: '28%',
      lat: 41.6710,
      lng: 1.8150,
      color: 'bg-blue-600',
      borderColor: 'border-blue-600',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'pr',
      initials: 'PR',
      name: 'Pau Ribas',
      task: 'Avaria: Escomesa principal d\'aigua',
      status: 'INCIDÈNCIES',
      vehicle: 'Toyota Hilux 3341-KLM',
      time: 'ALERTA',
      top: '42%',
      left: '74%',
      lat: 41.6400,
      lng: 1.8600,
      color: 'bg-red-600',
      borderColor: 'border-red-600',
      badgeColor: 'bg-red-100 text-red-800'
    },
    {
      id: 'lc',
      initials: 'LC',
      name: 'Laia Costa',
      task: 'Magatzem Central • Preparació Material',
      status: 'INACTIU',
      vehicle: 'Furgoneta Magatzem 02',
      time: '15 min',
      top: '75%',
      left: '52%',
      lat: 41.6300,
      lng: 1.8400,
      color: 'bg-gray-500',
      borderColor: 'border-gray-500',
      badgeColor: 'bg-gray-100 text-gray-800'
    }
  ];

  // Mobile GPS Geolocation Listener
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: Math.round(position.coords.accuracy)
          });
          setIsGpsActive(true);
          setGpsError(null);
        },
        (error) => {
          setGpsError('Permís de GPS denegat o no disponible.');
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
    if (userLocation) {
      alert(`📍 Centrant mapa al teu GPS en temps real: ${userLocation.lat.toFixed(4)}° N, ${userLocation.lng.toFixed(4)}° E (Precisió: ${userLocation.accuracy}m)`);
    } else {
      alert("Activant la lectura de GPS del mòbil...");
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
              {isGpsActive && userLocation 
                ? `GPS Mòbil Actiu (${userLocation.lat.toFixed(3)}°, ${userLocation.lng.toFixed(3)}°)`
                : 'GPS Mòbil: Cercant senyal...'}
            </div>
          </div>

          <div className="flex items-center gap-md w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <input 
                type="text" 
                placeholder="Cercar operari, vehicle o finca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-md py-2.5 text-sm focus:outline-none focus:border-primary transition-all" 
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            </div>
          </div>
        </div>

        {/* Main Map Workspace */}
        <div className="flex flex-col lg:flex-row gap-lg h-[calc(100vh-280px)] min-h-[640px] relative">
          
          {/* Left Panel: Active Crew List */}
          <div className="w-full lg:w-88 flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30">
            <div className="p-md border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low">
              <div>
                <h3 className="font-section-title text-sm uppercase tracking-wider text-primary">Equips Actius</h3>
                <p className="text-[11px] text-on-surface-variant">Prem un equip per destacar-lo al mapa</p>
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
                    <div className={`w-11 h-11 rounded-full ${crew.color} text-white flex items-center justify-center font-bold text-sm shadow-md flex-shrink-0`}>
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
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${crew.badgeColor}`}>
                          {crew.status}
                        </span>
                        {isSelected && (
                          <span className="text-xs text-primary font-bold flex items-center gap-1">
                            Destacat al mapa <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
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

          {/* Map Viewport Area */}
          <div className="flex-1 relative rounded-2xl overflow-hidden shadow-xl border border-outline-variant/30 group">
            
            {/* Map Canvas Background */}
            <div className="w-full h-full bg-cover bg-center grayscale-[0.15] brightness-95 transition-all" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDlm9jUfgnuweYEJ-Ww6p0-5mXPnyp0zXCLllonK5Qegx18rx94wdqGJI_ntB1_e0udMbidzpT5RLBQ1z_UNctJvsP90nPLwbZo1iOpplpn_jYp2zck0S52xgvq_XcN0tp_wMezFkUKREo_hgnXMFkdW_kpfhKAymAZfc0KjY44ZlbOD8PpiuEn46P61w00hOIcU2prSwejTH9B8GYZqpwCSRNyqdKobNk0lNzQbt2yt5kGDTrR6t_U')` }}>
              <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>

              {/* Render Map Markers for all Crews */}
              {filteredCrews.map((crew) => {
                const isSelected = selectedCrewId === crew.id;
                return (
                  <div 
                    key={crew.id}
                    onClick={() => setSelectedCrewId(crew.id)}
                    style={{ top: crew.top, left: crew.left }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition-all duration-500 z-20 ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110 opacity-85'
                    }`}
                  >
                    {/* Active Crew Header Label */}
                    <div className={`px-2.5 py-1 rounded-xl shadow-lg mb-1 flex items-center gap-1.5 transition-all ${
                      isSelected ? 'bg-primary text-white font-bold ring-4 ring-primary/20 scale-105' : 'bg-white text-primary'
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                      <span className="text-[11px] whitespace-nowrap">{crew.initials} • {crew.name.split(' ')[0]}</span>
                    </div>

                    {/* Circular Marker Pin */}
                    <div className={`w-11 h-11 rounded-full ${crew.color} flex items-center justify-center border-4 border-white shadow-2xl text-white font-bold text-sm relative`}>
                      {crew.initials}
                      {isSelected && (
                        <div className="absolute inset-0 rounded-full border-4 border-secondary-container animate-ping"></div>
                      )}
                    </div>
                    <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white -mt-1 shadow-md"></div>
                  </div>
                );
              })}

              {/* Live Mobile GPS Position Marker (Blue Pulse) */}
              {userLocation && (
                <div 
                  style={{ top: '50%', left: '50%' }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer z-30"
                  onClick={handleCenterOnUserGps}
                >
                  <div className="bg-blue-600 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-lg mb-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                    📍 El Teu GPS (Mòbil)
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center border-4 border-white shadow-2xl text-white relative">
                    <span className="material-symbols-outlined text-[20px]">my_location</span>
                    <div className="absolute -inset-2 rounded-full border-2 border-blue-400 animate-ping"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Info Popup Card for Selected Crew */}
            {selectedCrew && (
              <div className="absolute top-md left-md bg-white/95 backdrop-blur-md p-md rounded-2xl shadow-2xl border border-outline-variant/30 max-w-xs z-30 animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                    Equip Destacat
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedCrew.badgeColor}`}>
                    {selectedCrew.status}
                  </span>
                </div>
                <h4 className="font-headline-md text-base text-primary">{selectedCrew.name}</h4>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">{selectedCrew.task}</p>
                <p className="text-[11px] text-outline mt-1">{selectedCrew.vehicle}</p>
                <div className="mt-3 pt-2 border-t border-outline-variant/20 flex justify-between items-center text-[11px] text-on-surface-variant">
                  <span>GPS: {selectedCrew.lat}° N, {selectedCrew.lng}° E</span>
                  <span className="text-primary font-bold">Actiu</span>
                </div>
              </div>
            )}

            {/* Map Controls Overlay (Zoom, Layers, My Location) */}
            <div className="absolute top-md right-md flex flex-col gap-2 z-30">
              <button 
                onClick={handleCenterOnUserGps}
                className="w-11 h-11 bg-white rounded-xl shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all active:scale-90"
                title="Centrar al Teu GPS en Temps Real"
              >
                <span className="material-symbols-outlined text-[22px]">my_location</span>
              </button>

              <button className="w-11 h-11 bg-white rounded-xl shadow-lg flex items-center justify-center text-on-surface hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[22px]">add</span>
              </button>
              <button className="w-11 h-11 bg-white rounded-xl shadow-lg flex items-center justify-center text-on-surface hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[22px]">remove</span>
              </button>
              <button className="w-11 h-11 bg-white rounded-xl shadow-lg flex items-center justify-center text-on-surface hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[22px]">layers</span>
              </button>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-md left-md bg-white/90 backdrop-blur-md p-md rounded-xl shadow-xl border border-outline-variant/30 min-w-[180px] z-30">
              <p className="font-label-caps text-xs text-outline mb-2">LLEGENDA D'ESTATS</p>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-600"></span>
                  <span className="text-on-surface font-medium">Treballant</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                  <span className="text-on-surface font-medium">En trànsit</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-600"></span>
                  <span className="text-on-surface font-bold text-red-600">Incidència</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-400 animate-ping"></span>
                  <span className="text-on-surface font-bold text-blue-600">El teu GPS mòbil</span>
                </div>
              </div>
            </div>
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
