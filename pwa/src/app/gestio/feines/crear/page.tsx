'use client';

import React, { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Package, PenTool, Search, Check, Plus, X, ListCheck, Building2, Wrench, ShieldCheck, Sparkles, CheckSquare, Square, AlertTriangle, Calendar, FileText, DollarSign, Truck, ArrowRight, CheckCircle2, Tag, MapPin, Navigation, Crosshair, Compass, UserCheck, Users, Phone, User, FileCheck } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

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


interface WorkerItem {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: 'DISPONIBLE' | 'EN_FEINA' | 'VACANCES';
  avatar: string;
}


// Arrays buides: els checklist manuals de magatzem iteraran sobre aquestes.
// Quan siguin buides no mostraran cap element (Zero Dades Fictícies).
const WAREHOUSE_MATERIALS_DB: WarehouseMaterialItem[] = [];
const WAREHOUSE_TOOLS_DB: WarehouseToolItem[] = [];
const VEHICLES_FLOTA_DB: VehicleItem[] = [];

const MOCK_AVATARS = ['👨‍🌾', '👷‍♂️', '🚜', '🔧', '🦺'];

function CreateJobForm() {
  const router = useRouter();
  
  const [FIELD_WORKERS_DB, setFieldWorkersDB] = useState<WorkerItem[]>([]);

  // Carregar els operaris de la base de dades
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const users = await apiClient.get('/users');
        const operaris = users.filter((u: any) => u.rol === 'OPERARI' || u.rol === 'TECNIC');
        const mappedWorkers = operaris.map((u: any, idx: number) => ({
          id: u.id,
          name: u.nom,
          role: u.rol,
          status: u.actiu ? 'DISPONIBLE' : 'VACANCES',
          avatar: MOCK_AVATARS[idx % MOCK_AVATARS.length],
          phone: u.telefon || ''
        }));
        setFieldWorkersDB(mappedWorkers.length > 0 ? mappedWorkers : []);
      } catch (e) {
        console.error(e);
        setFieldWorkersDB([]);
      }
    };
    fetchStaff();
  }, []);

  const searchParams = useSearchParams();

  // Only pre-fill if explicitly passed via query parameter (e.g. from client detail page: /gestio/feines/crear?clientId=1)
  const rawClientIdParam = searchParams.get('clientId') || searchParams.get('client') || '';

  const [clientsDb, setClientsDb] = useState<Record<string, any>>({});
  
  // Form States
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const parsed = await apiClient.get('/clients');
        const db: Record<string, any> = {};
        parsed.forEach((c: any) => {
          db[c.id] = {
            id: c.id,
            name: c.nom,
            nif: c.nif || '',
            contact: c.tipus || 'particular',
            phone: c.telefon,
            address: c.adreca,
            lat: c.lat,
            lng: c.lng,
            parcelPresets: c.lat && c.lng ? [{ name: 'Finca Principal', lat: c.lat, lng: c.lng }] : []
          };
        });
        setClientsDb(db);
        
        // Setup initial client
        const clientIdParam = searchParams.get('clientId') || searchParams.get('client') || '';
        const initId = (clientIdParam && db[clientIdParam]) ? clientIdParam : '';
        setSelectedClientId(initId);
        
        if (initId && db[initId]) {
          setJobLat(db[initId].lat);
          setJobLng(db[initId].lng);
          setJobLocationName(db[initId].parcelPresets?.[0]?.name || '📍 Finca Principal');
        }
      } catch (e) {
        console.error("Error loading clients", e);
      }
    };
    fetchClients();
  }, [searchParams]);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('');

  const activeClient = selectedClientId && clientsDb[selectedClientId] ? clientsDb[selectedClientId] : null;
  const activeWorker = selectedWorkerId ? FIELD_WORKERS_DB.find(w => w.id === selectedWorkerId) : null;
  const [priority, setPriority] = useState<'URGENT' | 'NORMAL' | 'BAIXA'>('NORMAL');
  const [description, setDescription] = useState<string>('');
  const [estimatedHours, setEstimatedHours] = useState<string>('4');
  const [hasBlueprint, setHasBlueprint] = useState<boolean>(false);
  const [blueprintName, setBlueprintName] = useState<string>('');
  const [assignedVehicle, setAssignedVehicle] = useState<string>('');
  const [proposedStartDate, setProposedStartDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // GPS Coordinates
  const [jobLat, setJobLat] = useState<number>(41.6521);
  const [jobLng, setJobLng] = useState<number>(1.8322);
  const [jobLocationName, setJobLocationName] = useState<string>('');

  const [materials, setMaterials] = useState<Array<{ id: string; name: string; qty: string }>>([]);
  const [newMaterial, setNewMaterial] = useState<string>('');
  const [newMaterialQty, setNewMaterialQty] = useState<string>('');

  const [tools, setTools] = useState<string[]>([]);
  const [newTool, setNewTool] = useState<string>('');

  // AI Agent States
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiProposal, setAiProposal] = useState<any>(null);
  const [aiBudget, setAiBudget] = useState<any>(null);


  // Modals for Warehouse Checklist Selection
  const [showMaterialChecklistModal, setShowMaterialChecklistModal] = useState<boolean>(false);
  const [showToolChecklistModal, setShowToolChecklistModal] = useState<boolean>(false);
  const [checklistMaterialSearch, setChecklistMaterialSearch] = useState<string>('');
  const [checklistToolSearch, setChecklistToolSearch] = useState<string>('');


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

  const handleGenerateAiProposal = async () => {
    if (!description.trim()) {
      alert("Si us plau, introdueix una descripció de la feina primer.");
      return;
    }
    setIsAiLoading(true);
    setAiProposal(null);
    setAiBudget(null);
    try {
      const data = await apiClient.post('/ai-agent/generar', {
        descripcio: description,
        client_id: selectedClientId
      });
      setAiProposal(data.proposta);
      setAiBudget(data.pressupost);
      
      if (data.pressupost.hores_estimades) setEstimatedHours(data.pressupost.hores_estimades.toString());
      if (data.pressupost.vehicle_id) setAssignedVehicle(data.pressupost.vehicle_id);
      if (data.pressupost.operari_recomanat_id) setSelectedWorkerId(data.pressupost.operari_recomanat_id);
      
      if (data.pressupost.materials) {
        setMaterials(data.pressupost.materials.map((m: any) => ({
          id: m.material_id,
          name: m.nom,
          qty: m.quantitat.toString()
        })));
      }
      
      if (data.pressupost.eines) {
        setTools(data.pressupost.eines.map((e: any) => e.nom));
      }
      
    } catch (e) {
      console.error(e);
      alert("Error contactant amb l'Agent de Pressupostos.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveOrder = async () => {
    // VALIDACIÓ DE RANG DE TEMPS PER OPERARI (HORES)
    if (activeWorker && proposedStartDate) {
      try {
        const savedTasks = await apiClient.get('/feines');
        
        const newStart = new Date(proposedStartDate).getTime();
        const newEnd = newStart + (Number(estimatedHours) || 1) * 3600000; // hours to ms

        const hasConflict = savedTasks.some((t: any) => {
          const existingStart = new Date(t.data_programada || t.created_at).getTime();
          const existingEnd = existingStart + (Number(t.hores_estimades) || 1) * 3600000;
          return newStart < existingEnd && newEnd > existingStart;
        });

        if (hasConflict) {
          console.warn("Possible encavallament horari detectat");
        }

        // Desa la nova tasca al backend
        await apiClient.post('/feines', {
          client_id: activeClient ? activeClient.id : null,
          titol: description || 'Tasca generada',
          descripcio: description,
          tipus: 'manteniment',
          estat: 'pendent',
          prioritat: priority === 'URGENT' ? 1 : (priority === 'NORMAL' ? 2 : 3),
          lat: jobLat,
          lng: jobLng,
          adreca: activeClient?.address || '',
          data_programada: proposedStartDate,
          hores_estimades: Number(estimatedHours) || 1
        });

        const clientName = activeClient ? activeClient.name : 'el client seleccionat';
        alert(`Ordre de Treball creada amb èxit per a ${clientName}!`);
        
        if (selectedClientId) {
          router.push(`/gestio/clients/${selectedClientId}`);
        } else {
          router.push(`/gestio`);
        }
      } catch (e) {
        console.error(e);
        alert("S'ha produït un error en desar la feina al servidor.");
      }
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
                  {activeClient?.parcelPresets.map((preset: any, i: number) => (
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
                  placeholder="Escriu la descripció de la tasca..."
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
            
            {/* Card 6: PRESSUPOST (AI Agent) */}
            <div className="p-xl bg-gradient-to-br from-emerald-950 via-teal-900 to-primary text-white rounded-3xl shadow-xl border border-emerald-700 flex flex-col gap-md">
              <div className="flex justify-between items-center border-b border-emerald-800 pb-md">
                <h2 className="font-bold flex items-center gap-2 text-xl text-emerald-300">
                  <DollarSign size={24} className="text-emerald-400" />
                  Agent de Pressupostos
                </h2>
              </div>
              
              <button 
                type="button"
                onClick={handleGenerateAiProposal}
                disabled={isAiLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isAiLoading ? "Generant pressupost (Consultant Magatzem/Flota)..." : "Generar Pressupost Automàtic amb IA"}
              </button>

              {aiProposal && (
                <div className="mt-4 p-4 bg-emerald-900/60 rounded-xl border border-emerald-700">
                  <h3 className="font-bold text-emerald-300 mb-2">Proposta de la IA (Confiança: {aiProposal.confianca})</h3>
                  {aiProposal.avisos && aiProposal.avisos.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm text-amber-200">
                      {aiProposal.avisos.map((aviso: any, idx: number) => (
                        <li key={idx}>{aviso}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-emerald-200">Cap incidència detectada en estoc o disponibilitat.</p>
                  )}
                </div>
              )}

              {aiBudget && (
                <div className="mt-4 p-4 bg-emerald-950 rounded-xl border border-emerald-700">
                  <h3 className="font-bold text-emerald-300 mb-2">Resum del Pressupost</h3>
                  <div className="text-sm space-y-1">
                    <p><strong>Hores Estimades:</strong> {aiBudget.hores_estimades}h</p>
                    <p><strong>Materials:</strong> {aiBudget.materials?.length || 0} tipus trobats</p>
                    <p><strong>Eines:</strong> {aiBudget.eines?.length || 0} eines reservades</p>
                    {aiBudget.vehicle_id && <p className="text-emerald-400">✓ Vehicle de transport assignat</p>}
                    {aiBudget.maquinaria_id && <p className="text-amber-400">✓ Maquinària pesada requerida assignada</p>}
                  </div>
                </div>
              )}
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
            Guardar Ordre
          </button>
        </div>
      </div>


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
