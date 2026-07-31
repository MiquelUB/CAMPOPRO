"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { loginWithEmail, setTokens } from '@/lib/auth';

export default function GestioLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const tokens = await loginWithEmail(email, password);
      if (tokens) {
        setTokens(tokens);
        router.push("/gestio/dashboard");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface pt-safe pb-safe flex flex-col items-center justify-center min-h-screen">
      <main className="flex flex-col relative w-full max-w-md px-margin-mobile">
        <div className="flex flex-col w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8">
          
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-6 w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-primary">engineering</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Portal de Gestió</h1>
            <p className="font-body-md text-body-md text-on-surface-variant text-center">Accés per a enginyers i administradors de l'empresa</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-label-bold text-label-bold text-on-surface-variant">Correu electrònic</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 bg-surface-container-lowest border border-outline-variant rounded-xl px-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="enginyer@campopro.com"
                required
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="font-label-bold text-label-bold text-on-surface-variant">Contrasenya</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 bg-surface-container-lowest border border-outline-variant rounded-xl px-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full h-14 bg-primary text-white rounded-xl font-button-text flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin">sync</span>
              ) : (
                <span className="material-symbols-outlined">login</span>
              )}
              {isLoading ? 'INICIANT SESSIÓ...' : 'INICIAR SESSIÓ'}
            </button>
          </form>
          
        </div>
      </main>
    </div>
  );
}
