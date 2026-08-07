// Shared Store for Proveïdors & Materials with LocalStorage Persistence

export interface SupplierItem {
  id: string;
  nif: string;
  name: string;
  category?: string;
  contact?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  products?: string;
  discountValue?: string;
  paymentMethod?: string;
  paymentTerms?: string;
  iban?: string;
  totalSpentNumeric?: number;
  totalSpent?: string;
  totalBilledMonth?: string;
  totalBilledYear?: string;
  pendingPayment?: string;
  status?: string;
  documentsFolder?: string;
  digitizedDocs?: Array<{ id: string; docNumber: string; type: string; date: string; title: string; fileSize?: string; url?: string }>;
  supplierHistory?: Array<{ id: string; date: string; docNumber: string; docType: string; concept: string; qty: string; amount: string; buyer: string }>;
  recentOrders?: Array<{ id: string; date: string; concept: string; amount: string; status: string }>;
}

export interface MaterialItem {
  id: string;
  code: string;
  supplierSku?: string; // Codi / Referència de l'article al proveïdor (per comandes)
  name: string;
  stockTotal: number;
  stockCheckedOut: number;
  stock: number;
  minStock: number;
  unit: string;
  location: string; // Ubicació magatzem
  supplier: string;
  unitPrice: number; // Default price
  purchasePrice?: number; // Preu de compra
  marginPercent?: number; // % Marge de benefici sobre preu de compra
  salePrice?: number; // Preu de venda (Calculat: purchasePrice * (1 + marginPercent/100))
  supplierDiscount?: string | number; // Descompte proveïdor (%)
  vatRate?: number; // Valor IVA (%)
  accumulatedExpense?: number; // Historial acumulatiu del gasto (€)
  isService: boolean;
  lastPurchaseDate: string;
  workerMovementHistory: any[];
  purchaseHistory: any[];
}

export const INITIAL_PROVEIDORS: SupplierItem[] = [];

export const INITIAL_MATERIALS: MaterialItem[] = [];

export function getStoredProveidors(): SupplierItem[] {
  if (typeof window === 'undefined') return INITIAL_PROVEIDORS;
  try {
    const raw = localStorage.getItem('campopro_proveidors');
    if (!raw) return [];
    const parsed: SupplierItem[] = JSON.parse(raw);
    const clean = parsed.filter(p => p.name && !/(?:albar[àa]|lliurament|factura|document|pdf|jpg|png|\.pdf)/i.test(p.name));
    return clean;
  } catch (e) {
    return [];
  }
}

export function saveStoredProveidors(list: SupplierItem[]) {
  if (typeof window === 'undefined') return;
  try {
    const clean = list.filter(p => p.name && !/(?:albar[àa]|lliurament|factura|document|pdf|jpg|png|\.pdf)/i.test(p.name));
    localStorage.setItem('campopro_proveidors', JSON.stringify(clean));
    window.dispatchEvent(new Event('campopro_store_updated'));
  } catch (e) {
    console.error('Error saving proveidors', e);
  }
}

export function getStoredMaterials(): MaterialItem[] {
  if (typeof window === 'undefined') return INITIAL_MATERIALS;
  try {
    const raw = localStorage.getItem('campopro_materials');
    if (!raw) return [];
    const parsed: MaterialItem[] = JSON.parse(raw);
    const clean = parsed.filter(m => 
      m.name && 
      !/(?:albar[àa]|lliurament|factura|document|material de subministrament)/i.test(m.name) && 
      !/(?:albar[àa]|lliurament|factura|document)/i.test(m.supplier)
    );
    return clean;
  } catch (e) {
    return [];
  }
}

export function saveStoredMaterials(list: MaterialItem[]) {
  if (typeof window === 'undefined') return;
  try {
    const clean = list.filter(m => 
      m.name && 
      !/(?:albar[àa]|lliurament|factura|document|material de subministrament)/i.test(m.name) && 
      !/(?:albar[àa]|lliurament|factura|document)/i.test(m.supplier)
    );
    localStorage.setItem('campopro_materials', JSON.stringify(clean));
    window.dispatchEvent(new Event('campopro_store_updated'));
  } catch (e) {
    console.error('Error saving materials', e);
  }
}

export function clearUploadedDocumentsStore() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('campopro_proveidors');
    localStorage.removeItem('campopro_materials');
    localStorage.setItem('campopro_proveidors', JSON.stringify(INITIAL_PROVEIDORS));
    localStorage.setItem('campopro_materials', JSON.stringify(INITIAL_MATERIALS));
    window.dispatchEvent(new Event('campopro_store_updated'));
  } catch (e) {
    console.error('Error clearing store', e);
  }
}
