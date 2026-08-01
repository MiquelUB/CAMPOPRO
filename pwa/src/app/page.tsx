import Link from "next/link";
import { Sprout, HardHat, ShieldUser } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-green-700 tracking-tight mb-4 flex items-center justify-center gap-3">
          <Sprout className="w-12 h-12" />
          CampoPro
        </h1>
        <p className="text-slate-600 text-lg max-w-lg mx-auto">
          Sistema integral de gestió agrícola. Selecciona el teu portal d'accés per continuar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Portal Enginyer / Gestió */}
        <Link href="/gestio/login" className="group relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all hover:-translate-y-1">
          <div className="h-2 bg-green-600 w-full absolute top-0 left-0"></div>
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sprout className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Enginyer / Gestió</h2>
            <p className="text-slate-500 text-sm">
              Accés a CRM, planificació de feines, gestió d'stock, mapes interactius i administració de flota.
            </p>
            <div className="mt-6 text-green-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Entrar al portal &rarr;
            </div>
          </div>
        </Link>

        {/* Portal Operari */}
        <Link href="/operari/login" className="group relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all hover:-translate-y-1">
          <div className="h-2 bg-amber-500 w-full absolute top-0 left-0"></div>
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <HardHat className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Operari de Camp</h2>
            <p className="text-slate-500 text-sm">
              App dissenyada per a ús al camp: lectura de feines offline, pujada de fotos OCR i rutes GPS.
            </p>
            <div className="mt-6 text-amber-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Entrar al portal &rarr;
            </div>
          </div>
        </Link>

        {/* Portal SuperAdmin */}
        <Link href="/superadmin/login" className="group relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all hover:-translate-y-1">
          <div className="h-2 bg-slate-800 w-full absolute top-0 left-0"></div>
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldUser className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">SuperAdmin</h2>
            <p className="text-slate-500 text-sm">
              Accés exclusiu per als desenvolupadors: gestió Multi-Tenant, facturació i monitorització.
            </p>
            <div className="mt-6 text-slate-700 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Entrar al portal &rarr;
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
