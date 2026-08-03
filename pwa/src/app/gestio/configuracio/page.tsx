'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Settings, Users, Shield, Lock, Key, UserPlus, ShieldCheck, ShieldAlert, Check, 
  X, Edit3, Trash2, Smartphone, Mail, Phone, RefreshCw, Server, Bot, CheckCircle2
} from 'lucide-react';

interface StaffUser {
  id: string;
  name: string;
  nif: string;
  email: string;
  role: 'ENGINYER_SUPERVISOR' | 'CAP_PERSONAL' | 'CAP_GRUP_OPERARI' | 'OPERARI_PWA';
  roleLabel: string;
  dashboardAccess: boolean;
  twoFactorAuth: boolean;
  lastLogin: string;
  phone: string;
  status: 'ACTIU' | 'REVOCAT' | 'PENDENT';
}

const STAFF_DATABASE: StaffUser[] = [
  {
    id: 'usr-1',
    name: 'Marc Solsona',
    nif: '47889911A',
    email: 'marc.solsona@campopro.cat',
    role: 'ENGINYER_SUPERVISOR',
    roleLabel: 'Enginyer Agrònom Supervisor',
    dashboardAccess: true,
    twoFactorAuth: true,
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
    dashboardAccess: true,
    twoFactorAuth: true,
    lastLogin: 'Ieri 18:30 (IP: 83.34.12.9)',
    phone: '600 00 33 44',
    status: 'ACTIU'
  },
  {
    id: 'usr-3',
    name: 'Jordi Soler',
    nif: '47881122K',
    email: 'jordi.soler@campopro.cat',
    role: 'CAP_GRUP_OPERARI',
    roleLabel: 'Cap de Grup / Operari de Camp',
    dashboardAccess: true,
    twoFactorAuth: false,
    lastLogin: 'Avui 08:02 (App PWA)',
    phone: '600 12 34 56',
    status: 'ACTIU'
  },
  {
    id: 'usr-4',
    name: 'Pau Ribas',
    nif: '38992211L',
    email: 'pau.ribas@campopro.cat',
    role: 'OPERARI_PWA',
    roleLabel: 'Operari Agrícola & Maquinista',
    dashboardAccess: false,
    twoFactorAuth: false,
    lastLogin: 'Avui 08:05 (App PWA)',
    phone: '600 98 76 54',
    status: 'ACTIU'
  }
];

export default function ConfiguracioPage() {
  const [users, setUsers] = useState<StaffUser[]>(STAFF_DATABASE);
  const [activeTab, setActiveTab] = useState<'personal' | 'auth' | 'empresa'>('personal');
  const [showAddModal, setShowAddModal] = useState(false);

  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newNif, setNewNif] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<StaffUser['role']>('ENGINYER_SUPERVISOR');
  const [grantDashboard, setGrantDashboard] = useState(true);

  const toggleDashboardAccess = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, dashboardAccess: !u.dashboardAccess } : u));
  };

  const toggle2FA = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, twoFactorAuth: !u.twoFactorAuth } : u));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newUserObj: StaffUser = {
      id: `usr-${Date.now()}`,
      name: newName,
      nif: newNif || '00000000X',
      email: newEmail,
      role: newRole,
      roleLabel: newRole === 'ENGINYER_SUPERVISOR' ? 'Enginyer de Camp' : newRole === 'CAP_PERSONAL' ? 'Cap de Personal' : 'Operari',
      dashboardAccess: grantDashboard,
      twoFactorAuth: false,
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
    alert(`✨ Nou personal/enginyer "${newName}" creat amb èxit! Se li ha enviat un correu amb les credencials d'accés al portal.`);
  };

  return (
    <div className="p-6 pt-32 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-xs text-neutral-500 gap-1">
        <Link href="/gestio" className="hover:text-primary">Dashboard</Link>
        <span>/</span>
        <span className="text-primary font-semibold">Configuració, Personal i Autenticació Auth</span>
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <Settings className="text-primary" size={28} />
            Configuració de Personal, Enginyers i Permisos d'Accés
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Gestió centralitzada de la plantilla de l'empresa, rols d'enginyeria, caps de personal i configuració d'autenticació (Auth).
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
          <Users size={16} /> Personal & Caps de Personal ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('auth')}
          className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'auth' ? 'bg-white text-emerald-800 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <ShieldCheck size={16} className="text-emerald-600" /> Permisos d'Autenticació & Auth
        </button>

        <button
          onClick={() => setActiveTab('empresa')}
          className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'empresa' ? 'bg-white text-blue-800 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Server size={16} className="text-blue-600" /> Paràmetres Empresa & Telegram Bot
        </button>
      </div>

      {/* TAB 1: PERSONAL I ROLS */}
      {activeTab === 'personal' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex justify-between items-center font-bold text-xs text-neutral-500 uppercase tracking-wider">
              <span>Nom i NIF</span>
              <span>Rol de l'Empresa</span>
              <span>Contacte</span>
              <span>Accés Dashboard</span>
              <span>Accions</span>
            </div>

            <div className="divide-y divide-neutral-100">
              {users.map((u) => (
                <div key={u.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-neutral-50/80 transition-colors text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shadow-inner">
                      {u.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">{u.name}</h4>
                      <span className="font-mono text-neutral-400 text-[11px]">NIF: {u.nif}</span>
                    </div>
                  </div>

                  <div>
                    <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                      u.role === 'ENGINYER_SUPERVISOR' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                      u.role === 'CAP_PERSONAL' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                      'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    }`}>
                      {u.roleLabel}
                    </span>
                  </div>

                  <div className="space-y-0.5 font-medium text-neutral-700">
                    <p className="flex items-center gap-1"><Mail size={12} className="text-neutral-400" /> {u.email}</p>
                    <p className="flex items-center gap-1 font-mono text-[11px]"><Phone size={12} className="text-neutral-400" /> {u.phone}</p>
                  </div>

                  <div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                      u.dashboardAccess ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {u.dashboardAccess ? '✓ Accés Habilitat' : '✕ Sense Accés'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleDashboardAccess(u.id)}
                      className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-bold transition-colors text-[11px]"
                      title="Canviar permisos d'accés"
                    >
                      Permisos
                    </button>
                    <button 
                      onClick={() => alert(`Enviat correu de restabliment de contrasenya a ${u.email}`)}
                      className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-bold transition-colors text-[11px]"
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

      {/* TAB 2: PERMISOS D'AUTENTICACIÓ (AUTH DASHBOARD) */}
      {activeTab === 'auth' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex justify-between items-center">
            <div>
              <span className="text-xs text-emerald-900 font-bold block">Seguretat i Control d'Autenticació (Auth Server)</span>
              <span className="text-neutral-600 text-[11px]">Controla quins enginyers i caps de personal poden accedir al Portal de Gestió Web.</span>
            </div>
            <span className="px-3 py-1.5 bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow">
              <ShieldCheck size={16} /> Encriptació JWT + SSL
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
                    u.status === 'ACTIU' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {u.status}
                  </span>
                </div>

                <div className="space-y-2 bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-neutral-700">Accés al Dashboard Web:</span>
                    <button 
                      onClick={() => toggleDashboardAccess(u.id)}
                      className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-colors ${
                        u.dashboardAccess ? 'bg-emerald-600 text-white' : 'bg-neutral-300 text-neutral-700'
                      }`}
                    >
                      {u.dashboardAccess ? 'SI (Permés)' : 'NO (Bloquejat)'}
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-neutral-700">Doble Factor 2FA:</span>
                    <button 
                      onClick={() => toggle2FA(u.id)}
                      className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-colors ${
                        u.twoFactorAuth ? 'bg-purple-600 text-white' : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {u.twoFactorAuth ? '🔒 2FA Actiu' : 'Inactiu'}
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-neutral-400 font-mono">
                  Última sessió iniciada: {u.lastLogin}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EMPRESA & BOT */}
      {activeTab === 'empresa' && (
        <div className="space-y-4 text-xs">
          <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2 border-b pb-3">
              <Building2 size={20} className="text-primary" /> Paràmetres Fiscal i de l'Empresa
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">RAÓ SOCIAL</label>
                <input type="text" defaultValue="CampoPro Serveis Agrícoles SL" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900" />
              </div>
              <div>
                <label className="font-bold text-neutral-700 block mb-1">NIF FISCAL</label>
                <input type="text" defaultValue="B-65498712" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 font-mono" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2 border-b pb-3">
              <Bot size={20} className="text-blue-600" /> Token del Bot de Telegram per Notificacions
            </h3>

            <div className="space-y-2">
              <label className="font-bold text-neutral-700 block">TELEGRAM BOT TOKEN (API Official)</label>
              <input type="password" defaultValue="7123984712:AAH9fklmN389f_xK" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-neutral-900" />
              <span className="text-[10px] text-emerald-700 font-bold block">✓ Bot actiu i connectat al canal de notificacions automàtiques de clients.</span>
            </div>
          </div>
        </div>
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
                <label className="font-bold text-neutral-700 block mb-1">Rol d'Empresa</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value as any)} className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-primary outline-none">
                  <option value="ENGINYER_SUPERVISOR">Enginyer Agrònom Supervisor</option>
                  <option value="CAP_PERSONAL">Cap de Personal & RRHH</option>
                  <option value="CAP_GRUP_OPERARI">Cap de Grup / Operari de Camp</option>
                  <option value="OPERARI_PWA">Operari de Camp</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                <input type="checkbox" id="grantDash" checked={grantDashboard} onChange={(e) => setGrantDashboard(e.target.checked)} className="w-4 h-4 text-primary rounded" />
                <label htmlFor="grantDash" className="font-bold text-neutral-800 cursor-pointer">Habilitar accés Auth al Portal Dashboard Web</label>
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
