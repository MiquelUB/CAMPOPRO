"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { loginWithPin, setTokens } from '@/lib/auth';

export default function OperariLogin() {
  const [pin, setPin] = useState("");
  const [isOffline, setIsOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const pressKey = async (num: string) => {
    if (pin.length < 4 && !isLoading) {
      const newPin = pin + num;
      setPin(newPin);
      
      // Haptic feedback
      if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(40);
      }
      
      if (newPin.length === 4) {
        setIsLoading(true);
        try {
          const tokens = await loginWithPin(newPin);
          if (tokens) {
            setTokens(tokens);
            router.push('/operari/vehicles');
          }
        } catch (error) {
          console.error("Login failed:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const clearPin = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const biometric = () => {
    // Micro-interaction for biometric button
    const bioIcon = document.getElementById('bio-icon');
    if (bioIcon) {
      bioIcon.classList.add('animate-ping');
      setTimeout(() => bioIcon.classList.remove('animate-ping'), 600);
    }
  };

  return (
    <div className="bg-surface pt-safe pb-safe flex flex-col items-center justify-center min-h-screen">
      <main className="flex flex-col relative w-full max-w-md">
        <div className="flex flex-col w-full min-h-[100dvh] bg-gradient-to-br from-[#1E3A5F] to-[#0F172A] overflow-hidden">
          
          {/* Top Status / Branding */}
          <div className="flex flex-col items-center pt-12 pb-8">
            <div className="relative mb-6">
              <img 
                alt="CampoPro Logo" 
                className="w-24 h-24 object-contain" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyfgc0zyQna-r0ueG7MrWoLn2_8TM_wo1LhvkjbC2rukdyoCJzt7KA7JkBqutjpr5WeGR_h33iTMwEo2U5n07Zw7wsdz4EtI60YKBQH0bUmNPG520V6-vzA04PmImrBXwlD2JvxTX6VLYbltieM8_DMrW8iIpO8aCA46VOxvMs8x4a2JWO89_0iZz6T6_1E0bN1Kv7qyQoTRb1LCMJedoRRHgfr2aJd9yUqpfnAl8B4WrKPC7K7eYq"
              />
              {/* Offline Badge */}
              {isOffline && (
                <div className="absolute -top-1 -right-1 flex items-center gap-1.5 bg-secondary-container px-3 py-1 rounded-full shadow-lg">
                  <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-label-bold text-on-secondary-container uppercase tracking-wider">Offline</span>
                </div>
              )}
            </div>
            <h1 className="font-headline-lg text-headline-lg text-white mb-2">Benvingut</h1>
            <p className="font-body-md text-body-md text-on-primary-container opacity-80">Introdueix el teu PIN d'accés</p>
          </div>

          {/* PIN Display */}
          <div className="flex justify-center gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                  i <= pin.length ? 'bg-white scale-125 border-white' : 'border-primary-fixed bg-transparent'
                }`}
              ></div>
            ))}
          </div>

          {/* Keypad Container */}
          <div className="px-margin-mobile pb-12 mt-auto z-10">
            <div className="grid grid-cols-3 gap-y-6 gap-x-4 justify-items-center max-w-[320px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button 
                  key={num}
                  className="w-[72px] h-[72px] rounded-full flex items-center justify-center bg-white/10 active:bg-white/30 transition-colors" 
                  onClick={() => pressKey(num)}
                >
                  <span className="font-headline-md text-headline-md text-white">{num}</span>
                </button>
              ))}
              
              <button 
                className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-primary-fixed-dim active:scale-90 transition-transform" 
                onClick={biometric}
              >
                <span id="bio-icon" className="material-symbols-outlined text-[32px]">fingerprint</span>
              </button>
              
              <button 
                className="w-[72px] h-[72px] rounded-full flex items-center justify-center bg-white/10 active:bg-white/30 transition-colors" 
                onClick={() => pressKey('0')}
              >
                <span className="font-headline-md text-headline-md text-white">0</span>
              </button>
              
              <button 
                className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-white/60 active:text-white transition-colors" 
                onClick={clearPin}
              >
                <span className="material-symbols-outlined text-[32px]">backspace</span>
              </button>
            </div>
          </div>

          {/* Decorative particle overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg height="100%" width="100%">
              <circle cx="10%" cy="20%" fill="white" r="2"></circle>
              <circle cx="90%" cy="40%" fill="white" r="1"></circle>
              <circle cx="20%" cy="80%" fill="white" r="3"></circle>
              <circle cx="85%" cy="85%" fill="white" r="2"></circle>
              <circle cx="50%" cy="10%" fill="white" r="1"></circle>
            </svg>
          </div>
        </div>
      </main>
    </div>
  );
}
