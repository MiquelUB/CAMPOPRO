'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { 
  Users, UserCheck, User, Star, Clock, Truck, Wrench, AlertTriangle, Search, Phone, Mail, 
  MapPin, ShieldCheck, CheckCircle2, FileText, ChevronRight, X, Calendar, Camera, 
  MessageSquare, ThumbsUp, Activity, PenTool, Award, Fuel, Gauge, ExternalLink, Download, 
  Building2, DollarSign, CheckSquare, Eye, Compass, Package, Receipt, FileCheck, ShieldAlert,
  UserPlus, Lock, Key, Settings, Check, LogIn, LogOut, Shield
} from 'lucide-react';

interface CompletedJobDetail {
  id: string;
  code: string;
  title: string;
  clientName: string;
  clientId: string;
  clientContact: string;
  date: string;
  hours: string;
  cost: string;
  invoiceCode: string;
  photoUrl: string;
  signatureUrl: string;
  locationName: string;
  gpsCoords: string;
  assignedWorkerName: string;
  vehicleUsed: string;
  materialsUsed: Array<{ name: string; qty: string; unitPrice: number }>;
  toolsUsed: string[];
  description: string;
  clientFeedback?: { rating: number; review: string };
}

interface WorkShiftLog {
  id: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  totalHours: string;
  checkInGps: string;
  checkOutGps: string;
  status: 'COMPLERT' | 'EN_CURS' | 'INCIDENCIA';
}

interface CrewMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  assignedVehicle: string;
  status: 'EN_JORNADA' | 'DESCANS' | 'ABSENT';
  avatar: string;
}

interface WorkerProfile {
  id: string;
  name: string;
  nif: string;
  role: string;
  specialty: string;
  phone: string;
  email: string;
  status: 'DISPONIBLE' | 'EN_FEINA' | 'VACANCES';
  isTeamLeader: boolean;
  avatar: string;
  joiningDate: string;
  drivingLicense: string;
  assignedVehicle: string;
  stats: {
    completedJobs: number;
    hoursLoggedThisMonth: number;
    kmDrivenThisMonth: number;
    clientRatingAverage: number;
    incidentsReported: number;
    toolIncidentsCount: number;
  };
  ratingBreakdown: {
    professionalism: number;
    punctuality: number;
    customerTreatment: number;
  };
  workShiftHistory: WorkShiftLog[];
  crewMembers?: CrewMember[];
  clientReviews: Array<{
    id: string;
    clientName: string;
    jobCode: string;
    date: string;
    rating: number;
    comment: string;
  }>;
  completedJobsHistory: CompletedJobDetail[];
  assignedTools: Array<{
    id: string;
    code: string;
    name: string;
    status: 'OPERATIVA' | 'REPARACIO' | 'PERDUDA';
    assignedSince: string;
  }>;
  toolIncidentsHistory: Array<{
    id: string;
    date: string;
    toolName: string;
    issueDescription: string;
    status: 'EN_REPARACIO' | 'RESOLTA';
  }>;
  vehicleKmHistory: Array<{
    id: string;
    date: string;
    vehiclePlate: string;
    startKm: number;
    endKm: number;
    recordedKm: number;
    dashboardPhotoUrl: string;
  }>;
  reportedFieldIncidents: Array<{
    id: string;
    code: string;
    date: string;
    title: string;
    audioNote: string;
    memorandumDecision: string;
    budgetExtra: string;
  }>;
}

export default function OperarisDashboardPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [selectedJobModal, setSelectedJobModal] = useState<CompletedJobDetail | null>(null);
  const [profileTab, setProfileTab] = useState<'info' | 'shifts' | 'crew' | 'jobs' | 'reviews' | 'vehicles' | 'tools' | 'incidents'>('info');

  useEffect(() => {
    const fetchOperaris = async () => {
      try {
        const dbUsers = await apiClient.get('/users');
        if (dbUsers && Array.isArray(dbUsers)) {
          const mappedOperaris = dbUsers
            .filter((u: any) => u.rol === 'CAP_GRUP_OPERARI' || u.rol === 'OPERARI_PWA')
            .map((u: any) => ({
              id: u.id,
              name: u.nom,
              nif: '00000000X',
              role: u.rol === 'CAP_GRUP_OPERARI' ? 'Cap de Grup' : 'Oficial',
              specialty: 'General',
              phone: u.telefon || '600 00 00 00',
              email: u.email || '',
              status: u.actiu ? 'DISPONIBLE' : 'BAIXA',
              isTeamLeader: u.rol === 'CAP_GRUP_OPERARI',
              avatar: undefined,
              joiningDate: u.created_at.split('T')[0],
              drivingLicense: 'B',
              assignedVehicle: u.vehicle_assignat || 'Cap',
              stats: { completedJobs: 0, hoursLoggedThisMonth: 0, kmDrivenThisMonth: 0, clientRatingAverage: 0, incidentsReported: 0, toolIncidentsCount: 0 },
              ratingBreakdown: { professionalism: 0, punctuality: 0, customerTreatment: 0 },
              workShiftHistory: [],
              clientReviews: [],
              completedJobsHistory: [],
              assignedTools: [],
              toolIncidentsHistory: [],
              vehicleKmHistory: [],
              reportedFieldIncidents: []
            }));
          setWorkers(mappedOperaris);
        }
      } catch (e) {
        console.error("Error loading operaris from backend", e);
      }
    };
    fetchOperaris();
  }, []);

  const saveWorkers = (newWorkers: WorkerProfile[]) => {
    setWorkers(newWorkers);
    // Deprecated: No guardem els analytics estatics en local de moment
    // S'haurien de guardar al backend si són reals
  };

  const filteredWorkers = workers.filter(w => 
    (w.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (w.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (w.specialty || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 pt-32 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-xs text-neutral-500 gap-1">
        <Link href="/gestio" className="hover:text-primary">Dashboard</Link>
        <span>/</span>
        <span className="text-primary font-semibold">Gestió i Rendiment d'Operaris</span>
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <Users className="text-primary" size={28} />
            Equip d'Operaris de Camp i Caps d'Equip
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Fitxa 360°: Control horari (fitxatges d'entrada/sortida per llei), composició de la colla/equip, tasques, km en vehicles i eines.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <input 
              type="text"
              placeholder="Cercar operari per nom o especialitat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary font-medium"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          </div>
          <button 
            onClick={() => {
              const newWorker = {
                id: `op_${Date.now()}`,
                name: 'Nou Operari',
                nif: '',
                role: 'Oficial 1a',
                specialty: 'General',
                phone: '',
                email: '',
                status: 'DISPONIBLE' as const,
                isTeamLeader: false,
                avatar: `👨‍🔧`,
                joiningDate: new Date().toISOString().split('T')[0],
                drivingLicense: 'B',
                assignedVehicle: 'Cap',
                stats: { completedJobs: 0, hoursLoggedThisMonth: 0, kmDrivenThisMonth: 0, clientRatingAverage: 0, incidentsReported: 0, toolIncidentsCount: 0 },
                ratingBreakdown: { professionalism: 0, punctuality: 0, customerTreatment: 0 },
                workShiftHistory: [],
                clientReviews: [],
                completedJobsHistory: [],
                assignedTools: [],
                toolIncidentsHistory: [],
                vehicleKmHistory: [],
                reportedFieldIncidents: []
              };
              saveWorkers([...workers, newWorker]);
              setSelectedWorker(newWorker);
              setProfileTab('info');
            }}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
          >
            <UserPlus size={18} />
            Donar d'Alta
          </button>
        </div>
      </div>

      {/* Global Performance Key Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Users size={22} />
          </div>
          <div>
            <span className="text-xs text-neutral-500 font-semibold block uppercase">Total Operaris</span>
            <span className="text-xl font-extrabold text-neutral-900">{workers.length} En Plantilla</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Star size={22} className="fill-amber-400 text-amber-500" />
          </div>
          <div>
            <span className="text-xs text-neutral-500 font-semibold block uppercase">Valoració Mitjana</span>
            <span className="text-xl font-extrabold text-neutral-900">—</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <Clock size={22} />
          </div>
          <div>
            <span className="text-xs text-neutral-500 font-semibold block uppercase">Control Horari Llei</span>
            <span className="text-xl font-extrabold text-emerald-800">0%</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <Truck size={22} />
          </div>
          <div>
            <span className="text-xs text-neutral-500 font-semibold block uppercase">Km Conduïts Flota</span>
            <span className="text-xl font-extrabold text-neutral-900">0 km</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-3 col-span-2 md:col-span-1">
          <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
            <Wrench size={22} />
          </div>
          <div>
            <span className="text-xs text-neutral-500 font-semibold block uppercase">Eines Assignades</span>
            <span className="text-xl font-extrabold text-neutral-900">0 En Ús</span>
          </div>
        </div>
      </div>

      {/* Workers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredWorkers.map((worker) => (
          <div 
            key={worker.id}
            onClick={() => {
              setSelectedWorker(worker);
              setProfileTab('info');
            }}
            className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              {/* Header Avatar & Status */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-3xl flex items-center justify-center border border-neutral-200 shadow-inner overflow-hidden group-hover:scale-105 transition-transform">
                  {worker.avatar?.startsWith('http') || worker.avatar?.startsWith('blob') ? (
                    <img src={worker.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    worker.avatar || '👨‍🔧'
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1 border border-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    {worker.status}
                  </span>
                  {worker.isTeamLeader && (
                    <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded">
                      👑 Cap de Grup
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Specialty */}
              <h3 className="font-bold text-lg text-neutral-900 group-hover:text-primary transition-colors">
                {worker.name}
              </h3>
              <span className="text-xs font-semibold text-primary block mb-1">{worker.role}</span>
              <p className="text-xs text-neutral-500 leading-relaxed mb-4">{worker.specialty}</p>

              {/* Quick Metrics Summary Badges */}
              <div className="space-y-2 pt-3 border-t border-neutral-100 text-xs">
                <div className="flex justify-between items-center bg-amber-50/70 p-2 rounded-xl border border-amber-200/60">
                  <span className="text-amber-900 font-medium flex items-center gap-1">
                    <Star size={14} className="fill-amber-400 text-amber-500" /> Valoració Clients:
                  </span>
                  <span className="font-extrabold text-amber-900">{worker.stats.clientRatingAverage} / 5.0</span>
                </div>

                <div className="flex justify-between items-center bg-emerald-50 p-2 rounded-xl text-emerald-800 font-bold border border-emerald-200">
                  <span className="flex items-center gap-1"><Clock size={14} className="text-emerald-600" /> Fitxatge Llei Avui:</span>
                  <span className="text-[11px] bg-emerald-600 text-white px-2 py-0.5 rounded">🟢 Entrada 08:02</span>
                </div>

                <div className="flex justify-between items-center bg-neutral-50 p-2 rounded-xl text-neutral-700">
                  <span className="flex items-center gap-1"><Truck size={14} className="text-neutral-400" /> Km Conduïts:</span>
                  <span className="font-bold text-neutral-900">{worker.stats.kmDrivenThisMonth} km</span>
                </div>
              </div>
            </div>

            {/* View Full 360° Profile Button */}
            <div className="mt-6 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
              <span>Obrir Fitxa 360° d'Operari</span>
              <ChevronRight size={18} />
            </div>
          </div>
        ))}
      </div>

      {/* FULL 360° WORKER PROFILE MODAL / DRAWER */}
      {selectedWorker && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 max-w-4xl w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-neutral-100 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-3xl bg-neutral-100 border-4 border-white shadow-lg flex items-center justify-center text-5xl flex-shrink-0 overflow-hidden relative z-10">
                  {selectedWorker.avatar?.startsWith('http') || selectedWorker.avatar?.startsWith('blob') ? (
                    <img src={selectedWorker.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    selectedWorker.avatar || '👨‍🔧'
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-neutral-900">{selectedWorker.name}</h2>
                    <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                      NIF: {selectedWorker.nif}
                    </span>
                    {selectedWorker.isTeamLeader && (
                      <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded">
                        👑 Cap de Grup / Colla
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-primary block">{selectedWorker.role}</span>
                  <span className="text-xs text-neutral-500">Especialitat: {selectedWorker.specialty}</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedWorker(null)}
                className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100"
              >
                <X size={24} />
              </button>
            </div>

            {/* Profile Section Navigation Tabs */}
            <div className="flex bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200 my-4 overflow-x-auto shrink-0 text-xs font-bold">
              <button
                onClick={() => setProfileTab('info')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  profileTab === 'info' ? 'bg-white text-primary shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <User size={16} /> Dades & Contacte
              </button>

              <button
                onClick={() => setProfileTab('shifts')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  profileTab === 'shifts' ? 'bg-white text-emerald-800 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Clock size={16} className="text-emerald-600" /> Control Horari (Registre Llei)
              </button>

              {selectedWorker.isTeamLeader && (
                <button
                  onClick={() => setProfileTab('crew')}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    profileTab === 'crew' ? 'bg-white text-primary shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <Users size={16} className="text-primary" /> Equip / Colla de Camp ({selectedWorker.crewMembers?.length || 0})
                </button>
              )}

              <button
                onClick={() => setProfileTab('jobs')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  profileTab === 'jobs' ? 'bg-white text-primary shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <FileText size={16} /> Tasques Realitzades ({selectedWorker.completedJobsHistory.length})
              </button>

              <button
                onClick={() => setProfileTab('reviews')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  profileTab === 'reviews' ? 'bg-white text-amber-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Star size={16} className="fill-amber-400 text-amber-500" /> Valoracions Clients ({selectedWorker.clientReviews.length})
              </button>

              <button
                onClick={() => setProfileTab('vehicles')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  profileTab === 'vehicles' ? 'bg-white text-blue-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Truck size={16} /> Vehicles & Km ({selectedWorker.stats.kmDrivenThisMonth} km)
              </button>

              <button
                onClick={() => setProfileTab('tools')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  profileTab === 'tools' ? 'bg-white text-purple-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Wrench size={16} /> Eines Assignades ({selectedWorker.assignedTools.length})
              </button>

              <button
                onClick={() => setProfileTab('incidents')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  profileTab === 'incidents' ? 'bg-white text-red-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <AlertTriangle size={16} /> Incidències ({selectedWorker.reportedFieldIncidents.length})
              </button>
            </div>

            {/* TAB CONTENT BODY */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              
              {/* 1. DADES PERSONALS I CONTACTE */}
              {profileTab === 'info' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                      <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-2 border-b pb-2">
                        <Phone size={16} className="text-primary" /> Informació de Contacte Directe
                      </h4>
                      <div>
                        <span className="text-neutral-500 block font-semibold">TELÈFON MÒBIL CORPORATIU</span>
                        <span className="font-extrabold text-neutral-900 text-sm">{selectedWorker.phone}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block font-semibold">CORREU ELECTRÒNIC</span>
                        <span className="font-bold text-neutral-900">{selectedWorker.email}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block font-semibold">DATA D'INCORPORACIÓ A CAMPOPRO</span>
                        <span className="font-bold text-neutral-900">{selectedWorker.joiningDate}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                      <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-2 border-b pb-2">
                        <ShieldCheck size={16} className="text-emerald-600" /> Permisos i Vehicle Habitual
                      </h4>
                      <div>
                        <span className="text-neutral-500 block font-semibold">PERMÍS DE CONDUIR I ACREDITACIONS</span>
                        <span className="font-bold text-neutral-900">{selectedWorker.drivingLicense}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block font-semibold">VEHICLE ASSIGNAT PER A LA JORNADA</span>
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 block mt-1">
                          {selectedWorker.assignedVehicle}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Breakdown Bar */}
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-2xl border border-amber-200 space-y-3">
                    <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                      <Star size={18} className="fill-amber-400 text-amber-500" /> Valoració Global dels Clients: {selectedWorker.stats.clientRatingAverage} / 5.0 ⭐
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-white p-3 rounded-xl border border-amber-200">
                        <span className="text-[10px] text-neutral-500 font-bold block uppercase">Professionalitat</span>
                        <span className="text-lg font-extrabold text-amber-900">{selectedWorker.ratingBreakdown.professionalism} ⭐</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-amber-200">
                        <span className="text-[10px] text-neutral-500 font-bold block uppercase">Puntualitat</span>
                        <span className="text-lg font-extrabold text-amber-900">{selectedWorker.ratingBreakdown.punctuality} ⭐</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-amber-200">
                        <span className="text-[10px] text-neutral-500 font-bold block uppercase">Tracte Humà</span>
                        <span className="text-lg font-extrabold text-amber-900">{selectedWorker.ratingBreakdown.customerTreatment} ⭐</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. CONTROL HORARI (FITXATGE LLEI RDL 8/2019) */}
              {profileTab === 'shifts' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex justify-between items-center">
                    <div>
                      <span className="text-xs text-emerald-900 font-bold block">Conformitat amb el Registre de Jornada (Reial Decret-Llei 8/2019)</span>
                      <span className="text-neutral-600 text-[11px]">Tots els fitxatges estan geolocalitzats i signats digitalment des de la PWA mòbil.</span>
                    </div>
                    <span className="px-3 py-1.5 bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow">
                      <ShieldCheck size={16} /> 100% Auditat
                    </span>
                  </div>

                  <h4 className="font-bold text-neutral-900 text-sm">Registre de Fitxatges d'Entrada i Sortida</h4>
                  <div className="space-y-2">
                    {selectedWorker.workShiftHistory.map((shift) => (
                      <div key={shift.id} className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-neutral-900 text-sm">{shift.date}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                              shift.status === 'EN_CURS' ? 'bg-emerald-600 text-white animate-pulse' : 'bg-neutral-200 text-neutral-800'
                            }`}>
                              {shift.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 font-mono font-semibold text-neutral-700">
                            <span className="flex items-center gap-1 text-emerald-700"><LogIn size={14} /> Entrada: {shift.checkInTime}</span>
                            <span className="flex items-center gap-1 text-blue-700"><LogOut size={14} /> Sortida: {shift.checkOutTime}</span>
                          </div>
                          <span className="text-neutral-500 block text-[10px]">📍 GPS Entrada: {shift.checkInGps}</span>
                        </div>

                        <div className="text-right bg-white p-3 rounded-xl border border-neutral-200 shadow-sm">
                          <span className="text-[10px] text-neutral-400 font-bold block uppercase">Hores Computades</span>
                          <span className="font-extrabold text-neutral-900 text-sm">{shift.totalHours}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. COMPOSICIÓ DE LA COLLA / EQUIP (CAP DE GRUP) */}
              {profileTab === 'crew' && selectedWorker.isTeamLeader && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex justify-between items-center">
                    <div>
                      <span className="text-xs text-primary font-bold block">Supervisió de Colla de Camp</span>
                      <span className="text-neutral-600 text-[11px]">{selectedWorker.name} és el Cap de Grup encarregat d'assignar tasques directes.</span>
                    </div>
                    <span className="px-3 py-1.5 bg-primary text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow">
                      👑 Cap de Grup
                    </span>
                  </div>

                  <h4 className="font-bold text-neutral-900 text-sm">Treballadors Assignats a la Colla</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedWorker.crewMembers?.map((member) => (
                      <div key={member.id} className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-neutral-200 text-2xl flex items-center justify-center border border-neutral-300">
                            {member.avatar}
                          </div>
                          <div>
                            <h5 className="font-bold text-neutral-900 text-sm">{member.name}</h5>
                            <span className="text-xs font-semibold text-primary block">{member.role}</span>
                            <span className="text-[10px] text-neutral-500 block font-mono">📞 {member.phone}</span>
                            <span className="text-[10px] text-emerald-800 font-bold block mt-0.5">🚜 {member.assignedVehicle}</span>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-300">
                          {member.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. TASQUES I FEINES REALITZADES */}
              {profileTab === 'jobs' && (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-neutral-900 text-sm">Historial de Feines Completades per {selectedWorker.name}</h4>
                    <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-1 rounded">
                      Clica sobre qualsevol feina per obrir la seva fitxa real
                    </span>
                  </div>

                  {selectedWorker.completedJobsHistory.map((job) => (
                    <div 
                      key={job.id} 
                      onClick={() => setSelectedJobModal(job)}
                      className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-emerald-50/70 hover:border-emerald-300 transition-all cursor-pointer group shadow-sm"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold bg-primary text-white px-2.5 py-0.5 rounded text-xs shadow-sm">
                            #{job.code}
                          </span>
                          <span className="font-bold text-neutral-900 text-sm group-hover:text-primary transition-colors">
                            {job.title}
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-300">
                            🟢 COMPLETADA
                          </span>
                        </div>
                        <span className="text-neutral-500 block">Client: <strong>{job.clientName}</strong> • Data: {job.date}</span>
                        <span className="text-emerald-800 font-bold block">Hores dedicades: {job.hours} • Cost executat: {job.cost}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <img src={job.photoUrl} alt="Foto feina" className="w-14 h-14 rounded-xl object-cover border border-neutral-300 shadow-sm group-hover:scale-105 transition-transform" />
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJobModal(job);
                          }}
                          className="px-3 py-2 bg-primary text-white rounded-xl font-bold text-xs shadow hover:bg-primary/90 flex items-center gap-1"
                        >
                          <Eye size={14} /> Veure Fitxa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 5. VALORACIONS I RESSENYES DELS CLIENTS */}
              {profileTab === 'reviews' && (
                <div className="space-y-3 text-xs">
                  <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                    <MessageSquare size={16} className="text-amber-500" /> Ressenyes i Comentaris dels Clients
                  </h4>
                  {selectedWorker.clientReviews.length === 0 ? (
                    <p className="text-neutral-500 italic p-4 bg-neutral-50 rounded-xl text-center">Sense ressenyes escrites registrades actualment.</p>
                  ) : (
                    selectedWorker.clientReviews.map((rev) => (
                      <div key={rev.id} className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center border-b border-amber-200 pb-2">
                          <div>
                            <span className="font-bold text-neutral-900 text-sm">{rev.clientName}</span>
                            <span className="text-[10px] text-neutral-500 font-mono block">Feina {rev.jobCode} • {rev.date}</span>
                          </div>
                          <span className="font-extrabold text-amber-900 bg-white px-2.5 py-1 rounded-full border border-amber-300 text-xs">
                            {rev.rating} / 5.0 ⭐
                          </span>
                        </div>
                        <p className="text-neutral-800 leading-relaxed italic">"{rev.comment}"</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 6. VEHICLES I QUILOMETRATGE */}
              {profileTab === 'vehicles' && (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                    <div>
                      <span className="text-xs text-blue-900 font-bold block">Vehicle Principal Habitual</span>
                      <span className="text-base font-extrabold text-blue-950">{selectedWorker.assignedVehicle}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-blue-900 font-bold block">Km Aquest Mes</span>
                      <span className="text-xl font-extrabold text-blue-950">{selectedWorker.stats.kmDrivenThisMonth} km</span>
                    </div>
                  </div>

                  <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-2 pt-2">
                    <Camera size={16} className="text-blue-600" /> Registre d'Odo-Comptador per Fotografia (Lectura OCR Mòbil)
                  </h4>

                  {selectedWorker.vehicleKmHistory.map((vk) => (
                    <div key={vk.id} className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl flex justify-between items-center">
                      <div>
                        <span className="font-bold text-neutral-900 text-sm">{vk.vehiclePlate}</span>
                        <span className="text-neutral-500 block">Data registre: {vk.date}</span>
                        <span className="text-blue-800 font-bold block">Inici: {vk.startKm} km ➔ Fi: {vk.endKm} km ({vk.recordedKm} km recorreguts)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src={vk.dashboardPhotoUrl} alt="Foto quadre de comandaments" className="w-16 h-12 rounded-xl object-cover border border-neutral-300 shadow-sm" />
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded">✓ OCR Validat</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 7. EINES ASSIGNADES */}
              {profileTab === 'tools' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <h4 className="font-bold text-neutral-900 text-sm mb-2">Eines i Maquinària Actualment Assignades</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedWorker.assignedTools.map((tool) => (
                        <div key={tool.id} className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex justify-between items-center">
                          <div>
                            <span className="font-mono text-[10px] font-bold text-neutral-500">{tool.code}</span>
                            <h5 className="font-bold text-neutral-900">{tool.name}</h5>
                            <span className="text-[10px] text-neutral-500">Assignada des de: {tool.assignedSince}</span>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            tool.status === 'OPERATIVA' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {tool.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 8. INCIDÈNCIES REPORTADES */}
              {profileTab === 'incidents' && (
                <div className="space-y-3 text-xs">
                  <h4 className="font-bold text-neutral-900 text-sm">Historial d'Incidències Enviades des del Camp (Àudios & Fotos)</h4>
                  {selectedWorker.reportedFieldIncidents.length === 0 ? (
                    <p className="text-neutral-500 italic p-4 bg-neutral-50 rounded-xl text-center">Sense incidències reportades des del camp.</p>
                  ) : (
                    selectedWorker.reportedFieldIncidents.map((inc) => (
                      <div key={inc.id} className="p-4 bg-red-50/50 border border-red-200 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center border-b border-red-200 pb-2">
                          <span className="font-bold text-red-900 text-sm">{inc.code} - {inc.title}</span>
                          <span className="text-[10px] font-mono text-neutral-500">{inc.date}</span>
                        </div>
                        <p className="text-neutral-800 font-medium">{inc.audioNote}</p>
                        <div className="p-2.5 bg-white rounded-xl border border-red-200 text-neutral-900">
                          <span className="font-bold text-xs text-primary block">Decisió IA (El Memòndum):</span>
                          <span>{inc.memorandumDecision}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-neutral-100 flex justify-end shrink-0">
              <button 
                onClick={() => setSelectedWorker(null)}
                className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-xs shadow-md hover:bg-primary/90 transition-colors"
              >
                Tancar Fitxa 360°
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DEDICATED REAL TASK DETAIL MODAL */}
      {selectedJobModal && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            <div className="flex justify-between items-start pb-4 border-b border-neutral-200 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl font-mono font-extrabold text-lg shadow-sm border border-emerald-300">
                  #{selectedJobModal.code}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-neutral-900">{selectedJobModal.title}</h2>
                    <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-bold">
                      🟢 COMPLETADA
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500 block">
                    Data d'execució: <strong>{selectedJobModal.date}</strong> • Factura vinculada: <strong className="font-mono text-primary">{selectedJobModal.invoiceCode}</strong>
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedJobModal(null)}
                className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 my-3 shrink-0">
              <button
                onClick={() => {
                  setSelectedJobModal(null);
                  setSelectedWorker(null);
                  router.push(`/gestio/clients/${selectedJobModal.clientId}`);
                }}
                className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 flex items-center gap-1.5 shadow-sm"
              >
                <Building2 size={14} /> Anar a la Fitxa del Client ({selectedJobModal.clientName})
              </button>

              <button
                onClick={() => alert(`📄 Descarregant factura per a #${selectedJobModal.code}...`)}
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 flex items-center gap-1.5 shadow-sm"
              >
                <Download size={14} /> Descarregar Factura PDF ({selectedJobModal.cost})
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">Client</span>
                  <p className="font-extrabold text-neutral-900 text-sm">{selectedJobModal.clientName}</p>
                  <p className="text-neutral-600 font-medium">{selectedJobModal.clientContact}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">Ubicació</span>
                  <p className="font-bold text-emerald-800 flex items-center gap-1">
                    <MapPin size={14} /> {selectedJobModal.locationName}
                  </p>
                  <p className="font-mono text-neutral-500 text-[11px]">{selectedJobModal.gpsCoords}</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-neutral-200 space-y-1 shadow-sm">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Memòria de Treball</span>
                <p className="text-neutral-800 leading-relaxed font-medium">{selectedJobModal.description}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 flex justify-end shrink-0">
              <button 
                onClick={() => setSelectedJobModal(null)}
                className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl font-bold text-xs shadow hover:bg-neutral-800"
              >
                Tancar Targeta de la Tasca
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
