# Spec 007 — Mòdul de Comptabilitat, Facturació i Tresoreria (/gestio/comptabilitat)

## Contexto y objetivo
El módulo de Comptabilitat, Facturació i Tresoreria (`/gestio/comptabilitat`) es el **Hub Operativo Financiero, Motor de Facturación Legal Veri*factu y Cockpit Previsional de Tesorería** de CampoPro Suite. Conecta directamente la actividad técnica ejecutada en campo (albaranes cerrados en la Torre de Control de la Spec 001, consumos de almacén de la Spec 004 y costes operativos de flota de la Spec 006) con la administración y dirección de la empresa.

Bajo la decisión estratégica de gobernanza (Opción B), este módulo **no pretende ser un ERP contable cerrado de liquidación mercantil oficial**, sino una plataforma ágil de gestión empresarial en tiempo real que:
1. Gobierna el cicle de facturación legal vinculante a clientes bajo la normativa **Veri*factu (RD 1007/2023)**, con encadenamiento criptográfico SHA-256 y códigos QR.
2. Centraliza la emisión de **Facturas Proforma / Borradores editables**, la facturación individual o **agrupada periódica de albaranes de obra**, la compensación legal de **facturas de anticipo**, y la emisión formal de **Facturas Rectificativas** (liberando los albaranes originales para su corrección y refacturación).
3. Monitoriza en tiempo real el **Cuenta de Resultados de Explotación (P&L)** desagregando ingresos, consumos reales de stock (PMP), costes directos de flota/maquinaria, nóminas y tickets de operarios.
4. Gestiona las **liquidaciones mensuales de nóminas** mediante el ingreso ágil del resumen de la gestoría laboral externa, programando automáticamente los calendarios de pago (Líquido a fin de mes, TGSS/TC1 a mes vencido y Modelo 111 de la AEAT).
5. Centraliza el circuito de **tickets de gasto de trabajadores y cuadrillas** (dietas, peajes, parkings y compras menores en ruta), distinguiendo pagos con **tarjeta de empresa** frente a pagos en **efectivo de bolsillo del operario** (que generan deuda de reembolso de la empresa), con asignación automática de asientos propuesta por **Copilot IA** mediante OCR y validación administrativa humana obligatoria.
6. Ejecuta la **conciliación bancaria mediante importación estándar Norma 43 (CSB 43 / extracto bancario)**, cruzando cobros de clientes, pagos a proveedores y liquidaciones de tarjetas asistidas por Copilot IA.
7. Modela la **proyección de flujo de caja (Cash Flow Forecast)** a 30, 60, 90 días y 12 meses vista bajo escenarios configurable (*Base, Pesimista y Optimista*).
8. Genera el **Paquete Oficial de Enlace con la Gestoría Externa**: exportación del Libro Diario estructurado bajo el Plan General Contable (PGC Pymes / RD 1515/2007) compatible universalmente con software de asesoría (A3, Sage, Contasol), libros oficiales de Facturas Emitidas, Facturas Recibidas y archivo ZIP con las evidencias y facturas en PDF.
9. Cumple estrictamente con el principio de **Tolerancia Cero a Datos Ficticios (*Zero Mock Data*)**, con Estado Día 0 real sustentado en base de datos vacía, almacenamiento seguro en discos locales y servidor Hetzner en Alemania (cero AWS S3), aislamiento multi-inquilino (RLS) y segregación de accesos *Zero-Trust*.

---

## Usuarios / actores y Matriz de Acceso (Zero-Trust)
El backend garantiza el aislamiento multi-inquilino mediante Row Level Security (RLS) mandatorio (`empresa_id`) y la segregación rigurosa de roles:

- **Boss (Gerencia / Propietario):** Acceso total e irrestricto a todas las funciones del módulo: cuadros de mando macroeconómicos, márgenes y rentabilidad neta por cliente/obra, aprobación de órdenes de pago bancarias, validación de facturas rectificativas, consulta de previsiones de tesorería y saldos disponibles, y autorización final para la exportación de remesas contables a la gestoría externa.
- **Secretaria / RRHH:** Operador principal del módulo. Confección y edición de borradores/proformas, emisión y sellado de facturas definitivas Veri*factu, tramitación de facturas de anticipo y compensación, registro de facturas recibidas de compras/proveedores, ingreso mensual del resumen de nóminas de la gestoría laboral, revisión administrativa y validación de tickets de gastos de cuadrillas, importación de extractos Norma 43 con conciliación bancaria, y generación y descarga del paquete mensual/trimestral de exportación PGC para la asesoría externa.
- **Ingeniero / Supervisor Técnico:** **BLOQUEO TOTAL A NIVEL DE API SOBRE `/gestio/comptabilitat`**. Los endpoints de este módulo rechazan cualquier solicitud emitida con rol `Ingeniero` (devolviendo `403 Forbidden`). El personal técnico no accede al cuadro financiero global, ni a márgenes de beneficio de empresa, ni a cuentas bancarias, limitándose su visibilidad a la consulta de facturas unitarias individuales de sus clientes desde el meta-buscador de la Torre de Control (Spec 001).
- **Operario de Cuadrilla / Capataz (`/operari`):** No accede a la web de contabilidad. Desde la PWA móvil de campo, captura fotográficamente los tickets de gasto en ruta (indicando concepto, importe y modalidad de pago: *Tarjeta de crédito corporativa* o *Efectivo propio / Reembolso*), alimentando la bandeja de revisión administrativa de contabilidad.
- **Cliente Final (Canal Multicanal):** Receptor de facturas proforma y facturas definitivas Veri*factu en PDF con código QR estruturado, expedidas por Email o a través del canal interactivo de mensajería.

---

## Historias de usuario
- **H1:** Como *Secretaria*, quiero consultar los albaranes de obra cerrados por los ingenieros en campo para generar una factura agrupada mensual de un cliente, comprobando los conceptos y aplicando el descuento pactado antes de la emisión oficial.
- **H2:** Como *Secretaria*, quiero emitir una factura de anticipo formal (Veri*factu) tras la aceptación de un presupuesto de obra, y que al emitir la factura final al cierre de la tarea, el sistema deduzca automáticamente la base imponible del anticipo referenciando la factura anterior para liquidar correctamente el IVA.
- **H3:** Como *Secretaria o Boss*, quiero preparar una factura en modo "Borrador / Proforma" para revisarla y compartirla previamente con el cliente, asegurando que solo al pulsar el botón explícito "Emitir Factura Veri*factu" se asigne el número fiscal legal inalterable, el hash SHA-256 encadenado y el código QR oficial.
- **H4:** Como *Secretaria*, cuando un cliente reclame un error en una factura ya emitida bajo Veri*factu, quiero generar una Factura Rectificativa correlativa (`R-2026-XXXX`) que anule la factura errónea y libere automáticamente los albaranes de obra asociados a estado "Pendiente de Facturar" para poder ser corregidos y refacturados.
- **H5:** Como *Secretaria*, quiero registrar el resumen mensual de nóminas enviado por la gestoría laboral introduciendo los 5 datos clave (Bruto, SS Empresa, SS Trabajador, IRPF y Líquido) para que el sistema genere el asiento cuadrado y programe automáticamente los vencimientos de tesorería (nóminas a fin de mes, Modelo 111 y Seguretat Social a mes vencido).
- **H6:** Como *Secretaria*, quiero revisar la bandeja de tickets de gasto capturados por los operarios desde la PWA, ver la propuesta de asiento contable y deducción tributaria preparada automáticamente por Copilot IA, y confirmar si se pagó con tarjeta de empresa o si debe reembolsarse en efectivo al trabajador.
- **H7:** Como *Secretaria o Boss*, quiero subir el archivo bancario Norma 43 de la empresa para que Copilot cruce los movimientos de cobros y pagos con las facturas y tickets pendientes, permitiéndome conciliar la cuenta bancaria a 1 clic.
- **H8:** Como *Boss*, quiero ver en tiempo real el Cuenta de Resultados (P&L) de la empresa y la proyección de tesorería a 30, 60 y 90 días vista bajo escenarios base, pesimista y optimista para anticipar tensiones de liquidez antes de que sucedan.
- **H9:** Como *Secretaria*, quiero pulsar un botón para descargar el "Paquete de Cierre para Gestoría" en formato CSV/Excel estructurado según el PGC (asientos de ventas, compras, nóminas y tickets) junto con el archivo ZIP de facturas en PDF para enviárselo a la asesoría externa con cero trabajo manual.
- **H10:** Como *Boss*, quiero tener la certeza de que el sistema respeta el principio de Cero Datos Ficticios, mostrando en estado "Día 0" contadores a cero y estados vacíos reales sin cifras simuladas de facturación o beneficios.

---

## Requisitos Funcionales (Criterios de Aceptación en EARS)

### Bloque 1: Entorno de Gestión, Filtros Globales y Estado "Día 0"
- **RF-01:** EL SISTEMA presentará en la cabecera de `/gestio/comptabilitat` una barra de control con un selector temporal global configurable (*Mes actual, Trimestre [T1, T2, T3, T4], Año Fiscal en curso, Año Fiscal anterior* o rango personalizado entre fechas), actualizando reactivamente todos los módulos analíticos de la pantalla.
- **RF-02:** CUANDO el usuario conmuta entre el *Criterio de Devengo (Meritat)* (basado en la fecha oficial de factura/albarán) y el *Criterio de Caja* (basado en la fecha efectiva de cobro o pago bancario), EL SISTEMA recalculará instantáneamente los ingresos, gastos y márgenes del panel sin recarga de página.
- **RF-03:** EL SISTEMA permitirá filtrar la información financiera transversalmente por **Centro de Coste / Obra / Proyecto**, aislando ingresos, consumos de almacén (Spec 004), costes de vehículos imputados (Spec 006) y horas de mano de obra asociadas a dicha unidad técnica.
- **RF-04:** SI el sistema se encuentra en estado "Día 0" (sin facturas emitidas ni apuntes bancarios registrados), ENTONCES EL SISTEMA mostrará los paneles y gráficas con valores numéricos a 0,00 € y estados vacíos reales (*"Sin facturación registrada en este ejercicio"*, *"Sin movimientos bancarios pendientes"*), prohibiendo estrictamente la inyección de cifras simuladas o demostrativas (*Zero Mock Data*).
- **RF-05:** EL SISTEMA bloqueará terminantemente el acceso a `/gestio/comptabilitat` a usuarios con rol `Ingeniero` u `Operario`, respondiendo con código HTTP `403 Forbidden` a nivel de backend y omitiendo el enlace en la barra de navegación web.

---

### Bloque 2: Cierre y Facturación de Albaranes de Obra, Agrupación y Anticipos
- **RF-06:** CUANDO un albarán de finalización de obra es aprobado humanamente por el supervisor técnico en la Torre de Control (RF-40 Spec 001), EL SISTEMA incorporará de inmediato dicho documento a la bandeja de **"Albaranes Pendientes de Facturar"** en `/gestio/comptabilitat`.
- **RF-07:** EL SISTEMA permitirá la **Facturación Individual (1 albarán = 1 factura)** o la **Facturación Agrupada Periódica**: la Secretaria o Boss podrá seleccionar múltiples albaranes aprobados pertenecientes a un mismo cliente dentro de un periodo y consolidarlos en una única factura legal estructurada por capítulos u obras.
- **RF-08:** CADA línea de factura procedente de albarán conservará la trazabilidad del código de orden de trabajo de origen, desglosando mano de obra (categorías, horas ordinarias y extras tarificadas según `/gestio/configuracio/tarifes`), maquinaria (horas tarificadas), materiales consumidos (Spec 004) y suplementos aprobados por el cliente.
- **RF-09:** CUANDO se apruebe formalmente un presupuesto de obra que estipule anticipo económico (mínimo 45% o 100% de materiales según la Constitución), EL SISTEMA generará una **Factura de Anticipo** vinculada al expediente del cliente con su correspondiente número fiscal Veri*factu e IVA liquidado en la fecha de cobro.
- **RF-10:** CUANDO se proceda a la facturación final de una obra que haya percibido anticipos previos, EL SISTEMA aplicará obligatoriamente la deducción de anticipo en la base imponible (**Método 2.1 de minoración de base**):
  $$\text{Base Imponible Neta Final} = \text{Base Imponible Total de Obra} - \text{Base Imponible del Anticipo Previo}$$
- **RF-11:** LA factura final de liquidación de obra incorporará de forma explícita y preceptiva la referencia legal a la factura de anticipo compensada: *"Deducción por anticipo según Factura Nº [ID_Factura_Anticipo] de fecha [Fecha_Anticipo]"*, ajustando las cuotas de IVA resultantes de forma legal.

---

### Bloque 3: Inalterabilidad Veri*factu (RD 1007/2023), Borradores y Rectificativas
- **RF-12:** ANTES de consolidar legalmente una factura, EL SISTEMA permitirá crear y mantener el documento en estado **"Borrador / Factura Proforma"**:
  1. Durante el estado borrador, la Secretaria o Boss podrá modificar libremente cantidades, precios de venta, descripciones de conceptos, formas de cobro o aplicar descuentos comerciales.
  2. La factura proforma no devenga impuestos oficiales, no consume número fiscal de serie y mostrará visiblemente la marca de agua *"PROFORMA / ESBORRANY — SENSE VALIDESA FISCAL"*.
- **RF-13:** CUANDO el usuario hace clic sobre la acción explícita **"Emitir Factura Veri*factu"**, EL SISTEMA ejecutará las siguientes operaciones en una transacción atómica inmutable:
  1. Asignará el siguiente número correlativo e improrrogable de la serie fiscal oficial (p. ej. `F-2026-0042`).
  2. Generará la huella digital criptográfica encadenada mediante **Hash SHA-256**, incorporando el hash del registro de factura inmediatamente anterior, NIF del emisor, número de serie, fecha de expedición e importe total.
  3. Generará el **código QR bidimensional oficial** según las especificaciones técnicas de la Agencia Tributaria (RD 1007/2023) y la URL oficial de cotejo.
  4. Sellará el documento en base de datos en estado `Emitida / Bloqueada`, bloqueando definitivamente cualquier edición de texto, importes o borrado de filas.
- **RF-14:** QUEDA TERMINANTEMENTE PROHIBIDO modificar, editar o eliminar registros de facturas que hayan sido consolidadas bajo la normativa Veri*factu.
- **RF-15:** SI se constata un error material, disconformidad técnica o devolución sobre una factura emitida en firme, ENTONCES EL SISTEMA exigirá la generación obligatoria de una **Factura Rectificativa**:
  1. Consumirá una serie correlativa fiscal independiente (p. ej. `R-2026-0005`).
  2. Referenciará preceptivamente la factura original rectificada, la causa formal de rectificación y el desglose de importes rectificados (por sustitución o por diferencias).
  3. Estará sujeta al encadenamiento hash SHA-256 y código QR de Veri*factu.
- **RF-16:** CUANDO se emita una Factura Rectificativa por anulación total de una factura previa, EL SISTEMA **liberará automáticamente los albaranes de obra originales vinculados, retornándolos al estado "Pendiente de Facturar"**, permitiendo que la oficina técnica o administración corrija las unidades o conceptos necesarios y proceda a su posterior refacturación sin duplicidades ni pérdida de histórico.
- **RF-17:** EL SISTEMA generará el documento oficial de la factura en formato PDF de forma asíncrona (Celery + ReportLab) en menos de 2 segundos, custodiándolo en el servidor local (`/docs/<empresa_id>/factures/emeses/`).

---

### Bloque 4: Cuenta de Resultados (P&L) en Tiempo Real y Fiscalidad Operativa
- **RF-18:** EL SISTEMA calculará y presentará en tiempo real el **Cuenta de Explotación / P&L Analítico** del periodo filtrado, estructurado en:
  1. *Ingresos Netos:* Ventas y prestaciones de servicios facturadas (Grupo PGC 70).
  2. *Consumos de Almacén:* Salidas de material imputadas a obras valoradas a Precio Medio Ponderado (PMP) (Cuentas 600/602 ajustadas con variación de existencias Grupo 30).
  3. *Costes Directos de Flota y Maquinaria:* Combustible, seguros, reparaciones y amortizaciones directas de vehículos de obra (Subgrupo PGC 62).
  4. *Gastos Generales de Explotación:* Arrendamientos, suministros de sede, seguros generales y servicios profesionales (Subgrupo PGC 62).
  5. *Coste Laboral Real:* Salarios brutos de operarios y personal técnico (Cuenta 640) más cuota patronal a la Seguridad Social (Cuenta 642).
- **RF-19:** EL SISTEMA mostrará como indicadores macroeconómicos clave del P&L:
  $$\text{Margen Bruto de Obra} = \text{Ventas Netas} - \text{Consumos de Almacén} - \text{Mano de Obra Directa}$$
  $$\text{EBITDA Operativo} = \text{Margen Bruto} - \text{Gastos Generales} - \text{Costes de Flota no imputados}$$
  $$\text{Resultado de Explotación (EBIT)} = \text{EBITDA} - \text{Dotaciones de Amortización (Cuenta 681)}$$
- **RF-20:** EL SISTEMA mantendrá un monitor continuo de la **Posición Fiscal Trimestral Acumulada**:
  1. *IVA Operativo (Estimación Modelo 303):* IVA Repercutido (Cuenta 477) desglosado por tipos (21%, 10%, 4%) menos IVA Soportado Deducible de compras, suministros y flota (Cuenta 472).
  2. *Retenciones IRPF Acumuladas (Estimación Modelo 111):* Retenciones practicadas sobre nóminas de empleados y facturas de profesionales autónomos (Cuenta 4751).
- **RF-21:** MIENTRAS una factura emitida supere su fecha de vencimiento contractual sin haber registrado cobro bancario en firme, EL SISTEMA la clasificará automáticamente como **Deuda Vencida (Impago)** y la incorporará a la escala de antigüedad del saldo (*Aging del Deute*):
  - Tramo 1: `< 30 días de retraso`
  - Tramo 2: `30 - 60 días de retraso`
  - Tramo 3: `60 - 90 días de retraso`
  - Tramo 4: `> 90 días de retraso` (Riesgo crítico de morosidad con alerta destacada).
- **RF-22:** CUANDO el usuario hace clic sobre un tramo del gráfico de Aging, EL SISTEMA filtrará dinámicamente la tabla inferior mostrando exclusivamente las facturas pendientes de cobro comprendidas en ese rango temporal con enlace directo para contactar telefónicamente con el cliente.

---

### Bloque 5: Integración de Compras, Almacén y Amortizaciones de Flota
- **RF-23:** CUANDO la Secretaria registre la recepción de una factura de proveedor (Spec 003), EL SISTEMA verificará automáticamente la triple conciliación (*3-Way Matching* contra orden de compra y albarán de entrega); una vez confirmada humanamente, se registrará el gasto en la cuenta PGC correspondiente (`600`, `602`, `628`, `622`) y se creará la obligación de pago en tesorería.
- **RF-24:** EL SISTEMA consumirá de forma continua la valoración económica de inventario generada en Magatzem (RF-08 Spec 004) calculada a Precio Medio Ponderado (PMP):
  $$\text{Valor Total de Stock} = \sum (\text{Unidades Físicas}_i \times \text{PMP}_i)$$
- **RF-25:** CUANDO se confirme en almacén una regularización de inventario por merma, daño o rotura justificada mediante volante pericial (RF-27 Spec 003 / Spec 004), EL SISTEMA registrará automáticamente el apunte de pérdida en la cuenta PGC `693` (*Deterioro de existencias*) o `659` (*Pérdidas de gestión corriente*), reflejando el impacto en el P&L mensual.
- **RF-26:** PARA los vehículos y maquinaria inventariados en Flota (Spec 006):
  1. El panel computará el **Valor Neto Contable (VNC)** de cada activo:
     $$\text{VNC} = \text{Precio de Adquisición (Cuenta 218)} - \text{Amortización Acumulada (Cuenta 2818)}$$
  2. En el cierre mensual, EL SISTEMA propondrá el asiento de amortización lineal proporcional:  
     `Debe: 681 (Dotación a la amortización) ➔ Haber: 2818 (Amortización acumulada elementos de transporte)`.
  3. EL SISTEMA detendrá automáticamente las dotaciones de un vehículo cuando su amortización acumulada alcance el precio de adquisición menos su valor residual pactado.
  4. En vehículos bajo modalidad de *Leasing financiero*, el sistema segregará en el pago de la cuota la amortización de capital (reducción de deuda cuenta `524`/`174`) frente a los gastos financieros por intereses (cuenta `662`).

---

### Bloque 6: Despesa Laboral, Resumen de Nóminas y Calendarios de Pago
- **RF-27:** EL SISTEMA dispondrá en `/gestio/comptabilitat` de un formulario mensual ágil para el **Ingreso del Resumen Mensual de Nóminas de la Gestoría Laboral** (Opción 4.1), solicitando exclusivamente los 5 valores consolidados del mes:
  1. *Salarios Brutos Totales* (Cuenta `640`): Devengos de personal base, pluses y horas extras.
  2. *Seguridad Social Patronal / Cuota Empresa* (Cuenta `642`): Coste a cargo de la empresa.
  3. *Seguridad Social a cargo de Trabajadores* (Cuenta `476`): Retención de cotizaciones obreras.
  4. *Retenciones IRPF Practicadas* (Cuenta `4751`): Retención a cuenta de la hacienda pública.
  5. *Líquido Total a Percibir* (Cuenta `465`): Salarios netos transferibles a la plantilla.
- **RF-28:** EL SISTEMA validará la **Regla de Equilibrio Contable de Nóminas**:
  $$\text{Debe } (\text{Cuenta } 640 + \text{Cuenta } 642) = \text{Haber } (\text{Cuenta } 476 + \text{Cuenta } 4751 + \text{Cuenta } 465)$$
  SI existe un descuadre numérico superior a 0,00 €, ENTONCES EL SISTEMA bloqueará el guardado del formulario e indicará la diferencia exacta a corregir.
- **RF-29:** TRAS confirmar el asiento de nóminas, EL SISTEMA planificará de forma automatizada los **3 vencimientos ineludibles en el calendario de tesorería**:
  1. *Transferencia de Salarios Netos (Cuenta 465):* Programada para el último día hábil del mes en curso.
  2. *Liquidación de Seguros Sociales a la TGSS (Cuenta 476 - RLC/RNT):* Programada para el último día hábil del mes natural posterior.
  3. *Liquidación del Modelo 111 de Retenciones (Cuenta 4751):* Programada para el día 20 del mes posterior al cierre de cada trimestre natural.
- **RF-30:** EL SISTEMA calculará el **Coste Laboral Real por Unidad y Operario**, repartiendo la carga de Seguridad Social proporcionalmente para el cálculo analítico de rentabilidad de obra y de cuadrilla.

---

### Bloque 7: Gestión de Tickets de Gasto de Trabajadores y Copilot IA
- **RF-31:** CUANDO un operario en campo fotografía y envía un ticket de gasto desde la PWA móvil (`/operari`), EL SISTEMA registrará el comprobante en la bandeja de **"Tickets Pendientes de Validación"** de `/gestio/comptabilitat`, almacenando la imagen original en `/data/<empresa_id>/tiquets/`.
- **RF-32:** EL SISTEMA distinguirá de forma preceptiva entre las dos modalidades de pago registradas por el operario:
  1. *Pago con Tarjeta de Crédito de Empresa:* El gasto se asocia a la tarjeta corporativa correspondiente; la salida monetaria se conciliará directamente contra la cuenta corriente bancaria de la empresa (Cuenta `572`), sin generar deuda hacia el trabajador.
  2. *Pago en Efectivo de Bolsillo del Trabajador:* El gasto se catalogará como **Deuda Pendiente con el Trabajador** (Cuenta `465` / `460`); EL SISTEMA habilitará a la Secretaria la opción de liquidarlo mediante transferencia de reembolso puntual o agregarlo al saldo a percibir de su liquidación mensual.
- **RF-33:** EL ASISTENTE COPILOT IA procesará asíncronamente (OCR local + Whisper si incluye nota de audio) la imagen del ticket y redactará un **Borrador de Asiento de Gasto** estructurado:
  1. Extracción de emisor, CIF/NIF (si figura), fecha y total del ticket.
  2. Clasificación contable del gasto según concepto: Dieta/Restauración (`629`), Combustible en ruta (`628`), Peaje/Aparcamiento (`629`), o Material menor de urgencia (`602` con imputación a orden de trabajo).
  3. Determinación de la deducibilidad del IVA: si es factura simplificada sin NIF de la empresa, computa el total como gasto neto deducible en IRPF/Sociedades sin deducción de cuota en IVA soportado; si dispone de factura completa con NIF corporativo, segrega base e IVA soportado (`472`).
  4. Identificación del trabajador declarante y tarjeta/medio de pago empleado.
- **RF-34:** MANDATO HUMAN-IN-THE-LOOP PARA TICKETS: **Ningún apunte de ticket propuesto por Copilot se consolidará contablemente sin la validación administrativa explícita de la Secretaria o Boss**:
  - La Secretaria revisará el borrador, contrastará la foto ampliada del ticket, ajustará las cuentas o importes si fuera preciso, y pulsará `[Aprobar y Contabilizar]` o `[Rechazar Gasto]`.
- **RF-35:** CUANDO un ticket sea rechazado, EL SISTEMA notificará inmediatamente a la PWA del operario con el motivo del descarte especificado por la administración, quedando el registro auditado en el expediente del trabajador.

---

### Bloque 8: Conciliación Bancaria (Norma 43) y Previsión de Tesorería (Cash Flow)
- **RF-36:** EL SISTEMA dispondrá de un cargador de archivos bancarios compatible con el estándar español **Norma 43 (CSB 43)** y extractos estructurados Excel/CSV de entidades financieras (CaixaBank, Sabadell, BBVA, Santander, etc.):
  1. Al cargar el archivo, EL SISTEMA creará los apuntes de movimiento bancario con fecha de operación, fecha valor, concepto y saldo resultante.
  2. Actualizará el indicador de **Saldo Disponible Real en Cuentas Bancarias (Cuenta 572)**.
- **RF-37:** EL ASISTENTE COPILOT IA analizará automáticamente las líneas del extracto bancario y propondrá la **Conciliación Inteligente**:
  1. *Cobros de Clientes:* Cruce por coincidencia exacta de importe y referencia con facturas emitidas pendientes, proponiendo marcar la factura como `Cobrada` en firme.
  2. *Pagos a Proveedores:* Cruce de recibos, pagarés o transferencias contra facturas de compras registradas.
  3. *Cargos de Tarjetas de Empresa:* Cruce de los cargos agregados o individuales de las tarjetas contra los tickets de cuadrilla aprobados (RF-33).
  4. *Remesas y Nòmines:* Conciliación de las transferencias salariales y cargos de seguros sociales de la TGSS.
- **RF-38:** MANDATO DE VALIDACIÓN HUMANA EN CONCILIACIÓN: La Secretaria confirmará las coincidencias propuestas por Copilot mediante un clic en `[Validar Conciliación]` o asociará manualmente los movimientos discordantes; **ninguna factura se marcará como cobrada automáticamente sin confirmación de usuario**.
- **RF-39:** EL SISTEMA proyectará de forma continua la **Curva de Previsión de Tesorería (Cash Flow Forecast)** a 30, 60, 90 días y 12 meses vista:
  $$\text{Tesorería Proyectada}(t) = \text{Saldo Disponible Bancario Actual} + \sum \text{Cobros Previstos}_t - \sum \text{Pagos Comprometidos}_t$$
  1. *Cobros Previstos:* Vencimientos de facturas emitidas y contratos de mantenimiento recurrentes.
  2. *Pagos Comprometidos:* Facturas de proveedores pendientes, cuotas fijas de leasing/renting de flota (Spec 006), nóminas netas mensuales programadas, obligaciones trimestrales con Hacienda (Modelos 303 y 111) y cotizaciones mensuales con la TGSS.
- **RF-40:** EL SISTEMA permitirá simular la resistencia financiera alternando entre tres escenarios:
  1. *Escenario Base:* Fechas oficiales de vencimiento contractual de facturas y compromisos fijos.
  2. *Escenario Pesimista:* Aplicación de un retraso medio de +30 días en el cobro a clientes de riesgo y reducción del 20% en facturación variable prevista.
  3. *Escenario Optimista:* Cobro puntual al 100% en fecha de vencimiento y cobro de anticipos de presupuestos pendientes.
  - *Alerta de Iliquidez / Descubierto:* SI en cualquier fecha futura la curva proyectada cae por debajo de 0,00 € o del límite de crédito bancario configurado, ENTONCES EL SISTEMA activará una alerta destacada indicando el día exacto de rotura de caja y el déficit estimado.

---

### Bloque 9: Exportación Oficial del Paquete Contable para Gestoría Externa
- **RF-41:** EL SISTEMA generará con periodicidad mensual o trimestral el **Paquete Oficial de Exportación para la Asesoría / Gestoría Externa**:
  1. *Libro Diario de Asientos (PGC Pymes):* Archivo en formato estructurado universal (`CSV` / `Excel`) conteniendo la relación completa de asientos contables por partida doble con cuentas del PGC (`Debe = Haber`), centros de coste, fechas de devengo y conceptos analíticos, compatible con la importación en sistemas A3 (A3Innuva / A3Eco), Sage (Sage 50 / 200) y Contasol.
  2. *Libro Registro de Facturas Emitidas:* Archivo estructurado con identificador de serie, fecha, NIF del cliente, base imponible, desglose de tipos de IVA, cuotas, retenciones IRPF, Total Factura y Hash encadenado de Veri*factu.
  3. *Libro Registro de Facturas Recibidas y Gastos:* Archivo estructurado con facturas de proveedores, gastos de explotación y tickets consolidados.
  4. *Resumen Analítico de Nóminas y Seguridad Social:* Cuadro desglosado de cuentas 640, 642, 476, 4751 y 465.
- **RF-42:** EL SISTEMA compilará y empaquetará de forma automatizada un **archivo comprimido ZIP con todos los documentos originales en PDF**:
  - Facturas oficiales emitidas Veri*factu con sus códigos QR.
  - Facturas recibidas de proveedores y subcontratas en PDF.
  - Fotografías periciales de tickets de gasto aprobados en ruta.
- **RF-43:** LA descarga del paquete contable para gestoría registrará un evento de auditoría formal (*"Paquete exportado por [Usuario] el [Timestamp]"*), congelando el periodo para evitar manipulaciones inadvertidas sin autorización expresa del Boss.

---

## Requisitos No Funcionales
- **Cumplimiento Legal Veri*factu (RD 1007/2023):** Todas las facturas emitidas cumplirán rigurosamente con los requisitos de inalterabilidad, trazabilidad, registro de alta en tiempo de emisión, firma hash SHA-256 encadenada y código QR bidimensional oficial.
- **Segregación Estricta Zero-Trust:** La API de backend bloqueará al 100% el acceso a cualquier endpoint contable o financiero a los usuarios con rol `Ingeniero` o inferior.
- **Almacenamiento Local Seguro y Soberano:** Se descarta completamente AWS S3. Los documentos PDF y justificantes de tickets residen en volúmenes locales del servidor y Hetzner Cloud (Alemania - UE) bajo `/docs/<empresa_id>/factures/` y `/data/<empresa_id>/tiquets/`, con copias de seguridad automáticas cada domingo.
- **Procesamiento Asíncrono de OCR y Generación Documental:** La extracción inteligente de tickets mediante Copilot IA y la generación de PDFs con ReportLab se delegan a workers en segundo plano (Celery + Redis), garantizando que las respuestas de la API web no superen los 250 ms.
- **Privacidad Laboral y RGPD:** Los datos bancarios (cuentas corrientes de clientes y cuentas IBAN de trabajadores) se almacenan en base de datos cifrados con clave de aplicación, no exponiéndose jamás en registros de log ni en endpoints no autenticados.
- **Diseño Camaleón:** La interfaz web adopta la paleta corporativa mediante variables CSS HSL dinámicas (`--color-primary`, `--color-secondary`), mientras que los estados contables respetan los contrastes funcionales universales (Verde Cobrado, Rojo Impagado/Vencido, Ámbar Pendiente).

---

## Fuera de Alcance (Lo que NO hace este módulo)
- No es un software de contabilidad de cierre mercantil para el Registro Mercantil (no redacta la Memoria Anual, el Informe de Gestión ni efectúa el asiento de cierre/apertura del ejercicio oficial; se delega en la gestoría externa a través del paquete de exportación RF-41).
- No realiza cálculos laborales internos de nóminas desde cero (convenios, IRPF escalonado, bajas por incapacidad temporal y retenciones MEI se calculan en la gestoría laboral externa y se ingresan como resumen consolidado según RF-27).
- No presenta telemáticamente ni firma mediante certificado digital los modelos tributarios oficiales (Modelos 303, 111, 115, 390, 190, 200) ante la sede electrónica de la AEAT; calcula las bases y liquidaciones estimadas y emite los listados para que la gestoría presente las autoliquidaciones.
- No concede préstamos ni gestiona operaciones de banca transaccional directa (las transferencias bancarias de pago se ejecutan en la banca electrónica del cliente o mediante ficheros SEPA XML generados en el módulo).
- No permite la edición manual o alteración de facturas una vez emitidas en firme bajo Veri*factu (cualquier modificación exige Factura Rectificativa).

---

## Criterios de Finalización (Definition of Done)
1. Todos los requisitos funcionales (RF-01 al RF-43) redactados en sintaxis formal EARS respondiendo fielmente al QUÉ y al POR QUÉ de la operativa financiera real de empresas de servicios técnicos.
2. Implementación de la Opción B: hub de facturación legal Veri*factu, control analítico de costes, Cash Flow a 30/60/90 días y exportación estructurada PGC para la gestoría externa (A3, Sage, Contasol).
3. Circuito documental completo: Proformas/Borradores editables ➔ Facturas definitivas Veri*factu inmutables (SHA-256 + QR) ➔ Facturas Rectificativas independientes (`R-2026-XXXX`) con liberación automática de albaranes de obra a estado pendiente para su corrección.
4. Facturación de albaranes individuales y agrupados por cliente en periodos mensuales.
5. Deducción legal de facturas de anticipo en la base imponible de la factura final (Método 2.1) con mención registral preceptiva.
6. Ingreso mensual del resumen de nóminas de gestoría con validación estricta de partida doble y programación de vencimientos (Líquido a fin de mes, TGSS y Modelo 111).
7. Circuito de tickets de operarios con distinción de pagos con tarjeta de empresa vs pagos en efectivo de bolsillo (deuda con el trabajador), propuesta de asientos por Copilot IA (OCR) y validación administrativa obligatoria previa.
8. Conciliación bancaria basada en importación estándar de archivos Norma 43 con cruce inteligente asistido por Copilot y confirmación humana a 1 clic.
9. Proyección de flujo de caja (Cash Flow Forecast) con escenarios Base, Pesimista y Optimista con alertas deterministas de déficit o descubierto.
10. Paquete completo de exportación a gestoría: Libro Diario PGC (CSV/Excel), libros de facturas emitidas y recibidas, y archivo ZIP con evidencias documentales y PDFs oficiales.
11. Principio de Cero Datos Ficticios (*Zero Mock Data*) con Estado Día 0 real garantizado.
12. Almacenamiento seguro en discos locales y servidor Hetzner en Alemania (`/docs/<empresa_id>/...` y `/data/<empresa_id>/...`) con eliminación total de AWS S3.
13. Bloqueo absoluto de acceso a usuarios con rol `Ingeniero` a nivel de API de backend.
14. Aislamiento estricto multi-inquilino garantizado mediante RLS a nivel de base de datos (`empresa_id`) y trazabilidad de auditoría inmutable en cada transacción.
