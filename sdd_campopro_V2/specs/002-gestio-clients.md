# Spec 002 — Módulo de Gestión de Clientes (/gestio/clients)

## Contexto y objetivo
El módulo de Gestión de Clientes es el directorio maestro de las entidades contratantes (particulares, empresas, comunidades de regantes o fincas agrícolas) y el registro central de sus instalaciones, fincas geolocalizadas y expediente histórico. 

Resuelve la necesidad de gestionar con precisión fiscal, bancaria y técnica tanto la sede/oficina física del cliente como sus múltiples fincas rurales o acometidas técnicas (identificadas mediante SIGPAC y coordenadas GPS), sus planos técnicos asociados con enlace a `/gestio/planols`, su canal de comunicación directa (vía Telegram o canales alternativos de email/teléfono), su historial de hojas de trabajo con reportes fotográficos de obra e incidencias, y sus condiciones de cobro y facturación unitaria, garantizando una trazabilidad comercial inalterable (imposibilidad de borrado si existen registros de trabajo, presupuestos o transacciones comerciales previas).

---

## Usuarios / actores y Matriz de Acceso (Zero-Trust)
El backend garantiza el aislamiento multi-inquilino (RLS) y la segregación estricta de permisos por rol:

- **Boss (Gerencia / Propietario):** Acceso total e irrestricto a la consulta, alta manual, importación masiva CSV, edición de clientes, fincas, planos, historial de trabajos con fotos, canal de comunicaciones, **datos bancarios y de cobro (IBAN, forma de pago, descuentos y mandatos SEPA)**, y resumen económico completo con redirección a `/gestio/comptabilitat`.
- **Ingeniero / Supervisor Técnico:** Acceso a la consulta y búsqueda de clientes, gestión de fincas/sedes, planos técnicos asociados en `/gestio/planols`, consulta de expedientes técnicos, apertura de popups con hojas de trabajo, galería fotográfica de obras e incidencias, materiales con enlace a proveedor, canal de comunicaciones, lanzamiento de nuevas tareas vinculadas (`/gestio/feines/crear?clientId=`) y **búsqueda/apertura de facturas y albaranes unitarios del cliente para soporte técnico**.  
  **Bloqueo estricto a nivel de API:** El payload devuelto por el backend omite por completo los **datos bancarios (IBAN, cuenta, mandatos de domiciliación)** y los agregados de margen o rentabilidad acumulada de la cuenta.
- **Secretaria / RRHH:** Acceso total al directorio de clientes, altas manuales, importación masiva CSV, gestión de datos fiscales, **gestión completa de datos de cobro (cuentas bancarias, formas de pago, descuentos y autorizaciones de domiciliación SEPA)**, planos, canal de comunicaciones y consulta de facturas de clientes, gestionando la emisión y cobros mediante redirección al centro único de facturación en `/gestio/comptabilitat`.

---

## Historias de usuario
- **H1:** Como *Ingeniero o Secretaria*, quiero buscar clientes en tiempo real por Nombre/Razón Social, NIF o Municipio en una lista tabular limpia para acceder a su expediente en menos de 2 segundos.
- **H2:** Como *Secretaria*, quiero importar un listado masivo de clientes en formato CSV (admitiendo delimitadores de coma o punto y coma y codificación UTF-8/ISO), asegurando que se importen las filas válidas y se emita un reporte con las filas rechazadas por NIF duplicado o campos vacíos.
- **H3:** Como *Secretaria o Boss*, quiero registrar y custodiar los datos bancarios del cliente (IBAN, forma de cobro, descuentos acordados y permisos de domiciliación bancaria SEPA) impidiendo que usuarios no autorizados accedan a dicha información financiera.
- **H4:** Como *Ingeniero*, quiero registrar fincas y acometidas técnicas asociadas a un cliente mediante coordenadas GPS exactas (`Lat/Lng`), alias y datos SIGPAC (*Municipio, Polígono, Parcela*) para enviar a los operarios al punto de trabajo correcto.
- **H5:** Como *Ingeniero*, quiero consultar y abrir los planos técnicos vinculados al cliente mediante un enlace directo a `/gestio/planols` para revisar acometidas y replanteos.
- **H6:** Como *Ingeniero*, quiero abrir el popup interactivo de una tarea pasada para revisar la hoja de trabajo, la galería de fotografías tomadas por los operarios durante la obra, las fotos/notas de incidencias y los materiales instalados con enlace a su proveedor.
- **H7:** Como *Ingeniero o Secretaria*, quiero comunicarme con el cliente por Telegram (o canales alternativos si no dispone de la app), enviando documentación técnica y recibiendo imágenes o firmas de autorización vinculadas a la obra.
- **H8:** Como *Ingeniero*, quiero iniciar una nueva orden de trabajo con un solo clic desde la ficha del cliente (`/gestio/feines/crear?clientId=`) con sus datos y fincas precargadas.

---

## Requisitos Funcionales (Criterios de Aceptación en EARS)

### Bloque 1: Directorio Principal de Clientes (`/gestio/clients`) y Estado "Día 0"
- **RF-01:** EL SISTEMA presentará en `/gestio/clients` un listado tabular estricto de clientes, **sin mapa en esta vista principal**, mostrando por cada registro: *Nombre / Razón Social, NIF/CIF, Teléfono principal, Email, Dirección fiscal física y Persona de contacto (nombre, teléfono/móvil y email si aplica, mostrando los datos del titular si no existe contacto secundario)*.
- **RF-02:** CUANDO el usuario introduce texto en la caja de búsqueda del listado, EL SISTEMA filtrará en tiempo real por coincidencia de subcadena insensible a mayúsculas y acentos sobre los campos: *Nombre/Razón Social, NIF/CIF y Municipio*.
- **RF-03:** SI el sistema se encuentra en estado "Día 0" (sin clientes registrados en la base de datos de la empresa), ENTONCES EL SISTEMA mostrará la pantalla completamente limpia, exhibiendo exclusivamente los dos botones de acción: *"Alta cliente (manual)"* e *"Importación datos CSV"*, sin mensajes de bienvenida ni textos simulados (*Zero Mock Data*).
- **RF-04:** CUANDO el usuario hace clic sobre cualquier fila o tarjeta de un cliente de la lista, EL SISTEMA redirigirá a la pantalla de ficha detallada del cliente (`/gestio/clients/[id]`).

### Bloque 2: Alta Manual e Importación Masiva por CSV con Control de Integridad
- **RF-05:** CUANDO el usuario pulsa "Alta cliente (manual)", EL SISTEMA desplegará un formulario modal solicitando obligatoriamente: *Nombre/Razón Social, NIF/CIF, Teléfono, Email y Dirección fiscal*; el sistema permitirá obtener las coordenadas GPS de la sede mediante **geocodificación automática** al introducir la dirección postal o mediante **introducción manual directa** de los valores `Lat/Lng`.
- **RF-06:** CUANDO se intenta guardar un cliente (de forma manual o por CSV), EL SISTEMA validará la unicidad estricta del **NIF/CIF** dentro de la empresa; SI el NIF/CIF ya existe en el sistema, ENTONCES EL SISTEMA rechazará el guardado, no creará ningún registro duplicado y mostrará el mensaje de error: *"El NIF/CIF ya se encuentra registrado en el sistema"*.
- **RF-07:** CUANDO el usuario ejecuta una "Importación datos CSV", EL SISTEMA admitirá archivos delimitados por coma (`,`) o por punto y coma (`;`) y codificaciones habituales (UTF-8 e ISO-8859-1), guardando todas las filas con datos válidos e identificando las filas erróneas (por NIF duplicado, ausencia de campos obligatorios o formato inválido).
- **RF-08:** TRAS procesar el archivo CSV, EL SISTEMA mostrará una tabla/informe visual detallando las filas rechazadas, indicando el número de fila, el dato causante y el motivo explícito del fallo para su corrección manual.

### Bloque 3: Ficha Detallada del Cliente (`/gestio/clients/[id]`), Planos y Datos Bancarios
- **RF-09:** EL SISTEMA mostrará en la cabecera de la ficha del cliente los datos fiscales, teléfonos de contacto, correo electrónico, dirección física y un botón destacado para *"Alta de nuevo trabajo"* que redirigirá a `/gestio/feines/crear?clientId=<id>`.
- **RF-10:** MIENTRAS el usuario autenticado posea rol `Boss` o `Secretaria / RRHH`, EL SISTEMA mostrará un bloque confidencial de **Datos de Cobro y Domiciliación Bancaria** que contendrá: *Número de cuenta (IBAN con validación de dígito de control), Forma de cobro (transferencia, domiciliación SEPA, contado), Descuento comercial asignado (%) y Estado/Adjunto del mandato de autorización de domiciliación bancaria SEPA*.
- **RF-11:** SI el usuario autenticado tiene rol `Ingeniero`, ENTONCES EL SISTEMA consumirá un endpoint que omitirá en su totalidad el bloque de Datos de Cobro y Domiciliación Bancaria, garantizando la privacidad de los datos financieros del cliente.
- **RF-12:** CUANDO existan planos técnicos asociados a las fincas o instalaciones del cliente, EL SISTEMA mostrará un bloque de **Planos del Cliente** con miniaturas y un enlace directo a la herramienta de ingeniería en `/gestio/planols?clientId=<id>` para su consulta, edición y versionado.
- **RF-13:** EL SISTEMA mantendrá en la ficha del cliente un registro de múltiples **Fincas / Sedes / Acometidas técnicas**, creadas de forma vinculada a órdenes de trabajo, requiriendo obligatoriamente para cada una: *Alias/Nombre de la finca, Coordenadas GPS en grados decimales (Lat/Lng), Persona de contacto in situ, Anotaciones de acceso/advertencias (ej. presencia de perros, llaves o candados)* y los datos oficiales de identificación catastral SIGPAC (*Municipio, Polígono y Parcela/Finca*).
- **RF-14:** SI una finca cambia de propietario o es traspasada a otro cliente, ENTONCES EL SISTEMA permitirá reasignar la finca al nuevo cliente, incorporando el historial de obras pasadas en el nuevo expediente pero indicando expresamente que fueron ejecutadas bajo la razón social del titular anterior, preservando inmutables los registros históricos de ambas partes.

### Bloque 4: Slot 1 — Historial de Trabajos Realizados y Hoja de Trabajo con Galería Fotográfica
- **RF-15:** EL SISTEMA listará en el Slot 1 todos los trabajos y órdenes de trabajo ejecutadas históricamente para el cliente, ordenadas de forma cronológica descendente.
- **RF-16:** CUANDO el usuario pulsa sobre cualquier tarea del listado del Slot 1, EL SISTEMA desplegará una ventana emergente (*popup modal*) que mostrará:
  1. *Hoja de Trabajo y Detalle:* Especificación técnica de los trabajos realizados y notas de los técnicos de campo.
  2. *Galería Fotográfica de Obra:* Fotografías capturadas por los operarios durante la ejecución del trabajo (imágenes de avance y estado final de la obra).
  3. *Registro de Incidencias con Imágenes:* Detalle de incidencias surgidas durante la orden, acompañadas de las fotografías y notas de voz aportadas por la cuadrilla.
  4. *Material Utilizado y Trazabilidad:* Listado de materiales instalados con identificación de lote y fecha de compra, incorporando un enlace directo sobre cada producto hacia la ficha del proveedor en `/gestio/proveidors` para verificar condiciones de garantía.
  5. *Cuadrilla Responsable:* Operarios asignados al trabajo.
  6. *Geolocalización:* Plano técnico y punto GPS exacto de la finca intervenida.
  7. *Proforma / Presupuesto:* Copia de la proforma aceptada previamente por el cliente.

### Bloque 5: Slot 2 — Resumen Económico, Facturación y Segregación por Roles
- **RF-17:** EL SISTEMA mostrará en el Slot 2 el estado de cobro de los trabajos del cliente, el listado de facturas emitidas, las facturas pendientes y una caja de búsqueda rápida de facturas por código o fecha.
- **RF-18:** CUANDO un usuario con rol `Ingeniero` accede al Slot 2, EL SISTEMA le permitirá buscar, abrir y consultar individualmente cualquier factura o albarán unitario del cliente para aclaración de conceptos técnicos, manteniendo bloqueados y ocultos en el payload los agregados de margen o rentabilidad acumulada de la cuenta.
- **RF-19:** CUANDO un usuario con rol `Boss` o `Secretaria / RRHH` pulsa sobre la gestión o emisión de una factura, EL SISTEMA redirigirá a la pantalla unificada de facturación legal `/gestio/comptabilitat`, centralizando la emisión Veri*factu para prevenir duplicidades o inconsistencias contables.

### Bloque 6: Slot 3 — Canal de Notificaciones y Comunicación Flexible (Telegram / Alternativo)
- **RF-20:** EL SISTEMA dispondrá en el Slot 3 de un panel de comunicaciones directas que mostrará el estado de vinculación del cliente (*"Vinculado a Telegram"* con su `chat_id`, o *"Canal Telegram no activado"*).
- **RF-21:** SI el cliente no utiliza o no desea activar Telegram, ENTONCES EL SISTEMA permitirá gestionar los envíos de avisos, presupuestos y partes de entrega a través de los canales de contacto convencionales acordados (correo electrónico o teléfono/SMS).
- **RF-22:** MIENTRAS el canal Telegram esté activo, EL SISTEMA mantendrá el historial cronológico de todas las comunicaciones automáticas y permitirá a los usuarios de gestión redactar mensajes manuales, transmitir documentación técnica, adjuntar fotografías de obra y recibir firmas digitales de autorización.

### Bloque 7: Slot 4 — Mapa de Actividad y Ubicaciones del Cliente
- **RF-23:** EL SISTEMA proyectará en el Slot 4 un mapa geográfico interactivo renderizando un marcador para la sede fiscal física del cliente y marcadores diferenciados para cada uno de los puntos GPS donde se hayan ejecutado trabajos.
- **RF-24:** CUANDO el usuario hace clic sobre el marcador de la sede fiscal en el mapa, EL SISTEMA desplegará la dirección postal y datos de contacto central.
- **RF-25:** CUANDO el usuario hace clic sobre cualquier marcador de trabajo/finca en el mapa, EL SISTEMA abrirá directamente el popup modal con la hoja de trabajo completa detallada en el RF-16.

### Bloque 8: Inmutabilidad, Integridad y Trazabilidad Absoluta
- **RF-26:** SI un cliente tiene registrado historial comercial o técnico (órdenes de trabajo realizadas, presupuestos presentados, compras de material o facturas emitidas), ENTONCES EL SISTEMA **bloqueará de forma permanente cualquier acción de eliminación física (`DELETE`)** del cliente en la base de datos, garantizando la inmutabilidad de la trazabilidad fiscal y operativa.
- **RF-27:** SI un cliente fue creado por error y no posee absolutamente ningún historial comercial, presupuesto, compra o trabajo asignado, ENTONCES EL SISTEMA permitirá su eliminación física para mantener depurado el directorio.
- **RF-28:** EL SISTEMA permitirá en todo momento la edición de datos fiscales y de contacto del cliente (dirección, teléfonos, personas de contacto), manteniendo siempre inalterables e inmutables los trabajos, albaranes y facturas previamente validadas.

---

## Requisitos No Funcionales
- **Almacenamiento Local Seguro:** Todos los documentos PDF, imágenes de obras e incidencias, firmas digitales y planos técnicos adjuntos a los clientes se almacenan en los volúmenes en disco local del Mini PC/servidor, con copias de seguridad semanales programadas cada domingo (sin dependencias de AWS S3).
- **Seguridad Multi-Tenant (RLS):** Cada consulta y actualización sobre las tablas de clientes, fincas, datos bancarios y equipamiento aplica Row Level Security mandatorio mediante `app.current_empresa_id`.
- **Protección de Datos Bancarios (Zero-Trust):** Los números de cuenta bancaria (IBAN) y documentos de mandatos SEPA solo se transfieren en endpoints autorizados para `Boss` y `Secretaria / RRHH`, con cifrado en reposo.
- **Tolerancia Cero a Datos Ficticios (Zero Mock Data):** La UI nunca generará clientes "demo" ni datos simulados si la base de datos está vacía.
- **Diseño Camaleón:** Los colores de acento, bordes de estado y estilos de mapa se adaptarán dinámicamente a las variables CSS institucionales de la empresa.

---

## Fuera de Alcance (Lo que NO hace este módulo)
- No genera ni emite facturas oficiales Veri*factu de forma autónoma dentro de la ficha de cliente (se centraliza obligatoriamente en `/gestio/comptabilitat`).
- No gestiona el cobro bancario con TPV ni emisión de remesas bancarias SEPA directas (pertenece a `/gestio/comptabilitat`).
- No permite la asignación ni replanificación de cuadrillas operativas (se gestiona en `/gestio/feines/crear` y en el mapa de seguimiento).
- No realiza cálculos de rentabilidad o balances macroeconómicos de la empresa en las vistas accesibles por el rol `Ingeniero`.
- No expone datos bancarios (IBAN) ni mandatos SEPA al rol `Ingeniero`.

---

## Criterios de Finalización (Definition of Done)
1. Todos los requisitos funcionales (RF-01 al RF-28) redactados en sintaxis formal EARS y aprobados por el usuario.
2. La vista principal `/gestio/clients` es un listado tabular estricto **sin mapa**.
3. La ficha `/gestio/clients/[id]` contiene los bloques de Datos Fiscales, Datos Bancarios (restringidos a Boss y Secretaria), Planos (con enlace a `/gestio/planols`), Fincas SIGPAC, y los 4 slots: Trabajos (con popup de hoja de trabajo, fotos de obra y fotos de incidencias), Resumen Económico, Canal de Comunicaciones (Telegram/Alternativo) y Mapa de actividad.
4. El modelado de fincas incorpora coordenadas GPS y campos oficiales SIGPAC (*Municipio, Polígono, Parcela*).
5. Se garantiza la inmutabilidad y la prohibición de borrado de clientes con historial comercial o técnico, permitiendo solo el borrado de fichas creadas por error sin actividad.
6. La reasignación de fincas preserva la trazabilidad técnica cruzada indicando la titularidad anterior.
7. La importación CSV admite formatos estándar (coma y punto y coma, UTF-8/ISO) y gestiona errores mediante reporte visual.
8. Se respeta estrictamente la política de no realizar commits sin solicitud explícita del usuario.
