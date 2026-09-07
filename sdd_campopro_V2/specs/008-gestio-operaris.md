# Spec 008 — Mòdul de Gestió d'Operaris i Rendiment de Camp (/gestio/operaris)

## Context i Objectiu

El mòdul de Gestió d'Operaris i Rendiment de Camp (`/gestio/operaris`) és la **Torre de Control de Recursos Humans Tècnics, Organització de Colles i Auditoria Laboral** de CampoPro Suite. Centralitza la supervisió integral de la plantilla tècnica que opera sobre el terreny (5 a 50 operaris), connectant l'activitat realitzada a camp (fitxatges d'inici/fi, registre d'eines, fotos d'ordres de treball, consums i incidències) amb la direcció tècnica, recursos humans i administració de l'empresa.

Aquest mòdul **no pretén ser un portal de nòmines o gestoria laboral externa**, sinó l'eina de coordinació operativa i compliment legal en temps real que:

1. Centralitza la **Fitxa 360° de l'Operari** estructurada en 8 dimensions tècniques: Dades Personals i Contacte, Control Horari Oficial (RDL 8/2019), Composició de Colles de Camp, Historial de Tasques Executades, Valoracions de Clients, Custòdia de Vehicles i Quilometratge, Eines Assignades (referenciades estrictament per número de sèrie, marca i model, **sense codis QR**) i Historial d'Incidències de Camp.
2. Garanteix el **Compliment Estricte del Registre de Jornada Laboral (Reial Decret-Llei 8/2019)**: audita les hores treballades mitjançant la ingesta asíncrona dels fitxatges registrats a la PWA mòbil, aplica el **tancament automàtic a les 8 hores** en cas d'oblit de l'operari segons la modalitat de jornada de l'empresa (sencera o partida, parametritzada a `/gestio/configuracio`), i reserva la regularització d'anomalies i el còmput d'hores extraordinàries exclusivament a **Secretaria / RRHH i Boss**, aplicant un registre d'auditoria immutable.
3. Permet a l'**Enginyer Tècnic** articular la **composició operativa de colles per tasca**: des de la figura del Cap de Colla pengen un o més operaris per a l'execució d'una ordre de treball concreta, bloquejant preventivament l'assignació d'aquells treballadors o caps que figurin en estat de `VACANCES` o `BAIXA`.
4. Governa la **custòdia de recursos corporatius (vehicles i eines)** sota competència exclusiva de Secretaria/Boss: tracta qualsevol canvi o traspàs d'eina entre treballadors com una incidència formal, i inhabilita automàticament als selectors de feina aquells equips marcats com a `EN_REPARACIO` o `PERDUDA`.
5. Canalitza la **resolució d'incidències immediates de camp a càrrec de l'Enginyer**: atenció a bloquejos d'accés, avaries de maquinària, petició de grua, sol·licitud de materials no previstos i reassignació dinàmica d'operaris mitjançant la creació o adaptació de la fulla de tasca, garantint una **traçabilitat triple** (historial d'incidències, fulla de tasca i historial de l'operari).
6. Administra la **seguretat de credencials i el cicle de vida del treballador**: alta de treballadors, generació i tramesa de PIN d'accés a la PWA mitjançant SMS, desbloqueig administratiu després de 4 intents fallits, visibilitat pública del cost/hora a la web per a pressupostació d'obres amb edició restringida a RRHH/Boss, i procediment d'inactivació laboral amb traspàs de custòdia d'equipament al Cap de Colla i revocació criptogràfica immediata de sessions.
7. Aplica el principi de **Tolerància Zero a Dades Fictícies (*Zero Mock Data*)**, emmagatzematge sobirà en discs locals i servidor Hetzner a Alemanya (zero AWS S3), i aïllament multi-inquilí estricte mitjançant Row Level Security (RLS).

---

## Usuaris / Actors i Matriu d'Accés (Zero-Trust)

El sistema garanteix l'aïllament multi-inquilí mitjançant Row Level Security (RLS) mandatori a nivell de base de dades (`empresa_id`) i una segregació estricta de responsabilitats (*Separation of Duties*):

* **Boss (Gerència / Propietari):** Accés complet i irrestricto a totes les funcionalitats de `/gestio/operaris`. Pot crear, editar, suspendre o desactivar operaris; visualitzar i editar el cost hora de la plantilla; modificar i auditar els registres del control horari; generar o restablir el PIN d'accés PWA; transferir eines i vehicles; i consultar els registres històrics d'operaris donats de baixa.
* **Secretaria / RRHH:** Responsable principal de l'administració de personal. Realitza l'alta i baixa d'operaris; edita dades personals, contacte i permisos de conduir; genera i envia el PIN d'accés per SMS; desbloqueja comptes suspesos per intents fallits; audita i rectifica fitxatges de jornada sota RDL 8/2019; gestiona el còmput d'hores extraordinàries; assigna vehicles habituals i eines de treball; i edita el cost hora laboral.
* **Enginyer / Supervisor Tècnic:** Responsable de la planificació i execució tècnica a camp. Pot visualitzar la llista d'operaris actius, les seves especialitats, el vehicle habitual, les eines operatives assignades i el cost hora (necessari per al càlcul de pressupostos i costos de mà d'obra de projecte). Configura les colles operatives per tasca (assignant operaris sota un Cap de Colla). Resol incidències tècniques immediates a camp (reassignació d'operaris, adaptació de fulles de tasca, avís de grua o part de material perdut). **VETO TOTAL I ESTRICTE a nivell de backend (HTTP 403 Forbidden) sobre l'accés o modificació del Control Horari (`shifts`), el restabliment de PIN/credencials i l'edició del cost hora o dades salarials.**
* **Operari de Camp / Capataz (`/operari`):** No té accés a la interfície web de gestió (`/gestio/operaris`). Opera exclusivament a través de la PWA mòbil de camp, des d'on registra la seva jornada, cronòmetres de tasca, fotos obligatòries, odòmetre de vehicles i notes d'incidència.
* **Client Final (Canal Telegram / Web Externa):** Receptor dels serveis executats. No accedeix a aquest mòdul.

### Matriu de Permisos per Rol

| Àmbit Funcional | Boss | Secretaria / RRHH | Enginyer Tècnic | Operari PWA |
|---|---|---|---|---|
| Llistat d'operaris i Fitxa 360° | Lectura / Escriptura | Lectura / Escriptura | Lectura | Sense accés web |
| Alta i Baixa d'Operaris (`actiu`) | Total | Total | Denegat (403) | Sense accés web |
| Control Horari Legal (RDL 8/2019) | Lectura / Edició / Auditoria | Lectura / Edició / Auditoria | Denegat (403) | Fitxatge PWA |
| Còmput d'Hores Extres | Lectura / Aprovació | Lectura / Càlcul | Denegat (403) | Sense accés web |
| Composició de Colles per Tasca | Total | Total | Creació / Assignació | Consulta PWA |
| Assignació de Vehicles i Eines | Total | Total | Denegat (403) | Custòdia PWA |
| Transferència d'Eines (Incidència) | Aprovació / Resolució | Tramitació | Consulta / Part | Report PWA |
| Generació / Reset de PIN (SMS) | Total | Total | Denegat (403) | Recepció SMS |
| Visualització Cost/Hora Treballador | Visible | Visible | Visible (Càlcul Obra) | Ocult |
| Edició Cost/Hora Treballador | Edició | Edició | Denegat (403) | Denegat |
| Resolució Incidències Immediates | Supervisió / Resolució | Recepció parts | Resolució Operativa | Report PWA |
| Consulta Historial Operaris Baixa | Total | Total | Denegat (Ocult) | Denegat |

---

## Requisits Funcionals (EARS Notation)

### Àmbit 1: Fitxa 360° de l'Operari i Llistat de Plantilla

- **RF-01 (Ubiquitous):** El sistema ha de presentar a `/gestio/operaris` el directori complet d'operaris en plantilla de l'empresa autenticada, mostrant per a cadascun el seu nom, NIF, rol tècnic (Cap de Colla / Oficial), especialitat, telèfon corporatiu, estat operatiu (`DISPONIBLE`, `EN_FEINA`, `VACANCES`, `BAIXA`), vehicle habitual assignat i indicador de Cap de Colla (👑).
- **RF-02 (Ubiquitous):** El sistema ha de calcular i mostrar a la capçalera de `/gestio/operaris` el conjunt de mètriques consolidades d'operacions: Total Operaris en Plantilla, Valoració Mitjana de Clients, Percentatge de Compliment del Control Horari d'avui, Quilòmetres Conduïts de Flota aquest mes i Total d'Eines Assignades en Ús, operant estrictament sobre dades reals i mostrant estats buits ("—" o "0") en absència de registres (*Zero Mock Data*).
- **RF-03 (Event-driven):** Quan l'usuari introdueixi un terme a la barra de cerca de la pàgina, el sistema ha de filtrar en temps real la quadrícula d'operaris coincidint per nom de treballador, rol professional o especialitat tècnica.
- **RF-04 (Event-driven):** Quan l'usuari seleccioni la targeta d'un operari, el sistema ha d'obrir el modal/panell de la Fitxa 360° articulat en les 8 dimensions independents: Dades Personals (`info`), Control Horari (`shifts`), Colla de Camp (`crew`), Tasques Realitzades (`jobs`), Ressenyes (`reviews`), Vehicles i Km (`vehicles`), Eines Assignades (`tools`) i Incidències (`incidents`).
- **RF-05 (Ubiquitous):** El sistema ha de mostrar a la pestanya `info` les dades identificatives del treballador: NIF, telèfon mòbil corporatiu, correu electrònic, data d'incorporació a l'empresa, tipus de permís de conduir i acreditacions tècniques registrades.

### Àmbit 2: Control Horari Legal (RDL 8/2019) i Gestió d'Anomalies

- **RF-06 (Ubiquitous):** El sistema ha de registrar els fitxatges de jornada laboral dels operaris de manera asíncrona, emmagatzemant a la base de dades central l'hora real de marcatge d'entrada i sortida, les coordenades geogràfiques i l'estat del registre (`EN_CURS`, `COMPLERT`, `INCIDENCIA`), un cop transmesos des de la memòria local de la PWA mòbil en disposar de cobertura.
- **RF-07 (State-driven):** Mentre un operari mantingui la jornada oberta i se superi el llindar de 8 hores sense que hagi marcat la sortida, el sistema ha d'executar el tancament automàtic de la jornada calculant el temps segons la modalitat de jornada laboral configurada per a l'empresa a `/gestio/configuracio` (jornada continuada o jornada partida), marcant el registre amb l'estat `INCIDENCIA` i l'etiqueta "Tancament automàtic per omissió de sortida".
- **RF-08 (Event-driven):** Quan un usuari amb rol `Secretaria`, `RRHH` o `Boss` accedeixi a la pestanya `shifts` d'un operari, el sistema ha de permetre la revisió detallada de les entrades, sortides, geolocalització d'inici/fi i còmput d'hores, habilitant la rectificació manual de registres erronis o incomplets.
- **RF-09 (Unwanted-behaviour):** Si un usuari amb rol `Enginyer` intenta accedir a la pestanya de Control Horari (`shifts`) o invocar qualsevol endpoint del registre de jornada (`/api/v1/gestio/operaris/{id}/shifts`), el sistema ha de denegar l'accés immediatament amb un codi d'error HTTP 403 Forbidden, mantenint la privacitat laboral del treballador.
- **RF-10 (Ubiquitous):** Quan es produeixi una rectificació manual d'un registre horari per part de Secretaria/RRHH/Boss, el sistema ha d'enregistrar una traça immutable d'auditoria amb l'identificador de l'usuari que modifica, la data i hora exacta de l'acció, els valors anteriors, els nous valors i el motiu justificatiu requerit, en compliment de les exigències de la Inspecció de Treball.
- **RF-11 (Ubiquitous):** El sistema ha de calcular i posar a disposició de Secretaria/RRHH el sumatori mensual d'hores efectives treballades per operari enfront del còmput teòric del conveni, totalitzant les hores extraordinàries registrades per a la seva compensació o liquidació en nòmina.

### Àmbit 3: Composició de Colles i Jerarquia per Tasca

- **RF-12 (State-driven):** Quan un operari tingui actiu el rol de Cap de Colla (`isTeamLeader = true`), el sistema ha d'habilitar a la seva Fitxa 360° la pestanya `crew` ("Equip / Colla de Camp"), mostrant el llistat d'oficials i ajudants vinculats al seu grup de treball.
- **RF-13 (Event-driven):** Quan un usuari amb rol `Enginyer`, `Secretaria`, `RRHH` o `Boss` planifiqui o adapti una ordre de treball, el sistema ha de permetre configurar la colla operativa necessària assignant un o més operaris sota la supervisió del Cap de Colla responsable d'aquella tasca.
- **RF-14 (Event-driven):** Quan Secretaria, RRHH o Boss afegeixin o desvinculin un operari d'un Cap de Colla a la pestanya `crew`, el sistema ha d'actualitzar el camp `cap_de_grup_id` del treballador a la base de dades i reflectir la nova composició immediatament.
- **RF-15 (State-driven):** Si un Cap de Colla o un operari es troba en estat `VACANCES` o `BAIXA`, el sistema ha de mostrar una insígnia visual destacada amb el motiu a la seva fitxa i ha d'inhabilitar la seva selecció als desplegables d'assignació d'ordres de treball, impedint que se li programin noves tasques.

### Àmbit 4: Assignació i Custòdia de Recursos (Vehicles i Eines)

- **RF-16 (Event-driven):** Quan un usuari amb rol `Secretaria` o `Boss` gestioni els actius d'un operari a les pestanyes `vehicles` i `tools`, el sistema ha de permetre assignar o desvincular el vehicle habitual de flota i les eines de treball de l'empresa.
- **RF-17 (Unwanted-behaviour):** Si un usuari amb rol `Enginyer` intenta modificar o reassignar directament el vehicle habitual o les eines assignades a la fitxa de l'operari, el sistema ha de bloquejar l'acció amb un error HTTP 403 Forbidden.
- **RF-18 (Ubiquitous):** El sistema ha de referenciar totes les eines de treball de la fitxa de l'operari exclusivament mitjançant el seu codi intern, número de sèrie de fabricant, marca, model, data d'assignació i estat operatiu (`OPERATIVA`, `EN_REPARACIO`, `PERDUDA`), quedant **terminantment exclòs l'ús de codis QR** per a eines.
- **RF-19 (State-driven):** Mentre una eina assignada tingui l'estat `EN_REPARACIO` o `PERDUDA`, el sistema ha d'inhabilitar la seva selecció als formularis de planificació de tasques mostrant de forma visible l'avís de no disponibilitat, evitant assignacions a obres que en requereixin l'ús.
- **RF-20 (Event-driven):** Quan es requereixi la transferència d'una eina d'un operari a un altre, el sistema ha de registrar aquesta acció formalment a través del circuit d'incidències, documentant l'origen, el nou receptor, el motiu del traspàs i l'actualització de custòdia.
- **RF-21 (Ubiquitous):** El sistema ha de registrar i mostrar a la pestanya `vehicles` l'historial de quilometratge de l'operari, visualitzant la data, matrícula del vehicle, quilòmetres d'inici i final de jornada, quilòmetres nets recorreguts i la fotografia de l'odòmetre validada mitjançant el servei OCR del backend.

### Àmbit 5: Supervisió i Resolució d'Incidències de Camp

- **RF-22 (Ubiquitous):** El sistema ha de recopilar i mostrar a la pestanya `incidents` de la Fitxa 360° totes les incidències reportades per l'operari des del terreny, mostrant el codi d'incidència, data i hora, títol, reproductor de la nota d'àudio nativa enregistrada a camp, fotografies associades, diagnòstic de l'assistent d'IA i partida de pressupost addicional si s'ha generat.
- **RF-23 (Event-driven):** Quan l'Enginyer Tècnic rebi una incidència operativa que bloquegi la continuïtat d'una obra (ex. avaria de vehicle, accés impedit, necessitat de materials imprevistos), el sistema ha de facultar l'Enginyer per executar la resolució immediata: sol·licitar servei de grua, trametre comunicació interna a Secretaria de materials/eines perdudes, o reassignar personal generant o modificant la fulla de tasca corresponent.
- **RF-24 (Ubiquitous):** El sistema ha de garantir la traçabilitat triple obligatòria de qualsevol incidència operativa, vinculant i reflectint automàticament l'esdeveniment i la seva resolució a:
  1. L'Historial Global d'Incidències de l'empresa.
  2. La Fulla de Tasca / Ordre de Treball afectada.
  3. L'Historial d'Incidències de la Fitxa 360° de l'operari implicat.

### Àmbit 6: Alta de Treballador, Seguretat de Credencials (PIN) i Cost Hora

- **RF-25 (Event-driven):** Quan un usuari amb rol `Secretaria`, `RRHH` o `Boss` doni d'alta un nou operari a `/gestio/operaris`, el sistema ha d'enregistrar les dades personals, NIF, telèfon corporatiu, especialitat i rol, procedint a generar un PIN numèric de 4 dígits per a la PWA mòbil i enviant-lo automàticament al telèfon de l'operari mitjançant un missatge SMS securitzat.
- **RF-26 (State-driven):** Si un operari introdueix un PIN incorrecte 4 vegades consecutives a la seva PWA mòbil, el sistema ha de registrar l'estat de bloqueig de seguretat del compte i generar una alerta a la central, requerint que Secretaria/RRHH/Boss emeti una nova clau des de `/gestio/operaris`, transmesa de nou exclusivament via SMS.
- **RF-27 (Ubiquitous):** El sistema ha de permetre a qualsevol usuari autenticat a la plataforma web (inclòs el rol `Enginyer`) visualitzar el cost/hora assignat a cada operari, facilitant el còmput exacte de costos en la confecció de pressupostos i anàlisi de rendibilitat d'obra.
- **RF-28 (Unwanted-behaviour):** Si un usuari amb rol `Enginyer` intenta modificar o desar un nou valor de cost/hora sobre la fitxa d'un treballador, el sistema ha de rebutjar la petició amb un error HTTP 403 Forbidden, reservant la capacitat d'edició exclusivament a `Secretaria`, `RRHH` i `Boss`.

### Àmbit 7: Inactivació / Baixa d'Operari i Reversió de Custòdia

- **RF-29 (Event-driven):** Quan Secretaria, RRHH o Boss tramitin la baixa o desactivació d'un operari (`actiu = false`), el sistema ha de transferir automàticament la responsabilitat legal de custòdia del vehicle i les eines assignades al Cap de Colla del seu grup (o al nou Cap de Colla designat), el qual haurà de formalitzar el trasllat físic i devolució del material a la base de l'empresa.
- **RF-30 (Event-driven):** En confirmar-se la baixa de l'operari, el sistema ha de revocar de forma immediata totes les claus criptogràfiques, el PIN d'accés a la PWA i les sessions JWT actives registrades a la llista negra de Redis, impedint qualsevol accés o sincronització posterior des del seu dispositiu mòbil.
- **RF-31 (State-driven):** Quan un operari figuri en estat inactiu o de baixa, el sistema ha d'ocultar el seu perfil dels desplegables operatius de planificació de feines i composició de colles, preservant el seu historial complet a la base de dades per a fins d'auditoria i traçabilitat legal, accessible exclusivament per a consultes de `Secretaria`, `RRHH` i `Boss`.

### Àmbit 8: Auditoria de Feines Executades i Valoracions de Clients

- **RF-32 (Ubiquitous):** El sistema ha de mostrar a la pestanya `jobs` l'historial complet d'ordres de treball finalitzades per l'operari, visualitzant el codi d'ordre, títol, client, data d'execució, hores imputades, cost d'execució, factura vinculada i la **seqüència fotogràfica obligatòria de 3 etapes**:
  1. Fotografia d'Estat Inicial (abans d'iniciar la feina).
  2. Fotografia Intermèdia de Procés (reparació, rasa o substitució de component en curs).
  3. Fotografia Final de Feina Conclosa.
- **RF-33 (Event-driven):** Quan l'usuari premi el botó "Veure Fitxa" sobre qualsevol tasca de l'historial, el sistema ha d'obrir el modal de detall de la feina amb la descripció del parte de treball, dades de contacte del client, ubicació amb coordenades GPS i accés directe a la fitxa del client o a la descàrrega de la factura generada.
- **RF-34 (Ubiquitous):** El sistema ha de presentar a la pestanya `reviews` les valoracions i comentaris emesos pels clients respecte a l'operari (puntuació global sobre 5.0 estrelles i desglossament per Professionalitat, Puntualitat i Tracte Humà), mostrant un estat buit explícit ("Sense ressenyes escrites registrades actualment") quan no existeixin registres reals.

---

## Taula de Casos Límit i Gestió d'Errors

| Cas Límit / Situació d'Error | Condició Desencadenant | Comportament Esperat del Sistema |
|---|---|---|
| **Fitxatge amb PWA Offline prolongada** | L'operari fitxa entrada/sortida en zones rurals sense connexió GSM durant tota la jornada. | La PWA emmagatzema les marques temporals locals xifrades a `IndexedDB`. En recuperar la cobertura o finalitzar el dia, la cua de sincronització envia els registres al backend. La web `/gestio/operaris` mostra les hores exactes marcades en local sense penalització de retard de transmissió. |
| **Oblit de marcatge de Sortida** | L'operari finalitza la seva jornada però oblida prémer el botó de sortida a la PWA mòbil. | En transcórrer 8 hores des de l'entrada, el backend executa el tancament automàtic considerant la configuració de jornada de l'empresa (sencera o partida a `/gestio/configuracio`). El registre queda marcat com a `INCIDENCIA` per a revisió i regularització de Secretaria/RRHH. |
| **Bloqueig de PIN per 4 intents fallits** | L'operari s'equivoca 4 cops consecutius en introduir el PIN a la PWA. | La PWA es bloqueja completament i destrueix la sessió local. Es genera una alerta de seguretat a central. Secretaria o Boss han d'emetre un nou PIN des de `/gestio/operaris`, el qual s'envia de forma automàtica al treballador via SMS. |
| **Intents d'accés de l'Enginyer a Horaris** | L'Enginyer Tècnic intenta visualitzar o editar els registres horaris d'un operari a través de la web o crides API directes. | El backend bloqueja la petició amb HTTP 403 Forbidden. A la interfície web, la pestanya `shifts` es manté oculta o deshabilitada per al rol `Enginyer`. |
| **Intent d'edició salarial per l'Enginyer** | L'Enginyer Tècnic intenta alterar el cost/hora laboral d'un treballador. | El camp es presenta en mode només lectura a la UI. Qualsevol petició `PATCH` o `PUT` enviada per l'Enginyer sobre camps salarials és rebutjada pel backend amb codi 403. |
| **Cap de Colla de Baixa o Vacances** | L'Enginyer intenta planificar una ordre de treball assignant un Cap de Colla amb estat `BAIXA` o `VACANCES`. | El sistema impedeix seleccionar aquest Cap de Colla als selectors de la tasca, mostrant l'avís d'inactivitat. L'Enginyer ha de seleccionar un Cap de Colla alternatiu o crear una composició temporal amb un altre líder operatiu. |
| **Eina danyada o en reparació** | Una eina assignada a un operari es troba en estat `EN_REPARACIO` o `PERDUDA`. | Al diàleg d'assignació d'eines per a una feina, l'equip apareix inhabilitat amb l'etiqueta vermella "En reparació" o "Perduda", impedint que es planifiqui una feina dependent d'aquesta eina. |
| **Transferència d'eina entre operaris** | Un operari cedeix una eina a un altre operari a camp. | L'acció no es fa per canvi directe de camp; s'obre una incidència formal a través del sistema. Secretaria o Boss validen la incidència i transfereixen la custòdia registrant la traça. |
| **Inactivació de treballador amb actius vius** | Secretaria tramita la baixa laboral d'un operari que té vehicle i eines sota la seva custòdia. | El sistema assigna automàticament la responsabilitat de devolució al Cap de Colla o nou líder designat. Es revoquen de forma instantània el PIN de la PWA i els tokens JWT a Redis. |
| **Inexistència de ressenyes o valoracions** | Un operari nou o sense ressenyes de clients s'obre a la Fitxa 360°. | El sistema mostra l'indicador de valoració com a "—" i el missatge "Sense ressenyes escrites registrades actualment", complint estrictament la regla *Zero Mock Data* sense inventar notes ni comentaris ficticis. |
| **Absència de foto en alguna etapa de feina** | Una ordre de treball es dona per acabada a camp però li falta la foto intermèdia o final del protocol de 3 fotografies. | A la pestanya `jobs` de la fitxa de l'operari, la tasca es mostra amb un indicador d'avís groc "Evidència fotogràfica incompleta", permetent al supervisor auditar la conformitat abans de tancar definitivament la feina. |

---

## Fora d'Abast (Out of Scope)

Per garantir la claredat i mantenibilitat del sistema, queden **explícitament excloses** de l'abast d'aquest mòdul les següents funcionalitats:

1. **Confecció de Nòmines i Liquidacions Oficials:** El càlcul de retencions d'IRPF, quotes de Seguretat Social de treballador/empresa, deduccions per contingències comunes i generació dels models tributaris oficials (Models 111 i 190) queda fora d'abast, sent competència exclusiva del programari de nòmines de la gestoria laboral externa.
2. **Contractació Laboral i Gestió Jurídica:** L'alta/baixa telemàtica al sistema RED de la Seguretat Social, redacció de contractes de treball i gestió d'expedients d'acomiadament o convenis col·lectius es deleguen fora de l'aplicació.
3. **Biometria d'Impremta Dactilar o Facial:** Queda exclòs l'ús de sensors biomètrics especials de maquinari o reconeixement facial a la interfície web per a la identificació d'operaris. L'accés es basa estrictament en telèfon corporatiu i PIN de 4 dígits a la PWA mòbil, i credencials completes amb 2FA a la web de gestió.
4. **Codis QR per a Eines:** Queda formalment exclòs el suport, generació o lectura de codis QR sobre eines de treball. La identificació i custòdia d'equips es realitza estrictament mitjançant el número de sèrie, marca i model del fabricant.
5. **Manipulació de Dades Fictícies:** Queda prohibit incorporar registres dummy o dades simulades de treballadors, fitxatges o puntuacions a qualsevol endpoint o component de la interfície web.

---

## Criteris de Finalització (Definition of Done) i Matriu de Traçabilitat

Per considerar el mòdul `/gestio/operaris` plenament completat i apte per a producció, s'ha de verificar el compliment de la següent matriu de traçabilitat:

| Requisit Funcional (EARS) | Descripció Resumida | Mètode de Verificació / Criteri d'Èxit |
|---|---|---|
| **RF-01** | Directori complet d'operaris a `/gestio/operaris` | Test de renderitzat del directori validant NIF, rol, estat operatiu i vehicle. |
| **RF-02** | Mètriques globals consolidades a la capçalera | Test d'agregació comprovant que mostra dades reals i estats buits en l'arrencada Dia 0 (*Zero Mock Data*). |
| **RF-03** | Filtratge dinàmic de la quadrícula per cerca | Test unitari de filtratge per nom, rol i especialitat. |
| **RF-04** | Obertura de la Fitxa 360° en 8 dimensions | Test de navegació modal verificant la presència de les 8 pestanyes independents. |
| **RF-05** | Dades personals i de contacte a la pestanya `info` | Test d'integritat de camps NIF, telèfon, email i llicència de conduir. |
| **RF-06** | Ingesta asíncrona de fitxatges des de PWA | Test d'integració amb payload de fitxatge PWA emmagatzemat correctament a base de dades. |
| **RF-07** | Tancament automàtic de jornada a les 8 hores | Test de tasca programada/backend comprovant el tancament per omissió amb estat `INCIDENCIA`. |
| **RF-08** | Revisió i regularització de jornada per RRHH/Boss | Test d'edició de registres d'entrada/sortida per usuari amb rol Secretaria/RRHH. |
| **RF-09** | Veto d'accés a Control Horari per al rol Enginyer | Test d'autorització verificant HTTP 403 Forbidden en peticions de l'Enginyer sobre endpoints de `shifts`. |
| **RF-10** | Traça immutable d'auditoria en rectificacions | Test de base de dades comprovant l'escriptura a la taula d'auditoria amb autor, data i motiu. |
| **RF-11** | Còmput i totalització d'hores extres mensuals | Test de càlcul matemàtic d'hores treballades vs jornada legal per a RRHH. |
| **RF-12** | Habilitació de pestanya `crew` per a Caps de Colla | Test de visualització condicional segons la propietat `isTeamLeader = true`. |
| **RF-13** | Configuració operativa de colles per tasca per l'Enginyer | Test de creació d'assignació d'operaris a una tasca sota un Cap de Colla actiu. |
| **RF-14** | Vinculació/desvinculació d'operaris a una colla | Test d'actualització de `cap_de_grup_id` en afegir o treure un treballador de la colla. |
| **RF-15** | Bloqueig d'assignació per estat `VACANCES` o `BAIXA` | Test de validació als selectors impedint l'assignació d'operaris no disponibles. |
| **RF-16** | Assignació de vehicles i eines per Secretaria/Boss | Test de modificació d'actius assignats per usuaris administradors. |
| **RF-17** | Bloqueig de canvi d'actius per al rol Enginyer | Test de seguretat validant rebuig 403 Forbidden si l'Enginyer intenta modificar eines o vehicles assignats. |
| **RF-18** | Identificació d'eines per sèrie/marca/model (Zero QR) | Verificació de l'esquema de dades comprovant l'absència de camps o requeriments QR per a eines. |
| **RF-19** | Inhabilitació d'eines en reparació o perdudes | Test de formulari comprovant que equips no operatius no es poden seleccionar per a tasques. |
| **RF-20** | Tramitació de transferència d'eines com a incidència | Test del circuit d'incidència formal per formalitzar el traspàs d'eines entre treballadors. |
| **RF-21** | Registre d'odòmetre amb foto i validació OCR | Test del servei OCR processant la imatge del quadre de comandaments i quadrant km recorreguts. |
| **RF-22** | Historial d'incidències de camp a la pestanya `incidents` | Test de renderitzat d'àudios natius, imatges i memòries d'incidència enviades des del terreny. |
| **RF-23** | Resolució immediata d'incidències per l'Enginyer | Test de flux d'Enginyer reassignant personal o adaptant la fulla de tasca arran d'una incidència. |
| **RF-24** | Traçabilitat triple de la incidència | Test d'integració verificant la presència de la incidència a historial global, tasca i fitxa d'operari. |
| **RF-25** | Alta d'operari i enviament de PIN per SMS | Test del servei d'alta creant el registre i disparant la notificació SMS amb el PIN de 4 dígits. |
| **RF-26** | Bloqueig per 4 intents de PIN i reset per SMS | Test de seguretat bloquejant el compte al 4t intent i generant nova clau enviada per SMS des de gestió. |
| **RF-27** | Visibilitat del cost/hora per a tothom a la web | Test d'accés confirmant que el rol Enginyer pot llegir el cost hora per calcular pressupostos. |
| **RF-28** | Bloqueig d'edició del cost/hora per a l'Enginyer | Test d'API confirmant que crides d'edició del cost/hora per part de l'Enginyer retornen 403 Forbidden. |
| **RF-29** | Traspàs de custòdia d'actius al Cap de Colla en baixa | Test del protocol de baixa assignant la devolució d'eines i vehicles al Cap de Colla responsable. |
| **RF-30** | Revocació immediata de credencials PWA i sessions JWT | Test de seguretat comprovant la invalidació del PIN i la inclusió dels tokens a la llista negra de Redis. |
| **RF-31** | Ocultació d'operaris de baixa per a tasques | Test de llistats operatius verificant que els treballadors inactius no apareixen en noves planificacions. |
| **RF-32** | Historial de tasques amb seqüència de 3 fotos | Test de renderitzat d'ordres completades verificant fotos inicial, de procés i final de feina. |
| **RF-33** | Modal de detall de tasca completada | Test de navegació modal desplegant descripció de part, client, coordenades GPS i enllaços. |
| **RF-34** | Valoracions de clients amb estat buit real | Test de la pestanya `reviews` mostrant "Sense ressenyes escrites registrades" en absència de dades. |
