'use client';

import React, { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Package, PenTool, Search, Check, Plus, X, ListCheck, Building2, Wrench, ShieldCheck, Sparkles, CheckSquare, Square, Bot, Send, Mic, AlertTriangle, Calendar, FileText, DollarSign, History, Truck, ArrowRight, RefreshCw, CheckCircle2, Edit3, Tag, MapPin, Navigation, Crosshair, Compass, UserCheck, Users, Phone, User, FileCheck, Receipt } from 'lucide-react';

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

interface BudgetItemLine {
  id: string;
  code: string;
  name: string;
  category: 'MATERIAL' | 'MA_OBRA' | 'VEHICLE' | 'DESPLAÇAMENT' | 'EINA';
  qty: number;
  unit: string;
  unitPrice: number;
}

interface WorkerItem {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: 'DISPONIBLE' | 'EN_FEINA' | 'VACANCES';
  avatar: string;
}

const FIELD_WORKERS_DB: WorkerItem[] = [];

const HISTORIAL_CARPETA_FILES_DB: any[] = [];

const WAREHOUSE_MATERIALS_DB: WarehouseMaterialItem[] = [];

const WAREHOUSE_TOOLS_DB: WarehouseToolItem[] = [];

const VEHICLES_FLOTA_DB: VehicleItem[] = [];

const MOCK_AVATARS = ['👨‍🌾', '👷‍♂️', '🚜', '🔧', '🦺'];

const INCIDENCIES_DB: any[] = [];

function CreateJobForm() {
  const router = useRouter();
  
  const [FIELD_WORKERS_DB, setFieldWorkersDB] = useState<WorkerItem[]>([]);

  // Carregar els operaris de la base de dades local (Creats a Configuració)
  useEffect(() => {
    const saved = localStorage.getItem('campopro_staff');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const mappedWorkers = parsed.map((u: any, idx: number) => ({
          id: u.id,
          name: u.name,
          role: u.roleLabel || u.role,
          status: u.status,
          avatar: u.photoUrl ? (
            <img src={u.photoUrl} alt={u.name} className="w-full h-full object-cover rounded-2xl" />
          ) : MOCK_AVATARS[idx % MOCK_AVATARS.length],
          phone: u.phone
        }));
        setFieldWorkersDB(mappedWorkers);
      } catch(e) {
        console.error(e);
      }
    } else {
      // Dummy worker fallback if no workers were created
      setFieldWorkersDB([
        { id: 'w1', name: 'Operari PWA (Test)', role: 'Operari', status: 'DISPONIBLE', avatar: '👨‍🌾', phone: '600000000' }
      ]);
    }
  }, []);

  const searchParams = useSearchParams();

  // Only pre-fill if explicitly passed via query parameter (e.g. from client detail page: /gestio/feines/crear?clientId=1)
  const rawClientIdParam = searchParams.get('clientId') || searchParams.get('client') || '';

  const clientsDb: Record<string, { 
    name: string; 
    nif: string; 
    phone: string; 
    contact: string; 
    address: string; 
    lat: number; 
    lng: number;
    parcelPresets: Array<{ name: string; lat: number; lng: number }>
  }> = {};

  const isFromClientFile = Boolean(rawClientIdParam && clientsDb[rawClientIdParam]);
  const initialClientId = isFromClientFile ? rawClientIdParam : '';
  const selectedClient = isFromClientFile ? clientsDb[rawClientIdParam] : null;

  // Form States
  const [selectedClientId, setSelectedClientId] = useState<string>(initialClientId);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('op1');
  const [priority, setPriority] = useState<'URGENT' | 'NORMAL' | 'BAIXA'>('NORMAL');
  const [description, setDescription] = useState<string>('');
  const [estimatedHours, setEstimatedHours] = useState<string>('4');
  const [hasBlueprint, setHasBlueprint] = useState<boolean>(false);
  const [blueprintName, setBlueprintName] = useState<string>('');
  const [assignedVehicle, setAssignedVehicle] = useState<string>('');
  const [proposedStartDate, setProposedStartDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // GPS Coordinates
  const [jobLat, setJobLat] = useState<number>(selectedClient ? selectedClient.lat : 41.6521);
  const [jobLng, setJobLng] = useState<number>(selectedClient ? selectedClient.lng : 1.8322);
  const [jobLocationName, setJobLocationName] = useState<string>(selectedClient ? '📍 Finca Principal (Entrada)' : '');

  const [materials, setMaterials] = useState<Array<{ id: string; name: string; qty: string }>>([]);
  const [newMaterial, setNewMaterial] = useState<string>('');
  const [newMaterialQty, setNewMaterialQty] = useState<string>('');

  const [tools, setTools] = useState<string[]>([]);
  const [newTool, setNewTool] = useState<string>('');

  // FULL ITEMIZED COMPREHENSIVE BUDGET TABLE (Reflecteix la TOTALITAT del pressupost: Materials + Eines + Mà d'Obra + Vehicle + Desplaçament)
  const [fullBudgetLines, setFullBudgetLines] = useState<BudgetItemLine[]>([]);

  // Automatically recalculate the TOTALITY of the budget whenever materials, hours, tools, or vehicle change
  useEffect(() => {
    const lines: BudgetItemLine[] = [];

    // 1. Materials lines
    materials.forEach((m, idx) => {
      const dbMat = WAREHOUSE_MATERIALS_DB.find(wm => wm.name.toLowerCase().trim() === m.name.toLowerCase().trim());
      const numQty = parseFloat(m.qty.replace(/[^0-9.]/g, '')) || 1;
      const unitPrice = dbMat ? dbMat.unitPrice : 12.50;
      
      lines.push({
        id: `b-mat-${idx}-${Date.now()}`,
        code: dbMat ? dbMat.code : `MAT-00${idx + 1}`,
        name: `Material: ${m.name}`,
        category: 'MATERIAL',
        qty: numQty,
        unit: m.qty.replace(/[0-9.]/g, '').trim() || 'u',
        unitPrice: unitPrice
      });
    });

    // 2. Labor Hours line
    const hrs = parseFloat(estimatedHours) || 4;
    lines.push({
      id: `b-labor-${Date.now()}`,
      code: 'SERV-001',
      name: 'Mà d\'Obra Tècnica (Hores Operari)',
      category: 'MA_OBRA',
      qty: hrs,
      unit: 'h',
      unitPrice: 35.00
    });

    // 3. Vehicle & Machinery line
    const isTractor = assignedVehicle.includes('Tractor');
    lines.push({
      id: `b-veh-${Date.now()}`,
      code: isTractor ? 'SERV-002' : 'SERV-003',
      name: isTractor ? 'Ús de Maquinària (Hora Tractor)' : 'Transport i Vehicle Logístic',
      category: 'VEHICLE',
      qty: isTractor ? 3 : 1,
      unit: isTractor ? 'h' : 'viatge',
      unitPrice: isTractor ? 65.00 : 50.00
    });

    // 4. Emergency Displacement line
    lines.push({
      id: `b-desp-${Date.now()}`,
      code: 'SERV-004',
      name: 'Desplaçament Tècnic d\'Emergència',
      category: 'DESPLAÇAMENT',
      qty: 1,
      unit: 'trajecte',
      unitPrice: 40.00
    });

    setFullBudgetLines(lines);
  }, [materials, estimatedHours, assignedVehicle]);

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
      text: `Hola Marc! Sóc el teu **Copilot Tècnic CampoPro**. He integrat la **TOTALITAT del Pressupost (Materials + Eines + Mà d'obra + Vehicle + Desplaçament)** recuperables per a la factura final del client.\n\nEscriu o dicta la tasca (ex: *"fuga aigua camp 3"*) per generar el pressupost complet.`
    }
  ]);

  // Recalculate Total Comprehensive Budget
  const calculateTotalComprehensiveBudget = (): number => {
    return fullBudgetLines.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  };

  const handleUpdateBudgetLine = (id: string, field: 'qty' | 'unitPrice', valStr: string) => {
    const num = parseFloat(valStr) || 0;
    setFullBudgetLines(fullBudgetLines.map(item => item.id === id ? { ...item, [field]: num } : item));
  };

  const handleRemoveBudgetLine = (id: string) => {
    setFullBudgetLines(fullBudgetLines.filter(item => item.id !== id));
  };

  const handleClientSelect = (id: string) => {
    setSelectedClientId(id);
    if (id && clientsDb[id]) {
      const client = clientsDb[id];
      setJobLat(client.lat);
      setJobLng(client.lng);
      setJobLocationName(client.parcelPresets[0]?.name || '📍 Finca Principal');
    } else {
      setJobLat(41.6521);
      setJobLng(1.8322);
      setJobLocationName('');
    }
  };

  const activeClient = selectedClientId ? clientsDb[selectedClientId] : null;
  const activeWorker = FIELD_WORKERS_DB.find(w => w.id === selectedWorkerId) || (FIELD_WORKERS_DB.length > 0 ? FIELD_WORKERS_DB[0] : null);

  const handleSelectParcelPreset = (preset: { name: string; lat: number; lng: number }) => {
    setJobLat(preset.lat);
    setJobLng(preset.lng);
    setJobLocationName(preset.name);
  };

  // COPILOT IA EXECUTES SYSTEM PROMPT v2 BY REFERENCING /backend/app/data/historial/*.json
  const handleSendCopilotQuery = async (userQueryText?: string) => {
    const query = (userQueryText || copilotInput).trim();
    if (!query) return;

    const updatedHistory = [...chatHistory, { sender: 'user' as const, text: query }];
    setChatHistory(updatedHistory);
    setCopilotInput('');
    setIsCopilotThinking(true);

    const queryLower = query.toLowerCase();

    // 1. CLASSIFY THE JOB (ÀMBIT, ELEMENT PRINCIPAL, ABAST)
    let ambitTarget = 'Sistema de Reg i Hidràulica';
    let elementTarget = 'Canonada PE';
    
    if (queryLower.includes('fuga') || queryLower.includes('aigua') || queryLower.includes('tub') || queryLower.includes('reg') || queryLower.includes('canonada')) {
      ambitTarget = 'Sistema de Reg i Hidràulica';
      elementTarget = 'Canonada PE 90mm';
    } else if (queryLower.includes('sensor') || queryLower.includes('electric') || queryLower.includes('quadre') || queryLower.includes('iot') || queryLower.includes('cable')) {
      ambitTarget = 'Instal·lació Elèctrica i Sensorització IOT';
      elementTarget = 'Quadre Elèctric & Sensor IOT';
    } else if (queryLower.includes('adobat') || queryLower.includes('terra') || queryLower.includes('llaurar') || queryLower.includes('tractor') || queryLower.includes('poda')) {
      ambitTarget = 'Treballs Agrícoles i Moviment de Terres';
      elementTarget = 'Adobat Foliar & Tractor Pala';
    } else if (queryLower.includes('bomba') || queryLower.includes('motor') || queryLower.includes('filtre') || queryLower.includes('pressio')) {
      ambitTarget = 'Estació de Bombeig i Pressurització';
      elementTarget = 'Bomba de Reg i Filtres de Pressió';
    } else {
      ambitTarget = 'Intervenció General de Camp';
      elementTarget = 'Altres elements de camp';
    }

    // 2. STRICT 3-STAGE FILTERING AGAINST THE HISTORY FOLDER (/backend/app/data/historial/*.json)
    // Filter 1: Àmbit (Scope)
    // Filter 2: Element/Material Principal
    // Filter 3: Abast/Magnitud
    const matchedHistoryFile = HISTORIAL_CARPETA_FILES_DB.find(h => {
      const matchScope = h.ambit.toLowerCase() === ambitTarget.toLowerCase();
      const matchElement = h.element_principal.toLowerCase().includes(elementTarget.toLowerCase()) || elementTarget.toLowerCase().includes(h.element_principal.toLowerCase());
      return matchScope && matchElement;
    });

    let coincidenciaObj: { feina_referencia_id: string | null; nivell_coincidencia: 'alta' | 'mitjana' | 'sense_precedent'; motiu: string };
    let ajustAprenentatgeObj: { factor_aplicat: string; origen: string; confianca_estimacio: 'alta' | 'mitjana' | 'baixa' };
    let calculatedHours = 4.0;
    let requiredMaterials: Array<{ name: string; qty: string; unitPrice: number; code: string }> = [];
    let requiredTools: string[] = [];
    let requiresTractor = false;
    let recommendedWorkerObj = FIELD_WORKERS_DB[0];

    if (matchedHistoryFile) {
      // MATCH FOUND IN HISTORY FOLDER! Apply real hours, PWA deviation & materials from history file
      coincidenciaObj = {
        feina_referencia_id: matchedHistoryFile.id,
        nivell_coincidencia: 'alta',
        motiu: `Validat amb èxit l'arxiu ${matchedHistoryFile.file} que compleix els 3 filtres del System Prompt (Àmbit: ${matchedHistoryFile.ambit}, Element: ${matchedHistoryFile.element_principal}).`
      };

      const deviationHours = matchedHistoryFile.hores_reals_pwa - matchedHistoryFile.hores_estimades_pressupost;
      ajustAprenentatgeObj = {
        factor_aplicat: deviationHours > 0 ? `+${(deviationHours * 10).toFixed(0)}%` : '0%',
        origen: `Desviació real PWA registrada a la fitxa d'obra de ${matchedHistoryFile.id} (${matchedHistoryFile.hores_reals_pwa}h reals vs ${matchedHistoryFile.hores_estimades_pressupost}h estimades)`,
        confianca_estimacio: 'alta'
      };

      calculatedHours = matchedHistoryFile.hores_reals_pwa;
      requiredMaterials = matchedHistoryFile.materials_usats.map((m: any, idx: number) => ({
        name: m.name,
        qty: m.qty,
        unitPrice: m.unitPrice,
        code: `MAT-00${idx + 1}`
      }));
      requiredTools = matchedHistoryFile.eines_usades;
      requiresTractor = matchedHistoryFile.vehicle_usat.includes('Tractor');
      recommendedWorkerObj = FIELD_WORKERS_DB.find(w => w.name.includes(matchedHistoryFile.operari_principal)) || FIELD_WORKERS_DB[0];

    } else {
      // NO MATCHING FILE IN HISTORY FOLDER DISCARDED BY ANTI-BLIND COPY RULE!
      coincidenciaObj = {
        feina_referencia_id: null,
        nivell_coincidencia: 'sense_precedent',
        motiu: `Regla Anti-Còpia Cega (Filtre 1 i 2): Cap feina a la carpeta d'historial (/backend/app/data/historial/) és directament comparable amb l'àmbits '${ambitTarget}'. S'aplica càlcul base de magatzem amb "sense_precedent_directe": true.`
      };

      ajustAprenentatgeObj = {
        factor_aplicat: '+10% (Marge de Seguretat Estàndard)',
        origen: "Sense precedent directe a la carpeta d'historial. Requereix revisió manual de l'enginyer.",
        confianca_estimacio: 'baixa'
      };

      calculatedHours = Math.max(3.0, Math.min(8.0, Math.round((query.length / 7) * 10) / 10));
      requiredMaterials = [
        { name: 'Connector Rapid Inox 2 polzades', qty: '2u', unitPrice: 42.00, code: 'MAT-006' },
        { name: 'Cinta de Teflon Professional', qty: '2u', unitPrice: 2.10, code: 'MAT-003' }
      ];
      requiredTools = [];
      requiresTractor = queryLower.includes('finca') || queryLower.includes('parcella');
      recommendedWorkerObj = FIELD_WORKERS_DB[0];
    }

    // 3. VEHICLES & ALERTS
    const targetVehicle = requiresTractor 
      ? VEHICLES_FLOTA_DB.find(v => v.type.includes('Tractor')) || VEHICLES_FLOTA_DB[1]
      : VEHICLES_FLOTA_DB[0];

    const hasVehicleAlert = targetVehicle?.status === 'REVISIO_TALLER';

    // 4. ITEMIZE COMPREHENSIVE BUDGET LINES FROM WAREHOUSE CATALOG
    const copilotBudgetLines: BudgetItemLine[] = [
      ...requiredMaterials.map((m, i) => ({
        id: `c-mat-${i}-${Date.now()}`,
        code: m.code,
        name: `Material: ${m.name}`,
        category: 'MATERIAL' as const,
        qty: parseFloat(m.qty.replace(/[^0-9.]/g, '')) || 1,
        unit: m.qty.replace(/[0-9.]/g, '').trim() || 'u',
        unitPrice: m.unitPrice
      })),
      { 
        id: `c-labor-${Date.now()}`, 
        code: 'SERV-001', 
        name: `Mà d'Obra Tècnica (${ambitTarget})`, 
        category: 'MA_OBRA' as const, 
        qty: calculatedHours, 
        unit: 'h', 
        unitPrice: 35.00 
      },
      { 
        id: `c-veh-${Date.now()}`, 
        code: requiresTractor ? 'SERV-002' : 'SERV-003', 
        name: requiresTractor ? `Ús de Maquinària Agrícola (${targetVehicle.name})` : `Transport i Vehicle (${targetVehicle.name})`, 
        category: 'VEHICLE' as const, 
        qty: requiresTractor ? Math.ceil(calculatedHours * 0.6) : 1, 
        unit: requiresTractor ? 'h' : 'viatge', 
        unitPrice: requiresTractor ? 65.00 : 50.00 
      },
      { 
        id: `c-desp-${Date.now()}`, 
        code: 'SERV-004', 
        name: 'Desplaçament Tècnic a Finca', 
        category: 'DESPLAÇAMENT' as const, 
        qty: 1, 
        unit: 'trajecte', 
        unitPrice: 40.00 
      }
    ];

    const totalCalc = copilotBudgetLines.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);

    const proposalData = {
      title: matchedHistoryFile ? matchedHistoryFile.titol : `Intervenció Tècnica: ${query}`,
      matchedCode: matchedHistoryFile ? matchedHistoryFile.id : `OT-${Math.floor(100 + Math.random() * 900)}`,
      coincidencia_historial: coincidenciaObj,
      ajust_aprenentatge: ajustAprenentatgeObj,
      description: matchedHistoryFile 
        ? `Ordre basada en l'arxiu d'historial ${matchedHistoryFile.file}. ${matchedHistoryFile.titol}.` 
        : `Sense precedent directe a l'historial. Calculat amb tarifes base de magatzem per a ${ambitTarget}.`,
      estimatedHours: String(calculatedHours),
      recommendedWorker: recommendedWorkerObj,
      materials: requiredMaterials.map((m, idx) => ({ id: `${idx}`, name: m.name, qty: m.qty })),
      tools: requiredTools,
      vehicle: targetVehicle,
      hasVehicleAlert: hasVehicleAlert,
      alertText: hasVehicleAlert ? `⚠️ ALERTA DE VEHICLE: El ${targetVehicle?.name} (${targetVehicle?.plate}) està en REVISIÓ AL TALLER fins dijous.` : null,
      proposedStartDate: hasVehicleAlert ? '2026-08-06' : new Date().toISOString().split('T')[0],
      proposedStartDateFormatted: hasVehicleAlert ? 'Dijous 06/08/2026 (Disponibilitat de maquinària)' : 'Avui mateix',
      fullBudgetLines: copilotBudgetLines,
      calculatedBudget: `${totalCalc.toFixed(2)} €`,
      lat: selectedClient?.lat || 41.5,
      lng: selectedClient?.lng || 2.0,
      locationName: selectedClient?.parcelPresets[0]?.name || '📍 Finca Principal'
    };

    setTimeout(() => {
      setCopilotProposal(proposalData);
      setChatHistory([
        ...updatedHistory,
        {
          sender: 'bot',
          text: `📁 **Referència Carpeta Historial (/backend/app/data/historial/):**\n- **Feina d'Historial:** ${coincidenciaObj.feina_referencia_id || 'Cap (Sense precedent directe)'}\n- **Nivell Coincidència:** ${coincidenciaObj.nivell_coincidencia.toUpperCase()}\n- **Motiu:** ${coincidenciaObj.motiu}\n- **Ajust d'Aprenentatge:** ${ajustAprenentatgeObj.factor_aplicat} (${ajustAprenentatgeObj.origen})\n\n💰 **Total Pressupost Calculat:** **${totalCalc.toFixed(2)} €**`,
          proposal: proposalData
        }
      ]);

      setIsCopilotThinking(false);
    }, 700);
  };

  const handleToggleDictation = () => {
    if (isDictating) {
      setIsDictating(false);
    } else {
      setIsDictating(true);
      setCopilotInput('Escoltant la teva veu...');
      
      const sampleQueries = [
        "Reparació bomba de reg del sector nord",
        "Revisió del quadre elèctric de l'invernacle",
        "Adobat foliar i llaurada del camp 5 amb tractor",
        "Fuga d'aigua a la canonada principal del camp 3",
        "Substitució de valva de seguretat i filtre de malla"
      ];
      const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];

      setTimeout(() => {
        setCopilotInput(randomQuery);
        setIsDictating(false);
        handleSendCopilotQuery(randomQuery);
      }, 1500);
    }
  };

  const applyCopilotProposalToForm = () => {
    if (!copilotProposal) return;

    setDescription(copilotProposal.description);
    setEstimatedHours(copilotProposal.estimatedHours);
    setPriority(copilotProposal.hasVehicleAlert ? 'URGENT' : 'NORMAL');
    setProposedStartDate(copilotProposal.proposedStartDate);
    setFullBudgetLines(copilotProposal.fullBudgetLines);

    if (copilotProposal.recommendedWorker) {
      setSelectedWorkerId(copilotProposal.recommendedWorker.id);
    }

    if (copilotProposal.lat && copilotProposal.lng) {
      setJobLat(copilotProposal.lat);
      setJobLng(copilotProposal.lng);
      setJobLocationName(copilotProposal.locationName || '📍 Ubicació Assignada');
    }

    if (copilotProposal.vehicle) {
      setAssignedVehicle(`${copilotProposal.vehicle.name} (${copilotProposal.vehicle.plate})`);
    }

    setMaterials(copilotProposal.materials);
    setTools(copilotProposal.tools);

    setShowCopilotModal(false);
    alert(`✨ S'ha aplicat tota la proposta del Copilot IA a l'Ordre de Treball! Incloent el pressupost total de ${copilotProposal.calculatedBudget} recuperable per a la factura final.`);
  };

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
    // VALIDACIÓ DE RANG DE TEMPS PER OPERARI (HORES)
    if (activeWorker && proposedStartDate) {
      const savedTasksStr = localStorage.getItem('campopro_mock_tasks') || '[]';
      const savedTasks = JSON.parse(savedTasksStr);
      
      const newStart = new Date(proposedStartDate).getTime();
      const newEnd = newStart + (Number(estimatedHours) || 1) * 3600000; // hours to ms

      const hasConflict = savedTasks.some((t: any) => {
        if (t.workerId !== activeWorker.id) return false;
        
        const existingStart = new Date(t.date).getTime();
        const existingEnd = existingStart + (Number(t.hours) || 1) * 3600000;
        
        // Verifica si hi ha encavallament: (Inici1 < Fi2) i (Fi1 > Inici2)
        return newStart < existingEnd && newEnd > existingStart;
      });

      if (hasConflict) {
        const dateStr = new Date(proposedStartDate).toLocaleString('ca-ES');
        alert(`❌ ERROR D'ASSIGNACIÓ:\nL'operari ${activeWorker.name} ja té una altra tasca assignada que s'encavalla amb aquest horari (${dateStr}). Si us plau, tria una altra hora d'inici o un altre operari lliure en aquest rang de temps.`);
        return; // Atura el procés de creació
      }

      // Desa la nova tasca a l'historial per futures validacions
      savedTasks.push({
        workerId: activeWorker.id,
        date: proposedStartDate,
        hours: estimatedHours
      });
      localStorage.setItem('campopro_mock_tasks', JSON.stringify(savedTasks));
    }

    const totalSum = calculateTotalComprehensiveBudget().toFixed(2);
    const clientName = activeClient ? activeClient.name : 'el client seleccionat';
    alert(`Ordre de Treball i Pressupost #${Date.now().toString().slice(-5)} creats amb èxit per a ${clientName}! Total Pressupost: ${totalSum} €. Aquest pressupost queda arxivat i serà 100% recuperable per generar la factura oficial.`);
    if (selectedClientId) {
      router.push(`/gestio/clients/${selectedClientId}`);
    } else {
      router.push(`/gestio`);
    }
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
        <span className="text-primary font-body-strong">Redacció de Feina {activeClient ? `(${activeClient.name})` : ''}</span>
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
              La taula reflecteix la TOTALITAT del pressupost (Materials + Eines + Mà d'Obra + Vehicle + Desplaçament) i queda registrada per convertir-se en factura oficial.
            </p>
          </div>

          {/* AI COPILOT CHAT TRIGGER BUTTON */}
          <button
            onClick={() => setShowCopilotModal(true)}
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-700 to-primary text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 hover:scale-105 active:scale-95 text-sm"
          >
            <Bot size={22} className="text-amber-300 animate-bounce" />
            🤖 Obrir Copilot IA (Calculador de Pressupost)
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
                  {selectedClientId ? `ID #${selectedClientId}` : 'Cap client seleccionat'}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-xs text-on-surface-variant">SELECCIONAR CLIENT</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => handleClientSelect(e.target.value)}
                  className="w-full bg-surface-container-low p-3.5 rounded-xl border border-outline-variant font-body-strong text-primary outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="">-- Selecciona un client --</option>
                  {Object.entries(clientsDb).map(([id, c]) => (
                    <option key={id} value={id}>
                      {c.name} — {c.nif} ({c.contact})
                    </option>
                  ))}
                </select>
              </div>

              {activeClient ? (
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
              ) : (
                <div className="bg-surface-container-low p-md rounded-xl border border-dashed border-outline-variant text-sm text-center text-on-surface-variant">
                  <p className="italic">💡 Cap client seleccionat. Selecciona un client del desplegable per carregar la seva informació fiscal i finques.</p>
                </div>
              )}
            </div>

            {/* Card 2: FIELD WORKER ASSIGNMENT SELECTOR */}
            <div className="p-xl bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-md">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
                <h2 className="font-section-title text-primary flex items-center gap-2 text-lg">
                  <UserCheck size={20} className="text-emerald-700" />
                  Assignació d'Operari de Camp i Cap d'Equip
                </h2>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Users size={14} /> PWA Operari Sincronitzada
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-xs text-on-surface-variant">OPERARI PRINCIPAL ASSIGNAT</label>
                <select
                  value={selectedWorkerId}
                  onChange={(e) => setSelectedWorkerId(e.target.value)}
                  className="w-full bg-surface-container-low p-3.5 rounded-xl border border-outline-variant font-body-strong text-primary outline-none cursor-pointer text-sm"
                >
                  {FIELD_WORKERS_DB.map((worker) => (
                    <option key={worker.id} value={worker.id}>
                      {worker.avatar} {worker.name} — {worker.role} ({worker.status})
                    </option>
                  ))}
                </select>
              </div>

              {activeWorker ? (
                <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-2xl border border-emerald-200 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-2xl shadow">
                      {activeWorker.avatar}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block">{activeWorker.name}</span>
                      <span className="text-[11px] text-neutral-600 block">{activeWorker.role}</span>
                      <span className="text-[10px] text-emerald-800 font-mono flex items-center gap-1 mt-0.5">
                        <Phone size={10} /> Telèfon directe: {activeWorker.phone}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      🟢 Rebrà l'Ordre a la PWA Mòbil
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-surface-container-low p-md rounded-xl border border-dashed border-outline-variant text-sm text-center text-on-surface-variant mt-4">
                  <p className="italic">💡 No hi ha cap operari disponible actualment per assignar.</p>
                </div>
              )}
            </div>

            {/* Card 3: CONFIGURABLE GPS LOCATION FOR WORKER NAVIGATION */}
            <div className="p-xl bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-md">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
                <h2 className="font-section-title text-primary flex items-center gap-2 text-lg">
                  <MapPin size={20} className="text-emerald-600" />
                  Ubicació GPS Configurable (Assignada a l'Operari)
                </h2>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Navigation size={12} /> Google Maps / Waze
                </span>
              </div>

              <div>
                <label className="font-label-caps text-xs text-on-surface-variant block mb-2">PUNTS I SECTORS DESTACATS DE LA FINCA (SELECCIÓ RÀPIDA):</label>
                <div className="flex flex-wrap gap-2">
                  {activeClient?.parcelPresets.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectParcelPreset(preset)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                        jobLocationName === preset.name ? 'bg-emerald-700 text-white border-emerald-800 shadow-md scale-105' : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-neutral-600 uppercase flex items-center gap-1">
                    <Compass size={14} className="text-emerald-600" /> Latitud GPS (Lat)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={jobLat}
                    onChange={(e) => {
                      setJobLat(parseFloat(e.target.value) || 0);
                      setJobLocationName('📍 Punt Personalitzat (Manual)');
                    }}
                    className="p-3 bg-white border border-neutral-300 rounded-xl text-sm font-bold text-neutral-900 outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-neutral-600 uppercase flex items-center gap-1">
                    <Compass size={14} className="text-emerald-600" /> Longitud GPS (Lng)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={jobLng}
                    onChange={(e) => {
                      setJobLng(parseFloat(e.target.value) || 0);
                      setJobLocationName('📍 Punt Personalitzat (Manual)');
                    }}
                    className="p-3 bg-white border border-neutral-300 rounded-xl text-sm font-bold text-neutral-900 outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="relative h-[220px] rounded-2xl overflow-hidden shadow-md border border-neutral-300">
                <div 
                  className="w-full h-full bg-cover bg-center transition-all" 
                  style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCvbJjUps0q9YpuQkGaY5sRz2m_ti7khbFlM6-CHmI8ykOmRLmMra7akOY7vF9x65dHzRdZQqeacIz_LPhVHInJ6E5g_v9awm4ReTUw-3hPNQx830GX3GzrxqwDyK6kSXn8aKLHSmKwRXY8OuBTccG5OdGUf_k9PET1PNq96ySs7M2WQDY9UzJh9kW2ZeGatQwHH-6Msl2sF7P22CxWNJs7BHja5JGG0qkVly74n-qHHixvQx472LXu')` }}
                ></div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-red-600 text-white p-3 rounded-full shadow-2xl animate-bounce border-2 border-white flex items-center gap-1">
                    <MapPin size={22} className="fill-white text-red-600" />
                    <span className="text-xs font-bold font-mono px-1">{jobLocationName}</span>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-white shadow">
                  📍 Coordenades Ordre: {jobLat}° N, {jobLng}° E
                </div>
              </div>
            </div>

            {/* Card 4: Job Description, Hours & Proposed Dates */}
            <div className="p-xl bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-md">
              <div className="flex justify-between items-center">
                <h2 className="font-section-title text-primary flex items-center gap-2 text-lg">
                  <span className="material-symbols-outlined text-primary">description</span>
                  Descripció i Planificació de la Feina
                </h2>

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
                  <label className="font-label-caps text-xs text-on-surface-variant">DATA I HORA D'INICI RECOMANADA</label>
                  <input
                    type="datetime-local"
                    value={proposedStartDate}
                    onChange={(e) => setProposedStartDate(e.target.value)}
                    className="w-full bg-surface-container-low p-3.5 rounded-xl border border-outline-variant font-body-strong text-primary text-center text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Card 5: Materials & Tools Assignment WITH CHECKLIST & MANUAL OPTION */}
            <div className="p-xl bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-lg">
              <div className="flex flex-col gap-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h3 className="font-headline-md text-primary flex items-center gap-2 text-md">
                    <Package size={20} className="text-primary" />
                    Materials Necessaris Assignats ({materials.length})
                  </h3>

                  <button
                    type="button"
                    onClick={() => setShowMaterialChecklistModal(true)}
                    className="flex items-center gap-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors border border-emerald-300 shadow-sm"
                  >
                    <ListCheck size={16} />
                    📋 Triar del Magatzem (Checklist)
                  </button>
                </div>
                
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

              <div className="flex flex-col gap-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h3 className="font-headline-md text-primary flex items-center gap-2 text-md">
                    <PenTool size={20} className="text-primary" />
                    Eines Necessàries Assignades ({tools.length})
                  </h3>

                  <button
                    type="button"
                    onClick={() => setShowToolChecklistModal(true)}
                    className="flex items-center gap-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors border border-blue-300 shadow-sm"
                  >
                    <ListCheck size={16} />
                    📋 Triar Eines Magatzem (Checklist)
                  </button>
                </div>

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

          {/* Right Column: Vehicle, TOTAL COMPREHENSIVE PRESSUPOST & Blueprints */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-lg">
            
            {/* Card 6: PRESSUPOST (Reflecteix la TOTALITAT del Pressupost: Materials, Eines, Mà d'obra, Vehicle i Desplaçament) */}
            <div className="p-xl bg-gradient-to-br from-emerald-950 via-teal-900 to-primary text-white rounded-3xl shadow-xl border border-emerald-700 flex flex-col gap-md">
              <div className="flex justify-between items-center border-b border-emerald-800 pb-md">
                <h2 className="font-bold flex items-center gap-2 text-xl text-emerald-300">
                  <DollarSign size={24} className="text-emerald-400" />
                  Pressupost
                </h2>
                <span className="text-[10px] font-bold bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Receipt size={12} /> Recuperable per a Factura
                </span>
              </div>

              <p className="text-xs text-emerald-200 leading-relaxed">
                Aquesta taula calcula la <strong>TOTALITAT del Pressupost</strong> combinant materials de magatzem, eines, hores d'operari, vehicle i desplaçament. Queda registrat per convertir-se directament en la factura oficial del client.
              </p>

              {/* Itemized Budget Table */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block mb-1">Desglose Detallat de la Totalitat dels Conceptes:</span>
                
                <div className="space-y-2 bg-emerald-950/70 p-3 rounded-2xl border border-emerald-800/80">
                  {fullBudgetLines.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-2 bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-700/50">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${
                            item.category === 'MATERIAL' ? 'bg-emerald-700' :
                            item.category === 'MA_OBRA' ? 'bg-blue-700' :
                            item.category === 'VEHICLE' ? 'bg-amber-700' : 'bg-purple-700'
                          }`}>
                            {item.category}
                          </span>
                          <span className="font-semibold text-white text-xs truncate block">{item.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Qty Edit */}
                        <div className="flex items-center gap-1 bg-emerald-950 px-2 py-1 rounded-lg border border-emerald-700">
                          <input 
                            type="number" 
                            step="0.5" 
                            value={item.qty} 
                            onChange={(e) => handleUpdateBudgetLine(item.id, 'qty', e.target.value)} 
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
                            onChange={(e) => handleUpdateBudgetLine(item.id, 'unitPrice', e.target.value)} 
                            className="w-14 bg-transparent text-center font-bold text-emerald-300 text-xs outline-none"
                          />
                          <span className="text-[10px] text-emerald-400">€</span>
                        </div>

                        <span className="font-bold text-white w-16 text-right text-xs">{(item.qty * item.unitPrice).toFixed(2)}€</span>

                        <button onClick={() => handleRemoveBudgetLine(item.id)} className="text-emerald-400 hover:text-red-400 p-0.5">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Budget Summary & Invoice Recovery Badge */}
              <div className="flex justify-between items-end pt-3 border-t border-emerald-800">
                <div>
                  <span className="text-xs text-emerald-300 block font-semibold uppercase">TOTAL PRESSUPOSTAT (IVA no inclòs)</span>
                  <span className="text-3xl font-extrabold text-white">{calculateTotalComprehensiveBudget().toFixed(2)} €</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-emerald-300 bg-emerald-900 border border-emerald-700 px-3 py-1.5 rounded-xl flex items-center gap-1 shadow">
                    <FileCheck size={14} className="text-emerald-400" /> Generar Factura en 1-Clic
                  </span>
                </div>
              </div>
            </div>

            {/* Card 7: Vehicle Assignment & Fleet Audit */}
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
                  {VEHICLES_FLOTA_DB.length > 0 ? VEHICLES_FLOTA_DB.map(v => (
                    <option key={v.plate} value={`${v.name} (${v.plate})`}>{v.name} ({v.plate}) — {v.status === 'OPERATIU' ? '🟢 Operatiu' : '🛠️ En Revisió'}</option>
                  )) : (
                    <option value="">-- Cap vehicle disponible --</option>
                  )}
                </select>
              </div>

              {assignedVehicle.includes('Tractor') && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium flex items-center gap-2">
                  <AlertTriangle size={18} className="shrink-0 text-amber-600" />
                  <span>Aquest tractor està al taller. Data estimada d'operativitat: <strong>Dijous 06/08/2026</strong>.</span>
                </div>
              )}
            </div>

            {/* Card 8: Blueprint Attachment */}
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
            Guardar Ordre i Pressupost ({calculateTotalComprehensiveBudget().toFixed(2)} €)
          </button>
        </div>
      </div>

      {/* MODAL COPILOT IA CHAT INTERACTIU */}
      {showCopilotModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-800 text-white flex items-center justify-center shadow-md">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                    Copilot Tècnic CampoPro (IA Grounded)
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                      Calculador de Pressupost Total
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-500">Calcula la totalitat (Materials + Eines + Mà d'obra + Vehicle + Desplaçament).</p>
                </div>
              </div>
              <button onClick={() => setShowCopilotModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X size={24} />
              </button>
            </div>

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

                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center font-bold text-emerald-900 text-xs">
                          <span>TOTAL PRESSUPOSTAT:</span>
                          <span className="text-sm font-extrabold text-emerald-800">{msg.proposal.calculatedBudget}</span>
                        </div>

                        <button
                          onClick={applyCopilotProposalToForm}
                          className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl font-bold text-xs shadow-md hover:from-emerald-700 hover:to-teal-800 transition-all flex items-center justify-center gap-2"
                        >
                          <Sparkles size={16} />
                          ✨ Aplicar Ordre i Pressupost Total al Formulari
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isCopilotThinking && (
                <div className="flex gap-2 text-xs text-neutral-500 items-center bg-neutral-100 p-3 rounded-xl w-fit">
                  <RefreshCw className="animate-spin text-emerald-600" size={16} />
                  <span>Calculant la totalitat del pressupost...</span>
                </div>
              )}
            </div>

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
                      Preu: {item.unitPrice.toFixed(2)} € / {item.defaultUnit}
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
