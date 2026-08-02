'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  return (
    <>
<main className="relative pt-32 p-xl bg-surface min-h-screen"><nav className="mb-lg flex items-center text-xs text-on-surface-variant gap-xs"><span className="material-symbols-outlined text-[14px]">home</span><span>/</span><span className="hover:text-primary cursor-pointer">Dashboard</span></nav><div className="flex flex-col w-full gap-lg">
{/* Header & Filters Section */}
<section className="grid grid-cols-12 gap-lg items-end">
<div className="col-span-12 lg:col-span-4">
<h1 className="font-display-lg text-display-lg text-primary mb-xs italic">Treballs Finalitzats</h1>
<p className="font-body-base text-on-surface-variant">Historial complet d'intervencions i auditories tècniques finalitzades.</p>
</div>
<div className="col-span-12 lg:col-span-8 flex flex-wrap items-center justify-end gap-md">
{/* Filter Controls */}
<div className="flex items-center gap-sm bg-surface-container-low p-xs rounded-lg shadow-sm border border-outline-variant/30">
<div className="flex flex-col px-md py-xs border-r border-outline-variant/30">
<span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">Rang de Dates</span>
<div className="flex items-center gap-xs cursor-pointer hover:text-primary transition-colors">
<span className="material-symbols-outlined text-sm">calendar_month</span>
<span className="font-body-strong text-sm">01 Gen - 31 Mar, 2024</span>
</div>
</div>
<div className="flex flex-col px-md py-xs border-r border-outline-variant/30">
<span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">Client</span>
<select className="bg-transparent font-body-strong text-sm outline-none cursor-pointer pr-lg">
<option>Tots els clients</option>
<option>AgroServei S.L.</option>
<option>Finca La Masia</option>
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
{/* Row 1 (Expanded State Demonstration) */}
<tr className="hover:bg-surface-container-low/50 transition-colors cursor-pointer group" onClick={() => { /* toggleDetails('row-1') */ }}>
<td className="px-lg py-md font-data-tabular font-bold text-primary">#CP-8842</td>
<td className="px-lg py-md font-body-strong">AgroServei Ponent</td>
<td className="px-lg py-md text-xs">
<span className="px-sm py-xs bg-primary/10 text-primary rounded font-medium">Instal·lació</span>
</td>
<td className="px-lg py-md font-data-tabular text-center">14/03/24</td>
<td className="px-lg py-md font-data-tabular text-right">18.5h</td>
<td className="px-lg py-md font-data-tabular text-right">1.240€</td>
<td className="px-lg py-md font-data-tabular text-right font-semibold text-secondary">2.450€</td>
<td className="px-lg py-md">
<div className="flex items-center gap-xs text-green-600">
<span className="material-symbols-outlined text-[14px]">check_circle</span>
<span className="font-label-caps">Finalitzat</span>
</div>
</td>
<td className="px-lg py-md text-right">
<div className="flex items-center justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-xs hover:bg-surface-container-highest rounded text-on-surface-variant" title="PDF">
<span className="material-symbols-outlined">picture_as_pdf</span>
</button>
<button className="p-xs hover:bg-surface-container-highest rounded text-on-surface-variant" title="Detalls">
<span className="material-symbols-outlined">expand_more</span>
</button>
</div>
</td>
</tr>
{/* Expanded Content for Row 1 */}
<tr className="bg-surface-container-low/30 overflow-hidden" id="row-1-details">
<td className="px-xl py-lg" colspan="9">
<div className="grid grid-cols-12 gap-xl">
{/* Photo Carousel */}
<div className="col-span-4 flex flex-col gap-md">
<span className="font-label-caps text-on-surface-variant">Evidència Fotogràfica</span>
<div className="relative group h-48 rounded-xl overflow-hidden shadow-md">
<img className="w-full h-full object-cover" data-alt="Close-up professional photograph of an agricultural irrigation valve system recently installed, late afternoon sun casting long shadows, metallic textures, droplets of water, shallow depth of field, high-tech farming aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDveK6D5zSYaS6w84E8FKBzPqWfWi6ig_7O0OisKvLCxFUZEQSEMY2Q287y5gtDwEURl_0VNgQ3KdsD8PF5jutaTe5wAcCe9nEnIsCrTnMLaDixIlkBHW3pXaixoit-9sIcPZUaDIDJcZiM98vj12GrFpPzORVVsuPPktOg2uuMZ2uPh7XhTVOkNCYJ-uvy6Zuj0sXUYMEFSZ96zeB0bQ3DD0-tKisvHiisof2tnz6O6FUYqRvlMDI6"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-md">
<span className="text-white text-xs font-body-base">Vàlvula principal - Sector B4</span>
</div>
<div className="absolute inset-y-0 left-0 flex items-center p-xs opacity-0 group-hover:opacity-100 transition-opacity">
<button className="bg-white/20 backdrop-blur-md p-xs rounded-full text-white"><span className="material-symbols-outlined">chevron_left</span></button>
</div>
<div className="absolute inset-y-0 right-0 flex items-center p-xs opacity-0 group-hover:opacity-100 transition-opacity">
<button className="bg-white/20 backdrop-blur-md p-xs rounded-full text-white"><span className="material-symbols-outlined">chevron_right</span></button>
</div>
</div>
</div>
{/* Plan Annotations & Signature */}
<div className="col-span-4 flex flex-col gap-md">
<span className="font-label-caps text-on-surface-variant">Plànol i Signatura</span>
<div className="flex flex-col gap-sm">
<div className="h-32 bg-surface-container-highest rounded-xl relative border border-outline-variant/30 flex items-center justify-center group overflow-hidden">
<div className="absolute inset-0 grayscale contrast-125 opacity-30" data-location="Lleida, Spain"></div>
<span className="material-symbols-outlined text-primary text-4xl relative z-10">map</span>
<div className="absolute top-2 right-2 bg-primary text-on-primary text-[10px] px-sm py-xs rounded-full uppercase tracking-tighter">Annotat</div>
</div>
<div className="p-md bg-white rounded-xl border border-outline-variant/30 flex items-center justify-between">
<div className="flex flex-col">
<span className="text-[10px] text-on-surface-variant uppercase">Conformitat Client</span>
<span className="font-body-strong text-xs italic">Joan Vilalta i Mas</span>
</div>
<div className="w-24 h-12 flex items-center justify-center">
<svg className="w-full h-full stroke-primary fill-none opacity-80" viewBox="0 0 100 40">
<path d="M10,30 Q30,10 50,30 T90,20" strokeWidth="2"></path>
</svg>
</div>
</div>
</div>
</div>
{/* Material Comparison */}
<div className="col-span-4 flex flex-col gap-md">
<div className="flex justify-between items-center">
<span className="font-label-caps text-on-surface-variant">Comparativa Materials</span>
<span className="text-[10px] text-error font-bold flex items-center gap-xs">
<span className="material-symbols-outlined text-xs">trending_up</span> +12.4% Desviació
                    </span>
</div>
<div className="flex flex-col gap-xs">
<div className="flex justify-between text-xs mb-xs">
<span className="text-on-surface-variant">Pressupostat</span>
<span className="font-bold">840,00€</span>
</div>
<div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary" style={{ width: '75%' }}></div>
</div>
<div className="flex justify-between text-xs mt-xs">
<span className="text-on-surface-variant">Executat Real</span>
<span className="font-bold text-error">944,20€</span>
</div>
<div className="mt-md flex gap-sm">
<button className="flex-1 py-sm bg-surface-container-high hover:bg-surface-container-highest text-primary font-body-strong text-xs rounded-lg transition-colors flex items-center justify-center gap-xs">
<span className="material-symbols-outlined text-sm">visibility</span> Veure Pre-factura
                      </button>
<button className="flex-1 py-sm bg-secondary-container/10 hover:bg-secondary-container/20 text-secondary font-body-strong text-xs rounded-lg transition-colors flex items-center justify-center gap-xs">
<span className="material-symbols-outlined text-sm">print</span> Generar PDF
                      </button>
</div>
</div>
</div>
</div>
</td>
</tr>
{/* Row 2 */}
<tr className="hover:bg-surface-container-low/50 transition-colors cursor-pointer group">
<td className="px-lg py-md font-data-tabular font-bold text-primary">#CP-8839</td>
<td className="px-lg py-md font-body-strong">Cooperativa d'Ivars</td>
<td className="px-lg py-md text-xs">
<span className="px-sm py-xs bg-tertiary-fixed text-on-tertiary-fixed-variant rounded font-medium">Reparació</span>
</td>
<td className="px-lg py-md font-data-tabular text-center">12/03/24</td>
<td className="px-lg py-md font-data-tabular text-right">4.0h</td>
<td className="px-lg py-md font-data-tabular text-right">180€</td>
<td className="px-lg py-md font-data-tabular text-right font-semibold text-secondary">320€</td>
<td className="px-lg py-md">
<div className="flex items-center gap-xs text-green-600">
<span className="material-symbols-outlined text-[14px]">check_circle</span>
<span className="font-label-caps">Finalitzat</span>
</div>
</td>
<td className="px-lg py-md text-right">
<div className="flex items-center justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-xs hover:bg-surface-container-highest rounded text-on-surface-variant"><span className="material-symbols-outlined">picture_as_pdf</span></button>
<button className="p-xs hover:bg-surface-container-highest rounded text-on-surface-variant"><span className="material-symbols-outlined">expand_more</span></button>
</div>
</td>
</tr>
{/* Row 3 */}
<tr className="hover:bg-surface-container-low/50 transition-colors cursor-pointer group">
<td className="px-lg py-md font-data-tabular font-bold text-primary">#CP-8835</td>
<td className="px-lg py-md font-body-strong">Finca Santa Anna</td>
<td className="px-lg py-md text-xs">
<span className="px-sm py-xs bg-surface-container-highest text-on-surface-variant rounded font-medium">Manteniment</span>
</td>
<td className="px-lg py-md font-data-tabular text-center">10/03/24</td>
<td className="px-lg py-md font-data-tabular text-right">12.0h</td>
<td className="px-lg py-md font-data-tabular text-right">450€</td>
<td className="px-lg py-md font-data-tabular text-right font-semibold text-secondary">980€</td>
<td className="px-lg py-md">
<div className="flex items-center gap-xs text-green-600">
<span className="material-symbols-outlined text-[14px]">check_circle</span>
<span className="font-label-caps">Finalitzat</span>
</div>
</td>
<td className="px-lg py-md text-right">
<div className="flex items-center justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-xs hover:bg-surface-container-highest rounded text-on-surface-variant"><span className="material-symbols-outlined">picture_as_pdf</span></button>
<button className="p-xs hover:bg-surface-container-highest rounded text-on-surface-variant"><span className="material-symbols-outlined">expand_more</span></button>
</div>
</td>
</tr>
</tbody>
{/* Summary Row */}
<tfoot>
<tr className="bg-primary text-on-primary">
<td className="px-lg py-md font-body-strong text-right" colspan="4">Totals del Període</td>
<td className="px-lg py-md font-data-tabular text-right font-bold">142.5h</td>
<td className="px-lg py-md font-data-tabular text-right font-bold text-primary-fixed">9.450€</td>
<td className="px-lg py-md font-data-tabular text-right font-bold text-secondary-fixed text-lg">18.240€</td>
<td className="px-lg py-md" colspan="2"></td>
</tr>
</tfoot>
</table>
</div>
</section>
{/* Quick Statistics Overlays */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-lg -mt-md mb-xl relative z-20">
<div className="bg-white/80 backdrop-blur-xl p-lg rounded-xl shadow-xl flex items-center justify-between group hover:-translate-y-1 transition-transform">
<div className="flex flex-col">
<span className="font-label-caps text-on-surface-variant">Eficiència Mitjana</span>
<span className="text-display-lg font-display-lg text-primary">94.2%</span>
</div>
<div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-3xl">bolt</span>
</div>
</div>
<div className="bg-white/80 backdrop-blur-xl p-lg rounded-xl shadow-xl flex items-center justify-between group hover:-translate-y-1 transition-transform">
<div className="flex flex-col">
<span className="font-label-caps text-on-surface-variant">Marge Operatiu</span>
<span className="text-display-lg font-display-lg text-secondary">48.1%</span>
</div>
<div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-3xl">payments</span>
</div>
</div>
<div className="bg-white/80 backdrop-blur-xl p-lg rounded-xl shadow-xl flex items-center justify-between group hover:-translate-y-1 transition-transform">
<div className="flex flex-col">
<span className="font-label-caps text-on-surface-variant">Tems Mitjà Resol.</span>
<span className="text-display-lg font-display-lg text-primary">4.2d</span>
</div>
<div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-3xl">avg_pace</span>
</div>
</div>
</div>

<style dangerouslySetInnerHTML={{__html: `
    #row-1-details {
      transition: max-height 0.3s ease-out;
    }
    .hidden {
      display: none;
    }
  `}} />
</div></main>
    </>
  );
}
