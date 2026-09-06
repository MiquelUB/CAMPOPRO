# Spec 005 — Seguiment Feines / Mapa (/gestio/feines/mapa)

> **AVISO DE CONSOLIDACIÓN ARQUITECTÓNICA:**  
> Esta especificación ha sido **fusionada e integrada en su totalidad dentro de `001-gestio-dashboard.md` (Spec 001 — Dashboard i Torre de Control Operativa /gestio)**, que asume el rol de Cockpit Único y Torre de Control Geográfica en tiempo real. Todas las rutas `/gestio/feines/mapa` e `/gestio/incidencies` quedan unificadas en `/gestio`.

## Contexto y objetivo
La pantalla de Seguimiento de Trabajos y Mapa (`/gestio/feines/mapa`) es la **Torre de Control Geográfica en Tiempo Real** y el **Centro Operativo de Resolución de Incidencias** de la empresa técnica. Conecta la actividad diaria de las cuadrillas en campo con el equipo de supervisión y gestión en oficina técnica.

Proporciona una visión territorial unificada donde conviven simultáneamente dos capas dinámicas principales (la ubicación física georreferenciada de las obras/clientes y la posición GPS real de las furgonetas/cuadrillas) junto a una capa técnica vectorial propia de la empresa (redes subterráneas, tuberías, cables, hidrantes y válvulas) y una capa de puntos de venta de suministros técnicos locales.

Integra en su propia interfaz el **Centro de Resolución de Incidencias en Tiempo Real** a través de un **Drawer lateral emergente**:
- Los menús y paneles laterales permanecen **ocultos por defecto para priorizar la visibilidad limpia y amplia del mapa**.
- El Drawer de incidencias **se abre automáticamente ante la recepción de cualquier nueva incidencia** reportada en campo para su atención inmediata (coexistiendo de forma armónica con el panel de órdenes del día sin destrucción mutua de estado), o manualmente haciendo **clic sobre la pestaña lateral derecha** o clicando en un pin rojo del mapa.
- La ruta `/gestio/incidencies` redirige automáticamente a `/gestio/feines/mapa?incidencies=obertes`, consolidando la gestión de incidencias en un único centro neurálgico sin dispersión de pantallas, **manteniendo marcadas y visibles todas las incidencias abiertas en el mapa hasta su efectiva resolución**, independientemente de la fecha en que se abrieron.
- Permite al supervisor escuchar audios de campo, revisar informes técnicos redactados por el **Copilot IA**, accionar llamadas telefónicas urgentes a clientes ante imprevistos críticos, **validar y aprobar humanamente antes de su envío** las hojas de aceptación de presupuestos extra remitidas al **Bot de Telegram del cliente**, activar el protocolo de grúa ante averías de flota desacoplando órdenes y gestionando transporte alternativo para los operarios de la furgoneta averiada, y localizar en el mapa ferreterías o distribuidores locales para verificar stock telefónicamente antes de desplazar a un operario o despachar un vehículo de auxilio (el cual cuenta con presencia GPS vía PWA y su propia hoja de tarea).
- **Trazabilidad Multinivel del Historial de Incidencias:** Las incidencias quedan redactadas e indexadas dentro de la **hoja de tarea activa** donde se produjeron; si atañen a un vehículo se reflejan en el **historial del vehículo en Flota** (Spec 006); y si han sido causadas por negligencia o mala praxis de un operario, quedan imputadas con precisión en el **expediente laboral del trabajador en RRHH** (al conductor real del siniestro mediante mecanismo de rectificación; al responsable de picking de nave ante olvidos de material con stock; y al capataz o custodio de herramienta en faltas operativas).
- **Mandato Constitucional Human-in-the-Loop:** Tanto el informe/presupuesto de ampliación para Telegram como todos los albaranes y liquidaciones finales de obra que proponga Copilot **requieren obligatoriamente la aprobación humana explícita del supervisor o Boss** antes de su envío al cliente o su pase a facturación (`/gestio/comptabilitat`).

Toda la cartografía se sustenta sobre motores y capas abiertas (*Open Source* vía Leaflet, OpenStreetMap y ortofotos satelitales PNOA/ESRI), sin dependencias de APIs comerciales de pago, cumpliendo estrictamente con el principio de Tolerancia Cero a Datos Ficticios (*Zero Mock Data* con Estado Día 0 real sustentado en las coordenadas oficiales de la empresa configuradas en onboarding).
- **Independencia del Estilo Camaleónico en el Mapa:** El diseño camaleónico rige la apariencia corporativa del software web y PWA (variables CSS HSL de marca para botones, barras y navegación), mientras que los colores de los iconos del mapa son estrictamente funcionales, cartográficos y universales, garantizando que los estados operativos sean inequívocos con independencia de los colores corporativos de la empresa cliente.
- **Almacenamiento Seguro en la Memoria Interna de la Empresa y Servidor Hetzner en Alemania:** Toda la información multimedia y documental reside directamente en la memoria interna y discos locales de la empresa y en el servidor Hetzner Cloud (Falkenstein / Nuremberg, Alemania - UE) bajo el árbol de rutas relativas:
  * Audios de notas de voz de incidencias: `/data/<empresa_id>/audios/incidencies/`
  * Fotografías periciales de incidencias: `/data/<empresa_id>/imatges/incidencies/`
  * Fotografías de apertura y cierre de faenas: `/data/<empresa_id>/imatges/obres/`
  * Planos técnicos y vectores de red: `/docs/<empresa_id>/planols/vectorials/`  
  Se elimina completamente cualquier servicio cloud externo (como AWS S3) para estricto cumplimiento del RGPD y soberanía absoluta de los datos. La base de datos almacena exclusivamente rutas relativas locales y metadatos técnicos con aislamiento multi-tenant mandatorio (RLS).

---

## Usuarios / actores y Matriz de Acceso
En la web de gestión (`/gestio`), esta pantalla es el centro de operaciones abierto a todos los perfiles, adaptando sus acciones operativas según su función:

- **Boss (Gerencia / Propietario):** Supervisión integral de la flota y despliegue territorial, resolución de incidencias graves desde el Drawer lateral, autorización de compras extraordinarias en ferreterías locales, asignación y reasignación de órdenes mediante *Drop and Go*, cambio de prioridades sobre la marcha, llamada directa a capataces, consulta de órdenes históricas y futuras, y **aprobación humana final de albaranes/presupuestos de Copilot para su derivación a facturación**.
- **Ingeniero / Supervisor Técnico:** Centro de mando técnico operativo bajo el principio de **"Una cuadrilla, un supervisor"**: seguimiento del estado de ejecución de obras, atención inmediata en el Drawer lateral ante incidencias emergentes (gestionando la lista por orden de urgencia y seguridad laboral), audición de notas de voz de operarios, revisión y **aprobación humana previa del informe y presupuesto de Copilot antes de remitirlo por Telegram al cliente**, llamada urgente al cliente ante imprevistos críticos (evaluando la confianza comercial del cliente si no responde a Telegram ni al teléfono), activación de grúas en averías de flota desacoplando tareas y coordinando transporte alternativo si las furgonetas cercanas no tienen plazas suficientes, comprobación de disponibilidad de herramientas en furgonetas cercanas mediante la finalización de tareas previas en la hoja de faena o localización cartográfica de ferreterías locales llamando previamente para asegurar stock, despacho de vehículos de auxilio con hoja de tarea y GPS en PWA, **aprobación y ajuste humano de los presupuestos y liquidaciones finales de Copilot antes de remitirlos a facturación**, y acceso a la hoja de trabajo en vivo.
- **Secretaria / RRHH:** Perfil de **solo lectura y consulta**. Supervisión visual del despliegue para atención telefónica a clientes, consulta de incidencias activas en el territorio desde el Drawer en modo lectura, verificación de presencia de cuadrillas en zonas de obra, canalización de avisos a mandos técnicos, y **recepción, evaluación objetiva individualizada y custodia confidencial en el expediente del trabajador de las incidencias disciplinarias** (imputando al conductor el siniestro vial, al encargado de almacén/picking la omisión de materiales, y al capataz como responsable inicial de omisiones de reporte o mala ejecución colectiva). **No dispone de permisos para asignar tareas, reasignar órdenes, arrastrar Drop and Go, autorizar compras ni alterar prioridades.**
- **Responsable de Cuadrilla (Capataz / `/operari`):** Opera desde su PWA móvil de campo. Emite telemetría GPS inteligente por eventos. El principio *Offline-First* rige estrictamente para los datos técnicos de la hoja de tarea (notas de voz, fotos, horas, planos y consumos en IndexedDB cifrado); sin embargo, ante una incidencia imprevista urgente que bloquee el trabajo, tiene la **obligación procedimental de desplazarse para buscar cobertura y notificar el grado de la incidencia lo antes posible**. En trabajos ordinarios sin incidencias, la PWA sincroniza al recuperar cobertura para contrastar con el presupuesto inicial; si finaliza con desviaciones no reportadas, se le abrirá la incidencia correspondiente para valoración de RRHH.
- **Operario de Cuadrilla (`/operari`):** Ejecuta la faena técnica en campo. Puede continuar con las fases viables de la obra mientras el capataz y la oficina técnica gestionan la aprobación de un imprevisto con el cliente. En caso de cancelarse la obra por rechazo del presupuesto por el cliente, la cuadrilla se retira ordenadamente, el pin pasa a Negro y la cuadrilla se reasigna desde la base.
- **Cliente Final (Canal Multicanal: Bot de Telegram, Email y Teléfono):** Recibe avisos de salida y llegada. Ante imprevistos de obra, recibe por Telegram el informe técnico de Copilot (previamente revisado por el supervisor) con fotos y la hoja de aceptación interactiva para aprobar el presupuesto extra con un solo clic (`Aprobar ampliación [Importe €]`), quedando dicha aceptación bloqueada e inmutable como presupuesto base suplementario; si pulsa `Rechazar`, la obra se detiene, pasa a Negro y se liquida provisionalmente el coste de la jornada. Si no responde, el supervisor decide humanamente según su grado de confianza si proseguir o parar.

---

## Historias de usuario
- **H1:** Como *Ingeniero o Boss*, quiero ver sobre el mapa comarcal la ubicación de todas mis cuadrillas y el estado de sus trabajos hoy para detectar cuellos de botella e intervenir de inmediato ante cualquier incidencia en el terreno.
- **H2:** Como *Ingeniero*, quiero que los menús laterales permanezcan ocultos por defecto para disfrutar de una visión limpia del mapa, y que al entrar una incidencia el Drawer se abra automáticamente coexistiendo con el panel de órdenes sin pérdida de contexto ni destrucción de estado.
- **H3:** Como *Ingeniero*, cuando una cuadrilla reporte una avería oculta o necesidad de material extra en obra, quiero revisar y aprobar la propuesta redactada por Copilot antes de que se envíe por Telegram al cliente con el botón de aceptación a 1 clic, pudiendo llamar directamente al cliente si la cuadrilla está parada.
- **H4:** Como *Ingeniero*, cuando una furgoneta sufra una avería inmovilizante en ruta, quiero activar la grúa con un clic desde el Drawer, avisar automáticamente al cliente por Telegram de la demora, desacoplar la tarea para reasignarla por Drop and Go y coordinar transporte alternativo para los operarios si las cuadrillas cercanas no tienen plazas suficientes.
- **H5:** Como *Supervisor*, cuando a una cuadrilla se le rompa una herramienta o falte una pieza, quiero comprobar si una cuadrilla cercana la tiene disponible al haber concluido sus tareas matinales en la hoja de faena, o consultar en el mapa los distribuidores locales para llamar y asegurar stock antes de enviar al operario o despachar un vehículo de auxilio con GPS.
- **H6:** Como *Capataz de campo*, cuando surja un imprevisto grave en una zanja en zona rural, quiero saber que debo buscar cobertura para enviar la incidencia de inmediato a la base, permitiendo a mis compañeros seguir avanzando en lo que puedan mientras la oficina técnica lo resuelve.
- **H7:** Como *Ingeniero*, cuando una cuadrilla finalice una jornada ordinaria sin incidencias, quiero que al sincronizar los datos de la PWA el sistema contraste automáticamente los consumos reales frente al presupuesto inicial aprobado (manteniendo inmutables las partidas aprobadas por Telegram), requiriendo obligatoriamente mi aprobación humana antes de pasar el presupuesto final y albarán a Facturación.
- **H8:** Como *Secretaria o Boss*, quiero que toda incidencia quede registrada en la hoja de tarea, en la ficha de flota si afectó a un vehículo, o en el expediente de RRHH imputada con precisión objetiva (conductor en accidentes, responsable de picking en olvido de herramientas, capataz en omisiones de reporte o negligencias colectivas).

---

## Requisitos Funcionales (Criterios de Aceptación en EARS)

### Bloque 1: Arquitectura Cartográfica Open Source, Capas y Redes Propias
- **RF-01:** EL SISTEMA renderizará en `/gestio/feines/mapa` un mapa cartográfico interactivo basado en tecnología abierta (*Leaflet / MapLibre GL JS*), sin dependencias de claves de API comerciales privativas de pago (como Google Maps o Mapbox).
- **RF-02:** EL SISTEMA dispondrá de un selector en pantalla para alternar instantáneamente entre dos capas cartográficas base:
  1. *Vista Callejero:* Teselas vectoriales de OpenStreetMap / Carto para entornos urbanos e industriales.
  2. *Vista Satélite / Ortofoto:* Teselas aéreas de alta resolución procedentes del PNOA (Plan Nacional de Ortofotografía Aérea - IGN) o ESRI World Imagery abierto, para localización precisa de parcelas agrícolas, fincas rústicas e instalaciones técnicas aisladas.
- **RF-03:** EL SISTEMA proyectará simultáneamente en el mapa dos capas operativas dinámicas e independientes:
  1. *Capa de Obras y Clientes:* Ubicaciones geográficas de las fincas, parcelas o inmuebles donde se ejecutan las órdenes de trabajo programadas.
  2. *Capa de Cuadrillas y Flota:* Posición geográfica de los vehículos y cuadrillas en jornada activa.
- **RF-04:** EL SISTEMA integrará una **Capa Vectorial de Infraestructura Técnica de la Empresa** superpuesta y conmutable (*"Mostrar Red Técnica"*):
  1. El mapa web de supervisión (`/gestio/feines/mapa`) renderizará la cartografía vectorial completa comarcal/empresarial cargando archivos estándar (**GeoJSON / KML**) custodiados en el servidor local (`/docs/<empresa_id>/planols/vectorials/`) representando trazados de tuberías, redes eléctricas de baja tensión, arquetas, hidrantes, colectores y válvulas de corte; dicha capa se adaptará dinámicamente según la vertical activa de la empresa.
  2. La PWA del operario (`/operari`) **recibirá y procesará exclusivamente la porción de plano técnico y red vectorial acotada al ámbito geográfico específico de sus órdenes de trabajo asignadas en la jornada**.
  3. CUANDO el usuario hace clic sobre un elemento de la red técnica, EL SISTEMA desplegará una etiqueta flotante con sus especificaciones de ingeniería (p. ej. *Tubería PE Ø110 PN10 — Sector Norte*).
  4. Las anotaciones gráficas y pines sobre el plano técnico quedarán **estrictamente encapsulados dentro de la hoja de trabajo de la orden o canalizados como incidencias formales del operario**, garantizando la integridad de la base cartográfica maestra.
- **RF-05:** EL SISTEMA exigirá la **Georreferenciación Obligatoria Previa de toda Orden de Trabajo**, quedando terminantemente prohibido agendar o planificar tareas sin coordenadas latitud/longitud contrastadas en base de datos:
  1. La captura de coordenadas se efectuará mediante el envío del pin de ubicación geográfica por el cliente a través del Bot de Telegram, o mediante clic manual de la oficina técnica sobre la ortofoto aérea del mapa al crear la orden.
  2. Cada orden de trabajo dispondrá de una **geovalla perimetral de 50 metros de cortesía** para el control de presencia en obra en zonas rurales o fincas con Punto Cero en cancela de acceso. **SI la señal GPS reporta una precisión (`coords.accuracy`) menor o igual a 20 metros**, el sistema validará el fichaje dentro del radio inmediato del punto de intervención; la geovalla de 50 metros se mantendrá activa para absorber entornos rurales con menor precisión GNSS o accesos en cancelas perimetrales. Una vez cruzada la cancela de acceso (Punto Cero) y fichada la llegada, la cuadrilla permanecerá en estado **Verde (En faena)** computando el tiempo con independencia de desplazamientos internos por la finca.
  3. *Inaccesibilidad Física al Punto Cero (Cancela con Candado) y Gestión de Tiempos:* SI la cuadrilla llega a la cancela y encuentra el acceso físico bloqueado, el operario pulsa el botón **"Start"** en la PWA para iniciar el contador de tiempo de la tarea y registra la **Incidencia de Acceso Bloqueado** para activar el contacto urgente con el cliente. Si la cancela no está abierta, no es responsabilidad del operario: el contador continúa corriendo computando el tiempo de espera. **El operario NO pausa el tiempo mientras aguarda la apertura**. Únicamente cuando la cuadrilla **se retira físicamente del lugar de trabajo** (sea por finalización ordinaria de la obra o por orden de cancelación tras espera inviable), el operario pulsará **"Pausa / Stop"**, deteniendo el contador. De este modo, la jornada laboral de 8 horas de los operarios se subdivide con exactitud en las diferentes tareas e imputaciones a los clientes, facturándose al cliente la totalidad del tiempo real de permanencia de la cuadrilla en el lugar. Si el acceso resulta definitivamente inviable tras el tiempo de espera determinado por el supervisor, este cancela la orden en el mapa, ordena la retirada asignando una nueva faena si se está en horario laboral, y **se liquidará al cliente el coste del tiempo de permanencia más el coste del desplazamiento**, tarificado en base a las tarifas horarias de mano de obra configuradas en Magatzem (Spec 004) como horas de cuadrilla (operario, oficial, ingeniero) invertidas en el trayecto.
- **RF-06:** SI dos o más órdenes de trabajo coinciden en la misma finca, edificio o parcela muy próxima, ENTONCES EL SISTEMA agrupará los marcadores en una burbuja numérica de agrupación (*clustering*); CUANDO el usuario hace clic sobre la burbuja, EL SISTEMA desplegará un abanico permitiendo **consultar y abrir cada orden de trabajo de forma completamente individual**.
  - *Reconocimiento de Convivencia Operativa:* Si coinciden dos cuadrillas en la misma parcela, EL SISTEMA **reconocerá la convivencia física legítima en el mismo espacio para tareas distintas o colaboración técnica coordinada**, suprimiendo alertas erróneas de conflicto en la campana de incidencias y permitiendo supervisar ambas cuadrillas con total normalidad.

### Bloque 2: Código Cromático de Estados y Popovers Informativos
- **RF-07:** EL SISTEMA representará los marcadores (*pins*) en el mapa mediante una simbología cromática diferenciada por entidad (Obras vs. Vehículos), estrictamente funcional e independiente del tema camaleónico del software:
  1. *Órdenes de Trabajo (Obras en el Terreno):*
     - *Naranja:* **Pendiente / No iniciada** (cuadrilla aún no ha iniciado el desplazamiento).
     - *Azul:* **Cuadrilla en camino / En tránsito hacia la obra**.
     - *Verde:* **En faena / En curso** (al fichar llegada dentro de la geovalla de la obra, el icono transmuta de vehículo a Cuadrilla activa en faena con sus categorías de operarios marcadas).
     - *Rojo:* **Con incidencia activa / Parada técnica en obra** (falta de material, avería in situ o imprevisto técnico reportado).
     - *Blanco:* **Completada** (tarea finalizada, documentada con fotos y cerrada por la cuadrilla; incluye órdenes cerradas bajo "Cliente Ausente").
     - *Negro:* **Cancelada en cualquier momento** (en ruta o durante la faena; se retira la cuadrilla y se emite albarán provisional).
  2. *Vehículos y Flota Móvil:*
     - *Azul:* **En tránsito con tarea asignada** (desplazamiento hacia obra).
     - *Lila / Púrpura (Standby o Tránsito sin Tarea):* Vehículos activos en jornada que **no tienen ninguna orden en curso asignada** (espera en nave, retorno a base o tras completarse/cancelarse una obra).
     - *Rojo:* **Avería mecánica o inmovilizado en carretera** (pinchazo, auxilio o remolque).
     - *Inmóvil en Obra (Sin Color / Neutro):* Cuando la cuadrilla está dentro de la obra ejecutando la faena (**Verde**), el vehículo físico permanece estacionado e inmóvil en la parcela, por lo que **no dispone de color cromático activo** en el mapa (icono neutro integrado en la cuadrilla), evitando saturación visual hasta que reanude la marcha.
  3. *Regla de Disociación Ontológica:* Los estados Blanco y Negro aplican exclusivamente a las órdenes de trabajo. Cuando una orden se completa (Blanco) o se cancela (Negro), el vehículo no se completa ni se cancela: conmuta automáticamente a Lila (Standby) o pasa a Azul hacia la siguiente parada asignada.
  4. *Cierre de Jornada y Despacho Matinal (Día +1) de Incidencias Inconclusas:* Al finalizar la jornada laboral, la cuadrilla retorna a la base y el vehículo desactiva su telemetría GPS, pero la Orden de Trabajo permanece en **Rojo (Incidencia activa / Inconclusa)** en el sistema. A las 08:00 AM del día siguiente (Día +1), dicha orden aparece destacada en la cabecera del panel de despacho matinal de "HOY" para que **el supervisor técnico decida humanamente** si la faena debe continuar con la misma cuadrilla (p. ej. faltaba una pieza al final de la tarde y se recupera la obra a primera hora) o si se reasigna a otra cuadrilla disponible.
- **RF-08:** CUANDO el usuario hace clic sobre el marcador de una orden de trabajo en el mapa, EL SISTEMA desplegará una tarjeta emergente (*popover*) con: cliente, teléfono directo (`tel:`), cuadrilla y vehículo asignados, estado operativo y enlace interactivo para abrir la **hoja de trabajo completa**.
- **RF-09:** CUANDO el usuario hace clic sobre el marcador de un vehículo/cuadrilla, EL SISTEMA desplegará un popover con: identificador del vehículo (enlace a Flota `/gestio/flota`), capataz responsable (enlace a su ficha), relación nominal de operarios a bordo, orden en curso y botón destacado de **"Llamar al Capataz"** (`tel:`).

### Bloque 3: Interfaz Limpia, Paneles Ocultos y Navegación Temporal
- **RF-10:** PRIORIDAD A LA VISIÓN LIMPIA DEL MAPA, APERTURA BAJO DEMANDA Y DISEÑO 100% RESPONSIVE:
  1. Todos los paneles laterales (panel de órdenes del día y Drawer de incidencias) **permanecerán ocultos y colapsados por defecto** para maximizar la visibilidad y supervisión global del mapa geográfico. No permanecen abiertos de forma continua; únicamente se despliegan cuando el usuario hace clic sobre su pestaña o cuando se recibe una nueva incidencia emergente.
  2. **Coexistencia Visual y Adaptabilidad Responsive 100%:** El Drawer de incidencias y el panel de órdenes diarias pueden coexistir visualmente sin destrucción mutua de estado:
     - En pantallas de escritorio / monitores amplios: coexisten en vista desacoplada (panel de órdenes a la izquierda, Drawer de incidencias a la derecha y mapa despejado en el centro).
     - En dispositivos con pantallas de tamaño medio o reducido (tablets de cabina, iPads o smartphones de supervisores): la interfaz se adaptará de forma **100% responsive**, presentándose los paneles como pestañas alternadas, modales deslizables o capas superpuestas, impidiendo que el mapa quede bloqueado y garantizando la fluidez operativa en cualquier instrumento.
  3. El panel lateral de órdenes de la jornada se desplegará a voluntad del usuario **haciendo clic sobre su pestaña lateral izquierda** (compatible con pantallas táctiles, sin depender de eventos hover), mostrando la secuencia planificada de ejecución.
  4. Las órdenes canceladas en ruta o en faena se desplazarán automáticamente a una sección inferior colapsable (*"Órdenes Canceladas / Historial"*).
- **RF-11:** CUANDO el usuario hace clic sobre una orden de trabajo en el panel lateral, EL SISTEMA **hará destellar y parpadear visualmente (*highlight*) el marcador de la cuadrilla y la obra asignada en el mapa**, manteniendo inalterado el nivel de zoom para no desorientar el contexto geográfico global.
- **RF-12:** EL SISTEMA estructurará la navegación temporal mediante un **selector de fecha conmutado (filtro temporal)**:
  1. *Filtro de Jornada Activa ("HOY"):* Coexisten cuadrillas activas con telemetría GPS en vivo y órdenes de trabajo programadas para la jornada.
  2. *Persistencia Temporal de Incidencias:* **Las incidencias activas permanecen marcadas y visibles en el mapa hasta su efectiva resolución**, independientemente de la fecha en que se abrieron o del filtro temporal seleccionado, garantizando que ninguna parada técnica quede desatendida.
- **RF-13:** CUANDO el usuario conmuta a una fecha diferente en el filtro temporal:
  1. *Filtro de Días Pasados:* Renderizado estático retrospectivo de los puntos geográficos donde se cerraron las obras; **las cuadrillas y furgonetas no se dibujan en fechas pasadas y en ningún caso se registrarán ni dibujarán trazas de carretera** (privacidad RGPD).
  2. *Filtro de Días Futuros:* Proyecta la dispersión geográfica de las obras agendadas para planificar y optimizar rutas; **la capa de cuadrillas permanece desactivada al carecer de telemetría física anticipada**.

### Bloque 4: Filtros Rápidos de Mando y Búsqueda
- **RF-14:** EL SISTEMA dispondrá de una barra superior de filtros operativos que permitirá aislar la visualización del mapa por:
  1. *Filtro por Cuadrilla / Vehículo:* Muestra exclusivamente los puntos de una furgoneta seleccionada.
  2. *Filtro por Estado Operativo de Obras:* Conmuta obras según sus colores (Naranja, Azul, Verde, Negro, Blanco, Rojo).
  3. *Filtro por Estado de Vehículos / Flota:* Conmuta activos móviles según sus estados (Azul, Lila, Rojo).
  4. *Filtro Prioritario de Incidencias:* Aísla instantáneamente en el mapa todas las obras o cuadrillas en estado **Rojo** (con incidencias o paradas técnicas activas).
  5. *Buscador de Texto:* Localiza en tiempo real una orden de trabajo, cliente o dirección en el mapa.

### Bloque 5: Mando Operativo, "Drop and Go" e Intervenciones Urgentes en Campo
- **RF-15:** MANDO OPERATIVO, CONCOMITANCIA DE ROLES Y SESIONES SÍNCRONAS:
  1. EL SISTEMA habilitará acciones de mando operativo en el mapa para los roles con permisos de escritura técnica (`Boss` e `Ingeniero`), manteniendo al rol `Secretaria` en modo estricto de solo lectura y consulta.
  2. *Concomitancia Operativa y Sesiones Síncronas:* Cada usuario (`Boss` o `Ingeniero`) operará en su propia sesión independiente aunque síncrona en tiempo real (vía WebSockets / SSE). Las cuadrillas de la empresa se distribuyen operativamente entre los ingenieros disponibles (p. ej. 10 cuadrillas repartidas a razón de 5 cuadrillas por ingeniero), conviviendo en la misma plataforma cartográfica. Si bien existe coordinación jerárquica y acuerdo mutuo entre mandos técnicos, el sistema permite la concomitancia de roles: si el `Boss` o un colega reasigna una orden o actúa sobre una cuadrilla asignada a otro ingeniero, la acción se sincroniza en tiempo real en la pantalla de todos los mandos activos con una alerta visual de actualización, preservando la coherencia sin bloqueos destructivos.
  3. Reasignar órdenes de trabajo arrastrándolas en el mapa o panel lateral.
  4. Alterar el orden de prioridad y secuencia de ejecución de las tareas pendientes de una cuadrilla.
  5. RESTRICCIÓN DE ASIGNACIÓN ORDINARIA: No permitirá asignar una obra ordinaria a una cuadrilla sin hoja de picking de nave cargada con el material necesario (Spec 004), salvo en cancelaciones previas con traspaso de stock consolidado (RF-25).
  6. *Blindaje Operativo en Zonas de Sombra:* Si una cuadrilla opera en zona de sombra, la orden permanecerá en estado Verde (En faena) y el supervisor no asignará ninguna otra tarea en esa franja horaria. Al recuperar cobertura, la PWA sincronizará automáticamente todos los datos hacia la base de datos central.
  7. *Reactivación y Transición tras Incidencia:* La resolución formal de una incidencia y la conmutación de estado en el sistema es una **tarea exclusiva del supervisor desde el Drawer web**; una vez resuelta y concluidos los trabajos técnicos en campo, el responsable de cuadrilla (capataz) podrá cerrar la tarea definitivamente desde la PWA.
- **RF-16:** FUNCIONALIDAD "DROP AND GO" PARA CONTINGENCIAS:
  1. Ante una emergencia o incidencia no reparable en campo (avería mayor o cliente no comparecido), el supervisor podrá arrastrar la orden sobre el icono de una cuadrilla cercana.
  2. La orden se asignará inmediatamente activando el flag **"Intervención Urgente (Sin Picking Previo de Nave)"**.
  3. Abrirá en la PWA la **Hoja de Consumo de Emergencia**, permitiendo imputar materiales de la Dotación Base (RF-14 Spec 004), sobrantes de tareas matinales (RF-27 Spec 004), traspasos autorizados (RF-25 Spec 004) o compras locales con tiquet fotográfico (RF-24 Spec 004).
- **RF-17:** EN toda intervención urgente en campo, EL SISTEMA exigirá en la PWA un circuito formal de cierre:
  1. *Apertura:* Fichaje geolocalizado de llegada y fotografía de la avería.
  2. *Imputación:* Horas de intervención y piezas consumidas.
  3. *Aceptación:* Firma digital del cliente en PWA; si está físicamente ausente, el operario marca **"Cliente Ausente"** aportando reporte fotográfico completo. La orden pasa de inmediato a **Blanco (Completada)** en el mapa, remitiéndose el parte por Telegram o Email a efectos informativos sin bloquear el cierre administrativo.
  4. *Cierre:* Fotografía del resultado final.
- **RF-18:** CUANDO el supervisor reasigne una tarea o altere el orden de prioridades desde el mapa:
  1. *Con Cobertura:* Actualiza Kanbans en PWA con señal acústica y notificación visual. Si estaba en Lila (Standby), permanecerá en Lila hasta que el capataz abra la notificación, conmutando entonces a Azul (En tránsito).
  2. *Sin Cobertura:* El sistema advierte del estado desconectado, facilitando la llamada telefónica directa de voz al capataz.
  3. *Principio de Distribución y Concomitancia Operativa:* Las cuadrillas se distribuyen operativamente asignadas a un supervisor de referencia para la gestión de su jornada y dudas técnicas; la concurrencia entre `Boss` e ingenieros se resuelve mediante sincronización en vivo de sesiones, garantizando que cualquier cambio de asignación sea visible de inmediato por todos los supervisores concurrentes sin colisiones destructivas.
  4. *Persistencia:* Si tras un Drop and Go la cuadrilla entra en zona de sombra, la orden continúa asignada; solo el supervisor puede desasignarla o reubicarla manualmente.

### Bloque 6: Telemetría GPS Eficiente (*Battery-Aware*) y Pérdida de Cobertura
- **RF-19:** LA PWA ejecutará una política de telemetría GPS inteligente orientada al ahorro de batería, **prohibiendo el rastreo por polling continuo**:
  1. Emitida por defecto a través del dispositivo del Responsable de Cuadrilla (capataz). Todos los operarios disponen de la PWA instalada en sus terminales móviles individuales donde fichan el inicio y fin de su jornada laboral. **Delegación Temporal por Avería o Batería Agotada:** Si el terminal del capataz se queda sin batería, sufre rotura o se apaga durante la faena, el supervisor técnico puede, desde la pantalla de gestión del mapa (o `/gestio/configuracio`), **cambiar temporalmente el rol de uno de los operarios de la cuadrilla para otorgarle permisos de responsable de cuadrilla (capataz en funciones)**, transfiriendo de inmediato a su dispositivo la emisión de la telemetría GPS inteligente y el reporte de la faena sin interrumpir la visibilidad del equipo.
  2. Disparo prioritario por **eventos de cambio de estado geográfico** (inicio de jornada, inicio de ruta, proximidad a 50 m, fichaje de llegada, cierre de tarea y fin de jornada).
  3. En trayectos prolongados en carretera (estados Azul y Lila), muestreo periódico espaciado cada 10 a 15 minutos.
  4. Al fichar **Fin de Jornada**, la telemetría GPS se desactiva de inmediato (RGPD), quedando el marcador fijo en la última posición registrada hasta medianoche.
- **RF-20:** PÉRDIDA DE COBERTURA EN CAMPO:
  1. *Check de Tarea sin Conexión (En Faena):* Si la cuadrilla está dentro de la geovalla en **Verde (En faena)** y pierde señal, el sistema suprime falsas alarmas y mantiene el estado Verde con el indicador de última posición en obra.
  2. *Pérdida de Señal en Carretera (Azul y Lila) con Umbral de 25 Minutos:* Si la ausencia de señal GPS en desplazamiento supera los **25 minutos** (amortiguando con un margen de tolerancia de 10 a 15 minutos el intervalo regular de muestreo de 10-15 min para evitar falsas alarmas por latencia de red), el vehículo se muestra atenuado/translúcido con etiqueta *"Sin señal hace [X] min"* y reborde de alerta visual en el mapa y campana; al recuperar señal y emitir coordenada válida, el sistema restaura la opacidad y normaliza el estado automáticamente.

### Bloque 7: Protocolos de Incidencias en Campo (Flota y Red Técnica)
- **RF-21:** PROTOCOLO SECUENCIAL DE CONTINGENCIA DE FLOTA EN CARRETERA:
  1. *Paso 1: Póliza del Vehículo:* Consulta de aseguradora, póliza, matrícula y coberturas 24h (Spec 006).
  2. *Paso 2: Llamada a la Grúa:* Marcación directa facilitando coordenadas GPS exactas del punto de inmovilización.
  3. *Paso 3: Registro de ETA de la Grúa:* Registro del tiempo estimado con cuenta atrás visual sobre el icono del vehículo.
  4. *Paso 4: Diagnóstico In Situ:* Dictamen de reparación in situ rápida (20-30 min) o traslado en plataforma a taller.
  5. *Paso 5: Condicional de Reasignación y Desacoplamiento:*
     - Si reparación in situ es factible: Cuadrilla reanuda ruta (**Azul**) y se mantiene la planificación con retraso recalculado.
     - Si reparación in situ NO es factible: Desacoplamiento lógico del vehículo (va a taller concertado/concesionario oficial), traslado de operarios y reasignación de órdenes pendientes mediante las acciones integradas del Drawer de Incidencias (RF-31).
- **RF-22:** PROTOCOLO DE CONTINUIDAD ANTE OBSTÁCULOS EN RED TÉCNICA:
  1. *Aislamiento Inmediato:* Consulta en la Capa Vectorial de la válvula de corte aguas arriba más cercana para cerrarla.
  2. *Peritaje en PWA:* Reporte fotográfico de la caseta u obstáculo sobre la traza y de la fuga, conmutando el pin a **Rojo**.
  3. *By-pass Provisional de Emergencia:* Tendido provisional en superficie con polietileno flexible para restablecer servicio en menos de 1 hora, imputando el tiempo a la orden como *"Instalación de By-pass de Emergencia"*. Este caso excepcional lo determina el supervisor; **se cobrarán y facturarán a la orden tanto las horas de mano de obra invertidas como los materiales y piezas consumidos**.
  4. *Negativa del Propietario:* Registro fehaciente de la negativa en PWA; la cuadrilla se repliega y el supervisor consulta el asistente RAG para gestionar la respuesta contractual.
  5. *Actualización de Traza:* Incorporación del obstáculo y desvío en la Capa Vectorial, derivando el proyecto de variante definitiva a oficina técnica.
- **RF-23:** TRANSFERENCIA DE OPERARIOS ENTRE CUADRILLAS EN CAMPO:
  1. Apertura de incidencia de dotación en el mapa seleccionando operarios y vehículo de destino.
  2. Actualización de la composición de la cuadrilla en el popover y registro de presencia.
  3. *Imputación Horaria por Start / Stop en Obra:* El operario dispone en su PWA de los botones de **Start / Stop** para computar su tiempo de permanencia efectiva en la obra de destino. Dicha directriz rige de forma estricta: al llegar a la obra asignada pulsa Start y al marcharse pulsa Stop, computándose esas horas a la orden correspondiente, independientemente de la duración del trayecto de traslado.
  4. *Control de Plazas Homologadas y Prohibición de Imprudencias:* Validación en backend que bloquea trasvases que superen los asientos físicos habilitados en el vehículo receptor (RF-28 Spec 006). En modo offline, la PWA advertirá expresamente al capataz del límite de plazas del vehículo. Rige el mandato estricto de que los capataces **no deben incurrir en imprudencias, sobreocupaciones ni malas prácticas de seguridad vial**. Si en la sincronización posterior se detectara un trasvase indebido que superó las plazas legales, el sistema registrará una incidencia disciplinaria grave de seguridad vial en el expediente del capataz para valoración de RRHH.
  5. *Transferencia en Zona de Sombra (Offline-First):* Si el trasvase se ejecuta en un punto sin cobertura móvil, rige la operativa Offline-First: tanto el capataz cedente como el receptor y los operarios registran el movimiento localmente en sus respectivas PWAs (almacenado en IndexedDB con cifrado Web Crypto API); los datos de asignación se sincronizarán automáticamente con la base de datos central en el momento en que cualquier terminal recupere cobertura.

### Bloque 8: Canal de Comunicación Multicanal con el Cliente Final
- **RF-24:** COMUNICACIÓN TRANSACCIONAL VÍA TELEGRAM, EMAIL Y TELÉFONO:
  1. *Aviso de Salida y Aproximación:* Al iniciar ruta (**Azul**), remite notificación con código OT, dirección y hora estimada de llegada (sin enlaces de rastreo continuo en vivo).
  2. *Aviso de Llegada:* Al llegar a la parcela o fichar en Punto Cero, notifica de inmediato al cliente el inicio de los trabajos.
  3. *Aviso de Retraso Vial:* En incidencias de tráfico o avería, notifica el retraso estimado de forma transparente.
  4. *Aprobación Interactiva de Imprevistos en Obra con Mandato Human-in-the-Loop:*
     - Tras la revisión y aprobación humana obligatoria por el supervisor, EL SISTEMA remite al Bot de Telegram el informe pericial con fotos y botones interactivos `[✅ Aprobar ampliación [Importe €]]` y `[❌ Rechazar / Hablar con Ingeniero]`.
     - *Aprobación:* La aceptación del cliente queda **bloqueada e inmutable** como presupuesto base suplementario y desbloquea la PWA en tiempo real.
     - *Pulsación de Rechazar / Hablar con Ingeniero (o Dudas):* **En ningún caso cancela la orden de forma automática e inmediata**. Dicha acción dispara prioritariamente la alerta en el Drawer con el **teléfono del cliente (`tel:`)** para que el supervisor gestione una llamada urgente directa, intentando resolver dudas, evaluar soluciones técnicas alternativas y buscar el acuerdo o reparación antes de suspender.
     - *Cancelación Humana por Imposibilidad de Acuerdo:* Únicamente si tras la comunicación telefónica se constata la imposibilidad técnica o económica de continuar, **es el supervisor quien cancela formalmente la tarea en el sistema**, dando la orden de retirada a la cuadrilla y asignándole una nueva faena si se encuentra dentro del horario laboral de la jornada.
     - *Silencio o Inacción del Cliente:* Si el cliente no interactúa con el Bot ni atiende la llamada urgente, el supervisor evalúa humanamente el grado de confianza comercial del cliente para determinar si autoriza continuar los trabajos viables o suspender la intervención.
     - *Incomunicación Absoluta Prolongada en Zonas Blancas:* Si tras un imprevisto el capataz busca cobertura y existe una caída total de red o zona blanca prolongada sin conectividad móvil, la cuadrilla continuará trabajando en modo 100% offline registrando todas las actuaciones en la PWA (fotos, horas, piezas consumidas y firmas físicas) hasta recuperar conectividad o finalizar la jornada.
     - *Contingencia Offline:* En zonas sin cobertura, se recoge la firma física del cliente en la pantalla de la PWA en modo 100% offline.
  5. *Validación en Cliente Ausente:* Conmuta pin a Blanco y remite el parte con fotos y botón `[✍️ Confirmar y Validar Recepción]` a efectos informativos diferidos.

### Bloque 9: Contingencias de Jornada y Gestión de Stock a Bordo
- **RF-25:** GESTIÓN DE CANCELACIONES Y REAGENDAMIENTOS DE OBRA:
  1. Señal acústica y alerta visual de cancelación en PWA.
  2. *Distinción entre los Dos Supuestos Operativos:*
     - **Supuesto 1: Tarea Cancelada que se Reagenda en Nueva Fecha:** Si la tarea no puede ejecutarse o completarse hoy pero se reprograma con el cliente, se recopilan todos los datos registrados en la PWA hasta el momento (fotos, piezas, horas) y se adjuntan a la orden de trabajo asignándole la nueva fecha acordada; en la nueva fecha futura la tarea figura con color **Naranja (Pendiente)**. En el historial de hoy queda constancia de la reprogramación, pero la tarea no perdura como pin activo en el mapa de hoy.
     - **Supuesto 2: Tarea Cancelada Definitivamente:** Si la obra se cancela de forma definitiva (en ruta o durante la faena en Verde), se recopilan los datos de la hoja de trabajo de la PWA para la liquidación y facturación de los trabajos y desplazamientos devengados hasta la cancelación, marcándose con color **Negro (Cancelada)**.
  3. *Naturaleza No Persistente de las Cancelaciones:* Las cancelaciones **NO son incidencias activas y no perduran flotando en el tiempo en el mapa**; quedan registradas y asentadas exclusivamente en el día en que sucedieron para la consulta retrospectiva del historial, así como en la hoja de tarea asignada al cliente.
  4. *Gobierno de Stock en Furgoneta:* Los materiales cargados quedan en custodia a bordo para reingreso en almacén central al cierre de jornada, salvo reubicación inmediata mediante Incidencia de Cambio de Asignación.
- **RF-26:** RESOLUCIÓN DE HUECOS IMPRODUCTIVOS POR FINALIZACIÓN ANTICIPADA:
  1. Notificación a la base en el mapa `/gestio/feines/mapa`.
  2. Tramitación en mapa mediante: a) Reasignación de tarea nueva mediante Drop and Go con stock compatible, o b) Apoyo y convergencia con cuadrilla cercana retrasada.

### Bloque 10: Estado "Día 0" y Control de Mando
- **RF-27:** ESTADO "DÍA 0" (TOLERANCIA CERO A DATOS FICTICIOS):
  1. Cámara del mapa centrada en las coordenadas de la sede o Almacén Central de la empresa, cargadas en el delivery del SaaS con los datos básicos de la empresa y la configuración del prompt vertical de Copilot. Si la empresa no hubiese rellenado la dirección física en el delivery, el onboarding del SaaS exigirá obligatoriamente completar los datos de alta de sede antes de habilitar la cartografía (*Zero Mock Data*).
  2. Mapa completamente limpio, sin cuadrillas simuladas ni pines dummy (*Zero Mock Data*).
  3. Panel lateral muestra estado vacío real (*"Sin tareas programadas para esta fecha"*).
- **RF-28:** MATRIZ DE ACCESO EN EL MAPA:
  1. Rol `Secretaria`: Acceso de **solo lectura y consulta telefónica** (sin controles de arrastre, reasignación ni autorización de compras).
  2. Roles `Boss` e `Ingeniero`: Permisos de escritura y mando operativo completo (*Drop and Go*, reasignaciones, resolución de incidencias en Drawer y alteración de prioridades).

---

### Bloque 11: Centro de Resolución de Incidencias en el Mapa (Drawer Lateral Emergente)
- **RF-29:** DRAWER LATERAL DE INCIDENCIAS EN `/gestio/feines/mapa` Y REDIRECCIÓN DESDE MENÚ:
  1. *Comportamiento por Defecto y Prioridad del Mapa:* El Drawer lateral de incidencias (ubicado en el margen derecho de la pantalla) **permanecerá oculto y colapsado por defecto**, priorizando la visibilidad amplia, fluida y sin obstáculos de la cartografía y las cuadrillas activas.
  2. *Apertura Automática Emergente ante Nuevas Incidencias y Coexistencia de Paneles:* En el instante en que cualquier cuadrilla reporte una incidencia desde campo (o se detecte una parada técnica o inmovilización de flota), **el Drawer lateral se abrirá de forma automática y emergente en pantalla, coexistiendo de forma armónica con el panel de órdenes del día sin destrucción mutua de estado** (mediante vista desacoplada, paneles laterales independientes o pestañas conmutables), permitiendo al supervisor atender la contingencia sin perder la visión ni el progreso de la planificación del día.
  3. *Apertura Manual por Clic:* El supervisor podrá desplegar el Drawer en cualquier momento haciendo **clic sobre la pestaña lateral derecha del mapa**, o haciendo clic sobre cualquier marcador rojo del mapa o sobre la campana de alertas del Dashboard (sin depender de eventos hover accidentales y plenamente operativo en pantallas táctiles).
  4. *Redirección Unificada de la Ruta `/gestio/incidencies` y Persistencia Territorial:* La URL `/gestio/incidencies` redirigirá de forma automática y transparente a `/gestio/feines/mapa?incidencies=obertes`, abriendo la interfaz cartográfica con el Drawer de incidencias desplegado y enfocado. **Las incidencias activas permanecerán marcadas y visibles en el mapa hasta su efectiva resolución**, independientemente del filtro de fecha seleccionado.
  5. *Gestión de Avalancha de Incidencias Simultáneas:* Si concurren múltiples incidencias reportadas en un breve lapso de tiempo, el Drawer las listará en una columna lateral por **estricto orden cronológico de llegada**; el supervisor determinará humanamente cuál atiende en primer lugar ponderando el nivel de urgencia técnica y el peligro para la integridad física de los trabajadores.
  6. *Contenido Estructurado del Drawer:*
     - Reproductor de audio nativo del operario (escucha directa e inmediata desde el primer segundo).
     - Galería de fotografías periciales de campo ampliables.
     - **El Memorándum e Informe Técnico redactado por Copilot** (diagnóstico, piezas estimadas y propuesta económica).
     - Botones de acción operativa inmediata según la tipología de la incidencia.
- **RF-30:** GESTIÓN DE IMPREVISTOS DE OBRA CON EL CLIENTE (MANDATO HUMAN-IN-THE-LOOP + TELEGRAM + LLAMADA URGENTE):
  1. *Llamada Urgente al Cliente:* SI la aprobación del material o tarea extra es indispensable para que la cuadrilla pueda continuar trabajando sin incurrir en horas muertas:
     - El Drawer desplegará de forma destacada el **teléfono de contacto directo del cliente con botón de marcación urgente inmediata (`tel:`)** para que el supervisor gestione la autorización verbal al instante.
     - *Silencio o Inacción del Cliente:* Si el cliente no interactúa con el Bot ni atiende la llamada urgente, el supervisor técnico valorará el grado de confianza comercial del cliente y determinará humanamente si autoriza continuar los trabajos viables o suspender la obra.
  2. *Informe de Copilot y Hoja de Aceptación por Telegram con Aprobación Humana Previa:*
     - El asistente **Copilot redactará un informe técnico completo de la incidencia**, incorporando la descripción del imprevisto, las fotografías periciales capturadas por el operario y la propuesta presupuestaria suplementaria.
     - **MANDATO HUMAN-IN-THE-LOOP PREVIO:** El informe redactado por Copilot **requerirá obligatoriamente de la revisión y aprobación humana explícita del supervisor antes de ser remitido al cliente**.
     - Una vez validado por el supervisor, EL SISTEMA remitirá dicho informe al **Bot de Telegram del Cliente Final** acompañado de la **hoja interactiva de aceptación de presupuesto extra**.
     - El mensaje incluirá los botones interactivos: **`[✅ Aprobar ampliación [Importe €]]`** y **`[❌ Rechazar / Hablar con Ingeniero]`**.
     - *Aprobación:* Al pulsar el cliente sobre el botón en Telegram, la aceptación queda **bloqueada e inmutable como presupuesto base complementario**, la incidencia conmuta automáticamente a estado aprobada, se incorpora la partida suplementaria a la orden y la PWA del operario queda desbloqueada.
     - *Pulsación de Rechazar / Hablar con Ingeniero:* **No cancela la orden de forma automática e inmediata**. Dispara en el Drawer el **teléfono directo del cliente (`tel:`)** para que el supervisor gestione una llamada urgente directa, buscando vías de acuerdo técnico o reparación antes de suspender.
     - *Cancelación Humana por el Supervisor:* Si tras la comunicación telefónica el desacuerdo persiste o la reparación técnica resulta inviable, **el supervisor cancela formalmente la tarea en el sistema**, ordena la retirada de la cuadrilla, asigna si procede una nueva tarea dentro de la jornada laboral, y se genera el albarán provisional con los costes devengados hasta la cancelación para derivación a Facturación.
  3. *Continuidad de Trabajos Viables en Campo:* Mientras se tramita la resolución telefónica o la respuesta telemática del cliente, la cuadrilla **continuará ejecutando todas aquellas labores de la obra que no dependan del imprevisto reportado**, minimizando paradas técnicas.
- **RF-31:** RESOLUCIÓN DE AVERÍAS DE FLOTA EN EL DRAWER, PLAZAS HOMOLOGADAS Y REASIGNACIÓN:
  1. CUANDO una cuadrilla reporte una avería mecánica inmovilizante o pinchazo en carretera:
  2. El Drawer de Incidencias activará las siguientes tres acciones coordinadas en un solo flujo:
     - *a) Activación de Grúa y Taller:* Suministra la llamada directa con la aseguradora y datos de póliza (Spec 006), dirigiendo la grúa al Concesionario Oficial configurado (si es en garantía y dentro de la comarca base/adyacentes) o al taller concertado seleccionado.
     - *b) Notificación Automática de Demora al Cliente:* EL SISTEMA remitirá un mensaje inmediato por Telegram (o Email) al cliente de la obra pendiente que estaba esperando a la furgoneta, informándole de forma proactiva del imprevisto técnico de transporte y recalculando la previsión.
     - *c) Desacoplamiento y Reasignación de Órdenes Pendientes:* Las tareas que la cuadrilla averiada tenía programadas para la tarde se desacoplan de su furgoneta y quedan disponibles en el mapa como órdenes no asignadas para su reubicación mediante *Drop and Go* hacia otra cuadrilla cercana o reprogramadas en fecha si ninguna puede asumirlas. **Retirada de Material de Picking:** La cuadrilla receptora a la que se le asigne el trabajo deberá acudir a la nave/almacén a retirar el material correspondiente de la hoja de picking (Spec 004) para poder ejecutar adecuadamente la tarea asignada.
  3. *Reasignación Manual y Búsqueda de Transporte Alternativo:* El supervisor dispondrá en el Drawer de la opción de **reasignación manual de los operarios de la furgoneta averiada**. Si las cuadrillas cercanas no disponen de plazas físicas homologadas suficientes para acoger a los operarios (RF-28 Spec 006), el supervisor lo tendrá en cuenta y gestionará transporte alternativo (taxi concertado de la póliza de seguros, vehículo de auxilio desde almacén o retorno a la base).
- **RF-32:** INCIDENCIAS DE HERRAMIENTAS, TRASPASOS CONDICIONALES, PROVEEDORES Y VEHÍCULO DE APOYO:
  1. CUANDO una cuadrilla reporte la rotura de una herramienta crítica o la falta de un accesorio/pieza no disponible en la dotación de la furgoneta:
  2. *Traspaso Condicional Evaluado por Hoja de Tarea y Logística de Traslado:*
     - El Drawer analizará las furgonetas cercanas y comprobará si alguna dispone de la herramienta o recambio en su dotación de almacén (Spec 004).
     - **Condición Restrictiva Determinada por Hoja de Tarea:** El sistema comprobará si la herramienta fue utilizada en una primera faena ya terminada por la Cuadrilla B y no figura en sus tareas posteriores de la jornada; de ser así, se determina disponible. En cualquier caso, se prioriza la consulta telefónica asistida por Copilot y el supervisor tiene siempre la última palabra para evitar perjuicios a la Cuadrilla B.
     - *Logística de Traslado Físico Determinada por Supervisor:* El supervisor técnico determinará humanamente la operativa logística más eficiente para el desplazamiento físico de la herramienta traspasada entre cuadrillas (despacho del vehículo de auxilio desde almacén, instrucción a la cuadrilla cedente para entregarla al paso, o desplazamiento puntual de un operario), registrándose la nueva custodia en Magatzem.
  3. *Capa Cartográfica de Proveedores Locales y Desabastecimiento:*
     - El supervisor dispondrá en el mapa de una capa conmutable de **Puntos de Venta Técnicos y Ferreterías Locales cercanas a la zona de la obra** con teléfono directo (`tel:`) para verificar y reservar stock previamente antes de desplazar al operario.
     - *Desabastecimiento Total:* Si los proveedores locales carecen de la pieza o están cerrados, el supervisor tomará humanamente la determinación del siguiente paso operativo (suspensión de la obra, reasignación por Drop & Go o reprogramación de fecha).
  4. *Operativa del Vehículo de Apoyo y Contingencias Aisladas:*
     - Si se activa un vehículo de auxilio desde el almacén central, dicho vehículo dispondrá de **presencia y telemetría GPS a través de la PWA** y operará con su propia **hoja de tarea asignada** (*"Llevar material/pieza X al punto geográfico X"*), computando tiempos y ruta de auxilio.
     - *Contingencias del Vehículo de Apoyo como Eventos Aislados:* Si el propio vehículo de auxilio sufriera un imprevisto, avería mecánica o retención en ruta, dicho evento se tratará de forma **completamente aislada e independiente** como una incidencia ordinaria de flota (RF-31); el supervisor determinará humanamente la alternativa operativa (activar un segundo vehículo de apoyo, derivar compra a ferretería local o suspender la intervención).
  5. *Imputación de Incidencia en Herramienta Prestada e Inspección de Negligencia:*
     - Cuando una herramienta traspasada entre cuadrillas sufra rotura o avería, la **incidencia técnica** (no la negligencia) se asocia y registra a la persona o cuadrilla que ostentaba la custodia física responsable del material en el momento del fallo (según el registro formal de traspaso de Spec 004).
     - **Inspección Pericial por el Supervisor:** El supervisor técnico realizará una inspección del fallo para evaluar si la avería obedeció a desgaste natural, fin de vida útil o fatiga previa del material. **Únicamente si tras dicha inspección el supervisor constata negligencia manifiesta o mala praxis grave**, se remitirá el expediente al departamento de RRHH para la adopción de medidas disciplinarias; en caso contrario, se tramita como merma o sustitución ordinaria de almacén.
- **RF-33:** ALCANCE DE PROTOCOLO OFFLINE-FIRST, CONTRASTE PRESUPUESTARIO Y MANDATO HUMAN-IN-THE-LOOP AL CIERRE:
  1. *Alcance Estricto de Offline-First vs Búsqueda de Cobertura en Incidencias:*
     - El principio *Offline-First* ampara estrictamente la persistencia local cifrada (IndexedDB con Web Crypto API) de los datos de la **hoja de tarea** (notas de voz, fotos, horas, planos, mediciones y piezas consumidas).
     - Por contraposición, **las incidencias imprevistas no operan en modo offline diferido**: como su propio nombre indica, una incidencia es un bloqueo crítico que exige resolución activa urgente, por lo que el operario responsable (cap de colla) tiene la obligación procedimental de **desplazarse hasta encontrar cobertura móvil para notificar de inmediato el grado de la incidencia a la base**, garantizando una resolución rápida.
  2. *Sincronización Obligatoria de la Hoja de Tarea y Contraste Presupuestario:*
     - **Ningún albarán o liquidación de final de tarea podrá ser redactado sin la documentación y sincronización completa de la hoja de tarea de la PWA.**
     - Tras la sincronización del cierre, EL SISTEMA contrastará automáticamente los consumos reales frente al presupuesto inicial aprobado y partidas suplementarias aprobadas por Telegram (las cuales permanecen bloqueadas e inmutables).
  3. *Supervisión Humana de Desviaciones al Cierre (Cero Imputación Automática):*
     - Al capataz **NO se le imputará ningún sobrecoste o desviación de la obra a no ser que sea por causa demostrada de negligencia**.
     - Al cierre de una obra, el supervisor técnico revisará las desviaciones registradas en la hoja de tarea de la PWA frente a la previsión inicial. Es responsabilidad exclusiva del supervisor evaluar técnicamente dichas desviaciones en su contexto de obra; únicamente en caso de constatar negligencia injustificada, el supervisor elevará la incidencia al departamento de RRHH para su valoración.
  4. *Mandato Constitucional Human-in-the-Loop para Facturación:*
     - El ingeniero o Copilot redactará la propuesta de presupuesto final de obra y albarán liquidando las desviaciones documentadas en la hoja de tarea.
     - **EN NINGÚN CASO se emitirá una factura ni se derivará automáticamente a Contabilidad sin la aprobación humana explícita**: el supervisor técnico o `Boss` deberá revisar, ajustar y validar con firma digital/clic explícito el documento antes de su remisión a Facturación (`/gestio/comptabilitat`) bajo normativa Veri*factu.
- **RF-34:** TRAZABILIDAD MULTINIVEL E IMPUTACIÓN DISCIPLINARIA OBJETIVA EN RRHH:
  1. *Registro Primario en la Hoja de Trabajo:*
     - Toda incidencia reportada se registrará e incorporará de forma indeleble en la **hoja de tarea / orden de trabajo activa** donde se haya producido el hecho (audio, transcripción, peritaje fotográfico, informe y resolución).
  2. *Replicación en el Historial del Vehículo (Flota, Spec 006):*
     - Si la incidencia atañe a un vehículo (colisión, avería de motor, recarga omitida en EV o daño mecánico), se replicará automáticamente en la ficha del vehículo en Flota (`/gestio/flota/<identificador_actiu>`).
  3. *Imputación Disciplinaria Individualizada en RRHH (`/gestio/treballadors`) y Rectificación Administrativa:*
     - La responsabilidad se asignará de forma objetiva según la naturaleza de la negligencia:
       * *Siniestro o Choque Vial Imputado según Atestado:* En caso de colisión o siniestro vial de un vehículo de la empresa, la responsabilidad disciplinaria o laboral se imputará **estricta y exclusivamente de conformidad con el atestado oficial de tráfico (Guardia Civil / Policía / Mossos) o el parte amistoso de accidente contrastado y firmado**, acreditando fehacientemente la identidad del conductor real en el momento del suceso.
       * *Falta de Material o Herramienta con Stock en Almacén:* Se imputará a la **persona responsable de la preparación de la hoja de picking** de almacén (Spec 004).
       * *Falta Colectiva, Mala Realización Técnica u Omisión de Reporte de Incidencias:* El primer afectado será el **responsable de la cuadrilla (capataz)**, estudiando RRHH la afectación individual del resto de operarios en cada caso.
     - Dicha anotación quedará grabada en el expediente laboral del trabajador bajo custodia confidencial **exclusiva para los roles `Secretaria / RRHH` y `Boss`**.

---

## Requisitos No Funcionales
- **Cartografía Soberana y Gratuita (Cero Costes de API):** Visualización mediante Leaflet / MapLibre con capas libres (OpenStreetMap y PNOA/ESRI), sin cuotas de facturación por peticiones cartográficas ni fuga de datos a terceros.
- **Rendimiento Ultrarrápido y Fluidez a 60 fps:** La renderización de 50 marcadores de obra, 15 vehículos simultáneos, capas técnicas vectoriales y apertura reactiva del Drawer de incidencias responderá con latencia inferior a 200 ms y 60 fps estables en Next.js.
- **Arquitectura Asíncrona (Celery + Redis):** El procesamiento de audios de campo con Whisper v3, la generación del informe de Copilot y las notificaciones automáticas por Telegram a clientes y grúas se ejecutan en segundo plano en Celery, garantizando que el event loop de FastAPI nunca se bloquee.
- **Seguridad Multi-Tenant (RLS):** Aislamiento estricto por `app.current_empresa_id` en todas las tablas de obras, cuadrillas, incidencias, telemetría y capas vectoriales.
- **Almacenamiento Seguro en Memoria Interna de la Empresa y Servidor Hetzner (Alemania):** Todas las evidencias multimedia y documentales se alojan estrictamente en la memoria interna y discos duros locales de la empresa y en el servidor Hetzner Cloud (Alemania - UE) bajo el árbol `/data/<empresa_id>/...` y `/docs/<empresa_id>/...`, eliminando totalmente cualquier servicio cloud externo (como AWS S3) y garantizando soberanía territorial estricta y cumplimiento del RGPD.
- **Privacidad Laboral y RGPD:** Prohibido registrar o dibujar trazas de carretera continuas en el mapa histórico; solo se persisten eventos de presencia y fichajes en obras y bases autorizadas.
- **Diseño Camaleón en Software vs Simbología Cartográfica Funcional:** La interfaz de la plataforma web, el Drawer lateral y las notificaciones adoptan la paleta camaleónica corporativa (`--color-primary`, `--color-secondary`), mientras que los iconos y estados del mapa mantienen una simbología cartográfica fija, universal y de contraste funcional independiente.
- **Diseño 100% Responsive y Adaptabilidad Multi-Dispositivo:** La pantalla del mapa y sus paneles desacoplados se adaptan dinámicamente a cualquier factor de forma (monitores desktop, tablets de cabina o smartphones de supervisores), garantizando visibilidad despejada y plena operatividad táctil.

---

## Fuera de Alcance (Lo que NO hace este módulo)
- No es una herramienta de navegación GPS paso a paso en ruta (se delega en la PWA a apps nativas como Google Maps o Waze mediante enlace externo).
- No realiza trazado continuo de líneas de velocidad ni análisis de telemetría de frenadas (no es un sistema de tacógrafo pesado de carretera).
- No emite facturas oficiales ni efectúa cobros bancarios desde el mapa (se canaliza a `/gestio/comptabilitat`).
- No gestiona el picking físico de nave central (se gobierna en `/gestio/magatzem`).
- No mantiene una pantalla separada e inconexa para `/gestio/incidencies`; la ruta redirige a `/gestio/feines/mapa?incidencies=obertes` para resolución unificada en el mapa.

---

## Criterios de Finalización (Definition of Done)
1. Todos los requisitos funcionales (RF-01 al RF-34) redactados en sintaxis formal EARS respondiendo fielmente al QUÉ y al PER QUÉ de la operativa real.
2. Arquitectura cartográfica 100% Open Source basada en Leaflet / MapLibre GL con capas OpenStreetMap y PNOA Ortofoto.
3. Capa vectorial propia de infraestructura técnica de la empresa (tuberías, redes BT, arquetas) integrable mediante GeoJSON/KML local en `/docs/<empresa_id>/planols/vectorials/`.
4. Georreferenciación obligatoria previa con geovalla de 50 metros y validación con precisión GPS de 20 metros; protocolo de Punto Cero en cancela con botón Start al llegar, sin pausa mientras se aguarda apertura, Stop al retirarse, y facturación al cliente del tiempo de permanencia más desplazamiento.
5. Código cromático con distinción ontológica estricta: Órdenes (Naranja Pendiente, Azul En tránsito, Verde En faena, Rojo Incidencia activa en obra, Blanco Completada, Negro Cancelada) y Vehículos (Azul En tránsito con tarea, Lila Standby/tránsito sin tarea, Rojo Avería mecánica, Inmóvil en obra sin color / neutro; Blanco y Negro no aplican a vehículos; apertura matinal Día +1 con decisión humana del supervisor para continuar faena o reasignar).
6. Prioridad absoluta a la visión despejada del mapa y paneles laterales bajo demanda con diseño 100% responsive adaptable a monitores, tablets y smartphones.
7. Coexistencia pacífica de paneles: el Drawer de incidencias y el panel de órdenes del día coexisten sin destrucción mutua de estado según el factor de forma del dispositivo.
8. Convivencia operativa legítima: coexistencia física de dos cuadrillas en la misma parcela para tareas distintas o colaborativas sin disparo de falsas alarmas ni conflictos.
9. Persistencia temporal de incidencias: todas las incidencias abiertas permanecen marcadas en el mapa y en el Drawer hasta su efectiva resolución, unificando la ruta `/gestio/incidencies`.
10. Gestión de imprevistos con el cliente: informe de Copilot con mandato Human-in-the-Loop antes de enviar a Telegram; pulsación de rechazar o dudas dispara prioritariamente llamada urgente para buscar acuerdo o reparar antes de que el supervisor decida cancelar.
11. Cancelaciones y reagendamientos con distinción nítida: Supuesto 1 (Reagendada a fecha futura Naranja) y Supuesto 2 (Cancelada definitivamente Negro liquidando devengos); las cancelaciones no perduran como pines activos en el mapa, quedando registradas en el historial del día.
12. Principio de distribución y concomitancia operativa: sesiones síncronas concurrentes entre Boss e Ingenieros con sincronización en vivo y alertas visuales.
13. Resolución de averías de flota en el Drawer: llamada a grúa en 1 clic, aviso automático a clientes de tareas pendientes por Telegram, desacoplamiento de órdenes para Drop & Go retirando la cuadrilla receptora el material de picking en nave (Spec 004), y gestión de transporte alternativo ante incompatibilidad de plazas.
14. Resolución de rotura de herramientas y piezas: traspaso condicional evaluado algorítmicamente según la finalización de tareas matinales en la hoja de faena de la Cuadrilla B, logística de transporte físico determinada por el supervisor, capa de proveedores locales con verificación telefónica de stock, e imputación de incidencia técnica a quien ostenta la custodia física con inspección pericial del supervisor previa a cualquier valoración de negligencia en RRHH.
15. Operativa del vehículo de auxilio/apoyo: dotado de presencia GPS mediante la PWA y asignación de su propia hoja de tarea; contingencias y averías del vehículo de auxilio tratadas como eventos aislados e independientes.
16. Protocolo Offline-First delimitado: rige para datos técnicos de la hoja de tarea y traspasos en IndexedDB cifrado con Web Crypto API; las incidencias imprevistas exigen búsqueda de cobertura para desbloquear la faena; ante apagón total prolongado la cuadrilla prosigue en faena 100% offline.
17. Obligatoriedad documental de la PWA: ningún albarán de final de tarea se redacta sin la documentación completa de la PWA.
18. Supervisión humana de desviaciones al cierre: cero imputación automática al capataz sin negligencia constatada por el supervisor técnico.
19. Mandato Human-in-the-Loop innegociable: todos los albaranes y liquidaciones finales de obra exigen validación y aprobación humana explícita del supervisor o Boss antes de pasar a Facturación (`/gestio/comptabilitat`).
20. Trazabilidad disciplinaria objetiva: siniestros viales imputados estricta y exclusivamente según atestado oficial de tráfico o parte amistoso verificado, picking en almacén, y capataz en faltas colectivas.
21. Funcionalidad "Drop and Go" como recurso de contingencias con Hoja de Consumo de Emergencia.
22. Telemetría GPS eficiente (*Battery-Aware*) emitida exclusivamente por el capataz con apagado al fin de jornada, buffer de 25 minutos para alertas de pérdida de señal GPS en carretera, y delegación temporal de rol de capataz a un operario en caso de apagón o rotura de terminal.
23. Imputación horaria de operario por Start / Stop en obra de destino, con independencia de la duración del trayecto de traslado.
24. Prohibición estricta de imprudencias y sobreocupaciones de plazas en modo offline bajo apercibimiento disciplinario grave de seguridad vial.
25. Protocolo de continuidad de red técnica ante obstáculos no autorizados: by-pass provisional de emergencia facturando mano de obra y materiales consumidos a la orden, con soporte de RAG local.
26. Reactivación y transición de incidencias formalizada: el supervisor reactiva y resuelve en el Drawer web; el capataz cierra la tarea técnica en la PWA.
27. Tolerancia Cero a Datos Ficticios (*Zero Mock Data* con Estado Día 0 real centrado en base de empresa provista en onboarding).
28. Almacenamiento seguro soberano en memoria interna de la empresa y servidor Hetzner en Alemania (`/data/<empresa_id>/...` y `/docs/<empresa_id>/...`) con eliminación absoluta de AWS S3, garantizando privacidad y cumplimiento RGPD.
29. Rendimiento <200 ms y 60 fps estables garantizado mediante arquitectura asíncrona Celery + Redis para Whisper, Copilot y Telegram.

