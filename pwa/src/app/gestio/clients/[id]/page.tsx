"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Building, User, Phone, Send, CheckCircle2, Clock, Plus, FileText, Eye, Download, Image, PenTool, TrendingUp, AlertTriangle, X, Check, FileCheck, Package, Wrench, ShieldCheck } from "lucide-react";
import DynamicMap from "@/components/map/DynamicMap";

// Rich Task Record Interface including Unique Completed Archive Data for EVERY Task
interface TaskRecord {
  id: string;
  code: string;
  title: string;
  status: "COMPLETADA" | "EN_CURS" | "PENDENT";
  date: string;
  operari: string;
  hoursSpent: string;
  costReal: string;
  invoicedTotal: string;
  invoiceNumber: string;
  budgetNumber: string;
  budgetAmount: string;
  materialExecutedAmount: string;
  deviationPercent: string;
  deviationReason: string;
  evidencePhoto: string;
  photoCaption: string;
  operariFieldNotes: string;
  clientSignatureName: string;
  clientSignatureDate: string;
  signatureSvgPath: string;
  materialsList: Array<{ name: string; qty: string; unitPrice: string; total: string }>;
}

// Client Database Dictionary indexed strictly by Client ID
// Client Database Dictionary indexed strictly by Client ID
const CLIENTS_DATABASE: Record<string, any> = {};

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Retrieve specific client data or fallback dynamically with unique realistic tasks
  useEffect(() => {
    const savedClients = localStorage.getItem('campopro_clients');
    const savedTasksStr = localStorage.getItem('campopro_mock_tasks') || '[]';
    
    let clientData: any = null;

    if (savedClients) {
      const parsed = JSON.parse(savedClients);
      clientData = parsed.find((c: any) => c.id === params.id);
    }

    if (!clientData) {
      // Fallback
      clientData = {
        id: params.id,
        name: `Client #${params.id}`,
        contact: "Contacte Assignat",
        email: `client${params.id}@campopro.cat`,
        phone: "600000000",
        nif: `B00000${params.id}`,
        telegramChatId: `@Client${params.id}Bot`,
        address: "Ubicació de la finca",
        lat: 41.5 + (Number(params.id) || 0) * 0.05,
        lng: 2.0 + (Number(params.id) || 0) * 0.05,
        telegramLogs: []
      };
    }

    // Load their history of tasks
    try {
      const allTasks = JSON.parse(savedTasksStr);
      // Since tasks currently saved in localStorage don't have clientId yet, we just set it to empty array.
      // In a real DB, we would filter tasks by clientId.
      clientData.assignedTasks = [];
    } catch(e) {
      clientData.assignedTasks = [];
    }

    setClient(clientData);
    setTelegramChatId(clientData.telegramChatId || '');
    setLogs(clientData.telegramLogs || []);
    setLoading(false);
  }, [params.id]);

  const [telegramChatId, setTelegramChatId] = useState("");
  const [telegramMessage, setTelegramMessage] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Selected Task Archive Modal State (Transferred from /gestio/feines/completades)
  const [selectedTaskArchive, setSelectedTaskArchive] = useState<TaskRecord | null>(null);

  const handleSendTelegram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramMessage.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      const newLog = {
        id: `t${Date.now()}`,
        date: new Date().toLocaleString("ca-ES"),
        message: `📱 Enviat des de la PWA per a ${client.name}: ${telegramMessage}`,
        status: "Enviat"
      };
      setLogs([newLog, ...logs]);
      setTelegramMessage("");
      setIsSending(false);
    }, 600);
  };

  if (loading) {
    return <div className="p-12 text-center mt-20 font-bold text-primary">Carregant fitxa del client...</div>;
  }

  return (
    <div className="p-6 pt-32 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header with Direct Action to Create Job for THIS Client */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/gestio/clients" className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500 hover:text-neutral-900">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{client.name}</h1>
            <p className="text-sm text-neutral-500">ID Client: #{client.id} • NIF: {client.nif || 'No informat'} • Contacte: {client.contact || 'No informat'}</p>
          </div>
        </div>

        <Link
          href={`/gestio/feines/crear?clientId=${client.id}`}
          className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-5 py-3 rounded-xl font-medium text-sm transition-all shadow-md active:scale-95"
        >
          <Plus size={18} />
          Nova Feina per a {client.name}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Client Specific Company Data */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-neutral-900">
              <Building size={18} className="text-primary" />
              Dades del Client (Exclusives)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <label className="text-xs text-neutral-500 uppercase font-semibold">Nom Fiscal</label>
                <p className="text-neutral-900 font-medium">{client.name}</p>
              </div>
              <div>
                <label className="text-xs text-neutral-500 uppercase font-semibold">NIF / CIF</label>
                <p className="text-neutral-900 font-mono font-medium">{client.nif}</p>
              </div>
              <div>
                <label className="text-xs text-neutral-500 uppercase font-semibold">Adreça Principal</label>
                <p className="text-neutral-900">{client.address}</p>
              </div>
              <div>
                <label className="text-xs text-neutral-500 uppercase font-semibold">Contacte Directe</label>
                <div className="flex items-center gap-2 text-neutral-900 mt-1">
                  <User size={14} className="text-neutral-400" />
                  {client.contact}
                </div>
                <div className="flex items-center gap-2 text-neutral-900 mt-1">
                  <Phone size={14} className="text-neutral-400" />
                  {client.phone}
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Tasks Section: Renamed to "Feines i Tasques" with full Clickable Completed Archive view */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-neutral-900">
                <Clock size={18} className="text-primary" />
                Feines i Tasques
              </h2>
              <span className="text-xs font-bold bg-neutral-100 px-3 py-1 rounded-full text-neutral-600">
                {client.assignedTasks.length} Feines Registrades
              </span>
            </div>
            <p className="text-xs text-neutral-500 mb-4">💡 Clica qualsevol feina per veure la seva fitxa única d'arxiu (amb la seva imatge de camp pròpia, desglose de materials, signatura i dades de factura exclusives).</p>

            {client.assignedTasks.length > 0 ? (
              <div className="space-y-3">
                {client.assignedTasks.map((task: any) => (
                  <div 
                    key={task.id} 
                    onClick={() => setSelectedTaskArchive(task)}
                    className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono bg-primary/10 text-primary px-2.5 py-0.5 rounded-md">
                          #{task.code}
                        </span>
                        <span className="font-bold text-neutral-900 text-sm group-hover:text-primary transition-colors">{task.title}</span>
                      </div>
                      <span className="text-xs text-neutral-500">
                        Data: {task.date} • Assignat a: <strong className="text-neutral-700">{task.operari}</strong> • Facturat: <strong className="text-primary font-bold">{task.invoicedTotal}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        task.status === "COMPLETADA"
                          ? "bg-emerald-100 text-emerald-800"
                          : task.status === "EN_CURS"
                          ? "bg-blue-100 text-blue-800 animate-pulse"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {task.status}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTaskArchive(task);
                        }}
                        className="flex items-center gap-1 text-xs text-primary font-bold hover:underline bg-white border border-neutral-200 px-3 py-1.5 rounded-lg shadow-sm"
                      >
                        <Eye size={14} /> Veure Fitxa Única
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-neutral-500 border border-dashed rounded-xl">
                No hi ha feines registrades actualment per a aquest client.
              </div>
            )}
          </div>

          {/* Telegram Notifications Only for THIS Client */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-neutral-900">
                <Send size={18} className="text-blue-500" />
                Notificacions Telegram Directes ({client.name})
              </h2>
              <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full">
                Canal Oficial Telegram
              </span>
            </div>

            <form onSubmit={handleSendTelegram} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Telegram Chat ID / Usuari Client</label>
                <input 
                  type="text"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  className="w-full md:w-1/2 p-2.5 border border-neutral-200 rounded-xl text-sm font-mono focus:outline-none focus:border-blue-500"
                  placeholder="@NomUsuariTelegram"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Enviar Missatge de Telegram a {client.name}</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={telegramMessage}
                    onChange={(e) => setTelegramMessage(e.target.value)}
                    className="flex-1 p-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                    placeholder={`Escriu el missatge per al Telegram de ${client.name}...`}
                  />
                  <button 
                    type="submit"
                    disabled={isSending || !telegramMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Send size={16} />
                    {isSending ? "Enviant..." : "Enviar Telegram"}
                  </button>
                </div>
              </div>
            </form>

            {/* Telegram Message Logs */}
            <div className="mt-6 pt-4 border-t border-neutral-100">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Historial Telegram de {client.name}</h3>
              {logs.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {logs.map((log: any) => (
                    <div key={log.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 text-xs flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-neutral-800 font-medium">{log.message}</span>
                        <span className="text-neutral-400 text-[10px]">{log.date}</span>
                      </div>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 italic">Cap missatge enviat encara per a aquest client.</p>
              )}
            </div>
          </div>
        </div>

        {/* Map Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex flex-col h-[400px]">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-neutral-900">
              <MapPin size={18} className="text-primary" />
              Ubicació Finca ({client.name})
            </h2>
            <div className="flex-1 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
              <DynamicMap 
                locations={[{ id: client.id, lat: client.lat, lng: client.lng, name: client.name }]} 
                center={[client.lat, client.lng]} 
                zoom={14} 
              />
            </div>
            <p className="text-xs text-neutral-500 mt-4 text-center">
              Coordenades GPS: {client.lat.toFixed(4)}° N, {client.lng.toFixed(4)}° E
            </p>
          </div>
        </div>
      </div>

      {/* MODAL / VISOR D'ARXIU ÚNIC I DIVERSIFICAT DE CADA TASCA */}
      {selectedTaskArchive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-neutral-100">
              <div>
                <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                  FITXA ÚNICA DE TASCA #{selectedTaskArchive.code}
                </span>
                <h3 className="text-xl font-bold text-neutral-900 mt-2">{selectedTaskArchive.title}</h3>
                <p className="text-xs text-neutral-500">Client: <strong className="text-neutral-800">{client.name}</strong> • Executat: {selectedTaskArchive.date} • Operari: <strong className="text-neutral-800">{selectedTaskArchive.operari}</strong></p>
              </div>
              <button onClick={() => setSelectedTaskArchive(null)} className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full">
                <X size={22} />
              </button>
            </div>

            {/* Financial Summary & Invoicing (Factura / Pressupost) */}
            <div className="space-y-4 mb-6">
              <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                <FileText size={16} className="text-primary" /> Facturació i Pressupost d'Aquesta Tasca
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                <div>
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase block">Total Facturat</span>
                  <span className="text-base font-bold text-emerald-700 block mt-0.5">{selectedTaskArchive.invoicedTotal}</span>
                  <span className="text-[10px] font-mono text-neutral-500">{selectedTaskArchive.invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase block">Pressupost Acordat</span>
                  <span className="text-base font-bold text-neutral-900 block mt-0.5">{selectedTaskArchive.budgetAmount}</span>
                  <span className="text-[10px] font-mono text-neutral-500">{selectedTaskArchive.budgetNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase block">Cost Executat Real</span>
                  <span className="text-base font-bold text-neutral-800 block mt-0.5">{selectedTaskArchive.costReal}</span>
                  <span className="text-[10px] text-neutral-500 font-medium">Hores: {selectedTaskArchive.hoursSpent}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase block">Desviació de Materials</span>
                  <span className="text-xs font-bold text-amber-800 flex items-center gap-1 mt-1">
                    <TrendingUp size={14} /> {selectedTaskArchive.deviationPercent}
                  </span>
                  <span className="text-[9px] text-neutral-500 block leading-tight mt-0.5">{selectedTaskArchive.deviationReason}</span>
                </div>
              </div>
            </div>

            {/* Itemized Materials Used in THIS specific task */}
            <div className="mb-6">
              <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2 mb-2">
                <Package size={16} className="text-primary" /> Desglose de Materials Emplets ({selectedTaskArchive.materialsList.length} articles)
              </h4>
              <div className="border border-neutral-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-neutral-100 text-neutral-600 font-semibold uppercase">
                    <tr>
                      <th className="p-2.5">Material / Article</th>
                      <th className="p-2.5">Quantitat</th>
                      <th className="p-2.5">Preu Unitari</th>
                      <th className="p-2.5 text-right">Total Net</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {selectedTaskArchive.materialsList.map((m, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50">
                        <td className="p-2.5 font-medium text-neutral-900">{m.name}</td>
                        <td className="p-2.5 font-bold text-neutral-800">{m.qty}</td>
                        <td className="p-2.5 text-neutral-600">{m.unitPrice}</td>
                        <td className="p-2.5 text-right font-bold text-emerald-700">{m.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Operari Field Report */}
            <div className="mb-6 bg-blue-50/60 border border-blue-200 p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Nota i Part de Treball de l'Operari ({selectedTaskArchive.operari})</span>
              <p className="text-xs text-neutral-800 mt-1 italic">"{selectedTaskArchive.operariFieldNotes}"</p>
            </div>

            {/* Photo Evidence & Blueprint Annotations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2 mb-2">
                  <Image size={16} className="text-primary" /> Foto Evidència de Camp (Tasca #{selectedTaskArchive.code})
                </h4>
                <div className="relative h-44 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm group">
                  <img src={selectedTaskArchive.evidencePhoto} alt={selectedTaskArchive.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-white text-xs font-medium">{selectedTaskArchive.photoCaption}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2 mb-2">
                  <PenTool size={16} className="text-primary" /> Signatura Única de Conformitat
                </h4>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-col justify-between h-44">
                  <div>
                    <span className="text-[10px] font-semibold text-neutral-500 uppercase block">Receptor i Signatari</span>
                    <span className="text-sm font-bold text-neutral-900 block mt-0.5">{selectedTaskArchive.clientSignatureName}</span>
                    <span className="text-[10px] text-neutral-500">Data i Hora: {selectedTaskArchive.clientSignatureDate}</span>
                  </div>
                  <div className="h-16 bg-white rounded-xl border border-neutral-200 flex items-center justify-center p-2">
                    <svg className="w-full h-full stroke-primary fill-none opacity-80" viewBox="0 0 100 40">
                      <path d={selectedTaskArchive.signatureSvgPath} strokeWidth="2.5" strokeLinecap="round"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex gap-2">
                <button 
                  onClick={() => alert(`Generant PDF Oficial de la Feina #${selectedTaskArchive.code}...`)}
                  className="px-4 py-2.5 bg-neutral-100 text-neutral-800 hover:bg-neutral-200 rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <Download size={14} /> PDF de la Feina #{selectedTaskArchive.code}
                </button>
                <button 
                  onClick={() => alert(`Obrint Factura Oficial ${selectedTaskArchive.invoiceNumber}...`)}
                  className="px-4 py-2.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <FileCheck size={14} /> Veure Factura ({selectedTaskArchive.invoiceNumber})
                </button>
              </div>

              <button 
                onClick={() => setSelectedTaskArchive(null)} 
                className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90"
              >
                Tancar Fitxa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
