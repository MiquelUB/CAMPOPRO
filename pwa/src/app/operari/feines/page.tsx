'use client';

import Link from 'next/link';

export default function Page() {
  return (
    <>
<header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe"><div className="h-16 px-margin-mobile flex items-center justify-between"><div className="flex items-center gap-3"><img alt="CampoPro Logo" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyfgc0zyQna-r0ueG7MrWoLn2_8TM_wo1LhvkjbC2rukdyoCJzt7KA7JkBqutjpr5WeGR_h33iTMwEo2U5n07Zw7wsdz4EtI60YKBQH0bUmNPG520V6-vzA04PmImrBXwlD2JvxTX6VLYbltieM8_DMrW8iIpO8aCA46VOxvMs8x4a2JWO89_0iZz6T6_1E0bN1Kv7qyQoTRb1LCMJedoRRHgfr2aJd9yUqpfnAl8B4WrKPC7K7eYq"/><span className="font-headline-md text-headline-md text-primary tracking-tight">Llista Feines</span><div className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-pulse" title="Offline"></div></div><div className="flex items-center gap-2"><button className="w-touch-target-min h-touch-target-min flex items-center justify-center text-on-surface-variant"><span className="material-symbols-outlined">notifications</span></button><img alt="Perfil" className="w-8 h-8 rounded-full border border-outline-variant object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtwAZlJ75l9Gw7pVmLavb2QKnvmYPQzuB7phJke9yAcUDJ0ztQ8WKH1aqTSsG9RjFbewqzbEh-lpqwTHesciQLh-qbsV4tYLsupEKFm7oOf0sL5pPPZZfit0r2O40scG79F3SCHYEILi2EYMC9D21dG8DnWYtR4tBbsR8N2U6Oy6eYrwYpqtfZnePxyU5FByZqiyvjMKkJtFc53nau3eo2EdKYZf_iDBhz7w5J3AxQQ7sEhi2PPI3N"/></div></div></header><main className="flex flex-col relative w-full pt-16 pb-24 min-h-screen bg-surface"><div className="flex flex-col w-full">
{/* Header & Sync Section */}
<div className="px-margin-mobile py-stack-md flex justify-between items-end">
<div className="flex flex-col">
<span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-widest">Agenda</span>
<h1 className="font-headline-lg text-headline-lg text-primary">Avui, Dijous 31 Jul</h1>
</div>
<button className="w-12 h-12 flex items-center justify-center bg-surface-container-high rounded-full text-primary active:scale-95 transition-transform" id="sync-btn">
<span className="material-symbols-outlined transition-transform duration-700" id="sync-icon">sync</span>
</button>
</div>
{/* Search & Filter */}
<div className="px-margin-mobile mb-stack-lg">
<div className="flex gap-3 h-14">
<div className="flex-1 bg-surface-container-low rounded-xl flex items-center px-4 gap-3 group focus-within:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-outline">search</span>
<input className="bg-transparent border-none outline-none w-full text-body-md text-on-surface placeholder:text-outline-variant" placeholder="Cerca feines o clients..." type="text"/>
</div>
<button className="w-14 h-14 bg-surface-container-low rounded-xl flex items-center justify-center text-primary active:bg-primary-container active:text-on-primary-container transition-colors">
<span className="material-symbols-outlined">tune</span>
</button>
</div>
</div>
{/* Job List */}
<div className="flex flex-col gap-stack-md px-margin-mobile pb-32">
{/* Card 1: Priority High */}
<Link href="/operari/feines/1" className="bg-surface-container-lowest rounded-xl p-4 flex gap-4 shadow-sm relative overflow-hidden active:scale-[0.98] transition-transform">
{/* Vertical Status Bar */}
<div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>
<div className="flex flex-col flex-1 min-w-0">
<div className="flex justify-between items-start mb-1">
<h2 className="font-headline-md text-[18px] text-primary truncate">Manteniment reg Parc Central</h2>
<span className="bg-error-container text-on-error-container font-label-bold text-[10px] px-2 py-0.5 rounded-full uppercase">Urgent</span>
</div>
<p className="font-body-md text-on-surface-variant mb-1">Ajuntament de Vilanova</p>
<div className="flex items-center gap-1 text-outline mb-4">
<span className="material-symbols-outlined text-[18px]">location_on</span>
<span className="font-body-md text-[14px] truncate">Av. del Parc, 15</span>
</div>
<div className="flex items-center gap-3">
<div className="flex items-center gap-1 bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-lg">
<span className="material-symbols-outlined text-[18px]">schedule</span>
<span className="font-label-bold text-label-bold">08:30</span>
</div>
<div className="flex items-center gap-1 bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-lg">
<span className="material-symbols-outlined text-[18px]">near_me</span>
<span className="font-label-bold text-label-bold">2.3 km</span>
</div>
</div>
</div>
</Link>
{/* Card 2: Normal Status */}
<Link href="/operari/feines/2" className="bg-surface-container-lowest rounded-xl p-4 flex gap-4 shadow-sm relative overflow-hidden active:scale-[0.98] transition-transform">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container"></div>
<div className="flex flex-col flex-1 min-w-0">
<div className="flex justify-between items-start mb-1">
<h2 className="font-headline-md text-[18px] text-primary truncate">Revisió quadre elèctric</h2>
<span className="bg-surface-container text-on-surface-variant font-label-bold text-[10px] px-2 py-0.5 rounded-full uppercase">Pendent</span>
</div>
<p className="font-body-md text-on-surface-variant mb-1">Indústries del Garraf S.A.</p>
<div className="flex items-center gap-1 text-outline mb-4">
<span className="material-symbols-outlined text-[18px]">location_on</span>
<span className="font-body-md text-[14px] truncate">Pol. Ind. Les Roquetes, Nau 4</span>
</div>
<div className="flex items-center gap-3">
<div className="flex items-center gap-1 bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-lg">
<span className="material-symbols-outlined text-[18px]">schedule</span>
<span className="font-label-bold text-label-bold">10:45</span>
</div>
<div className="flex items-center gap-1 bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-lg">
<span className="material-symbols-outlined text-[18px]">near_me</span>
<span className="font-label-bold text-label-bold">4.1 km</span>
</div>
</div>
</div>
</Link>
{/* Empty State / Footer Illustration */}
<div className="mt-8 flex flex-col items-center opacity-40">
<div className="w-24 h-1 bg-surface-container-highest rounded-full mb-6"></div>
<span className="material-symbols-outlined text-[48px] mb-2">task_alt</span>
<p className="font-label-bold text-label-bold">Has revisat totes les tasques</p>
</div>
</div>
{/* FAB */}
<button className="fixed right-6 bottom-28 w-16 h-16 bg-secondary-container text-on-secondary-container rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-transform z-40">
<span className="material-symbols-outlined text-[32px]">add</span>
</button>

</div></main>
    </>
  );
}
