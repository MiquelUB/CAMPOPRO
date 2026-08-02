'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.8));

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setSeconds(0);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button onClick={() => router.back()} className="w-touch-target-min h-touch-target-min flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <h1 className="font-headline-md text-headline-md text-primary">Anotació de Plànol</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-pulse" title="Mode Sense Connexió"></div>
            <img alt="Perfil" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtwAZlJ75l9Gw7pVmLavb2QKnvmYPQzuB7phJke9yAcUDJ0ztQ8WKH1aqTSsG9RjFbewqzbEh-lpqwTHesciQLh-qbsV4tYLsupEKFm7oOf0sL5pPPZZfit0r2O40scG79F3SCHYEILi2EYMC9D21dG8DnWYtR4tBbsR8N2U6Oy6eYrwYpqtfZnePxyU5FByZqiyvjMKkJtFc53nau3eo2EdKYZf_iDBhz7w5J3AxQQ7sEhi2PPI3N" />
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-16 pb-safe bg-surface min-h-screen">
        <div className="flex flex-col w-full">
          {/* Interactive Blueprint Viewer */}
          <section className="relative px-margin-mobile py-stack-md">
            <div className="relative group overflow-hidden rounded-xl bg-surface-container-highest aspect-[4/3] shadow-md touch-none" id="blueprint-container">
              <div className="w-full h-full transition-transform duration-200 ease-out origin-center" style={{ transform: `scale(${zoomLevel})` }}>
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8Oh6E5C2eDOZSlpB-dKnfE_pvLWcJOj7E4Q0B9ALtbvaa-1CBHS3Y5rbe6oOUCKAqhAH2nTnRyb0unMNApv-OCSnaMe65LYHTGs2J6P1JTTAs_vZsMJeFfBz1fX7NQTbAXwYDDj2Hp4ox7_AJnjqGqGicl_VAnUvko-WcZtdyapM5R7Q-e__eI_-xvaTZ2zKxwgNO-vkWFN3sC-fOMnhzMw8FyskDKyQJkI0tnAF2Mlr_iwLjVxwf" alt="Plànol tècnic" />
              </div>
              
              {/* Zoom Controls Overlay */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button onClick={handleZoomIn} className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                  <span className="material-symbols-outlined">add</span>
                </button>
                <button onClick={handleZoomOut} className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                  <span className="material-symbols-outlined">remove</span>
                </button>
              </div>

              {/* GPS Badge Overlay */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-surface/90 backdrop-blur-md rounded-full border border-outline-variant shadow-sm">
                <span className="material-symbols-outlined text-[18px] text-secondary animate-pulse">location_on</span>
                <span className="font-label-bold text-label-bold text-on-surface">Ubicació GPS fixada</span>
              </div>

              {/* Annotation Pin Marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-8 h-8 bg-secondary/30 rounded-full animate-ping"></div>
                  <span className="material-symbols-outlined text-secondary text-4xl">keep</span>
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
                  <button onClick={() => setHasPhoto(true)} className="flex-1 h-24 flex flex-col items-center justify-center gap-2 bg-surface-container-high rounded-xl text-primary active:bg-primary-fixed transition-colors">
                    <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                    <span className="font-button-text text-button-text">Foto del canvi</span>
                  </button>
                ) : (
                  <div className="relative w-32 h-24 rounded-xl overflow-hidden shadow-sm group">
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuArqDWz4_GXzh6204opQAlf7Yju_sfr9ffH69ZRXn50CHhhab9E9Wkm25-1RQeotfSVo3wiptqMifSF2xSOJ4zc2Rh75NRhqXx0MHY9v0-f5o-XarsTvjW56cCJqac7mgyhPP4OmTpySEkwiSkY1qyi57j62-P4VzCqnUyK6JoY_0eZbMJAFRdB27S5kh0cVA10L2WL7lavBCQuNQ2mQhdkPtYQrGronC962AvKgWQ8eyNprlDkkd3k" alt="Foto capturada" />
                    <button onClick={() => setHasPhoto(false)} className="absolute top-1 right-1 bg-error text-on-error rounded-full p-0.5 shadow-md">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Voice Annotation Field (Mandatory for Voice-first Operari) */}
            <div className="flex flex-col gap-stack-sm">
              <label className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Anotació per Veu</label>
              <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between border border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={toggleRecording}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isRecording ? 'bg-error text-white scale-110 animate-pulse' : 'bg-primary text-white shadow-md'
                    }`}
                  >
                    <span className="material-symbols-outlined">{isRecording ? 'stop' : 'mic'}</span>
                  </button>
                  <div className="flex flex-col">
                    <span className="font-body-strong text-primary text-sm">
                      {isRecording ? 'Gravant la teva explicació...' : 'Prem per dictar la teva observació'}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {isRecording ? `00:${seconds < 10 ? '0' + seconds : seconds} / 00:30` : 'Gravació de veu directa'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Description Textarea */}
            <div className="flex flex-col gap-stack-sm">
              <label className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider" htmlFor="observation">Detall escrit (opcional)</label>
              <textarea className="w-full p-4 bg-surface-container-low rounded-xl text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline" id="observation" placeholder="Descriu la modificació realitzada respecte al plànol original..." rows={3}></textarea>
            </div>

            {/* Submit Button */}
            <button onClick={() => router.push('/operari/feines')} className="w-full h-14 bg-[#008080] text-white rounded-xl font-button-text text-button-text shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">save</span>
              GUARDAR ANOTACIÓ
            </button>
          </section>
        </div>
      </main>
    </>
  );
}
