"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Wrench, 
  Truck, 
  HardHat, 
  Map as MapIcon, 
  Settings,
  Search,
  HelpCircle,
  Bell
} from "lucide-react";

export default function GestioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Si som a la pàgina de login, no mostrem el layout
  if (pathname === "/gestio/login") {
    return <>{children}</>;
  }

  const navItems = [
    { href: "/gestio", label: "Dashboard", icon: LayoutDashboard },
    { href: "/gestio/clients", label: "Clients", icon: Users },
    { href: "/gestio/magatzem", label: "Magatzem", icon: Package },
    { href: "/gestio/eines", label: "Eines", icon: Wrench },
    { href: "/gestio/flota", label: "Vehicles", icon: Truck },
    { href: "/gestio/operaris", label: "Operaris", icon: HardHat },
    { href: "/gestio/planols", label: "Plànols", icon: MapIcon },
    { href: "/gestio/configuracio", label: "Configuració", icon: Settings },
  ];

  const isFeinaTab = pathname.includes("/feines") || pathname === "/gestio";
  const isResultatsTab = pathname.includes("/completades") || pathname.includes("/resultats");

  return (
    <div className="bg-surface font-sans text-on-surface min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-[240px] bg-primary text-on-primary z-50 flex flex-col transition-all duration-200 shadow-xl">
        <div className="p-4 flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-secondary-container rounded-lg flex items-center justify-center text-primary font-bold">CP</div>
          <span className="font-extrabold text-xl text-white tracking-tight">CampoPro</span>
        </div>
        
        <nav className="flex-1 flex flex-col gap-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/gestio" && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors gap-3 ${
                  isActive 
                    ? "bg-primary-container text-white border-l-4 border-secondary-container rounded-l-sm" 
                    : "text-on-primary-container hover:bg-primary-container"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium text-[14px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto p-4 border-t border-primary-container flex items-center gap-3">
          <img 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover border border-outline-variant" 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          />
          <div className="flex flex-col">
            <span className="font-medium text-white text-[14px]">Marc</span>
            <span className="text-[12px] text-on-primary-container">Enginyer</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-[240px]">
        {/* Header */}
        <header className="fixed top-0 left-[240px] right-0 h-32 bg-surface/80 backdrop-blur-md z-40 flex flex-col shadow-sm border-b border-surface-variant">
          
          <div className="h-16 px-8 flex items-center justify-between border-b border-surface-container-highest">
            <div className="flex items-center bg-surface-container-low px-4 py-2 rounded-lg w-96 border border-outline-variant focus-within:border-primary transition-colors">
              <Search size={18} className="text-outline" />
              <input 
                className="bg-transparent border-none outline-none ml-2 w-full text-sm font-medium" 
                placeholder="Cerca global..." 
                type="text"
              />
            </div>
            <div className="flex items-center gap-4 text-on-surface-variant">
              <button className="hover:text-primary transition-colors"><HelpCircle size={22} /></button>
              <button className="relative hover:text-primary transition-colors">
                <Bell size={22} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
              </button>
            </div>
          </div>
          
          <div className="h-16 px-8 flex items-center justify-start">
            <nav className="flex h-full gap-8">
              <Link 
                href="/gestio"
                className={`flex items-center h-full px-2 font-bold text-[11px] tracking-wider transition-all ${
                  isFeinaTab 
                    ? "text-secondary-container border-b-2 border-secondary-container" 
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                FEINA
              </Link>
              <Link 
                href="/gestio/feines/completades"
                className={`flex items-center h-full px-2 font-bold text-[11px] tracking-wider transition-all ${
                  isResultatsTab 
                    ? "text-secondary-container border-b-2 border-secondary-container" 
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                RESULTATS
              </Link>
            </nav>
          </div>
        </header>

        {/* Page Content */}
        <main className="relative pt-32 min-h-screen bg-surface">
          {children}
        </main>
      </div>
    </div>
  );
}
