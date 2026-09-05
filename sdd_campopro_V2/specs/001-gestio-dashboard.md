# Spec 001 — Dashboard de Control Operativo Diario (/gestio)

## Contexto y objetivo
El Dashboard de Gestión es el centro neurálgico y operativo de inicio de jornada para la oficina técnica y la dirección de la empresa. Proporciona una visión instantánea ("en 5 segundos") del estado global del negocio, la actividad de las cuadrillas en campo, las incidencias urgentes y las necesidades de mantenimiento preventivo. 

Actúa como radar de supervisión y trampolín de navegación hacia las áreas detalladas del sistema con una jerarquía limpia de 3 niveles, sin sobrecarga de capas ni duplicación de flujos de edición complejos. Todo el almacenamiento de archivos (audios, fotos, albaranes y planos) reside en almacenamiento local seguro (servidor/Mini PC con nodo de IA) con copias de seguridad semanales programadas cada domingo (sin dependencia de AWS S3).

---

## Usuarios / actores y Matriz de Acceso (Zero-Trust)
El backend garantiza el aislamiento de datos por rol mediante endpoints específicos y esquemas segregados (la seguridad nunca recae en la mera ocultación visual de la interfaz):

- **Boss (Gerencia / Propietario):** Acceso total e irrestricto a todas las métricas operativas, personal, alertas, mapa y magnitudes financieras globales (facturación total acumulada, márgenes y estados de cobro). Único perfil con acceso a la pantalla de KPIs macroeconómicos de la empresa.
- **Ingeniero / Supervisor Técnico:** Acceso total a la operativa de campo, cuadrillas, incidencias, mapa y alertas preventivas. **Acceso autorizado a la búsqueda y lectura de cualquier factura o albarán unitario de clientes** para resolver dudas de obra. **Bloqueo estricto a nivel de API** sobre el Kanban de Facturación global y la página de balances económicos de la empresa (los endpoints para este rol omiten estos datos en el payload).
- **Secretaria / RRHH:** Acceso al canal de notificaciones Telegram, registro horario/presencia de operarios, **emisión y gestión de facturas de clientes mediante Veri*factu**, visualización del 4º Kanban de facturación operativa del día, y **gestión administrativa completa de personal (altas de trabajadores, contratos, nóminas y expedientes laborales)**; sin acceso a la pantalla de balances y KPIs macroeconómicos de la empresa.

---

## Historias de usuario
- **H1:** Como *Ingeniero*, quiero ver en tiempo real la ubicación de mis cuadrillas y los trabajos asignados hoy para coordinar desvíos e imprevistos inmediatamente.
- **H2:** Como *Ingeniero*, quiero recibir alertas visuales inmediatas cuando un operario envíe una nota de voz para escucharla, leer la transcripción generada por el nodo local y saltar a la orden de trabajo con un clic si se requiere intervención gráfica.
- **H3:** Como *Ingeniero*, quiero buscar y abrir cualquier factura o albarán individual de un cliente para contrastar unidades o materiales instalados sin tener acceso a la rentabilidad global de la empresa.
- **H4:** Como *Boss*, quiero monitorizar el volumen de facturación pendiente y el cumplimiento de cobros del día para asegurar la liquidez del negocio sin abrir informes contables pesados.
- **H5:** Como *Secretaria / RRHH*, quiero tramitar altas de operarios, emitir facturas con Veri*factu y supervisar alertas inmediatas de personal, ITV y stock bajo mínimos.

---

## Requisitos Funcionales (Criterios de Aceptación en EARS)

### Bloque 1: Cabecera y Meta-Buscador Universal con Filtro por Entidad
- **RF-01:** EL SISTEMA mantendrá visible en la cabecera un saludo dinámico según la franja horaria, la fecha actual en formato legible, el nombre del usuario conectado y un acceso directo "?" al manual y bienvenida operativa.
- **RF-02:** CUANDO el usuario introduce 2 o más caracteres en el meta-buscador, EL SISTEMA permitirá seleccionar chips/pestañas de filtro por entidad (*Todos, Clientes, Facturas, Operarios, Órdenes, Vehículos, Almacén*) para acotar la búsqueda, desplegando los resultados coincidentes de forma insensible a mayúsculas y acentos (sin comodines sintácticos).
- **RF-03:** CUANDO el usuario selecciona un resultado del meta-buscador, EL SISTEMA redirigirá inmediatamente a la ficha, orden o documento correspondiente.
- **RF-04:** SI la búsqueda no arroja coincidencias en la categoría seleccionada, ENTONCES EL SISTEMA mostrará un mensaje explícito de "Sin resultados coincidentes" con opción de limpiar el filtro.
- **RF-05:** CUANDO el usuario pulsa el botón "Orden de trabajo genérica", EL SISTEMA redirigirá a la vista de creación completa (`/gestio/feines/crear`).

### Bloque 2: Campana de Incidencias y Flujo de Audio / IA Local
- **RF-06:** CUANDO un operario registra una incidencia de voz desde la PWA, EL SISTEMA conmutará instantáneamente el icono de la campana en la cabecera a color rojo de alerta prioritaria e incrementará el contador numérico de pendientes.
- **RF-07:** CUANDO el usuario hace clic sobre la campana de alertas, EL SISTEMA desplegará una ventana modal ágil con: identificador de la orden, operario, cliente, reproductor de audio activable mediante botón de reproducción explícito del usuario y la transcripción textual generada por el motor de IA local.
- **RF-08:** SI el nodo de IA local (LM Studio / Ollama) se encuentra saturado, apagado o excede el tiempo de espera, ENTONCES EL SISTEMA mantendrá el reproductor de audio plenamente accesible y presentará en el área de texto el mensaje informativo: *"Transcripció temporalment no disponible / En cua"*.
- **RF-09:** DENTRO del modal de la campana, EL SISTEMA dispondrá de un checklist de resolución rápida (`Solucionada`, `Pendent de pressupost`); la opción "Pendent de pressupost" actuará como una marca informativa en la orden de trabajo para que el ingeniero elabore el presupuesto adicional desde el módulo de incidencias, junto con un botón de acceso directo a la orden para gestionar planos o fotos complementarias.

### Bloque 3: Nivel 1 — Pulso Operativo (Los 4 Kanbans en Tiempo Real)
- **RF-10:** EL SISTEMA mostrará un primer bloque Kanban con los "Trabajos de Hoy" desglosados en *Pendientes, En Curso y Completados*.
- **RF-11:** CUANDO el usuario pulsa sobre el Kanban de Trabajos de Hoy, EL SISTEMA abrirá la pantalla de seguimiento geográfico de trabajos (`/gestio/feines/mapa`).
- **RF-12:** EL SISTEMA mostrará un segundo bloque Kanban con los "Operarios Activos" distribuidos en sus estados: *En Faena / Activo, En Camino (Desplazamiento), En Descanso y Desconectado / Sin Jornada*.
- **RF-13:** EL SISTEMA determinará automáticamente el estado "En Camino" para un operario con jornada activa en los siguientes supuestos:
  1. *Inicio de Jornada:* Desde el fichaje de entrada hasta posicionarse a menos de **50 metros de tolerancia** de la primera tarea asignada.
  2. *Entre Tareas:* Al marcar como `Completada` una orden y mientras se encuentre a más de 50 metros del destino de la siguiente tarea programada.
  3. *Retorno a Base:* Tras completar la última orden de la jornada y mientras se desplaza de regreso a la sede/almacén antes de fichar la salida.
- **RF-14:** EL SISTEMA reconocerá puntos GPS preconfigurados de la empresa (Almacén Central, Taller, Base de Retén); SI un operario en jornada activa no tiene órdenes externas programadas y se ubica dentro de un radio de 50 metros de dichas bases, ENTONCES EL SISTEMA lo mantendrá en estado "En Faena / Activo Interno", evitando asignarle erróneamente el estado de desplazamiento.
- **RF-15:** EL SISTEMA mostrará un tercer bloque Kanban con las "Alertas e Incidencias" segmentadas por operario y por cliente, destacando incidencias con parada de obra o sobrecoste de material.
- **RF-16:** MIENTRAS el usuario autenticado tenga rol `Boss` o `Secretaria / RRHH`, EL SISTEMA solicitará y mostrará el cuarto bloque Kanban con las métricas de "Facturación" operativa (*Importe pendiente de facturar, facturado en el día y cobros pendientes*).
- **RF-17:** SI el usuario autenticado tiene rol `Ingeniero`, ENTONCES EL SISTEMA consumirá un endpoint segregado que omite las métricas globales de facturación y renderizará el panel sin el cuarto bloque Kanban, preservando intacta la capacidad del usuario para buscar y consultar facturas unitarias individuales de clientes.

### Bloque 4: Nivel 2 — Centro de Operaciones (Órdenes y Mapa con Marcadores Agrupados)
- **RF-18:** EL SISTEMA presentará un contenedor estructurado de "Órdenes de Trabajo" con filtros directos para alternar entre *Activas, Completadas y Pendientes*, detallando código, cliente, cuadrilla y horas acumuladas.
- **RF-19:** EL SISTEMA proyectará un Mapa de Seguimiento Geográfico en tiempo real renderizando las posiciones GPS de los operarios y la ubicación de las incidencias activas.
- **RF-20:** CUANDO dos o más operarios coincidan en la misma ubicación geográfica o vehículo, EL SISTEMA renderizará en el mapa un marcador agrupado con un contador numérico visible; al hacer clic sobre dicho marcador, el mapa se expandirá desplegando los avatares individuales y nombres de todos los operarios presentes.
- **RF-21:** CUANDO el usuario hace clic sobre cualquier marcador individual en el mapa, EL SISTEMA desplegará una tarjeta emergente (*popup*) con: tarea actual, operario con enlace a su ficha y cliente con enlace directo a su expediente.
- **RF-22:** EL SISTEMA dispondrá en el mapa de un selector rápido de filtros por estado operativo (ej. aislar cuadrillas en camino, en faena o con incidencias).

### Bloque 5: Nivel 3 — Alertas Preventivas Inmediatas (Vehículos, Herramientas y Stock)
- **RF-23:** EL SISTEMA presentará en la sección inferior la lista de alertas preventivas activas detallando el motivo del aviso y un enlace directo a la ficha del vehículo, herramienta o producto en `/gestio/flota` o `/gestio/magatzem`.
- **RF-24:** CUANDO una herramienta sea reportada como averiada o perdida, EL SISTEMA asociará automáticamente el registro de dicha incidencia en el expediente personal del operario a cargo.
- **RF-25:** EL SISTEMA mostrará en el área de stock exclusivamente aquellos materiales cuyas existencias registradas sean iguales o inferiores al stock mínimo de seguridad configurado en almacén, disponiendo de un acceso directo al producto para tramitar el pedido al proveedor (*Human-in-the-Loop*).
- **RF-26:** EL SISTEMA registrará la resolución y control de alertas preventivas (ej. superación de ITV o calibración de herramientas) de manera manual por parte del personal de oficina técnica.

### Bloque 6: Casos Límite, Degradación de Red y "Día 0"
- **RF-27:** SI el sistema se encuentra en estado "Día 0" (sin actividad previa ni operarios en ruta), ENTONCES EL SISTEMA mostrará paneles con contadores a 0 y estados vacíos (*Empty States*) reales con botones para dar de alta la primera orden o personal, sin inyectar jamás datos ficticios o simulados.
- **RF-28:** SI el dispositivo de un operario con jornada abierta deja de emitir telemetría GPS durante **15 minutos consecutivos**, ENTONCES EL SISTEMA conmutará su estado en el Dashboard a "Pérdida de Señal / Desconectado", mantendrá fijada su última posición conocida y activará una alerta prioritaria para el supervisor técnico (con previsión de verificación vía SMS por fallo de batería o emergencia).
- **RF-29:** MIENTRAS el Dashboard mantenga conexiones de refresco de telemetría o datos en tiempo real, EL SISTEMA renovará el token de acceso JWT de forma silenciosa e imperceptible mediante la cookie segura de refresco (`HttpOnly`), impidiendo bloqueos intempestivos de pantalla o redirecciones forzadas a login.
- **RF-30:** SI la conexión entre el Dashboard y el backend se interrumpe, ENTONCES EL SISTEMA mostrará una barra de advertencia no bloqueante ("Sin sincronización — Reintentando...") conservando en pantalla la última información recibida.

### Bloque 7: Previsión Futura — Chat Conversacional IA Local (RAG Documental Estricto)
- **RF-31 [MARCA PARA ESPECIFICACIÓN COMPLETA FUTURA]:** EL SISTEMA incorporará en el Dashboard de Control un **punto de anclaje de interfaz para un Chat Conversacional asistido por Inteligencia Artificial en nodo local** (LLM ejecutado localmente en el servidor/Mini PC de la empresa, p. ej. vía LM Studio / Ollama, preservando el RGPD y la soberanía total del dato):
  1. *Aislamiento y Veracidad Absoluta:* El LLM local **solo podrá responder preguntas basándose estricta y exclusivamente en la documentación presentada, datos corporativos o expedientes técnicos relacionados de la empresa** (RAG estricto sin alucinaciones ni asunciones externas).
  2. *Segregación Zero-Trust:* Las respuestas del chat respetarán el rol del usuario conectado (`Boss`, `Secretaria`, `Ingeniero`), impidiendo la fuga de datos financieros o albaranes de coste a perfiles no autorizados.
  3. *Postergación de Especificación Detallada:* Este requisito establece la reserva funcional y de arquitectura en el Dashboard; su especificación funcional completa (esquemas de contexto RAG, prompts de sistema, límites de tokens, gestión de memoria conversacional y casos de uso avanzados) **se redactará de forma exhaustiva en una fase/especificación posterior dedicada**.

---

## Requisitos No Funcionales
- **Almacenamiento Local Seguro:** Sin dependencia de AWS S3. Los archivos multimedia (fotos, audios, albaranes y planos) se gestionan directamente en volúmenes de almacenamiento del servidor/Mini PC donde corre la IA, con copias de seguridad semanales programadas cada domingo.
- **Seguridad Zero-Trust y RLS:** La base de datos aplica Row Level Security mandatorio (`empresa_id`). La segregación de datos financieros entre roles se aplica estrictamente a nivel de endpoints en el backend.
- **Procesamiento Asíncrono de Voz:** Las solicitudes de transcripción se procesan a través de una cola asíncrona (Celery + Redis) respetando el límite de concurrencia del motor local (LM Studio / Ollama).
- **Diseño Camaleón:** Paleta y logotipos inyectados vía variables CSS dinámicas según la identidad de la empresa cliente.
- **Rendimiento de Búsqueda:** El meta-buscador responderá con el listado acotado por filtro en menos de 250 ms.

---

## Fuera de Alcance (Lo que NO hace este Dashboard)
- No emite facturas oficiales Veri*factu en PDF (se realiza en `/gestio/comptabilitat`).
- No permite altas completas ni edición de datos maestros de clientes, vehículos o herramientas (se delega a sus pantallas maestras).
- No realiza envíos desatendidos de pedidos a proveedores (el email se valida en `/gestio/magatzem`).
- No incluye un módulo pesado de chat de planos/fotos en la cabecera (la edición y notas de planos se efectúan en la ficha de la orden de trabajo).
- El Chat Conversacional con LLM local queda marcado como previsión arquitectónica (RF-31), difiriéndose su especificación y diseño detallado a una fase posterior.
- No muestra la pantalla de balances y KPIs macroeconómicos de la empresa a usuarios sin rol `Boss`.
- No calcula roturas de stock de material asignado a órdenes futuras si las existencias físicas actuales superan el stock mínimo de seguridad de almacén.

---

## Criterios de Finalización (Definition of Done)
1. Todos los requisitos funcionales (RF-01 al RF-31) redactados en sintaxis formal EARS, incorporando la resolución de las observaciones de QA.
2. La arquitectura de almacenamiento refleja formalmente el uso de almacenamiento en disco duro local con backups semanales (sin S3).
3. El radio de tolerancia perimetral de trabajo queda fijado en 50 metros y se reconocen bases fijas de taller/retén.
4. El ciclo del estado "En Camino" cubre el trayecto inicial hacia la primera tarea, los trayectos intermedios y el retorno a base al culminar la jornada.
5. El umbral de alerta por desconexión/pérdida de señal de telemetría de operarios queda normalizado en 15 minutos.
6. Se aplica la política estricta de cero commits en el repositorio hasta solicitud explícita del usuario.
