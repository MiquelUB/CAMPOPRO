'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const jobs = [
    {
      id: 1,
      title: 'Manteniment reg Parc Central',
      client: 'Ajuntament de Vilanova',
      address: 'Av. del Parc, 15',
      time: '08:30',
      distance: '2.3 km',
      priority: 'Urgent',
      statusColor: 'bg-error',
      badgeColor: 'bg-error-container text-on-error-container'
    },
    {
      id: 2,
      title: 'Revisió quadre elèctric',
      client: 'Indústries del Garraf S.A.',
      address: 'Pol. Ind. Les Roquetes, Nau 4',
      time: '10:45',
      distance: '4.1 km',
      priority: 'Pendent',
      statusColor: 'bg-secondary-container',
      badgeColor: 'bg-surface-container text-on-surface-variant'
    }
  ];

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    job.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <>
<header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe"><div className="h-16 px-margin-mobile flex items-center justify-between"><div className="flex items-center gap-3"><img alt="CampoPro Logo" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyfgc0zyQna-r0ueG7MrWoLn2_8TM_wo1LhvkjbC2rukdyoCJzt7KA7JkBqutjpr5WeGR_h33iTMwEo2U5n07Zw7wsdz4EtI60YKBQH0bUmNPG520V6-vzA04PmImrBXwlD2JvxTX6VLYbltieM8_DMrW8iIpO8aCA46VOxvMs8x4a2JWO89_0iZz6T6_1E0bN1Kv7qyQoTRb1LCMJedoRRHgfr2aJd9yUqpfnAl8B4WrKPC7K7eYq"/><span className="font-headline-md text-headline-md text-primary tracking-tight">Llista Feines</span><div className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-pulse" title="Offline"></div></div><div className="flex items-center gap-2"><button className="w-touch-target-min h-touch-target-min flex items-center justify-center text-on-surface-variant"><span className="material-symbols-outlined">notifications</span></button><img alt="Perfil" className="w-8 h-8 rounded-full border border-outline-variant object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtwAZlJ75l9Gw7pVmLavb2QKnvmYPQzuB7phJke9yAcUDJ0ztQ8WKH1aqTSsG9RjFbewqzbEh-lpqwTHesciQLh-qbsV4tYLsupEKFm7oOf0sL5pPPZZfit0r2O40scG79F3SCHYEILi2EYMC9D21dG8DnWYtR4tBbsR8N2U6Oy6eYrwYpqtfZnePxyU5FByZqiyvjMKkJtFc53nau3eo2EdKYZf_iDBhz7w5J3AxQQ7sEhi2PPI3N"/></div></div></header><main className="flex flex-col relative w-full pt-16 pb-24 min-h-screen bg-surface"><div className="flex flex-col w-full">
{/* Header & Sync Section */}
<div className="px-margin-mobile py-stack-md flex justify-between items-end">
<div className="flex flex-col">
<span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-widest">Agenda</span>
<h1 className="font-headline-lg text-headline-lg text-primary">Avui, Dijous 31 Jul</h1>
</div>
<button onClick={handleSync} className="w-12 h-12 flex items-center justify-center bg-surface-container-high rounded-full text-primary active:scale-95 transition-transform" id="sync-btn">
<span className={`material-symbols-outlined transition-transform duration-700 ${isSyncing ? 'animate-spin' : ''}`} id="sync-icon">sync</span>
</button>
</div>
{/* Search & Filter */}
<div className="px-margin-mobile mb-stack-lg">
<div className="flex gap-3 h-14">
<div className="flex-1 bg-surface-container-low rounded-xl flex items-center px-4 gap-3 group focus-within:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-outline">search</span>
<input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none w-full text-body-md text-on-surface placeholder:text-outline-variant" placeholder="Cerca feines o clients..." type="text"/>
</div>
<button className="w-14 h-14 bg-surface-container-low rounded-xl flex items-center justify-center text-primary active:bg-primary-container active:text-on-primary-container transition-colors">
<span className="material-symbols-outlined">tune</span>
</button>
</div>
</div>
{/* Job List */}
<div className="flex flex-col gap-stack-md px-margin-mobile pb-32">
{filteredJobs.length > 0 ? filteredJobs.map(job => (
  <Link key={job.id} href={`/operari/feines/${job.id}`} className="bg-surface-container-lowest rounded-xl p-4 flex gap-4 shadow-sm relative overflow-hidden active:scale-[0.98] transition-transform">
  <div className={`absolute left-0 top-0 bottom-0 w-1 ${job.statusColor}`}></div>
  <div className="flex flex-col flex-1 min-w-0">
  <div className="flex justify-between items-start mb-1">
  <h2 className="font-headline-md text-[18px] text-primary truncate">{job.title}</h2>
  <span className={`${job.badgeColor} font-label-bold text-[10px] px-2 py-0.5 rounded-full uppercase`}>{job.priority}</span>
  </div>
  <p className="font-body-md text-on-surface-variant mb-1">{job.client}</p>
  <div className="flex items-center gap-1 text-outline mb-4">
  <span className="material-symbols-outlined text-[18px]">location_on</span>
  <span className="font-body-md text-[14px] truncate">{job.address}</span>
  </div>
  <div className="flex items-center gap-3">
  <div className="flex items-center gap-1 bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-lg">
  <span className="material-symbols-outlined text-[18px]">schedule</span>
  <span className="font-label-bold text-label-bold">{job.time}</span>
  </div>
  <div className="flex items-center gap-1 bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-lg">
  <span className="material-symbols-outlined text-[18px]">near_me</span>
  <span className="font-label-bold text-label-bold">{job.distance}</span>
  </div>
  </div>
  </div>
  </Link>
)) : (
  <div className="mt-8 flex flex-col items-center opacity-60">
    <span className="material-symbols-outlined text-[48px] mb-2">search_off</span>
    <p className="font-label-bold text-label-bold">Cap feina trobada</p>
  </div>
)}

{/* Empty State / Footer Illustration */}
{filteredJobs.length === jobs.length && (
  <div className="mt-8 flex flex-col items-center opacity-40">
  <div className="w-24 h-1 bg-surface-container-highest rounded-full mb-6"></div>
  <span className="material-symbols-outlined text-[48px] mb-2">task_alt</span>
  <p className="font-label-bold text-label-bold">Aquestes són totes les tasques</p>
  </div>
)}
</div>
{/* FAB */}
<button className="fixed right-6 bottom-28 w-16 h-16 bg-secondary-container text-on-secondary-container rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-transform z-40">
<span className="material-symbols-outlined text-[32px]">add</span>
</button>

</div></main>
    </>
  );
}
