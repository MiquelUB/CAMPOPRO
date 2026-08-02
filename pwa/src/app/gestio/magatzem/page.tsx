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
  const [aiStep, setAiStep] = useState<number>(1);
  const [aiInvoiceFile, setAiInvoiceFile] = useState<File | null>(null);
  const [aiAuditResult, setAiAuditResult] = useState<any | null>(null);

  // Selected Detail Modal State (For full transparent data access across all tabs)
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
        { id: 'h2', date: '02/02/2026', qty: '50m', price: '225,00 €', supplier: 'AgroSubministres Ponent SL', buyer: 'Marc (Enginyer)' }
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
    { 
      id: 'v3', 
      plate: '3341-KLM', 
      name: 'Toyota Hilux 4x4', 
      type: 'Pickup 4x4', 
      unitType: 'Km', 
      counterValue: 88900, 
      itvDate: '2027-02-01', 
      insuranceCompany: 'AXA Assegurances',
      insurancePolicy: 'POL-77112-PX',
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
      supplierHistory: [
        { id: 'sp6', date: '18/02/2026', concept: 'Adobat Foliar Nitrogenat 25kg (20 sacs)', amount: '650,00 €' }
      ]
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
      supplierHistory: [
        { id: 'sp8', date: '05/05/2026', concept: 'Cinta de Teflon Professional (40u)', amount: '48,00 €' }
      ]
    },
  ]);

  // Form States for Donar d'Alta
  const [newMat, setNewMat] = useState({ name: '', code: '', stock: '', minStock: '', unit: 'u', location: '', supplier: '', unitPrice: '' });
  const [newEin, setNewEin] = useState({ name: '', brand: '', serial: '', status: 'BO', assignedTo: 'Magatzem Central', location: 'Magatzem Central', warrantyUntil: '', supplier: '' });
  const [newVeh, setNewVeh] = useState({ plate: '', name: '', type: 'Furgoneta', unitType: 'Km', counterValue: '', itvDate: '', insuranceCompany: '', insurancePolicy: '', insuranceDate: '', lastOilChangeDate: '', lastOilChangeCounter: '', mechanicName: '', mechanicContact: '' });
  const [newProv, setNewProv] = useState({ name: '', nif: '', contact: '', phone: '', email: '', address: '', products: '', discount: '', paymentMethod: '' });

  // AI Audit Engine Handler
  const startAIAudit = (scenario: 'EXISTING_SUPPLIER' | 'NEW_SUPPLIER') => {
    setIsAiProcessing(true);
    setAiStep(2);

    setTimeout(() => {
      if (scenario === 'NEW_SUPPLIER') {
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
            { name: 'Filtre de Malla 2" High-Pressure', code: 'MAT-015', qty: 2, unit: 'u', unitPrice: 82.50, total: 165.00 },
            { name: 'Cinta d\'Aïllament Vulcanitzada', code: 'MAT-016', qty: 10, unit: 'u', unitPrice: 12.00, total: 120.00 }
          ]
        });
      } else {
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
    }, 2200);
  };

  const applyAIAuditToDatabase = () => {
    if (!aiAuditResult) return;

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
            Control de Magatzem, Flota i Proveïdors
            <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
              <Sparkles size={12} /> IA & Transparència Total
            </span>
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Clica qualsevol fila per obrir la Fitxa Tècnica Completa. Utilitza l'IA per auditar albarans i crear proveïdors automàticament.</p>
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
            Escanejar Albarà/Factura amb IA
          </button>

          {/* Manual Add Button */}
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
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-500 font-semibold flex items-center justify-between">
            <span>💡 Clica qualsevol material per veure la Fitxa Tècnica Completa (Proveïdor, Preu, Històric de Compres).</span>
            <span className="text-primary font-bold">{filteredMaterials.length} materials trobats</span>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Codi</th>
                <th className="px-6 py-4">Nom del Material</th>
                <th className="px-6 py-4 text-center">Estoc Actual</th>
                <th className="px-6 py-4 text-center">Estoc Mínim</th>
                <th className="px-6 py-4">Ubicació</th>
                <th className="px-6 py-4">Proveïdor</th>
                <th className="px-6 py-4 text-center">Preu Unitari</th>
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
                    <td className="px-6 py-4 text-neutral-700 font-medium">{item.supplier}</td>
                    <td className="px-6 py-4 text-center font-bold text-primary">{item.unitPrice.toFixed(2)} €</td>
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
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-500 font-semibold flex items-center justify-between">
            <span>💡 Clica qualsevol eina per obrir la Fitxa Completa (Garantia, Proveïdor i Històric de Reparacions).</span>
            <span className="text-primary font-bold">{filteredEines.length} eines trobades</span>
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
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-500 font-semibold flex items-center justify-between">
            <span>💡 Clica qualsevol vehicle per veure la Fitxa de Flota (Pòlissa, Assegurança, ITV, Canvi d'Oli, Mecànic i Revisions).</span>
            <span className="text-primary font-bold">{filteredVehicles.length} vehicles trobats</span>
          </div>
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
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-500 font-semibold flex items-center justify-between">
            <span>💡 Clica qualsevol proveïdor per veure la Fitxa Comercial (NIF, Descomptes, Forma de Pagament i Històric de Compres).</span>
            <span className="text-primary font-bold">{filteredProveidors.length} proveïdors trobats</span>
          </div>
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

      {/* MODAL DETALL GENERAL TRANSPARENT (ACCÉS TOTAL A TOTES LES DADES A 1-CLICK) */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* 1. FITXA COMPLETA MATERIAL */}
            {selectedItem.type === 'material' && (
              <div>
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-neutral-100">
                  <div>
                    <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                      #{selectedItem.data.code}
                    </span>
                    <h3 className="text-xl font-bold text-neutral-900 mt-2">{selectedItem.data.name}</h3>
                    <p className="text-xs text-neutral-500">Ubicació al magatzem: {selectedItem.data.location}</p>
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
                  <History size={16} className="text-primary" /> Històric de Compres i Entrades d'Estoc
                </h4>
                <div className="border border-neutral-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-100 text-neutral-600 font-semibold uppercase">
                      <tr>
                        <th className="p-3">Data</th>
                        <th className="p-3">Quantitat</th>
                        <th className="p-3">Import</th>
                        <th className="p-3">Proveïdor</th>
                        <th className="p-3">Comprat per</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {selectedItem.data.purchaseHistory?.map((h: any) => (
                        <tr key={h.id} className="hover:bg-neutral-50">
                          <td className="p-3 font-semibold text-neutral-900">{h.date}</td>
                          <td className="p-3 font-bold text-emerald-700">{h.qty}</td>
                          <td className="p-3 font-bold text-neutral-900">{h.price}</td>
                          <td className="p-3 text-neutral-700">{h.supplier}</td>
                          <td className="p-3 text-neutral-500">{h.buyer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. FITXA COMPLETA EINA */}
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
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-1">
                      <ShieldCheck size={14} /> {selectedItem.data.warrantyUntil}
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
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Proveïdor</span>
                    <span className="text-xs font-bold text-neutral-800 truncate block mt-1">{selectedItem.data.supplier}</span>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2 mb-3">
                  <Wrench size={16} className="text-primary" /> Històric de Reparacions i Manteniments
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

            {/* 3. FITXA COMPLETA VEHICLE (AMB PÒLISSA, ASSEGURANÇA, ITV, OLI I MECÀNIC) */}
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
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Companyia Asseguradora</span>
                    <span className="text-xs font-bold text-primary block mt-1">{selectedItem.data.insuranceCompany}</span>
                    <span className="text-[10px] font-mono text-neutral-500">Pòlissa: {selectedItem.data.insurancePolicy}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Renovació Assegurança</span>
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 mt-1">
                      <ShieldCheck size={14} /> {selectedItem.data.insuranceDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Data Límit ITV</span>
                    <span className="text-xs font-bold text-neutral-900 flex items-center gap-1 mt-1">
                      <Calendar size={14} className="text-primary" /> {selectedItem.data.itvDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Mecànic Habitual</span>
                    <span className="text-xs font-bold text-neutral-900 block mt-1">{selectedItem.data.mechanicName}</span>
                    <span className="text-[10px] text-neutral-500">{selectedItem.data.mechanicContact}</span>
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
                      {selectedItem.data.maintenanceHistory?.map((m: any) => (
                        <tr key={m.id} className="hover:bg-neutral-50">
                          <td className="p-3 font-semibold text-neutral-900">{m.date}</td>
                          <td className="p-3 font-mono">{m.counter}</td>
                          <td className="p-3 font-medium text-neutral-800">{m.service}</td>
                          <td className="p-3 text-neutral-600">{m.mechanic}</td>
                          <td className="p-3 font-bold text-neutral-900">{m.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. FITXA COMPLETA PROVEÏDOR (NIF, DESCOMPTES, FORMA PAGAMENT, HISTÒRIC COMPRES) */}
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
                    <span className="text-xs font-bold text-neutral-900 block mt-1">{selectedItem.data.contact} ({selectedItem.data.phone})</span>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2 mb-3">
                  <History size={16} className="text-primary" /> Històric de Compres i Factures d'aquest Proveïdor
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

      {/* MODAL IA: AUDITORIA I AUTO-ALTA PROVEÏDORS */}
      {showAIModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                <Bot className="text-emerald-600" size={24} />
                Auditor IA d'Albarans vs Factures & Auto-Alta Proveïdors
              </h3>
              <button onClick={() => setShowAIModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X size={20} />
              </button>
            </div>

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
                    <p className="text-xs text-neutral-500 mt-1">Fotos (.jpg, .png) o documents PDF</p>
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
                    <Sparkles size={16} /> Provar Factura vs Albarà (Cross-Check Alert)
                  </button>
                </div>
              </div>
            )}

            {aiStep === 2 && (
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <Loader2 className="animate-spin text-emerald-600" size={48} />
                <div>
                  <h4 className="font-bold text-base text-neutral-900">Llegint Document amb l'IA d'OpenRouter...</h4>
                  <p className="text-xs text-neutral-500 mt-1">Buscant si el proveïdor ja existeix o contrastant preus unitaris contra l'albarà de lliurament.</p>
                </div>
              </div>
            )}

            {aiStep === 3 && aiAuditResult && (
              <div className="space-y-5">
                {aiAuditResult.isNewSupplier && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-4 space-y-2 shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                      <UserPlus size={20} className="text-emerald-600 animate-pulse" />
                      ✨ NOU PROVEÏDOR DETECTAT I CREAT AUTOMÀTICAMENT PER LA IA
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white/80 p-3 rounded-xl border border-emerald-200 text-xs">
                      <div><span className="text-[10px] text-neutral-500 block uppercase">Nom Fiscal</span><span className="font-bold text-neutral-900">{aiAuditResult.supplier.name}</span></div>
                      <div><span className="text-[10px] text-neutral-500 block uppercase">NIF / CIF</span><span className="font-mono font-bold text-primary">{aiAuditResult.supplier.nif}</span></div>
                      <div><span className="text-[10px] text-neutral-500 block uppercase">Telèfon</span><span className="font-bold text-neutral-800">{aiAuditResult.supplier.phone}</span></div>
                    </div>
                  </div>
                )}

                {aiAuditResult.hasDiscrepancy && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                      <ShieldAlert size={20} className="text-red-600 animate-bounce" />
                      ⚠️ ALERTES DE DISCREPÀNCIA FACTURA VS ALBARÀ
                    </div>
                    {aiAuditResult.discrepancies.map((disc: any, idx: number) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-red-200 text-xs flex justify-between items-center">
                        <div>
                          <span className="font-bold text-red-900 block">{disc.field}: {disc.item}</span>
                          <span className="text-neutral-500 block">🟢 Albarà: {disc.albaraValue}</span>
                          <span className="text-red-700 font-semibold block">🔴 Factura: {disc.facturaValue}</span>
                        </div>
                        <div className="font-bold text-red-800 bg-red-100 px-3 py-1.5 rounded-lg">{disc.impact}</div>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={applyAIAuditToDatabase} className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-emerald-700">
                  Confirmar i Actualitzar Magatzem Automàticament
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: DONAR D'ALTA MANUAL COMPLET */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                <Plus className="text-primary" size={20} />
                Donar d'Alta
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-neutral-700"><X size={20} /></button>
            </div>

            {activeTab === 'materials' && (
              <form onSubmit={handleAddMaterial} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Nom del Material</label>
                  <input type="text" required placeholder="Ex: Tub PE 25mm" value={newMat.name} onChange={(e) => setNewMat({ ...newMat, name: e.target.value })} className="w-full p-3 border rounded-xl text-sm" />
                </div>
                <button type="submit" className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold">Guardar Material</button>
              </form>
            )}

            {activeTab === 'proveidors' && (
              <form onSubmit={handleAddProveidor} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Nom Fiscal del Proveïdor</label>
                  <input type="text" required placeholder="Ex: AgroSubministres Ponent SL" value={newProv.name} onChange={(e) => setNewProv({ ...newProv, name: e.target.value })} className="w-full p-3 border rounded-xl text-sm" />
                </div>
                <button type="submit" className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold">Guardar Proveïdor</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
