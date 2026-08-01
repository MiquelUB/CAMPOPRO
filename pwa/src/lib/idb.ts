import { openDB, DBSchema } from 'idb';

interface CampoProDB extends DBSchema {
  syncQueue: {
    key: string;
    value: {
      id: string;
      url: string;
      method: string;
      body: any;
      headers?: Record<string, string>;
      timestamp: number;
    };
  };
  feines: {
    key: string;
    value: any;
  };
}

const dbPromise = typeof window !== 'undefined' ? openDB<CampoProDB>('campopro-db', 1, {
  upgrade(db) {
    db.createObjectStore('syncQueue', { keyPath: 'id' });
    db.createObjectStore('feines', { keyPath: 'id' });
  },
}) : null;

export async function addToSyncQueue(requestData: any) {
  if (!dbPromise) return;
  const db = await dbPromise;
  await db.add('syncQueue', {
    ...requestData,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  });
  
  if (navigator.onLine) {
    syncNow();
  }
}

export async function syncNow() {
  if (!dbPromise || !navigator.onLine) return;
  const db = await dbPromise;
  const tx = db.transaction('syncQueue', 'readwrite');
  const store = tx.objectStore('syncQueue');
  const items = await store.getAll();

  for (const item of items) {
    try {
      const response = await fetch(item.url, {
        method: item.method,
        body: item.body instanceof FormData ? item.body : JSON.stringify(item.body),
        headers: item.headers || {},
      });
      if (response.ok) {
        await store.delete(item.id);
      }
    } catch (error) {
      console.error('Failed to sync item:', item.id, error);
    }
  }
}

export async function saveFeinaOffline(feina: any) {
  if (!dbPromise) return;
  const db = await dbPromise;
  await db.put('feines', feina);
}

export async function getFeinaOffline(id: string) {
  if (!dbPromise) return null;
  const db = await dbPromise;
  return await db.get('feines', id);
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', syncNow);
}
