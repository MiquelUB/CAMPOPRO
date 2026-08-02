'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, PenTool, Truck, Building2, Plus, Search, AlertTriangle, CheckCircle2, Trash2, X, History, ExternalLink, Phone, Mail, User, ShieldCheck, Wrench, Calendar, Gauge, FileText, CreditCard, Percent, DollarSign, Bot, Sparkles, Upload, FileUp, Loader2, ArrowRight } from 'lucide-react';

export default function MagatzemDashboard() {
  const [activeTab, setActiveTab] = useState<'materials' | 'eines' | 'vehicles' | 'proveidors'>('materials');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // AI Invoice Reader Modal State
  const [showAIModal, setShowAIModal] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiStep, setAiStep] = useState<number>(1); // 1: Upload, 2: Analyzing, 3: Review Results
  const [aiInvoiceFile, setAiInvoiceFile] = useState<File | null>(null);
  const [aiScanResult, setAiScanResult] = useState<any | null>(null);

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
      lastOilChangeDate: '2026-03-10',
      lastOilChangeCounter: 120000,
      mechanicName: 'Taller Mecànic Pons & Fills',
      mechanicContact: '938 11 22 33 (Pere Pons)',
      status: 'OK',
      maintenanceHistory: [
        { id: 'vh1', date: '10/03/2026', counter: '120.000 Km', service: 'Canvi d\'oli 5W30, filtre d\'oli i filtre d\'aire', mechanic: 'Taller Mecànic Pons & Fills', cost: '185,00 €' }
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
      insuranceCompany: 'Catalana Occident',
      insurancePolicy: 'POL-44102-TR',
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
      supplierHistory: [
        { id: 'sp1', date: '12/04/2026', concept: 'Tub PE 25mm High-Density (100m)', amount: '450,00 €' },
        { id: 'sp2', date: '02/02/2026', concept: 'Tub PE 25mm High-Density (50m)', amount: '225,00 €' }
      ]
    },
    { 
      id: 'p2', 
      nif: 'A08112233', 
      name: 'RiegoRegen Cat', 
      contact: 'Laura Mas', 
      phone: '938 44 55 66', 
      email: 'laura@riegoregen.cat', 
      address: 'Av. del Reg 88, Granollers', 
      products: 'Vàlvules, Electrovàlvules, Solenoides',
      discount: '10%',
      paymentMethod: 'Gir Domiciliat a 60 dies',
      totalSpentNumeric: 890.00,
      totalSpent: '890,00 €',
      supplierHistory: [
        { id: 'sp4', date: '20/03/2026', concept: 'Vàlvula d\'Esfera 1" Inox (10u)', amount: '182,00 €' }
      ]
    },
    { 
      id: 'p3', 
      nif: 'B66778899', 
      name: 'Fertilitzants del Segre SA', 
      contact: 'Joan Carles Valls', 
      phone: '973 55 66 77', 
      email: 'comercial@fertisegre.cat', 
      address: 'Ctra. de Balaguer km 4, Lleida', 
      products: 'Adobs, Fertilitzants, Fitosanitaris',
      discount: '12%',
      paymentMethod: 'Transferència a 45 dies',
      totalSpentNumeric: 2340.00,
      totalSpent: '2.340,00 €',
      supplierHistory: []
    },
    { 
      id: 'p4', 
      nif: 'B08991122', 
      name: 'Subministraments Industrials Manresa', 
      contact: 'Ricard Torres', 
      phone: '938 77 88 99', 
      email: 'ricard@submanresa.cat', 
      address: 'C/ Sallent 12, Manresa', 
      products: 'Eines, Cinta Teflon, Cargoleria',
      discount: '8%',
      paymentMethod: 'Comptat / Targeta',
      totalSpentNumeric: 620.00,
      totalSpent: '620,00 €',
      supplierHistory: []
    },
  ]);

  // Form States for Donar d'Alta
  const [newMat, setNewMat] = useState({ name: '', code: '', stock: '', minStock: '', unit: 'u', location: '', supplier: '', unitPrice: '' });
  const [newEin, setNewEin] = useState({ name: '', brand: '', serial: '', status: 'BO', assignedTo: 'Magatzem Central', location: 'Magatzem Central', warrantyUntil: '', supplier: '' });
  const [newVeh, setNewVeh] = useState({ plate: '', name: '', type: 'Furgoneta', unitType: 'Km', counterValue: '', itvDate: '', insuranceCompany: '', insurancePolicy: '', insuranceDate: '', lastOilChangeDate: '', lastOilChangeCounter: '', mechanicName: '', mechanicContact: '' });
  const [newProv, setNewProv] = useState({ name: '', nif: '', contact: '', phone: '', email: '', address: '', products: '', discount: '', paymentMethod: '' });

  // AI Invoice Scanner Execution Handler
  const startAIScan = () => {
    setIsAiProcessing(true);
    setAiStep(2);

    // Simulate OpenRouter JSON Vision OCR pipeline (Gemini 2.5 Flash / Vision OCR)
    setTimeout(() => {
      const extractedData = {
        invoiceNumber: 'ALB-2026-9941',
        invoiceDate: new Date().toLocaleDateString('ca-ES'),
        supplier: {
          name: 'AgroSubministres Ponent SL',
          nif: 'B25889911',
          discount: '15%'
        },
        totalInvoiceAmount: 540.00,
        itemsExtracted: [
          {
            name: 'Tub PE 25mm High-Density',
            code: 'MAT-001',
            qtyAdded: 80,
            unit: 'm',
            unitPrice: 4.50,
            lineTotal: 360.00,
            isNew: false
          },
          {
            name: 'Vàlvula de Retenció 2" Inox',
            code: 'MAT-009',
            qtyAdded: 5,
            unit: 'u',
            unitPrice: 36.00,
            lineTotal: 180.00,
            isNew: true
          }
        ]
      };

      setAiScanResult(extractedData);
      setIsAiProcessing(false);
      setAiStep(3);
    }, 2200);
  };

  // Confirm AI Extraction & Automatically Apply to Inventory and Supplier Database
  const applyAIScanToDatabase = () => {
    if (!aiScanResult) return;

    // 1. Update/Add Materials in inventory
    let updatedMaterials = [...materials];

    aiScanResult.itemsExtracted.forEach((item: any) => {
      const existingIdx = updatedMaterials.findIndex(m => m.name.toLowerCase() === item.name.toLowerCase() || m.code === item.code);

      if (existingIdx >= 0) {
        // Update existing stock
        updatedMaterials[existingIdx] = {
          ...updatedMaterials[existingIdx],
          stock: updatedMaterials[existingIdx].stock + item.qtyAdded,
          unitPrice: item.unitPrice,
          lastPurchaseDate: aiScanResult.invoiceDate,
          purchaseHistory: [
            {
              id: `h${Date.now()}-${Math.random()}`,
              date: aiScanResult.invoiceDate,
              qty: `+${item.qtyAdded} ${item.unit}`,
              price: `${item.lineTotal.toFixed(2)} €`,
              supplier: aiScanResult.supplier.name,
              buyer: 'IA Albarà Auto-Reader'
            },
            ...updatedMaterials[existingIdx].purchaseHistory
          ]
        };
      } else {
        // Create new product automatically
        updatedMaterials.unshift({
          id: `m${Date.now()}-${Math.random()}`,
          code: item.code,
          name: item.name,
          stock: item.qtyAdded,
          minStock: 5,
          unit: item.unit,
          location: 'Magatzem Central (Rebut IA)',
          supplier: aiScanResult.supplier.name,
          unitPrice: item.unitPrice,
          lastPurchaseDate: aiScanResult.invoiceDate,
          purchaseHistory: [
            {
              id: `h${Date.now()}`,
              date: aiScanResult.invoiceDate,
              qty: `+${item.qtyAdded} ${item.unit}`,
              price: `${item.lineTotal.toFixed(2)} €`,
              supplier: aiScanResult.supplier.name,
              buyer: 'IA Albarà Auto-Reader'
            }
          ]
        });
      }
    });

    setMaterials(updatedMaterials);

    // 2. Update Supplier Total Spent & Purchase Log
    const updatedProveidors = proveidors.map((p) => {
      if (p.name.toLowerCase().includes(aiScanResult.supplier.name.toLowerCase()) || p.nif === aiScanResult.supplier.nif) {
        const newTotal = (p.totalSpentNumeric || 1450) + aiScanResult.totalInvoiceAmount;
        return {
          ...p,
          totalSpentNumeric: newTotal,
          totalSpent: `${newTotal.toLocaleString('ca-ES', { minimumFractionDigits: 2 })} €`,
          supplierHistory: [
            {
              id: `sp-${Date.now()}`,
              date: aiScanResult.invoiceDate,
              concept: `Albarà #${aiScanResult.invoiceNumber} (${aiScanResult.itemsExtracted.length} productes)`,
              amount: `${aiScanResult.totalInvoiceAmount.toFixed(2)} €`
            },
            ...p.supplierHistory
          ]
        };
      }
      return p;
    });

    setProveidors(updatedProveidors);

    // Reset and close
    setShowAIModal(false);
    setAiStep(1);
    setAiInvoiceFile(null);
    setAiScanResult(null);
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
      insuranceCompany: newVeh.insuranceCompany.trim() || 'Mapfre Assegurances',
      insurancePolicy: newVeh.insurancePolicy.trim() || 'POL-998800',
      insuranceDate: newVeh.insuranceDate || '2027-01-01',
      lastOilChangeDate: newVeh.lastOilChangeDate || new Date().toLocaleDateString('ca-ES'),
      lastOilChangeCounter: Number(newVeh.lastOilChangeCounter) || Number(newVeh.counterValue) || 0,
      mechanicName: newVeh.mechanicName || 'Taller Mecànic Pons & Fills',
      mechanicContact: newVeh.mechanicContact || '938 11 22 33',
      status: 'OK',
      maintenanceHistory: []
    };

    setVehicles([item, ...vehicles]);
    setNewVeh({ plate: '', name: '', type: 'Furgoneta', unitType: 'Km', counterValue: '', itvDate: '', insuranceCompany: '', insurancePolicy: '', insuranceDate: '', lastOilChangeDate: '', lastOilChangeCounter: '', mechanicName: '', mechanicContact: '' });
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
  const filteredProveidors = proveidors.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.nif.toLowerCase().includes(searchTerm.toLowerCase()));

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
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            Control de Magatzem i Flota
            <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
              <Sparkles size={12} /> Assistència IA Activa
            </span>
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Llegiu albarans automàticament amb la IA d'OpenRouter, actualitzeu stocks i controleu despeses.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* AI Invoice Button */}
          <button
            onClick={() => {
              setShowAIModal(true);
              setAiStep(1);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-700 hover:to-teal-800 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
          >
            <Bot size={18} />
            Escanejar Albarà amb IA
          </button>

          {/* Standard Manual Add Button */}
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
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Matrícula</th>
                <th className="px-6 py-4">Vehicle / Maquinària</th>
                <th className="px-6 py-4">Tipus</th>
                <th className="px-6 py-4 text-center">Comptador</th>
                <th className="px-6 py-4">Asseguradora i Pòlissa</th>
                <th className="px-6 py-4">Renovació Assegurança</th>
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
                  <td className="px-6 py-4 text-neutral-800">
                    <span className="font-bold block text-neutral-900">{item.insuranceCompany}</span>
                    <span className="text-xs font-mono text-neutral-500">Pòlissa: {item.insurancePolicy}</span>
                  </td>
                  <td className="px-6 py-4 text-neutral-700 font-medium">
                    <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full text-xs border border-emerald-200">
                      <ShieldCheck size={14} /> {item.insuranceDate}
                    </span>
                  </td>
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
                <th className="px-6 py-4">Descompte Acordat</th>
                <th className="px-6 py-4">Forma de Pagament</th>
                <th className="px-6 py-4 text-center">Despesa Total (€)</th>
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
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-bold text-xs px-2.5 py-1 rounded-full">
                      <Percent size={12} /> {prov.discount} Descompte
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-700 font-medium">{prov.paymentMethod}</td>
                  <td className="px-6 py-4 text-center font-bold text-primary text-base">{prov.totalSpent}</td>
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

      {/* MODAL IA: AUTO-LECTOR D'ALBARANS I FACTURES (OPENROUTER VISION OCR) */}
      {showAIModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                <Bot className="text-emerald-600" size={24} />
                Lector de Factures i Albarans per IA (OpenRouter)
              </h3>
              <button onClick={() => setShowAIModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X size={20} />
              </button>
            </div>

            {/* STEP 1: UPLOAD FILE */}
            {aiStep === 1 && (
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
                    {aiInvoiceFile ? aiInvoiceFile.name : 'Arrossega o selecciona la foto de l\'albarà / factura'}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">Accepta fotos (.jpg, .png) o documents PDF de la compra</p>
                </div>

                <button
                  onClick={startAIScan}
                  className="mt-2 flex items-center gap-2 bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-emerald-700 transition-all active:scale-95"
                >
                  <Sparkles size={18} />
                  Analitzar Document amb IA (Gemini 2.5 Flash)
                </button>
              </div>
            )}

            {/* STEP 2: ANALYZING WITH IA */}
            {aiStep === 2 && (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="animate-spin text-emerald-600" size={48} />
                <div className="text-center">
                  <h4 className="font-bold text-base text-neutral-900">Analitzant l'Albarà amb l'IA d'OpenRouter...</h4>
                  <p className="text-xs text-neutral-500 mt-1">Llegint capçalera de proveïdor, preus unitaris, quantitats i total de factura.</p>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW RESULTS & APPLY TO INVENTORY */}
            {aiStep === 3 && aiScanResult && (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase block">Proveïdor Detectat</span>
                    <span className="text-base font-bold text-neutral-900">{aiScanResult.supplier.name}</span>
                    <span className="text-xs text-neutral-500 block">NIF: {aiScanResult.supplier.nif} • Albarà #{aiScanResult.invoiceNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-800 uppercase block">Import Total Albarà</span>
                    <span className="text-xl font-bold text-emerald-900">{aiScanResult.totalInvoiceAmount.toFixed(2)} €</span>
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-xs uppercase text-neutral-500 mb-2">Productes / Materials Extrets de l'Albarà</h5>
                  <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-200 text-xs">
                    {aiScanResult.itemsExtracted.map((item: any, idx: number) => (
                      <div key={idx} className="p-3 flex items-center justify-between bg-white hover:bg-neutral-50">
                        <div>
                          <span className="font-bold text-neutral-900 block">{item.name}</span>
                          <span className="text-[10px] text-neutral-500">Codi: {item.code} • Quantitat a sumar: +{item.qtyAdded} {item.unit}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-neutral-900 block">{item.lineTotal.toFixed(2)} €</span>
                          <span className="text-[10px] text-neutral-500">{item.unitPrice.toFixed(2)} € / {item.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-800">
                  ⚡ <strong>Acció automàtica:</strong> En confirmar, la IA sumarà l'estoc als materials corresponents, actualitzarà el preu d'adquisició i sumarà <strong>{aiScanResult.totalInvoiceAmount.toFixed(2)} €</strong> a la despesa del proveïdor <strong>{aiScanResult.supplier.name}</strong>.
                </div>

                <button
                  onClick={applyAIScanToDatabase}
                  className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  Confirmar i Actualitzar Magatzem Automàticament
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DETALL GENERAL (FITXES TÈCNIQUES) */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* FITXA MATERIAL */}
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
                  <History size={16} className="text-primary" /> Històric de Compres i Entrades
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
                          <td className="p-3 font-bold text-emerald-700">{h.qty}</td>
                          <td className="p-3 font-bold text-neutral-900">{h.price}</td>
                          <td className="p-3 text-neutral-700">{h.supplier}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FITXA PROVEÏDOR */}
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

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 mb-6">
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Descompte Acordat</span>
                    <span className="text-sm font-bold text-amber-800 flex items-center gap-1 mt-1">
                      <Percent size={14} /> {selectedItem.data.discount} Descompte
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Forma de Pagament</span>
                    <span className="text-xs font-bold text-neutral-800 block mt-1">{selectedItem.data.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Despesa Total Acumulada</span>
                    <span className="text-base font-bold text-primary block mt-1">{selectedItem.data.totalSpent}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Persona de Contacte</span>
                    <span className="text-xs font-bold text-neutral-900 block mt-1">{selectedItem.data.contact}</span>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2 mb-3">
                  <History size={16} className="text-primary" /> Històric de Compres al Proveïdor
                </h4>
                <div className="border border-neutral-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-100 text-neutral-600 font-semibold uppercase">
                      <tr>
                        <th className="p-3">Data</th>
                        <th className="p-3">Concepte / Producte</th>
                        <th className="p-3 font-right">Import Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {selectedItem.data.supplierHistory && selectedItem.data.supplierHistory.length > 0 ? (
                        selectedItem.data.supplierHistory.map((sp: any) => (
                          <tr key={sp.id} className="hover:bg-neutral-50">
                            <td className="p-3 font-semibold text-neutral-900">{sp.date}</td>
                            <td className="p-3 font-medium text-neutral-800">{sp.concept}</td>
                            <td className="p-3 font-bold text-primary">{sp.amount}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="p-4 text-center text-neutral-400">Cap compra registrada encara.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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

      {/* MODAL: DONAR D'ALTA MANUAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                <Plus className="text-primary" size={20} />
                Donar d'Alta
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X size={20} />
              </button>
            </div>

            {/* FORM MATERIALS */}
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

            {/* FORM PROVEÏDORS */}
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
