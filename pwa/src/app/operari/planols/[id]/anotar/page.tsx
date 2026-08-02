'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const router = useRouter();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.5));

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  return (
    <>
<header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe"><div className="h-16 px-4 flex items-center justify-between"><div className="flex items-center gap-1"><button className="w-touch-target-min h-touch-target-min flex items-center justify-center text-primary" onClick={() => router.back()}><span className="material-symbols-outlined">chevron_left</span></button><h1 className="font-headline-md text-headline-md text-primary">Detall De La Feina</h1></div><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-pulse"></div><img alt="Perfil" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtwAZlJ75l9Gw7pVmLavb2QKnvmYPQzuB7phJke9yAcUDJ0ztQ8WKH1aqTSsG9RjFbewqzbEh-lpqwTHesciQLh-qbsV4tYLsupEKFm7oOf0sL5pPPZZfit0r2O40scG79F3SCHYEILi2EYMC9D21dG8DnWYtR4tBbsR8N2U6Oy6eYrwYpqtfZnePxyU5FByZqiyvjMKkJtFc53nau3eo2EdKYZf_iDBhz7w5J3AxQQ7sEhi2PPI3N"/></div></div></header><main className="flex flex-col relative w-full pt-16 pb-safe bg-surface"><div className="flex flex-col w-full">
{/* Interactive Blueprint Viewer */}
<section className="relative px-margin-mobile py-stack-md">
<div className="relative group overflow-hidden rounded-xl bg-surface-container-highest aspect-[4/3] shadow-md touch-none" id="blueprint-container">
<div className="w-full h-full transition-transform duration-200 ease-out origin-center" id="blueprint-zoom-wrapper" style={{ transform: `scale(${zoomLevel})` }}>
<img className="w-full h-full object-cover" data-alt="A high-resolution architectural blueprint of an industrial warehouse floor plan, showing detailed structural lines, electrical conduits, and ventilation systems. The style is professional and technical with sharp navy lines on a slightly off-white technical paper background. Digital annotations and red-line marks are visible in one corner." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8Oh6E5C2eDOZSlpB-dKnfE_pvLWcJOj7E4Q0B9ALtbvaa-1CBHS3Y5rbe6oOUCKAqhAH2nTnRyb0unMNApv-OCSnaMe65LYHTGs2J6P1JTTAs_vZsMJeFfBz1fX7NQTbAXwYDDj2Hp4ox7_AJnjqGqGicl_VAnUvko-WcZtdyapM5R7Q-e__eI_-xvaTZ2zKxwgNO-vkWFN3sC-fOMnhzMw8FyskDKyQJkI0tnAF2Mlr_iwLjVxwf"/>
</div>
{/* Zoom Controls Overlay */}
<div className="absolute bottom-4 right-4 flex flex-col gap-2">
<button className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg active:scale-95 transition-transform" onClick={handleZoomIn}>
<span className="material-symbols-outlined">add</span>
</button>
<button className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg active:scale-95 transition-transform" onClick={handleZoomOut}>
<span className="material-symbols-outlined">remove</span>
</button>
</div>
{/* GPS Badge Overlay */}
<div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-surface/90 backdrop-blur-md rounded-full border border-outline-variant shadow-sm">
<span className="material-symbols-outlined text-[18px] text-secondary animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
<span className="font-label-bold text-label-bold text-on-surface">Ubicació GPS fixada</span>
</div>
{/* Annotation Pin Marker (Animated) */}
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
<div className="relative flex items-center justify-center">
<div className="absolute w-8 h-8 bg-secondary/30 rounded-full animate-ping"></div>
<span className="material-symbols-outlined text-secondary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>keep</span>
</div>
</div>
</div>
<p className="mt-2 text-center font-label-bold text-label-bold text-on-surface-variant">Arrossega per moure el pin al punt exacte</p>
</section>
{/* Form Section */}
<section className="px-margin-mobile flex flex-col gap-stack-lg pb-stack-lg">
{/* Photo Capture Section */}
<div className="flex flex-col gap-stack-sm">
<label className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Documentació Gràfica</label>
<div className="flex gap-4 items-center">
{!hasPhoto ? (
  <button className="flex-1 h-24 flex flex-col items-center justify-center gap-2 bg-surface-container-high rounded-xl text-primary active:bg-primary-fixed transition-colors" onClick={() => setHasPhoto(true)}>
  <span className="material-symbols-outlined text-3xl">add_a_photo</span>
  <span className="font-button-text text-button-text">Foto del canvi</span>
  </button>
) : (
  <div className="relative w-32 h-24 rounded-xl overflow-hidden shadow-sm group">
  <img className="w-full h-full object-cover" data-alt="A close-up, high-contrast photo of a newly installed industrial electrical panel with organized wiring and fresh labels. The lighting is bright and clear, showing the texture of the metallic casing and the vibrant colors of the wires. Shallow depth of field." src="https://lh3.googleusercontent.com/aida-public/AB6AXuArqDWz4_GXzh6204opQAlf7Yju_sfr9ffH69ZRXn50CHhhab9E9Wkm25-1RQeotfSVo3wiptqMifSF2xSOJ4zc2Rh75NRhqXx0MHY9v0-f5o-XarsTvjW56cCJqac7mgyhPP4OmTpySEkwiSkY1qyi57j62-P4VzCqnUyK6JoY_0eZbMJAFRdB27S5kh0cVA10L2WL7lavBCQuNQ2mQhdkPtYQrGronC962AvKgWQ8eyNprlDkkd3k"/>
  <button onClick={() => setHasPhoto(false)} className="absolute top-1 right-1 bg-error text-on-error rounded-full p-0.5 shadow-md">
  <span className="material-symbols-outlined text-sm">close</span>
  </button>
  </div>
)}
</div>
</div>
{/* Description Field */}
<div className="flex flex-col gap-stack-sm">
<label className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider" htmlFor="observation">Què ha canviat?</label>
<textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-4 bg-surface-container-low rounded-xl text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline" id="observation" placeholder="Descriu la modificació realitzada respecte al plànol original..." rows={4}></textarea>
</div>
{/* Submit Button */}
<button onClick={handleSave} disabled={isSaving || !description} className={`w-full h-14 ${isSaving || !description ? 'bg-surface-container-highest text-on-surface-variant' : 'bg-[#008080] text-white'} rounded-xl font-button-text text-button-text shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2`}>
<span className={`material-symbols-outlined ${isSaving ? 'animate-spin' : ''}`}>{isSaving ? 'sync' : 'save'}</span>
      {isSaving ? 'GUARDANT...' : 'GUARDAR ANOTACIÓ'}
    </button>
</section>
</div>
</main>
    </>
  );
}
