'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Page() {
  // Navigation Tabs: Clients, Proveïdors, Operaris (Targetes), Balanç
  const [activeTab, setActiveTab] = useState<'clients' | 'proveidors' | 'operaris' | 'balanc'>('clients');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Client Invoices Data
  const [clientInvoices, setClientInvoices] = useState([
    {
      id: 'cli-1',
      invoiceNo: '#FACT-2026-0842',
      jobCode: '#OT-439',
      client: 'AgroServei Ponent SL',
      nif: 'B12345678',
      date: '04/08/2026',
      dueDate: '03/09/2026',
      hours: '18.5h',
      subtotal: '2.024,79 €',
      iva: '425,21 € (21%)',
      total: '2.450,00 €',
      status: 'EMESA',
    },
    {
      id: 'cli-2',
      invoiceNo: '#FACT-2026-0839',
      jobCode: '#OT-435',
      client: 'Cooperativa d\'Ivars',
      nif: 'F25098765',
      date: '02/08/2026',
      dueDate: '01/09/2026',
      hours: '4.0h',
      subtotal: '264,46 €',
      iva: '55,54 € (21%)',
      total: '320,00 €',
      status: 'COBRADA',
    },
    {
      id: 'cli-3',
      invoiceNo: '#FACT-2026-0835',
      jobCode: '#OT-431',
      client: 'Finca Santa Anna',
      nif: 'A08123456',
      date: '01/08/2026',
      dueDate: '15/08/2026',
      hours: '12.0h',
      subtotal: '809,92 €',
      iva: '170,08 € (21%)',
      total: '980,00 €',
      status: 'PENDENT_COBRAMENT',
    },
    {
      id: 'cli-4',
      invoiceNo: '#FACT-2026-0844',
      jobCode: '#OT-442',
      client: 'Finca Masia Vella',
      nif: 'B66554433',
      date: '03/08/2026',
      dueDate: '02/09/2026',
      hours: '6.5h',
      subtotal: '561,98 €',
      iva: '118,02 € (21%)',
      total: '680,00 €',
      status: 'PENDENT_FACTURAR',
    }
  ]);

  // Supplier Invoices Data (Facturació de Proveïdors)
  const [supplierInvoices, setSupplierInvoices] = useState([
    {
      id: 'sup-1',
      invoiceNo: '#PROV-2026-991',
      supplier: 'Suministros Agrícolas del Segre SA',
      concept: 'Comprat Fertilitzant N-12 i Fitonutrients (10 Sacs)',
      date: '01/08/2026',
      dueDate: '31/08/2026',
      subtotal: '450,00 €',
      iva: '94,50 € (21%)',
      total: '544,50 €',
      status: 'PENDENT_PAGAMENT',
      paymentMethod: 'Transferència 30 dies'
    },
    {
      id: 'sup-2',
      invoiceNo: '#PROV-2026-988',
      supplier: 'Tractores i Recanvis Ponent',
      concept: 'Oli Sintètic Heavy Duty 20L + Filtre Oli John Deere',
      date: '28/07/2026',
      dueDate: '27/08/2026',
      subtotal: '210,00 €',
      iva: '44,10 € (21%)',
      total: '254,10 €',
      status: 'PAGAT',
      paymentMethod: 'Domiciliació Bancària'
    },
    {
      id: 'sup-3',
      invoiceNo: '#PROV-2026-975',
      supplier: 'Tuberies i Regs de Ponent SL',
      concept: 'Canonada PE-90 100m + Vàlvules Inox 2 polzades',
      date: '25/07/2026',
      dueDate: '24/08/2026',
      subtotal: '890,00 €',
      iva: '186,90 € (21%)',
      total: '1.076,90 €',
      status: 'PAGAT',
      paymentMethod: 'Targeta Empresa'
    }
  ]);

  // Operator Expenses & Cards Data (Targetes i Liquidacions d'Operaris)
  const [operatorCards, setOperatorCards] = useState([
    {
      id: 'op-card-1',
      operator: 'Jordi Soler',
      role: 'Cap d\'Equip (Tractor 04)',
      cardNumber: '💳 **** **** **** 4821',
      concept: 'Repostatge Gasoil B + Peatge C-16',
      date: '03/08/2026',
      ticketRef: 'TIQ-8812',
      amount: '142,50 €',
      category: 'COMBUSTIBLE',
      status: 'APROVAT',
    },
    {
      id: 'op-card-2',
      operator: 'Pau Ribas',
      role: 'Maquinista Agrícola',
      cardNumber: '💳 **** **** **** 1092',
      concept: 'Material d\'Urgència: Cinta Tefló + Brides Inox (Magatzem Local)',
      date: '02/08/2026',
      ticketRef: 'TIQ-8809',
      amount: '45,80 €',
      category: 'MATERIAL_CAMP',
      status: 'PENDENT_VALIDAR',
    },
    {
      id: 'op-card-3',
      operator: 'Marc Andreu',
      role: 'Tècnic IOT & Elèctric',
      cardNumber: '💳 **** **** **** 7731',
      concept: 'Dieta Menú Tècnic en Intervenció Finca Masia Vella',
      date: '01/08/2026',
      ticketRef: 'TIQ-8798',
      amount: '18,50 €',
      category: 'DIETES',
      status: 'APROVAT',
    },
    {
      id: 'op-card-4',
      operator: 'Joan Martí',
      role: 'Manteniment General',
      cardNumber: '💳 **** **** **** 3310',
      concept: 'Lavado i Desinfecció Maquinària Post-Tractament',
      date: '31/07/2026',
      ticketRef: 'TIQ-8780',
      amount: '32,00 €',
      category: 'MANTENIMENT',
      status: 'LIQUIDAT',
    }
  ]);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
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
              Quadre de comandament unificat: Facturació a clients, despeses de proveïdors i targetes / tiquets d'operaris.
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
          {/* KPI 1: Ingressos Clients */}
          <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border-l-4 border-emerald-500 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-label-caps text-on-surface-variant">INGRESSOS CLIENTS (MES)</span>
                <span className="p-1 bg-emerald-50 text-emerald-600 rounded">
                  <span className="material-symbols-outlined text-[18px]">trending_up</span>
                </span>
              </div>
              <p className="text-2xl font-display-lg text-emerald-700 mt-2">12.450,00 €</p>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-2">
              4 factures emeses • 92% cobrat
            </p>
          </div>

          {/* KPI 2: Despeses Proveïdors */}
          <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border-l-4 border-orange-500 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-label-caps text-on-surface-variant">COMPRES PROVEÏDORS</span>
                <span className="p-1 bg-orange-50 text-orange-600 rounded">
                  <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                </span>
              </div>
              <p className="text-2xl font-display-lg text-orange-700 mt-2">1.875,50 €</p>
            </div>
            <p className="text-[11px] text-orange-600 font-bold mt-2">
              3 factures rebudes • 544,50 € pendent pagament
            </p>
          </div>

          {/* KPI 3: Targetes & Tiquets Operaris */}
          <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border-l-4 border-blue-500 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-label-caps text-on-surface-variant">TARGETES OPERARIS</span>
                <span className="p-1 bg-blue-50 text-blue-600 rounded">
                  <span className="material-symbols-outlined text-[18px]">credit_card</span>
                </span>
              </div>
              <p className="text-2xl font-display-lg text-blue-700 mt-2">238,80 €</p>
            </div>
            <p className="text-[11px] text-blue-600 font-bold mt-2">
              4 despeses d'equip • 1 pendent de validar
            </p>
          </div>

          {/* KPI 4: Benefici Net i Marge */}
          <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border-l-4 border-purple-500 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-label-caps text-on-surface-variant">BENEFICI NET OPERATIU</span>
                <span className="p-1 bg-purple-50 text-purple-600 rounded">
                  <span className="material-symbols-outlined text-[18px]">account_balance</span>
                </span>
              </div>
              <p className="text-2xl font-display-lg text-purple-700 mt-2">10.335,70 €</p>
            </div>
            <p className="text-[11px] text-purple-600 font-bold mt-2">
              Marge operatiu net: 82,9%
            </p>
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
                Targetes i Liquidacions Operaris ({operatorCards.length})
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
                      <th className="px-md py-sm">FACTURA</th>
                      <th className="px-md py-sm">ORDRE</th>
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
                        <td className="px-md py-md font-bold text-primary">{inv.invoiceNo}</td>
                        <td className="px-md py-md text-xs font-mono text-on-surface-variant">{inv.jobCode}</td>
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
                              onClick={() => alert(`Descarregant PDF Factura ${inv.invoiceNo}`)}
                              className="px-2 py-1 bg-surface-container-high hover:bg-surface-container-highest rounded text-primary text-xs font-body-strong flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[14px]">picture_as_pdf</span> PDF
                            </button>
                            <button 
                              onClick={() => alert(`Notificació enviada al client ${inv.client}`)}
                              className="px-2 py-1 bg-primary text-white rounded text-xs font-body-strong flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[14px]">send</span> Enviar
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
                      <th className="px-md py-sm">DATA / VENCIMENT</th>
                      <th className="px-md py-sm text-right">SUBTOTAL</th>
                      <th className="px-md py-sm text-right">IVA SOPENAT</th>
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
                        <td className="px-md py-md text-xs">
                          <p className="font-bold">{sup.date}</p>
                          <p className="text-on-surface-variant">Venc: {sup.dueDate}</p>
                        </td>
                        <td className="px-md py-md text-right font-mono">{sup.subtotal}</td>
                        <td className="px-md py-md text-right text-xs text-on-surface-variant font-mono">{sup.iva}</td>
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
              <div className="p-md bg-blue-50/50 rounded-xl border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-700 text-3xl">credit_card</span>
                  <div>
                    <h4 className="font-body-strong text-sm text-blue-900">Control de Targetes d'Empresa & Tiquets d'Operaris</h4>
                    <p className="text-xs text-blue-700">Tots els tiquets pujats pels operaris des de la PWA mòbil queden comptabilitzats i auditats automàticament.</p>
                  </div>
                </div>
                <button 
                  onClick={() => alert("S'ha obert la finestra de liquidació massiva de despeses d'operaris.")}
                  className="px-3 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-body-strong hover:bg-blue-800"
                >
                  Liquidació Massiva
                </button>
              </div>

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
                      <th className="px-md py-sm">ESTAT AUDITORIA</th>
                      <th className="px-md py-sm text-right">ACCIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-sm">
                    {operatorCards.map((card) => (
                      <tr key={card.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-md py-md">
                          <p className="font-body-strong text-primary">{card.operator}</p>
                          <p className="text-xs text-on-surface-variant">{card.role}</p>
                        </td>
                        <td className="px-md py-md">
                          <p className="text-xs font-mono font-bold text-on-surface">{card.cardNumber}</p>
                          <p className="text-[11px] text-on-surface-variant font-mono">Ref: {card.ticketRef}</p>
                        </td>
                        <td className="px-md py-md text-xs text-on-surface-variant max-w-xs">{card.concept}</td>
                        <td className="px-md py-md text-xs">
                          <span className="px-2 py-0.5 bg-surface-container-high text-on-surface rounded font-bold">
                            {card.category}
                          </span>
                        </td>
                        <td className="px-md py-md text-xs font-bold">{card.date}</td>
                        <td className="px-md py-md text-right font-bold text-blue-700 font-mono">{card.amount}</td>
                        <td className="px-md py-md">
                          {card.status === 'APROVAT' && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span> Aprovat
                            </span>
                          )}
                          {card.status === 'PENDENT_VALIDAR' && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 flex items-center gap-1 w-fit">
                              <span className="material-symbols-outlined text-[14px]">pending</span> Pendent Validar
                            </span>
                          )}
                          {card.status === 'LIQUIDAT' && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 flex items-center gap-1 w-fit">
                              <span className="material-symbols-outlined text-[14px]">task_alt</span> Liquidat
                            </span>
                          )}
                        </td>
                        <td className="px-md py-md text-right">
                          <button 
                            onClick={() => alert(`Visualitzant la foto del tiquet ref: ${card.ticketRef} enviat per ${card.operator}`)}
                            className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-container-highest rounded text-primary text-xs font-body-strong flex items-center gap-1 ml-auto"
                          >
                            <span className="material-symbols-outlined text-[14px]">receipt</span> Veure Tiquet
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
                
                {/* Income vs Expense Summary */}
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
                      <span className="text-on-surface-variant font-body-strong">Despeses Operaris & Targetes (Combustible/Dietes)</span>
                      <span className="font-bold text-blue-700 font-mono">-238,80 €</span>
                    </div>
                    <div className="flex justify-between items-center p-md bg-emerald-50 rounded-lg border border-emerald-200">
                      <span className="font-bold text-emerald-900">RESULTAT NET ABANS D'IMPOSTOS</span>
                      <span className="font-bold text-emerald-800 text-lg font-mono">+10.335,70 €</span>
                    </div>
                  </div>
                </div>

                {/* Fiscal & Tax Estimates */}
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
    </main>
  );
}
