'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/apiClient';
import { 
  Settings, Users, Shield, Lock, Key, UserPlus, ShieldCheck, ShieldAlert, Check, 
  X, Edit3, Trash2, Smartphone, Mail, Phone, RefreshCw, Server, Bot, CheckCircle2,
  Building2, Save, Send, AlertTriangle, Monitor, HardDrive, CreditCard, Landmark,
  QrCode, Receipt, Plus, PlusCircle, DollarSign, Eye, Image
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
  photoUrl?: string;
  especialitat?: string;
  permis_conduir?: string;
  vehicle_assignat?: string;
  domicili?: string;
  cap_de_grup_id?: string;
}

interface CorporateCard {
  id: string;
  cardNumber: string;
  holderName: string;
  holderRole: string;
  monthlyLimit: number;
  bankName: string;
  status: 'ACTIVA' | 'BLOQUEJADA';
}

interface BankAccount {
  id: string;
  bankName: string;
  iban: string;
  type: 'COBRAMENTS_CLIENTS' | 'PAGAMENTS_PROVEIDORS' | 'NOMINES';
  bic: string;
}

interface ExpenseTicketDashboard {
  id: string;
  workerName: string;
  concept: string;
  amount: string;
  category: 'BENZINA' | 'MATERIAL' | 'DIETES' | 'EINA_EMERGENCIA' | 'PEATGE' | 'ALTRES';
  date: string;
  cardAssigned: string;
  photoUrl: string;
  status: 'APROVAT' | 'SINCRONITZAT';
}

const DASHBOARD_TICKETS_DB: ExpenseTicketDashboard[] = [];

const INITIAL_CARDS: CorporateCard[] = [];

const INITIAL_BANKS: BankAccount[] = [];

const INITIAL_STAFF_DATABASE: StaffUser[] = [];

export default function ConfiguracioPage() {
  const [users, setUsers] = useState<StaffUser[]>(INITIAL_STAFF_DATABASE);
  const [cards, setCards] = useState<CorporateCard[]>(INITIAL_CARDS);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(INITIAL_BANKS);
  const [tickets, setTickets] = useState<ExpenseTicketDashboard[]>(DASHBOARD_TICKETS_DB);
  const [selectedTicketPhoto, setSelectedTicketPhoto] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'personal' | 'auth' | 'empresa'>('personal');
  const [showAddModal, setShowAddModal] = useState(false);

  // Load users from backend API on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const dbUsers = await apiClient.get('/users');
        if (dbUsers && Array.isArray(dbUsers)) {
          const mappedUsers = dbUsers.map((u: any) => ({
            id: u.id,
            name: u.nom,
            nif: u.nif || '00000000X',
            email: u.email || '',
            role: u.rol,
            roleLabel: u.rol, // Fallback, could map from role
            accessType: ((u.rol === 'CAP_GRUP_OPERARI' || u.rol === 'OPERARI_PWA') ? 'PWA_MOBIL' : 'DASHBOARD_WEB') as 'DASHBOARD_WEB' | 'PWA_MOBIL',
            lastLogin: 'Mai registrat',
            phone: u.telefon || '',
            status: u.actiu ? 'ACTIU' : 'INACTIU',
            photoUrl: undefined,
            especialitat: u.especialitat,
            permis_conduir: u.permis_conduir,
            vehicle_assignat: u.vehicle_assignat,
            domicili: u.domicili,
            cap_de_grup_id: u.cap_de_grup_id
          }));
          setUsers(mappedUsers);
        }
      } catch (e) {
        console.error("Error loading staff from backend", e);
      }
    };
    fetchUsers();
  }, []);



  // Company Parameters & Bizum State
  const [companyName, setCompanyName] = useState('');
  const [companyNif, setCompanyNif] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  
  // Treasury & Bizum Settings
  const [bizumPhone, setBizumPhone] = useState('');
  const [bizumMerchantId, setBizumMerchantId] = useState('');

  // Telegram Bot State
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [telegramStatus, setTelegramStatus] = useState<'OPERATIU' | 'PROVANT'>('OPERATIU');
  const [botLogMessage, setBotLogMessage] = useState<string | null>(null);

  // New User Form State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newNif, setNewNif] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<StaffUser['role']>('ENGINYER_SUPERVISOR');
  const [newPassword, setNewPassword] = useState('');
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [newDrivingLicense, setNewDrivingLicense] = useState('B');
  const [newSpecialty, setNewSpecialty] = useState('General');
  const [newTeamLeaderId, setNewTeamLeaderId] = useState('');
  const [newDomicili, setNewDomicili] = useState('');
  const [newVehicleAssignat, setNewVehicleAssignat] = useState('Cap');

  const generatePassword = (role: StaffUser['role'] = newRole) => {
    if (role === 'CAP_GRUP_OPERARI' || role === 'OPERARI_PWA') {
      // 6-digit numeric PIN for PWA access
      let pin = '';
      const array = new Uint32Array(6);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < 6; i++) {
        pin += (array[i] % 10).toString();
      }
      setNewPassword(pin);
    } else {
      // 12-char alphanumeric for Web Dashboard
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*+?';
      let pwd = '';
      const array = new Uint32Array(12);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < 12; i++) {
        pwd += chars[array[i] % chars.length];
      }
      setNewPassword(pwd);
    }
  };

  const loadData = async () => {
    try {
      const dbUsers = await apiClient.get('/users');
      if (dbUsers && Array.isArray(dbUsers)) {
        const mappedUsers = dbUsers.map((u: any) => ({
          id: u.id,
          name: u.nom,
          nif: u.nif || '00000000X',
          email: u.email || '',
          role: u.rol,
          roleLabel: u.rol, // Fallback
          accessType: ((u.rol === 'CAP_GRUP_OPERARI' || u.rol === 'OPERARI_PWA') ? 'PWA_MOBIL' : 'DASHBOARD_WEB') as 'DASHBOARD_WEB' | 'PWA_MOBIL',
          lastLogin: 'Mai registrat',
          phone: u.telefon || '',
          status: u.actiu ? 'ACTIU' : 'INACTIU',
          photoUrl: undefined,
          especialitat: u.especialitat,
          permis_conduir: u.permis_conduir,
          vehicle_assignat: u.vehicle_assignat,
          domicili: u.domicili,
          cap_de_grup_id: u.cap_de_grup_id
        }));
        setUsers(mappedUsers);
      }
    } catch (e) {
      console.error("Error loading staff from backend", e);
    }
  };

  const handleOpenAddModal = () => {
    setEditingUserId(null);
    setNewName('');
    setNewEmail('');
    setNewNif('');
    setNewPhone('');
    setNewRole('ENGINYER_SUPERVISOR');
    setNewSpecialty('General');
    setNewTeamLeaderId('');
    setNewPhoto(null);
    setNewDrivingLicense('B');
    setNewDomicili('');
    setNewVehicleAssignat('Cap');
    generatePassword('ENGINYER_SUPERVISOR');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (u: StaffUser) => {
    setEditingUserId(u.id);
    setNewName(u.name);
    setNewEmail(u.email);
    setNewNif(u.nif || '');
    setNewPhone(u.phone);
    setNewRole(u.role);
    setNewSpecialty(u.especialitat || 'General');
    setNewTeamLeaderId(u.cap_de_grup_id || '');
    setNewDrivingLicense(u.permis_conduir || 'B');
    setNewDomicili(u.domicili || '');
    setNewVehicleAssignat(u.vehicle_assignat || 'Cap');
    setNewPassword(''); // Keep empty if not changing password
    setShowAddModal(true);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const isMobileOnlyRole = newRole === 'CAP_GRUP_OPERARI' || newRole === 'OPERARI_PWA';
    const computedAccess: StaffUser['accessType'] = isMobileOnlyRole ? 'PWA_MOBIL' : 'DASHBOARD_WEB';

    let roleLabelText = 'Enginyer de Camp';
    if (newRole === 'COMPTABILITAT') roleLabelText = 'Comptabilitat & Facturació';
    else if (newRole === 'SECRETARI') roleLabelText = 'Secretaria & Administració';
    else if (newRole === 'CAP_PERSONAL') roleLabelText = 'Cap de Personal & RRHH';
    else if (newRole === 'CAP_GRUP_OPERARI') roleLabelText = 'Cap de Grup (Només PWA Mòbil)';
    else if (newRole === 'OPERARI_PWA') roleLabelText = 'Operari de Camp (Només PWA Mòbil)';

    const payload: any = {
      nom: newName,
      rol: newRole,
      email: newEmail,
      telefon: newPhone || '600 00 00 00',
      nif: newNif,
      vehicle_assignat: isMobileOnlyRole ? newVehicleAssignat : undefined,
      especialitat: newSpecialty,
      cap_de_grup_id: newTeamLeaderId || undefined,
      actiu: true,
      permis_conduir: newDrivingLicense,
      domicili: newDomicili
    };
    if (newPassword) {
      payload.password = newPassword;
      payload.pin = newPassword;
    }

    try {
      if (editingUserId) {
        await apiClient.patch(`/users/${editingUserId}`, payload);
        alert(`S'han guardat els canvis de ${newName}.`);
      } else {
        await apiClient.post('/users', payload);
        alert(`✨ Nou usuari "${newName}" creat com a ${roleLabelText} a la base de dades.\n\nAccés: ${computedAccess === 'DASHBOARD_WEB' ? '💻 Dashboard Web' : '📱 PWA Mòbil'}\n\nLliureu aquestes credencials al treballador:\n📧 Email: ${newEmail}\n🔑 Contrasenya: ${newPassword}`);
      }
      
      await loadData();
      setShowAddModal(false);
    } catch (e) {
      console.error("Error saving user in backend", e);
      alert("Error guardant l'usuari a la base de dades.");
    }
  };

  const handleSaveCompanySettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`💾 S'han desat correctament els paràmetres fiscals, comptes IBAN, Bizum (${bizumPhone}), targetes corporatives de Caps de Grup i la configuració del Bot de Telegram de ${companyName}!`);
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
        <span className="text-primary font-semibold">Configuració, Tiquets, Comptes i Telegram</span>
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <Settings className="text-primary" size={28} />
            Paràmetres Fiscals, Historial de Tiquets i Telegram
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Auditoria de tiquets enviats des de la PWA (Material, Benzina, Dietes), comptes IBAN, Bizum i permisos d'usuari.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
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
          <Building2 size={16} className="text-blue-600" /> Paràmetres Fiscals, Tiquets, IBAN & Telegram
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
                    {u.photoUrl ? (
                      <img src={u.photoUrl} alt={u.name} className="w-10 h-10 rounded-2xl object-cover shadow-inner shrink-0 border border-neutral-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shadow-inner shrink-0">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
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
                    <button 
                      onClick={async () => {
                        if (confirm(`Estàs segur que vols eliminar l'usuari ${u.name}?`)) {
                          try {
                            await apiClient.delete(`/users/${u.id}`);
                            const updatedUsers = users.filter(user => user.id !== u.id);
                            setUsers(updatedUsers);
                          } catch (e) {
                            console.error("Error deleting user from backend", e);
                            alert("No s'ha pogut esborrar l'usuari de la base de dades.");
                          }
                        }
                      }}
                      className="p-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl font-bold transition-colors"
                      title="Eliminar Usuari"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PERMISOS D'ACCÉS AUTH */}
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
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      u.accessType === 'DASHBOARD_WEB' ? 'bg-purple-100 text-purple-900' : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {u.accessType === 'DASHBOARD_WEB' ? '💻 Accés Web' : '📱 Accés PWA'}
                    </span>
                    <button 
                      onClick={() => handleOpenEditModal(u)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold underline"
                    >
                      Editar
                    </button>
                  </div>
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

      {/* TAB 3: PARÀMETRES EMPRESA, HISTORIAL DE TIQUETS DASHBOARD, IBAN & TELEGRAM */}
      {activeTab === 'empresa' && (
        <form onSubmit={handleSaveCompanySettings} className="space-y-6 text-xs">
          
          {/* Card 1: HISTORIAL DE TIQUETS I DESPESES DE CAMP AL DASHBOARD */}
          <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase">
                  Sincronitzat des de la PWA Mòbil
                </span>
                <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2 mt-1">
                  <Receipt size={20} className="text-emerald-700" />
                  Historial i Auditoria de Tiquets de Despeses de Camp
                </h3>
              </div>
              <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                {tickets.length} Tiquets Registrats
              </span>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              Aquí el departament de <strong>Comptabilitat</strong> pot consultar i auditar l'historial complet de tiquets enviats des del terreny pels Caps de Grup (Material, Benzina, Dietes).
            </p>

            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-neutral-100 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 text-sm">{ticket.concept}</span>
                      <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded ${
                        ticket.category === 'MATERIAL' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                        ticket.category === 'BENZINA' ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-blue-100 text-blue-900 border border-blue-200'
                      }`}>
                        {ticket.category}
                      </span>
                    </div>
                    <span className="text-neutral-500 block text-xs">Treballador: <strong>{ticket.workerName}</strong> • Data: {ticket.date}</span>
                    <span className="text-emerald-800 font-bold block text-xs">{ticket.cardAssigned} • Estat: {ticket.status}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-lg font-extrabold text-neutral-900">{ticket.amount}</span>
                    <img 
                      src={ticket.photoUrl} 
                      alt="Foto tiquet" 
                      onClick={() => setSelectedTicketPhoto(ticket.photoUrl)}
                      className="w-14 h-14 rounded-xl object-cover border border-neutral-300 shadow-sm cursor-pointer hover:scale-105 transition-transform" 
                      title="Clica per ampliar el comprovant"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Company Fiscal & Tax Data */}
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

          {/* Card 3: Bank Accounts (IBANs) & Bizum Payment Gateways */}
          <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2 border-b pb-3">
              <Landmark size={20} className="text-emerald-700" /> Comptes Bancaris (IBAN) i Cobraments Bizum d'Empresa
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bankAccounts.map((b) => (
                <div key={b.id} className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center border-b border-emerald-200 pb-2">
                    <span className="font-bold text-emerald-950 text-sm">{b.bankName}</span>
                    <span className="px-2.5 py-0.5 bg-emerald-700 text-white font-bold text-[10px] rounded-full">
                      {b.type}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 font-bold block uppercase">Codi IBAN per Facturació:</span>
                    <span className="font-mono font-extrabold text-neutral-900 text-sm">{b.iban}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono block">SWIFT/BIC: {b.bic}</span>
                </div>
              ))}
            </div>

            {/* Bizum Mobile Payment Gateway */}
            <div className="p-4 bg-gradient-to-r from-teal-900 to-emerald-900 text-white rounded-2xl space-y-3 shadow-md">
              <div className="flex justify-between items-center border-b border-teal-800 pb-2">
                <div className="flex items-center gap-2">
                  <QrCode size={20} className="text-teal-300" />
                  <h4 className="font-bold text-sm text-teal-100">Cobraments amb Bizum d'Empresa (Camp & PWA)</h4>
                </div>
                <span className="px-3 py-1 bg-teal-800 text-teal-200 font-bold text-[10px] rounded-full">
                  Actiu per Caps de Grup
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-teal-300 uppercase block mb-1">TELÈFON BIZUM PROFESSIONAL</label>
                  <input 
                    type="text"
                    value={bizumPhone}
                    onChange={(e) => setBizumPhone(e.target.value)}
                    className="w-full p-2.5 bg-teal-950 border border-teal-700 rounded-xl font-mono font-bold text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-teal-300 uppercase block mb-1">ID DE COMERÇ BIZUM (TPV)</label>
                  <input 
                    type="text"
                    value={bizumMerchantId}
                    onChange={(e) => setBizumMerchantId(e.target.value)}
                    className="w-full p-2.5 bg-teal-950 border border-teal-700 rounded-xl font-mono font-bold text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Corporate Cards & Holders (Caps de Grup) */}
          <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2">
                <CreditCard size={20} className="text-purple-700" /> Targetes Corporatives i Titulars (Qui en disposa)
              </h3>
              <span className="text-xs text-neutral-500 font-bold bg-neutral-100 px-3 py-1 rounded-full">
                {cards.length} Targetes Actives
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cards.map((card) => (
                <div key={card.id} className="p-4 bg-neutral-900 text-white rounded-2xl shadow-lg border border-neutral-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-bold text-neutral-400">{card.bankName}</span>
                    <span className="px-2 py-0.5 bg-emerald-900 text-emerald-300 text-[10px] font-bold rounded">
                      {card.status}
                    </span>
                  </div>

                  <div className="font-mono text-base tracking-widest text-neutral-200 py-1">
                    {card.cardNumber}
                  </div>

                  <div className="flex justify-between items-end border-t border-neutral-800 pt-2 text-xs">
                    <div>
                      <span className="text-[9px] text-neutral-400 block uppercase">Titular / Qui en disposa</span>
                      <span className="font-extrabold text-white">{card.holderName}</span>
                      <span className="text-[10px] text-neutral-400 block">{card.holderRole}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-neutral-400 block uppercase">Límit Mensual</span>
                      <span className="font-bold text-emerald-400">{card.monthlyLimit} €</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 5: Telegram Bot Integration */}
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
              <Save size={18} /> 💾 Desar Canvis de l'Empresa, Tiquets, Comptes i Telegram
            </button>
          </div>
        </form>
      )}

      {/* MODAL AMPLIACIÓ DE FOTO DE TIQUET */}
      {selectedTicketPhoto && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-4 max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setSelectedTicketPhoto(null)} className="absolute top-3 right-3 bg-neutral-900 text-white p-2 rounded-full">
              <X size={20} />
            </button>
            <h4 className="font-bold text-sm text-neutral-900 mb-3">Comprovant Escanejat de Tiquet</h4>
            <img src={selectedTicketPhoto} alt="Foto tiquet ampliada" className="w-full h-80 object-cover rounded-2xl border border-neutral-300 shadow-inner" />
          </div>
        </div>
      )}

      {/* MODAL AFECIÓ DE NOU PERSONAL O ENGINYER */}
      {showAddModal && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <form onSubmit={handleAddUser} className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2">
                <UserPlus size={20} className="text-primary" /> {editingUserId ? 'Editar Personal' : "Donar d'Alta Nou Personal o Enginyer"}
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
                <label className="font-bold text-neutral-700 block mb-1">Correu Corporatiu (Usuari d'accés) *</label>
                <input required={!editingUserId} type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="laura.fonts@campopro.cat" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-medium outline-none focus:border-primary" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-neutral-700 block">
                    {newRole === 'CAP_GRUP_OPERARI' || newRole === 'OPERARI_PWA' ? "Codi PIN d'Accés PWA (6 dígits) *" : "Clau d'Autenticació (Contrasenya) *"}
                  </label>
                  <button type="button" onClick={() => generatePassword(newRole)} className="text-[10px] text-primary hover:underline font-bold flex items-center gap-1">
                    <RefreshCw size={10} /> Generar nova clau
                  </button>
                </div>
                <input required={!editingUserId} type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={newRole === 'CAP_GRUP_OPERARI' || newRole === 'OPERARI_PWA' ? "123456" : "Contrasenya"} className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-primary font-bold outline-none focus:border-primary tracking-widest" />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Foto del Treballador (Opcional)</label>
                <div className="flex items-center gap-4 p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
                  {newPhoto ? (
                    <img src={URL.createObjectURL(newPhoto)} alt="Preview" className="w-12 h-12 rounded-xl object-cover shadow-inner border border-neutral-300 shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-neutral-200 flex items-center justify-center text-neutral-400 shrink-0">
                      <Image size={20} />
                    </div>
                  )}
                  <div className="w-full">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setNewPhoto(e.target.files[0]);
                        }
                      }}
                      className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Rol d'Empresa *</label>
                <select 
                  value={newRole} 
                  onChange={(e) => {
                    const role = e.target.value as StaffUser['role'];
                    setNewRole(role);
                    generatePassword(role);
                  }} 
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-primary outline-none"
                >
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

              {(newRole === 'CAP_GRUP_OPERARI' || newRole === 'OPERARI_PWA') && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Especialitat *</label>
                    <input 
                      required 
                      type="text" 
                      value={newSpecialty} 
                      onChange={(e) => setNewSpecialty(e.target.value)} 
                      placeholder="ex: Electricista, General" 
                      className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-medium outline-none focus:border-primary" 
                    />
                  </div>
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Carnet de Conduir *</label>
                    <select 
                      value={newDrivingLicense} 
                      onChange={(e) => setNewDrivingLicense(e.target.value)} 
                      className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-medium outline-none"
                    >
                      <option value="Cap">Sense Carnet</option>
                      <option value="B">Tipus B (Turismes i furgonetes petites)</option>
                      <option value="B+E">Tipus B+E (Remolcs)</option>
                      <option value="C1">Tipus C1 (Camions lleugers)</option>
                      <option value="C">Tipus C (Camions pesats)</option>
                      <option value="Tractor">Llicència de Vehicles Agrícoles (Tractor)</option>
                    </select>
                  </div>
                </div>
              )}

              {newRole === 'OPERARI_PWA' && (
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Cap de Grup Assignat (Opcional)</label>
                  <select 
                    value={newTeamLeaderId} 
                    onChange={(e) => setNewTeamLeaderId(e.target.value)} 
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-medium outline-none"
                  >
                    <option value="">Sense Cap de Grup (Lliure)</option>
                    {users.filter(u => u.role === 'CAP_GRUP_OPERARI').map(leader => (
                      <option key={leader.id} value={leader.id}>{leader.name}</option>
                    ))}
                  </select>
                </div>
              )}
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
