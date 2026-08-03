'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, UserCheck, User, Star, Clock, Truck, Wrench, AlertTriangle, Search, Phone, Mail, 
  MapPin, ShieldCheck, CheckCircle2, FileText, ChevronRight, X, Calendar, Camera, 
  MessageSquare, ThumbsUp, Activity, PenTool, Award, Fuel, Gauge, ExternalLink, Download, 
  Building2, DollarSign, CheckSquare, Eye, Compass, Package, Receipt, FileCheck
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

interface WorkerProfile {
  id: string;
  name: string;
  nif: string;
  role: string;
  specialty: string;
  phone: string;
  email: string;
  status: 'DISPONIBLE' | 'EN_FEINA' | 'VACANCES';
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

const OPERARIS_DATABASE: WorkerProfile[] = [
  {
    id: 'op1',
    name: 'Jordi Soler',
    nif: '47881122K',
    role: 'Cap d\'Equip de Camp',
    specialty: 'Sistemes de Reg, Canonades i Bombes',
    phone: '600 12 34 56',
    email: 'jordi.soler@campopro.cat',
    status: 'DISPONIBLE',
    avatar: '👨‍🌾',
    joiningDate: '15/03/2023',
    drivingLicense: 'Permís B + C1 (Vehicles Agrícoles)',
    assignedVehicle: 'Furgoneta Ford Transit Custom (1234-BCD)',
    stats: {
      completedJobs: 142,
      hoursLoggedThisMonth: 160,
      kmDrivenThisMonth: 1450,
      clientRatingAverage: 4.9,
      incidentsReported: 8,
      toolIncidentsCount: 2
    },
    ratingBreakdown: {
      professionalism: 5.0,
      punctuality: 4.8,
      customerTreatment: 4.9
    },
    clientReviews: [
      {
        id: 'rev1',
        clientName: 'Agro Riera SL (Miquel Riera)',
        jobCode: '#OT-442',
        date: '28/07/2026',
        rating: 5,
        comment: 'En Jordi va arribar súper puntual a la finca. Va detectar la fuga en menys de 20 minuts, la va reparar amb materials de primera i va deixar tot el camp completament net i ordenat. Un tracte impecable i molt educat!'
      },
      {
        id: 'rev2',
        clientName: 'Finca Valles (Anna Valles)',
        jobCode: '#OT-390',
        date: '15/07/2026',
        rating: 4.8,
        comment: 'Molt bon professional. Va explicar amb claredat el motiu de la fallada de la bomba de reg i va suggerir millores per evitar futures reposicions.'
      }
    ],
    completedJobsHistory: [
      {
        id: 'job1',
        code: 'OT-442',
        title: 'Reparació Fuga d\'Aigua i Escomesa Sector Sud',
        clientName: 'Agro Riera SL',
        clientId: '1',
        clientContact: 'Miquel Riera (600 111 222)',
        date: '28/07/2026',
        hours: '6.5 hores',
        cost: '850,00 €',
        invoiceCode: 'FAC-2026-0442',
        locationName: 'Camp 3 (Sector Nord - Fuga Aigua)',
        gpsCoords: '41.6580° N, 1.8390° E',
        assignedWorkerName: 'Jordi Soler (Cap d\'Equip)',
        vehicleUsed: 'Furgoneta Ford Transit Custom (1234-BCD)',
        description: 'Sanejat i substitució de canonada PE 50mm High-Density esclatada per alta pressió a l\'escomesa principal del Camp 3. Instal·lació de 2 vàlvules de tall Inox de 1 polzada i prova d\'estanquitat satisfactòria a 4.5 bar.',
        materialsUsed: [
          { name: 'Tub PE 50mm High-Density', qty: '15 m', unitPrice: 8.50 },
          { name: 'Vàlvula de Tall 1 polzada Inox', qty: '2 u', unitPrice: 18.20 },
          { name: 'Cinta de Teflon Professional', qty: '2 u', unitPrice: 2.10 }
        ],
        toolsUsed: ['Trepant Bosch GSR-18', 'Radial Makita 125mm', 'Joc de Claus Stillson Heavy-Duty'],
        photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        signatureUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvbJjUps0q9YpuQkGaY5sRz2m_ti7khbFlM6-CHmI8ykOmRLmMra7akOY7vF9x65dHzRdZQqeacIz_LPhVHInJ6E5g_v9awm4ReTUw-3hPNQx830GX3GzrxqwDyK6kSXn8aKLHSmKwRXY8OuBTccG5OdGUf_k9PET1PNq96ySs7M2WQDY9UzJh9kW2ZeGatQwHH-6Msl2sF7P22CxWNJs7BHja5JGG0qkVly74n-qHHixvQx472LXu',
        clientFeedback: {
          rating: 5,
          review: 'En Jordi va arribar súper puntual a la finca. Va detectar la fuga en menys de 20 minuts, la va reparar amb materials de primera i va deixar tot el camp completament net i ordenat. Un tracte impecable i molt educat!'
        }
      },
      {
        id: 'job2',
        code: 'OT-390',
        title: 'Substitució Vàlvula Tall i Canonada PE 50mm',
        clientName: 'Finca Valles',
        clientId: '2',
        clientContact: 'Anna Valles (600 333 444)',
        date: '15/07/2026',
        hours: '5.0 hores',
        cost: '520,00 €',
        invoiceCode: 'FAC-2026-0390',
        locationName: 'Sector Invernacle A',
        gpsCoords: '41.5260° N, 2.1150° E',
        assignedWorkerName: 'Jordi Soler',
        vehicleUsed: 'Furgoneta Ford Transit Custom (1234-BCD)',
        description: 'Reemplaçament de la vàlvula de retenció defectuosa al sector d\'invernacles. Purga de l\'aire del circuit de reg per goteig.',
        materialsUsed: [
          { name: 'Tub PE 25mm High-Density', qty: '10 m', unitPrice: 4.50 },
          { name: 'Valvula de Tall 1 polzada Inox', qty: '1 u', unitPrice: 18.20 }
        ],
        toolsUsed: ['Trepant Bosch GSR-18', 'Joc de Claus Stillson Heavy-Duty'],
        photoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        signatureUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvbJjUps0q9YpuQkGaY5sRz2m_ti7khbFlM6-CHmI8ykOmRLmMra7akOY7vF9x65dHzRdZQqeacIz_LPhVHInJ6E5g_v9awm4ReTUw-3hPNQx830GX3GzrxqwDyK6kSXn8aKLHSmKwRXY8OuBTccG5OdGUf_k9PET1PNq96ySs7M2WQDY9UzJh9kW2ZeGatQwHH-6Msl2sF7P22CxWNJs7BHja5JGG0qkVly74n-qHHixvQx472LXu',
        clientFeedback: {
          rating: 4.8,
          review: 'Molt bon professional. Va explicar amb claredat el motiu de la fallada de la bomba de reg i va suggerir millores per evitar futures reposicions.'
        }
      }
    ],
    assignedTools: [
      { id: 't1', code: 'EIN-101', name: 'Trepant Bosch GSR-18', status: 'OPERATIVA', assignedSince: '10/01/2026' },
      { id: 't2', code: 'EIN-104', name: 'Joc de Claus Stillson Heavy-Duty', status: 'OPERATIVA', assignedSince: '05/02/2026' },
      { id: 't3', code: 'EIN-102', name: 'Radial Makita 125mm', status: 'REPARACIO', assignedSince: '20/04/2026' }
    ],
    toolIncidentsHistory: [
      {
        id: 'ti1',
        date: '28/04/2026',
        toolName: 'Radial Makita 125mm (EIN-102)',
        issueDescription: 'Cable tallat accidentalment durant el tall d\'una arqueta de formigó. Enviat al taller oficial.',
        status: 'EN_REPARACIO'
      }
    ],
    vehicleKmHistory: [
      {
        id: 'vk1',
        date: '02/08/2026',
        vehiclePlate: '1234-BCD (Ford Transit)',
        startKm: 124350,
        endKm: 124500,
        recordedKm: 150,
        dashboardPhotoUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'vk2',
        date: '01/08/2026',
        vehiclePlate: '1234-BCD (Ford Transit)',
        startKm: 124200,
        endKm: 124350,
        recordedKm: 150,
        dashboardPhotoUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
      }
    ],
    reportedFieldIncidents: [
      {
        id: 'inc1',
        code: 'INC-8812',
        date: '02/08/2026 18:30',
        title: 'Fuga d\'aigua detectada al Camp 3',
        audioNote: 'Nota de veu de 22 segons: La canonada de PE de 50mm ha cedit per pressió de xarxa.',
        memorandumDecision: 'Aprovat el sanejament d\'emergència. No requereix pressupost addicional extra.',
        budgetExtra: '0,00 €'
      }
    ]
  },
  {
    id: 'op2',
    name: 'Pau Ribas',
    nif: '38992211L',
    role: 'Operari Agrícola & Maquinista',
    specialty: 'Tractors, Llaurada i Aplicació de Tractaments',
    phone: '600 98 76 54',
    email: 'pau.ribas@campopro.cat',
    status: 'DISPONIBLE',
    avatar: '🚜',
    joiningDate: '01/06/2023',
    drivingLicense: 'Permís B + C + Llicència Tractor Agrícola (LVA)',
    assignedVehicle: 'Tractor John Deere 6120M (TRACTOR-01)',
    stats: {
      completedJobs: 98,
      hoursLoggedThisMonth: 140,
      kmDrivenThisMonth: 890,
      clientRatingAverage: 4.8,
      incidentsReported: 4,
      toolIncidentsCount: 1
    },
    ratingBreakdown: {
      professionalism: 4.9,
      punctuality: 4.7,
      customerTreatment: 4.8
    },
    clientReviews: [
      {
        id: 'rev3',
        clientName: 'Horta del Llobregat (Joan Llobregat)',
        jobCode: '#OT-210',
        date: '20/07/2026',
        rating: 5,
        comment: 'En Pau domina el tractor com ningú. Va adobar les 15 hectàrees sense fer cap dany als cultius col·laterals.'
      }
    ],
    completedJobsHistory: [
      {
        id: 'job3',
        code: 'OT-210',
        title: 'Adobat Foliar Nitrogenat Finca Nord',
        clientName: 'Horta del Llobregat',
        clientId: '3',
        clientContact: 'Joan Llobregat (600 555 666)',
        date: '20/07/2026',
        hours: '8.0 hores',
        cost: '680,00 €',
        invoiceCode: 'FAC-2026-0210',
        locationName: 'Horta Central (Sector Nord)',
        gpsCoords: '41.3411° N, 2.0511° E',
        assignedWorkerName: 'Pau Ribas (Maquinista)',
        vehicleUsed: 'Tractor John Deere 6120M (TRACTOR-01)',
        description: 'Aplicació foliar d\'adob nitrogenat de 25kg en 15 hectàrees de conreu. Control d\'adhesió i uniformitat.',
        materialsUsed: [
          { name: 'Adobat Foliar Nitrogenat 25kg', qty: '12 sacs', unitPrice: 32.50 }
        ],
        toolsUsed: ['Nivell Laser Topcon RL-H5A'],
        photoUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80',
        signatureUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvbJjUps0q9YpuQkGaY5sRz2m_ti7khbFlM6-CHmI8ykOmRLmMra7akOY7vF9x65dHzRdZQqeacIz_LPhVHInJ6E5g_v9awm4ReTUw-3hPNQx830GX3GzrxqwDyK6kSXn8aKLHSmKwRXY8OuBTccG5OdGUf_k9PET1PNq96ySs7M2WQDY9UzJh9kW2ZeGatQwHH-6Msl2sF7P22CxWNJs7BHja5JGG0qkVly74n-qHHixvQx472LXu',
        clientFeedback: {
          rating: 5,
          review: 'En Pau domina el tractor com ningú. Va adobar les 15 hectàrees sense fer cap dany als cultius col·laterals.'
        }
      }
    ],
    assignedTools: [
      { id: 't4', code: 'EIN-103', name: 'Nivell Làser Topcon RL-H5A', status: 'OPERATIVA', assignedSince: '01/03/2026' }
    ],
    toolIncidentsHistory: [
      {
        id: 'ti2',
        date: '10/05/2026',
        toolName: 'Nivell Làser Topcon (EIN-103)',
        issueDescription: 'Re-calibració periòdica requerida després d\'un treball extens a la rasa.',
        status: 'RESOLTA'
      }
    ],
    vehicleKmHistory: [
      {
        id: 'vk3',
        date: '30/07/2026',
        vehiclePlate: 'TRACTOR-01 (John Deere)',
        startKm: 4200,
        endKm: 4280,
        recordedKm: 80,
        dashboardPhotoUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
      }
    ],
    reportedFieldIncidents: []
  },
  {
    id: 'op3',
    name: 'Marc Andreu',
    nif: '45112233M',
    role: 'Tècnic Electricista & Telemetria IOT',
    specialty: 'Sensors de Humitat, PLCs i Automatismes de Reg',
    phone: '600 55 44 33',
    email: 'marc.andreu@campopro.cat',
    status: 'DISPONIBLE',
    avatar: '⚡',
    joiningDate: '10/01/2024',
    drivingLicense: 'Permís B',
    assignedVehicle: 'Furgoneta Ford Transit Custom (1234-BCD)',
    stats: {
      completedJobs: 76,
      hoursLoggedThisMonth: 155,
      kmDrivenThisMonth: 1200,
      clientRatingAverage: 5.0,
      incidentsReported: 3,
      toolIncidentsCount: 0
    },
    ratingBreakdown: {
      professionalism: 5.0,
      punctuality: 5.0,
      customerTreatment: 5.0
    },
    clientReviews: [
      {
        id: 'rev4',
        clientName: 'Agro Riera SL',
        jobCode: '#OT-501',
        date: '02/08/2026',
        rating: 5,
        comment: 'Excepcional. En Marc va configurar l\'App de telemetria al telèfon del meu encarregat i ens va explicar fil per randa com interpretar la humitat del sòl.'
      }
    ],
    completedJobsHistory: [
      {
        id: 'job4',
        code: 'OT-501',
        title: 'Instal·lació de Sensor d\'Humitat IOT',
        clientName: 'Agro Riera SL',
        clientId: '1',
        clientContact: 'Miquel Riera (600 111 222)',
        date: '02/08/2026',
        hours: '4.0 hores',
        cost: '450,00 €',
        invoiceCode: 'FAC-2026-0501',
        locationName: 'Sector Sud (Estació de Reg)',
        gpsCoords: '41.6510° N, 1.8310° E',
        assignedWorkerName: 'Marc Andreu (Electricista IOT)',
        vehicleUsed: 'Furgoneta Ford Transit Custom (1234-BCD)',
        description: 'Muntatge d\'estació de telemetria amb sensor de humitat a 40cm de profunditat i plafó solar. Enllaçat amb l\'aplicació de control remota.',
        materialsUsed: [
          { name: 'Sensor de Humitat IOT 40cm', qty: '1 u', unitPrice: 180.00 },
          { name: 'Plafo Solar i Bateria Liti', qty: '1 u', unitPrice: 95.00 }
        ],
        toolsUsed: ['Detector de Metalls i Cables Subterrani', 'Trepant Bosch GSR-18'],
        photoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
        signatureUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvbJjUps0q9YpuQkGaY5sRz2m_ti7khbFlM6-CHmI8ykOmRLmMra7akOY7vF9x65dHzRdZQqeacIz_LPhVHInJ6E5g_v9awm4ReTUw-3hPNQx830GX3GzrxqwDyK6kSXn8aKLHSmKwRXY8OuBTccG5OdGUf_k9PET1PNq96ySs7M2WQDY9UzJh9kW2ZeGatQwHH-6Msl2sF7P22CxWNJs7BHja5JGG0qkVly74n-qHHixvQx472LXu',
        clientFeedback: {
          rating: 5,
          review: 'Excepcional. En Marc va configurar l\'App de telemetria al telèfon del meu encarregat i ens va explicar fil per randa com interpretar la humitat del sòl.'
        }
      }
    ],
    assignedTools: [
      { id: 't5', code: 'EIN-105', name: 'Detector de Metalls i Cables Subterrani', status: 'OPERATIVA', assignedSince: '15/01/2024' }
    ],
    toolIncidentsHistory: [],
    vehicleKmHistory: [],
    reportedFieldIncidents: []
  },
  {
    id: 'op4',
    name: 'Joan Martí',
    nif: '52441199P',
    role: 'Operari de Manteniment General',
    specialty: 'Sanejament, Rases i Manteniment Tècnic',
    phone: '600 11 22 33',
    email: 'joan.marti@campopro.cat',
    status: 'DISPONIBLE',
    avatar: '🛠️',
    joiningDate: '01/09/2023',
    drivingLicense: 'Permís B',
    assignedVehicle: 'Furgoneta Ford Transit Custom (1234-BCD)',
    stats: {
      completedJobs: 64,
      hoursLoggedThisMonth: 130,
      kmDrivenThisMonth: 920,
      clientRatingAverage: 4.7,
      incidentsReported: 2,
      toolIncidentsCount: 0
    },
    ratingBreakdown: {
      professionalism: 4.8,
      punctuality: 4.6,
      customerTreatment: 4.7
    },
    clientReviews: [],
    completedJobsHistory: [],
    assignedTools: [
      { id: 't6', code: 'EIN-106', name: 'Bomba de Comprovacio de Pressio Manual', status: 'OPERATIVA', assignedSince: '10/10/2024' }
    ],
    toolIncidentsHistory: [],
    vehicleKmHistory: [],
    reportedFieldIncidents: []
  }
];

export default function OperarisDashboardPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [selectedJobModal, setSelectedJobModal] = useState<CompletedJobDetail | null>(null);
  const [profileTab, setProfileTab] = useState<'info' | 'jobs' | 'reviews' | 'vehicles' | 'tools' | 'incidents'>('info');

  const filteredWorkers = OPERARIS_DATABASE.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.specialty.toLowerCase().includes(searchTerm.toLowerCase())
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
            Fitxa 360°: Accés a la fitxa real de tasques realitzades, valoracions i tracte dels clients (⭐), km en vehicles i eines.
          </p>
        </div>

        {/* Global Search Bar */}
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
      </div>

      {/* Global Performance Key Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Users size={22} />
          </div>
          <div>
            <span className="text-xs text-neutral-500 font-semibold block uppercase">Total Operaris</span>
            <span className="text-xl font-extrabold text-neutral-900">{OPERARIS_DATABASE.length} En Plantilla</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Star size={22} className="fill-amber-400 text-amber-500" />
          </div>
          <div>
            <span className="text-xs text-neutral-500 font-semibold block uppercase">Valoració Mitjana</span>
            <span className="text-xl font-extrabold text-neutral-900">4.9 / 5.0 ⭐</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <Clock size={22} />
          </div>
          <div>
            <span className="text-xs text-neutral-500 font-semibold block uppercase">Hores Registrades</span>
            <span className="text-xl font-extrabold text-neutral-900">585h Aquest Mes</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <Truck size={22} />
          </div>
          <div>
            <span className="text-xs text-neutral-500 font-semibold block uppercase">Km Conduïts Flota</span>
            <span className="text-xl font-extrabold text-neutral-900">4.460 km</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-3 col-span-2 md:col-span-1">
          <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
            <Wrench size={22} />
          </div>
          <div>
            <span className="text-xs text-neutral-500 font-semibold block uppercase">Eines Assignades</span>
            <span className="text-xl font-extrabold text-neutral-900">6 En Ús</span>
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
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-3xl flex items-center justify-center border border-neutral-200 shadow-inner group-hover:scale-105 transition-transform">
                  {worker.avatar}
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  {worker.status}
                </span>
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

                <div className="flex justify-between items-center bg-neutral-50 p-2 rounded-xl text-neutral-700">
                  <span className="flex items-center gap-1"><Clock size={14} className="text-neutral-400" /> Hores Aquest Mes:</span>
                  <span className="font-bold text-neutral-900">{worker.stats.hoursLoggedThisMonth}h</span>
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
                <div className="w-16 h-16 rounded-2xl bg-primary text-white text-3xl flex items-center justify-center shadow-lg">
                  {selectedWorker.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-neutral-900">{selectedWorker.name}</h2>
                    <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                      NIF: {selectedWorker.nif}
                    </span>
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

              {/* 2. TASQUES I FEINES REALITZADES (INTERACTIVES I AMB TARGETA DEDICADA) */}
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

              {/* 3. VALORACIONS I RESSENYES DELS CLIENTS (⭐ FEEDBACK & TRACTE) */}
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

              {/* 4. VEHICLES I QUILOMETRATGE (KM / HORES) */}
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

              {/* 5. EINES ASSIGNADES & INCIDÈNCIES AMB EINES */}
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

                  <div>
                    <h4 className="font-bold text-neutral-900 text-sm mb-2 flex items-center gap-2 text-amber-800">
                      <AlertTriangle size={16} /> Historial d'Incidències o Avaries amb Eines
                    </h4>
                    {selectedWorker.toolIncidentsHistory.length === 0 ? (
                      <p className="text-neutral-500 italic p-3 bg-neutral-50 rounded-xl">Sense incidències amb eines registrades.</p>
                    ) : (
                      selectedWorker.toolIncidentsHistory.map((ti) => (
                        <div key={ti.id} className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-amber-900">{ti.toolName}</span>
                            <span className="text-[10px] font-mono text-neutral-500">{ti.date}</span>
                          </div>
                          <p className="text-neutral-700 text-xs">{ti.issueDescription}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 6. INCIDÈNCIES REPORTADES PER L'OPERARI */}
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

      {/* DEDICATED REAL TASK DETAIL MODAL (TARGETA DE LA TASCA REALITZADA #OT-XXX) */}
      {selectedJobModal && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
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

            {/* Quick Actions Bar */}
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
                onClick={() => alert(`📄 Descarregant el full de treball oficial i la prefactura per a la feina #${selectedJobModal.code}...`)}
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 flex items-center gap-1.5 shadow-sm"
              >
                <Download size={14} /> Descarregar Factura PDF ({selectedJobModal.cost})
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs">
              
              {/* Client & GPS Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">Client i Persona de Contacte</span>
                  <p className="font-extrabold text-neutral-900 text-sm">{selectedJobModal.clientName}</p>
                  <p className="text-neutral-600 font-medium">{selectedJobModal.clientContact}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">Ubicació de la Finca & Coordenades</span>
                  <p className="font-bold text-emerald-800 flex items-center gap-1">
                    <MapPin size={14} /> {selectedJobModal.locationName}
                  </p>
                  <p className="font-mono text-neutral-500 text-[11px]">{selectedJobModal.gpsCoords}</p>
                </div>
              </div>

              {/* Worker & Vehicle Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-blue-50/60 p-4 rounded-2xl border border-blue-200">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-blue-800 uppercase">Operari / Cap d'Equip Executant</span>
                  <p className="font-extrabold text-blue-950 text-sm flex items-center gap-1">
                    <User size={14} className="text-blue-700" /> {selectedJobModal.assignedWorkerName}
                  </p>
                  <p className="text-blue-900 font-bold">Hores totals registrades: {selectedJobModal.hours}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-blue-800 uppercase">Vehicle de Flota Utilitzat</span>
                  <p className="font-bold text-blue-950 flex items-center gap-1">
                    <Truck size={14} className="text-blue-700" /> {selectedJobModal.vehicleUsed}
                  </p>
                </div>
              </div>

              {/* Description of Execution */}
              <div className="p-4 bg-white rounded-2xl border border-neutral-200 space-y-1 shadow-sm">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Memòria de Treball i Informe Tècnic</span>
                <p className="text-neutral-800 leading-relaxed font-medium">{selectedJobModal.description}</p>
              </div>

              {/* Materials & Tools Used */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                  <span className="font-bold text-neutral-900 text-xs flex items-center gap-1.5">
                    <Package size={16} className="text-emerald-600" /> Materials de Magatzem Utilitzats
                  </span>
                  <ul className="space-y-1">
                    {selectedJobModal.materialsUsed.map((m, idx) => (
                      <li key={idx} className="flex justify-between items-center p-2 bg-white rounded-xl border border-neutral-200 text-neutral-800 font-medium">
                        <span>{m.name} ({m.qty})</span>
                        <span className="font-bold text-emerald-800">{(m.unitPrice * (parseFloat(m.qty) || 1)).toFixed(2)} €</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                  <span className="font-bold text-neutral-900 text-xs flex items-center gap-1.5">
                    <PenTool size={16} className="text-blue-600" /> Eines i Maquinària Utilitzades
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJobModal.toolsUsed.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-white border border-neutral-300 rounded-lg font-bold text-neutral-800 text-[11px]">
                        🛠️ {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Photographic Evidence & Client Signature */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1 text-center">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase">Fotografia d'Execució a Camp</span>
                  <img src={selectedJobModal.photoUrl} alt="Foto feina" className="w-full h-32 object-cover rounded-xl border border-neutral-300 shadow-sm" />
                </div>

                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1 text-center flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase">Signatura de Conformitat del Client</span>
                  <div className="bg-white p-4 rounded-xl border border-neutral-300 flex-1 flex flex-col justify-center items-center shadow-inner">
                    <span className="font-serif italic text-lg font-bold text-neutral-900">Miquel Riera</span>
                    <span className="text-[9px] text-emerald-700 font-bold mt-1">✓ Validat a la PWA</span>
                  </div>
                </div>
              </div>

              {/* Client Review if present */}
              {selectedJobModal.clientFeedback && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-900 flex items-center gap-1">
                      <Star size={14} className="fill-amber-400 text-amber-500" /> Valoració i Tracte Rebut del Client:
                    </span>
                    <span className="font-extrabold text-amber-900">{selectedJobModal.clientFeedback.rating} / 5.0 ⭐</span>
                  </div>
                  <p className="text-neutral-800 italic font-medium">"{selectedJobModal.clientFeedback.review}"</p>
                </div>
              )}

              {/* Cost & Invoice Bar */}
              <div className="p-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl flex justify-between items-center shadow-lg">
                <div>
                  <span className="text-[10px] text-emerald-200 font-bold block uppercase">Cost Total Executat i Facturat</span>
                  <span className="text-2xl font-extrabold text-white">{selectedJobModal.cost}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-emerald-300 font-mono font-bold block">Factura #{selectedJobModal.invoiceCode}</span>
                  <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-bold">Cobrada</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
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
