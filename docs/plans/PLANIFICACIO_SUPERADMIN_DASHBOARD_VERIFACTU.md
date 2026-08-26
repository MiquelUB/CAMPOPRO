# 📋 PLANIFICACIÓ I DISSENY EXECUTIU: SUPERADMIN, VERI*FACTU I DASHBOARD B2B (CAMPOPRO)

---

## 📌 DESCRIPCIÓ GENERAL
Aquest document recull l'especificació tècnica i funcional aprovada per al mòdul de **Superadmin de CampoPro** (`/superadmin`), destinat al propietari/creador de la plataforma per a la gestió de les empreses compradores, llicències de quadrilles d'operaris, nodes d'IA locals privats, gestor documental de contractes/rebuts i generador de factures conformes a la llei Veri*factu (RD 1007/2023).

---

## 🗺️ 1. MAPA GEOLOCALITZAT INTERACTIU I PINS DE COLORS

El Dashboard de Superadmin inclou un mapa interactiu que mostra la ubicació de les empreses compradores i els seus nodes d'IA locals privats:

### 🎨 Codificació de Colors dels Pins del Mapa:
- 🟢 **PIN VERD (Node d'IA Online & Pagament al Dia)**: Node privat (LM Studio / Ollama) responent en < 2 segons. Subscripció SaaS activa i al dia.
- 🟡 **PIN GROC / AMBRA (Node d'IA Lent o Factura Pendent)**: Node d'IA privat responent amb alta latència (> 4s) o factura SaaS pendent dins del termini legal (< 30 dies).
- 🔴 **PIN VERMELL (Alerta Crítica / Node Offline o Impagament)**: Node d'IA privat desconectat (offline) o llicència de quadrilles suspensa per impagament.
- 🔵 **PIN BLAU (Nova Empresa en Període de Prova / Trial 14 dies)**: Comprador avaluant CampoPro en període de prova.
- 🟣 **PIN PURPURA / VIOLETA (Client Enterprise / Gran Volum)**: Empresa compradora VIP amb 3 o més quadrilles d'operaris.

### 🖱️ Funcionalitats en Clicar sobre un Pin:
- **Pop-up / Finestra Flotant Informativa:** Nom de l'empresa, NIF, propietari, telèfon, nombre de quadrilles/operaris, URL/IP del Node d'IA local i velocitat de resposta (ms).
- **Disparador de Filtratge Encreuat (Cross-Filtering):** En seleccionar un pino, tota la resta del Dashboard (KPIs, taules, gràfics i conclusions de la IA) es filtra instantàniament per a aquest comprador.

---

## 📊 2. DASHBOARD DE CONTROL EXECUTIU (BI & CROSS-FILTERING)

### 📊 Indicadors Clau (KPIs Executius):
- 💰 **MRR (Ingressos Mensuals SaaS):** Import total recurrent mensual (€) amb evolució.
- 🏢 **Total d'Empreses Compradores:** Nombre d'empreses clientes (Actives, Prova, Suspeses).
- 👥 **Quadrilles d'Operaris Llicenciades:** Recompte de colles autoritzades i operaris a la PWA.
- 🖥️ **Nodes d'IA Locals d'Empresa:** Estat dels servidors locals d'IA (*Online / Offline*).
- ⏱️ **Temps Mitjà de Resposta d'IA:** Velocitat de processament dels Mini PCs/LM Studio (ms).

### 🧠 Mòdul de Conclusions Executives de la IA (AI Business Insights):
Caixa d'intel·ligència executiva que analitza diàriament la salut del negoci:
- 🟢 *Oportunitats d'Upselling de Quadrilles.*
- ⚠️ *Alertes de Desconnexió o Latència de Nodes d'IA Locals.*
- 💶 *Risc Financer i Factures Pendents.*

### ⚡ Filtratge Encreuat Dinàmic (Cross-Filtering):
En fer clic sobre qualsevol visualització (barres de gràfic, pins del mapa, botons de KPI), tota la pantalla es recalcula i es filtra per a la selecció realitzada.

---

## 📂 3. MÒDUL 1: MAGATZEM DE DOCUMENTS, EMPARELLAMENT PER IA LOCAL I BACKUP SETMANAL

- **📂 Estrutura de Carpetes per Comprador:**
  - `📑 contractes_signats/` (Contractes SaaS, NDA i condicions de quadrilles).
  - `💳 rebuts_i_comprovants/` (Justificants bancaris, transferències i mandats SEPA).
  - `📄 factures_emeses_pdf/` (Factures mensuals de llicència CampoPro).
  - `📋 certificats_fiscals/` (Model 036/037 i NIF).

- **🤖 Emparellament Automàtic per IA Local (Comprovant ➔ Factura):**
  - La IA local escaneja via OCR cada comprovant de cobrament bancari pujat, extreu l'import (€), data i referència, i l'associa automàticament a la seva factura corresponent amb badge `🟢 Emparellat per IA`.

- **💾 Còpia de Seguretat Setmanal (Backup a Disc Dur):**
  - Generació automàtica d'un arxiu descarregable (`.zip`) amb tots els documents, contractes, factures i el registre d'immutabilitat Veri*factu per guardar al disc dur extern.

---

## 🧾 4. MÒDUL 2: FACTURACIÓ VERI*FACTU ESTÀNDARD PER LLEI (RD 1007/2023)

### 👑 A. Banda Superadmin (Facturació SaaS de CampoPro):
- Dades Fiscals de l'Emissor (Raó social/autònom creador de CampoPro).
- Catàleg de Tarifes SaaS: Preu base CampoPro, preu per quadrilla suplementària, manteniment de Node d'IA.
- Generador de Factures SaaS directes i proformes.

### 🚜 B. Banda de l'Usuari / Client (Facturació de Feines Agrícoles):
- Flux comercial complet: **Pressupost (IA/Manual) ➔ Factura Proforma ➔ Factura Definitiva Veri*factu (`FAC-2026-XXXX`) ➔ Factures Rectificatives**.

### 📄 Disseny del PDF Estàndard i Codi QR:
- **Encadenament d'Immutabilitat (SHA-256 Hash):** Cada factura genera un Hash encadenat amb la factura anterior (mode inalterable No-Veri*factu).
- **Codi QR Veri*factu al Peu de Pàgina:** Amb les dades estructurals oficials (NIF emissor, NIF comprador, número de factura, data, import i Hash).
- **Sense enviament automàtic a Hisenda:** Mode de conservació local inalterable.

---

*Document d'especificacions creat el 26/08/2026 per a la seva futura implementació a CampoPro.*
