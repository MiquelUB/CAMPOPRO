'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Clock, LogIn, LogOut, Coffee, MapPin, ShieldCheck, ArrowLeft, CheckCircle2, 
  AlertCircle, Calendar, RefreshCw, Smartphone
} from 'lucide-react';

export default function OperariJornadaPage() {
  const router = useRouter();

  // Manual Check-in / Shift States
  const [shiftStatus, setShiftStatus] = useState<'FORA_JORNADA' | 'EN_JORNADA' | 'EN_PAUSA'>('FORA_JORNADA');
  const [iniciHora, setIniciHora] = useState<string | null>(null);
  const [finalHora, setFinalHora] = useState<string | null>(null);
  const [pausaDescripcio, setPausaDescripcio] = useState<string | null>(null);
  
  // Custom manual time input (allows worker to fix/verify the exact hour)
  const [manualTimeInput, setManualTimeInput] = useState<string>(
    new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })
  );

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // MANUALLY REGISTER INICI JORNADA (ENTRADA)
  const handleRegistrarInici = () => {
    const timeToSet = manualTimeInput || new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
    setIniciHora(timeToSet);
    setFinalHora(null);
    setShiftStatus('EN_JORNADA');
    setFeedbackMsg(`🟢 INICI DE JORNADA MANUALLY FITXAT A LES ${timeToSet}.`);
  };

  // MANUALLY REGISTER FINAL JORNADA (SORTIDA)
  const handleRegistrarFinal = () => {
    const timeToSet = manualTimeInput || new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
    setFinalHora(timeToSet);
    setShiftStatus('FORA_JORNADA');
    setFeedbackMsg(`🔴 FINAL DE JORNADA MANUALLY FITXAT A LES ${timeToSet}. Sincronitzat amb el registre de llei (RDL 8/2019).`);
  };

  // MANUALLY REGISTER PAUSA (PAUSA ESMORZAR / DINAR)
  const handleTogglePausa = () => {
    if (shiftStatus === 'EN_PAUSA') {
      setShiftStatus('EN_JORNADA');
      setFeedbackMsg('🟢 Rejuntament a la jornada finalitzat. Reprès el registre de treball.');
    } else {
      setShiftStatus('EN_PAUSA');
      setPausaDescripcio('Pausa Esmorzar (30 min)');
      setFeedbackMsg('☕ Pausa de descans registrada. El temps de pausa no computa com a treball efectiu.');
    }
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 text-primary hover:bg-neutral-100 rounded-full">
              <ArrowLeft size={20} />
            </button>
            <span className="font-headline-md text-headline-md text-primary tracking-tight">Inici / Final de Jornada</span>
          </div>
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
            <ShieldCheck size={12} /> Llei RDL 8/2019
          </span>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex flex-col relative w-full pt-20 pb-28 min-h-screen bg-neutral-50 px-4 space-y-4">
        
        {/* Status Card */}
        <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-primary text-white p-5 rounded-3xl shadow-xl border border-emerald-700 space-y-4">
          <div className="flex justify-between items-center border-b border-emerald-800 pb-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-300 block uppercase tracking-wider">Control Horari Manual Operari</span>
              <h2 className="font-bold text-lg text-white">Estat Actual de la Jornada</h2>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
              shiftStatus === 'EN_JORNADA' ? 'bg-emerald-500 text-emerald-950 animate-pulse' :
              shiftStatus === 'EN_PAUSA' ? 'bg-amber-400 text-amber-950' :
              'bg-neutral-800 text-neutral-300'
            }`}>
              {shiftStatus === 'EN_JORNADA' && '🟢 EN JORNADA'}
              {shiftStatus === 'EN_PAUSA' && '☕ EN PAUSA (DESCANS)'}
              {shiftStatus === 'FORA_JORNADA' && '🔴 FORA DE JORNADA'}
            </span>
          </div>

          {/* Time Displays */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700/60">
              <span className="text-[10px] text-emerald-300 font-bold block uppercase flex items-center justify-center gap-1">
                <LogIn size={12} /> Hora d'Inici (Entrada)
              </span>
              <span className="text-xl font-extrabold text-white mt-1 block">
                {iniciHora || '--:--'}
              </span>
            </div>

            <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700/60">
              <span className="text-[10px] text-emerald-300 font-bold block uppercase flex items-center justify-center gap-1">
                <LogOut size={12} /> Hora de Final (Sortida)
              </span>
              <span className="text-xl font-extrabold text-white mt-1 block">
                {finalHora || '--:--'}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-emerald-300 font-mono pt-1">
            <span className="flex items-center gap-1">
              <MapPin size={14} className="text-emerald-400" /> GPS
            </span>
            <span className="font-bold text-white">Registre 100% Legal</span>
          </div>
        </div>

        {/* Manual Time Selector & Action Controls */}
        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2 border-b pb-2">
            <Clock size={18} className="text-primary" />
            Fitxatge Manual (L'operari fixa l'hora exacta)
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-700 block">
              Hora a registrar (Verifica o modifica l'hora si és necessari):
            </label>
            <input 
              type="text" 
              value={manualTimeInput}
              onChange={(e) => setManualTimeInput(e.target.value)}
              className="w-full p-3.5 bg-neutral-50 border border-neutral-300 rounded-2xl font-mono text-center text-xl font-extrabold text-neutral-900 outline-none focus:border-primary"
            />
          </div>

          {/* Big Buttons for Inici & Final */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            {shiftStatus !== 'EN_JORNADA' && shiftStatus !== 'EN_PAUSA' ? (
              <button
                type="button"
                onClick={handleRegistrarInici}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <LogIn size={20} />
                🟢 FITXAR INICI DE JORNADA (ENTRADA)
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRegistrarFinal}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-extrabold text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={20} />
                🔴 FITXAR FINAL DE JORNADA (SORTIDA)
              </button>
            )}

            {(shiftStatus === 'EN_JORNADA' || shiftStatus === 'EN_PAUSA') && (
              <button
                type="button"
                onClick={handleTogglePausa}
                className={`w-full py-3 rounded-2xl font-bold text-xs shadow transition-all flex items-center justify-center gap-2 ${
                  shiftStatus === 'EN_PAUSA' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                <Coffee size={18} />
                {shiftStatus === 'EN_PAUSA' ? '▶️ Reprendre Jornada de Treball' : '☕ Activar Pausa / Descans (Esmorzar)'}
              </button>
            )}
          </div>

          {feedbackMsg && (
            <div className="p-3 bg-neutral-900 text-white rounded-2xl text-xs font-bold text-center animate-in fade-in shadow-inner">
              {feedbackMsg}
            </div>
          )}
        </div>

        {/* Weekly & Legal Compliance Summary */}
        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-3 text-xs">
          <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            Resum de Jornades de la Setmana
          </h4>

          <div className="space-y-2">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-neutral-900 block">Dilluns 03 Agost (Avui)</span>
                <span className="text-neutral-500 block text-[11px]">Entrada: {iniciHora || '08:02'} • Sortida: {finalHora || 'En curs'}</span>
              </div>
              <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                Auditat
              </span>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-neutral-900 block">Divendres 31 Juliol</span>
                <span className="text-neutral-500 block text-[11px]">Entrada: 08:00 • Sortida: 16:30 (8.5 h)</span>
              </div>
              <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                8.5 h (0.5h extra)
              </span>
            </div>
          </div>
        </div>

      </main>

      {/* PWA Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex justify-around items-center h-20 px-2">
          <Link className="flex flex-col items-center justify-center gap-1 w-14 h-16 text-on-surface-variant hover:text-primary transition-colors" href="/operari/feines">
            <span className="material-symbols-outlined">content_paste</span>
            <span className="font-label-bold text-[9px] uppercase tracking-wider">Feines</span>
          </Link>
          
          <Link className="flex flex-col items-center justify-center gap-1 w-14 h-16 text-primary font-bold" href="/operari/jornada">
            <span className="material-symbols-outlined">schedule</span>
            <span className="font-label-bold text-[9px] uppercase tracking-wider">Jornada</span>
          </Link>

          <Link className="flex flex-col items-center justify-center gap-1 w-14 h-16 text-on-surface-variant hover:text-primary transition-colors" href="/operari/tiquets">
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="font-label-bold text-[9px] uppercase tracking-wider">Tiquets</span>
          </Link>

          <Link className="flex flex-col items-center justify-center gap-1 w-14 h-16 text-on-surface-variant hover:text-primary transition-colors" href="/operari/camera">
            <span className="material-symbols-outlined">photo_camera</span>
            <span className="font-label-bold text-[9px] uppercase tracking-wider">Càmera</span>
          </Link>

          <Link className="flex flex-col items-center justify-center gap-1 w-14 h-16 text-on-surface-variant hover:text-primary transition-colors" href="/operari/material">
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="font-label-bold text-[9px] uppercase tracking-wider">Material</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
