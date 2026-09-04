# Spec 003 — Módulo de Gestión de Proveedores (/gestio/proveidors)

## Contexto y objetivo
El módulo de Gestión de Proveedores es el registro maestro de los distribuidores de suministros técnicos (materiales, herramientas, maquinaria/vehículos) y de las empresas prestadoras de servicios externos y subcontratas (grúas, transportes, instaladores especializados).

Resuelve la necesidad de gestionar con rigor comercial, técnico, legal y fiscal tanto la adquisición de materiales de obra como la contratación de servicios externos. Incorpora la ingesta automatizada de fichas mediante IA/OCR a partir de facturas o albaranes (*Human-in-the-Loop*), la custodia de políticas contractuales de devolución y garantías por proveedor, la verificación inteligente por IA de pólizas de Responsabilidad Civil (RC) para subcontratas con bloqueo de la subcontrata afectada (garantizando cumplimiento del RD 171/2004 y Ley 31/1995 de PRL), condiciones financieras con salvaguarda de retención del 60% por buena ejecución, triple conciliación automatizada por IA (*Three-Way Matching*: Pedido ➔ Albarán ➔ Factura con soporte de facturas recapitulativas mensuales) para blindar la empresa contra precios abiertos, material discrepante aparcado en cuarentena, validación en campo 100% offline-first con sincronización en segundo plano, trazabilidad 360º de incidencias RMA con volante físico y justificación documental de mermas fiscales (Veri*factu / RD 1007/2023) en `/docs/<empresa_id>/incidencias`, y el historial completo de compras enlazado punto a punto.

Queda expresamente descartada la importación masiva de catálogos teóricos por CSV para evitar obsolescencia de referencias y precios; los productos del proveedor se incorporan al sistema única y exclusivamente a través de albaranes o facturas de compras reales previa validación del NIF.

---

## Usuarios / actores y Matriz de Acceso (Zero-Trust)
El backend garantiza el aislamiento multi-inquilino (RLS) y la segregación estricta de permisos por rol:

- **Boss (Gerencia / Propietario):** Acceso total e irrestricto a la consulta y edición de proveedores, alta manual, alta asistida por OCR de facturas, gestión de pedidos de compra, resolución de discrepancias de precio bloqueadas, **condiciones comerciales de pago, IBAN de abono, retenciones de salvaguarda por buena ejecución, descuentos pactados y analítica económico-contable de compras (volumen acumulado, artículos más comprados y stock estancado sin rotación)**.
- **Secretaria / RRHH:** Acceso total al directorio de proveedores, altas manuales y por OCR, **gestión de condiciones comerciales y datos bancarios (IBAN, plazos de crédito, retenciones y descuentos)**, gestión de incidencias de proveedor, tramitación de pedidos de compra, resolución administrativa de discrepancias de facturación, emisión de pagos confirmados y consulta del historial vinculado a albaranes y facturas.
- **Ingeniero / Supervisor Técnico:** Acceso a la consulta y búsqueda de proveedores en el directorio (ordenados por frecuencia de uso/volumen para agilidad operativa, pero **sin exposición del dato monetario ni columnas financieras**), visualización de datos de contacto comercial, auditoría de capacidades (suministros vs subcontratas), consulta de políticas de garantía/RMA y vigencia de seguros PRL/RC para subcontratas, confirmación técnica de trabajos ejecutados, tramitación técnica de incidencias por piezas defectuosas y redacción de pedidos de reposición supervisados; **bloqueo estricto a nivel de API** sobre el IBAN del proveedor, condiciones de pago, descuentos comerciales y métricas económicas agregadas de compra.

---

## Historias de usuario
- **H1:** Como *Ingeniero o Secretaria*, quiero consultar el listado de proveedores en una tabla minimalista sin KPIs superiores y buscar en tiempo real por coincidencia flexible en Nombre Comercial, Razón Social o Municipio, o por NIF exacto, obteniendo los resultados ordenados por volumen/frecuencia de uso para agilizar la operativa con los distribuidores habituales sin exponer importes monetarios al personal técnico.
- **H2:** Como *Secretaria*, quiero subir una factura o albarán en PDF o foto para que la IA local extraiga automáticamente los datos fiscales y de contacto, presentando un formulario con los campos dudosos para su revisión y confirmación humana obligatoria.
- **H3:** Como *Ingeniero*, quiero que la IA verifique automáticamente la vigencia de la póliza de Responsabilidad Civil (RC) de una subcontrata; si está caducada o incorrecta, que bloquee taxativamente su asignación, redacte el borrador de reclamación por email (dejándolo listo para confirmación humana) y me sugiera de inmediato otra empresa homologada en regla para evitar cualquier riesgo legal de responsabilidad solidaria en prevención de riesgos (PRL).
- **H4:** Como *Ingeniero en campo*, quiero registrar fotográficamente el albarán en papel y la descarga directa de tuberías pesadas en la finca del cliente desde mi móvil (/operari) incluso sin cobertura (offline-first), para certificar la recepción física antes de que administración pague la factura.
- **H5:** Como *Secretaria o Boss*, quiero que la IA compare automáticamente el pedido cotizado con el albarán de entrega y la factura final, bloqueando el pago y aparcando en cuarentena el stock si hay discrepancias económicas o productos sustitutivos no pactados.
- **H6:** Como *Ingeniero*, quiero tramitar la devolución de una pieza defectuosa generando un volante formal físico de RMA para adjuntar al paquete, registrando el estado "En revisión" y, si la garantía es denegada por el fabricante, emitiendo un Certificado de Merma con el informe técnico custodiado en `/docs/<empresa_id>/incidencias` para justificar fiscalmente la pérdida ante Hacienda.

---

## Requisitos Funcionales (Criterios de Aceptación en EARS)

### Bloque 1: Directorio Principal (`/gestio/proveidors`) y Estado "Día 0"
- **RF-01:** EL SISTEMA presentará en `/gestio/proveidors` un listado tabular limpio **sin bloques de KPIs superiores**, mostrando por cada registro exclusivamente: *Nombre Comercial o Razón Social, Persona de contacto (compras/ventas), Teléfono directo y Email directo*.
- **RF-02:** CUANDO el usuario introduce texto en el buscador de la lista, EL SISTEMA filtrará en tiempo real aplicando **búsqueda de subcadena flexible e insensible a mayúsculas/acentos sobre Nombre Comercial, Razón Social y Municipio, y coincidencia exacta sobre NIF/CIF**, **ordenando los resultados de forma descendente según el volumen total acumulado de compras** (frecuencia de uso histórico); para el rol `Ingeniero`, el payload y la interfaz omitirán por completo cualquier cifra monetaria o columna de volumen financiero.
- **RF-03:** SI el sistema se encuentra en estado "Día 0" (cero proveedores registrados en la empresa), ENTONCES EL SISTEMA mostrará la pantalla completamente limpia, exhibiendo exclusivamente los botones de acción: *"Alta nuevo proveedor (manual)"* y *"Alta asistida por IA (Factura/Albarán)"*, sin datos ficticios ni métricas simuladas (*Zero Mock Data*).
- **RF-04:** CUANDO el usuario hace clic sobre el nombre comercial de un proveedor en el listado, EL SISTEMA abrirá la ficha completa detallada del proveedor (`/gestio/proveidors/[id]`).

### Bloque 2: Alta de Proveedores, Catálogo Real, Edición e Inmutabilidad Fiscal
- **RF-05:** CUANDO el usuario pulsa "Alta nuevo proveedor (manual)", EL SISTEMA desplegará un formulario solicitando: *Nombre comercial / Razón Social, NIF/CIF (o NIF-IVA intracomunitario VIES / identificación fiscal internacional), Teléfono directo, Email directo, Dirección fiscal y Persona de contacto (nombre, teléfono y email)*, junto con la selección modular de sus capacidades (*Materiales, Herramientas, Maquinaria/Vehículos, Servicios/Subcontratas*).
- **RF-06:** CUANDO se intenta guardar un nuevo proveedor (manualmente o mediante ingesta por IA), EL SISTEMA validará la unicidad estricta del **NIF/CIF** dentro de la empresa; SI el NIF/CIF ya existe registrado en otro proveedor de la misma empresa, ENTONCES EL SISTEMA rechazará el guardado, no creará registros duplicados y mostrará el mensaje de error: *"El NIF/CIF ya se encuentra registrado para otro proveedor"*.
- **RF-07:** EL SISTEMA permitirá la **edición de los datos de la ficha del proveedor** sujeta a la siguiente regla de inmutabilidad fiscal:
  1. *Proveedor sin histórico:* Si el proveedor no cuenta con albaranes, facturas ni pedidos formalizados, cualquier campo (incluido NIF/CIF y Razón Social por error tipográfico) será editable libremente.
  2. *Proveedor con histórico comercial:* Si el proveedor ya tiene vinculados pedidos, albaranes o facturas en el sistema, **EL SISTEMA bloqueará de forma permanente la modificación del NIF/CIF**, garantizando la inmutabilidad tributaria exigida por la normativa contable y antifraude.
- **RF-08:** CUANDO el usuario selecciona "Alta asistida por IA (Factura/Albarán)", EL SISTEMA procesará el documento (PDF o imagen) mediante el motor local de OCR e inferencia IA, extrayendo de forma preliminar: *Razón Social, NIF/CIF, Dirección, Teléfono, Email e IBAN*.
- **RF-09:** TRAS la extracción por IA, EL SISTEMA desplegará un formulario de previsualización (*Human-in-the-Loop*) marcando de forma visual los campos que la IA no haya podido determinar con certeza para que el usuario humano los complete y valide expresamente antes de insertar el proveedor en la base de datos.
- **RF-10:** EL SISTEMA incorporará artículos y materiales suministrados al catálogo del proveedor **única y exclusivamente a través de albaranes o facturas de compras reales recibidas**, previa validación del NIF/CIF del proveedor, impidiendo la carga masiva descontextualizada de catálogos teóricos por CSV para evitar referencias obsoletas y desajustes de precios.

### Bloque 3: Subcontratas, Blindaje Legal PRL/RC (RD 171/2004) y Retención de Salvaguarda
- **RF-11:** EL SISTEMA estructurará la ficha del proveedor en dos secciones independientes: **Información Comercial y Operativa** (accesible por todo el personal técnico) y **Datos Económico-Contables** (confidencial).
- **RF-12:** DENTRO de la Información Comercial, EL SISTEMA mostrará los datos fiscales completos, dirección física, contactos directos de ventas/compras y la selección de capacidades suministradas (*Materiales, Herramientas, Vehículos/Maquinaria, Servicios/Subcontratas*).
- **RF-13:** CUANDO un proveedor esté categorizado con la capacidad de *Servicios / Subcontratas*, EL SISTEMA dispondrá de un repositorio documental específico para adjuntar la **Póliza de Seguro de Responsabilidad Civil (RC)** y certificados de Coordinación de Actividades Empresariales (CAE) y Prevención de Riesgos Laborales (PRL), registrando la fecha de vigencia de cada documento.
- **RF-14:** CUANDO la oficina técnica solicite o asigne los servicios de una subcontrata para una orden de trabajo, EL SISTEMA ejecutará una **verificación automática mediante IA del repositorio documental**; SI la póliza de Responsabilidad Civil (RC) o cualquier otro requisito de CAE/PRL presenta irregularidades, caducidad o ausencia, ENTONCES EL SISTEMA:
  1. Detallará el motivo específico de la no conformidad documental.
  2. Redactará un **borrador de correo electrónico formal** requiriendo la subsanación urgente, depositándolo en la bandeja de salida/borradores para su confirmación y envío manual por un usuario humano (*Human-in-the-Loop* estricto).
  3. **Bloqueará taxativamente la asignación de dicha subcontrata a la tarea**, sin paralizar las demás tareas independientes de la obra ejecutadas por personal propio u otras subcontratas en regla.
  4. Si las tareas requieren estrictamente los medios técnicos de la subcontrata bloqueada (p. ej. grúa pesada), EL SISTEMA permitirá su reprogramación o reasignación.
- **RF-15:** SI la tarea bloqueada por falta de seguro en la subcontrata es de carácter urgente, ENTONCES EL SISTEMA **asistirá de inmediato al personal técnico sugiriendo la selección de otra empresa homologada del directorio de proveedores que cumpla estrictamente con todos los requisitos legales y pólizas en vigor**.
- **RF-16:** EN las condiciones comerciales de proveedores de servicios/subcontratas, EL SISTEMA establecerá por defecto una política de liquidación financiera de salvaguarda donde **no se adelantará más del 40% del valor de la obra antes de su ejecución**, quedando retenido el 60% diferido hasta que el rol `Secretaria` proceda a la emisión del pago una vez recibida la confirmación técnica de buena ejecución por parte del equipo de supervisión.

### Bloque 4: Ficha Detallada — Parte Económico-Contable Confidencial (Zero-Trust)
- **RF-17:** MIENTRAS el usuario autenticado posea rol `Boss` o `Secretaria / RRHH`, EL SISTEMA mostrará el bloque confidencial de **Datos Económico-Contables**, que integrará:
  1. *Condiciones de Pago:* Plazos acordados (días de crédito), forma de pago (transferencia, pagaré, giro) e IBAN del proveedor para abonos.
  2. *Descuentos Comerciales:* Porcentaje de descuento comercial general y tabla de descuentos específicos por familia o artículo si existieran.
  3. *Analítica de Compras:* Métricas agregadas y gráficas de volumen total de compra acumulado, desglose por fecha, identificación del artículo más comprado y lista de artículos comprados estancados (sin rotación en almacén).
- **RF-18:** SI el usuario autenticado tiene rol `Ingeniero`, ENTONCES EL SISTEMA consumirá un endpoint segregado que omitirá por completo en el payload los datos del Bloque Económico-Contable (IBAN, plazos, descuentos y analíticas de rentabilidad de compra).

### Bloque 5: Gestión de Garantías, Devoluciones RMA y Mermas Fiscales Justificadas (Veri*factu)
- **RF-19:** EL SISTEMA dispondrá en la ficha del proveedor de un repositorio documental donde se registrará la **Política Contractual de Devoluciones y Garantías** emitida por el proveedor, que actuará como guía operativa de referencia para devoluciones y sustituciones vinculadas por código de material.
- **RF-20:** CUANDO un material instalado en una obra sea consultado por el personal técnico (enlace desde la hoja de trabajo del cliente), EL SISTEMA mostrará la trazabilidad completa del artículo: *Código de referencia del proveedor, Lote de fabricación, Fecha de compra y Condiciones de garantía legal y del fabricante*.
- **RF-21:** CUANDO se tramita una reclamación por material defectuoso desde el módulo de incidencias hacia el proveedor, EL SISTEMA:
  1. Establecerá el estado intermedio del artículo como **"En revisión"** mientras se gestiona con el fabricante o distribuidor.
  2. Generará un documento físico formal de **Devolución / Reparación (RMA)** con el motivo detallado de la avería/defecto para acompañar físicamente a la pieza enviada.
  3. Archivará todos los dictámenes técnicos y documentación aportada por el proveedor o fabricante en la ruta local aislada por tenant: `/docs/<empresa_id>/incidencias`.
  4. SI la garantía es desestimada o denegada por el fabricante (p. ej. por sobretensión o mal uso alegado), EL SISTEMA generará un **Certificado Interno de Merma / Baja Técnica** exigiendo adjuntar el dictamen de rechazo en `/docs/<empresa_id>/incidencias` para justificar fiscal y contablemente la deducibilidad de la pérdida (Veri*factu / RD 1007/2023), fijando a continuación el stock del artículo en **0**.
  5. SI el proveedor sustituye o repara satisfactoriamente la pieza, al registrar en el sistema el nuevo albarán o factura de entrega con el concepto "Sustitución", EL SISTEMA incrementará automáticamente las existencias (**stock +1**).
  6. SI el proveedor resuelve la incidencia mediante compensación económica, EL SISTEMA registrará la correspondiente **Factura Rectificativa / Nota de Abono**, vinculándola a la incidencia y minorando el saldo contable pendiente con el proveedor.
- **RF-22:** EL SISTEMA registrará la incidencia por material defectuoso de forma simultánea en 4 entidades para garantizar trazabilidad en 360 grados: en el *Parte de Obra*, en el *Historial de la Obra del Cliente*, en la *Ficha del Operario responsable* y en el *Expediente del Proveedor* (para contrastar su idoneidad de homologación).

### Bloque 6: Pedidos de Compra, Three-Way Matching Asistido por IA y Recepción en Campo
- **RF-23:** EL SISTEMA dispondrá en la ficha del proveedor de un enlace o botón para acceder al **Historial de Pedidos de Compra Emitidos**, que abrirá un popup modal con buscador y filtros por *Artículo, Referencia y Fecha*, enlazando cada pedido punto a punto con sus albaranes y facturas asociadas.
- **RF-24:** EL SISTEMA permitirá desde la ficha del proveedor redactar una nueva **Propuesta de Pedido de Compra / Reposición**, permitiendo seleccionar múltiples materiales de dicho proveedor con sus referencias precargadas.
- **RF-25:** CUANDO se genera la orden de pedido de compra formal, EL SISTEMA estampará obligatoriamente la **Cláusula Contractual de Precio Firme y Producto Cerrado**, advirtiendo de forma vinculante que cualquier cambio de precio unitario, sobrecoste de transporte o propuesta de producto sustitutorio deberá comunicarse y validarse por escrito antes de la expedición del material.
- **RF-26:** CUANDO se reciben los albaranes y facturas de los proveedores (incluyendo facturas recapitulativas que consolidan múltiples albaranes del mes), EL SISTEMA ejecutará una **Triple Conciliación Automatizada por IA (*Three-Way Matching*)**:
  1. *Fase 1 (Pedido ➔ Albarán):* Comprobará referencias y unidades entregadas; si existe una discrepancia, unidades faltantes o producto alternativo no avisado, EL SISTEMA marcará el albarán en **"Alerta de Descuadre / Sustitución"** y **dejará la entrada física del material en estado aparcado (Cuarentena / Stock no disponible)**, registrando la incidencia y requiriendo interacción y resolución humana antes de ingresar el stock en almacén.
  2. *Fase 2 (Albarán(es) ➔ Factura):* Contrastará precios unitarios, descuentos comerciales pactados e importes totales cruzando uno o múltiples albaranes asociados; si detecta un incremento de precio unitario o una omisión de descuento, marcará la factura en estado **"Discrepancia Económica"** y **bloqueará de forma preventiva el pase a contabilidad para pago** hasta la resolución y autorización expresa de `Boss` o `Secretaria`.
- **RF-27:** CUANDO un pedido sea entregado directamente por el proveedor en la obra o finca del cliente (sin paso previo por almacén central), EL SISTEMA operará bajo la siguiente disciplina:
  1. El operario en campo es el responsable de verificar que la documentación física o albarán concuerda con el material descargado.
  2. Mediante la PWA (`/operari`), el operario capturará la fotografía del albarán y de los bultos en parcela; en zonas sin cobertura, **el registro fotográfico y metadatos se almacenarán de forma cifrada localmente en el dispositivo (IndexedDB, Offline-First)**, sincronizándose automáticamente en segundo plano en cuanto se recupere la conexión de red.
  3. El operario deberá entregar físicamente el albarán en papel en base al finalizar la jornada laboral.
  4. En caso de que el transportista no entregue albarán físico en papel (envío puramente telemático por email), el operario fotografiará la descarga y matrícula del vehículo seleccionando en la PWA *"Albarán remitido por email"*, sin bloquear la jornada de trabajo.

### Bloque 7: Inmutabilidad, Estados de Operatividad y Prohibición de Borrado Físico
- **RF-28:** EL SISTEMA **bloqueará de forma absoluta la eliminación física (`DELETE`)** de cualquier proveedor en la base de datos una vez creado; el registro base y su histórico de compras, garantías e incidencias permanecerán inmutables para garantizar la auditoría legal y operativa.
- **RF-29:** EL SISTEMA dispondrá de un interruptor de estado operativo **"Activo / Inactivo (Inhabilitado)"** en la ficha del proveedor; CUANDO un proveedor sea marcado como *Inactivo*, EL SISTEMA lo excluirá automáticamente de los selectores para nuevos pedidos de compra y de las sugerencias inteligentes de sustitución en urgencias, manteniendo intacto todo su historial histórico.

---

## Requisitos No Funcionales
- **Almacenamiento Local Seguro Multi-Tenant:** Todos los documentos de pólizas de seguro RC, contratos de política de garantía, facturas, albaranes de compra, fotografías de validación en campo y expedientes de incidencias con dictámenes técnicos de merma se almacenan directamente en los discos locales del Mini PC/servidor, organizados en carpetas estrictamente aisladas por inquilino (`/docs/<empresa_id>/...`), con copias de seguridad semanales programadas cada domingo (sin dependencia de AWS S3).
- **Seguridad Multi-Tenant (RLS):** Cada consulta y actualización sobre proveedores, pedidos y pólizas aplica Row Level Security mandatorio mediante `app.current_empresa_id`.
- **Protección de Datos Bancarios (Zero-Trust):** El IBAN del proveedor y los descuentos comerciales confidenciales solo se transmiten en respuestas autenticadas para `Boss` y `Secretaria / RRHH`.
- **Tolerancia Cero a Datos Ficticios (Zero Mock Data):** La UI nunca generará proveedores simulados si la base de datos está vacía.
- **Diseño Camaleón:** La interfaz adaptará colores de marca y tipografías sin incorporar sesgos terminológicos de un sector específico (marca blanca universal).

---

## Fuera de Alcance (Lo que NO hace este módulo)
- No realiza la gestión de inventario físico ni asignación de ubicaciones de estanterías en nave (pertenece a `/gestio/magatzem`).
- No permite la importación masiva de catálogos completos de fabricantes por CSV (solo se incorporan productos comprados mediante albaranes y facturas reales).
- No emite transferencias bancarias directas ni asientos contables oficiales de cierre fiscal (pertenece a `/gestio/comptabilitat`).
- No realiza envíos de correos de pedido a proveedores de forma desatendida o automática (siempre bajo supervisión humana).
- No expone datos bancarios ni márgenes de compra al rol `Ingeniero`.

---

## Criterios de Finalización (Definition of Done)
1. Todos los requisitos funcionales (RF-01 al RF-29) redactados en sintaxis formal EARS y consolidados tras la resolución exhaustiva de la auditoría QA.
2. El listado principal `/gestio/proveidors` se presenta en formato tabular limpio sin bloques de KPIs superiores, con buscador flexible/NIF exacto ordenado por volumen de uso sin exponer cifras económicas al Ingeniero.
3. El alta de proveedores contempla el flujo asistido por IA (OCR de facturas/albaranes) con revisión humana obligatoria (*Human-in-the-Loop*).
4. El NIF/CIF es editable únicamente antes de existir histórico comercial; con albaranes o facturas vinculadas queda fiscalmente inmutable (prohibición de `DELETE` en todos los casos).
5. Se incorpora el estado operativo "Activo / Inactivo (Inhabilitado)" para excluir proveedores descartados de nuevos pedidos y sugerencias.
6. La ficha `/gestio/proveidors/[id]` está dividida en Información Comercial (pública técnica) y Datos Económico-Contables (restringida a Boss y Secretaria).
7. Blindaje en PRL (RD 171/2004): bloqueo de la subcontrata sin seguro y sugerencia de alternativa en regla, con redacción de email en borrador (*Human-in-the-Loop*).
8. Política de anticipos de salvaguarda (máx 40% adelantado, 60% diferido hasta confirmación técnica de buena ejecución por secretaría).
9. Blindaje Three-Way Matching (con soporte de facturas recapitulativas y notas de abono) y material en cuarentena/aparcado ante descuadres.
10. Protocolo de entrega en campo 100% offline-first con soporte para albaranes físicos y telemáticos.
11. Repositorio documental local estructurado por tenant (`/docs/<empresa_id>/incidencias`).
12. Se respeta estrictamente la política de no realizar commits sin solicitud explícita del usuario.
