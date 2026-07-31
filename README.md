# 🌱 CampoPro 2.0

Benvinguts al repositori oficial de **CampoPro**, la plataforma definitiva de gestió per a empreses agrícoles i tècnics de camp, desenvolupada amb una arquitectura moderna *Offline-First* i capacitats d'Intel·ligència Artificial.

## 🚀 Arquitectura i Tecnologies

CampoPro està dividit en múltiples serveis altament eficients i escalables:

- **Frontend (PWA)**: Desenvolupat amb `Next.js 14`, `React`, `TailwindCSS` i `Workbox` (Service Workers i IndexedDB) per permetre que els tècnics operin als camps sense cobertura (Offline-First).
- **Backend (API)**: Desenvolupat amb `FastAPI` (Python 3.12), oferint alt rendiment gràcies al processament asíncron (`asyncio` i `asyncpg`).
- **Base de dades**: `PostgreSQL 15` protegida amb polítiques de seguretat RLS (Row Level Security) aïllant completament la informació entre diferents empreses.
- **Cues i Tasques**: `Redis` i `Celery` per al processament asíncron (ex: generació de PDFs pesats, avaluacions de la IA o missatgeria massiva).
- **IA**: Connectivitat amb `OpenRouter` i Kimi K2 Vision (Model LLM M36) per a Processament Òptic (OCR de km de furgonetes, factures) i detecció intel·ligent de materials segons el plànol.

## 🛠 Com començar (Desenvolupament Local)

Per executar tot l'entorn de manera local, la via més fàcil és a través de **Docker Compose**. Això arrencarà la Base de Dades, Redis, el Backend, els Workers de Celery i Nginx.

```bash
# 1. Clona el repositori
git clone https://github.com/MiquelUB/CAMPOPRO.git
cd CAMPOPRO

# 2. Inicia tota l'arquitectura de microserveis
cd infra
docker compose up --build -d
```

### Servidor de Desenvolupament (Frontend en Viu)
Si vols desenvolupar el frontend i veure els canvis en temps real (Hot Reload):

```bash
cd pwa
npm install
npm run dev
```
La PWA i el Dashboard estaran accessibles a `http://localhost:3000`.

## 📦 Estructura del Projecte

- `/backend`: Lògica de negoci, endpoints de l'API (FastAPI), models de base de dades i connexions d'IA.
- `/pwa`: Interfície d'usuari desenvolupada en Next.js. Inclou el Dashboard de Gestió (`/gestio`) i l'entorn simplificat per operaris (`/operari`).
- `/db`: Migracions de base de dades, esquemes i polítiques de seguretat (RLS).
- `/infra`: Arxius de configuració `docker-compose`, regles de Nginx i *secrets* de la infraestructura.
- `/docs`: Documentació, regles de negoci i guies de desenvolupament (Guia Mestre).

## 🔒 Seguretat i Privacitat

CampoPro està dissenyat amb el model *Zero-Trust* al capdavant. El Backend sanititza exhaustivament qualsevol intent de *Prompt Injection* abans d'enviar imatges o text a la Intel·ligència Artificial. A més, els *Magic Bytes* (MIME types) són validats abans de guardar cap arxiu al servidor. Totes les rutes incorporen limitació de velocitat (Rate-Limiting).

## ☁️ Desplegament a Producció

Pots desplegar fàcilment aquest repositori utilitzant gestors com **EasyPanel**, on només has d'apuntar l'App `Backend` cap a la carpeta `/backend` i l'App `Frontend` cap a `/pwa`. Fes un cop d'ull a la guia completa a la carpeta de `/docs`.
