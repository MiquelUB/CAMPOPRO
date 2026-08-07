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
    if (!raw) {
      localStorage.setItem('campopro_proveidors', JSON.stringify(INITIAL_PROVEIDORS));
      return INITIAL_PROVEIDORS;
    }
    const parsed: SupplierItem[] = JSON.parse(raw);
    // Sanitize: Purge any corrupted suppliers named after document titles (Albarà 1, Albarà 2, Factura, etc.)
    const clean = parsed.filter(p => p.name && !/(?:albar[àa]|lliurament|factura|document|pdf|jpg|png|\.pdf)/i.test(p.name));
    if (clean.length !== parsed.length) {
      localStorage.setItem('campopro_proveidors', JSON.stringify(clean.length > 0 ? clean : INITIAL_PROVEIDORS));
    }
    return clean.length > 0 ? clean : INITIAL_PROVEIDORS;
  } catch (e) {
    return INITIAL_PROVEIDORS;
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
    if (!raw) {
      localStorage.setItem('campopro_materials', JSON.stringify(INITIAL_MATERIALS));
      return INITIAL_MATERIALS;
    }
    const parsed: MaterialItem[] = JSON.parse(raw);
    // Sanitize: Purge any corrupted materials named after documents or containing Albarà
    const clean = parsed.filter(m => 
      m.name && 
      !/(?:albar[àa]|lliurament|factura|document|material de subministrament)/i.test(m.name) && 
      !/(?:albar[àa]|lliurament|factura|document)/i.test(m.supplier)
    );
    if (clean.length !== parsed.length) {
      localStorage.setItem('campopro_materials', JSON.stringify(clean.length > 0 ? clean : INITIAL_MATERIALS));
    }
    return clean.length > 0 ? clean : INITIAL_MATERIALS;
  } catch (e) {
    return INITIAL_MATERIALS;
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
