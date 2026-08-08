"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DynamicMap from "@/components/map/DynamicMap";
import { Search, MapPin, Plus, MoreVertical, X, Save, Building, User, Mail, Phone, Map, Trash2, FileText, CreditCard, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"list" | "map">("list");
  
  const [clients, setClients] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New Client Form State
  const [newClient, setNewClient] = useState({
    name: '',
    nif: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    lat: '' as string | number, 
    lng: '' as string | number,
  });

  const [isLocating, setIsLocating] = useState(false);

  const handleGeolocate = async () => {
    if (!newClient.address) {
      alert("Si us plau, introdueix una adreça primer.");
      return;
    }
    setIsLocating(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newClient.address)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setNewClient(prev => ({
          ...prev,
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        }));
      } else {
        alert("No s'han trobat coordenades per aquesta adreça. Si us plau, introdueix-les manualment.");
      }
    } catch (e) {
      alert("Error connectant amb el servei de mapes.");
    }
    setIsLocating(false);
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const dbClients = await apiClient.get('/clients');
        if (dbClients && Array.isArray(dbClients)) {
          const mappedClients = dbClients.map((c: any) => ({
            id: c.id,
            name: c.nom,
            nif: c.nif || '',
            contact: c.tipus || 'particular',
            email: c.email || '',
            phone: c.telefon || '',
            address: c.adreca || '',
            notes: c.notes || '',
            lat: c.lat || '',
            lng: c.lng || '',
            parcelPresets: (c.lat && c.lng) ? [{ name: 'Principal', lat: c.lat, lng: c.lng }] : []
          }));
          setClients(mappedClients);
        }
      } catch (e) {
        console.error("Error fetching clients", e);
      }
    };
    fetchClients();
  }, []);

  const handleSaveClient = async () => {
    try {
      const savedClient = await apiClient.post('/clients', {
        nom: newClient.name,
        telefon: newClient.phone || '000000000',
        email: newClient.email || undefined,
        nif: newClient.nif || undefined,
        adreca: newClient.address || undefined,
        lat: newClient.lat ? parseFloat(newClient.lat) : undefined,
        lng: newClient.lng ? parseFloat(newClient.lng) : undefined,
        notes: newClient.notes || undefined,
        tipus: newClient.contact || 'particular',
        actiu: true
      });

      const clientToSave = {
        ...newClient,
        id: savedClient.id,
        parcelPresets: savedClient.lat && savedClient.lng ? [{ name: 'Entrada Principal', lat: savedClient.lat, lng: savedClient.lng }] : []
      };
      
      setClients([...clients, clientToSave]);
      setShowAddModal(false);
      setNewClient({ name: '', nif: '', contact: '', email: '', phone: '', address: '', notes: '', lat: '', lng: '' });
    } catch (e) {
      console.error("Error creating client", e);
      alert("Error guardant el client al servidor.");
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm("Estàs segur que vols eliminar aquest client? Aquesta acció no es pot desfer.")) {
      try {
        await apiClient.delete(`/clients/${id}`);
        setClients(clients.filter(c => c.id !== id));
      } catch (e) {
        console.error("Error deleting client", e);
        alert("Error esborrant el client del servidor.");
      }
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
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <Link 
                        href={`/gestio/clients/${client.id}?edit=true`}
                        title="Veure i editar client"
                        className="text-neutral-400 hover:text-primary p-1 rounded transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                      </Link>
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
            locations={filteredClients
              .filter(c => c.lat !== '' && c.lng !== '' && !isNaN(Number(c.lat)) && !isNaN(Number(c.lng)))
              .map(c => ({ id: c.id, lat: Number(c.lat), lng: Number(c.lng), name: c.name }))} 
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
                  <label className="text-xs font-bold text-neutral-600 uppercase">NIF / CIF</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input 
                      type="text" 
                      value={newClient.nif} onChange={(e) => setNewClient({...newClient, nif: e.target.value})}
                      placeholder="Ex: B12345678" 
                      className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-primary focus:bg-white transition-colors uppercase"
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
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input 
                      type="text" 
                      value={newClient.address} onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                      placeholder="Carretera C-12, km..." 
                      className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-primary focus:bg-white transition-colors"
                    />
                  </div>
                  <button 
                    onClick={handleGeolocate}
                    disabled={isLocating || !newClient.address}
                    className="bg-primary text-white px-4 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    {isLocating ? <Loader2 size={18} className="animate-spin" /> : <Map size={18} />}
                    <span className="hidden sm:inline">Cercar Coordenades</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-600 uppercase">Latitud (Opcional)</label>
                  <input 
                    type="text"
                    value={newClient.lat ?? ''} onChange={(e) => setNewClient({...newClient, lat: e.target.value.replace(',', '.')})}
                    placeholder="Ex: 41.6176" 
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-primary focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-600 uppercase">Longitud (Opcional)</label>
                  <input 
                    type="text" 
                    value={newClient.lng ?? ''} onChange={(e) => setNewClient({...newClient, lng: e.target.value.replace(',', '.')})}
                    placeholder="Ex: 1.6200" 
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-primary focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-600 uppercase">Notes / Comentaris Interns</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-neutral-400" size={16} />
                  <textarea 
                    value={newClient.notes} onChange={(e) => setNewClient({...newClient, notes: e.target.value})}
                    placeholder="Particularitats, gossos a la finca, horaris preferits..." 
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-primary focus:bg-white transition-colors resize-none"
                  />
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
