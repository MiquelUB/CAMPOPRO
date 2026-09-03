# Spec 001 — Dashboard de Control Operativo Diario (/gestio)

## Contexto y objetivo
El Dashboard de Gestión es el centro neurálgico y operativo de inicio de jornada para la oficina técnica y la dirección de la empresa. Proporciona una visión instantánea ("en 5 segundos") del estado global del negocio, la actividad de las cuadrillas en campo, las incidencias urgentes y las necesidades de mantenimiento preventivo, actuando como radar de supervisión y trampolín de navegación hacia las áreas detalladas del sistema sin permitir sobrecarga de capas ni manipulación directa de datos maestros.

---

## Usuarios / actores y Matriz de Acceso
El sistema adapta dinámicamente la información visible en función del rol autenticado:

- **Boss (Gerencia / Propietario):** Acceso total e irrestricto a todas las métricas operativas, de personal, mantenimiento y financieras (totales de facturación, cobros pendientes y márgenes).
- **Ingeniero / Supervisor Técnico:** Acceso total a la operativa de campo, cuadrillas, incidencias, mapa y mantenimiento; **con bloqueo estricto de visualización** sobre el Kanban de Facturación y métricas económicas agregadas de la empresa.
- **Secretaria / RRHH:** Acceso al canal de notificaciones Telegram, registro horario/presencia de operarios y validación fiscal Veri*factu individual de partes completados, sin acceso a la rentabilidad global ni contabilidad consolidada.

---

## Historias de usuario
- **H1:** Como *Ingeniero*, quiero ver en tiempo real el estado y ubicación de mis cuadrillas y los trabajos asignados hoy para coordinar desvíos e imprevistos inmediatamente.
- **H2:** Como *Ingeniero*, quiero recibir avisos visuales inmediatos cuando un operario envíe una nota de voz con una incidencia de campo para escucharla, leer su transcripción y determinar si requiere presupuesto adicional sin salir del panel.
- **H3:** Como *Boss*, quiero visualizar el volumen de facturación pendiente y el cumplimiento de cobros del día para monitorizar la liquidez del negocio sin abrir informes contables pesados.
- **H4:** Como *Secretaria / RRHH*, quiero revisar las alertas de mantenimiento (ITV de vehículos, garantías de reparaciones y stock crítico) para tramitar citas de taller o redactar pedidos a proveedores con un solo clic.

---

## Requisitos Funcionales (Criterios de Aceptación en EARS)

### Bloque 1: Cabecera y Meta-Buscador Universal
- **RF-01:** EL SISTEMA mantendrá visible en la cabecera un saludo dinámico según la franja horaria, la fecha actual en formato legible, el nombre del usuario conectado y un acceso directo "?" al manual y bienvenida operativa.
- **RF-02:** CUANDO el usuario introduce 2 o más caracteres en la caja del meta-buscador, EL SISTEMA desplegará en tiempo real los resultados agrupados por categorías: *Clientes, Operarios, Órdenes de Trabajo, Matrículas de Vehículos, Referencias de Almacén y Números de Factura*.
- **RF-03:** CUANDO el usuario selecciona un resultado del meta-buscador, EL SISTEMA redirigirá inmediatamente a la ficha o expediente específico en el menú correspondiente.
- **RF-04:** SI la búsqueda no arroja coincidencias, ENTONCES EL SISTEMA mostrará un mensaje explícito de "Sin resultados coincidentes" con opción de limpiar la búsqueda.
- **RF-05:** CUANDO el usuario pulsa el botón "Orden de trabajo genérica", EL SISTEMA redirigirá a la vista de creación completa (`/gestio/feines/crear`).

### Bloque 2: Campana de Incidencias y Flujo de Audio Urgente
- **RF-06:** CUANDO un operario registra una incidencia de voz desde la PWA, EL SISTEMA conmutará instantáneamente el icono de la campana en la cabecera a color rojo de alerta prioritaria e incrementará el contador numérico de pendientes.
- **RF-07:** CUANDO el usuario hace clic sobre la campana de alertas, EL SISTEMA abrirá una ventana modal superpuesta con la lista de incidencias sin resolver, reproductor de audio integrado, transcripción generada por el motor de lenguaje local y datos del operario y cliente afectados.
- **RF-08:** DENTRO del modal de la campana, EL SISTEMA proporcionará un checklist interactivo que permitirá marcar la incidencia como "Solucionada" o "Pendiente de Presupuesto", actualizando de forma automática el historial en la ficha del operario y en la orden de trabajo correspondiente.

### Bloque 3: Nivel 1 — Pulso Operativo (Los 4 Kanbans en Tiempo Real)
- **RF-09:** EL SISTEMA mostrará un primer bloque Kanban con los "Trabajos de Hoy" desglosados en *Pendientes, En Curso y Completados*.
- **RF-10:** CUANDO el usuario pulsa sobre el Kanban de Trabajos de Hoy, EL SISTEMA abrirá la pantalla de seguimiento geográfico de trabajos (`/gestio/feines/mapa`).
- **RF-11:** EL SISTEMA mostrará un segundo bloque Kanban con los "Operarios Activos" distribuidos en sus estados: *En Faena / Activo, En Camino (Desplazamiento), En Descanso y Desconectado / Sin Jornada*.
- **RF-12:** EL SISTEMA mostrará un tercer bloque Kanban con las "Alertas e Incidencias" segmentadas por operario y por cliente, destacando incidencias con parada de obra o sobrecoste de material.
- **RF-13:** MIENTRAS el usuario tenga rol `Boss`, EL SISTEMA mostrará un cuarto bloque Kanban con las métricas de "Facturación" (*Importe pendiente de facturar, facturado en el día y cobros pendientes*).
- **RF-14:** SI el usuario autenticado tiene rol `Ingeniero`, ENTONCES EL SISTEMA ocultará completamente el cuarto bloque Kanban de Facturación sin romper la alineación visual del panel.

### Bloque 4: Nivel 2 — Centro de Operaciones (Órdenes y Mapa en Vivo)
- **RF-15:** EL SISTEMA presentará un contenedor estructurado de "Órdenes de Trabajo" con pestañas o filtros directos para alternar entre *Activas, Completadas y Pendientes*, mostrando en cada tarjeta código, cliente, cuadrilla asignada y tiempo transcurrido.
- **RF-16:** EL SISTEMA proyectará un Mapa de Seguimiento Geográfico en tiempo real renderizando las posiciones GPS de los operarios y la geolocalización de las incidencias activas.
- **RF-17:** EL SISTEMA representará mediante iconos con formas y colores diferenciados a cada tipo de elemento en el mapa, incluyendo una leyenda fija explicativa y un distintivo especial para los Jefes de Cuadrilla.
- **RF-18:** CUANDO el usuario hace clic sobre cualquier marcador en el mapa, EL SISTEMA desplegará una tarjeta emergente (*popup*) con: descripción del estado/tarea actual, nombre del operario a cargo con enlace a su ficha y nombre del cliente con enlace directo a su expediente.
- **RF-19:** EL SISTEMA dispondrá en el mapa de un selector rápido de filtro que permita aislar la vista por estados operativos (ej. mostrar únicamente cuadrillas en camino o únicamente alertas críticas).

### Bloque 5: Nivel 3 — Alertas Preventivas de Mantenimiento y Stock
- **RF-20:** EL SISTEMA agrupará en la sección inferior tres categorías de alertas preventivas:
  1. *Flota de Vehículos:* Vencimiento de ITV próximo (<30 días), revisiones mecánicas por kilometraje excedido, seguros a renovar y estado de garantías vigentes de reparaciones anteriores.
  2. *Herramientas de Trabajo:* Herramientas averiadas reportadas por el personal, herramientas no devueltas en el check-in diario, revisiones periódicas/calibración y vencimiento de garantías de compra.
  3. *Almacén y Stock:* Materiales por debajo del umbral mínimo de seguridad o insuficientes para acometer las tareas programadas de la semana.
- **RF-21:** CUANDO el usuario interactúa con una alerta de falta de stock, EL SISTEMA ofrecerá un botón para redactar un correo electrónico al proveedor habitual con el material, cantidad requerida y referencia técnica precargadas, requiriendo validación humana previa al envío.
- **RF-22:** CUANDO el usuario pulsa sobre cualquier alerta de mantenimiento, EL SISTEMA lo redirigirá a la sección respectiva del menú lateral (`/gestio/flota`, `/gestio/magatzem`).

### Bloque 6: Casos Límite, Degradación de Red y "Día 0"
- **RF-23:** SI el sistema se encuentra en estado "Día 0" (sin actividad registrada, sin operarios en ruta ni alertas), ENTONCES EL SISTEMA mostrará los paneles con contadores a 0 y estados vacíos (*Empty States*) contextuales con botones de invitación para crear la primera orden o dar de alta personal, sin inventar jamás datos ficticios o de muestra.
- **RF-24:** SI un operario en campo pierde la señal GPS o entra en zona sin cobertura, ENTONCES EL SISTEMA mantendrá fijado en el mapa su último punto geográfico contrastado, atenuará su icono con un color específico de "Pérdida de Señal" y mostrará en su popup el tiempo transcurrido desde la última emisión de telemetría.
- **RF-25:** SI la llamada al backend para actualizar los datos en tiempo real falla o se interrumpe la red en la oficina, ENTONCES EL SISTEMA exhibirá una barra discreta de advertencia ("Datos no sincronizados — Reintentando...") preservando en pantalla la última información recibida sin bloquear la navegación del usuario.

---

## Requisitos No Funcionales
- **Seguridad y Aislamiento:** Cumplimiento estricto de Row Level Security (RLS) en base de datos. Ninguna consulta del Dashboard devolverá datos pertenecientes a otra empresa cliente.
- **Zero Mock Data:** Queda terminantemente prohibido utilizar nombres simulados, clientes de prueba o tareas artificiales para rellenar los componentes del dashboard.
- **Diseño Camaleón:** La interfaz adaptará su paleta y logotipo corporativo a las variables CSS institucionales de la empresa sin hardcodear colores primarios fijos.
- **Tiempo de Respuesta:** El meta-buscador debe ofrecer sugerencias en menos de 250 ms desde la introducción del segundo carácter.

---

## Fuera de Alcance (Lo que NO hace este Dashboard)
- No permite la creación ni emisión directa de facturas oficiales en PDF ni registros Veri*factu (se delega a `/gestio/comptabilitat`).
- No permite la edición de fichas de clientes, altas de vehículos o modificación de stocks mínimos (se gestionan en sus respectivas páginas maestras).
- No realiza envíos automáticos de pedidos por email a proveedores sin supervisión y autorización humana expresa (*Human-in-the-Loop*).
- No ejecuta recálculos de algoritmos de optimización de rutas de transporte (se delega al módulo específico de cuadrillas).

---

## Criterios de Finalización (Definition of Done)
1. Todos los requisitos funcionales (RF-01 al RF-25) redactados en sintaxis formal EARS y aprobados por el usuario.
2. La jerarquía visual en 3 niveles (Pulso ➔ Centro de Mando ➔ Prevención) queda fijada sin duplicación de capas ni ventanas intrusivas.
3. La matriz de permisos por roles (`Boss`, `Ingeniero`, `Secretaria/RRHH`) está formalizada con la regla de ocultación del bloque financiero.
4. El tratamiento del operario desconectado (último punto GPS + color de alerta + tiempo transcurrido) queda normalizado.
5. El estado "Día 0" cumple estrictamente el principio de Tolerancia Cero a Datos Ficticios (*Zero Mock Data*).
