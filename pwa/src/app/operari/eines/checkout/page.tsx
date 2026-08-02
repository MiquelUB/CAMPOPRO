'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Page() {
  const [checkedTools, setCheckedTools] = useState([true, true, true, false, false]);
  const totalTools = 5;
  const checkedCount = checkedTools.filter(Boolean).length;
  const percentage = (checkedCount / totalTools) * 100;
  const strokeDashoffset = 100 - percentage;

  const handleToggle = (index: number) => {
    const newChecked = [...checkedTools];
    newChecked[index] = !newChecked[index];
    setCheckedTools(newChecked);
    if (newChecked[index] && typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  return (
    <>
<header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe"><div className="h-16 px-margin-mobile flex items-center justify-between"><div className="flex items-center gap-3"><img alt="CampoPro Logo" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyfgc0zyQna-r0ueG7MrWoLn2_8TM_wo1LhvkjbC2rukdyoCJzt7KA7JkBqutjpr5WeGR_h33iTMwEo2U5n07Zw7wsdz4EtI60YKBQH0bUmNPG520V6-vzA04PmImrBXwlD2JvxTX6VLYbltieM8_DMrW8iIpO8aCA46VOxvMs8x4a2JWO89_0iZz6T6_1E0bN1Kv7qyQoTRb1LCMJedoRRHgfr2aJd9yUqpfnAl8B4WrKPC7K7eYq"/><span className="font-headline-md text-headline-md text-primary tracking-tight">Llista Feines</span><div className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-pulse" title="Offline"></div></div><div className="flex items-center gap-2"><button className="w-touch-target-min h-touch-target-min flex items-center justify-center text-on-surface-variant"><span className="material-symbols-outlined">notifications</span></button><img alt="Perfil" className="w-8 h-8 rounded-full border border-outline-variant object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtwAZlJ75l9Gw7pVmLavb2QKnvmYPQzuB7phJke9yAcUDJ0ztQ8WKH1aqTSsG9RjFbewqzbEh-lpqwTHesciQLh-qbsV4tYLsupEKFm7oOf0sL5pPPZZfit0r2O40scG79F3SCHYEILi2EYMC9D21dG8DnWYtR4tBbsR8N2U6Oy6eYrwYpqtfZnePxyU5FByZqiyvjMKkJtFc53nau3eo2EdKYZf_iDBhz7w5J3AxQQ7sEhi2PPI3N"/></div></div></header><main className="flex flex-col relative w-full pt-16 pb-24 min-h-screen bg-surface"><div className="flex flex-col w-full">
{/* Status Header */}
<div className="px-margin-mobile pt-stack-md pb-stack-lg">
<div className="flex items-center justify-between mb-4">
<div className="flex flex-col">
<span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Estat de la càrrega</span>
<span className="font-headline-lg text-headline-lg text-primary" id="progress-text">{checkedCount}/{totalTools} confirmades</span>
</div>
<div className="w-16 h-16 relative flex items-center justify-center">
<svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
<circle className="stroke-surface-container-highest" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
<circle className="stroke-secondary transition-all duration-500" cx="18" cy="18" fill="none" id="progress-circle" r="16" strokeDasharray="100" strokeDashoffset={strokeDashoffset} strokeWidth="3"></circle>
</svg>
<span className="absolute font-label-bold text-label-bold text-primary">{Math.round(percentage)}%</span>
</div>
</div>
<div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-secondary transition-all duration-500 ease-out" id="progress-bar" style={{ width: `${percentage}%` }}></div>
</div>
</div>
{/* Tools List */}
<div className="flex flex-col gap-3 px-margin-mobile pb-32">
{[
  { icon: 'precision_manufacturing', title: 'Trepant Bosch GSB 18V', id: 'ID-4492', assigned: true },
  { icon: 'construction', title: 'Joc de claus angleses Facom', id: 'ID-8821', assigned: true },
  { icon: 'drive_image', title: 'Multímetre Fluke 179', id: 'ID-1029', assigned: true },
  { icon: 'flashlight_on', title: 'Llanterna Milwaukee M18', id: 'Pendent de carregar', assigned: false },
  { icon: 'architecture', title: 'Nivell Laser Hilti', id: 'Pendent de carregar', assigned: false }
].map((tool, index) => (
  <label key={index} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl transition-colors active:bg-surface-container-high group cursor-pointer" onClick={(e) => e.preventDefault()}>
  <div className="relative flex items-center justify-center" onClick={() => handleToggle(index)}>
  <input checked={checkedTools[index]} readOnly className="tool-checkbox peer appearance-none w-8 h-8 rounded-lg bg-surface-container-highest checked:bg-primary transition-all duration-200" type="checkbox"/>
  <span className="material-symbols-outlined absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" style={{ fontSize: '20px' }}>check</span>
  </div>
  <div className="w-12 h-12 flex items-center justify-center bg-surface-container-highest rounded-lg text-primary" onClick={() => handleToggle(index)}>
  <span className="material-symbols-outlined">{tool.icon}</span>
  </div>
  <div className="flex flex-col flex-1 min-w-0" onClick={() => handleToggle(index)}>
  <span className="font-button-text text-button-text text-on-surface truncate">{tool.title}</span>
  <span className="font-label-bold text-[12px] text-on-surface-variant uppercase tracking-tight">{tool.assigned ? `Assignada · ${tool.id}` : tool.id}</span>
  </div>
  </label>
))}

{/* Botó per demanar una eina que no és a la llista */}
<button className="flex items-center gap-4 p-4 mt-2 border-2 border-dashed border-primary/30 bg-primary/5 rounded-xl transition-colors active:bg-primary/10 text-primary group">
<div className="w-12 h-12 flex items-center justify-center bg-primary rounded-lg text-white">
<span className="material-symbols-outlined">add</span>
</div>
<div className="flex flex-col flex-1 min-w-0 text-left">
<span className="font-button-text text-button-text">Agafar eina extra</span>
<span className="font-label-bold text-[12px] opacity-80 uppercase tracking-tight">Afegir fora del llistat</span>
</div>
</button>
</div>
{/* Bottom Action Scrim */}
<div className="fixed bottom-20 inset-x-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-10"></div>
{/* Final Action Button */}
<div className="fixed bottom-24 inset-x-0 px-margin-mobile z-20">
<Link href="/operari/feines" className={`w-full h-14 ${checkedCount === totalTools ? 'bg-primary text-white' : 'bg-secondary-container text-on-secondary-fixed'} font-button-text text-button-text rounded-xl shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-transform`} id="confirm-btn">
<span className="material-symbols-outlined">{checkedCount === totalTools ? 'verified' : 'task_alt'}</span>
      {checkedCount === totalTools ? 'TOT A PUNT PER SORTIR' : 'CONFIRMAR EINES'}
    </Link>
</div>

</div></main>
    </>
  );
}
