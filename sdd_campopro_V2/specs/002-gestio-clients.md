# Spec 002 — Módulo de Gestión de Clientes (/gestio/clients)

## Contexto y objetivo

El módulo de Gestión de Clientes es el directorio maestro de las entidades contratantes (particulares, empresas, comunidades de regantes o explotaciones agrícolas) y el registro central de sus instalaciones, fincas geolocalizadas y expediente histórico.

Resuelve la necesidad de gobernar con precisión fiscal, bancaria y técnica tanto la sede o domicilio social del cliente como sus múltiples fincas rurales, acometidas e infraestructuras hidráulicas (identificadas mediante parcelas SIGPAC y coordenadas GPS), sus planos técnicos asociados enlazados con `/gestio/planols`, su canal de comunicación directa bidireccional (vía Telegram o canales alternativos de correo/SMS), su historial de órdenes de trabajo con reportes fotográficos de obra e incidencias, y sus condiciones comerciales y financieras unitarias.

Bajo la arquitectura de seguridad y segregación del sistema, este módulo implementa:

1. **Aislamiento Multi-Inquilino Estricto:** Row Level Security (RLS) mandatorio en PostgreSQL a nivel de base de datos (`empresa_id`).


2. **Segregación Zero-Trust de Datos Financieros:** Ocultación y bloqueo de datos bancarios (IBAN y mandatos SEPA) y métricas de rentabilidad global para el rol `Ingeniero`, canalizando la consulta técnica de albaranes y facturas mediante un Data Transfer Object higienizado (`FacturaConsultaTecnicaDTO`) a través de endpoints desacoplados de operaciones técnicas.


3. **Cifrado en Reposo de Datos Bancarios:** Cifrado simétrico AES-256-GCM para números de cuenta bancaria y *Envelope Encryption* para los archivos de mandatos SEPA custodiados en disco soberano.


4. **Trazabilidad e Inmutabilidad Mercantil:** Imposibilidad de borrado físico (`DELETE`) de clientes con historial comercial o técnico previo, preservación estricta de la titularidad mercantil histórica en caso de traspaso de fincas rústicas entre propietarios, y procedimiento formal de bloqueo y anonimización de datos no fiscales ante solicitudes de supresión (Art. 17 RGPD y Art. 32 LOPDGDD).


5. **Tolerancia Cero a Datos Ficticios (*Zero Mock Data*):** Estado Día 0 real sustentado en base de datos vacía, sin generación de registros simulados.



---

## Usuarios / actores y Matriz de Acceso (Zero-Trust)

El backend garantiza el aislamiento multi-inquilino y la segregación estricta de permisos por rol a nivel de API y base de datos:

* **Boss (Gerencia / Propietario):** Acceso total e irrestricto a la consulta, alta manual, importación/exportación masiva CSV, edición de clientes, fincas, planos, historial de trabajos con fotos, canal de comunicaciones, **datos bancarios y de cobro (IBAN descifrado, forma de pago, descuentos y mandatos SEPA)**, y resumen económico completo con redirección al centro de facturación en `/gestio/comptabilitat`.


* **Secretaria / RRHH:** Acceso administrativo completo: altas manuales, importación/exportación masiva CSV, gestión de datos fiscales, **gestión y custodia de datos bancarios de cobro (cuentas bancarias, formas de pago, descuentos y mandatos SEPA)**, planos, canal de comunicaciones y consulta de facturas de clientes, canalizando la emisión y liquidación legal mediante redirección a `/gestio/comptabilitat`.


* **Ingeniero / Supervisor Técnico:** Acceso técnico a la consulta y búsqueda de clientes, gestión de fincas/sedes, planos asociados en `/gestio/planols`, apertura de expedientes técnicos, partes de trabajo con galería fotográfica de obras e incidencias, materiales instalados con enlace a condiciones de garantía sanitizadas de proveedores (`/gestio/proveidors/{id}/garantia`), canal de comunicaciones técnicas y lanzamiento de nuevas órdenes vinculadas (`/gestio/feines/crear?clientId=`).
**Segregación Financiera y Acceso a Facturación:** Dispone de bloqueo absoluto a nivel de API sobre el router contable `/api/v1/gestio/comptabilitat/*` y endpoints de exportación masiva (`403 Forbidden`). Para dar soporte técnico y resolver dudas sobre partidas ejecutadas con el cliente, tiene acceso de solo lectura a los albaranes y facturas unitarias del cliente a través del endpoint desacoplado `/api/v1/gestio/clients/{id}/factures-tecniques`, el cual utiliza `FacturaConsultaTecnicaDTO` para purgar de forma obligatoria los números de cuenta bancaria, mandatos SEPA, cuentas del Plan General Contable (PGC) y márgenes de rentabilidad de la empresa.


* **Operario de Cuadrilla / Capataz (`/operari`):** No accede a la web de gestión de clientes. Desde la PWA móvil de campo, visualiza las ubicaciones de fincas, datos de contacto in situ y notas de acceso de los clientes **exclusivamente** durante la jornada en que tienen órdenes de trabajo activas asignadas a dicha finca.


* **Cliente Final:** Receptor de notificaciones, presupuestos, partes de trabajo y facturas vía Telegram o canales convencionales (Email/SMS).



### Matriz de Acceso por Rol

| Entidad / Función | Boss | Secretaria / RRHH | Ingeniero | Operario () |
| --- | --- | --- | --- | --- |
| **Directorio de Clientes** | Lectura / Escritura | Lectura / Escritura | Solo Lectura | Sin acceso |
| **Exportación CSV Directorio** | Permitida | Permitida | **Bloqueo Total (403)** | Sin acceso |
| **Datos Fiscales (NIF, Razón Social)** | Lectura / Escritura | Lectura / Escritura | Solo Lectura | Sin acceso |
| **Datos Bancarios (IBAN, Mandato SEPA)** | Lectura / Escritura | Lectura / Escritura | **Bloqueo Total (403)** | Sin acceso |
| **Fincas, Parcelas SIGPAC y GPS** | Lectura / Escritura | Lectura / Escritura | Lectura / Escritura | Solo Lectura (asignadas) |
| **Códigos Físicos de Acceso (Llaves/Candados)** | Lectura / Escritura | Lectura / Escritura | Lectura / Escritura | **Temporal (Solo el día de obra)** |
| **Historial de Obras y Fotos** | Lectura / Auditoría | Lectura / Auditoría | Lectura / Auditoría | Escritura (subida fotos) |
| **Garantías de Proveedores** | Lectura completa | Lectura completa | **DTO Sanitizado** | Sin acceso |
| **Facturas y Albaranes (Vista Técnica)** | Lectura completa | Lectura completa | **DTO Sanitizado** | Sin acceso |
| **Márgenes y Cuentas PGC** | Lectura completa | Lectura completa | **Bloqueo Total (403)** | Sin acceso |
| **Emisión Factura Veri*factu** | Redirección  | Redirección  | **Bloqueo Total (403)** | Sin acceso |


---

## Historias de usuario

* **H1:** Como *Ingeniero o Secretaria*, quiero buscar clientes en tiempo real por Nombre/Razón Social, NIF o Municipio en una lista tabular paginada para acceder a su expediente sin colapsar el navegador.


* **H2:** Como *Secretaria*, quiero importar un listado masivo de clientes en formato CSV (admitiendo delimitadores de coma o punto y coma y codificación UTF-8/ISO), asegurando que se importen las filas válidas y se emita un reporte con las filas rechazadas por NIF duplicado o campos vacíos.


* **H3:** Como *Secretaria o Boss*, quiero registrar y custodiar los datos bancarios del cliente (IBAN cifrado, forma de cobro, descuentos acordados y mandato de domiciliación bancaria SEPA en PDF cifrado) impidiendo terminantemente que usuarios con rol Ingeniero accedan a dicha información financiera, y permitiendo la exportación segura del directorio comercial completo.


* **H4:** Como *Ingeniero*, quiero registrar fincas y acometidas técnicas asociadas a un cliente mediante coordenadas GPS exactas (`Lat/Lng`), alias y datos SIGPAC (*Municipio, Polígono, Parcela*) para enviar a los operarios al punto de trabajo correcto, limitando su acceso a los códigos de candados exclusivamente al día de la obra.


* **H5:** Como *Ingeniero*, quiero consultar y abrir los planos técnicos vinculados al cliente mediante un enlace directo a `/gestio/planols` para revisar acometidas y replanteos.


* **H6:** Como *Ingeniero*, quiero abrir el popup interactivo de una tarea pasada para revisar la hoja de trabajo, la galería de fotografías tomadas por los operarios durante la obra, las fotos/notas de incidencias y los materiales instalados con enlace a su ficha de garantía técnica sin precios de coste.


* **H7:** Como *Ingeniero o Secretaria*, quiero comunicarme con el cliente por Telegram (o canales alternativos si no dispone de la app), enviando documentación técnica y recibiendo imágenes o firmas de autorización vinculadas a la obra mediante un webhook protegido contra cargas maliciosas.


* **H8:** Como *Ingeniero*, quiero consultar las facturas y albaranes emitidos a mi cliente desde su expediente para resolver dudas de ejecución técnica en campo, asegurando que la interfaz no exponga márgenes de beneficio, cuentas contables ni datos de cuentas bancarias.



---

## Requisitos Funcionales (Criterios de Aceptación en EARS)

### Bloque 1: Directorio Principal de Clientes (`/gestio/clients`) y Estado "Día 0"

* **RF-01 (Ubiquitous) — Vista Tabular Paginada sin Mapa:** EL SISTEMA presentará en `/gestio/clients` un listado tabular estricto de clientes, **sin mapa en esta vista principal y con paginación del lado del servidor (*Server-Side Pagination*)**, mostrando por cada registro: Nombre / Razón Social, NIF/CIF, Teléfono principal, Email, Dirección fiscal física y Persona de contacto.
* **RF-02 (Ubiquitous) — Búsqueda Reactiva Multicriterio:** CUANDO el usuario introduce texto en la caja de búsqueda del listado, EL SISTEMA filtrará en tiempo real por coincidencia de subcadena insensible a mayúsculas y acentos sobre los campos: *Nombre/Razón Social, NIF/CIF y Municipio*.


* **RF-03 (State-driven) — Estado Día 0 Real (*Zero Mock Data*):** SI el sistema se encuentra en estado "Día 0" (sin clientes registrados en la base de datos de la empresa), ENTONCES EL SISTEMA mostrará la pantalla completamente limpia, exhibiendo exclusivamente los dos botones de acción: *"Alta cliente (manual)"* e *"Importación datos CSV"*, sin mensajes de bienvenida ni textos simulados (*Zero Mock Data*).


* **RF-04 (Event-driven) — Navegación a Ficha Detallada:** CUANDO el usuario hace clic sobre cualquier fila o tarjeta de un cliente de la lista, EL SISTEMA redirigirá a la pantalla de ficha detallada del cliente (`/gestio/clients/[id]`).



### Bloque 2: Alta Manual, Importación y Exportación de Datos

* **RF-05 (Event-driven) — Alta Manual y Geocodificación de Sede:** CUANDO el usuario pulsa "Alta cliente (manual)", EL SISTEMA desplegará un formulario modal solicitando obligatoriamente: *Nombre/Razón Social, NIF/CIF, Teléfono, Email y Dirección fiscal*; el sistema permitirá obtener las coordenadas GPS de la sede mediante **geocodificación automática** al introducir la dirección postal o mediante **introducción manual directa** de los valores `Lat/Lng`.


* **RF-05.6 (Ubiquitous) — Validación Algorítmica de Identificación Fiscal:** En cualquier alta o modificación de cliente (manual o por CSV), EL SISTEMA validará la corrección formal y el dígito de control del documento identificativo según su tipo (NIF, NIE o CIF español mediante algoritmo de módulo 23/módulo 11 oficial, o NIF-IVA intracomunitario con prefijo ISO de país), bloqueando el guardado de registros con códigos malformados o matemáticamente inválidos.


* **RF-06 (Unwanted behavior) — Control de Unicidad de NIF/CIF:** CUANDO se intenta guardar un cliente (de forma manual o por CSV), EL SISTEMA validará la unicidad estricta del **NIF/CIF** dentro de la empresa; SI el NIF/CIF ya existe en el sistema para ese inquilino, ENTONCES EL SISTEMA rechazará el guardado, no creará ningún registro duplicado y mostrará el mensaje de error: *"El NIF/CIF ya se encuentra registrado en el sistema"*.


* **RF-07 (Event-driven) — Procesamiento Resiliente de Archivos CSV:** CUANDO el usuario ejecuta una "Importación datos CSV", EL SISTEMA admitirá archivos delimitados por coma (`,`) o por punto y coma (`;`) y codificaciones habituales (UTF-8 e ISO-8859-1), guardando todas las filas con datos válidos e identificando las filas erróneas (por NIF duplicado, ausencia de campos obligatorios o formato inválido).


* **RF-08 (Event-driven) — Reporte Visual de Filas Rechazadas:** TRAS procesar el archivo CSV, EL SISTEMA mostrará una tabla/informe visual detallando las filas rechazadas, indicando el número de fila, el dato causante y el motivo explícito del fallo para su corrección manual.


* **RF-08.1 (Ubiquitous) — Exportación Segura del Directorio Comercial:** El sistema ha de permitir la exportación del listado de clientes en formato CSV (`/docs/<empresa_id>/clients/exports/`), restringiendo estrictamente este endpoint a los roles `Boss` y `Secretaria`. Si un rol `Ingeniero` intenta invocar la exportación masiva de la cartera, el backend devolverá `403 Forbidden`.

### Bloque 3: Ficha Detallada del Cliente (`/gestio/clients/[id]`), Planos y Datos Bancarios

* **RF-09 (Ubiquitous) — Cabecera de Ficha y Acceso Rápido a Órdenes:** EL SISTEMA mostrará en la cabecera de la ficha del cliente los datos fiscales, teléfonos de contacto, correo electrónico, dirección física y un botón destacado para *"Alta de nuevo trabajo"* que redirigirá a `/gestio/feines/crear?clientId=<id>`.


* **RF-10 (State-driven) — Visualización de Datos de Cobro y Domiciliación SEPA:** MIENTRAS el usuario autenticado posea rol `Boss` o `Secretaria / RRHH`, EL SISTEMA mostrará un bloque confidencial de **Datos de Cobro y Domiciliación Bancaria** que contendrá: *Número de cuenta (IBAN validado mediante módulo 97), Forma de cobro (transferencia, domiciliación SEPA, contado), Descuento comercial asignado (%) y Estado/Adjunto del mandato de autorización de domiciliación bancaria SEPA*.


* **RF-10.1 (Ubiquitous) — Cifrado en Reposo de Datos Financieros de Cliente:** EL SISTEMA cifrará en reposo el número de cuenta bancaria (IBAN) en la base de datos utilizando el estándar AES-256-GCM (`iban_encrypted`), y custodiará los archivos PDF de mandato SEPA en el volumen soberano bajo la ruta `/docs/<empresa_id>/clients/mandats/<client_id>_mandat_sepa.pdf.enc` con *Envelope Encryption*, accesibles exclusivamente para los roles `Boss` y `Secretaria`.


* **RF-11 (Ubiquitous) — Bloqueo Zero-Trust de Datos Bancarios para Rol Ingeniero:** SI el usuario autenticado tiene rol `Ingeniero`, ENTONCES EL SISTEMA consumirá un endpoint que omitirá en su totalidad el bloque de Datos de Cobro y Domiciliación Bancaria, garantizando la privacidad de los datos financieros del cliente.


* **RF-12 (State-driven) — Bloque de Planos Técnicos del Cliente:** CUANDO existan planos técnicos asociados a las fincas o instalaciones del cliente, EL SISTEMA mostrará un bloque de **Planos del Cliente** con miniaturas y un enlace directo a la herramienta de ingeniería en `/gestio/planols?clientId=<id>` para su consulta, edición y versionado.


* **RF-13.1 (Ubiquitous) — Directorio de Fincas, Coordenadas GPS y Datos SIGPAC:** EL SISTEMA mantendrá en la ficha del cliente un registro de múltiples **Fincas / Sedes / Acometidas técnicas**, creadas de forma vinculada a órdenes de trabajo, requiriendo obligatoriamente para cada una: *Alias/Nombre de la finca, Coordenadas GPS en grados decimales (Lat/Lng), Persona de contacto in situ, Anotaciones de acceso/advertencias (ej. presencia de perros, llaves o candados)* y los datos oficiales de identificación catastral SIGPAC (*Municipio, Polígono y Parcela/Finca*), emitiendo advertencia cartográfica ante discordancias espaciales.


* **RF-13.2 (Event-driven) — Soporte de Fincas y Acometidas Especiales sin Catastro:** Cuando una intervención técnica o punto de acometida se ubique en terrenos comunales, vías públicas u obras lineales sin asignación de polígono o parcela catastral, EL SISTEMA permitirá omitir los campos SIGPAC activando el indicador *"Instalación / Acometida Especial"*, requiriendo obligatoriamente las coordenadas GPS y el alias descriptivo.


* **RF-13.3 (State-driven) — Privacidad Física en PWA:** Mientras un operario consulte los datos de una finca desde su aplicación móvil, el backend enmascarará u omitirá el campo de anotaciones de acceso (códigos de llaves, candados, alarmas), sirviéndolo en texto claro única y exclusivamente si el operario cuenta con una orden de trabajo asignada a esa `finca_id` planificada para el día en curso o en estado de ejecución.
* **RF-14 (Event-driven) — Traspaso de Fincas con Histórico Técnico Cruzado:** SI una finca cambia de propietario o es traspasada a otro cliente, ENTONCES EL SISTEMA permitirá reasignar la finca al nuevo cliente, incorporando el historial de obras pasadas en el nuevo expediente pero indicando expresamente que fueron ejecutadas bajo la razón social del titular anterior, preservando inmutables los registros históricos de ambas partes.


* **RF-14.1 (State-driven) — Inmutabilidad Mercantil en Reasignación de Predios:** Mientras se transfiera una finca a un nuevo cliente, EL SISTEMA mantendrá inalterada la vinculación histórica de todas las órdenes de trabajo, albaranes y facturas previamente emitidas con el cliente original, registrando la transferencia en la tabla `finca_titularitat_historic` y mostrando el historial en el nuevo cliente bajo la marca explícita *"Actuación realizada bajo titularidad anterior"*.



### Bloque 4: Slot 1 — Historial de Trabajos Realizados y Hoja de Trabajo con Galería Fotográfica

* **RF-15 (Ubiquitous) — Cronología Descendente de Órdenes de Trabajo:** EL SISTEMA listará en el Slot 1 todos los trabajos y órdenes de trabajo ejecutadas históricamente para el cliente, ordenadas de forma cronológica descendente.


* **RF-16 (Event-driven) — Despliegue de Modal Técnico de Trabajo:** CUANDO el usuario pulsa sobre cualquier tarea del listado del Slot 1, EL SISTEMA desplegará una ventana emergente (*popup modal*) que mostrará:


1. *Hoja de Trabajo y Detalle:* Especificación técnica de los trabajos realizados y notas de los técnicos de campo.


2. *Galería Fotográfica de Obra:* Fotografías capturadas por los operarios durante la ejecución del trabajo (imágenes de avance y estado final de la obra).


3. *Registro de Incidencias con Imágenes:* Detalle de incidencias surgidas durante la orden, acompañadas de las fotografías y notas de voz aportadas por la cuadrilla.


4. *Material Utilizado y Trazabilidad:* Listado de materiales instalados con identificación de lote y fecha de compra.


5. *Cuadrilla Responsable:* Operarios asignados al trabajo.


6. *Geolocalización:* Plano técnico y punto GPS exacto de la finca intervenida.


7. *Proforma / Presupuesto:* Copia de la proforma aceptada previamente por el cliente.




* **RF-16.4 (Ubiquitous) — Trazabilidad de Materiales y Garantía Técnica Sanitizada:** En el modal de trabajo, el listado de materiales instalados incorporará un enlace directo sobre cada producto hacia la información de garantía técnica del proveedor en `/gestio/proveidors/{id}/garantia`, serializado mediante `ProveidorConsultaTecnicaDTO` para ocultar al rol `Ingeniero` los precios de compra, condiciones de pago, facturas de proveedor y márgenes comerciales de la empresa.



### Bloque 5: Slot 2 — Resumen Económico, Facturación Técnica y Segregación por Roles

* **RF-17 (Ubiquitous) — Resumen Económico para Administración:** EL SISTEMA mostrará en el Slot 2 el estado de cobro de los trabajos del cliente, el listado de facturas emitidas, las facturas pendientes y una caja de búsqueda rápida de facturas por código o fecha.


* **RF-18 (Ubiquitous) — Consulta Técnica de Facturas para el Rol Ingeniero:** CUANDO un usuario con rol `Ingeniero` accede al Slot 2, EL SISTEMA le permitirá buscar, abrir y consultar individualmente cualquier factura o albarán unitario del cliente para aclaración de conceptos técnicos, manteniendo bloqueados y ocultos en el payload los agregados de margen o rentabilidad acumulada de la cuenta.


* **RF-18.1 (Ubiquitous) — Desacoplamiento de Facturación en Slot 2 para Oficina Técnica:** Cuando un usuario con rol `Ingeniero` consulte el Slot 2, EL SISTEMA servirá los datos a través del endpoint desacoplado `/api/v1/gestio/clients/{id}/factures-tecniques` utilizando el `FacturaConsultaTecnicaDTO`, purgando del payload JSON cualquier información de cuentas contables del PGC, datos bancarios (IBAN), márgenes de beneficio de la empresa o precios de coste de proveedores.


* **RF-19 (Event-driven) — Centralización de Emisión Legal en Hub Contable:** CUANDO un usuario con rol `Boss` o `Secretaria / RRHH` pulsa sobre la gestión o emisión de una factura, EL SISTEMA redirigirá a la pantalla unificada de facturación legal `/gestio/comptabilitat`, centralizando la emisión Veri*factu para prevenir duplicidades o inconsistencias contables.



### Bloque 6: Slot 3 — Canal de Notificaciones y Comunicación Flexible (Telegram / Alternativo)

* **RF-20 (Ubiquitous) — Monitor de Estado del Canal Telegram:** EL SISTEMA dispondrá en el Slot 3 de un panel de comunicaciones directas que mostrará el estado de vinculación del cliente (*"Vinculado a Telegram"* con su `chat_id`, o *"Canal Telegram no activado"*).


* **RF-21 (State-driven) — Soporte de Canales de Contacto Alternativos:** SI el cliente no utiliza o no desea activar Telegram, ENTONCES EL SISTEMA permitirá gestionar los envíos de avisos, presupuestos y partes de entrega a través de los canales de contacto convencionales acordados (correo electrónico o teléfono/SMS).


* **RF-22 (State-driven) — Comunicaciones Bidireccionales y Validación MIME:** MIENTRAS el canal Telegram esté activo, EL SISTEMA mantendrá el historial cronológico de todas las comunicaciones automáticas y permitirá a los usuarios de gestión redactar mensajes manuales, transmitir documentación técnica, adjuntar fotografías de obra y recibir firmas digitales de autorización, interceptando y descartando en el webhook cualquier archivo entrante que no coincida con un MIME type autorizado (`image/*`, `application/pdf`).

### Bloque 7: Slot 4 — Mapa de Actividad y Ubicaciones del Cliente

* **RF-23 (Ubiquitous) — Renderizado Geográfico de Sede y Fincas Intervenidas:** EL SISTEMA proyectará en el Slot 4 un mapa geográfico interactivo renderizando un marcador para la sede fiscal física del cliente y marcadores diferenciados para cada uno de los puntos GPS donde se hayan ejecutado trabajos. Si la sede carece de coordenadas y no existen trabajos registrados, el sistema mostrará un estado vacío informativo con un botón para fijar la posición manualmente en el visor cartográfico.


* **RF-24 (Event-driven) — Despliegue de Información Postal de la Sede:** CUANDO el usuario hace clic sobre el marcador de la sede fiscal en el mapa, EL SISTEMA desplegará la dirección postal y datos de contacto central.


* **RF-25 (Event-driven) — Interacción de Marcadores de Obra con Modal de Tarea:** CUANDO el usuario hace clic sobre cualquier marcador de trabajo/finca en el mapa, EL SISTEMA abrirá directamente el popup modal con la hoja de trabajo completa detallada en el RF-16.



### Bloque 8: Inmutabilidad, Integridad y Ciclo de Vida

* **RF-26 (Unwanted behavior) — Bloqueo de Eliminación Física con Historial Vinculado:** SI un cliente tiene registrado historial comercial o técnico (órdenes de trabajo realizadas, presupuestos presentados, compras de material o facturas emitidas), ENTONCES EL SISTEMA **bloqueará de forma permanente cualquier acción de eliminación física (`DELETE`)** del cliente en la base de datos, garantizando la inmutabilidad de la trazabilidad fiscal y operativa.


* **RF-26.1 (State-driven) — Baja Lógica y Bloqueo Operativo de Clientes:** Mientras un cliente se encuentre en estado desactivado (`actiu = FALSE`), el sistema lo ocultará por defecto del directorio principal (habilitando un filtro explícito *"Mostrar inactivos"*) y denegará la apertura de nuevas órdenes de trabajo o presupuestos vinculados a su identificador.


* **RF-27 (State-driven) — Depuración Exclusiva de Fichas Creadas por Error:** SI un cliente fue creado por error y no posee absolutamente ningún historial comercial, presupuesto, compra o trabajo asignado, ENTONCES EL SISTEMA permitirá su eliminación física para mantener depurado el directorio.


* **RF-28 (Ubiquitous) — Edición de Contacto con Control de Concurrencia:** EL SISTEMA permitirá en todo momento la edición de datos fiscales y de contacto del cliente (dirección, teléfonos, personas de contacto) aplicando control de concurrencia optimista (`version_id`), manteniendo siempre inalterables e inmutables los trabajos, albaranes y facturas previamente validadas.



---

## Cláusulas Canónicas de Casos Límite y Resiliencia (EDGE-01 a EDGE-20)

| Código | Tipo EARS | Módulo Afectado | Condición de Falla / Escenario Límite | Comportamiento Requerido del Sistema |
| --- | --- | --- | --- | --- |
| **EDGE-01** | *Unwanted behavior* | Importación | Archivo CSV con codificación mixta o caracteres incompatibles (UTF-8 con BOM o ISO-8859-1 con tildes). | Normaliza automáticamente a UTF-8 sin BOM; procesa las líneas sin abortar el lote completo por caracteres no estándar. |
| **EDGE-02** | *Unwanted behavior* | Importación | CSV que contiene registros con NIF duplicado dentro del propio archivo a importar. | Registra la primera ocurrencia válida y descarta las siguientes en el informe de filas rechazadas indicando duplicidad interna. |
| **EDGE-03** | *Unwanted behavior* | Fiscal | Formato de NIF, CIF o NIE con algoritmo de control erróneo o caracteres de separación (espacios, guiones, puntos). | Sanea la entrada eliminando caracteres no alfanuméricos y bloquea el guardado si el dígito de control del NIF es matemáticamente inválido. |
| **EDGE-04** | *Unwanted behavior* | Bancario | IBAN introducido con formato inválido o suma de comprobación incorrecta (fallo de módulo 97). | Bloquea la persistencia del dato bancario, destacando en rojo el segmento erróneo e impidiendo la asignación del modo de cobro SEPA. |
| **EDGE-05** | *Event-driven* | Geocodificación | Caída del servicio de geocodificación cartográfica o dirección fiscal no resoluble a coordenadas GPS. | Permite guardar el cliente marcando las coordenadas como `NULL`, asigna estado `PENDENT_GEOCODIFICACIO` y habilita selector manual en mapa. |
| **EDGE-06** | *Unwanted behavior* | Integridad | Intento de eliminación física (`DELETE`) de un cliente que cuenta con órdenes de trabajo, albaranes o facturas históricas. | Bloquea la acción a nivel de base de datos (`RESTRICT`), mostrando un modal que informa de la inmutabilidad mercantil y ofreciendo "Desactivar cliente". |
| **EDGE-07** | *Event-driven* | Fincas | Traspaso de una finca asociada a una orden de trabajo que se encuentra actualmente en curso (`EN_EXECUCIO`). | Bloquea la reasignación de la finca hasta que la orden técnica sea cerrada en la Torre de Control o cancelada formalmente. |
| **EDGE-08** | *Unwanted behavior* | Seguridad | Usuario con rol `Ingeniero` intenta interceptar o solicitar el payload con datos bancarios (`/api/v1/gestio/clients/{id}`). | El backend responde con el DTO técnico depurado, excluyendo del JSON las propiedades `iban`, `forma_cobrament` y `mandat_sepa_url`. |
| **EDGE-09** | *Unwanted behavior* | Catastro | Coordenadas GPS introducidas fuera de los límites territoriales de la demarcación de la parcela SIGPAC indicada. | Emite una advertencia visual de discordancia cartográfica y solicita confirmación del técnico sin bloquear el guardado operativo. |
| **EDGE-10** | *Event-driven* | Notificaciones | Intento de envío de notificación por Telegram a un cliente con `chat_id` revocado o bot bloqueado. | Registra el error en el log de comunicaciones, marca el canal como `DESVINCULAT` y ofrece el envío alternativo por Email/SMS. |
| **EDGE-11** | *Unwanted behavior* | Concurrencia | Dos usuarios editan simultáneamente la ficha del cliente guardando datos fiscales contradictorios. | Control de concurrencia optimista (`version_id`): rechaza la segunda petición informando de modificación previa y forzando refresco. |
| **EDGE-12** | *Unwanted behavior* | Multi-Tenant | Worker asíncrono o petición HTTP que intenta consultar datos de un cliente con `empresa_id` ajeno. | Rechazo inmediato por política PostgreSQL RLS (`FORCE ROW LEVEL SECURITY`), devolviendo 0 resultados o error `403 Forbidden`. |
| **EDGE-13** | *Unwanted behavior* | Documental | Archivo de mandato SEPA adjunto corrupto, no ejecutable o en formato no PDF (ej. archivo `.exe` camuflado). | Validación MIME estricta y de cabecera de archivo (*magic numbers*); rechaza la subida con alerta de seguridad y exige un PDF-A válido. |
| **EDGE-14** | *Event-driven* | Geografía | Finca técnica rural sin polígono o parcela catastral oficial (terreno comunal, obra lineal o acometida no catastrada). | Permite obviar los campos SIGPAC activando el indicador *"Instalación / Acometida Especial"*, exigiendo obligatoriamente coordenadas GPS y alias. |
| **EDGE-15** | *Unwanted behavior* | Importación | CSV que contiene delimitadores inconsistentes (líneas con comas y líneas con punto y coma). | El motor de análisis (*Sniffer*) detecta la incoherencia estructural en la fase de pre-validación y rechaza el archivo completo antes de persistir datos. |
| **EDGE-16** | *State-driven* | Borrado | Cliente sin actividad técnica previa pero con presupuestos en estado borrador o rechazados vinculados. | Bloquea el borrado físico; exige la eliminación explícita de los borradores previos en la Torre de Control antes de purgar la ficha. |
| **EDGE-17** | *Unwanted behavior* | Operativa | Intento de alta de orden de trabajo (`/gestio/feines/crear?clientId=`) o presupuesto para un cliente con `actiu = FALSE`. | Bloquea la acción y exige la reactivación previa de la ficha del cliente por parte de `Boss` o `Secretaria`. |
| **EDGE-18** | *Event-driven* | Privacidad | Solicitud formal de supresión de datos (Art. 17 RGPD) sobre un cliente con facturas emitidas en período fiscal vinculante. | Bloquea el `DELETE` físico, anonimiza datos personales no mercantiles (teléfonos, emails, contactos, Telegram) y conmuta la ficha a `BLOQUEJAT_RGPD`. |
| **EDGE-19** | *State-driven* | Privacidad PWA | Operario carga la ficha de la finca para revisar notas de acceso, llaves y candados desde la app móvil. | El backend enmascara los códigos de acceso físico sirviéndolos solo si existe una tarea asignada en estado `EN_EXECUCIO` o agendada para `CURRENT_DATE`. |
| **EDGE-20** | *Unwanted behavior* | Seguridad | Cliente envía archivo adjunto a través del chat de Telegram asociado al sistema. | Webhook valida tipo MIME; rechaza silenciosamente ejecutables, scripts o binarios no contenidos en la lista blanca de imágenes o PDF. |

---

## Requisitos No Funcionales (RNF)

* **RNF-STO-01 (Ubiquitous) — Almacenamiento Soberano en Hetzner Cloud:** Todos los documentos PDF, imágenes de obras e incidencias, firmas digitales y mandatos bancarios se almacenan en volúmenes en disco local del servidor y Hetzner Cloud en Alemania bajo `/docs/<empresa_id>/clients/` y `/data/<empresa_id>/obres/`, con copias de seguridad automáticas cada domingo (cero dependencias de AWS S3).


* **RNF-STO-02 (Ubiquitous) — Jerarquía de Directorios de Clientes:** El sistema estructurará la persistencia documental bajo las siguientes rutas canónicas particionadas por inquilino:


* Mandatos SEPA: `/docs/<empresa_id>/clients/mandats/<client_id>_mandat_sepa.pdf.enc`

* Informes de exportación CSV: `/docs/<empresa_id>/clients/exports/`

* Fotografías de incidencias y obras: `/data/<empresa_id>/obres/<obra_id>/fotos/`



* **RNF-SEC-01 (Ubiquitous) — Seguridad Multi-Tenant (RLS):** Cada consulta y actualización sobre las tablas de clientes, fincas, datos bancarios y equipamiento aplica Row Level Security mandatorio mediante `app.current_empresa_id` con directiva `FORCE ROW LEVEL SECURITY` en PostgreSQL.


* **RNF-SEC-02 (Ubiquitous) — Protección y Cifrado de Datos Bancarios:** Los números de cuenta bancaria (IBAN) se persisten cifrados mediante AES-256-GCM (`iban_encrypted`). Los archivos PDF de mandatos SEPA se custodian bajo *Envelope Encryption* (DEK por archivo cifrada con la KEK del sistema). Ambos campos son inaccesibles para usuarios con rol `Ingeniero` (`403 Forbidden`).


* **RNF-SEC-03 (Ubiquitous) — Aislamiento de Router Contable:** El router `/api/v1/gestio/comptabilitat/*` bloquea de forma universal al rol `Ingeniero` (`403 Forbidden`). La exposición de facturas para aclaración técnica se realiza únicamente a través de `/api/v1/gestio/clients/{id}/factures-tecniques` sanitizado con `FacturaConsultaTecnicaDTO`.


* **RNF-RGPD (Ubiquitous) — Bloqueo y Anonimización de Datos (Art. 32 LOPDGDD):** Ante requerimientos de supresión de datos con obligaciones de conservación fiscal vigentes, el sistema aplica anonimización destructiva sobre canales de comunicación y datos de contacto, congelando exclusivamente los identificadores mercantiles bajo el estado `BLOQUEJAT_RGPD`.


* **Tolerancia Cero a Datos Ficticios (*Zero Mock Data*):** La interfaz web nunca mostrará clientes ficticios, datos demo ni elementos simulados si la base de datos está vacía.


* **Diseño Camaleón:** La interfaz web utiliza variables CSS HSL dinámicas (`--color-primary`, `--color-secondary`), con estados de semáforo universales y estilos de mapa adaptables.



---

## Fuera de Alcance

* No genera ni emite facturas oficiales Veri*factu de forma autónoma dentro de la ficha de cliente (se centraliza obligatoriamente en `/gestio/comptabilitat`).


* No gestiona el cobro bancario directo por TPV ni la compilación de remesas bancarias SEPA XML `pain.008` (se ejecuta en `/gestio/comptabilitat`).


* No permite la asignación ni replanificación de cuadrillas operativas (se gestiona en la Torre de Control de la Spec 001 y `/gestio/feines/crear`).


* No realiza cálculos de rentabilidad, márgenes brutos ni balances macroeconómicos en las vistas accesibles por el rol `Ingeniero`.


* No expone datos bancarios (IBAN) ni documentos de mandato SEPA al rol `Ingeniero` bajo ningún concepto técnico.


* No provee herramientas de CRM masivo (Mailchimp/Marketing automation) integradas de forma nativa más allá de la exportación CSV estipulada.

---

## Criterios de Finalización (Definition of Done)

1. **Criterio 1 de la Definition of Done (DoD):** Todos los requisitos funcionales (**RF-01 a RF-28**) y todas las cláusulas de casos límite (**EDGE-01 a EDGE-20**) deben contar con una correspondencia mínima de un test unitario o de integración en la suite de pruebas automatizada, ejecutado en verde contra base de datos PostgreSQL real con RLS activo y sin datos simulados (*Zero Mock Data*).
2. La vista principal `/gestio/clients` es un listado tabular estricto **sin mapa** pero provisto de **paginación *server-side***.
3. La ficha `/gestio/clients/[id]` contiene los bloques de Datos Fiscales, Datos Bancarios (cifrados y restringidos a Boss y Secretaria), Planos (con enlace a `/gestio/planols`), Fincas SIGPAC, y los 4 slots: Trabajos (con popup de hoja de trabajo y fotos), Resumen Económico (desacoplado por DTO técnico para Ingeniero), Canal de Comunicaciones (Telegram/Alternativo con webhook securizado MIME) y Mapa de actividad.
4. El modelado de fincas incorpora coordenadas GPS y campos oficiales SIGPAC (*Municipio, Polígono, Parcela*) con trazabilidad histórica en transferencias de propiedad y blindaje temporal de acceso físico en la PWA.
5. Se garantiza la inmutabilidad y la prohibición de borrado físico de clientes con historial comercial o técnico previo, permitiendo solo el borrado de fichas creadas por error sin actividad vinculada, y disponiendo de baja lógica/anonimización por RGPD.
6. La importación/exportación CSV admite delimitadores estándar (coma y punto y coma), codificaciones UTF-8/ISO, gestiona errores mediante reporte visual detallado, y está firmemente restringida a perfiles gerenciales.
7. El router `/api/v1/gestio/comptabilitat/*` bloquea universalmente al rol Ingeniero con error `403 Forbidden`, requiriendo que toda visualización de facturas en clientes use `FacturaConsultaTecnicaDTO`.



---

## Matriu de Traçabilitat 1:1 i Protocol d'Execució de Tests DoD

Aquesta matriu estableix la traçabilitat directa 1:1 entre els requisits funcionals (**RF-01 a RF-28**), els casos límit (**EDGE-01 a EDGE-20**) i la suite de proves automatitzades de la Definition of Done (DoD), validada en entorn real multi-inquilí PostgreSQL amb RLS actiu i sense dades simulades (*Zero-Mock*).

| Codi RF | Àmbit Operatiu | Cas Límite Vinculat | Assert / Criteri de Validació DoD (Zero-Mock) |
| --- | --- | --- | --- |
| **RF-01** | Directorio | **EDGE-01** | Listado tabular paginado en backend (`LIMIT`/`OFFSET`); parseo íntegro en UTF-8. |
| **RF-02** | Directorio | **EDGE-01** | Búsqueda reactiva insensible a tildes y mayúsculas en nombre, NIF y municipio. |
| **RF-03** | Sistema | **EDGE-16** | Estado Día 0 real: 0 registros en BD retornan UI limpia sin datos simulados. |
| **RF-04** | Navegación | **EDGE-12** | Redirección por ID; RLS rechaza acceso a clientes de otros tenants (`404/403`). |
| **RF-05** | Alta Manual | **EDGE-05** | Geocodificación de dirección; fallback manual si la API cartográfica falla. |
| **RF-05.6** | Validación | **EDGE-03** | Validación algorítmica de NIF/CIF/NIE y VIES; bloqueo si el checksum es inválido. |
| **RF-06** | Integridad | **EDGE-02** | Unicidad estricta de NIF por empresa; rechazo de duplicados en UI y CSV. |
| **RF-07** | Importación | **EDGE-15** | Ingesta de CSV resistente a comas y puntos y coma; detección por sniffer. |
| **RF-08** | Importación | **EDGE-02** | Informe visual de filas rechazadas con desglose de causa y número de línea. |
| **RF-08.1** | Exportación | **EDGE-08** | Exportación CSV restringida a `Boss`/`Secretaria`; bloqueo `403` para `Ingeniero`. |
| **RF-09** | Ficha | **EDGE-12** | Cabecera fiscal y botón para alta de orden con `clientId` inyectado. |
| **RF-10** | Datos Cobro | **EDGE-04** | Validación de checksum IBAN (módulo 97); bloqueo de cuentas inválidas. |
| **RF-10.1** | Seguridad | **EDGE-13** | Cifrado AES-256-GCM de IBAN y custodia de mandato SEPA `.pdf.enc` en Hetzner. |
| **RF-11** | Seguridad | **EDGE-08** | Petición de Ingeniero a datos bancarios retorna payload purgado (`403/omisión`). |
| **RF-12** | Planos | **EDGE-12** | Enlace reactivo a `/gestio/planols?clientId=` con aislamiento RLS. |
| **RF-13.1** | Fincas | **EDGE-09** | Registro de finca con GPS y SIGPAC; advertencia ante discordancia cartográfica. |
| **RF-13.2** | Fincas | **EDGE-14** | Soporte de fincas y acometidas especiales sin polígono/parcela catastral. |
| **RF-13.3** | Seguridad | **EDGE-19** | PWA oculta códigos de acceso físicos a menos que la orden de trabajo esté activa hoy. |
| **RF-14** | Fincas | **EDGE-07** | Bloqueo de traspaso de fincas si existen órdenes activas `EN_EXECUCIO`. |
| **RF-14.1** | Integridad | **EDGE-07** | Traspaso de finca congela el `client_id` histórico en albaranes y facturas. |
| **RF-15** | Trabajos | **EDGE-12** | Cronología descendente de órdenes históricas filtradas bajo RLS. |
| **RF-16** | Trabajos | **EDGE-12** | Despliegue de modal con especificación técnica, fotos, incidencias y materiales. |
| **RF-16.4** | Seguridad | **EDGE-08** | Enlace de material a garantía de proveedor purga precios de compra y contratos. |
| **RF-17** | Facturación | **EDGE-12** | Resumen de facturas y cobros para roles administrativos (`Boss`/`Secretaria`). |
| **RF-18** | Facturación | **EDGE-08** | Ingeniero consulta facturas técnicas sin márgenes ni cuentas PGC. |
| **RF-18.1** | Seguridad | **EDGE-08** | Endpoint `/factures-tecniques` serializado con `FacturaConsultaTecnicaDTO`. |
| **RF-19** | Facturación | **EDGE-12** | Redirección hacia `/gestio/comptabilitat` para emisión Veri*factu centralizada. |
| **RF-20** | Notificaciones | **EDGE-10** | Detección de estado del bot de Telegram; marca `DESVINCULAT` si hay revocación. |
| **RF-21** | Notificaciones | **EDGE-10** | Conmutación hacia Email/SMS cuando Telegram no está operativo. |
| **RF-22** | Notificaciones | **EDGE-20** | Webhook valida MIME (`image`, `pdf`) e intercepta cargas maliciosas (`.exe`). |
| **RF-23** | Mapa | **EDGE-05** | Renderizado de sede y fincas en Slot 4; fallback limpio si faltan coordenadas. |
| **RF-24** | Mapa | **EDGE-05** | Clic en marcador de sede despliega ficha postal y teléfonos de contacto. |
| **RF-25** | Mapa | **EDGE-12** | Clic en marcador de trabajo abre modal técnico completo de la orden. |
| **RF-26** | Integridad | **EDGE-06** | Bloqueo estricto de `DELETE` físico si existe histórico comercial/técnico. |
| **RF-26.1** | Ciclo Vida | **EDGE-17** | Baja lógica (`actiu = FALSE`); bloqueo de nuevas órdenes y presupuestos. |
| **RF-27** | Mantenimiento | **EDGE-16** | Borrado físico admitido exclusivamente en altas erróneas sin actividad. |
| **RF-28** | Concurrencia | **EDGE-11** | Control de concurrencia optimista (`version_id`) en edición de datos de cliente. |
| **RNF-RGPD** | Privacidad | **EDGE-18** | Bloqueo y anonimización de datos no fiscales ante supresión RGPD (Art. 32 LOPDGDD). |
### Protocol d'Execució de Proves

Todas las pruebas asociadas a esta especificación se ejecutarán contra una instancia de PostgreSQL en contenedor aislado sin mocks (*Zero-Mock Policy*), registrando la sesión de la empresa mediante `SET LOCAL app.current_empresa_id = :uuid` y verificando mediante tests de intrusión automatizados que ningún usuario con rol `Ingeniero` o `Operari` pueda obtener claves financieras, volcados CSV de cartera comercial, datos de cuentas bancarias o ejecutar descargas de archivos comprometidos interceptados por el webhook.