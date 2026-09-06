# Spec 005 — Seguiment Feines / Mapa (/gestio/feines/mapa)

## Contexto y objetivo
La pantalla de Seguimiento de Trabajos y Mapa (`/gestio/feines/mapa`) es la **Torre de Control Geográfica en Tiempo Real** y el **Centro Operativo de Resolución de Incidencias** de la empresa técnica. Conecta la actividad diaria de las cuadrillas en campo con el equipo de supervisión y gestión en oficina técnica.

Proporciona una visión territorial unificada donde conviven simultáneamente dos capas dinámicas principales (la ubicación física georreferenciada de las obras/clientes y la posición GPS real de las furgonetas/cuadrillas) junto a una capa técnica vectorial propia de la empresa (redes subterráneas, tuberías, cables, hidrantes y válvulas) y una capa de puntos de venta de suministros técnicos locales.

Integra en su propia interfaz el **Centro de Resolución de Incidencias en Tiempo Real** a través de un **Drawer lateral emergente**:
- Los menús y paneles laterales permanecen **ocultos por defecto para priorizar la visibilidad limpia y amplia del mapa**.
- El Drawer de incidencias **se abre automáticamente ante la recepción de cualquier nueva incidencia** reportada en campo para su atención inmediata, o manualmente pasando el ratón por encima de la pestaña lateral (*hover*) o clicando en un pin rojo.
- La ruta `/gestio/incidencies` redirige automáticamente a `/gestio/feines/mapa?incidencies=obertes`, consolidando la gestión de incidencias en un único centro neurálgico sin dispersión de pantallas.
- Permite al supervisor escuchar audios de campo, revisar informes técnicos redactados por el **Copilot IA**, accionar llamadas telefónicas urgentes a clientes ante imprevistos críticos, enviar hojas de aceptación de presupuestos extra con un solo clic al **Bot de Telegram del cliente**, activar el protocolo de grúa ante averías de flota desacoplando órdenes y reasignando manualmente a los operarios de la furgoneta averiada, y localizar en el mapa ferreterías o distribuidores locales para verificar stock telefónicamente antes de desplazar a un operario.
- **Trazabilidad Multinivel del Historial de Incidencias:** Las incidencias quedan redactadas e indexadas dentro de la **hoja de tarea activa** donde se produjeron; si atañen a un vehículo se reflejan en el **historial del vehículo en Flota** (Spec 006); y si han sido causadas por negligencia o mala praxis de un operario (choque de coche, no coger herramienta/material existiendo stock en almacén, no enchufar el vehículo eléctrico en base), quedan indeleblemente reflejadas en el **expediente laboral del trabajador en RRHH**.
- **Mandato Constitucional Human-in-the-Loop:** Todos los albaranes, valoraciones y presupuestos que genere o contraste el Copilot **necesitarán obligatoriamente de la aprobación humana explícita** para pasar a facturación (`/gestio/comptabilitat`).

Toda la cartografía se sustenta sobre motores y capas abiertas (*Open Source* vía Leaflet, OpenStreetMap y ortofotos satelitales PNOA/ESRI), sin dependencias de APIs comerciales de pago, cumpliendo estrictamente con el principio de Tolerancia Cero a Datos Ficticios (*Zero Mock Data* con Estado Día 0 real), almacenamiento seguro de expedientes en discos locales del servidor (sin AWS S3), aislamiento multi-inquilino mandatorio (RLS) y soberanía de datos RGPD.

---

## Usuarios / actores y Matriz de Acceso
En la web de gestión (`/gestio`), esta pantalla es el centro de operaciones abierto a todos los perfiles, adaptando sus acciones operativas según su función:

- **Boss (Gerencia / Propietario):** Supervisión integral de la flota y despliegue territorial, resolución de incidencias graves desde el Drawer lateral, autorización de compras extraordinarias en ferreterías locales, asignación y reasignación de órdenes mediante *Drop and Go*, cambio de prioridades sobre la marcha, llamada directa a capataces, consulta de órdenes históricas y futuras, y **aprobación humana final de albaranes/presupuestos de Copilot para su derivación a facturación**.
- **Ingeniero / Supervisor Técnico:** Centro de mando técnico operativo: seguimiento del estado de ejecución de obras, atención inmediata en el Drawer lateral ante incidencias emergentes, audición de notas de voz de operarios, revisión de informes de Copilot, llamada urgente al cliente ante imprevistos críticos y envío de presupuestos extra por Telegram con 1 clic, activación de grúas en averías de flota desacoplando tareas y reasignando manualmente a los operarios de la Cuadrilla A, consulta de stock de herramientas en furgonetas cercanas (sin perjudicar a la Cuadrilla B) o localización cartográfica de ferreterías locales llamando previamente para asegurar stock, **aprobación y ajuste humano de los presupuestos y liquidaciones de Copilot antes de remitirlos a facturación**, y acceso a la hoja de trabajo en vivo.
- **Secretaria / RRHH:** Perfil de **solo lectura y consulta**. Supervisión visual del despliegue para atención telefónica a clientes, consulta de incidencias activas en el territorio desde el Drawer en modo lectura, verificación de presencia de cuadrillas en zonas de obra, canalización de avisos a mandos técnicos, y **recepción y custodia confidencial en el expediente del trabajador de las incidencias disciplinarias por negligencias en vehículos o herramientas**. **No dispone de permisos para asignar tareas, reasignar órdenes, arrastrar Drop and Go, autorizar compras ni alterar prioridades.**
- **Responsable de Cuadrilla (Capataz / `/operari`):** Opera desde su PWA móvil de campo. Emite telemetría GPS inteligente por eventos y, ante una incidencia imprevista, tiene la obligación procedimental de **buscar activamente una zona con cobertura para reportar de inmediato** con audio y fotos. En trabajos ordinarios sin incidencias, la PWA sincroniza al recuperar cobertura para contrastar con el presupuesto inicial.
- **Operario de Cuadrilla (`/operari`):** Ejecuta la faena técnica en campo. Puede continuar con las fases viables de la obra mientras el capataz y la oficina técnica gestionan la aprobación de un imprevisto con el cliente. Queda sujeto al registro disciplinario en su expediente si comete negligencias en vehículos o dotación de material.
- **Cliente Final (Canal Multicanal: Bot de Telegram, Email y Teléfono):** Recibe avisos de salida y llegada. Ante imprevistos de obra, recibe por Telegram el informe técnico de Copilot con fotos y la hoja de aceptación interactiva para aprobar el presupuesto extra con un solo clic (`Aprobar ampliación [Importe €]`), o atiende la llamada telefónica urgente del supervisor si la intervención requiere autorización inmediata.

---

## Historias de usuario
- **H1:** Como *Ingeniero o Boss*, quiero ver sobre el mapa comarcal la ubicación de todas mis cuadrillas y el estado de sus trabajos hoy para detectar cuellos de botella e intervenir de inmediato ante cualquier incidencia en el terreno.
- **H2:** Como *Ingeniero*, quiero que los menús laterales permanezcan ocultos por defecto para disfrutar de una visión limpia y despejada del mapa, abriéndose el Drawer de incidencias de forma automática únicamente cuando entre una incidencia de campo.
- **H3:** Como *Ingeniero*, cuando una cuadrilla reporte una avería oculta o necesidad de material extra en obra, quiero que el sistema me muestre el teléfono del cliente para una llamada urgente directa si la cuadrilla está parada, mientras el Copilot redacta el informe pericial con fotos y envía a su Telegram la hoja de aceptación de presupuesto extra a 1 clic.
- **H4:** Como *Ingeniero*, cuando una furgoneta sufra una avería inmovilizante en ruta, quiero activar la grúa con un clic desde el Drawer, avisar automáticamente al cliente por Telegram de la demora, desacoplar la tarea para reasignarla por Drop and Go y poder reasignar manualmente a los operarios de la cuadrilla averiada para que continúen trabajando.
- **H5:** Como *Supervisor*, cuando a una cuadrilla se le rompa una herramienta o falte una pieza, quiero comprobar si una cuadrilla cercana la tiene en su dotación pero permitiendo el traspaso solo si no perjudica a la segunda cuadrilla, o consultar en el mapa los distribuidores y ferreterías locales cercanas para llamar y verificar el stock antes de enviar al operario.
- **H6:** Como *Capataz de campo*, cuando surja un imprevisto grave en una zanja en zona rural, quiero saber que debo buscar un punto con cobertura para enviar la nota de voz y fotos de inmediato a la base, permitiendo a mis compañeros seguir avanzando en lo que puedan mientras la oficina técnica lo resuelve.
- **H7:** Como *Ingeniero*, cuando una cuadrilla finalice una jornada ordinaria sin incidencias, quiero que al sincronizar los datos de la PWA el sistema contraste automáticamente los materiales y horas reales frente al presupuesto inicial aprobado para detectar desviaciones, pero requiriendo obligatoriamente mi aprobación humana antes de pasar el albarán a Facturación.
- **H8:** Como *Secretaria o Boss*, quiero que toda incidencia quede registrada en la hoja de tarea, y si afectó a un vehículo quede anotada en su ficha de flota, o si fue por negligencia de un operario (golpe al furgón, no coger material disponible, no enchufar el EV) quede registrada en su expediente laboral de RRHH.

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
  2. Cada orden de trabajo dispondrá de una **geovalla perimetral de 50 metros de cortesía** para el control de presencia en obra en zonas rurales o fincas con Punto Cero en cancela de acceso; **SI la señal GPS y cobertura móvil son precisas, el sistema no aplicará el margen de 50 metros y evaluará el fichaje sobre las coordenadas exactas del punto de intervención**. Una vez cruzada la cancela de acceso (Punto Cero) y fichada la llegada, la cuadrilla permanecerá en estado **Verde (En faena)** computando el tiempo con independencia de desplazamientos internos por la finca.
  3. *Inaccesibilidad Física al Punto Cero (Cancela con Candado):* SI la cuadrilla llega a la cancela y encuentra el acceso físico bloqueado, el operario registrará la **Incidencia de Acceso Bloqueado**, conmutando el pin a **Rojo (Incidencia)** en el mapa. EL SISTEMA activará el contacto urgente con el cliente. Si existe un acceso alternativo, el operario anulará la incidencia y el sistema actualizará las coordenadas sin penalización. Si el cliente acude con demora a abrir la cancela, **el tiempo de espera se computará y facturará directamente como hora ordinaria desde la hora de llegada original (fichaje en Punto Cero)**. Si el acceso resulta inviable tras la espera estipulada, el supervisor reasignará la cuadrilla y **se liquidará al cliente el coste del desplazamiento**.
- **RF-06:** SI dos o más órdenes de trabajo coinciden en la misma finca, edificio o parcela muy próxima, ENTONCES EL SISTEMA agrupará los marcadores en una burbuja numérica de agrupación (*clustering*); CUANDO el usuario hace clic sobre la burbuja, EL SISTEMA desplegará un abanico permitiendo **consultar y abrir cada orden de trabajo de forma completamente individual**. Si coinciden dos cuadrillas en la misma parcela, el sistema advertirá de la coincidencia física en la campana global de incidencias.

### Bloque 2: Código Cromático de Estados y Popovers Informativos
- **RF-07:** EL SISTEMA representará los marcadores (*pins*) de las órdenes de trabajo y activos móviles mediante una simbología cromática unificada:
  1. *Naranja:* **Pendiente / No iniciada** (cuadrilla aún no ha iniciado el desplazamiento).
  2. *Azul:* **En tránsito con tarea asignada / En camino** (desplazamiento hacia la orden asignada).
  3. *Verde:* **En faena / En curso** (cuadrilla dentro de la geovalla de la obra con llegada fichada).
  4. *Rojo:* **Con incidencia activa / Parada técnica** (avería de vehículo, falta de material, fallo de máquina o parada técnica). La gestión y resolución se realiza desde el Drawer lateral de incidencias por el supervisor; resuelta la incidencia, conmuta manualmente a Azul o Verde.
  5. *Blanco:* **Completada** (tarea finalizada, documentada con fotos y cerrada por la cuadrilla; incluye órdenes cerradas bajo "Cliente Ausente").
  6. *Negro:* **Cancelada en ruta** (orden cancelada durante el desplazamiento de la cuadrilla).
  7. *Lila / Púrpura (Standby o Tránsito sin Tarea):* Cuadrillas o vehículos activos en jornada que **no tienen ninguna orden en curso asignada** (espera en nave o retorno a base).
- **RF-08:** CUANDO el usuario hace clic sobre el marcador de una orden de trabajo en el mapa, EL SISTEMA desplegará una tarjeta emergente (*popover*) con: cliente, teléfono directo (`tel:`), cuadrilla y vehículo asignados, estado operativo y enlace interactivo para abrir la **hoja de trabajo completa**.
- **RF-09:** CUANDO el usuario hace clic sobre el marcador de un vehículo/cuadrilla, EL SISTEMA desplegará un popover con: identificador del vehículo (enlace a Flota `/gestio/flota`), capataz responsable (enlace a su ficha), relación nominal de operarios a bordo, orden en curso y botón destacado de **"Llamar al Capataz"** (`tel:`).

### Bloque 3: Interfaz Limpia, Paneles Ocultos y Navegación Temporal
- **RF-10:** PRIORIDAD A LA VISIÓN LIMPIA DEL MAPA Y PANELES COLAPSABLES:
  1. Todos los paneles laterales (panel de órdenes del día y Drawer de incidencias) **permanecerán ocultos y colapsados por defecto** para maximizar la visibilidad y supervisión global del mapa geográfico.
  2. El panel lateral de órdenes de la jornada se desplegará a voluntad del usuario pasando el ratón (*hover*) o pulsando sobre su pestaña lateral izquierda, mostrando la secuencia planificada de ejecución.
  3. Las órdenes canceladas en ruta se desplazarán automáticamente a una sección inferior colapsable (*"Órdenes Canceladas / Pendientes de Reprogramar"*) destacadas en negro.
- **RF-11:** CUANDO el usuario hace clic sobre una orden de trabajo en el panel lateral, EL SISTEMA **hará destellar y parpadear visualmente (*highlight*) el marcador de la cuadrilla y la obra asignada en el mapa**, manteniendo inalterado el nivel de zoom para no desorientar el contexto geográfico global.
- **RF-12:** EL SISTEMA estructurará la navegación temporal mediante un **selector de fecha conmutado (filtro temporal mutuamente excluyente)**:
  1. *Filtro de Jornada Activa ("HOY"):* Coexisten cuadrillas activas con telemetría GPS en vivo y órdenes de trabajo programadas para la jornada.
- **RF-13:** CUANDO el usuario conmuta a una fecha diferente en el filtro temporal:
  1. *Filtro de Días Pasados:* Renderizado estático retrospectivo de los puntos geográficos donde se cerraron las obras; **las cuadrillas y furgonetas no se dibujan en fechas pasadas y en ningún caso se registrarán ni dibujarán trazas de carretera** (privacidad RGPD).
  2. *Filtro de Días Futuros:* Proyecta la dispersión geográfica de las obras agendadas para planificar y optimizar rutas; **la capa de cuadrillas permanece desactivada al carecer de telemetría física anticipada**.

### Bloque 4: Filtros Rápidos de Mando y Búsqueda
- **RF-14:** EL SISTEMA dispondrá de una barra superior de filtros operativos que permitirá aislar la visualización del mapa por:
  1. *Filtro por Cuadrilla / Vehículo:* Muestra exclusivamente los puntos de una furgoneta seleccionada.
  2. *Filtro por Estado Operativo:* Conmuta obras según sus colores (Naranja, Azul, Verde, Negro, Blanco).
  3. *Filtro Prioritario de Incidencias:* Aísla instantáneamente en el mapa todas las obras o cuadrillas en estado **Rojo** (con incidencias o paradas técnicas activas).
  4. *Buscador de Texto:* Localiza en tiempo real una orden de trabajo, cliente o dirección en el mapa.

### Bloque 5: Mando Operativo, "Drop and Go" e Intervenciones Urgentes en Campo
- **RF-15:** EL SISTEMA habilitará acciones de mando operativo en el mapa **exclusivamente para los roles con permisos de escritura técnica (`Boss` e `Ingeniero`)**, manteniendo al rol `Secretaria` en modo estricto de solo lectura y consulta:
  1. Reasignar órdenes de trabajo arrastrándolas en el mapa o panel lateral.
  2. Alterar el orden de prioridad y secuencia de ejecución de las tareas pendientes de una cuadrilla.
  3. RESTRICCIÓN DE ASIGNACIÓN ORDINARIA: No permitirá asignar una obra ordinaria a una cuadrilla sin hoja de picking de nave cargada con el material necesario (Spec 004), salvo en cancelaciones previas con traspaso de stock consolidado (RF-25).
  4. *Blindaje Operativo en Zonas de Sombra:* Si una cuadrilla opera en zona de sombra, la orden permanecerá en estado Verde (En faena) y el supervisor no asignará ninguna otra tarea en esa franja horaria. Al recuperar cobertura, la PWA sincronizará automáticamente todos los datos hacia la base de datos central.
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
  3. *Concurrencia de Mando:* Ante dos supervisores actuando sobre la misma cuadrilla, la primera petición se consolida y la segunda se rechaza con el mensaje: *"Cuadrilla ocupada para la franja horaria solicitada"*.
  4. *Persistencia:* Si tras un Drop and Go la cuadrilla entra en zona de sombra, la orden continúa asignada; solo el supervisor puede desasignarla o reubicarla manualmente.

### Bloque 6: Telemetría GPS Eficiente (*Battery-Aware*) y Pérdida de Cobertura
- **RF-19:** LA PWA ejecutará una política de telemetría GPS inteligente orientada al ahorro de batería, **prohibiendo el rastreo por polling continuo**:
  1. Emitida **exclusivamente a través del dispositivo del Responsable de Cuadrilla** (capataz).
  2. Disparo prioritario por **eventos de cambio de estado geográfico** (inicio de jornada, inicio de ruta, proximidad a 50 m, fichaje de llegada, cierre de tarea y fin de jornada).
  3. En trayectos prolongados en carretera (estados Azul y Lila), muestreo periódico espaciado cada 10 a 15 minutos.
  4. Al fichar **Fin de Jornada**, la telemetría GPS se desactiva de inmediato (RGPD), quedando el marcador fijo en la última posición registrada hasta medianoche.
- **RF-20:** PÉRDIDA DE COBERTURA EN CAMPO:
  1. *Check de Tarea sin Conexión (En Faena):* Si la cuadrilla está dentro de la geovalla en **Verde (En faena)** y pierde señal, el sistema suprime falsas alarmas y mantiene el estado Verde con el indicador de última posición en obra.
  2. *Pérdida de Señal en Carretera (Azul y Lila):* Si la ausencia de señal en desplazamiento supera los 15 minutos, el vehículo se muestra atenuado/translúcido con etiqueta *"Sin señal hace [X] min"* y reborde de alerta visual en el mapa y campana; al recuperar señal y emitir coordenada válida, el sistema restaura la opacidad y normaliza el estado automáticamente.

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
  3. *By-pass Provisional de Emergencia:* Tendido provisional en superficie con polietileno flexible para restablecer servicio en menos de 1 hora, imputando el tiempo a la orden como *"Instalación de By-pass de Emergencia"*.
  4. *Negativa del Propietario:* Registro fehaciente de la negativa en PWA; la cuadrilla se repliega y el supervisor consulta el asistente RAG para gestionar la respuesta contractual.
  5. *Actualización de Traza:* Incorporación del obstáculo y desvío en la Capa Vectorial, derivando el proyecto de variante definitiva a oficina técnica.
- **RF-23:** TRANSFERENCIA DE OPERARIOS ENTRE CUADRILLAS EN CAMPO:
  1. Apertura de incidencia de dotación en el mapa seleccionando operarios y vehículo de destino.
  2. Actualización de la composición de la cuadrilla en el popover y registro de presencia.
  3. Imputación horaria del operario transferido: comienza estrictamente **a partir de su hora de llegada confirmada a la obra de destino**.
  4. Control estricto de Plazas Operativas Reales (RF-28 Spec 006): validación en backend que bloquea trasvases que superen los asientos físicos habilitados en el vehículo receptor.

### Bloque 8: Canal de Comunicación Multicanal con el Cliente Final
- **RF-24:** COMUNICACIÓN TRANSACCIONAL VÍA TELEGRAM, EMAIL Y TELÉFONO:
  1. *Aviso de Salida y Aproximación:* Al iniciar ruta (**Azul**), remite notificación con código OT, dirección y hora estimada de llegada (sin enlaces de rastreo continuo en vivo).
  2. *Aviso de Llegada:* Al llegar a la parcela o fichar en Punto Cero, notifica de inmediato al cliente el inicio de los trabajos.
  3. *Aviso de Retraso Vial:* En incidencias de tráfico o avería, notifica el retraso estimado de forma transparente.
  4. *Aprobación Interactiva de Imprevistos en Obra (1 Clic) y Contingencia Offline:* Envía foto pericial, descripción y presupuesto con botones `[✅ Aprobar y continuar]` y `[❌ Rechazar / Hablar con Ingeniero]`. Al aprobar, desbloquea la PWA en tiempo real. En zonas sin cobertura, permite recoger la firma física del cliente en la pantalla de la PWA en modo 100% offline.
  5. *Validación en Cliente Ausente:* Conmuta pin a Blanco y remite el parte con fotos y botón `[✍️ Confirmar y Validar Recepción]` a efectos informativos diferidos.

### Bloque 9: Contingencias de Jornada y Gestión de Stock a Bordo
- **RF-25:** CANCELACIÓN DE OBRA EN RUTA (ESTADO AZUL):
  1. Señal acústica y alerta visual de cancelación en PWA.
  2. Pin conmuta a **Negro (Cancelada en ruta)** y se desplaza a la sección inferior de canceladas del panel lateral; la siguiente tarea se promociona a cabecera.
  3. *Gobierno de Stock:* Los materiales cargados quedan en custodia a bordo para reingreso en almacén central al cierre de jornada, salvo reubicación inmediata.
  4. *Reubicación y Consolidación de Stock:* Si la oficina técnica asigna una tarea sustitutiva que aprovecha los materiales de la cancelada, se tramita mediante Incidencia de Cambio de Asignación conformando una unidad de stock sin forzar retorno a nave.
  5. Agendada una nueva fecha con el cliente, el pin negro desaparece de la jornada activa de hoy y pasa a figurar en la nueva fecha futura.
  6. *Cancelación en Faena (Verde):* Conmuta a **Rojo**, recopila horas y materiales consumidos hasta el momento para su liquidación técnica, y los materiales no instalados quedan en custodia para retorno o reubicación.
- **RF-26:** RESOLUCIÓN DE HUECOS IMPRODUCTIVOS POR FINALIZACIÓN ANTICIPADA:
  1. Notificación a la base en el mapa `/gestio/feines/mapa`.
  2. Tramitación en mapa mediante: a) Reasignación de tarea nueva mediante Drop and Go con stock compatible, o b) Apoyo y convergencia con cuadrilla cercana retrasada.

### Bloque 10: Estado "Día 0" y Control de Mando
- **RF-27:** ESTADO "DÍA 0" (TOLERANCIA CERO A DATOS FICTICIOS):
  1. Cámara del mapa centrada en las coordenadas de la sede o Almacén Central de la empresa.
  2. Mapa completamente limpio, sin cuadrillas simuladas ni pines dummy (*Zero Mock Data*).
  3. Panel lateral muestra estado vacío real (*"Sin tareas programadas para esta fecha"*).
- **RF-28:** MATRIZ DE ACCESO EN EL MAPA:
  1. Rol `Secretaria`: Acceso de **solo lectura y consulta telefónica** (sin controles de arrastre, reasignación ni autorización de compras).
  2. Roles `Boss` e `Ingeniero`: Permisos de escritura y mando operativo completo (*Drop and Go*, reasignaciones, resolución de incidencias en Drawer y alteración de prioridades).

---

### Bloque 11: Centro de Resolución de Incidencias en el Mapa (Drawer Lateral Emergente)
- **RF-29:** DRAWER LATERAL DE INCIDENCIAS EN `/gestio/feines/mapa` Y REDIRECCIÓN DESDE MENÚ:
  1. *Comportamiento por Defecto y Prioridad del Mapa:* El Drawer lateral de incidencias (ubicado en el margen derecho de la pantalla) **permanecerá oculto y colapsado por defecto**, priorizando la visibilidad amplia, fluida y sin obstáculos de la cartografía y las cuadrillas activas.
  2. *Apertura Automática Emergente ante Nuevas Incidencias:* En el instante en que cualquier cuadrilla reporte una incidencia desde campo (o se detecte una parada técnica o inmovilización de flota), **el Drawer lateral se abrirá de forma automática y emergente en pantalla**, enfocando de inmediato la incidencia entrante para su atención urgente por el supervisor sin requerir navegación manual.
  3. *Apertura Manual por Hover o Clic:* El supervisor podrá desplegar el Drawer en cualquier momento pasando el ratón (*hover*) sobre la pestaña lateral derecha del mapa, o haciendo clic sobre cualquier marcador rojo del mapa o sobre la campana de alertas del Dashboard.
  4. *Redirección Unificada de la Ruta `/gestio/incidencies`:* La URL `/gestio/incidencies` redirigirá de forma automática y transparente a `/gestio/feines/mapa?incidencies=obertes`, abriendo la interfaz cartográfica con el Drawer de incidencias desplegado y enfocado, garantizando que el usuario resuelva todas las incidencias siempre en su contexto territorial.
  5. *Contenido Estructurado del Drawer:*
     - Reproductor de audio nativo del operario (escucha directa e inmediata desde el primer segundo).
     - Galería de fotografías periciales de campo ampliables.
     - **El Memorándum e Informe Técnico redactado por Copilot** (diagnóstico, piezas estimadas y propuesta económica).
     - Botones de acción operativa inmediata según la tipología de la incidencia.
- **RF-30:** GESTIÓN DE IMPREVISTOS DE OBRA CON EL CLIENTE (COPILOT + TELEGRAM + LLAMADA URGENTE):
  1. *Llamada Urgente al Cliente:* SI la aprobación del material o tarea extra es indispensable para que la cuadrilla pueda continuar trabajando sin incurrir en horas muertas:
     - El Drawer desplegará de forma destacada el **teléfono de contacto directo del cliente con botón de marcación urgente inmediata (`tel:`)** para que el supervisor gestione la autorización verbal al instante.
  2. *Informe de Copilot y Hoja de Aceptación por Telegram:* De forma simultánea y automatizada:
     - El asistente **Copilot redactará un informe técnico completo de la incidencia**, incorporando la descripción del imprevisto y las fotografías periciales capturadas por el operario.
     - EL SISTEMA remitirá dicho informe al **Bot de Telegram del Cliente Final** acompañado de la **hoja interactiva de aceptación de presupuesto extra**.
     - El mensaje incluirá el botón de un solo clic: **"Aprobar ampliación [Importe €]"**.
     - Al pulsar el cliente sobre el botón en Telegram, la incidencia conmuta automáticamente a estado aprobada, se incorpora la partida suplementaria a la orden y la PWA del operario queda desbloqueada.
  3. *Continuidad de Trabajos Viables en Campo:* Mientras se tramita la resolución telefónica o la respuesta telemática del cliente, la cuadrilla **continuará ejecutando todas aquellas labores de la obra que no dependan del imprevisto reportado**, minimizando paradas técnicas.
- **RF-31:** RESOLUCIÓN DE AVERÍAS DE FLOTA EN EL DRAWER Y REASIGNACIÓN MANUAL DE CUADRILLA A:
  1. CUANDO una cuadrilla reporte una avería mecánica inmovilizante o pinchazo en carretera:
  2. El Drawer de Incidencias activará las siguientes tres acciones coordinadas en un solo flujo:
     - *a) Activación de Grúa y Taller:* Suministra la llamada directa con la aseguradora y datos de póliza (Spec 006), dirigiendo la grúa al Concesionario Oficial configurado (si es en garantía y dentro de la comarca base/adyacentes) o al taller concertado seleccionado.
     - *b) Notificación Automática de Demora al Cliente:* EL SISTEMA remitirá un mensaje inmediato por Telegram (o Email) al cliente de la obra pendiente que estaba esperando a la furgoneta, informándole de forma proactiva del imprevisto técnico de transporte y recalculando la previsión.
     - *c) Desacoplamiento de Órdenes Pendientes:* Las tareas que la cuadrilla averiada tenía programadas se desacoplan de su furgoneta y quedan disponibles en el mapa como órdenes no asignadas, listas para ser reubicadas mediante *Drop and Go* hacia otra cuadrilla cercana disponible o reprogramadas en fecha si ninguna cuadrilla puede asumirlas hoy.
  3. *Reasignación Manual de los Operarios de la Cuadrilla A:* El supervisor dispondrá en el Drawer de la opción de **reasignación manual de los operarios de la furgoneta averiada**: si otra cuadrilla cercana dispone de plazas físicas operativas en su furgoneta, el supervisor coordinará telefónicamente el punto de recogida para que los trabajadores se incorporen al trabajo en curso, o bien gestionará su retorno a la base para asignarlos a otra tarea.
- **RF-32:** INCIDENCIAS DE HERRAMIENTAS, TRASPASO NO PERJUDICIAL Y PROVEEDORES LOCALES EN EL MAPA:
  1. CUANDO una cuadrilla reporte la rotura de una herramienta crítica o la falta de un accesorio/pieza no disponible en la dotación de la furgoneta:
  2. *Traspaso Condicional sin Perjuicio a Cuadrilla B:*
     - El Drawer analizará las furgonetas cercanas y comprobará si alguna dispone de la herramienta o recambio en su dotación de almacén (Spec 004).
     - **Condición Restrictiva Innegociable:** El traspaso de la herramienta en campo **ÚNICAMENTE se autorizará si NO supone un obstáculo o perjuicio para la Cuadrilla B** (es decir, si la Cuadrilla B no requiere dicha herramienta para sus propias tareas programadas de la jornada).
     - Si la herramienta es necesaria para la Cuadrilla B, **el traspaso no se realizará**. Se prioriza la consulta y llamada directa entre capataces y el supervisor tiene siempre la última palabra.
  3. *Capa Cartográfica de Proveedores y Ferreterías Locales:*
     - Para evitar que un operario pierda horas deambulando con el vehículo en busca de un recambio, el supervisor dispondrá en el mapa de una capa conmutable de **Puntos de Venta Técnicos y Ferreterías Locales cercanas a la zona de la obra**.
     - El popover del proveedor en el mapa exhibirá su especialidad y teléfono directo (`tel:`).
     - El supervisor llamará previamente a la ferretería/distribuidor para **verificar telefónicamente que la pieza exacta está físicamente en stock y reservada**.
     - Solo tras confirmar el stock, el supervisor despachará al operario al punto exacto de venta, o bien autorizará la salida de un vehículo de apoyo desde el almacén central si resulta más eficiente.
- **RF-33:** PROTOCOLO DE COBERTURA EN INCIDENCIAS Y CONTRASTE PRESUPUESTARIO AL CIERRE CON MANDATO HUMAN-IN-THE-LOOP:
  1. *Obligación de Búsqueda Activa de Cobertura en Incidencias Reales:*
     - Si una cuadrilla sufre o detecta una **incidencia real imprevista en campo**, el operario responsable (cap de colla / capataz) tiene la **obligación procedimental de desplazarse hasta encontrar un punto con cobertura móvil** para reportar inmediatamente la nota de voz y las fotografías a la oficina técnica, impidiendo que una avería urgente quede estancada sin conocimiento de la base.
  2. *Sincronización al Cierre y Contraste Presupuestario en Obras sin Incidencia:*
     - Si la obra se ejecuta y finaliza con normalidad **sin incidencias imprevistas**, la PWA sincronizará automáticamente todos los datos en cuanto el terminal recupere cobertura móvil.
     - TRAS la sincronización del cierre, EL SISTEMA **contrastará automáticamente los consumos reales (horas de mano de obra invertidas y materiales/piezas consumidas) frente al presupuesto inicial aprobado por el cliente**, detectando posibles desviaciones económicas.
  3. *Mandato Constitucional Human-in-the-Loop para Facturación:*
     - El Copilot redactará la propuesta de albarán/presupuesto final liquidado con el desglose de desviaciones.
     - **EN NINGÚN CASO se emitirá una factura ni se derivará automáticamente a Contabilidad sin la aprobación humana explícita**:
     - El supervisor técnico o `Boss` deberá **revisar, ajustar y validar con firma digital/clic explícito el albarán final**, y solo tras esta autorización humana el documento se remitirá al módulo de Facturación (`/gestio/comptabilitat`) para su emisión conforme a la normativa Veri*factu (RD 1007/2023).
- **RF-34:** TRAZABILIDAD MULTINIVEL DEL HISTORIAL DE INCIDENCIAS (HOJA DE TAREA, VEHÍCULO Y EXPEDIENTE LABORAL):
  1. *Registro Primario en la Hoja de Trabajo:*
     - Toda incidencia reportada se registrará e incorporará de forma indeleble en la **hoja de tarea / orden de trabajo activa** donde se haya producido el hecho, conservando la nota de voz original, la transcripción oficial, las fotografías periciales, el informe de Copilot y la resolución técnica ejecutada.
  2. *Replicación en el Historial del Vehículo (Flota, Spec 006):*
     - SI la incidencia atañe a un vehículo o activo móvil (colisión o golpe de chapa, pinchazo en carretera, avería de motor, fallo en punto de recarga o no confirmación de enchufe en EV al finalizar jornada):
     - EL SISTEMA **replicará automáticamente la incidencia en el historial técnico del vehículo afectado** (`/gestio/flota/<identificador_actiu>`), dejando constancia de la afectación mecánica, orden de taller (ORT) o no conformidad.
  3. *Anotación en el Expediente Disciplinario del Trabajador (RRHH):*
     - SI la incidencia ha sido provocada por una negligencia manifiesta o mala praxis de un operario (p. ej. choque con el vehículo por distracción o imprudencia, no cargar en la furgoneta una herramienta o material existiendo stock disponible en el almacén central, omisión deliberada de la recarga nocturna del vehículo eléctrico en base, o daños no declarados descubiertos en auditorías posteriores):
     - EL SISTEMA **registrará una incidencia disciplinaria en el expediente laboral del trabajador responsable** (`/gestio/treballadors`).
     - Dicha anotación quedará grabada de forma permanente para el seguimiento laboral y de prevención de riesgos (PRL), siendo accesible de forma confidencial **exclusivamente para los roles `Secretaria / RRHH` y `Boss`**.

---

## Requisitos No Funcionales
- **Cartografía Soberana y Gratuita (Cero Costes de API):** Visualización mediante Leaflet / MapLibre con capas libres (OpenStreetMap y PNOA/ESRI), sin cuotas de facturación por peticiones cartográficas ni fuga de datos a terceros.
- **Rendimiento Ultrarrápido y Fluidez a 60 fps:** La renderización de 50 marcadores de obra, 15 vehículos simultáneos, capas técnicas vectoriales y apertura reactiva del Drawer de incidencias responderá con latencia inferior a 200 ms y 60 fps estables en Next.js.
- **Arquitectura Asíncrona (Celery + Redis):** El procesamiento de audios de campo con Whisper v3, la generación del informe de Copilot y las notificaciones automáticas por Telegram a clientes y grúas se ejecutan en segundo plano en Celery, garantizando que el event loop de FastAPI nunca se bloquee.
- **Seguridad Multi-Tenant (RLS):** Aislamiento estricto por `app.current_empresa_id` en todas las tablas de obras, cuadrillas, incidencias, telemetría y capas vectoriales.
- **Privacidad Laboral y RGPD:** Prohibido registrar o dibujar trazas de carretera continuas en el mapa histórico; solo se persisten eventos de presencia y fichajes en obras y bases autorizadas.
- **Diseño Camaleón:** La interfaz del mapa, el Drawer lateral emergente y los mensajes del Bot de Telegram adoptan dinámicamente las variables de marca corporativa (`--color-primary`, `--color-secondary`, etc.) de la empresa.

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
3. Capa vectorial propia de infraestructura técnica de la empresa (tuberías, redes BT, arquetas) integrable mediante GeoJSON/KML local.
4. Georreferenciación obligatoria previa de todas las órdenes de trabajo con geovalla de 50 metros y protocolo de Punto Cero con cancela cerrada.
5. Código cromático de estados operativos claramente definido (Naranja, Azul, Verde, Rojo, Blanco con cierre inmediato en Cliente Ausente, Negro para canceladas y Lila para standby).
6. Prioridad absoluta a la visión despejada del mapa: paneles laterales ocultos por defecto que se despliegan por hover o interacción intencionada.
7. Drawer lateral derecho de incidencias con apertura automática ante nuevas incidencias de campo y redirección unificada desde `/gestio/incidencies`.
8. Gestión de imprevistos con el cliente: teléfono destacado para llamada urgente directa del supervisor si es crítico, e informe automático de Copilot con fotos y botón de aprobación de presupuesto extra a 1 clic por Telegram.
9. Resolución de averías de flota en el Drawer: llamada a grúa en 1 clic, aviso automático a clientes de tareas pendientes por Telegram, desacoplamiento de órdenes para Drop & Go y reasignación manual de los operarios de la Cuadrilla A.
10. Resolución de rotura de herramientas: traspaso desde furgoneta cercana condicionado a no perjudicar las tareas de la Cuadrilla B, y capa de proveedores/ferreterías locales en el mapa para verificación telefónica de stock antes de desplazar al operario.
11. Protocolo de cobertura: capataz obligado a buscar cobertura activa para reportar incidencias reales; y para obras sin incidencias, sincronización al recuperar cobertura con contraste automático frente al presupuesto inicial aprobado y derivación a Facturación.
12. Mandato Human-in-the-Loop innegociable: todos los albaranes y presupuestos generados por Copilot exigen validación y aprobación humana explícita del supervisor o Boss antes de pasar a Facturación (`/gestio/comptabilitat`).
13. Trazabilidad multinivel del historial de incidencias: registrada en la hoja de tarea activa, replicada en el historial del vehículo en Flota (Spec 006) y anotada en el expediente disciplinario del trabajador en RRHH ante negligencias comprobadas.
14. Funcionalidad "Drop and Go" como recurso de contingencias con Hoja de Consumo de Emergencia.
15. Circuito formal de imputación en PWA (foto inicio, piezas, horas, imputación de cancela, fotos de cierre).
16. Telemetría GPS eficiente (*Battery-Aware*) emitida exclusivamente por el capataz con apagado al fin de jornada.
17. Protocolo de pérdida de señal con check de tarea sin conexión vs. advertencia vial en carretera (Azul y Lila).
18. Protocolo secuencial de incidencias de flota (Seguro ➔ Grúa ➔ ETA ➔ Diagnóstico In Situ ➔ Condicional).
19. Protocolo de continuidad de red técnica ante obstáculos no autorizados (by-pass provisional en superficie y RAG local).
20. Transferencia de operarios entre cuadrillas gestionada como incidencia de dotación con validación estricta de plazas.
21. Canal multicanal de comunicación con el cliente (Telegram, Email y teléfono directo).
22. Contingencias de jornada: cancelación en ruta con custodia de stock a bordo y reubicación de huecos por finalización anticipada.
23. Tolerancia Cero a Datos Ficticios (*Zero Mock Data* con Estado Día 0 real centrado en base de empresa).
24. Acceso abierto en la web de gestión a todos los perfiles (`Boss`, `Secretaria`, `Ingeniero`).
25. Rendimiento <200 ms y 60 fps estables garantizado mediante arquitectura asíncrona Celery + Redis para Whisper, Copilot y Telegram.
