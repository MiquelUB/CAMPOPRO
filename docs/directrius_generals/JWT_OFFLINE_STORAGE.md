# Emmagatzematge Segur de JWT en Mode Offline per a PWA

Aquest document estableix les directrius perquè l'equip Frontend (PWA Operari) pugui emmagatzemar de forma segura els JWT (JSON Web Tokens) durant el mode offline.

## El Problema de IndexedDB i LocalStorage

L'emmagatzematge en `localStorage`, `sessionStorage` i `IndexedDB` no està xifrat per defecte. Qualsevol atacant amb accés al dispositiu desbloquejat, o un script XSS (Cross-Site Scripting), podria extreure els tokens fàcilment i suplantar l'operari.

## Directrius d'Emmagatzematge Segur

### 1. Ús de Web Crypto API (Xifrat de Tokens a IndexedDB)

Per guardar tokens a IndexedDB de manera que no estiguin en clar:

1. **Generació d'una Clau de Xifratge Local (KEK - Key Encryption Key)**:
   - Utilitza la Web Crypto API (`window.crypto.subtle`) per generar una clau simètrica AES-GCM (ex. 256 bits).
   - Com aquesta clau només s'utilitza localment, la generarem derivada (PBKDF2) d'un PIN de l'usuari, o bé la mantindrem exclusivament en memòria. Això requereix que l'usuari introdueixi un PIN breu o que s'utilitzi biomètrica (si està suportada per la Web Authentication API) per desbloquejar l'aplicació des de l'estat offline.

2. **Xifrat del JWT abans de guardar-lo**:
   - Abans de fer el `put` o `add` a IndexedDB, xifra el string del JWT amb la clau AES-GCM, obtenint un ArrayBuffer.
   - Guarda a IndexedDB l'ArrayBuffer (el token xifrat) juntament amb l'IV (Initialization Vector) utilitzat durant el procés de xifratge.

3. **Desxifrat del JWT al llegir-lo**:
   - En obrir l'app en mode offline, obtén l'ArrayBuffer i l'IV des d'IndexedDB.
   - Amb la mateixa clau AES-GCM (requerida de nou, o present en memòria), desxifra l'ArrayBuffer per recuperar el JWT en text.

### 2. Rotació de Tokens (Access & Refresh)

- **Access Tokens de vida curta**: L'Access Token ha de caducar molt ràpidament (ex. 15 minuts). 
- **Refresh Tokens en HttpOnly Cookies**: Si és possible utilitzar Service Workers per interceptar les peticions i afegir-los, fes que el Refresh Token es descarregui en una cookie `HttpOnly` `Secure` `SameSite=Strict`.
- *Nota en PWAs completament Offline*: En casos on el frontend purament client necessiti retenir l'autenticació per a re-sync quan torni la cobertura (i puguin haver passat dies), l'ús del PIN per derivar la clau AES-GCM i desxifrar el token és obligatori, ja que no podem confiar plenament en les galetes per resoldre-ho (els Service Workers sí que poden llegir peticions, però l'emmagatzematge de dades a llarg termini offline requereix persistència explícita).

### 3. Service Workers (Interceptar i Injectar)

Quan l'app torni a estar online, el Service Worker:
1. Pilla la petició cap a l'API del backend.
2. Recupera el token desxifrat (del gestor d'estat a memòria del main thread, o bé a través del MessageChannel).
3. Injecta l'encapçalament `Authorization: Bearer <token>` abans de deixar que la petició es dirigeixi al servidor.

Mai es guarda el JWT en clar als estats persistents del Service Worker (caches, indexedDB). Només es manté en clar a la memòria RAM durant l'execució de l'aplicació.

### 4. Protecció contra XSS

- Assegura't de tenir establerta una Content-Security-Policy (CSP) estricta, denegant qualsevol script inline o avaluacions dinàmiques (`unsafe-inline`, `unsafe-eval`).
- Aquest és el mètode més efectiu per evitar que scripts maliciosos de tercers intentin accedir a la memòria on mantens la clau o el token desxifrat.

---
**Recordatori per a Sprint 7 (Nivell 6: PWA Operari)**
Qualsevol implementació d'aquests punts haurà de ser revisada per l'Agent de Seguretat (Security Auditor).
