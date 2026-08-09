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
  supplierNif?: string;
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
  return [];
}

export function saveStoredProveidors(list: SupplierItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new Event('campopro_store_updated'));
  } catch (e) {
    console.error('Error saving proveidors', e);
  }
}

export function getStoredMaterials(): MaterialItem[] {
  return [];
}

export function saveStoredMaterials(list: MaterialItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new Event('campopro_store_updated'));
  } catch (e) {
    console.error('Error saving materials', e);
  }
}

export function clearUploadedDocumentsStore() {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new Event('campopro_store_updated'));
  } catch (e) {
    console.error('Error clearing store', e);
  }
}
