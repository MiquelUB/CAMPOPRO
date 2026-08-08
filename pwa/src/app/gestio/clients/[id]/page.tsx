"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, MapPin, Building, User, Phone, Send, CheckCircle2, Clock, Plus, FileText, Eye, Download, Image, PenTool, TrendingUp, AlertTriangle, X, Check, FileCheck, Package, Wrench, ShieldCheck, CreditCard } from "lucide-react";
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
      // Do not create mock fallback. Leave clientData as null.
    }

    // Load their history of tasks
    if (clientData) {
      try {
        const allTasks = JSON.parse(savedTasksStr);
        // Filtrem les feines que estiguin lligades a aquest client
        clientData.assignedTasks = allTasks.filter((t: any) => t.clientId === params.id);
      } catch(e) {
        clientData.assignedTasks = [];
      }
    }

    if (clientData) {
      setClient(clientData);
      setTelegramChatId(clientData.telegramChatId || '');
      setLogs(clientData.telegramLogs || []);
    } else {
      setClient(null);
    }
    setLoading(false);
  }, [params.id]);

  const searchParams = useSearchParams();
  const [telegramChatId, setTelegramChatId] = useState("");
  const [telegramMessage, setTelegramMessage] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);

  useEffect(() => {
    if (client && searchParams.get('edit') === 'true' && !isEditing) {
      setEditForm({ ...client });
      setIsEditing(true);
    }
  }, [searchParams, client]);

  // Quan entrem en mode edició, copiem les dades actuals
  const handleEditClick = () => {
    setEditForm({ ...client });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const savedClients = localStorage.getItem('campopro_clients');
    if (savedClients) {
      let parsed = JSON.parse(savedClients);
      parsed = parsed.map((c: any) => c.id === client.id ? editForm : c);
      localStorage.setItem('campopro_clients', JSON.stringify(parsed));
      setClient(editForm);
      setIsEditing(false);
    }
  };

  const handleSaveValuation = (taskId: string, newValuation: number, newComment: string) => {
    const savedTasksStr = localStorage.getItem('campopro_mock_tasks') || '[]';
    let allTasks = JSON.parse(savedTasksStr);
    allTasks = allTasks.map((t: any) => {
      if (t.id === taskId) {
        return { ...t, valuation: newValuation, clientComment: newComment };
      }
      return t;
    });
    localStorage.setItem('campopro_mock_tasks', JSON.stringify(allTasks));
    
    // Update local state so it reflects instantly
    setClient((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        assignedTasks: prev.assignedTasks.map((t: any) => t.id === taskId ? { ...t, valuation: newValuation, clientComment: newComment } : t)
      };
    });
    if (selectedTaskArchive && selectedTaskArchive.id === taskId) {
      setSelectedTaskArchive({ ...selectedTaskArchive, valuation: newValuation, clientComment: newComment });
    }
  };

  // Selected Task Archive Modal State (Transferred from /gestio/feines/completades)
  const [selectedTaskArchive, setSelectedTaskArchive] = useState<any>(null);

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
      const updatedLogs = [newLog, ...logs];
      setLogs(updatedLogs);
      
      const savedClients = localStorage.getItem('campopro_clients');
      if (savedClients) {
        let parsed = JSON.parse(savedClients);
        parsed = parsed.map((c: any) => c.id === client.id ? { ...c, telegramLogs: updatedLogs } : c);
        localStorage.setItem('campopro_clients', JSON.stringify(parsed));
      }

      setTelegramMessage("");
      setIsSending(false);
    }, 600);
  };

  if (loading) {
    return <div className="p-12 text-center mt-20 font-bold text-primary">Carregant fitxa del client...</div>;
  }

  if (!client) {
    return (
      <div className="p-12 text-center mt-20 flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-bold text-neutral-800">Client No Trobat</h2>
        <p className="text-neutral-500">No existeix cap client amb aquest identificador.</p>
        <Link href="/gestio/clients" className="mt-4 bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-primary/90 transition-colors">
          Tornar a Clients
        </Link>
      </div>
    );
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-neutral-900">
                <Building size={18} className="text-primary" />
                Dades del Client (Exclusives)
              </h2>
              {!isEditing ? (
                <button onClick={handleEditClick} className="text-sm font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">
                  Editar
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="text-sm font-bold text-neutral-500 hover:bg-neutral-100 px-3 py-1.5 rounded-lg transition-colors">
                    Cancel·lar
                  </button>
                  <button onClick={handleSaveEdit} className="text-sm font-bold text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg transition-colors">
                    Guardar
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1"><label className="text-xs text-neutral-500 font-bold uppercase">Nom Fiscal</label><input type="text" className="border rounded p-2 text-sm" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></div>
                <div className="flex flex-col gap-1"><label className="text-xs text-neutral-500 font-bold uppercase">NIF / CIF</label><input type="text" className="border rounded p-2 text-sm uppercase" value={editForm.nif} onChange={e => setEditForm({...editForm, nif: e.target.value})} /></div>
                <div className="flex flex-col gap-1"><label className="text-xs text-neutral-500 font-bold uppercase">Contacte</label><input type="text" className="border rounded p-2 text-sm" value={editForm.contact} onChange={e => setEditForm({...editForm, contact: e.target.value})} /></div>
                <div className="flex flex-col gap-1"><label className="text-xs text-neutral-500 font-bold uppercase">Telèfon</label><input type="text" className="border rounded p-2 text-sm" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} /></div>
                <div className="flex flex-col gap-1 md:col-span-2"><label className="text-xs text-neutral-500 font-bold uppercase">Adreça</label><input type="text" className="border rounded p-2 text-sm" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} /></div>
                <div className="flex flex-col gap-1"><label className="text-xs text-neutral-500 font-bold uppercase">Latitud</label><input type="text" className="border rounded p-2 text-sm" value={editForm.lat ?? ''} onChange={e => setEditForm({...editForm, lat: e.target.value.replace(',', '.')})} placeholder="Ex: 41.123" /></div>
                <div className="flex flex-col gap-1"><label className="text-xs text-neutral-500 font-bold uppercase">Longitud</label><input type="text" className="border rounded p-2 text-sm" value={editForm.lng ?? ''} onChange={e => setEditForm({...editForm, lng: e.target.value.replace(',', '.')})} placeholder="Ex: 1.456" /></div>
                <div className="flex flex-col gap-1 md:col-span-2"><label className="text-xs text-neutral-500 font-bold uppercase">Notes / Comentaris Interns</label><textarea rows={3} className="border rounded p-2 text-sm resize-none" value={editForm.notes ?? ''} onChange={e => setEditForm({...editForm, notes: e.target.value})} /></div>
              </div>
            ) : (
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
                {client.notes && (
                  <div className="md:col-span-2 mt-2 bg-amber-50 p-3 rounded-xl border border-amber-100">
                    <label className="text-xs text-amber-800 uppercase font-bold flex items-center gap-1 mb-1">
                      <FileText size={14} /> Notes i Particularitats
                    </label>
                    <p className="text-amber-900 text-sm whitespace-pre-wrap">{client.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Billing Summary Section */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-neutral-900">
              <CreditCard size={18} className="text-primary" />
              Resum Econòmic
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">Total Generat</span>
                <span className="text-2xl font-black text-emerald-600">
                  {client.assignedTasks.reduce((acc: number, task: any) => acc + (parseFloat(task.budget) || 0), 0).toFixed(2)} €
                </span>
                <span className="text-[10px] text-emerald-700 font-medium block mt-1">Suma de totes les feines</span>
              </div>
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                <span className="text-xs font-bold text-amber-800 uppercase block mb-1">Pendent (En Curs / Pendent)</span>
                <span className="text-2xl font-black text-amber-600">
                  {client.assignedTasks
                    .filter((t: any) => t.status !== 'COMPLETADA')
                    .reduce((acc: number, task: any) => acc + (parseFloat(task.budget) || 0), 0).toFixed(2)} €
                </span>
                <span className="text-[10px] text-amber-700 font-medium block mt-1">Pressupost no tancat</span>
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
                          #{task.id.split('_')[1]?.slice(-4) || 'TASK'}
                        </span>
                        <span className="font-bold text-neutral-900 text-sm group-hover:text-primary transition-colors">{task.description || 'Feina sense descripció'}</span>
                      </div>
                      <span className="text-xs text-neutral-500">
                        Data: {task.date} • Assignat a: <strong className="text-neutral-700">{task.workerName}</strong> • Facturat: <strong className="text-primary font-bold">{task.budget} €</strong>
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
              {client.lat && client.lng && !isNaN(Number(client.lat)) && !isNaN(Number(client.lng)) ? (
                <DynamicMap 
                  locations={[{ id: client.id, lat: Number(client.lat), lng: Number(client.lng), name: client.name }]} 
                  center={[Number(client.lat), Number(client.lng)]} 
                  zoom={14} 
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                  <MapPin size={32} className="text-neutral-300 mb-2" />
                  <p className="text-sm font-medium text-neutral-500">No hi ha coordenades GPS vàlides per aquesta finca.</p>
                </div>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-4 text-center">
              Coordenades GPS: {client.lat && !isNaN(Number(client.lat)) ? Number(client.lat).toFixed(4) : '--'}° N, {client.lng && !isNaN(Number(client.lng)) ? Number(client.lng).toFixed(4) : '--'}° E
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
                  FITXA ÚNICA DE TASCA #{selectedTaskArchive.id.split('_')[1]?.slice(-4) || 'TASK'}
                </span>
                <h3 className="text-xl font-bold text-neutral-900 mt-2">{selectedTaskArchive.description || 'Sense descripció'}</h3>
                <p className="text-xs text-neutral-500">Client: <strong className="text-neutral-800">{client.name}</strong> • Data Prevista: {selectedTaskArchive.date} • Operari: <strong className="text-neutral-800">{selectedTaskArchive.workerName}</strong></p>
                <div className="mt-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    selectedTaskArchive.status === "COMPLETADA"
                      ? "bg-emerald-100 text-emerald-800"
                      : selectedTaskArchive.status === "EN_CURS"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {selectedTaskArchive.status}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedTaskArchive(null)} className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full bg-neutral-100 hover:bg-neutral-200">
                <X size={22} />
              </button>
            </div>

            {/* Financial Summary */}
            <div className="space-y-4 mb-6">
              <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                <FileText size={16} className="text-primary" /> Dades Econòmiques
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                <div>
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase block">Total Pressupostat (Cost Estimat)</span>
                  <span className="text-xl font-bold text-neutral-900 block mt-0.5">{selectedTaskArchive.budget} €</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase block">Hores Estimades</span>
                  <span className="text-base font-bold text-neutral-800 block mt-0.5">{selectedTaskArchive.hours}h</span>
                </div>
              </div>
            </div>

            {/* Real Materials & Tools Used */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2 mb-2">
                  <Package size={16} className="text-primary" /> Materials Programats ({selectedTaskArchive.materials?.length || 0})
                </h4>
                {selectedTaskArchive.materials && selectedTaskArchive.materials.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedTaskArchive.materials.map((m: any, i: number) => (
                      <li key={i} className="text-xs p-2 bg-neutral-50 border border-neutral-200 rounded-lg flex justify-between">
                        <span className="font-medium">{m.name}</span>
                        <span className="font-bold">{m.qty}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-neutral-500 italic">No hi ha materials programats.</p>
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2 mb-2">
                  <PenTool size={16} className="text-primary" /> Eines Necessàries ({selectedTaskArchive.tools?.length || 0})
                </h4>
                {selectedTaskArchive.tools && selectedTaskArchive.tools.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedTaskArchive.tools.map((t: string, i: number) => (
                      <li key={i} className="text-xs p-2 bg-neutral-50 border border-neutral-200 rounded-lg">
                        <span className="font-medium">{t}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-neutral-500 italic">No s'han registrat eines específiques.</p>
                )}
              </div>
            </div>

            {/* Valoració i Feedback del Client */}
            <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
              <h4 className="font-bold text-sm text-primary flex items-center gap-2 mb-3">
                ⭐ Valoració del Client per aquesta feina
              </h4>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-neutral-600 uppercase mb-1 block">Satisfacció (1-5)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star}
                        onClick={() => handleSaveValuation(selectedTaskArchive.id, star, selectedTaskArchive.clientComment || '')}
                        className={`p-2 rounded-lg transition-colors ${
                          (selectedTaskArchive.valuation || 0) >= star 
                          ? 'bg-amber-100 text-amber-500' 
                          : 'bg-white border border-neutral-200 text-neutral-300 hover:text-amber-400'
                        }`}
                      >
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-neutral-600 uppercase mb-1 block">Comentaris o Queixes del Client</label>
                  <textarea 
                    rows={2}
                    placeholder="Escriu què opina el client d'aquesta feina (opcional)..."
                    value={selectedTaskArchive.clientComment || ''}
                    onChange={(e) => {
                      // Utilitzem un timeout senzill tipus debounce o ho deixem en temps real ja que s'actualitza l'estat local
                      handleSaveValuation(selectedTaskArchive.id, selectedTaskArchive.valuation || 0, e.target.value);
                    }}
                    className="w-full p-3 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-neutral-100 flex justify-end">
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
