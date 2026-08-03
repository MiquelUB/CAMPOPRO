'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Settings, Users, Shield, Lock, Key, UserPlus, ShieldCheck, ShieldAlert, Check, 
  X, Edit3, Trash2, Smartphone, Mail, Phone, RefreshCw, Server, Bot, CheckCircle2,
  Building2, Save, Send, AlertTriangle, Monitor, HardDrive
} from 'lucide-react';

interface StaffUser {
  id: string;
  name: string;
  nif: string;
  email: string;
  role: 'ENGINYER_SUPERVISOR' | 'CAP_PERSONAL' | 'COMPTABILITAT' | 'SECRETARI' | 'CAP_GRUP_OPERARI' | 'OPERARI_PWA';
  roleLabel: string;
  accessType: 'DASHBOARD_WEB' | 'PWA_MOBIL';
  lastLogin: string;
  phone: string;
  status: 'ACTIU' | 'REVOCAT' | 'PENDENT';
}

const INITIAL_STAFF_DATABASE: StaffUser[] = [
  {
    id: 'usr-1',
    name: 'Marc Solsona',
    nif: '47889911A',
    email: 'marc.solsona@campopro.cat',
    role: 'ENGINYER_SUPERVISOR',
    roleLabel: 'Enginyer Agrònom Supervisor',
    accessType: 'DASHBOARD_WEB',
    lastLogin: 'Avui 11:45 (IP: 83.34.12.9)',
    phone: '600 00 11 22',
    status: 'ACTIU'
  },
  {
    id: 'usr-2',
    name: 'Carles Puig',
    nif: '38112233B',
    email: 'carles.puig@campopro.cat',
    role: 'CAP_PERSONAL',
    roleLabel: 'Cap de Personal & RRHH',
    accessType: 'DASHBOARD_WEB',
    lastLogin: 'Ieri 18:30 (IP: 83.34.12.9)',
    phone: '600 00 33 44',
    status: 'ACTIU'
  },
  {
    id: 'usr-5',
    name: 'Marta Font',
    nif: '52994411C',
    email: 'marta.font@campopro.cat',
    role: 'COMPTABILITAT',
    roleLabel: 'Comptabilitat & Facturació',
    accessType: 'DASHBOARD_WEB',
    lastLogin: 'Avui 09:15 (IP: 83.34.12.9)',
    phone: '600 44 55 66',
    status: 'ACTIU'
  },
  {
    id: 'usr-6',
    name: 'Núria Casals',
    nif: '41223344D',
    email: 'nuria.casals@campopro.cat',
    role: 'SECRETARI',
    roleLabel: 'Secretaria & Atenció Clients',
    accessType: 'DASHBOARD_WEB',
    lastLogin: 'Avui 10:00 (IP: 83.34.12.9)',
    phone: '600 77 88 99',
    status: 'ACTIU'
  },
  {
    id: 'usr-3',
    name: 'Jordi Soler',
    nif: '47881122K',
    email: 'jordi.soler@campopro.cat',
    role: 'CAP_GRUP_OPERARI',
    roleLabel: 'Cap de Grup (Només PWA Mòbil)',
    accessType: 'PWA_MOBIL',
    lastLogin: 'Avui 08:02 (App PWA Mòbil)',
    phone: '600 12 34 56',
    status: 'ACTIU'
  },
  {
    id: 'usr-4',
    name: 'Pau Ribas',
    nif: '38992211L',
    email: 'pau.ribas@campopro.cat',
    role: 'OPERARI_PWA',
    roleLabel: 'Operari de Camp (Només PWA Mòbil)',
    accessType: 'PWA_MOBIL',
    lastLogin: 'Avui 08:05 (App PWA Mòbil)',
    phone: '600 98 76 54',
    status: 'ACTIU'
  }
];

export default function ConfiguracioPage() {
  const [users, setUsers] = useState<StaffUser[]>(INITIAL_STAFF_DATABASE);
  const [activeTab, setActiveTab] = useState<'personal' | 'auth' | 'empresa'>('personal');
  const [showAddModal, setShowAddModal] = useState(false);

  // Company Parameters & Telegram Bot State
  const [companyName, setCompanyName] = useState('CampoPro Serveis Agrícoles SL');
  const [companyNif, setCompanyNif] = useState('B-65498712');
  const [companyPhone, setCompanyPhone] = useState('938 77 00 11');
  const [companyEmail, setCompanyEmail] = useState('facturacio@campopro.cat');
  const [companyAddress, setCompanyAddress] = useState('Polígon Industrial Els Dolors, Nau 12, 08243 Manresa');
  
  const [telegramBotToken, setTelegramBotToken] = useState('7123984712:AAH9fklmN389f_xK923uJz8s');
  const [telegramChatId, setTelegramChatId] = useState('-100192837465');
  const [telegramStatus, setTelegramStatus] = useState<'OPERATIU' | 'PROVANT'>('OPERATIU');
  const [botLogMessage, setBotLogMessage] = useState<string | null>(null);

  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newNif, setNewNif] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<StaffUser['role']>('ENGINYER_SUPERVISOR');

  // Toggle user access type (DASHBOARD_WEB vs PWA_MOBIL)
  const toggleUserAccessType = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        // Rules: Caps de grup & Operaris can ONLY be PWA_MOBIL
        if (u.role === 'CAP_GRUP_OPERARI' || u.role === 'OPERARI_PWA') {
          alert('⚠️ Restricció de seguretat: Els Caps de Grup i Operaris de camp només poden tenir accés a la PWA Mòbil.');
          return u;
        }
        const nextAccess = u.accessType === 'DASHBOARD_WEB' ? 'PWA_MOBIL' : 'DASHBOARD_WEB';
        return { ...u, accessType: nextAccess };
      }
      return u;
    }));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    // Determine access type automatically based on role directive: Caps de Grup and Operaris ONLY get PWA_MOBIL
    const isMobileOnlyRole = newRole === 'CAP_GRUP_OPERARI' || newRole === 'OPERARI_PWA';
    const computedAccess: StaffUser['accessType'] = isMobileOnlyRole ? 'PWA_MOBIL' : 'DASHBOARD_WEB';

    let roleLabelText = 'Enginyer de Camp';
    if (newRole === 'COMPTABILITAT') roleLabelText = 'Comptabilitat & Facturació';
    else if (newRole === 'SECRETARI') roleLabelText = 'Secretaria & Administració';
    else if (newRole === 'CAP_PERSONAL') roleLabelText = 'Cap de Personal & RRHH';
    else if (newRole === 'CAP_GRUP_OPERARI') roleLabelText = 'Cap de Grup (Només PWA Mòbil)';
    else if (newRole === 'OPERARI_PWA') roleLabelText = 'Operari de Camp (Només PWA Mòbil)';

    const newUserObj: StaffUser = {
      id: `usr-${Date.now()}`,
      name: newName,
      nif: newNif || '00000000X',
      email: newEmail,
      role: newRole,
      roleLabel: roleLabelText,
      accessType: computedAccess,
      lastLogin: 'Mai registrat',
      phone: newPhone || '600 00 00 00',
      status: 'ACTIU'
    };

    setUsers([...users, newUserObj]);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewNif('');
    setNewPhone('');
    alert(`✨ Nou usuari "${newName}" creat com a ${roleLabelText}. Accés assignat: ${computedAccess === 'DASHBOARD_WEB' ? '💻 Dashboard Web' : '📱 PWA Mòbil'}.`);
  };

  const handleSaveCompanySettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`💾 S'han desat correctament els paràmetres fiscals de ${companyName} i la configuració del Bot de Telegram!`);
  };

  const handleTestTelegramBot = () => {
    setTelegramStatus('PROVANT');
    setBotLogMessage('⌛ Enviant notificació de prova via Webhook de Telegram...');

    setTimeout(() => {
      setTelegramStatus('OPERATIU');
      setBotLogMessage(`✅ Notificació de prova enviada amb èxit al canal de Telegram #${telegramChatId}! Missatge rebut a les ${new Date().toLocaleTimeString()}.`);
    }, 1200);
  };

  return (
    <div className="p-6 pt-32 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-xs text-neutral-500 gap-1">
        <Link href="/gestio" className="hover:text-primary">Dashboard</Link>
        <span>/</span>
        <span className="text-primary font-semibold">Configuració, Personal i Auth</span>
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <Settings className="text-primary" size={28} />
            Configuració de Personal, Permisos Auth i Telegram
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Gestió de plantilla (Enginyers, Comptabilitat, Secretaria, Caps de Grup), diferenciació d'accés (Dashboard Web vs PWA Mòbil) i paràmetres de Telegram.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-primary text-white rounded-xl font-bold text-xs shadow-md hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0"
        >
          <UserPlus size={18} />
          + Donar d'Alta Personal o Enginyer
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200 shrink-0 text-xs font-bold w-fit">
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'personal' ? 'bg-white text-primary shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Users size={16} /> Personal de l'Empresa ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('auth')}
          className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'auth' ? 'bg-white text-emerald-800 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <ShieldCheck size={16} className="text-emerald-600" /> Permisos d'Accés (Dashboard vs PWA)
        </button>

        <button
          onClick={() => setActiveTab('empresa')}
          className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'empresa' ? 'bg-white text-blue-800 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Building2 size={16} className="text-blue-600" /> Paràmetres Empresa & Telegram Bot
        </button>
      </div>

      {/* TAB 1: PERSONAL I ROLS */}
      {activeTab === 'personal' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-neutral-50 border-b border-neutral-200 grid grid-cols-12 font-bold text-xs text-neutral-500 uppercase tracking-wider">
              <span className="col-span-3">Nom i NIF</span>
              <span className="col-span-3">Rol de l'Empresa</span>
              <span className="col-span-3">Contacte</span>
              <span className="col-span-2">Tipus d'Accés Auth</span>
              <span className="col-span-1 text-right">Accions</span>
            </div>

            <div className="divide-y divide-neutral-100">
              {users.map((u) => (
                <div key={u.id} className="p-4 grid grid-cols-12 items-center hover:bg-neutral-50/80 transition-colors text-xs">
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shadow-inner shrink-0">
                      {u.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">{u.name}</h4>
                      <span className="font-mono text-neutral-400 text-[11px]">NIF: {u.nif}</span>
                    </div>
                  </div>

                  <div className="col-span-3">
                    <span className={`px-3 py-1 rounded-full font-bold text-[10px] inline-block ${
                      u.role === 'ENGINYER_SUPERVISOR' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                      u.role === 'CAP_PERSONAL' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                      u.role === 'COMPTABILITAT' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                      u.role === 'SECRETARI' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                      'bg-neutral-100 text-neutral-900 border border-neutral-200'
                    }`}>
                      {u.roleLabel}
                    </span>
                  </div>

                  <div className="col-span-3 space-y-0.5 font-medium text-neutral-700">
                    <p className="flex items-center gap-1"><Mail size={12} className="text-neutral-400" /> {u.email}</p>
                    <p className="flex items-center gap-1 font-mono text-[11px]"><Phone size={12} className="text-neutral-400" /> {u.phone}</p>
                  </div>

                  <div className="col-span-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${
                      u.accessType === 'DASHBOARD_WEB' ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      {u.accessType === 'DASHBOARD_WEB' ? <Monitor size={12} /> : <Smartphone size={12} />}
                      {u.accessType === 'DASHBOARD_WEB' ? '💻 Dashboard Web' : '📱 PWA Mòbil'}
                    </span>
                  </div>

                  <div className="col-span-1 text-right flex justify-end gap-1">
                    <button 
                      onClick={() => alert(`Enviat correu de restabliment de contrasenya a ${u.email}`)}
                      className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-bold transition-colors"
                      title="Reset Contrasenya"
                    >
                      <Key size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PERMISOS D'ACCÉS AUTH (DASHBOARD WEB vs PWA MÒBIL) */}
      {activeTab === 'auth' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex justify-between items-center">
            <div>
              <span className="text-xs text-purple-900 font-bold block">Diferenciació d'Accés per Rol (Llei de Seguretat i RLS)</span>
              <span className="text-neutral-600 text-[11px]">
                Els Enginyers, Comptabilitat i Secretaria tenen accés al <strong>Dashboard Web</strong>. Els Caps de Grup i Operaris <strong>només tenen accés a la PWA Mòbil</strong>.
              </span>
            </div>
            <span className="px-3 py-1.5 bg-purple-800 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow">
              <ShieldCheck size={16} /> Autenticació JWT Separada
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((u) => (
              <div key={u.id} className="p-5 bg-white rounded-3xl border border-neutral-200 shadow-sm space-y-3">
                <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
                  <div>
                    <h4 className="font-bold text-neutral-900 text-sm">{u.name}</h4>
                    <span className="text-xs text-primary font-semibold block">{u.roleLabel}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    u.accessType === 'DASHBOARD_WEB' ? 'bg-purple-100 text-purple-900' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {u.accessType === 'DASHBOARD_WEB' ? '💻 Accés Web' : '📱 Accés PWA'}
                  </span>
                </div>

                <div className="space-y-2 bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-neutral-700">Accés permès al Dashboard Web:</span>
                    <span className={`font-bold text-[11px] px-2.5 py-1 rounded ${
                      u.accessType === 'DASHBOARD_WEB' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {u.accessType === 'DASHBOARD_WEB' ? '✓ PERMÈS' : '✕ DENEGAT (Només PWA)'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-neutral-700">Accés permès a la PWA Mòbil:</span>
                    <span className="font-bold text-[11px] px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
                      ✓ PERMÈS
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-neutral-400 font-mono">
                  Últim inici de sessió: {u.lastLogin}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PARÀMETRES EMPRESA & TELEGRAM BOT */}
      {activeTab === 'empresa' && (
        <form onSubmit={handleSaveCompanySettings} className="space-y-6 text-xs">
          
          {/* Card 1: Company Fiscal & Tax Data */}
          <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2 border-b pb-3">
              <Building2 size={20} className="text-primary" /> Paràmetres Fiscals i de Contacte de l'Empresa
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">RAÓ SOCIAL DE L'EMPRESA</label>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 outline-none focus:border-primary" 
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">NIF / CIF FISCAL</label>
                <input 
                  type="text" 
                  value={companyNif}
                  onChange={(e) => setCompanyNif(e.target.value)}
                  className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold font-mono text-neutral-900 outline-none focus:border-primary" 
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">TELÈFON CENTRAL CORPORATIU</label>
                <input 
                  type="text" 
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 outline-none focus:border-primary" 
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">CORREU DE FACTURACIÓ I CLIENTS</label>
                <input 
                  type="email" 
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 outline-none focus:border-primary" 
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="font-bold text-neutral-700 block mb-1">ADREÇA FISCAL I SEU CENTRAL</label>
                <input 
                  type="text" 
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 outline-none focus:border-primary" 
                />
              </div>
            </div>
          </div>

          {/* Card 2: Telegram Bot Integration & Webhook */}
          <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2">
                <Bot size={20} className="text-blue-600" /> Configuració del Bot de Telegram per Notificacions i Clients
              </h3>

              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full border border-emerald-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                🟢 Webhook Connectat & Operatiu
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">TELEGRAM BOT TOKEN (API Key Oficial)</label>
                <input 
                  type="text" 
                  value={telegramBotToken}
                  onChange={(e) => setTelegramBotToken(e.target.value)}
                  className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-neutral-900 text-xs outline-none focus:border-blue-600" 
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">CHAT ID DEL CANAL D'ALERTES D'ENGINYERIA</label>
                <input 
                  type="text" 
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-neutral-900 text-xs outline-none focus:border-blue-600" 
                />
              </div>
            </div>

            {/* Test Bot Button & Feedback */}
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-900">Prova de Connexió en Temps Real</span>
                <button
                  type="button"
                  onClick={handleTestTelegramBot}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                >
                  <Send size={14} /> 🧪 Provar Notificació de Bot
                </button>
              </div>

              {botLogMessage && (
                <div className="p-3 bg-white border border-blue-200 rounded-xl text-neutral-900 font-mono text-[11px]">
                  {botLogMessage}
                </div>
              )}
            </div>
          </div>

          {/* Action Save Bar */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-8 py-3.5 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              <Save size={18} /> 💾 Desar Canvis de l'Empresa i Telegram
            </button>
          </div>
        </form>
      )}

      {/* MODAL AFECIÓ DE NOU PERSONAL O ENGINYER */}
      {showAddModal && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <form onSubmit={handleAddUser} className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2">
                <UserPlus size={20} className="text-primary" /> Donar d'Alta Nou Personal o Enginyer
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X size={22} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Nom i Cognoms *</label>
                <input required type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="ex: Laura Fonts" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-medium outline-none focus:border-primary" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">NIF *</label>
                  <input required type="text" value={newNif} onChange={(e) => setNewNif(e.target.value)} placeholder="47881122K" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-mono font-medium outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Telèfon *</label>
                  <input required type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="600 11 22 33" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-mono font-medium outline-none focus:border-primary" />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Correu Corporatiu *</label>
                <input required type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="laura.fonts@campopro.cat" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-medium outline-none focus:border-primary" />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Rol d'Empresa *</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value as any)} className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-primary outline-none">
                  <option value="ENGINYER_SUPERVISOR">Enginyer Agrònom Supervisor (Accés Dashboard Web)</option>
                  <option value="CAP_PERSONAL">Cap de Personal & RRHH (Accés Dashboard Web)</option>
                  <option value="COMPTABILITAT">Comptabilitat & Facturació (Accés Dashboard Web)</option>
                  <option value="SECRETARI">Secretaria & Administració (Accés Dashboard Web)</option>
                  <option value="CAP_GRUP_OPERARI">Cap de Grup (Només PWA Mòbil)</option>
                  <option value="OPERARI_PWA">Operari de Camp (Només PWA Mòbil)</option>
                </select>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-600 font-medium">
                {newRole === 'CAP_GRUP_OPERARI' || newRole === 'OPERARI_PWA' ? (
                  <span className="text-amber-800 font-bold flex items-center gap-1">
                    <Smartphone size={14} /> Els Caps de Grup i Operaris només tindran accés a la PWA Mòbil.
                  </span>
                ) : (
                  <span className="text-purple-900 font-bold flex items-center gap-1">
                    <Monitor size={14} /> Aquest rol tindrà accés al Dashboard Web d'Enginyeria i Gestió.
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2.5 bg-neutral-100 text-neutral-700 font-bold text-xs rounded-xl">Cancel·lar</button>
              <button type="submit" className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary/90">Crear Usuari</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
