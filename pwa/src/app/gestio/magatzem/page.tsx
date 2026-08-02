'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, PenTool, Truck, Plus, Search, AlertTriangle, CheckCircle2, Trash2, X, Wrench, Calendar, Gauge } from 'lucide-react';

export default function MagatzemDashboard() {
  const [activeTab, setActiveTab] = useState<'materials' | 'eines' | 'vehicles'>('materials');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Initial Mock Database for Materials
  const [materials, setMaterials] = useState([
    { id: 'm1', code: 'MAT-001', name: 'Tub PE 25mm High-Density', stock: 120, minStock: 20, unit: 'm', location: 'Prestatgeria A-1' },
    { id: 'm2', code: 'MAT-002', name: 'Vàlvula d\'Esfera 1" Inox', stock: 4, minStock: 10, unit: 'u', location: 'Caixa B-4' },
    { id: 'm3', code: 'MAT-003', name: 'Cinta de Teflon Professional', stock: 35, minStock: 5, unit: 'u', location: 'Armari C-2' },
    { id: 'm4', code: 'MAT-004', name: 'Adobat Foliar Nitrogenat 25kg', stock: 2, minStock: 15, unit: 'sacs', location: 'Palet N-3' },
  ]);

  // Initial Mock Database for Tools (Eines)
  const [eines, setEines] = useState([
    { id: 'e1', code: 'EIN-101', name: 'Trepant Bosch GSR-18', brand: 'Bosch Professional', serial: 'SN-99882', status: 'BO', assignedTo: 'Jordi Soler', location: 'Furgoneta 01' },
    { id: 'e2', code: 'EIN-102', name: 'Radial Makita 125mm', brand: 'Makita', serial: 'MK-44102', status: 'AVARIA', assignedTo: 'Magatzem Central', location: 'Taller Reparació' },
    { id: 'e3', code: 'EIN-103', name: 'Joc de Claus Stillson', brand: 'Palmera', serial: 'PAL-009', status: 'BO', assignedTo: 'Marc Andreu', location: 'Furgoneta 02' },
  ]);

  // Initial Mock Database for Vehicles
  const [vehicles, setVehicles] = useState([
    { id: 'v1', plate: '1234-BCD', name: 'Ford Transit Custom 2.0', type: 'Furgoneta', unitType: 'Km', counterValue: 124500, itvDate: '2026-11-15', insuranceDate: '2026-09-01', status: 'OK' },
    { id: 'v2', plate: '5678-LMN', name: 'Tractor John Deere 6R 150', type: 'Tractor', unitType: 'Hores', counterValue: 3420, itvDate: '2026-08-10', insuranceDate: '2026-12-20', status: 'REVISIO_PENDENT' },
    { id: 'v3', plate: '3341-KLM', name: 'Toyota Hilux 4x4', type: 'Pickup 4x4', unitType: 'Km', counterValue: 88900, itvDate: '2027-02-01', insuranceDate: '2026-10-15', status: 'OK' },
  ]);

  // New Item Form States
  const [newMat, setNewMat] = useState({ name: '', code: '', stock: '', minStock: '', unit: 'u', location: '' });
  const [newEin, setNewEin] = useState({ name: '', brand: '', serial: '', status: 'BO', assignedTo: 'Magatzem Central', location: 'Magatzem Central' });
  const [newVeh, setNewVeh] = useState({ plate: '', name: '', type: 'Furgoneta', unitType: 'Km', counterValue: '', itvDate: '', insuranceDate: '' });

  // Add Item Handlers
  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMat.name.trim()) return;

    const item = {
      id: `m${Date.now()}`,
      code: newMat.code.trim() || `MAT-00${materials.length + 1}`,
      name: newMat.name.trim(),
      stock: Number(newMat.stock) || 0,
      minStock: Number(newMat.minStock) || 5,
      unit: newMat.unit,
      location: newMat.location.trim() || 'Magatzem Central'
    };

    setMaterials([item, ...materials]);
    setNewMat({ name: '', code: '', stock: '', minStock: '', unit: 'u', location: '' });
    setShowAddModal(false);
  };

  const handleAddEina = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEin.name.trim()) return;

    const item = {
      id: `e${Date.now()}`,
      code: `EIN-${Math.floor(100 + Math.random() * 900)}`,
      name: newEin.name.trim(),
      brand: newEin.brand.trim() || 'Genèric',
      serial: newEin.serial.trim() || 'SN-000',
      status: newEin.status,
      assignedTo: newEin.assignedTo,
      location: newEin.location
    };

    setEines([item, ...eines]);
    setNewEin({ name: '', brand: '', serial: '', status: 'BO', assignedTo: 'Magatzem Central', location: 'Magatzem Central' });
    setShowAddModal(false);
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVeh.plate.trim() || !newVeh.name.trim()) return;

    const item = {
      id: `v${Date.now()}`,
      plate: newVeh.plate.trim().toUpperCase(),
      name: newVeh.name.trim(),
      type: newVeh.type,
      unitType: newVeh.unitType,
      counterValue: Number(newVeh.counterValue) || 0,
      itvDate: newVeh.itvDate || '2027-01-01',
      insuranceDate: newVeh.insuranceDate || '2027-01-01',
      status: 'OK'
    };

    setVehicles([item, ...vehicles]);
    setNewVeh({ plate: '', name: '', type: 'Furgoneta', unitType: 'Km', counterValue: '', itvDate: '', insuranceDate: '' });
    setShowAddModal(false);
  };

  // Delete Item Handlers
  const deleteMaterial = (id: string) => setMaterials(materials.filter((m) => m.id !== id));
  const deleteEina = (id: string) => setEines(eines.filter((e) => e.id !== id));
  const deleteVehicle = (id: string) => setVehicles(vehicles.filter((v) => v.id !== id));

  // Search Filters
  const filteredMaterials = materials.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.code.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredEines = eines.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.code.toLowerCase().includes(searchTerm.toLowerCase()) || e.brand.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredVehicles = vehicles.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.plate.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6 pt-32 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-xs text-neutral-500 gap-1">
        <Link href="/gestio" className="hover:text-primary">Dashboard</Link>
        <span>/</span>
        <span className="text-primary font-semibold">Magatzem, Eines i Flota</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Control de Magatzem i Flota</h1>
          <p className="text-sm text-neutral-500 mt-1">Gestió centralitzada de materials, eines i fleet de vehicles de CampoPro.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-5 py-3 rounded-xl font-medium text-sm transition-all shadow-md active:scale-95"
        >
          <Plus size={18} />
          {activeTab === 'materials' && 'Donar d\'Alta Nou Material'}
          {activeTab === 'eines' && 'Donar d\'Alta Nova Eina'}
          {activeTab === 'vehicles' && 'Donar d\'Alta Nou Vehicle'}
        </button>
      </div>

      {/* 3 Main Tabs: Materials, Eines, Vehicles */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex bg-neutral-100 p-1.5 rounded-xl border border-neutral-200">
          <button 
            onClick={() => setActiveTab('materials')}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'materials' ? 'bg-white shadow-md text-primary scale-105' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Package size={18} />
            Materials ({materials.length})
          </button>

          <button 
            onClick={() => setActiveTab('eines')}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'eines' ? 'bg-white shadow-md text-primary scale-105' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <PenTool size={18} />
            Eines ({eines.length})
          </button>

          <button 
            onClick={() => setActiveTab('vehicles')}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'vehicles' ? 'bg-white shadow-md text-primary scale-105' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Truck size={18} />
            Vehicles ({vehicles.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input 
            type="text"
            placeholder="Cercar al magatzem..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        </div>
      </div>

      {/* TAB 1: MATERIALS CONTENT */}
      {activeTab === 'materials' && (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Codi</th>
                <th className="px-6 py-4">Nom del Material</th>
                <th className="px-6 py-4 text-center">Estoc Actual</th>
                <th className="px-6 py-4 text-center">Estoc Mínim</th>
                <th className="px-6 py-4">Ubicació</th>
                <th className="px-6 py-4 text-center">Estat</th>
                <th className="px-6 py-4 text-right">Accions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((item) => {
                  const isLowStock = item.stock <= item.minStock;
                  return (
                    <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-neutral-500 font-bold">{item.code}</td>
                      <td className="px-6 py-4 font-semibold text-neutral-900">{item.name}</td>
                      <td className="px-6 py-4 text-center font-bold text-base text-neutral-900">
                        {item.stock} <span className="text-xs font-normal text-neutral-500">{item.unit}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-neutral-500">{item.minStock} {item.unit}</td>
                      <td className="px-6 py-4 text-neutral-600">{item.location}</td>
                      <td className="px-6 py-4 text-center">
                        {isLowStock ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                            <AlertTriangle size={14} /> Estoc Baix
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 size={14} /> OK
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => deleteMaterial(item.id)} className="p-2 text-neutral-400 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-neutral-400">Cap material trobat.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: EINES CONTENT */}
      {activeTab === 'eines' && (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Codi Inventari</th>
                <th className="px-6 py-4">Eina / Maquinària</th>
                <th className="px-6 py-4">Marca / Model</th>
                <th className="px-6 py-4">Assignat a</th>
                <th className="px-6 py-4">Ubicació Actual</th>
                <th className="px-6 py-4 text-center">Estat Físic</th>
                <th className="px-6 py-4 text-right">Accions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredEines.length > 0 ? (
                filteredEines.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-neutral-500 font-bold">{item.code}</td>
                    <td className="px-6 py-4 font-semibold text-neutral-900">{item.name}</td>
                    <td className="px-6 py-4 text-neutral-600">{item.brand} ({item.serial})</td>
                    <td className="px-6 py-4 font-medium text-neutral-800">{item.assignedTo}</td>
                    <td className="px-6 py-4 text-neutral-600">{item.location}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === 'BO' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800 animate-pulse'
                      }`}>
                        {item.status === 'BO' ? '🟢 Operatiu' : '🔴 Avaria / Taller'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => deleteEina(item.id)} className="p-2 text-neutral-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-neutral-400">Cap eina trobada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: VEHICLES CONTENT */}
      {activeTab === 'vehicles' && (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Matrícula</th>
                <th className="px-6 py-4">Vehicle / Maquinària</th>
                <th className="px-6 py-4">Tipus</th>
                <th className="px-6 py-4 text-center">Comptador Actual</th>
                <th className="px-6 py-4">Data Límit ITV</th>
                <th className="px-6 py-4">Assegurança</th>
                <th className="px-6 py-4 text-right">Accions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-primary text-sm">{item.plate}</td>
                    <td className="px-6 py-4 font-semibold text-neutral-900">{item.name}</td>
                    <td className="px-6 py-4 text-neutral-600">{item.type}</td>
                    <td className="px-6 py-4 text-center font-bold text-neutral-900">
                      {item.counterValue.toLocaleString('ca-ES')} <span className="text-xs font-normal text-neutral-500">{item.unitType}</span>
                    </td>
                    <td className="px-6 py-4 text-neutral-700 font-medium">{item.itvDate}</td>
                    <td className="px-6 py-4 text-neutral-700 font-medium">{item.insuranceDate}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => deleteVehicle(item.id)} className="p-2 text-neutral-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-neutral-400">Cap vehicle trobat.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL: DONAR D'ALTA PRODUCTES (DYNAMICALLY FOR THE ACTIVE TAB) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                <Plus className="text-primary" size={20} />
                {activeTab === 'materials' && 'Donar d\'Alta Nou Material'}
                {activeTab === 'eines' && 'Donar d\'Alta Nova Eina'}
                {activeTab === 'vehicles' && 'Donar d\'Alta Nou Vehicle'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X size={20} />
              </button>
            </div>

            {/* FORM 1: MATERIALS */}
            {activeTab === 'materials' && (
              <form onSubmit={handleAddMaterial} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Nom del Material</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Tub PE 25mm High-Density"
                    value={newMat.name}
                    onChange={(e) => setNewMat({ ...newMat, name: e.target.value })}
                    className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Codi Barres / SKU</label>
                    <input 
                      type="text" 
                      placeholder="Ex: MAT-005"
                      value={newMat.code}
                      onChange={(e) => setNewMat({ ...newMat, code: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Unitat de Mesura</label>
                    <select 
                      value={newMat.unit}
                      onChange={(e) => setNewMat({ ...newMat, unit: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary bg-white"
                    >
                      <option value="u">Unitats (u)</option>
                      <option value="m">Metres (m)</option>
                      <option value="kg">Kilograms (kg)</option>
                      <option value="L">Litres (L)</option>
                      <option value="sacs">Sacs / Caixes</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Estoc Inicial</label>
                    <input 
                      type="number" 
                      required
                      placeholder="0"
                      value={newMat.stock}
                      onChange={(e) => setNewMat({ ...newMat, stock: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Estoc Mínim D'Alerta</label>
                    <input 
                      type="number" 
                      placeholder="10"
                      value={newMat.minStock}
                      onChange={(e) => setNewMat({ ...newMat, minStock: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Ubicació al Magatzem</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Prestatgeria A-1 / Armari Central"
                    value={newMat.location}
                    onChange={(e) => setNewMat({ ...newMat, location: e.target.value })}
                    className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
                  />
                </div>

                <button type="submit" className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold shadow-md hover:bg-primary/90 mt-2">
                  Guardar i Donar d'Alta Material
                </button>
              </form>
            )}

            {/* FORM 2: EINES */}
            {activeTab === 'eines' && (
              <form onSubmit={handleAddEina} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Nom de l'Eina / Maquinària</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Trepant Bosch GSR-18"
                    value={newEin.name}
                    onChange={(e) => setNewEin({ ...newEin, name: e.target.value })}
                    className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Marca / Model</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Bosch Professional"
                      value={newEin.brand}
                      onChange={(e) => setNewEin({ ...newEin, brand: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Núm. Sèrie / Inventari</label>
                    <input 
                      type="text" 
                      placeholder="Ex: SN-99882"
                      value={newEin.serial}
                      onChange={(e) => setNewEin({ ...newEin, serial: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Estat Físic</label>
                    <select 
                      value={newEin.status}
                      onChange={(e) => setNewEin({ ...newEin, status: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary bg-white"
                    >
                      <option value="BO">🟢 Operatiu / Bo</option>
                      <option value="AVARIA">🔴 Avaria / Necessita Reparació</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Assignat a Operari/Magatzem</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Jordi Soler / Magatzem Central"
                      value={newEin.assignedTo}
                      onChange={(e) => setNewEin({ ...newEin, assignedTo: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold shadow-md hover:bg-primary/90 mt-2">
                  Guardar i Donar d'Alta Eina
                </button>
              </form>
            )}

            {/* FORM 3: VEHICLES */}
            {activeTab === 'vehicles' && (
              <form onSubmit={handleAddVehicle} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Matrícula</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: 1234-BCD"
                      value={newVeh.plate}
                      onChange={(e) => setNewVeh({ ...newVeh, plate: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary font-mono uppercase font-bold text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Tipus de Vehicle</label>
                    <select 
                      value={newVeh.type}
                      onChange={(e) => setNewVeh({ ...newVeh, type: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary bg-white"
                    >
                      <option value="Furgoneta">Furgoneta</option>
                      <option value="Tractor">Tractor</option>
                      <option value="Pickup 4x4">Pickup 4x4</option>
                      <option value="Camió">Camió</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Model / Descripció del Vehicle</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Ford Transit Custom 2.0 / John Deere 6R"
                    value={newVeh.name}
                    onChange={(e) => setNewVeh({ ...newVeh, name: e.target.value })}
                    className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Tipus Mesura Ús</label>
                    <select 
                      value={newVeh.unitType}
                      onChange={(e) => setNewVeh({ ...newVeh, unitType: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary bg-white"
                    >
                      <option value="Km">Kilòmetres (Km)</option>
                      <option value="Hores">Hores de Treball</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Valor Actual Comptador</label>
                    <input 
                      type="number" 
                      placeholder="Ex: 124500"
                      value={newVeh.counterValue}
                      onChange={(e) => setNewVeh({ ...newVeh, counterValue: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Data Límit ITV</label>
                    <input 
                      type="date" 
                      value={newVeh.itvDate}
                      onChange={(e) => setNewVeh({ ...newVeh, itvDate: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Data Venciment Assegurança</label>
                    <input 
                      type="date" 
                      value={newVeh.insuranceDate}
                      onChange={(e) => setNewVeh({ ...newVeh, insuranceDate: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold shadow-md hover:bg-primary/90 mt-2">
                  Guardar i Donar d'Alta Vehicle
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
