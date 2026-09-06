# Spec 007 — Mòdul de Comptabilitat, Facturació i Tresoreria (/gestio/comptabilitat)

## Contexto y objetivo

El módulo de Comptabilitat, Facturació i Tresoreria (`/gestio/comptabilitat`) es el **Hub Operativo Financiero, Motor de Facturación Legal Veri*factu y Cockpit Previsional de Tesorería** de CampoPro Suite. Conecta directamente la actividad técnica ejecutada en campo (albaranes cerrados en la Torre de Control de la Spec 001, consumos de almacén de la Spec 004 y costes operativos de flota de la Spec 006) con la administración y dirección de la empresa.

Bajo la decisión estratégica de gobernanza (Opción B), este módulo **no pretende ser un ERP contable cerrado de liquidación mercantil oficial**, sino una plataforma ágil de gestión empresarial en tiempo real que:

1. Gobierna el ciclo de facturación legal vinculante a clientes bajo la normativa **Veri*factu (RD 1007/2023 y Orden Ministerial HAC/1177/2024)**, con encadenamiento criptográfico SHA-256 por bloqueo pesimista en base de datos (`SELECT FOR UPDATE`), código QR estructurado, arquitectura transaccional desacoplada (*Outbox Pattern*) y **Registro de Eventos inalterable del SIF**.


2. Centraliza la emisión de **Facturas Proforma / Borradores técnicos editables**, la facturación individual o **agrupada periódica de albaranes de obra**, la compensación acotada de **facturas de anticipo por bloques impositivos (*Bucket Matching*)**, y la emisión formal de **Facturas Rectificativas e invariabilidad de rectificativas recursivas** (manteniendo los albaranes marcados como facturados pero habilitando su corrección controlada para rectificación).


3. Separa el registro financiero de cliente (cabecera cuenta `430`) del desglose analítico (líneas imputadas al grupo `70` con `Centre_de_Cost_ID` y `Obra_ID`), permitiendo facturas agrupadas multiobra con cálculo exacto del P&L analítico por proyecto.


4. Desacopla la perspectiva de gestión analítica (**Criterio de Caja en memoria**) de las obligaciones tributarias oficiales (**Régimen Especial del Criterio de Caja - RECC** bajo el art. 163 sexies de la LIVA), incorporando la gestión de **RECC Pasivo en facturas de proveedores** (art. 163 decies LIVA).


5. Incorpora el tratamiento formal de **Inversión del Sujeto Pasivo (Art. 84.U.2.f LIVA)**, el registro de **Partidas de Suplidos y Tasas exentas (Cuenta de mediación `554`)** y la deducción de **Retenciones de IRPF soportadas en facturas a clientes (Cuenta de activo `473`)**, proyectando la tesorería real sobre el neto exigible de cartera excluyendo anticipos consumidos.


6. Aplica las **reglas de precisión y redondeo oficial de la AEAT (RD 1619/2012)**: cálculo de cuota de IVA sobre el sumatorio agrupado por tipo impositivo mediante `ROUND_HALF_UP` y reconciliación analítica de céntimos en líneas.


7. Monitoriza en tiempo real el **Cuenta de Resultados de Explotación (P&L)** desagregando ingresos netos, consumos reales de stock (PMP), costes directos de flota/maquinaria, amortizaciones y costes laborales reales.


8. Gestiona las **liquidaciones mensuales de nóminas mediante la ingesta de nóminas individuales en entorno staging aislado con RLS mandatorio**, disponiendo de los datos nominales por operario para calcular con exactitud matemática el coste laboral real por unidad, operario y cuadrilla, implementando **Envelope Encryption (AES-256-GCM)** en reposo, blindaje de retribuciones de alta dirección y programación de calendarios de pago.


9. Centraliza el circuito de **tickets de gasto de trabajadores y cuadrillas**, distinguiendo pagos con **tarjeta de empresa** frente a pagos en **efectivo de bolsillo del operario** (deuda en cuenta `465`), integrando el selector de suplidos y hojas de kilometraje en PWA (0,26 €/km) y la **mitigación del riesgo fiscal ante la AEAT** (IVA 0% deducible sin NIF integrado a gasto en cuenta 62X, parametrización de deducibilidad en IS y conmutación automática al cierre de ejercicio), asistido por **Copilot IA** y gobernado por el principio mandatorio *Human-in-the-Loop*.


10. Establece el **circuito de bloqueo preventivo de finiquito en rescisiones laborales**, compensando deudas consolidadas de anticipos de caja (cuenta `460`) y trasvase automático a deudores identificados (cuenta `4409`), reservando la condonación a pérdidas (cuenta `659`/`678`) exclusivamente a la autorización formal del `Boss`.


11. Ejecuta la **conciliación bancaria mediante importación estándar Norma 43 (CSB 43)** con **algoritmo de desduplicación por huella digital determinista multidivisa (SHA-256) con aislamiento de inquilino y validación de continuidad de saldos**, procesando lotes de forma idempotente y transaccional apunte a apunte con liquidación automática de diferencias de cambio (cuentas `668`/`768`).


12. Modela la **proyección de flujo de caja (Cash Flow Forecast)** a 30, 60, 90 días y 12 meses vista bajo escenarios configurables (*Base, Pesimista y Optimista*), basando las entradas de cartera exclusivamente en el líquido real exigible en cuenta `430`.


13. Genera el **Paquete Oficial de Enlace con la Gestoría Externa**: exportación del Libro Diario estructurado bajo el Plan General Contable (PGC Pymes / RD 1515/2007) mediante adaptadores nativos para A3 (ASCII de posiciones fijas), Contasol (CSV) y Sage (XML/CSV), libros oficiales de Facturas Emitidas (con columnas para ISP y retenciones), Facturas Recibidas (con claves RECC) y archivo ZIP con evidencias y PDFs originales custodiados en disco soberano.


14. Cumple con el principio de **Tolerancia Cero a Datos Ficticios (*Zero Mock Data*)**, con Estado Día 0 real sustentado en base de datos vacía, almacenamiento soberano en discos locales y servidor Hetzner en Alemania (cero AWS S3), aislamiento multi-inquilino (RLS) y segregación estricta *Zero-Trust*.



---

## Usuarios / actores y Matriz de Acceso (Zero-Trust)

El backend garantiza el aislamiento multi-inquilino mediante Row Level Security (RLS) mandatorio (`empresa_id`) y la segregación rigurosa de roles:

* **Boss (Gerencia / Propietario):** Acceso total e irrestricto a todas las funciones del módulo: cuadros de mando macroeconómicos, márgenes y rentabilidad neta por cliente/obra, aprobación de órdenes de pago bancarias, validación de facturas rectificativas, consulta de previsiones de tesorería y saldos disponibles, autorización formal de expedientes de fallidos en deudas laborales, visualización sin ofuscar de nóminas de alta dirección, y autorización final para la exportación de remesas contables a la gestoría externa.


* **Secretaria / RRHH:** Operador administrativo principal del módulo. Confección y edición de borradores/proformas, emisión y sellado de facturas definitivas Veri*factu, tramitación de facturas de anticipo y compensación, registro de facturas recibidas de compras/proveedores (incluyendo banderas de RECC pasivo), subida e ingesta de nóminas individuales de la plantilla en staging aislado (con ofuscación automática y bloqueo de PDFs para perfiles de alta dirección), revisión administrativa y validación de tickets de gastos de cuadrillas, importación de extractos Norma 43 con conciliación bancaria por lotes idempotentes, y generación y descarga del paquete mensual/trimestral de exportación PGC para la asesoría externa.


* **Ingeniero / Supervisor Técnico:** **BLOQUEO TOTAL A NIVEL DE API SOBRE EL ROUTER DE CONTABILIDAD (`/api/v1/gestio/comptabilitat/*`) (403 Forbidden)**. En la interfaz web, el menú y los accesos directos a contabilidad/facturación no se muestran para el rol `Ingeniero`. El personal técnico no realiza ni emite facturas legales Veri*factu; su ámbito económico se limita a confeccionar presupuestos técnicos y facturas proforma para clientes desde la Torre de Control (Spec 001). Dispone de permisos de solo lectura para consultar facturas y albaranes asociados a sus obras asignadas mediante un endpoint desacoplado de operaciones técnicas (`/api/v1/gestio/obres/{id}/factures`), serializado mediante un DTO técnico restringido que purga datos bancarios, cuentas PGC y márgenes de beneficio.


* **Operario de Cuadrilla / Capataz (`/operari`):** No accede a la web de contabilidad. Desde la PWA móvil de campo, captura fotográficamente los tickets de gasto en ruta (indicando concepto, importe, modalidad de pago y selector opcional de Suplido/Tasa de cliente vinculado a la obra en curso), registra partes de kilometraje en vehículo particular (0,26 €/km) y consulta en streaming seguro exclusivamente su propia nómina mensual.


* **Cliente Final (Canal Multicanal):** Receptor de facturas proforma y facturas definitivas Veri*factu en PDF con código QR estructurado, expedidas por Email o a través del canal interactivo de mensajería (Telegram).



### Matriz de Acceso a Documentos Salariales (Nóminas)

| Rol | Consulta / Descarga PDF | Desxifratge a Memòria | Registre d'Auditoria |
| --- | --- | --- | --- |
| **Boss** | Permesa per a tota la plantilla (sense restriccions) | En streaming sota demanda HTTPS | Registre d'accés (ID, data, IP) |
| **Secretaria** | **Permesa per a plantilla operativa; BLOQUEJAT (403) per a Alta Direcció** | En streaming (només plantilla operativa) | Registre d'accés i alertes d'infracció |
| **Operari (`/operari`)** | Permesa exclusivament per a la pròpia nòmina | En streaming sota demanda HTTPS | Registre d'accés (ID, data, IP) |
| **Ingeniero** | **Bloqueig total (403 Forbidden)** | **No permès** | Alerta d'accés no autoritzat |
| **Procés Celery** | Lectura tècnica en ingesta d'arxius | Neteja de memòria un cop parsejat | Registre de hash d'ingesta |

---

## Historias de usuario

* **H1:** Como *Secretaria*, quiero consultar los albaranes de obra cerrados por los ingenieros en campo para generar una factura agrupada mensual de un cliente con múltiples obras, de forma que el P&L analítico mantenga desglosados los ingresos por cada centro de coste sin mezclar proyectos.


* **H2:** Como *Secretaria*, quiero emitir una factura de anticipo formal (Veri*factu) tras la aceptación de un presupuesto de obra con IVA mixto (10% y 21%), y que al liquidar la factura final el sistema acote la deducción al máximo de la base ejecutada por bloque fiscal (*Bucket Matching*), generando automáticamente una rectificativa del anticipo si la ejecución de un tipo fue inferior al anticipo cobrado.


* **H3:** Como *Secretaria o Boss*, quiero preparar una factura en modo "Borrador / Proforma" para revisarla previamente con el cliente, asegurando que solo al pulsar el botón explícito "Emitir Factura Veri*factu" se ejecute la transacción atómica con bloqueo pesimista que asigne el número fiscal legal inalterable, el hash SHA-256 encadenado y anote el alta en el registro de eventos del SIF.


* **H4:** Como *Secretaria*, cuando se detecte un error en una factura emitida, quiero generar una Factura Rectificativa correlativa (`R-2026-XXXX`) y que los albaranes originales queden marcados como facturados pero en estado editable para rectificación, preservando la conciliación bancaria si ya estaba cobrada y gestionando el saldo acreedor resultante (devolución SEPA o saldo comercial en cuenta `4309`).


* **H5:** Como *Secretaria*, quiero subir las nóminas individuales de los trabajadores a un entorno staging aislado con RLS para que Celery procese los archivos asíncronamente con cifrado AES-256-GCM y, tras validar el cuadre perfecto de la partida doble sobre el total agregado, consolide el asiento en el llibre diari y programe los vencimientos de tesorería.


* **H6:** Como *Secretaria*, quiero revisar los tickets de gasto capturados por los operarios desde la PWA, comprobando la propuesta de Copilot IA (reconvirtiendo a suplido `554` si es tasa de cliente o registrando hojas de kilometraje a 0,26 €/km) y gestionando el riesgo fiscal de los tickets sin NIF (alerta preventiva en diciembre y pase automático a no deducible al cierre fiscal).


* **H7:** Como *Secretaria o Boss*, quiero subir el archivo bancario Norma 43 para que el sistema desduplique de forma determinista mediante huella SHA-256 multidivisa los movimientos solapados y verifique la continuidad de saldos, ejecutando la conciliación masiva con transaccionalidad unitaria resiliente ante cortes de red y liquidando diferencias de cambio.


* **H8:** Como *Boss*, quiero conmutar entre el Criterio de Devengo oficial y una simulación en memoria bajo Criterio de Caja para evaluar la liquidez real de la empresa, modelando el Cash Flow a 30, 60 y 90 días vista excluyendo anticipos consumidos y sin alterar los libros oficiales de IVA.


* **H9:** Como *Secretaria*, quiero emitir facturas con Inversión del Sujeto Pasivo (Art. 84.U.2.f LIVA), registrar partidas de suplidos sin IVA en cuenta 554, e incluir retenciones de IRPF soportadas imputadas a la cuenta de activo `473` calculando el cobro previsto sobre el neto exigible en cuenta `430`.


* **H10:** Como *Ingeniero*, quiero consultar desde la ficha de mi obra asignada las facturas emitidas a mi cliente mediante una vista técnica segura sin márgenes empresariales ni datos bancarios.



---

## Requisitos Funcionales (Criterios de Aceptación en EARS)

### Bloque 1: Entorno de Gestión, Filtros Globales y Segregación de Roles

* **RF-01 (Ubiquitous) — Barra de Control y Filtros Temporales Reactivos:** EL SISTEMA presentará en la cabecera de `/gestio/comptabilitat` una barra de control con un selector temporal global configurable (*Mes actual, Trimestre [T1, T2, T3, T4], Año Fiscal en curso, Año Fiscal anterior* o rango personalizado entre fechas), actualizando reactivamente todos los módulos analíticos de la pantalla.


* **RF-02 (Event-driven) — Desacoplamiento de Criterio de Caja Analítico vs RECC Oficial:**
1. CUANDO el usuario conmuta en el panel entre el *Criterio de Devengo (Meritat)* y el *Criterio de Caja*, EL SISTEMA recalculará en memoria los ingresos, gastos y márgenes agrupando las operaciones por `Data_Cobrament` o `Data_Pagament` bancaria efectiva.


2. Este recálculo analítico **no modificará los asientos contables del llibre diari ni alterará los libros de registro de IVA oficiales**.


3. El tratamiento fiscal oficial del Régimen Especial del Criterio de Caja (RECC - art. 163 sexies LIVA) se rige por su configuración societaria independiente según RF-41.3 a RF-41.7 y RF-41.9.




* **RF-03 (Ubiquitous) — Modelo de Datos de Doble Nivel (Capçalera vs Línies) per a Multiobra:**
1. *Capçalera (`Factura_Capcalera`):* Centraliza la deuda mercantil y fiscal única con el cliente (cuenta `430`), la base imponible consolidada, impuestos totales y estado de cobro. No contiene ningún campo fijo restrictivo de centro de coste (valor nulo o compartido).


2. *Línies de Factura (`Factura_Linia`):* Heredan obligatoriamente el `Centre_de_Cost_ID` y `Obra_ID` del albarán de origen (`Albara_Linia`). Cada línea se imputa a una cuenta de ventas del subgrupo `70` con su centro analítico asociado.


3. *Filtrado Analítico de P&L:* Al filtrar por un Centro de Coste u Obra, EL SISTEMA calculará el resultado sumando con exclusividad las líneas de detalle asociadas a dicho identificador, omitiendo los totales de cabecera para garantizar un aislamiento económico estricto.




* **RF-04 (State-driven) — Estado Día 0 Real (Zero Mock Data):** SI el sistema se encuentra en estado "Día 0" (sin facturas emitidas ni apuntes bancarios registrados), ENTONCES EL SISTEMA mostrará los paneles y gráficas con valores numéricos a 0,00 € y estados vacíos reales (*"Sin facturación registrada en este ejercicio"*, *"Sin movimientos bancarios pendientes"*), prohibiendo estrictamente la inyección de datos simulados (*Zero Mock Data*).


* **RF-05 (Ubiquitous) — Segregación Estricta de Acceso y Visibilidad del Ingeniero:**
1. EL SISTEMA ocultará el acceso a `/gestio/comptabilitat` en la barra de navegación web y menús para usuarios con rol `Ingeniero` u `Operario`.


2. EL BACKEND bloqueará terminantemente cualquier petición al router `/api/v1/gestio/comptabilitat/*` emitida con rol `Ingeniero`, respondiendo con código HTTP `403 Forbidden`.


3. Solo los roles `Boss` o `Secretaria` disponen de acceso a este módulo.




* **RF-05.1 (Ubiquitous) — Gestión de Inversión del Sujeto Pasivo (ISP - Art. 84.U.2.f LIVA):**
1. EL SISTEMA permitirá marcar una factura emitida o línea de obra bajo el régimen de Inversión del Sujeto Pasivo, fijando la cuota de IVA repercutido a 0,00 € (tipo `ISP_0%`).


2. La factura generará obligatoriamente en el PDF la leyenda legal: *"Operació amb inversió del subjecte passiu d'acord amb l'art. 84.U.2n.f de la Llei 37/1992 de l'IVA"*.


3. El asiento contable imputará la base íntegra a ingresos (cuenta `705`) sin apunte en cuenta `477`.


4. En la liquidación del Modelo 303, la base se computará exclusivamente en la casilla de operaciones no sujetas / ISP (casilla 122).




* **RF-05.2 (Ubiquitous) — Registro de Retenciones de IRPF Soportadas en Clientes:**
1. CUANDO se emita una factura a clientes profesionales o entidades sometidas a retención en origen, EL SISTEMA imputará el importe retenido a la cuenta de activo `473` (*HP, retenciones y pagos a cuenta*).


2. Queda estrictamente prohibido registrar retenciones soportadas en clientes en la cuenta de pasivo `4751`.




* **RF-05.2.2 (Ubiquitous) — Càlcul Canònic del Líquid Exigible de Cartera (Compte 430):** En consolidar qualsevol factura emesa, el sistema ha de fixar el saldo deutor exigible al client al compte 430 sumant la base imposable neta liquidada, la quota d'IVA repercutit resultant i la totalitat de les partides de suplerts exempts degudament acreditades (Compte 554), deduint exclusivament les retencions d'IRPF suportades en origen (Compte 473):



$$\text{Líquid Exigible (430)} = \sum_k \text{Base Liquidada}_k + \sum_k \text{Quota IVA}_k + \sum \text{Suplerts (554)} - \text{Retenció IRPF (473)}$$



garantint la concordança matemàtica $1:1$ amb la projecció de cobrament de tresoreria definida a RF-18.1.


* **RF-05.3 (Ubiquitous) — Desacoblament d'Endpoint per a Oficina Tècnica:** El sistema ha de canalitzar la consulta de factures per part del rol Enginyer a través del router d'operacions tècniques (`/api/v1/gestio/obres/{id}/factures`), mantenint el router `/api/v1/gestio/comptabilitat/*` bloquejat exclusivament per als rols Boss i Secretaria amb resposta `403 Forbidden`.


* **RF-05.4 (State-driven) — Serialització per DTO Tècnic Restringit:** Mentre la petició de consulta provingui d'un usuari amb rol Enginyer, el sistema ha de serialitzar les dades utilitzant el `FacturaConsultaTecnicaDTO`, purgant automàticament de la resposta qualsevol referència a números de compte bancari, comptes comptables del PGC, marges de benefici de l'empresa o preus de cost de proveïdors.


* **RF-05.5 (Unwanted behavior) — Bloqueig d'Accés a Obres No Assignades:** Si un Enginyer sol·licita informació tècnica d'una factura vinculada a una obra o client en què no consta com a tècnic responsable, el sistema ha de denegar l'accés amb un error `403 Forbidden`, registrant l'intent d'accés no autoritzat al registre d'auditoria.



---

### Bloque 2: Cierre de Albaranes, Facturación Agrupada, Anticipos y Suplidos

* **RF-06 (Event-driven) — Entrada de Albaranes Cerrados a Bandeja de Facturación:** CUANDO un albarán de finalización de obra es aprobado humanamente por el supervisor técnico en la Torre de Control (RF-40 Spec 001), EL SISTEMA incorporará de inmediato dicho documento a la bandeja de **"Albaranes Pendientes de Facturar"** en `/gestio/comptabilitat`.


* **RF-07 (Optional-feature) — Facturación Agrupada y Distribución Proporcional de Cobro:**
1. EL SISTEMA permitirá la Facturación Individual o Agrupada Periódica de múltiples albaranes aprobados pertenecientes a un mismo cliente.


2. En el seguimiento de tesorería por proyecto de una factura agrupada multiobra:


* Ante un *Cobro Total*, el ingreso bancario se distribuye proporcionalmente al peso económico de cada obra en la factura.


* Ante un *Cobro Parcial*, por defecto el sistema aplicará la **regla matemática de prorrateo proporcional lineal ponderado** sobre el total bruto de cada línea calculando un coeficiente único de cobro ($k$):



$$k = \frac{\text{Import Cobrat}}{\text{Total Factura (Bases + cuotas IVA + Suplidos)}}$$



Este coeficiente se aplica automáticamente a cada una de las líneas (`Factura_Linia`):


* *Líneas de obra (venta):* $\text{Base Cobrada}_i = \text{Base Línia}_i \times k$ (imputación al P&L de la Obra asociada a RF-02); $\text{IVA Cobrat}_i = \text{Quota IVA Línia}_i \times k$ (base para el criterio de caja fiscal / Modelo 303 según Art. 61 bis RIVA).


* *Líneas de suplidos (554):* $\text{Suplit Cobrat}_j = \text{Import Suplit}_j \times k$ (minoración del saldo deudor en cuenta 554, sin impacto en P&L).




* *Vía manual de Secretaria:* Cualquier desviación de esta regla (ej. liquidar íntegramente la 554 antes de asignar margen o priorizar una obra específica) se canalizará exclusivamente mediante asignación manual de Secretaria o Boss.






* **RF-08 (Ubiquitous) — Precisión Intermedia y Regla Oficial de Redondeo de IVA (RD 1619/2012):**
1. Las líneas de detalle mantendrán los cálculos de precios unitarios e importes con un mínimo de 4 decimales flotantes para evitar error acumulado.


2. El cálculo vinculante de la cuota de IVA se realizará sobre el sumatorio de bases agrupadas por tipo impositivo ($k \in \{4\%, 10\%, 21\%\}$):



$$\text{Base Total}_k = \text{round}\left(\sum \text{Base Línia}_{i, k},\ 2\right)$$


$$\text{Cuota IVA Oficial}_k = \text{round}\left(\text{Base Total}_k \times \text{Tipo}_k,\ 2\right)$$



aplicando el método de redondeo simétrico a 2 decimales (`ROUND_HALF_UP`).


3. *Reconciliación Analítica:* Si existe una desviación de céntimos ($\Delta \neq 0$) entre la suma de cuotas calculadas por línea y la cuota oficial agrupada, el sistema imputará la diferencia de céntimos a la línea de mayor importe de dicho tipo impositivo.




* **RF-09 (Event-driven) — Factura de Anticipo con Desglose Fiscal (*Bucket Matching*):**
1. El importe del anticipo presupuestario estará limitado por norma general al 45% del presupuesto (o 100% de materiales).


2. SI el presupuesto aceptado contiene partidas con tipos mixtos de IVA (ej. 10% y 21%), ENTONCES EL SISTEMA prorrateará la base imponible del anticipo según el peso relativo de cada tipo en el presupuesto original:



$$\text{Base Anticipo}_k = \text{Importe Neto Anticipo} \times \frac{\text{Base Presupuesto}_k}{\text{Base Total Presupuesto}}$$


3. Se emitirá la Factura de Anticipo Veri*factu con el desglose de cuotas de IVA correspondiente liquidado a la fecha de cobro.




* **RF-10 (Ubiquitous) — Deducción Acotada de Anticipo por Tipo Impositivo (*Bucket Matching*):**
Durante la emisión de la factura final de liquidación de obra, el sistema limitará la deducción de la base de un anticipo al importe máximo de la base ejecutada para ese mismo tipo de IVA ($\min(\text{Base Executada}_k, \text{Base Anticip}_k)$), garantizando que ninguna base imponible parcial del desglose fiscal resulte en un valor inferior a $0,00\ €$:



$$\text{Base Liquidació}_k = \text{Base Executada}_k - \min(\text{Base Executada}_k, \text{Base Anticip}_k)$$


$$\text{Quota IVA}_k = \text{Base Liquidació}_k \times \text{Tipus}_k$$


* **RF-10.2 (Unwanted behavior) — Prohibición de Compensación entre Bloques Fiscales:** El sistema bloqueará cualquier intento de compensar o transferir remanentes negativos de un tipo impositivo (como el 10%) hacia la base imponible de otro tipo impositivo (como el 21%), notificando al usuario la improcedencia fiscal de la operación.


* **RF-11 (Ubiquitous) — Referencia Legal de Anticipos Compensados:** La factura final incorporará la referencia legal preceptiva a las facturas de anticipo compensadas: *"Deducción por anticipo según Factura Nº [ID_Factura] de fecha [Fecha]"*.


* **RF-47 (Ubiquitous) — Segregación de Líneas de Suplidos en Albaranes y Facturas:** El sistema permitirá marcar líneas de albarán o factura como Partida de Suplido, asignándoles automáticamente una cuota de IVA del 0,00 %, excluyendo su importe de la base imponible general e imputando su asiento a la cuenta de mediación `554` (*Cuentas corrientes por gastos suplidos*).


* **RF-47.2 (State-driven) — Incorporación Automática por Saldo Deudor en Mediación:** Mientras existan asientos contables consolidados con saldo deudor en la cuenta `554.Client` vinculados a un `Obra_ID` (con independencia de que la contrapartida haya sido tesorería `572`, caja `570` o crédito de personal `465`), y cada uno cuente con su documento acreditativo de liquidación tributaria validado, el motor de facturación incorporará automáticamente estos importes como partidas exentas de suplido en la factura final de obra.


* **RF-48 (State-driven) — Validación Documental y Exclusión de Margen en Suplidos:** Mientras una línea esté catalogada como suplido, el sistema bloqueará la aplicación de porcentajes de descuento o margen comercial, y exigirá obligatoriamente adjuntar el documento acreditativo de liquidación o justificante de la tasa emitido por la administración pública antes de permitir la consolidación de la factura.


* **RF-49 (Ubiquitous) — Estructura en Formatos de Facturación Electrónica (Facturae / Veri*factu):** En generar los archivos XML de facturación electrónica (Facturae) y los registros de facturación de alta (RFA) de Veri*factu, el sistema ubicará las partidas de suplidos dentro del bloque estructurado de importes reembolsables/suplidos (`ReimbursableExpenses`), separados formalmente de los sumatorios de bases imponibles sujetas a gravamen.



---

### Bloque 3: Inalterabilidad Veri*factu (RD 1007/2023), Proformas y Rectificativas

* **RF-12 (State-driven) — Gestión de Borradores y Facturas Proforma:** ANTES de consolidar legalmente una factura, EL SISTEMA permitirá mantener el documento en estado **"Borrador / Factura Proforma"**:


1. La Secretaria o Boss podrá modificar libremente importes, conceptos, formas de cobro o aplicar descuentos.


2. El borrador no devenga impuestos, no consume número correlativo de serie fiscal y exhibirá la marca de agua *"PROFORMA / ESBORRANY — SENSE VALIDESA FISCAL"*.




* **RF-13 (Event-driven) — Emisión Atómica Veri*factu con Bloqueo Pesimista:** CUANDO el usuario hace clic en "Emitir Factura Veri*factu", EL SISTEMA ejecutará bajo transacción atómica ACID con bloqueo pesimista (`SELECT FOR UPDATE` sobre la serie de facturación) la asignación correlativa, cálculo hash SHA-256 y sellado inalterable.


* **RF-14 (Ubiquitous) — Inalterabilidad Absoluta de Facturas Consolidadas:** QUEDA TERMINANTEMENTE PROHIBIDO modificar, editar o eliminar registros de facturas consolidadas bajo la normativa Veri*factu.


* **RF-15 (Event-driven) — Emisión Obligatoria de Facturas Rectificativas:** SI se constata un error material o disconformidad en una factura emitida, ENTONCES EL SISTEMA exigirá la generación obligatoria de una **Factura Rectificativa** (serie independiente `R-2026-XXXX`, referenciando la factura origen y causa formal de rectificación).


* **RF-15.3 (Ubiquitous) — Preservación de Trazabilidad de Conciliación:** La emisión de una factura rectificativa asociada a una factura previamente cobrada no eliminará, desconciliará ni alterará los apuntes bancarios originales registrados en la cuenta `572`, manteniendo inalterado el historial de movimientos de extractos bancarios.


* **RF-15.4 (Event-driven) — Reclasificación a Crédito Comercial Disponible (Cuenta 4309):** Cuando la emisión de una factura rectificativa genere un saldo acreedor vivo a favor del cliente y la Secretaria o Boss seleccione la opción "Mantener como saldo a cuenta", el sistema trasladará este importe de la cuenta `430` a la subcuenta de activo corriente `4309` (*Clientes, saldos a favor por regularización*) mediante un asiento interno, manteniendo el derecho financiero del cliente sin alterar los ingresos ni generar nuevo devengo de IVA.


* **RF-15.5 (Ubiquitous) — Invariabilidad Absoluta de Documentos Rectificativos:** Toda factura rectificativa generada y encadenada criptográficamente bajo Veri*factu es estrictamente inalterable, no editable e imborrable de la base de datos, quedando prohibido cualquier intento de modificación in-place o reversión física del asiento.


* **RF-15.6 (Ubiquitous) — Cálculo de Reembolso sobre el Líquido Neto con Retención:** Cuando se emita una factura rectificativa sobre una factura sometida a retención de IRPF, el sistema fijará el derecho de devolución financiera o saldo a favor del cliente (Cuenta `430`) exclusivamente sobre la base líquida neta resultante ($\Delta\text{Base} + \Delta\text{IVA} - \Delta\text{IRPF}$), bloqueando cualquier propuesta de reembolso que incorpore cuotas de IRPF ya ingresadas a la administración tributaria por el cliente.


* **RF-15.7 (State-driven) — Desviación Contable de Retenciones de Ejercicios Cerrados:** Mientras la factura rectificada pertenezca a un ejercicio fiscal con el Impuesto sobre Sociedades (Modelo 200) ya consolidado, el sistema imputará la contrapartida de la retención regularizada a cuentas de ajuste fiscal (Cuenta `633` / `4752`), impidiendo que el apunte minorante contamine el saldo de anticipos deducibles (Cuenta `473`) del ejercicio corriente sin un registro de auditoría fiscal.


* **RF-15.8 (Event-driven) — Emisión de Series Específicas por Insolvencia (R2 / R3):** Cuando la Secretaria o Boss confirme el expediente de insolvencia, el sistema generará una factura rectificativa asignando la clave oficial correspondiente (`R2` por Concurso de Acreedores o `R3` por Crédito Incobrable - Art. 80 LIVA), ejecutando de forma atómica el asiento de minoración de IVA en la cuenta `477` contra `436` y reajustando el fondo de deterioro de la cuenta `490`.


* **RF-15.9 (State-driven) — Contador Perentorio de Comunicación AEAT y Pack Documental:** Mientras una factura de la serie `R2` o `R3` permanezca en estado emitida, el sistema activará una cuenta atrás visible de 90 días (3 meses) para el envío de la comunicación reglamentaria a la AEAT, ofreciendo la descarga de un paquete comprimido con las facturas en formato PDF/XML y los enlaces a los justificantes judiciales o notariales registrados.


* **RF-16 (State-driven) — Estado de Albaranes Vinculados a Rectificativas:**
1. CUANDO se emita una Factura Rectificativa (sea por sustitución o por diferencias), los albaranes de obra originales vinculados **permanecerán formalmente marcados como facturados**, impidiendo que puedan ser refacturados por duplicado en el flujo ordinario.


2. EL SISTEMA conmutará dichos albaranes al estado **"Editable para Rectificación / Regularización"**, permitiendo que la oficina técnica o administración corrija unidades o precios exclusivamente vinculados a la regularización rectificativa, preservando la trazabilidad de auditoría completa.




* **RF-16.3 (Optional-feature) — Emisión de Devolución Bancaria:** Cuando el usuario seleccione la modalidad de Devolución por Transferencia, el sistema incorporará un pago pendiente al calendario de tesorería previsional y permitirá la generación del archivo de orden de pago SEPA, cancelando el saldo de la cuenta `430` una vez conciliado el movimiento de salida bancaria.


* **RF-16.4 (Ubiquitous) — Exclusión de Factura de Anticipo y Neutralidad Fiscal:** El sistema no emitirá ninguna factura de anticipo ni generará registros de alta Veri*factu por la constitución del saldo en la cuenta `4309`, catalogándolo en la base de datos como crédito dinerario no devengable libre de carga tributaria directa.


* **RF-16.5 (Event-driven) — Compensación Financiera en Facturación Posterior:** Cuando se genere una nueva factura para un cliente que disponga de saldo positivo en la cuenta `4309`, el sistema ofrecerá un botón de acción *"Aplicar crédito disponible"* en la gestión de cobros, ejecutando el asiento de compensación (`4309` a `430`) exclusivamente como movimiento de tesorería para minorar la deuda líquida exigible, sin alterar la base imponible ni la cuota de IVA íntegra de la nueva factura emitida.


* **RF-16.6 (Event-driven) — Emisión de Rectificativa Recursiva (Rectificativa de Rectificativa):** Cuando se requiera corregir un error material, de cálculo o tributario en una factura rectificativa previamente emitida, el sistema permitirá la emisión de una nueva factura rectificativa, incorporando obligatoriamente: la referencia fiscal directa de la rectificativa inmediata que se enmienda, el enlace relacional a la factura ordinaria raíz de la obra y la modalidad de corrección aplicada.


* **RF-17 (Ubiquitous) — Generación Asíncrona de PDF y Custodia Soberana:** EL SISTEMA generará el documento oficial de la factura en PDF de forma asíncrona mediante Celery + ReportLab, custodiándolo en el servidor local soberano (`/docs/<empresa_id>/factures/emeses/`).



---

### Bloque 4: Cuenta de Resultados (P&L), Fiscalidad y Previsión de Cobros

* **RF-18 (Ubiquitous) — Cuenta de Resultados y P&L Analítico en Tiempo Real:** EL SISTEMA calculará y presentará en tiempo real el **Cuenta de Explotación / P&L Analítico** del periodo filtrado, estructurado en:


1. *Ingresos Netos:* Ventas y servicios facturados (Grupo PGC 70 segregado por centros de coste analíticos, excluyendo suplidos).


2. *Consumos de Almacén:* Salidas de material valoradas a Precio Medio Ponderado (PMP) (Cuentas 600/602 ajustadas con variación de existencias Grupo 30).


3. *Costes Directos de Flota y Maquinaria:* Combustible, seguros, mantenimiento y amortizaciones imputadas (Subgrupo PGC 62).


4. *Gastos Generales de Explotación:* Arrendamientos, suministros de sede, seguros y servicios exteriores (Subgrupo PGC 62).


5. *Coste Laboral Real:* Salarios brutos de plantilla técnica y operarios (Cuenta 640) más cuota patronal a la Seguridad Social (Cuenta 642) derivados de las nóminas consolidadas.




* **RF-18.1 (Ubiquitous) — Proyección de Tesorería sobre Saldo Exigible de Cartera:** En el módulo de tesorería previsional, el sistema computará como entrada de caja exclusivamente el saldo líquido pendiente de cobro registrado al vencimiento de la factura (Cuenta `430`), calculado sobre la **Base Neta Liquidada** (Base ejecutada minorada por los anticipos imputados), su cuota de IVA restante, las partidas de suplidos (`554`) y descontando la retención de IRPF soportada (`473`):



$$\text{Cobro Previsto} = \text{Base Neta Liquidada} + \text{Cuota IVA Liquidada} + \text{Suplidos (554)} - \text{Retención IRPF (473)}$$


* **RF-18.2 (State-driven) — Exclusión de Anticipos Consumidos en el Flujo Futuro:** Mientras se proyecte el flujo de caja de una factura final de liquidación que incorpore deducciones de anticipos previos, el sistema excluirá automáticamente de las entradas financieras futuras cualquier base o cuota de IVA correspondiente a anticipos ya cobrados y conciliados en el pasado, evitando la sobreestimación de liquidez.


* **RF-19 (Ubiquitous) — Indicadores Clave de Rentabilidad (KPIs):** EL SISTEMA mostrará como indicadores clave del P&L:



$$\text{Margen Bruto de Obra} = \text{Ventas Netas} - \text{Consumos de Almacén} - \text{Mano de Obra Directa}$$


$$\text{EBITDA Operativo} = \text{Margen Bruto} - \text{Gastos Generales} - \text{Costes de Flota no imputados}$$


$$\text{Resultado de Explotación (EBIT)} = \text{EBITDA} - \text{Dotaciones de Amortización (Cuenta 681)}$$


* **RF-20 (Ubiquitous) — Monitor de Posición Fiscal Trimestral Acumulada:** EL SISTEMA mantendrá un monitor continuo de las obligaciones tributarias acumuladas:


1. *IVA (Modelo 303):* Calculado según RF-20.1.


2. *Retenciones IRPF Acumuladas (Estimación Modelo 111):* Retenciones practicadas sobre nóminas y facturas de profesionales (Cuenta 4751).


3. *Pagos a Cuenta Acumulados (Cuenta 473):* Retenciones soportadas en ventas para minorar la cuota a pagar en los pagos fraccionados (Modelo 130/202).




* **RF-20.1 (Ubiquitous) — Cálculo Canónico de Posición Fiscal de IVA (Modelo 303):** El sistema calculará la posición fiscal líquida de IVA restando del total de cuotas devengadas en la cuenta `477` exclusivamente el saldo de la cuenta de activo corriente **`4720` (IVA soportado deducible efectivamente devengado)**:



$$\text{Cuota Modelo 303} = \sum \text{Cuenta 477} - \sum \text{Cuenta 4720}$$



quedando estrictamente excluido del cálculo el saldo deudor de la subcuenta transitoria `4729` (IVA soportado pendiente de RECC).


* **RF-20.4 (State-driven) — Desglose Analítico del Crédito Fiscal Diferido:** Mientras exista saldo deudor en la cuenta `4729`, el widget de fiscalidad mostrará una tarjeta secundaria informativa (*Crédito Fiscal Diferido RECC*), especificando el importe de IVA soportado que pasará a ser deducible en el Modelo 303 una vez se materialice el pago a los proveedores respectivos.


* **RF-21 (State-driven) — Monitor de Antigüedad de Deuda (*Aging*):** MIENTRAS una factura emitida supere su fecha de vencimiento contractual sin haber registrado cobro bancario en firme, EL SISTEMA la clasificará automáticamente como **Deuda Vencida (Impago)** y la incorporará a la escala de antigüedad del saldo (*Aging*: `< 30 d`, `30-60 d`, `60-90 d`, `> 90 d`).


* **RF-21.4 (State-driven) — Detección Automática de Créditos Recuperables (Art. 80 LIVA):** Mientras una factura supere los 180 días (6 meses) desde su fecha de vencimiento sin cobros conciliados, el monitor analítico de deuda marcará el registro en estado `ELEGIBLE_RECUPERACIO_IVA` y habilitará la acción para iniciar el expediente de rectificativa por crédito incobrable (`Art. 80.Cuatro`).


* **RF-22 (Event-driven) — Filtrado Dinámico desde Aging:** CUANDO el usuario hace clic sobre un tramo del gráfico de Aging, EL SISTEMA filtrará dinámicamente la tabla inferior mostrando exclusivamente las facturas pendientes de cobro comprendidas en ese rango temporal con enlace directo para contactar telefónicamente con el cliente.



---

### Bloque 5: Integración de Compras, Almacén y Amortizaciones de Flota

* **RF-23 (Event-driven) — Triple Conciliación de Compras (*3-Way Matching*):** CUANDO la Secretaria registre la recepción de una factura de proveedor (Spec 003), EL SISTEMA verificará automáticamente la triple conciliación (*3-Way Matching* contra orden de compra y albarán de entrega); una vez confirmada humanamente, se registrará el gasto en la cuenta PGC correspondiente (`600`, `602`, `628`, `622`) y se creará la obligación de pago en tesorería.


* **RF-24 (Ubiquitous) — Valoración Continua de Stock a PMP:** EL SISTEMA consumirá de forma continua la valoración económica de inventario generada en Magatzem (RF-08 Spec 004) calculada a Precio Medio Ponderado (PMP):



$$\text{Valor Total de Stock} = \sum (\text{Unidades Físicas}_i \times \text{PMP}_i)$$


* **RF-25 (Event-driven) — Regularizaciones de Inventario y Mermas:** CUANDO se confirme en almacén una regularización de inventario por merma, daño o rotura justificada mediante volante pericial (RF-27 Spec 003 / Spec 004), EL SISTEMA registrará automáticamente el apunte de pérdida en la cuenta PGC `693` (*Deterioro de existencias*) o `659` (*Pérdidas de gestión corriente*), reflejando el impacto en el P&L mensual.


* **RF-26 (Ubiquitous) — Amortizaciones de Flota y Control de Leasing:** PARA los vehículos y maquinaria inventariados en Flota (Spec 006):


1. El panel computará el **Valor Neto Contable (VNC)** de cada activo:



$$\text{VNC} = \text{Precio de Adquisición (Cuenta 218)} - \text{Amortización Acumulada (Cuenta 2818)}$$


2. En el cierre mensual, EL SISTEMA propondrá el asiento de amortización lineal proporcional:
`Debe: 681 (Dotación a la amortización) ➔ Haber: 2818 (Amortización acumulada elementos de transporte)`.


3. EL SISTEMA detendrá automáticamente las dotaciones de un vehículo cuando su amortización acumulada alcance el precio de adquisición menos su valor residual pactado.


4. En vehículos bajo modalidad de *Leasing financiero*, el sistema segregará en el pago de la cuota la amortización de capital (reducción de deuda cuenta `524`/`174`) frente a los gastos financieros por intereses (cuenta `662`).





---

### Bloque 6: Despesa Laboral, Staging de Nóminas y Calendarios

* **RF-27 (Event-driven) — Ingesta de Nóminas Individuales de los Trabajadores:** EL SISTEMA dispondrá de un cargador e interfaz para la **Subida de Nóminas Individuales de la Plantilla** (archivos PDF de la gestoría laboral o carga estructurada), extrayendo nominalmente: Salario Bruto (`640`), Cuota Patronal (`642`), Cotización Obrera (`476`), IRPF (`4751`) y Salario Líquido (`465`).


* **RF-27.1 (Ubiquitous) — Aislamiento de Remesas en Entorno Staging:** Durante la carga asíncrona individual o masiva de documentos de nómina mediante Celery, el sistema almacenará los datos exclusivamente en tablas de tránsito (staging) bajo el estado `EN_PROCESSAMENT`, garantizando que ningún dato no consolidado modifique los saldos de las cuentas del PGC ni intervenga en los informes financieros.


* **RF-27.2 (Event-driven) — Notificación de Finalización de Procesamiento:** Cuando el último worker de Celery finalice el procesamiento del lote de archivos asignados a una remesa, el sistema cambiará el estado del lote a `ESBORRANY_PENDENT` y ejecutará automáticamente el test de cuadre contable de la partida doble sobre el total agregado.


* **RF-27.3 (Ubiquitous) — Segregación RLS Obligatoria en Tablas de Tránsito:** Las tablas `remesa_nomines` y `staging_nominas_importacio` incorporarán la columna clave `empresa_id` con restricción de clave foránea, `NOT NULL` y RLS activado y forzado (`FORCE ROW LEVEL SECURITY`), aplicando políticas que restrinjan cualquier operación de lectura o escritura exclusivamente a los registros que coincidan con el parámetro de sesión `app.current_empresa_id`.


* **RF-27.4 (Event-driven) — Inyección de Contexto Transaccional en Workers:** Cuando un worker de Celery inicie el procesamiento asíncrono de una nómina o remesa, el sistema ejecutará obligatoriamente el comando `SET LOCAL app.current_empresa_id = :empresa_id` dentro de una transacción SQL activa de `asyncpg` antes de ejecutar cualquier operación DML o consulta sobre las tablas de staging.


* **RF-27.5 (Event-driven) — Pipeline Asíncrono de Cifrado y Persistencia:** Cuando un archivo de nómina sea aceptado por el servicio de carga para su procesamiento en Celery, el sistema ejecutará el cifrado del documento antes de cualquier escritura en el sistema de archivos, generando la extensión `.pdf.enc` y asociando el hash SHA-256 del documento a la tabla de gestión documental de nóminas.


* **RF-27.6 (State-driven) — Descifrado Efímero en Memoria:** Mientras un worker de Celery o un endpoint autorizado de la API requiera leer el contenido de un documento salarial, el descifrado se ejecutará exclusivamente en memoria volátil (`io.BytesIO`), destruyendo el buffer una vez finalizado el parseo o la transmisión telemática, sin dejar copias en claro en directorios temporales (`/tmp`) del sistema operativo.


* **RF-27.7 (Ubiquitous) — Blindaje y Ofuscación Salarial de Alta Dirección:** El sistema incorporará el parámetro booleano `es_alta_direccio` en la ficha de trabajadores, aplicando una política de ofuscación de datos en la API que retorne los importes salariales individuales (bruto, neto, bases y retenciones) como cadenas enmascaradas (`***`) para cualquier sesión con rol Secretaria.


* **RF-27.8 (State-driven) — Descifrado Restringido de PDFs de Gerencia:** Mientras se solicite la descarga o visualización de un archivo `.pdf.enc` de nómina asociado a un perfil de alta dirección, el servicio documental limitará la autorización exclusivamente al rol Boss o a la cuenta del usuario titular, retornando error `403 Forbidden` ante cualquier petición emitida por el rol Secretaria.


* **RF-27.9 (Event-driven) — Bifurcación de Remesas SEPA para Pagos de Dirección:** Cuando se genere el soporte bancario SEPA (Norma 34) de una remesa que contenga empleados marcados como alta dirección, el sistema permitirá dividir la transferencia bancaria en dos archivos de pago segregados (`SEPA_Treballadors.xml` y `SEPA_Direccio.xml`), depositando el archivo de liquidación salarial de directivos exclusivamente en el buzón privado del Boss.


* **RF-28 (Ubiquitous) — Asiento Global Agregado de Remesa Salarial:** El sistema registrará el asiento de nóminas consolidando la partida doble global:

$$\sum (\text{Compte 640} + \text{Compte 642}) = \sum (\text{Compte 476} + \text{Compte 4751} + \text{Compte 465} + \text{Compte 460})$$


* **RF-28.1 (State-driven) — Bloqueo Preventivo de Cierre por Descuadre:** Mientras la suma agregada del Debe no sea estrictamente igual a la del Haber en la remesa de nóminas, el sistema asignará el estado `ERROR_DESQUADRATURA`, bloqueará de forma inmutable la acción de consolidación al libro diario y destacará visualmente la diferencia económica y los trabajadores afectados.


* **RF-28.2 (Event-driven) — Consolidación Atómica al Libro Diario:** Cuando la Secretaria o Boss confirme el registro de una remesa en estado `VALIDADA`, el sistema generará el asiento global al libro diario dentro de una única transacción atómica SQL, cambiando el estado de la remesa a `CONSOLIDADA` y generando simultáneamente las previsiones de pago en tesorería para salarios netos y liquidaciones tributarias.


* **RF-29 (Event-driven) — Planificación Automática de Vencimientos Laborales:** TRAS confirmar el asiento de nóminas, EL SISTEMA planificará de forma automatizada los vencimientos en el calendario de tesorería: salarios netos (último día hábil del mes), Seguridad Social TGSS (último día hábil del mes posterior) y retenciones tributarias.


* **RF-29.3 (Ubiquitous) — Calendario Paramétrico de Vencimiento del Modelo 111:** El sistema programará el vencimiento financiero y las alertas fiscales de liquidación del Modelo 111 (saldo de la cuenta `4751`) distinguiendo automáticamente el período impositivo:


* Períodos 1T, 2T y 3T: El **día 20** del mes posterior al cierre del trimestre natural (abril, julio, octubre).


* Período 4T: El **día 30 de enero** del ejercicio posterior.


* En ambos casos se aplicará la regla de desplazamiento al siguiente día hábil en caso de fin de semana o festivo nacional, adelantando el hito 5 días naturales si la modalidad activa es domiciliación bancaria.




* **RF-29.4 (State-driven) — Acumulación Automática de Dietas Exentas al Modelo 190:** Mientras se genere la información fiscal anual de retenciones, el motor tributario integrará todas las partidas liquidadas en la cuenta `629X` por kilometraje y dietas en el archivo de exportación del Modelo 190 bajo la Clave L, Subclave 01, vinculando los importes acumulados al NIF de cada trabajador acreditado.


* **RF-30 (Ubiquitous) — Cálculo Exacto de Coste Laboral Analítico:** Gracias a la ingesta nominal de salarios y al cruce con las horas efectivas registradas en partes de trabajo de la PWA (Spec 001/008), EL SISTEMA calculará el **Coste Horario Real y Coste Laboral Efectivo por Operario, Cuadrilla y Obra**, permitiendo la medición precisa de rentabilidad técnica.



---

### Bloque 7: Tickets de Gasto, Mitigación de Riesgo Fiscal y Rescisiones

* **RF-31 (Event-driven) — Captura de Gastos desde PWA:** CUANDO un operario en campo fotografía y envía un ticket de gasto desde la PWA móvil (`/operari`), EL SISTEMA registrará el comprobante en la bandeja de **"Tickets Pendientes de Validación"** de `/gestio/comptabilitat`, almacenando la imagen original en `/data/<empresa_id>/tiquets/<any_fiscal>/<mes>/`.


* **RF-31.4 (Ubiquitous) — Selector de Suplido en Captura Móvil:** La PWA de operario incluirá el selector opcional *Taxa / Suplit de Client* en el formulario de subida de tickets, vinculando obligatoriamente la imagen al `Obra_ID` en curso.


* **RF-31.5 (Ubiquitous) — Captura de Kilometraje y Dietas Exentas en PWA:** La PWA de operario incorporará un formulario específico para el registro de kilometraje en vehículo particular, requiriendo fecha, `Obra_ID`, origen, destino, distancia en kilómetros y motivo operativo, calculando el importe resultante al baremo legal exento vigente (0,26 €/km según Orden HFP/792/2023) y generando un justificante documental interno en formato PDF.


* **RF-32 (Ubiquitous) — Distinción de Modalidades de Pago en Gastos:** EL SISTEMA distinguirá preceptivamente entre las dos modalidades de pago: tarjeta de crédito de empresa (conciliada directamente contra cuenta bancaria `572`) o efectivo de bolsillo del trabajador (catalogado como deuda pendiente con el trabajador en cuenta `465`).


* **RF-32.1.1 (Unwanted behavior) — Bloqueo de Finiquito Exclusivo por Justificantes Pendientes:** Si un trabajador en proceso de baja cuenta con tickets de gasto en cola, documentos en staging o solicitudes de anticipo pendientes de validación por Secretaría, el sistema bloqueará la emisión del finiquito definitivo, mostrando la relación de elementos pendientes de resolución administrativa.


* **RF-32.1.2 (Ubiquitous) — Absorción del Saldo Consolidado de Anticipos:** Al procesar el finiquito de un empleado con todos los justificantes previamente resueltos, el sistema imputará automáticamente el saldo deudor consolidado de la cuenta `460` como deducción directa sobre el líquido salarial:



$$\text{Líquido Finiquito} = (\text{Salario Pendiente} + \text{Vacaciones} + \text{Indemnización}) + \text{Gastos Aprobados (465)} - \text{Anticipos Consolidados (460)}$$


* **RF-32.1.3 (State-driven) — Ejecución Atómica del Remanente Deudor:** Mientras el saldo deudor de la cuenta `460` supere el importe líquido de los conceptos salariales devengados en el finiquito, el sistema fijará el líquido a percibir a 0,00 € y transferirá automáticamente la deuda excedente de la cuenta `460` a la subcuenta de deudores `4409.Treballador` dentro de la misma transacción SQL.


* **RF-32.3 (Ubiquitous) — Traslado Automático a Deudor Identificado:** Cuando el resultado del finiquito genere saldo deudor del trabajador por anticipos no cubiertos, el sistema mantendrá activo el derecho de cobro en balance bajo la cuenta `4409` asociada al NIF del extrabajador.


* **RF-32.4 (State-driven) — Bloqueo de Asiento de Pérdida por Rol Administrativo:** Mientras una propuesta de dar de baja el crédito de un extrabajador no haya sido aprobada por el rol Boss, el sistema bloqueará cualquier apunte contable en las cuentas de pérdidas `659` o `678`, denegando la acción con error `403 Forbidden` al rol Secretaria.


* **RF-32.5 (Event-driven) — Autorización Formal de Condonación por el Boss:** Cuando el Boss apruebe el expediente de fallido de una deuda laboral, el sistema exigirá obligatoriamente: selección de causa legal tipificada (Insolvencia, Antieconómico, Acuerdo judicial), texto justificativo (mínimo 30 caracteres) y generación del asiento firmado con ID, timestamp e IP en auditoría.


* **RF-33 (Ubiquitous) — Copilot IA y Mitigación del Riesgo Fiscal en Tickets:**
1. *Extracción OCR:* Copilot IA extraerá emisor, CIF/NIF, fecha, importe total y concepto contable (`628`, `629`, `602`).


2. *Tratamiento del IVA (Art. 97 LIVA):* En facturas simplificadas sin NIF corporativo, la cuota de IVA es 0% deducible y **se integrará íntegramente como mayor importe del gasto en la cuenta 62X**.


3. *Parámetro `Estat_Deducibilitat_IS`:* Soporta los estados *No Deducible* (por defecto, con badge de riesgo y ajuste extracontable positivo en Modelo 200), *Deducible con Justificante* (vinculado a matrícula, empleado u orden) y *Pendiente de Canje*.




* **RF-33.4 (Event-driven) — Conmutación Determinista al Cierre de Ejercicio:** Cuando la Secretaria o Boss ejecute el proceso de Cierre del Ejercicio Fiscal, el sistema cambiará automáticamente el estado de todos los tickets en "Pendiente de canje" a `NO_DEDUIBLE_IS`, integrando su importe a la relación de ajustes extracontables positivos del Modelo 200.


* **RF-33.5 (State-driven) — Alerta Preventiva de Precancillería Fiscal:** Durante los 30 días naturales previos al cierre del ejercicio (1 a 31 de diciembre), el panel mostrará una alerta crítica con el sumatorio de tickets en "Pendiente de canje" para remitir la reclamación urgente de facturas completas a los proveedores.


* **RF-33.6 (Event-driven) — Conversión de Ticket a Partida de Mediación:** Cuando la Secretaria o Boss valide un ticket marcado como tasa o identifique una licencia pagada en nombre del cliente, el sistema permitirá conmutar el destino contable de `62X` a `554` (*Cuentas corrientes por gastos suplidos*), seleccionando el cliente y la obra asociada.


* **RF-33.7 (Event-driven) — Imputación de Gastos sin Factura Comercial:** Cuando la Secretaria apruebe una hoja de kilometraje o dieta de operario, el sistema generará el asiento cargando a gastos de viaje (`Cuenta 629X`) con imputación analítica al `Obra_ID`, y abono a deuda con el trabajador (`Cuenta 465.Treballador`), sin IVA ni retención.


* **RF-34 (Ubiquitous) — Mandato Human-in-the-Loop:** Ningún ticket propuesto por Copilot IA se contabilizará sin la validación administrativa explícita de la Secretaria o Boss tras contrastar la foto del justificante.


* **RF-35 (Event-driven) — Notificación de Descarte de Gastos:** CUANDO un ticket sea rechazado, EL SISTEMA notificará de inmediato a la PWA del operario con el motivo del descarte, quedando registrado en la auditoría del expediente.



---

### Bloque 8: Conciliación Bancaria (Norma 43) y Previsión de Tesorería (Cash Flow)

* **RF-36 (Event-driven) — Desduplicación Norma 43 y Continuidad de Saldos:** EL SISTEMA admitirá la importación de archivos bancarios estándar **Norma 43 (CSB 43)** y formatos Excel/CSV bancarios.


* **RF-36.2 (Ubiquitous) — Huella Criptográfica Multidivisa e Idempotente de Movimientos:** En procesar cualquier archivo Norma 43 o extracto bancario, el sistema calculará el hash SHA-256 de cada apunte integrando el identificador del inquilino, el código ISO 4217 de la divisa y el saldo resultante:



$$\text{Hash\_Moviment} = \text{SHA-256}(\text{empresa\_id} \parallel \text{IBAN} \parallel \text{Divisa\_ISO4217} \parallel \text{Fecha\_Operacion} \parallel \text{Fecha\_Valor} \parallel \text{Signo} \parallel \text{Importe} \parallel \text{Num\_Documento} \parallel \text{Saldo\_Resultant})$$



Si el hash ya existe en la base de datos, el apunte se clasificará como duplicado y se omitirá automáticamente. Asimismo, el sistema cotejará el Saldo Inicial con el último saldo persistido en base de datos, bloqueando la carga si se detecta una brecha temporal.


* **RF-37 (Ubiquitous) — Sugerencias Inteligentes de Conciliación:** EL ASISTENTE COPILOT IA analizará las líneas del extracto y propondrá coincidencias de cobros, pagos a proveedores, liquidaciones de tarjetas y transferencias salariales.


* **RF-37.3 (Ubiquitous) — Idempotencia de Lote mediante Clave Única:** Toda solicitud de conciliación masiva o por bloques irá acompañada de un identificador de idempotencia (`idempotency_key`), creando un registro de seguimiento de lote en la base de datos antes de transferir la ejecución a Celery.


* **RF-37.4 (State-driven) — Transaccionalidad Unitaria por Apunte:** Mientras se ejecute la conciliación de un lote, el sistema aislará cada cruce de movimiento bancario y factura dentro de su propia transacción atómica SQL, garantizando que el bloqueo de un apunte concreto no revierta los apuntes conciliados satisfactoriamente en el mismo lote.


* **RF-38 (Ubiquitous) — Mandato de Validación Humana en Conciliación:** La Secretaria confirmará las coincidencias a 1 clic; **ninguna factura se marcará como cobrada sin validación humana**.


* **RF-38.2 (Event-driven) — Resiliencia ante Desconexión HTTP:** Ante una pérdida de conexión de red durante el procesamiento del lote, el servicio en segundo plano continuará la ejecución de las partidas restantes, ofreciendo al reconectar un informe de estado detallado.


* **RF-38.5 (Event-driven) — Liquidación Automática de Diferencias de Cambio:** Cuando se valide la conciliación entre una factura y un apunte bancario con desajuste provocado por la fluctuación de divisa entre el devengo y la liquidación, el sistema generará automáticamente el asiento compensatorio contra la cuenta `668` (Diferencias negativas) o `768` (Diferencias positivas), saldando la cuenta de terceros (`400` / `430`) a 0,00 €.


* **RF-39 (Ubiquitous) — Curva de Previsión de Tesorería (Cash Flow Forecast):** EL SISTEMA proyectará de forma continua el flujo de caja a 30, 60, 90 días y 12 meses vista, calculando los cobros de cartera exclusivamente sobre el líquido exigible post-retención de la cuenta `430` (RF-18.1).


* **RF-40 (Optional-feature) — Simulación de Escenarios de Liquidez:** EL SISTEMA permitirá simular la resistencia financiera alternando entre tres escenarios (*Base, Pesimista [+30 días de retraso en cobros] y Optimista*), emitiendo alertas automáticas de rotura de caja si el saldo proyectado cae por debajo de 0,00 €.



---

### Bloque 9: Exportación Oficial del Paquete Contable y Gestión de RECC Pasivo

* **RF-41 (Event-driven) — Paquete Oficial de Exportación para Asesoría Externa:** EL SISTEMA compilará con periodicidad mensual o trimestral el paquete PGC compuesto por: Libro Diario estructurado, Libro Registro de Facturas Emitidas (con ISP y retenciones), Libro Registro de Facturas Recibidas y Gastos, y Resumen de Nóminas y Seguridad Social.


* **RF-41.1 (Ubiquitous) — Exportación Multi-formato Nativo del Libro Diario:** El sistema incorporará un selector de formato contable (`A3`, `Contasol`, `Sage 50/200` o `Estándar PGC`), ejecutando el adaptador correspondiente para transformar los asientos en los formatos nativos propietarios (`ENLACE.DAT`/`SUCTA.DAT` para A3 en ASCII, CSV normalizado para Contasol, XML/CSV para Sage), empaquetados en un archivo ZIP.


* **RF-41.2 (Ubiquitous) — Campos Específicos en Libro de Facturas Emitidas:** El Libro Oficial de Facturas Emitidas incorporará columnas dedicadas para la Clave `I` (Inversión del Sujeto Pasivo), Bases No Sujetas/ISP, Base sometida a Retención, % IRPF y Cuota Retenida soportada (Cuenta `473`).


* **RF-41.3 (State-driven) — Régimen Especial del Criterio de Caja Activo (RECC Oficial):** SI la empresa o el cliente están acogidos al RECC (Art. 163 sexies LIVA), EL SISTEMA imprimirá en el PDF la leyenda legal preceptiva, gestionará el IVA devengado en cuentas puente transitorias e incluirá las fechas y medios de pago en los libros de registro.


* **RF-41.4 (Ubiquitous) — Identificación y Bandera de RECC Pasivo:** El sistema incorporará el campo booleano `proveidor_recc` en la ficha de proveedores y cabeceras de facturas recibidas, activando automáticamente el circuito de devengo diferido cuando proceda.


* **RF-41.5 (Event-driven) — Desviación a Cuenta Transitoria de IVA Soportado:** Cuando se contabilice una factura recibida con bandera de RECC pasivo, el sistema imputará la cuota de IVA soportado a la cuenta puente `4729` (*IVA soportado pendiente de criterio de caja*), excluyendo esta cuota de las bases deducibles del Modelo 303 hasta que se registre su pago bancario efectivo.


* **RF-41.6 (Event-driven) — Reclasificación Automática por Pago a Proveedor RECC:** Cuando se registre la liquidación de una factura de proveedor RECC, el sistema trasladará automáticamente el importe proporcional de la cuota de IVA de la cuenta `4729` a la cuenta operativa `4720`, incorporando dicho importe al Modelo 303 del trimestre en que se ejecutó el movimiento bancario.


* **RF-41.7 (Ubiquitous) — Clave de Operación en Libro de Facturas Recibidas:** En generar el Libro Registro Oficial de Facturas Recibidas para la AEAT, el sistema asignará la clave de operación `Z / 07` a las compras de proveedores RECC, cumplimentando las columnas oficiales de fechas de pago y medios utilizados.


* **RF-41.8 (State-driven) — Homogeneización Automática de Longitud de Subcuentas:** Mientras se ejecute la exportación hacia A3 o Contasol, el motor homogeneizará la longitud de todos los códigos contables rellenando con ceros al nivel de subcuenta configurado (por defecto a 8 dígitos).


* **RF-41.9 (Ubiquitous) — Simetría Fiscal en Rectificativas de Proveedores RECC:** Al contabilizar una factura rectificativa emitida por un proveedor RECC (`proveidor_recc = True`), el sistema imputará la regularización de la cuota de IVA contra la cuenta transitoria `4729` hasta el límite del saldo pendiente de pago, bloqueando asientos en la `4720` mientras la cuota de origen no haya sido efectivamente deducida.


* **RF-41.10 (State-driven) — Desglose Mixto ante Facturas RECC Parcialmente Pagadas:** Mientras la factura rectificada tenga liquidación parcial, el motor aplicará la minoración prioritaria sobre el remanente vivo de la cuenta `4729`, e imputará a la `4720` únicamente la fracción que corresponda a importes ya pagados y deducidos en períodos anteriores.


* **RF-42 (Ubiquitous) — Compilación del Archivo ZIP Documental:** EL SISTEMA compilará automáticamente un archivo comprimido ZIP con todos los documentos originales en PDF (facturas emitidas Veri*factu con QR, facturas de compras y fotos de tickets).


* **RF-42.3 (State-driven) — Resolución de Rutas en Archivo ZIP Fiscal:** Mientras se compile el ZIP trimestral para la gestoría, el motor extraerá las facturas de compras desde `/docs/<empresa_id>/factures/rebudes/<any_fiscal>/`, verificando que el hash SHA-256 coincida con el registro de base de datos antes de agregarlas a la carpeta `Facturas_Recibidas/`.


* **RF-43 (Ubiquitous) — Congelación de Período y Registro de Auditoría:** La descarga del paquete PGC registrará un evento formal de auditoría y congelará el período contable para impedir modificaciones involuntarias sin autorización expresa del Boss.



---

### Bloque 10: Seguridad Criptográfica Veri*factu y Registro de Eventos (HAC/1177/2024)

* **RF-44 (Ubiquitous) — Atomicidad Criptográfica por Bloqueo Pesimista:** La asignación del número correlativo fiscal, lectura del hash precedente ($n-1$), cálculo del nuevo hash SHA-256 ($n$) y persistencia del registro de facturación de alta se ejecutarán estrictamente dentro de la misma transacción SQL mediante bloqueo pesimista (`SELECT FOR UPDATE`) sobre la tabla de control de series de facturación.


* **RF-44.4 (Ubiquitous) — Validación Previa de Certificado (*Pre-Flight Check*):** Antes de adquirir el bloqueo pesimista sobre la serie de facturación (`SELECT FOR UPDATE`), el servicio comprobará la vigencia, caducidad y revocación del certificado electrónico tributario, rechazando la operación antes de iniciar la transacción SQL si el certificado no es válido.


* **RF-44.5 (Event-driven) — Rollback Transaccional por Error Criptográfico:** Si durante la transacción atómica de emisión se produce un error en la firma electrónica o validación previa al cierre, el sistema ejecutará un `ROLLBACK` inmediato de la transacción SQL, garantizando que el contador correlativo no se incremente y que el documento permanezca en `ESBORRANY` sin generar saltos en la serie fiscal.


* **RF-45 (State-driven) — Desacoplamiento Idempotente de PDF y Código QR:** Mientras se produzca una caída del proceso o error de renderizado tras el `COMMIT` de la transacción fiscal, el sistema recuperará la factura desde el estado inmutable de base de datos y regenerará el PDF y el código QR de forma idempotente mediante Celery, sin alterar el hash, fecha-hora ni número fiscal asignados.


* **RF-46 (Unwanted behavior) — Bloqueo de Serie por Ruptura de Encadenamiento:** Si la rutina de auditoría de arranque o el motor de emisión detecta una desconexión entre el hash precedente de una factura y el hash real de la factura anterior, o detecta un salto injustificado en la secuencia numérica, el sistema bloqueará de forma inmediata la emisión de nuevas facturas en esa serie y registrará una alerta crítica.


* **RF-50 (Ubiquitous) — Estructura y Encadenamiento del Registro de Eventos SIF:** El sistema persistirá un Registro de Eventos en una tabla específica (`registre_esdeveniments_sif`), dotada de número correlativo secuencial, timestamp UTC, código tipificado según la Orden HAC/1177/2024, contexto en JSONB y encadenamiento criptográfico propio mediante SHA-256 respecto al evento precedente, regido por RLS por `empresa_id`.


* **RF-51 (Event-driven) — Captura Automática de Incidencias de Sistema y Seguridad:** El sistema generará inmediatamente un asiento de evento encadenado ante: arranque (`EV-01`), parada ordenada (`EV-02`), cambio de modalidad Veri*factu o certificados (`EV-03`, `EV-04`), ruptura de cadena hash (`EV-05`), e interrupciones o restablecimientos con los servidores de la AEAT (`EV-06`).


* **RF-52 (State-driven) — Inmutabilidad Estricta y Exportación Oficial de Eventos SIF:** Mientras el sistema esté en funcionamiento, el motor de base de datos bloqueará cualquier modificación o eliminación de registros de eventos consolidados (*append-only*), y dispondrá de un mecanismo de exportación en formato XML/JSON compatible con los esquemas de auditoría tributaria de la AEAT.



---

## Cláusulas Canónicas de Casos Límite y Resiliencia (EDGE-01 a EDGE-28)

| Código | Tipo EARS | Módulo Afectado | Condición de Falla / Escenario Límite | Comportamiento Requerido del Sistema |
| --- | --- | --- | --- | --- |
| **EDGE-01** | *Unwanted behavior* | Facturación | Desviación de $\pm0,01\text{ €}$ o $\pm0,02\text{ €}$ por redondeo de IVA entre líneas y base agrupada. | Ajusta la diferencia a la línea de mayor importe y bloquea la emisión si $\sum \text{Líneas} \neq \text{Cabecera}$. |
| **EDGE-02** | *Event-driven* | Facturación | Base ejecutada de un tipo de IVA inferior al anticipo recibido para dicho tipo ($\text{Base Executada}_k < \text{Base Anticip}_k$). | Acota la deducción a la factura ordinaria y genera automáticamente una factura rectificativa de anticipo por el exceso no consumido. |
| **EDGE-03** | *Unwanted behavior* | Tesorería | El saldo inicial del fichero Norma 43 (registro 11) no concuerda con el último saldo persistido en BD. | Bloquea la carga automática y advierte de una brecha temporal de extractos bancarios no importados. |
| **EDGE-04** | *Unwanted behavior* | Laboral | El saldo deudor por anticipos pendientes de un trabajador dado de baja supera su liquidación de finiquito. | Fija el líquido a 0,00 €, traslada la deuda a deudores (`4409`) y bloquea el pase a pérdidas sin autorización formal del Boss. |
| **EDGE-05** | *Event-driven* | Veri*factu | Corte de comunicación o tiempo de espera agotado (timeout) con la sede telemática de la AEAT. | Marca el envío como `PENDENT_REENVIAMENT` y programa reintentos asíncronos en Celery sin invalidar la factura interna consolidada. |
| **EDGE-06** | *Event-driven* | Fiscal / IS | Recepción de factura completa de un ticket caducado y cerrado como no deducible en un año anterior. | Recupera el IVA en el Modelo 303 del período vigente y genera un ajuste extracontable negativo de reversión en el Modelo 200 del ejercicio en curso. |
| **EDGE-07** | *Event-driven* | Fiscal / IVA | Factura de un proveedor RECC que continúa sin pagarse al llegar al 31 de diciembre del año N+1. | Libera la deducción íntegra de la cuota de IVA soportado (`4729` a `4720`) en el 4T del segundo año fiscal sin alterar la deuda comercial viva en cuenta `400`. |
| **EDGE-08** | *Unwanted behavior* | Facturación | Intento de emitir suplidos sin saldo deudor consolidado en la `554` o sin justificante oficial (`justificant_suplit_url`). | Bloquea la emisión de la factura y exige la tramitación previa del justificante de gasto antes de permitir su repercusión al cliente. |
| **EDGE-09** | *Unwanted behavior* | Tesorería | Intento de desconciliar el cobro bancario de una factura de origen que ha sido rectificada. | Bloquea la desconciliación en cuenta `572` y exige gestionar el crédito financiero como orden de devolución por transferencia o saldo comercial en cuenta `4309`. |
| **EDGE-10** | *Unwanted behavior* | Conciliación | Reintento de validación de un lote bancario por corte HTTP mientras Celery ya procesa la cola. | Rechaza la duplicación mediante el `idempotency_key` y mantiene las partidas conciliadas sin generar nuevos asientos. |
| **EDGE-11** | *Unwanted behavior* | Previsiones | La suma de cobros previstos asignados a una factura supera el saldo deudor vivo de la cuenta `430`. | Detiene la actualización del panel de tesorería y fuerza una reindexación automática contra la tabla de vencimientos. |
| **EDGE-12** | *Unwanted behavior* | Gastos | La lectura OCR detecta que el sujeto pasivo de una tasa tributaria es el cliente final. | Bloquea la contabilización a gasto propio (`629`) y propone su conmutación a cuenta de mediación (`554`). |
| **EDGE-13** | *Unwanted behavior* | Seguridad | Worker de Celery que intenta escribir en tablas de nóminas sin la variable de sesión de inquilino. | Rechazo inmediato de la transacción por infracción de política RLS de base de datos (`empresa_id`). |
| **EDGE-14** | *Unwanted behavior* | Seguridad | Petición de descarga de un archivo de nómina cifrado con discordancia del `empresa_id`. | Bloquea la operación con código `403 Forbidden` y aborta de inmediato la lectura de bytes en disco. |
| **EDGE-15** | *Event-driven* | Seguridad | Arranque del servicio FastAPI o Celery posterior a una caída repentina o reinicio forzado (*crash recovery*). | Registra un evento de anomalía por restablecimiento en el Registro de Eventos inalterable del SIF (`registre_esdeveniments_sif`). |
| **EDGE-16** | *Unwanted behavior* | Facturación | Intento de borrado o modificación destructiva sobre una factura de la serie rectificativa (`R`). | Bloquea la petición y exige canalizar la enmienda mediante la emisión de una segunda factura rectificativa encadenada. |
| **EDGE-17** | *Unwanted behavior* | Facturación | Intento de emitir factura de anticipo utilizando saldos de la cuenta de crédito `4309`. | Bloquea la emisión por riesgo de doble devengo de IVA sobre fondos ya regularizados tributariamente. |
| **EDGE-18** | *Unwanted behavior* | Contabilidad | Caracteres incompatibles con codificación ASCII / ISO-8859-1 al exportar a A3. | Transliteración y saneamiento automático de textos sin interrumpir la generación del archivo `ENLACE.DAT`. |
| **EDGE-19** | *Unwanted behavior* | Fiscal | Abono de proveedor RECC imputado directamente a la cuenta `4720` sin pago previo. | Redirección obligatoria de la minoración de cuota a la cuenta transitoria `4729`. |
| **EDGE-20** | *Unwanted behavior* | Facturación | Intento de devolución bancaria por el importe bruto de una factura con retención de IRPF. | Reajuste del reembolso al valor líquido neto ($\Delta\text{Base} + \Delta\text{IVA} - \Delta\text{IRPF}$). |
| **EDGE-21** | *Unwanted behavior* | Tesorería | Conciliación bancaria multidivisa cerrada sin desglosar diferencias de cambio. | Rechazo de la conciliación si el desajuste no se imputa a las cuentas `668` o `768`. |
| **EDGE-22** | *Unwanted behavior* | Facturación | Intento de emitir factura rectificativa `R3` sin justificante fehaciente de reclamación. | Bloqueo de la emisión por falta de demanda judicial o requerimiento notarial (PDF). |
| **EDGE-23** | *Unwanted behavior* | Gastos | Compensación por kilometraje en vehículo particular superior al baremo exento (> 0,26 €/km). | Segregación automática del exceso como rendimiento dinerario sujeto a IRPF y Seguridad Social (`640`). |
| **EDGE-24** | *Unwanted behavior* | Veri*factu | Certificado electrónico revocado o caducado durante el ciclo de emisión. | Rollback si falla en el *pre-flight check*; estado `PENDENT_REENVIAMENT` si el rechazo ocurre post-commit telemático. |
| **EDGE-25** | *Unwanted behavior* | Documental | Modificación física o corrupción del hash de una factura recibida en el volumen soberano. | Bloqueo de acceso, alerta de alteración documental y registro de anomalía en el Audit Log. |
| **EDGE-26** | *Unwanted behavior* | Seguridad | Intento de visualización o *drill-down* salarial de alta dirección por el rol Secretaria. | Enmascaramiento de valores individuales (`***`) y bloqueo de descarga de archivos PDF salariales. |
| **EDGE-27** | *Unwanted behavior* | Facturación | Factura agrupada multiobra que combina Inversión del Sujeto Pasivo (Art. 84) e IVA ordinario. | Segrega bloques fiscales en Veri*factu (casilla 122 vs bases generales) y acota la leyenda legal en el PDF exclusivamente a las líneas técnicas afectadas. |
| **EDGE-28** | *Unwanted behavior* | Facturación | Rectificación de una factura comercial que incorporaba partidas de suplidos (cuenta `554`). | Bloquea la anulación del suplido por defecto salvo que se acredite formalmente la devolución de la tasa por la administración pública. |

---

## Requisitos No Funcionales (RNF)

* **Cumplimiento Legal Veri*factu (RD 1007/2023 y HAC/1177/2024):** Inalterabilidad, trazabilidad, registro de alta en tiempo de emisión, firma hash SHA-256 encadenada, código QR bidimensional oficial y registro de eventos inalterable del SIF.


* **Segregación Estricta Zero-Trust:** Ocultación en frontend del menú contable y bloqueo a nivel de API (`403 Forbidden`) a usuarios con rol `Ingeniero` o inferior. Acceso técnico autorizado únicamente a través de `/api/v1/gestio/obres/{id}/factures` mediante `FacturaConsultaTecnicaDTO` filtrado.


* **RNF-STO-01 (Ubiquitous) — Almacenamiento Seguro y Soberano:** Eliminación absoluta de AWS S3. Todos los documentos residen en volúmenes locales del servidor y Hetzner Cloud en Alemania bajo `/docs/<empresa_id>/factures/emeses/`, `/docs/<empresa_id>/factures/rebudes/<any_fiscal>/`, `/data/<empresa_id>/tiquets/<any_fiscal>/<mes>/`, `/docs/<empresa_id>/nominas/<any>/<mes>/` y `/data/<empresa_id>/banc/<any_fiscal>/`, con copias de seguridad automáticas cada domingo.


* **RNF-STO-02 (Ubiquitous) — Estructura del Directorio Soberano de Nóminas:** El sistema almacenará los archivos de nóminas y remesas salariales exclusivamente en el servidor Hetzner a la UE bajo la ruta canónica `/docs/<empresa_id>/nominas/<any>/<mes>/`, con nomenclatura segura en disco `<remesa_id>_<treballador_id>_<sha256_fragment>.pdf.enc`.


* **RNF-STO-03 (Ubiquitous) — Directorio Canónico de Facturas Recibidas:** El sistema alojará los documentos PDF originales de facturas de compra y gasto de proveedores exclusivamente en la ruta local soberana `/docs/<empresa_id>/factures/rebudes/<any_fiscal>/`, asociando el hash SHA-256 para garantizar la inmutabilidad física en disco.


* **RNF-SEC-03 (Ubiquitous) — Cifrado en Reposo de Nóminas (Envelope Encryption):** Todos los archivos PDF de nóminas persistidos en disco estarán cifrados en reposo mediante el estándar AES-GCM de 256 bits, utilizando una clave de cifrado de datos (DEK) única por documento, conservada cifrada en PostgreSQL mediante la clave maestra (KEK) corporativa.


* **Procesamiento Asíncrono:** La generación de PDFs con ReportLab, la extracción OCR con Copilot IA y la ingesta de nóminas se ejecutan en segundo plano con Celery + Redis, respondiendo la API web en menos de 250 ms.


* **Privacidad y Protección de Datos (RGPD):** Cuentas bancarias de clientes y datos salariales de empleados se almacenan cifrados con clave de aplicación.


* **Diseño Camaleón:** La interfaz web utiliza variables CSS HSL dinámicas (`--color-primary`, `--color-secondary`), con estados de semáforo universales (Verde Cobrado, Rojo Vencido/Impago, Ámbar Pendiente).



---

## Fuera de Alcance

* No realiza cálculos laborales internos de nóminas desde cero (convenios, IRPF escalonado, bajas por IT y MEI se calculan en la gestoría laboral externa y se ingieren como nóminas individuales según RF-27).


* No confecciona la Memoria Anual ni el asiento de cierre/apertura oficial del Registro Mercantil (se delega en la gestoría externa a través del paquete PGC RF-41).


* No realiza presentación telemática con certificado digital ante la sede electrónica de la AEAT (genera las bases y cálculos para que la gestoría presente los modelos oficiales).


* No permite modificación manual o eliminación de facturas definitivas Veri*factu (exige Factura Rectificativa).



---

## Criterios de Finalización (Definition of Done)

1. **Criterio 1 de la Definition of Done (DoD):** Todos los requisitos funcionales (**RF-01 a RF-52**) y todas las cláusulas de casos límite (**EDGE-01 a EDGE-28**) deben contar con una correspondencia mínima de un test unitario o de integración en la suite de pruebas automatizada, ejecutado en verde contra base de datos real con RLS activo y sin datos simulados (*Zero Mock Data*).


2. Implementación de la Opción B: hub de facturación legal Veri*factu, control analítico de costes, Cash Flow y paquete de exportación estructurada PGC para gestoría externa (A3, Sage, Contasol).


3. Segregación rigurosa de roles: Ingeniero bloqueado en API de contabilidad (`403 Forbidden`) y sin opción en menú web, con acceso desacoplado por router de obras mediante `FacturaConsultaTecnicaDTO` filtrado.


4. Circuito documental completo: Proformas/Borradores editables ➔ Facturas definitivas inmutables (SHA-256 + QR) ➔ Facturas Rectificativas independientes (`R-2026-XXXX`) con albaranes marcados como facturados pero en estado editable para rectificación, e invariabilidad de rectificativas recursivas.


5. Modelo de doble nivel para facturación agrupada multiobra: Cabecera única de deuda de cliente (`430`) y líneas imputadas analíticamente a `70` con `Centre_de_Cost_ID` y `Obra_ID`.


6. Desacoplamiento explícito entre el Criterio de Caja Analítico (vista en memoria para el dashboard) y el Régimen Especial del Criterio de Caja fiscal (RECC - art. 163 sexies y 163 decies LIVA).


7. Deducción legal acotada de anticipos por bloques fiscales (*Bucket Matching*) para presupuestos con tipos mixtos de IVA (10% y 21%), bifurcando automáticamente a factura rectificativa si la obra final es inferior al anticipo.


8. Regla oficial de redondeo de IVA de la AEAT (`ROUND_HALF_UP` sobre sumatorio agrupado) con reconciliación analítica de céntimos en líneas.


9. Gestión de Inversión del Sujeto Pasivo (Art. 84.U.2.f LIVA), Partidas de Suplidos en cuenta de mediación `554` y Retenciones IRPF Soportadas en cuenta de activo `473`.


10. Ingesta de nóminas individuales en entorno staging aislado con RLS forzado (`FORCE ROW LEVEL SECURITY`), almacenamiento bajo Envelope Encryption (AES-256-GCM), blindaje de salarios de alta dirección, validación de partida doble agregada y consolidación atómica al libro diario.


11. Mitigación del riesgo fiscal en tickets de operarios: IVA 0% deducible sin NIF integrado a gasto en cuenta 62X, selector de suplidos en PWA, registro de partes de kilometraje (0,26 €/km), parámetro `Estat_Deducibilitat_IS` con pase automático a no deducible al cierre fiscal, y alerta preventiva en diciembre.


12. Circuito de bloqueo de finiquito en bajas laborales con absorción de la cuenta `460`, trasvase automático a cuenta `4409` y reserva exclusiva de condonación a pérdidas al rol `Boss`.


13. Conciliación Norma 43 con algoritmo de desduplicación por huella SHA-256 multidivisa, verificación de continuidad de saldos, transaccionalidad unitaria por apunte y liquidación de diferencias de cambio (`668`/`768`).


14. Arquitectura de seguridad Veri*factu con bloqueo pesimista en base de datos (`SELECT FOR UPDATE`), desacoplamiento Outbox para generación de PDF/QR, detección de rupturas de cadena y Registro de Eventos inalterable del SIF (Orden HAC/1177/2024).


15. Principio de Cero Datos Ficticios (*Zero Mock Data*) con Estado Día 0 real garantizado.


16. Almacenamiento seguro y soberano en Hetzner Alemania (`/docs/` y `/data/`) sin servicios externos cloud (cero AWS S3).


17. Aislamiento multi-inquilino garantizado mediante RLS a nivel de base de datos (`empresa_id`).



---

## Matriu de Traçabilitat 1:1 i Protocol d'Execució de Tests DoD

### 1. Matriu de Requisits Funcionals (RF-01 a RF-52)

| Codi RF | Àmbit Operatiu | Objectiu Tècnic Verificable | Assert / Criteri de Validació DoD (Zero-Mock) |
| --- | --- | --- | --- |
| **RF-01** | Analítica | Barra de control temporal y filtros globales reactivos. | Persistencia de estado y reactividad en paneles. |
| **RF-02** | Analítica | Criterio de Caja analítico en memoria desacoplado del RECC. | Verificación de 0 mutaciones en Libro Diario / IVA. |
| **RF-03** | Facturación | Modelo de doble nivel (Cabecera `430` vs Líneas analíticas `70`). | `Factura_Capcalera.obra_id IS NULL`, FK en detalle. |
| **RF-04** | Sistema | Estado Día 0 real sin datos ficticios (*Zero Mock Data*). | Validación de 0 registros con UI vacía funcional. |
| **RF-05** | Seguridad | Bloqueo absoluto de API (`403`) para rol Ingeniero en finanzas. | Test de intrusión HTTP devolviendo `403 Forbidden`. |
| **RF-05.1** | Fiscal | Inversión del Sujeto Pasivo (Art. 84.U.2.f LIVA) y leyenda PDF. | Cuota IVA 0 € y asiento Deber `430` a Haber `705`. |
| **RF-05.2** | Fiscal | Retenciones IRPF soportadas imputadas a cuenta de activo `473`. | Prohibición estricta de apunte en cuenta `4751`. |
| **RF-05.3** | Técnico | Desacoplamiento de consulta técnica (`/gestio/obres/{id}/factures`). | Canalización técnica independiente sin cuentas PGC. |
| **RF-05.4** | Técnico | Serialización mediante `FacturaConsultaTecnicaDTO`. | Purgado de márgenes, costes y cuentas bancarias. |
| **RF-05.5** | Seguridad | Bloqueo de acceso a facturas de obras no asignadas al técnico. | Reintento denegado con código `403 Forbidden`. |
| **RF-06** | Producción | Entrada de albaranes cerrados a bandeja de facturación. | Detección reactiva tras firma de supervisor. |
| **RF-07** | Facturación | Facturación agrupada y distribución proporcional de cobros. | Coeficiente lineal $k$ aplicado por línea de detalle. |
| **RF-08** | Fiscal | Precisión intermedia (4 dec.) y redondeo agrupado de IVA. | `ROUND_HALF_UP` en bases y ajuste en línea mayor. |
| **RF-09** | Fiscal | Factura de anticipo con desglose fiscal (*Bucket Matching*). | Prorrateo por peso relativo en IVA mixto (10/21%). |
| **RF-10** | Fiscal | Deducción acotada de anticipo por tipo impositivo en liquidación. | Límite por bloque y prohibición de saldos negativos. |
| **RF-11** | Facturación | Referencia legal obligatoria a facturas de anticipo deducidas. | Inclusión de número y fecha en PDF y XML. |
| **RF-12** | Facturación | Gestión de borradores y facturas proforma sin validez fiscal. | Documentos editables sin correlativo ni devengo. |
| **RF-13** | Veri*factu | Emisión atómica con bloqueo pesimista (`SELECT FOR UPDATE`). | Transacción ACID sin solapamiento concurrente. |
| **RF-14** | Veri*factu | Inalterabilidad absoluta de facturas definitivas consolidadas. | Rechazo de `UPDATE` o `DELETE` en BD. |
| **RF-15** | Facturación | Emisión de facturas rectificativas ordinarias (serie `R`). | Asiento a cuenta `708` con minoración de IVA `477`. |
| **RF-15.4** | Tesorería | Traspaso de saldos rectificados a favor a crédito en `4309`. | Aislamiento de cuenta `438` sin devengo de IVA. |
| **RF-15.5** | Veri*factu | Invariabilidad de facturas rectificativas encadenadas. | Imposibilidad de borrado; enmienda vía rectificativa. |
| **RF-15.6** | Tesorería | Cálculo de devolución neta minorando retenciones de IRPF. | Límite financiero: $\Delta\text{Base} + \Delta\text{IVA} - \Delta\text{IRPF}$. |
| **RF-15.7** | Fiscal | Regularización de retenciones de años cerrados vía ajuste `633`. | Blindaje de cuenta `473` del ejercicio en curso. |
| **RF-15.8** | Concursal | Series específicas por insolvencia judicial (`R2` y `R3`). | Minoración de `477` contra cuenta `436` y provisión `490`. |
| **RF-15.9** | Fiscal | Contador perentorio de 90 días para comunicación a la AEAT. | Pack documental zip compilado con autos y burofax. |
| **RF-16** | Facturación | Estado editable de albaranes vinculado a facturas rectificativas. | Albarán bloqueado para facturación ordinaria. |
| **RF-16.5** | Tesorería | Compensación automática de crédito de la `4309` en ventas. | Minoración de cobro sin alterar bases imponibles. |
| **RF-16.6** | Veri*factu | Emisión de rectificativa de rectificativa (recursiva). | Doble puntero: factura inmediata y factura raíz. |
| **RF-17** | Documental | Generación asíncrona de PDF oficial y QR mediante Celery. | Custodia soberana en disco local sin servicios ajenos. |
| **RF-18** | Analítica | Cálculo en tiempo real de la Cuenta de Explotación (P&L). | Desglose PGC: 70, 600/602, 62, 640/642 y 681. |
| **RF-18.1** | Tesorería | Proyección de cobros basada en la Base Neta Liquidada. | Exclusión de anticipos cobrados en el pasado. |
| **RF-19** | Analítica | Cuadro de mando con ratios KPI: Margen, EBITDA y EBIT. | Concordancia matemática estricta con el Libro Mayor. |
| **RF-20** | Fiscal | Monitor de posición fiscal trimestral de IVA (`477` - `4720`). | Exclusión estricta de cuenta puente RECC `4729`. |
| **RF-20.4** | Fiscal | Desglose informativo segregado del crédito diferido RECC. | Visualización de bolsa fiscal pendiente de pago. |
| **RF-21** | Cartera | Monitor de vencimientos y escala de antigüedad (*Aging*). | Segmentación de impagos: <30, 30-60, 60-90 y >90 días. |
| **RF-21.4** | Fiscal | Detección automática de créditos incobrables recuperables. | Activación a los 6 meses de impago continuado. |
| **RF-22** | Cartera | Filtrado dinámico interactivo desde tramos de Aging. | Vista detallada con enlace directo a contacto de cliente. |
| **RF-23** | Compras | Triple conciliación documental de facturas de proveedores. | *3-Way Matching* (Factura, Pedido, Albarán). |
| **RF-24** | Almacén | Consumo continuo de valoración de stock a PMP (Spec 004). | Integración del coste medio ponderado en consumos. |
| **RF-25** | Almacén | Registro de mermas y roturas con impacto en P&L (`693`/`659`). | Asiento contable automático tras volante pericial. |
| **RF-26** | Flota | Amortización lineal mensual de maquinaria y vehículos (Spec 006). | Dotación `681` a `2818` y control de leasing (`524`/`662`). |
| **RF-27** | Laboral | Ingesta de nóminas individuales con segregación RLS en staging. | Parsing nominal aislado con RLS en background. |
| **RF-27.5** | Seguridad | Envelope Encryption en reposo (AES-256-GCM) de nóminas. | Almacenamiento `.pdf.enc` y gestión KEK/DEK. |
| **RF-27.7** | Seguridad | Blindaje salarial y ofuscación de datos de Alta Dirección. | Retorno de `***` en API para rol Secretaria. |
| **RF-28** | Laboral | Asiento global agregado de remesa salarial al Libro Diario. | Cuadre de partida doble: $640+642 = 476+4751+465+460$. |
| **RF-29** | Fiscal | Calendario de tesorería y vencimiento 4T a 30 de enero. | Adaptación de plazos oficiales TGSS y Modelo 111. |
| **RF-30** | Analítica | Cálculo exacto de coste horario real por cuadrilla y obra. | Cruce de horas reales PWA con costes laborales. |
| **RF-31** | Gastos | Captura de tickets, suplidos y kilometraje (0,26 €/km) en PWA. | Generación de evidencias y justificaciones en campo. |
| **RF-32** | Laboral | Bloqueo preventivo de finiquitos y absorción de cuenta `460`. | Deducción directa sin dependencias circulares. |
| **RF-32.3** | Laboral | Reubicación automática de deuda laboral a deudores `4409`. | Conservación del derecho de cobro en activo. |
| **RF-32.5** | Laboral | Condonación a pérdidas (`659`/`678`) reservada al rol Boss. | Causa tipificada, motivación y registro de auditoría. |
| **RF-33** | Gastos | Mitigación de riesgo fiscal en tickets y conmutación en cierre. | IVA a mayor gasto (62X) y pase a no deducible en IS. |
| **RF-33.6** | Gastos | Conversión de tickets de tasas a suplidos de clientes (`554`). | Desvío del P&L propio a cuenta de mediación. |
| **RF-34** | Gastos | Mandato *Human-in-the-Loop* en validación administrativa. | Prohibición de contabilización automática sin firma. |
| **RF-35** | Gastos | Notificación y trazabilidad de tickets o gastos rechazados. | Descarte con causa motivada y notificación reactiva a PWA. |
| **RF-36** | Conciliación | Ingesta Norma 43 con hash determinista multidivisa. | Detección de duplicados con ISO 4217, saldo final y RLS. |
| **RF-37** | Conciliación | Conciliación bancaria masiva con transaccionalidad unitaria. | Aislamiento atómico de errores apunte por apunte. |
| **RF-38** | Conciliación | Liquidación de diferencias de cambio en divisas (`668`/`768`). | Cuadre a 0,00 € del saldo vivo deudor/acreedor. |
| **RF-39** | Tesorería | Proyección de Curva de Cash Flow a 30, 60, 90 días y 12 meses. | Modelización previsional sobre cartera líquida real. |
| **RF-40** | Tesorería | Simulación de escenarios de liquidez y alertas de rotura. | Evaluación paramétrica (Base, Pesimista, Optimista). |
| **RF-41** | Enlace | Paquete de exportación del Libro Diario adaptado a A3, Sage y Contasol. | Adaptadores de formato con longitud de cuenta homogénea. |
| **RF-41.5** | Fiscal | Circuito de IVA diferido en RECC pasivo (cuenta `4729`). | Exclusión del Modelo 303 hasta el pago al proveedor. |
| **RF-41.9** | Fiscal | Simetría fiscal en rectificativas de proveedores RECC. | Minoración exclusiva de la `4729` en facturas impagadas. |
| **RF-42** | Enlace | Compilación del archivo ZIP trimestral con PDFs soberanos. | Extracción y validación hash en `/docs/<id>/factures/`. |
| **RF-43** | Enlace | Congelación de período y registro de auditoría en descarga PGC. | Bloqueo de mutaciones contables y registro inmutable en auditoría. |
| **RF-44** | Veri*factu | Bloqueo pesimista concurrente y comprobación de certificado. | *Pre-flight check* y rollback en caso de fallo criptográfico. |
| **RF-45** | Veri*factu | Encadenamiento criptográfico continuo de registros de alta. | `Hash_N = SHA-256(NIF \| Num_Factura \| Data \| Total \| Hash_Ant)`. |
| **RF-46** | Veri*factu | Detección de rupturas de cadena y bloqueo de serie fiscal. | Auditoría de integridad con parada preventiva de emisión. |
| **RF-47** | Facturación | Segregación de suplidos al 0% de IVA e imputación a la `554`. | Exclusión de bases imponibles sujetas a gravamen. |
| **RF-48** | Facturación | Prohibición de margen comercial o descuento en suplidos. | Comprobación 1:1 contra justificante tributario oficial. |
| **RF-49** | Veri*factu | Soporte de partidas reembolsables en esquema XML Facturae. | Estructura bajo etiqueta `ReimbursableExpenses`. |
| **RF-50** | Auditoría | Persistencia inalterable del Registro de Eventos del SIF. | Tabla `append-only` con encadenamiento SHA-256 propio. |
| **RF-51** | Auditoría | Registro automático de incidencias (`EV-01` a `EV-07`). | Trazabilidad de arranques, cortes AEAT y claves. |
| **RF-52** | Auditoría | Exportación oficial del log de eventos para inspección AEAT. | Formato JSON/XML compatible con requerimientos tributarios. |

---

### 2. Matriu de Casos Límit (EDGE-01 a EDGE-28)

| Codi EDGE | Tipus EARS | Mòdul | Vector de Fallada / Escenari d'Estrès | Criteri d'Aprovació DoD (Zero-Mock) |
| --- | --- | --- | --- | --- |
| **EDGE-01** | *Unwanted* | Facturación | Desviación de $\pm0,01\text{ €}$ por redondeo de IVA entre líneas y base agrupada. | Ajuste automático a la línea de mayor importe; bloqueo si $\sum \text{Líneas} \neq \text{Cabecera}$. |
| **EDGE-02** | *Event-driven* | Facturación | Base ejecutada inferior a la bestreta cobrada por tipo de IVA. | Deducción acotada a la factura ordinaria y emisión de borrador de rectificativa de anticipo. |
| **EDGE-03** | *Unwanted* | Tesorería | Desalineación del saldo inicial del archivo Norma 43 con el histórico. | Bloqueo de la ingesta del archivo y alerta de ausencia de extractos intermedios. |
| **EDGE-04** | *Unwanted* | Laboral | Anticipos pendientes (`460`) que superan el líquido del finiquito de un empleado. | Líquido fijado a 0,00 € y traslado automático del remanente a deudores (`4409`). |
| **EDGE-05** | *Event-driven* | Veri*factu | Corte de conectividad SOAP o tiempo de espera agotado con la AEAT. | Factura consolidada como emitida; envío a `PENDENT_REENVIAMENT` en Celery. |
| **EDGE-06** | *Event-driven* | Fiscal | Factura completa recibida de un ticket cerrado no deducible en año previo. | Deducción de cuota en el Modelo 303 vigente y ajuste extracontable negativo en el Modelo 200. |
| **EDGE-07** | *Event-driven* | Fiscal | Factura de proveedor RECC impagada a 31 de diciembre del año N+1. | Liberación forzada de la deducción de IVA (`4729` a `4720`) sin alterar la deuda en cuenta `400`. |
| **EDGE-08** | *Unwanted* | Facturación | Intento de emitir suplidos sin saldo deudor en `554` o sin justificante oficial. | Bloqueo de la emisión de la factura hasta registrar y validar el gasto de soporte. |
| **EDGE-09** | *Unwanted* | Tesorería | Intento de desconciliar el cobro bancario de una factura ya rectificada. | Bloqueo de la acción en cuenta `572`; gestión obligatoria como devolución o crédito en `4309`. |
| **EDGE-10** | *Unwanted* | Conciliación | Petición repetida de validación de conciliación por corte HTTP. | Descarte idempotente por clave transaccional sin duplicar asientos contables. |
| **EDGE-11** | *Unwanted* | Previsiones | Suma de cobros previstos que supera el saldo deudor de la cuenta `430`. | Parada de la actualización del panel de tesorería y reindexación contra vencimientos. |
| **EDGE-12** | *Unwanted* | Gastos | Ticket de tasa donde el sujeto pasivo tributario identificado es el cliente final. | Bloqueo de la imputación a gasto propio (`629`) y reasignación a la cuenta `554`. |
| **EDGE-13** | *Unwanted* | Laboral | Worker de Celery que intenta escribir en staging de nóminas sin contexto RLS. | Rechazo transaccional por violación de política de seguridad RLS (`empresa_id`). |
| **EDGE-14** | *Unwanted* | Seguridad | Petición de descarga de nómina cifrada con discordancia de `empresa_id`. | Bloqueo inmediato de la descarga con respuesta `403 Forbidden`. |
| **EDGE-15** | *Event-driven* | Seguridad | Reinicio de FastAPI o Celery posterior a una caída imprevista (*crash*). | Escritura automática del evento de anomalía por restablecimiento en el Audit Log. |
| **EDGE-16** | *Unwanted* | Facturación | Intento de borrado físico o modificación sobre una factura rectificativa emitida. | Bloqueo fiscal de la operación; obligatoriedad de emitir una nueva rectificativa encadenada. |
| **EDGE-17** | *Unwanted* | Facturación | Intento de emitir factura de anticipo utilizando saldos de la cuenta de crédito `4309`. | Bloqueo de emisión por riesgo de doble devengo de IVA sobre fondos ya regularizados. |
| **EDGE-18** | *Unwanted* | Contabilidad | Caracteres incompatibles con codificación ASCII / ISO-8859-1 al exportar a A3. | Transliteración y saneamiento automático de textos sin interrumpir la generación. |
| **EDGE-19** | *Unwanted* | Fiscal | Abono de proveedor RECC imputado directamente a la `4720` sin pago previo. | Redirección obligatoria de la minoración de cuota a la cuenta transitoria `4729`. |
| **EDGE-20** | *Unwanted* | Facturación | Intento de devolución bancaria por el importe bruto de una factura con retención. | Reajuste del reembolso al valor líquido neto ($\Delta\text{Base} + \Delta\text{IVA} - \Delta\text{IRPF}$). |
| **EDGE-21** | *Unwanted* | Tesorería | Conciliación bancaria multidivisa cerrada sin desglosar diferencias de cambio. | Rechazo de la conciliación si el desajuste no se imputa a cuentas `668` o `768`. |
| **EDGE-22** | *Unwanted* | Facturación | Intento de emitir rectificativa `R3` sin justificante fehaciente de reclamación. | Bloqueo de la emisión por falta de certificado judicial o requerimiento notarial. |
| **EDGE-23** | *Unwanted* | Gastos | Compensación por kilometraje en vehículo particular superior a 0,26 €/km. | Segregación del exceso a retribución dineraria sujeta a IRPF y Seguridad Social (`640`). |
| **EDGE-24** | *Unwanted* | Veri*factu | Certificado electrónico revocado o caducado durante el ciclo de firma. | Rollback si falla al inicio; estado `PENDENT_REENVIAMENT` si falla post-consolidación. |
| **EDGE-25** | *Unwanted* | Documental | Modificación física o corrupción del hash de una factura recibida en disco. | Bloqueo de acceso, alerta de alteración documental y registro en el Audit Log. |
| **EDGE-26** | *Unwanted* | Seguridad | Intento de visualización o desglose salarial de alta dirección por rol Secretaria. | Enmascaramiento de valores individuales (`***`) y bloqueo de descarga de archivos PDF. |
| **EDGE-27** | *Unwanted* | Facturación | Factura agrupada multiobra que combina Inversión del Sujeto Pasivo e IVA ordinario. | Segregación estructurada en XML (ISP 0% casilla 122 vs bases generales) y acotación de leyenda en PDF. |
| **EDGE-28** | *Unwanted* | Facturación | Rectificación de factura comercial que incorporaba suplidos (cuenta `554`). | Bloqueo de anulación del suplido por defecto salvo justificación de devolución pública formal. |

---

### 3. Protocol d'Execució dels Tests de la DoD

Para considerar completo el desarrollo de cualquier funcionalidad vinculada a esta especificación, la suite de pruebas automatizadas debe cumplir las siguientes condiciones estructurales:

* **Zero-Mock Policy:** Queda terminantemente prohibido simular comportamientos de base de datos mediante objetos simulados (*mocks*). Todos los tests deben ejecutarse contra instancias reales de PostgreSQL aisladas en contenedores efímeros.


* **RLS Activo en Cada Prueba:** Cada test debe abrir una sesión de base de datos con un rol sin privilegios de superusuario, inyectando previamente `SET LOCAL app.current_empresa_id = :uuid` para certificar que ninguna consulta devuelva registros de otras empresas.


* **Integridad de Transacciones Asíncronas:** Las pruebas que involucren workers de Celery deben ejecutarse en modo sincronizado (`CELERY_TASK_ALWAYS_EAGER = True`) o mediante colas de test dedicadas, validando la persistencia final del estado y el vaciado de buffers de memoria volátil.


* **Verificación Criptográfica:** Los tests de las series Veri*factu y Registro de Eventos deben recalcular independientemente la cadena de hashes SHA-256 sobre los registros insertados para certificar la ausencia total de alteraciones o saltos en la secuencia correlativa.