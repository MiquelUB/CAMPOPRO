# 🚀 DISSENY D'ARQUITECTURA MULTI-VERTICAL & WHITE-LABEL (CAMPOPRO, ELECTRICPRO, HYDROPRO, ETC.)

---

## 📌 DESCRIPCIÓ GENERAL
Aquest document recull la planificació estratègica per transformar el repositori actual en un **Sistema Multivertical Modular i Marca Blanca (White-Label)**. 

L'objectiu és permetre generar diferents variants comercials del producte (**CampoPro**, **ElectricPro**, **HydroPro**, **BuildingPro**) a partir d'un sol repositori central, sense duplicar codi ni haver de mantenir diferents projectes per separat.

---

## 🏗️ 1. ARQUITECTURA MONOREPO MODULAR (SINGLE-CORE MULTI-VERTICAL)

En lloc de crear múltiples repositoris independents (que obligarien a duplicar les millores de Veri*factu, la PWA mòbil o el fitxatge de jornada a cada projecte), adoptem una **Arquitectura Concentrica Modular**:

```
                              ┌─────────────────────────────────────────┐
                              │ 🧠 CORE ENGINE (REPOSITORI CENTRAL)    │
                              │   • Sistema de Facturació Veri*factu   │
                              │   • PWA Mòbil d'Operaris & Fitxatge     │
                              │   • Integració amb IA Local (LM Studio) │
                              │   • Superadmin B2B & Gestió de Llicències│
                              └────────────────────┬────────────────────┘
                                                   │
                ┌──────────────────────────────────┼──────────────────────────────────┐
                ▼                                  ▼                                  ▼
      🌾 VERTICAL CAMPOPRO               ⚡ VERTICAL ELECTRICPRO               💧 VERTICAL HYDROPRO
   (Serveis Agrícoles & Reg)            (Instal·lacions Elèctriques)          (Fontaneria & Bombeig)
   • Verd Agrícola (#1b4332)            • Groc/Blau Elèctric (#f59e0b)        • Blau Cel/Turquesa (#0284c7)
   • Terminologia: Finces, Tractors     • Terminologia: Quadres, kW, Cabling  • Terminologia: Bombes, Bar, Cabal
   • Prompt IA: Hidràulica/Adobat       • Prompt IA: Proteccions/Boletins     • Prompt IA: Pressió/Tuberies
```

---

## 🎨 2. COMPONENTS DE PERSONALITZACIÓ DINÀMICA PER VERTICAL

Cada versió comercial de la suite adaptarà automàticament 4 capes:

### A. Capa d'Identitat i Tematització (White-Label UI):
- **Logo i Favicon:** Configurables per vertical (`campopro-logo.svg`, `electricpro-logo.svg`).
- **Paleta de Colors CSS/Variables:**
  - **CampoPro:** Tonalitats verdoses i terroses.
  - **ElectricPro:** Tonalitats blaves, amber/groc i negre industrial.
  - **HydroPro:** Tonalitats blaves marines i turquesa.

### B. Capa de Terminologia i Conceptes de Negoci:
- Les etiquetes de la PWA i del Dashboard s'adapten dinàmicament segons la vertical:
  - *CampoPro:* "Finques", "Parcel·les", "Hectàrees", "Tractors", "Fitosanitaris".
  - *ElectricPro:* "Quadres Elèctrics", "Escomeses", "kW Contractats", "Furgonetes Tècniques", "Boletins".
  - *HydroPro:* "Estacions de Bombeig", "Canonades", "Cabal m³/h", "Pressió Bar", "Valvulería".

### C. Capa d'Intel·ligència Artificial Especialitzada (Copilot Prompts):
- El mateix System Prompt v2 carregarà una **matriu d'especialització** segons la vertical:
  - *CampoPro Prompt:* Especialitzat en càlcul de reg, tractors, fittings de PE i fertilitzants.
  - *ElectricPro Prompt:* Especialitzat en seccions de cable, magnetotèrmics, diferencials i mesuradors d'aïllament.

### D. Capa de Magatzem i Tarifes de Referència:
- Catàleg inicial d'articles i eines adaptat a la vertical triada.

---

## 👑 3. GESTIÓ MULTI-VERTICAL DES DEL PANELL SUPERADMIN (`/superadmin`)

Al panell de Superadmin, com a propietari del programari, podràs:

1. **Crear o Habilitar Verticals per a un Comprador:**
   - Quan dones d'alta una empresa compradora, selecciones quines verticals té llicenciades:
     - `[✓] CampoPro (Agrícola & Reg)`
     - `[✓] ElectricPro (Manteniment Elèctric)`
     - `[ ] HydroPro (Fontaneria)`
2. **Assignar Dominis o Subdominis Marca Blanca:**
   - Possibilitat d'assignar la URL corporativa del client (ex: `https://riera.campopro.cat` o `https://valles.electricpro.cat`).
3. **Control Centralitzat de Millores:**
   - Qualsevol actualització de seguretat, millora de la PWA mòbil o canvi en la llei Veri*factu s'aplica simultàniament a totes les verticals amb un sol `git push`.

---

## 🗓️ FULL DE RUTA D'IMPLEMENTACIÓ PER FASES (ROADMAP)

- **FASE 1:** Creació de l'arxiu central de configuració de Verticals (`config/verticals.json`).
- **FASE 2:** Implementació del sistema de variables de color CSS / Tailwind per a la tematització automàtica.
- **FASE 3:** Adaptació dels selectors de terminologia a la PWA d'operaris i al Dashboard.
- **FASE 4:** Especialització dels Prompts del Copilot d'IA segons la vertical activa.
- **FASE 5:** Integració de la selecció de vertical al panell de Superadmin B2B.

---

*Document d'especificació d'arquitectura multivertical creat el 26/08/2026 a docs/PLANIFICACIO_ARQUITECTURA_MULTIVERTICAL.md*
