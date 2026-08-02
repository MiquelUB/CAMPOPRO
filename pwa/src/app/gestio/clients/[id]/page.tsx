"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, MapPin, Building, User, Mail, Phone, Send, CheckCircle2, Clock } from "lucide-react";
import DynamicMap from "@/components/map/DynamicMap";

const getMockClient = (id: string) => {
  return { 
    id, 
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
      { id: "1", code: "OT-442", title: "Reparació Escomesa d'Aigua", status: "EN_CURS", date: "22/05/2024", operari: "Jordi S." },
      { id: "2", code: "OT-449", title: "Adobat de finques 'La Vall'", status: "PENDENT", date: "23/05/2024", operari: "Colla A" },
      { id: "3", code: "OT-390", title: "Manteniment canalització reg", status: "COMPLETADA", date: "15/05/2024", operari: "Marc T." }
    ],
    telegramLogs: [
      { id: "t1", date: "22/05/2024 08:30", message: "📱 Bot Telegram: L'operari Jordi S. ha iniciat la feina #OT-442.", status: "Enviat" },
      { id: "t2", date: "15/05/2024 14:15", message: "📱 Bot Telegram: La feina #OT-390 ha estat completada amb signatura.", status: "Enviat" }
    ]
  };
};

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const client = getMockClient(params.id);
  
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
        message: `📱 Enviat des de la PWA: ${telegramMessage}`,
        status: "Enviat"
      };
      setLogs([newLog, ...logs]);
      setTelegramMessage("");
      setIsSending(false);
    }, 600);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/gestio/clients" className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500 hover:text-neutral-900">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{client.name}</h1>
          <p className="text-sm text-neutral-500">ID Client: #{client.id} • NIF: {client.nif}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Company Data */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-neutral-900">
              <Building size={18} className="text-primary" />
              Dades del Client
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
                <label className="text-xs text-neutral-500 uppercase font-semibold">Contacte</label>
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

          {/* Assigned Tasks / Jobs Section */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center justify-between text-neutral-900">
              <span className="flex items-center gap-2">
                <Clock size={18} className="text-primary" />
                Feines i Tasques Assignades
              </span>
              <span className="text-xs font-semibold bg-neutral-100 px-3 py-1 rounded-full text-neutral-600">
                {client.assignedTasks.length} Feines
              </span>
            </h2>

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
          </div>

          {/* Telegram Notifications Only Section */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-neutral-900">
                <Send size={18} className="text-blue-500" />
                Notificacions Telegram (Bot Directe)
              </h2>
              <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full">
                Canal Oficial Telegram
              </span>
            </div>

            <p className="text-xs text-neutral-500 mb-4">
              Les comunicacions automàtiques i manuals amb el client s'envien exclusivament a través del Bot de Telegram.
            </p>

            <form onSubmit={handleSendTelegram} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Telegram Chat ID / Usuari</label>
                <input 
                  type="text"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  className="w-full md:w-1/2 p-2.5 border border-neutral-200 rounded-lg text-sm font-mono focus:outline-none focus:border-blue-500"
                  placeholder="@NomUsuariTelegram"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Enviar Missatge de Telegram al Client</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={telegramMessage}
                    onChange={(e) => setTelegramMessage(e.target.value)}
                    className="flex-1 p-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    placeholder="Escriu el missatge que rebrà el client al seu Telegram..."
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

            {/* Telegram Message Logs */}
            <div className="mt-6 pt-4 border-t border-neutral-100">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Historial de Comunicacions Telegram</h3>
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
            </div>
          </div>
        </div>

        {/* Map Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm flex flex-col h-[400px]">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-neutral-900">
              <MapPin size={18} className="text-primary" />
              Ubicació de les Finques
            </h2>
            <div className="flex-1 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
              <DynamicMap 
                locations={[{ id: client.id, lat: client.lat, lng: client.lng, name: client.name }]} 
                center={[client.lat, client.lng]} 
                zoom={14} 
              />
            </div>
            <p className="text-xs text-neutral-500 mt-4 text-center">
              Coordenades: {client.lat.toFixed(4)}, {client.lng.toFixed(4)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
