"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, MapPin, Building, User, Mail, Phone, Settings } from "lucide-react";
import DynamicMap from "@/components/map/DynamicMap";

// Mock data
const getMockClient = (id: string) => {
  return { 
    id, 
    name: "Agro Riera SL", 
    contact: "Miquel Riera", 
    email: "miquel@agroriera.cat", 
    phone: "600111222", 
    nif: "B12345678",
    address: "Cami ral s/n, 08240 Manresa",
    lat: 41.6521, 
    lng: 1.8322,
    preferences: {
      notifications: true,
      reportLanguage: "ca",
      billingCycle: "monthly"
    }
  };
};

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const client = getMockClient(params.id);
  
  const [preferences, setPreferences] = useState(client.preferences);
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert("Preferències guardades correctament");
    }, 800);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/clients" className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500 hover:text-neutral-900">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{client.name}</h1>
          <p className="text-sm text-neutral-500">ID Client: {client.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Card */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building size={18} className="text-primary" />
              Dades de l'empresa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <label className="text-xs text-neutral-500 uppercase font-semibold">Nom Fiscal</label>
                <p className="text-neutral-900">{client.name}</p>
              </div>
              <div>
                <label className="text-xs text-neutral-500 uppercase font-semibold">NIF</label>
                <p className="text-neutral-900">{client.nif}</p>
              </div>
              <div>
                <label className="text-xs text-neutral-500 uppercase font-semibold">Adreça</label>
                <p className="text-neutral-900">{client.address}</p>
              </div>
              <div>
                <label className="text-xs text-neutral-500 uppercase font-semibold">Contacte Principal</label>
                <div className="flex items-center gap-2 text-neutral-900 mt-1">
                  <User size={14} className="text-neutral-400" />
                  {client.contact}
                </div>
                <div className="flex items-center gap-2 text-neutral-900 mt-1">
                  <Mail size={14} className="text-neutral-400" />
                  {client.email}
                </div>
                <div className="flex items-center gap-2 text-neutral-900 mt-1">
                  <Phone size={14} className="text-neutral-400" />
                  {client.phone}
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Form */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings size={18} className="text-primary" />
              Preferències
            </h2>
            <form onSubmit={handleSavePreferences} className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                <div>
                  <h3 className="text-sm font-medium text-neutral-900">Notificacions per correu</h3>
                  <p className="text-xs text-neutral-500">Rebre avisos sobre noves actuacions i factures</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={preferences.notifications}
                    onChange={(e) => setPreferences({...preferences, notifications: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="py-2 border-b border-neutral-100">
                <label className="block text-sm font-medium text-neutral-900 mb-1">Idioma dels Informes</label>
                <select 
                  className="w-full md:w-1/2 p-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  value={preferences.reportLanguage}
                  onChange={(e) => setPreferences({...preferences, reportLanguage: e.target.value})}
                >
                  <option value="ca">Català</option>
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
              
              <div className="py-2">
                <label className="block text-sm font-medium text-neutral-900 mb-1">Cicle de Facturació</label>
                <select 
                  className="w-full md:w-1/2 p-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  value={preferences.billingCycle}
                  onChange={(e) => setPreferences({...preferences, billingCycle: e.target.value})}
                >
                  <option value="monthly">Mensual</option>
                  <option value="quarterly">Trimestral</option>
                  <option value="yearly">Anual</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
                >
                  <Save size={16} />
                  {isSaving ? "Guardant..." : "Guardar Canvis"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Map Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm flex flex-col h-[400px]">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-primary" />
              Ubicació Principal
            </h2>
            <div className="flex-1 rounded-md overflow-hidden bg-neutral-100 border border-neutral-200">
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
