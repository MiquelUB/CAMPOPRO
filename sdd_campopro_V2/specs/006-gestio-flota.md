# Spec 006 — Mòdul de Flota i Vehicles (/gestio/flota)

## Contexto y objetivo
El módulo de Gestión de Flota y Parque Móvil (`/gestio/flota`) es el centro de control técnico, legal y operativo de todos los activos móviles de la empresa, abarcando **todo tipo de vehículos con matrícula o sin ella** (furgonetas de cuadrilla, pick-ups, turismos comerciales, camiones ligeros y pesados, tractores y maquinaria autopropulsada de obra), con cualquier tipo de propulsión (**combustión diésel/gasolina, 100% eléctricos [EV] o híbridos enchufables [PHEV]** bajo idénticos estándares de rigor y seguimiento), así como **remolques de transporte**, los cuales se catalogan como herramientas de vehículos bajo la responsabilidad directa del encargado del parque móvil.

Conecta el parque móvil con la planificación geográfica en el mapa en vivo (`/gestio/feines/mapa`, Spec 005), la custodia de herramientas y dotación base rodante (`/gestio/magatzem`, Spec 004), el módulo general de tiquets y gastos, y el registro diario de jornadas, auditorías y odómetros/horómetros desde la PWA móvil del operario (`/operari`).

Resuelve con rigor la trazabilidad integral de cada activo:
1. **Régimen Económico, Adquisición y Amortización:** Registro de modalidades de tenencia (compra en propiedad con tablas de amortización contable mensual y valor residual, o contratos de renting/leasing con cuotas, límites de kilometraje anual contratado, penalizaciones por exceso y alertas de sobrekilometraje).
2. **Vehículos Eléctricos en Igualdad de Condiciones:** Gestión técnica completa de activos eléctricos (EV / PHEV) con capacidad de batería (kWh), potencia y tipo de conectores (Mennekes / CCS2 Combo), consumo en kWh/100km, mantenimiento específico de alta tensión, ITV de aislamiento galvánico y garantía extendida de batería (SoH).
3. **Distintivos Ambientales DGT y Control ZBE:** Clasificación ambiental oficial (0 Emisiones, ECO, C, B o Sin Distintivo) y gestión de autorizaciones municipales especiales para la circulación en Zonas de Bajas Emisiones (ZBE en núcleos urbanos), advirtiendo al supervisor en la asignación geográfica de obras al mapa para prevenir sanciones automáticas por cámaras de tráfico.
4. **Doble Registro Diario de Odómetro y Cálculo de Km:** Registro fehaciente en PWA de los kilómetros u horas de motor **tanto a la salida como a la llegada a la base** con fotografía del cuadro de mandos, consolidando los kilómetros reales recorridos en la jornada.
5. **Historial de Consumo Cruzado con Tiquets (Combustible o Recarga Eléctrica):** Aunque la gestión administrativa y aprobación contable de los tiquets de repostaje/recarga y dietas reside en el módulo de tiquets/contabilidad, la flota consolida un **historial de consumo real (L/100km para térmicos o kWh/100km para eléctricos)** cruzando los km diarios con los litros o kWh registrados en los tiquets del vehículo para detectar desvíos anómalos o averías mecánicas.
6. **Ficha de Mantenimiento del Fabricante (Térmica y Eléctrica):** Pautas de intervención preventiva según el tren motriz (aceites y filtros en combustión; refrigerante dieléctrico, líquido de frenos y cableado de alta tensión en eléctricos) por km, horas de motor o tiempo.
7. **Garantía Oficial del Fabricante, Concesionario y Batería de Tracción:** Control de vigencia por fecha y km/horas (incluyendo la garantía específica de la batería de alto voltaje para EV, típicamente 8 años / 160.000 km con degradación mínima SoH), alertas preventivas pre-expiración para revisiones gratuitas de fin de garantía, y comprobación automática ante averías para desviar reparaciones cubiertas al servicio oficial sin coste para la empresa.
8. **Inspecciones Legales (ITV) y Pólizas de Seguro:** Alertas proactivas enviadas semanas antes de su vencimiento (con pruebas específicas de emisiones en combustión o estanqueidad/aislamiento en eléctricos), con advertencias informativas que permiten al supervisor forzar la asignación de vehículos no conformes bajo su responsabilidad directa, dejando constancia indeleble en la hoja de tarea.
9. **Auditorías de Salida y Llegada a Base con Imputación Disciplinaria:** Pequeñas auditorías visuales (flujo de 30 segundos) con registro de incidencias en la hoja de tarea y en la ficha del operario, sancionando los daños no declarados.
10. **Asistencia en Viaje 24h y Talleres Concertados:** Enlace telefónico directo (`tel:`) y directorio de talleres concertados vinculado al protocolo de grúa del mapa (RF-21 Spec 005), con soporte para grúas con plataforma aptas para tracción eléctrica total.
11. **Infracciones de Tráfico e Identificación del Conductor:** Cruce automático de fecha y hora con los partes de presencia para generar el pliego de descargo oficial ante Tráfico (DGT, SCT, multas ZBE) en un solo clic.
12. **Seguridad Vial y Capacidad Homologada de Plazas:** Control de equipamiento reglamentario (baliza V16, extintor timbrado) y restricción dura en backend (HTTP 422) que impide sobreocupar furgonetas en traspasos de personal en campo (RF-23.4 Spec 005).

Toda la arquitectura respeta el principio de Tolerancia Cero a Datos Ficticios (*Zero Mock Data* con Estado Día 0 real), custodia documental en discos locales del servidor (sin AWS S3), aislamiento multi-inquilino mandatorio (RLS) y arquitectura asíncrona mediante Celery y Redis.

---

## Usuarios / actores y Matriz de Acceso (Zero-Trust)
El backend garantiza el aislamiento multi-inquilino (RLS mediante `app.current_empresa_id`) y la segregación de permisos por rol:

- **Boss (Gerencia / Propietario):** Supervisión global del parque móvil, adquisición y contratos de renting/leasing de vehículos (térmicos y eléctricos) y maquinaria, análisis de amortizaciones contables y proyección de sobrecostes por exceso de km en renting, gestión de garantías oficiales generales y de baterías, autorización de bajas definitivas y venta de activos, y consulta de costes acumulados de taller, recargas y consumo.
- **Responsable del Parc Mòbil / Supervisor Técnico / Ingeniero:** Gestión técnica y operativa del parque móvil. Asignación de vehículos y remolques a cuadrillas y capataces, custodia de las fichas de mantenimiento del fabricante (adaptadas a térmicos o eléctricos), seguimiento de distintivos ambientales para asignación de rutas urbanas ZBE, seguimiento de periodos de garantía (incluyendo degradación de batería en EV) para derivar averías al servicio oficial sin coste, supervisión del historial de consumos (L/100km o kWh/100km) y anomalías mecánicas, programación de mantenimientos por km o por horas de motor (horómetro), recepción de alertas preventivas de ITV, seguros y fin de garantía, gestión de órdenes de reparación en talleres concertados o concesionarios oficiales, y supervisión de las auditorías de estado a la salida y llegada a base. Dispone de la facultad de forzar asignaciones de vehículos no conformes o conductores con advertencia de carnet bajo su responsabilidad directa, quedando registrado en la orden de trabajo.
- **Secretaria / RRHH:** Gestión administrativa y documental: archivo de pólizas de seguros, certificados de distintivo ambiental DGT, autorizaciones municipales ZBE y contratos de renting/garantía, custodia de fichas técnicas e ITV, gestión de impuestos municipales (IVTM con bonificaciones ambientales si aplican), tramitación de expedientes sancionadores y multas de tráfico (incluyendo sanciones de accesos a ZBE) con identificación automatizada del conductor en fecha/hora de la infracción, y registro disciplinario de incidencias en la ficha del operario ante daños no declarados en el vehículo.
- **Responsable de Cuadrilla (Capataz / Conductor Asignado):** Custodio temporal y conductor oficial del vehículo durante su turno. Emite la telemetría GPS oficial de la furgoneta (RF-19 Spec 005), ejecuta la auditoría rápida del vehículo y la **lectura de odómetro/horómetro con foto tanto a la salida como a la llegada a base** en PWA, reporta de inmediato cualquier incidencia o daño en la furgoneta/remolque, y custodia la dotación base rodante y cables de recarga en eléctricos.
- **Operario de Cuadrilla (`/operari`):** Ocupante del vehículo. Participa en la verificación del estado del vehículo en obra y queda sujeto al registro de incidencias en su ficha de empleado en caso de causar o no reportar daños en el activo.

---

## Historias de usuario
- **H1:** Como *Supervisor del Parque Móvil*, quiero que el catálogo incluya todo tipo de activos (furgonetas diésel, furgonetas 100% eléctricas, remolques catalogados como herramientas y maquinaria sin matrícula con horómetro) con su ficha de mantenimiento del fabricante para llevar un control preventivo unificado.
- **H2:** Como *Supervisor*, cuando asigne una orden de trabajo ubicada en el centro urbano o en una Zona de Bajas Emisiones (ZBE), quiero que el sistema me advierta si el vehículo asignado tiene un distintivo ambiental restringido (p. ej. B o Sin Etiqueta) para evitar multas de 200€ por cámara y poder asignar una furgoneta ECO/0 o forzar la asignación si dispongo de autorización municipal.
- **H3:** Como *Boss*, quiero conocer la modalidad de adquisición de cada vehículo térmico o eléctrico (compra en propiedad con su amortización mensual acumulada, o contrato de renting con su cuota y límite anual de km) y recibir alertas si una furgoneta de renting proyecta un sobrekilometraje que generará penalizaciones económicas.
- **H4:** Como *Supervisor*, quiero que los capataces registren el odómetro con foto al salir y al volver a la base en la PWA para disponer del kilometraje diario exacto y cruzarlo automáticamente con los tiquets de combustible o recargas eléctricas, visualizando el historial de consumo real (L/100km o kWh/100km) de cada unidad.
- **H5:** Como *Supervisor*, cuando un vehículo eléctrico o térmico sufra una avería mecánica grave (o degradación prematura de batería en un EV), quiero que el sistema me informe al instante si el activo o la batería están en período de garantía oficial (por fecha y por km/horas) para tramitar la reparación directamente con el concesionario oficial de la marca sin coste para la empresa.
- **H6:** Como *Supervisor*, cuando asigne un vehículo, camión o remolque pesado a un trabajador que tenga el carnet caducado o no homologado para esa categoría, quiero recibir una advertencia informativa con aviso legal que me permita forzar la asignación bajo mi responsabilidad si la urgencia lo requiere, quedando constancia en la hoja de tarea.
- **H7:** Como *Secretaria*, quiero recibir alertas proactivas semanas antes de que venzan la ITV, la póliza de seguro, el contrato de renting o la garantía oficial/de batería de cualquier vehículo para gestionar las citas y renovaciones con tiempo suficiente.
- **H8:** Como *Capataz*, quiero realizar una pequeña auditoría visual al salir y al volver a la base en la PWA, y reportar cualquier golpe o anomalía en el vehículo para que quede registrado en la hoja de trabajo activa y en mi ficha de operario, evitando que se me culpe de daños preexistentes.
- **H9:** Como *Secretaria*, cuando llegue una multa de radar o de acceso indebido a ZBE de la DGT o Trànsit, quiero introducir la fecha y hora de la infracción y que el sistema me identifique de inmediato qué conductor y cuadrilla tenían asignado el vehículo en ese minuto exacto para generar el pliego de descargo oficial.

---

## Requisitos Funcionales (Criterios de Aceptación en EARS)

### Bloque 1: Directorio General de Flota (`/gestio/flota`) y Estado "Día 0"
- **RF-01:** EL SISTEMA presentará en `/gestio/flota` un listado tabular limpio **sin bloques de KPIs artificiales superiores**, mostrando por cada activo registrado las siguientes 8 columnas esenciales:
  1. *Identificador y Matrícula:* Matrícula oficial (o código interno si carece de matrícula, p. ej. `MINI-EXC-01`).
  2. *Tipología de Activo y Propulsión:* Furgoneta de Cuadrilla, Pick-up, Camión Ligero (<= 3.5T), Camión Pesado (> 3.5T), Maquinaria Autopropulsada (Tractor, Zanjadora, Excavadora) o Remolque de Transporte; indicando su tren motriz: **Combustión (Diésel/Gasolina), 100% Eléctrico (EV) o Híbrido Enchufable (PHEV)** con su **Distintivo Ambiental DGT oficial destacado (0 Emisiones, ECO, C, B o Sin Distintivo)**.
  3. *Marca, Modelo y Versión:* (p. ej. *Renault Master E-Tech Eléctrica* o *Kubota U27-4*).
  4. *Régimen de Adquisición:* Propiedad (con cuota de amortización contable) O Renting/Leasing (con cuota mensual y límite de km).
  5. *Conductor / Capataz Habitual Asignado:* Nombre del trabajador custodio con enlace directo a su ficha de empleado.
  6. *Métrica de Uso Acumulada:* Kilometraje actual (odómetro en km) para vehículos de carretera O Horas de motor (horómetro en h) para maquinaria autopropulsada.
  7. *Estado Operativo:* Operativo / En Servicio [Verde], En Ruta Activa [Azul], En Taller / Mantenimiento [Naranja], Con Incidencia Activa [Rojo], Baja Temporal [Gris].
  8. *Estado Legal / ITV, Seguro y Garantía:* Indicador unificado de vigencia legal (Verde en regla, Ámbar próximo a vencer en semanas, Rojo caducado/desfavorable) con distintivo de *Garantía Oficial Activa* (especificando si cubre garantía general o de batería en EV).
- **RF-02:** CUANDO el usuario introduce texto en el buscador superior, EL SISTEMA filtrará en tiempo real por: *Matrícula, Código interno, Marca, Modelo, Número de Bastidor (VIN/Número de Serie), Tipo de propulsión (Diésel, Gasolina, Eléctrico, Híbrido), Distintivo Ambiental DGT y Nombre del Conductor/Capataz asignado*.
- **RF-03:** EL SISTEMA dispondrá de filtros conmutables para segmentar el listado por: *Tipología de activo, Tipo de propulsión (Eléctricos 0 Emisiones vs. Térmicos), Distintivo Ambiental DGT (0, ECO, C, B, Sin Etiqueta), Régimen de tenencia (Propiedad vs. Renting/Leasing), Estado Operativo, Próximas caducidades de ITV/Seguro/Garantía/Renting (semanas antes), Mantenimientos pendientes y Activos sin asignar*.
- **RF-04:** SI el sistema se encuentra en estado "Día 0" (cero vehículos o maquinaria dados de alta), ENTONCES EL SISTEMA mostrará la pantalla completamente limpia, exhibiendo el buscador deshabilitado, el mensaje de estado vacío real (*"No hi ha vehicles registrats a la flota"*) y el botón de acción: **"Registrar nou vehicle / actiu"**, sin datos ficticios ni registros simulados (*Zero Mock Data*).

### Bloque 2: Tipología de Activos, Remolques y Bóveda Documental Local
- **RF-05:** EL SISTEMA permitirá dar de alta activos móviles clasificados en:
  1. *Vehículos con Matrícula:* Furgonetas-taller, pick-ups, turismos comerciales y camiones, tanto de combustión interna como 100% eléctricos o híbridos enchufables.
  2. *Maquinaria sin Matrícula:* Miniexcavadoras, zanjadoras, motobombas pesadas, dumpers y maquinaria autopropulsada (térmica o eléctrica con batería industrial) identificada por su Número de Serie de bastidor.
  3. *Remolques de Transporte:* Catalogados como herramientas de vehículos vinculados bajo la responsabilidad del **Responsable del Parc Mòbil**. Si el remolque es pesado (> 750 kg) y dispone de matrícula roja propia, se registrarán su póliza de seguro e ITV independiente; si es ligero (<= 750 kg), llevará la matrícula del vehículo tractor y su ficha detallará el mantenimiento, enganche y reparaciones.
- **RF-06:** EN cada ficha de activo, EL SISTEMA requerirá los datos maestros:
  1. *Datos Generales:* Matrícula o identificador interno, Número de Bastidor / Serie (VIN de 17 caracteres o número de chasis del fabricante), Marca, Modelo, Año de fabricación/matriculación y Tipo de propulsión (**Diésel, Gasolina, Híbrido Enchufable [PHEV], 100% Eléctrico [EV], GLP o Diésel Agrícola**).
  2. *Clasificación Ambiental DGT y Normativa Euro:* Distintivo ambiental oficial asignado (**0 Emisiones, ECO, C, B, o Sin Distintivo / Categoría A**) y norma Euro aplicable (Euro 4, 5, 6d-Temp, Euro 6e, etc.), junto al registro de **Autorizaciones Municipales Especiales para ZBE** (p. ej. moratoria profesional o permiso de servicios técnicos en AMB / Madrid ZBE con fecha de validez).
  3. *Especificaciones Técnicas Térmicas y Eléctricas:*
     a) En vehículos de combustión: Cilindrada (cc), potencia (kW/CV) y capacidad del depósito de combustible (litros).
     b) En vehículos eléctricos / PHEV: Capacidad neta y bruta de la batería de tracción (kWh), potencia máxima de recarga en corriente alterna CA (kW) y continua CC (kW), tipo de conectores admitidos (Tipo 2 Mennekes, CCS2 Combo) y autonomía oficial homologada WLTP (km).
  4. *Parámetros Físicos y Capacidad:* Masa Máxima Autorizada (MMA en kg), Tara (kg), Carga Útil (kg) y Plazas Homologadas (campo numérico entero estrictamente validado).
  5. *Régimen Económico de Adquisición y Amortización:*
     a) *Compra en Propiedad:* Precio de adquisición (€ sin IVA), fecha de compra, valor residual estimado (€), período de amortización fiscal (años o % anual según tablas contables) y cálculo automatizado de la **cuota de amortización contable mensual**.
     b) *Renting / Leasing:* Entidad arrendadora/financiera, cuota mensual (€ sin IVA, indicando si incluye alquiler de batería en EV), fecha de inicio y vencimiento, servicios incluidos (mantenimiento, neumáticos, seguro), **límite de kilometraje anual contratado (km/año)** y coste por kilómetro excedido (€/km).
- **RF-07:** EL SISTEMA gestionará una **Bóveda Documental Local por Activo**, almacenando todos los archivos digitalizados en discos duros locales del servidor (`/docs/<empresa_id>/flota/<vehicle_id>/documents/`), prohibiendo el uso de almacenamiento cloud privativo (AWS S3) y custodiando:
  1. Permiso de circulación (si aplica).
  2. Ficha Técnica de Inspección (Ficha ITV).
  3. Póliza de seguro y justificante de pago bancario en vigor.
  4. Manual de mantenimiento y hoja de especificaciones del fabricante (incluyendo protocolo de seguridad de alto voltaje en EV).
  5. Contrato o certificado de Garantía Oficial del fabricante/concesionario (y certificado de garantía de batería de alto voltaje en EV).
  6. Documento acreditativo de distintivo ambiental DGT y resoluciones de autorizaciones/exenciones municipales para ZBE.
  7. Contrato de renting/leasing con anexo de condiciones de kilometraje y seguro.
  8. Recibo del impuesto municipal de circulación (IVTM con bonificación ambiental si aplica).
  Todo archivo será validado por *Magic Bytes* (`filetype`), renombrado con UUID v4 y asociado al tenant autenticado (`app.current_empresa_id`).

### Bloque 3: Asignación de Vehículos, Validación de Carnet y Relevo en Jornada
- **RF-08:** CUANDO un supervisor asigna un vehículo, camión o combinación de transporte (vehículo + remolque pesado / maquinaria) a un conductor o capataz:
  1. EL SISTEMA contrastará la categoría requerida para el conjunto (B, B+E, C, C+E o certificado de maquinista) y la vigencia del carnet con la ficha del empleado asignado.
  2. SI el empleado tiene el **carnet de conducir caducado o no dispone de la categoría legal necesaria**:
     - EL SISTEMA **NO bloqueará rígidamente la asignación**, sino que desplegará una **advertencia informativa destacada** detallando la infracción legal potencial (responsabilidad administrativa art. 76.k LSV, riesgos de prevención laboral LPRL y eventual derecho de repetición del seguro).
     - Permitirá al supervisor **forzar la asignación bajo su responsabilidad directa**.
     - CUANDO el supervisor fuerza la asignación, EL SISTEMA registrará automáticamente la excepción en la **hoja de tarea / orden de trabajo**, dejando constancia del supervisor autorizante, fecha y motivo.
- **RF-09:** SI durante la jornada se produce un **cambio o relevo imprevisto de conductor** en un vehículo (por indisposición, contingencia operativa o reestructuración de cuadrilla):
  1. EL SISTEMA registrará de forma inmediata una **Incidencia Operativa de Cambio de Conductor**.
  2. Dejará constancia formal de dicha incidencia en la **hoja de tarea activa** y en el historial del vehículo, indicando la hora del relevo, el conductor saliente y el nuevo conductor responsable.

### Bloque 4: Auditorías de Salida y Llegada a Base, Daños e Incidencias Disciplinarias
- **RF-10:** EN la PWA del operario (`/operari`), EL SISTEMA implementará un protocolo ágil de **pequeña auditoría visual del vehículo a la salida y a la llegada a la base** (respetando el *Flux dels 30 segons*):
  1. *Auditoría de Salida (Apertura de Jornada):* El capataz confirmará con un check rápido el estado general del furgón/maquinaria (niveles visuales, neumáticos, estado de cables de recarga en eléctricos, ausencia de golpes nuevos y kit de seguridad abordo) y registrará la **lectura de odómetro/horómetro de salida** con fotografía del cuadro de mandos.
  2. *Auditoría de Llegada (Cierre de Jornada):* El capataz registrará la llegada a base confirmando que el vehículo queda en condiciones ordinarias (dejando conectado el furgón al punto de recarga de nave si es eléctrico), reportando cualquier percance surgido y registrando la **lectura de odómetro/horómetro de llegada** con fotografía del cuadro de mandos.
- **RF-11:** CUANDO el operario o capataz detecta o sufre cualquier percance con el vehículo (golpe de chapa, rascada, rotura de retrovisor, pinchazo, fallo en punto de recarga o avería mecánica/eléctrica):
  1. Deberá marcarlo inmediatamente como **Incidencia de Vehículo** desde su PWA.
  2. EL SISTEMA guardará automáticamente dicha incidencia en dos ubicaciones simultáneas:
     a) En la **hoja de trabajo / orden activa** en la que se produjo el incidente.
     b) En la **ficha personal del operario** responsable, para la debida trazabilidad laboral y de seguridad.
- **RF-12:** SI el operario **NO reporta una incidencia o daño en el vehículo** y dicho daño es descubierto posteriormente por el supervisor o en la auditoría de un relevo posterior:
  1. El supervisor registrará en el sistema la no conformidad del vehículo.
  2. EL SISTEMA marcará automáticamente una **Incidencia Disciplinaria en la Ficha del Operario** custodio que omitió el reporte, dejando constancia de la negligencia en la custodia del activo de la empresa.

### Bloque 5: Póliza de Seguros, Asistencia 24h y Talleres Concertados
- **RF-13:** EN la ficha de cada activo (o de los remolques/maquinaria que lo requieran), EL SISTEMA mantendrá permanentemente visibles los datos de la póliza de seguros:
  1. *Compañía y Póliza:* Entidad aseguradora, número de contrato y modalidad (Todo Riesgo con/sin franquicia, Terceros ampliado). En vehículos eléctricos, incluirá cobertura específica de cable de recarga, estación de carga y batería contra daños accidentales.
  2. *Fechas:* Entrada en vigor y fecha de vencimiento.
  3. *Asistencia en Viaje 24h:* Número telefónico corporativo con enlace de marcación rápida (`tel:`).
  4. *Coberturas Relevantes:* Asistencia desde km 0, rescate en pistas agrícolas/no asfaltadas, remolque con plataforma de transporte (obligatorio para no arrastrar ejes en vehículos eléctricos) y vehículo de sustitución.
- **RF-14:** EL SISTEMA mantendrá el directorio corporativo de **Talleres Mecánicos Concertados** (`/gestio/flota/tallers`):
  1. Cada registro incluirá: Nombre del taller, NIF/CIF, dirección física, teléfono directo, persona de contacto y habilitación técnica (indicando si el taller dispone de certificación oficial para manipular sistemas de alto voltaje en vehículos eléctricos).
  2. En cada vehículo se asignará su **Taller Concertado Preferente**.
  3. En caso de avería inmovilizante en carretera (RF-21 Spec 005), el popover del vehículo en el mapa `/gestio/feines/mapa` suministrará en un solo clic los datos del taller concertado preferente para coordinar el traslado con la grúa de la aseguradora.

### Bloque 6: Control de Odómetros/Horómetros e Historial de Consumos (Combustible o Recarga Eléctrica)
- **RF-15:** HISTORIAL DE MÉTRICA DE USO Y CÁLCULO DE KM DIARIOS:
  1. EL SISTEMA registrará la doble lectura diaria obligatoria:
     - Odómetro/horómetro de salida de base.
     - Odómetro/horómetro de llegada a base.
  2. EL SISTEMA calculará automáticamente los **Kilómetros Recorridos en la Jornada**:
     $$\text{Km Jornada} = \text{Odòmetre Arribada} - \text{Odòmetre Sortida}$$
     $$\text{Hores Jornada} = \text{Horòmetre Arribada} - \text{Horòmetre Sortida}$$
  3. Almacenará ambas lecturas con sus fotografías en `/docs/<empresa_id>/flota/<vehicle_id>/odometre/`.
  4. SI el valor de llegada es estrictamente **inferior al de salida**, EL SISTEMA bloqueará el guardado por regresión de odómetro. Si el incremento diario supera 800 km o 20 horas continuas, exigirá confirmación explícita para prevenir errores tipográficos.
- **RF-16:** HISTORIAL DE CONSUMO REAL CRUZADO CON TIQUETS DE COMBUSTIBLE O RECARGA ELÉCTRICA:
  1. Aunque la gestión administrativa y aprobación de los tiquets de combustible o recarga se realiza en el módulo de tiquets/contabilidad, EL SISTEMA integrará en la ficha del vehículo el **Historial de Consumo Real de Combustible / Energía**.
  2. EL SISTEMA cruzará automáticamente los kilómetros acumulados del vehículo (obtenidos del doble registro diario de odómetros) con los tiquets de repostaje o recargas eléctricas imputados a la matrícula de dicho vehículo en el módulo de tiquets (extrayendo fecha, litros o kWh, e importe).
  3. Calculará el **Consumo Medio Real**:
     a) *En vehículos térmicos:*
     $$\text{Consum Mitjà Real (L/100km)} = \frac{\sum \text{Litres Repostats en el Període}}{\Delta \text{Km Recorreguts en el Període}} \times 100$$
     b) *En vehículos 100% eléctricos (EV):*
     $$\text{Consum Mitjà Real (kWh/100km)} = \frac{\sum \text{kWh Carregats en el Període}}{\Delta \text{Km Recorreguts en el Període}} \times 100$$
  4. Presentará en la ficha del vehículo una **gráfica de evolución temporal y tabla de consumos**, emitiendo una advertencia visual si el consumo medio de un período supera en más de un **25% la media histórica del vehículo**, alertando al supervisor sobre posibles fugas de carburante, anomalías de inyección o degradación severa de la batería / fallo de gestión térmica en vehículos eléctricos.

### Bloque 7: Mantenimiento del Fabricante, ITV y Control de Zonas de Bajas Emisiones (ZBE)
- **RF-17:** CADA vehículo o máquina dispondrá en su ficha de la **Hoja de Mantenimiento del Fabricante** adaptada a su tren motriz:
  1. *En vehículos térmicos de combustión:* Parámetros de intervención programada para sustitución de aceites de motor, filtros (aceite, aire, combustible, habitáculo), correas de distribución y pastillas de freno.
  2. *En vehículos 100% eléctricos (EV):* Parámetros de intervención programada para inspección visual y estanqueidad del cableado de alto voltaje (color naranja), sustitución de líquido refrigerante dieléctrico de la batería de tracción, líquido de frenos, aceite del reductor de transmisión, comprobación de suspensión y neumáticos (sometidos a mayor par y peso), y filtro de habitáculo, **eximiendo de operaciones térmicas de cambio de aceite y filtros de combustión**.
  3. Definición del intervalo de disparo: por kilometraje acumulado (p. ej. cada 20.000 km térmico o 30.000 km EV), por horas de motor (p. ej. cada 250 horas en maquinaria) O por intervalo temporal (p. ej. cada 12 o 24 meses), lo que ocurra antes.
- **RF-18:** ALERTAS PREVENTIVAS PROACTIVAS DE ITV Y SEGURO:
  1. EL SISTEMA enviará **alertas preventivas semanas antes de la fecha de caducidad** tanto de la **ITV** como de la **Póliza de Seguro** de cualquier vehículo o remolque reglamentario.
  2. En vehículos eléctricos, la ficha técnica registrará la superación de las pruebas oficiales de ITV específicas para vehículos de alta tensión (aislamiento galvánico del chasis y estado estructural del paquete de baterías).
  3. Las alertas se proyectarán en el panel general de incidencias de `/gestio`, en el listado de flota y mediante notificación a `Secretaria`.
- **RF-19:** VINCULACIÓN CON EL MAPA Y ASIGNACIÓN DE VEHÍCULOS NO CONFORMES:
  1. SI un vehículo (térmico o eléctrico) tiene la **ITV caducada**, la **póliza de seguro vencida**, el **mantenimiento del fabricante vencido** o se encuentra en estado **"En taller / Avaria"**:
  2. Al intentar asignar dicho vehículo a una cuadrilla o ruta de trabajo en `/gestio/feines/mapa`:
     - EL SISTEMA **NO bloqueará de forma infranqueable la acción**, sino que emitirá una **advertencia informativa explícita** comunicando la no conformidad del vehículo.
     - Permitirá al supervisor o ingeniero **forzar la asignación bajo su responsabilidad directa** (conforme a la política que defina cada empresa en este sentido).
     - CUANDO la asignación es forzada, la excepción quedará **reflejada de forma indeleble en la hoja de tarea** de la jornada correspondiente para constancia operativa y legal.
- **RF-20:** CONTROL DE DISTINTIVOS AMBIENTALES DGT Y RESTRICCIONES EN ZONAS DE BAJAS EMISIONES (ZBE):
  1. CUANDO se programa o asigna una orden de trabajo ubicada dentro del perímetro cartografiado de una **Zona de Bajas Emisiones (ZBE)** municipal en `/gestio/feines/mapa`:
  2. EL SISTEMA contrastará el **Distintivo Ambiental DGT** del vehículo asignado y sus autorizaciones municipales vigentes frente a las restricciones de acceso de dicha ZBE.
  3. SI el vehículo asignado **no cumple la etiqueta mínima requerida para la ZBE de destino y no dispone de autorización municipal activa**:
     - EL SISTEMA desplegará una **advertencia informativa destacada de restricción ambiental ZBE**: *"Atención: El vehículo [Matrícula] dispone de distintivo [B / Sin Distintivo] no apto para la ZBE de [Municipio]. Riesgo de sanción automática por cámara de control de accesos (200 €)"*.
     - Permitirá al supervisor **reorganizar la cuadrilla hacia un vehículo apto (0 Emisiones, ECO o C)** O **forzar la asignación bajo su responsabilidad directa** (p. ej. en casos de intervención urgente de avería de red bajo exención municipal o moratoria técnica en trámite), quedando la excepción **registrada de forma indeleble en la hoja de tarea**.

### Bloque 8: Garantía Oficial de Activos (General y Batería EV) y Órdenes de Taller (ORT)
- **RF-21:** GESTIÓN DE LA GARANTÍA OFICIAL DEL FABRICANTE O CONCESIONARIO:
  1. En la ficha de cada activo nuevo o en periodo de cobertura, EL SISTEMA registrará los parámetros de la **Garantía Oficial**:
     - *Garantía General del Vehículo:* Vigencia temporal (meses/años) y límite de odómetro (km) u horómetro (h).
     - *Garantía Específica de Batería de Tracción (en Eléctricos / PHEV):* Vigencia temporal ampliada (típicamente 8 años o 160.000 km) y **umbral de degradación garantizado / State of Health (SoH)** (retención mínima garantizada de capacidad, p. ej. 70% u 80%).
     - *Condiciones de Validez:* Obligación de mantenimiento en red oficial o taller homologado según la hoja del fabricante (RF-17).
     - *Certificado adjunto:* Contrato o libro de garantía digitalizado custodiado en `/docs/<empresa_id>/flota/<vehicle_id>/documents/`.
- **RF-22:** COMPROBACIÓN AUTOMÁTICA DE GARANTÍA ANTE AVERÍAS Y ORDEN DE TALLER:
  1. CUANDO un operario reporta una incidencia mecánica o eléctrica grave (o pérdida anormal de autonomía en un EV), o el supervisor abre una **Orden de Reparación de Taller (ORT)** para un activo:
  2. EL SISTEMA comprobará automáticamente si el activo (o su batería de tracción) se encuentra en **período de garantía oficial activa** (contrastando fecha actual respecto al vencimiento temporal y odómetro/horómetro respecto al límite de uso).
  3. SI el activo o la batería están dentro del período de garantía:
     - EL SISTEMA desplegará una **alerta destacada de cobertura oficial**: *"Activo en Garantía Oficial del Fabricante hasta [Fecha] o [Límite km/h] (Garantía de Batería EV activa). Tramitar la reparación con el Concesionario Oficial [Nombre] para cobertura sin coste y preservación de la garantía"*.
     - Asignará por defecto el Concesionario Oficial en la ORT y marcará el flag **"Reparación en Garantía Oficial"**, impidiendo que se deriven reparaciones cubiertas a talleres independientes con coste evitable para la empresa.
- **RF-23:** ALERTA PREVENTIVA DE FIN DE GARANTÍA (GENERAL Y BATERÍA EV):
  1. EL SISTEMA emitirá una **alerta preventiva semanas antes del vencimiento temporal de la garantía general o de la garantía de batería en EV**, O al situarse a menos de **2.000 km o 100 horas de motor** de su límite de cobertura.
  2. Dicha alerta notificará al Responsable del Parc Mòbil para programar una **Revisión Integral Pre-Expiración de Garantía** en el concesionario oficial (incluyendo el test oficial de degradación SoH de la batería en vehículos eléctricos), permitiendo detectar celdas defectuosas, holguras o averías ocultas para su sustitución gratuita antes de que finalice la cobertura de la marca.
- **RF-24:** ÓRDENES DE REPARACIÓN DE TALLER (ORT) Y CICLO DE ESTADOS:
  1. *Apertura de ORT:* El supervisor registrará: activo, fecha de entrada a taller, odómetro/horómetro de entrada, taller asignado (oficial si está en garantía o concertado si no lo está) y descripción detallada del problema.
  2. *Conmutación Operativa:* El activo pasará al estado **"En Taller / Mantenimiento (Naranja)"**, advirtiendo en el mapa de operaciones su indisponibilidad.
  3. *Cierre de ORT:* Al concluir la intervención, el supervisor registrará la fecha de salida, odómetro/horómetro de entrega, resumen de piezas sustituidas, factura final (€ sin IVA) o albarán de garantía a coste cero (€ 0,00), conmutando el vehículo automáticamente de vuelta a estado **"Operativo / En Servicio (Verde)"**.

### Bloque 9: Infracciones de Tráfico e Identificación Automatizada del Conductor
- **RF-25:** EL SISTEMA gestionará el registro de **Expedientes de Multas y Sanciones de Tráfico** (`/gestio/flota/multes`):
  1. Datos del expediente: Número de expediente administrativo, Organismo emisor (DGT, Servei Català de Trànsit, Ayuntamiento), Matrícula del vehículo, Fecha y Hora exacta del hecho, Ubicación de la infracción, Tipología (exceso de velocidad, estacionamiento indebido, **acceso no autorizado a ZBE**, etc.), Importe y Puntos detraídos.
- **RF-26:** IDENTIFICACIÓN AUTOMÁTICA DEL CONDUCTOR RESPONSABLE:
  1. CUANDO se introduce la fecha y hora exacta de la sanción en el expediente, EL SISTEMA cruzará automáticamente los registros de presencia laboral de las cuadrillas, la titularidad del furgón y las hojas de trabajo activas en esa franja temporal.
  2. EL SISTEMA presentará la **identificación del conductor responsable** que conducía o custodiaba el vehículo en ese instante, detallando Nombre, Apellidos, DNI/NIE y la tarea asignada.
  3. Habilitará la generación con un solo clic del documento oficial de identificación del conductor en PDF para su tramitación telemática ante la sede electrónica de Tráfico dentro del plazo reglamentario de 20 días naturales.
  4. La regulación sobre la custodia y uso del vehículo fuera de la jornada laboral ordinaria (fines de semana, traslado al domicilio particular del trabajador) se regirá por la política interna que redacte y establezca cada empresa en su marco contractual.

### Bloque 10: Seguridad Vial, Dotación y Control de Plazas Homologadas
- **RF-27:** CADA vehículo mantendrá en su ficha el registro del **Equipamiento Obligatorio de Seguridad Vial**:
  1. Existencia y verificación de: Chalecos reflectantes homologados por plaza, Baliza luminosa geolocalizada **V16 homologada DGT 3.0**, Triángulos de señalización, Extintor timbrado con fecha de retimbrado en vigor y Botiquín reglamentario. En vehículos eléctricos, incluirá la custodia obligatoria del cable de carga Tipo 2 en maletero.
- **RF-28:** RESTRICCIÓN DURA DE PLAZAS HOMOLOGADAS EN CAMPO (RF-23.4 Spec 005):
  1. El campo *Plazas Homologadas* de cada furgoneta constituirá una **restricción estricta de validación en backend (HTTP 422)**:
  2. SI un supervisor intenta transferir operarios entre cuadrillas en el mapa territorial `/gestio/feines/mapa` y el número total de ocupantes resultantes supera las plazas homologadas del vehículo receptor, EL SISTEMA **denegará taxativamente la operación**, impidiendo la sobreocupación del vehículo y protegiendo a la empresa de responsabilidades penales y laborales.

### Bloque 11: Amortización Contable, Control de Rènting y Baja Definitiva
- **RF-29:** AMORTIZACIÓN Y CONTROL DE CONTRATOS DE RENTING / LEASING (TÉRMICO O ELÉCTRICO):
  1. *Amortización en Propiedad:* EL SISTEMA calculará mensualmente la cuota de amortización contable acumulada restando el valor residual del precio de compra (considerando posibles deducciones o subvenciones tipo Plan Moves en vehículos eléctricos), reflejando el valor contable neto actualizado de cada activo.
  2. *Proyección de Sobrekilometraje en Renting:* En vehículos bajo renting/leasing, EL SISTEMA proyectará el kilometraje anualizado a partir de las lecturas diarias acumuladas. Si la proyección supera el límite de km anuales contratados, emitirá una **alerta preventiva de sobrekilometraje** cuantificando el coste potencial de penalización (€/km).
  3. *Alerta de Fin de Renting:* EL SISTEMA enviará una alerta semanas antes del vencimiento del contrato para que la Gerencia (`Boss`) gestione la prórroga, devolución o compra del vehículo.
- **RF-30:** BAJA DEFINITIVA Y ARCHIVO HISTÓRICO:
  1. CUANDO un vehículo o máquina finalice su ciclo operativo en la empresa (por venta, desguace o devolución de renting):
  2. El usuario con rol `Boss` ejecutará el proceso de **Baja Definitiva**, registrando la fecha de baja, motivo, lectura final de odómetro/horómetro y certificado de destrucción o baja de Tráfico (con certificado de reciclaje de batería de tracción si es un vehículo eléctrico, conforme a normativa RAEE).
  3. El activo conmutará al estado inmutable **"Baja Definitiva / Desguace"**.
  4. Su matrícula o identificador quedará inhabilitado para futuras asignaciones en el mapa o almacén, pero **todo su historial técnico, documental, reparaciones, garantías, consumos, auditorías y sanciones permanecerá archivado en modo solo lectura durante el periodo legal de prescripción (5 años)**.

---

## Requisitos No Funcionales
- **Rendimiento Ultrarrápido:** El filtrado y consulta de la tabla de flota responderá en menos de 200 ms para parques móviles de hasta 100 activos simultáneos.
- **Seguridad Multi-Tenant (RLS):** Aislamiento estricto por `app.current_empresa_id` en todas las tablas de flota, pólizas, garantías, documentos y multas a nivel de base de datos PostgreSQL.
- **Custodia Local Soberana (Sin AWS S3):** Fichas técnicas, pólizas, contratos de renting/garantía, informes de ITV, autorizaciones ZBE y fotos de odómetros se guardan exclusivamente en los discos locales del servidor (`/docs/<empresa_id>/flota/`).
- **Arquitectura Asíncrona (Celery + Redis):** El escaneo nocturno de alertas preventivas (semanas antes de caducidades de ITV, seguro, garantía general, garantía de batería EV, autorizaciones ZBE o renting), el cálculo de consumos cruzados con tiquets y la compresión de fotos de odómetro se ejecutan en segundo plano mediante Celery.
- **Diseño Camaleón:** La interfaz web hereda las variables de marca corporativa (`--color-primary`, `--color-secondary`, etc.) configuradas por la empresa.

---

## Fuera de Alcance (Lo que explícitamente NO hace este módulo)
- **Gestión contable de tiquets y dietas:** Los recibos de compra de combustible o recargas eléctricas y dietas **se contabilizan, aprueban y desgravan en el módulo general de tiquets y contabilidad**; el módulo de flota únicamente consulta los litros/kWh imputados a la matrícula para calcular el historial de consumo medio.
- **Seguimiento GPS en vivo:** No realiza visualización cartográfica continua de la posición de los vehículos en este módulo (la torre de control territorial en tiempo real reside en `/gestio/feines/mapa`, Spec 005).
- **Política interna de uso fuera de jornada:** El sistema no impone una política de uso de vehículos en fines de semana o traslados a domicilio particular; dicha política debe ser redactada y acordada internamente por cada empresa.
- **Picking de almacén central:** La preparación y entrega de repuestos o piezas para el furgón se gobierna en `/gestio/magatzem` (Spec 004).

---

## Criterios de Finalización (Definition of Done)
1. Todos los requisitos funcionales (RF-01 al RF-30) redactados en sintaxis formal EARS respondiendo fielmente al QUÉ y al PER QUÉ de la operativa real.
2. Catálogo que soporte todo tipo de vehículos (con o sin matrícula), tanto de combustión interna como 100% eléctricos (EV) e híbridos (PHEV), maquinaria de obra con horómetro y remolques gestionados como herramientas por el responsable del parque móvil.
3. Tratamiento integral de vehículos eléctricos en igualdad de condiciones: capacidad de batería (kWh), conectores (Tipo 2 / CCS2), consumo en kWh/100km, mantenimiento específico de alta tensión e ITV eléctrica de aislamiento galvánico.
4. Módulo de Distintivos Ambientales DGT (0, ECO, C, B, Sin Etiqueta) y control preventivo de acceso a Zonas de Bajas Emisiones (ZBE) en la planificación territorial del mapa.
5. Ficha de adquisición con cálculo de amortización contable mensual (propiedad) o control de contrato de renting con alerta preventiva de sobrekilometraje anualizado.
6. Doble registro obligatorio de odómetro/horómetro en PWA (salida de base y llegada a base) con soporte fotográfico.
7. Historial de consumo real (L/100km en combustión o kWh/100km en eléctricos) cruzando los km recorridos con los litros o kWh imputados desde el módulo de tiquets, con alerta por desvío >25%.
8. Módulo de Garantía Oficial general y Garantía Específica de Batería de Tracción en EV (con umbral de degradación SoH >= 70%), con comprobación automática ante averías y alerta preventiva pre-expiración de cobertura.
9. Validación de carnet de conducir y estado del vehículo (ITV/mantenimiento/taller) mediante advertencias informativas que permiten al supervisor forzar la asignación bajo su responsabilidad, reflejándose en la hoja de tarea.
10. Protocolo de pequeñas auditorías visuales de salida y llegada a base en PWA, con reflejo de incidencias en la hoja de trabajo y en la ficha del operario (sancionando omisiones).
11. Envío de alertas preventivas semanas antes del vencimiento de la ITV, del seguro, de la garantía oficial (general y batería), de autorizaciones ZBE y del contrato de renting.
12. Módulo de expedientes de sanciones de tráfico (incluyendo multas de acceso indebido a ZBE) con identificación automatizada del conductor en fecha/hora y generación de pliego en PDF.
13. Restricción dura en backend (HTTP 422) de plazas homologadas en traspasos de operarios en campo.
14. Cumplimiento absoluto de Tolerancia Cero a Datos Ficticios (*Zero Mock Data* con Estado Día 0 real).
15. Almacenamiento 100% en discos locales del servidor (sin AWS S3) y aislamiento RLS multi-tenant garantizado.
