"use client";

import { useState } from "react";
import Link from "next/link";
import DynamicMap from "@/components/map/DynamicMap";
import { Search, MapPin, Plus, MoreVertical } from "lucide-react";

const MOCK_CLIENTS: any[] = [];

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"list" | "map">("list");

  const filteredClients = MOCK_CLIENTS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Clients</h1>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm transition-colors">
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
                      <button className="text-neutral-400 hover:text-neutral-900 p-1 rounded">
                        <MoreVertical size={16} />
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
    </div>
  );
}
