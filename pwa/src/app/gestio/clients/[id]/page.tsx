"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Building, User, Phone, Send, CheckCircle2, Clock, Plus } from "lucide-react";
import DynamicMap from "@/components/map/DynamicMap";

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
  assignedTasks: Array<{ id: string; code: string; title: string; status: string; date: string; operari: string }>;
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
      { id: "101", code: "OT-442", title: "Reparació Escomesa d'Aigua", status: "EN_CURS", date: "22/05/2024", operari: "Jordi S." },
      { id: "102", code: "OT-449", title: "Adobat de finques 'La Vall'", status: "PENDENT", date: "23/05/2024", operari: "Colla A" },
      { id: "103", code: "OT-390", title: "Manteniment canalització reg", status: "COMPLETADA", date: "15/05/2024", operari: "Marc T." }
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
      { id: "201", code: "OT-501", title: "Instal·lació de Sensor d'Humitat", status: "EN_CURS", date: "21/05/2024", operari: "Pere V." },
      { id: "202", code: "OT-508", title: "Poda de Manteniement Sector 3", status: "PENDENT", date: "25/05/2024", operari: "Colla B" }
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
      { id: "301", code: "OT-612", title: "Revisió Bombes de Reg Principal", status: "COMPLETADA", date: "10/05/2024", operari: "Carles M." }
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
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header with Direct Action to Create Job for THIS Client */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/gestio/clients" className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500 hover:text-neutral-900">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{client.name}</h1>
            <p className="text-sm text-neutral-500">ID Client: #{client.id} • NIF: {client.nif}</p>
          </div>
        </div>

        <Link
          href={`/gestio/feines/crear?clientId=${client.id}`}
          className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md"
        >
          <Plus size={16} />
          Nova Feina per a {client.name}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Client Specific Company Data */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
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
                <p className="text-neutral-900 font-medium">{client.nif}</p>
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

          {/* Assigned Tasks / Jobs Specific to THIS Client */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center justify-between text-neutral-900">
              <span className="flex items-center gap-2">
                <Clock size={18} className="text-primary" />
                Feines i Tasques Exclusives de {client.name}
              </span>
              <span className="text-xs font-semibold bg-neutral-100 px-3 py-1 rounded-full text-neutral-600">
                {client.assignedTasks.length} Feines Registrades
              </span>
            </h2>

            {client.assignedTasks.length > 0 ? (
              <div className="space-y-3">
                {client.assignedTasks.map((task) => (
                  <div key={task.id} className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-between hover:border-primary/40 transition-colors">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">
                          #{task.code}
                        </span>
                        <span className="font-semibold text-neutral-900 text-sm">{task.title}</span>
                      </div>
                      <span className="text-xs text-neutral-500">
                        Data: {task.date} • Assignat a: <strong className="text-neutral-700">{task.operari}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        task.status === "COMPLETADA"
                          ? "bg-green-100 text-green-800"
                          : task.status === "EN_CURS"
                          ? "bg-blue-100 text-blue-800 animate-pulse"
                          : "bg-orange-100 text-orange-800"
                      }`}>
                        {task.status}
                      </span>
                      <Link href="/gestio/feines/mapa" className="text-xs text-primary font-medium hover:underline">
                        Veure
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-neutral-500 border border-dashed rounded-lg">
                No hi ha feines registrades actualment per a aquest client.
              </div>
            )}
          </div>

          {/* Telegram Notifications Only for THIS Client */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
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
                  className="w-full md:w-1/2 p-2.5 border border-neutral-200 rounded-lg text-sm font-mono focus:outline-none focus:border-blue-500"
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
                    className="flex-1 p-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    placeholder={`Escriu el missatge per al Telegram de ${client.name}...`}
                  />
                  <button 
                    type="submit"
                    disabled={isSending || !telegramMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Send size={16} />
                    {isSending ? "Enviant..." : "Enviar Telegram"}
                  </button>
                </div>
              </div>
            </form>

            {/* Telegram Message Logs for THIS Client */}
            <div className="mt-6 pt-4 border-t border-neutral-100">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Historial Telegram de {client.name}</h3>
              {logs.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {logs.map((log) => (
                    <div key={log.id} className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/60 text-xs flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-neutral-800 font-medium">{log.message}</span>
                        <span className="text-neutral-400 text-[10px]">{log.date}</span>
                      </div>
                      <span className="text-green-600 font-bold flex items-center gap-1">
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

        {/* Map Sidebar for THIS Client */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm flex flex-col h-[400px]">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-neutral-900">
              <MapPin size={18} className="text-primary" />
              Ubicació Finca ({client.name})
            </h2>
            <div className="flex-1 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
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
    </div>
  );
}
