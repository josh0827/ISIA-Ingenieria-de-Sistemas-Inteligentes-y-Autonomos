# Verificación funcional — fases 1 a 9

## Preparación

1. Aplicar, en orden, `supabase/migrations/202610140001_networking_fases_1_5.sql` y `supabase/migrations/202610140002_networking_fases_6_9.sql`.
2. Configurar Supabase y preparar cuentas activas con roles `admin`, `editor` y `empresa`.
3. Para GitHub, definir `GITHUB_WEBHOOK_SECRET` y `GITHUB_ALLOWED_OWNER`; no usar valores reales en Git.
4. Desplegar primero en Preview y conservar el contenido ilustrativo activo durante la revisión.

## Fase 1. Arquitectura pública y administrativa

- [ ] El encabezado agrupa Inicio, Semillero, Proyectos, Oportunidades, Comunidad, Actividades y Participar.
- [ ] Los hubs funcionan en escritorio y móvil y sus enlaces especializados responden.
- [ ] El panel agrupa contenido por función; `empresa` solo ve sus oportunidades.
- [ ] Una cuenta sin permiso recibe 401/403 al intentar rutas o mutaciones administrativas.

## Fase 2. Networking y privacidad

- [ ] Un proyecto confirmado recibe una propuesta de colaboración y esta aparece en Administración > Bandeja.
- [ ] Un segundo envío con el mismo correo antes de 15 minutos se rechaza; superar 30 solicitudes por hora en una misma tabla también se rechaza.
- [ ] Ningún listado público expone correos de remitentes o responsables internos.
- [ ] Editor puede cambiar el estado; solo admin puede eliminar los datos.

## Fase 3. Ideas y retos

- [ ] Se crea una idea con estado, madurez, área, necesidades e imagen opcional.
- [ ] La búsqueda, los filtros y la ficha funcionan en móvil y escritorio.
- [ ] Una idea confirmada puede convertirse en proyecto.
- [ ] El proyecto convertido queda como Borrador y En formulación.

## Fase 4. Prototipado y colaboración

- [ ] Se publica una capacidad confirmada y activa.
- [ ] Un reto general o vinculado a una capacidad llega a la bandeja privada.
- [ ] El formulario exige contexto, resultado, área y consentimiento.
- [ ] El texto no promete ejecución, confidencialidad automática ni relación contractual.

## Fase 5. Oportunidades e histórico

- [ ] Borrador no aparece; Abierta aparece en Disponibles; Cerrada y Archivada pasan al Histórico.
- [ ] Una oportunidad cerrada no admite postulación.
- [ ] El correo histórico solo aparece con autorización explícita.
- [ ] Solo admin elimina; editor y empresa reciben rechazo del servidor.

## Fase 6. Innovación y apoyo

- [ ] `/innovacion` conecta ideas, prototipado y proyectos sin agregar otra opción al menú principal.
- [ ] El enlace se marca dentro del contexto activo de Proyectos.
- [ ] Cada proyecto confirmado permite proponer apoyo desde su ficha.
- [ ] El portal no ofrece pagos, inversión, participación financiera ni acuerdos automáticos.

## Fase 7. GitHub

- [ ] Un webhook con firma incorrecta responde 401 y no crea registros.
- [ ] Un evento distinto de `fork` se ignora.
- [ ] Un fork de un propietario no autorizado queda rechazado y no crea proyecto.
- [ ] Un fork válido crea un solo proyecto con origen GitHub, Borrador, no confirmado y En formulación.
- [ ] Repetir el mismo `X-GitHub-Delivery` no duplica el proyecto.
- [ ] Admin consulta la entrega en Administración > Integraciones; editor y empresa no pueden abrir esa ruta.

## Fase 8. Preguntas y respuestas

- [ ] El formulario rechaza preguntas cortas, categorías inválidas y falta de consentimiento.
- [ ] Una pregunta nueva no aparece públicamente.
- [ ] Editor guarda una respuesta sin publicarla y la pregunta sigue oculta.
- [ ] Al activar Publicar, `/preguntas` muestra categoría, pregunta y respuesta, pero no nombre ni correo.
- [ ] Archivar retira la pregunta; solo admin puede eliminar sus datos.

## Fase 9. Operación y cierre

- [ ] `/api/salud` responde 200 y `operativo` con Supabase disponible, o 503 y `degradado` sin configuración/conexión; incluye `version`, `entorno` y `correo`.
- [ ] En DEMO, el HTML contiene `noindex`, la respuesta lleva `X-Robots-Tag` y `/sitemap.xml` está vacío; `/privacidad` responde 200.
- [ ] El menú del panel muestra los contadores de solicitudes nuevas y preguntas pendientes, y la auditoría filtra y pagina.
- [ ] Un editor que descarga el respaldo no recibe `contacto_email` de las prácticas; un admin sí.
- [ ] La ruta de salud no expone claves, URLs privadas ni mensajes internos de base de datos.
- [ ] La auditoría registra respuestas, publicaciones, archivos y eliminaciones administrativas.
- [ ] Manual, variables y migraciones coinciden con el despliegue Preview.
- [ ] `npm test`, `npm run lint`, `npm run typecheck` y `npm run build` terminan correctamente.
- [ ] No hay errores relevantes en consola, enlaces ficticios activos, desbordamiento horizontal ni contenido dependiente de scroll para aparecer.

## Cierre manual

- [ ] Probar teclado, foco visible y lector de pantalla en formularios.
- [ ] Revisar las nuevas rutas a 390 px, 768 px y escritorio.
- [ ] Confirmar el remitente institucional, política de conservación y responsables de moderación.
- [ ] Registrar fecha, ambiente, persona verificadora y hallazgos antes de promover a producción.
