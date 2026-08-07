'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CompletedJob {
  id: string;
  code: string;
  client: string;
  type: string;
  date: string;
  hours: string;
  cost: string;
  invoiced: string;
  status: string;
}

export default function Page() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [completedJobs] = useState<CompletedJob[]>([]);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <main className="relative pt-32 p-xl bg-surface min-h-screen">
      <nav className="mb-lg flex items-center text-xs text-on-surface-variant gap-xs">
        <span className="material-symbols-outlined text-[14px]">home</span>
        <span>/</span>
        <Link href="/gestio" className="hover:text-primary cursor-pointer">Dashboard</Link>
        <span>/</span>
        <span className="text-primary font-body-strong">Treballs Finalitzats</span>
      </nav>

      <div className="flex flex-col w-full gap-lg">
        {/* Header & Filters Section */}
        <section className="grid grid-cols-12 gap-lg items-end">
          <div className="col-span-12 lg:col-span-4">
            <h1 className="font-display-lg text-display-lg text-primary mb-xs italic">Treballs Finalitzats</h1>
            <p className="font-body-base text-on-surface-variant">Historial complet d&apos;intervencions i auditories tècniques finalitzades.</p>
          </div>
          <div className="col-span-12 lg:col-span-8 flex flex-wrap items-center justify-end gap-md">
            <div className="flex items-center gap-sm bg-surface-container-low p-xs rounded-lg shadow-sm border border-outline-variant/30">
              <div className="flex flex-col px-md py-xs border-r border-outline-variant/30">
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">Rang de Dates</span>
                <div className="flex items-center gap-xs cursor-pointer hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  <span className="font-body-strong text-sm">Selecciona rang</span>
                </div>
              </div>
              <div className="flex flex-col px-md py-xs border-r border-outline-variant/30">
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">Client</span>
                <select className="bg-transparent font-body-strong text-sm outline-none cursor-pointer pr-lg">
                  <option>Tots els clients</option>
                </select>
              </div>
              <div className="flex flex-col px-md py-xs">
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">Tipologia</span>
                <select className="bg-transparent font-body-strong text-sm outline-none cursor-pointer pr-lg">
                  <option>Tots els tipus</option>
                  <option>Manteniment</option>
                  <option>Instal·lació</option>
                  <option>Reparació</option>
                </select>
              </div>
            </div>
            <button className="flex items-center gap-sm bg-primary text-on-primary px-xl py-md rounded-lg shadow-md hover:bg-primary-container transition-all group">
              <span className="material-symbols-outlined transition-transform group-hover:rotate-12">file_download</span>
              <span className="font-body-strong">Exportar Informe</span>
            </button>
          </div>
        </section>

        {/* Main Data Table Container */}
        <section className="bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden border border-outline-variant/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high/50 border-b border-outline-variant/30">
                  <th className="px-lg py-md font-label-caps text-on-surface-variant">CODI</th>
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
                {completedJobs.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-lg py-xl text-center text-on-surface-variant">
                      <div className="flex flex-col items-center gap-md py-xl">
                        <span className="material-symbols-outlined text-5xl text-outline">folder_open</span>
                        <p className="font-body-strong text-lg">Cap feina completada</p>
                        <p className="font-body-base text-sm">Les feines finalitzades apareixeran aquí automàticament.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  completedJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-surface-container-low/50 transition-colors cursor-pointer group" onClick={() => toggleRow(job.id)}>
                      <td className="px-lg py-md font-data-tabular font-bold text-primary">{job.code}</td>
                      <td className="px-lg py-md font-body-strong">{job.client}</td>
                      <td className="px-lg py-md text-xs">
                        <span className="px-sm py-xs bg-primary/10 text-primary rounded font-medium">{job.type}</span>
                      </td>
                      <td className="px-lg py-md font-data-tabular text-center">{job.date}</td>
                      <td className="px-lg py-md font-data-tabular text-right">{job.hours}</td>
                      <td className="px-lg py-md font-data-tabular text-right">{job.cost}</td>
                      <td className="px-lg py-md font-data-tabular text-right font-semibold text-secondary">{job.invoiced}</td>
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-xs text-green-600">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          <span className="font-label-caps">{job.status}</span>
                        </div>
                      </td>
                      <td className="px-lg py-md text-right">
                        <div className="flex items-center justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-xs hover:bg-surface-container-highest rounded text-on-surface-variant" title="PDF">
                            <span className="material-symbols-outlined">picture_as_pdf</span>
                          </button>
                          <button className="p-xs hover:bg-surface-container-highest rounded text-on-surface-variant" title="Detalls">
                            <span className="material-symbols-outlined">{expandedRow === job.id ? 'expand_less' : 'expand_more'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick Statistics Overlays */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg -mt-md mb-xl relative z-20">
          <div className="bg-white/80 backdrop-blur-xl p-lg rounded-xl shadow-xl flex items-center justify-between group hover:-translate-y-1 transition-transform">
            <div className="flex flex-col">
              <span className="font-label-caps text-on-surface-variant">Eficiència Mitjana</span>
              <span className="text-display-lg font-display-lg text-primary">—</span>
            </div>
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">bolt</span>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl p-lg rounded-xl shadow-xl flex items-center justify-between group hover:-translate-y-1 transition-transform">
            <div className="flex flex-col">
              <span className="font-label-caps text-on-surface-variant">Marge Operatiu</span>
              <span className="text-display-lg font-display-lg text-secondary">—</span>
            </div>
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">payments</span>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl p-lg rounded-xl shadow-xl flex items-center justify-between group hover:-translate-y-1 transition-transform">
            <div className="flex flex-col">
              <span className="font-label-caps text-on-surface-variant">Temps Mitjà Resol.</span>
              <span className="text-display-lg font-display-lg text-primary">—</span>
            </div>
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">avg_pace</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
