'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button onClick={() => router.back()} className="w-touch-target-min h-touch-target-min flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <h1 className="font-headline-md text-headline-md text-primary">Detall De La Feina</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-pulse"></div>
            <img alt="Perfil" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtwAZlJ75l9Gw7pVmLavb2QKnvmYPQzuB7phJke9yAcUDJ0ztQ8WKH1aqTSsG9RjFbewqzbEh-lpqwTHesciQLh-qbsV4tYLsupEKFm7oOf0sL5pPPZZfit0r2O40scG79F3SCHYEILi2EYMC9D21dG8DnWYtR4tBbsR8N2U6Oy6eYrwYpqtfZnePxyU5FByZqiyvjMKkJtFc53nau3eo2EdKYZf_iDBhz7w5J3AxQQ7sEhi2PPI3N" />
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-16 pb-safe bg-surface">
        <div className="flex flex-col w-full pb-32">
          {/* Map Preview Section */}
          <div className="relative w-full h-[180px] overflow-hidden">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCvbJjUps0q9YpuQkGaY5sRz2m_ti7khbFlM6-CHmI8ykOmRLmMra7akOY7vF9x65dHzRdZQqeacIz_LPhVHInJ6E5g_v9awm4ReTUw-3hPNQx830GX3GzrxqwDyK6kSXn8aKLHSmKwRXY8OuBTccG5OdGUf_k9PET1PNq96ySs7M2WQDY9UzJh9kW2ZeGatQwHH-6Msl2sF7P22CxWNJs7BHja5JGG0qkVly74n-qHHixvQx472LXu')` }}></div>
            <div className="absolute bottom-4 left-5 right-5 flex justify-between items-center">
              <div className="bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                <span className="font-label-bold text-label-bold text-primary">Sector Eixample Nord</span>
              </div>
              <button className="w-12 h-12 bg-primary rounded-full shadow-lg flex items-center justify-center text-on-primary active:scale-95 transition-transform">
                <span className="material-symbols-outlined">directions</span>
              </button>
            </div>
          </div>

          {/* Job Header Info */}
          <div className="px-margin-mobile py-stack-md">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container font-label-bold text-[12px] rounded-full uppercase tracking-wider">Urgència Alta</span>
              <span className="text-outline text-label-bold">Dte: 14/03/24</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-primary">Reparació Escomesa d'Aigua</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Intervenció a la xarxa de distribució secundària.</p>
          </div>

          {/* Instructions Card */}
          <div className="px-margin-mobile mb-stack-lg">
            <div className="bg-surface-container-low p-5 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-primary">
                <span className="material-symbols-outlined">engineering</span>
                <h3 className="font-label-bold text-label-bold uppercase tracking-tight">Instruccions de l'enginyer</h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                Cal localitzar la fuita exactament abans de picar. El paviment és hidràulic antic. Si us plau, feu fotos del procés d'obertura.
              </p>
            </div>
          </div>

          {/* Layout Grid: Materials and Tools */}
          <div className="px-margin-mobile grid grid-cols-1 gap-stack-md mb-stack-lg">
            {/* Materials */}
            <div className="bg-surface-container-low p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-primary">
                  <span className="material-symbols-outlined">inventory_2</span>
                  <h3 className="font-label-bold text-label-bold uppercase tracking-tight">Material assignat</h3>
                </div>
                <span className="text-primary font-label-bold text-label-bold bg-primary-fixed px-2 py-0.5 rounded">2 ítems</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center justify-between bg-surface-container-highest p-3 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-label-bold text-on-surface">Tub PE 25mm</span>
                    <span className="text-[12px] text-on-surface-variant">Codi: MAT-0293</span>
                  </div>
                  <span className="font-headline-md text-headline-md text-primary">6m</span>
                </li>
                <li className="flex items-center justify-between bg-surface-container-highest p-3 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-label-bold text-on-surface">Vàlvula 1"</span>
                    <span className="text-[12px] text-on-surface-variant">Inox reforçada</span>
                  </div>
                  <span className="font-headline-md text-headline-md text-primary">1u</span>
                </li>
              </ul>
            </div>

            {/* Tools */}
            <div className="bg-surface-container-low p-5 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <span className="material-symbols-outlined">handyman</span>
                <h3 className="font-label-bold text-label-bold uppercase tracking-tight">Eines necessàries</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white px-3 py-2 rounded-lg text-body-md shadow-sm">Tallatubs radial</span>
                <span className="bg-white px-3 py-2 rounded-lg text-body-md shadow-sm">Llave Stillson</span>
                <span className="bg-white px-3 py-2 rounded-lg text-body-md shadow-sm">Detector de metalls</span>
              </div>
            </div>

            {/* Attachment */}
            <Link href="/operari/planols/1/anotar" className="flex items-center gap-4 bg-primary-container text-on-primary-container p-3 rounded-xl active:opacity-80 transition-opacity">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/20 shrink-0">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKWndsRtzpf1OCPI-wCnYbSWbN0MUPFGXnHLQzjg8Rj5XCkpNTdHjWU2VvgxoGjiia3Ir8solkDwPni9mtQXpZu0ZQuGv1jEslYc4OtvZQ0NtlII-Tn5aSvkB_RLtCjQ-TCE4xGZ6zd5xTP3uDzAax5e4bhKD18mSfBF0TjpPxiof0ZjCeqDrqRo97_sRZ1MAzPcbrxMXKxR51ik8-KVb0mI3A5DrFGM-BnNZsP_673c62scm83lFL" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-label-bold text-label-bold">Plànol adjunt</span>
                <span className="text-[12px] opacity-80">PLAN_ZONA_034_REV2.pdf (1.2MB)</span>
              </div>
              <span className="material-symbols-outlined ml-auto">open_in_new</span>
            </Link>
          </div>

          {/* Sticky Bottom Action */}
          <div className="fixed bottom-0 inset-x-0 bg-surface/80 backdrop-blur-xl p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40">
            <button 
              onClick={() => router.push('/operari/feines/1/curs')} 
              className="w-full h-[64px] bg-[#1a8a3a] text-white rounded-2xl flex items-center justify-center gap-4 shadow-lg active:scale-[0.98] transition-all relative overflow-hidden group"
            >
              <span className="material-symbols-outlined text-[32px]">play_circle</span>
              <span className="font-headline-md text-headline-md uppercase tracking-wide">Començar feina</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
