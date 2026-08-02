'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, PenTool, Truck, Building2, Plus, Search, AlertTriangle, CheckCircle2, Trash2, X, History, ExternalLink, Phone, Mail, User, ShieldCheck, Wrench, Calendar, Gauge, FileText, CreditCard, Percent, DollarSign, Bot, Sparkles, Upload, FileUp, Loader2, ArrowRight, ShieldAlert, FileCheck, RefreshCw, UserPlus } from 'lucide-react';

export default function MagatzemDashboard() {
  const [activeTab, setActiveTab] = useState<'materials' | 'eines' | 'vehicles' | 'proveidors'>('materials');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // AI Invoice Reader & Audit Engine State
  const [showAIModal, setShowAIModal] = useState(false);
  const [docTypeSelection, setDocTypeSelection] = useState<'AUTO' | 'ALBARA' | 'FACTURA'>('AUTO');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiStep, setAiStep] = useState<number>(1); // 1: Upload, 2: AI Audit, 3: Discrepancy & New Supplier Review
  const [aiInvoiceFile, setAiInvoiceFile] = useState<File | null>(null);
  const [aiAuditResult, setAiAuditResult] = useState<any | null>(null);

  // Selected Detail Modal State
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
        { id: 'h1', date: '12/04/2026', qty: '100m', price: '450,00 €', supplier: 'AgroSubministres Ponent SL', buyer: 'Marc (Enginyer)' }
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
  ]);

  // Database 2: Eines
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
      repairHistory: []
    }
  ]);

  // Database 3: Vehicles
  const [vehicles, setVehicles] = useState([
    { 
      id: 'v1', 
      plate: '1234-BCD', 
      name: 'Ford Transit Custom 2.0', 
      type: 'Furgoneta', 
      unitType: 'Km', 
      counterValue: 124500, 
      itvDate: '2026-11-15', 
      insuranceCompany: 'Mapfre Assegurances',
      insurancePolicy: 'POL-9988112-F',
      insuranceDate: '2026-09-01',
      status: 'OK',
      maintenanceHistory: []
    }
  ]);

  // Database 4: Proveïdors
  const [proveidors, setProveidors] = useState([
    { 
      id: 'p1', 
      nif: 'B25889911', 
      name: 'AgroSubministres Ponent SL', 
      contact: 'Albert Pons', 
      phone: '973 11 22 33', 
      email: 'ventes@agrosubministres.cat', 
      address: 'Polígon Industrial El Segre, Nau 14, Lleida', 
      products: 'Tubs, Canonades, Reg',
      discount: '15%',
      paymentMethod: 'Transferència a 30 dies',
      totalSpentNumeric: 1450.00,
      totalSpent: '1.450,00 €',
      supplierHistory: []
    }
  ]);

  // Form States for Donar d'Alta
  const [newMat, setNewMat] = useState({ name: '', code: '', stock: '', minStock: '', unit: 'u', location: '', supplier: '', unitPrice: '' });
  const [newProv, setNewProv] = useState({ name: '', nif: '', contact: '', phone: '', email: '', address: '', products: '', discount: '', paymentMethod: '' });

  // AI Document Audit & Auto Supplier Creation Execution Handler
  const startAIAudit = (scenario: 'EXISTING_SUPPLIER' | 'NEW_SUPPLIER') => {
    setIsAiProcessing(true);
    setAiStep(2);

    setTimeout(() => {
      if (scenario === 'NEW_SUPPLIER') {
        // Document from a NEW supplier not present in proveidors database!
        setAiAuditResult({
          docType: 'TICKET / FACTURA DIRECTA',
          docNumber: 'TIC-2026-3310',
          date: new Date().toLocaleDateString('ca-ES'),
          isNewSupplier: true,
          supplier: {
            name: 'Recanvis Agrícoles del Segre SL',
            nif: 'B25998844',
            contact: 'Atenció Comercial',
            phone: '973 88 99 00',
            email: 'comercial@recanvissegre.cat',
            address: 'Polígon Ind. El Segre, Carrer B, Nau 4, Lleida',
            products: 'Reg, Electrovàlvules i Connectors',
            discount: '10%',
            paymentMethod: 'Transferència 30 dies'
          },
          hasDiscrepancy: false,
          discrepancies: [],
          totalAmount: 285.00,
          items: [
            { name: 'Filtre de Malla 2" High-Pressure', code: 'MAT-015', qty: 2, unit: 'u', unitPrice: 82.50, total: 165.00, isNew: true },
            { name: 'Cinta d\'Aïllament Vulcanitzada', code: 'MAT-016', qty: 10, unit: 'u', unitPrice: 12.00, total: 120.00, isNew: true }
          ]
        });
      } else {
        // Factura from existing supplier with discrepancy cross-check
        setAiAuditResult({
          docType: 'FACTURA COMERCIAL REBUDA',
          docNumber: 'FAC-2026-9901',
          matchedAlbara: 'ALB-2026-8812',
          date: new Date().toLocaleDateString('ca-ES'),
          isNewSupplier: false,
          supplier: { name: 'AgroSubministres Ponent SL', nif: 'B25889911', agreedDiscount: '15%' },
          hasDiscrepancy: true,
          totalAmount: 510.00,
          discrepancies: [
            {
              field: 'Preu Unitari',
              item: 'Tub PE 25mm High-Density',
              albaraValue: '4,50 € / m (Segons Albarà #ALB-2026-8812)',
              facturaValue: '4,90 € / m (Augment del +8,8%)',
              impact: '+40,00 € extra no pactats'
            }
          ],
          items: [
            { name: 'Tub PE 25mm High-Density', code: 'MAT-001', qty: 100, unit: 'm', unitPrice: 4.90, total: 490.00 }
          ]
        });
      }

      setIsAiProcessing(false);
      setAiStep(3);
    }, 2400);
  };

  // Confirm Audit Results: Create new supplier if needed, update stock and supplier total spent!
  const applyAIAuditToDatabase = () => {
    if (!aiAuditResult) return;

    // 1. If AI detected a NEW SUPPLIER, automatically register them!
    if (aiAuditResult.isNewSupplier) {
      const newProvObj = {
        id: `p-${Date.now()}`,
        nif: aiAuditResult.supplier.nif,
        name: aiAuditResult.supplier.name,
        contact: aiAuditResult.supplier.contact,
        phone: aiAuditResult.supplier.phone,
        email: aiAuditResult.supplier.email,
        address: aiAuditResult.supplier.address,
        products: aiAuditResult.supplier.products,
        discount: aiAuditResult.supplier.discount,
        paymentMethod: aiAuditResult.supplier.paymentMethod,
        totalSpentNumeric: aiAuditResult.totalAmount,
        totalSpent: `${aiAuditResult.totalAmount.toFixed(2)} €`,
        supplierHistory: [
          {
            id: `sp-${Date.now()}`,
            date: aiAuditResult.date,
            concept: `Alta de Proveïdor via Ticket/Factura #${aiAuditResult.docNumber}`,
            amount: `${aiAuditResult.totalAmount.toFixed(2)} €`
          }
        ]
      };

      setProveidors([newProvObj, ...proveidors]);
    } else {
      // Update existing supplier total spent
      const updatedProveidors = proveidors.map(p => {
        if (p.nif === aiAuditResult.supplier.nif || p.name.toLowerCase().includes(aiAuditResult.supplier.name.toLowerCase())) {
          const newTotal = p.totalSpentNumeric + aiAuditResult.totalAmount;
          return {
            ...p,
            totalSpentNumeric: newTotal,
            totalSpent: `${newTotal.toLocaleString('ca-ES', { minimumFractionDigits: 2 })} €`,
            supplierHistory: [
              { id: `sp-${Date.now()}`, date: aiAuditResult.date, concept: `Factura Auditada #${aiAuditResult.docNumber}`, amount: `${aiAuditResult.totalAmount.toFixed(2)} €` },
              ...p.supplierHistory
            ]
          };
        }
        return p;
      });
      setProveidors(updatedProveidors);
    }

    // 2. Add or update items stock
    let updatedMaterials = [...materials];
    aiAuditResult.items.forEach((item: any) => {
      const existingIdx = updatedMaterials.findIndex(m => m.code === item.code || m.name.toLowerCase() === item.name.toLowerCase());
      if (existingIdx >= 0) {
        updatedMaterials[existingIdx] = {
          ...updatedMaterials[existingIdx],
          stock: updatedMaterials[existingIdx].stock + item.qty,
          unitPrice: item.unitPrice,
          lastPurchaseDate: aiAuditResult.date,
          purchaseHistory: [
            { id: `h-${Date.now()}`, date: aiAuditResult.date, qty: `+${item.qty} ${item.unit}`, price: `${item.total.toFixed(2)} €`, supplier: aiAuditResult.supplier.name, buyer: 'IA Ticket Auto-Reader' },
            ...updatedMaterials[existingIdx].purchaseHistory
          ]
        };
      } else {
        // Create new material
        updatedMaterials.unshift({
          id: `m-${Date.now()}-${Math.random()}`,
          code: item.code,
          name: item.name,
          stock: item.qty,
          minStock: 5,
          unit: item.unit,
          location: 'Magatzem Central (Auto IA)',
          supplier: aiAuditResult.supplier.name,
          unitPrice: item.unitPrice,
          lastPurchaseDate: aiAuditResult.date,
          purchaseHistory: [
            { id: `h-${Date.now()}`, date: aiAuditResult.date, qty: `+${item.qty} ${item.unit}`, price: `${item.total.toFixed(2)} €`, supplier: aiAuditResult.supplier.name, buyer: 'IA Ticket Auto-Reader' }
          ]
        });
      }
    });

    setMaterials(updatedMaterials);

    setShowAIModal(false);
    setAiStep(1);
    setAiAuditResult(null);
  };

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
      purchaseHistory: []
    };

    setMaterials([item, ...materials]);
    setNewMat({ name: '', code: '', stock: '', minStock: '', unit: 'u', location: '', supplier: '', unitPrice: '' });
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
      products: newProv.products.trim() || 'Materials Diversos',
      discount: newProv.discount.trim() || '0%',
      paymentMethod: newProv.paymentMethod.trim() || 'Transferència a 30 dies',
      totalSpentNumeric: 0,
      totalSpent: '0,00 €',
      supplierHistory: []
    };

    setProveidors([item, ...proveidors]);
    setNewProv({ name: '', nif: '', contact: '', phone: '', email: '', address: '', products: '', discount: '', paymentMethod: '' });
    setShowAddModal(false);
  };

  // Delete Handlers
  const deleteMaterial = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMaterials(materials.filter((m) => m.id !== id));
  };

  const filteredMaterials = materials.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.code.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredEines = eines.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredVehicles = vehicles.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.plate.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredProveidors = proveidors.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6 pt-32 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-xs text-neutral-500 gap-1">
        <Link href="/gestio" className="hover:text-primary">Dashboard</Link>
        <span>/</span>
        <span className="text-primary font-semibold">Magatzem, Flota i Auto-Alta Proveïdors</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            Magatzem i Alta Automàtica de Proveïdors per IA
            <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
              <Sparkles size={12} /> Auto-Alta IA
            </span>
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Si carregues un ticket o factura d'un nou proveïdor, la IA extreu les dades i el dona d'alta automàticament.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* AI Audit Button */}
          <button
            onClick={() => {
              setShowAIModal(true);
              setAiStep(1);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-700 hover:to-teal-800 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
          >
            <Bot size={18} />
            Escanejar Ticket / Factura amb IA
          </button>

          {/* Standard Add Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-5 py-3 rounded-xl font-medium text-sm transition-all shadow-md active:scale-95"
          >
            <Plus size={18} />
            Donar d'Alta
          </button>
        </div>
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
              {filteredMaterials.map((item) => (
                <tr key={item.id} className="hover:bg-primary/5 transition-colors cursor-pointer group">
                  <td className="px-6 py-4 font-mono text-xs text-neutral-500 font-bold">{item.code}</td>
                  <td className="px-6 py-4 font-semibold text-neutral-900 flex items-center gap-2">{item.name}</td>
                  <td className="px-6 py-4 text-center font-bold text-base text-neutral-900">{item.stock} <span className="text-xs font-normal text-neutral-500">{item.unit}</span></td>
                  <td className="px-6 py-4 text-center text-neutral-500">{item.minStock} {item.unit}</td>
                  <td className="px-6 py-4 text-neutral-600">{item.location}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 size={14} /> OK
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={(e) => deleteMaterial(item.id, e)} className="p-2 text-neutral-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
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
                <th className="px-6 py-4">Proveïdor</th>
                <th className="px-6 py-4">NIF</th>
                <th className="px-6 py-4">Persona Contacte</th>
                <th className="px-6 py-4">Telèfon / Email</th>
                <th className="px-6 py-4 text-center">Despesa Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredProveidors.map((prov) => (
                <tr key={prov.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 font-bold text-neutral-900">{prov.name}</td>
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-neutral-500">{prov.nif}</td>
                  <td className="px-6 py-4 font-medium text-neutral-800">{prov.contact}</td>
                  <td className="px-6 py-4 text-neutral-600">{prov.phone} • {prov.email}</td>
                  <td className="px-6 py-4 text-center font-bold text-primary">{prov.totalSpent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL IA: AUTO-ALTA DE PROVEÏDORS I LECTURA D'ALBARANS */}
      {showAIModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                <Bot className="text-emerald-600" size={24} />
                Lector de Tickets/Factures i Auto-Alta de Proveïdors per IA
              </h3>
              <button onClick={() => setShowAIModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X size={20} />
              </button>
            </div>

            {/* STEP 1: CHOOSE TEST SCENARIO */}
            {aiStep === 1 && (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center gap-4 py-8 border-2 border-dashed border-neutral-300 rounded-2xl bg-neutral-50/50 hover:bg-neutral-100/50 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAiInvoiceFile(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center">
                    <FileUp size={28} />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm text-neutral-900">
                      {aiInvoiceFile ? aiInvoiceFile.name : 'Carrega el ticket, albarà o factura'}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">L'IA extreu productes, preus i dona d'alta el proveïdor si és nou.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => startAIAudit('NEW_SUPPLIER')}
                    className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl text-xs font-bold hover:from-emerald-700 hover:to-teal-800 transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <UserPlus size={18} /> Provar Ticket Proveïdor Nou (Auto-Alta)
                  </button>
                  <button
                    onClick={() => startAIAudit('EXISTING_SUPPLIER')}
                    className="flex-1 py-3 bg-neutral-800 text-white rounded-xl text-xs font-bold hover:bg-neutral-900 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16} /> Provar Factura Proveïdor Existent
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PROCESSING */}
            {aiStep === 2 && (
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <Loader2 className="animate-spin text-emerald-600" size={48} />
                <div>
                  <h4 className="font-bold text-base text-neutral-900">Llegint Document amb l'IA d'OpenRouter...</h4>
                  <p className="text-xs text-neutral-500 mt-1">Buscant si el proveïdor ja existeix a la base de dades o extreient dades de contacte per donar-lo d'alta.</p>
                </div>
              </div>
            )}

            {/* STEP 3: RESULTS & AUTO-SUPPLIER REGISTRATION DISPLAY */}
            {aiStep === 3 && aiAuditResult && (
              <div className="space-y-5">
                
                {/* SPECIAL BADGE FOR NEW SUPPLIER AUTOMATIC REGISTRATION */}
                {aiAuditResult.isNewSupplier && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-4 space-y-2 shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                      <UserPlus size={20} className="text-emerald-600 animate-pulse" />
                      ✨ NOU PROVEÏDOR DETECTAT I CREAT AUTOMÀTICAMENT PER LA IA
                    </div>
                    <p className="text-xs text-emerald-800">
                      Aquest proveïdor no existia a la teva base de dades. La IA ha extret directament de la factura totes les dades fiscals i de contacte per donar-lo d'alta:
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white/80 p-3 rounded-xl border border-emerald-200 text-xs">
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Nom Fiscal</span>
                        <span className="font-bold text-neutral-900">{aiAuditResult.supplier.name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-semibold block">NIF / CIF</span>
                        <span className="font-mono font-bold text-primary">{aiAuditResult.supplier.nif}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Telèfon Directe</span>
                        <span className="font-bold text-neutral-800">{aiAuditResult.supplier.phone}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Email Contacte</span>
                        <span className="font-bold text-neutral-800">{aiAuditResult.supplier.email}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Adreça Fiscal</span>
                        <span className="font-medium text-neutral-700">{aiAuditResult.supplier.address}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Document Summary Card */}
                <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-neutral-500 uppercase block">{aiAuditResult.docType}</span>
                    <span className="text-base font-bold text-neutral-900">{aiAuditResult.supplier.name}</span>
                    <span className="text-xs text-neutral-500 block">Doc #{aiAuditResult.docNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase block">Import Total</span>
                    <span className="text-xl font-bold text-emerald-700">{aiAuditResult.totalAmount.toFixed(2)} €</span>
                  </div>
                </div>

                {/* Extracted Products List */}
                <div>
                  <h5 className="font-bold text-xs uppercase text-neutral-500 mb-2">Productes / Materials Extrets</h5>
                  <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-200 text-xs">
                    {aiAuditResult.items.map((item: any, idx: number) => (
                      <div key={idx} className="p-3 flex items-center justify-between bg-white">
                        <div>
                          <span className="font-bold text-neutral-900 block">{item.name}</span>
                          <span className="text-[10px] text-neutral-500">Codi: {item.code} • Quantitat a afegir: +{item.qty} {item.unit}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-neutral-900 block">{item.total.toFixed(2)} €</span>
                          <span className="text-[10px] text-neutral-500">{item.unitPrice.toFixed(2)} € / {item.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirm Action Button */}
                <button
                  onClick={applyAIAuditToDatabase}
                  className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  {aiAuditResult.isNewSupplier 
                    ? 'Confirmar: Donar d\'Alta Proveïdor i Carregar Mercaderia' 
                    : 'Confirmar i Actualitzar Magatzem'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: DONAR D'ALTA MANUAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2"><Plus className="text-primary" size={20} /> Donar d'Alta</h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-neutral-700"><X size={20} /></button>
            </div>
            <p className="text-xs text-neutral-500 mb-4">Pots utilitzar l'escàner IA per fer aquesta gestió automàticament des d'un ticket o factura!</p>
            <button onClick={() => setShowAddModal(false)} className="w-full py-3 bg-neutral-900 text-white font-semibold text-xs rounded-xl">Tancar</button>
          </div>
        </div>
      )}
    </div>
  );
}
