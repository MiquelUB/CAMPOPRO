'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  return (
    <>
<main className="relative pt-32 p-xl bg-surface min-h-screen"><nav className="mb-lg flex items-center text-xs text-on-surface-variant gap-xs"><span className="material-symbols-outlined text-[14px]">home</span><span>/</span><span className="hover:text-primary cursor-pointer">Dashboard</span></nav><div className="flex flex-col w-full">
{/* Main Workspace */}
<div className="flex h-[calc(100vh-160px)] gap-lg overflow-hidden">
{/* Left Sidebar: Tree Navigation & Search */}
<div className="w-[400px] flex flex-col bg-surface-container-low rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
<div className="p-md space-y-md border-b border-outline-variant/30 bg-surface-container-highest/20">
<div className="flex items-center justify-between">
<h2 className="font-section-title text-section-title text-on-surface">Biblioteca de Plànols</h2>
<button className="p-xs hover:bg-surface-container-high rounded-full transition-colors">
<span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
</button>
</div>
<div className="flex items-center bg-surface-container-lowest px-md py-sm rounded-lg border border-outline-variant focus-within:border-primary transition-all group shadow-sm">
<span className="material-symbols-outlined text-outline group-focus-within:text-primary">search</span>
<input className="bg-transparent border-none outline-none ml-sm w-full text-body-base" placeholder="Cerca per nom, client o codi..." type="text"/>
</div>
</div>
<div className="flex-1 overflow-y-auto p-md space-y-lg custom-scrollbar">
{/* Client Tree */}
<section>
<div className="flex items-center gap-sm mb-sm text-primary">
<span className="material-symbols-outlined text-[20px]">person_pin_circle</span>
<span className="font-label-caps text-label-caps tracking-widest">PER CLIENT</span>
</div>
<div className="space-y-1">
<details className="group" open="">
<summary className="flex items-center justify-between p-sm hover:bg-surface-container-high rounded-lg cursor-pointer transition-colors list-none">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-outline group-open:rotate-90 transition-transform">chevron_right</span>
<span className="font-body-strong text-on-surface">Agro-Masies del Vallès</span>
</div>
<span className="text-data-tabular bg-surface-container-highest px-2 py-0.5 rounded-full">12</span>
</summary>
<div className="ml-xl mt-1 space-y-1 border-l border-outline-variant/50 pl-4">
<div className="p-sm text-body-base text-primary font-body-strong bg-primary-container/20 border-l-2 border-primary -ml-[18px] pl-[16px]">Finca Mas Oliveras - Reg</div>
<div className="p-sm text-body-base text-on-surface-variant hover:text-on-surface cursor-pointer">Sector B - Topografia</div>
<div className="p-sm text-body-base text-on-surface-variant hover:text-on-surface cursor-pointer">Xarxa Elèctrica Nord</div>
</div>
</details>
<details className="group">
<summary className="flex items-center justify-between p-sm hover:bg-surface-container-high rounded-lg cursor-pointer transition-colors list-none">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-outline group-open:rotate-90 transition-transform">chevron_right</span>
<span className="font-body-strong text-on-surface">Sindicat de Regants Penedès</span>
</div>
<span className="text-data-tabular bg-surface-container-highest px-2 py-0.5 rounded-full">4</span>
</summary>
</details>
</div>
</section>
{/* Municipality Tree */}
<section>
<div className="flex items-center gap-sm mb-sm text-outline">
<span className="material-symbols-outlined text-[20px]">map</span>
<span className="font-label-caps text-label-caps tracking-widest">PER MUNICIPI</span>
</div>
<div className="space-y-1">
<div className="flex items-center justify-between p-sm hover:bg-surface-container-high rounded-lg cursor-pointer text-on-surface-variant transition-colors">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-outline">location_city</span>
<span className="font-body-base">Vilafranca del Penedès</span>
</div>
</div>
<div className="flex items-center justify-between p-sm hover:bg-surface-container-high rounded-lg cursor-pointer text-on-surface-variant transition-colors">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-outline">location_city</span>
<span className="font-body-base">Sant Cugat Sesgarrigues</span>
</div>
</div>
</div>
</section>
</div>
</div>
{/* Right Sidebar: Selected Plan View */}
<div className="flex-1 flex flex-col bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 relative overflow-hidden">
{/* Top Bar */}
<div className="p-md flex items-center justify-between border-b border-outline-variant/20">
<div className="flex flex-col">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-primary">description</span>
<h1 className="font-section-title text-section-title">Finca Mas Oliveras - Sistema de Reg Automàtic</h1>
</div>
<div className="flex items-center gap-md mt-xs">
<span className="text-data-tabular bg-secondary-container/20 text-on-secondary-container px-2 py-0.5 rounded font-body-strong">V4.2 FINAL</span>
<span className="text-data-tabular text-on-surface-variant">Última modificació: 12/05/2024 per Marc G.</span>
</div>
</div>
<div className="flex items-center gap-sm">
<button className="flex items-center gap-sm px-md py-sm bg-primary text-on-primary rounded-lg font-body-strong hover:bg-primary-container transition-all">
<span className="material-symbols-outlined">upload_file</span>
            Pujar nova versió
          </button>
<button className="p-sm text-outline hover:text-primary transition-colors">
<span className="material-symbols-outlined">share</span>
</button>
<button className="p-sm text-outline hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</div>
</div>
{/* Map & Controls */}
<div className="flex-1 relative bg-surface-dim">
{/* Mock Map Container */}
<div className="w-full h-full bg-cover bg-center" data-location="Mas Oliveras, Sant Cugat Sesgarrigues" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAdXlomZj8XIynlQL12xidLuomsRvwzhGLm0AKmfnZv4v-SvdeQRf5omiD5dUUWDCeo1u-7Q-aIbT0z87EBQ_dcOS6XTNcCEaGTb_RoDA0RG0eZxKA4GvGHQkEURSQ4E5I1FNGpoIEl3pIT8UxC0YsifpKvTumeICOFFVarTknFrcqUESwjZBsAOMA17hHBOXCha2AIe80EqqXusAC7vRBrr3GHDMm1iKTLdk09cc3oRls-3oQWxM37')` }}>
{/* Floating Overlay Controls */}
<div className="absolute top-md right-md flex flex-col gap-sm">
<div className="bg-surface/90 backdrop-blur-md p-md rounded-xl shadow-xl border border-outline-variant/30 w-64">
<div className="flex items-center justify-between mb-md">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Capes d'Informació</span>
<span className="material-symbols-outlined text-primary">layers</span>
</div>
<div className="space-y-md">
<div className="space-y-2">
<div className="flex justify-between items-center text-data-tabular">
<span>Opacitat Planimetria</span>
<span id="opacity-val">85%</span>
</div>
<input className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" oninput="document.getElementById('opacity-val').innerText = this.value + '%'" type="range" value="85"/>
</div>
<div className="flex items-center justify-between">
<span className="text-body-base text-on-surface">Vàlvules de tall</span>
<div className="w-8 h-4 bg-primary rounded-full relative"><div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></div></div>
</div>
<div className="flex items-center justify-between opacity-50">
<span className="text-body-base text-on-surface">Pressió (Isòbares)</span>
<div className="w-8 h-4 bg-outline rounded-full relative"><div className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full"></div></div>
</div>
</div>
</div>
{/* Version Timeline (Floating Sidebar style) */}
<div className="bg-surface/90 backdrop-blur-md p-md rounded-xl shadow-xl border border-outline-variant/30 w-64">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-md block">Historial de versions</span>
<div className="space-y-4">
<div className="relative pl-6 border-l-2 border-primary">
<div className="absolute -left-[7px] top-0 w-3 h-3 bg-primary rounded-full ring-4 ring-primary/20"></div>
<p className="text-body-strong text-primary">v4.0 - Actual</p>
<p className="text-data-tabular text-on-surface-variant">12 Mai, 2024</p>
</div>
<div className="relative pl-6 border-l-2 border-outline-variant">
<div className="absolute -left-[7px] top-0 w-3 h-3 bg-outline rounded-full"></div>
<p className="text-body-strong text-on-surface">v3.2 - Revisat</p>
<p className="text-data-tabular text-on-surface-variant">05 Abr, 2024</p>
</div>
<div className="relative pl-6 border-l-2 border-outline-variant">
<div className="absolute -left-[7px] top-0 w-3 h-3 bg-outline rounded-full"></div>
<p className="text-body-strong text-on-surface">v2.1 - Esborrany</p>
<p className="text-data-tabular text-on-surface-variant">20 Mar, 2024</p>
</div>
</div>
</div>
</div>
{/* Bottom Field Notes Panel (Drawer-like) */}
<div className="absolute bottom-md left-md right-md flex gap-md pointer-events-none">
<div className="pointer-events-auto bg-surface/90 backdrop-blur-md p-lg rounded-xl shadow-2xl border border-outline-variant/30 flex-1 max-w-4xl">
<div className="flex items-center justify-between mb-lg">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center">
<span className="material-symbols-outlined text-on-secondary-container">edit_note</span>
</div>
<div>
<h3 className="font-body-strong text-on-surface text-lg">Anotacions de Camp</h3>
<p className="text-data-tabular text-on-surface-variant">3 incidències obertes detectades in-situ</p>
</div>
</div>
<button className="text-primary font-body-strong hover:underline decoration-2 underline-offset-4">+ Afegir nota</button>
</div>
<div className="grid grid-cols-3 gap-md">
<div className="group bg-surface-container-lowest p-md rounded-lg shadow-sm hover:shadow-md transition-all border border-transparent hover:border-primary/20">
<div className="flex justify-between items-start mb-2">
<span className="text-[10px] font-label-caps bg-error/10 text-error px-1.5 py-0.5 rounded">URGENT</span>
<span className="text-data-tabular text-on-surface-variant">Ahir, 14:20</span>
</div>
<p className="text-body-base text-on-surface font-body-strong line-clamp-2">Pèrdua de pressió a la vàlvula sector B2. Possible fuga.</p>
<div className="mt-md flex -space-x-2">
<div className="w-8 h-8 rounded border-2 border-white bg-surface-dim overflow-hidden">
<img className="w-full h-full object-cover" data-alt="A high-resolution close-up macro photograph of a corroded copper water valve in a field, water dripping from a joint, cinematic lighting, sharp focus, technical agricultural detail" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvQH3J06P7Kx0D31X40Zc1-57cBeskqtNzr_0MCSpcfqr4fHs6M5xFxkqT9VUBFh-l_nF-D2NAiIuLG7ehccAK6aVSU3NSKeAmKZLuKIj_nFiqS6zt7L81Wpo28ZgPko5t9zxOHT7PZXQJmqUcXcaszyccGeT-fB6jmBdD7RyqGWr-KqIstc31huzlYQ7lxJOS8OgraffhC6BXpqeHP6A7QiHHYBwpV40hLJGWG8eBvXFu_12dwqD3"/>
</div>
</div>
</div>
<div className="group bg-surface-container-lowest p-md rounded-lg shadow-sm hover:shadow-md transition-all border border-transparent hover:border-primary/20">
<div className="flex justify-between items-start mb-2">
<span className="text-[10px] font-label-caps bg-primary/10 text-primary px-1.5 py-0.5 rounded">INFO</span>
<span className="text-data-tabular text-on-surface-variant">12 Mai, 09:15</span>
</div>
<p className="text-body-base text-on-surface font-body-strong line-clamp-2">Comprovació de cabalímetre OK. Lectura 450m3/h.</p>
<div className="mt-md flex items-center gap-xs text-on-surface-variant">
<span className="material-symbols-outlined text-[16px]">person</span>
<span className="text-data-tabular">Marc G.</span>
</div>
</div>
<div className="group bg-surface-container-lowest p-md rounded-lg shadow-sm hover:shadow-md transition-all border border-transparent hover:border-primary/20">
<div className="flex justify-between items-start mb-2">
<span className="text-[10px] font-label-caps bg-on-tertiary-container/10 text-on-tertiary-container px-1.5 py-0.5 rounded">OBRA</span>
<span className="text-data-tabular text-on-surface-variant">10 Mai, 17:00</span>
</div>
<p className="text-body-base text-on-surface font-body-strong line-clamp-2">Nou traçat tuberia PE-90 segons plànol modificat.</p>
<div className="mt-md flex -space-x-2">
<div className="w-8 h-8 rounded border-2 border-white bg-surface-dim overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Ground level wide shot of an open trench in a vineyard with black irrigation pipes being laid out, sunset warm glow, professional survey photography, rural Catalonia landscape" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6IKRXNDgOKQB9Yyqh9-m_LyevoFimLyIxBL3UENbPsLhcXGAzVpfnEA5xA7caxnafa6PI5jybfIdf63S8CQ0rXL_Fe54hwHVIU7ruoLfcLEbVq-zatAKPRyUfyN6q6J865vD7BvMBnxbKtfyZS-qmK0Jyf9lbApPPLLc0_cwgzROSv8m-m__tNKqAIzLKwUgIZk90_yuyOEE1tSj7qtethiVA-MlmDYgtxsk3cpwI2Yge9kqaGJjl"/>
</div>
<div className="w-8 h-8 rounded border-2 border-white bg-surface-dim overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Technical blueprint laid out on a dusty truck hood in a field, hand pointing at a specific junction, professional engineering workspace outdoors" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMInZaMSytuGjRAcS08K9C4j3bWgFW2PIziQlztwPbROhVQrnUtO8ighDhuRAfm3Vz9KNAeVbe9ajqUQug2ic6ANMUTMHDzExDE46SXjx3nyTA_VOKy9O0-bWUBm7c8blzaq4Gni9njZpVXaO7CZroe2ex8UF-uS-dy-UVBHmoRyP5kvLNQsZbdQyF9wjBtEynj8tt9ObpBAiRgbK1Nm_8zkVB0tkXrUI_a__6igZyNmZl9q4py5jn"/>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
{/* Toast Notification (Contextual) */}
<div className="fixed bottom-lg right-lg z-50 bg-inverse-surface text-inverse-on-surface px-xl py-md rounded-xl shadow-2xl flex items-center gap-md transform translate-y-20 transition-transform duration-300" id="status-toast">
<span className="material-symbols-outlined text-secondary-container">check_circle</span>
<div className="flex flex-col">
<span className="font-body-strong">Plànol carregat correctament</span>
<span className="text-data-tabular opacity-80">Sincronitzat amb el núvol (0.4s)</span>
</div>
<button className="ml-md hover:bg-white/10 p-1 rounded" onClick={() => { /* this.parentElement.classList.add('translate-y-20') */ }}>
<span className="material-symbols-outlined text-sm">close</span>
</button>
</div>
</div>

<style dangerouslySetInnerHTML={{__html: `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.1);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(0,0,0,0.2);
  }

  /* Custom input range styling to match Material 3 */
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #022448; /* primary */
    cursor: pointer;
    box-shadow: 0 0 2px rgba(0,0,0,0.1);
    margin-top: -6px;
  }
`}} /></main>
    </>
  );
}
