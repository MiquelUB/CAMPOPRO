'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, PenTool, Truck, Building2, Plus, Search, AlertTriangle, CheckCircle2, Trash2, X, History, ExternalLink, Phone, Mail, User, ShieldCheck, Wrench, Calendar, Gauge, FileText, CreditCard, Percent, DollarSign, Bot, Sparkles, Upload, FileUp, Loader2, ArrowRight, ShieldAlert, FileCheck, RefreshCw, UserPlus, Folder, ArrowDownRight, ArrowUpRight, ShoppingCart, Send, Copy, Check, Download, Eye, Filter, Tag } from 'lucide-react';

export default function MagatzemDashboard() {
  const [activeTab, setActiveTab] = useState<'materials' | 'eines' | 'vehicles' | 'proveidors'>('materials');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // AI Invoice Reader & Audit Engine State
  const [showAIModal, setShowAIModal] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiStep, setAiStep] = useState<number>(1);
  const [aiInvoiceFile, setAiInvoiceFile] = useState<File | null>(null);
  const [aiAuditResult, setAiAuditResult] = useState<any | null>(null);

  // AI Purchase Order Generator State
  const [showAIPOModal, setShowAIPOModal] = useState(false);
  const [selectedMaterialForPO, setSelectedMaterialForPO] = useState<any | null>(null);
  const [poQuantity, setPoQuantity] = useState<number>(50);
  const [poNotes, setPoNotes] = useState<string>('Lliurament urgent al magatzem central abans de divendres.');
  const [isGeneratingPO, setIsGeneratingPO] = useState(false);
  const [poDraftResult, setPoDraftResult] = useState<any | null>(null);
  const [copiedPO, setCopiedPO] = useState(false);

  // Supplier Purchase History Filters: Text Search & Date Filters
  const [supplierHistorySearch, setSupplierHistorySearch] = useState('');
  const [supplierDateFilterType, setSupplierDateFilterType] = useState<'ALL' | 'THIS_MONTH' | 'PREV_MONTH' | '2026' | '2025' | 'CUSTOM'>('ALL');
  const [supplierCustomDate, setSupplierCustomDate] = useState('');

  // Supplier Digitized Documents Modal State
  const [selectedSupplierDocs, setSelectedSupplierDocs] = useState<any | null>(null);
  const [previewingDoc, setPreviewingDoc] = useState<any | null>(null);

  // Selected Detail Modal State
  const [selectedItem, setSelectedItem] = useState<{ type: 'material' | 'eina' | 'vehicle' | 'proveidor'; data: any } | null>(null);

  // Helper function to thoroughly clean & display discount percentage without double % bugs
  const cleanDiscountDisplay = (val: string | number | undefined): string => {
    if (val === undefined || val === null || val === '') return '0%';
    const str = String(val).trim();
    const numericOnly = str.replace(/[^0-9.,]/g, '');
    if (!numericOnly) return '0%';
    return `${numericOnly}%`;
  };

  // Database 1: Materials (inclou Productes de Serveis/Tarifes Editables per a Pressupostos: Hora Operari, Hora Tractor, Transport, Desplaçament, Extra)
  const [materials, setMaterials] = useState([
    // Standard Physical Materials
    { 
      id: 'm1', 
      code: 'MAT-001', 
      name: 'Tub PE 25mm High-Density', 
      stockTotal: 150, 
      stockCheckedOut: 30, 
      stock: 120, 
      minStock: 20, 
      unit: 'm', 
      location: 'Prestatgeria A-1',
      supplier: 'AgroSubministres Ponent SL',
      unitPrice: 4.50,
      isService: false,
      lastPurchaseDate: '12/04/2026',
      workerMovementHistory: [
        { id: 'wm1', date: '02/08/2026 07:30', worker: 'Jordi Soler', action: 'SUBTRACTION', qty: '30m', status: 'EN_US_JORNADA' }
      ],
      purchaseHistory: [
        { id: 'h1', date: '12/04/2026', qty: '100m', price: '450,00 €', supplier: 'AgroSubministres Ponent SL', buyer: 'Marc (Enginyer)' }
      ]
    },
    { 
      id: 'm2', 
      code: 'MAT-002', 
      name: 'Vàlvula d\'Esfera 1" Inox', 
      stockTotal: 6,
      stockCheckedOut: 2,
      stock: 4, 
      minStock: 10, 
      unit: 'u', 
      location: 'Caixa B-4',
      supplier: 'RiegoRegen Cat',
      unitPrice: 18.20,
      isService: false,
      lastPurchaseDate: '20/03/2026',
      workerMovementHistory: [],
      purchaseHistory: [
        { id: 'h4', date: '20/03/2026', qty: '10u', price: '182,00 €', supplier: 'RiegoRegen Cat', buyer: 'Marc (Enginyer)' }
      ]
    },
    { 
      id: 'm4', 
      code: 'MAT-004', 
      name: 'Adobat Foliar Nitrogenat 25kg', 
      stockTotal: 2,
      stockCheckedOut: 0,
      stock: 2, 
      minStock: 15, 
      unit: 'sacs', 
      location: 'Palet N-3',
      supplier: 'Fertilitzants del Segre SA',
      unitPrice: 32.50,
      isService: false,
      lastPurchaseDate: '18/02/2026',
      workerMovementHistory: [],
      purchaseHistory: [
        { id: 'h7', date: '18/02/2026', qty: '20 sacs', price: '650,00 €', supplier: 'Fertilitzants del Segre SA', buyer: 'Miquel Riera' }
      ]
    },
    // Editable Service Tariff Articles for Real Budget Quote Calculation
    {
      id: 's1',
      code: 'SERV-001',
      name: 'Hora Operari / Mà d\'Obra Tècnica',
      stockTotal: 999,
      stockCheckedOut: 0,
      stock: 999,
      minStock: 0,
      unit: 'h',
      location: 'Tarifa Interna',
      supplier: 'CampoPro Serveis SL',
      unitPrice: 35.00,
      isService: true,
      lastPurchaseDate: 'Tarifa Activa',
      workerMovementHistory: [],
      purchaseHistory: []
    },
    {
      id: 's2',
      code: 'SERV-002',
      name: 'Hora Tractor / Maquinària Agrícola',
      stockTotal: 999,
      stockCheckedOut: 0,
      stock: 999,
      minStock: 0,
      unit: 'h',
      location: 'Tarifa Flota',
      supplier: 'CampoPro Serveis SL',
      unitPrice: 65.00,
      isService: true,
      lastPurchaseDate: 'Tarifa Activa',
      workerMovementHistory: [],
      purchaseHistory: []
    },
    {
      id: 's3',
      code: 'SERV-003',
      name: 'Transport de Material / Logística',
      stockTotal: 999,
      stockCheckedOut: 0,
      stock: 999,
      minStock: 0,
      unit: 'viatge',
      location: 'Tarifa Logística',
      supplier: 'CampoPro Serveis SL',
      unitPrice: 50.00,
      isService: true,
      lastPurchaseDate: 'Tarifa Activa',
      workerMovementHistory: [],
      purchaseHistory: []
    },
    {
      id: 's4',
      code: 'SERV-004',
      name: 'Desplaçament Tècnic d\'Emergència',
      stockTotal: 999,
      stockCheckedOut: 0,
      stock: 999,
      minStock: 0,
      unit: 'trajecte',
      location: 'Tarifa Logística',
      supplier: 'CampoPro Serveis SL',
      unitPrice: 40.00,
      isService: true,
      lastPurchaseDate: 'Tarifa Activa',
      workerMovementHistory: [],
      purchaseHistory: []
    },
    {
      id: 's5',
      code: 'SERV-005',
      name: 'Recàrrec Extra / Nocturnitat / Festiu',
      stockTotal: 999,
      stockCheckedOut: 0,
      stock: 999,
      minStock: 0,
      unit: 'h',
      location: 'Tarifa Especial',
      supplier: 'CampoPro Serveis SL',
      unitPrice: 25.00,
      isService: true,
      lastPurchaseDate: 'Tarifa Activa',
      workerMovementHistory: [],
      purchaseHistory: []
    }
  ]);

  // Handle direct inline price editing for warehouse & service items
  const handleUpdateUnitPrice = (id: string, newPriceStr: string) => {
    const val = parseFloat(newPriceStr);
    if (isNaN(val) || val < 0) return;
    setMaterials(materials.map(m => m.id === id ? { ...m, unitPrice: val } : m));
  };

  // Database 2: Eines
  const [eines, setEines] = useState([
    { 
      id: 'e1', 
      code: 'EIN-101', 
      name: 'Trepant Bosch GSR-18', 
      brand: 'Bosch Professional', 
      serial: 'SN-99882', 
      assignedTo: 'Jordi Soler', 
      location: 'Furgoneta 01',
      returnConditionStatus: 'OPERATIVA', 
      returnedAtEndOfDay: false, 
      returnStatusText: 'A la Furgoneta 01 (Operativa)',
      lastWorkerReport: 'Jordi Soler • Retornat en perfecte estat',
      warrantyUntil: '15/06/2027', 
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
      assignedTo: 'Magatzem Central', 
      location: 'Taller Reparació',
      returnConditionStatus: 'REPARACIO', 
      returnedAtEndOfDay: true,
      returnStatusText: 'Retornat al Magatzem (Avaria reportada per operari)',
      lastWorkerReport: 'Marc Andreu • Cable tallat i rodaments sorollosos',
      warrantyUntil: '10/10/2025',
      supplier: 'AgroSubministres Ponent SL',
      repairHistory: [
        { id: 'r2', date: '28/04/2026', reason: 'Substitució de rodaments i cable tallat', mechanic: 'Taller Central CampoPro', cost: '62,00 €', status: 'EN_CURS' }
      ]
    },
    { 
      id: 'e3', 
      code: 'EIN-103', 
      name: 'Nivell Làser Topcon RL-H5A', 
      brand: 'Topcon', 
      serial: 'TP-77890', 
      assignedTo: 'Pau Ribas', 
      location: 'No trobat al camp',
      returnConditionStatus: 'PERDUDA', 
      returnedAtEndOfDay: false,
      returnStatusText: '⚠️ PERDUDA AL CAMP (No retornat per l\'operari)',
      lastWorkerReport: 'Pau Ribas • Caigut o oblidat al sector Nord de la finca Agro Riera',
      warrantyUntil: '01/03/2028',
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
      itvDate: '15/11/2026', 
      insuranceCompany: 'Mapfre Assegurances',
      insurancePolicy: 'POL-9988112-F',
      insuranceDate: '01/09/2026',
      lastOilChangeDate: '10/03/2026',
      lastOilChangeCounter: 120000,
      mechanicName: 'Taller Mecànic Pons & Fills',
      mechanicContact: '938 11 22 33 (Pere Pons)',
      status: 'OK',
      maintenanceHistory: [
        { id: 'vh1', date: '10/03/2026', counter: '120.000 Km', service: 'Canvi d\'oli 5W30, filtre d\'oli i filtre d\'aire', mechanic: 'Taller Mecànic Pons & Fills', cost: '185,00 €' }
      ]
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
      discountValue: '15%',
      paymentMethod: 'Transferència a 30 dies',
      totalSpentNumeric: 1450.00,
      totalSpent: '1.450,00 €',
      documentsFolder: '/documents/magatzem/proveidors/agrosubministres/',
      digitizedDocs: [
        { id: 'doc1', docNumber: 'ALB-2026-8812', type: 'ALBARÀ', date: '12/04/2026', title: 'Albarà de Lliurament 100m Tub PE 25mm', fileSize: '1.2 MB', url: '/documents/ALB-2026-8812.pdf' },
        { id: 'doc2', docNumber: 'FAC-2026-9901', type: 'FACTURA', date: '30/04/2026', title: 'Factura Comercial Abril 2026', fileSize: '2.4 MB', url: '/documents/FAC-2026-9901.pdf' }
      ],
      supplierHistory: [
        { id: 'sp1', date: '12/04/2026', docNumber: 'ALB-2026-8812', docType: 'ALBARÀ', concept: 'Tub PE 25mm High-Density (100m)', qty: '100m', amount: '450,00 €', buyer: 'Marc (Enginyer)' },
        { id: 'sp2', date: '30/04/2026', docNumber: 'FAC-2026-9901', docType: 'FACTURA', concept: 'Factura Comercial Abril 2026 (Tub PE 25mm)', qty: '100m', amount: '490,00 €', buyer: 'Marc (Enginyer)' }
      ]
    }
  ]);

  // Manual Form States
  const [newMat, setNewMat] = useState({ name: '', code: '', stock: '', minStock: '', unit: 'u', location: '', supplier: '', unitPrice: '', isService: false });
  const [newEin, setNewEin] = useState({ name: '', brand: '', serial: '', assignedTo: 'Magatzem Central', location: 'Magatzem Central', warrantyUntil: '', supplier: '', returnConditionStatus: 'OPERATIVA' });
  const [newVeh, setNewVeh] = useState({ plate: '', name: '', type: 'Furgoneta', unitType: 'Km', counterValue: '', itvDate: '', insuranceCompany: '', insurancePolicy: '', insuranceDate: '', lastOilChangeDate: '', lastOilChangeCounter: '', mechanicName: '', mechanicContact: '' });
  const [newProv, setNewProv] = useState({ name: '', nif: '', contact: '', phone: '', email: '', address: '', products: '', discount: '', paymentMethod: '' });

  // Direct Supplier Navigation Helper
  const openSupplierByName = (supplierName: string) => {
    const foundProv = proveidors.find(p => p.name.toLowerCase().trim() === supplierName.toLowerCase().trim());
    if (foundProv) {
      setSelectedItem({ type: 'proveidor', data: foundProv });
    } else {
      alert(`Proveïdor "${supplierName}" no trobat a la base de dades. Pots crear-lo des del botó "Donar d'Alta".`);
    }
  };

  // Open AI Purchase Order Redactor
  const openAIPurchaseOrderModal = (material: any) => {
    setSelectedMaterialForPO(material);
    const needed = Math.max(material.minStock * 2 - material.stock, 20);
    setPoQuantity(needed);
    setShowAIPOModal(true);
    setPoDraftResult(null);
  };

  // Generate AI Purchase Order Draft
  const generateAIPurchaseOrderDraft = () => {
    if (!selectedMaterialForPO) return;
    setIsGeneratingPO(true);

    const supplierObj = proveidors.find(p => p.name.toLowerCase().trim() === selectedMaterialForPO.supplier.toLowerCase().trim()) || {
      email: 'ventes@agrosubministres.cat',
      nif: 'B25889911',
      discountValue: '15%',
      paymentMethod: 'Transferència a 30 dies',
      contact: 'Departament de Vendes'
    };

    setTimeout(() => {
      const grossPrice = selectedMaterialForPO.unitPrice * poQuantity;
      const discountNum = parseFloat(cleanDiscountDisplay(supplierObj.discountValue)) || 10;
      const netTotal = grossPrice * (1 - discountNum / 100);

      const draftedEmail = {
        toEmail: supplierObj.email,
        subject: `COMANDA D'ADQUISICIÓ REPO-2026 #${selectedMaterialForPO.code} - CampoPro Serveis Agrícoles`,
        body: `A/A: ${supplierObj.contact} (${selectedMaterialForPO.supplier})
NIF Proveïdor: ${supplierObj.nif}

Benvolguts,

Mitjançant la present comanda oficial emesa pel departament d'Enginyeria de CampoPro Serveis Agrícoles SL, sol·licitem el subministrament del següent material de magatzem:

----------------------------------------------------------------------
PRODUCTE: ${selectedMaterialForPO.name}
CODI REFERÈNCIA / SKU: ${selectedMaterialForPO.code}
QUANTITAT SOL·LICITADA: ${poQuantity} ${selectedMaterialForPO.unit}
PREU UNITARI PACTAT: ${selectedMaterialForPO.unitPrice.toFixed(2)} € / ${selectedMaterialForPO.unit}
DESCOMPTE COMERCIAL APLICAT: ${cleanDiscountDisplay(supplierObj.discountValue)}
TOTAL NET ESTIMAT: ${netTotal.toFixed(2)} € (IVA no inclòs)
----------------------------------------------------------------------

INSTRUCCIONS DE LLIURAMENT:
- Adreça de lliurament: Magatzem Central CampoPro, Polígon Industrial El Segre, Nau 12, Lleida.
- Observacions de l'Enginyer: ${poNotes}
- Forma de pagament acollida: ${supplierObj.paymentMethod}.

Agrairem confirmació de recepció d'aquesta comanda i data estimada de lliurament per albarà.

Atentament,
Departament de Gestió de Magatzem i Flota
CampoPro Serveis Agrícoles SL
Tel: 973 99 00 11 | email: magatzem@campopro.cat`
      };

      setPoDraftResult(draftedEmail);
      setIsGeneratingPO(false);
    }, 1500);
  };

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
        discountValue: aiAuditResult.supplier.discount,
        paymentMethod: aiAuditResult.supplier.paymentMethod,
        totalSpentNumeric: aiAuditResult.totalAmount,
        totalSpent: `${aiAuditResult.totalAmount.toFixed(2)} €`,
        documentsFolder: `/documents/magatzem/proveidors/${aiAuditResult.supplier.nif}/`,
        digitizedDocs: [
          { id: `doc-${Date.now()}`, docNumber: aiAuditResult.docNumber, type: 'FACTURA', date: aiAuditResult.date, title: `Factura Alta ${aiAuditResult.supplier.name}`, fileSize: '1.1 MB', url: `/documents/${aiAuditResult.docNumber}.pdf` }
        ],
        supplierHistory: [
          {
            id: `sp-${Date.now()}`,
            date: aiAuditResult.date,
            docNumber: aiAuditResult.docNumber,
            docType: 'FACTURA',
            concept: `Alta de Proveïdor via Ticket/Factura #${aiAuditResult.docNumber}`,
            qty: 'Varis',
            amount: `${aiAuditResult.totalAmount.toFixed(2)} €`,
            buyer: 'IA Auto-Reader'
          }
        ]
      };
      setProveidors([newProvObj, ...proveidors]);
    }

    setShowAIModal(false);
    setAiStep(1);
    setAiAuditResult(null);
  };

  // Manual Creation Handlers
  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMat.name.trim()) return;

    const initialStock = Number(newMat.stock) || 0;
    const item = {
      id: `m${Date.now()}`,
      code: newMat.code.trim() || `MAT-00${materials.length + 1}`,
      name: newMat.name.trim(),
      stockTotal: initialStock,
      stockCheckedOut: 0,
      stock: initialStock,
      minStock: Number(newMat.minStock) || 5,
      unit: newMat.unit,
      location: newMat.location.trim() || 'Magatzem Central',
      supplier: newMat.supplier.trim() || 'CampoPro Serveis SL',
      unitPrice: Number(newMat.unitPrice) || 0,
      isService: newMat.isService,
      lastPurchaseDate: new Date().toLocaleDateString('ca-ES'),
      workerMovementHistory: [],
      purchaseHistory: []
    };

    setMaterials([item, ...materials]);
    setNewMat({ name: '', code: '', stock: '', minStock: '', unit: 'u', location: '', supplier: '', unitPrice: '', isService: false });
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
      assignedTo: newEin.assignedTo,
      location: newEin.location,
      returnConditionStatus: newEin.returnConditionStatus,
      returnedAtEndOfDay: newEin.returnConditionStatus === 'OPERATIVA',
      returnStatusText: newEin.returnConditionStatus === 'OPERATIVA' ? 'Retornada OK al Magatzem' : newEin.returnConditionStatus === 'REPARACIO' ? 'En Taller / Avaria' : '⚠️ PERDUDA AL CAMP',
      lastWorkerReport: `${newEin.assignedTo} • Registre d'alta manual`,
      warrantyUntil: newEin.warrantyUntil || '15/06/2027',
      supplier: newEin.supplier || 'Subministraments Industrials Manresa',
      repairHistory: []
    };

    setEines([item, ...eines]);
    setNewEin({ name: '', brand: '', serial: '', assignedTo: 'Magatzem Central', location: 'Magatzem Central', warrantyUntil: '', supplier: '', returnConditionStatus: 'OPERATIVA' });
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
      itvDate: newVeh.itvDate || '15/11/2026',
      insuranceCompany: newVeh.insuranceCompany.trim() || 'Mapfre Assegurances',
      insurancePolicy: newVeh.insurancePolicy.trim() || 'POL-998800',
      insuranceDate: newVeh.insuranceDate || '01/09/2026',
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
      discountValue: cleanDiscountDisplay(newProv.discount),
      paymentMethod: newProv.paymentMethod.trim() || 'Transferència a 30 dies',
      totalSpentNumeric: 0,
      totalSpent: '0,00 €',
      documentsFolder: `/documents/magatzem/proveidors/${newProv.nif}/`,
      digitizedDocs: [],
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
            Control de Magatzem, Flota i Tarifes de Servei
            <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
              <Tag size={12} /> Articles de Serveis Editables
            </span>
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Gestió de materials físics i articles de serveis (Hora Operari, Hora Tractor, Transport, Desplaçament, Extra) amb preus editables.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowAIModal(true);
              setAiStep(1);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-700 hover:to-teal-800 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
          >
            <Bot size={18} />
            Escanejar amb IA
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-5 py-3 rounded-xl font-medium text-sm transition-all shadow-md active:scale-95"
          >
            <Plus size={18} />
            Donar d'Alta (Manual)
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
            Materials i Tarifes de Servei ({materials.length})
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
            placeholder="Cercar al magatzem o tarifes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        </div>
      </div>

      {/* TAB 1: MATERIALS & EDITABLE SERVICE TARIFF ARTICLES */}
      {activeTab === 'materials' && (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-500 font-semibold flex items-center justify-between">
            <span>💡 Pots editar directament el preu unitari de qualsevol article o tarifa de servei (Hora Operari, Hora Tractor, Transport, Desplaçament, Extra) per ajustar els pressupostos.</span>
            <span className="text-primary font-bold">{filteredMaterials.length} articles trobats</span>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Codi</th>
                <th className="px-6 py-4">Nom de l'Article / Servei</th>
                <th className="px-6 py-4 text-center">Tipus d'Article</th>
                <th className="px-6 py-4 text-center">Disponible Magatzem</th>
                <th className="px-6 py-4 text-center">Preu Unitari Editable (€)</th>
                <th className="px-6 py-4 text-center">Estat / Reposició</th>
                <th className="px-6 py-4 text-right">Accions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredMaterials.map((item) => {
                const isLowStock = !item.isService && item.stock <= item.minStock;
                return (
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedItem({ type: 'material', data: item })}
                    className="hover:bg-primary/5 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-neutral-500 font-bold">{item.code}</td>
                    <td className="px-6 py-4 font-semibold text-neutral-900 group-hover:text-primary transition-colors flex items-center gap-2">
                      {item.name}
                      {item.isService && (
                        <span className="bg-purple-100 text-purple-800 text-[10px] px-2 py-0.5 rounded font-bold">
                          Tarifa de Servei
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center text-xs">
                      {item.isService ? (
                        <span className="bg-purple-50 text-purple-700 font-bold border border-purple-200 px-2.5 py-1 rounded-full">
                          ⚡ Servei / Tarifació
                        </span>
                      ) : (
                        <span className="bg-neutral-100 text-neutral-700 font-medium px-2.5 py-1 rounded-full">
                          📦 Material Físic
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center font-bold text-base text-emerald-800">
                      {item.isService ? 'Sense Límit' : item.stock} <span className="text-xs font-normal text-neutral-500">{item.unit}</span>
                    </td>

                    {/* EDITABLE UNIT PRICE INPUT */}
                    <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <input 
                          type="number"
                          step="0.50"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateUnitPrice(item.id, e.target.value)}
                          className="w-24 p-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-center font-bold text-primary text-sm outline-none focus:border-primary focus:bg-white"
                        />
                        <span className="text-xs font-bold text-neutral-500">€ / {item.unit}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        {item.isService ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                            <Tag size={12} /> Actiu per a Pressupost
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                            <AlertTriangle size={12} /> Estoc Baix
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 size={12} /> OK
                          </span>
                        )}
                      </div>
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
                <th className="px-6 py-4 text-center">Estat del Retorn</th>
                <th className="px-6 py-4 text-right">Accions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredEines.map((item) => (
                <tr key={item.id} className="hover:bg-primary/5 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-neutral-500">{item.code}</td>
                  <td className="px-6 py-4 font-semibold text-neutral-900">{item.name}</td>
                  <td className="px-6 py-4 text-neutral-600">{item.brand}</td>
                  <td className="px-6 py-4 font-medium text-neutral-900">{item.assignedTo}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.returnConditionStatus === 'OPERATIVA' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.returnConditionStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={(e) => deleteEina(item.id, e)} className="p-2 text-neutral-400 hover:text-red-600">
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
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Tipus</th>
                <th className="px-6 py-4 text-center">Comptador</th>
                <th className="px-6 py-4 text-right">Accions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredVehicles.map((item) => (
                <tr key={item.id} className="hover:bg-primary/5 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-mono font-bold text-primary">{item.plate}</td>
                  <td className="px-6 py-4 font-semibold text-neutral-900">{item.name}</td>
                  <td className="px-6 py-4 text-neutral-600">{item.type}</td>
                  <td className="px-6 py-4 text-center font-bold text-neutral-900">{item.counterValue} {item.unitType}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={(e) => deleteVehicle(item.id, e)} className="p-2 text-neutral-400 hover:text-red-600">
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
                <th className="px-6 py-4">Nom Fiscal</th>
                <th className="px-6 py-4">NIF</th>
                <th className="px-6 py-4">Descompte</th>
                <th className="px-6 py-4 text-right">Accions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredProveidors.map((prov) => (
                <tr key={prov.id} className="hover:bg-primary/5 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-bold text-neutral-900">{prov.name}</td>
                  <td className="px-6 py-4 font-mono text-xs">{prov.nif}</td>
                  <td className="px-6 py-4 text-amber-800 font-bold">{cleanDiscountDisplay(prov.discountValue)}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={(e) => deleteProveidor(prov.id, e)} className="p-2 text-neutral-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL: DONAR D'ALTA MANUAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-neutral-200">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-lg text-neutral-900">Donar d'Alta Article o Tarifa de Servei</h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMaterial} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase mb-1">Nom de l'Article o Tarifa</label>
                <input type="text" required placeholder="Ex: Hora Tractor o Tub PE 50mm" value={newMat.name} onChange={(e) => setNewMat({ ...newMat, name: e.target.value })} className="w-full p-3 border rounded-xl text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Codi / SKU</label>
                  <input type="text" placeholder="SERV-006" value={newMat.code} onChange={(e) => setNewMat({ ...newMat, code: e.target.value })} className="w-full p-3 border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Preu Unitari (€)</label>
                  <input type="number" step="0.50" required placeholder="35.00" value={newMat.unitPrice} onChange={(e) => setNewMat({ ...newMat, unitPrice: e.target.value })} className="w-full p-3 border rounded-xl text-sm font-bold" />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="isServiceCheck" checked={newMat.isService} onChange={(e) => setNewMat({ ...newMat, isService: e.target.checked })} className="w-4 h-4 text-primary rounded" />
                <label htmlFor="isServiceCheck" className="text-xs font-bold text-neutral-800">Marcar com a Article de Tarifa / Servei per a Pressupostos</label>
              </div>
              <button type="submit" className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold mt-2">Guardar Article a Magatzem</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
