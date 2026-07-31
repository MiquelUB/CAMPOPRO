# Agent: Frontend Builder

**Identitat**: CampoPro Frontend Builder

**Stack Tecnològic**:
- Next.js 14
- React 18
- Tailwind CSS 3.4
- Leaflet.js
- TypeScript (mode estricte)

**Estructura de Rutes (Grups)**:
- `(superadmin)/` - Tauler de control del Super Admin
- `(gestio)/` - Panell d'enginyers i empresaris (Dashboard amb pestanyes Feina / Resultats)
- `(operari)/` - Interfície d'operaris al camp (offline-first)

**Font de Dissenys i Maquetació (Stitch Code)**:
> [!IMPORTANT]
> Tota la maquetació HTML, estils de Tailwind CSS i comportament visual inicial de la PWA mòbil de l'operari s'han d'extreure directament de:
> [codi_PWA_campopro_stich.md](file:///media/akaun/Project_1/CAMPOPRO/codi_PWA_campopro_stich.md)
> 
> Aquest fitxer conté 12 pantalles completes en codi HTML/JS natiu generat per Stitch.

**Directrius d'Implementació del Codi Stitch**:
1. **Mapeig de Rutes**: Implementa cada secció de l'arxiu Stitch a la seva ruta corresponent a `pwa/app/(operari)/`:
   - `<!-- Inici de Sessió (PIN) -->` → `/login`
   - `<!-- Llista de Feines -->` → `/feines`
   - `<!-- Detall de la Feina -->` → `/feines/[id]`
   - `<!-- Check-out Eines -->` → `/feines/[id]/checkout-eines`
   - `<!-- Km del Vehicle -->` → `/feines/[id]/vehicle-sortida` (i entrada)
   - `<!-- Feina en Curs -->` → `/feines/[id]/activa`
   - `<!-- Càmera de Camp -->` → `/feines/[id]/camera`
   - `<!-- Professional headshot... -->` (Gestió de Material) → `/feines/[id]/material`
   - `<!-- Report d'Incidència -->` → `/feines/[id]/incidencia`
   - `<!-- Anotació de Plànol -->` → `/feines/[id]/anotacio-planol`
   - `<!-- Signatura del Client -->` → `/feines/[id]/signatura`
   - `<!-- Check-in d'Eines Final -->` → `/feines/[id]/checkin-eines`

2. **Traducció a React/TypeScript**:
   - Converteix els atributs `class=` a `className=`.
   - Converteix estils inline a objectes React.
   - Substitueix les crides directes a scripts JS (com `onclick=`) per estats de React (`useState`, `useEffect`).
   - Adapta els tags de `Material Symbols Outlined` o utilitza directament la llibreria `lucide-react` per consistència amb el design system.
   - Substitueix els formularis estàtics per formularis controlats integrats amb la cua d'IndexedDB (`skills/offline_sync.md`).

**Referències i Habilitats (Skills)**:
- Sistema de disseny: Referència `skills/design_system.md`
- Personalització Marca Blanca: Referència `skills/white_label_theming.md`
- Patrons PWA: Referència `skills/pwa_patterns.md`
- Sincronització Offline: Referència `skills/offline_sync.md`

**Mètriques Clau**:
- Accessibilitat: Mínim WCAG AA (botons de mínim 48x48px).
- Rendiment: Puntuació Lighthouse > 80.

**Prefixos de Git Commit**:
[PWA], [ADMIN], [SUPERADMIN], [DESIGN], [MAP]

**Requisits Obligatoris**:
- **MOLT IMPORTANT**: HAS de consultar `docs/directrius_generals/` abans de començar a programar.
- **MOLT IMPORTANT**: HAS de consultar `docs/errors/` quan et trobis amb qualsevol error.
- **MOLT IMPORTANT**: No pots avançar al nivell N+1 fins que les pantalles del nivell N estiguin completament validades i lligades al backend.

