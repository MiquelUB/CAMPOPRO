'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, PenTool, Truck, Building2, Plus, Search, AlertTriangle, CheckCircle2, Trash2, X, History, ExternalLink, Phone, Mail, User, ShieldCheck, Wrench, Calendar, Gauge, FileText, CreditCard, Percent, DollarSign, Bot, Sparkles, Upload, FileUp, Loader2, ArrowRight, ShieldAlert, FileCheck, RefreshCw } from 'lucide-react';

export default function MagatzemDashboard() {
  const [activeTab, setActiveTab] = useState<'materials' | 'eines' | 'vehicles' | 'proveidors'>('materials');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // AI Invoice Reader & Audit Engine State
  const [showAIModal, setShowAIModal] = useState(false);
  const [docTypeSelection, setDocTypeSelection] = useState<'AUTO' | 'ALBARA' | 'FACTURA'>('AUTO');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiStep, setAiStep] = useState<number>(1); // 1: Upload, 2: AI Audit & Cross-Checking, 3: Discrepancy Review
  const [aiInvoiceFile, setAiInvoiceFile] = useState<File | null>(null);
  const [aiAuditResult, setAiAuditResult] = useState<any | null>(null);

  // Selected Detail Modal State
  const [selectedItem, setSelectedItem] = useState<{ type: 'material' | 'eina' | 'vehicle' | 'proveidor'; data: any } | null>(null);

  // Database 1: Materials with Albarà reference
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

  // AI Document Audit Execution Handler (Differentiating Albarà vs Factura & Cross-Checking)
  const startAIAudit = (typeOverride?: 'ALBARA' | 'FACTURA') => {
    setIsAiProcessing(true);
    setAiStep(2);

    const chosenType = typeOverride || (docTypeSelection === 'AUTO' ? 'FACTURA' : docTypeSelection);

    setTimeout(() => {
      if (chosenType === 'ALBARA') {
        // Albarà Processing: Receives goods, updates stock cleanly
        setAiAuditResult({
          docType: 'ALBARÀ DE LLIURAMENT (RECEPTA FISICA)',
          docNumber: 'ALB-2026-8812',
          date: new Date().toLocaleDateString('ca-ES'),
          supplier: { name: 'AgroSubministres Ponent SL', nif: 'B25889911' },
          hasDiscrepancy: false,
          discrepancies: [],
          totalAmount: 450.00,
          items: [
            { name: 'Tub PE 25mm High-Density', code: 'MAT-001', qty: 100, unit: 'm', unitPrice: 4.50, total: 450.00 }
          ]
        });
      } else {
        // Factura Processing: Cross-checks against recorded Albarà / Database contract rates
        setAiAuditResult({
          docType: 'FACTURA COMERCIAL REBUDA',
          docNumber: 'FAC-2026-9901',
          matchedAlbara: 'ALB-2026-8812',
          date: new Date().toLocaleDateString('ca-ES'),
          supplier: { name: 'AgroSubministres Ponent SL', nif: 'B25889911', agreedDiscount: '15%' },
          hasDiscrepancy: true,
          totalAmount: 510.00, // Expected 450€ - discrepancy found!
          discrepancies: [
            {
              field: 'Preu Unitari',
              item: 'Tub PE 25mm High-Density',
              albaraValue: '4,50 € / m (Segons Albarà #ALB-2026-8812)',
              facturaValue: '4,90 € / m (Augment del +8,8%)',
              impact: '+40,00 € extra no pactats'
            },
            {
              field: 'Descompte Comercial',
              item: 'Descompte de Client',
              albaraValue: '15% Descompte Acordat',
              facturaValue: '10% Aplicat a la Factura',
              impact: '+20,00 € per falta de descompte'
            }
          ],
          items: [
            { name: 'Tub PE 25mm High-Density', code: 'MAT-001', qty: 100, unit: 'm', unitPrice: 4.90, total: 490.00 },
            { name: 'Despeses d\'Enviament no previstes', code: 'SRV-001', qty: 1, unit: 'u', unitPrice: 20.00, total: 20.00 }
          ]
        });
      }

      setIsAiProcessing(false);
      setAiStep(3);
    }, 2400);
  };

  // Confirm Audit Results
  const applyAIAuditToDatabase = () => {
    if (!aiAuditResult) return;

    if (aiAuditResult.docType.includes('ALBARÀ')) {
      // Add stock cleanly
      const updatedMaterials = materials.map(m => {
        if (m.code === 'MAT-001') {
          return {
            ...m,
            stock: m.stock + 100,
            lastPurchaseDate: aiAuditResult.date,
            purchaseHistory: [
              { id: `h-${Date.now()}`, date: aiAuditResult.date, qty: '+100m', price: '450,00 €', supplier: 'AgroSubministres Ponent SL', buyer: 'IA Albarà Auto-Reader' },
              ...m.purchaseHistory
            ]
          };
        }
        return m;
      });
      setMaterials(updatedMaterials);
    } else {
      // Factura: Update Supplier total spent
      const updatedProveidors = proveidors.map(p => {
        if (p.nif === 'B25889911') {
          const newTotal = p.totalSpentNumeric + aiAuditResult.totalAmount;
          return {
            ...p,
            totalSpentNumeric: newTotal,
            totalSpent: `${newTotal.toLocaleString('ca-ES', { minimumFractionDigits: 2 })} €`,
            supplierHistory: [
              { id: `sp-${Date.now()}`, date: aiAuditResult.date, concept: `Factura Auditada #${aiAuditResult.docNumber} (Alertes resoltes)`, amount: `${aiAuditResult.totalAmount.toFixed(2)} €` },
              ...p.supplierHistory
            ]
          };
        }
        return p;
      });
      setProveidors(updatedProveidors);
    }

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
        <span className="text-primary font-semibold">Magatzem, Flota i Auditoria IA</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            Magatzem i Auditoria Intel·ligent d'Albarans/Factures
            <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
              <Sparkles size={12} /> Audit IA Activa
            </span>
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Diferencieu entre albarans i factures, i detecteu automàticament qualsevol canvi de preu o quantitat no pactada.</p>
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
            Auditar Albarà / Factura amb IA
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
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 size={14} /> OK
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={(e) => deleteMaterial(item.id, e)} className="p-2 text-neutral-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: EINES */}
      {activeTab === 'eines' && (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Codi Inventari</th>
                <th className="px-6 py-4">Eina / Maquinària</th>
                <th className="px-6 py-4">Marca / Model</th>
                <th className="px-6 py-4">Assignat a</th>
                <th className="px-6 py-4">Garantia Fins</th>
                <th className="px-6 py-4 text-center">Estat Físic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredEines.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-neutral-500">{item.code}</td>
                  <td className="px-6 py-4 font-semibold text-neutral-900">{item.name}</td>
                  <td className="px-6 py-4 text-neutral-600">{item.brand}</td>
                  <td className="px-6 py-4 text-neutral-800">{item.assignedTo}</td>
                  <td className="px-6 py-4 text-neutral-600">{item.warrantyUntil}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">🟢 Operatiu</span>
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
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Matrícula</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Comptador</th>
                <th className="px-6 py-4">Asseguradora i Pòlissa</th>
                <th className="px-6 py-4">Renovació</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredVehicles.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 font-mono font-bold text-primary">{item.plate}</td>
                  <td className="px-6 py-4 font-semibold text-neutral-900">{item.name}</td>
                  <td className="px-6 py-4 font-bold text-neutral-900">{item.counterValue.toLocaleString('ca-ES')} {item.unitType}</td>
                  <td className="px-6 py-4 text-neutral-800">
                    <span className="font-bold block">{item.insuranceCompany}</span>
                    <span className="text-xs font-mono text-neutral-500">{item.insurancePolicy}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-emerald-800">{item.insuranceDate}</td>
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
                <th className="px-6 py-4">Descompte Acordat</th>
                <th className="px-6 py-4">Forma Pagament</th>
                <th className="px-6 py-4 text-center">Despesa Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredProveidors.map((prov) => (
                <tr key={prov.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 font-bold text-neutral-900">{prov.name}</td>
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-neutral-500">{prov.nif}</td>
                  <td className="px-6 py-4 font-bold text-amber-800">{prov.discount}</td>
                  <td className="px-6 py-4 font-medium text-neutral-700">{prov.paymentMethod}</td>
                  <td className="px-6 py-4 text-center font-bold text-primary">{prov.totalSpent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL IA: AUDITORIA I CONTRASTACIÓ D'ALBARANS VS FACTURES */}
      {showAIModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                <Bot className="text-emerald-600" size={24} />
                Auditor IA d'Albarans vs Factures (OpenRouter Vision)
              </h3>
              <button onClick={() => setShowAIModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X size={20} />
              </button>
            </div>

            {/* STEP 1: UPLOAD FILE & SELECT DOCUMENT TYPE */}
            {aiStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-2">1. Tipus de Document a Carregar</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setDocTypeSelection('AUTO')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        docTypeSelection === 'AUTO' ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                      }`}
                    >
                      🤖 Auto-Detecció IA
                    </button>
                    <button
                      onClick={() => setDocTypeSelection('ALBARA')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        docTypeSelection === 'ALBARA' ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                      }`}
                    >
                      📦 Albarà de Lliurament
                    </button>
                    <button
                      onClick={() => setDocTypeSelection('FACTURA')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        docTypeSelection === 'FACTURA' ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                      }`}
                    >
                      🧾 Factura Comercial
                    </button>
                  </div>
                </div>

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
                      {aiInvoiceFile ? aiInvoiceFile.name : 'Carrega o solta el document aquí'}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">Fotos (.jpg, .png) o documents PDF d'albarans o factures</p>
                  </div>
                </div>

                {/* Quick Simulation Buttons to Test Both Flows */}
                <div className="flex gap-3">
                  <button
                    onClick={() => startAIAudit('ALBARA')}
                    className="flex-1 py-3 bg-neutral-800 text-white rounded-xl text-xs font-bold hover:bg-neutral-900 transition-all flex items-center justify-center gap-2"
                  >
                    <Package size={16} /> Provar Lectura d'Albarà
                  </button>
                  <button
                    onClick={() => startAIAudit('FACTURA')}
                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <Sparkles size={16} /> Provar Auditoria de Factura vs Albarà
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: AUDITING & CROSS-CHECKING */}
            {aiStep === 2 && (
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <Loader2 className="animate-spin text-emerald-600" size={48} />
                <div>
                  <h4 className="font-bold text-base text-neutral-900">Auditant Document i Contrastant amb la Base de Dades...</h4>
                  <p className="text-xs text-neutral-500 mt-1">La IA està creuant els preus unitaris, quantitats entregades a l'albarà i els descomptes pactats amb la factura.</p>
                </div>
              </div>
            )}

            {/* STEP 3: DISCREPANCY & AUDIT REVIEW */}
            {aiStep === 3 && aiAuditResult && (
              <div className="space-y-5">
                {/* Header Summary Badge */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                  aiAuditResult.hasDiscrepancy 
                    ? 'bg-red-50 border-red-200 text-red-900' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80">{aiAuditResult.docType}</span>
                    <span className="text-base font-bold block">{aiAuditResult.supplier.name}</span>
                    <span className="text-xs opacity-75 font-mono">Doc #{aiAuditResult.docNumber} {aiAuditResult.matchedAlbara && `• Contrastat amb Albarà #${aiAuditResult.matchedAlbara}`}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80">Import Document</span>
                    <span className="text-xl font-bold">{aiAuditResult.totalAmount.toFixed(2)} €</span>
                  </div>
                </div>

                {/* DISCREPANCY ALERTS (IF FACTURA DOES NOT MATCH ALBARÀ) */}
                {aiAuditResult.hasDiscrepancy && (
                  <div className="bg-red-50/80 border border-red-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                      <ShieldAlert size={20} className="text-red-600 animate-bounce" />
                      ⚠️ ALERTES DE DISCREPÀNCIA I DIVERGÈNCIA EN FACTURA
                    </div>
                    <p className="text-xs text-red-700">
                      La IA d'OpenRouter ha creuat aquesta factura amb l'albarà de lliurament registrat <strong>#{aiAuditResult.matchedAlbara}</strong> i ha trobat les següents divergències de preu/quantitat:
                    </p>

                    <div className="space-y-2">
                      {aiAuditResult.discrepancies.map((disc: any, idx: number) => (
                        <div key={idx} className="bg-white p-3 rounded-xl border border-red-200 text-xs flex justify-between items-center shadow-sm">
                          <div>
                            <span className="font-bold text-red-900 block">{disc.field}: {disc.item}</span>
                            <span className="text-neutral-500 block">🟢 Albarà Pactat: {disc.albaraValue}</span>
                            <span className="text-red-700 font-semibold block">🔴 Facturat real: {disc.facturaValue}</span>
                          </div>
                          <div className="text-right font-bold text-red-800 bg-red-100 px-3 py-1.5 rounded-lg border border-red-200">
                            {disc.impact}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* NO DISCREPANCY / ALBARA CLEAN BADGE */}
                {!aiAuditResult.hasDiscrepancy && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800">
                    <FileCheck size={24} className="text-emerald-600" />
                    <div className="text-xs">
                      <span className="font-bold block text-sm"> Tot correcte! Albarà de Lliurament validat.</span>
                      Tots els materials i preus coincideixen exactament. Es pot afegir l'estoc al magatzem de forma segura.
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setAiStep(1);
                      setAiAuditResult(null);
                    }}
                    className="flex-1 py-3 border border-neutral-200 rounded-xl text-xs font-semibold hover:bg-neutral-50"
                  >
                    Re-escanejar un altre document
                  </button>

                  <button
                    onClick={applyAIAuditToDatabase}
                    className={`flex-1 py-3.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 ${
                      aiAuditResult.hasDiscrepancy ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    <CheckCircle2 size={16} />
                    {aiAuditResult.hasDiscrepancy ? 'Aprovar Factura amb Alertes Registrades' : 'Confirmar i Actualitzar Magatzem'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DETALL MATERIAL */}
      {selectedItem && selectedItem.type === 'material' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-2xl border border-neutral-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">#{selectedItem.data.code}</span>
                <h3 className="text-lg font-bold text-neutral-900 mt-2">{selectedItem.data.name}</h3>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-neutral-400 hover:text-neutral-700"><X size={20} /></button>
            </div>
            <p className="text-xs text-neutral-600 mb-4">Estoc Actual: <strong>{selectedItem.data.stock} {selectedItem.data.unit}</strong> • Proveïdor: <strong>{selectedItem.data.supplier}</strong></p>
            <button onClick={() => setSelectedItem(null)} className="w-full py-2 bg-primary text-white rounded-xl text-xs font-semibold">Tancar</button>
          </div>
        </div>
      )}
    </div>
  );
}
