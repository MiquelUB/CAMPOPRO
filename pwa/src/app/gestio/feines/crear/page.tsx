"use client";

import { useState } from "react";
import Link from "next/link";
import PlanolOverlay from "@/components/map/PlanolOverlay";

export default function CrearFeina() {
  const [titol, setTitol] = useState("");
  const [client, setClient] = useState("");
  const [coords, setCoords] = useState("");
  const [materials, setMaterials] = useState<string[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleAiSuggest = async () => {
    setLoadingAi(true);
    // Mocking an API call to the backend
    setTimeout(() => {
      setMaterials((prev) => Array.from(
        new Set([...prev, "Tub PVC 20mm", "Cable 2.5mm", "Ciment Portland", "Cargols", "Clau anglesa"])
      ));
      setLoadingAi(false);
    }, 1500);
  };

  const removeMaterial = (index: number) => {
    setMaterials((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ titol, client, coords, materials });
    alert("Feina creada (mock)");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Crear Nova Feina</h1>
        <Link href="/feines" className="text-blue-500 hover:underline">
          Tornar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Títol de la feina</label>
            <input 
              type="text"
              required
              className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
              value={titol}
              onChange={(e) => setTitol(e.target.value)}
              placeholder="Ex: Instal·lació de rec en parcel·la nord"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
            <input 
              type="text"
              required
              className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Nom del client"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Coordenades centrals</label>
            <input 
              type="text"
              className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
              value={coords}
              onChange={(e) => setCoords(e.target.value)}
              placeholder="Ex: 41.3851, 2.1734"
            />
          </div>
        </div>

        {/* Materials i Suggeriments IA */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Materials necessaris</label>
            <button
              type="button"
              onClick={handleAiSuggest}
              disabled={loadingAi || !titol}
              className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1 rounded text-sm font-medium flex items-center transition-colors disabled:opacity-50"
            >
              {loadingAi ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Pensant...
                </span>
              ) : (
                "✨ Suggeriment Intel·ligent"
              )}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 min-h-[40px] border border-gray-200 rounded p-2 bg-gray-50">
            {materials.length === 0 && (
              <span className="text-gray-400 text-sm">Cap material afegit. Fes clic a suggeriment o afegeix-los.</span>
            )}
            {materials.map((mat, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full flex items-center">
                {mat}
                <button 
                  type="button" 
                  onClick={() => removeMaterial(idx)}
                  className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Planol Overlay Section */}
        <div className="border-t pt-4">
          <h2 className="text-lg font-medium mb-4">Georeferenciació de Plànol (Avançat)</h2>
          <PlanolOverlay />
        </div>

        <div className="flex justify-end border-t pt-4">
          <button 
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium shadow-sm transition-colors"
          >
            Crear Feina
          </button>
        </div>
      </form>
    </div>
  );
}
