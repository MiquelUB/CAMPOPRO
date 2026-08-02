import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-surface font-body-base text-on-surface flex items-center justify-center">
      {/* Interactive Background Layer */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-primary-container to-on-primary-fixed overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-secondary/10 blur-[100px]" style={{ animation: 'pulse 8s infinite alternate' }}></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      </div>
      
      {/* Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-md w-full max-w-5xl">
        {/* Branding */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-24 h-24 mb-6 drop-shadow-md transform transition-transform hover:scale-105 duration-500">
            <img alt="CampoPro Logo" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida/AP1WRLsEXFuQ4rmmM6G9GiP2Wc1vF-mvbIxAj1gCebc33OvQEY7pafglJcHcVF_69XfQ1M8JO4wJAGm547Zj0L19kbIe10YNOcBQmYBueHpTMNBGCnoXSQ_alln7Z5WFWt5-Cn97yJ9ffWW7LBpeIOnWV8-8x8PXbHS-fNYeuGaX55ts_6UD_U6P0o4YF6hNTWbkFh-qoGbwhbYw1ZCycoonB_94NWgX5mSb5y8Pa65DRzMGc9oydmf8LpzkT7I"/>
          </div>
          <h1 className="font-display-lg text-4xl text-on-surface tracking-tight text-center">
            Selecciona el teu accés
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Portal Enginyer */}
          <Link href="/gestio/login" className="group relative bg-surface-container-lowest/95 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden p-8 border-t border-white/10 transition-all hover:shadow-2xl hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                <span className="material-symbols-outlined text-3xl">dashboard</span>
              </div>
              <h2 className="font-section-title text-2xl text-on-surface mb-3">Enginyer / Gestió</h2>
              <p className="font-body-base text-on-surface-variant mb-6">
                Accés al portal de gestió completa, mapes, operaris i flota.
              </p>
              <div className="w-full bg-primary hover:bg-primary/90 text-on-primary py-3 rounded-lg font-body-strong transition-all flex items-center justify-center gap-2">
                Accedir <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
              </div>
            </div>
          </Link>

          {/* Portal Operari */}
          <Link href="/operari/login" className="group relative bg-surface-container-lowest/95 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden p-8 border-t border-white/10 transition-all hover:shadow-2xl hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                <span className="material-symbols-outlined text-3xl">engineering</span>
              </div>
              <h2 className="font-section-title text-2xl text-on-surface mb-3">Operari de Camp</h2>
              <p className="font-body-base text-on-surface-variant mb-6">
                PWA dissenyada per tasques de camp, mode offline i Kimi Vision.
              </p>
              <div className="w-full bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-white py-3 rounded-lg font-body-strong transition-all flex items-center justify-center gap-2">
                Accedir <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Portal SuperAdmin (Circular discret) */}
        <div className="fixed bottom-6 right-6">
          <Link href="/superadmin/login" className="flex items-center justify-center w-12 h-12 rounded-full bg-surface-variant/50 hover:bg-surface-variant text-on-surface-variant backdrop-blur-md transition-all shadow-sm hover:shadow-md border border-outline-variant/30 opacity-70 hover:opacity-100" title="Super Admin">
            <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
          </Link>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          from { transform: scale(1) translate(0, 0); opacity: 0.15; }
          to { transform: scale(1.1) translate(20px, 10px); opacity: 0.25; }
        }
      `}} />
    </main>
  );
}
