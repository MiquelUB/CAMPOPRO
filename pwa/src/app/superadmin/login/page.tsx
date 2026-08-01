"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { superAdminLogin, setTokens } from '@/lib/auth';

export default function SuperadminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [impersonateTenantId, setImpersonateTenantId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const tokens = await superAdminLogin(email, password, totp, impersonateTenantId);
      if (tokens) {
        setTokens(tokens);
        router.push("/superadmin");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0f172a] pt-safe pb-safe flex flex-col items-center justify-center min-h-screen">
      <main className="flex flex-col relative w-full max-w-md px-margin-mobile">
        <div className="flex flex-col w-full bg-[#1e293b] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden p-8">
          
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-6 w-20 h-20 bg-error/20 rounded-xl flex items-center justify-center border border-error/50">
              <span className="material-symbols-outlined text-4xl text-error">admin_panel_settings</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-white mb-2">Root Access</h1>
            <p className="font-body-md text-sm text-[#94a3b8] text-center">Accés restringit a administradors de sistema</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="font-label-bold text-xs text-[#94a3b8] uppercase tracking-wider">SuperAdmin Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-[#0f172a] border border-[#334155] rounded-lg px-4 font-body-md text-white focus:outline-none focus:border-error focus:ring-1 focus:ring-error transition-all"
                placeholder="root@campopro.com"
                required
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="font-label-bold text-xs text-[#94a3b8] uppercase tracking-wider">Master Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-[#0f172a] border border-[#334155] rounded-lg px-4 font-body-md text-white focus:outline-none focus:border-error focus:ring-1 focus:ring-error transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-bold text-xs text-[#94a3b8] uppercase tracking-wider">TOTP Code (2FA)</label>
              <input 
                type="text" 
                value={totp}
                onChange={(e) => setTotp(e.target.value)}
                className="w-full h-12 bg-[#0f172a] border border-[#334155] rounded-lg px-4 font-body-md text-white focus:outline-none focus:border-error focus:ring-1 focus:ring-error transition-all tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            <div className="h-px w-full bg-[#334155] my-2"></div>

            <div className="flex flex-col gap-1">
              <label className="font-label-bold text-xs text-[#94a3b8] flex items-center justify-between">
                <span className="uppercase tracking-wider">Impersonate (Opcional)</span>
                <span className="material-symbols-outlined text-sm" title="ID del Tenant per assumir la seva identitat">info</span>
              </label>
              <input 
                type="text" 
                value={impersonateTenantId}
                onChange={(e) => setImpersonateTenantId(e.target.value)}
                className="w-full h-12 bg-[#0f172a] border border-[#334155] rounded-lg px-4 font-body-md text-warning focus:outline-none focus:border-warning focus:ring-1 focus:ring-warning transition-all"
                placeholder="Tenant ID"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full h-14 bg-error hover:bg-error/90 text-white rounded-xl font-button-text flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin">sync</span>
              ) : (
                <span className="material-symbols-outlined">security</span>
              )}
              {isLoading ? 'VERIFICANT...' : 'ACCÉS ARREL'}
            </button>
          </form>
          
        </div>
      </main>
    </div>
  );
}
