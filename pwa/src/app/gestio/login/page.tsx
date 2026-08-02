'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

export default function GestioLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <main className="w-full min-h-screen bg-surface font-body-base text-on-surface flex items-center justify-center">
      {/* Interactive Background Layer */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-primary-container to-on-primary-fixed overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-secondary/10 blur-[100px]" style={{ animation: 'pulse 8s infinite alternate' }}></div>
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      </div>
      
      {/* Login Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-md w-full">
        {/* Login Card */}
        <div className="w-full max-w-[440px] bg-surface-container-lowest/95 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden p-xl border-t border-white/10 p-8">
          {/* Branding */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 mb-6 drop-shadow-md transform transition-transform hover:scale-105 duration-500">
              {/* Using img instead of Image for standard compatibility as src is external */}
              <img alt="CampoPro Logo" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida/AP1WRLsEXFuQ4rmmM6G9GiP2Wc1vF-mvbIxAj1gCebc33OvQEY7pafglJcHcVF_69XfQ1M8JO4wJAGm547Zj0L19kbIe10YNOcBQmYBueHpTMNBGCnoXSQ_alln7Z5WFWt5-Cn97yJ9ffWW7LBpeIOnWV8-8x8PXbHS-fNYeuGaX55ts_6UD_U6P0o4YF6hNTWbkFh-qoGbwhbYw1ZCycoonB_94NWgX5mSb5y8Pa65DRzMGc9oydmf8LpzkT7I"/>
            </div>
            <h1 className="font-section-title text-2xl font-bold text-on-surface tracking-tight text-center">
              Accés Gestió CampoPro
            </h1>
            <p className="font-body-base text-sm text-on-surface-variant mt-2 text-center">
              Introduïu les vostres credencials per continuar
            </p>
          </div>
          
          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Field Group: Credentials */}
            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-bold text-outline mb-1 uppercase tracking-widest">Correu Electrònic</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                  <input className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-base text-body-base focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all" placeholder="nom@campopro.cat" required type="email"/>
                </div>
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-outline mb-1 uppercase tracking-widest">Contrasenya</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                  <input className="w-full pl-10 pr-12 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-base text-body-base focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all" placeholder="••••••••" required type={showPassword ? 'text' : 'password'}/>
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" onClick={handlePasswordToggle} type="button">
                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Field Group: 2FA */}
            <div className="pt-4 border-t border-surface-container-highest">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold text-outline uppercase tracking-widest">Codi 2FA (Sis dígits)</label>
                <span className="material-symbols-outlined text-secondary text-[18px]" title="Seguretat Requerida">verified_user</span>
              </div>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input 
                    key={index}
                    ref={(el: HTMLInputElement | null) => { 
                        if (el) otpRefs.current[index] = el; 
                    }}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-surface-container border border-outline-variant rounded-lg focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all" 
                    maxLength={1} 
                    type="text"
                  />
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="space-y-4 pt-4">
              <button disabled={isLoading} className="w-full bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-white py-4 rounded-lg font-bold shadow-lg shadow-secondary/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group" type="submit">
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    Carregant...
                  </>
                ) : (
                  <>
                    Entrar a la Plataforma
                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </>
                )}
              </button>
              <div className="text-center">
                <a className="text-sm text-primary hover:text-secondary-container transition-colors underline-offset-4 hover:underline decoration-secondary-container/30" href="#">
                  Has oblidat la contrasenya?
                </a>
              </div>
            </div>
          </form>
        </div>
        
        {/* Security Footer */}
        <div className="mt-8 flex flex-col items-center gap-2 opacity-80">
          <div className="flex items-center gap-3 bg-on-primary-fixed/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 shadow-sm">
            <span className="material-symbols-outlined text-white text-[16px]">shield</span>
            <span className="text-xs font-bold text-white uppercase tracking-widest">Plataforma segura</span>
            <span className="w-1 h-1 rounded-full bg-white/30"></span>
            <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1">
              Dades a UE <span className="text-[14px] leading-none">🇪🇺</span>
            </span>
          </div>
          <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] mt-2">CampoPro ERP v4.2.0 • Field Service Management</p>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          from { transform: scale(1) translate(0, 0); opacity: 0.15; }
          to { transform: scale(1.1) translate(20px, 10px); opacity: 0.25; }
        }
        
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #eeedf1 inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}} />
    </main>
  );
}
