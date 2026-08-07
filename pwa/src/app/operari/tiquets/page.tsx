'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Camera, CreditCard, Receipt, Upload, CheckCircle2, ArrowLeft, Fuel, 
  Utensils, Wrench, Shield, DollarSign, Clock, Check, RefreshCw, Package, MoreHorizontal
} from 'lucide-react';

interface ExpenseReceipt {
  id: string;
  concept: string;
  amount: string;
  category: 'BENZINA' | 'MATERIAL' | 'DIETES' | 'EINA_EMERGENCIA' | 'PEATGE' | 'ALTRES';
  date: string;
  cardAssigned: string;
  photoUrl: string;
  status: 'SINCRONITZAT' | 'PENDENT_APROVACIO';
}

const INITIAL_EXPENSES: ExpenseReceipt[] = [];

export default function OperariTiquetsPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<ExpenseReceipt[]>(INITIAL_EXPENSES);
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseReceipt['category']>('BENZINA');
  const [selectedCard, setSelectedCard] = useState('Targeta Jordi Soler (**** 4122)');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSimulatePhoto = () => {
    setPhotoPreview('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80');
  };

  const handleSaveReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !concept) return;

    setIsUploading(true);

    setTimeout(() => {
      const newExp: ExpenseReceipt = {
        id: `exp-${Date.now()}`,
        concept,
        amount: `${parseFloat(amount).toFixed(2)} €`,
        category,
        date: new Date().toLocaleString('ca-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        cardAssigned: selectedCard,
        photoUrl: photoPreview || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
        status: 'SINCRONITZAT'
      };

      setExpenses([newExp, ...expenses]);
      setIsUploading(false);
      setConcept('');
      setAmount('');
      setPhotoPreview(null);
      alert('🟢 Tiquet registrat i sincronitzat directament amb el departament de Comptabilitat al Dashboard Web (/gestio/configuracio i /gestio/operaris)!');
    }, 800);
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 text-primary hover:bg-neutral-100 rounded-full">
              <ArrowLeft size={20} />
            </button>
            <span className="font-headline-md text-headline-md text-primary tracking-tight">Registre de Tiquets i Despeses</span>
          </div>
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300">
            🟢 PWA Mòbil
          </span>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-20 pb-24 min-h-screen bg-neutral-50 px-4 space-y-4">
        
        {/* Form Card for Uploading Ticket */}
        <form onSubmit={handleSaveReceipt} className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="font-bold text-neutral-900 text-base flex items-center gap-2">
              <Receipt size={20} className="text-primary" />
              Pujar Tiquet de Targeta Corporativa
            </h2>
            <span className="text-[10px] font-mono font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
              Llei RDL 8/2019
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">Targeta Corporativa Assignada</label>
              <select 
                value={selectedCard}
                onChange={(e) => setSelectedCard(e.target.value)}
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-primary outline-none"
              >
                <option value="Targeta Jordi Soler (**** 4122)">Targeta Jordi Soler (**** 4122) — Cap de Grup</option>
                <option value="Targeta Pau Ribas (**** 8821)">Targeta Pau Ribas (**** 8821) — Maquinista</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Import de la Despesa (€) *</label>
                <input 
                  required
                  type="number" 
                  step="0.01"
                  placeholder="ex: 45.50"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-extrabold text-neutral-900 text-base outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Tipus de Despesa *</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 outline-none"
                >
                  <option value="BENZINA">⛽ Benzina / Combustible</option>
                  <option value="MATERIAL">📦 Material de Camp / Substitució</option>
                  <option value="DIETES">🍽️ Dietes / Dinar de Colla</option>
                  <option value="PEATGE">🛣️ Peatge / Autopista</option>
                  <option value="EINA_EMERGENCIA">🛠️ Eina d'Emergència</option>
                  <option value="ALTRES">📋 Altres despeses de camp</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">Concepte o Motiu de la Despesa *</label>
              <input 
                required
                type="text" 
                placeholder="ex: Compra de fittings PE 50mm per emergència..."
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-900 outline-none focus:border-primary"
              />
            </div>

            {/* Photo Capture Section */}
            <div>
              <label className="font-bold text-neutral-700 block mb-1">Fotografia del Tiquet / Comprovant Fisic *</label>
              
              {!photoPreview ? (
                <button
                  type="button"
                  onClick={handleSimulatePhoto}
                  className="w-full p-6 border-2 border-dashed border-neutral-300 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-neutral-50 transition-colors text-primary"
                >
                  <Camera size={32} />
                  <span className="font-bold text-xs">Obrir Càmera o Triar Foto del Tiquet</span>
                </button>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-neutral-300 shadow-sm">
                  <img src={photoPreview} alt="Tiquet" className="w-full h-40 object-cover" />
                  <button 
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow"
                  >
                    ×
                  </button>
                  <span className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    ✓ Foto Escanejada (OCR Actiu)
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {isUploading ? (
              <RefreshCw className="animate-spin" size={18} />
            ) : (
              <Upload size={18} />
            )}
            {isUploading ? 'Enviant a Comptabilitat...' : 'Pujar i Sincronitzar Tiquet'}
          </button>
        </form>

        {/* Expenses List */}
        <div className="space-y-3">
          <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
            <CreditCard size={18} className="text-primary" /> Historial de Tiquets Enviats al Dashboard
          </h3>

          {expenses.map((exp) => (
            <div key={exp.id} className="p-4 bg-white rounded-2xl border border-neutral-200 flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900 text-sm">{exp.concept}</span>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                    exp.category === 'MATERIAL' ? 'bg-purple-100 text-purple-900' :
                    exp.category === 'BENZINA' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                  }`}>
                    {exp.category}
                  </span>
                </div>
                <span className="text-[11px] text-neutral-500 block">{exp.cardAssigned} • {exp.date}</span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded inline-block">
                  ✓ Sincronitzat amb Comptabilitat Dashboard
                </span>
              </div>

              <div className="text-right flex items-center gap-3">
                <span className="text-base font-extrabold text-neutral-900">{exp.amount}</span>
                <img src={exp.photoUrl} alt="Tiquet" className="w-12 h-12 rounded-xl object-cover border border-neutral-300 shadow-sm" />
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* PWA Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex justify-around items-center h-20 px-2">
          <Link className="flex flex-col items-center justify-center gap-1 w-14 h-16 text-on-surface-variant hover:text-primary transition-colors" href="/operari/feines">
            <span className="material-symbols-outlined">content_paste</span>
            <span className="font-label-bold text-[9px] uppercase tracking-wider">Feines</span>
          </Link>

          <Link className="flex flex-col items-center justify-center gap-1 w-14 h-16 text-on-surface-variant hover:text-primary transition-colors" href="/operari/jornada">
            <span className="material-symbols-outlined">schedule</span>
            <span className="font-label-bold text-[9px] uppercase tracking-wider">Jornada</span>
          </Link>

          <Link className="flex flex-col items-center justify-center gap-1 w-14 h-16 text-primary font-bold" href="/operari/tiquets">
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
