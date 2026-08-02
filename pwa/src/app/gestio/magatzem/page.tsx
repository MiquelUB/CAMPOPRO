'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, PenTool, Truck, Building2, Plus, Search, AlertTriangle, CheckCircle2, Trash2, X, History, ExternalLink, Phone, Mail, User, ShieldCheck, Wrench, Calendar, Gauge, FileText, CreditCard, Percent, DollarSign, Bot, Sparkles, Upload, FileUp, Loader2, ArrowRight, ShieldAlert, FileCheck, RefreshCw, UserPlus, Folder, ArrowDownRight, ArrowUpRight } from 'lucide-react';

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

  // Supplier Purchase History Search Term Filter inside Modal
  const [supplierHistorySearch, setSupplierHistorySearch] = useState('');

  // Selected Detail Modal State
  const [selectedItem, setSelectedItem] = useState<{ type: 'material' | 'eina' | 'vehicle' | 'proveidor'; data: any } | null>(null);

  // Database 1: Materials (with daily worker checkout & return tracking)
  const [materials, setMaterials] = useState([
    { 
      id: 'm1', 
      code: 'MAT-001', 
      name: 'Tub PE 25mm High-Density', 
      stockTotal: 150, 
      stockCheckedOut: 30, // Taken by workers today
      stock: 120, // Real available in warehouse
      minStock: 20, 
      unit: 'm', 
      location: 'Prestatgeria A-1',
      supplier: 'AgroSubministres Ponent SL',
      unitPrice: 4.50,
      lastPurchaseDate: '12/04/2026',
      workerMovementHistory: [
        { id: 'wm1', date: '02/08/2026 07:30', worker: 'Jordi Soler', action: 'SUBTRACTION', qty: '30m', status: 'EN_US_JORNADA' },
        { id: 'wm2', date: '01/08/2026 18:00', worker: 'Marc Andreu', action: 'RETURN', qty: '10m', status: 'RETORNAT_OK' }
      ],
      purchaseHistory: [
        { id: 'h1', date: '12/04/2026', qty: '100m', price: '450,00 €', supplier: 'AgroSubministres Ponent SL', buyer: 'Marc (Enginyer)' },
        { id: 'h2', date: '02/02/2026', qty: '50m', price: '225,00 €', supplier: 'AgroSubministres Ponent SL', buyer: 'Marc (Enginyer)' }
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
      lastPurchaseDate: '20/03/2026',
      workerMovementHistory: [
        { id: 'wm3', date: '02/08/2026 08:00', worker: 'Pau Ribas', action: 'SUBTRACTION', qty: '2u', status: 'EN_US_JORNADA' }
      ],
      purchaseHistory: [
        { id: 'h4', date: '20/03/2026', qty: '10u', price: '182,00 €', supplier: 'RiegoRegen Cat', buyer: 'Marc (Enginyer)' }
      ]
    },
    { 
      id: 'm3', 
      code: 'MAT-003', 
      name: 'Cinta de Teflon Professional', 
      stockTotal: 35,
      stockCheckedOut: 0,
      stock: 35, 
      minStock: 5, 
      unit: 'u', 
      location: 'Armari C-2',
      supplier: 'Subministraments Industrials Manresa',
      unitPrice: 1.20,
      lastPurchaseDate: '05/05/2026',
      workerMovementHistory: [],
      purchaseHistory: [
        { id: 'h6', date: '05/05/2026', qty: '40u', price: '48,00 €', supplier: 'Subministraments Industrials Manresa', buyer: 'Marc (Enginyer)' }
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
      lastPurchaseDate: '18/02/2026',
      workerMovementHistory: [],
      purchaseHistory: [
        { id: 'h7', date: '18/02/2026', qty: '20 sacs', price: '650,00 €', supplier: 'Fertilitzants del Segre SA', buyer: 'Miquel Riera' }
      ]
    },
  ]);

  // Database 2: Eines (DD/MM/YYYY date format, linked supplier, end of day return status)
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
      returnedAtEndOfDay: false, // In worker vehicle vs returned to warehouse
      returnStatusText: 'A la Furgoneta 01 (En ús per Jordi Soler)',
      warrantyUntil: '15/06/2027', // Formatted DD/MM/YYYY
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
      returnedAtEndOfDay: true,
      returnStatusText: 'Retornat al Magatzem Central (En taller)',
      warrantyUntil: '10/10/2025',
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
      assignedTo: 'Magatzem Central', 
      location: 'Magatzem Central',
      returnedAtEndOfDay: true,
      returnStatusText: 'Retornat al Magatzem Central (Disponible)',
      warrantyUntil: '01/01/2099',
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
    },
    { 
      id: 'v2', 
      plate: '5678-LMN', 
      name: 'Tractor John Deere 6R 150', 
      type: 'Tractor', 
      unitType: 'Hores', 
      counterValue: 3420, 
      itvDate: '10/08/2026', 
      insuranceCompany: 'Catalana Occident',
      insurancePolicy: 'POL-44102-TR',
      insuranceDate: '20/12/2026',
      lastOilChangeDate: '20/01/2026',
      lastOilChangeCounter: 3200,
      mechanicName: 'AgroReparacions del Segre',
      mechanicContact: '973 44 55 66 (Joan)',
      status: 'REVISIO_PENDENT',
      maintenanceHistory: [
        { id: 'vh3', date: '20/01/2026', counter: '3.200 Hores', service: 'Revisió 500h: Oli de motor, hidràulic i filtres', mechanic: 'AgroReparacions del Segre', cost: '420,00 €' }
      ]
    },
  ]);

  // Database 4: Proveïdors (Clean discount string without duplicate %, full searchable purchase history & documents folder)
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
      discountValue: '15%', // Clean single %
      paymentMethod: 'Transferència a 30 dies',
      totalSpentNumeric: 1450.00,
      totalSpent: '1.450,00 €',
      documentsFolder: '/documents/magatzem/proveidors/agrosubministres/',
      supplierHistory: [
        { id: 'sp1', date: '12/04/2026', docNumber: 'ALB-2026-8812', concept: 'Tub PE 25mm High-Density (100m)', qty: '100m', amount: '450,00 €', buyer: 'Marc (Enginyer)' },
        { id: 'sp2', date: '02/02/2026', docNumber: 'ALB-2026-1102', concept: 'Tub PE 25mm High-Density (50m)', qty: '50m', amount: '225,00 €', buyer: 'Marc (Enginyer)' },
        { id: 'sp3', date: '15/12/2025', docNumber: 'FAC-2025-998', concept: 'Recanvis canonada reg sector sud', qty: 'Varis', amount: '775,00 €', buyer: 'Miquel Riera' }
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
      discountValue: '10%',
      paymentMethod: 'Gir Domiciliat a 60 dies',
      totalSpentNumeric: 890.00,
      totalSpent: '890,00 €',
      documentsFolder: '/documents/magatzem/proveidors/riegoregen/',
      supplierHistory: [
        { id: 'sp4', date: '20/03/2026', docNumber: 'FAC-2026-441', concept: 'Vàlvula d\'Esfera 1" Inox (10u)', qty: '10u', amount: '182,00 €', buyer: 'Marc (Enginyer)' },
        { id: 'sp5', date: '10/01/2026', docNumber: 'FAC-2026-009', concept: 'Electrovàlvules 2" reforçades', qty: '5u', amount: '708,00 €', buyer: 'Jordi Soler' }
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
      discountValue: '12%',
      paymentMethod: 'Transferència a 45 dies',
      totalSpentNumeric: 2340.00,
      totalSpent: '2.340,00 €',
      documentsFolder: '/documents/magatzem/proveidors/fertisegre/',
      supplierHistory: [
        { id: 'sp6', date: '18/02/2026', docNumber: 'FAC-2026-118', concept: 'Adobat Foliar Nitrogenat 25kg (20 sacs)', qty: '20 sacs', amount: '650,00 €', buyer: 'Miquel Riera' }
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
      discountValue: '8%',
      paymentMethod: 'Comptat / Targeta',
      totalSpentNumeric: 620.00,
      totalSpent: '620,00 €',
      documentsFolder: '/documents/magatzem/proveidors/submanresa/',
      supplierHistory: [
        { id: 'sp8', date: '05/05/2026', docNumber: 'TIC-2026-99', concept: 'Cinta de Teflon Professional (40u)', qty: '40u', amount: '48,00 €', buyer: 'Marc (Enginyer)' },
        { id: 'sp9', date: '15/01/2026', docNumber: 'FAC-2026-012', concept: 'Trepant Bosch GSR-18 Professional', qty: '1u', amount: '572,00 €', buyer: 'Marc (Enginyer)' }
      ]
    },
  ]);

  // Manual Form States for ALL 4 tabs
  const [newMat, setNewMat] = useState({ name: '', code: '', stock: '', minStock: '', unit: 'u', location: '', supplier: '', unitPrice: '' });
  const [newEin, setNewEin] = useState({ name: '', brand: '', serial: '', status: 'BO', assignedTo: 'Magatzem Central', location: 'Magatzem Central', warrantyUntil: '', supplier: '', returnedAtEndOfDay: true });
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
        supplierHistory: [
          {
            id: `sp-${Date.now()}`,
            date: aiAuditResult.date,
            docNumber: aiAuditResult.docNumber,
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
      supplier: newMat.supplier.trim() || 'AgroSubministres Ponent SL',
      unitPrice: Number(newMat.unitPrice) || 0,
      lastPurchaseDate: new Date().toLocaleDateString('ca-ES'),
      workerMovementHistory: [],
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
      returnedAtEndOfDay: newEin.returnedAtEndOfDay,
      returnStatusText: newEin.returnedAtEndOfDay ? 'Retornat al Magatzem Central' : `A la Furgoneta de ${newEin.assignedTo}`,
      warrantyUntil: newEin.warrantyUntil || '15/06/2027',
      supplier: newEin.supplier || 'Subministraments Industrials Manresa',
      repairHistory: []
    };

    setEines([item, ...eines]);
    setNewEin({ name: '', brand: '', serial: '', status: 'BO', assignedTo: 'Magatzem Central', location: 'Magatzem Central', warrantyUntil: '', supplier: '', returnedAtEndOfDay: true });
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
      discountValue: newProv.discount.trim() || '0%',
      paymentMethod: newProv.paymentMethod.trim() || 'Transferència a 30 dies',
      totalSpentNumeric: 0,
      totalSpent: '0,00 €',
      documentsFolder: `/documents/magatzem/proveidors/${newProv.nif}/`,
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
              <Sparkles size={12} /> Sync Operari & IA
            </span>
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Alta 100% manual o per IA. Control de retorns diaris d'operaris, garanties DD/MM/YYYY i historial complet.</p>
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
            Escanejar amb IA
          </button>

          {/* Manual Add Button */}
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
            <span>💡 L'estoc inclou les recepcions i les dades d'agafades/retorns de l'App de l'Operari al final de la jornada.</span>
            <span className="text-primary font-bold">{filteredMaterials.length} materials trobats</span>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Codi</th>
                <th className="px-6 py-4">Nom del Material</th>
                <th className="px-6 py-4 text-center">Disponible Magatzem</th>
                <th className="px-6 py-4 text-center">En Ús Operaris</th>
                <th className="px-6 py-4">Ubicació</th>
                <th className="px-6 py-4">Proveïdor (Link)</th>
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
                    <td className="px-6 py-4 text-center font-bold text-base text-emerald-800">
                      {item.stock} <span className="text-xs font-normal text-neutral-500">{item.unit}</span>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-amber-700 bg-amber-50/50">
                      {item.stockCheckedOut > 0 ? `-${item.stockCheckedOut} ${item.unit}` : '0'}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{item.location}</td>
                    
                    {/* LINKED SUPPLIER NAME */}
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openSupplierByName(item.supplier);
                        }}
                        className="text-primary font-bold hover:underline flex items-center gap-1 text-xs"
                      >
                        <Building2 size={12} />
                        {item.supplier}
                      </button>
                    </td>

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
            <span>💡 Control del retorn de l'eina al magatzem al final de la jornada i enllaç directe amb el proveïdor de compra.</span>
            <span className="text-primary font-bold">{filteredEines.length} eines trobades</span>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Codi Inventari</th>
                <th className="px-6 py-4">Eina / Maquinària</th>
                <th className="px-6 py-4">Marca / Model</th>
                <th className="px-6 py-4">Assignat a (App Operari)</th>
                <th className="px-6 py-4">Retorn Jornada</th>
                <th className="px-6 py-4">Garantia Fins (DD/MM/YYYY)</th>
                <th className="px-6 py-4">Proveïdor (Link)</th>
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
                  <td className="px-6 py-4 font-medium text-neutral-900">{item.assignedTo}</td>
                  <td className="px-6 py-4 text-xs font-semibold">
                    {item.returnedAtEndOfDay ? (
                      <span className="text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        ✅ Retornada al Magatzem
                      </span>
                    ) : (
                      <span className="text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        🚐 En Furgoneta Operari
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-neutral-800 font-bold font-mono text-xs">{item.warrantyUntil}</td>

                  {/* LINKED SUPPLIER NAME */}
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openSupplierByName(item.supplier);
                      }}
                      className="text-primary font-bold hover:underline flex items-center gap-1 text-xs"
                    >
                      <Building2 size={12} />
                      {item.supplier}
                    </button>
                  </td>

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
            <span>💡 Lectura i sincronització de Km/Hores introduïdes per l'operari a l'iniciar/finalitzar el dia.</span>
            <span className="text-primary font-bold">{filteredVehicles.length} vehicles trobats</span>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Matrícula</th>
                <th className="px-6 py-4">Vehicle / Maquinària</th>
                <th className="px-6 py-4">Tipus</th>
                <th className="px-6 py-4 text-center">Comptador Actual</th>
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
            <span>💡 Clica qualsevol proveïdor per cercar tot el seu històric complet de compres i accedir a la carpeta digital.</span>
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
                      <Percent size={12} /> {prov.discountValue}
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

      {/* MODAL DETALL GENERAL (TRANSPARÈNCIA I HISTÒRICS COMPLETS) */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* 1. FITXA MATERIAL AMB TRACKING D'OPERARIS */}
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
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Estoc Magatzem</span>
                    <span className="text-lg font-bold text-emerald-800">{selectedItem.data.stock} {selectedItem.data.unit}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Agafat per Operaris</span>
                    <span className="text-lg font-bold text-amber-700">-{selectedItem.data.stockCheckedOut || 0} {selectedItem.data.unit}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Proveïdor Principal</span>
                    <button
                      onClick={() => openSupplierByName(selectedItem.data.supplier)}
                      className="text-xs font-bold text-primary underline block mt-1"
                    >
                      {selectedItem.data.supplier}
                    </button>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Preu Unitari</span>
                    <span className="text-lg font-bold text-neutral-900">{selectedItem.data.unitPrice.toFixed(2)} €</span>
                  </div>
                </div>

                {/* Moviments Diaris d'Operaris */}
                <div className="mb-6">
                  <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2 mb-2">
                    <User size={16} className="text-primary" /> Moviments d'Operaris en Jornada (App Mòbil)
                  </h4>
                  <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs">
                    {selectedItem.data.workerMovementHistory?.length > 0 ? (
                      <table className="w-full text-left">
                        <thead className="bg-neutral-100 text-neutral-600 font-semibold uppercase">
                          <tr>
                            <th className="p-2.5">Data / Hora</th>
                            <th className="p-2.5">Operari</th>
                            <th className="p-2.5">Acció</th>
                            <th className="p-2.5">Quantitat</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                          {selectedItem.data.workerMovementHistory.map((wm: any) => (
                            <tr key={wm.id} className="hover:bg-neutral-50">
                              <td className="p-2.5 font-mono">{wm.date}</td>
                              <td className="p-2.5 font-bold text-neutral-900">{wm.worker}</td>
                              <td className="p-2.5 font-semibold">
                                {wm.action === 'SUBTRACTION' ? (
                                  <span className="text-amber-700 flex items-center gap-1"><ArrowDownRight size={14} /> Substracció Obradora</span>
                                ) : (
                                  <span className="text-emerald-700 flex items-center gap-1"><ArrowUpRight size={14} /> Retorn al Magatzem</span>
                                )}
                              </td>
                              <td className="p-2.5 font-bold text-neutral-900">{wm.qty}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="p-3 text-center text-neutral-400">Cap moviment registrat avui.</p>
                    )}
                  </div>
                </div>

                {/* Històric de Compres */}
                <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2 mb-2">
                  <History size={16} className="text-primary" /> Històric de Compres i Entrades d'Estoc
                </h4>
                <div className="border border-neutral-200 rounded-xl overflow-hidden max-h-40 overflow-y-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-neutral-100 text-neutral-600 font-semibold uppercase">
                      <tr>
                        <th className="p-2.5">Data</th>
                        <th className="p-2.5">Quantitat</th>
                        <th className="p-2.5">Import</th>
                        <th className="p-2.5">Proveïdor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {selectedItem.data.purchaseHistory?.map((h: any) => (
                        <tr key={h.id} className="hover:bg-neutral-50">
                          <td className="p-2.5 font-semibold text-neutral-900">{h.date}</td>
                          <td className="p-2.5 font-bold text-emerald-700">{h.qty}</td>
                          <td className="p-2.5 font-bold text-neutral-900">{h.price}</td>
                          <td className="p-2.5 text-neutral-700">{h.supplier}</td>
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
                    <p className="text-xs text-neutral-500">{selectedItem.data.brand} • Sèrie: {selectedItem.data.serial}</p>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full">
                    <X size={22} />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 mb-6">
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Garantia Fins (DD/MM/YYYY)</span>
                    <span className="text-sm font-bold text-emerald-800 flex items-center gap-1 mt-1 font-mono">
                      <ShieldCheck size={14} /> {selectedItem.data.warrantyUntil}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Estat del Retorn (Jornada)</span>
                    <span className={`text-xs font-bold inline-block px-2.5 py-1 rounded-full mt-1 ${
                      selectedItem.data.returnedAtEndOfDay ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {selectedItem.data.returnedAtEndOfDay ? '✅ Magatzem Central' : '🚐 En Vehicle d\'Operari'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Assignat a Operari</span>
                    <span className="text-xs font-bold text-neutral-800 block mt-1">{selectedItem.data.assignedTo}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Proveïdor d'Adquisició</span>
                    <button
                      onClick={() => openSupplierByName(selectedItem.data.supplier)}
                      className="text-xs font-bold text-primary underline block mt-1"
                    >
                      {selectedItem.data.supplier}
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2 mb-3">
                  <Wrench size={16} className="text-primary" /> Històric de Reparacions
                </h4>
                <div className="border border-neutral-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-neutral-100 text-neutral-600 font-semibold uppercase">
                      <tr>
                        <th className="p-3">Data</th>
                        <th className="p-3">Motiu / Treball</th>
                        <th className="p-3">Taller / Mecànic</th>
                        <th className="p-3">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {selectedItem.data.repairHistory?.map((r: any) => (
                        <tr key={r.id} className="hover:bg-neutral-50">
                          <td className="p-3 font-semibold text-neutral-900">{r.date}</td>
                          <td className="p-3 font-medium text-neutral-800">{r.reason}</td>
                          <td className="p-3 text-neutral-600">{r.mechanic}</td>
                          <td className="p-3 font-bold text-neutral-900">{r.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. FITXA COMPLETA VEHICLE */}
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
                    <span className="text-xs font-bold text-emerald-800 block mt-1">{selectedItem.data.insuranceDate}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Data Límit ITV</span>
                    <span className="text-xs font-bold text-neutral-900 block mt-1">{selectedItem.data.itvDate}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Mecànic Habitual</span>
                    <span className="text-xs font-bold text-neutral-900 block mt-1">{selectedItem.data.mechanicName}</span>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2 mb-3">
                  <Wrench size={16} className="text-primary" /> Històric de Manteniment
                </h4>
                <div className="border border-neutral-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-neutral-100 text-neutral-600 font-semibold uppercase">
                      <tr>
                        <th className="p-3">Data</th>
                        <th className="p-3">Comptador</th>
                        <th className="p-3">Servei</th>
                        <th className="p-3">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {selectedItem.data.maintenanceHistory?.map((m: any) => (
                        <tr key={m.id} className="hover:bg-neutral-50">
                          <td className="p-3 font-semibold text-neutral-900">{m.date}</td>
                          <td className="p-3 font-mono">{m.counter}</td>
                          <td className="p-3 font-medium text-neutral-800">{m.service}</td>
                          <td className="p-3 font-bold text-neutral-900">{m.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. FITXA COMPLETA PROVEÏDOR (AMB CERCA DE TOT L'HISTÒRIC I CARPETA DIGITAL) */}
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
                      <Percent size={14} /> {selectedItem.data.discountValue}
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
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Carpeta de Documents</span>
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 mt-1">
                      <Folder size={14} /> Documents Guardats
                    </span>
                  </div>
                </div>

                {/* Filterable FULL Purchase History */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                      <History size={16} className="text-primary" /> Històric de Compres i Factures ({selectedItem.data.supplierHistory?.length || 0})
                    </h4>

                    {/* Modal Filter Input */}
                    <div className="relative w-full sm:w-56">
                      <input 
                        type="text" 
                        placeholder="Cercar a l'històric..."
                        value={supplierHistorySearch}
                        onChange={(e) => setSupplierHistorySearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:border-primary"
                      />
                      <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    </div>
                  </div>

                  <div className="border border-neutral-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-neutral-100 text-neutral-600 font-semibold uppercase">
                        <tr>
                          <th className="p-3">Data</th>
                          <th className="p-3">Doc #</th>
                          <th className="p-3">Concepte / Material</th>
                          <th className="p-3">Quantitat</th>
                          <th className="p-3">Import Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {selectedItem.data.supplierHistory && selectedItem.data.supplierHistory.length > 0 ? (
                          selectedItem.data.supplierHistory
                            .filter((sp: any) => 
                              sp.concept.toLowerCase().includes(supplierHistorySearch.toLowerCase()) || 
                              sp.docNumber.toLowerCase().includes(supplierHistorySearch.toLowerCase())
                            )
                            .map((sp: any) => (
                              <tr key={sp.id} className="hover:bg-neutral-50">
                                <td className="p-3 font-semibold text-neutral-900">{sp.date}</td>
                                <td className="p-3 font-mono font-bold text-primary">{sp.docNumber}</td>
                                <td className="p-3 font-medium text-neutral-800">{sp.concept}</td>
                                <td className="p-3 text-neutral-600">{sp.qty}</td>
                                <td className="p-3 font-bold text-neutral-900">{sp.amount}</td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-4 text-center text-neutral-400">Cap compra registrada en l'històric.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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

      {/* MODAL IA */}
      {showAIModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                <Bot className="text-emerald-600" size={24} /> Escàner IA d'Albarans / Factures
              </h3>
              <button onClick={() => setShowAIModal(false)} className="text-neutral-400 hover:text-neutral-700"><X size={20} /></button>
            </div>

            {aiStep === 1 && (
              <div className="space-y-4">
                <div className="p-8 border-2 border-dashed border-neutral-300 rounded-2xl bg-neutral-50 text-center">
                  <FileUp size={32} className="mx-auto text-emerald-600 mb-2" />
                  <p className="font-semibold text-sm">Pja l'albarà o factura en foto o PDF</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => startAIAudit('NEW_SUPPLIER')} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold">Provar Auto-Alta Proveïdor Nou</button>
                  <button onClick={() => startAIAudit('EXISTING_SUPPLIER')} className="flex-1 py-3 bg-neutral-800 text-white rounded-xl text-xs font-bold">Provar Auditoria Factura vs Albarà</button>
                </div>
              </div>
            )}

            {aiStep === 2 && (
              <div className="py-12 text-center">
                <Loader2 className="animate-spin text-emerald-600 mx-auto mb-2" size={40} />
                <p className="font-bold text-sm">Analitzant document amb OpenRouter...</p>
              </div>
            )}

            {aiStep === 3 && (
              <div className="space-y-4">
                <div className="bg-emerald-50 p-4 rounded-xl text-xs text-emerald-800 font-bold">Document processat amb èxit per la IA!</div>
                <button onClick={applyAIAuditToDatabase} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs">Confirmar i Actualitzar Magatzem</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: DONAR D'ALTA MANUAL COMPLET PER A LES 4 PESTANYES */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
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

            {/* FORM MANUAL: MATERIALS */}
            {activeTab === 'materials' && (
              <form onSubmit={handleAddMaterial} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Nom del Material</label>
                  <input type="text" required placeholder="Ex: Tub PE 25mm High-Density" value={newMat.name} onChange={(e) => setNewMat({ ...newMat, name: e.target.value })} className="w-full p-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Codi Barres / SKU</label>
                    <input type="text" placeholder="MAT-005" value={newMat.code} onChange={(e) => setNewMat({ ...newMat, code: e.target.value })} className="w-full p-3 border rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Unitat</label>
                    <select value={newMat.unit} onChange={(e) => setNewMat({ ...newMat, unit: e.target.value })} className="w-full p-3 border rounded-xl text-sm bg-white">
                      <option value="u">Unitats (u)</option>
                      <option value="m">Metres (m)</option>
                      <option value="kg">Kilograms (kg)</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Estoc Inicial</label>
                    <input type="number" required placeholder="100" value={newMat.stock} onChange={(e) => setNewMat({ ...newMat, stock: e.target.value })} className="w-full p-3 border rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Preu Unitari (€)</label>
                    <input type="number" step="0.01" placeholder="4.50" value={newMat.unitPrice} onChange={(e) => setNewMat({ ...newMat, unitPrice: e.target.value })} className="w-full p-3 border rounded-xl text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Proveïdor Principal</label>
                  <select value={newMat.supplier} onChange={(e) => setNewMat({ ...newMat, supplier: e.target.value })} className="w-full p-3 border rounded-xl text-sm bg-white">
                    <option value="">Seleccionar Proveïdor...</option>
                    {proveidors.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold mt-2">Guardar i Donar d'Alta Material</button>
              </form>
            )}

            {/* FORM MANUAL: EINES */}
            {activeTab === 'eines' && (
              <form onSubmit={handleAddEina} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Nom de l'Eina</label>
                  <input type="text" required placeholder="Ex: Trepant Bosch GSR-18" value={newEin.name} onChange={(e) => setNewEin({ ...newEin, name: e.target.value })} className="w-full p-3 border rounded-xl text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Garantia Fins (DD/MM/YYYY)</label>
                    <input type="text" placeholder="15/06/2027" value={newEin.warrantyUntil} onChange={(e) => setNewEin({ ...newEin, warrantyUntil: e.target.value })} className="w-full p-3 border rounded-xl text-sm font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Proveïdor</label>
                    <select value={newEin.supplier} onChange={(e) => setNewEin({ ...newEin, supplier: e.target.value })} className="w-full p-3 border rounded-xl text-sm bg-white">
                      <option value="">Seleccionar Proveïdor...</option>
                      {proveidors.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold mt-2">Guardar i Donar d'Alta Eina</button>
              </form>
            )}

            {/* FORM MANUAL: PROVEÏDORS */}
            {activeTab === 'proveidors' && (
              <form onSubmit={handleAddProveidor} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Nom Fiscal del Proveïdor</label>
                  <input type="text" required placeholder="Ex: AgroSubministres Ponent SL" value={newProv.name} onChange={(e) => setNewProv({ ...newProv, name: e.target.value })} className="w-full p-3 border rounded-xl text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">NIF / CIF</label>
                    <input type="text" placeholder="B25889911" value={newProv.nif} onChange={(e) => setNewProv({ ...newProv, nif: e.target.value })} className="w-full p-3 border rounded-xl text-sm font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Descompte Acordat (%)</label>
                    <input type="text" placeholder="15%" value={newProv.discount} onChange={(e) => setNewProv({ ...newProv, discount: e.target.value })} className="w-full p-3 border rounded-xl text-sm" />
                  </div>
                </div>
                <button type="submit" className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold mt-2">Guardar i Donar d'Alta Proveïdor</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
