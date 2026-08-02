'use client';

import Link from 'next/link';

export default function Page() {
  return (
    <>
<header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe"><div className="h-16 px-4 flex items-center justify-between"><div className="flex items-center gap-1"><button className="w-touch-target-min h-touch-target-min flex items-center justify-center text-primary" onClick={() => { /* history.back() */ }}><span className="material-symbols-outlined">chevron_left</span></button><h1 className="font-headline-md text-headline-md text-primary">Detall De La Feina</h1></div><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-pulse"></div><img alt="Perfil" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtwAZlJ75l9Gw7pVmLavb2QKnvmYPQzuB7phJke9yAcUDJ0ztQ8WKH1aqTSsG9RjFbewqzbEh-lpqwTHesciQLh-qbsV4tYLsupEKFm7oOf0sL5pPPZZfit0r2O40scG79F3SCHYEILi2EYMC9D21dG8DnWYtR4tBbsR8N2U6Oy6eYrwYpqtfZnePxyU5FByZqiyvjMKkJtFc53nau3eo2EdKYZf_iDBhz7w5J3AxQQ7sEhi2PPI3N"/></div></div></header><main className="flex flex-col relative w-full pt-16 pb-safe bg-surface"><div className="flex flex-col w-full px-margin-mobile pb-stack-lg gap-stack-lg">
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
{/* Material */}
<button className="incident-btn flex flex-col items-center justify-center h-[100px] bg-surface-container-low rounded-xl transition-all duration-200 group active:scale-95" onClick={() => { /* selectIncident(this) */ }}>
<span className="material-symbols-outlined text-primary mb-2 group-hover:scale-110 transition-transform">inventory_2</span>
<span className="font-label-bold text-[12px] text-on-surface text-center px-1">Material</span>
</button>
{/* Client absent */}
<button className="incident-btn flex flex-col items-center justify-center h-[100px] bg-surface-container-low rounded-xl transition-all duration-200 group active:scale-95" onClick={() => { /* selectIncident(this) */ }}>
<span className="material-symbols-outlined text-primary mb-2 group-hover:scale-110 transition-transform">person_off</span>
<span className="font-label-bold text-[12px] text-on-surface text-center px-1">Client absent</span>
</button>
{/* Avaria */}
<button className="incident-btn flex flex-col items-center justify-center h-[100px] bg-surface-container-low rounded-xl transition-all duration-200 group active:scale-95" onClick={() => { /* selectIncident(this) */ }}>
<span className="material-symbols-outlined text-primary mb-2 group-hover:scale-110 transition-transform">build</span>
<span className="font-label-bold text-[12px] text-on-surface text-center px-1">Avaria</span>
</button>
{/* Treball extra */}
<button className="incident-btn flex flex-col items-center justify-center h-[100px] bg-surface-container-low rounded-xl transition-all duration-200 group active:scale-95" onClick={() => { /* selectIncident(this) */ }}>
<span className="material-symbols-outlined text-primary mb-2 group-hover:scale-110 transition-transform">add_circle</span>
<span className="font-label-bold text-[12px] text-on-surface text-center px-1">Treball extra</span>
</button>
{/* Meteo */}
<button className="incident-btn flex flex-col items-center justify-center h-[100px] bg-surface-container-low rounded-xl transition-all duration-200 group active:scale-95" onClick={() => { /* selectIncident(this) */ }}>
<span className="material-symbols-outlined text-primary mb-2 group-hover:scale-110 transition-transform">cloudy_snowing</span>
<span className="font-label-bold text-[12px] text-on-surface text-center px-1">Meteo</span>
</button>
{/* Seguretat */}
<button className="incident-btn flex flex-col items-center justify-center h-[100px] bg-surface-container-low rounded-xl transition-all duration-200 group active:scale-95" onClick={() => { /* selectIncident(this) */ }}>
<span className="material-symbols-outlined text-primary mb-2 group-hover:scale-110 transition-transform">gpp_maybe</span>
<span className="font-label-bold text-[12px] text-on-surface text-center px-1">Seguretat</span>
</button>
</div>
{/* Voice Note & Description */}
<div className="bg-surface-container rounded-2xl p-4 flex flex-col gap-4">
<div className="flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-bold text-label-bold text-primary">Nota de veu</span>
<span className="font-body-md text-sm text-on-surface-variant" id="timer-label">00:00 / 00:30</span>
</div>
<button className="relative flex items-center justify-center w-[64px] h-[64px] bg-white rounded-full shadow-md active:scale-90 transition-transform" id="record-btn" onClick={() => { /* toggleRecording() */ }}>
{/* Progress Ring */}
<svg className="absolute inset-0 w-full h-full -rotate-90">
<circle cx="32" cy="32" fill="transparent" r="28" stroke="#e4e9ed" strokeWidth="4"></circle>
<circle className="transition-all duration-1000 linear" cx="32" cy="32" fill="transparent" id="progress-circle" r="28" stroke="#fe932c" strokeDasharray="175.9" strokeDashoffset="175.9" strokeLinecap="round" strokeWidth="4"></circle>
</svg>
<span className="material-symbols-outlined text-secondary relative z-10 text-[32px]" id="mic-icon">mic</span>
</button>
</div>
<div className="flex flex-col gap-2">
<label className="font-label-bold text-label-bold text-on-surface-variant ml-1">Descripció detallada</label>
<textarea className="w-full bg-surface-container-lowest rounded-xl p-4 font-body-md text-body-md focus:outline-none focus:shadow-[0_0_0_2px_#fe932c] transition-all" placeholder="Explica breument què ha passat..." rows="3"></textarea>
</div>
</div>
{/* Severity Selector */}
<div className="flex flex-col gap-3">
<span className="font-label-bold text-label-bold text-on-surface-variant ml-1">Gravetat de l'incident</span>
<div className="grid grid-cols-3 gap-2">
<button className="severity-btn py-3 rounded-xl bg-surface-container-low font-button-text text-button-text text-on-surface transition-all active:scale-95" onClick={() => { /* setSeverity(this, 'low') */ }}>Baixa</button>
<button className="severity-btn py-3 rounded-xl bg-surface-container-low font-button-text text-button-text text-on-surface transition-all active:scale-95" onClick={() => { /* setSeverity(this, 'med') */ }}>Mitjana</button>
<button className="severity-btn py-3 rounded-xl bg-surface-container-low font-button-text text-button-text text-on-surface transition-all active:scale-95" onClick={() => { /* setSeverity(this, 'high') */ }}>Alta</button>
</div>
</div>
{/* Submit Button */}
<button className="mt-4 w-full h-[64px] bg-secondary text-on-secondary rounded-2xl font-button-text text-button-text flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all">
<span className="material-symbols-outlined">send</span>
    ENVIAR INCIDÈNCIA
  </button>
</div>
</main>
    </>
  );
}
