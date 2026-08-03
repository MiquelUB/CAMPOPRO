'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Package, PenTool, Search, Check, Plus, X, ListCheck, Building2, Wrench, ShieldCheck, Sparkles, CheckSquare, Square } from 'lucide-react';

interface WarehouseMaterialItem {
  id: string;
  code: string;
  name: string;
  defaultUnit: string;
  stock: string;
  location: string;
}

interface WarehouseToolItem {
  id: string;
  code: string;
  name: string;
  brand: string;
  status: string;
  assignedTo: string;
}

// Mock Warehouse Database for Checklist Selection
const WAREHOUSE_MATERIALS_DB: WarehouseMaterialItem[] = [
  { id: 'wm1', code: 'MAT-001', name: 'Tub PE 25mm High-Density', defaultUnit: '10m', stock: '120m', location: 'Prestatgeria A-1' },
  { id: 'wm2', code: 'MAT-002', name: 'Valvula de Tall 1 polzada Inox', defaultUnit: '2u', stock: '4u', location: 'Caixa B-4' },
  { id: 'wm3', code: 'MAT-003', name: 'Cinta de Teflon Professional', defaultUnit: '1u', stock: '25u', location: 'Caixa B-2' },
  { id: 'wm4', code: 'MAT-004', name: 'Adobat Foliar Nitrogenat 25kg', defaultUnit: '5 sacs', stock: '2 sacs', location: 'Palet N-3' },
  { id: 'wm5', code: 'MAT-005', name: 'Filtre de Malla 2 polzades High-Pressure', defaultUnit: '1u', stock: '8u', location: 'Prestatgeria C-2' },
  { id: 'wm6', code: 'MAT-006', name: 'Connector Rapid Inox 2 polzades', defaultUnit: '4u', stock: '30u', location: 'Caixa A-3' },
  { id: 'wm7', code: 'MAT-007', name: 'Junta Torica Neopre High-Temp', defaultUnit: '10u', stock: '50u', location: 'Caixa A-1' }
];

const WAREHOUSE_TOOLS_DB: WarehouseToolItem[] = [
  { id: 'wt1', code: 'EIN-101', name: 'Trepant Bosch GSR-18', brand: 'Bosch Pro', status: '🟢 Operativa', assignedTo: 'Magatzem Central' },
  { id: 'wt2', code: 'EIN-102', name: 'Radial Makita 125mm', brand: 'Makita', status: '🟢 Operativa', assignedTo: 'Magatzem Central' },
  { id: 'wt3', code: 'EIN-103', name: 'Nivell Laser Topcon RL-H5A', brand: 'Topcon', status: '🟢 Operativa', assignedTo: 'Pau Ribas' },
  { id: 'wt4', code: 'EIN-104', name: 'Joc de Claus Stillson Heavy-Duty', brand: 'Palmera', status: '🟢 Operativa', assignedTo: 'Magatzem Central' },
  { id: 'wt5', code: 'EIN-105', name: 'Detector de Metalls i Cables Subterrani', brand: 'Bosch Pro', status: '🟢 Operativa', assignedTo: 'Magatzem Central' },
  { id: 'wt6', code: 'EIN-106', name: 'Bomba de Comprovacio de Pressio Manual', brand: 'Rothenberger', status: '🟢 Operativa', assignedTo: 'Magatzem Central' }
];

function CreateJobForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const clientIdParam = searchParams.get('clientId') || searchParams.get('client') || '1';

  // Client Mock Data Database
  const clientsDb: Record<string, { name: string; nif: string; phone: string; contact: string; address: string; lat: number; lng: number }> = {
    '1': { name: 'Agro Riera SL', nif: 'B12345678', phone: '600111222', contact: 'Miquel Riera', address: 'Cami Ral s/n, 08240 Manresa', lat: 41.6521, lng: 1.8322 },
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

  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Handle Client Switch
  const handleClientSelect = (id: string) => {
    setSelectedClientId(id);
  };

  const activeClient = clientsDb[selectedClientId] || selectedClient;

  // IA Assistance Generation
  const handleGenerateAi = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setDescription(
        `Substitucio i reparacio de la escomesa principal de aigua a la finca ${activeClient.name}. Cal verificar pressio de xarxa, sanejar la canonada malmesa de PE 25mm i instal·lar valvula de tall reforçada. Fer fotos abans i despres.`
      );
      setEstimatedHours('5');
      setMaterials([
        { id: '1', name: 'Tub PE 25mm High-Density', qty: '10m' },
        { id: '2', name: 'Valvula de Tall 1 polzada Inox', qty: '2u' },
        { id: '3', name: 'Cinta de Teflon Professional', qty: '1u' },
      ]);
      setTools([
        'Trepant Bosch GSR-18',
        'Radial Makita 125mm',
        'Joc de Claus Stillson Heavy-Duty',
        'Detector de Metalls i Cables Subterrani',
      ]);
      setIsAiLoading(false);
    }, 900);
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
    alert(`Ordre de Treball creada amb exit per al client ${activeClient.name}!`);
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
        <span className="text-primary font-body-strong">Redaccio de Feina ({activeClient.name})</span>
      </nav>

      <div className="flex flex-col w-full gap-xl max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md bg-surface-container-lowest p-xl rounded-2xl shadow-sm border border-outline-variant/30">
          <div>
            <div className="flex items-center gap-sm mb-1">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
              <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest">
                Redaccio Vinculada al Client
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg text-primary">
              Nova Ordre de Treball
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Tots els registres, materials del magatzem, eines i hores quedaran arxivats directament al historial del client.
            </p>
          </div>

          {/* AI Assistance Trigger Button */}
          <button
            onClick={handleGenerateAi}
            disabled={isAiLoading}
            className="px-6 py-3.5 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-body-strong shadow-lg hover:shadow-xl transition-all flex items-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Sparkles size={18} className="text-amber-300" />
            {isAiLoading ? 'La IA esta redactant...' : '🤖 Asistent Redaccio IA'}
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

            {/* Card 2: Job Description & Priorities */}
            <div className="p-xl bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-md">
              <div className="flex justify-between items-center">
                <h2 className="font-section-title text-primary flex items-center gap-2 text-lg">
                  <span className="material-symbols-outlined text-primary">description</span>
                  Descripcio de la Feina
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
                <label className="font-label-caps text-xs text-on-surface-variant">DESCRIPCIO DETALLADA DE LA TASCA</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Escriu la descripcio del treball a realitzar per l'operari, o prem '🤖 Asistent Redaccio IA'..."
                  className="w-full bg-surface-container-low p-4 rounded-xl border border-outline-variant font-body-base outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                ></textarea>
              </div>

              {/* Estimated Hours */}
              <div className="flex flex-col gap-xs w-1/2">
                <label className="font-label-caps text-xs text-on-surface-variant">ESTIMACIO HORES DE TREBALL</label>
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
                    placeholder="Afegir material a ma (ex: Tub PE 25mm)..."
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
                    <Plus size={14} /> A ma
                  </button>
                </div>
              </div>

              <div className="h-px bg-outline-variant/30"></div>

              {/* 2. Tools Section */}
              <div className="flex flex-col gap-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h3 className="font-headline-md text-primary flex items-center gap-2 text-md">
                    <PenTool size={20} className="text-primary" />
                    Eines Necessaries Assignades ({tools.length})
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
                    placeholder="Afegir eina a ma (ex: Radial Makita)..."
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    className="flex-1 bg-white p-2.5 rounded-lg border border-neutral-200 text-xs outline-none focus:border-primary"
                  />
                  <button 
                    type="button"
                    onClick={handleAddToolManual}
                    className="px-4 py-2.5 bg-blue-700 text-white rounded-lg text-xs font-bold hover:bg-blue-800 flex items-center gap-1"
                  >
                    <Plus size={14} /> A ma
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Blueprints & Location Map */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-lg">
            
            {/* Card 4: Blueprint Attachment */}
            <div className="p-xl bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-md">
              <h2 className="font-section-title text-primary flex items-center gap-2 text-lg">
                <span className="material-symbols-outlined text-primary">architecture</span>
                Planol Tecnic Adjunt (Opcional)
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
                  <span className="font-body-strong text-sm">Seleccionar o Carregar Planol (PDF/Imatge)</span>
                  <span className="text-xs text-on-surface-variant">Accepta arxius de la biblioteca o des del disc</span>
                </button>
              ) : (
                <div className="p-4 bg-primary-container/10 border border-primary/20 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">picture_as_pdf</span>
                    <div className="flex flex-col">
                      <span className="font-body-strong text-sm text-primary">{blueprintName}</span>
                      <span className="text-xs text-on-surface-variant">Planol carregat a la feina</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setHasBlueprint(false)} 
                    className="p-1 text-error hover:bg-error/10 rounded-full"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              )}
            </div>

            {/* Card 5: Map Location */}
            <div className="p-xl bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-md">
              <h2 className="font-section-title text-primary flex items-center gap-2 text-lg">
                <span className="material-symbols-outlined text-primary">location_on</span>
                Ubicacio GPS de la Feina
              </h2>
              
              <div className="relative h-[260px] rounded-xl overflow-hidden shadow-md border border-outline-variant/30">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCvbJjUps0q9YpuQkGaY5sRz2m_ti7khbFlM6-CHmI8ykOmRLmMra7akOY7vF9x65dHzRdZQqeacIz_LPhVHInJ6E5g_v9awm4ReTUw-3hPNQx830GX3GzrxqwDyK6kSXn8aKLHSmKwRXY8OuBTccG5OdGUf_k9PET1PNq96ySs7M2WQDY9UzJh9kW2ZeGatQwHH-6Msl2sF7P22CxWNJs7BHja5JGG0qkVly74n-qHHixvQx472LXu')` }}></div>
                <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-body-strong text-primary shadow">
                  Coordenades: {activeClient.lat}° N, {activeClient.lng}° E
                </div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                Les coordenades estan geolocalitzades segons la adreça oficial de la finca del client.
              </p>
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
            Cancelar
          </button>

          <button 
            type="button"
            onClick={handleSaveOrder} 
            className="px-10 py-4 bg-secondary-container text-on-secondary-container font-headline-md rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-wider"
          >
            <span className="material-symbols-outlined">check_circle</span>
            Guardar Ordre de Treball
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

            {/* Search filter */}
            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="Cercar material al magatzem per nom, SKU o ubicacio..."
                value={checklistMaterialSearch}
                onChange={(e) => setChecklistMaterialSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:border-emerald-600 font-medium"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            </div>

            <p className="text-xs text-neutral-500 mb-3">Marca els materials que l operari ha d endur-se del magatzem per dur a terme la feina:</p>

            {/* Checklist List */}
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
                        <span className="text-[10px] text-neutral-500">Stock disponible: <strong className="text-emerald-800">{item.stock}</strong> • Ubicacio: {item.location}</span>
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
                {materials.length} materials seleccionats per a l ordre
              </span>
              <button 
                onClick={() => setShowMaterialChecklistModal(false)}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-md"
              >
                Confirmar Seleccio
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
                  Inventari d Eines i Maquinaria
                </span>
                <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2 mt-1">
                  <PenTool className="text-blue-600" size={22} />
                  Checklist d Eines del Magatzem
                </h3>
              </div>
              <button onClick={() => setShowToolChecklistModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X size={22} />
              </button>
            </div>

            {/* Search filter */}
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

            <p className="text-xs text-neutral-500 mb-3">Selecciona quines eines s assignen a aquesta ordre de treball:</p>

            {/* Checklist List */}
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
                {tools.length} eines assignades a l ordre
              </span>
              <button 
                onClick={() => setShowToolChecklistModal(false)}
                className="px-6 py-2.5 bg-blue-700 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors shadow-md"
              >
                Confirmar Seleccio
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
        Carregant formulari de redaccio...
      </div>
    }>
      <CreateJobForm />
    </Suspense>
  );
}
