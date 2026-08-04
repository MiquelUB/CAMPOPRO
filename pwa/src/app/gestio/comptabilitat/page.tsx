'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  // Navigation Tabs: Clients, Proveïdors, Operaris (Targetes), Balanç
  const [activeTab, setActiveTab] = useState<'clients' | 'proveidors' | 'operaris' | 'balanc'>('clients');
  
  // Active Modal Chart State (for KPI Cards 1, 2, 3, 4)
  const [activeChartModal, setActiveChartModal] = useState<'clients' | 'proveidors' | 'operaris' | 'benefici' | null>(null);

  // Time Range Filter for All Charts: 'setmanal' | 'mensual' | 'anual'
  const [timeFilter, setTimeFilter] = useState<'setmanal' | 'mensual' | 'anual'>('mensual');

  // Selected Category in Operator Expenses Chart to view specific tickets
  const [selectedTicketCategory, setSelectedTicketCategory] = useState<string | null>(null);

  // Active Invoice & Budget Inspection Modal
  const [selectedInvoiceModal, setSelectedInvoiceModal] = useState<any | null>(null);

  // Active Task Detail Modal (Fixa de la tasca feta per l'operari)
  const [selectedTaskDetailModal, setSelectedTaskDetailModal] = useState<any | null>(null);

  // Client Invoices Data
  const [clientInvoices] = useState([
    {
      id: 'cli-1',
      invoiceNo: '#FACT-2026-0842',
      jobCode: '#OT-439',
      client: 'AgroServei Ponent SL',
      nif: 'B12345678',
      contact: 'Miquel Riera (600111222)',
      address: 'Camí Ral s/n, Manresa',
      date: '04/08/2026',
      dueDate: '03/09/2026',
      hours: '18.5h',
      subtotal: '2.024,79 €',
      iva: '425,21 € (21%)',
      total: '2.450,00 €',
      rawAmount: 2450,
      status: 'EMESA',
      operator: 'Jordi Soler',
      taskTitle: 'Instal·lació i anivellat de canonada PE-90',
      budgetInfo: {
        budgetNo: '#PRES-2026-0412',
        estimatedHours: '18.0h',
        budgetSubtotal: '1.980,00 €',
        budgetTotal: '2.395,80 €',
        deviation: '+2.2% (18.5h reals vs 18.0h est.)',
        signedBy: 'Miquel Riera',
        signatureDate: '28/07/2026'
      },
      workEvidence: {
        photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDveK6D5zSYaS6w84E8FKBzPqWfWi6ig_7O0OisKvLCxFUZEQSEMY2Q287y5gtDwEURl_0VNgQ3KdsD8PF5jutaTe5wAcCe9nEnIsCrTnMLaDixIlkBHW3pXaixoit-9sIcPZUaDIDJcZiM98vj12GrFpPzORVVsuPPktOg2uuMZ2uPh7XhTVOkNCYJ-uvy6Zuj0sXUYMEFSZ96zeB0bQ3DD0-tKisvHiisof2tnz6O6FUYqRvlMDI6',
        photoDesc: 'Vàlvula principal PE-90 i connexió verificada',
        materialsUsed: [
          { name: 'Tub PE 50mm High-Density', qty: '12m', cost: '102,00 €' },
          { name: 'Valvula de Tall 1 polzada Inox', qty: '2u', cost: '36,40 €' },
          { name: 'Cinta Tefló Pro', qty: '2u', cost: '4,20 €' }
        ],
        toolsUsed: ['Trepant Bosch GSR-18', 'Radial Makita 125mm', 'Claus Stillson'],
        vehicleUsed: 'Tractor John Deere 6120M'
      }
    },
    {
      id: 'cli-2',
      invoiceNo: '#FACT-2026-0839',
      jobCode: '#OT-435',
      client: 'Cooperativa d\'Ivars',
      nif: 'F25098765',
      contact: 'Joan Vilalta (600222333)',
      address: 'Av. Cooperativa 12, Ivars d\'Urgell',
      date: '02/08/2026',
      dueDate: '01/09/2026',
      hours: '4.0h',
      subtotal: '264,46 €',
      iva: '55,54 € (21%)',
      total: '320,00 €',
      rawAmount: 320,
      status: 'COBRADA',
      operator: 'Carles Torras',
      taskTitle: 'Reparació de filtre d\'alta pressió a caseta de reg',
      budgetInfo: {
        budgetNo: '#PRES-2026-0408',
        estimatedHours: '4.0h',
        budgetSubtotal: '264,46 €',
        budgetTotal: '320,00 €',
        deviation: '0.0% (Exacte)',
        signedBy: 'Joan Vilalta',
        signatureDate: '30/07/2026'
      },
      workEvidence: {
        photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvbJjUps0q9YpuQkGaY5sRz2m_ti7khbFlM6-CHmI8ykOmRLmMra7akOY7vF9x65dHzRdZQqeacIz_LPhVHInJ6E5g_v9awm4ReTUw-3hPNQx830GX3GzrxqwDyK6kSXn8aKLHSmKwRXY8OuBTccG5OdGUf_k9PET1PNq96ySs7M2WQDY9UzJh9kW2ZeGatQwHH-6Msl2sF7P22CxWNJs7BHja5JGG0qkVly74n-qHHixvQx472LXu',
        photoDesc: 'Filtre netejat i junta tòrica reemplaçada',
        materialsUsed: [
          { name: 'Filtre Malla 2 polzades', qty: '1u', cost: '82,50 €' },
          { name: 'Junta Tòrica Alta Pressió', qty: '1u', cost: '12,00 €' }
        ],
        toolsUsed: ['Joc de Claus Palmera', 'Nivell Làser Topcon'],
        vehicleUsed: 'Furgoneta Ford Transit 1234-BCD'
      }
    },
    {
      id: 'cli-3',
      invoiceNo: '#FACT-2026-0835',
      jobCode: '#OT-431',
      client: 'Finca Santa Anna',
      nif: 'A08123456',
      contact: 'Anna Masia (600444555)',
      address: 'Ctra. C-16 km 45, Berga',
      date: '01/08/2026',
      dueDate: '15/08/2026',
      hours: '12.0h',
      subtotal: '809,92 €',
      iva: '170,08 € (21%)',
      total: '980,00 €',
      rawAmount: 980,
      status: 'PENDENT_COBRAMENT',
      operator: 'Pau Ribas',
      taskTitle: 'Manteniment preventiu i revisió dectors reg',
      budgetInfo: {
        budgetNo: '#PRES-2026-0399',
        estimatedHours: '12.0h',
        budgetSubtotal: '809,92 €',
        budgetTotal: '980,00 €',
        deviation: '0.0%',
        signedBy: 'Anna Masia',
        signatureDate: '25/07/2026'
      },
      workEvidence: {
        photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKWndsRtzpf1OCPI-wCnYbSWbN0MUPFGXnHLQzjg8Rj5XCkpNTdHjWU2VvgxoGjiia3Ir8solkDwPni9mtQXpZu0ZQuGv1jEslYc4OtvZQ0NtlII-Tn5aSvkB_RLtCjQ-TCE4xGZ6zd5xTP3uDzAax5e4bhKD18mSfBF0TjpPxiof0ZjCeqDrqRo97_sRZ1MAzPcbrxMXKxR51ik8-KVb0mI3A5DrFGM-BnNZsP_673c62scm83lFL',
        photoDesc: 'Sense incidències en reg per goteig',
        materialsUsed: [
          { name: 'Connectors Ràpids Inox', qty: '4u', cost: '168,00 €' }
        ],
        toolsUsed: ['Detector de Cables Subterrani'],
        vehicleUsed: 'Furgoneta Ford Transit Custom'
      }
    },
    {
      id: 'cli-4',
      invoiceNo: '#FACT-2026-0844',
      jobCode: '#OT-442',
      client: 'Finca Masia Vella',
      nif: 'B66554433',
      contact: 'Pere Vella (600888999)',
      address: 'Partida Vella 8, Artesa',
      date: '03/08/2026',
      dueDate: '02/09/2026',
      hours: '6.5h',
      subtotal: '561,98 €',
      iva: '118,02 € (21%)',
      total: '680,00 €',
      rawAmount: 680,
      status: 'PENDENT_FACTURAR',
      operator: 'Maria Pujol',
      taskTitle: 'Tractament fitosanitari en vinyes i arboledes',
      budgetInfo: {
        budgetNo: '#PRES-2026-0418',
        estimatedHours: '6.0h',
        budgetSubtotal: '520,00 €',
        budgetTotal: '629,20 €',
        deviation: '+8.0% (6.5h vs 6.0h)',
        signedBy: 'Pere Vella',
        signatureDate: '01/08/2026'
      },
      workEvidence: {
        photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDveK6D5zSYaS6w84E8FKBzPqWfWi6ig_7O0OisKvLCxFUZEQSEMY2Q287y5gtDwEURl_0VNgQ3KdsD8PF5jutaTe5wAcCe9nEnIsCrTnMLaDixIlkBHW3pXaixoit-9sIcPZUaDIDJcZiM98vj12GrFpPzORVVsuPPktOg2uuMZ2uPh7XhTVOkNCYJ-uvy6Zuj0sXUYMEFSZ96zeB0bQ3DD0-tKisvHiisof2tnz6O6FUYqRvlMDI6',
        photoDesc: 'Tractament fitosanitari completat amb èxit',
        materialsUsed: [
          { name: 'Adobat Foliar Nitrogenat', qty: '4 sacs', cost: '130,00 €' }
        ],
        toolsUsed: ['Equip de Polverització Pro'],
        vehicleUsed: 'Tractor John Deere 6120M'
      }
    }
  ]);

  // Supplier Invoices Data (Facturació de Proveïdors)
  const [supplierInvoices] = useState([
    {
      id: 'sup-1',
      invoiceNo: '#PROV-2026-991',
      supplier: 'Suministros Agrícolas del Segre SA',
      concept: 'Comprat Fertilitzant N-12 i Fitonutrients (10 Sacs)',
      date: '01/08/2026',
      total: '544,50 €',
      rawAmount: 544.50,
      status: 'PENDENT_PAGAMENT'
    },
    {
      id: 'sup-2',
      invoiceNo: '#PROV-2026-988',
      supplier: 'Tractores i Recanvis Ponent',
      concept: 'Oli Sintètic Heavy Duty 20L + Filtre Oli John Deere',
      date: '28/07/2026',
      total: '254,10 €',
      rawAmount: 254.10,
      status: 'PAGAT'
    },
    {
      id: 'sup-3',
      invoiceNo: '#PROV-2026-975',
      supplier: 'Tuberies i Regs de Ponent SL',
      concept: 'Canonada PE-90 100m + Vàlvules Inox 2 polzades',
      date: '25/07/2026',
      total: '1.076,90 €',
      rawAmount: 1076.90,
      status: 'PAGAT'
    }
  ]);

  // Operator Expenses & Cards Data categorized for full ticket inspection
  const [allOperatorTickets] = useState([
    // Combustible Gasoil B Tickets
    {
      id: 'tiq-1',
      category: 'COMBUSTIBLE',
      categoryLabel: 'Combustible Gasoil B',
      operator: 'Jordi Soler',
      role: 'Cap d\'Equip (Tractor 04)',
      cardNumber: '💳 **** **** 4821',
      ticketRef: 'TIQ-8812',
      date: '03/08/2026',
      amount: '98,50 €',
      concept: 'Repostatge Gasoil B (Estació Repsol Segre)',
      receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'tiq-2',
      category: 'COMBUSTIBLE',
      categoryLabel: 'Combustible Gasoil B',
      operator: 'Carles Torras',
      role: 'Operari Agrícola',
      cardNumber: '💳 **** **** 1092',
      ticketRef: 'TIQ-8815',
      date: '02/08/2026',
      amount: '44,00 €',
      concept: 'Repostatge Dièsel Furgoneta Ford',
      receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80'
    },
    // Material Urgència Camp Tickets
    {
      id: 'tiq-3',
      category: 'MATERIAL_CAMP',
      categoryLabel: 'Material Urgència Camp',
      operator: 'Pau Ribas',
      role: 'Maquinista Agrícola',
      cardNumber: '💳 **** **** 1092',
      ticketRef: 'TIQ-8809',
      date: '02/08/2026',
      amount: '45,80 €',
      concept: 'Cinta Tefló + Brides Inox (Ferreteria Local)',
      receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80'
    },
    // Manteniment Maquinària Tickets
    {
      id: 'tiq-4',
      category: 'MANTENIMENT',
      categoryLabel: 'Manteniment Maquinària',
      operator: 'Joan Martí',
      role: 'Manteniment General',
      cardNumber: '💳 **** **** 3310',
      ticketRef: 'TIQ-8780',
      date: '31/07/2026',
      amount: '32,00 €',
      concept: 'Rentat i desinfecció a alta pressió de tractor',
      receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80'
    },
    // Dietes i Manutenció Tickets
    {
      id: 'tiq-5',
      category: 'DIETES',
      categoryLabel: 'Dietes i Manutenció',
      operator: 'Marc Andreu',
      role: 'Tècnic IOT',
      cardNumber: '💳 **** **** 7731',
      ticketRef: 'TIQ-8798',
      date: '01/08/2026',
      amount: '18,50 €',
      concept: 'Menú de migdia durant jornada Finca Masia Vella',
      receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80'
    }
  ]);

  // Client Bar Data depending on Time Filter
  const getClientChartData = () => {
    if (timeFilter === 'setmanal') {
      return [
        { name: 'AgroServei Ponent', amount: '1.200 €', height: '100%', val: 1200 },
        { name: 'Finca Santa Anna', amount: '450 €', height: '37%', val: 450 },
        { name: 'Finca Masia Vella', amount: '380 €', height: '31%', val: 380 },
        { name: 'Cooperativa d\'Ivars', amount: '160 €', height: '13%', val: 160 },
      ];
    }
    if (timeFilter === 'anual') {
      return [
        { name: 'AgroServei Ponent', amount: '28.500 €', height: '100%', val: 28500 },
        { name: 'Finca Santa Anna', amount: '14.200 €', height: '50%', val: 14200 },
        { name: 'Finca Masia Vella', amount: '9.800 €', height: '34%', val: 9800 },
        { name: 'Cooperativa d\'Ivars', amount: '6.400 €', height: '22%', val: 6400 },
      ];
    }
    // Mensual (default)
    return [
      { name: 'AgroServei Ponent', amount: '2.450 €', height: '100%', val: 2450 },
      { name: 'Finca Santa Anna', amount: '980 €', height: '40%', val: 980 },
      { name: 'Finca Masia Vella', amount: '680 €', height: '28%', val: 680 },
      { name: 'Cooperativa d\'Ivars', amount: '320 €', height: '13%', val: 320 },
    ];
  };

  // Supplier Bar Data depending on Time Filter
  const getSupplierChartData = () => {
    if (timeFilter === 'setmanal') {
      return [
        { name: 'Tuberies i Regs de Ponent', amount: '520,00 €', height: '100%' },
        { name: 'Suministros del Segre SA', amount: '270,00 €', height: '52%' },
        { name: 'Tractores i Recanvis Ponent', amount: '120,00 €', height: '23%' },
      ];
    }
    if (timeFilter === 'anual') {
      return [
        { name: 'Tuberies i Regs de Ponent', amount: '14.800 €', height: '100%' },
        { name: 'Suministros del Segre SA', amount: '8.400 €', height: '56%' },
        { name: 'Tractores i Recanvis Ponent', amount: '4.200 €', height: '28%' },
      ];
    }
    // Mensual (default)
    return [
      { name: 'Tuberies i Regs de Ponent', amount: '1.076,90 €', height: '100%' },
      { name: 'Suministros del Segre SA', amount: '544,50 €', height: '51%' },
      { name: 'Tractores i Recanvis Ponent', amount: '254,10 €', height: '24%' },
    ];
  };

  return (
    <main className="relative pt-6 px-4 md:px-xl pb-xl bg-surface min-h-screen">
      <div className="flex flex-col w-full gap-lg">
        
        {/* Header Title Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest">
                CENTRE DE CONTROL COMPTABLE & FINANCER
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg text-primary">
              Comptabilitat de l'Empresa
            </h1>
            <p className="font-body-base text-on-surface-variant">
              Quadre de comandament unificat. Clica qualsevol targeta KPI per obrir les gràfiques interactives.
            </p>
          </div>

          <div className="flex items-center gap-sm">
            <button 
              onClick={() => alert("Generant resum del tancament comptable mensual...")}
              className="px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-body-strong flex items-center gap-2 shadow-sm hover:bg-primary-container transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">summarize</span>
              Tancament Mensual PDF
            </button>
            <button 
              onClick={() => alert("S'ha exportat el llibre diari en format Excel / CSV per a gestoria.")}
              className="px-4 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-primary rounded-xl text-xs font-body-strong flex items-center gap-2 border border-outline-variant/30 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Exportar a Gestoria
            </button>
          </div>
        </section>

        {/* Global Financial Control Overview KPIs */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-md">
          
          {/* KPI 1: Ingressos Clients -> Opens BAR CHART Modal */}
          <div 
            onClick={() => setActiveChartModal('clients')}
            className="group bg-surface-container-lowest p-lg rounded-xl shadow-sm border-l-4 border-emerald-500 flex flex-col justify-between cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
            title="Haz clic per veure la gràfica d'ingressos per client"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-label-caps text-on-surface-variant">INGRESSOS CLIENTS (MES)</span>
                <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[20px]">bar_chart</span>
                </span>
              </div>
              <p className="text-2xl font-display-lg text-emerald-700 mt-2">12.450,00 €</p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-outline-variant/10 text-xs">
              <span className="text-emerald-600 font-bold">4 factures • 92% cobrat</span>
              <span className="text-primary font-bold flex items-center gap-0.5 group-hover:underline">
                Gràfica Barres <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>
          </div>

          {/* KPI 2: Despeses Proveïdors -> Opens SUPPLIERS BAR CHART Modal */}
          <div 
            onClick={() => setActiveChartModal('proveidors')}
            className="group bg-surface-container-lowest p-lg rounded-xl shadow-sm border-l-4 border-orange-500 flex flex-col justify-between cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
            title="Haz clic per veure la gràfica de compres per proveïdor"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-label-caps text-on-surface-variant">COMPRES PROVEÏDORS</span>
                <span className="p-1.5 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[20px]">equalizer</span>
                </span>
              </div>
              <p className="text-2xl font-display-lg text-orange-700 mt-2">1.875,50 €</p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-outline-variant/10 text-xs">
              <span className="text-orange-600 font-bold">3 factures rebudes</span>
              <span className="text-primary font-bold flex items-center gap-0.5 group-hover:underline">
                Gràfica Proveïdors <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>
          </div>

          {/* KPI 3: Targetes Operaris -> Opens PIE / DONUT CHART Modal ("quesitos") */}
          <div 
            onClick={() => setActiveChartModal('operaris')}
            className="group bg-surface-container-lowest p-lg rounded-xl shadow-sm border-l-4 border-blue-500 flex flex-col justify-between cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
            title="Haz clic per veure la gràfica de despeses d'operaris"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-label-caps text-on-surface-variant">TARGETES OPERARIS</span>
                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[20px]">pie_chart</span>
                </span>
              </div>
              <p className="text-2xl font-display-lg text-blue-700 mt-2">238,80 €</p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-outline-variant/10 text-xs">
              <span className="text-blue-600 font-bold">4 tiquets d'equip</span>
              <span className="text-primary font-bold flex items-center gap-0.5 group-hover:underline">
                Gràfica Despeses <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>
          </div>

          {/* KPI 4: Benefici Net Operatiu -> Opens MULTI-LINE TREND CHART Modal */}
          <div 
            onClick={() => setActiveChartModal('benefici')}
            className="group bg-surface-container-lowest p-lg rounded-xl shadow-sm border-l-4 border-purple-500 flex flex-col justify-between cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
            title="Haz clic per veure la gràfica de benefici, costos i IVA"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-label-caps text-on-surface-variant">BENEFICI NET OPERATIU</span>
                <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[20px]">show_chart</span>
                </span>
              </div>
              <p className="text-2xl font-display-lg text-purple-700 mt-2">10.335,70 €</p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-outline-variant/10 text-xs">
              <span className="text-purple-600 font-bold">Marge net: 82,9%</span>
              <span className="text-primary font-bold flex items-center gap-0.5 group-hover:underline">
                Gràfica Línies <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>
          </div>

        </section>

        {/* Central Control Navigation Tabs */}
        <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="flex items-center justify-between border-b border-outline-variant/20 px-lg pt-md bg-surface-container-low/40 overflow-x-auto">
            <div className="flex items-center gap-md">
              <button 
                onClick={() => setActiveTab('clients')}
                className={`pb-md px-xs font-body-strong text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'clients' 
                    ? 'border-primary text-primary font-bold' 
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">person_pin</span>
                Facturació Clients ({clientInvoices.length})
              </button>

              <button 
                onClick={() => setActiveTab('proveidors')}
                className={`pb-md px-xs font-body-strong text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'proveidors' 
                    ? 'border-primary text-primary font-bold' 
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">store</span>
                Factures Proveïdors ({supplierInvoices.length})
              </button>

              <button 
                onClick={() => setActiveTab('operaris')}
                className={`pb-md px-xs font-body-strong text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'operaris' 
                    ? 'border-primary text-primary font-bold' 
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">badge</span>
                Targetes i Liquidacions Operaris ({allOperatorTickets.length})
              </button>

              <button 
                onClick={() => setActiveTab('balanc')}
                className={`pb-md px-xs font-body-strong text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'balanc' 
                    ? 'border-primary text-primary font-bold' 
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">finance</span>
                Resum de Balanç i Impostos
              </button>
            </div>

            <div className="pb-md">
              <span className="text-xs font-label-caps px-3 py-1 bg-primary/10 text-primary font-bold rounded-full">
                Exercici Fiscal 2026
              </span>
            </div>
          </div>

          {/* TAB 1: CLIENT INVOICES */}
          {activeTab === 'clients' && (
            <div className="p-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-high/40 border-b border-outline-variant/20 text-xs font-label-caps text-on-surface-variant">
                      <th className="px-md py-sm">FACTURA (CLICK VER FACTURA + PRESSUPOST)</th>
                      <th className="px-md py-sm">ORDRE (CLICK VER FITXA OPERARI)</th>
                      <th className="px-md py-sm">CLIENT</th>
                      <th className="px-md py-sm">DATA / VENCIMENT</th>
                      <th className="px-md py-sm text-right">SUBTOTAL</th>
                      <th className="px-md py-sm text-right">IVA</th>
                      <th className="px-md py-sm text-right">TOTAL</th>
                      <th className="px-md py-sm">ESTAT</th>
                      <th className="px-md py-sm text-right">ACCIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-sm">
                    {clientInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-md py-md font-bold text-primary">
                          <button 
                            onClick={() => setSelectedInvoiceModal(inv)}
                            className="hover:underline flex items-center gap-1 text-primary cursor-pointer"
                            title="Haz clic per veure la Factura Oficial i el Pressupost Associat"
                          >
                            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                            {inv.invoiceNo}
                          </button>
                        </td>

                        <td className="px-md py-md font-body-strong">
                          <button 
                            onClick={() => setSelectedTaskDetailModal(inv)}
                            className="hover:underline text-secondary-container bg-secondary-container/10 px-2 py-0.5 rounded font-mono text-xs cursor-pointer flex items-center gap-1"
                            title="Haz clic per anar a la fitxa de la tasca realitzada per l'operari"
                          >
                            <span className="material-symbols-outlined text-[14px]">engineering</span>
                            {inv.jobCode}
                          </button>
                        </td>

                        <td className="px-md py-md">
                          <p className="font-body-strong text-on-surface">{inv.client}</p>
                          <p className="text-xs text-on-surface-variant font-mono">NIF: {inv.nif}</p>
                        </td>
                        <td className="px-md py-md text-xs">
                          <p className="font-bold text-on-surface">{inv.date}</p>
                          <p className="text-on-surface-variant">Venc: {inv.dueDate}</p>
                        </td>
                        <td className="px-md py-md text-right font-mono">{inv.subtotal}</td>
                        <td className="px-md py-md text-right text-xs text-on-surface-variant font-mono">{inv.iva}</td>
                        <td className="px-md py-md text-right font-bold text-emerald-700 font-mono">{inv.total}</td>
                        <td className="px-md py-md">
                          {inv.status === 'COBRADA' && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span> Cobrada
                            </span>
                          )}
                          {inv.status === 'EMESA' && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center gap-1 w-fit">
                              <span className="material-symbols-outlined text-[14px]">send</span> Emesa
                            </span>
                          )}
                          {inv.status === 'PENDENT_FACTURAR' && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 flex items-center gap-1 w-fit">
                              <span className="material-symbols-outlined text-[14px]">receipt_long</span> Pendent Facturar
                            </span>
                          )}
                          {inv.status === 'PENDENT_COBRAMENT' && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 flex items-center gap-1 w-fit">
                              <span className="material-symbols-outlined text-[14px]">hourglass_empty</span> Pendent Cobrament
                            </span>
                          )}
                        </td>
                        <td className="px-md py-md text-right">
                          <div className="flex items-center justify-end gap-xs">
                            <button 
                              onClick={() => setSelectedInvoiceModal(inv)}
                              className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-container-highest rounded text-primary text-xs font-body-strong flex items-center gap-1 cursor-pointer"
                              title="Veure Factura i Pressupost"
                            >
                              <span className="material-symbols-outlined text-[14px]">visibility</span> Veure
                            </button>
                            <button 
                              onClick={() => setSelectedTaskDetailModal(inv)}
                              className="px-2.5 py-1 bg-secondary-container/10 hover:bg-secondary-container/20 rounded text-secondary font-body-strong text-xs flex items-center gap-1 cursor-pointer"
                              title="Fitxa de l'operari"
                            >
                              <span className="material-symbols-outlined text-[14px]">assignment</span> Fitxa Tasca
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: SUPPLIER INVOICES */}
          {activeTab === 'proveidors' && (
            <div className="p-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-high/40 border-b border-outline-variant/20 text-xs font-label-caps text-on-surface-variant">
                      <th className="px-md py-sm">Nº FACTURA PROVEÏDOR</th>
                      <th className="px-md py-sm">PROVEÏDOR</th>
                      <th className="px-md py-sm">CONCEPTE / COMPRA</th>
                      <th className="px-md py-sm">DATA</th>
                      <th className="px-md py-sm text-right">TOTAL</th>
                      <th className="px-md py-sm">ESTAT PAGAMENT</th>
                      <th className="px-md py-sm text-right">ACCIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-sm">
                    {supplierInvoices.map((sup) => (
                      <tr key={sup.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-md py-md font-bold text-orange-800">{sup.invoiceNo}</td>
                        <td className="px-md py-md font-body-strong text-on-surface">{sup.supplier}</td>
                        <td className="px-md py-md text-xs text-on-surface-variant">{sup.concept}</td>
                        <td className="px-md py-md text-xs font-bold">{sup.date}</td>
                        <td className="px-md py-md text-right font-bold text-orange-700 font-mono">{sup.total}</td>
                        <td className="px-md py-md">
                          {sup.status === 'PAGAT' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span> Pagat
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 flex items-center gap-1 w-fit">
                              <span className="material-symbols-outlined text-[14px]">schedule</span> Pendent Pagament
                            </span>
                          )}
                        </td>
                        <td className="px-md py-md text-right">
                          <button 
                            onClick={() => alert(`Adjunt de proveïdor ${sup.invoiceNo} descarregat.`)}
                            className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-container-highest rounded text-primary text-xs font-body-strong flex items-center gap-1 ml-auto"
                          >
                            <span className="material-symbols-outlined text-[14px]">attach_file</span> Comprovant
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: OPERATOR CARDS & TICKETS */}
          {activeTab === 'operaris' && (
            <div className="p-md flex flex-col gap-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-high/40 border-b border-outline-variant/20 text-xs font-label-caps text-on-surface-variant">
                      <th className="px-md py-sm">OPERARI</th>
                      <th className="px-md py-sm">TARGETA / TIQUET</th>
                      <th className="px-md py-sm">CONCEPTE I DETALL</th>
                      <th className="px-md py-sm">CATEGORIA</th>
                      <th className="px-md py-sm">DATA</th>
                      <th className="px-md py-sm text-right">IMPORT</th>
                      <th className="px-md py-sm text-right">ACCIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-sm">
                    {allOperatorTickets.map((t) => (
                      <tr key={t.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-md py-md">
                          <p className="font-body-strong text-primary">{t.operator}</p>
                          <p className="text-xs text-on-surface-variant">{t.role}</p>
                        </td>
                        <td className="px-md py-md font-mono font-bold text-xs">{t.cardNumber}</td>
                        <td className="px-md py-md text-xs text-on-surface-variant">{t.concept}</td>
                        <td className="px-md py-md text-xs">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-bold">
                            {t.categoryLabel}
                          </span>
                        </td>
                        <td className="px-md py-md text-xs font-bold">{t.date}</td>
                        <td className="px-md py-md text-right font-bold text-blue-700 font-mono">{t.amount}</td>
                        <td className="px-md py-md text-right">
                          <button 
                            onClick={() => alert(`S'ha descarregat el rebut del tiquet ref ${t.ticketRef}`)}
                            className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-container-highest rounded text-primary text-xs font-body-strong flex items-center gap-1 ml-auto"
                          >
                            <span className="material-symbols-outlined text-[14px]">receipt</span> Veure Rebut
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: BALANÇ & RESUM FINANCER */}
          {activeTab === 'balanc' && (
            <div className="p-lg flex flex-col gap-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
                <div className="p-md bg-surface-container-low/50 rounded-xl border border-outline-variant/20 flex flex-col gap-md">
                  <h3 className="font-section-title text-primary text-base flex items-center gap-2">
                    <span className="material-symbols-outlined">analytics</span>
                    Balanç de Comptes (Mes en Curs)
                  </h3>

                  <div className="space-y-sm text-sm">
                    <div className="flex justify-between items-center p-sm bg-surface rounded-lg">
                      <span className="text-on-surface-variant font-body-strong">Ingressos Brut (Facturació Clients)</span>
                      <span className="font-bold text-emerald-700 font-mono">+12.450,00 €</span>
                    </div>
                    <div className="flex justify-between items-center p-sm bg-surface rounded-lg">
                      <span className="text-on-surface-variant font-body-strong">Despeses Proveïdors & Materials</span>
                      <span className="font-bold text-orange-700 font-mono">-1.875,50 €</span>
                    </div>
                    <div className="flex justify-between items-center p-sm bg-surface rounded-lg">
                      <span className="text-on-surface-variant font-body-strong">Despeses Operaris & Targetes</span>
                      <span className="font-bold text-blue-700 font-mono">-238,80 €</span>
                    </div>
                    <div className="flex justify-between items-center p-md bg-emerald-50 rounded-lg border border-emerald-200">
                      <span className="font-bold text-emerald-900">RESULTAT NET ABANS D'IMPOSTOS</span>
                      <span className="font-bold text-emerald-800 text-lg font-mono">+10.335,70 €</span>
                    </div>
                  </div>
                </div>

                <div className="p-md bg-surface-container-low/50 rounded-xl border border-outline-variant/20 flex flex-col gap-md">
                  <h3 className="font-section-title text-primary text-base flex items-center gap-2">
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                    Estimació IVA & Liquidació Fiscal
                  </h3>

                  <div className="space-y-sm text-sm">
                    <div className="flex justify-between items-center p-sm bg-surface rounded-lg">
                      <span className="text-on-surface-variant">IVA Repercutit (Clients - 21%)</span>
                      <span className="font-bold font-mono text-emerald-700">+2.160,74 €</span>
                    </div>
                    <div className="flex justify-between items-center p-sm bg-surface rounded-lg">
                      <span className="text-on-surface-variant">IVA Suportat Deduïble (Proveïdors/Despeses)</span>
                      <span className="font-bold font-mono text-orange-700">-325,50 €</span>
                    </div>
                    <div className="flex justify-between items-center p-md bg-blue-50 rounded-lg border border-blue-200">
                      <span className="font-bold text-blue-900">ESTIMACIÓ MODEL 303 (A PAGAR HACIENDA)</span>
                      <span className="font-bold text-blue-800 text-lg font-mono">1.835,24 €</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </section>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: BAR CHART FOR CLIENT INCOMES (Click on KPI 1) */}
      {/* ========================================================================= */}
      {activeChartModal === 'clients' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface rounded-2xl p-6 max-w-3xl w-full shadow-2xl border border-outline-variant flex flex-col gap-md">
            
            {/* Header + Time Filter Selector */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-sm border-b border-outline-variant/20 gap-md">
              <div className="flex items-center gap-2 text-emerald-700">
                <span className="material-symbols-outlined text-2xl">bar_chart</span>
                <h3 className="font-headline-md text-lg">Gràfica Ingressos per Client</h3>
              </div>

              {/* Time Range Filter Selector: Setmanal, Mensual, Anual */}
              <div className="flex items-center gap-xs bg-surface-container-high p-1 rounded-xl">
                <button 
                  onClick={() => setTimeFilter('setmanal')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${timeFilter === 'setmanal' ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  Setmanal
                </button>
                <button 
                  onClick={() => setTimeFilter('mensual')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${timeFilter === 'mensual' ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  Mensual
                </button>
                <button 
                  onClick={() => setTimeFilter('anual')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${timeFilter === 'anual' ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  Anual
                </button>
              </div>

              <button onClick={() => setActiveChartModal(null)} className="text-on-surface-variant hover:text-primary p-1 ml-auto sm:ml-0">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Solid Rendered Bar Chart (100% visible and responsive) */}
            <div className="bg-surface-container-low p-lg rounded-xl border border-outline-variant/20 flex flex-col gap-lg min-h-[290px] justify-end">
              <div className="grid grid-cols-4 gap-md items-end h-52 border-b-2 border-outline-variant/40 pb-2 px-2">
                {getClientChartData().map((bar, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 group h-full justify-end">
                    <span className="text-xs font-bold text-emerald-800 font-mono bg-emerald-100 px-2 py-0.5 rounded shadow-xs">
                      {bar.amount}
                    </span>
                    <div 
                      className="w-full max-w-[64px] bg-emerald-500 rounded-t-xl transition-all duration-300 group-hover:bg-emerald-600 shadow-md border-t border-emerald-300"
                      style={{ height: bar.height, minHeight: '24px' }}
                    ></div>
                  </div>
                ))}
              </div>

              {/* Bottom Client Names */}
              <div className="grid grid-cols-4 gap-md text-center text-xs font-body-strong text-primary">
                {getClientChartData().map((bar, idx) => (
                  <div key={idx} className="truncate" title={bar.name}>{bar.name}</div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-xs">
              <button onClick={() => setActiveChartModal(null)} className="px-md py-2 bg-primary text-white rounded-lg text-xs font-body-strong">
                Tancar Gràfica
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BAR CHART FOR SUPPLIERS (Click on KPI 2) */}
      {/* ========================================================================= */}
      {activeChartModal === 'proveidors' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface rounded-2xl p-6 max-w-3xl w-full shadow-2xl border border-outline-variant flex flex-col gap-md">
            
            {/* Header + Time Filter Selector */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-sm border-b border-outline-variant/20 gap-md">
              <div className="flex items-center gap-2 text-orange-700">
                <span className="material-symbols-outlined text-2xl">equalizer</span>
                <h3 className="font-headline-md text-lg">Gràfica Compres per Proveïdor</h3>
              </div>

              {/* Time Range Filter Selector */}
              <div className="flex items-center gap-xs bg-surface-container-high p-1 rounded-xl">
                <button 
                  onClick={() => setTimeFilter('setmanal')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${timeFilter === 'setmanal' ? 'bg-orange-600 text-white shadow-xs' : 'text-on-surface-variant hover:text-orange-700'}`}
                >
                  Setmanal
                </button>
                <button 
                  onClick={() => setTimeFilter('mensual')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${timeFilter === 'mensual' ? 'bg-orange-600 text-white shadow-xs' : 'text-on-surface-variant hover:text-orange-700'}`}
                >
                  Mensual
                </button>
                <button 
                  onClick={() => setTimeFilter('anual')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${timeFilter === 'anual' ? 'bg-orange-600 text-white shadow-xs' : 'text-on-surface-variant hover:text-orange-700'}`}
                >
                  Anual
                </button>
              </div>

              <button onClick={() => setActiveChartModal(null)} className="text-on-surface-variant hover:text-primary p-1 ml-auto sm:ml-0">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Solid Rendered Supplier Bar Chart */}
            <div className="bg-surface-container-low p-lg rounded-xl border border-outline-variant/20 flex flex-col gap-lg min-h-[290px] justify-end">
              <div className="grid grid-cols-3 gap-lg items-end h-52 border-b-2 border-outline-variant/40 pb-2 px-4">
                {getSupplierChartData().map((bar, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 group h-full justify-end">
                    <span className="text-xs font-bold text-orange-800 font-mono bg-orange-100 px-2 py-0.5 rounded shadow-xs">
                      {bar.amount}
                    </span>
                    <div 
                      className="w-full max-w-[80px] bg-orange-500 rounded-t-xl transition-all duration-300 group-hover:bg-orange-600 shadow-md border-t border-orange-300"
                      style={{ height: bar.height, minHeight: '24px' }}
                    ></div>
                  </div>
                ))}
              </div>

              {/* Bottom Supplier Names */}
              <div className="grid grid-cols-3 gap-lg text-center text-xs font-body-strong text-orange-950">
                {getSupplierChartData().map((bar, idx) => (
                  <div key={idx} className="truncate" title={bar.name}>{bar.name}</div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-xs">
              <button onClick={() => setActiveChartModal(null)} className="px-md py-2 bg-primary text-white rounded-lg text-xs font-body-strong">
                Tancar Gràfica
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: OPERATOR EXPENSES CHART & INTERACTIVE TICKETS INSPECTION (KPI 3) */}
      {/* ========================================================================= */}
      {activeChartModal === 'operaris' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface rounded-2xl p-6 max-w-3xl w-full shadow-2xl border border-outline-variant flex flex-col gap-md">
            
            {/* Header + Time Filter Selector */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-sm border-b border-outline-variant/20 gap-md">
              <div className="flex items-center gap-2 text-blue-700">
                <span className="material-symbols-outlined text-2xl">pie_chart</span>
                <h3 className="font-headline-md text-lg">Gràfica Despeses d'Operaris</h3>
              </div>

              {/* Time Range Filter Selector */}
              <div className="flex items-center gap-xs bg-surface-container-high p-1 rounded-xl">
                <button 
                  onClick={() => setTimeFilter('setmanal')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${timeFilter === 'setmanal' ? 'bg-blue-600 text-white shadow-xs' : 'text-on-surface-variant hover:text-blue-700'}`}
                >
                  Setmanal
                </button>
                <button 
                  onClick={() => setTimeFilter('mensual')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${timeFilter === 'mensual' ? 'bg-blue-600 text-white shadow-xs' : 'text-on-surface-variant hover:text-blue-700'}`}
                >
                  Mensual
                </button>
                <button 
                  onClick={() => setTimeFilter('anual')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${timeFilter === 'anual' ? 'bg-blue-600 text-white shadow-xs' : 'text-on-surface-variant hover:text-blue-700'}`}
                >
                  Anual
                </button>
              </div>

              <button onClick={() => {
                setActiveChartModal(null);
                setSelectedTicketCategory(null);
              }} className="text-on-surface-variant hover:text-primary p-1 ml-auto sm:ml-0">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Pie Chart + Clickable Legend to access specific section tickets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg items-center bg-surface-container-low p-lg rounded-xl border border-outline-variant/20">
              
              {/* Visual Pie/Donut Chart */}
              <div className="flex justify-center items-center relative py-2">
                <svg className="w-48 h-48 -rotate-90" viewBox="0 0 36 36">
                  {/* Combustible: 59.7% */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.2" strokeDasharray="59.7 40.3" strokeDashoffset="0" />
                  {/* Material Camp: 19.2% */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.2" strokeDasharray="19.2 80.8" strokeDashoffset="-59.7" />
                  {/* Manteniment: 13.4% */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#a855f7" strokeWidth="4.2" strokeDasharray="13.4 86.6" strokeDashoffset="-78.9" />
                  {/* Dietes: 7.7% */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#06b6d4" strokeWidth="4.2" strokeDasharray="7.7 92.3" strokeDashoffset="-92.3" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-bold font-mono text-primary block">
                    {timeFilter === 'setmanal' ? '142,50 €' : timeFilter === 'anual' ? '2.860,00 €' : '238,80 €'}
                  </span>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold">Total Despeses</span>
                </div>
              </div>

              {/* Clickable Legend List (Click any category to inspect specific tickets) */}
              <div className="space-y-sm">
                <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Clica qualsevol opció per obrir els tiquets de la secció:
                </p>

                {/* Option 1: Combustible Gasoil B */}
                <div 
                  onClick={() => setSelectedTicketCategory(selectedTicketCategory === 'COMBUSTIBLE' ? null : 'COMBUSTIBLE')}
                  className={`flex items-center justify-between p-sm rounded-lg border transition-all cursor-pointer ${selectedTicketCategory === 'COMBUSTIBLE' ? 'bg-emerald-100 border-emerald-500 shadow-sm font-bold' : 'bg-surface border-outline-variant/20 hover:bg-emerald-50/50'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-body-strong">Combustible Gasoil B</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-800">142,50 € (59,7%)</span>
                </div>

                {/* Option 2: Material Urgència Camp */}
                <div 
                  onClick={() => setSelectedTicketCategory(selectedTicketCategory === 'MATERIAL_CAMP' ? null : 'MATERIAL_CAMP')}
                  className={`flex items-center justify-between p-sm rounded-lg border transition-all cursor-pointer ${selectedTicketCategory === 'MATERIAL_CAMP' ? 'bg-orange-100 border-orange-500 shadow-sm font-bold' : 'bg-surface border-outline-variant/20 hover:bg-orange-50/50'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                    <span className="text-xs font-body-strong font-bold">Material Urgència Camp</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-orange-800">45,80 € (19,2%)</span>
                </div>

                {/* Option 3: Manteniment Maquinària */}
                <div 
                  onClick={() => setSelectedTicketCategory(selectedTicketCategory === 'MANTENIMENT' ? null : 'MANTENIMENT')}
                  className={`flex items-center justify-between p-sm rounded-lg border transition-all cursor-pointer ${selectedTicketCategory === 'MANTENIMENT' ? 'bg-purple-100 border-purple-500 shadow-sm font-bold' : 'bg-surface border-outline-variant/20 hover:bg-purple-50/50'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                    <span className="text-xs font-body-strong">Manteniment Maquinària</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-800">32,00 € (13,4%)</span>
                </div>

                {/* Option 4: Dietes i Manutenció */}
                <div 
                  onClick={() => setSelectedTicketCategory(selectedTicketCategory === 'DIETES' ? null : 'DIETES')}
                  className={`flex items-center justify-between p-sm rounded-lg border transition-all cursor-pointer ${selectedTicketCategory === 'DIETES' ? 'bg-cyan-100 border-cyan-500 shadow-sm font-bold' : 'bg-surface border-outline-variant/20 hover:bg-cyan-50/50'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                    <span className="text-xs font-body-strong">Dietes i Manutenció</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-800">18,50 € (7,7%)</span>
                </div>
              </div>

            </div>

            {/* Specific Tickets Section for Selected Category */}
            {selectedTicketCategory && (
              <div className="p-md bg-surface-container-lowest rounded-xl border border-primary/30 flex flex-col gap-sm animate-in fade-in duration-200">
                <div className="flex justify-between items-center pb-xs border-b border-outline-variant/20">
                  <span className="font-body-strong text-xs text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">receipt</span>
                    Tiquets de la secció: <strong>{selectedTicketCategory}</strong>
                  </span>
                  <button onClick={() => setSelectedTicketCategory(null)} className="text-xs text-on-surface-variant hover:text-primary">
                    Amagar Tiquets
                  </button>
                </div>

                <div className="space-y-xs">
                  {allOperatorTickets.filter(t => t.category === selectedTicketCategory).map((t) => (
                    <div key={t.id} className="p-sm bg-surface rounded-lg border border-outline-variant/20 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-primary">{t.operator} ({t.ticketRef})</p>
                        <p className="text-on-surface-variant text-[11px]">{t.concept} • {t.date}</p>
                      </div>
                      <div className="flex items-center gap-md">
                        <span className="font-bold font-mono text-blue-800">{t.amount}</span>
                        <button 
                          onClick={() => alert(`Visualitzant la imatge escanejada del tiquet ${t.ticketRef}`)}
                          className="px-2 py-1 bg-primary text-white rounded text-[11px] font-body-strong flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[12px]">visibility</span> Rebut
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-xs">
              <button onClick={() => {
                setActiveChartModal(null);
                setSelectedTicketCategory(null);
              }} className="px-md py-2 bg-primary text-white rounded-lg text-xs font-body-strong">
                Tancar Gràfica
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: MULTI-LINE TREND CHART (Benefici, Costos, IVA) (Click on KPI 4) */}
      {/* ========================================================================= */}
      {activeChartModal === 'benefici' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface rounded-2xl p-6 max-w-3xl w-full shadow-2xl border border-outline-variant flex flex-col gap-md">
            
            {/* Header + Time Filter Selector */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-sm border-b border-outline-variant/20 gap-md">
              <div className="flex items-center gap-2 text-purple-700">
                <span className="material-symbols-outlined text-2xl">show_chart</span>
                <h3 className="font-headline-md text-lg">Gràfica Benefici, Costos i IVA</h3>
              </div>

              {/* Time Range Filter Selector */}
              <div className="flex items-center gap-xs bg-surface-container-high p-1 rounded-xl">
                <button 
                  onClick={() => setTimeFilter('setmanal')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${timeFilter === 'setmanal' ? 'bg-purple-700 text-white shadow-xs' : 'text-on-surface-variant hover:text-purple-700'}`}
                >
                  Setmanal
                </button>
                <button 
                  onClick={() => setTimeFilter('mensual')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${timeFilter === 'mensual' ? 'bg-purple-700 text-white shadow-xs' : 'text-on-surface-variant hover:text-purple-700'}`}
                >
                  Mensual
                </button>
                <button 
                  onClick={() => setTimeFilter('anual')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${timeFilter === 'anual' ? 'bg-purple-700 text-white shadow-xs' : 'text-on-surface-variant hover:text-purple-700'}`}
                >
                  Anual
                </button>
              </div>

              <button onClick={() => setActiveChartModal(null)} className="text-on-surface-variant hover:text-primary p-1 ml-auto sm:ml-0">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Multi-Line Trend Chart Component */}
            <div className="bg-surface-container-low p-lg rounded-xl border border-outline-variant/20 flex flex-col gap-md">
              <div className="h-56 relative w-full border-b border-l border-outline-variant/40 pt-4 pr-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160">
                  {/* Grid Lines */}
                  <line x1="0" y1="40" x2="400" y2="40" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="400" y2="80" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="0" y1="120" x2="400" y2="120" stroke="#e2e8f0" strokeDasharray="3 3" />

                  {/* Line 1: Benefici Net (Emerald Green) */}
                  <path d="M 20 130 Q 120 90 220 50 T 380 30" fill="none" stroke="#10b981" strokeWidth="3.5" />
                  <circle cx="20" cy="130" r="4" fill="#10b981" />
                  <circle cx="140" cy="85" r="4" fill="#10b981" />
                  <circle cx="260" cy="45" r="4" fill="#10b981" />
                  <circle cx="380" cy="30" r="5" fill="#10b981" />

                  {/* Line 2: Costos i Despeses (Orange) */}
                  <path d="M 20 140 Q 120 135 220 125 T 380 115" fill="none" stroke="#f97316" strokeWidth="3" />
                  <circle cx="20" cy="140" r="4" fill="#f97316" />
                  <circle cx="140" cy="135" r="4" fill="#f97316" />
                  <circle cx="260" cy="125" r="4" fill="#f97316" />
                  <circle cx="380" cy="115" r="5" fill="#f97316" />

                  {/* Line 3: IVA Liquidació (Blue) */}
                  <path d="M 20 150 Q 120 145 220 140 T 380 130" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="4 2" />
                  <circle cx="20" cy="150" r="4" fill="#3b82f6" />
                  <circle cx="140" cy="145" r="4" fill="#3b82f6" />
                  <circle cx="260" cy="140" r="4" fill="#3b82f6" />
                  <circle cx="380" cy="130" r="5" fill="#3b82f6" />
                </svg>

                {/* X Axis Time Labels depending on Time Filter */}
                <div className="flex justify-between text-xs font-bold text-on-surface-variant pt-2">
                  {timeFilter === 'setmanal' ? (
                    <>
                      <span>Dilluns</span>
                      <span>Dimecres</span>
                      <span>Divendres</span>
                      <span>Avui (Diumenge)</span>
                    </>
                  ) : timeFilter === 'anual' ? (
                    <>
                      <span>Q1 2026</span>
                      <span>Q2 2026</span>
                      <span>Q3 2026</span>
                      <span>Q4 2026 (Est.)</span>
                    </>
                  ) : (
                    <>
                      <span>Setmana 1</span>
                      <span>Setmana 2</span>
                      <span>Setmana 3</span>
                      <span>Setmana 4 (Actual)</span>
                    </>
                  )}
                </div>
              </div>

              {/* Chart Legend Bar */}
              <div className="grid grid-cols-3 gap-md pt-md border-t border-outline-variant/20 text-xs text-center font-body-strong">
                <div className="flex items-center justify-center gap-2 p-2 bg-emerald-50 text-emerald-800 rounded-lg">
                  <span className="w-3.5 h-1 bg-emerald-500 rounded-full"></span>
                  <span>Benefici Net ({timeFilter === 'setmanal' ? '2.140 €' : timeFilter === 'anual' ? '124.500 €' : '10.335 €'})</span>
                </div>
                <div className="flex items-center justify-center gap-2 p-2 bg-orange-50 text-orange-800 rounded-lg">
                  <span className="w-3.5 h-1 bg-orange-500 rounded-full"></span>
                  <span>Costos & Despeses ({timeFilter === 'setmanal' ? '410 €' : timeFilter === 'anual' ? '24.800 €' : '2.114 €'})</span>
                </div>
                <div className="flex items-center justify-center gap-2 p-2 bg-blue-50 text-blue-800 rounded-lg">
                  <span className="w-3.5 h-1 bg-blue-500 rounded-full"></span>
                  <span>IVA Liquidació ({timeFilter === 'setmanal' ? '320 €' : timeFilter === 'anual' ? '18.400 €' : '1.835 €'})</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-xs">
              <button onClick={() => setActiveChartModal(null)} className="px-md py-2 bg-primary text-white rounded-lg text-xs font-body-strong">
                Tancar Gràfica
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: FACTURA + PRESSUPOST ASSOCIAT (Clicking Invoice No) */}
      {/* ========================================================================= */}
      {selectedInvoiceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface rounded-2xl p-6 max-w-4xl w-full shadow-2xl border border-outline-variant flex flex-col gap-md max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-sm border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-3xl">receipt_long</span>
                <div>
                  <h3 className="font-headline-md text-lg text-primary">
                    Factura Oficial {selectedInvoiceModal.invoiceNo} & Pressupost Associat
                  </h3>
                  <p className="text-xs text-on-surface-variant">Client: <strong>{selectedInvoiceModal.client}</strong> (NIF: {selectedInvoiceModal.nif})</p>
                </div>
              </div>
              <button onClick={() => setSelectedInvoiceModal(null)} className="text-on-surface-variant hover:text-primary p-1">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* 2-Column Side-by-Side: Factura vs Pressupost */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              
              {/* Column A: Factura Oficial */}
              <div className="p-md bg-surface-container-lowest rounded-xl border border-outline-variant/30 flex flex-col gap-sm shadow-sm">
                <div className="flex justify-between items-center pb-xs border-b border-outline-variant/20">
                  <span className="font-body-strong text-sm text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">description</span>
                    FACTURA OFICIAL
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-800 rounded">
                    {selectedInvoiceModal.status}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-on-surface-variant">
                  <p><strong>Nº Factura:</strong> {selectedInvoiceModal.invoiceNo}</p>
                  <p><strong>Data Emissió:</strong> {selectedInvoiceModal.date}</p>
                  <p><strong>Data Venciment:</strong> {selectedInvoiceModal.dueDate}</p>
                  <p><strong>Adreça Finca:</strong> {selectedInvoiceModal.address}</p>
                </div>

                <div className="p-sm bg-surface-container-low rounded-lg space-y-1 text-xs font-mono my-2">
                  <div className="flex justify-between">
                    <span>Base Imposable:</span>
                    <span>{selectedInvoiceModal.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA (21%):</span>
                    <span>{selectedInvoiceModal.iva}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-emerald-700 pt-1 border-t border-outline-variant/20">
                    <span>TOTAL FACTURA:</span>
                    <span>{selectedInvoiceModal.total}</span>
                  </div>
                </div>

                <button 
                  onClick={() => alert(`Descarregant document en PDF: ${selectedInvoiceModal.invoiceNo}`)}
                  className="w-full py-2 bg-primary text-white text-xs font-body-strong rounded-lg flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span> Descarregar PDF Factura
                </button>
              </div>

              {/* Column B: Pressupost Inicial Associat */}
              <div className="p-md bg-surface-container-low/60 rounded-xl border border-outline-variant/30 flex flex-col gap-sm">
                <div className="flex justify-between items-center pb-xs border-b border-outline-variant/20">
                  <span className="font-body-strong text-sm text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                    PRESSUPOST INICIAL
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded">
                    {selectedInvoiceModal.budgetInfo.budgetNo}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-on-surface-variant">
                  <p><strong>Nº Pressupost:</strong> {selectedInvoiceModal.budgetInfo.budgetNo}</p>
                  <p><strong>Hores Estimades:</strong> {selectedInvoiceModal.budgetInfo.estimatedHours}</p>
                  <p><strong>Desviació Realitzada:</strong> <span className="font-bold text-primary">{selectedInvoiceModal.budgetInfo.deviation}</span></p>
                  <p><strong>Conformitat Signada per:</strong> {selectedInvoiceModal.budgetInfo.signedBy} ({selectedInvoiceModal.budgetInfo.signatureDate})</p>
                </div>

                <div className="p-sm bg-white rounded-lg space-y-1 text-xs font-mono my-2 border border-outline-variant/20">
                  <div className="flex justify-between">
                    <span>Pressupostat Subtotal:</span>
                    <span>{selectedInvoiceModal.budgetInfo.budgetSubtotal}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-primary pt-1 border-t border-outline-variant/20">
                    <span>TOTAL PRESSUPOSTAT:</span>
                    <span>{selectedInvoiceModal.budgetInfo.budgetTotal}</span>
                  </div>
                </div>

                <button 
                  onClick={() => alert(`Visualitzant la fitxa de conformitat signada del pressupost ${selectedInvoiceModal.budgetInfo.budgetNo}`)}
                  className="w-full py-2 bg-surface-container-high hover:bg-surface-container-highest text-primary text-xs font-body-strong rounded-lg flex items-center justify-center gap-1 border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[16px]">draw</span> Veure Signatura Pressupost
                </button>
              </div>

            </div>

            <div className="flex justify-end pt-sm border-t border-outline-variant/20">
              <button onClick={() => setSelectedInvoiceModal(null)} className="px-md py-2 bg-primary text-white rounded-lg text-xs font-body-strong">
                Tancar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: FIXA DE LA TASCA FETA PER L'OPERARI (Clicking Job Code) */}
      {/* ========================================================================= */}
      {selectedTaskDetailModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface rounded-2xl p-6 max-w-4xl w-full shadow-2xl border border-outline-variant flex flex-col gap-md max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-sm border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary-container text-3xl">engineering</span>
                <div>
                  <h3 className="font-headline-md text-lg text-primary">
                    Fitxa d'Intervenció de l'Operari {selectedTaskDetailModal.jobCode}
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Tasca realitzada per <strong>{selectedTaskDetailModal.operator}</strong> • Client: <strong>{selectedTaskDetailModal.client}</strong>
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedTaskDetailModal(null)} className="text-on-surface-variant hover:text-primary p-1">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
              
              {/* Photo Evidence & Details */}
              <div className="col-span-12 md:col-span-5 flex flex-col gap-sm">
                <span className="font-label-caps text-xs text-on-surface-variant">Evidència Fotogràfica de l'Operari</span>
                <div className="relative h-48 rounded-xl overflow-hidden shadow-md border border-outline-variant/30 group">
                  <img 
                    src={selectedTaskDetailModal.workEvidence.photoUrl} 
                    alt="Evidència de treball" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-md">
                    <span className="text-white text-xs font-body-base">📷 {selectedTaskDetailModal.workEvidence.photoDesc}</span>
                  </div>
                </div>

                <div className="p-md bg-surface-container-low rounded-xl text-xs space-y-1.5 border border-outline-variant/20">
                  <p><strong>Vehicle Utilitzat:</strong> {selectedTaskDetailModal.workEvidence.vehicleUsed}</p>
                  <p><strong>Hores de Camp Registrades:</strong> <span className="font-bold text-primary font-mono">{selectedTaskDetailModal.hours}</span></p>
                  <p><strong>Eines de Mà:</strong> {selectedTaskDetailModal.workEvidence.toolsUsed.join(', ')}</p>
                </div>
              </div>

              {/* Materials & Conformity Signature */}
              <div className="col-span-12 md:col-span-7 flex flex-col gap-md">
                <div className="p-md bg-surface-container-lowest rounded-xl border border-outline-variant/20 flex flex-col gap-xs">
                  <span className="font-label-caps text-xs text-on-surface-variant mb-1">Materials Utilitzats i Retirats de Magatzem</span>
                  
                  <div className="space-y-1">
                    {selectedTaskDetailModal.workEvidence.materialsUsed.map((m: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-surface rounded-lg text-xs font-mono border border-outline-variant/10">
                        <span>{m.name} ({m.qty})</span>
                        <span className="font-bold text-primary">{m.cost}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Client Conformity Signature box */}
                <div className="p-md bg-white rounded-xl border border-outline-variant/30 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Conformitat Client en Camp</span>
                    <span className="font-body-strong text-xs italic text-primary">{selectedTaskDetailModal.client}</span>
                    <span className="text-[11px] block text-on-surface-variant mt-0.5">Signat digitalment a la PWA de l'operari</span>
                  </div>
                  <div className="w-28 h-12 flex items-center justify-center bg-surface-container-low rounded-lg p-1 border border-outline-variant/20">
                    <svg className="w-full h-full stroke-primary fill-none opacity-90" viewBox="0 0 100 40">
                      <path d="M10,30 Q30,10 50,30 T90,20" strokeWidth="2.5"></path>
                    </svg>
                  </div>
                </div>

                <div className="flex gap-sm pt-xs">
                  <button 
                    onClick={() => {
                      setSelectedTaskDetailModal(null);
                      router.push('/gestio/feines/completades');
                    }}
                    className="flex-1 py-2.5 bg-primary text-white rounded-lg text-xs font-body-strong flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span> Obrir Historial Complet
                  </button>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-xs border-t border-outline-variant/20">
              <button onClick={() => setSelectedTaskDetailModal(null)} className="px-md py-2 bg-surface-container-high text-on-surface rounded-lg text-xs font-body-strong">
                Tancar Fitxa
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
