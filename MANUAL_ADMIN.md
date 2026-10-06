# Manual de administración del sitio web ISIA

## 1. Acceso y autenticación

1. Ingresa a `/admin`.
2. Selecciona **Iniciar sesión con Google**.
3. Usa la cuenta registrada en la tabla `usuarios_autorizados` de Supabase.
4. Al terminar, selecciona **Cerrar sesión**.

La autenticación de Google no concede permisos por sí sola. El usuario debe existir en `usuarios_autorizados`, tener `activo = true` y un rol válido.

## 2. Roles y permisos

| Acción | Admin | Editor | Empresa |
| --- | :---: | :---: | :---: |
| Acceder al panel general | Sí | Sí | No |
| Configurar secciones públicas | Sí | Sí | No |
| Gestionar proyectos, novedades, reuniones, integrantes, publicaciones y galería | Sí | Sí | No |
| Gestionar grupos de trabajo | Sí | Sí | No |
| Ver todas las prácticas | Sí | Sí | No |
| Crear, editar y activar prácticas | Sí | Sí | Solo las propias |
| Eliminar definitivamente una práctica | Sí | No | No |
| Consultar y responder solicitudes de participación | Sí | Sí | No |
| Eliminar datos de una solicitud | Sí | No | No |
| Consultar la biblioteca multimedia | Sí | Sí | No |
| Eliminar archivos multimedia sin uso | Sí | No | No |
| Descargar respaldo editorial | Sí | Sí | No |
| Consultar la auditoría administrativa | Sí | No | No |

El rol `empresa` entra a un panel limitado a sus propias prácticas. El servidor comprueba los permisos en cada operación; ocultar un botón no sustituye esa validación.

## 3. Gestión de usuarios autorizados

La gestión de usuarios se realiza en **Supabase Dashboard > Table Editor > usuarios_autorizados**.

- Para habilitar una cuenta, registra su correo, asigna el rol y usa `activo = true`.
- El campo `id` puede quedar vacío antes del primer acceso. La callback lo vincula con el UUID validado por Supabase Auth cuando existe una única coincidencia por correo.
- Para revocar el acceso, cambia `activo` a `false` o elimina la fila.
- Para una empresa, completa `nombre_empresa_o_usuario`.

## 4. Configuración pública

En **Panel > Configuración** se controla lo siguiente:

- **Secciones visibles:** al desactivar una sección, desaparece del encabezado y del pie. Su ruta pública y sus páginas de detalle responden como no disponibles después de la siguiente navegación o recarga.
- **Contenido ilustrativo:** permanece activo durante el montaje. Al desactivarlo, los registros no confirmados dejan de verse en el sitio público y continúan disponibles para edición en el panel.

La versión mínima actual no mantiene una conexión en tiempo real con pestañas públicas abiertas. Una pestaña que ya muestra una sección debe navegar o recargarse para recibir la nueva configuración.

## 5. Flujo editorial general

Las colecciones **Proyectos**, **Novedades**, **Reuniones**, **Integrantes**, **Publicaciones** y **Galería** comparten este flujo:

1. Abre la colección desde el menú lateral.
2. Selecciona **Añadir**.
3. Define un `slug` con minúsculas, números y guiones. El slug no se cambia después.
4. Completa los campos obligatorios.
5. Mantén desmarcado **Contenido confirmado** cuando el registro sea un ejemplo.
6. Selecciona un estado editorial: **Borrador**, **Publicado** o **Programado**. Para programar debes indicar una fecha.
7. Guarda y revisa el resultado público.
8. Marca el contenido como confirmado únicamente después de validar datos, permisos y enlaces.

Después del primer guardado puedes usar **Vista previa** dentro del editor. Esta vista privada permite revisar borradores; los cambios del formulario deben guardarse antes de aparecer allí.

Los registros antiguos sin estado editorial explícito se tratan como publicados. Un borrador permanece en el panel pero no aparece en listados ni fichas públicas. El contenido programado aparece a partir de la fecha indicada, usando la fecha de Colombia.

Los ejemplos pueden conservarse durante el desarrollo y ocultarse juntos desde **Configuración > Contenido de demostración**. Las publicaciones ilustrativas se muestran con una advertencia y sin enlace externo activo.

## 6. Proyectos

Campos principales: título, estado, línea, resumen, integrantes, descripción e imagen. Los estados válidos son **En formulación**, **Fase inicial** y **Prototipado**.

Los integrantes se relacionan mediante sus slugs. Verifica que los perfiles existan y estén confirmados antes de presentar un equipo como real.

## 7. Novedades

Registra título, fecha, tipo, resumen y contenido. Antes de confirmar una convocatoria o evento, comprueba su vigencia. Los ejemplos deben permanecer sin confirmar para que la interfaz los identifique como ilustrativos.

## 8. Reuniones

Registra fecha, hora de Colombia, modalidad, lugar, resumen y detalle. La página pública presenta las reuniones futuras confirmadas en la agenda y las tres reuniones confirmadas más recientes que ya finalizaron.

Las reuniones ilustrativas aparecen en un bloque separado y nunca se anuncian como próximas actividades reales.

## 9. Integrantes

Publica únicamente nombres, perfiles, fotografías y enlaces autorizados. El correo es opcional. Los perfiles no confirmados se consideran ejemplos y no activan información de contacto.

## 10. Publicaciones y galería

Una publicación necesita título, año, autores y tipo. Los registros ilustrativos aparecen como demostración cuando esa opción está activa; los enlaces solo se habilitan para contenido confirmado.

La galería se reserva para fotografías reales y autorizadas. Cada imagen requiere título, texto alternativo y pie de foto. No uses imágenes generadas o de stock como registro de actividades del semillero.

## 11. Grupos de trabajo

Para crear un grupo solo son obligatorios el slug, el nombre y la descripción.

- Integrantes: opcionales.
- Repositorios: opcionales, con formato `Nombre | https://url`.
- Documentos: opcionales, con el mismo formato.
- Portada y galería: opcionales.

Si no se agregan recursos o imágenes, la página pública muestra un estado neutro. Pueden incorporarse después desde **Editar**.

## 12. Prácticas e iniciativas

Los roles `admin` y `editor` conservan el menú completo al entrar a Prácticas. El rol `empresa` recibe un panel limitado.

- **Admin:** crea, edita, activa, desactiva y elimina cualquier oferta.
- **Editor:** crea, edita, activa y desactiva; no puede eliminar.
- **Empresa:** crea, edita, activa y desactiva únicamente sus propias ofertas; no puede eliminar.

Eliminar es permanente. Cuando una oferta solo ha dejado de estar vigente, utiliza **Desactivar**.

## 13. Imágenes

Las imágenes admitidas son JPG, PNG, WebP y AVIF, con un máximo de 8 MB. Se guardan en el bucket público `imagenes` de Supabase Storage y la base de datos conserva la URL. Al editar sin seleccionar un archivo nuevo se mantiene la imagen existente.

Antes de cargar una imagen, confirma su autoría, autorización de uso y texto alternativo. Proyectos, novedades, integrantes y galería solicitan una descripción accesible. Cuando una imagen editorial se reemplaza o el registro se elimina, el panel intenta retirar el archivo anterior de Storage para evitar archivos huérfanos.

En **Panel > Multimedia** puedes consultar los archivos del bucket y cuántos registros los utilizan. Solo admin puede eliminar un archivo marcado como **Sin uso**; la acción vuelve a comprobar las referencias antes de borrarlo. Conserva en el Drive institucional los originales de alta resolución y utiliza Supabase Storage para las copias publicadas en la web.

## 14. Solicitudes de participación

La sección pública **Únete** permite manifestar interés en el semillero. No representa una inscripción ni una admisión.

1. Abre **Panel > Solicitudes**.
2. Revisa nombre, correo, programa, intereses y mensaje.
3. Cambia el estado entre **Nueva**, **En revisión**, **Contactada** y **Cerrada**.
4. Responde desde el correo institucional.
5. Cuando los datos ya no deban conservarse, un administrador puede eliminarlos.

Admin y editor pueden consultar y actualizar solicitudes. Solo admin puede eliminarlas. Los datos no son públicos y deben usarse únicamente para responder a la persona interesada.

El formulario limita envíos repetidos desde el mismo correo durante quince minutos e incluye un campo trampa antispam. La notificación automática requiere `RESEND_API_KEY` y `RESEND_FROM_EMAIL`; si el proveedor no está configurado, la solicitud continúa guardándose en Supabase.

## 15. Auditoría y respaldos

Cada creación, edición, eliminación, cambio de configuración y gestión de solicitudes genera un evento de auditoría cuando la migración correspondiente está aplicada. Solo admin puede consultar **Panel > Auditoría**.

Admin y editor pueden seleccionar **Descargar respaldo** en el menú. El archivo JSON contiene contenido, configuración, grupos y prácticas. No incluye credenciales, usuarios autorizados ni solicitudes de participación. Guarda periódicamente este archivo en el Drive institucional del semillero.

## 16. Comprobación antes de publicar contenido real

- Verifica ortografía, fechas, nombres y enlaces.
- Confirma la autorización de fotografías y datos personales.
- Revisa la vista pública en escritorio y móvil.
- Comprueba que una sección desactivada no abra mediante URL directa.
- Mantén el contenido ilustrativo activo hasta que cada sección tenga información suficiente.
- Usa la lista `PLANTILLA_INFORMACION_SEMILLERO.md` para solicitar y validar los datos faltantes.

## 17. Contacto y dominio institucional

El correo público configurado es `isia_man@unal.edu.co`. Si cambia, actualiza `lib/sitio.ts` y vuelve a desplegar.

El procedimiento para solicitar una dirección bajo `unal.edu.co` está documentado en `SOLICITUD_DOMINIO_UNAL.md`. No agregues un dominio a Vercel ni recursos gráficos oficiales antes de recibir las instrucciones y el aval de la Universidad.
