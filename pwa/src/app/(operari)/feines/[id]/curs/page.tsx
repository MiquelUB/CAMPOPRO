'use client';

import Link from 'next/link';

export default function Page() {
  return (
    <>
<header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe"><div className="h-16 px-4 flex items-center justify-between"><div className="flex items-center gap-1"><button className="w-touch-target-min h-touch-target-min flex items-center justify-center text-primary" onClick={() => { /* history.back() */ }}><span className="material-symbols-outlined">chevron_left</span></button><h1 className="font-headline-md text-headline-md text-primary">Detall De La Feina</h1></div><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-pulse"></div><img alt="Perfil" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtwAZlJ75l9Gw7pVmLavb2QKnvmYPQzuB7phJke9yAcUDJ0ztQ8WKH1aqTSsG9RjFbewqzbEh-lpqwTHesciQLh-qbsV4tYLsupEKFm7oOf0sL5pPPZZfit0r2O40scG79F3SCHYEILi2EYMC9D21dG8DnWYtR4tBbsR8N2U6Oy6eYrwYpqtfZnePxyU5FByZqiyvjMKkJtFc53nau3eo2EdKYZf_iDBhz7w5J3AxQQ7sEhi2PPI3N"/></div></div></header><main className="flex flex-col relative w-full pt-16 pb-safe bg-surface"><div className="flex flex-col w-full pb-stack-lg">
{/* Timer & Status Section */}
<div className="px-margin-mobile flex items-center justify-between mb-stack-md bg-surface-container-low py-4 shadow-sm">
<div className="flex flex-col">
<span className="font-label-bold text-label-bold text-outline uppercase tracking-wider">Temps Transcorregut</span>
<div className="font-headline-lg text-headline-lg text-secondary tabular-nums" id="job-timer">01:23:45</div>
</div>
<div className="flex flex-col items-end gap-1">
<span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-bold text-label-bold">
<span className="w-2 h-2 rounded-full bg-secondary-container mr-2 animate-pulse"></span>
        EN CURS
      </span>
<span className="text-label-bold text-on-surface-variant">ID: #44920</span>
</div>
</div>
{/* Collapsible Map Section */}
<div className="px-margin-mobile mb-stack-lg">
<details className="group bg-surface-container-high rounded-xl overflow-hidden shadow-md transition-all duration-300">
<summary className="flex items-center justify-between p-4 cursor-pointer list-none">
<div className="flex items-center gap-3 text-primary">
<span className="material-symbols-outlined">map</span>
<span className="font-button-text text-button-text">Ubicació de la feina</span>
</div>
<span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
</summary>
<div className="w-full h-48 bg-cover bg-center" data-location="Carrer de Balmes, 129, Barcelona" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDChljmI-ZeMl5gVzDZE9S7oq_toKxoWAMKPhudX-9JPkv1i39qhwOBtbZ-fEDGEb8elBNPAaX_1D4nx9K5yGJyxsVzcI9G0ULcvqIvzd3371DZQ9eaZWUrW9paF4N2LztHGbQYzo4Qsqw5pQ1Wq7x8-Wm7wz9JT8o9znXyvJatnV3WtQwnwkPKFFR3cn2GmtNvgcYvBJup7HkUdq_VlOyU9G9JFTbQ3dSizDagY_alMiX2MKKacjV3')` }}></div>
<div className="p-3 bg-surface-container-highest flex items-center gap-2 text-on-surface-variant">
<span className="material-symbols-outlined text-[20px]">location_on</span>
<p className="text-label-bold">Carrer de Balmes, 129, Barcelona</p>
</div>
</details>
</div>
{/* 2x3 Action Grid */}
<div className="px-margin-mobile mb-stack-lg">
<h2 className="font-label-bold text-label-bold text-outline uppercase mb-stack-sm ml-1">Accions ràpides</h2>
<div className="grid grid-cols-2 gap-4">
{/* Foto */}
<button className="flex flex-col items-center justify-center aspect-square bg-primary-container rounded-2xl shadow-sm active:scale-95 transition-transform">
<div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary mb-2">
<span className="material-symbols-outlined">photo_camera</span>
</div>
<span className="font-button-text text-button-text text-on-primary-container">Foto</span>
</button>
{/* Material */}
<button className="flex flex-col items-center justify-center aspect-square bg-surface-container-high rounded-2xl shadow-sm active:scale-95 transition-transform">
<div className="w-12 h-12 rounded-full bg-[#5d3fd3] flex items-center justify-center text-white mb-2">
<span className="material-symbols-outlined">inventory_2</span>
</div>
<span className="font-button-text text-button-text text-on-surface">Material</span>
</button>
{/* Incidència */}
<button className="flex flex-col items-center justify-center aspect-square bg-error-container rounded-2xl shadow-sm active:scale-95 transition-transform">
<div className="w-12 h-12 rounded-full bg-error flex items-center justify-center text-on-error mb-2">
<span className="material-symbols-outlined">report_problem</span>
</div>
<span className="font-button-text text-button-text text-on-error-container">Incidència</span>
</button>
{/* Plànol */}
<button className="flex flex-col items-center justify-center aspect-square bg-surface-container-high rounded-2xl shadow-sm active:scale-95 transition-transform">
<div className="w-12 h-12 rounded-full bg-[#008080] flex items-center justify-center text-white mb-2">
<span className="material-symbols-outlined">architecture</span>
</div>
<span className="font-button-text text-button-text text-on-surface">Plànol</span>
</button>
{/* Notes */}
<button className="flex flex-col items-center justify-center aspect-square bg-surface-container-high rounded-2xl shadow-sm active:scale-95 transition-transform">
<div className="w-12 h-12 rounded-full bg-outline flex items-center justify-center text-white mb-2">
<span className="material-symbols-outlined">edit_note</span>
</div>
<span className="font-button-text text-button-text text-on-surface">Notes</span>
</button>
{/* Empty / Add more placeholder */}
<div className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-outline-variant rounded-2xl opacity-40">
<span className="material-symbols-outlined text-4xl">add</span>
</div>
</div>
</div>
{/* Finalitzar Button */}
<div className="px-margin-mobile mt-auto">
<button className="w-full h-16 bg-[#2e7d32] text-white rounded-2xl flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-all">
<span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>stop_circle</span>
<span className="font-headline-md text-headline-md uppercase tracking-tight">Finalitzar Feina</span>
</button>
</div>

</div></main>
    </>
  );
}
