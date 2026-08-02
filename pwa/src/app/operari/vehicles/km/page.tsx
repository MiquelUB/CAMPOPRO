'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [unit, setUnit] = useState<'km' | 'hores'>('km');
  const [plate, setPlate] = useState('B-1234-CD');
  const [reading, setReading] = useState('145.832');
  const [isEditing, setIsEditing] = useState(false);
  const [customPlate, setCustomPlate] = useState(false);

  const availableVehicles = [
    { plate: 'B-1234-CD', name: 'Ford Transit • Flota Nord', defaultUnit: 'km' },
    { plate: 'TRACTOR-04', name: 'John Deere 6R • Maquinària Agrícola', defaultUnit: 'hores' },
    { plate: '3341-KLM', name: 'Toyota Hilux • Camp 02', defaultUnit: 'km' },
    { plate: 'EXCAV-01', name: 'Caterpillar 320 • Obra Civil', defaultUnit: 'hores' },
  ];

  const handleVehicleChange = (selectedPlate: string) => {
    setPlate(selectedPlate);
    const found = availableVehicles.find((v) => v.plate === selectedPlate);
    if (found) {
      setUnit(found.defaultUnit as 'km' | 'hores');
      setReading(found.defaultUnit === 'km' ? '145.832' : '3.420');
    }
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 px-margin-mobile flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-touch-target-min h-touch-target-min flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="font-headline-md text-headline-md text-primary tracking-tight">Registre de Vehicle</span>
            <div className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-pulse" title="Mode Sense Connexió"></div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-touch-target-min h-touch-target-min flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <img alt="Perfil" className="w-8 h-8 rounded-full border border-outline-variant object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtwAZlJ75l9Gw7pVmLavb2QKnvmYPQzuB7phJke9yAcUDJ0ztQ8WKH1aqTSsG9RjFbewqzbEh-lpqwTHesciQLh-qbsV4tYLsupEKFm7oOf0sL5pPPZZfit0r2O40scG79F3SCHYEILi2EYMC9D21dG8DnWYtR4tBbsR8N2U6Oy6eYrwYpqtfZnePxyU5FByZqiyvjMKkJtFc53nau3eo2EdKYZf_iDBhz7w5J3AxQQ7sEhi2PPI3N" />
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-16 pb-28 min-h-screen bg-surface">
        <div className="flex flex-col w-full px-margin-mobile pt-stack-md gap-5">
          {/* Vehicle Selection & Plate Entry */}
          <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="font-label-bold text-xs text-on-surface-variant uppercase tracking-wider">Selecció de Vehicle</span>
              <button 
                onClick={() => setCustomPlate(!customPlate)}
                className="text-xs font-body-strong text-primary hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                {customPlate ? 'Tria de la llista' : 'Matrícula manual'}
              </button>
            </div>

            {customPlate ? (
              <div className="flex flex-col gap-2">
                <label className="font-label-bold text-xs text-outline">Matrícula o Codi del Vehicle</label>
                <input 
                  type="text" 
                  className="w-full h-12 bg-white border border-outline-variant rounded-xl px-4 font-headline-md text-primary uppercase tracking-widest outline-none focus:border-primary"
                  placeholder="Ex: B-9999-ZZ o TRACTOR-01"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                />
              </div>
            ) : (
              <div className="relative">
                <select 
                  value={plate}
                  onChange={(e) => handleVehicleChange(e.target.value)}
                  className="w-full h-14 bg-white border border-outline-variant rounded-xl px-4 pr-10 font-headline-md text-primary appearance-none outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  {availableVehicles.map((v) => (
                    <option key={v.plate} value={v.plate}>
                      {v.plate} — {v.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
              </div>
            )}

            {/* Unit Selector Toggle: KM vs HORES */}
            <div className="flex flex-col gap-2">
              <label className="font-label-bold text-xs text-outline">Tipus de Mesura del Comptador</label>
              <div className="grid grid-cols-2 gap-2 bg-surface-container-high p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setUnit('km');
                    if (reading === '3.420') setReading('145.832');
                  }}
                  className={`py-3 rounded-lg font-headline-md text-sm transition-all flex items-center justify-center gap-2 ${
                    unit === 'km'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">speed</span>
                  Kilòmetres (Km)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUnit('hores');
                    if (reading === '145.832') setReading('3.420');
                  }}
                  className={`py-3 rounded-lg font-headline-md text-sm transition-all flex items-center justify-center gap-2 ${
                    unit === 'hores'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">timer</span>
                  Hores d'Ús (Hores)
                </button>
              </div>
            </div>
          </div>

          {/* Camera Viewfinder Section */}
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-inverse-surface shadow-xl border-4 border-surface-container-lowest">
            <img 
              className="w-full h-full object-cover opacity-80" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK716SDQXzKwdPp_gz_XIv2WB1-uOEmnXGfO8YP8i1Lzy611upvDio7Pzq6X_s9jkZX8K1lHuXHhH4poWNrlghkOoYXnt2Lv-49v207SIC5ZKH2HWr8laRij1QgZMMmOF9uhVn0U7ULpxDURjkwsGLbTn8ztDTQY_phbRbEmrEd2YY9pWdoX6Fg3m_wLJP3fqc2fMYLA6P7b9i8CXmsLshI49lcOFf3IznkUBhGp3PE41Q-lwCgn-g" 
              alt="Foto comptador vehicle"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="absolute top-6 left-6 w-10 h-10 border-t-4 border-l-4 border-secondary-container rounded-tl-lg"></div>
              <div className="absolute top-6 right-6 w-10 h-10 border-t-4 border-r-4 border-secondary-container rounded-tr-lg"></div>
              <div className="absolute bottom-6 left-6 w-10 h-10 border-b-4 border-l-4 border-secondary-container rounded-bl-lg"></div>
              <div className="absolute bottom-6 right-6 w-10 h-10 border-b-4 border-r-4 border-secondary-container rounded-br-lg"></div>
              
              <div className="bg-primary/80 backdrop-blur-md px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg">
                <span className="material-symbols-outlined text-secondary-container animate-pulse">photo_camera</span>
                <span className="font-button-text text-sm text-on-primary">Fotografia del comptador de {unit === 'km' ? 'Km' : 'Hores'}</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-surface-container-lowest/90 backdrop-blur-sm px-4 py-1.5 rounded-xl flex items-center gap-2 shadow-md">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="font-label-bold text-xs text-primary">Lectura OCR per IA ✓</span>
            </div>
          </div>

          {/* Reading Entry & Confirmation */}
          <div className="flex flex-col gap-3">
            <label className="font-label-bold text-xs text-on-surface-variant ml-1 uppercase">
              {unit === 'km' ? 'Valor de Kilòmetres actuals' : "Valor d'Hores de treball actuals"}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center text-primary">
                <span className="material-symbols-outlined">{unit === 'km' ? 'speed' : 'timer'}</span>
              </div>
              <input 
                className="w-full h-14 bg-surface-container-low rounded-2xl pl-12 pr-20 font-headline-md text-headline-md text-primary outline-none focus:ring-2 focus:ring-secondary-container" 
                readOnly={!isEditing}
                type="text" 
                value={reading}
                onChange={(e) => setReading(e.target.value)}
              />
              <span className="absolute inset-y-0 right-14 flex items-center text-xs font-bold text-outline uppercase">
                {unit === 'km' ? 'Km' : 'Hrs'}
              </span>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="absolute inset-y-0 right-2 w-10 flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined">{isEditing ? 'check' : 'edit'}</span>
              </button>
            </div>

            <button 
              onClick={() => router.push('/operari/feines')}
              className="w-full h-[64px] mt-2 bg-secondary-container text-on-secondary-fixed font-headline-md text-headline-md rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined">check_circle</span>
              CONFIRMAR REGISTRE ({unit.toUpperCase()})
            </button>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex justify-around items-center h-20 px-4">
          <Link className="flex flex-col items-center justify-center gap-1 w-16 h-16 text-on-surface-variant hover:text-primary transition-colors" href="/operari/feines">
            <span className="material-symbols-outlined">content_paste</span>
            <span className="font-label-bold text-[10px] uppercase tracking-wider">Feines</span>
          </Link>
          <Link className="flex flex-col items-center justify-center gap-1 w-16 h-16 text-on-surface-variant hover:text-primary transition-colors" href="/operari/camera">
            <span className="material-symbols-outlined">photo_camera</span>
            <span className="font-label-bold text-[10px] uppercase tracking-wider">Càmera</span>
          </Link>
          <Link className="flex flex-col items-center justify-center gap-1 w-16 h-16 text-on-surface-variant hover:text-primary transition-colors" href="/operari/material">
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="font-label-bold text-[10px] uppercase tracking-wider">Material</span>
          </Link>
          <Link className="flex flex-col items-center justify-center gap-1 w-16 h-16 text-on-surface-variant hover:text-primary transition-colors" href="/operari/login">
            <span className="material-symbols-outlined">person</span>
            <span className="font-label-bold text-[10px] uppercase tracking-wider">Perfil</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
