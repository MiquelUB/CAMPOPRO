# 🚀 ARQUITECTURA MULTI-VERTICAL & DISSENY CAMALEÓ (BRANDING DINÀMIC AMB CAMPOPRO, ELECTRICPRO, HYDROPRO)

---

## 📌 DESCRIPCIÓ GENERAL & PRICIPI D'IDENTITAT
Aquest document recull la planificació estratègica corregida per transformar el repositori en una **Suite Multivertical amb Disseny Camaleó (Chameleon UI Engine)**.

---

## 🦎 1. EL PRINCIPI DEL DISSENY CAMALEÓ (CHAMELEON BRANDING ENGINE)

**Regla d'Or:** L'aplicació NO té colors ni logos de marca fixos per vertical. L'aplicació actua com un **Camaleó**:
- **S'adapta al 100% als colors corporatius i al logo de l'Empresa Compradora.**
- Quan una empresa compradora (*ex: Agro Riera SL, Finca Vallès, Electricitat Ponent*) s'adona d'alta a CampoPro/ElectricPro, puja el seu **logo corporatiu** i selecciona els seus **colors de marca (Color Primari, Secundari i Accent)**.
- La interfície sencera (PWA Mòbil d'operaris, Dashboard Web d'enginyers, PDFs de factures Veri*factu, notificacions de Telegram i pantalles de login) **es transforma com un camaleó** adoptant els colors i la marca d'aquesta empresa.

### 🎨 Com Funciona el Engine Camaleó:
1. **Pujada de Logo Corporatiu:** L'empresa puja la seva imatge corporativa (`logo.png` / `logo.svg`).
2. **Extracció i Injecció Dinàmica de Palette (Tokens CSS/HSL):**
   - `--color-primary`: Color corporatiu principal del client.
   - `--color-secondary`: Color d'accent / fons de targetes.
   - `--color-brand-contrast`: Text d'alt contrast calculat automàticament.
3. **Sentiment d'App Propia:** Tant els operaris de camp a la PWA com els clients a la web senten que estan utilitzant el programari natiu de la seva pròpia empresa.

---

## 🏗️ 2. SEPARACIÓ ENTRE "DISSENY CAMALEÓ" I "VERTICAL TÈCNICA"

Mentre que l'aparença visual (colors i logo) la decideix el **Disseny Camaleó de l'Empresa Compradora**, la **Vertical** decideix la **Terminologia Tècnica, el Magatzem i els Prompts de l'IA**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🦎 DISSENY CAMALEÓ (APARENÇA VISUAL DEL CLIENT COMPRADOR)                              │
│   • Logo de l'Empresa Compradora (ex: Agro Riera SL / Finca Vallès)                    │
│   • Palette de Colors Corporatius Personalitzats (Tokens CSS HSL)                      │
│   • Adaptació de PDFs, Telegram i PWA a la Marca del Client                            │
└───────────────────────────────────┬────────────────────────────────────────────────────┘
                                    │ (Aplicat a qualsevol vertical)
                ┌───────────────────┴───────────────────┐
                ▼                                       ▼
      🌾 VERTICAL CAMPOPRO                     ⚡ VERTICAL ELECTRICPRO
   (Especialització Agrícola)                (Especialització Elèctrica)
   • Vocabulari: Finques, Parcel·les, Reg   • Vocabulari: Quadres, kW, Cabling
   • Magatzem: Canonades PE, Fertilitzant   • Magatzem: Magnetotèrmics, Cables
   • Prompt IA: Càlcul de Reg/Tractors       • Prompt IA: Proteccions/Boletins
```

---

## ⚙️ 3. DADES CONFIGURABLES PER COMPRADOR AL SUPERADMIN (`/superadmin`)

Per a cada empresa compradora de la suite, des del panell de Superadmin es configurarà:

1. **🎨 Paràmetres del Engine Camaleó:**
   - `logo_url`: Imatge del logo corporatiu.
   - `primary_color_hex`: Color primari de la marca (ex: `#1b4332`, `#0284c7`, `#7c3aed`).
   - `secondary_color_hex`: Color secundari d'accent.
2. **🌾 Selection de Vertical Tècnica:**
   - `vertical_id`: `CAMPOPRO` (Agrícola & Reg) | `ELECTRICPRO` (Instal·lacions Elèctriques) | `HYDROPRO` (Fontaneria) | `BUILDINGPRO` (Edificació).
3. **👥 Llicències i Quadrilles:**
   - Nombre de colles d'operaris autoritzades a la PWA mòbil.
4. **🖥️ Node d'IA Privat:**
   - URL/IP del seu servidor LM Studio local.

---

## 🗓️ FULL DE RUTA CORREGIT PER FASES

- **FASE 1:** Implementació del **Engine de Disseny Camaleó** (Injecció dinàmica de variables CSS `--primary` i `--secondary` des de les dades de l'empresa compradora).
- **FASE 2:** Mòdul de pujada de Logo Corporatiu i adaptació automàtica del logo a la capçalera de la PWA, al Dashboard i als PDFs de factures Veri*factu.
- **FASE 3:** Diccionari de Terminologia Tècnica per Vertical (`CAMPOPRO` vs `ELECTRICPRO`).
- **FASE 4:** Prompts adaptatius del Copilot d'IA segons la vertical tècnica seleccionada.

---

*Document corregit el 26/08/2026 i guardat a docs/PLANIFICACIO_ARQUITECTURA_MULTIVERTICAL.md*
