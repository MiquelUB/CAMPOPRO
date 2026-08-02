'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [severity, setSeverity] = useState<string | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const maxRecordTime = 30;

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordTime(t => {
          if (t >= maxRecordTime - 1) {
            setIsRecording(false);
            return maxRecordTime;
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (!isRecording && recordTime === maxRecordTime) {
      setRecordTime(0);
    }
    setIsRecording(!isRecording);
  };

  const strokeDashoffset = 175.9 - (175.9 * (recordTime / maxRecordTime));

  const incidents = [
    { id: 'material', icon: 'inventory_2', label: 'Material' },
    { id: 'client', icon: 'person_off', label: 'Client absent' },
    { id: 'avaria', icon: 'build', label: 'Avaria' },
    { id: 'extra', icon: 'add_circle', label: 'Treball extra' },
    { id: 'meteo', icon: 'cloudy_snowing', label: 'Meteo' },
    { id: 'seguretat', icon: 'gpp_maybe', label: 'Seguretat' }
  ];

  return (
    <>
<header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe"><div className="h-16 px-4 flex items-center justify-between"><div className="flex items-center gap-1"><button className="w-touch-target-min h-touch-target-min flex items-center justify-center text-primary" onClick={() => router.back()}><span className="material-symbols-outlined">chevron_left</span></button><h1 className="font-headline-md text-headline-md text-primary">Detall De La Feina</h1></div><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-pulse"></div><img alt="Perfil" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtwAZlJ75l9Gw7pVmLavb2QKnvmYPQzuB7phJke9yAcUDJ0ztQ8WKH1aqTSsG9RjFbewqzbEh-lpqwTHesciQLh-qbsV4tYLsupEKFm7oOf0sL5pPPZZfit0r2O40scG79F3SCHYEILi2EYMC9D21dG8DnWYtR4tBbsR8N2U6Oy6eYrwYpqtfZnePxyU5FByZqiyvjMKkJtFc53nau3eo2EdKYZf_iDBhz7w5J3AxQQ7sEhi2PPI3N"/></div></div></header><main className="flex flex-col relative w-full pt-16 pb-safe bg-surface"><div className="flex flex-col w-full px-margin-mobile pb-stack-lg gap-stack-lg">
{/* Status & Context */}
<div className="flex flex-col gap-1 mt-stack-md">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>report</span>
<span className="font-label-bold text-label-bold text-secondary uppercase tracking-wider">Nova Incidència</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant">Indica el motiu pel qual no es pot completar la feina o requereix atenció.</p>
</div>
{/* 3x2 Icon Grid */}
<div className="grid grid-cols-3 gap-3" id="incident-grid">
{incidents.map((inc) => (
  <button key={inc.id} onClick={() => setSelectedIncident(inc.id)} className={`incident-btn flex flex-col items-center justify-center h-[100px] rounded-xl transition-all duration-200 group active:scale-95 ${selectedIncident === inc.id ? 'bg-primary-container text-on-primary-container ring-2 ring-primary' : 'bg-surface-container-low text-primary'}`}>
  <span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">{inc.icon}</span>
  <span className={`font-label-bold text-[12px] text-center px-1 ${selectedIncident === inc.id ? 'text-on-primary-container' : 'text-on-surface'}`}>{inc.label}</span>
  </button>
))}
</div>
{/* Voice Note & Description */}
<div className="bg-surface-container rounded-2xl p-4 flex flex-col gap-4">
<div className="flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-bold text-label-bold text-primary">Nota de veu</span>
<span className="font-body-md text-sm text-on-surface-variant" id="timer-label">00:{recordTime.toString().padStart(2, '0')} / 00:30</span>
</div>
<button className={`relative flex items-center justify-center w-[64px] h-[64px] ${isRecording ? 'bg-error-container' : 'bg-white'} rounded-full shadow-md active:scale-90 transition-transform`} id="record-btn" onClick={toggleRecording}>
{/* Progress Ring */}
<svg className="absolute inset-0 w-full h-full -rotate-90">
<circle cx="32" cy="32" fill="transparent" r="28" stroke="#e4e9ed" strokeWidth="4"></circle>
<circle className="transition-all duration-1000 linear" cx="32" cy="32" fill="transparent" id="progress-circle" r="28" stroke="#fe932c" strokeDasharray="175.9" strokeDashoffset={strokeDashoffset} strokeLinecap="round" strokeWidth="4"></circle>
</svg>
<span className={`material-symbols-outlined ${isRecording ? 'text-error' : 'text-secondary'} relative z-10 text-[32px]`} id="mic-icon">{isRecording ? 'stop' : 'mic'}</span>
</button>
</div>
<div className="flex flex-col gap-2">
<label className="font-label-bold text-label-bold text-on-surface-variant ml-1">Descripció detallada</label>
<textarea className="w-full bg-surface-container-lowest rounded-xl p-4 font-body-md text-body-md focus:outline-none focus:shadow-[0_0_0_2px_#fe932c] transition-all" placeholder="Explica breument què ha passat..." rows={3}></textarea>
</div>
</div>
{/* Severity Selector */}
<div className="flex flex-col gap-3">
<span className="font-label-bold text-label-bold text-on-surface-variant ml-1">Gravetat de l'incident</span>
<div className="grid grid-cols-3 gap-2">
<button onClick={() => setSeverity('low')} className={`severity-btn py-3 rounded-xl font-button-text text-button-text transition-all active:scale-95 ${severity === 'low' ? 'bg-tertiary text-on-tertiary' : 'bg-surface-container-low text-on-surface'}`}>Baixa</button>
<button onClick={() => setSeverity('med')} className={`severity-btn py-3 rounded-xl font-button-text text-button-text transition-all active:scale-95 ${severity === 'med' ? 'bg-secondary text-on-secondary' : 'bg-surface-container-low text-on-surface'}`}>Mitjana</button>
<button onClick={() => setSeverity('high')} className={`severity-btn py-3 rounded-xl font-button-text text-button-text transition-all active:scale-95 ${severity === 'high' ? 'bg-error text-on-error' : 'bg-surface-container-low text-on-surface'}`}>Alta</button>
</div>
</div>
{/* Submit Button */}
<button onClick={() => { setIsSubmitting(true); setTimeout(() => router.back(), 1000); }} disabled={isSubmitting} className="mt-4 w-full h-[64px] bg-secondary text-on-secondary rounded-2xl font-button-text text-button-text flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all">
<span className={`material-symbols-outlined ${isSubmitting ? 'animate-spin' : ''}`}>{isSubmitting ? 'sync' : 'send'}</span>
    {isSubmitting ? 'ENVIANT...' : 'ENVIAR INCIDÈNCIA'}
  </button>
</div>
</main>
    </>
  );
}
