'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, PenTool, Truck, Building2, Plus, Search, AlertTriangle, CheckCircle2, Trash2, X, History, ExternalLink, Phone, Mail, User, ShieldCheck, Wrench, Calendar, Gauge, FileText } from 'lucide-react';

export default function MagatzemDashboard() {
  const [activeTab, setActiveTab] = useState<'materials' | 'eines' | 'vehicles' | 'proveidors'>('materials');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Selected Detail Modal State (Can hold material, eina, vehicle, or proveidor)
  const [selectedItem, setSelectedItem] = useState<{ type: 'material' | 'eina' | 'vehicle' | 'proveidor'; data: any } | null>(null);

  // Database 1: Materials
  const [materials, setMaterials] = useState([
    { 
      id: 'm1', 
      code: 'MAT-001', 
      name: 'Tub PE 25mm High-Density', 
      stock: 120, 
      minStock: 20, 
      unit: 'm', 
      location: 'Prestatgeria A-1',
      supplier: 'AgroSubministres Ponent SL',
      unitPrice: 4.50,
      lastPurchaseDate: '12/04/2026',
      purchaseHistory: [
        { id: 'h1', date: '12/04/2026', qty: '100m', price: '450,00 €', supplier: 'AgroSubministres Ponent SL', buyer: 'Marc (Enginyer)' },
        { id: 'h2', date: '02/02/2026', qty: '50m', price: '225,00 €', supplier: 'AgroSubministres Ponent SL', buyer: 'Marc (Enginyer)' },
      ]
    },
    { 
      id: 'm2', 
      code: 'MAT-002', 
      name: 'Vàlvula d\'Esfera 1" Inox', 
      stock: 4, 
      minStock: 10, 
      unit: 'u', 
      location: 'Caixa B-4',
      supplier: 'RiegoRegen Cat',
      unitPrice: 18.20,
      lastPurchaseDate: '20/03/2026',
      purchaseHistory: [
        { id: 'h4', date: '20/03/2026', qty: '10u', price: '182,00 €', supplier: 'RiegoRegen Cat', buyer: 'Marc (Enginyer)' }
      ]
    },
    { 
      id: 'm3', 
      code: 'MAT-003', 
      name: 'Cinta de Teflon Professional', 
      stock: 35, 
      minStock: 5, 
      unit: 'u', 
      location: 'Armari C-2',
      supplier: 'Subministraments Industrials Manresa',
      unitPrice: 1.20,
      lastPurchaseDate: '05/05/2026',
      purchaseHistory: [
        { id: 'h6', date: '05/05/2026', qty: '40u', price: '48,00 €', supplier: 'Subministraments Industrials Manresa', buyer: 'Marc (Enginyer)' }
      ]
    },
    { 
      id: 'm4', 
      code: 'MAT-004', 
      name: 'Adobat Foliar Nitrogenat 25kg', 
      stock: 2, 
      minStock: 15, 
      unit: 'sacs', 
      location: 'Palet N-3',
      supplier: 'Fertilitzants del Segre SA',
      unitPrice: 32.50,
      lastPurchaseDate: '18/02/2026',
      purchaseHistory: [
        { id: 'h7', date: '18/02/2026', qty: '20 sacs', price: '650,00 €', supplier: 'Fertilitzants del Segre SA', buyer: 'Miquel Riera' }
      ]
    },
  ]);

  // Database 2: Eines (Tools) with Warranty & Repairs History
  const [eines, setEines] = useState([
    { 
      id: 'e1', 
      code: 'EIN-101', 
      name: 'Trepant Bosch GSR-18', 
      brand: 'Bosch Professional', 
      serial: 'SN-99882', 
      status: 'BO', 
      assignedTo: 'Jordi Soler', 
      location: 'Furgoneta 01',
      warrantyUntil: '2027-06-15',
      supplier: 'Subministraments Industrials Manresa',
      repairHistory: [
        { id: 'r1', date: '15/01/2026', reason: 'Canvi d\'escobetes i greixatge', mechanic: 'Taller Oficial Bosch Manresa', cost: '35,00 €', status: 'COMPLETAT' }
      ]
    },
    { 
      id: 'e2', 
      code: 'EIN-102', 
      name: 'Radial Makita 125mm', 
      brand: 'Makita', 
      serial: 'MK-44102', 
      status: 'AVARIA', 
      assignedTo: 'Magatzem Central', 
      location: 'Taller Reparació',
      warrantyUntil: '2025-10-10',
      supplier: 'AgroSubministres Ponent SL',
      repairHistory: [
        { id: 'r2', date: '28/04/2026', reason: 'Substitució de rodaments i cable tallat', mechanic: 'Taller Central CampoPro', cost: '62,00 €', status: 'EN_CURS' }
      ]
    },
    { 
      id: 'e3', 
      code: 'EIN-103', 
      name: 'Joc de Claus Stillson', 
      brand: 'Palmera', 
      serial: 'PAL-009', 
      status: 'BO', 
      assignedTo: 'Marc Andreu', 
      location: 'Furgoneta 02',
      warrantyUntil: 'Garantia de per vida',
      supplier: 'Subministraments Industrials Manresa',
      repairHistory: []
    },
  ]);

  // Database 3: Vehicles with ITV, Oil Change, Mechanics & Maintenance History
  const [vehicles, setVehicles] = useState([
    { 
      id: 'v1', 
      plate: '1234-BCD', 
      name: 'Ford Transit Custom 2.0', 
      type: 'Furgoneta', 
      unitType: 'Km', 
      counterValue: 124500, 
      itvDate: '2026-11-15', 
      insuranceDate: '2026-09-01',
      lastOilChangeDate: '2026-03-10',
      lastOilChangeCounter: 120000,
      mechanicName: 'Taller Mecànic Pons & Fills',
      mechanicContact: '938 11 22 33 (Pere Pons)',
      status: 'OK',
      maintenanceHistory: [
        { id: 'vh1', date: '10/03/2026', counter: '120.000 Km', service: 'Canvi d\'oli 5W30, filtre d\'oli i filtre d\'aire', mechanic: 'Taller Mecànic Pons & Fills', cost: '185,00 €' },
        { id: 'vh2', date: '14/11/2025', counter: '105.000 Km', service: 'Substitució pastilles de fre davanteres', mechanic: 'Taller Mecànic Pons & Fills', cost: '140,00 €' }
      ]
    },
    { 
      id: 'v2', 
      plate: '5678-LMN', 
      name: 'Tractor John Deere 6R 150', 
      type: 'Tractor', 
      unitType: 'Hores', 
      counterValue: 3420, 
      itvDate: '2026-08-10', 
      insuranceDate: '2026-12-20',
      lastOilChangeDate: '2026-01-20',
      lastOilChangeCounter: 3200,
      mechanicName: 'AgroReparacions del Segre',
      mechanicContact: '973 44 55 66 (Joan)',
      status: 'REVISIO_PENDENT',
      maintenanceHistory: [
        { id: 'vh3', date: '20/01/2026', counter: '3.200 Hores', service: 'Revisió 500h: Oli de motor, hidràulic i filtres', mechanic: 'AgroReparacions del Segre', cost: '420,00 €' }
      ]
    },
    { 
      id: 'v3', 
      plate: '3341-KLM', 
      name: 'Toyota Hilux 4x4', 
      type: 'Pickup 4x4', 
      unitType: 'Km', 
      counterValue: 88900, 
      itvDate: '2027-02-01', 
      insuranceDate: '2026-10-15',
      lastOilChangeDate: '2025-12-05',
      lastOilChangeCounter: 80000,
      mechanicName: 'Taller Mecànic Pons & Fills',
      mechanicContact: '938 11 22 33 (Pere Pons)',
      status: 'OK',
      maintenanceHistory: [
        { id: 'vh4', date: '05/12/2025', counter: '80.000 Km', service: 'Manteniment integral 4x4 i alineació', mechanic: 'Taller Mecànic Pons & Fills', cost: '210,00 €' }
      ]
    },
  ]);

  // Database 4: Proveïdors (Suppliers)
  const [proveidors, setProveidors] = useState([
    { id: 'p1', nif: 'B25889911', name: 'AgroSubministres Ponent SL', contact: 'Albert Pons', phone: '973 11 22 33', email: 'ventes@agrosubministres.cat', address: 'Polígon Industrial El Segre, Nau 14, Lleida', products: 'Tubs, Canonades, Reg' },
    { id: 'p2', nif: 'A08112233', name: 'RiegoRegen Cat', contact: 'Laura Mas', phone: '938 44 55 66', email: 'laura@riegoregen.cat', address: 'Av. del Reg 88, Granollers', products: 'Vàlvules, Electrovàlvules, Solenoides' },
    { id: 'p3', nif: 'B66778899', name: 'Fertilitzants del Segre SA', contact: 'Joan Carles Valls', phone: '973 55 66 77', email: 'comercial@fertisegre.cat', address: 'Ctra. de Balaguer km 4, Lleida', products: 'Adobs, Fertilitzants, Fitosanitaris' },
    { id: 'p4', nif: 'B08991122', name: 'Subministraments Industrials Manresa', contact: 'Ricard Torres', phone: '938 77 88 99', email: 'ricard@submanresa.cat', address: 'C/ Sallent 12, Manresa', products: 'Eines, Cinta Teflon, Cargoleria' },
  ]);

  // Form States for Donar d'Alta
  const [newMat, setNewMat] = useState({ name: '', code: '', stock: '', minStock: '', unit: 'u', location: '', supplier: '', unitPrice: '' });
  const [newEin, setNewEin] = useState({ name: '', brand: '', serial: '', status: 'BO', assignedTo: 'Magatzem Central', location: 'Magatzem Central', warrantyUntil: '', supplier: '' });
  const [newVeh, setNewVeh] = useState({ plate: '', name: '', type: 'Furgoneta', unitType: 'Km', counterValue: '', itvDate: '', insuranceDate: '', lastOilChangeDate: '', lastOilChangeCounter: '', mechanicName: '', mechanicContact: '' });
  const [newProv, setNewProv] = useState({ name: '', nif: '', contact: '', phone: '', email: '', address: '', products: '' });

  // Creation Handlers
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
      location: newMat.location.trim() || 'Magatzem Central',
      supplier: newMat.supplier.trim() || 'AgroSubministres Ponent SL',
      unitPrice: Number(newMat.unitPrice) || 0,
      lastPurchaseDate: new Date().toLocaleDateString('ca-ES'),
      purchaseHistory: [
        {
          id: `h${Date.now()}`,
          date: new Date().toLocaleDateString('ca-ES'),
          qty: `${newMat.stock} ${newMat.unit}`,
          price: `${(Number(newMat.stock) * Number(newMat.unitPrice)).toFixed(2)} €`,
          supplier: newMat.supplier.trim() || 'AgroSubministres Ponent SL',
          buyer: 'Marc (Enginyer)'
        }
      ]
    };

    setMaterials([item, ...materials]);
    setNewMat({ name: '', code: '', stock: '', minStock: '', unit: 'u', location: '', supplier: '', unitPrice: '' });
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
      location: newEin.location,
      warrantyUntil: newEin.warrantyUntil || 'Sense garantia',
      supplier: newEin.supplier || 'Subministraments Industrials',
      repairHistory: []
    };

    setEines([item, ...eines]);
    setNewEin({ name: '', brand: '', serial: '', status: 'BO', assignedTo: 'Magatzem Central', location: 'Magatzem Central', warrantyUntil: '', supplier: '' });
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
      lastOilChangeDate: newVeh.lastOilChangeDate || new Date().toLocaleDateString('ca-ES'),
      lastOilChangeCounter: Number(newVeh.lastOilChangeCounter) || Number(newVeh.counterValue) || 0,
      mechanicName: newVeh.mechanicName || 'Taller Mecànic Pons & Fills',
      mechanicContact: newVeh.mechanicContact || '938 11 22 33',
      status: 'OK',
      maintenanceHistory: []
    };

    setVehicles([item, ...vehicles]);
    setNewVeh({ plate: '', name: '', type: 'Furgoneta', unitType: 'Km', counterValue: '', itvDate: '', insuranceDate: '', lastOilChangeDate: '', lastOilChangeCounter: '', mechanicName: '', mechanicContact: '' });
    setShowAddModal(false);
  };

  const handleAddProveidor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProv.name.trim()) return;

    const item = {
      id: `p${Date.now()}`,
      nif: newProv.nif.trim().toUpperCase() || 'B00000000',
      name: newProv.name.trim(),
      contact: newProv.contact.trim() || 'Persona de Contacte',
      phone: newProv.phone.trim() || '600000000',
      email: newProv.email.trim() || 'info@proveidor.cat',
      address: newProv.address.trim() || 'Direcció comercial',
      products: newProv.products.trim() || 'Materials Diversos'
    };

    setProveidors([item, ...proveidors]);
    setNewProv({ name: '', nif: '', contact: '', phone: '', email: '', address: '', products: '' });
    setShowAddModal(false);
  };

  // Delete Handlers
  const deleteMaterial = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMaterials(materials.filter((m) => m.id !== id));
  };
  const deleteEina = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEines(eines.filter((eina) => eina.id !== id));
  };
  const deleteVehicle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setVehicles(vehicles.filter((v) => v.id !== id));
  };
  const deleteProveidor = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProveidors(proveidors.filter((p) => p.id !== id));
  };

  // Filters
  const filteredMaterials = materials.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.code.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredEines = eines.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.code.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredVehicles = vehicles.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.plate.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredProveidors = proveidors.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.nif.toLowerCase().includes(searchTerm.toLowerCase()) || p.contact.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6 pt-32 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-xs text-neutral-500 gap-1">
        <Link href="/gestio" className="hover:text-primary">Dashboard</Link>
        <span>/</span>
        <span className="text-primary font-semibold">Magatzem, Flota i Proveïdors</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Control de Magatzem, Flota i Proveïdors</h1>
          <p className="text-sm text-neutral-500 mt-1">Gestió integral amb fitxes de manteniment, revisions, mecànics, garanties i històrics.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-5 py-3 rounded-xl font-medium text-sm transition-all shadow-md active:scale-95"
        >
          <Plus size={18} />
          {activeTab === 'materials' && 'Donar d\'Alta Nou Material'}
          {activeTab === 'eines' && 'Donar d\'Alta Nova Eina'}
          {activeTab === 'vehicles' && 'Donar d\'Alta Nou Vehicle'}
          {activeTab === 'proveidors' && 'Donar d\'Alta Nou Proveïdor'}
        </button>
      </div>

      {/* 4 Main Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex bg-neutral-100 p-1.5 rounded-xl border border-neutral-200 flex-wrap">
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

          <button 
            onClick={() => setActiveTab('proveidors')}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'proveidors' ? 'bg-white shadow-md text-primary scale-105' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Building2 size={18} />
            Proveïdors ({proveidors.length})
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

      {/* TAB 1: MATERIALS */}
      {activeTab === 'materials' && (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-500 font-semibold">
            💡 Clica sobre qualsevol material per veure la Fitxa Tècnica (Proveïdor, Preu, Històric de Compres).
          </div>
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
              {filteredMaterials.map((item) => {
                const isLowStock = item.stock <= item.minStock;
                return (
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedItem({ type: 'material', data: item })}
                    className="hover:bg-primary/5 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-neutral-500 font-bold">{item.code}</td>
                    <td className="px-6 py-4 font-semibold text-neutral-900 group-hover:text-primary transition-colors flex items-center gap-2">
                      {item.name}
                      <ExternalLink size={14} className="text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </td>
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
                      <button onClick={(e) => deleteMaterial(item.id, e)} className="p-2 text-neutral-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: EINES */}
      {activeTab === 'eines' && (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-500 font-semibold">
            💡 Clica sobre qualsevol eina per veure la Fitxa Tècnica (Garantia, Proveïdor i Històric de Reparacions).
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Codi Inventari</th>
                <th className="px-6 py-4">Eina / Maquinària</th>
                <th className="px-6 py-4">Marca / Model</th>
                <th className="px-6 py-4">Assignat a</th>
                <th className="px-6 py-4">Garantia Fins</th>
                <th className="px-6 py-4 text-center">Estat Físic</th>
                <th className="px-6 py-4 text-right">Accions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredEines.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => setSelectedItem({ type: 'eina', data: item })}
                  className="hover:bg-primary/5 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 font-mono text-xs text-neutral-500 font-bold">{item.code}</td>
                  <td className="px-6 py-4 font-semibold text-neutral-900 group-hover:text-primary transition-colors flex items-center gap-2">
                    {item.name}
                    <ExternalLink size={14} className="text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{item.brand} ({item.serial})</td>
                  <td className="px-6 py-4 font-medium text-neutral-800">{item.assignedTo}</td>
                  <td className="px-6 py-4 text-neutral-600 font-medium">{item.warrantyUntil}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.status === 'BO' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800 animate-pulse'
                    }`}>
                      {item.status === 'BO' ? '🟢 Operatiu' : '🔴 Avaria / Taller'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={(e) => deleteEina(item.id, e)} className="p-2 text-neutral-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: VEHICLES */}
      {activeTab === 'vehicles' && (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-500 font-semibold">
            💡 Clica sobre qualsevol vehicle per veure la Fitxa de Flota (ITV, Assegurança, Canvi d'Oli, Mecànic Habitual i Històric de Revisions).
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Matrícula</th>
                <th className="px-6 py-4">Vehicle / Maquinària</th>
                <th className="px-6 py-4">Tipus</th>
                <th className="px-6 py-4 text-center">Comptador Actual</th>
                <th className="px-6 py-4">Data Límit ITV</th>
                <th className="px-6 py-4">Taller / Mecànic</th>
                <th className="px-6 py-4 text-right">Accions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredVehicles.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => setSelectedItem({ type: 'vehicle', data: item })}
                  className="hover:bg-primary/5 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 font-mono font-bold text-primary text-sm">{item.plate}</td>
                  <td className="px-6 py-4 font-semibold text-neutral-900 group-hover:text-primary transition-colors flex items-center gap-2">
                    {item.name}
                    <ExternalLink size={14} className="text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{item.type}</td>
                  <td className="px-6 py-4 text-center font-bold text-neutral-900">
                    {item.counterValue.toLocaleString('ca-ES')} <span className="text-xs font-normal text-neutral-500">{item.unitType}</span>
                  </td>
                  <td className="px-6 py-4 text-neutral-700 font-medium">{item.itvDate}</td>
                  <td className="px-6 py-4 text-neutral-700 font-medium">{item.mechanicName}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={(e) => deleteVehicle(item.id, e)} className="p-2 text-neutral-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: PROVEÏDORS */}
      {activeTab === 'proveidors' && (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Nom Fiscal del Proveïdor</th>
                <th className="px-6 py-4">NIF / CIF</th>
                <th className="px-6 py-4">Persona de Contacte</th>
                <th className="px-6 py-4">Telèfon / Email</th>
                <th className="px-6 py-4">Productes Subministrats</th>
                <th className="px-6 py-4 text-right">Accions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredProveidors.map((prov) => (
                <tr 
                  key={prov.id} 
                  onClick={() => setSelectedItem({ type: 'proveidor', data: prov })}
                  className="hover:bg-primary/5 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 font-bold text-neutral-900 group-hover:text-primary transition-colors flex items-center gap-2">
                    {prov.name}
                    <ExternalLink size={14} className="text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-neutral-500 font-semibold">{prov.nif}</td>
                  <td className="px-6 py-4 text-neutral-800 flex items-center gap-1.5">
                    <User size={14} className="text-neutral-400" />
                    {prov.contact}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    <div className="flex items-center gap-1">
                      <Phone size={12} className="text-neutral-400" />
                      {prov.phone}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neutral-400 mt-0.5">
                      <Mail size={12} />
                      {prov.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-700">
                    <span className="bg-primary/10 text-primary font-medium text-xs px-2.5 py-1 rounded-full">
                      {prov.products}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={(e) => deleteProveidor(prov.id, e)} className="p-2 text-neutral-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL DETALL GENERAL (FITXES TÈCNIQUES PER CATEGORIA) */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
            
            {/* 1. FITXA MATERIAL */}
            {selectedItem.type === 'material' && (
              <div>
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-neutral-100">
                  <div>
                    <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                      #{selectedItem.data.code}
                    </span>
                    <h3 className="text-xl font-bold text-neutral-900 mt-2">{selectedItem.data.name}</h3>
                    <p className="text-xs text-neutral-500">Ubicació: {selectedItem.data.location}</p>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full">
                    <X size={22} />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 mb-6">
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Estoc Actual</span>
                    <span className="text-lg font-bold text-neutral-900">{selectedItem.data.stock} {selectedItem.data.unit}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Preu Unitari</span>
                    <span className="text-lg font-bold text-primary">{selectedItem.data.unitPrice.toFixed(2)} €</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Proveïdor</span>
                    <span className="text-xs font-bold text-neutral-800 truncate block mt-1">{selectedItem.data.supplier}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Última Compra</span>
                    <span className="text-xs font-bold text-neutral-800 block mt-1">{selectedItem.data.lastPurchaseDate}</span>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2 mb-3">
                  <History size={16} className="text-primary" /> Històric de Compres
                </h4>
                <div className="border border-neutral-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-100 text-neutral-600 font-semibold uppercase">
                      <tr>
                        <th className="p-3">Data</th>
                        <th className="p-3">Quantitat</th>
                        <th className="p-3">Import</th>
                        <th className="p-3">Proveïdor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {selectedItem.data.purchaseHistory?.map((h: any) => (
                        <tr key={h.id} className="hover:bg-neutral-50">
                          <td className="p-3 font-semibold text-neutral-900">{h.date}</td>
                          <td className="p-3 font-bold text-emerald-700">+{h.qty}</td>
                          <td className="p-3 font-bold text-neutral-900">{h.price}</td>
                          <td className="p-3 text-neutral-700">{h.supplier}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. FITXA EINA (AMB GARANTIA I REPARACIONS) */}
            {selectedItem.type === 'eina' && (
              <div>
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-neutral-100">
                  <div>
                    <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                      #{selectedItem.data.code}
                    </span>
                    <h3 className="text-xl font-bold text-neutral-900 mt-2">{selectedItem.data.name}</h3>
                    <p className="text-xs text-neutral-500">{selectedItem.data.brand} • Núm. Sèrie: {selectedItem.data.serial}</p>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full">
                    <X size={22} />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 mb-6">
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Garantia Fins</span>
                    <span className="text-sm font-bold text-emerald-700 flex items-center gap-1 mt-1">
                      <ShieldCheck size={16} /> {selectedItem.data.warrantyUntil}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Estat Físic</span>
                    <span className={`text-xs font-bold inline-block px-2.5 py-1 rounded-full mt-1 ${
                      selectedItem.data.status === 'BO' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedItem.data.status === 'BO' ? '🟢 Operatiu' : '🔴 Avaria / Taller'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Assignat A</span>
                    <span className="text-xs font-bold text-neutral-800 block mt-1">{selectedItem.data.assignedTo}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Proveïdor Adquirit</span>
                    <span className="text-xs font-bold text-neutral-800 truncate block mt-1">{selectedItem.data.supplier}</span>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2 mb-3">
                  <Wrench size={16} className="text-primary" /> Històric de Reparacions i Manteniment
                </h4>
                <div className="border border-neutral-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-100 text-neutral-600 font-semibold uppercase">
                      <tr>
                        <th className="p-3">Data</th>
                        <th className="p-3">Motiu / Treball</th>
                        <th className="p-3">Taller / Mecànic</th>
                        <th className="p-3">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {selectedItem.data.repairHistory && selectedItem.data.repairHistory.length > 0 ? (
                        selectedItem.data.repairHistory.map((r: any) => (
                          <tr key={r.id} className="hover:bg-neutral-50">
                            <td className="p-3 font-semibold text-neutral-900">{r.date}</td>
                            <td className="p-3 font-medium text-neutral-800">{r.reason}</td>
                            <td className="p-3 text-neutral-600">{r.mechanic}</td>
                            <td className="p-3 font-bold text-neutral-900">{r.cost}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-neutral-400">Cap reparació registrada. Eina en perfecte estat.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. FITXA VEHICLE (ITV, CANVI D'OLI, MECÀNIC I REVISIONS) */}
            {selectedItem.type === 'vehicle' && (
              <div>
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-neutral-100">
                  <div>
                    <span className="text-xs font-mono font-bold bg-primary text-white px-3 py-1 rounded-md">
                      {selectedItem.data.plate}
                    </span>
                    <h3 className="text-xl font-bold text-neutral-900 mt-2">{selectedItem.data.name}</h3>
                    <p className="text-xs text-neutral-500">Tipus: {selectedItem.data.type} • Comptador: {selectedItem.data.counterValue.toLocaleString('ca-ES')} {selectedItem.data.unitType}</p>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full">
                    <X size={22} />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 mb-6">
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Data Límit ITV</span>
                    <span className="text-xs font-bold text-neutral-900 flex items-center gap-1 mt-1">
                      <Calendar size={14} className="text-primary" /> {selectedItem.data.itvDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Últim Canvi d'Oli</span>
                    <span className="text-xs font-bold text-neutral-900 block mt-1">
                      {selectedItem.data.lastOilChangeDate} ({selectedItem.data.lastOilChangeCounter.toLocaleString('ca-ES')} {selectedItem.data.unitType})
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Mecànic Habitual</span>
                    <span className="text-xs font-bold text-primary block mt-1">{selectedItem.data.mechanicName}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Contacte Taller</span>
                    <span className="text-xs text-neutral-700 block mt-1">{selectedItem.data.mechanicContact}</span>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2 mb-3">
                  <Wrench size={16} className="text-primary" /> Històric de Revisions i Manteniments del Vehicle
                </h4>
                <div className="border border-neutral-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-100 text-neutral-600 font-semibold uppercase">
                      <tr>
                        <th className="p-3">Data</th>
                        <th className="p-3">Comptador</th>
                        <th className="p-3">Manteniment Realitzat</th>
                        <th className="p-3">Taller / Mecànic</th>
                        <th className="p-3">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {selectedItem.data.maintenanceHistory && selectedItem.data.maintenanceHistory.length > 0 ? (
                        selectedItem.data.maintenanceHistory.map((m: any) => (
                          <tr key={m.id} className="hover:bg-neutral-50">
                            <td className="p-3 font-semibold text-neutral-900">{m.date}</td>
                            <td className="p-3 font-mono">{m.counter}</td>
                            <td className="p-3 font-medium text-neutral-800">{m.service}</td>
                            <td className="p-3 text-neutral-600">{m.mechanic}</td>
                            <td className="p-3 font-bold text-neutral-900">{m.cost}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-neutral-400">Cap revisió registrada anteriorment.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. FITXA PROVEÏDOR */}
            {selectedItem.type === 'proveidor' && (
              <div>
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-neutral-100">
                  <div>
                    <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                      NIF: {selectedItem.data.nif}
                    </span>
                    <h3 className="text-xl font-bold text-neutral-900 mt-2">{selectedItem.data.name}</h3>
                    <p className="text-xs text-neutral-500">{selectedItem.data.address}</p>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full">
                    <X size={22} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 mb-6">
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Persona de Contacte</span>
                    <span className="text-sm font-bold text-neutral-900 block mt-1">{selectedItem.data.contact}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Telèfon Directe</span>
                    <span className="text-sm font-bold text-primary block mt-1">{selectedItem.data.phone}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Correu Electrònic</span>
                    <span className="text-xs font-bold text-neutral-800 block mt-1">{selectedItem.data.email}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Specialitat Productes</span>
                    <span className="text-xs font-bold text-neutral-800 block mt-1">{selectedItem.data.products}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-neutral-100 flex justify-end">
              <button 
                onClick={() => setSelectedItem(null)} 
                className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90"
              >
                Tancar Fitxa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DONAR D'ALTA (AMB TOTS ELS CAMPS DEMANATS) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                <Plus className="text-primary" size={20} />
                {activeTab === 'materials' && 'Donar d\'Alta Nou Material'}
                {activeTab === 'eines' && 'Donar d\'Alta Nova Eina'}
                {activeTab === 'vehicles' && 'Donar d\'Alta Nou Vehicle'}
                {activeTab === 'proveidors' && 'Donar d\'Alta Nou Proveïdor'}
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Proveïdor Principal</label>
                    <select
                      value={newMat.supplier}
                      onChange={(e) => setNewMat({ ...newMat, supplier: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary bg-white"
                    >
                      <option value="">Seleccionar Proveïdor...</option>
                      {proveidors.map((p) => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Preu Unitari (€)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="Ex: 4.50"
                      value={newMat.unitPrice}
                      onChange={(e) => setNewMat({ ...newMat, unitPrice: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold shadow-md hover:bg-primary/90 mt-2">
                  Guardar i Donar d'Alta Material
                </button>
              </form>
            )}

            {/* FORM 2: EINES (AMB GARANTIA I PROVEÏDOR) */}
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
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Data Venciment Garantia</label>
                    <input 
                      type="date" 
                      value={newEin.warrantyUntil}
                      onChange={(e) => setNewEin({ ...newEin, warrantyUntil: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Proveïdor On s'ha Adquirit</label>
                    <select
                      value={newEin.supplier}
                      onChange={(e) => setNewEin({ ...newEin, supplier: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary bg-white"
                    >
                      <option value="">Seleccionar Proveïdor...</option>
                      {proveidors.map((p) => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
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

            {/* FORM 3: VEHICLES (AMB CANVI D'OLI, MECÀNIC I ITV) */}
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
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Data Últim Canvi d'Oli</label>
                    <input 
                      type="date" 
                      value={newVeh.lastOilChangeDate}
                      onChange={(e) => setNewVeh({ ...newVeh, lastOilChangeDate: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Nom Taller / Mecànic Habitual</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Taller Mecànic Pons & Fills"
                      value={newVeh.mechanicName}
                      onChange={(e) => setNewVeh({ ...newVeh, mechanicName: e.target.value })}
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

            {/* FORM 4: PROVEÏDORS */}
            {activeTab === 'proveidors' && (
              <form onSubmit={handleAddProveidor} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Nom Fiscal del Proveïdor</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: AgroSubministres Ponent SL"
                    value={newProv.name}
                    onChange={(e) => setNewProv({ ...newProv, name: e.target.value })}
                    className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">NIF / CIF</label>
                    <input 
                      type="text" 
                      placeholder="Ex: B25889911"
                      value={newProv.nif}
                      onChange={(e) => setNewProv({ ...newProv, nif: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Persona de Contacte</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Albert Pons"
                      value={newProv.contact}
                      onChange={(e) => setNewProv({ ...newProv, contact: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Telèfon de Contacte</label>
                    <input 
                      type="text" 
                      placeholder="Ex: 973 11 22 33"
                      value={newProv.phone}
                      onChange={(e) => setNewProv({ ...newProv, phone: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Email de Contacte</label>
                    <input 
                      type="email" 
                      placeholder="Ex: ventes@proveidor.cat"
                      value={newProv.email}
                      onChange={(e) => setNewProv({ ...newProv, email: e.target.value })}
                      className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Productes Subministrats</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Tubs, Canonades, Reg, Adobs..."
                    value={newProv.products}
                    onChange={(e) => setNewProv({ ...newProv, products: e.target.value })}
                    className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
                  />
                </div>

                <button type="submit" className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold shadow-md hover:bg-primary/90 mt-2">
                  Guardar i Donar d'Alta Proveïdor
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
