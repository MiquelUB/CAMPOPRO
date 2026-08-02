'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push('/gestio');
    }, 800);
  };

  return (
    <div className="bg-surface font-body-base text-on-surface flex items-center justify-center min-h-screen">
      <main className="w-full">
        <div className="flex flex-col w-full">
          {/* Interactive Background Layer */}
          <div className="fixed inset-0 z-0 bg-gradient-to-br from-primary-container to-on-primary-fixed overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-secondary/10 blur-[100px]" style={{ animation: 'pulse 8s infinite alternate' }}></div>
            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          </div>

          {/* Login Container */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-md">
            {/* Login Card */}
            <div className="w-full max-w-[440px] bg-surface-container-lowest/95 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden p-xl border-t border-white/10">
              {/* Branding */}
              <div className="flex flex-col items-center mb-xl">
                <div className="w-24 h-24 mb-md drop-shadow-md transform transition-transform hover:scale-105 duration-500">
                  <img alt="CampoPro Logo" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida/AP1WRLsEXFuQ4rmmM6G9GiP2Wc1vF-mvbIxAj1gCebc33OvQEY7pafglJcHcVF_69XfQ1M8JO4wJAGm547Zj0L19kbIe10YNOcBQmYBueHpTMNBGCnoXSQ_alln7Z5WFWt5-Cn97yJ9ffWW7LBpeIOnWV8-8x8PXbHS-fNYeuGaX55ts_6UD_U6P0o4YF6hNTWbkFh-qoGbwhbYw1ZCycoonB_94NWgX5mSb5y8Pa65DRzMGc9oydmf8LpzkT7I" />
                </div>
                <h1 className="font-section-title text-section-title text-on-surface tracking-tight text-center">
                  Accés Gestió CampoPro
                </h1>
                <p className="font-body-base text-body-base text-on-surface-variant mt-xs text-center">
                  Introduïu el vostre correu i contrasenya per accedir
                </p>
              </div>

              {/* Login Form */}
              <form className="space-y-lg" id="loginForm" onSubmit={handleSubmit}>
                {/* Field Group: Credentials */}
                <div className="space-y-md">
                  <div className="group">
                    <label className="block font-label-caps text-label-caps text-outline mb-xs uppercase tracking-widest">Correu Electrònic</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                      <input 
                        className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-base text-body-base focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all" 
                        defaultValue="enginyer@campopro.cat" 
                        placeholder="enginyer@campopro.cat" 
                        required 
                        type="email" 
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block font-label-caps text-label-caps text-outline mb-xs uppercase tracking-widest">Contrasenya</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                      <input 
                        className="w-full pl-10 pr-12 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-base text-body-base focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all" 
                        defaultValue="password123" 
                        id="passwordInput" 
                        placeholder="••••••••" 
                        required 
                        type={showPassword ? "text" : "password"} 
                      />
                      <button 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" 
                        onClick={() => setShowPassword(!showPassword)} 
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={rememberMe} 
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-primary rounded border-outline-variant focus:ring-primary" 
                      />
                      <span className="text-xs text-on-surface-variant font-body-base">Recorda la meva sessió</span>
                    </label>
                    <a className="text-xs text-primary hover:underline font-body-strong" href="#">
                      Has oblidat la contrasenya?
                    </a>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-md pt-sm">
                  <button 
                    className="w-full bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-white py-4 rounded-lg font-body-strong text-body-strong shadow-lg shadow-secondary/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group" 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">sync</span> Carregant...
                      </>
                    ) : (
                      <>
                        Entrar a la Plataforma
                        <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Security Footer */}
            <div className="mt-xl flex flex-col items-center gap-2 opacity-80">
              <div className="flex items-center gap-sm bg-on-primary-fixed/30 backdrop-blur-md px-md py-sm rounded-full border border-white/5 shadow-sm">
                <span className="material-symbols-outlined text-white text-[16px]">shield</span>
                <span className="font-label-caps text-label-caps text-white uppercase tracking-widest">Plataforma segura</span>
                <span className="w-1 h-1 rounded-full bg-white/30"></span>
                <span className="font-label-caps text-label-caps text-white uppercase tracking-widest flex items-center gap-1">
                  Dades a UE 🇪🇺
                </span>
              </div>
              <p className="font-label-caps text-[10px] text-white/50 uppercase tracking-[0.2em] mt-xs">CampoPro ERP v4.2.0 • Field Service Management</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
