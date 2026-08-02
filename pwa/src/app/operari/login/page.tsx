'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [pin, setPin] = useState('');

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => {
          router.push('/operari/feines');
        }, 300);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <main className="flex flex-col relative w-full pt-16 pb-safe bg-surface min-h-screen">
        <div className="flex flex-col w-full h-[calc(100vh-64px)] justify-between px-margin-mobile py-stack-lg">
          {/* Top Status / Branding */}
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-lg mb-2">
              <span className="material-symbols-outlined text-[36px]">engineering</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary text-center">Identificació Operari</h1>
            <p className="font-body-md text-body-md text-on-surface-variant text-center">Introdueix el teu PIN de 4 dígits</p>
            {/* Offline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-full border border-outline-variant mt-2">
              <span className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-pulse"></span>
              <span className="font-label-bold text-[12px] text-on-surface-variant uppercase tracking-wider">Mode Offline Actiu</span>
            </div>
          </div>

          {/* PIN Display */}
          <div className="flex justify-center gap-4 my-auto">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-14 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                  pin.length > idx
                    ? 'border-primary bg-primary-container text-on-primary-container scale-105 shadow-md'
                    : 'border-outline-variant bg-surface-container-low text-on-surface-variant'
                }`}
              >
                {pin.length > idx ? '•' : ''}
              </div>
            ))}
          </div>

          {/* Keypad Container */}
          <div className="w-full max-w-sm mx-auto flex flex-col gap-3 mb-6">
            {/* Row 1 */}
            <div className="grid grid-cols-3 gap-3">
              {['1', '2', '3'].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num)}
                  className="h-16 rounded-2xl bg-surface-container-low font-headline-md text-headline-md text-primary active:bg-primary-container active:scale-95 transition-all shadow-sm flex items-center justify-center"
                >
                  {num}
                </button>
              ))}
            </div>
            {/* Row 2 */}
            <div className="grid grid-cols-3 gap-3">
              {['4', '5', '6'].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num)}
                  className="h-16 rounded-2xl bg-surface-container-low font-headline-md text-headline-md text-primary active:bg-primary-container active:scale-95 transition-all shadow-sm flex items-center justify-center"
                >
                  {num}
                </button>
              ))}
            </div>
            {/* Row 3 */}
            <div className="grid grid-cols-3 gap-3">
              {['7', '8', '9'].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num)}
                  className="h-16 rounded-2xl bg-surface-container-low font-headline-md text-headline-md text-primary active:bg-primary-container active:scale-95 transition-all shadow-sm flex items-center justify-center"
                >
                  {num}
                </button>
              ))}
            </div>
            {/* Row 4 */}
            <div className="grid grid-cols-3 gap-3">
              <div className="h-16"></div>
              <button
                onClick={() => handleKeyPress('0')}
                className="h-16 rounded-2xl bg-surface-container-low font-headline-md text-headline-md text-primary active:bg-primary-container active:scale-95 transition-all shadow-sm flex items-center justify-center"
              >
                0
              </button>
              <button
                onClick={handleDelete}
                className="h-16 rounded-2xl bg-surface-container-high text-on-surface-variant active:bg-error-container active:text-error active:scale-95 transition-all flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[28px]">backspace</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
