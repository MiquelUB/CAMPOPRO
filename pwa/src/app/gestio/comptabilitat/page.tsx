'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Page() {
  const [expandedRow, setExpandedRow] = useState<string | null>('row-1');
  const [filterStatus, setFilterStatus] = useState<string>('TOTS');

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const invoiceRecords = [
    {
      id: 'row-1',
      code: '#FACT-2026-0842',
      jobCode: '#OT-439',
      client: 'AgroServei Ponent',
      type: 'Instal·lació',
      date: '04/08/2026',
      hours: '18.5h',
      cost: '1.240€',
      totalBilled: '2.450€',
      status: 'EMESA',
      hasIncident: false,
    },
    {
      id: 'row-2',
      code: '#FACT-2026-0839',
      jobCode: '#OT-435',
      client: 'Cooperativa d\'Ivars',
      type: 'Reparació',
      date: '02/08/2026',
      hours: '4.0h',
      cost: '180€',
      totalBilled: '320€',
      status: 'COBRADA',
      hasIncident: false,
    },
    {
      id: 'row-3',
      code: '#FACT-2026-0835',
      jobCode: '#OT-431',
      client: 'Finca Santa Anna',
      type: 'Manteniment',
      date: '01/08/2026',
      hours: '12.0h',
      cost: '450€',
      totalBilled: '980€',
      status: 'PENDENT_COBRAMENT',
      hasIncident: false,
    },
    {
      id: 'row-4',
      code: '#FACT-2026-0844',
      jobCode: '#OT-442',
      client: 'Finca Masia Vella',
      type: 'Tractament Fitosanitari',
      date: '03/08/2026',
      hours: '6.5h',
      cost: '310€',
      totalBilled: '680€',
      status: 'PENDENT_FACTURAR',
      hasIncident: false,
    }
  ];

  const filteredRecords = filterStatus === 'TOTS' 
    ? invoiceRecords 
    : invoiceRecords.filter(r => r.status === filterStatus);

  return (
    <main className="relative pt-6 px-4 md:px-xl pb-xl bg-surface min-h-screen">
      <div className="flex flex-col w-full gap-lg">
        {/* Header & Filters Section */}
        <section className="grid grid-cols-12 gap-lg items-end">
          <div className="col-span-12 lg:col-span-4">
            <h1 className="font-display-lg text-display-lg text-primary mb-xs">Comptabilitat i Facturació</h1>
            <p className="font-body-base text-on-surface-variant">Gestió financera, auditoria de costos i emissió de factures de treballs completats.</p>
          </div>

          <div className="col-span-12 lg:col-span-8 flex flex-wrap items-center justify-end gap-md">
            <div className="flex items-center gap-sm bg-surface-container-low p-xs rounded-lg shadow-sm border border-outline-variant/30">
              <div className="flex flex-col px-md py-xs border-r border-outline-variant/30">
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">Estat Facturació</span>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-transparent font-body-strong text-sm outline-none cursor-pointer pr-lg text-primary"
                >
                  <option value="TOTS">Tots els estats</option>
                  <option value="PENDENT_FACTURAR">Pendent de facturar</option>
                  <option value="EMESA">Emesa</option>
                  <option value="COBRADA">Cobrada</option>
                  <option value="PENDENT_COBRAMENT">Pendent de cobrament</option>
                </select>
              </div>

              <div className="flex flex-col px-md py-xs">
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">Client</span>
                <select className="bg-transparent font-body-strong text-sm outline-none cursor-pointer pr-lg text-primary">
                  <option>Tots els clients</option>
                  <option>AgroServei Ponent</option>
                  <option>Cooperativa d'Ivars</option>
                  <option>Finca Santa Anna</option>
                </select>
              </div>
            </div>

            <button 
              onClick={() => alert("S'ha exportat el resum comptable en format Excel / PDF.")}
              className="flex items-center gap-sm bg-primary text-on-primary px-xl py-md rounded-lg shadow-md hover:bg-primary-container transition-all group cursor-pointer"
            >
              <span className="material-symbols-outlined transition-transform group-hover:rotate-12">file_download</span>
              <span className="font-body-strong">Exportar Informe Comptable</span>
            </button>
          </div>
        </section>

        {/* Quick Financial KPIs */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-md">
          <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border-l-4 border-primary">
            <span className="text-xs font-label-caps text-on-surface-variant">TOTAL FACTURAT MES</span>
            <p className="text-2xl font-display-lg text-primary mt-1">12.450 €</p>
            <span className="text-[11px] text-green-600 font-bold">+8.4% respecte mes anterior</span>
          </div>

          <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border-l-4 border-purple-500">
            <span className="text-xs font-label-caps text-on-surface-variant">PENDENT DE FACTURAR</span>
            <p className="text-2xl font-display-lg text-purple-700 mt-1">680 €</p>
            <span className="text-[11px] text-on-surface-variant">1 feina finalitzada sense incidència</span>
          </div>

          <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border-l-4 border-orange-500">
            <span className="text-xs font-label-caps text-on-surface-variant">PENDENT DE COBRAMENT</span>
            <p className="text-2xl font-display-lg text-orange-600 mt-1">980 €</p>
            <span className="text-[11px] text-orange-600 font-bold">Venciment en 12 dies</span>
          </div>

          <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border-l-4 border-green-500">
            <span className="text-xs font-label-caps text-on-surface-variant">MARGE OPERATIU MITJÀ</span>
            <p className="text-2xl font-display-lg text-green-600 mt-1">48.1%</p>
            <span className="text-[11px] text-green-600 font-bold">Rendiment excel·lent</span>
          </div>
        </section>

        {/* Main Data Table Container */}
        <section className="bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden border border-outline-variant/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high/50 border-b border-outline-variant/30">
                  <th className="px-lg py-md font-label-caps text-on-surface-variant">FACTURA</th>
                  <th className="px-lg py-md font-label-caps text-on-surface-variant">ORDRE</th>
                  <th className="px-lg py-md font-label-caps text-on-surface-variant">CLIENT</th>
                  <th className="px-lg py-md font-label-caps text-on-surface-variant">TIPUS</th>
                  <th className="px-lg py-md font-label-caps text-on-surface-variant text-center">DATA</th>
                  <th className="px-lg py-md font-label-caps text-on-surface-variant text-right">HORES</th>
                  <th className="px-lg py-md font-label-caps text-on-surface-variant text-right">COST</th>
                  <th className="px-lg py-md font-label-caps text-on-surface-variant text-right">FACTURAT</th>
                  <th className="px-lg py-md font-label-caps text-on-surface-variant">ESTAT</th>
                  <th className="px-lg py-md font-label-caps text-on-surface-variant text-right">ACCIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredRecords.map((row) => (
                  <tr 
                    key={row.id} 
                    className="hover:bg-surface-container-low/50 transition-colors cursor-pointer group" 
                    onClick={() => toggleRow(row.id)}
                  >
                    <td className="px-lg py-md font-data-tabular font-bold text-primary">{row.code}</td>
                    <td className="px-lg py-md font-body-strong text-on-surface-variant">{row.jobCode}</td>
                    <td className="px-lg py-md font-body-strong">{row.client}</td>
                    <td className="px-lg py-md text-xs">
                      <span className="px-sm py-xs bg-primary/10 text-primary rounded font-medium">{row.type}</span>
                    </td>
                    <td className="px-lg py-md font-data-tabular text-center">{row.date}</td>
                    <td className="px-lg py-md font-data-tabular text-right">{row.hours}</td>
                    <td className="px-lg py-md font-data-tabular text-right">{row.cost}</td>
                    <td className="px-lg py-md font-data-tabular text-right font-semibold text-secondary">{row.totalBilled}</td>
                    <td className="px-lg py-md">
                      {row.status === 'COBRADA' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span> Cobrada
                        </span>
                      )}
                      {row.status === 'EMESA' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center gap-1 w-fit">
                          <span className="material-symbols-outlined text-[14px]">send</span> Emesa
                        </span>
                      )}
                      {row.status === 'PENDENT_FACTURAR' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 flex items-center gap-1 w-fit">
                          <span className="material-symbols-outlined text-[14px]">receipt_long</span> Pendent Facturar
                        </span>
                      )}
                      {row.status === 'PENDENT_COBRAMENT' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 flex items-center gap-1 w-fit">
                          <span className="material-symbols-outlined text-[14px]">hourglass_empty</span> Pendent Cobrament
                        </span>
                      )}
                    </td>
                    <td className="px-lg py-md text-right">
                      <div className="flex items-center justify-end gap-xs">
                        <button 
                          onClick={(e) => { e.stopPropagation(); alert(`Generant PDF per a la factura ${row.code}`); }}
                          className="px-2 py-1 bg-surface-container-high hover:bg-surface-container-highest rounded text-primary text-xs font-body-strong flex items-center gap-1" 
                          title="Descarregar PDF Factura"
                        >
                          <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-primary text-on-primary font-bold">
                  <td className="px-lg py-md text-right" colSpan={5}>Totals Comptables del Període</td>
                  <td className="px-lg py-md font-data-tabular text-right">41.0h</td>
                  <td className="px-lg py-md font-data-tabular text-right">2.180€</td>
                  <td className="px-lg py-md font-data-tabular text-right text-lg text-secondary-fixed">4.430€</td>
                  <td className="px-lg py-md" colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
