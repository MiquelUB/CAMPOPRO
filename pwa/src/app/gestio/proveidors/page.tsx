'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SupplierItem } from '@/lib/sharedStore';
import { apiClient } from '@/lib/apiClient';

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TOTS');
  const [selectedSupplierModal, setSelectedSupplierModal] = useState<any | null>(null);
  const [suppliersDb, setSuppliersDb] = useState<SupplierItem[]>([]);

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const data = await apiClient.get('/proveidors');
        const mapped = data.map((s: any) => ({
          id: s.id,
          nif: s.nif || '',
          name: s.nom,
          category: s.categoria || 'Altres',
          contactPerson: s.contacte || '',
          phone: s.telefon || '',
          email: s.email || '',
          address: s.adreca || '',
          products: s.productes || '',
          discountValue: s.descompte || '0%',
          paymentMethod: s.forma_pagament || '',
          paymentTerms: s.condicions_pagament || '',
          iban: s.iban || '',
          totalBilledMonth: '0,00 €',
          totalBilledYear: '0,00 €',
          pendingPayment: '0,00 €',
          recentOrders: []
        }));
        setSuppliersDb(mapped);
      } catch (e) {
        console.error("Error loading suppliers", e);
      }
    };
    loadSuppliers();

    window.addEventListener('campopro_store_updated', loadSuppliers);
    return () => window.removeEventListener('campopro_store_updated', loadSuppliers);
  }, []);

  const filteredSuppliers = suppliersDb.filter(sup => {
    const contactText = sup.contactPerson || sup.contact || '';
    const categoryText = sup.category || sup.products || '';
    const matchesSearch = sup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sup.nif.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contactText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'TOTS' || categoryText.toUpperCase().includes(selectedCategory);
    return matchesSearch && matchesCat;
  });

  return (
    <main className="relative pt-6 px-4 md:px-xl pb-xl bg-surface min-h-screen">
      <div className="flex flex-col w-full gap-lg">
        
        {/* Header Title Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest">
                DIRECTORI & FIXES DE PROVEÏDORS
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg text-primary">
              Gestió de Proveïdors
            </h1>
            <p className="font-body-base text-on-surface-variant">
              Fixes completes dels proveïdors de fertilitzants, recanvis de maquinària, tuberies i subministraments agrícoles.
            </p>
          </div>

          <div className="flex items-center gap-sm">
            <button 
              onClick={() => alert("Obrint formulari d'alta de nou proveïdor...")}
              className="px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-body-strong flex items-center gap-2 shadow-sm hover:bg-primary-container transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_business</span>
              + Nou Proveïdor
            </button>
          </div>
        </section>

        {/* Top KPIs Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-md">
          <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border-l-4 border-primary flex items-center justify-between">
            <div>
              <span className="text-xs font-label-caps text-on-surface-variant">PROVEÏDORS ACTIUS</span>
              <p className="text-2xl font-display-lg text-primary mt-1">{suppliersDb.length} Empresa/s</p>
            </div>
            <span className="p-2 bg-primary/10 text-primary rounded-lg">
              <span className="material-symbols-outlined text-2xl">storefront</span>
            </span>
          </div>

          <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border-l-4 border-orange-500 flex items-center justify-between">
            <div>
              <span className="text-xs font-label-caps text-on-surface-variant">COMPRES MES EN CURS</span>
              <p className="text-2xl font-display-lg text-orange-700 mt-1">0,00 €</p>
            </div>
            <span className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            </span>
          </div>

          <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border-l-4 border-emerald-500 flex items-center justify-between">
            <div>
              <span className="text-xs font-label-caps text-on-surface-variant">COMPRES ACUMULADES 2026</span>
              <p className="text-2xl font-display-lg text-emerald-700 mt-1">0,00 €</p>
            </div>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <span className="material-symbols-outlined text-2xl">payments</span>
            </span>
          </div>
        </section>

        {/* Search & Filter Bar */}
        <section className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-md">
          <div className="relative w-full md:max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant">search</span>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cerca per nom, NIF o persona de contacte..."
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs font-body-base focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-xs overflow-x-auto w-full md:w-auto">
            {['TOTS', 'FERTILITZANTS', 'MAQUINÀRIA', 'REG'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-body-strong transition-colors whitespace-nowrap cursor-pointer ${selectedCategory === cat ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant hover:text-primary'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Suppliers Grid / Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {filteredSuppliers.map((sup) => (
            <div 
              key={sup.id}
              className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div className="flex flex-col gap-sm">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-0.5 bg-orange-50 text-orange-800 font-bold text-[11px] rounded-full">
                    {sup.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-on-surface-variant">{sup.nif}</span>
                </div>

                <h3 className="font-headline-md text-base text-primary group-hover:text-secondary transition-colors mt-1">
                  {sup.name}
                </h3>

                <div className="space-y-1 text-xs text-on-surface-variant mt-2 border-t border-outline-variant/20 pt-2">
                  <p className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">person</span>
                    <strong>Contacte:</strong> {sup.contactPerson}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">call</span>
                    {sup.phone}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                    {sup.address}
                  </p>
                </div>
              </div>

              <div className="mt-md pt-md border-t border-outline-variant/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Facturat Mes</span>
                  <span className="font-bold text-emerald-700 text-sm font-mono">{sup.totalBilledMonth}</span>
                </div>

                <button 
                  onClick={() => setSelectedSupplierModal(sup)}
                  className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-body-strong flex items-center gap-1 hover:bg-primary-container transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">visibility</span> Veure Fitxa
                </button>
              </div>
            </div>
          ))}
        </section>

      </div>

      {/* ========================================================================= */}
      {/* SUPPLIER PROFILE MODAL (FIXA DEL PROVEÏDOR) */}
      {/* ========================================================================= */}
      {selectedSupplierModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface rounded-2xl p-6 max-w-3xl w-full shadow-2xl border border-outline-variant flex flex-col gap-md max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-sm border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-orange-600 text-3xl">storefront</span>
                <div>
                  <h3 className="font-headline-md text-lg text-primary">
                    Fitxa del Proveïdor: {selectedSupplierModal.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant">NIF: <strong>{selectedSupplierModal.nif}</strong> • Categoria: <strong>{selectedSupplierModal.category}</strong></p>
                </div>
              </div>
              <button onClick={() => setSelectedSupplierModal(null)} className="text-on-surface-variant hover:text-primary p-1">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              
              {/* Commercial & Contact Details */}
              <div className="p-md bg-surface-container-low rounded-xl border border-outline-variant/20 flex flex-col gap-xs text-xs space-y-1">
                <h4 className="font-body-strong text-primary text-sm mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">contact_page</span> Dades de Contacte & Fiscal
                </h4>
                <p><strong>Persona de Contacte:</strong> {selectedSupplierModal.contactPerson}</p>
                <p><strong>Telèfon Directe:</strong> {selectedSupplierModal.phone}</p>
                <p><strong>Correu Facturació:</strong> {selectedSupplierModal.email}</p>
                <p><strong>Adreça Fiscal/Magatzem:</strong> {selectedSupplierModal.address}</p>
                <p><strong>Condicions de Pagament:</strong> <span className="font-bold text-orange-800">{selectedSupplierModal.paymentTerms}</span></p>
              </div>

              {/* Financial Balance & KPI */}
              <div className="p-md bg-surface-container-lowest rounded-xl border border-outline-variant/20 flex flex-col gap-xs shadow-xs text-xs">
                <h4 className="font-body-strong text-primary text-sm mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">account_balance</span> Resum Financer
                </h4>
                <div className="flex justify-between p-2 bg-surface rounded-lg">
                  <span>Facturat Aquest Mes:</span>
                  <span className="font-bold text-orange-700 font-mono">{selectedSupplierModal.totalBilledMonth}</span>
                </div>
                <div className="flex justify-between p-2 bg-surface rounded-lg">
                  <span>Acumulat Exercici 2026:</span>
                  <span className="font-bold text-emerald-700 font-mono">{selectedSupplierModal.totalBilledYear}</span>
                </div>
                <div className="flex justify-between p-2 bg-orange-50 rounded-lg border border-orange-200">
                  <span className="font-bold text-orange-950">Pendent de Pagament Actual:</span>
                  <span className="font-bold text-orange-800 font-mono">{selectedSupplierModal.pendingPayment}</span>
                </div>
              </div>

            </div>

            {/* Recent Orders / Invoices with Supplier */}
            <div className="p-md bg-surface-container-lowest rounded-xl border border-outline-variant/20 flex flex-col gap-sm mt-2">
              <h4 className="font-body-strong text-primary text-xs uppercase tracking-wider">
                Historial Recent de Comandes i Factures
              </h4>

              <div className="space-y-xs">
                {selectedSupplierModal.recentOrders.map((ord: any) => (
                  <div key={ord.id} className="p-sm bg-surface rounded-lg border border-outline-variant/10 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-primary">{ord.id} — {ord.concept}</p>
                      <p className="text-on-surface-variant text-[11px]">Data: {ord.date}</p>
                    </div>
                    <div className="flex items-center gap-md">
                      <span className="font-bold font-mono text-orange-800">{ord.amount}</span>
                      {ord.status === 'PAGAT' ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold text-[10px]">Pagat</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded font-bold text-[10px]">Pendent</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-xs border-t border-outline-variant/20">
              <button onClick={() => setSelectedSupplierModal(null)} className="px-md py-2 bg-primary text-white rounded-lg text-xs font-body-strong">
                Tancar Fitxa
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
