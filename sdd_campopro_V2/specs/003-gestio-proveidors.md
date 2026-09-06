# Spec 003 — Módulo de Gestión de Proveedores (/gestio/proveidors)

## 1. Contexto y objetivo
El módulo de Gestión de Proveedores es el registro maestro de los distribuidores de suministros técnicos (materiales, herramientas, maquinaria/vehículos) y de las empresas prestadoras de servicios externos y subcontratas (grúas, transportes, instaladores especializados).

Resuelve la necesidad de gestionar con rigor comercial, técnico, legal y fiscal tanto la adquisición de materiales de obra como la contratación de servicios externos. Incorpora la ingesta automatizada de fichas mediante IA/OCR a partir de facturas o albaranes (*Human-in-the-Loop*), la custodia de políticas contractuales de devolución (RMA), la verificación inteligente de pólizas de Responsabilidad Civil (RC) para subcontratas (cumplimiento RD 171/2004), la retención paramétrica por salvaguarda de buena ejecución, y la triple conciliación automatizada (*Three-Way Matching*) con soporte nativo para entregas parciales (*Backorders*). Además, se adapta a las obligaciones tributarias integrando indicadores paramétricos como el Criterio de Caja (RECC) y la Inversión del Sujeto Pasivo (ISP).

Queda expresamente descartada la importación masiva de catálogos teóricos por CSV para evitar obsolescencia de referencias y precios; los productos se incorporan única y exclusivamente a través de albaranes o facturas reales.

---

## 2. Usuarios / actores y Matriz de Acceso (Zero-Trust)
El backend garantiza el aislamiento multi-inquilino (RLS) y la segregación estricta de permisos por rol a nivel de API:

- **Boss (Gerencia / Propietario):** Acceso total e irrestricto. Gestión de pedidos, resolución de discrepancias en precios, configuración manual de retenciones de salvaguarda, acceso a datos bancarios (IBAN), auditoría SIF de cambios de cuenta, y analítica económica completa de compras.
- **Secretaria / RRHH:** Gestión administrativa completa. Altas, gestión de condiciones comerciales, IBAN, tramitación de pedidos, resolución de incidencias logísticas (*Three-Way Matching* / *Backorders*), autorización de pagos y custodia documental.
- **Ingeniero / Supervisor Técnico:** Acceso técnico al directorio, búsqueda ágil, auditoría de capacidades y validación de pólizas (PRL/RC). Dispone de **bloqueo estricto a nivel de API** (`403 Forbidden`) sobre datos bancarios, condiciones de pago, descuentos y cualquier métrica económica agregada.
- **Operari / Capataz (`/operari`):** Acceso restringido a la PWA móvil para el registro fotográfico offline-first de albaranes en campo.

### Matriz de Acceso por Rol
| Entidad / Función | Boss | Secretaria / RRHH | Ingeniero | Operario (`/operari`) |
|---|---|---|---|---|
| **Directorio y Búsqueda (PRV-XXXX)** | Lectura / Escritura | Lectura / Escritura | Solo Lectura | Sin acceso |
| **Datos Fiscales, RECC e ISP** | Lectura / Escritura | Lectura / Escritura | Solo Lectura | Sin acceso |
| **Condiciones Pago e IBAN** | Lectura / Escritura | Lectura / Escritura | **Bloqueo Total (403)** | Sin acceso |
| **Control de Pólizas (PRL/RC)** | Lectura / Escritura | Lectura / Escritura | Lectura / Validación | Sin acceso |
| **Pedidos, RMA y Entregas Parciales** | Lectura / Escritura | Lectura / Escritura | Lectura / Escritura | Sin acceso |
| **Captura de Albaranes en Campo** | Sin acceso | Sin acceso | Sin acceso | **Escritura (PWA)** |
| **Métricas Contables de Compra** | Lectura completa | Lectura completa | **Bloqueo Total (403)** | Sin acceso |

---

## 3. Historias de usuario
- **H1:** Como *Ingeniero*, quiero consultar el listado ordenado por volumen de uso y buscar por NIF o Razón Social sin que la interfaz me exponga importes monetarios.
- **H2:** Como *Secretaria*, quiero subir un PDF para que la IA extraiga los datos fiscales automáticamente, alertándome de cualquier discrepancia de IBAN para prevenir fraude BEC y dejando un registro de auditoría (*Human-in-the-Loop*).
- **H3:** Como *Ingeniero*, quiero que la IA bloquee taxativamente la asignación de una subcontrata si su póliza RC está caducada, sugiriéndome otra homologada y redactando un borrador de correo de reclamación.
- **H4:** Como *Operario*, quiero registrar la descarga del material con mi móvil sin cobertura (offline-first), para certificar la recepción física antes de que administración pague la factura.
- **H5:** Como *Secretaria*, quiero que el *Three-Way Matching* gestione inteligentemente las entregas parciales permitiendo la entrada del material recibido y generando un Backorder para el resto, bloqueando solo si hay sobrecostes no pactados o materiales erróneos.
- **H6:** Como *Ingeniero*, quiero tramitar una merma fiscal justificada generando un volante de RMA, distinguiendo si la pieza estaba en almacén o ya instalada en cliente para no descuadrar el inventario físico, custodiando el dictamen en `/docs`.

---

## 4. Requisitos Funcionales (Criterios de Aceptación en EARS)

### Bloque 1: Directorio Principal (`/gestio/proveidors`) y Estado "Día 0"
- **RF-01 (Ubiquitous):** EL SISTEMA presentará en `/gestio/proveidors` un listado tabular limpio **con paginación del lado del servidor (*Server-Side Pagination*)**, mostrando el código visual `PRV-XXXX`, Razón Social, Persona de contacto y Teléfono.
- **RF-02 (Ubiquitous):** CUANDO el usuario filtre el listado, EL SISTEMA aplicará búsqueda reactiva sobre `PRV-XXXX`, Nombre, Razón Social, NIF y Municipio, ordenando los resultados por volumen de compras acumulado; ocultando las cifras monetarias si el rol es `Ingeniero`.
- **RF-03 (State-driven):** SI el sistema está en "Día 0", ENTONCES mostrará una UI vacía sin datos simulados (*Zero Mock Data*).
- **RF-04 (Event-driven):** CUANDO se haga clic en un proveedor, EL SISTEMA abrirá la ficha detallada (`/gestio/proveidors/[id]`).

### Bloque 2: Alta, OCR, Campos Fiscales e Inmutabilidad
- **RF-05 (Event-driven):** CUANDO se proceda al alta manual, EL SISTEMA generará el código secuencial `PRV-XXXX` y solicitará: Datos Fiscales, Contacto, Capacidades, e indicadores booleanos tributarios (`es_recc` para Criterio de Caja, `aplica_isp_defecte` para Inversión del Sujeto Pasivo).
- **RF-06 (Unwanted behavior):** CUANDO se guarde el registro, EL SISTEMA validará la unicidad estricta del NIF/CIF por tenant, bloqueando y alertando ante duplicados.
- **RF-07 (State-driven):** MIENTRAS el proveedor tenga histórico comercial (albaranes/facturas), EL SISTEMA bloqueará permanentemente la edición de su NIF/CIF para garantizar la inmutabilidad tributaria.
- **RF-08 (Event-driven):** CUANDO se utilice "Alta por IA", el motor OCR local extraerá Razón Social, NIF, Dirección e IBAN.
- **RF-09 (Ubiquitous):** EL SISTEMA desplegará el formulario marcando los campos de baja confianza para validación humana obligatoria (*Human-in-the-Loop*).
- **RF-09.1 (Event-driven):** SI la IA detecta un cambio de IBAN en una factura respecto al registrado, EL SISTEMA emitirá una alerta crítica (Prevención Fraude BEC) requiriendo autorización de `Boss`. Tras su aprobación, generará automáticamente un evento de trazabilidad en el Registro SIF de la Spec 007 documentando la cuenta anterior y la nueva.
- **RF-10 (Ubiquitous):** EL SISTEMA incorporará artículos al catálogo única y exclusivamente a través de la ingesta de albaranes o facturas reales, bloqueando importaciones CSV de catálogos teóricos.

### Bloque 3: Subcontratas, Bloqueo Legal (RD 171/2004) y Salvaguarda
- **RF-11 (Ubiquitous):** EL SISTEMA estructurará la ficha en: *Información Operativa* (pública) y *Datos Económico-Contables* (confidencial).
- **RF-12 (Ubiquitous):** La información operativa incluirá capacidades (Materiales, Maquinaria, Subcontratas), indicadores `es_recc` / `aplica_isp_defecte`, y datos de contacto.
- **RF-13 (State-driven):** SI la capacidad es *Subcontrata*, EL SISTEMA exigirá la custodia de la Póliza RC y certificados CAE/PRL, monitorizando sus fechas de caducidad.
- **RF-14 (Event-driven):** CUANDO se intente asignar una subcontrata con póliza RC caducada a una orden, EL SISTEMA bloqueará taxativamente su asignación y generará un borrador de correo de requerimiento.
- **RF-15 (Event-driven):** SI se bloquea la subcontrata, EL SISTEMA sugerirá automáticamente alternativas homologadas en regla.
- **RF-16 (Ubiquitous):** EN las condiciones comerciales de subcontratas, EL SISTEMA aplicará por defecto una retención de salvaguarda del 60%, bloqueando la liquidación contable del importe restante hasta la confirmación de buena ejecución. **Este porcentaje de retención será editable y parametrizable de forma unitaria exclusivamente por el rol `Boss`** (0% a 100%).

### Bloque 4: Ficha Confidencial (Zero-Trust)
- **RF-17 (State-driven):** MIENTRAS el rol sea `Boss` o `Secretaria`, EL SISTEMA mostrará IBAN, condiciones de pago, descuentos comerciales y KPIs de compra (stock estancado, volumen).
- **RF-18 (Ubiquitous):** SI el rol es `Ingeniero`, EL SISTEMA consumirá un endpoint que purgará y ocultará todo el bloque económico-contable (`403 Forbidden` sobre el payload directo).

### Bloque 5: Garantías, Devoluciones y Mermas (Veri*factu)
- **RF-19 (Ubiquitous):** EL SISTEMA custodiará en `/docs/<empresa_id>` la Política de Devoluciones (RMA).
- **RF-20 (Event-driven):** CUANDO se consulte un material en la obra, EL SISTEMA trazará el Lote, Fecha y Garantía vinculada al proveedor.
- **RF-21 (Event-driven):** CUANDO se tramite una pieza defectuosa, EL SISTEMA generará el volante RMA y asignará el estado "En revisión".
- **RF-21.4 (Event-driven):** SI la garantía es denegada, EL SISTEMA generará el Certificado Interno de Merma (justificación Veri*factu). Per a artículos en inventario, minorará el stock exacto (`Stock = Stock - N`); para artículos ya instalados en obras, el stock de almacén se mantendrá intacto y la pérdida se imputará financieramente contra la rentabilidad del Parte de Obra original para prevenir stocks negativos.
- **RF-22 (Ubiquitous):** EL SISTEMA trazará la incidencia en 360º (Ficha Proveedor, Cliente, Operario y Parte de Obra).

### Bloque 6: Three-Way Matching y Recepción Offline PWA
- **RF-23 (Ubiquitous):** EL SISTEMA proveerá un historial de Pedidos con trazabilidad punto a punto hacia albaranes y facturas.
- **RF-24 (Event-driven):** EL SISTEMA permitirá redactar Pedidos de Reposición cruzando referencias internas.
- **RF-25 (Ubiquitous):** EL SISTEMA estampará obligatoriamente la Cláusula de Precio Ferme en todos los pedidos generados.
- **RF-26 (Event-driven):** CUANDO se reciban documentos, EL SISTEMA ejecutará el *Three-Way Matching*: Fase 1 (Pedido ➔ Albarán) validará referencias. Fase 2 (Albarán ➔ Factura) bloqueará el pase a contabilidad si el precio aumenta.
- **RF-26.1 (Ubiquitous):** EL SISTEMA aplicará un margen paramétrico de tolerancia del $\pm2\%$ para diferencias de medición exclusivamente en familias de productos "A Granel" (áridos, cables, tuberías al corte).
- **RF-26.2 (State-driven):** En la Fase 1 del *Three-Way Matching*, si se entrega una cantidad inferior a la demandada (sin productos erróneos), EL SISTEMA ingresará el material recibido al almacén de forma inmediata, conmutando el estado del pedido a `ENTREGA_PARCIAL` y generando un *Backorder* automático por las unidades pendientes, sin bloquear el flujo logístico a cuarentena.
- **RF-27 (Ubiquitous):** CUANDO el operario reciba el material en campo, utilizará la PWA (`/operari`) para fotografiar el albarán y los bultos; en ausencia de red, los metadatos y fotos se cifrarán en `IndexedDB` (Offline-First) y se sincronizarán en segundo plano al recuperar conexión.

### Bloque 7: Inmutabilidad y RGPD
- **RF-28 (Unwanted behavior):** EL SISTEMA bloqueará de forma absoluta el `DELETE` físico de proveedores con historial comercial o técnico.
- **RF-28.1 (Event-driven):** SI un proveedor autónomo exige el Derecho de Supresión RGPD, EL SISTEMA ejecutará el Bloqueo Legal (Art. 32 LOPDGDD), anonimizando contactos pero manteniendo inmutable el NIF e IBAN contable asociado a facturas del período de prescripción.
- **RF-29 (State-driven):** CUANDO un proveedor sea inhabilitado (`actiu = FALSE`), EL SISTEMA lo excluirá de los selectores operativos de la UI.

---

## 5. Casos Límite y Resiliencia (EDGE-01 a EDGE-22)

| Código | Tipo EARS | Módulo | Vector de Falla / Escenario Límite | Comportamiento del Sistema |
|---|---|---|---|---|
| **EDGE-01** | *Event-driven* | OCR | IBAN extraído difiere del IBAN histórico registrado en la base de datos (Fraude BEC). | Bloquea actualización automática; levanta alerta roja que requiere autorización explícita de `Boss`. |
| **EDGE-02** | *Unwanted* | Seguridad | Usuario `Ingeniero` intenta forzar petición a `/proveidors/{id}/financiero`. | El backend intercepta y retorna `403 Forbidden`, registrando el intento en el Audit Log. |
| **EDGE-03** | *Event-driven* | PRL | Caducidad de la póliza RC de una subcontrata detectada en mitad de una obra en ejecución. | Cronjob diario detecta la caducidad, lanza alerta crítica a oficina técnica y pausa pagos pendientes. |
| **EDGE-04** | *Unwanted* | Stock | Se intenta tramitar un Certificado de Merma de almacén por una cantidad `N` superior al stock actual. | Bloquea la merma matemática para evitar stock negativo, requiriendo regularización de inventario previa. |
| **EDGE-05** | *State-driven* | 3-Way Match | Administración intenta validar la Fase 2 (Factura) antes de recibir confirmación del albarán físico. | Mantiene el *Matching* en estado "Pendiente Sincronización Campo" hasta que la PWA vacíe su `IndexedDB`. |
| **EDGE-06** | *Event-driven* | RGPD | Petición formal de borrado de un proveedor persona física (Autónomo) con facturas vigentes. | Ejecuta `BLOQUEO_LEGAL_RGPD`: elimina teléfonos/emails pero preserva NIF y apuntes contables inmutables. |
| **EDGE-07** | *Event-driven* | Compras | Factura recapitulativa difiere del sumatorio de albaranes parciales validados. | Detiene el pase a pagos, aísla la diferencia y requiere autorización administrativa. |
| **EDGE-08** | *Unwanted* | Fiscal | Introducción de NIF/CIF o NIF-IVA intracomunitario con formato erróneo. | Bloquea inserción en formulario o CSV mediante validación algorítmica y VIES de la UE. |
| **EDGE-09** | *Unwanted* | Concurrencia | Dos usuarios editan simultáneamente las condiciones de pago del mismo proveedor. | Aplica control optimista (`version_id`); rechaza la segunda petición forzando actualización. |
| **EDGE-10** | *Unwanted* | CSV | Importación de listado masivo con un NIF duplicado repetido en múltiples filas del mismo fichero. | Ingresa la primera fila válida y deposita el resto en la tabla visual de errores del proceso de ingesta. |
| **EDGE-11** | *Unwanted* | CSV | Archivo de importación delimitado con caracteres inconsistentes o codificación exótica. | *Sniffer* local intercepta la anomalía, autodetecta UTF-8 o rechaza el bloque antes de escritura. |
| **EDGE-12** | *Unwanted* | Integridad | Intento de modificación de CIF a un proveedor tras haberle registrado una factura en firme. | Bloqueo inmutable de base de datos para preservar la trazabilidad fiscal. |
| **EDGE-13** | *Unwanted* | Catálogo | Intento de cargar un CSV con miles de referencias y precios de proveedor al vacío. | Sistema rechaza la ingesta directa; exige un albarán/pedido asociado para popular el catálogo maestro. |
| **EDGE-14** | *Event-driven* | 3-Way Match | Entrega de grava (A Granel) difiere en un 1,5% respecto al volumen del pedido. | El algoritmo acepta el descuadre al estar dentro de la tolerancia paramétrica ($\pm2\%$), liquidando el pago. |
| **EDGE-15** | *Unwanted* | Pagos | Intento de emitir pago del 100% de una subcontrata (salvaguarda) sin la firma de cierre de obra. | Tesorería bloquea la remesa de la retención hasta disponer del evento de confirmación técnica. |
| **EDGE-16** | *State-driven* | PWA | Pérdida de cobertura de red (Offline) en el instante de hacer la fotografía del albarán en parcela. | Los metadatos y la imagen se cifran en local (Service Worker) y se reintentan automáticamente al reconectar. |
| **EDGE-17** | *Unwanted* | DB | Solicitud HTTP directa enviando un `DELETE` sobre el ID de un proveedor histórico. | PostgreSQL rechaza la orden emitiendo error `RESTRICT` por violaciones de clave foránea. |
| **EDGE-18** | *Event-driven* | Estados | Intento de vincular un proveedor inhabilitado (`actiu=FALSE`) a una nueva orden de compra. | Interfaz oculta al proveedor de los selectores y la API rechaza el enlace emitiendo error 400. |
| **EDGE-19** | *Unwanted* | Merma Obra | Intento de aplicar fórmula de merma de almacén a una pieza defectuosa ya instalada en el cliente. | El sistema bloquea la deducción de inventario, redirigiendo la merma fiscal exclusivamente al costo de la obra originaria. |
| **EDGE-20** | *Event-driven* | Entregas | Proveedor entrega 50 unidades de una orden de 100 (entrega parcial de material exacto). | Sistema aprueba el albarán de las 50 unidades sin aislar en cuarentena y genera *Backorder* para las restantes. |
| **EDGE-21** | *Event-driven* | Auditoría | El `Boss` autoriza el cambio de IBAN modificado de un proveedor histórico. | Sistema ejecuta la actualización y lanza asiento inalterable al SIF guardando IBAN antiguo, nuevo y timestamp. |
| **EDGE-22** | *Unwanted* | Facturación | Subcontrata envía factura exigiendo el 100% sin deducir el importe de retención de salvaguarda. | Módulo contable bloquea el pago del excedent y notifica requerimiento de factura rectificativa al proveedor. |

---

## 6. Requisitos No Funcionales (RNF)
- **Almacenamiento Local Soberano:** Documentos (Pólizas RC, Garantías, Facturas y Mermas) se almacenan en los discos locales y servidor Hetzner Alemania bajo partición tenant (`/docs/<empresa_id>/...`), con backup dominical (Cero AWS S3).
- **Seguridad Multi-Tenant (RLS):** Toda consulta a tablas del módulo se aísla criptográficamente mediante la directiva de PostgreSQL `FORCE ROW LEVEL SECURITY` e inyección de contexto.
- **Protección Zero-Trust:** El IBAN y condiciones de crédito se sirven exclusivamente a `Boss` y `Secretaria`, cifrados en reposo (AES-256-GCM).
- **Tolerancia Cero a Mock Data:** Ausencia total de registros falsos (Día 0 Real).
- **UX Camaleónica:** Adaptabilidad total a variables CSS de marca sin sesgo de sector.

---

## 7. Fuera de Alcance
- Gestión de inventario físico y picking en estanterías (Spec 004).
- Importación masiva de catálogos teóricos CSV no respaldados por albarán.
- Ejecución oficial de transferencias SEPA / asientos de cierre fiscal (Spec 007).
- Automatización de envíos de email sin confirmación humana previa (*Human-in-the-Loop*).

---

## 8. Matriz de Trazabilidad 1:1 de la Definition of Done (DoD)

Para certificar el cierre de la Spec 003, la suite de pruebas automatizadas (*Zero-Mock Data*, PostgreSQL real con RLS) deberá cumplir de forma unívoca la siguiente tabla (31 RFs x 22 EDGEs):

| Código RF | Objetivo Técnico Verificable | Caso Límite Vinculado | Assert / Criterio de Aprobación DoD |
|---|---|---|---|
| **RF-01 / RF-02** | Directorio paginado, código visual `PRV-XXXX` y búsqueda reactiva. | **EDGE-02** | *Server-Side Pagination* activa. Ingeniero no recibe JSON con facturación agregada. |
| **RF-03 / RF-04** | Día 0 real y apertura de ficha de proveedor. | - | UI en blanco real, renderizado `/proveidors/[id]` libre de mocks. |
| **RF-05 / RF-06** | Alta, validación algorítmica de NIF y generación de `PRV`. | **EDGE-08 / EDGE-10** | Inserción de duplicados en BD rechazada; DNI inválido lanza excepción `400 Bad Request`. |
| **RF-07** | Inmutabilidad fiscal del NIF y concurrencia optimista. | **EDGE-09 / EDGE-12** | Edición de NIF bloqueada con histórico; control optimista (`version_id`) ante colisiones concurrentes. |
| **RF-08 / RF-09** | Extracción IA/OCR y confirmación humana (*HITL*). | **EDGE-11** | Detección inteligente; despliegue de UI modal de confirmación antes del `INSERT`. |
| **RF-09.1** | Prevención de fraude BEC (Alteración IBAN por OCR) y SIF. | **EDGE-01 / EDGE-21** | Discrepancia bloquea actualización, exige firma del `Boss` y emite evento al SIF. |
| **RF-10** | Poblar catálogo únicamente mediante documentos reales. | **EDGE-13** | Intento de inserción CSV masiva de productos huérfanos rechazada (`405`). |
| **RF-11 / RF-12** | Estructura bidivisional e indicadores tributarios (RECC/ISP). | - | Inserción correcta de `es_recc` y `aplica_isp_defecte`. |
| **RF-13 / RF-14** | Bloqueo taxativo de asignación sin seguro RC en regla. | **EDGE-03** | Subcontrata con póliza caducada lanza excepción en la asignación de tarea. |
| **RF-15** | Sugerencia inteligente de proveedor alternativo en regla. | - | Retorno de lista de subcontratas con RC válido para el mismo sector. |
| **RF-16** | Retención paramétrica por salvaguarda de ejecución. | **EDGE-15 / EDGE-22** | Pagos bloqueados por retención excedente hasta firma de certificación técnica. |
| **RF-17 / RF-18** | Confidencialidad del bloque Económico-Contable (Zero-Trust). | **EDGE-02** | `GET /proveidors/{id}/financiero` retorna `403 Forbidden` si el rol es Ingeniero. |
| **RF-19 / RF-20** | Trazabilidad de Garantías/RMA desde el material instalado. | - | Historial del artículo resuelve el proveedor y lote de fabricación correctos. |
| **RF-21 / RF-21.4** | Gestión RMA, emisión de Certificado de Merma y Bifurcación. | **EDGE-04 / EDGE-19** | Certificado exige justificante `/docs/`; la merma no genera stock negativo (diferencia instalación vs almacén). |
| **RF-22** | Trazabilidad en 360 grados de incidencias operativas. | - | Reflejo interrelacionado en tablas de Obra, Proveedor, Operario y Parte. |
| **RF-23 / RF-24** | Historial de compras y redacción de pedidos de reposición. | - | Popup modal muestra el linaje completo: Pedido ➔ Albarán ➔ Factura. |
| **RF-25** | Cláusula de precio firme inmutable en pedidos. | - | PDF y metadatos del pedido incluyen la constante de inmutabilidad de condiciones. |
| **RF-26 / RF-26.1** | *Three-Way Matching* con tolerancia de $\pm2\%$ en granel. | **EDGE-07 / EDGE-14** | Factura recapitulativa discrepante genera alerta; variaciones < 2% en áridos aprueban. |
| **RF-26.2** | Gestión logística de Entregas Parciales (*Backorders*). | **EDGE-20** | Recepción de unidades menores a lo pedido genera *Backorder* automático sin cuarentena. |
| **RF-27** | Recepción en campo offline-first mediante PWA y validación. | **EDGE-05 / EDGE-16** | Fase de Facturación queda en "Pendiente de Campo" hasta vaciado de `IndexedDB`. |
| **RF-28 / RF-28.1** | Prohibición de borrado físico (`DELETE`) y Bloqueo RGPD. | **EDGE-06 / EDGE-17** | `DELETE` directo retorna `RESTRICT`; Autónomos reciben anonimización selectiva. |
| **RF-29** | Estado inactivo de proveedor (`actiu = FALSE`). | **EDGE-18** | API rechaza (`400`) vincular proveedor inhabilitado a nuevas órdenes de compra. |