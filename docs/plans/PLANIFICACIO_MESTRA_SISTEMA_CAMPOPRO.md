# 📋 PLANIFICACIÓ MESTRA DEFINITIVA: ARQUITECTURA I SISTEMA CAMPOPRO (v3.0)

---

## 📌 1. DISSENY GENERAL I PRINCIPI DEL DISSENY CAMALEÓ (CHAMELEON BRANDING)

L'aplicació no utilitza colors ni aparences fixes. Incorpora el **Engine de Disseny Camaleó (Chameleon UI Engine)**:
- **Adaptació 100% a la Marca del Client:** Cada empresa compradora de la plataforma puja el seu **logo corporatiu** i defineix els seus **colors de marca** (`Primary Color`, `Secondary Color`, `Accent Color`).
- **Injecció Dinàmica (Tokens CSS HSL):** La interfície sencera (PWA Mòbil d'operaris, Dashboard Web d'enginyers, PDFs de Factures Veri*factu, Telegram i Logins) s'adapta automàticament als colors i a la marca del client.
- **Sensació d'App Pròpia:** Els operaris i enginyers tenen la sensació de fer servir el seu propi programari natiu corporatiu.

---

## 👑 2. SUPERADMIN B2B CRM & DASHBOARD DE CONTROL EXECUTIU

Ubicat a la secció **`/superadmin`**, actua com a Centre de Comandament BI (Business Intelligence) per al propietari de CampoPro:

### 🏢 A. Gestió de Compradors i Llicències per Quadrilles:
- Registre d'Empreses Compradores (Dades fiscals, propietari, telèfon, correu de cobrament).
- Control de **Quadrilles d'Operaris autoritzades** (colles) i llicències PWA actives.
- Facturació mensual SaaS recurrent (**MRR**).
- Registre del **Node d'IA Privat** per comprador (URL/IP del seu LM Studio / Ollama local).

### 🗺️ B. Mapa Geolocalitzat Interactiu amb Pins de Colors:
- 🟢 **PIN VERD:** Node d'IA Online & Pagament SaaS al dia.
- 🟡 **PIN GROC:** Node d'IA amb latència o factura SaaS pendent de cobrament.
- 🔴 **PIN VERMELL:** Node d'IA Offline / Desconnectat o llicència suspensa.
- 🔵 **PIN BLAU:** Empresa en període de prova (Trial 14 dies).
- 🟣 **PIN PURPURA:** Client Enterprise VIP (>3 quadrilles).

### ⚡ C. Filtratge Encreuat Dinàmic (Cross-Filtering):
En fer clic sobre qualsevol visualització (pin del mapa, barra de gràfic o indicador de KPI), **tota la pantalla es recalcula i es filtra instantàniament** per a la selecció realitzada.

---

## 📂 3. MÒDUL 1: MAGATZEM DE DOCUMENTS, EMPARELLAMENT PER IA LOCAL I BACKUP SETMANAL

### 📁 A. Gestor Documental Privat per Comprador:
Organitzat en 4 carpetes digitals:
1. `📑 contractes_signats/` (Contractes SaaS, NDA i condicions de llicència).
2. `💳 rebuts_i_comprovants/` (Justificants bancaris, transferències i mandats SEPA).
3. `📄 factures_emeses_pdf/` (Factures mensuals emeses).
4. `📋 certificats_fiscals/` (Model 036/037 i dades fiscals).

### 🤖 B. Emparellament Automàtic per IA Local (Comprovant ➔ Factura):
L'IA local escaneja via OCR cada comprovant de cobrament bancari pujat, extreu l'import (€), data i referència, i l'associa automàticament a la seva factura corresponent amb el badge `🟢 Emparellat per IA`.

### 💾 C. Còpia de Seguretat Setmanal (Backup a Disc Dur):
Generació automàtica d'un arxiu descarregable (`.zip`) amb tots els documents, contractes, factures i registres d'immutabilitat per descarregar al **disc dur extern**.

---

## 🧾 4. MÒDUL 2: FACTURACIÓ VERI*FACTU ESTÀNDARD PER LLEI (RD 1007/2023)

### 👑 A. Facturació Superadmin (Factures SaaS de CampoPro):
- Dades Fiscals de l'Emissor (Creador de CampoPro).
- Catàleg de Tarifes SaaS (Base CampoPro, quadrilles addicionals, manteniment Node d'IA).
- Emissió de Factures Proforma i Definitives.

### 🚜 B. Facturació Usuari/Client (Feines Tècniques i Agrícoles):
- Flux comercial complet: **Pressupost ➔ Factura Proforma ➔ Factura Definitiva Veri*factu (`FAC-2026-XXXX`) ➔ Factures Rectificatives**.

### 📄 C. Disseny PDF Estàndard i Codi QR:
- **Encadenament d'Immutabilitat (Hash SHA-256):** Cada factura inclou el Hash de la factura anterior.
- **Codi QR Veri*factu al Peu de Pàgina:** Amb les dades estructurals oficials segons el RD 1007/2023.
- **Sense enviament telemàtic a Hisenda:** Mode de conservació local inalterable.

---

## 🎯 5. ROL DEFINITIU I OPERATIU DEL COPILOT D'IA

### 🛑 A. QUÈ NO FA EL COPILOT (ELIMINAT PER DISSENY):
- ❌ **NO redacta paràgrafs llargs de feina** ni fa escriure textos inútils que n'operaris ni enginyers llegiran.
- ❌ **NO s'inventa materials, tuberies ni eines** que ningú ha especificat.
- ❌ **NO envia cap factura ni comanda automàticament** sense l'aprovació humana explícita.

### 🏛️ B. LES FUNCIONS REALS D'ALT VALOR DEL COPILOT:

1. **🔎 Memòria Tècnica, Historial de l'Últim Any i CONTROL DE GARANTIES:**
   - Mostra el **Llistat Cronològic d'Actuacions de l'Últim Any** en aquella finca/equip.
   - **Validació Automàtica de Garanties:**
     - *Garantia de Mà d'Obra (Feina anterior).*
     - *Garantia del Material del Fabricant.*
     - *Alerta:* `"⚠️ Aquesta bomba està en garantia del fabricant fins al 2027. No facturar la peça nova al client, tramitar garantia."`

2. **⚖️ Control de Desviacions (Pressupost Base vs Execució Real PWA):**
   - Compara el **Pressupost Base Aprovat** amb les dades reals gravades pels operaris a la PWA mòbil en finalitzar la feina:
     - ⏱️ *Hores:* Pressupostat 4h ➔ Realitat PWA 5h (+1h de desviació).
     - 📦 *Material:* Pressupostat 10m tub ➔ Realitat PWA 14m tub (+4m de desviació).
     - 💶 *Impacte:* Marge previst 30% ➔ Marge real final 18%.

3. **🚨 Auditoria d'Incidències i Memòrandum Tècnic:**
   - Quan un operari prem `🚨 Foto Incidència` i grava una nota de veu a la PWA, el Copilot transcriu l'àudio, avalua si és un extra facturable i redacta el **Memòrandum Tècnic d'Incidència** per a l'enginyer.

4. **📦 Alerta Preventiva d'Estoc en Assignar la Feina (Recompra Immediata):**
   - En el mateix moment en què l'enginyer assigna una feina que consumirà material (ex: 9m de tub quan l'estoc actual és de 10m):
   - **Abans que els operaris tornin de l'obra**, el Copilot detecta que l'estoc residual (1m) queda per sota del mínim de seguretat (5m) i genera la **Proposta de Comanda al Proveïdor habitual** a l'acte per aprovar amb 1 clic.

5. **🛑 Human-in-the-Loop Mandate:**
   - L'enginyer o el propietari té sempre la decisió final abans d'emetre qualsevol factura o comanda a proveïdor.

---

*Document de planificació mestra redactat el 26/08/2026 i guardat a docs/PLANIFICACIO_MESTRA_SISTEMA_CAMPOPRO.md*
