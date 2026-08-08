"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DynamicMap from "@/components/map/DynamicMap";
import { Search, MapPin, Plus, MoreVertical, X, Save, Building, User, Mail, Phone, Map, Trash2 } from "lucide-react";

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"list" | "map">("list");
  
  const [clients, setClients] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New Client Form State
  const [newClient, setNewClient] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    lat: 41.6, // Default coords approx
    lng: 1.5,
  });

  useEffect(() => {
    const saved = localStorage.getItem('campopro_clients');
    if (saved) {
      setClients(JSON.parse(saved));
    } else {
      setClients([]);
    }
  }, []);

  const handleSaveClient = () => {
    const clientToSave = {
      ...newClient,
      id: `c_${Date.now()}`,
      parcelPresets: [{ name: 'Entrada Principal', lat: newClient.lat, lng: newClient.lng }]
    };
    const updated = [...clients, clientToSave];
    setClients(updated);
    localStorage.setItem('campopro_clients', JSON.stringify(updated));
    setShowAddModal(false);
    setNewClient({ name: '', contact: '', email: '', phone: '', address: '', lat: 41.6, lng: 1.5 });
  };

  const handleDeleteClient = (id: string) => {
    if (confirm("Estàs segur que vols eliminar aquest client? Aquesta acció no es pot desfer.")) {
      const updated = clients.filter(c => c.id !== id);
      setClients(updated);
      localStorage.setItem('campopro_clients', JSON.stringify(updated));
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Clients</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm"
        >
          <Plus size={16} />
          Nou Client
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input 
            type="text" 
            placeholder="Cercar clients per nom o contacte..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="flex bg-neutral-100 p-1 rounded-md">
          <button 
            onClick={() => setView("list")}
            className={`px-3 py-1 text-sm font-medium rounded-sm transition-colors ${view === "list" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-900"}`}
          >
            Llista
          </button>
          <button 
            onClick={() => setView("map")}
            className={`px-3 py-1 text-sm font-medium rounded-sm transition-colors ${view === "map" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-900"}`}
          >
            Mapa
          </button>
        </div>
      </div>

      {view === "list" ? (
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500">
              <tr>
                <th className="px-6 py-4 font-medium">Nom Empresa</th>
                <th className="px-6 py-4 font-medium">Contacte principal</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Telèfon</th>
                <th className="px-6 py-4 font-medium text-right">Accions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredClients.length > 0 ? (
                filteredClients.map(client => (
                  <tr key={client.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-neutral-900">
                      <Link href={`/gestio/clients/${client.id}`} className="hover:text-primary hover:underline">
                        {client.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{client.contact}</td>
                    <td className="px-6 py-4 text-neutral-600">{client.email}</td>
                    <td className="px-6 py-4 text-neutral-600">{client.phone}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteClient(client.id)}
                        title="Eliminar client"
                        className="text-neutral-400 hover:text-red-600 p-1 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    No s'han trobat clients que coincideixin amb la cerca.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-[600px] border border-neutral-200 rounded-lg overflow-hidden bg-neutral-100">
          <DynamicMap 
            locations={filteredClients.map(c => ({ id: c.id, lat: c.lat, lng: c.lng, name: c.name }))} 
            center={[41.5, 2.0]} 
            zoom={9} 
          />
        </div>
      )}

      {/* MODAL NOU CLIENT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-surface-container-lowest">
              <h2 className="text-xl font-headline-md text-primary flex items-center gap-2">
                <Building size={24} className="text-primary" />
                Alta de Nou Client
              </h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-2 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-600 uppercase">Nom del Client o Empresa *</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input 
                      type="text" 
                      value={newClient.name} onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                      placeholder="Ex: Joan Prats / Finca el Mas" 
                      className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-primary focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-600 uppercase">Persona de Contacte</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input 
                      type="text" 
                      value={newClient.contact} onChange={(e) => setNewClient({...newClient, contact: e.target.value})}
                      placeholder="Nom i cognoms" 
                      className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-primary focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-600 uppercase">Telèfon *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input 
                      type="tel" 
                      value={newClient.phone} onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                      placeholder="600 000 000" 
                      className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-primary focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-600 uppercase">Correu Electrònic</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input 
                      type="email" 
                      value={newClient.email} onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                      placeholder="correu@empresa.com" 
                      className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-primary focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-600 uppercase">Adreça Postal de la Finca / Jardí</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                  <input 
                    type="text" 
                    value={newClient.address} onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                    placeholder="Carretera C-12, km..." 
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-primary focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                <Map className="text-blue-600 shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-blue-900">
                  <p className="font-bold mb-1">Geolocalització Automàtica</p>
                  <p>Les coordenades per defecte s'han generat. Properament podreu ajustar el punt exacte al mapa dins la fitxa del client.</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3 rounded-b-2xl">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-neutral-600 hover:bg-neutral-200 transition-colors"
              >
                Cancel·lar
              </button>
              <button 
                onClick={handleSaveClient}
                disabled={!newClient.name || !newClient.phone}
                className="px-6 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                Guardar Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
