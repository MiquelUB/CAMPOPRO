"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Building, User, Phone, Send, CheckCircle2, Clock, Plus, FileText, Eye, Download, Image, PenTool, TrendingUp, AlertTriangle, X, Check, FileCheck, DollarSign } from "lucide-react";
import DynamicMap from "@/components/map/DynamicMap";

// Rich Task Record Interface including Full Completed Archive Data (Invoice, Budget, Photos, Signature)
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
  evidencePhoto: string;
  photoCaption: string;
  clientSignatureName: string;
  clientSignatureDate: string;
}

// Client Database Dictionary indexed strictly by Client ID
const CLIENTS_DATABASE: Record<string, {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  nif: string;
  telegramChatId: string;
  address: string;
  lat: number;
  lng: number;
  assignedTasks: Array<TaskRecord>;
  telegramLogs: Array<{ id: string; date: string; message: string; status: string }>;
}> = {
  "1": {
    id: "1",
    name: "Agro Riera SL",
    contact: "Miquel Riera",
    email: "miquel@agroriera.cat",
    phone: "600111222",
    nif: "B12345678",
    telegramChatId: "@AgroRieraClientBot",
    address: "Camí Ral s/n, 08240 Manresa",
    lat: 41.6521,
    lng: 1.8322,
    assignedTasks: [
      { 
        id: "101", 
        code: "OT-442", 
        title: "Reparació Escomesa d'Aigua", 
        status: "EN_CURS", 
        date: "22/05/2024", 
        operari: "Jordi S.",
        hoursSpent: "6.5h",
        costReal: "420,00 €",
        invoicedTotal: "850,00 €",
        invoiceNumber: "PRE-FAC-2024-442",
        budgetNumber: "PRES-2024-118",
        budgetAmount: "800,00 €",
        materialExecutedAmount: "310,00 €",
        deviationPercent: "+6.25%",
        evidencePhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuDveK6D5zSYaS6w84E8FKBzPqWfWi6ig_7O0OisKvLCxFUZEQSEMY2Q287y5gtDwEURl_0VNgQ3KdsD8PF5jutaTe5wAcCe9nEnIsCrTnMLaDixIlkBHW3pXaixoit-9sIcPZUaDIDJcZiM98vj12GrFpPzORVVsuPPktOg2uuMZ2uPh7XhTVOkNCYJ-uvy6Zuj0sXUYMEFSZ96zeB0bQ3DD0-tKisvHiisof2tnz6O6FUYqRvlMDI6",
        photoCaption: "Reparació tub principal escomesa 50mm",
        clientSignatureName: "Miquel Riera",
        clientSignatureDate: "22/05/2024 11:30"
      },
      { 
        id: "102", 
        code: "OT-449", 
        title: "Adobat de finques 'La Vall'", 
        status: "PENDENT", 
        date: "23/05/2024", 
        operari: "Colla A",
        hoursSpent: "0.0h",
        costReal: "0,00 €",
        invoicedTotal: "1.200,00 €",
        invoiceNumber: "PENDENT",
        budgetNumber: "PRES-2024-130",
        budgetAmount: "1.200,00 €",
        materialExecutedAmount: "0,00 €",
        deviationPercent: "0.0%",
        evidencePhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuDveK6D5zSYaS6w84E8FKBzPqWfWi6ig_7O0OisKvLCxFUZEQSEMY2Q287y5gtDwEURl_0VNgQ3KdsD8PF5jutaTe5wAcCe9nEnIsCrTnMLaDixIlkBHW3pXaixoit-9sIcPZUaDIDJcZiM98vj12GrFpPzORVVsuPPktOg2uuMZ2uPh7XhTVOkNCYJ-uvy6Zuj0sXUYMEFSZ96zeB0bQ3DD0-tKisvHiisof2tnz6O6FUYqRvlMDI6",
        photoCaption: "Pendent d'iniciar",
        clientSignatureName: "Pendent",
        clientSignatureDate: "-"
      },
      { 
        id: "103", 
        code: "OT-390", 
        title: "Manteniment canalització reg sector Nord", 
        status: "COMPLETADA", 
        date: "15/05/2024", 
        operari: "Marc T.",
        hoursSpent: "18.5h",
        costReal: "1.240,00 €",
        invoicedTotal: "2.450,00 €",
        invoiceNumber: "FAC-2024-8842",
        budgetNumber: "PRES-2024-099",
        budgetAmount: "2.180,00 €",
        materialExecutedAmount: "944,20 €",
        deviationPercent: "+12.4%",
        evidencePhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuDveK6D5zSYaS6w84E8FKBzPqWfWi6ig_7O0OisKvLCxFUZEQSEMY2Q287y5gtDwEURl_0VNgQ3KdsD8PF5jutaTe5wAcCe9nEnIsCrTnMLaDixIlkBHW3pXaixoit-9sIcPZUaDIDJcZiM98vj12GrFpPzORVVsuPPktOg2uuMZ2uPh7XhTVOkNCYJ-uvy6Zuj0sXUYMEFSZ96zeB0bQ3DD0-tKisvHiisof2tnz6O6FUYqRvlMDI6",
        photoCaption: "Substitució vàlvula d'esfera principal - Sector B4",
        clientSignatureName: "Miquel Riera (Agro Riera SL)",
        clientSignatureDate: "15/05/2024 16:45"
      }
    ],
    telegramLogs: [
      { id: "t101", date: "22/05/2024 08:30", message: "📱 Bot Telegram: L'operari Jordi S. ha iniciat la feina #OT-442.", status: "Enviat" },
      { id: "t102", date: "15/05/2024 14:15", message: "📱 Bot Telegram: La feina #OT-390 ha estat completada amb signatura.", status: "Enviat" }
    ]
  },
  "2": {
    id: "2",
    name: "Finca Valles",
    contact: "Anna Valles",
    email: "anna@valles.cat",
    phone: "600333444",
    nif: "A87654321",
    telegramChatId: "@FincaVallesClientBot",
    address: "Av. les Valls 45, Granollers",
    lat: 41.5233,
    lng: 2.1121,
    assignedTasks: [
      { 
        id: "201", 
        code: "OT-501", 
        title: "Instal·lació de Sensor d'Humitat", 
        status: "EN_CURS", 
        date: "21/05/2024", 
        operari: "Pere V.",
        hoursSpent: "4.0h",
        costReal: "180,00 €",
        invoicedTotal: "450,00 €",
        invoiceNumber: "PRE-FAC-2024-501",
        budgetNumber: "PRES-2024-142",
        budgetAmount: "450,00 €",
        materialExecutedAmount: "210,00 €",
        deviationPercent: "0.0%",
        evidencePhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuDveK6D5zSYaS6w84E8FKBzPqWfWi6ig_7O0OisKvLCxFUZEQSEMY2Q287y5gtDwEURl_0VNgQ3KdsD8PF5jutaTe5wAcCe9nEnIsCrTnMLaDixIlkBHW3pXaixoit-9sIcPZUaDIDJcZiM98vj12GrFpPzORVVsuPPktOg2uuMZ2uPh7XhTVOkNCYJ-uvy6Zuj0sXUYMEFSZ96zeB0bQ3DD0-tKisvHiisof2tnz6O6FUYqRvlMDI6",
        photoCaption: "Sensor d'humitat instal·lat a 40cm de profunditat",
        clientSignatureName: "Anna Valles",
        clientSignatureDate: "21/05/2024 12:10"
      }
    ],
    telegramLogs: [
      { id: "t201", date: "21/05/2024 09:10", message: "📱 Bot Telegram: Instal·lació de sensor #OT-501 en curs.", status: "Enviat" }
    ]
  },
  "3": {
    id: "3",
    name: "Horta del Llobregat",
    contact: "Joan Llobregat",
    email: "joan@horta.cat",
    phone: "600555666",
    nif: "B99887766",
    telegramChatId: "@HortaLlobregatBot",
    address: "Partida Nord 12, Sant Boi",
    lat: 41.3411,
    lng: 2.0511,
    assignedTasks: [
      { 
        id: "301", 
        code: "OT-612", 
        title: "Revisió Bombes de Reg Principal", 
        status: "COMPLETADA", 
        date: "10/05/2024", 
        operari: "Carles M.",
        hoursSpent: "12.0h",
        costReal: "450,00 €",
        invoicedTotal: "980,00 €",
        invoiceNumber: "FAC-2024-612",
        budgetNumber: "PRES-2024-080",
        budgetAmount: "950,00 €",
        materialExecutedAmount: "320,00 €",
        deviationPercent: "+3.1%",
        evidencePhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuDveK6D5zSYaS6w84E8FKBzPqWfWi6ig_7O0OisKvLCxFUZEQSEMY2Q287y5gtDwEURl_0VNgQ3KdsD8PF5jutaTe5wAcCe9nEnIsCrTnMLaDixIlkBHW3pXaixoit-9sIcPZUaDIDJcZiM98vj12GrFpPzORVVsuPPktOg2uuMZ2uPh7XhTVOkNCYJ-uvy6Zuj0sXUYMEFSZ96zeB0bQ3DD0-tKisvHiisof2tnz6O6FUYqRvlMDI6",
        photoCaption: "Manteniment i neteja filtres de bomba 15CV",
        clientSignatureName: "Joan Llobregat",
        clientSignatureDate: "10/05/2024 16:40"
      }
    ],
    telegramLogs: [
      { id: "t301", date: "10/05/2024 16:40", message: "📱 Bot Telegram: Feina #OT-612 finalitzada satisfactòriament.", status: "Enviat" }
    ]
  }
};

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  // Retrieve specific client data or fallback dynamically
  const client = CLIENTS_DATABASE[params.id] || {
    id: params.id,
    name: `Client #${params.id}`,
    contact: "Contacte Assignat",
    email: `client${params.id}@campopro.cat`,
    phone: "600000000",
    nif: "B00000000",
    telegramChatId: `@Client${params.id}Bot`,
    address: "Ubicació de la finca",
    lat: 41.5,
    lng: 2.0,
    assignedTasks: [],
    telegramLogs: []
  };

  const [telegramChatId, setTelegramChatId] = useState(client.telegramChatId);
  const [telegramMessage, setTelegramMessage] = useState("");
  const [logs, setLogs] = useState(client.telegramLogs);
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
            <p className="text-sm text-neutral-500">ID Client: #{client.id} • NIF: {client.nif} • Contacte: {client.contact}</p>
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
            <p className="text-xs text-neutral-500 mb-4">💡 Clica qualsevol feina per veure tot l'arxiu de la tasca realitzada (factura, pressupost, evidències fotogràfiques i signatura del client).</p>

            {client.assignedTasks.length > 0 ? (
              <div className="space-y-3">
                {client.assignedTasks.map((task) => (
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
                        <Eye size={14} /> Veure Arxiu
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
                  {logs.map((log) => (
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

      {/* MODAL / VISOR D'ARXIU COMPLET DE LA TASCA REALITZADA (FACTURA, PRESSUPOST, FOTOS, SIGNATURA) */}
      {selectedTaskArchive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-neutral-100">
              <div>
                <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                  ARXIU TÈCNIC #{selectedTaskArchive.code}
                </span>
                <h3 className="text-xl font-bold text-neutral-900 mt-2">{selectedTaskArchive.title}</h3>
                <p className="text-xs text-neutral-500">Client: <strong className="text-neutral-800">{client.name}</strong> • Data d'Execució: {selectedTaskArchive.date} • Operari: {selectedTaskArchive.operari}</p>
              </div>
              <button onClick={() => setSelectedTaskArchive(null)} className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full">
                <X size={22} />
              </button>
            </div>

            {/* Financial Summary & Invoicing (Factura / Pressupost) */}
            <div className="space-y-4 mb-6">
              <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                <FileText size={16} className="text-primary" /> Factura i Pressupost Realitzat
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                <div>
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase block">Total Facturat</span>
                  <span className="text-base font-bold text-emerald-700 block mt-0.5">{selectedTaskArchive.invoicedTotal}</span>
                  <span className="text-[10px] font-mono text-neutral-500">{selectedTaskArchive.invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase block">Pressupost Inicial</span>
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
                    <TrendingUp size={14} /> {selectedTaskArchive.deviationPercent} ({selectedTaskArchive.materialExecutedAmount})
                  </span>
                </div>
              </div>
            </div>

            {/* Photo Evidence & Blueprint Annotations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2 mb-2">
                  <Image size={16} className="text-primary" /> Evidència Fotogràfica de Camp
                </h4>
                <div className="relative h-44 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm group">
                  <img src={selectedTaskArchive.evidencePhoto} alt="Foto Evidència" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                    <span className="text-white text-xs font-medium">{selectedTaskArchive.photoCaption}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2 mb-2">
                  <PenTool size={16} className="text-primary" /> Signatura Digital de Conformitat del Client
                </h4>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-col justify-between h-44">
                  <div>
                    <span className="text-[10px] font-semibold text-neutral-500 uppercase block">Conformitat i Receptor</span>
                    <span className="text-sm font-bold text-neutral-900 block mt-0.5">{selectedTaskArchive.clientSignatureName}</span>
                    <span className="text-[10px] text-neutral-500">Data i Hora: {selectedTaskArchive.clientSignatureDate}</span>
                  </div>
                  <div className="h-16 bg-white rounded-xl border border-neutral-200 flex items-center justify-center p-2">
                    <svg className="w-full h-full stroke-primary fill-none opacity-80" viewBox="0 0 100 40">
                      <path d="M10,30 Q30,10 50,30 T90,20" strokeWidth="2.5"></path>
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
                  <Download size={14} /> PDF de la Feina
                </button>
                <button 
                  onClick={() => alert(`Obrint Factura Oficial ${selectedTaskArchive.invoiceNumber}...`)}
                  className="px-4 py-2.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <FileCheck size={14} /> Veure Factura
                </button>
              </div>

              <button 
                onClick={() => setSelectedTaskArchive(null)} 
                className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90"
              >
                Tancar Arxiu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
