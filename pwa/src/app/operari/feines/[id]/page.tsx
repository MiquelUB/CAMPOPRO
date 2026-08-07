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
                <span className="font-label-bold text-label-bold text-primary"></span>
              </div>
              <button className="w-12 h-12 bg-primary rounded-full shadow-lg flex items-center justify-center text-on-primary active:scale-95 transition-transform">
                <span className="material-symbols-outlined">directions</span>
              </button>
            </div>
          </div>

          {/* Job Header Info */}
          <div className="px-margin-mobile py-stack-md">
            <h2 className="font-headline-lg text-headline-lg text-primary">Detall de feina</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1"></p>
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
