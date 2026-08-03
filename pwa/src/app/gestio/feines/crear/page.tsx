'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Package, PenTool, Search, Check, Plus, X, ListCheck, Building2, Wrench, ShieldCheck, Sparkles, CheckSquare, Square, Bot, Send, Mic, AlertTriangle, Calendar, FileText, DollarSign, History, Truck, ArrowRight, RefreshCw, CheckCircle2, Edit3, Tag } from 'lucide-react';

interface WarehouseMaterialItem {
  id: string;
  code: string;
  name: string;
  defaultUnit: string;
  stock: number;
  location: string;
  unitPrice: number;
  isService?: boolean;
}

interface WarehouseToolItem {
  id: string;
  code: string;
  name: string;
  brand: string;
  status: 'OPERATIVA' | 'REPARACIO' | 'PERDUDA';
  assignedTo: string;
}

interface VehicleItem {
  id: string;
  plate: string;
  name: string;
  type: string;
  status: 'OPERATIU' | 'REVISIO_TALLER' | 'ITV_PENDENT';
  availableDate: string;
}

interface BudgetItem {
  id: string;
  code: string;
  name: string;
  qty: number;
  unit: string;
  unitPrice: number;
}

// 1. Real Grounded History DB (Mai inventat)
const HISTORIAL_TREBALLS_REALITZATS = [
  {
    keyword: 'fuga aigua',
    code: 'OT-442',
    title: 'Reparació Fuga d\'Aigua i Escomesa Sector Sud',
    avgHours: 6.5,
    materialsUsed: [
      { name: 'Tub PE 50mm High-Density', qty: '15m' },
      { name: 'Valvula de Tall 1 polzada Inox', qty: '2u' },
      { name: 'Cinta de Teflon Professional', qty: '2u' }
    ],
    toolsUsed: ['Trepant Bosch GSR-18', 'Radial Makita 125mm', 'Joc de Claus Stillson Heavy-Duty'],
    vehicleRequired: 'Tractor John Deere 6120M',
    budgetTotal: 850.00
  },
  {
    keyword: 'sensor humitat',
    code: 'OT-501',
    title: 'Instal·lació de Sensor d\'Humitat IOT',
    avgHours: 4.0,
    materialsUsed: [
      { name: 'Sensor de Humitat IOT 40cm', qty: '1u' },
      { name: 'Plafo Solar i Bateria Liti', qty: '1u' }
    ],
    toolsUsed: ['Detector de Metalls i Cables Subterrani', 'Trepant Bosch GSR-18'],
    vehicleRequired: 'Furgoneta Ford Transit 1234-BCD',
    budgetTotal: 450.00
  },
  {
    keyword: 'bomba reg',
    code: 'OT-612',
    title: 'Revisió i Manteniment Bomba de Reg 15CV',
    avgHours: 12.0,
    materialsUsed: [
      { name: 'Reten Mecanic Inox 40mm Bomba', qty: '2u' },
      { name: 'Oli Mineral Sintetic ISO VG 220', qty: '2u' }
    ],
    toolsUsed: ['Bomba de Comprovacio de Pressio Manual', 'Joc de Claus Stillson Heavy-Duty'],
    vehicleRequired: 'Furgoneta Ford Transit 1234-BCD',
    budgetTotal: 980.00
  }
];

// 2. Real Warehouse Stock DB (Inclou Productes de Serveis Editables: Hora Operari, Hora Tractor, Transport, Desplaçament, Extra)
const WAREHOUSE_MATERIALS_DB: WarehouseMaterialItem[] = [
  { id: 'wm1', code: 'MAT-001', name: 'Tub PE 25mm High-Density', defaultUnit: '10m', stock: 120, location: 'Prestatgeria A-1', unitPrice: 4.50 },
  { id: 'wm2', code: 'MAT-002', name: 'Valvula de Tall 1 polzada Inox', defaultUnit: '2u', stock: 4, location: 'Caixa B-4', unitPrice: 18.20 },
  { id: 'wm3', code: 'MAT-003', name: 'Cinta de Teflon Professional', defaultUnit: '1u', stock: 25, location: 'Caixa B-2', unitPrice: 2.10 },
  { id: 'wm4', code: 'MAT-004', name: 'Adobat Foliar Nitrogenat 25kg', defaultUnit: '5 sacs', stock: 2, location: 'Palet N-3', unitPrice: 32.50 },
  { id: 'wm5', code: 'MAT-005', name: 'Filtre de Malla 2 polzades High-Pressure', defaultUnit: '1u', stock: 8, location: 'Prestatgeria C-2', unitPrice: 82.50 },
  { id: 'wm6', code: 'MAT-006', name: 'Connector Rapid Inox 2 polzades', defaultUnit: '4u', stock: 30, location: 'Caixa A-3', unitPrice: 42.00 },
  { id: 'wm7', code: 'MAT-007', name: 'Tub PE 50mm High-Density', defaultUnit: '15m', stock: 45, location: 'Prestatgeria A-2', unitPrice: 8.50 },
  
  // EDITABLE WAREHOUSE SERVICE TARIFF PRODUCTS FOR BUDGETING
  { id: 's1', code: 'SERV-001', name: 'Hora Operari / Mà d\'Obra Tècnica', defaultUnit: '1h', stock: 999, location: 'Tarifa Interna', unitPrice: 35.00, isService: true },
  { id: 's2', code: 'SERV-002', name: 'Hora Tractor / Maquinària Agrícola', defaultUnit: '1h', stock: 999, location: 'Tarifa Flota', unitPrice: 65.00, isService: true },
  { id: 's3', code: 'SERV-003', name: 'Transport de Material / Logística', defaultUnit: '1 viatge', stock: 999, location: 'Tarifa Logística', unitPrice: 50.00, isService: true },
  { id: 's4', code: 'SERV-004', name: 'Desplaçament Tècnic d\'Emergència', defaultUnit: '1 trajecte', stock: 999, location: 'Tarifa Logística', unitPrice: 40.00, isService: true },
  { id: 's5', code: 'SERV-005', name: 'Recàrrec Extra / Nocturnitat / Festiu', defaultUnit: '1h', stock: 999, location: 'Tarifa Especial', unitPrice: 25.00, isService: true }
];

const WAREHOUSE_TOOLS_DB: WarehouseToolItem[] = [
  { id: 'wt1', code: 'EIN-101', name: 'Trepant Bosch GSR-18', brand: 'Bosch Pro', status: 'OPERATIVA', assignedTo: 'Magatzem Central' },
  { id: 'wt2', code: 'EIN-102', name: 'Radial Makita 125mm', brand: 'Makita', status: 'OPERATIVA', assignedTo: 'Magatzem Central' },
  { id: 'wt3', code: 'EIN-103', name: 'Nivell Laser Topcon RL-H5A', brand: 'Topcon', status: 'OPERATIVA', assignedTo: 'Pau Ribas' },
  { id: 'wt4', code: 'EIN-104', name: 'Joc de Claus Stillson Heavy-Duty', brand: 'Palmera', status: 'OPERATIVA', assignedTo: 'Magatzem Central' },
  { id: 'wt5', code: 'EIN-105', name: 'Detector de Metalls i Cables Subterrani', brand: 'Bosch Pro', status: 'OPERATIVA', assignedTo: 'Magatzem Central' },
  { id: 'wt6', code: 'EIN-106', name: 'Bomba de Comprovacio de Pressio Manual', brand: 'Rothenberger', status: 'OPERATIVA', assignedTo: 'Magatzem Central' }
];

// 3. Vehicles & Machinery Fleet DB
const VEHICLES_FLOTA_DB: VehicleItem[] = [
  { id: 'v1', plate: '1234-BCD', name: 'Furgoneta Ford Transit Custom', type: 'Furgoneta', status: 'OPERATIU', availableDate: 'Avui mateix' },
  { id: 'v2', plate: 'TRACTOR-01', name: 'Tractor John Deere 6120M', type: 'Tractor Agrícola', status: 'REVISIO_TALLER', availableDate: 'Dijous 06/08/2026' }
];

// 4. Incidencies DB
const INCIDENCIES_DB = [
  { id: 'inc-1', code: 'INC-8812', title: 'Fuga d\'aigua detectada al Camp 3', operari: 'Jordi Soler', date: '02/08/2026 18:30', audioNote: 'Nota de veu: canonada principal de 50mm rebentada pel sector Nord del Camp 3.' }
];

function CreateJobForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const clientIdParam = searchParams.get('clientId') || searchParams.get('client') || '1';

  // Client Mock Data Database
  const clientsDb: Record<string, { name: string; nif: string; phone: string; contact: string; address: string; lat: number; lng: number }> = {
    '1': { name: 'Agro Riera SL', nif: 'B12345678', phone: '600111222', contact: 'Miquel Riera', address: 'Camí Ral s/n, 08240 Manresa', lat: 41.6521, lng: 1.8322 },
    '2': { name: 'Finca Valles', nif: 'A87654321', phone: '600333444', contact: 'Anna Valles', address: 'Av. les Valls 45, Granollers', lat: 41.5233, lng: 2.1121 },
    '3': { name: 'Horta del Llobregat', nif: 'B99887766', phone: '600555666', contact: 'Joan Llobregat', address: 'Partida Nord 12, Sant Boi', lat: 41.3411, lng: 2.0511 },
  };

  const selectedClient = clientsDb[clientIdParam] || clientsDb['1'];

  // Form States
  const [selectedClientId, setSelectedClientId] = useState<string>(clientIdParam);
  const [priority, setPriority] = useState<'URGENT' | 'NORMAL' | 'BAIXA'>('NORMAL');
  const [description, setDescription] = useState<string>('');
  const [estimatedHours, setEstimatedHours] = useState<string>('4');
  const [hasBlueprint, setHasBlueprint] = useState<boolean>(false);
  const [blueprintName, setBlueprintName] = useState<string>('');
  const [assignedVehicle, setAssignedVehicle] = useState<string>('Furgoneta Ford Transit Custom (1234-BCD)');
  const [proposedStartDate, setProposedStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // EDITABLE ITEMIZED BUDGET QUOTE LINES (Hora Operari, Hora Tractor, Transport, Desplaçament, Extra)
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: 'b1', code: 'SERV-001', name: 'Hora Operari / Mà d\'Obra Tècnica', qty: 4, unit: 'h', unitPrice: 35.00 },
    { id: 'b2', code: 'SERV-003', name: 'Transport de Material / Logística', qty: 1, unit: 'viatge', unitPrice: 50.00 },
    { id: 'b3', code: 'SERV-004', name: 'Desplaçament Tècnic d\'Emergència', qty: 1, unit: 'trajecte', unitPrice: 40.00 }
  ]);

  // Assigned Materials & Tools
  const [materials, setMaterials] = useState<Array<{ id: string; name: string; qty: string }>>([
    { id: '1', name: 'Tub PE 25mm High-Density', qty: '6m' },
    { id: '2', name: 'Valvula de Tall 1 polzada Inox', qty: '1u' },
  ]);
  const [newMaterial, setNewMaterial] = useState<string>('');
  const [newMaterialQty, setNewMaterialQty] = useState<string>('');

  const [tools, setTools] = useState<string[]>([
    'Trepant Bosch GSR-18',
    'Radial Makita 125mm',
    'Joc de Claus Stillson Heavy-Duty',
  ]);
  const [newTool, setNewTool] = useState<string>('');

  // Modals for Warehouse Checklist Selection
  const [showMaterialChecklistModal, setShowMaterialChecklistModal] = useState<boolean>(false);
  const [showToolChecklistModal, setShowToolChecklistModal] = useState<boolean>(false);
  const [checklistMaterialSearch, setChecklistMaterialSearch] = useState<string>('');
  const [checklistToolSearch, setChecklistToolSearch] = useState<string>('');

  // COPILOT IA STATE
  const [showCopilotModal, setShowCopilotModal] = useState<boolean>(false);
  const [copilotInput, setCopilotInput] = useState<string>('');
  const [isCopilotThinking, setIsCopilotThinking] = useState<boolean>(false);
  const [isDictating, setIsDictating] = useState<boolean>(false);
  const [copilotProposal, setCopilotProposal] = useState<any | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'bot'; text: string; proposal?: any }>>([
    {
      sender: 'bot',
      text: `Hola Marc! Sóc el teu **Copilot Tècnic CampoPro**. He integrat els **Productes de Serveis del Magatzem (Hora Operari, Hora Tractor, Transport, Desplaçament, Extra)** per calcular pressupostos editables 100% reals.\n\nEscriu o dicta la tasca (ex: *"fuga aigua camp 3"*) i analitzaré l'historial real.`
    }
  ]);

  // Recalculate Total Budget from Editable Service Items & Materials
  const calculateTotalBudgetSum = (): number => {
    return budgetItems.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  };

  const handleUpdateBudgetItem = (id: string, field: 'qty' | 'unitPrice', valStr: string) => {
    const num = parseFloat(valStr) || 0;
    setBudgetItems(budgetItems.map(item => item.id === id ? { ...item, [field]: num } : item));
  };

  const handleAddServiceToBudget = (serviceCode: string) => {
    const serviceObj = WAREHOUSE_MATERIALS_DB.find(s => s.code === serviceCode);
    if (!serviceObj) return;

    const newItem: BudgetItem = {
      id: `b-${Date.now()}`,
      code: serviceObj.code,
      name: serviceObj.name,
      qty: 1,
      unit: serviceObj.defaultUnit.replace(/[0-9]/g, '').trim() || 'u',
      unitPrice: serviceObj.unitPrice
    };

    setBudgetItems([...budgetItems, newItem]);
  };

  const handleRemoveBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  // Handle Client Switch
  const handleClientSelect = (id: string) => {
    setSelectedClientId(id);
  };

  const activeClient = clientsDb[selectedClientId] || selectedClient;

  // COPILOT LOGIC BASED ON REAL MAGATZEM TARIFF ARTICLES
  const handleSendCopilotQuery = (userQueryText?: string) => {
    const query = (userQueryText || copilotInput).trim();
    if (!query) return;

    const updatedHistory = [...chatHistory, { sender: 'user' as const, text: query }];
    setChatHistory(updatedHistory);
    setCopilotInput('');
    setIsCopilotThinking(true);

    setTimeout(() => {
      const queryLower = query.toLowerCase();
      const matchedHistory = HISTORIAL_TREBALLS_REALITZATS.find(h => queryLower.includes(h.keyword) || h.keyword.includes(queryLower)) || HISTORIAL_TREBALLS_REALITZATS[0];
      const matchedIncident = INCIDENCIES_DB.find(inc => queryLower.includes('camp 3') || queryLower.includes('fuga'));

      const requiresTractor = queryLower.includes('camp') || queryLower.includes('adobat') || queryLower.includes('zanja');
      const targetVehicle = requiresTractor ? VEHICLES_FLOTA_DB.find(v => v.type.includes('Tractor')) : VEHICLES_FLOTA_DB[0];
      const hasVehicleAlert = targetVehicle?.status === 'REVISIO_TALLER';

      // Load editable service tariff items from Warehouse
      const horaOperariObj = WAREHOUSE_MATERIALS_DB.find(s => s.code === 'SERV-001') || { unitPrice: 35.00 };
      const horaTractorObj = WAREHOUSE_MATERIALS_DB.find(s => s.code === 'SERV-002') || { unitPrice: 65.00 };
      const transportObj = WAREHOUSE_MATERIALS_DB.find(s => s.code === 'SERV-003') || { unitPrice: 50.00 };
      const desplaçamentObj = WAREHOUSE_MATERIALS_DB.find(s => s.code === 'SERV-004') || { unitPrice: 40.00 };

      const proposedBudgetLines: BudgetItem[] = [
        { id: `b-op-${Date.now()}`, code: 'SERV-001', name: 'Hora Operari / Mà d\'Obra Tècnica', qty: matchedHistory.avgHours, unit: 'h', unitPrice: horaOperariObj.unitPrice },
        ...(requiresTractor ? [{ id: `b-tr-${Date.now()}`, code: 'SERV-002', name: 'Hora Tractor / Maquinària Agrícola', qty: 3, unit: 'h', unitPrice: horaTractorObj.unitPrice }] : []),
        { id: `b-log-${Date.now()}`, code: 'SERV-003', name: 'Transport de Material / Logística', qty: 1, unit: 'viatge', unitPrice: transportObj.unitPrice },
        { id: `b-desp-${Date.now()}`, code: 'SERV-004', name: 'Desplaçament Tècnic d\'Emergència', qty: 1, unit: 'trajecte', unitPrice: desplaçamentObj.unitPrice }
      ];

      const totalCalc = proposedBudgetLines.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);

      const proposalData = {
        title: matchedHistory.title,
        matchedCode: matchedHistory.code,
        incidentRef: matchedIncident ? `${matchedIncident.code} (${matchedIncident.operari})` : null,
        description: `Ordre d'intervenció basada en l'historial #${matchedHistory.code}. ${matchedIncident ? `Relacionada amb l'incidència #${matchedIncident.code}: "${matchedIncident.audioNote}". ` : ''}Sanejar canalització, aplicar fittings de seguretat i verificar pressió a 4.5 bar.`,
        estimatedHours: String(matchedHistory.avgHours),
        materials: matchedHistory.materialsUsed.map((m, idx) => ({ ...m, stockAvailable: 45, inStock: true })),
        tools: matchedHistory.toolsUsed,
        vehicle: targetVehicle,
        hasVehicleAlert: hasVehicleAlert,
        alertText: hasVehicleAlert ? `⚠️ ALERTA DE VEHICLE: El ${targetVehicle?.name} (${targetVehicle?.plate}) està en REVISIÓ AL TALLER.` : null,
        proposedStartDate: hasVehicleAlert ? '2026-08-06' : new Date().toISOString().split('T')[0],
        proposedStartDateFormatted: hasVehicleAlert ? 'Dijous 06/08/2026 (Quan el tractor torni a estar operatiu)' : 'Avui mateix',
        budgetLines: proposedBudgetLines,
        calculatedBudget: `${totalCalc.toFixed(2)} €`
      };

      setCopilotProposal(proposalData);
      setChatHistory([
        ...updatedHistory,
        {
          sender: 'bot',
          text: `He estructurat el pressupost amb els **Articles de Tarifes de Magatzem Editables** (Hora Operari, Hora Tractor, Transport, Desplaçament):`,
          proposal: proposalData
        }
      ]);

      setIsCopilotThinking(false);
    }, 1200);
  };

  // Dictation Simulation (Speech-to-Text)
  const handleToggleDictation = () => {
    if (isDictating) {
      setIsDictating(false);
    } else {
      setIsDictating(true);
      setCopilotInput('Escoltant la teva veu...');
      setTimeout(() => {
        const dictationResult = "fuga aigua camp 3 urgent";
        setCopilotInput(dictationResult);
        setIsDictating(false);
        handleSendCopilotQuery(dictationResult);
      }, 2000);
    }
  };

  // APPLY COPILOT PROPOSAL TO FORM IN 1 CLICK
  const applyCopilotProposalToForm = () => {
    if (!copilotProposal) return;

    setDescription(copilotProposal.description);
    setEstimatedHours(copilotProposal.estimatedHours);
    setPriority(copilotProposal.hasVehicleAlert ? 'URGENT' : 'NORMAL');
    setProposedStartDate(copilotProposal.proposedStartDate);
    setBudgetItems(copilotProposal.budgetLines);

    if (copilotProposal.vehicle) {
      setAssignedVehicle(`${copilotProposal.vehicle.name} (${copilotProposal.vehicle.plate})`);
    }

    setMaterials(copilotProposal.materials.map((m: any, idx: number) => ({
      id: `copilot-mat-${idx}`,
      name: m.name,
      qty: m.qty
    })));

    setTools(copilotProposal.tools);

    setShowCopilotModal(false);
    alert(`✨ S'ha aplicat tota la proposta del Copilot IA a l'Ordre de Treball! Descripció, Hores (${copilotProposal.estimatedHours}h), Materials de magatzem, Eines, Vehicle i Pressupost Editable de ${copilotProposal.calculatedBudget}.`);
  };

  // Manual Add Handlers
  const handleAddMaterialManual = () => {
    if (newMaterial.trim()) {
      setMaterials([...materials, { id: `${Date.now()}`, name: newMaterial.trim(), qty: newMaterialQty.trim() || '1u' }]);
      setNewMaterial('');
      setNewMaterialQty('');
    }
  };

  const handleAddToolManual = () => {
    if (newTool.trim()) {
      setTools([...tools, newTool.trim()]);
      setNewTool('');
    }
  };

  // Checklist Selection Handlers
  const toggleMaterialChecklist = (item: WarehouseMaterialItem) => {
    const exists = materials.some(m => m.name.toLowerCase().trim() === item.name.toLowerCase().trim());
    if (exists) {
      setMaterials(materials.filter(m => m.name.toLowerCase().trim() !== item.name.toLowerCase().trim()));
    } else {
      setMaterials([...materials, { id: `${Date.now()}`, name: item.name, qty: item.defaultUnit }]);
    }
  };

  const toggleToolChecklist = (toolName: string) => {
    const exists = tools.some(t => t.toLowerCase().trim() === toolName.toLowerCase().trim());
    if (exists) {
      setTools(tools.filter(t => t.toLowerCase().trim() !== toolName.toLowerCase().trim()));
    } else {
      setTools([...tools, toolName]);
    }
  };

  const handleSaveOrder = () => {
    alert(`Ordre de Treball creada amb èxit per al client ${activeClient.name} amb el pressupost editable de ${calculateTotalBudgetSum().toFixed(2)} €!`);
    router.push(`/gestio/clients/${selectedClientId}`);
  };

  return (
    <div className="relative pt-32 p-xl bg-surface min-h-screen">
      <nav className="mb-lg flex items-center text-xs text-on-surface-variant gap-xs">
        <span className="material-symbols-outlined text-[14px]">home</span>
        <span>/</span>
        <Link href="/gestio" className="hover:text-primary cursor-pointer">Dashboard</Link>
        <span>/</span>
        <Link href="/gestio/clients" className="hover:text-primary cursor-pointer">Clients</Link>
        <span>/</span>
        <span className="text-primary font-body-strong">Redacció de Feina ({activeClient.name})</span>
      </nav>

      <div className="flex flex-col w-full gap-xl max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md bg-surface-container-lowest p-xl rounded-2xl shadow-sm border border-outline-variant/30">
          <div>
            <div className="flex items-center gap-sm mb-1">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
              <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest">
                Redacció Vinculada al Client
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg text-primary">
              Nova Ordre de Treball i Pressupost
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Tots els registres, materials de magatzem, tarifes de servei editables (Hora Operari, Hora Tractor, Transport, Desplaçament, Extra) quedaran arxivats directament a l'historial del client.
            </p>
          </div>

          {/* AI COPILOT CHAT TRIGGER BUTTON */}
          <button
            onClick={() => setShowCopilotModal(true)}
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-700 to-primary text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 hover:scale-105 active:scale-95 text-sm"
          >
            <Bot size={22} className="text-amber-300 animate-bounce" />
            🤖 Obrir Copilot IA (Historial + Pressupost Real)
          </button>
        </div>

        {/* Main Grid Form */}
        <div className="grid grid-cols-12 gap-xl">
          {/* Left Column: Client & Main Form */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-lg">
            
            {/* Card 1: Client Information */}
            <div className="p-xl bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-md">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-md">
                <h2 className="font-section-title text-primary flex items-center gap-2 text-lg">
                  <Building2 size={20} className="text-primary" />
                  Dades del Client (Pre-emplenades)
                </h2>
                <span className="text-xs bg-primary/10 text-primary font-bold px-3 py-1 rounded-full">
                  ID #{selectedClientId}
                </span>
              </div>

              {/* Client Selector Dropdown */}
              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-xs text-on-surface-variant">SELECCIONAR CLIENT</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => handleClientSelect(e.target.value)}
                  className="w-full bg-surface-container-low p-3.5 rounded-xl border border-outline-variant font-body-strong text-primary outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  {Object.entries(clientsDb).map(([id, c]) => (
                    <option key={id} value={id}>
                      {c.name} — {c.nif} ({c.contact})
                    </option>
                  ))}
                </select>
              </div>

              {/* Client Details Summary Grid */}
              <div className="grid grid-cols-2 gap-md bg-surface-container-low p-md rounded-xl border border-outline-variant/20 text-sm">
                <div>
                  <span className="text-xs text-on-surface-variant block font-label-caps">NOM FISCAL</span>
                  <span className="font-body-strong text-primary">{activeClient.name}</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block font-label-caps">NIF / CIF</span>
                  <span className="font-body-strong text-primary">{activeClient.nif}</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block font-label-caps">CONTACTE PRINCIPAL</span>
                  <span className="font-body-strong text-primary">{activeClient.contact} ({activeClient.phone})</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block font-label-caps">ADREÇA FINCA</span>
                  <span className="font-body-strong text-primary">{activeClient.address}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Job Description, Hours & Proposed Dates */}
            <div className="p-xl bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-md">
              <div className="flex justify-between items-center">
                <h2 className="font-section-title text-primary flex items-center gap-2 text-lg">
                  <span className="material-symbols-outlined text-primary">description</span>
                  Descripció i Planificació de la Feina
                </h2>

                {/* Priority Selector */}
                <div className="flex gap-xs">
                  <button 
                    type="button"
                    onClick={() => setPriority('URGENT')} 
                    className={`px-3 py-1 rounded-full font-label-caps text-xs transition-all ${priority === 'URGENT' ? 'bg-error text-white font-bold scale-105' : 'bg-error-container text-error'}`}
                  >
                    URGENT
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPriority('NORMAL')} 
                    className={`px-3 py-1 rounded-full font-label-caps text-xs transition-all ${priority === 'NORMAL' ? 'bg-secondary-container text-white font-bold scale-105' : 'bg-secondary-container/20 text-secondary border'}`}
                  >
                    NORMAL
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPriority('BAIXA')} 
                    className={`px-3 py-1 rounded-full font-label-caps text-xs transition-all ${priority === 'BAIXA' ? 'bg-outline text-white font-bold scale-105' : 'bg-surface-container text-on-surface-variant'}`}
                  >
                    BAIXA
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-caps text-xs text-on-surface-variant">DESCRIPCIÓ DETALLADA DE LA TASCA</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Escriu la descripció de la tasca o obre el Copilot IA amb el botó superior..."
                  className="w-full bg-surface-container-low p-4 rounded-xl border border-outline-variant font-body-base outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                ></textarea>
              </div>

              {/* Estimated Hours & Dates Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-xs text-on-surface-variant">ESTIMACIÓ HORES DE TREBALL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={estimatedHours}
                      onChange={(e) => setEstimatedHours(e.target.value)}
                      className="w-full bg-surface-container-low p-3.5 rounded-xl border border-outline-variant font-body-strong text-primary text-center text-lg outline-none"
                    />
                    <span className="font-body-strong text-on-surface-variant">Hores</span>
                  </div>
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-xs text-on-surface-variant">DATA D'INICI RECOMANADA (SEGONS VEHICLES)</label>
                  <input
                    type="date"
                    value={proposedStartDate}
                    onChange={(e) => setProposedStartDate(e.target.value)}
                    className="w-full bg-surface-container-low p-3.5 rounded-xl border border-outline-variant font-body-strong text-primary text-center text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Materials & Tools Assignment WITH CHECKLIST & MANUAL OPTION */}
            <div className="p-xl bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-lg">
              
              {/* 1. Materials Section */}
              <div className="flex flex-col gap-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h3 className="font-headline-md text-primary flex items-center gap-2 text-md">
                    <Package size={20} className="text-primary" />
                    Materials Necessaris Assignats ({materials.length})
                  </h3>

                  {/* Checklist Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setShowMaterialChecklistModal(true)}
                    className="flex items-center gap-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors border border-emerald-300 shadow-sm"
                  >
                    <ListCheck size={16} />
                    📋 Triar del Magatzem (Checklist)
                  </button>
                </div>
                
                {/* Active Materials Pills */}
                <div className="flex flex-wrap gap-2">
                  {materials.map((mat) => (
                    <span key={mat.id} className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm">
                      <Package size={14} className="text-emerald-700" />
                      {mat.name} ({mat.qty})
                      <button 
                        onClick={() => setMaterials(materials.filter((m) => m.id !== mat.id))}
                        className="hover:text-red-600 transition-colors ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Manual Add Input */}
                <div className="flex gap-2 bg-neutral-50 p-2 rounded-xl border border-neutral-200">
                  <input
                    type="text"
                    placeholder="Afegir material a mà (ex: Tub PE 25mm)..."
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    className="flex-1 bg-white p-2.5 rounded-lg border border-neutral-200 text-xs outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="Quantitat (ex: 5m)..."
                    value={newMaterialQty}
                    onChange={(e) => setNewMaterialQty(e.target.value)}
                    className="w-28 bg-white p-2.5 rounded-lg border border-neutral-200 text-xs outline-none text-center font-bold"
                  />
                  <button 
                    type="button"
                    onClick={handleAddMaterialManual}
                    className="px-4 py-2.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 flex items-center gap-1"
                  >
                    <Plus size={14} /> A mà
                  </button>
                </div>
              </div>

              <div className="h-px bg-outline-variant/30"></div>

              {/* 2. Tools Section */}
              <div className="flex flex-col gap-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h3 className="font-headline-md text-primary flex items-center gap-2 text-md">
                    <PenTool size={20} className="text-primary" />
                    Eines Necessàries Assignades ({tools.length})
                  </h3>

                  {/* Checklist Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setShowToolChecklistModal(true)}
                    className="flex items-center gap-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors border border-blue-300 shadow-sm"
                  >
                    <ListCheck size={16} />
                    📋 Triar Eines Magatzem (Checklist)
                  </button>
                </div>

                {/* Active Tools Pills */}
                <div className="flex flex-wrap gap-2">
                  {tools.map((t, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm">
                      <Wrench size={14} className="text-blue-700" />
                      {t}
                      <button 
                        onClick={() => setTools(tools.filter((_, i) => i !== idx))}
                        className="hover:text-red-600 transition-colors ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Manual Add Input */}
                <div className="flex gap-2 bg-neutral-50 p-2 rounded-xl border border-neutral-200">
                  <input
                    type="text"
                    placeholder="Afegir eina a mà (ex: Radial Makita)..."
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    className="flex-1 bg-white p-2.5 rounded-lg border border-neutral-200 text-xs outline-none focus:border-primary"
                  />
                  <button 
                    type="button"
                    onClick={handleAddToolManual}
                    className="px-4 py-2.5 bg-blue-700 text-white rounded-lg text-xs font-bold hover:bg-blue-800 flex items-center gap-1"
                  >
                    <Plus size={14} /> A mà
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Vehicle, EDITABLE REAL BUDGET & Blueprints */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-lg">
            
            {/* Card 4: EDITABLE REAL BUDGET QUOTE CARD WITH SERVICE TARIFF ARTICLES */}
            <div className="p-xl bg-gradient-to-br from-emerald-950 via-teal-900 to-primary text-white rounded-3xl shadow-xl border border-emerald-700 flex flex-col gap-md">
              <div className="flex justify-between items-center border-b border-emerald-800 pb-md">
                <h2 className="font-bold flex items-center gap-2 text-lg text-emerald-300">
                  <DollarSign size={22} className="text-emerald-400" />
                  Pressupost Real (Articles de Magatzem Editables)
                </h2>
                <span className="text-[10px] font-bold bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  Tarifes Editables
                </span>
              </div>

              {/* Service Line Items Table with Inline Price & Qty Edit Inputs */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block mb-1">Desglose de Tarifes de Servei (Hora Operari, Hora Tractor, Transport, Desplaçament, Extra):</span>
                
                <div className="space-y-2 bg-emerald-950/60 p-3 rounded-2xl border border-emerald-800/80">
                  {budgetItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-2 bg-emerald-900/50 p-2 rounded-xl border border-emerald-700/50">
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold block">{item.code}</span>
                        <span className="font-semibold text-white text-xs truncate block">{item.name}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Qty Edit */}
                        <div className="flex items-center gap-1 bg-emerald-950 px-2 py-1 rounded-lg border border-emerald-700">
                          <input 
                            type="number" 
                            step="0.5" 
                            value={item.qty} 
                            onChange={(e) => handleUpdateBudgetItem(item.id, 'qty', e.target.value)} 
                            className="w-10 bg-transparent text-center font-bold text-white text-xs outline-none"
                          />
                          <span className="text-[10px] text-emerald-400">{item.unit}</span>
                        </div>

                        <span className="text-emerald-400 text-xs">x</span>

                        {/* Price Edit */}
                        <div className="flex items-center gap-1 bg-emerald-950 px-2 py-1 rounded-lg border border-emerald-700">
                          <input 
                            type="number" 
                            step="1" 
                            value={item.unitPrice} 
                            onChange={(e) => handleUpdateBudgetItem(item.id, 'unitPrice', e.target.value)} 
                            className="w-14 bg-transparent text-center font-bold text-emerald-300 text-xs outline-none"
                          />
                          <span className="text-[10px] text-emerald-400">€</span>
                        </div>

                        {/* Total per line */}
                        <span className="font-bold text-white w-14 text-right text-xs">{(item.qty * item.unitPrice).toFixed(2)}€</span>

                        <button onClick={() => handleRemoveBudgetItem(item.id)} className="text-emerald-400 hover:text-red-400 p-0.5">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add Quick Tariff Service Buttons */}
                  <div className="pt-2 flex flex-wrap gap-1.5 border-t border-emerald-800">
                    <span className="text-[10px] text-emerald-300 self-center font-bold">Afegir Tarifa:</span>
                    <button onClick={() => handleAddServiceToBudget('SERV-001')} className="px-2 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-[10px] font-bold">+ Hora Operari (35€)</button>
                    <button onClick={() => handleAddServiceToBudget('SERV-002')} className="px-2 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-[10px] font-bold">+ Hora Tractor (65€)</button>
                    <button onClick={() => handleAddServiceToBudget('SERV-003')} className="px-2 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-[10px] font-bold">+ Transport (50€)</button>
                    <button onClick={() => handleAddServiceToBudget('SERV-004')} className="px-2 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-[10px] font-bold">+ Desplaçament (40€)</button>
                    <button onClick={() => handleAddServiceToBudget('SERV-005')} className="px-2 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-[10px] font-bold">+ Extra Sanció/Festiu (25€)</button>
                  </div>
                </div>
              </div>

              {/* Total Budget Display */}
              <div className="flex justify-between items-end pt-2 border-t border-emerald-800">
                <div>
                  <span className="text-xs text-emerald-300 block font-semibold uppercase">TOTAL PRESSUPOSTAT REAL</span>
                  <span className="text-3xl font-extrabold text-white">{calculateTotalBudgetSum().toFixed(2)} €</span>
                </div>
                <span className="text-xs text-emerald-300 font-mono">IVA no inclòs (Editable en temps real)</span>
              </div>
            </div>

            {/* Card 5: Vehicle Assignment & Fleet Audit */}
            <div className="p-xl bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-md">
              <h2 className="font-section-title text-primary flex items-center gap-2 text-lg">
                <Truck size={20} className="text-primary" />
                Vehicle / Maquinària Assignada
              </h2>

              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-xs text-on-surface-variant">VEHICLE ASSIGNAT A LA TASCA</label>
                <select
                  value={assignedVehicle}
                  onChange={(e) => setAssignedVehicle(e.target.value)}
                  className="w-full bg-surface-container-low p-3.5 rounded-xl border border-outline-variant font-body-strong text-primary outline-none cursor-pointer text-sm"
                >
                  <option value="Furgoneta Ford Transit Custom (1234-BCD)">Furgoneta Ford Transit Custom (1234-BCD) — 🟢 Operatiu</option>
                  <option value="Tractor John Deere 6120M (TRACTOR-01)">Tractor John Deere 6120M — 🛠️ En Revisió al Taller</option>
                </select>
              </div>

              {assignedVehicle.includes('Tractor') && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium flex items-center gap-2">
                  <AlertTriangle size={18} className="shrink-0 text-amber-600" />
                  <span>Aquest tractor està al taller. Data estimada d'operativitat: <strong>Dijous 06/08/2026</strong>.</span>
                </div>
              )}
            </div>

            {/* Card 6: Blueprint Attachment */}
            <div className="p-xl bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-md">
              <h2 className="font-section-title text-primary flex items-center gap-2 text-lg">
                <span className="material-symbols-outlined text-primary">architecture</span>
                Plànol Tècnic Adjunt (Opcional)
              </h2>

              {!hasBlueprint ? (
                <button
                  type="button"
                  onClick={() => {
                    setHasBlueprint(true);
                    setBlueprintName('PLAN_FINCA_MANRESA_REV3.pdf');
                  }}
                  className="p-6 border-2 border-dashed border-outline-variant rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low transition-colors text-primary"
                >
                  <span className="material-symbols-outlined text-4xl">upload_file</span>
                  <span className="font-body-strong text-sm">Seleccionar o Carregar Plànol (PDF/Imatge)</span>
                </button>
              ) : (
                <div className="p-4 bg-primary-container/10 border border-primary/20 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">picture_as_pdf</span>
                    <span className="font-body-strong text-sm text-primary">{blueprintName}</span>
                  </div>
                  <button onClick={() => setHasBlueprint(false)} className="p-1 text-error">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-xl pt-lg border-t border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest p-xl rounded-2xl shadow-lg">
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="px-6 py-3.5 text-on-surface-variant font-body-strong hover:text-primary transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Cancel·lar
          </button>

          <button 
            type="button"
            onClick={handleSaveOrder} 
            className="px-10 py-4 bg-secondary-container text-on-secondary-container font-headline-md rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-wider"
          >
            <span className="material-symbols-outlined">check_circle</span>
            Guardar Ordre de Treball i Pressupost ({calculateTotalBudgetSum().toFixed(2)} €)
          </button>
        </div>
      </div>

      {/* MODAL COPILOT IA CHAT INTERACTIU & REAL DATA GROUNDED WITH EDITABLE TARIFF BUDGET LINES */}
      {showCopilotModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-neutral-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-800 text-white flex items-center justify-center shadow-md">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                    Copilot Tècnic CampoPro (IA Grounded)
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                      Articles de Tarifes Editables
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-500">Integrat amb Hora Operari, Hora Tractor, Transport, Desplaçament i Extra de magatzem.</p>
                </div>
              </div>
              <button onClick={() => setShowCopilotModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X size={24} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 my-2">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-1">
                      <Bot size={18} />
                    </div>
                  )}

                  <div className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed space-y-3 ${
                    msg.sender === 'user' ? 'bg-primary text-white font-medium rounded-tr-none' : 'bg-neutral-100 text-neutral-900 rounded-tl-none border border-neutral-200'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* PROPOSAL CARD GENERATED BY COPILOT */}
                    {msg.proposal && (
                      <div className="bg-white p-4 rounded-2xl border border-neutral-200 space-y-3 shadow-md text-neutral-900">
                        <div className="flex justify-between items-start border-b border-neutral-100 pb-2">
                          <div>
                            <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">
                              Basat en Historial #{msg.proposal.matchedCode}
                            </span>
                            <h4 className="font-bold text-sm text-neutral-900 mt-1">{msg.proposal.title}</h4>
                          </div>
                        </div>

                        {/* Vehicle Alert */}
                        {msg.proposal.hasVehicleAlert && (
                          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 font-bold flex items-start gap-2">
                            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <span>{msg.proposal.alertText}</span>
                              <span className="block text-[11px] text-emerald-800 font-normal mt-1">
                                📅 Data d'Inici Recomanada: <strong>{msg.proposal.proposedStartDateFormatted}</strong>
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Calculated Budget Breakdown from Tariff Articles */}
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase block">Desglose de Tarifes de Servei (Editables al Magatzem):</span>
                          <div className="space-y-1">
                            {msg.proposal.budgetLines.map((b: BudgetItem, i: number) => (
                              <div key={i} className="flex justify-between text-[11px] bg-white p-1.5 rounded border border-emerald-100 font-medium">
                                <span>{b.name} ({b.qty} {b.unit})</span>
                                <span className="font-bold text-emerald-800">{(b.qty * b.unitPrice).toFixed(2)} €</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-emerald-200 font-bold text-emerald-900 text-xs">
                            <span>TOTAL ESTIMAT:</span>
                            <span className="text-sm font-extrabold text-emerald-800">{msg.proposal.calculatedBudget}</span>
                          </div>
                        </div>

                        {/* Apply Button */}
                        <button
                          onClick={applyCopilotProposalToForm}
                          className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl font-bold text-xs shadow-md hover:from-emerald-700 hover:to-teal-800 transition-all flex items-center justify-center gap-2"
                        >
                          <Sparkles size={16} />
                          ✨ Aplicar Ordre, Materials, Vehicle i Pressupost al Formulari
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isCopilotThinking && (
                <div className="flex gap-2 text-xs text-neutral-500 items-center bg-neutral-100 p-3 rounded-xl w-fit">
                  <RefreshCw className="animate-spin text-emerald-600" size={16} />
                  <span>Consultant tarifes de serveis del magatzem, historial i estat de la flota...</span>
                </div>
              )}
            </div>

            {/* Chat Input & Voice Dictation Bar */}
            <div className="pt-2 flex gap-2 items-center">
              <button
                onClick={handleToggleDictation}
                className={`p-3 rounded-xl transition-all shadow-sm ${
                  isDictating ? 'bg-red-600 text-white animate-pulse' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
                title="Dictar per Veu (Speech-to-Text)"
              >
                <Mic size={18} />
              </button>

              <input
                type="text"
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCopilotQuery()}
                placeholder="Escriu o dicta la tasca (ex: 'fuga aigua camp 3')..."
                className="flex-1 p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:border-emerald-600"
              />

              <button
                onClick={() => handleSendCopilotQuery()}
                className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-md"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHECKLIST MATERIALS MAGATZEM */}
      {showMaterialChecklistModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-100">
              <div>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                  Stock Magatzem Central
                </span>
                <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2 mt-1">
                  <Package className="text-emerald-600" size={22} />
                  Checklist de Materials del Magatzem
                </h3>
              </div>
              <button onClick={() => setShowMaterialChecklistModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X size={22} />
              </button>
            </div>

            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="Cercar material al magatzem per nom, SKU o ubicació..."
                value={checklistMaterialSearch}
                onChange={(e) => setChecklistMaterialSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:border-emerald-600 font-medium"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {WAREHOUSE_MATERIALS_DB.filter(m => m.name.toLowerCase().includes(checklistMaterialSearch.toLowerCase()) || m.code.toLowerCase().includes(checklistMaterialSearch.toLowerCase())).map((item) => {
                const isChecked = materials.some(m => m.name.toLowerCase().trim() === item.name.toLowerCase().trim());
                return (
                  <div 
                    key={item.id}
                    onClick={() => toggleMaterialChecklist(item)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isChecked ? 'bg-emerald-50 border-emerald-400 shadow-sm' : 'bg-neutral-50/70 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-emerald-700">
                        {isChecked ? <CheckSquare size={20} className="fill-emerald-600 text-white" /> : <Square size={20} className="text-neutral-400" />}
                      </div>
                      <div>
                        <span className="text-xs font-mono font-bold text-neutral-500">{item.code}</span>
                        <h4 className="font-bold text-neutral-900 text-xs">{item.name}</h4>
                        <span className="text-[10px] text-neutral-500">Stock disponible: <strong className="text-emerald-800">{item.stock}</strong> • Ubicació: {item.location}</span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-emerald-800 bg-white border border-emerald-200 px-2.5 py-1 rounded-lg">
                      Qty: {item.defaultUnit}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-800">
                {materials.length} materials seleccionats per a l'ordre
              </span>
              <button 
                onClick={() => setShowMaterialChecklistModal(false)}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-md"
              >
                Confirmar Selecció
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHECKLIST EINES MAGATZEM */}
      {showToolChecklistModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-100">
              <div>
                <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">
                  Inventari d'Eines i Maquinària
                </span>
                <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2 mt-1">
                  <PenTool className="text-blue-600" size={22} />
                  Checklist d'Eines del Magatzem
                </h3>
              </div>
              <button onClick={() => setShowToolChecklistModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X size={22} />
              </button>
            </div>

            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="Cercar eina per nom, marca o codi..."
                value={checklistToolSearch}
                onChange={(e) => setChecklistToolSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:border-blue-600 font-medium"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {WAREHOUSE_TOOLS_DB.filter(t => t.name.toLowerCase().includes(checklistToolSearch.toLowerCase()) || t.code.toLowerCase().includes(checklistToolSearch.toLowerCase())).map((item) => {
                const isChecked = tools.some(t => t.toLowerCase().trim() === item.name.toLowerCase().trim());
                return (
                  <div 
                    key={item.id}
                    onClick={() => toggleToolChecklist(item.name)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isChecked ? 'bg-blue-50 border-blue-400 shadow-sm' : 'bg-neutral-50/70 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-blue-700">
                        {isChecked ? <CheckSquare size={20} className="fill-blue-600 text-white" /> : <Square size={20} className="text-neutral-400" />}
                      </div>
                      <div>
                        <span className="text-xs font-mono font-bold text-neutral-500">{item.code}</span>
                        <h4 className="font-bold text-neutral-900 text-xs">{item.name}</h4>
                        <span className="text-[10px] text-neutral-500">Marca: {item.brand} • Assignat a: <strong className="text-neutral-800">{item.assignedTo}</strong></span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      {item.status}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex justify-between items-center">
              <span className="text-xs font-bold text-blue-800">
                {tools.length} eines assignades a l'ordre
              </span>
              <button 
                onClick={() => setShowToolChecklistModal(false)}
                className="px-6 py-2.5 bg-blue-700 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors shadow-md"
              >
                Confirmar Selecció
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="p-xl pt-32 text-center text-primary font-body-strong">
        Carregant formulari de redacció...
      </div>
    }>
      <CreateJobForm />
    </Suspense>
  );
}
