# 🎯 ROL DEFINITIU DEL COPILOT A CAMPOPRO: GESTIÓ, MEMÒRIA TÈCNICA, GARANTIES I PRE-FACTURACIÓ

---

## 📌 DESCRIPCIÓ GENERAL
Aquest document estableix la **redefinició definitiva del paper del Copilot d'IA a CampoPro**. 

Es descarta totalment l'ús del Copilot com a redactador de textos en la creació de feines (per evitar al·lucinacions i textos inútils), i es concentra el seu valor en 3 funcions d'alt valor per a l'empresa: **Memòria Tècnica & Garanties**, **Gestió d'Incidències de Camp** i **Auditoria de Pre-Facturació (Post-Feina)**.

---

## 🛑 1. QUÈ NO FA EL COPILOT (ELIMINAT PER DISSENY)
- ❌ **NO redacta paràgrafs llargs de feina** que ningú llegirà.
- ❌ **NO s'inventa materials, diàmetres de tub ni eines** que ningú ha especificat.
- ❌ **NO envia cap factura ni pressupost automàticament** sense l'aprovació humana explícita.

---

## 🏛️ 2. LES 3 LES FUNCIONS EXCLUSIVES I REALS DEL COPILOT

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🧠 EL TRIPLE ROL EXECUTIU DEL COPILOT A CAMPOPRO                                       │
└───────────────────────────────────┬────────────────────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
 1. MEMÒRIA TÈCNICA           2. AUDITORIA D'INCIDÈNCIES   3. PRE-FACTURACIÓ POST-FEINA
    & CONTROL DE GARANTIES       I MEMÒRANDUM DE CAMP         I RECONCILIACIÓ DE MAGATZEM
 (Garanties feina/material)    (Fotos + Àudio de veu)       (Hores, Km, Albarans, Tiquets)
```

---

### 🔍 A. Memòria Tècnica de Finca i Control de Garanties (Pre-Feina / Gestió)
Quan l'enginyer consulta un client o una finca:
1. **Memòria Històrica:** Recorda quines peces o actuacions es van fer en el passat en aquell sector.
2. **Validació d'Estat de Garantia (CLAU):**
   - **Garantia de Feina:** Comprova si la reparació anterior va ser realitzada per l'empresa en el període de garantia de mà d'obra (ex: 6 mesos).
   - **Garantia de Material del Fabricant:** Comprova si la peça o bomba instal·lada anteriorment està dins del termini de garantia del proveïdor (ex: 2 anys).
   - **Alerta de Seguretat:** *"⚠️ Aquesta bomba de reg es va instal·lar el 15/10/2025 i està EN GARANTIA del fabricant. No facturar la peça nova al client, tramitar garantia amb el proveïdor."*

---

### 🚨 B. Gestió d'Incidències i Memòrandum de Camp (PWA ➔ Gestió)
A la PWA mòbil de l'operari, l'estructura de control es simplifica al màxim:
- **Botons de la PWA d'Operari:**
  1. `[ 📸 Foto Inicial Obligatòria (Geolocalitzada) ]`
  2. `[ 🟢 Botó Iniciar / Finalitzar Jornada-Feina ]`
  3. `[ 📸 Foto Final d'Obra ]` o `[ 🚨 Foto Incidència amb Àudio de Veu ]`

#### Processament de l'Incidència pel Copilot:
- Si l'operari utilitza el botó `🚨 Foto Incidència` i grava una nota de veu:
  1. El Copilot transcriu l'àudio i analitza la foto.
  2. Avalua si l'incidència és un dany preexistent de la finca (extra facturable) o un error d'execució.
  3. Redacta el **Memòrandum d'Incidència** per a l'enginyer amb la proposta de resolució i el desglossament del cost extra.

---

### 💶 C. Auditoria de Pre-Facturació Post-Feina (Albarans, Hores, Desplaçaments)
Un cop l'operari clava la feina a la PWA, el Copilot realitza el **càlcul integral de pre-facturació**:
1. **Reconciliació de Magatzem:** Material extret del magatzem menys material retornat a la furgoneta.
2. **Hores Reals i Personal:** Registre de fitxatges de la PWA per cada integrant de la colla.
3. **Desplaçaments i Vehicles:** Càlcul de quilòmetres reals per GPS + vehicle assignat.
4. **Tiquets de Despeses:** Lectura OCR de tiquets de gasoil, peatges o dietes de camp pujats a la PWA.
5. **Generació del PDF de Pre-Factura Veri*factu:** Presentació de la pre-factura a l'enginyer.

---

### 🛑 3. EL PRINCIPI DEL CONTROL HUMÀ ABSOLUT (HUMAN IN THE LOOP)
Cap dada calculada pel Copilot s'envia al client final ni a Hisenda. L'enginyer o el propietari té sempre la decisió final amb el botó:
- **`[ 🟢 Aprovar i Emetre Factura Veri*factu ]`**
- **`[ ✏️ Modificar Partides ]`**

---

*Document de definició del rol del Copilot creat el 26/08/2026 a docs/PLANIFICACIO_ROL_DEFINITIU_COPILOT_GESTIO_GARANTIES.md*
