'use client';

import Link from 'next/link';

export default function Page() {
  return (
    <>
<header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe"><div className="h-16 px-4 flex items-center justify-between"><div className="flex items-center gap-1"><button className="w-touch-target-min h-touch-target-min flex items-center justify-center text-primary" onClick={() => { /* history.back() */ }}><span className="material-symbols-outlined">chevron_left</span></button><h1 className="font-headline-md text-headline-md text-primary">Finalitzar Feina</h1></div><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-pulse"></div><img alt="Perfil" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtwAZlJ75l9Gw7pVmLavb2QKnvmYPQzuB7phJke9yAcUDJ0ztQ8WKH1aqTSsG9RjFbewqzbEh-lpqwTHesciQLh-qbsV4tYLsupEKFm7oOf0sL5pPPZZfit0r2O40scG79F3SCHYEILi2EYMC9D21dG8DnWYtR4tBbsR8N2U6Oy6eYrwYpqtfZnePxyU5FByZqiyvjMKkJtFc53nau3eo2EdKYZf_iDBhz7w5J3AxQQ7sEhi2PPI3N"/></div></div></header><main className="flex flex-col relative w-full pt-16 pb-safe bg-surface"><div className="flex flex-col w-full">
{/* Resum de la feina Card */}
<div className="px-margin-mobile pt-stack-lg">
<div className="bg-surface-container-low rounded-xl p-stack-md flex flex-col gap-1">
<div className="flex justify-between items-start">
<span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Resum del Servei</span>
<span className="font-label-bold text-label-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-full">#45821</span>
</div>
<h2 className="font-headline-md text-headline-md text-primary mt-1">Instal·lació Panells Termo</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Carrer de Mallorca, 272, Barcelona</p>
<div className="flex items-center gap-2 mt-2 text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]">calendar_today</span>
<span className="font-label-bold text-label-bold">Avui, 14:30h</span>
</div>
</div>
</div>
{/* Signature Area */}
<div className="px-margin-mobile mt-stack-lg flex-1">
<div className="relative w-full h-[320px] bg-white rounded-xl overflow-hidden shadow-sm flex flex-col">
<div className="absolute inset-0 flex items-center justify-center pointer-events-none" id="signature-placeholder">
<div className="flex flex-col items-center gap-2 opacity-20">
<span className="material-symbols-outlined text-[48px]">edit</span>
<p className="font-headline-md text-headline-md italic">Signa aquí</p>
</div>
</div>
<canvas className="relative z-10 w-full h-full touch-none cursor-crosshair" id="signature-pad"></canvas>
{/* Decorative corner marks */}
<div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-outline-variant pointer-events-none"></div>
<div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-outline-variant pointer-events-none"></div>
<div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-outline-variant pointer-events-none"></div>
<div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-outline-variant pointer-events-none"></div>
</div>
</div>
{/* Form Inputs */}
<div className="px-margin-mobile mt-stack-lg space-y-4">
<div className="flex flex-col gap-2">
<label className="font-label-bold text-label-bold text-on-surface-variant ml-1">Nom del signant</label>
<input className="w-full h-[56px] px-4 rounded-xl bg-surface-container-highest text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Ex: Joan Garcia" type="text"/>
</div>
<div className="flex flex-col gap-2">
<label className="font-label-bold text-label-bold text-on-surface-variant ml-1">DNI / NIE</label>
<input className="w-full h-[56px] px-4 rounded-xl bg-surface-container-highest text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="12345678X" type="text"/>
</div>
</div>
{/* Action Row */}
<div className="px-margin-mobile mt-stack-lg pb-stack-lg grid grid-cols-3 gap-3">
<button className="col-span-1 h-[56px] rounded-xl bg-surface-container-high text-on-surface-variant font-button-text text-button-text flex items-center justify-center gap-2 active:scale-95 transition-transform" id="clear-btn">
<span className="material-symbols-outlined">delete</span>
            Esborrar
        </button>
<button className="col-span-2 h-[56px] rounded-xl bg-secondary-container text-on-secondary-container font-button-text text-button-text shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform uppercase tracking-wide">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Confirmar
        </button>
</div>
</div>
</main>
    </>
  );
}
