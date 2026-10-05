# Verificación de la demo ISIA

Última actualización: 5 de octubre de 2026.

## Estado verificado

La aplicación compila con Next.js 15.5.25 y conserva la interfaz pública, el panel administrativo por roles, Supabase Auth, PostgreSQL y Storage. Esta revisión añadió contacto institucional, formulario de manifestación de interés, estados editoriales, vista previa privada, biblioteca multimedia, auditoría y exportación de respaldo.

## Comprobaciones automáticas

| Comprobación | Resultado |
| --- | --- |
| `npm.cmd run typecheck` | Correcta, sin errores TypeScript |
| `npm.cmd run lint` | Correcta, sin errores ESLint |
| `npm.cmd test` | 20 pruebas correctas |
| `npm.cmd run build` | Compilación de producción correcta |
| Rutas nuevas | `/admin/solicitudes`, `/admin/multimedia`, `/admin/auditoria`, vista previa y exportación incluidas en el build |
| Inicio local | `/`, `/unete` y `/admin/iniciar-sesion` respondieron HTTP 200 |
| Renderizado | HTML con contenido y sin overlay de error de Next.js |
| Formulario | Esquema válido, rechazo sin intereses/consentimiento y campo trampa probados |

El entorno de automatización no ofreció un navegador gráfico para repetir capturas de escritorio y móvil en esta revisión. La verificación visual histórica no se presenta como resultado actual. Debe repetirse en el Preview de Vercel antes de promover el despliegue.

## Pruebas manuales necesarias después de aplicar la migración

Aplicar `supabase/migrations/202610050001_solicitudes_auditoria_editorial.sql` y comprobar:

- [ ] Enviar una manifestación de interés desde `/unete`.
- [ ] Verla en `/admin/solicitudes` y cambiar su estado.
- [ ] Confirmar que editor no puede eliminarla y admin sí.
- [ ] Configurar Resend en un entorno de prueba y confirmar la recepción del aviso.
- [ ] Crear un borrador y comprobar que no aparece mediante URL pública.
- [ ] Programar contenido y comprobar su aparición desde la fecha de Colombia.
- [ ] Revisar la vista previa privada de un borrador.
- [ ] Reemplazar una imagen y confirmar que el archivo anterior desaparece de Storage.
- [ ] Revisar archivos en `/admin/multimedia` y proteger los que tienen referencias.
- [ ] Descargar el respaldo JSON y abrirlo antes de archivarlo en Drive.
- [ ] Consultar la auditoría con rol admin y rechazar el acceso de editor y empresa.
- [ ] Revisar la página Únete en 360, 768 y 1440 px, incluido foco de teclado y mensajes de error.

## Datos pendientes para una versión FULL

- Presentación, objetivos y líneas aprobadas.
- Proyectos, participantes, novedades y calendario reales.
- Directorio, fotografías y autorizaciones de publicación.
- Publicaciones y enlaces confirmados.
- Procedimiento formal y periodos de vinculación.
- Facultad, campus y espacio específico.
- Responsable y plazo de conservación de solicitudes.
- Aval institucional, plantilla oficial y dirección `unal.edu.co`.

El correo de contacto confirmado es `isia_man@unal.edu.co`. El procedimiento para solicitar el dominio está en [SOLICITUD_DOMINIO_UNAL.md](SOLICITUD_DOMINIO_UNAL.md).
