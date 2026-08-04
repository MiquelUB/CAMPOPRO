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
  salePrice?: number; // Preu de venda
  supplierDiscount?: string | number; // Descompte proveïdor (%)
  vatRate?: number; // Valor IVA (%)
  accumulatedExpense?: number; // Historial acumulatiu del gasto (€)
  isService: boolean;
  lastPurchaseDate: string;
  workerMovementHistory: any[];
  purchaseHistory: any[];
}

export const INITIAL_PROVEIDORS: SupplierItem[] = [
  {
    id: 'p-jardins-verds',
    nif: 'B-12345678',
    name: 'Jardins Verds S.L.',
    category: 'Jardineria & Subministraments',
    contact: 'Departament de Lliuraments',
    contactPerson: 'Manel Soler (Atenció Comercial)',
    phone: '93 123 45 67',
    email: 'info@jardinsverds.cat',
    address: 'Carrer de la Natura, 15, 08001 Barcelona',
    products: 'Terra vegetal, Plantes arbustives i Mà d\'obra de poda',
    discountValue: '10%',
    paymentMethod: 'Transferència a 30 dies',
    paymentTerms: 'Transferència a 30 dies',
    iban: 'ES91 2100 0412 88 1234567890',
    totalSpentNumeric: 615.00,
    totalSpent: '615,00 €',
    totalBilledMonth: '615,00 €',
    totalBilledYear: '615,00 €',
    pendingPayment: '615,00 €',
    status: 'ACTIU',
    documentsFolder: '/documents/magatzem/proveidors/B-12345678/',
    digitizedDocs: [
      { id: 'doc-jv-1', docNumber: 'ALB-2026-001', type: 'ALBARÀ DE LLIURAMENT', date: '04/08/2026', title: 'Albarà de Lliurament #ALB-2026-001 (Jardins Verds S.L.)', fileSize: '1.4 MB', url: '/documents/ALB-2026-001.pdf' }
    ],
    supplierHistory: [
      { id: 'sp-jv-1', date: '04/08/2026', docNumber: 'ALB-2026-001', docType: 'ALBARÀ', concept: '50 Sacs terra vegetal + 10 Lavandula + 2h Poda', qty: '3 articles', amount: '615,00 €', buyer: 'IA Auto-Scan' }
    ],
    recentOrders: [
      { id: 'ALB-2026-001', date: '04/08/2026', concept: 'Sacs de terra vegetal 50L + Lavandula + Hores Poda', amount: '615,00 €', status: 'PENDENT_PAGAMENT' }
    ]
  },
  {
    id: 'p1',
    nif: 'B25889911',
    name: 'AgroSubministres Ponent SL',
    category: 'Reg & Canonades PE',
    contact: 'Albert Pons',
    contactPerson: 'Albert Pons (Vendes)',
    phone: '973 11 22 33',
    email: 'ventes@agrosubministres.cat',
    address: 'Polígon Industrial El Segre, Nau 14, Lleida',
    products: 'Tubs, Canonades, Reg',
    discountValue: '15%',
    paymentMethod: 'Transferència a 30 dies',
    paymentTerms: 'Transferència a 30 dies',
    iban: 'ES88 2100 0011 22 3344556677',
    totalSpentNumeric: 1450.00,
    totalSpent: '1.450,00 €',
    totalBilledMonth: '490,00 €',
    totalBilledYear: '1.450,00 €',
    pendingPayment: '0,00 €',
    status: 'ACTIU',
    documentsFolder: '/documents/magatzem/proveidors/B25889911/',
    digitizedDocs: [
      { id: 'doc1', docNumber: 'ALB-2026-8812', type: 'ALBARÀ', date: '12/04/2026', title: 'Albarà de Lliurament 100m Tub PE 25mm', fileSize: '1.2 MB', url: '/documents/ALB-2026-8812.pdf' },
      { id: 'doc2', docNumber: 'FAC-2026-9901', type: 'FACTURA', date: '30/04/2026', title: 'Factura Comercial Abril 2026', fileSize: '2.4 MB', url: '/documents/FAC-2026-9901.pdf' }
    ],
    supplierHistory: [
      { id: 'sp1', date: '12/04/2026', docNumber: 'ALB-2026-8812', docType: 'ALBARÀ', concept: 'Tub PE 25mm High-Density (100m)', qty: '100m', amount: '450,00 €', buyer: 'Marc (Enginyer)' },
      { id: 'sp2', date: '30/04/2026', docNumber: 'FAC-2026-9901', docType: 'FACTURA', concept: 'Factura Comercial Abril 2026 (Tub PE 25mm)', qty: '100m', amount: '490,00 €', buyer: 'Marc (Enginyer)' }
    ],
    recentOrders: [
      { id: 'ALB-2026-8812', date: '12/04/2026', concept: '100m Tub PE 25mm High-Density', amount: '450,00 €', status: 'PAGAT' }
    ]
  },
  {
    id: 'sup-1',
    nif: 'A25112233',
    name: 'Suministros Agrícolas del Segre SA',
    category: 'Fertilitzants i Fitosanitaris',
    contact: 'Joan Martorell',
    contactPerson: 'Joan Martorell (Director Comercial)',
    phone: '973 400 111 / 600 555 444',
    email: 'facturacio@segresuministros.com',
    address: 'Polígon Industrial El Segre, Parcel·la 14, Lleida',
    products: 'Fertilitzants i Fitosanitaris',
    discountValue: '12%',
    paymentMethod: 'Transferència a 30 dies',
    paymentTerms: 'Transferència a 30 dies',
    iban: 'ES12 2100 9988 77 6655443322',
    totalSpentNumeric: 8400.00,
    totalSpent: '8.400,00 €',
    totalBilledMonth: '544,50 €',
    totalBilledYear: '8.400,00 €',
    pendingPayment: '544,50 €',
    status: 'ACTIU',
    documentsFolder: '/documents/magatzem/proveidors/A25112233/',
    digitizedDocs: [],
    supplierHistory: [],
    recentOrders: [
      { id: 'ORD-991', date: '01/08/2026', concept: '10 Sacs Fertilitzant N-12 + Fitonutrients', amount: '544,50 €', status: 'PENDENT_PAGAMENT' },
      { id: 'ORD-940', date: '15/07/2026', concept: '20 Sacs Nitrat d\'Amoni 27%', amount: '1.120,00 €', status: 'PAGAT' }
    ]
  },
  {
    id: 'sup-2',
    nif: 'B25987654',
    name: 'Tractores i Recanvis Ponent',
    category: 'Maquinària & Recanvis',
    contact: 'Sergi Barberà',
    contactPerson: 'Sergi Barberà (Cap de Recanvis)',
    phone: '973 500 222 / 610 333 222',
    email: 'recanvis@tractorsponent.cat',
    address: 'Av. de les Garrigues 88, Mollerussa',
    products: 'Maquinària i Recanvis',
    discountValue: '10%',
    paymentMethod: 'Domiciliació Bancària (Dia 10)',
    paymentTerms: 'Domiciliació Bancària (Dia 10)',
    iban: 'ES44 2100 5544 33 2211009988',
    totalSpentNumeric: 4200.00,
    totalSpent: '4.200,00 €',
    totalBilledMonth: '254,10 €',
    totalBilledYear: '4.200,00 €',
    pendingPayment: '0,00 €',
    status: 'ACTIU',
    documentsFolder: '/documents/magatzem/proveidors/B25987654/',
    digitizedDocs: [],
    supplierHistory: [],
    recentOrders: [
      { id: 'ORD-988', date: '28/07/2026', concept: 'Oli Sintètic 20L + Filtre Oli John Deere', amount: '254,10 €', status: 'PAGAT' }
    ]
  }
];

export const INITIAL_MATERIALS: MaterialItem[] = [
  { 
    id: 'm-ter-050', 
    code: 'MAT-TER-050', 
    name: 'Sacs de terra vegetal (50L)', 
    stockTotal: 50, 
    stockCheckedOut: 0, 
    stock: 50, 
    minStock: 10, 
    unit: 'sacs', 
    location: 'Palet B-2 (Magatzem Central)',
    supplier: 'Jardins Verds S.L.',
    unitPrice: 12.50,
    purchasePrice: 8.50,
    salePrice: 12.50,
    supplierDiscount: '10%',
    vatRate: 21,
    accumulatedExpense: 425.00,
    isService: false,
    lastPurchaseDate: '04/08/2026',
    workerMovementHistory: [],
    purchaseHistory: [
      { id: 'h-jv-1', date: '04/08/2026', qty: '50 sacs', price: '425,00 €', supplier: 'Jardins Verds S.L.', buyer: 'IA Auto-Scan' }
    ]
  },
  { 
    id: 'm-lav-001', 
    code: 'PLA-LAV-001', 
    name: 'Plantes arbustives (Lavandula)', 
    stockTotal: 10, 
    stockCheckedOut: 0, 
    stock: 10, 
    minStock: 5, 
    unit: 'u', 
    location: 'Viver Exterior / Sector Nord',
    supplier: 'Jardins Verds S.L.',
    unitPrice: 18.00,
    purchasePrice: 12.00,
    salePrice: 18.00,
    supplierDiscount: '10%',
    vatRate: 21,
    accumulatedExpense: 120.00,
    isService: false,
    lastPurchaseDate: '04/08/2026',
    workerMovementHistory: [],
    purchaseHistory: [
      { id: 'h-jv-2', date: '04/08/2026', qty: '10 u', price: '120,00 €', supplier: 'Jardins Verds S.L.', buyer: 'IA Auto-Scan' }
    ]
  },
  { 
    id: 's-pod-001', 
    code: 'SRV-POD-001', 
    name: 'Hores de mà d\'obra (Poda)', 
    stockTotal: 999, 
    stockCheckedOut: 0, 
    stock: 999, 
    minStock: 0, 
    unit: 'h', 
    location: 'Tarifa de Servei Tècnic',
    supplier: 'Jardins Verds S.L.',
    unitPrice: 50.00,
    purchasePrice: 35.00,
    salePrice: 50.00,
    supplierDiscount: '0%',
    vatRate: 21,
    accumulatedExpense: 70.00,
    isService: true,
    lastPurchaseDate: '04/08/2026',
    workerMovementHistory: [],
    purchaseHistory: []
  },
  { 
    id: 'm1', 
    code: 'MAT-001', 
    name: 'Tub PE 25mm High-Density', 
    stockTotal: 150, 
    stockCheckedOut: 30, 
    stock: 120, 
    minStock: 20, 
    unit: 'm', 
    location: 'Prestatgeria A-1 (Magatzem Central)',
    supplier: 'AgroSubministres Ponent SL',
    unitPrice: 7.20,
    purchasePrice: 4.50,
    salePrice: 7.20,
    supplierDiscount: '15%',
    vatRate: 21,
    accumulatedExpense: 450.00,
    isService: false,
    lastPurchaseDate: '12/04/2026',
    workerMovementHistory: [
      { id: 'wm1', date: '02/08/2026 07:30', worker: 'Jordi Soler', action: 'SUBTRACTION', qty: '30m', workOrderId: 'OT-402', expectedMaterialCode: 'MAT-001', isExpected: true, status: 'EN_US_JORNADA' },
      { id: 'wm2', date: '03/08/2026 08:15', worker: 'Pau Ribas', action: 'SUBTRACTION', qty: '15m', workOrderId: 'OT-109', expectedMaterialCode: 'MAT-004', isExpected: false, status: 'ALERTA_MATERIAL_NO_PREVIST' }
    ],
    purchaseHistory: [
      { id: 'h1', date: '12/04/2026', qty: '100m', price: '450,00 €', supplier: 'AgroSubministres Ponent SL', buyer: 'Marc (Enginyer)' }
    ]
  },
  { 
    id: 'm2', 
    code: 'MAT-002', 
    name: 'Vàlvula d\'Esfera 1" Inox', 
    stockTotal: 6,
    stockCheckedOut: 2,
    stock: 4, 
    minStock: 10, 
    unit: 'u', 
    location: 'Caixa B-4 (Taller Central)',
    supplier: 'RiegoRegen Cat',
    unitPrice: 26.50,
    purchasePrice: 18.20,
    salePrice: 26.50,
    supplierDiscount: '5%',
    vatRate: 21,
    accumulatedExpense: 182.00,
    isService: false,
    lastPurchaseDate: '20/03/2026',
    workerMovementHistory: [],
    purchaseHistory: [
      { id: 'h4', date: '20/03/2026', qty: '10u', price: '182,00 €', supplier: 'RiegoRegen Cat', buyer: 'Marc (Enginyer)' }
    ]
  },
  { 
    id: 'm4', 
    code: 'MAT-004', 
    name: 'Adobat Foliar Nitrogenat 25kg', 
    stockTotal: 2,
    stockCheckedOut: 0,
    stock: 2, 
    minStock: 15, 
    unit: 'sacs', 
    location: 'Palet N-3 (Hangar Fertilitzants)',
    supplier: 'Fertilitzants del Segre SA',
    unitPrice: 45.00,
    purchasePrice: 32.50,
    salePrice: 45.00,
    supplierDiscount: '12%',
    vatRate: 10,
    accumulatedExpense: 650.00,
    isService: false,
    lastPurchaseDate: '18/02/2026',
    workerMovementHistory: [],
    purchaseHistory: [
      { id: 'h7', date: '18/02/2026', qty: '20 sacs', price: '650,00 €', supplier: 'Fertilitzants del Segre SA', buyer: 'Miquel Riera' }
    ]
  },
  {
    id: 's1',
    code: 'SERV-001',
    name: 'Hora Operari / Mà d\'Obra Tècnica',
    stockTotal: 999,
    stockCheckedOut: 0,
    stock: 999,
    minStock: 0,
    unit: 'h',
    location: 'Tarifa Interna CampoPro',
    supplier: 'CampoPro Serveis SL',
    unitPrice: 45.00,
    purchasePrice: 25.00,
    salePrice: 45.00,
    supplierDiscount: '0%',
    vatRate: 21,
    accumulatedExpense: 0.00,
    isService: true,
    lastPurchaseDate: 'Tarifa Activa',
    workerMovementHistory: [],
    purchaseHistory: []
  },
  {
    id: 's2',
    code: 'SERV-002',
    name: 'Hora Tractor / Maquinària Agrícola',
    stockTotal: 999,
    stockCheckedOut: 0,
    stock: 999,
    minStock: 0,
    unit: 'h',
    location: 'Tarifa Flota Agrícola',
    supplier: 'CampoPro Serveis SL',
    unitPrice: 85.00,
    purchasePrice: 45.00,
    salePrice: 85.00,
    supplierDiscount: '0%',
    vatRate: 21,
    accumulatedExpense: 0.00,
    isService: true,
    lastPurchaseDate: 'Tarifa Activa',
    workerMovementHistory: [],
    purchaseHistory: []
  },
  {
    id: 's3',
    code: 'SERV-003',
    name: 'Transport de Material / Logística',
    stockTotal: 999,
    stockCheckedOut: 0,
    stock: 999,
    minStock: 0,
    unit: 'viatge',
    location: 'Tarifa Logística',
    supplier: 'CampoPro Serveis SL',
    unitPrice: 65.00,
    purchasePrice: 35.00,
    salePrice: 65.00,
    supplierDiscount: '0%',
    vatRate: 21,
    accumulatedExpense: 0.00,
    isService: true,
    lastPurchaseDate: 'Tarifa Activa',
    workerMovementHistory: [],
    purchaseHistory: []
  },
  {
    id: 's4',
    code: 'SERV-004',
    name: 'Desplaçament Tècnic d\'Emergència',
    stockTotal: 999,
    stockCheckedOut: 0,
    stock: 999,
    minStock: 0,
    unit: 'trajecte',
    location: 'Tarifa Logística',
    supplier: 'CampoPro Serveis SL',
    unitPrice: 55.00,
    purchasePrice: 30.00,
    salePrice: 55.00,
    supplierDiscount: '0%',
    vatRate: 21,
    accumulatedExpense: 0.00,
    isService: true,
    lastPurchaseDate: 'Tarifa Activa',
    workerMovementHistory: [],
    purchaseHistory: []
  },
  {
    id: 's5',
    code: 'SERV-005',
    name: 'Recàrrec Extra / Nocturnitat / Festiu',
    stockTotal: 999,
    stockCheckedOut: 0,
    stock: 999,
    minStock: 0,
    unit: 'h',
    location: 'Tarifa Especial',
    supplier: 'CampoPro Serveis SL',
    unitPrice: 35.00,
    purchasePrice: 20.00,
    salePrice: 35.00,
    supplierDiscount: '0%',
    vatRate: 21,
    accumulatedExpense: 0.00,
    isService: true,
    lastPurchaseDate: 'Tarifa Activa',
    workerMovementHistory: [],
    purchaseHistory: []
  }
];

export function getStoredProveidors(): SupplierItem[] {
  if (typeof window === 'undefined') return INITIAL_PROVEIDORS;
  try {
    const raw = localStorage.getItem('campopro_proveidors');
    if (!raw) {
      localStorage.setItem('campopro_proveidors', JSON.stringify(INITIAL_PROVEIDORS));
      return INITIAL_PROVEIDORS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_PROVEIDORS;
  }
}

export function saveStoredProveidors(list: SupplierItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('campopro_proveidors', JSON.stringify(list));
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
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_MATERIALS;
  }
}

export function saveStoredMaterials(list: MaterialItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('campopro_materials', JSON.stringify(list));
    window.dispatchEvent(new Event('campopro_store_updated'));
  } catch (e) {
    console.error('Error saving materials', e);
  }
}
