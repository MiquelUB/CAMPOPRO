# Spec 004 — Módulo de Magatzem i Inventari (/gestio/magatzem)

## Contexto y objetivo
El módulo de Magatzem i Inventari es el pulmón operativo y logístico de la empresa técnica. Conecta la entrada de materiales desde los albaranes y facturas de compra de los proveedores (Spec 003) con la preparación matinal de suministros para las cuadrillas y su consumo e imputación exacta en cada orden de trabajo ejecutada en campo (PWA `/operari`).

Resuelve con rigor la gestión multialmacén simultánea (Almacén Central en nave física, stock rodante en furgonetas tratadas como **talleres móviles con dotación base bajo la custodia del Responsable de Cuadrilla**, y asignaciones directas a operarios), la codificación individual de maquinaria por número de serie (`[Herramienta] [Nº Ejemplar] = [Número de Serie]`), la reserva y control de stock en planificación (con certeza absoluta para tareas del día y detección de roturas futuras con redacción de pedido por IA sin contar retornos hipotéticos), el protocolo de picking guiado por **criterio FEFO (First Expired, First Out)** para químicos y resinas, la prioridad absoluta de la ejecución en campo sin bloqueos por desconexión offline en traspasos entre furgonetas (sincronizando al recuperar cobertura o al llegar a base), la disponibilidad inmediata de sobrantes entre tareas dentro de la misma jornada, la liberación automática de herramientas retornables al cerrar el picking vespertino sin incidencias, el cambio de furgoneta en ruta por avería tratado como incidencia de flota con resolución humana, el régimen de **materiales en depósito / consignación** (facturados normalmente al cliente y liquidados al distribuidor por consumo real), la actualización automática del precio de referencia de almacén para futuros presupuestos ante nuevos albaranes, el blindaje fiscal de anticipos devengados formalmente (mínimo 45% o 100% de materiales con Veri*factu), y el bloqueo anticipado en calendario de herramientas con calibración obligatoria agendada.

Toda la arquitectura respeta el principio de Tolerancia Cero a Datos Ficticios (*Zero Mock Data* con Estado Día 0 real), almacenamiento de expedientes en discos locales del Mini PC (sin AWS S3), aislamiento multi-inquilino mandatorio (RLS) y segregación *Zero-Trust* delimitada entre la operativa técnica del ingeniero y las métricas macroeconómicas de gerencia.

---

## Usuarios / actores y Matriz de Acceso (Zero-Trust)
El backend garantiza el aislamiento multi-inquilino (RLS) y la segregación estricta de permisos por rol:

- **Boss (Gerencia / Propietario):** Acceso total e irrestricto a la gestión de almacén, altas manuales y por OCR, configuración de umbrales (mínimo/óptimo), aprobación de compras consolidadas por IA para stock inmediato y tareas futuras comprometidas, resolución de incidencias y no conformidades con proveedores, liquidación de depósitos/consignaciones, tramitación de bajas por robo con atestado policial, calendario de calibraciones, **valoración económica total del inventario en euros (€) basada en el último precio de compra y acceso al panel macroeconómico confidencial de la empresa**.
- **Secretaria / RRHH:** Acceso total operativo al directorio de inventario, altas manuales y por OCR de albaranes/facturas, liquidación de material en depósito con distribuidores, tramitación de no conformidades con proveedores y RMAs directos de almacén central, emisión de facturas de anticipo por aceptación de presupuesto (mín. 45% o 100% materiales), **consulta de costes de compra y valoración contable del stock**, tramitación formal de pedidos consolidados hacia proveedores y facturas de taller externo/calibración.
- **Ingeniero / Supervisor Técnico:** Planificación de órdenes de trabajo con reserva de stock en planificación (con certeza para hoy y previsión de compras para tareas futuras), reserva de vehículos por cuadrilla, consulta de existencias físicas y stock en tránsito, ubicación física detallada (Pasillo-Estante-Gaveta), consulta y edición de umbrales técnicos, redacción y consulta de propuestas de pedido y presupuestos que genera, registro de salidas para banco de ensayo/taller, resolución técnica de incidencias y reasignaciones por avería de vehículo en ruta; **bloqueo estricto a nivel de API** sobre el cuadro de mando macroeconómico confidencial de la empresa.
- **Responsable de Cuadrilla (Capataz / Jefe de Equipo):** Titular formal y responsable directo de la custodia de la furgoneta asignada, herramientas con número de serie, validación de hojas de picking (siguiendo lotes FEFO) y devolución por tarea, y registro de traspasos entre furgonetas en campo.
- **Operario de Cuadrilla (`/operari`):** Acceso a la PWA móvil para consultar y validar la hoja de picking matinal de cada orden de trabajo (1 tarea = 1 picking list), registrar salidas de urgencia justificadas, ejecutar tareas sin bloqueos offline por traspasos, uso de sobrantes entre tareas consecutivas de la misma jornada con reingreso en nave al cierre de turno, y foto del cuentakilómetros al cerrar jornada de flota.

---

## Historias de usuario
- **H1:** Como *Ingeniero*, quiero que al planificar una obra para hoy el sistema me dé certeza absoluta reservando el material disponible al instante, y si la planifico para una fecha futura y falta material, que la IA emita una alerta inmediata y redacte el pedido de compra sin contar con hipotéticos retornos.
- **H2:** Como *Responsable de Cuadrilla*, quiero que la hoja de picking me indique el lote específico de cola de PVC o químico que debo coger según su fecha de caducidad más próxima (criterio FEFO), garantizando una rotación correcta de productos.
- **H3:** Como *Operario en campo*, quiero que si recibo piezas de otra furgoneta en una zona sin cobertura, pueda utilizarlas e instalarlas inmediatamente en la obra sin que la falta de conexión bloquee la tarea, registrando el traspaso para su sincronización al volver a base (*Objetivo 1: Realización de la tarea*).
- **H4:** Como *Operario*, quiero que al devolver una máquina especial al final de la jornada en la hoja de picking de retorno, quede liberada automáticamente para que otra cuadrilla pueda utilizarla al día siguiente sin trabas.
- **H5:** Como *Operario*, quiero que si la furgoneta se avería en carretera a mitad de jornada, el incidente se registre como avería de flota para que el supervisor reasigne un vehículo sin bloquear mi jornada.
- **H6:** Como *Secretaria o Mozo*, quiero registrar la entrada de material en depósito de un proveedor para custodiarlo en nave y consumirlo en obras facturando con normalidad al cliente, liquidando al distribuidor a final de mes según el consumo real.
- **H7:** Como *Secretaria o Ingeniero*, quiero que cuando entre un albarán con un precio de compra incrementado, el sistema actualice automáticamente el precio de referencia de almacén para futuros presupuestos, manteniendo los presupuestos ya emitidos inalterables.
- **H8:** Como *Boss o Secretaria*, quiero consultar la valoración económica total de las existencias en nave y el coste de reposición, sabiendo que estos datos financieros están completamente ocultos al personal técnico de campo.

---

## Requisitos Funcionales (Criterios de Aceptación en EARS)

### Bloque 1: Directorio Principal (`/gestio/magatzem`) y Estado "Día 0"
- **RF-01:** EL SISTEMA presentará en `/gestio/magatzem` un listado tabular limpio **sin bloques de KPIs superiores**, mostrando por cada registro exclusivamente las siguientes 7 columnas: *Referencia, Nombre / Descripción del artículo, Proveedor habitual, Ubicación física en nave, Stock Total Actual, Stock Mínimo y Estado de pedido* (p. ej. *Óptimo, Bajo Mínimos, Pedido en Curso con desglose de unidades en tránsito*).
- **RF-02:** CUANDO el usuario introduce texto en el buscador de la lista, EL SISTEMA filtrará en tiempo real por coincidencia sobre: *Referencia, Nombre/Descripción, Proveedor y Ubicación física*.
- **RF-03:** EL SISTEMA dispondrá de filtros operativos en el panel de control para segmentar la vista por familias y categorías internas de producto, stock bajo mínimos, herramientas/maquinaria, stock asignado a vehículos, material en tránsito y **material en depósito / consignación**.
- **RF-04:** SI el sistema se encuentra en estado "Día 0" (cero artículos registrados en el almacén de la empresa), ENTONCES EL SISTEMA mostrará la pantalla completamente limpia, exhibiendo exclusivamente el buscador y los botones de acción: *"Alta manual de artículo"* y *"Entrada asistida por IA (Albarán/Factura)"*, sin datos ficticios ni métricas simuladas (*Zero Mock Data*).

### Bloque 2: Altas de Material, FEFO, Herramientas y Recepción en Nave
- **RF-05:** CUANDO el usuario pulsa "Alta manual de artículo", EL SISTEMA desplegará un formulario solicitando: *Referencia interna, Nombre/Descripción, Tipología (Consumible fungible vs. Herramienta/Maquinaria retornable), Familia/Categoría interna, Proveedor habitual, Ubicación física inicial en nave (Pasillo-Estantería-Gaveta), Stock Inicial, Stock Mínimo y Stock Óptimo*, permitiendo clasificar el artículo como *"Stock Estratégico / Emergencia"* o *"Estacional"*, e introducir obligatoriamente lote y caducidad para productos químicos/resinas.
- **RF-06:** EN herramientas y maquinaria retornable, EL SISTEMA asignará un identificador unívoco de activo estructurado en formato **[Nombre Herramienta] [Nº Ejemplar] = [Número de Serie / Código de Activo]** (p. ej. *Grupo electrógeno 1 = SN-98421*), vinculándolo a la custodia legal del Responsable de Cuadrilla cuando se encuentre asignado a un vehículo.
- **RF-07:** CUANDO el usuario selecciona "Entrada asistida por IA (Albarán/Factura)", EL SISTEMA procesará el documento (PDF o imagen) mediante el motor local de OCR e inferencia IA, extrayendo las líneas de materiales, referencias, unidades y proveedor emisor, creando el proveedor si no existe (Spec 003) y validando las altas con confirmación humana (*Human-in-the-Loop*).
- **RF-08:** SI durante la descarga y recepción física de mercancía en nave se detecta que el material viene roto, defectuoso o no coincide con el albarán, EL SISTEMA permitirá al receptor registrar una **Incidencia de Recepción con Proveedor**, bloqueando la entrada de los bultos defectuosos en el stock activo y derivando el caso a `Secretaria` para reclamar al distribuidor.
- **RF-09:** SI un material almacenado en la nave central se detecta defectuoso de fábrica antes de salir a obra, EL SISTEMA permitirá tramitar un **RMA Directo desde Almacén Central hacia Proveedor** (integrado con Spec 003), generando el volante físico de devolución y custodiando el expediente técnico en `/docs/<empresa_id>/incidencias`.
- **RF-10:** EL SISTEMA permitirá registrar entradas de **Material en Depósito / Consignación de Proveedor**, custodiando físicamente las existencias en nave sin computarlas como compra en firme; dicho material se consumirá e imputará normalmente al cliente final (según precio y margen presupuestado) y se liquidará periódicamente al distribuidor en función del consumo real reportado.

### Bloque 3: Estructura Multialmacén, Custodia y Exclusión de Alquileres
- **RF-11:** EL SISTEMA gestionará una arquitectura de inventario multialmacén estructurada en:
  1. *Almacén Central:* Nave física principal de la empresa.
  2. *Talleres Móviles (Furgonetas):* Stock rodante permanente asignado bajo custodia del Responsable de Cuadrilla.
  3. *Asignaciones a Operarios:* Herramientas y materiales entregados en custodia directa a un trabajador.
- **RF-12:** EL SISTEMA mantendrá un **Checklist de Dotación Base por Furgoneta**, habilitando cada lunes una **Revisión Ágil de Material por Excepción** para que el Responsable de Cuadrilla verifique visualmente y reponga en nave exclusivamente los consumibles faltantes (tornillería, teflón, racores básicos).
- **RF-13:** SI un operario necesita reponer consumibles básicos de la furgoneta durante la semana (ej. miércoles), EL SISTEMA permitirá registrar la retirada de nave mediante la **"Hoja de Reposición de Furgoneta"**, actualizando el traspaso del Almacén Central al vehículo sin esperar al lunes.
- **RF-14:** EL SISTEMA implementará una codificación física unívoca alfanumérica para el Almacén Central estructurada en formato **Pasillo - Estantería - Gaveta** (p. ej. `P01-E03-G12`), y representará visualmente la ubicación física del artículo dentro de la nave o vehículo en su ficha detallada.
- **RF-15:** EL SISTEMA tratará toda la maquinaria o herramienta en régimen de **alquiler temporal externo como un servicio de subcontrata** (gobernado por la Spec 003), requiriendo la acreditación de la póliza de Responsabilidad Civil (RC) del arrendador y excluyéndola del catálogo de activos propios del inventario.

### Bloque 4: Planificación Certera de Stock, Picking FEFO y Ejecución Ininterrumpida
- **RF-16:** CUANDO el ingeniero planifica una orden de trabajo para el día en curso, EL SISTEMA verificará con certeza matemática la disponibilidad física del material en nave y **reservará inmediatamente las unidades prescritas**, previniendo conflictos de concurrencia matinal en nave (la tarea creada primero descuenta y reserva el material).
- **RF-17:** CUANDO el ingeniero planifica una orden de trabajo para una fecha futura, EL SISTEMA:
  1. Contrastará los materiales requeridos contra el stock disponible sin computar hipotéticos retornos de tareas intermedias (los retornos se tratarán como remanente no comprometido).
  2. SI el material proyectado es insuficiente, EL SISTEMA emitirá una alerta de falta de material para obra futura y **disparará a la IA la redacción de la propuesta de pedido de compra correspondiente**.
- **RF-18:** CUANDO la orden de trabajo incluya productos con caducidad (adhesivos, resinas, químicos), la hoja de picking **prescribirá obligatoriamente el lote con fecha de vencimiento más próxima según criterio FEFO (First Expired, First Out)**, instruyendo al operario a retirar dicho lote para garantizar la rotación de stock.
- **RF-19:** CUANDO se asigna una orden de trabajo a una cuadrilla, EL SISTEMA generará una **Hoja de Carga y Devolución específica e independiente para dicha orden de trabajo** (cumpliendo la regla: *1 Tarea = 1 Hoja de Picking/Devolución*), garantizando la imputación exacta y la facturación limpia al cliente final.
- **RF-20:** CUANDO una o varias órdenes de trabajo de una misma jornada tienen asignada la misma cuadrilla y vehículo, EL SISTEMA mantendrá el vehículo en estado **"Reservado / Ocupado" por dicha cuadrilla durante toda la jornada completa**, sin disparar alertas de conflicto por tareas sucesivas.
- **RF-21:** DENTRO de la PWA (`/operari`), EL SISTEMA presentará la hoja de picking en una **pantalla única** con tres casillas de control por elemento:
  1. *Casilla 1: Retirada de material / herramienta:* Permite editar las unidades recogidas en nave mientras la lista permanezca en edición.
  2. *Casilla 2: Devolución de sobrantes:* Conteo de unidades no utilizadas atribuibles estrictamente a esa orden.
  3. *Casilla 3: Incidencias:* Espacio para reportar anomalías de picking o averías.
- **RF-22:** CUANDO el Responsable de Cuadrilla pulsa "Validar Recogida" en la PWA, EL SISTEMA descontará inmediatamente las unidades del Almacén Central y **bloqueará de forma definitiva e inmutable los valores recogidos**, requiriendo una Incidencia de Picking si se detecta un error posterior.
- **RF-23:** SI se produce una salida de material por urgencia técnica sin albarán grabado previamente, EL SISTEMA exigirá que la retirada esté **respaldada por una incidencia previa registrada en la orden de trabajo** (*"Falta material X para finalizar la tarea"*); dicha operación se registrará como **"Incidencia de Salida de Urgencia"**, descontando el stock físico de inmediato para que la IA matinal compute la rotura sin desfase, y aplazando la conciliación del albarán por secretaría al final del día.
- **RF-24:** CUANDO dos cuadrillas intercambian material en el terreno (Furgoneta A ➔ Furgoneta B), EL SISTEMA garantizará la **ejecución ininterrumpida de la tarea en campo**:
  1. El traspaso se registrará en la PWA del operario y se almacenará localmente en `incidencias-furgonetas` (IndexedDB, AES-GCM).
  2. **La cuadrilla receptora podrá utilizar e instalar inmediatamente el material en la obra sin esperar a tener cobertura ni a la sincronización con el servidor**.
  3. El volcado, reconciliación contable y aceptación mutua se formalizarán automáticamente en cuanto los dispositivos recuperen la cobertura o al llegar a base.
- **RF-25:** CUANDO un cliente acepta un presupuesto para una obra que requiera corte de tuberías/cables o apertura de botes, EL SISTEMA devengará formalmente una **Factura de Anticipo (por el 100% de los materiales o un mínimo del 45% del valor presupuestado)** conforme a la normativa Veri*factu; SI el cliente cancela la obra tras el picking, los materiales cortados quedan cubiertos por dicho anticipo y el sobrante no manipulado se reincorpora al inventario mediante *"Devolución Total por Cancelación"*.
- **RF-26:** CUANDO el operario finaliza una orden de trabajo y registra sobrantes devueltos en su hoja de picking:
  1. EL SISTEMA **descontará inmediatamente dichos sobrantes de la liquidación y factura del cliente de esa tarea**.
  2. Dichos materiales **quedarán disponibles al instante en el stock de la furgoneta**; si una tarea posterior de la jornada necesita dicho material, se sumará a su correspondiente hoja de picking manteniendo la trazabilidad íntegra.
  3. Al finalizar la jornada laboral en base, el operario **reingresará físicamente en sus gavetas de nave todo el material que exceda la dotación base del vehículo**, y cerrará su turno de flota mediante la fotografía del cuentakilómetros.
- **RF-27:** CUANDO una herramienta o máquina retornable especial sea devuelta a base al cierre de jornada y registrada en la hoja de devolución sin incidencias, EL SISTEMA **liberará automáticamente su custodia y la marcará como disponible en nave central**, lista para ser asignada a otra cuadrilla al día siguiente.
- **RF-28:** SI un vehículo sufre un siniestro o avería mecánica en ruta a mitad de jornada, EL SISTEMA permitirá registrar una **"Incidencia de Flota por Avería de Vehículo"**, habilitando al supervisor la reasignación manual de un nuevo vehículo o la reprogramación de las tareas restantes sin bloquear el cierre de jornada de los operarios.

### Bloque 5: Gestión de Umbrales y Propuestas Consolidadas de Reposición por IA
- **RF-29:** EL SISTEMA permitirá configurar manualmente para cada artículo los umbrales de **Stock Mínimo** (alerta roja de rotura) y **Stock Óptimo** (punto objetivo de reposición), tanto para la Nave Central como para el stock rodante base de los vehículos.
- **RF-30:** AL FINALIZAR la franja horaria de picking matinal (cierre de salida de cuadrillas), EL SISTEMA ejecutará un análisis automático mediante IA de las roturas de stock producidas (incluyendo incidencias de salidas de urgencia y compromisos futuros); SI uno o varios artículos descienden por debajo de su Stock Mínimo, la IA:
  1. **Consolidará en una única propuesta diaria por proveedor habitual** todas las referencias bajo mínimos, evitando la dispersión de avisos individuales.
  2. Calculará de forma matemática la cantidad a pedir aplicando: `Cantidad = Stock Óptimo - Stock Actual`.
  3. Redactará el borrador del correo formal de pedido de compra listo para revisión y envío humano en la Spec 003 (*Human-in-the-Loop*).

### Bloque 6: Inventarios Periódicos, Bajas, Uso Interno y Actualización de Precios
- **RF-31:** EL SISTEMA dispondrá de un módulo de **Inventario General Periódico** para soportar auditorías físicas completas de almacén (anuales o semestrales).
- **RF-32:** CUALQUIER usuario autenticado podrá registrar un ajuste de existencias seleccionando la opción **"Inventario"**, introduciendo el conteo físico real observado en nave para cuadrar inmediatamente el stock del sistema.
- **RF-33:** EL SISTEMA permitirá tramitar en cualquier momento una **Baja Directa por Merma / Siniestro en Nave** ante roturas accidentales o deterioro de consumibles (p. ej. saco mojado, bobina aplastada), registrando el motivo técnico para mantener el inventario real sin esperar a la auditoría semestral.
- **RF-34:** EL SISTEMA permitirá registrar salidas de material para **"Banco de Ensayo Técnico / Uso Interno de Taller"**, imputando el coste a gastos operativos internos de taller sin requerir la creación de clientes ni obras simuladas.
- **RF-35:** EN consumibles fungibles menores (siliconas, pegamentos, tornillería, selladores), EL SISTEMA computará la salida por unidad completa o envase menor imputado a obra, asumiendo la merma técnica natural de uso en la liquidación del trabajo.
- **RF-36:** EN materiales continuos (tuberías, cables eléctricos, mangueras de goteo), EL SISTEMA gestionará las existencias y consumos computando estrictamente los **metros lineales totales acumulados**, sin requerir catalogación individual de retales o cortes aislados.
- **RF-37:** CUANDO se registre un nuevo albarán de compra con variación de precio unitario, EL SISTEMA **actualizará el Precio de Referencia de Almacén para los presupuestos y órdenes de compra que se generen a partir de ese instante** (manteniendo inalterables los presupuestos ya emitidos previamente), aplicando los descuentos y márgenes comerciales configurados.

### Bloque 7: Ficha Detallada del Artículo (`/gestio/magatzem/[id]`), Taller, Calibración y Robos
- **RF-38:** CUANDO el usuario hace clic sobre un artículo en el listado, EL SISTEMA abrirá su ficha completa (`/gestio/magatzem/[id]`), mostrando:
  1. Datos maestros: Referencia, Nombre, Tipología, Familia interna y Ubicación física (Pasillo-Estantería-Gaveta).
  2. En maquinaria: Listado de ejemplares individuales con su **Número de Serie / Código de Activo** y estado actual (*Disponible, Asignado a furgoneta X bajo custodia del Responsable Y, En Taller, Calibración agendada, Baja por robo*).
  3. Proveedor habitual asociado con enlace directo a su ficha de proveedor (Spec 003).
  4. Desglose de existencias: Stock físico en Nave Central, Stock en furgonetas, Stock en depósito/consignación y **Stock en tránsito (pedidos en curso y entregas pendientes)**.
  5. Botón manual de acción rápida: **"Redactar Pedido de Compra"**, que abre la propuesta de reposición precargando el artículo y su proveedor.
  6. Histórico cronológico de movimientos (entradas por albarán/factura, salidas por picking de obra, regularizaciones de inventario y devoluciones).
- **RF-39:** CUANDO un operario o responsable reporta una herramienta o máquina como averiada (desde la casilla de incidencias de la hoja de picking o desde la ficha de almacén), EL SISTEMA cambiará automáticamente el estado del ejemplar específico a **"En reparación / Taller externo"**, **bloqueando de forma infranqueable su asignación en futuras hojas de picking** mientras permanezca en dicho estado.
- **RF-40:** SI una herramienta en reparación es dictaminada como irreparable por el servicio técnico externo, EL SISTEMA permitirá tramitar su **Baja Definitiva del Inventario**, registrando el motivo técnico y contabilizándola como pérdida patrimonial justificada.
- **RF-41:** SI se produce la sustracción o robo de una herramienta identificada por número de serie, EL SISTEMA tramitará la baja como **"Baja por Robo / Extravío con Denuncia Policial"**, requiriendo el número de atestado y referencia del cuerpo policial para soportar la baja del activo y la tramitación del siniestro con la aseguradora.
- **RF-42:** EL SISTEMA permitirá calendarizar fechas obligatorias de **Mantenimiento Preventivo e Inspección / Calibración Periódica** para herramientas y equipos técnicos; DURANTE las fechas o periodos agendados para revisión, EL SISTEMA **bloqueará automáticamente la disponibilidad y asignación del ejemplar específico en las hojas de picking**, garantizando que ninguna cuadrilla utilice herramientas con certificación o mantenimiento vencido.

### Bloque 8: Segregación Financiera del Inventario (Zero-Trust)
- **RF-43:** MIENTRAS el usuario autenticado posea rol `Boss` o `Secretaria / RRHH`, EL SISTEMA mostrará la **valoración económica total del inventario en euros (€)** según el último precio de compra, los costes unitarios y los márgenes comerciales.
- **RF-44:** EL USUARIO con rol `Ingeniero` tendrá acceso a los precios, presupuestos y órdenes de compra que él mismo genera para el seguimiento de sus proyectos y control de entregas de material; no obstante, **EL SISTEMA bloqueará estrictamente a nivel de API el acceso del rol `Ingeniero` a la página de Gestión Económica Global de la empresa** (cuadro de mando macroeconómico, balances consolidados y beneficio neto empresarial).

---

## Requisitos No Funcionales
- **Almacenamiento Local Seguro Multi-Tenant:** Todos los albaranes de almacén escaneados, fotografías de devolución en vehículo/parcela, fotos de odómetros, denuncias policiales por robo de herramientas, informes técnicos de avería de herramientas y actas de regularización de inventario se almacenan directamente en los discos locales del Mini PC/servidor aislados por inquilino (`/docs/<empresa_id>/almacen/...`), con copias de seguridad semanales automáticas cada domingo (sin dependencia de AWS S3).
- **Seguridad Multi-Tenant (RLS):** Cada consulta, inserción, regularización y movimiento de almacén aplica Row Level Security mandatorio mediante `app.current_empresa_id`.
- **Protección de Datos Macroeconómicos (Zero-Trust):** El cuadro macroeconómico global de la empresa queda restringido a `Boss` y `Secretaria / RRHH`.
- **Tolerancia Cero a Datos Ficticios (Zero Mock Data):** Si no existen artículos en la base de datos de la empresa, la interfaz muestra el estado Día 0 completamente limpio, sin artículos simulados ni métricas falsas.
- **Diseño Camaleón:** La interfaz respetará las variables dinámicas de diseño de marca blanca corporativa sin sesgos terminológicos específicos de vertical.

---

## Fuera de Alcance (Lo que NO hace este módulo)
- No gestiona el mantenimiento mecánico, seguros ni revisiones periódicas/ITV de los vehículos (pertenece a `/gestio/flota`).
- No gestiona la contratación de maquinaria o grúas de alquiler externo (se gestiona como subcontrata en `/gestio/proveidors`).
- No realiza cobros ni pagos contables a proveedores ni asientos oficiales de balance fiscal (pertenece a `/gestio/comptabilitat`).
- No opera como TPV de venta al público en mostrador (sistema exclusivo para consumo en obras técnicas y contratos de mantenimiento).
- No realiza envíos de pedidos de reposición de forma desatendida a proveedores sin confirmación humana (*Human-in-the-Loop*).

---

## Criterios de Finalización (Definition of Done)
1. Todos los requisitos funcionales (RF-01 al RF-44) redactados en sintaxis formal EARS y consolidados tras seis rondas de rigurosa auditoría QA.
2. Listado principal limpio con 7 columnas exactas, sin KPIs superiores y con filtros de búsqueda por familia, estado, vehículo, stock en tránsito y stock en depósito.
3. Estado Día 0 real con buscador, alta manual y alta por IA mediante albarán/factura (con capacidad de dar de alta proveedor si no existiera).
4. Codificación individual de maquinaria por Número de Serie/Activo (`[Herramienta] [Nº Ejemplar] = [Número de Serie]`) bajo la custodia del Responsable de Cuadrilla.
5. Asignación previa de stock en planificación con certeza para hoy y previsión de compras por IA para tareas futuras.
6. Criterio FEFO (First Expired, First Out) obligatorio en picking de químicos y resinas.
7. Pantalla única de picking matinal en PWA (`/operari`) bajo la regla estricta de 1 Orden = 1 Hoja de Picking/Devolución, con retirada inmutable post-validación y canal de incidencias.
8. Traspaso entre furgonetas sin bloqueos offline en campo (instalación inmediata y sincronización diferida).
9. Disponibilidad inmediata de sobrantes entre tareas el mismo día y devolución obligatoria a nave al cierre de jornada.
10. Liberación automática de herramientas retornables al cerrar el picking de devolución sin incidencias.
11. Salidas de urgencia justificadas por incidencias previas y protocolo de avería de vehículo en ruta.
12. Blindaje financiero y fiscal con factura de anticipo formalizada (mínimo 45% o 100% de materiales con Veri*factu).
13. Bajas de herramientas por robo documentadas con número de atestado y denuncia policial para aseguradoras.
14. Recepción en nave con canal de Incidencia con Proveedor ante mercancía no conforme y RMA directo de almacén central por piezas defectuosas en gaveta.
15. Régimen de stock en depósito / consignación facturado a cliente y liquidado a proveedor por consumo real.
16. Actualización del Precio de Referencia de Almacén ante nuevos albaranes para futuros presupuestos.
17. Segregación clara de permisos: el Ingeniero accede a presupuestos y órdenes de compra de sus proyectos técnicos, reservando la página macroeconómica confidencial a Gerencia.
18. Se respeta estrictamente la política de no realizar commits sin solicitud explícita del usuario.
