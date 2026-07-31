# Skill: PWA Offline Sync (IndexedDB)

## Descripció
Aquesta skill serveix per a crear aplicacions web progressives (PWA) al frontend (Next.js) que poden operar offline, guardant les accions a l'IndexedDB (amb Dexie o directament). Aquest exemple està orientat a treballar amb sincronització de cues i gestió de fotografies d'una PWA de treballadors de camp.

## Template

```javascript
// lib/offlineSync.js
import Dexie from 'dexie';

// 1. Setup IndexedDB (via Dexie)
export const db = new Dexie('campopro_offline');
db.version(1).stores({
  sync_queue: '++id, endpoint, method, timestamp', // Accions pendents
  photos: '++id, target_id, type', // Fotos pendents per pujar (Blob)
  cached_feines: 'id, empresa_id, timestamp' // Dades per visualització offline
});

// 2. Funcions de Cua i Sincronització
export async function addActionToQueue(endpoint, method, payload) {
  await db.sync_queue.add({
    endpoint,
    method,
    payload,
    timestamp: new Date().getTime(),
  });
  
  if (navigator.onLine) {
    processSyncQueue();
  } else {
    // Si estem offline podem enregistrar per a Background Sync
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.sync.register('sync-campopro');
      });
    }
  }
}

export async function addPhotoToQueue(file, targetId, photoType) {
  await db.photos.add({
    target_id: targetId,
    type: photoType,
    blob: file, // File o Blob
    timestamp: new Date().getTime()
  });
  
  if (navigator.onLine) processPhotoQueue();
}

// 3. Processar cues
export async function processSyncQueue() {
  const pendingActions = await db.sync_queue.orderBy('timestamp').toArray();
  
  for (const action of pendingActions) {
    try {
      const response = await fetch(action.endpoint, {
        method: action.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // A tenir en compte
        },
        body: JSON.stringify(action.payload)
      });
      
      if (response.ok) {
        await db.sync_queue.delete(action.id);
      } else if (response.status === 409) {
        // Resolució de Conflictes (El servidor mana)
        console.warn('Conflicte detectat. Dades rebutjades per servidor.');
        alert('Avís: Algunes dades no s\'han pogut sincronitzar perquè hi ha hagut canvis al servidor.');
        await db.sync_queue.delete(action.id);
      }
    } catch (error) {
      console.error('Error sincronitzant acció:', error);
      break; // Parem si hi ha error de xarxa per evitar desordre
    }
  }
}

export async function processPhotoQueue() {
  const pendingPhotos = await db.photos.toArray();
  for (const photo of pendingPhotos) {
    try {
        const formData = new FormData();
        formData.append('file', photo.blob);
        formData.append('target_id', photo.target_id);
        
        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: formData
        });
        
        if (response.ok) {
            await db.photos.delete(photo.id);
        }
    } catch (error) {
        console.error('Error pujant foto:', error);
        break;
    }
  }
}

// 4. Listeners de xarxa globals (pot anar a un useEffect a _app.js o Provider)
export function initNetworkListeners() {
  window.addEventListener('online', () => {
    console.log('Online. Iniciant sincronització...');
    processSyncQueue();
    processPhotoQueue();
  });
  
  window.addEventListener('offline', () => {
    console.log('Offline. Mode local activat.');
  });
}
```

## Exemple d'ús
A l'UI de l'app (ex. en marcar una feina com a feta):
```javascript
import { addActionToQueue } from '@/lib/offlineSync';

async function handleSubmit(data) {
  if (navigator.onLine) {
    // Intentar petició directa o usar cua igualment per uniformitat
    await addActionToQueue('/api/feines/123/completar', 'POST', data);
  } else {
    // Mode offline
    await addActionToQueue('/api/feines/123/completar', 'POST', data);
    alert('Feina completada (es sincronitzarà quan hi hagi connexió)');
  }
}
```

## Validació
- Obre les DevTools de Chrome -> Application -> Storage -> IndexedDB i observa com s'omplen les taules.
- Apaga la wifi/xarxa (Mode Offline en Network tab), crea un registre, torna a encendre la wifi i verifica que la crida de xarxa es dispara.

## Errors comuns
- Guardar `Blob/File` a LocalStorage (impossible); s'ha d'utilitzar sempre IndexedDB com l'exemple de sobre.
- No fer la cua seqüencial (`break` a l'error de xarxa); si s'executa en paral·lel, hi podria haver condicions de carrera si modifiques un mateix id des de la cua de sincronització.
- Caducitat de JWT: si la cua es buida molt tard i el token ha expirat, l'API farà un 401 i la cua podria quedar encallada si no es processa la renovació del token prèviament.
