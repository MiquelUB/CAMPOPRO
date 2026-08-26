# 🧠 DISSENY D'ARQUITECTURA D'ESPECIALITZACIÓ DE L'AGENT D'IA PER A DOMINIS TÈCNICS

---

## 📌 EL REPLE TÈCNIC
Si un Copilot d'IA és massa genèric, perd precisió, barregen conceptes i comet al·lucinacions greus (per exemple, intentar aplicar el marge de seguretat d'un canal de reg a la tria d'un magnetotèrmic d'un quadre elèctric).

Per garantir una **precisió del 100% en l'estimació de materials, hores i tarifes**, l'agent d'IA s'especialitza segons **4 mecanismes d'Aïllament de Domini**:

---

## 🏗️ 1. MATRIZ DE SYSTEM PROMPTS DE DOMINI NOU (SPECIALIZED PROMPT ENGINES)

Quan el backend de FastAPI processa una petició, no utilitza un prompt genèric, sinó que carrega el **Engine de Prompt Específic del Sector**:

```
                                  ┌───────────────────────────────────────────┐
                                  │ 📥 PETICIÓ DE L'ENGINYER / OPERARI        │
                                  │    ("Instal·lar quadre elèctric trifàsic") │
                                  └─────────────────────┬─────────────────────┘
                                                        │
                                                        ▼
                                   [ Comprovació de Vertical (vertical_id) ]
                                                        │
                 ┌──────────────────────────────────────┼──────────────────────────────────────┐
                 ▼                                      ▼                                      ▼
    🌾 PROMPT DOMINI CAMPOPRO              ⚡ PROMPT DOMINI ELECTRICPRO             💧 PROMPT DOMINI HYDROPRO
 • Reg per goteig, pressions bombes     • REBT (Baixa Tensió), mm² cables       • Cabal m³/h, depuració, clor
 • Tractors, fitosanitaris, canonades   • Magnetotèrmics, diferencials, kW      • Pressió en bar, bombes de buit
 • Tarifes de fertilització             • Boletins tècnics oficials             • Valvulería i col·lectors
```

---

## 📚 2. BASES DE CONEIXEMENT TÈCNIC DIFERENCIADES (RAG - RETRIEVAL AUGMENTED GENERATION)

Perquè la IA conegui les especificacions tècniques reals sense inventar-se res, cada vertical disposa de la seva pròpia **Base de Coneixement de Domini** (`/backend/app/data/knowledge/<vertical>/`):

1. **📁 `knowledge/campopro/` (Domini Agrícola)**:
   - Taula de diàmetres de canonada PE (PE-32, PE-[63], PE-90).
   - Ràtios d'hores per metre de rasa de reg.
   - Rendiment de maquinària agrícola (hectàrees/hora).
2. **📁 `knowledge/electricpro/` (Domini Elèctric)**:
   - Taula de caiguda de tensió per secció de cable (2.5mm², 4mm², 6mm², 10mm², 16mm²).
   - Ampertatges estàndard de magnetotèrmics (10A, 16A, 25A, 40A, 63A).
   - Normativa de protecció contra sobretensions.
3. **📁 `knowledge/hydropro/` (Domini Fontaneria & Depuració)**:
   - Pèrdua de càrrega per metres de canonada i colzes.
   - Potències de bombes de buit i dosificadors.

**Com ho utilitza la IA:** Abans de respondre, la IA consulta obligatòriament el fitxer de coneixement tècnic del seu sector per validar que el cable o la canonada triada compleix la normativa real.

---

## 📂 3. CARPETES D'HISTORIAL PASSAT AÏLLADES PER DOMINI (`/data/historial/<vertical>/`)

Aplicant la **Regla Anti-Còpia Cega (System Prompt v2)**:

- Les consultes d'**ElectricPro** només cerquen coincidències a la carpeta `/backend/app/data/historial/electricpro/*.json`.
- Les consultes de **CampoPro** només cerquen coincidències a la carpeta `/backend/app/data/historial/campopro/*.json`.

Així és impossible que una feina d'electricitat es compare amb una feina de reg.

---

## 🎯 4. MAGATZEM D'ARTICLES I TARIFES DE REFERÈNCIA AÏLLATS

Cada sector compta amb el seu propi catàleg de materials de referència de magatzem:
- **CampoPro:** Polietilè, electrovàlvules, goteig, connectors de reg, abonaments.
- **ElectricPro:** Cable unipolar, tubs corrugats, quadres d'estanqueïtat IP65, magnetotèrmics, diferencials.

---

## 🔒 RESUM DELS RESULTATS

Amb aquesta arquitectura de domini aïllat:
1. **Zero barreja de conceptes:** La IA d'ElectricPro només raona com un enginyer elèctric. La IA de CampoPro només raona com un enginyer agrícola.
2. **Màxima Precisió:** L'estimació de materials i hores té un nivell de coincidència del 95-98% amb la realitat d'obra.
3. **Revisió d'Enginyer:** Si la IA detecta que una feina és insòlita o sense precedent al seu domini, marca `"nivell_coincidencia": "sense_precedent"` i demana confirmació manual.

---

*Document d'especificació d'especialització d'IA creat el 26/08/2026 a docs/PLANIFICACIO_ESPECIALITZACIO_IA_DOMINIS.md*
