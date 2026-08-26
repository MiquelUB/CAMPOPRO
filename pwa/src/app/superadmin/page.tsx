'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, Users, ShieldCheck, Cpu, CreditCard, Plus, Search, CheckCircle2, 
  AlertCircle, Smartphone, Monitor, Key, RefreshCw, Edit3, Trash2, Globe, Server, 
  Send, DollarSign, Calendar, Lock, ChevronRight, Activity, ArrowUpRight
} from 'lucide-react';

interface BuyerCompanyTenant {
  id: string;
  companyName: string;
  nif: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  planType: 'BASIC' | 'PRO' | 'ENTERPRISE' | 'PROVA';
  status: 'ACTIVA' | 'PENDENT_PAGAMENT' | 'SUSPENSA';
  crewsCount: number; // Nombre de quadrilles / colles
  workersCount: number; // Nombre d'operaris totals
  aiNodeType: 'LM_STUDIO' | 'OLLAMA' | 'CLOUD_OPENROUTER';
  aiNodeUrl: string;
  aiModelName: string;
  aiNodeStatus: 'ONLINE' | 'OFFLINE';
  monthlySaasFee: number;
  renewalDate: string;
  joinedDate: string;
}

const INITIAL_BUYERS: BuyerCompanyTenant[] = [
  {
    id: 't-001',
    companyName: 'Agro Riera SL',
    nif: 'B12345678',
    ownerName: 'Miquel Riera',
    ownerEmail: 'miquel@agroriera.cat',
    ownerPhone: '600 11 22 33',
    planType: 'PRO',
    status: 'ACTIVA',
    crewsCount: 2,
    workersCount: 12,
    aiNodeType: 'LM_STUDIO',
    aiNodeUrl: 'http://192.168.1.50:1234/v1',
    aiModelName: 'qwen2.5-7b-instruct',
    aiNodeStatus: 'ONLINE',
    monthlySaasFee: 149.00,
    renewalDate: '01/09/2026',
    joinedDate: '15/01/2026'
  },
  {
    id: 't-002',
    companyName: 'Finca Vallès Agrícola',
    nif: 'A87654321',
    ownerName: 'Anna Vallès',
    ownerEmail: 'anna@fincavalles.cat',
    ownerPhone: '600 33 44 55',
    planType: 'ENTERPRISE',
    status: 'ACTIVA',
    crewsCount: 3,
    workersCount: 24,
    aiNodeType: 'LM_STUDIO',
    aiNodeUrl: 'http://192.168.1.80:1234/v1',
    aiModelName: 'qwen2.5-14b-instruct',
    aiNodeStatus: 'ONLINE',
    monthlySaasFee: 249.00,
    renewalDate: '10/09/2026',
    joinedDate: '01/03/2026'
  },
  {
    id: 't-003',
    companyName: 'Serveis Agrícoles Ponent',
    nif: 'B99887766',
    ownerName: 'Joan Llobregat',
    ownerEmail: 'joan@ponentagri.cat',
    ownerPhone: '600 55 66 77',
    planType: 'BASIC',
    status: 'PENDENT_PAGAMENT',
    crewsCount: 1,
    workersCount: 5,
    aiNodeType: 'OLLAMA',
    aiNodeUrl: 'http://192.168.2.10:11434/v1',
    aiModelName: 'llama3.1-8b-instruct',
    aiNodeStatus: 'OFFLINE',
    monthlySaasFee: 89.00,
    renewalDate: '25/08/2026',
    joinedDate: '12/05/2026'
  }
];

export default function SuperadminCRMPage() {
  const [buyers, setBuyers] = useState<BuyerCompanyTenant[]>(INITIAL_BUYERS);
  const [search, setSearch] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerCompanyTenant | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pingLog, setPingLog] = useState<string | null>(null);

  // Form State for New Buyer Tenant
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newNif, setNewNif] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [newOwnerPhone, setNewOwnerPhone] = useState('');
  const [newCrewsCount, setNewCrewsCount] = useState<number>(2);
  const [newPlanType, setNewPlanType] = useState<BuyerCompanyTenant['planType']>('PRO');
  const [newAiNodeUrl, setNewAiNodeUrl] = useState('http://192.168.1.100:1234/v1');
  const [newAiNodeType, setNewAiNodeType] = useState<BuyerCompanyTenant['aiNodeType']>('LM_STUDIO');
  const [newAiModelName, setNewAiModelName] = useState('qwen2.5-7b-instruct');
  const [newMonthlyFee, setNewMonthlyFee] = useState<number>(149.00);

  const filteredBuyers = buyers.filter(b => 
    b.companyName.toLowerCase().includes(search.toLowerCase()) ||
    b.ownerName.toLowerCase().includes(search.toLowerCase()) ||
    b.nif.toLowerCase().includes(search.toLowerCase())
  );

  const handleTestAiNodeConnection = (nodeUrl: string) => {
    setPingLog(`⌛ Provant connexió xifrada amb el Node d'IA Privat (${nodeUrl})...`);
    setTimeout(() => {
      setPingLog(`🟢 CONNEXIÓ EXITOSA! Resposta del servidor d'IA privat en 14ms (Model actiu: Qwen 2.5 7B).`);
    }, 1000);
  };

  const handleAddBuyerTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName || !newOwnerEmail) return;

    const newTenant: BuyerCompanyTenant = {
      id: `t-00${buyers.length + 1}`,
      companyName: newCompanyName,
      nif: newNif || 'B00000000',
      ownerName: newOwnerName,
      ownerEmail: newOwnerEmail,
      ownerPhone: newOwnerPhone || '600 00 00 00',
      planType: newPlanType,
      status: 'ACTIVA',
      crewsCount: newCrewsCount,
      workersCount: newCrewsCount * 6, // 6 operaris per quadrilla
      aiNodeType: newAiNodeType,
      aiNodeUrl: newAiNodeUrl,
      aiModelName: newAiModelName,
      aiNodeStatus: 'ONLINE',
      monthlySaasFee: newMonthlyFee,
      renewalDate: '26/09/2026',
      joinedDate: new Date().toLocaleDateString('ca-ES')
    };

    setBuyers([...buyers, newTenant]);
    setShowAddModal(false);
    alert(`✨ Nou comprador "${newCompanyName}" donat d'alta a CampoPro amb ${newCrewsCount} quadrilles i Node d'IA a ${newAiNodeUrl}!`);
  };

  const totalMonthlyMrr = buyers.reduce((sum, b) => sum + (b.status === 'ACTIVA' ? b.monthlySaasFee : 0), 0);
  const totalCrewsAllBuyers = buyers.reduce((sum, b) => sum + b.crewsCount, 0);

  return (
    <div className="p-6 pt-32 max-w-7xl mx-auto flex flex-col gap-6 font-sans">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center text-xs text-neutral-500 gap-1">
        <Link href="/gestio" className="hover:text-primary">Dashboard</Link>
        <span>/</span>
        <span className="text-primary font-semibold">Superadmin & Gestió de Compradors CampoPro</span>
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-neutral-900 via-slate-900 to-primary text-white p-6 rounded-3xl shadow-xl border border-neutral-800">
        <div>
          <span className="text-[10px] font-bold bg-primary/20 text-teal-300 px-3 py-1 rounded-full uppercase tracking-wider border border-teal-500/30">
            👑 MASTER CONTROL & B2B CRM CAMPOPRO
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight mt-2 flex items-center gap-2">
            <Building2 size={28} className="text-teal-400" />
            CRM de Compradors de CampoPro & Llicències Multi-Tenant
          </h1>
          <p className="text-xs text-neutral-300 mt-1 max-w-2xl">
            Panell de control exclusiu per al propietari de CampoPro: gestió d'empreses compradores, llicències de quadrilles d'operaris, facturació SaaS i IPs dels Nodes d'IA privats (LM Studio / Ollama).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-neutral-950 rounded-2xl font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 shrink-0 active:scale-95"
        >
          <Plus size={18} />
          + Donar d'Alta Nova Empresa Compradora
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-500 font-bold uppercase block">Empreses Compradores</span>
            <span className="text-2xl font-extrabold text-neutral-900 mt-0.5 block">{buyers.length} Clients B2B</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
            <Building2 size={24} />
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-500 font-bold uppercase block">Quadrilles d'Operaris Llicenciades</span>
            <span className="text-2xl font-extrabold text-emerald-700 mt-0.5 block">{totalCrewsAllBuyers} Colles</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Users size={24} />
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-500 font-bold uppercase block">Facturació Mensual SaaS (MRR)</span>
            <span className="text-2xl font-extrabold text-blue-900 mt-0.5 block">{totalMonthlyMrr.toFixed(2)} €/mes</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-500 font-bold uppercase block">Nodes d'IA Locals Actius</span>
            <span className="text-2xl font-extrabold text-teal-800 mt-0.5 block">
              {buyers.filter(b => b.aiNodeStatus === 'ONLINE').length} Online
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
            <Cpu size={24} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        
        {/* Search & Filter Bar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm gap-4">
          <div className="flex items-center gap-2 bg-neutral-50 px-4 py-2.5 rounded-xl border border-neutral-200 flex-1 max-w-md">
            <Search size={18} className="text-neutral-400" />
            <input
              type="text"
              placeholder="Cerca per nom d'empresa compradora, propietari o NIF..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full font-medium"
            />
          </div>

          <span className="text-xs text-neutral-500 font-bold">
            Mostrant {filteredBuyers.length} de {buyers.length} compradors
          </span>
        </div>

        {/* Buyers Table */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden text-xs">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 grid grid-cols-12 font-bold text-neutral-500 uppercase tracking-wider text-[11px]">
            <span className="col-span-3">Empresa Compradora & Propietari</span>
            <span className="col-span-2">Quadrilles / Operaris</span>
            <span className="col-span-3">Node d'IA Privat (LM Studio / IP)</span>
            <span className="col-span-2">Pla & Cuota SaaS</span>
            <span className="col-span-2 text-right">Accions Superadmin</span>
          </div>

          <div className="divide-y divide-neutral-100">
            {filteredBuyers.map((buyer) => (
              <div key={buyer.id} className="p-4 grid grid-cols-12 items-center hover:bg-neutral-50 transition-colors">
                
                {/* Company & Owner */}
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-teal-400 font-bold flex items-center justify-center text-sm shadow-inner shrink-0">
                    {buyer.companyName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                      {buyer.companyName}
                      <span className={`w-2 h-2 rounded-full ${buyer.status === 'ACTIVA' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    </h4>
                    <span className="text-[11px] text-neutral-500 block">Prop: <strong>{buyer.ownerName}</strong> ({buyer.ownerPhone})</span>
                    <span className="font-mono text-neutral-400 text-[10px]">NIF: {buyer.nif}</span>
                  </div>
                </div>

                {/* Crews & Workers */}
                <div className="col-span-2 space-y-1">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold text-[11px] rounded-full border border-emerald-300 inline-block">
                    👥 {buyer.crewsCount} Quadrilles
                  </span>
                  <span className="text-[11px] text-neutral-500 block font-mono">
                    ({buyer.workersCount} llicències d'operari)
                  </span>
                </div>

                {/* AI Node Configuration */}
                <div className="col-span-3 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${buyer.aiNodeStatus === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                    <span className="font-mono font-bold text-neutral-900 text-[11px]">{buyer.aiNodeUrl}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 block">Engine: <strong>{buyer.aiNodeType}</strong> ({buyer.aiModelName})</span>
                  <button 
                    onClick={() => handleTestAiNodeConnection(buyer.aiNodeUrl)}
                    className="text-[10px] font-bold text-blue-700 hover:underline flex items-center gap-0.5"
                  >
                    🧪 Test Connexió Node
                  </button>
                </div>

                {/* SaaS Plan & Billing */}
                <div className="col-span-2 space-y-1">
                  <span className="font-extrabold text-neutral-900 text-sm block">{buyer.monthlySaasFee.toFixed(2)} €/mes</span>
                  <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 font-bold text-[10px] rounded uppercase">
                    Pla {buyer.planType}
                  </span>
                  <span className="text-[10px] text-neutral-400 block font-mono">Renova: {buyer.renewalDate}</span>
                </div>

                {/* Actions */}
                <div className="col-span-2 text-right flex justify-end gap-1">
                  <button
                    onClick={() => setSelectedBuyer(buyer)}
                    className="px-3 py-1.5 bg-neutral-900 text-white font-bold text-[11px] rounded-xl hover:bg-neutral-800 transition-colors flex items-center gap-1"
                  >
                    Configurar ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ping Log Feedback */}
        {pingLog && (
          <div className="p-4 bg-neutral-900 text-teal-300 rounded-2xl font-mono text-xs shadow-lg border border-neutral-800 flex justify-between items-center">
            <span>{pingLog}</span>
            <button onClick={() => setPingLog(null)} className="text-white hover:text-red-400 font-bold">×</button>
          </div>
        )}
      </div>

      {/* MODAL DETALLS COMPRADOR & CONFIGURACIÓ DE QUADRILLES */}
      {selectedBuyer && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="text-[10px] font-bold bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded">
                  ID COMPRADOR: {selectedBuyer.id}
                </span>
                <h3 className="font-bold text-neutral-900 text-lg mt-1 flex items-center gap-2">
                  <Building2 size={20} className="text-primary" />
                  {selectedBuyer.companyName} (NIF: {selectedBuyer.nif})
                </h3>
              </div>
              <button onClick={() => setSelectedBuyer(null)} className="text-neutral-400 hover:text-neutral-700 font-bold text-xl">×</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-neutral-50 rounded-2xl space-y-2 border border-neutral-200">
                <h4 className="font-bold text-neutral-900 border-b pb-1">👥 Llicències de Quadrilles & Operaris</h4>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Quadrilles d'Equip Assignades:</span>
                  <span className="font-bold text-neutral-900">{selectedBuyer.crewsCount} Colles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Operaris Autoritzats a la PWA:</span>
                  <span className="font-bold text-neutral-900">{selectedBuyer.workersCount} Usuaris</span>
                </div>
                <div className="flex justify-between pt-1 border-t">
                  <span className="text-neutral-600">Quota Mensual SaaS:</span>
                  <span className="font-extrabold text-emerald-800 text-sm">{selectedBuyer.monthlySaasFee.toFixed(2)} €/mes</span>
                </div>
              </div>

              <div className="p-4 bg-neutral-50 rounded-2xl space-y-2 border border-neutral-200">
                <h4 className="font-bold text-neutral-900 border-b pb-1">🖥️ Node d'IA Privat del Comprador</h4>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Engine d'IA:</span>
                  <span className="font-bold text-neutral-900">{selectedBuyer.aiNodeType}</span>
                </div>
                <div>
                  <span className="text-neutral-600 block text-[10px]">URL / IP del Node:</span>
                  <span className="font-mono font-bold text-primary text-[11px]">{selectedBuyer.aiNodeUrl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Model Carregat:</span>
                  <span className="font-mono text-neutral-900 text-[10px]">{selectedBuyer.aiModelName}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-emerald-900 block">📞 Contacte Directe del Propietari:</span>
              <p className="text-neutral-700">{selectedBuyer.ownerName} • {selectedBuyer.ownerEmail} • Telèfon: {selectedBuyer.ownerPhone}</p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button 
                onClick={() => {
                  alert(`Enviat correu de restabliment d'accés Administrador a ${selectedBuyer.ownerEmail}`);
                }}
                className="px-4 py-2.5 bg-blue-100 text-blue-900 rounded-xl font-bold text-xs hover:bg-blue-200 transition-colors flex items-center gap-1"
              >
                <Key size={14} /> Reset Accés Admin
              </button>
              <button onClick={() => setSelectedBuyer(null)} className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl font-bold text-xs">
                Tancar Fitxa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ALTA NOU COMPRADOR */}
      {showAddModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <form onSubmit={handleAddBuyerTenant} className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-neutral-200 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2">
                <Building2 size={20} className="text-primary" /> Donar d'Alta Nova Empresa Compradora
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-neutral-400 font-bold text-xl">×</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Nom de l'Empresa Compradora *</label>
                <input required type="text" value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)} placeholder="ex: Serveis Agrícoles del Camp SL" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-bold outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">NIF / CIF *</label>
                  <input required type="text" value={newNif} onChange={(e) => setNewNif(e.target.value)} placeholder="B-12345678" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-mono outline-none" />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Nombre de Quadrilles *</label>
                  <input required type="number" value={newCrewsCount} onChange={(e) => setNewCrewsCount(parseInt(e.target.value) || 1)} className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-primary outline-none" />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Nom del Propietari / Contacte Principal *</label>
                <input required type="text" value={newOwnerName} onChange={(e) => setNewOwnerName(e.target.value)} placeholder="ex: Carles Puig" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Correu Electrònic *</label>
                  <input required type="email" value={newOwnerEmail} onChange={(e) => setNewOwnerEmail(e.target.value)} placeholder="carles@empresa.cat" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Telèfon Contacte *</label>
                  <input required type="text" value={newOwnerPhone} onChange={(e) => setNewOwnerPhone(e.target.value)} placeholder="600 00 11 22" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-mono outline-none" />
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                <span className="font-bold text-neutral-900 block">🖥️ Node d'IA Privat del Comprador (LM Studio / Ollama)</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 block">Engine d'IA</label>
                    <select value={newAiNodeType} onChange={(e) => setNewAiNodeType(e.target.value as any)} className="w-full p-2 bg-white border border-neutral-300 rounded-xl font-bold">
                      <option value="LM_STUDIO">LM Studio (Port 1234)</option>
                      <option value="OLLAMA">Ollama (Port 11434)</option>
                      <option value="CLOUD_OPENROUTER">Núvol Cloud</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 block">Nom del Model</label>
                    <input type="text" value={newAiModelName} onChange={(e) => setNewAiModelName(e.target.value)} className="w-full p-2 bg-white border border-neutral-300 rounded-xl font-mono text-[11px]" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 block">URL / IP del Node d'IA Privat</label>
                  <input type="text" value={newAiNodeUrl} onChange={(e) => setNewAiNodeUrl(e.target.value)} className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl font-mono font-bold text-primary text-xs" />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-neutral-100 text-neutral-700 font-bold rounded-xl">Cancel·lar</button>
              <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-xl shadow-md">Crear Comprador CampoPro</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
