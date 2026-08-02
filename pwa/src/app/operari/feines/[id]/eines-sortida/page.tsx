"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Wrench, CheckCircle2 } from "lucide-react";

export default function EinesSortidaPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  const [tools, setTools] = useState([
    { id: 1, name: "Tallatubs radial", status: "Assignada", checked: false },
    { id: 2, name: "Clau Stillson", status: "Assignada", checked: false },
    { id: 3, name: "Detector de metalls", status: "Assignada", checked: false },
  ]);

  const toggleTool = (id: number) => {
    setTools(tools.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  const checkedCount = tools.filter(t => t.checked).length;
  const allChecked = checkedCount === tools.length;
  const progressPercent = Math.round((checkedCount / tools.length) * 100);

  const handleConfirm = () => {
    router.push(`/operari/vehicles`); // Redirigeix a la validació de sortida
  };

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-sm pt-safe">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button 
              className="w-touch-target-min h-touch-target-min flex items-center justify-center text-primary" 
              onClick={() => router.back()}
            >
              <ChevronLeft size={28} />
            </button>
            <h1 className="font-headline-md text-[22px] font-bold text-primary">Check-out Eines</h1>
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-20 pb-safe bg-surface px-margin-mobile">
        <p className="text-on-surface-variant text-[16px] mb-6">Confirma que tens les eines carregades al vehicle abans de sortir cap al client.</p>
        
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="font-label-bold font-bold text-primary">{checkedCount}/{tools.length} confirmades</span>
            <span className="font-label-bold font-bold text-primary">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#16a34a] transition-all duration-300 ease-in-out" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Tools List */}
        <div className="flex flex-col gap-4 pb-32">
          {tools.map(tool => (
            <div 
              key={tool.id} 
              onClick={() => toggleTool(tool.id)}
              className={`p-4 rounded-xl border flex items-center gap-4 transition-colors cursor-pointer active:scale-[0.98]
                ${tool.checked ? 'bg-[#f0fdf4] border-[#bbf7d0]' : 'bg-surface-container-low border-surface-variant'}
              `}
            >
              {/* Custom Checkbox (32px target) */}
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                ${tool.checked ? 'bg-[#16a34a] border-[#16a34a] text-white' : 'border-outline-variant bg-white'}
              `}>
                {tool.checked && <CheckCircle2 size={20} />}
              </div>
              
              <div className="flex items-center justify-center w-12 h-12 bg-surface-container-highest rounded-lg text-primary shrink-0">
                <Wrench size={24} />
              </div>
              
              <div className="flex flex-col flex-1">
                <span className="font-label-bold text-[16px] font-bold text-on-surface">{tool.name}</span>
                <span className="text-[12px] text-on-surface-variant mt-1 px-2 py-0.5 bg-surface-variant rounded-full w-fit">
                  {tool.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action */}
        <div className="fixed bottom-0 inset-x-0 bg-surface/90 backdrop-blur-xl p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40 border-t border-surface-variant">
          <button 
            disabled={!allChecked}
            onClick={handleConfirm}
            className={`w-full h-[64px] rounded-2xl flex items-center justify-center font-headline-md text-[20px] font-bold tracking-wide transition-all
              ${allChecked ? 'bg-secondary text-secondary-foreground active:scale-[0.98] shadow-lg' : 'bg-surface-container-highest text-on-surface-variant opacity-70'}
            `}
          >
            CONFIRMAR EINES
          </button>
        </div>
      </main>
    </div>
  );
}
