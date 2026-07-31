"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Package, PenTool } from 'lucide-react';

export default function MagatzemDashboard() {
  const [activeTab, setActiveTab] = useState<'materials' | 'eines'>('materials');
  const [materials, setMaterials] = useState<any[]>([]);
  const [eines, setEines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getStatusColor = (stock: number, min: number = 10) => {
    if (stock === 0) return 'bg-red-500';
    if (stock < min) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Simplificació per producció MVP
      
      const resMat = await fetch('/api/v1/magatzem/productes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (resMat.ok) {
        setMaterials(await resMat.json());
      }

      const resEines = await fetch('/api/v1/eines/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (resEines.ok) {
        setEines(await resEines.json());
      }
    } catch (error) {
      console.error("Error fetching inventory", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Magatzem i Flota</h1>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm transition-colors">
          <Plus size={16} />
          {activeTab === 'materials' ? 'Nou Material' : 'Nova Eina'}
        </button>
      </div>

      <div className="flex bg-neutral-100 p-1 rounded-md w-max">
        <button 
          onClick={() => setActiveTab('materials')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm transition-colors ${activeTab === 'materials' ? 'bg-white shadow-sm text-primary' : 'text-neutral-500 hover:text-neutral-900'}`}
        >
          <Package size={16} />
          Materials i Consumibles
        </button>
        <button 
          onClick={() => setActiveTab('eines')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm transition-colors ${activeTab === 'eines' ? 'bg-white shadow-sm text-primary' : 'text-neutral-500 hover:text-neutral-900'}`}
        >
          <PenTool size={16} />
          Eines i Maquinària
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-neutral-500">
            Carregant dades...
          </div>
        ) : activeTab === 'materials' ? (
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500">
              <tr>
                <th className="px-6 py-4 font-medium">Codi</th>
                <th className="px-6 py-4 font-medium">Producte</th>
                <th className="px-6 py-4 font-medium text-center">Stock Actual</th>
                <th className="px-6 py-4 font-medium text-center">Estat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {materials.length > 0 ? (
                materials.map((item: any) => (
                  <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 text-neutral-500">{item.codi_barres || '-'}</td>
                    <td className="px-6 py-4 font-medium text-neutral-900">{item.nom}</td>
                    <td className="px-6 py-4 text-center">{item.estoc_actual} {item.unitat_mesura}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block w-3 h-3 rounded-full ${getStatusColor(item.estoc_actual, item.estoc_minim)}`} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                    No hi ha materials registrats.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500">
              <tr>
                <th className="px-6 py-4 font-medium">Codi</th>
                <th className="px-6 py-4 font-medium">Eina / Maquinària</th>
                <th className="px-6 py-4 font-medium">Estat Físic</th>
                <th className="px-6 py-4 font-medium">Ubicació Actual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {eines.length > 0 ? (
                eines.map((eina: any) => (
                  <tr key={eina.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 text-neutral-500 font-mono text-xs">{eina.codi}</td>
                    <td className="px-6 py-4 font-medium text-neutral-900">
                      {eina.nom} <span className="text-neutral-400 font-normal ml-2">{eina.marca} {eina.model}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${eina.estat === 'bo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {eina.estat}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{eina.ubicacio_actual || 'Magatzem central'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                    No hi ha eines registrades.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
