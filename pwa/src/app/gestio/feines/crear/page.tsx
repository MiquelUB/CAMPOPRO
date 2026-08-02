'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function CreateJobForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const clientIdParam = searchParams.get('clientId') || searchParams.get('client') || '1';

  // Client Mock Data Database
  const clientsDb: Record<string, { name: string; nif: string; phone: string; contact: string; address: string; lat: number; lng: number }> = {
    '1': { name: 'Agro Riera SL', nif: 'B12345678', phone: '600111222', contact: 'Miquel Riera', address: 'Camí Ral s/n, 08240 Manresa', lat: 41.6521, lng: 1.8322 },
    '2': { name: 'Finca Valles', nif: 'A87654321', phone: '600333444', contact: 'Anna Valles', address: 'Av. les Valls 45, Granollers', lat: 41.5233, lng: 2.1121 },
    '3': { name: 'Horta del Llobregat', nif: 'B99887766', phone: '600555666', contact: 'Joan Llobregat', address: 'Partida Nord 12, Sant Boi', lat: 41.3411, lng: 2.0511 },
  };

  const selectedClient = clientsDb[clientIdParam] || clientsDb['1'];

  // Form States
  const [selectedClientId, setSelectedClientId] = useState(clientIdParam);
  const [priority, setPriority] = useState<'URGENT' | 'NORMAL' | 'BAIXA'>('NORMAL');
  const [description, setDescription] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('4');
  const [hasBlueprint, setHasBlueprint] = useState(false);
  const [blueprintName, setBlueprintName] = useState('');
  
  // Materials and Tools Pills
  const [materials, setMaterials] = useState<Array<{ id: string; name: string; qty: string }>>([
    { id: '1', name: 'Tub PE 25mm', qty: '6m' },
    { id: '2', name: 'Vàlvula Esfera 1"', qty: '1u' },
  ]);
  const [newMaterial, setNewMaterial] = useState('');
  const [newMaterialQty, setNewMaterialQty] = useState('');

  const [tools, setTools] = useState<string[]>([
    'Trepant Bosch GSR-18',
    'Radial Makita 125mm',
    'Joc de Claus Stillson',
  ]);
  const [newTool, setNewTool] = useState('');

  const [isAiLoading, setIsAiLoading] = useState(false);

  // Handle Client Switch
  const handleClientSelect = (id: string) => {
    setSelectedClientId(id);
  };

  const activeClient = clientsDb[selectedClientId] || selectedClient;

  // IA Assistance Generation
  const handleGenerateAi = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setDescription(
        `Substitució i reparació d'escomesa principal d'aigua a la finca ${activeClient.name}. Cal verificar pressió de xarxa, sanejar la canonada malmesa de PE 25mm i instal·lar vàlvula de tall reforçada. Fer fotos abans i després.`
      );
      setEstimatedHours('5');
      setMaterials([
        { id: '1', name: 'Tub PE 25mm High-Density', qty: '10m' },
        { id: '2', name: 'Vàlvula Esfera 1" Inox', qty: '2u' },
        { id: '3', name: 'Cinta de Teflon Professional', qty: '1u' },
      ]);
      setTools([
        'Trepant Bosch GSR-18',
        'Radial Makita 125mm',
        'Joc de Claus Stillson',
        'Detector de Metalls i Cables',
      ]);
      setIsAiLoading(false);
    }, 900);
  };

  const handleAddMaterial = () => {
    if (newMaterial.trim()) {
      setMaterials([...materials, { id: `${Date.now()}`, name: newMaterial.trim(), qty: newMaterialQty.trim() || '1u' }]);
      setNewMaterial('');
      setNewMaterialQty('');
    }
  };

  const handleAddTool = () => {
    if (newTool.trim()) {
      setTools([...tools, newTool.trim()]);
      setNewTool('');
    }
  };

  const handleSaveOrder = () => {
    alert(`Ordre de Treball creada amb èxit per al client ${activeClient.name}!`);
    router.push(`/gestio/clients/${selectedClientId}`);
  };

  return (
    <main className="relative pt-32 p-xl bg-surface min-h-screen">
      <nav className="mb-lg flex items-center text-xs text-on-surface-variant gap-xs">
        <span className="material-symbols-outlined text-[14px]">home</span>
        <span>/</span>
        <Link href="/gestio" className="hover:text-primary cursor-pointer">Dashboard</Link>
        <span>/</span>
        <Link href="/gestio/clients" className="hover:text-primary cursor-pointer">Clients</Link>
        <span>/</span>
        <span className="text-primary font-body-strong">Redacció de Feina (#{activeClient.name})</span>
      </nav>

      <div className="flex flex-col w-full gap-xl max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md bg-surface-container-lowest p-xl rounded-2xl shadow-sm border border-outline-variant/30">
          <div>
            <div className="flex items-center gap-sm mb-1">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
              <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest">
                Redacció Vinculada al Client
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg text-primary">
              Nova Ordre de Treball
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Tots els registres, materials, eines i hores quedaran arxivats directament a l'historial del client.
            </p>
          </div>

          {/* AI Assistance Trigger Button */}
          <button
            onClick={handleGenerateAi}
            disabled={isAiLoading}
            className="px-6 py-3.5 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-body-strong shadow-lg hover:shadow-xl transition-all flex items-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-secondary-container">psychology</span>
            {isAiLoading ? 'La IA està redactant...' : '🤖 Asistent Redacció IA'}
          </button>
        </div>

        {/* Main Grid Form */}
        <div className="grid grid-cols-12 gap-xl">
          {/* Left Column: Client & Main Form */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-lg">
            
            {/* Card 1: Client Information (Pre-filled automatically) */}
            <div className="p-xl bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-md">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-md">
                <h2 className="font-section-title text-primary flex items-center gap-2 text-lg">
                  <span className="material-symbols-outlined text-primary">business</span>
                  Dades del Client (Pre-emplenades)
                </h2>
                <span className="text-xs bg-primary/10 text-primary font-bold px-3 py-1 rounded-full">
                  ID #{selectedClientId}
                </span>
              </div>

              {/* Client Selector Dropdown */}
              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-xs text-on-surface-variant">SELECCIONAR CLIENT</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => handleClientSelect(e.target.value)}
                  className="w-full bg-surface-container-low p-3.5 rounded-xl border border-outline-variant font-body-strong text-primary outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  {Object.entries(clientsDb).map(([id, c]) => (
                    <option key={id} value={id}>
                      {c.name} — {c.nif} ({c.contact})
                    </option>
                  ))}
                </select>
              </div>

              {/* Client Details Summary Grid */}
              <div className="grid grid-cols-2 gap-md bg-surface-container-low p-md rounded-xl border border-outline-variant/20 text-sm">
                <div>
                  <span className="text-xs text-on-surface-variant block font-label-caps">NOM FISCAL</span>
                  <span className="font-body-strong text-primary">{activeClient.name}</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block font-label-caps">NIF / CIF</span>
                  <span className="font-body-strong text-primary">{activeClient.nif}</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block font-label-caps">CONTACTE PRINCIPAL</span>
                  <span className="font-body-strong text-primary">{activeClient.contact} ({activeClient.phone})</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block font-label-caps">ADREÇA FINCA</span>
                  <span className="font-body-strong text-primary">{activeClient.address}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Job Description & Priorities */}
            <div className="p-xl bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-md">
              <div className="flex justify-between items-center">
                <h2 className="font-section-title text-primary flex items-center gap-2 text-lg">
                  <span className="material-symbols-outlined text-primary">description</span>
                  Descripció de la Feina
                </h2>

                {/* Priority Selector */}
                <div className="flex gap-xs">
                  <button 
                    type="button"
                    onClick={() => setPriority('URGENT')} 
                    className={`px-3 py-1 rounded-full font-label-caps text-xs transition-all ${priority === 'URGENT' ? 'bg-error text-white font-bold scale-105' : 'bg-error-container text-error'}`}
                  >
                    URGENT
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPriority('NORMAL')} 
                    className={`px-3 py-1 rounded-full font-label-caps text-xs transition-all ${priority === 'NORMAL' ? 'bg-secondary-container text-white font-bold scale-105' : 'bg-secondary-container/20 text-secondary border'}`}
                  >
                    NORMAL
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPriority('BAIXA')} 
                    className={`px-3 py-1 rounded-full font-label-caps text-xs transition-all ${priority === 'BAIXA' ? 'bg-outline text-white font-bold scale-105' : 'bg-surface-container text-on-surface-variant'}`}
                  >
                    BAIXA
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-caps text-xs text-on-surface-variant">DESCRIPCIÓ DETALLADA DE LA TASCA</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Escriu la descripció del treball a realitzar per l'operari, o prem '🤖 Asistent Redacció IA'..."
                  className="w-full bg-surface-container-low p-4 rounded-xl border border-outline-variant font-body-base outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                ></textarea>
              </div>

              {/* Estimated Hours */}
              <div className="flex flex-col gap-xs w-1/2">
                <label className="font-label-caps text-xs text-on-surface-variant">ESTIMACIÓ HORES DE TREBALL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value)}
                    className="w-full bg-surface-container-low p-3.5 rounded-xl border border-outline-variant font-body-strong text-primary text-center text-lg outline-none"
                  />
                  <span className="font-body-strong text-on-surface-variant">Hores</span>
                </div>
              </div>
            </div>

            {/* Card 3: Materials & Tools Assignment */}
            <div className="p-xl bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-lg">
              {/* Materials Section */}
              <div className="flex flex-col gap-md">
                <h3 className="font-headline-md text-primary flex items-center gap-2 text-md">
                  <span className="material-symbols-outlined text-primary">inventory_2</span>
                  Materials Necessaris Assignats
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {materials.map((mat) => (
                    <span key={mat.id} className="bg-primary-container/20 text-primary border border-primary/20 px-3 py-1.5 rounded-xl font-body-strong text-sm flex items-center gap-2">
                      {mat.name} ({mat.qty})
                      <button 
                        onClick={() => setMaterials(materials.filter((m) => m.id !== mat.id))}
                        className="hover:text-error transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nom del material (ex: Tub PE 25mm)..."
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    className="flex-1 bg-surface-container-low p-3 rounded-xl border border-outline-variant text-sm outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Qty (ex: 5m)..."
                    value={newMaterialQty}
                    onChange={(e) => setNewMaterialQty(e.target.value)}
                    className="w-24 bg-surface-container-low p-3 rounded-xl border border-outline-variant text-sm outline-none text-center"
                  />
                  <button 
                    type="button"
                    onClick={handleAddMaterial}
                    className="px-4 py-3 bg-primary text-white rounded-xl text-sm font-body-strong"
                  >
                    + Afegir
                  </button>
                </div>
              </div>

              <div className="h-px bg-outline-variant/30"></div>

              {/* Tools Section */}
              <div className="flex flex-col gap-md">
                <h3 className="font-headline-md text-primary flex items-center gap-2 text-md">
                  <span className="material-symbols-outlined text-primary">handyman</span>
                  Eines Necessàries Assignades
                </h3>

                <div className="flex flex-wrap gap-2">
                  {tools.map((t, idx) => (
                    <span key={idx} className="bg-secondary-container/20 text-secondary border border-secondary-container/30 px-3 py-1.5 rounded-xl font-body-strong text-sm flex items-center gap-2">
                      {t}
                      <button 
                        onClick={() => setTools(tools.filter((_, i) => i !== idx))}
                        className="hover:text-error transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nom de l'eina (ex: Radial Makita)..."
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    className="flex-1 bg-surface-container-low p-3 rounded-xl border border-outline-variant text-sm outline-none"
                  />
                  <button 
                    type="button"
                    onClick={handleAddTool}
                    className="px-4 py-3 bg-secondary-container text-on-secondary-container rounded-xl text-sm font-body-strong"
                  >
                    + Afegir Eina
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Blueprints & Location Map */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-lg">
            
            {/* Card 4: Blueprint Attachment */}
            <div className="p-xl bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-md">
              <h2 className="font-section-title text-primary flex items-center gap-2 text-lg">
                <span className="material-symbols-outlined text-primary">architecture</span>
                Plànol Tècnic Adjunt (Opcional)
              </h2>

              {!hasBlueprint ? (
                <button
                  type="button"
                  onClick={() => {
                    setHasBlueprint(true);
                    setBlueprintName('PLAN_FINCA_MANRESA_REV3.pdf');
                  }}
                  className="p-6 border-2 border-dashed border-outline-variant rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low transition-colors text-primary"
                >
                  <span className="material-symbols-outlined text-4xl">upload_file</span>
                  <span className="font-body-strong text-sm">Seleccionar o Carregar Plànol (PDF/Imatge)</span>
                  <span className="text-xs text-on-surface-variant">Accepta arxius de la biblioteca o des del disc</span>
                </button>
              ) : (
                <div className="p-4 bg-primary-container/10 border border-primary/20 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">picture_as_pdf</span>
                    <div className="flex flex-col">
                      <span className="font-body-strong text-sm text-primary">{blueprintName}</span>
                      <span className="text-xs text-on-surface-variant">Plànol carregat a la feina</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setHasBlueprint(false)} 
                    className="p-1 text-error hover:bg-error/10 rounded-full"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              )}
            </div>

            {/* Card 5: Map Location */}
            <div className="p-xl bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-md">
              <h2 className="font-section-title text-primary flex items-center gap-2 text-lg">
                <span className="material-symbols-outlined text-primary">location_on</span>
                Ubicació GPS de la Feina
              </h2>
              
              <div className="relative h-[260px] rounded-xl overflow-hidden shadow-md border border-outline-variant/30">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCvbJjUps0q9YpuQkGaY5sRz2m_ti7khbFlM6-CHmI8ykOmRLmMra7akOY7vF9x65dHzRdZQqeacIz_LPhVHInJ6E5g_v9awm4ReTUw-3hPNQx830GX3GzrxqwDyK6kSXn8aKLHSmKwRXY8OuBTccG5OdGUf_k9PET1PNq96ySs7M2WQDY9UzJh9kW2ZeGatQwHH-6Msl2sF7P22CxWNJs7BHja5JGG0qkVly74n-qHHixvQx472LXu')` }}></div>
                <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-body-strong text-primary shadow">
                  Coordenades: {activeClient.lat}° N, {activeClient.lng}° E
                </div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                Les coordenades estan geolocalitzades segons l'adreça oficial de la finca del client.
              </p>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-xl pt-lg border-t border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest p-xl rounded-2xl shadow-lg">
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="px-6 py-3.5 text-on-surface-variant font-body-strong hover:text-primary transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Cancel·lar
          </button>

          <button 
            type="button"
            onClick={handleSaveOrder} 
            className="px-10 py-4 bg-secondary-container text-on-secondary-container font-headline-md rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-wider"
          >
            <span className="material-symbols-outlined">check_circle</span>
            Guardar Ordre de Treball
          </button>
        </div>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="p-xl pt-32 text-center text-primary font-body-strong">
        Carregant formulari de redacció...
      </div>
    }>
      <CreateJobForm />
    </Suspense>
  );
}
