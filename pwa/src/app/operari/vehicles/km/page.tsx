'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(true);
  const [scannedValue, setScannedValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (isScanning) {
      const timer = setTimeout(() => {
        setScannedValue('145832');
        setIsScanning(false);
        if (typeof window !== 'undefined' && window.navigator.vibrate) {
          window.navigator.vibrate([50, 50, 50]);
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isScanning]);

  const handleConfirm = () => {
    setIsConfirmed(true);
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  return (
    <>
<header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe"><div className="h-16 px-margin-mobile flex items-center justify-between"><div className="flex items-center gap-3"><img alt="CampoPro Logo" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyfgc0zyQna-r0ueG7MrWoLn2_8TM_wo1LhvkjbC2rukdyoCJzt7KA7JkBqutjpr5WeGR_h33iTMwEo2U5n07Zw7wsdz4EtI60YKBQH0bUmNPG520V6-vzA04PmImrBXwlD2JvxTX6VLYbltieM8_DMrW8iIpO8aCA46VOxvMs8x4a2JWO89_0iZz6T6_1E0bN1Kv7qyQoTRb1LCMJedoRRHgfr2aJd9yUqpfnAl8B4WrKPC7K7eYq"/><span className="font-headline-md text-headline-md text-primary tracking-tight">Càmera Inspecció</span><div className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-pulse" title="Offline"></div></div><div className="flex items-center gap-2"><button className="w-touch-target-min h-touch-target-min flex items-center justify-center text-on-surface-variant"><span className="material-symbols-outlined">notifications</span></button><img alt="Perfil" className="w-8 h-8 rounded-full border border-outline-variant object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtwAZlJ75l9Gw7pVmLavb2QKnvmYPQzuB7phJke9yAcUDJ0ztQ8WKH1aqTSsG9RjFbewqzbEh-lpqwTHesciQLh-qbsV4tYLsupEKFm7oOf0sL5pPPZZfit0r2O40scG79F3SCHYEILi2EYMC9D21dG8DnWYtR4tBbsR8N2U6Oy6eYrwYpqtfZnePxyU5FByZqiyvjMKkJtFc53nau3eo2EdKYZf_iDBhz7w5J3AxQQ7sEhi2PPI3N"/></div></div></header><main className="flex flex-col relative w-full pt-16 pb-24 min-h-screen bg-surface"><div className="flex flex-col w-full">
{/* Vehicle Identity Card */}
<div className="px-margin-mobile py-stack-md">
<div className="bg-surface-container-high rounded-xl p-4 flex items-center gap-4">
<div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-on-primary">
<span className="material-symbols-outlined">local_shipping</span>
</div>
<div className="flex flex-col">
<span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Vehicle Assignat</span>
<span className="font-headline-md text-headline-md text-primary">B-1234-CD</span>
<span className="font-body-md text-body-md text-on-surface-variant">Ford Transit • Flota Nord</span>
</div>
</div>
</div>
{/* Camera Viewfinder Section */}
<div className="relative px-margin-mobile flex-grow">
<div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-inverse-surface shadow-xl">
{/* Camera Feed Placeholder */}
<img className="w-full h-full object-cover opacity-80" data-alt="A first-person perspective through a smartphone camera lens focusing on a vehicle's digital odometer dashboard. The dashboard lighting is crisp blue and white, showing numbers clearly. The image has a professional industrial feel with slight motion blur at the edges to emphasize focus on the central digits. High contrast, sharp focus on the kilometer reading." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK716SDQXzKwdPp_gz_XIv2WB1-uOEmnXGfO8YP8i1Lzy611upvDio7Pzq6X_s9jkZX8K1lHuXHhH4poWNrlghkOoYXnt2Lv-49v207SIC5ZKH2HWr8laRij1QgZMMmOF9uhVn0U7ULpxDURjkwsGLbTn8ztDTQY_phbRbEmrEd2YY9pWdoX6Fg3m_wLJP3fqc2fMYLA6P7b9i8CXmsLshI49lcOFf3IznkUBhGp3PE41Q-lwCgn-g"/>
{/* Viewfinder Overlay */}
<div className="absolute inset-0 flex flex-col items-center justify-center">
{/* Corner Brackets */}
<div className={`absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 ${isScanning ? 'border-secondary-container' : 'border-green-500'} rounded-tl-lg transition-colors duration-500`}></div>
<div className={`absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 ${isScanning ? 'border-secondary-container' : 'border-green-500'} rounded-tr-lg transition-colors duration-500`}></div>
<div className={`absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 ${isScanning ? 'border-secondary-container' : 'border-green-500'} rounded-bl-lg transition-colors duration-500`}></div>
<div className={`absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 ${isScanning ? 'border-secondary-container' : 'border-green-500'} rounded-br-lg transition-colors duration-500`}></div>

{/* Scanning Line Animation */}
{isScanning && (
  <div className="absolute left-0 right-0 h-1 bg-secondary-container/50 shadow-[0_0_15px_rgba(254,147,44,0.8)] z-10 scanner-line-animate" id="scanner-line"></div>
)}

{/* Instructions Overlay */}
<div className={`${isScanning ? 'bg-primary/80' : 'bg-green-600/90'} backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-2 transition-colors duration-500`}>
<span className={`material-symbols-outlined ${isScanning ? 'text-secondary-container animate-pulse' : 'text-white'}`}>{isScanning ? 'center_focus_strong' : 'done'}</span>
<span className="font-button-text text-button-text text-white">{isScanning ? 'Enfoca el comptador...' : 'Lectura completada'}</span>
</div>
</div>
{/* IA Status Badge */}
{!isScanning && (
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface-container-lowest/90 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg scale-110 animate-in fade-in zoom-in duration-300">
  <div className="w-2 h-2 rounded-full bg-green-500"></div>
  <span className="font-label-bold text-label-bold text-primary">Verificat per IA ✓</span>
  </div>
)}
</div>
</div>

{/* Data Entry & Action */}
<div className="px-margin-mobile py-stack-lg flex flex-col gap-stack-md">
<div className="flex flex-col gap-2">
<label className="font-label-bold text-label-bold text-on-surface-variant ml-1">Km Sortida</label>
<div className="relative group">
<div className="absolute inset-y-0 left-4 flex items-center text-primary">
<span className="material-symbols-outlined">speed</span>
</div>
<input 
  className={`w-full h-14 ${isEditing ? 'bg-surface border-2 border-primary' : 'bg-surface-container-low'} rounded-2xl pl-12 pr-14 font-headline-md text-headline-md text-primary outline-none transition-all`} 
  readOnly={!isEditing} 
  type="number" 
  value={scannedValue} 
  onChange={(e) => setScannedValue(e.target.value)}
  placeholder={isScanning ? "Calculant..." : "Introdueix km"}
/>
{!isScanning && (
  <button onClick={() => setIsEditing(!isEditing)} className={`absolute inset-y-0 right-2 w-12 flex items-center justify-center ${isEditing ? 'text-primary' : 'text-on-surface-variant'} active:scale-95 transition-all`}>
  <span className="material-symbols-outlined">{isEditing ? 'check' : 'edit'}</span>
  </button>
)}
</div>
{!isScanning && <p className="text-[12px] text-on-surface-variant px-1">Capturat automàticament per OCR</p>}
</div>

<button onClick={handleConfirm} disabled={isScanning || isConfirmed} className={`w-full h-[72px] ${isScanning ? 'bg-surface-container text-on-surface-variant opacity-50' : (isConfirmed ? 'bg-primary text-white' : 'bg-secondary-container text-on-secondary-fixed')} font-headline-md text-headline-md rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all`}>
<span className={`material-symbols-outlined ${isConfirmed ? 'animate-spin' : ''}`} style={{ fontVariationSettings: "'FILL' 1" }}>{isConfirmed ? 'sync' : 'check_circle'}</span>
      {isConfirmed ? 'GUARDANT...' : 'CONFIRMAR'}
    </button>
</div>

</div>
<style dangerouslySetInnerHTML={{__html: `
  @keyframes scan {
    0% { top: 10%; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { top: 90%; opacity: 0; }
  }
  .scanner-line-animate {
    animation: scan 2s linear infinite;
  }
`}} />
</main>
    </>
  );
}
