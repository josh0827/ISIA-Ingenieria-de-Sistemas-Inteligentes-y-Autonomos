# Manual de administración del sitio web ISIA

## 1. Acceso y autenticación

1. Ingresa a `/admin`.
2. Escribe el correo y la contraseña de tu cuenta y selecciona **Entrar al panel**.
3. Al terminar, selecciona **Cerrar sesión**.

Si en Supabase se activa el proveedor de Google, la pantalla muestra además **Iniciar sesión con Google** sin tocar el código.

Tener una cuenta no concede permisos por sí solo. El usuario debe existir en `usuarios_autorizados`, tener `activo = true` y un rol válido; si no, el panel cierra la sesión.

## 2. Roles y permisos

| Acción | Admin | Editor | Empresa |
| --- | :---: | :---: | :---: |
| Acceder al panel general | Sí | Sí | No |
| Configurar secciones públicas | Sí | Sí | No |
| Gestionar proyectos, ideas, prototipado, novedades, reuniones, integrantes, publicaciones y galería | Sí | Sí | No |
| Gestionar grupos de trabajo | Sí | Sí | No |
| Ver todas las prácticas | Sí | Sí | No |
| Crear, editar y activar prácticas | Sí | Sí | Solo las propias |
| Eliminar definitivamente una práctica | Sí | No | No |
| Consultar la bandeja de participación, colaboración y prototipado | Sí | Sí | No |
| Responder, publicar o archivar preguntas | Sí | Sí | No |
| Eliminar datos de una solicitud | Sí | No | No |
| Consultar eventos de integración con GitHub | Sí | No | No |
| Consultar la biblioteca multimedia | Sí | Sí | No |
| Eliminar archivos multimedia sin uso | Sí | No | No |
| Descargar respaldo editorial | Sí | Sí (sin correos de contacto de organizaciones) | No |
| Consultar la auditoría administrativa | Sí | No | No |

El rol `empresa` entra a un panel limitado a sus propias prácticas. El servidor comprueba los permisos en cada operación; ocultar un botón no sustituye esa validación.

## 3. Gestión de usuarios autorizados

Dar de alta a una persona lleva dos pasos en Supabase Dashboard:

1. **Authentication > Users > Add user > Create new user:** su correo y una contraseña inicial, con **Auto Confirm User** marcado. Comparte la contraseña por un canal privado.
2. **Table Editor > usuarios_autorizados:** una fila con el mismo correo, el rol y `activo = true`.

- El campo `id` puede quedar vacío antes del primer acceso. Se vincula con la cuenta en el primer inicio de sesión, siempre que el correo esté confirmado y la fila no pertenezca ya a otra cuenta.
- En **Authentication > Sign In / Providers**, mantén desactivado **Allow new users to sign up**: las cuentas solo las crea un administrador.
- Para cambiar una contraseña, edita el usuario en **Authentication > Users**.
- Para revocar el acceso, cambia `activo` a `false` o elimina la fila.
- Para una empresa, completa `nombre_empresa_o_usuario`.

## 4. Configuración pública

En **Panel > Configuración** se controla lo siguiente:

- **Secciones visibles:** al desactivar una sección, desaparece del encabezado y del pie. Su ruta pública y sus páginas de detalle responden como no disponibles después de la siguiente navegación o recarga.
- **Contenido ilustrativo:** permanece activo durante el montaje. Al desactivarlo, los registros no confirmados dejan de verse en el sitio público y continúan disponibles para edición en el panel.

La versión mínima actual no mantiene una conexión en tiempo real con pestañas públicas abiertas. Una pestaña que ya muestra una sección debe navegar o recargarse para recibir la nueva configuración.

## 5. Flujo editorial general

Las colecciones **Proyectos**, **Ideas y retos**, **Prototipado y colaboración**, **Novedades**, **Reuniones**, **Integrantes**, **Publicaciones** y **Galería** comparten este flujo:

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

Cada proyecto confirmado muestra un formulario **Apoyar o colaborar**. La persona propietaria no publica su correo: el mensaje entra en **Administración > Bandeja de entrada**.

## 6.1. Ideas y retos

Una idea necesita problema, solución propuesta, área, madurez, estado y apoyo requerido. Los registros se muestran como fichas visuales con búsqueda y filtro por área.

Cuando una idea haya sido aprobada, abre su editor y selecciona **Convertir en proyecto**. El panel crea un proyecto en estado **En formulación** y como **Borrador**, conserva la idea en estado **En desarrollo** y dirige al nuevo proyecto para completar equipo, línea e imagen.

## 6.2. Prototipado y colaboración

Admin y editor pueden publicar capacidades, áreas relacionadas, equipo responsable y condiciones. La página pública permite proponer un reto general o asociado a una capacidad confirmada. El envío inicia una evaluación: no constituye contrato ni garantiza ejecución.

## 6.3. Innovación y apoyo

La página **Innovación y apoyo** reúne ideas, prototipado y proyectos confirmados. No existe una cuenta financiera, pasarela de pagos ni promesa de inversión dentro del portal. Cuando una persona ofrece mentoría, conocimiento, equipos, una alianza o apoyo material, el mensaje llega a la bandeja privada y debe revisarse por canales institucionales.

Los proyectos importados desde GitHub muestran **Origen = GitHub**, pero permanecen como Borrador y no confirmados hasta que una persona editora complete y valide la ficha.

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

Cada oferta tiene uno de cuatro estados:

- **Borrador:** solo se ve en el panel.
- **Abierta:** aparece entre las oportunidades disponibles y admite postulación.
- **Cerrada:** deja de aceptar postulaciones y pasa al histórico.
- **Archivada:** permanece en el histórico como referencia.

El campo **Tipo** permite clasificar cada registro como práctica, empleo, convocatoria o reto.

La fecha de cierre ayuda a ordenar el histórico. El correo de la organización solo se publica en una ficha histórica si se activa expresamente **Mostrar el correo de la organización**. Eliminar es permanente y se reserva para admin; normalmente se debe cerrar o archivar.

## 13. Imágenes

Las imágenes admitidas son JPG, PNG, WebP y AVIF, con un máximo de 8 MB. Se guardan en el bucket público `imagenes` de Supabase Storage y la base de datos conserva la URL. Al editar sin seleccionar un archivo nuevo se mantiene la imagen existente.

Antes de cargar una imagen, confirma su autoría, autorización de uso y texto alternativo. Proyectos, novedades, integrantes y galería solicitan una descripción accesible. Cuando una imagen editorial se reemplaza o el registro se elimina, el panel intenta retirar el archivo anterior de Storage para evitar archivos huérfanos.

En **Panel > Multimedia** puedes consultar los archivos del bucket y cuántos registros los utilizan. Solo admin puede eliminar un archivo marcado como **Sin uso**; la acción vuelve a comprobar las referencias antes de borrarlo. Conserva en el Drive institucional los originales de alta resolución y utiliza Supabase Storage para las copias publicadas en la web.

## 14. Bandeja de entrada

La sección pública **Únete** permite manifestar interés en el semillero. No representa una inscripción ni una admisión.

1. Abre **Administración > Bandeja de entrada**. El menú lateral indica entre paréntesis cuántas solicitudes están en estado **Nueva**; si alguna tabla no se puede consultar, la bandeja lo avisa en un recuadro en lugar de mostrarla vacía.
2. Identifica si el origen es participación, colaboración o reto de prototipado.
3. Revisa nombre, correo, contexto y mensaje.
4. Cambia el estado entre **Nueva**, **En revisión**, **Contactada** y **Cerrada**.
5. Responde desde el correo institucional.
6. Cuando los datos ya no deban conservarse, un administrador puede eliminarlos.

Admin y editor pueden consultar y actualizar solicitudes. Solo admin puede eliminarlas. Los datos no son públicos y deben usarse únicamente para responder a la persona interesada.

Los formularios limitan envíos repetidos desde el mismo correo durante quince minutos, aplican un tope de 30 solicitudes por hora en cada tabla e incluyen un campo trampa antispam. La notificación automática requiere `RESEND_API_KEY` y `RESEND_FROM_EMAIL`; si el proveedor no está configurado, la solicitud continúa guardándose en Supabase.

## 14.1. Preguntas de la comunidad

1. Abre **Comunidad > Preguntas y respuestas**. El menú indica cuántas preguntas están pendientes y cada acción confirma su resultado en la parte superior de la página.
2. Revisa la pregunta y su categoría. El nombre y el correo son privados y solo se usan si hace falta aclarar el mensaje.
3. Escribe una respuesta general que no revele datos personales.
4. Guarda sin activar **Publicar la respuesta** si requiere otra revisión.
5. Activa la casilla y guarda para publicar la pregunta y la respuesta en `/preguntas`.
6. Usa **Archivar** para retirarla del sitio. Solo admin puede eliminar definitivamente sus datos.

El sitio ofrece preguntas y respuestas asincrónicas; no es un chat en tiempo real. Nunca copies el correo, nombre u otra información de identificación en la respuesta pública.

## 14.2. Integración con GitHub

La integración requiere un webhook de GitHub dirigido a `/api/integraciones/github/webhook`, con tipo de contenido `application/json`, evento **Forks** y el mismo secreto configurado en `GITHUB_WEBHOOK_SECRET`. `GITHUB_ALLOWED_OWNER` debe contener exactamente el nombre de la cuenta u organización institucional autorizada.

- Una firma inválida se rechaza.
- Un propietario diferente se registra como rechazado y no crea contenido.
- Una entrega repetida no crea otro proyecto.
- Un fork válido crea una ficha en **Proyectos** como Borrador, En formulación y no confirmada.
- Solo admin consulta **Administración > Integraciones**.

El correo de una cuenta de GitHub no se usa para autorizar la importación. El control se hace por firma del webhook y nombre exacto del propietario autorizado.

## 15. Auditoría y respaldos

Cada creación, edición, eliminación, cambio de configuración y gestión de solicitudes genera un evento de auditoría cuando la migración correspondiente está aplicada. Solo admin puede consultar **Panel > Auditoría**, que muestra 50 eventos por página y permite filtrar por usuario y por recurso.

Admin y editor pueden seleccionar **Descargar respaldo** en el menú. El archivo JSON contiene contenido, configuración, grupos y prácticas. No incluye credenciales, usuarios autorizados ni solicitudes de participación, y solo el respaldo descargado por un admin conserva el correo de contacto de las organizaciones. Guarda periódicamente este archivo en el Drive institucional del semillero.

La ruta `/api/salud` permite comprobar el estado general sin iniciar sesión. Responde `operativo` cuando la aplicación puede consultar Supabase y `degradado` con código 503 cuando falta configuración o conexión. Además informa la versión desplegada (7 primeros caracteres del commit), el entorno y si el correo de avisos está configurado (`correo`: verdadero o falso). No devuelve secretos ni mensajes internos de la base de datos.

## 16. Comprobación antes de publicar contenido real

- Verifica ortografía, fechas, nombres y enlaces.
- Confirma la autorización de fotografías y datos personales.
- Revisa la vista pública en escritorio y móvil.
- Comprueba que una sección desactivada no abra mediante URL directa.
- Mantén el contenido ilustrativo activo hasta que cada sección tenga información suficiente.
- Usa la lista `PLANTILLA_INFORMACION_SEMILLERO.md` para solicitar y validar los datos faltantes.

## 16.1. Aviso de privacidad

Los formularios enlazan a `/privacidad`. El texto está pendiente de revisión por la Universidad (en particular el plazo de conservación); no lo presentes como definitivo hasta recibir su validación. El procedimiento para retirar el modo DEMO está en `SALIR_DE_DEMO.md`.

## 17. Contacto y dominio institucional

El correo público configurado es `isia_man@unal.edu.co`. Si cambia, actualiza `lib/sitio.ts` y vuelve a desplegar.

El procedimiento para solicitar una dirección bajo `unal.edu.co` está documentado en `SOLICITUD_DOMINIO_UNAL.md`. No agregues un dominio a Vercel ni recursos gráficos oficiales antes de recibir las instrucciones y el aval de la Universidad.
