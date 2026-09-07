# Spec 004 — Módulo de Magatzem i Inventari (/gestio/magatzem)

## 1. Contexto y objetivo

El módulo de Magatzem i Inventari es el pulmón operativo y logístico de la empresa técnica. Conecta la entrada de materiales desde los albaranes y facturas de compra de los proveedores (Spec 003) con la preparación matinal de suministros para las cuadrillas y su consumo e imputación exacta en cada orden de trabajo ejecutada en campo (PWA `/operari`).

Resuelve con rigor la gestión multialmacén simultánea (Almacén Central en nave física, stock rodante en furgonetas tratadas como talleres móviles con dotación base bajo la custodia del Responsable de Cuadrilla, y asignaciones directas a operarios). Incorpora la codificación individual de maquinaria por número de serie (`[Herramienta] [Nº Ejemplar] = [Número de Serie]`) con inhabilitación permanente de activos dados de baja, la ubicación física dual (Gaveta principal y Palé secundario), y la gestión de materiales continuos con distinción de Formato de Suministro (Bobina/Rollo continuo vs. Barra rígida) y check de retal "Parcial".

A nivel arquitectónico, implementa el bloqueo transaccional concurrente en base de datos (`SELECT ... FOR UPDATE` en PostgreSQL) para reservas de stock, el control inteligente de compras por IA con soporte para entregas parciales (*backorders*), la estricta segregación *Zero-Trust* donde el Ingeniero solo accede a precios de venta finales, la disciplina de una hoja de picking y devolución por cada orden de trabajo, y la gestión del slot de "Residuos / Chatarra" con cumplimiento documental RAEE.

Toda la arquitectura respeta el principio de Tolerancia Cero a Datos Ficticios (*Zero Mock Data* con Estado Día 0 real), almacenamiento de expedientes en discos locales aislados (sin AWS S3), y aislamiento multi-inquilino mandatorio (RLS).

---

## 2. Usuarios / actores y Matriz de Acceso (Zero-Trust)

El backend garantiza el aislamiento multi-inquilino (RLS) y la segregación estricta de permisos por rol:

* **Boss (Gerencia / Propietario):** Acceso total e irrestricto a la gestión de almacén, configuración de umbrales, aprobación de compras por IA, liquidación de depósitos y siniestros con aseguradoras, valoración económica total del inventario en euros (€) basada en el último precio de compra y acceso al panel macroeconómico confidencial.


* **Secretaria / RRHH:** Acceso operativo al directorio, altas manuales y por OCR de albaranes de compra, conciliación de entregas parciales, emisión exclusiva de facturas de venta de clientes y tramitación de facturas de venta de chatarra/residuos, y consulta de costes de compra y valoración contable del stock.


* **Ingeniero / Supervisor Técnico:** Planificación de órdenes con reserva de stock, consulta de existencias físicas y ubicaciones detalladas. Confección de presupuestos utilizando exclusivamente precios finales de venta. **Bloqueo estricto a nivel de API sobre los albaranes de compra de proveedores, costes unitarios de adquisición y el cuadro de mando macroeconómico**.


* **Responsable de Cuadrilla (Capataz):** Titular formal de la custodia de la furgoneta asignada, validación de hojas de picking (siguiendo lotes FEFO) y devolución por tarea (check "Parcial" en tubos), y registro de traspasos entre furgonetas en campo.


* **Operario de Cuadrilla (`/operari`):** Acceso a la PWA móvil para consultar la hoja de picking matinal (1 tarea = 1 picking list), ejecutar tareas offline, reportar urgencias o averías, y foto del cuentakilómetros al cerrar jornada.



### Matriz de Acceso por Rol

| Entidad / Función | Boss | Secretaria / RRHH | Ingeniero | Responsable / Operario |
| --- | --- | --- | --- | --- |
| **Directorio, Stock Físico y Ubicaciones** | Lectura / Escritura | Lectura / Escritura | Solo Lectura | Lectura (PWA) |
| **Planificación y Reserva Transaccional** | Lectura / Escritura | Lectura / Escritura | Lectura / Escritura | Sin acceso |
| **Hoja de Picking y Devolución Parcial** | Lectura / Escritura | Lectura / Escritura | Solo Lectura | **Escritura (Validación)** |
| **Precios de Venta a Cliente Final** | Lectura completa | Lectura completa | Lectura completa | Sin acceso |
| **Costes de Compra y Facturas Proveedor** | Lectura completa | Lectura completa | **Bloqueo Total (403)** | Sin acceso |
| **Valoración Económica Total Inventario** | Lectura completa | Lectura completa | **Bloqueo Total (403)** | Sin acceso |

---

## 3. Historias de usuario

* **H1:** Como *Ingeniero*, quiero que al guardar la planificación de una obra, el sistema bloquee transaccionalmente las filas en base de datos para garantizar que si otro compañero planifica a la vez, no se asigne material inexistente.


* **H2:** Como *Ingeniero*, quiero ver en el catálogo de almacén los precios de venta finales para elaborar mis presupuestos técnicos con margen, sin tener acceso a los costes de adquisición de proveedores que competen a administración.


* **H3:** Como *Ingeniero*, quiero que si planifico una obra con material pendiente de entrega, la IA me informe con precisión del material disponible frente al que está en tránsito (*backorders*).


* **H4:** Como *Responsable de Cuadrilla*, quiero que en materiales continuos la hoja de picking me especifique si debo coger una bobina o barras rígidas, y si devuelvo 3m de una barra de 6m, marcar el check "Parcial" para registrar el retal aprovechable.


* **H5:** Como *Operario*, quiero que la PWA me alerte si el almacenamiento local de mi móvil se aproxima al límite de cuota, asegurando que las fotos offline se sincronicen sin pérdida de datos.


* **H6:** Como *Boss o Secretaria*, quiero que cuando una herramienta sea dada de baja definitiva por robo o siniestro, su número de serie quede desactivado e inhabilitado de por vida en el histórico.


* **H7:** Como *Secretaria*, quiero emitir las facturas de anticipo (mín. 45% o 100% de materiales con Veri*factu) tras la aceptación del presupuesto por el cliente, y la factura final una vez que el ingeniero valide los trabajos.



---

## 4. Requisitos Funcionales (Criterios de Aceptación en EARS)

### Bloque 1: Directorio Principal (`/gestio/magatzem`) y Estado "Día 0"

* **RF-01 (Ubiquitous):** EL SISTEMA presentará en `/gestio/magatzem` un listado tabular limpio con paginación del lado del servidor (*Server-Side Pagination*) y sin bloques de KPIs superiores, mostrando por cada registro: *Referencia, Nombre/Descripción, Proveedor habitual, Ubicación física (Gaveta/Palé), Stock Total Actual, Stock Mínimo y Estado de pedido*.


* **RF-02 (Ubiquitous):** CUANDO el usuario introduce texto en el buscador, EL SISTEMA filtrará en tiempo real por coincidencia sobre: *Referencia, Nombre, Proveedor y Ubicación*.


* **RF-03 (Ubiquitous):** EL SISTEMA dispondrá de filtros operativos para segmentar la vista por familias, stock bajo mínimos, maquinaria, stock rodante, material en tránsito, material en depósito, slot de residuos/chatarra y envases retornables con fianza.


* **RF-04 (State-driven):** SI el sistema se encuentra en estado "Día 0", ENTONCES EL SISTEMA mostrará la pantalla completamente limpia, exhibiendo exclusivamente los botones *"Alta manual de artículo"* y *"Entrada asistida por IA"*, sin datos ficticios (*Zero Mock Data*).



### Bloque 2: Altas de Material, Formato Continuo, Atributos y Recepción

* **RF-05 (Event-driven):** CUANDO se pulsa "Alta manual", EL SISTEMA solicitará los datos maestros (Referencia, Ubicación en Gaveta/Palé, Stock Óptimo) e incorporará dinámicamente atributos técnicos normalizados según la vertical (DN, PN, sección eléctrica, resistencia).


* **RF-06 (Ubiquitous) — Formato Continuo y Retales:** EN materiales lineales continuos (tuberías, cables), EL SISTEMA registrará las unidades en unidades enteras originales (Barra rígida o Bobina). Mantendrá una diferenciación estricta entre barras estándar y retales parciales aprovechables, calculando su coste proporcional por metro lineal. CUANDO se prescriba un material continuo, la política de picking obligará a agotar prioritariamente los retales antes de autorizar el corte de una barra nueva.


* **RF-07 (Ubiquitous):** EN herramientas y maquinaria, EL SISTEMA asignará un identificador unívoco **`[Nombre Herramienta] [Nº Ejemplar] = [Número de Serie]`** vinculándolo a la custodia legal de la entidad asignada (Responsable de cuadrilla o almacén central).


* **RF-08 (Unwanted behavior):** Queda prohibida la recepción física sin documentación oficial. CUANDO se selecciona "Entrada asistida por IA", EL SISTEMA procesará el albarán/factura mediante OCR, admitiendo albaranes multi-pedido que actualicen simultáneamente las líneas de varias órdenes de compra.


* **RF-09 (Event-driven):** SI durante la descarga se detecta material roto o discrepante, EL SISTEMA permitirá registrar una Incidencia de Recepción, bloqueando la entrada del lote al stock activo (Cuarentena) y derivando el caso a `Secretaria`.


* **RF-10 (Event-driven):** SI un material en nave central se detecta defectuoso, EL SISTEMA tramitará un RMA Directo hacia Proveedor generando un volante físico y custodiando el expediente en `/docs/<empresa_id>/incidencias`.


* **RF-11 (State-driven) — Material en Depósito:** EL SISTEMA permitirá registrar entradas en Depósito/Consignación. El stock se consumirá normalmente, pero se liquidará periódicamente al proveedor. SI hay litigio con el proveedor, la devolución de existencias no consumidas dejará el depósito a cero (0).


* **RF-12 (Event-driven):** SI un material en depósito sufre un siniestro en nave, EL SISTEMA tramitará la baja asumiendo la empresa el coste frente al distribuidor mediante la póliza de seguros.



### Bloque 3: Estructura Multialmacén, Ubicación Dual y Dotación de Furgonetas

* **RF-13 (Ubiquitous):** EL SISTEMA gestionará una arquitectura multialmacén: Almacén Central (doble nivel de ubicación: Gaveta y Palé), Talleres Móviles (furgonetas con stock rodante), y Asignaciones a Operarios.


* **RF-14 (Ubiquitous):** EL SISTEMA mantendrá un Checklist de Dotación Base por Furgoneta compuesto por material fungible básico, habilitando una Revisión Ágil por Excepción semanal para reponer exclusivamente los faltantes.


* **RF-15 (Event-driven):** SI un operario necesita reposición urgente entre semana, EL SISTEMA permitirá la "Hoja de Reposición de Furgoneta" transfiriendo stock de nave al vehículo inmediatamente.


* **RF-16 (State-driven):** EL SISTEMA tratará la maquinaria en alquiler temporal como un servicio de subcontrata (Spec 003), exigiendo póliza RC y excluyéndola del catálogo de activos propios.



### Bloque 4: Planificación Transaccional, Picking FEFO y Ejecución en Campo

* **RF-17 (Event-driven) — Bloqueo Transaccional Híbrido:** CUANDO el ingeniero planifica una orden, EL SISTEMA empleará control de concurrencia optimista (`version_id`) en la interfaz. Al guardar, ejecutará un bloqueo pesimista estricto mediante la apertura de una transacción SQL y la instrucción `SELECT ... FOR UPDATE` sobre los registros de stock. Tras validar la disponibilidad real frente a concurrencias, ejecutará el `COMMIT` que confirmará la deducción virtual y liberará los bloqueos. SI la orden se suspende "sine die", se liberará inmediatamente la reserva virtual de stock.
* **RF-18 (Event-driven):** CUANDO se planifica con material pendiente de recepción, la IA informará: *"Pedido con recepción parcial: X unidades disponibles, Y en tránsito del pedido [Código]"*, disparando alerta de compra si procede.


* **RF-19 (Ubiquitous) — Criterio FEFO y Residuos:** CUANDO el material tenga caducidad (químicos, resinas), la hoja de picking prescribirá obligatoriamente el lote más próximo a vencer (FEFO). Los botes caducados o abiertos mermados se derivarán obligatoriamente al slot de residuos/reciclaje.


* **RF-20 (Ubiquitous):** CUANDO se asigne una orden, EL SISTEMA generará una Hoja de Carga y Devolución unívoca (Regla: *1 Tarea = 1 Hoja de Picking/Devolución*).


* **RF-21 (State-driven):** CUANDO múltiples órdenes se asignan a un mismo vehículo en un día, EL SISTEMA mantendrá el vehículo "Reservado" para toda la jornada completa.


* **RF-22 (Ubiquitous) — PWA Operario:** DENTRO de la PWA (`/operari`), la hoja de picking tendrá 3 casillas: (1) Retirada de material, (2) Devolución de sobrantes (con check "Parcial" para retales), y (3) Incidencias.


* **RF-23 (Event-driven):** CUANDO el Capataz pulsa "Validar Recogida", EL SISTEMA descontará el stock del Almacén Central y bloqueará inmutablemente los valores; cualquier error posterior exigirá una Incidencia de Picking.


* **RF-24 (Event-driven) — Salidas de Urgencia:** SI se extrae material por urgencia sin albarán previo, se exigirá registrar una *"Incidencia de Salida de Urgencia"* en la orden activa, descontando el stock físico instantáneamente para que la IA matinal detecte la rotura.


* **RF-25 (Event-driven) — Traspaso Offline Furgonetas:** CUANDO dos cuadrillas intercambian material en campo (A ➔ B), registrarán una incidencia bilateral en `IndexedDB`. La Cuadrilla B asumirá la custodia legal instantáneamente en modo offline y podrá utilizar el material en la obra. El cuadre en el servidor se formalizará automáticamente al recuperar cobertura de red.


* **RF-26 (Event-driven) — Facturas de Anticipo vs. Cierre:** CUANDO un cliente acepta un presupuesto, se devengará la Factura de Anticipo oficial Veri*factu (mín. 45%). Al finalizar la obra, el material intacto retornado ingresará como stock físico disponible, y la persona responsable (`Boss/Secretaria`) ajustará la factura de cierre según la modalidad contractual (precio cerrado vs. administración).


* **RF-27 (Ubiquitous):** EL SISTEMA diferenciará estrictamente el stock físico del circuito contable: si se devuelven 2m de un tubo de 6m, el sobrante se ingresa como retal parcial aprovechable, aunque se haya facturado la barra entera al cliente original.


* **RF-28 (State-driven):** CUANDO una herramienta especial sea devuelta sin incidencias al cierre de jornada, EL SISTEMA liberará automáticamente su custodia haciéndola disponible en nave central.


* **RF-29 (Event-driven):** SI una herramienta se avería en obra a mitad de jornada, EL SISTEMA permitirá pausar el temporizador de la tarea en la PWA, registrar la incidencia de avería, acudir a la base a sustituirla y reanudar el trabajo sin falsear la mano de obra.


* **RF-30 (Event-driven):** SI el Capataz sufre una baja sobrevenida, la oficina técnica tramitará una "Incidencia de Relevo de Responsable", traspasando la custodia formal del vehículo y picking al técnico sustituto.


* **RF-31 (State-driven):** LA PWA emitirá una Alerta Preventiva de Cuota Excedida si la memoria de IndexedDB se aproxima al límite del navegador, requiriendo sincronización inmediata.



### Bloque 5: Filtro Anti-Duplicidad, Entregas Parciales y Reposición por IA

* **RF-32 (Ubiquitous):** EL SISTEMA asignará a cada pedido un código unívoco `[Iniciales]+00#[Correlativo]`.


* **RF-33 (Event-driven):** AL FINALIZAR el picking matinal, la IA analizará las roturas de stock. SI hay un pedido en tránsito que ya cubre la necesidad mediante entregas parciales (*backorders*), la IA detendrá la generación de un nuevo pedido para evitar duplicidades. SI supera los 7 días sin entrega, emitirá una Alerta de Pedido Pendiente.


* **RF-34 (State-driven):** EL SISTEMA soportará la recepción de un pedido mediante múltiples albaranes parciales de entrega (*backorders*). El *Three-Way Matching* conciliará exclusivamente los albaranes físicos recepcionados con las facturas mensuales parciales correspondientes, manteniendo vivo el saldo del pedido en tránsito.



### Bloque 6: Inventarios, Slot de Residuos (RAEE) y Actualización de Precios

* **RF-35 (Ubiquitous):** EL SISTEMA dispondrá de un módulo de Inventario General Periódico para soportar auditorías físicas totales.


* **RF-36 (Event-driven):** DURANTE la auditoría general, EL SISTEMA paralizará los movimientos ordinarios para que todo el personal realice el conteo simultáneo en nave y furgonetas. Quedarán exceptuadas las salidas catalogadas como "Urgencia Nivel 1", las cuales se registrarán en una cola paralela para ser regularizadas automáticamente al cierre del inventario.
* **RF-37 (Event-driven):** EL SISTEMA permitirá tramitar una "Baja Directa por Merma/Siniestro" para consumibles deteriorados o retales inviables, traspasándolos al slot de "Residuos / Chatarra".


* **RF-38 (Event-driven) — Gestión RAEE e Inversión Sujeto Pasivo:** EL SISTEMA gestionará el slot de Residuos analizando los documentos ambientales (NIMA, LER) mediante IA. Al vender la chatarra, el motor de facturación automatizará la Inversión del Sujeto Pasivo de IVA (Art. 84.Uno.2º.c), fijando cuota a 0,00€ e insertando la leyenda legal en PDF/Veri*factu sin intervención manual, custodiando los Certificados de Destino Final.


* **RF-39 (Event-driven):** EL SISTEMA permitirá salidas para "Banco de Ensayo Técnico", imputando el coste a gastos operativos del taller sin crear clientes simulados.


* **RF-40 (Ubiquitous):** EN consumibles menores (siliconas, tornillería), EL SISTEMA permitirá el reingreso al stock únicamente de los envases que retornen intactos y precintados. Los envases desprecintados o empezados se considerarán merma natural y se imputarán al 100% como gasto a la obra.
* **RF-41 (Event-driven):** CUANDO un nuevo albarán registre variación de precios:
1. SI vulnera el pacto de pedido firme, se emitirá Alerta de No Conformidad, bloqueando la actualización contable del stock.
2. SI es legítimo, EL SISTEMA actualizará el Precio de Referencia de Almacén al último coste de compra para nuevos presupuestos y recalculará el Precio Medio Ponderado (PMP) para la valoración contable de existencias y coste de obras (Spec 007), manteniendo inmutables los presupuestos emitidos en el pasado.





### Bloque 7: Ficha de Artículo, Taller y Baja de Seriales

* **RF-42 (Ubiquitous):** La ficha del artículo mostrará atributos técnicos, lista de ejemplares con Número de Serie, proveedor asociado, desglose multialmacén, botón rápido de pedido y cronología de movimientos (omitiendo los costes unitarios al Ingeniero).


* **RF-43 (State-driven):** SI una herramienta se reporta averiada, EL SISTEMA la marcará "En Taller", bloqueando infranqueablemente su asignación en picking.


* **RF-44 (Event-driven):** SI la herramienta es irreparable, será dada de baja. Si se sustituye por garantía, conservará el historial vinculando el nuevo SN. Si es sustraída (robo acreditado), tramitará la Baja Definitiva, inhabilitando permanentemente su Número de Serie en la base de datos para impedir reactivaciones.


* **RF-45 (State-driven):** EL SISTEMA calendarizará Mantenimientos/Calibraciones, bloqueando la asignación de las herramientas durante los días agendados de revisión.



### Bloque 8: Segregación Financiera, Facturación a Clientes y Retornables

* **RF-46 (Ubiquitous):** MIENTRAS el rol sea `Boss` o `Secretaria`, EL SISTEMA mostrará la valoración económica total del inventario en euros (€) calculada mediante el Precio Medio Ponderado (PMP) según el Plan General Contable (Spec 007), utilizando el último precio de compra exclusivamente como coste de referencia para el cálculo de márgenes en nuevos presupuestos, y excluyendo matemáticamente el material en depósito/consignación cuya titularidad pertenece al proveedor.


* **RF-47 (Ubiquitous):** EL ROL `Ingeniero` tendrá acceso exclusivo a los precios finales de venta y facturas finales de sus obras para defender los trabajos. Bloqueo a nivel API (`403`) sobre albaranes de compra, costes unitarios y cuadro macroeconómico.


* **RF-48 (Event-driven):** LA EMISIÓN de facturas oficiales de cliente será exclusiva de `Secretaria` o `Boss`.


* **RF-49 (Event-driven):** CUANDO se instale equipo técnico (inversores, calderas), el operario fotografiará la placa desde PWA. EL SISTEMA vinculará el Número de Serie de fábrica al expediente final del cliente para tramitar legalizaciones y garantías oficiales.


* **RF-50 (Unwanted behavior):** EL SISTEMA prohibirá el borrado físico (`DELETE`) de cualquier artículo del catálogo. CUANDO un artículo quede obsoleto, se permitirá su baja lógica (`actiu = false`) únicamente si su stock físico y en tránsito es estrictamente cero (0).


* **RF-51 (State-driven) — Envases Retornables:** EL SISTEMA gestionará el saldo de "Retornables / Envases con Fianza" (palés EPAL, bobinas). En caso de rotura en obra, se habilitará la "Baja de Retornable por Pérdida de Fianza", imputando la pérdida como gasto operativo de la orden de trabajo.


* **RF-52 (Event-driven) — Custodia Temporal (RMA Cliente):** EL SISTEMA regulará la recepción física en Almacén de equipos de clientes averiados para garantía (RMA Cliente) mediante un "Ticket de Reparación", verificando si está en garantía oficial y tramitando el SAT sin computar como existencias propias.



---

## 5. Casos Límite y Resiliencia (EDGE-01 a EDGE-20)

| Código | Tipo EARS | Módulo | Vector de Falla / Escenario Límite | Comportamiento del Sistema |
| --- | --- | --- | --- | --- |
| **EDGE-01** | *Unwanted* | Concurrencia | Dos ingenieros intentan planificar reservas sobre la última unidad de un material en el mismo milisegundo. | PostgreSQL aplica `SELECT FOR UPDATE` encapsulado en la transacción; el segundo request queda en cola y aborta con alerta de *Stock insuficiente* si la transacción 1 agota el stock. |
| **EDGE-02** | *Event-driven* | PWA Sync | Cuadrilla A traspasa material a B offline. Sincronizan datos con cantidades o artículos diferentes. | El sistema detecta asimetría en la base local (IndexedDB) de cada PWA; aísla el material levantando un estado `CONFLICTO_TRASPÀS` que requiere resolución manual por Secretaría. |
| **EDGE-03** | *Unwanted* | Picking | Operario intenta registrar la devolución de una herramienta con Número de Serie ajena a su vehículo. | El sistema bloquea el escaneo en PWA, emitiendo alerta *"Herramienta ajena. Solicite traspaso formal desde el titular actual"*. |
| **EDGE-04** | *Event-driven* | RMA Cliente | Cliente rechaza el presupuesto de reparación de un equipo fuera de garantía ingresado temporalmente en almacén. | Sistema cierra el Ticket RMA, exige la devolución física del equipo al cliente y purga el asiento temporal del inventario central. |
| **EDGE-05** | *Unwanted* | PWA Quota | El almacenamiento en `IndexedDB` alcanza la cuota máxima del navegador mientras se escanean albaranes offline. | PWA detiene nuevas capturas fotográficas, prioriza el guardado de metadatos de texto y lanza alarma crítica *"Conectar a red para purgar fotos locales"*. |
| **EDGE-06** | *Event-driven* | FEFO | La política prescribió un lote FEFO antiguo, pero en la gaveta física dicho lote presenta fuga de líquidos o rotura de envase. | Capataz marca lote como "Siniestro" en la PWA, el sistema lo deriva a Residuos y autoriza automáticamente extraer el siguiente lote viable. |
| **EDGE-07** | *Unwanted* | Inventario | Intento de realizar Baja Lógica (`actiu = false`) de un artículo que actualmente cuenta con stock positivo en una furgoneta. | El sistema bloquea el borrado lógico emitiendo alerta: *"Imposible descatalogar: Existen N unidades en el vehículo X"*. |
| **EDGE-08** | *Unwanted* | Picking | Operario escanea un retal (ej. tubo 2m) pero el sistema indica que el stock de retales aprovechables es 0 (descuadre físico). | Requiere registrar incidencia de inventario express desde la PWA, autorizando excepcionalmente la extracción de una barra rígida entera. |
| **EDGE-09** | *Event-driven* | Compras | Se recibe un albarán multi-pedido que entrega 5 unidades del Pedido 1 y 5 unidades del Pedido 2 de la misma referencia. | El motor de consolidación actualiza ambas órdenes proporcionalmente y unifica las 10 unidades en el inventario disponible. |
| **EDGE-10** | *Event-driven* | Avería Obra | Herramienta especial se avería en tajo; se pausa temporizador, pero al llegar a base no hay ejemplares de repuesto disponibles. | El estado de la herramienta pasa a "Taller", pero la pausa de la obra se debe convertir administrativamente en "Obra Paralizada - Causa de Fuerza Mayor". |
| **EDGE-11** | *Unwanted* | Depósitos | Se intenta devolver material en depósito al proveedor por rescisión, pero el stock físico es menor al esperado contablemente. | Sistema bloquea la rescisión automática; requiere liquidación económica (`Factura de Venta por Faltante`) pagando a proveedor las piezas extraviadas. |
| **EDGE-12** | *Event-driven* | Reprogramación | Una orden planificada y con reserva transaccional ejecutada se suspende indefinidamente por orden del cliente. | El sistema libera inmediatamente los bloqueos de stock virtual en BD, reincorporando el material a la bolsa de disponibilidad. |
| **EDGE-13** | *Unwanted* | Herramientas | Se intenta asignar una herramienta con fecha de calibración agendada para hoy a una hoja de picking matinal. | Bloqueo estricto del sistema que impide la asignación en la UI de carga del Capataz. |
| **EDGE-14** | *Event-driven* | Residuos ISP | Venta de residuos RAEE a un gestor extranjero sin NIF español válido para la Inversión del Sujeto Pasivo. | Sistema fuerza validación del NIF-IVA intracomunitario a través del VIES; si falla, bloquea la automatización del IVA a 0,00€. |
| **EDGE-15** | *Unwanted* | Precios | Albarán nuevo introduce un coste unitario un 300% superior por un error de entrada tipográfica del usuario. | Motor de alertas de compras retiene la actualización del *Precio de Referencia* detectando anomalía de desviación estadística. |
| **EDGE-16** | *Unwanted* | Fianza | Proveedor rechaza retornar fianza de un palé EPAL argumentando daños estructurales. | Secretaría ejecuta baja "Pérdida de Fianza"; el coste se imputa al CC de almacén (si dañó en base) o a la obra (si dañó en campo). |
| **EDGE-17** | *Unwanted* | Seguridad RLS | Trabajador autenticado intenta forzar mediante POSTman la visualización del stock del almacén de otra delegación (tenant distinto). | PostgreSQL rechaza la lectura vía RLS (`app.current_empresa_id`); API devuelve conjunto vacío `[]` sin advertir existencia de otros tenants. |
| **EDGE-18** | *Unwanted* | Facturación | Secretaria intenta facturar un anticipo presupuestario inferior al 45% exigido por la política financiera. | Sistema genera *Warning Administrativo* que requiere confirmación explícita del `Boss` para sobrepasar el umbral mínimo de seguridad de caja. |
| **EDGE-19** | *Event-driven* | Urgencia Base | Cuadrilla sale sin orden asignada por rotura de tubería principal en vía pública (Urgencia Nivel 1). | Registro en PWA como "Salida Blanca de Urgencia"; descarga stock físico y fuerza conciliación administrativa al retornar a la base. |
| **EDGE-20** | *Event-driven* | Consumibles | Operario registra la devolución de 3 tubos de silicona. Dos están precintados y uno está empezado a la mitad. | El sistema reingresa los dos envases cerrados sumando `+2` al inventario, y asume el bote abierto íntegramente como coste de la orden de trabajo. |

---

## 6. Requisitos No Funcionales (RNF)

* **Almacenamiento Local Seguro Multi-Tenant:** Todos los albaranes de almacén escaneados, fotografías de devolución en vehículo/parcela, fotos de odómetros, denuncias por robo, certificados RAEE y actas de inventario se almacenan en los discos locales aislados por inquilino (`/docs/<empresa_id>/almacen/...`), con copias de seguridad semanales automáticas cada domingo (cero dependencia de AWS S3).


* **Seguridad Multi-Tenant (RLS):** Cada consulta, inserción y movimiento aplica Row Level Security mandatorio mediante `app.current_empresa_id` con `FORCE ROW LEVEL SECURITY` en la base de datos.


* **Protección de Datos Macroeconómicos (Zero-Trust):** El cuadro macroeconómico global y los albaranes de compra quedan restringidos a `Boss` y `Secretaria`. Rol `Ingeniero` responde con `403 Forbidden` a dichas rutas de API.


* **Tolerancia Cero a Datos Ficticios (Zero Mock Data):** Si no hay artículos, la interfaz muestra el estado Día 0 completamente limpio.


* **Diseño Camaleón:** Adaptación total a variables CSS dinámicas de marca blanca corporativa sin sesgos de sector.



---

## 7. Fuera de Alcance

* No gestiona el mantenimiento mecánico, seguros ni revisiones periódicas/ITV de los vehículos (pertenece a `/gestio/flota`).


* No gestiona la contratación de maquinaria o grúas de alquiler externo (se gestiona en `/gestio/proveidors`).


* No realiza cobros bancarios directos por TPV físico en nave ni transferencias de cierre contable (`/gestio/comptabilitat`).


* No realiza envíos de pedidos de reposición desatendidos sin confirmación humana (*Human-in-the-Loop*).


* No expone albaranes de compra ni costes de adquisición al rol `Ingeniero` bajo ningún concepto técnico.



---

## 8. Criterios de Finalización (Definition of Done)

1. Requisitos funcionales (RF-01 a RF-52) y matriz de casos límite superados en entorno de pruebas (*Zero Mock*).
2. Implementación del bloqueo transaccional `SELECT ... FOR UPDATE` embebido dentro de la transacción de base de datos previniendo condiciones de carrera.
3. Segregación estricta de precios para el Ingeniero: acceso a precios finales de venta para presupuestar, con bloqueo absoluto de costes de compra y facturación de proveedores (reservada a Boss y Secretaria).


4. Soporte pleno de Formato Continuo (Bobinas/Barras) prescribiendo el check "Parcial", separando envases intactos de mermas consumidas.
5. Filtro IA para entregas parciales (*backorders*) y conciliación de albaranes multi-pedido.


6. Inhabilitación lógica de Números de Serie dados de baja por robo/siniestro en histórico de herramientas.


7. Alarma de cuota PWA IndexedDB (*StorageManager API*) y resolución de conflictos offline en traspasos (`CONFLICTO_TRASPÀS`).


8. Atributos técnicos normalizados según la vertical activa (DN, PN, sección, tensión, resistencia).


9. Ubicación física dual (Gaveta/Palé) y gestión de envases retornables con fianza.


10. Sustitución de herramientas averiadas a mitad de jornada con pausa/reanudación del temporizador de obra en PWA.


11. Relevo de Capataz desde base transfiriendo la custodia de vehículo y picking a un sustituto.


12. Tratamiento económico segregado para material en consignación y liquidación de siniestros.


13. Ciclo integral de "Residuos/Chatarra" RAEE con inversión de sujeto pasivo IVA Veri*factu.


14. Excepciones operativas (Urgencia Nivel 1) modeladas mediante cola paralela para no detener la empresa durante inventarios anuales.

---

## 9. Matriz de Trazabilidad 1:1 de la Definition of Done (DoD)

Para certificar el cierre de la Spec 004, la suite de pruebas automatizadas (*Zero-Mock Data*, PostgreSQL real con RLS activo) deberá cumplir de forma unívoca la siguiente tabla:

| Código RF | Objetivo Técnico Verificable | Caso Límite Vinculado | Assert / Criterio de Aprobación DoD |
| --- | --- | --- | --- |
| **RF-01 / RF-02** | Directorio paginado (*Server-Side*) y búsqueda reactiva. | **EDGE-17** | `LIMIT`/`OFFSET` actúan correctamente. Test de intrusión RLS devuelve `[]` en tenants cruzados. |
| **RF-03 / RF-04** | Día 0 real, sin mock data. UI limpia. | - | BD con 0 artículos levanta UI con cero arrays poblados. |
| **RF-05 / RF-06** | Alta, atributos normalizados y formato continuo (Retales). | **EDGE-08** | Inserción de devolución parcial fragmenta la unidad pero exige trazabilidad de longitud. |
| **RF-07 / RF-08** | Nº de Serie de Herramientas y Recepción OCR multi-pedido. | **EDGE-09** | Actualización de N líneas de órdenes de compra distintas procesando un único albarán PDF. |
| **RF-09 / RF-10** | Incidencia en recepción física y tramitación RMA Directo. | - | Stock defectuoso es forzado a cuarentena; se bloquea venta. |
| **RF-11 / RF-12** | Material Consignación y exclusión de valoración total. | **EDGE-11** | Liquidación por rescisión exige 100% o factura por faltante económico. |
| **RF-13 / RF-14** | Ubicación Dual y Checklist dotación furgoneta. | - | Reposición por excepción completa solo diferencias contra el array base del vehículo. |
| **RF-15 / RF-16** | Traspaso urgente y alquiler temporal (Subcontrata). | - | Alquiler hereda validación de póliza RC de Spec 003. |
| **RF-17** | Bloqueo Transaccional DB (`SELECT FOR UPDATE`). | **EDGE-01 / EDGE-12** | `SELECT FOR UPDATE` asegura exclusividad; el rechazo bloquea doble reserva y la cancelación libera la virtualización instantáneamente. |
| **RF-18 / RF-19** | Backorder UI Inform y Priorización FEFO. | **EDGE-06** | Hoja de Picking asigna mandatoriamente el `batch_id` con `expiry_date` menor. |
| **RF-20 / RF-21** | 1 Tarea = 1 Picking. Reserva íntegra de furgoneta diaria. | - | Asignar orden extra al mismo vehículo en mismo día no levanta conflicto de overlap de recursos. |
| **RF-22 / RF-23** | Check `Parcial` PWA, validación y commit de almacén. | **EDGE-03** | Escaneo de código de barras SN ajeno emite error en PWA y aborta push de `IndexedDB`. |
| **RF-24 / RF-25** | Salidas Blanca/Urgencia y Traspaso Bilateral Offline. | **EDGE-02 / EDGE-19** | Sincronización asimétrica lanza alarma `CONFLICTO_TRASPÀS` en lugar de sobreescribir sin trazabilidad. |
| **RF-26 / RF-27** | Anticipos (45%) y partición físico/contable retales. | **EDGE-18** | Facturación de Anticipo por `<45%` genera alerta administrativa obligando firma del Gerente. |
| **RF-28 / RF-29** | Custodia retornable y Avería a mitad de obra con pausa. | **EDGE-10** | Pausa PWA inserta timestamp; avería en base redirige activo a estado `Taller`. |
| **RF-30 / RF-31** | Relevo Responsable y Alarma de Cuota de Storage PWA. | **EDGE-05** | API `navigator.storage` detecta `>80%`; deshabilita botón cámara en DOM offline. |
| **RF-32 / RF-33** | Código Único PO y Consolidación Preventiva por IA. | - | Tarea Celery detecta PO previo en tránsito para el artículo X y cancela generación del nuevo PO duplicado. |
| **RF-34** | Recepción parcial (*Backorders*) y Three-Way Matching. | **EDGE-09** | Conciliación de albaranes parciales sin cerrar el pedido matriz; saldo en tránsito vivo. |
| **RF-35 / RF-36** | Auditoría General de Inventario (Nave + Furgonetas). | **EDGE-19** | Activación del módulo detiene operativa base; permite flujo paralelo para incidencias de Nivel 1. |
| **RF-37 / RF-38** | Merma a Residuos, Análisis RAEE e ISP automático (0€). | **EDGE-14** | Venta a gestor sin VIES válido aborta el bypass de IVA a `0,00€`. |
| **RF-39 / RF-40** | Consumibles menores, intactos vs empezados. | **EDGE-20** | Solo el stock precintado reingresa en inventario; envases mermados actúan como coste íntegro. |
| **RF-41** | Alerta no conformidad de precio en nueva compra. | **EDGE-15** | Desviación estadística (`z-score` precio unitario) pausa la reescritura del Precio Medio Ponderado (PMP). |
| **RF-42** | Ficha de artículo detallada y trazabilidad multialmacén. | **EDGE-17** | Desglose de existencias por nave y vehículo; omisión de costes de compra al Ingeniero. |
| **RF-43 / RF-44** | Reparación y Baja de Activo (Inhabilitación permanente). | - | SN inhabilitado levanta `ConstraintViolation` si se intenta readmitir en un Alta posterior. |
| **RF-45 / RF-46** | Bloqueo por Mantenimiento y Valoración Excluida (Depósitos). | **EDGE-13** | Picking list remueve visualmente el SN agendado para calibración en el día `CURRENT_DATE`. |
| **RF-47 / RF-48** | Zero-Trust (Ingenieros no ven compra, solo venta/final). | **EDGE-17** | Peticiones HTTP a métricas de costes retornan `403 Forbidden` a Ingenieros. |
| **RF-49 / RF-50** | Foto de SN Instalado y `Soft-Delete` validado (Stock = 0). | **EDGE-07** | Intento de `Soft-Delete` falla si `stock_actual > 0` o `stock_en_transito > 0`. |
| **RF-51 / RF-52** | Retornables con fianza y Custodia temporal de RMA Cliente. | **EDGE-04 / EDGE-16** | Fianza rechazada deriva en gasto de almacén. Cliente rechaza peritaje exige purga del RMA temporal en nave. |
