'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Page() {
  const [toolStatus, setToolStatus] = useState(['ok', 'ok', 'ok']);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const hasIssue = toolStatus.some(s => s === 'warn' || s === 'error');

  const handleStatusChange = (index: number, val: string) => {
    const newStatus = [...toolStatus];
    newStatus[index] = val;
    setToolStatus(newStatus);
  };

  const getSelectStyle = (val: string) => {
    if (val === 'error') return 'bg-error-container text-error font-bold';
    if (val === 'warn') return 'bg-tertiary-container text-tertiary font-bold';
    return 'bg-surface-container-highest text-on-surface-variant';
  };

  const handleFinish = () => {
    setIsFinishing(true);
    setTimeout(() => {
      setIsFinishing(false);
      setIsFinished(true);
    }, 1500);
  };

  return (
    <>
<header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe"><div className="h-16 px-margin-mobile flex items-center justify-between"><div className="flex items-center gap-3"><img alt="CampoPro Logo" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyfgc0zyQna-r0ueG7MrWoLn2_8TM_wo1LhvkjbC2rukdyoCJzt7KA7JkBqutjpr5WeGR_h33iTMwEo2U5n07Zw7wsdz4EtI60YKBQH0bUmNPG520V6-vzA04PmImrBXwlD2JvxTX6VLYbltieM8_DMrW8iIpO8aCA46VOxvMs8x4a2JWO89_0iZz6T6_1E0bN1Kv7qyQoTRb1LCMJedoRRHgfr2aJd9yUqpfnAl8B4WrKPC7K7eYq"/><span className="font-headline-md text-headline-md text-primary tracking-tight">Resum Del Dia</span><div className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-pulse" title="Offline"></div></div><div className="flex items-center gap-2"><button className="w-touch-target-min h-touch-target-min flex items-center justify-center text-on-surface-variant"><span className="material-symbols-outlined">notifications</span></button><img alt="Perfil" className="w-8 h-8 rounded-full border border-outline-variant object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtwAZlJ75l9Gw7pVmLavb2QKnvmYPQzuB7phJke9yAcUDJ0ztQ8WKH1aqTSsG9RjFbewqzbEh-lpqwTHesciQLh-qbsV4tYLsupEKFm7oOf0sL5pPPZZfit0r2O40scG79F3SCHYEILi2EYMC9D21dG8DnWYtR4tBbsR8N2U6Oy6eYrwYpqtfZnePxyU5FByZqiyvjMKkJtFc53nau3eo2EdKYZf_iDBhz7w5J3AxQQ7sEhi2PPI3N"/></div></div></header><main className="flex flex-col relative w-full pt-16 pb-24 min-h-screen bg-surface"><div className="flex flex-col w-full px-margin-mobile pb-stack-lg">
{/* Progress Header */}
<div className="flex items-center justify-between mb-stack-md">
<div className="flex flex-col">
<span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-widest">Pas Final</span>
<h2 className="font-headline-md text-headline-md text-primary">Check-in Eines</h2>
</div>
<div className="relative flex items-center justify-center w-12 h-12">
<svg className="w-full h-full -rotate-90">
<circle className="text-surface-container-high" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeWidth="4"></circle>
<circle className="text-secondary" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeDasharray="125.6" strokeDashoffset="0" strokeWidth="4"></circle>
</svg>
<span className="absolute font-label-bold text-label-bold text-primary">100%</span>
</div>
</div>
{/* Warning Banner (Dynamic) */}
{hasIssue && (
  <div className="flex items-start gap-3 p-4 mb-stack-md bg-error-container rounded-xl animate-pulse" id="warning-banner">
  <span className="material-symbols-outlined text-error">warning</span>
  <div className="flex flex-col">
  <span className="font-label-bold text-label-bold text-on-error-container">Alerta de Material</span>
  <p className="font-body-md text-body-md text-on-error-container">S'ha notificat una eina danyada o perduda. Es generarà un tiquet automàticament.</p>
  </div>
  </div>
)}

{/* Tools List */}
<div className="flex flex-col gap-4">
{[
  { title: 'Berbiquí Elèctric Hilti', id: '#44092-B', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDwx_rg4v55zzNmp1zoZoiFnT48tqsdLnKI6ff1NtxdtRVZGx2JgBohxhrDAHto4njhKB_J2K4RIqrUqGkObpJAYEWPU-ZL04muWIuehOeUQxmfdxfSDFDUtH_Khpjhs71a0zGIF0T6rVN5FEC841LDEThy4Xh1FlIEqY2AefzRKk-Ga8sgNVLhJWbdVbMJinEOByfZuXEeM3n253INZ4SugVjQiVhX2H8rfAizAidvwYv5WVbscQ1' },
  { title: 'Nivell Làser Pro', id: '#88211-L', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtn24057PEoJIWD6yPXaI5kjLJ-wCK5mKhR8hzYZf6gHrPOlTm7C9f-AyfpNxse4S7WGJNsa7bAHKeebxYJrR3-e1CKRcv5LeroJnHQcD3r8MoLvHVJPzjuo9NVIkZG9K7ZgOHHdlzcLg97O2eoF5lrWolUVF3H3CWU5LGzQmIy6pWYZt8Cr4LRDTND1M6q_xpcARSIMLmohxWxYgETBu95DJ9dXxipoirQ_TYGfkWl4bbMnAELLhW' },
  { title: 'Joc de Claus Fixes', id: '#10293-J', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAt7-FxRzIzayCCTb0LC0E0dHz7l6nZEiBTDR5QZa04jXVZxx3F9BgYpWf8pk-wWI62ILVtsKvov5rYmeQ-rqvsmSNMoC8vYOXkbB1_0mwgRvs5GqfDZPbJ-60xQECTo_eZrvwsHHSwWrxPjJduAE6tVvmExz8GK0Nb6J3N1JepcCVtZ0hMJ2O8Xgc0g6sSIUWAff50vRACgZIBfY3SzZ2nfY_FSKiRjk5V65WfZPCmyy25tDM2LH6w' }
].map((tool, index) => (
  <div key={index} className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-3">
  <div className="flex items-center gap-4">
  <div className="w-16 h-16 rounded-lg bg-surface-container-highest flex items-center justify-center overflow-hidden">
  <img className="w-full h-full object-cover" src={tool.img}/>
  </div>
  <div className="flex-1 min-w-0">
  <h3 className="font-label-bold text-body-md text-on-surface truncate">{tool.title}</h3>
  <span className="font-body-md text-label-bold text-on-surface-variant">ID: {tool.id}</span>
  </div>
  </div>
  <div className="relative">
  <select value={toolStatus[index]} onChange={(e) => handleStatusChange(index, e.target.value)} className={`appearance-none w-full h-touch-target-min px-4 rounded-lg font-button-text focus:text-primary outline-none transition-all ${getSelectStyle(toolStatus[index])}`}>
  <option value="ok">OK ✓</option>
  <option value="warn">Danyada ⚠️</option>
  <option value="error">Perduda ❌</option>
  </select>
  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-current">expand_more</span>
  </div>
  </div>
))}
</div>
{/* Summary Card */}
<div className="mt-stack-lg p-6 bg-primary-container rounded-2xl flex flex-col gap-4">
<div className="flex items-center justify-between">
<span className="font-body-md text-on-primary-container">Total eines verificades</span>
<span className="font-headline-md text-on-primary-container">3/3</span>
</div>
<div className="w-full h-1 bg-on-primary-container/20 rounded-full overflow-hidden">
<div className="w-full h-full bg-secondary-container"></div>
</div>
</div>
{/* Finalize Button */}
<button onClick={handleFinish} disabled={isFinishing || isFinished} className={`mt-stack-lg w-full h-16 ${isFinished ? 'bg-primary text-white opacity-50' : 'bg-secondary-container text-on-secondary-fixed'} font-button-text text-button-text rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg`} id="finish-day-btn">
<span className={`material-symbols-outlined ${isFinishing ? 'animate-spin' : ''}`}>{isFinishing ? 'sync' : (isFinished ? 'done_all' : 'check_circle')}</span>
    {isFinishing ? 'PROCESSANT...' : (isFinished ? 'JORNADA TANCADA' : 'FINALITZAR DIA')}
  </button>

</div></main>
    </>
  );
}
