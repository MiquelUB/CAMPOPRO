# Spec 004 — Módulo de Magatzem i Inventari (/gestio/magatzem)

## Contexto y objetivo
El módulo de Magatzem i Inventari es el pulmón operativo y logístico de la empresa técnica. Conecta la entrada de materiales desde los albaranes y facturas de compra de los proveedores (Spec 003) con la preparación matinal de suministros para las cuadrillas y su consumo e imputación exacta en cada orden de trabajo ejecutada en campo (PWA `/operari`).

Resuelve con rigor la gestión multialmacén simultánea (Almacén Central en nave física, stock rodante en furgonetas tratadas como **talleres móviles con dotación base bajo la custodia del Responsable de Cuadrilla**, y asignaciones directas a operarios), la codificación individual de maquinaria por número de serie (`[Herramienta] [Nº Ejemplar] = [Número de Serie]`) con **inhabilitación permanente de activos dados de baja**, el modelado de atributos técnicos normalizados por vertical, la ubicación física dual (Gaveta principal y Palé secundario), la gestión de materiales continuos con distinción de **Formato de Suministro (Bobina/Rollo continuo vs. Barra rígida)** y check de retal "Parcial", el bloqueo transaccional concurrente en base de datos (**`SELECT ... FOR UPDATE` en PostgreSQL**) para reservas de stock, el control inteligente de compras por IA con soporte para **entregas parciales (backorders) y albaranes multi-pedido**, la estricta segregación *Zero-Trust* donde el Ingeniero solo accede a precios de venta finales para presupuestar (bloqueando albaranes de compra y costes de proveedor), la disciplina de **una hoja de picking y devolución por cada orden de trabajo**, la sustitución de herramientas averiadas a mitad de turno con pausa del temporizador de obra, el relevo de mando de cuadrilla desde base, el tratamiento de mermas en material en depósito respaldadas por seguros, la gestión del slot de **"Residuos / Chatarra"** con cumplimiento documental RAEE y Ley de Residuos, el criterio FEFO para caducidades, la alerta de cuota en PWA, y el blindaje fiscal de anticipos devengados formalmente (mínimo 45% o 100% de materiales con Veri*factu).

Toda la arquitectura respeta el principio de Tolerancia Cero a Datos Ficticios (*Zero Mock Data* con Estado Día 0 real), almacenamiento de expedientes en discos locales del Mini PC (sin AWS S3), aislamiento multi-inquilino mandatorio (RLS) y segregación *Zero-Trust* absoluta.

---

## Usuarios / actores y Matriz de Acceso (Zero-Trust)
El backend garantiza el aislamiento multi-inquilino (RLS) y la segregación estricta de permisos por rol:

- **Boss (Gerencia / Propietario):** Acceso total e irrestricto a la gestión de almacén, altas manuales y por OCR, configuración de umbrales (mínimo/óptimo), aprobación de compras consolidadas por IA, resolución de incidencias y no conformidades con proveedores, liquidación de depósitos/consignaciones y siniestros con aseguradoras, emisión y cobro de facturas finales a clientes, calendario de calibraciones, **valoración económica total del inventario en euros (€) basada en el último precio de compra y acceso al panel macroeconómico confidencial de la empresa**.
- **Secretaria / RRHH:** Acceso total operativo al directorio de inventario, altas manuales y por OCR de albaranes/facturas de compra, conciliación de entregas parciales y albaranes multi-pedido, **emisión exclusiva de facturas a clientes** (facturas de anticipo por aceptación de presupuesto y facturas finales tras validación técnica del presupuesto aprobado), liquidación de material en depósito y control de siniestros, tramitación de facturas de venta de chatarra/residuos con inversión de sujeto pasivo de IVA y custodia de certificados RAEE, **consulta de costes de compra y valoración contable del stock**, y tramitación de pedidos consolidados.
- **Ingeniero / Supervisor Técnico:** Planificación de órdenes de trabajo con reserva de stock bajo bloqueo transaccional (`SELECT ... FOR UPDATE`), consulta de existencias físicas y stock en tránsito con desglose de entregas parciales pendientes, ubicación física detallada (gaveta y palé), confección de presupuestos utilizando exclusivamente los **precios finales de venta** (sin acceso a costes de adquisición ni a albaranes de entrega/compra de proveedores), consulta de facturas finales de sus obras para defenderlas técnicamente ante el cliente o gerencia; **bloqueo estricto a nivel de API sobre los albaranes de compra de proveedores, costes unitarios de adquisición y el cuadro de mando macroeconómico de la empresa**.
- **Responsable de Cuadrilla (Capataz / Jefe de Equipo):** Titular formal y responsable directo de la custodia de la furgoneta asignada, herramientas con número de serie, validación de hojas de picking (siguiendo lotes FEFO y formato de barras/bobinas) y devolución por tarea (marcando check parcial en tubos cortados), registro de traspasos entre furgonetas en campo y comunicación de averías intermedias con pausa de temporizador.
- **Operario de Cuadrilla (`/operari`):** Acceso a la PWA móvil para consultar y validar la hoja de picking matinal de cada orden de trabajo (1 tarea = 1 picking list), registrar salidas de urgencia justificadas, ejecutar tareas sin bloqueos offline por traspasos, uso de sobrantes entre tareas consecutivas con reingreso en nave al cierre de turno, recepción de alertas de cuota de almacenamiento local excedida, y foto del cuentakilómetros al cerrar jornada de flota.

---

## Historias de usuario
- **H1:** Como *Ingeniero*, quiero que al guardar la planificación de una obra, el sistema bloquee transaccionalmente las filas en base de datos para garantizar que si otro compañero planifica a la vez, no se asigne material inexistente.
- **H2:** Como *Ingeniero*, quiero ver en el catálogo de almacén los precios de venta finales para elaborar mis presupuestos técnicos con margen, teniendo acceso a las facturas finales emitidas de mis obras para defenderlas ante el cliente, sin tener que ver ni gestionar albaranes de compra de proveedores que competen a administración.
- **H3:** Como *Ingeniero*, quiero que si planifico una obra con material pedido pero pendiente de entrega, la IA me informe con precisión: *"Pedido con recepción parcial: X unidades disponibles, Y unidades en tránsito del pedido SUM-00#0142"*, sabiendo que dicho pedido puede llegar repartido en varios albaranes o en un albarán que agrupe varios pedidos.
- **H4:** Como *Responsable de Cuadrilla*, quiero que en materiales continuos la hoja de picking me especifique si debo coger una bobina continua o barras rígidas, y si devuelvo 3m de una barra de 6m, marcar el check "Parcial" para que el inventario registre que se trata de un retal aprovechable.
- **H5:** Como *Operario*, quiero que la PWA me alerte si el almacenamiento local de mi móvil se aproxima al límite de cuota, asegurando que las fotos de odómetro y devoluciones se sincronicen sin pérdida de datos.
- **H6:** Como *Boss o Secretaria*, quiero que cuando una herramienta sea dada de baja definitiva por robo o siniestro irreparable, su número de serie quede desactivado e inhabilitado de por vida en el histórico, impidiendo su reactivación accidental.
- **H7:** Como *Secretaria*, quiero emitir las facturas de anticipo (mín. 45% o 100% de materiales con Veri*factu) tras la aceptación del presupuesto por el cliente, y emitir la factura final una vez que el ingeniero valide los trabajos e incidencias de obra.

---

## Requisitos Funcionales (Criterios de Aceptación en EARS)

### Bloque 1: Directorio Principal (`/gestio/magatzem`) y Estado "Día 0"
- **RF-01:** EL SISTEMA presentará en `/gestio/magatzem` un listado tabular limpio **sin bloques de KPIs superiores**, mostrando por cada registro exclusivamente las siguientes 7 columnas: *Referencia, Nombre / Descripción del artículo, Proveedor habitual, Ubicación física en nave (Gaveta principal y Palé si existe), Stock Total Actual, Stock Mínimo y Estado de pedido* (p. ej. *Óptimo, Bajo Mínimos, Pedido en Curso con código de pedido y desglose de unidades en tránsito*).
- **RF-02:** CUANDO el usuario introduce texto en el buscador de la lista, EL SISTEMA filtrará en tiempo real por coincidencia sobre: *Referencia, Nombre/Descripción, Proveedor y Ubicación física*.
- **RF-03:** EL SISTEMA dispondrá de filtros operativos en el panel de control para segmentar la vista por familias y categorías internas de producto, stock bajo mínimos, herramientas/maquinaria, stock asignado a vehículos, material en tránsito (desglosando pedidos parciales), material en depósito / consignación y **slot de residuos/chatarra**.
- **RF-04:** SI el sistema se encuentra en estado "Día 0" (cero artículos registrados en el almacén de la empresa), ENTONCES EL SISTEMA mostrará la pantalla completamente limpia, exhibiendo exclusivamente el buscador y los botones de acción: *"Alta manual de artículo"* y *"Entrada asistida por IA (Albarán/Factura)"*, sin datos ficticios ni métricas simuladas (*Zero Mock Data*).

### Bloque 2: Altas de Material, Formato Continuo, Atributos y Recepción
- **RF-05:** CUANDO el usuario pulsa "Alta manual de artículo", EL SISTEMA desplegará un formulario solicitando los datos maestros generales (*Referencia interna, Nombre/Descripción, Tipología, Familia/Categoría interna, Proveedor habitual, Ubicación Principal en Gaveta, Ubicación Secundaria opcional en Palé, Stock Inicial, Stock Mínimo y Stock Óptimo*), e incorporará dinámicamente los **atributos técnicos normalizados según la vertical** (DN, PN, caudal en riego/fontanería; sección, tensión, CPR en electricidad; resistencia en edificación).
- **RF-06:** EN materiales lineales continuos (tuberías, cables, mangueras), EL SISTEMA requerirá tipificar el **Formato de Suministro**:
  1. *Bobina / Rollo continuo:* Para tiradas largas sin cortes prefijados.
  2. *Barra rígida de longitud fija:* Especificando la longitud estándar de cada barra (p. ej. barras de 6 metros).
- **RF-07:** EN herramientas y maquinaria retornable, EL SISTEMA asignará un identificador unívoco de activo estructurado en formato **[Nombre Herramienta] [Nº Ejemplar] = [Número de Serie / Código de Activo]** (p. ej. *Grupo electrógeno 1 = SN-98421*), vinculándolo a la custodia legal del Responsable de Cuadrilla cuando se encuentre asignado a un vehículo.
- **RF-08:** CUANDO el usuario selecciona "Entrada asistida por IA (Albarán/Factura)", EL SISTEMA procesará el documento mediante OCR/IA, admitiendo que **un albarán de entrega responda a múltiples órdenes de pedido pendientes del mismo proveedor**, actualizando las unidades de cada pedido en curso y creando el proveedor si no existe (Spec 003).
- **RF-09:** SI durante la descarga y recepción física de mercancía en nave se detecta que el material viene roto, defectuoso o no coincide con el albarán, EL SISTEMA permitirá al receptor registrar una **Incidencia de Recepción con Proveedor**, bloqueando la entrada de los bultos defectuosos en el stock activo y derivando el caso a `Secretaria` para reclamar al distribuidor.
- **RF-10:** SI un material almacenado en la nave central se detecta defectuoso de fábrica antes de salir a obra, EL SISTEMA permitirá tramitar un **RMA Directo desde Almacén Central hacia Proveedor** (integrado con Spec 003), generando el volante físico de devolución y custodiando el expediente técnico en `/docs/<empresa_id>/incidencias`.
- **RF-11:** EL SISTEMA permitirá registrar entradas de **Material en Depósito / Consignación de Proveedor**, custodiando físicamente las existencias en nave sin computarlas como compra en firme; dicho material se consumirá e imputará normalmente al cliente final (según precio y margen presupuestado) y se liquidará periódicamente al distribuidor en función del consumo real reportado.
- **RF-12:** SI un material en depósito sufre un siniestro o rotura accidental en nave, EL SISTEMA tramitará la baja asumiendo la empresa el coste del material frente al distribuidor y canalizando la indemnización a través de la **póliza de seguros de la empresa**.

### Bloque 3: Estructura Multialmacén, Ubicación Dual y Dotación de Furgonetas
- **RF-13:** EL SISTEMA gestionará una arquitectura de inventario multialmacén estructurada en:
  1. *Almacén Central:* Nave física principal de la empresa con doble nivel de ubicación física: **Ubicación Principal en Gaveta de picking** (`P01-E03-G12`) y **Ubicación Secundaria opcional en Palé de almacén/reserva** (`ALT-PAL-04`).
  2. *Talleres Móviles (Furgonetas):* Stock rodante permanente de fungibles básicos bajo custodia del Responsable de Cuadrilla.
  3. *Asignaciones a Operarios:* Herramientas y materiales entregados en custodia directa a un trabajador.
- **RF-14:** EL SISTEMA mantendrá un **Checklist de Dotación Base por Furgoneta** compuesto estrictamente por material fungible de uso frecuente y bajo coste (tornillería, teflón, racorería estándar, juntas), habilitando cada lunes una **Revisión Ágil de Material por Excepción** para que el Responsable de Cuadrilla verifique visualmente y reponga en nave exclusivamente los consumibles faltantes.
- **RF-15:** SI un operario necesita reponer consumibles básicos de la furgoneta durante la semana (ej. miércoles), EL SISTEMA permitirá registrar la retirada de nave mediante la **"Hoja de Reposición de Furgoneta"**, actualizando el traspaso del Almacén Central al vehículo sin esperar al lunes.
- **RF-16:** EL SISTEMA tratará toda la maquinaria o herramienta en régimen de **alquiler temporal externo como un servicio de subcontrata** (gobernado por la Spec 003), requiriendo la acreditación de la póliza de Responsabilidad Civil (RC) del arrendador y excluyéndola del catálogo de activos propios del inventario.

### Bloque 4: Planificación Transaccional, Picking FEFO y Ejecución en Campo
- **RF-17:** CUANDO el ingeniero guarda la planificación de una orden de trabajo para el día en curso, EL SISTEMA ejecutará un **bloqueo transaccional a nivel de base de datos (`SELECT ... FOR UPDATE` en PostgreSQL)** sobre los registros de stock de los materiales prescritos, garantizando que no se produzcan condiciones de carrera entre planificaciones concurrentes y reservando las unidades con certeza matemática.
- **RF-18:** CUANDO el ingeniero planifica una orden de trabajo para una fecha futura y faltan materiales pedidos pero no recepcionados, la IA informará en pantalla: *"Pedido con recepción parcial: [X] unidades disponibles, [Y] unidades en tránsito del pedido [Código Pedido]"*, y disparará la propuesta de compra si la necesidad supera las unidades comprometidas.
- **RF-19:** CUANDO la orden de trabajo incluya productos con caducidad (adhesivos, resinas, químicos), la hoja de picking **prescribirá obligatoriamente el lote con fecha de vencimiento más próxima según criterio FEFO (First Expired, First Out)**, instruyendo al operario a retirar dicho lote para garantizar la rotación de stock.
- **RF-20:** CUANDO se asigna una orden de trabajo a una cuadrilla, EL SISTEMA generará una **Hoja de Carga y Devolución específica e independiente para dicha orden de trabajo** (cumpliendo la regla: *1 Tarea = 1 Hoja de Picking/Devolución*), garantizando la imputación exacta y la facturación limpia al cliente final.
- **RF-21:** CUANDO una o varias órdenes de trabajo de una misma jornada tienen asignada la misma cuadrilla y vehículo, EL SISTEMA mantendrá el vehículo en estado **"Reservado / Ocupado" por dicha cuadrilla durante toda la jornada completa**, sin disparar alertas de conflicto por tareas sucesivas.
- **RF-22:** DENTRO de la PWA (`/operari`), EL SISTEMA presentará la hoja de picking en una **pantalla única** con tres casillas de control por elemento:
  1. *Casilla 1: Retirada de material / herramienta:* Permite editar las unidades recogidas en nave mientras la lista permanezca en edición.
  2. *Casilla 2: Devolución de sobrantes:* Conteo de unidades no utilizadas atribuibles estrictamente a esa orden; en barras rígidas cortadas, el operario activará la casilla **"Parcial"** indicando los metros devueltos (p. ej. *Parcial: 3m de barra de 6m*).
  3. *Casilla 3: Incidencias:* Espacio para reportar anomalías de picking o averías.
- **RF-23:** CUANDO el Responsable de Cuadrilla pulsa "Validar Recogida" en la PWA, EL SISTEMA descontará inmediatamente las unidades del Almacén Central y **bloqueará de forma definitiva e inmutable los valores recogidos**, requiriendo una Incidencia de Picking si se detecta un error posterior.
- **RF-24:** SI se produce una salida de material por urgencia técnica sin albarán grabado previamente, EL SISTEMA exigirá que la retirada esté **respaldada por una incidencia previa registrada en la orden de trabajo** (*"Falta material X para finalizar la tarea"*); dicha operación se registrará como **"Incidencia de Salida de Urgencia"**, descontando el stock físico de inmediato para que la IA matinal compute la rotura sin desfase, y aplazando la conciliación del albarán por secretaría al final del día.
- **RF-25:** CUANDO dos cuadrillas intercambian material en el terreno (Furgoneta A ➔ Furgoneta B), EL SISTEMA garantizará la **ejecución ininterrumpida de la tarea en campo**:
  1. El traspaso se registrará en la PWA del operario y se almacenará localmente en `incidencias-furgonetas` (IndexedDB, AES-GCM).
  2. **La cuadrilla receptora podrá utilizar e instalar inmediatamente el material en la obra sin esperar a tener cobertura ni a la sincronización con el servidor**.
  3. El volcado, reconciliación contable y aceptación mutua se formalizarán automáticamente en cuanto los dispositivos recuperen la cobertura o al llegar a base.
- **RF-26:** CUANDO un cliente acepta un presupuesto para una obra que requiera corte de tuberías/cables o apertura de botes, EL SISTEMA devengará formalmente una **Factura de Anticipo (por el 100% de los materiales o un mínimo del 45% del valor presupuestado)** emitida exclusivamente por `Secretaria` o `Boss` conforme a la normativa Veri*factu; SI el cliente cancela la obra tras el picking, los materiales cortados quedan cubiertos por dicho anticipo y el sobrante no manipulado se reincorpora al inventario mediante *"Devolución Total por Cancelación"*.
- **RF-27:** CUANDO el operario finaliza una orden de trabajo y registra sobrantes devueltos en su hoja de picking:
  1. EL SISTEMA **descontará inmediatamente dichos sobrantes de la liquidación y factura del cliente de esa tarea**.
  2. Dichos materiales **quedarán disponibles al instante en el stock de la furgoneta**; si una tarea posterior de la jornada necesita dicho material, se sumará a su correspondiente hoja de picking manteniendo la trazabilidad íntegra.
  3. Al finalizar la jornada laboral en base, el operario **reingresará físicamente en sus gavetas de nave todo el material que exceda la dotación base del vehículo**, y cerrará su turno de flota mediante la fotografía del cuentakilómetros.
- **RF-28:** CUANDO una herramienta o máquina retornable especial sea devuelta a base al cierre de jornada y registrada en la hoja de devolución sin incidencias, EL SISTEMA **liberará automáticamente su custodia y la marcará como disponible en nave central**, lista para ser asignada a otra cuadrilla al día siguiente.
- **RF-29:** SI una herramienta se avería en obra a mitad de jornada, EL SISTEMA permitirá al operario en la PWA **pausar el temporizador de tiempo en obra de la tarea**, registrar la incidencia de avería y acudir a la base central para sustituirla por otra herramienta disponible registrada en la incidencia, reanudando a continuación el trabajo sin falsear la mano de obra imputada al cliente.
- **RF-30:** SI el Responsable de Cuadrilla sufre una incapacidad o baja médica sobrevenida, EL SISTEMA permitirá a la oficina técnica (`Ingeniero`, `Secretaria` o `Boss`) tramitar una **Incidencia de Relevo de Responsable**, traspasando formalmente en el sistema la titularidad y custodia del vehículo, herramientas y picking al técnico sustituto.
- **RF-31:** LA PWA emitirá una **Alerta Preventiva de Límite de Almacenamiento Excedido** si la memoria ocupada por fotografías y datos locales en IndexedDB se aproxima a la cuota permitida por el navegador, requiriendo la sincronización para liberar espacio.

### Bloque 5: Filtro Anti-Duplicidad, Entregas Parciales y Reposición por IA
- **RF-32:** EL SISTEMA asignará a cada propuesta/orden de pedido de compra un código identificativo unívoco estructurado en formato: **[Iniciales Nombre Proveedor] + 00# + [Correlativo Numérico]** (p. ej. *SUM-00#0142*).
- **RF-33:** AL FINALIZAR la franja horaria de picking matinal (cierre de salida de cuadrillas), EL SISTEMA ejecutará el análisis mediante IA de las roturas de stock; SI uno o varios artículos descienden por debajo de su Stock Mínimo:
  1. La IA verificará si ya existe un pedido formal enviado en estado de tránsito con el código `[Iniciales]+00#[Correlativo]` contemplando entregas parciales pendientes; SI dicho pedido en curso cubre la necesidad de reposición, **la IA detendrá la generación de un nuevo pedido para evitar duplicidades innecesarias**.
  2. SI el pedido en curso supera los **7 días naturales sin haber sido recepcionado en nave**, la IA generará una **Alerta de Incidencia de Pedido Pendiente de Entrega** dirigida a `Secretaria` y `Boss`.
  3. SI no existe pedido previo o el saldo pendiente de entrega es insuficiente, la IA calculará la diferencia necesaria hacia el Stock Óptimo, consolidará las referencias por proveedor habitual y redactará el borrador del pedido (*Human-in-the-Loop*).
- **RF-34:** EL SISTEMA soportará que un pedido formal de compra se recepcione a través de **múltiples albaranes parciales de entrega sucesivos**, manteniendo vivo el saldo pendiente en tránsito hasta la liquidación total de la orden.

### Bloque 6: Inventarios, Slot de Residuos/Chatarra (RAEE) y Actualización de Precios
- **RF-35:** EL SISTEMA dispondrá de un módulo de **Inventario General Periódico** para soportar auditorías físicas completas de almacén (anuales o semestrales).
- **RF-36:** CUALQUIER usuario autenticado podrá registrar un ajuste de existencias seleccionando la opción **"Inventario"**, introduciendo el conteo físico real observado en nave para cuadrar inmediatamente el stock del sistema.
- **RF-37:** EL SISTEMA permitirá tramitar en cualquier momento una **Baja Directa por Merma / Siniestro en Nave** ante roturas accidentales o deterioro de consumibles (p. ej. saco mojado, bobina aplastada), registrando el motivo técnico para mantener el inventario real sin esperar a la auditoría semestral.
- **RF-38:** EL SISTEMA dispondrá de un slot específico de almacén denominado **"Residuos / Chatarra"**, donde se registrarán las mermas metálicas (cobre de cables retirados, latón, chatarra de tuberías) y componentes eléctricos/electrónicos fuera de uso (RAEE - Real Decreto 110/2015):
  1. Al entregar los residuos a la empresa de reciclaje o gestor de chatarra autorizado, EL SISTEMA registrará la **Factura de Venta con Inversión del Sujeto Pasivo de IVA** (Art. 84.Uno.2º.c Ley de IVA) como ingreso extraordinario.
  2. EL SISTEMA exigirá adjuntar y custodiar en `/docs/<empresa_id>/almacen/residuos/` la documentación legal medioambiental: Registro NIMA, Libro de Registro de Residuos con códigos LER (ej. LER 17 04 01 para cobre), Documentos de Identificación de Traslado (DIT), Autorización ambiental del gestor y **Certificado Oficial de Tratamiento y Destino Final de Residuos**.
- **RF-39:** EL SISTEMA permitirá registrar salidas de material para **"Banco de Ensayo Técnico / Uso Interno de Taller"**, imputando el coste a gastos operativos internos de taller sin requerir la creación de clientes ni obras simuladas.
- **RF-40:** EN consumibles fungibles menores (siliconas, pegamentos, tornillería, selladores), EL SISTEMA computará la salida por unidad completa o envase menor imputado a obra, asumiendo la merma técnica natural de uso en la liquidación del trabajo.
- **RF-41:** CUANDO se registre un nuevo albarán de compra con variación de precio unitario, EL SISTEMA **actualizará el Precio de Referencia de Almacén para los presupuestos y órdenes de compra que se generen a partir de ese instante** (manteniendo inalterables los presupuestos ya emitidos previamente), aplicando los descuentos y márgenes comerciales configurados.

### Bloque 7: Ficha Detallada del Artículo (`/gestio/magatzem/[id]`), Taller, Calibración e Inhabilitación de Bajas
- **RF-42:** CUANDO el usuario hace clic sobre un artículo en el listado, EL SISTEMA abrirá su ficha completa (`/gestio/magatzem/[id]`), mostrando:
  1. Datos maestros: Referencia, Nombre, Tipología, Familia interna, Ubicación Principal en Gaveta, Ubicación Secundaria en Palé y Formato de suministro (Bobina vs. Barra).
  2. Atributos técnicos normalizados según la vertical (DN, PN, sección, tensión, etc.).
  3. En maquinaria: Listado de ejemplares individuales con su **Número de Serie / Código de Activo** y estado actual (*Disponible, Asignado a furgoneta X bajo custodia del Responsable Y, En Taller, Calibración agendada, Inhabilitado por baja*).
  4. Proveedor habitual asociado con enlace directo a su ficha de proveedor (Spec 003).
  5. Desglose de existencias: Stock físico en Nave Central, Stock en furgonetas, Stock en depósito/consignación y **Stock en tránsito con desglose de entregas parciales pendientes**.
  6. Botón manual de acción rápida: **"Redactar Pedido de Compra"**, que abre la propuesta de reposición precargando el artículo y su proveedor.
  7. Histórico cronológico de movimientos (entradas, salidas de obra, regularizaciones y devoluciones), **omitiendo estrictamente los costes unitarios de compra para el rol `Ingeniero`**.
- **RF-43:** CUANDO un operario o responsable reporta una herramienta o máquina como averiada (desde la casilla de incidencias de la hoja de picking o desde la ficha de almacén), EL SISTEMA cambiará automáticamente el estado del ejemplar específico a **"En reparación / Taller externo"**, **bloqueando de forma infranqueable su asignación en futuras hojas de picking** mientras permanezca en dicho estado.
- **RF-44:** SI una herramienta en reparación es dictaminada como irreparable por el servicio técnico externo o es sustraída mediante robo acreditado con atestado policial, EL SISTEMA tramitará su **Baja Definitiva del Inventario**, registrando el motivo y **desactivando e inhabilitando de forma permanente su Número de Serie en la base de datos**, impidiendo que dicho identificador pueda volver a activarse o reasignarse en el sistema.
- **RF-45:** EL SISTEMA permitirá calendarizar fechas obligatorias de **Mantenimiento Preventivo e Inspección / Calibración Periódica** para herramientas y equipos técnicos; DURANTE las fechas o periodos agendados para revisión, EL SISTEMA **bloqueará automáticamente la disponibilidad y asignación del ejemplar específico en las hojas de picking**, garantizando que ninguna cuadrilla utilice herramientas con certificación o mantenimiento vencido.

### Bloque 8: Segregación Financiera del Inventario (Zero-Trust) y Circuito de Facturación
- **RF-46:** MIENTRAS el usuario autenticado posea rol `Boss` o `Secretaria / RRHH`, EL SISTEMA mostrará la **valoración económica total del inventario en euros (€)** según el último precio de compra, los costes unitarios de compra y los márgenes comerciales de proveedor.
- **RF-47:** EL USUARIO con rol `Ingeniero` tendrá acceso exclusivo a los **precios finales de venta** para elaborar presupuestos y a las **facturas finales emitidas a clientes de sus obras** (para defender los trabajos ejecutados ante el cliente o gerencia); no obstante, **EL SISTEMA bloqueará estrictamente a nivel de API el acceso del rol `Ingeniero` a los albaranes de entrega/compra de proveedores, costes unitarios de adquisición y al cuadro de mando macroeconómico de la empresa**.
- **RF-48:** LA EMISIÓN de facturas oficiales a clientes (tanto de anticipo como finales) se realizará **única y exclusivamente desde los perfiles `Secretaria` o `Boss`**, recibiendo el presupuesto técnico aprobado por el cliente con las incidencias de obra liquidadas por el ingeniero.

---

## Requisitos No Funcionales
- **Almacenamiento Local Seguro Multi-Tenant:** Todos los albaranes de almacén escaneados, fotografías de devolución en vehículo/parcela, fotos de odómetros, denuncias policiales por robo de herramientas, informes técnicos de avería de herramientas, certificados medioambientales de gestores de residuos RAEE y actas de regularización de inventario se almacenan directamente en los discos locales del Mini PC/servidor aislados por inquilino (`/docs/<empresa_id>/almacen/...`), con copias de seguridad semanales automáticas cada domingo (sin dependencia de AWS S3).
- **Seguridad Multi-Tenant (RLS):** Cada consulta, inserción, regularización y movimiento de almacén aplica Row Level Security mandatorio mediante `app.current_empresa_id`.
- **Protección de Datos Macroeconómicos (Zero-Trust):** El cuadro macroeconómico global de la empresa y los albaranes de compra de proveedores quedan restringidos a `Boss` y `Secretaria / RRHH`.
- **Tolerancia Cero a Datos Ficticios (Zero Mock Data):** Si no existen artículos en la base de datos de la empresa, la interfaz muestra el estado Día 0 completamente limpio, sin artículos simulados ni métricas falsas.
- **Diseño Camaleón:** La interfaz respetará las variables dinámicas de diseño de marca blanca corporativa sin sesgos terminológicos específicos de vertical.

---

## Fuera de Alcance (Lo que NO hace este módulo)
- No gestiona el mantenimiento mecánico, seguros ni revisiones periódicas/ITV de los vehículos (pertenece a `/gestio/flota`).
- No gestiona la contratación de maquinaria o grúas de alquiler externo (se gestiona como subcontrata en `/gestio/proveidors`).
- No realiza cobros bancarios directos por TPV físico en nave ni transferencias bancarias de cierre contable (pertenece a `/gestio/comptabilitat`).
- No realiza envíos de pedidos de reposición de forma desatendida a proveedores sin confirmación humana (*Human-in-the-Loop*).
- No expone albaranes de compra ni costes de adquisición de proveedores al rol `Ingeniero`.

---

## Criterios de Finalización (Definition of Done)
1. Todos los requisitos funcionales (RF-01 al RF-48) redactados en sintaxis formal EARS y consolidados tras ocho rondas de rigurosa auditoría QA.
2. Bloqueo transaccional `SELECT ... FOR UPDATE` en PostgreSQL para evitar condiciones de carrera en reservas concurrentes de stock.
3. Segregación estricta de precios para el Ingeniero: acceso a precios finales de venta y facturas de cliente para presupuestar y defender obras, con bloqueo absoluto de albaranes de compra y costes de proveedor (facturación reservada a Boss y Secretaria).
4. Formato de suministro continuo (Bobina vs. Barra rígida con check de retal "Parcial" en devoluciones).
5. Filtro inteligente de IA para entregas parciales (backorders) y soporte de albaranes que consolidan múltiples pedidos de compra.
6. Inhabilitación y desactivación permanente de Números de Serie dados de baja en el histórico de herramientas.
7. Alerta preventiva de cuota de almacenamiento en la PWA para fotos locales.
8. Atributos técnicos normalizados según la vertical activa (DN, PN, sección, tensión, resistencia).
9. Ubicación física dual: Gaveta principal de picking y Palé secundario de reserva.
10. Sustitución de herramientas averiadas a mitad de jornada con pausa del temporizador de obra en PWA.
11. Relevo de Responsable de Cuadrilla desde base ante incapacidad sobrevenida.
12. Régimen de material en depósito con resolución de siniestros respaldada por aseguradoras.
13. Gestión integral del slot de "Residuos / Chatarra" con trazabilidad documental legal y medioambiental RAEE/Ley de Residuos e inversión de sujeto pasivo de IVA.
14. Actualización del Precio de Referencia de Almacén ante nuevos albaranes para futuros presupuestos.
15. Se respeta estrictamente la política de no realizar commits sin solicitud explícita del usuario.
