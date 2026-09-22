# 📖 Manual de Administración - Sitio Web ISIA (UNAL)

## 🔑 1. Acceso y Autenticación

- **Requisito:** tener un correo `@unal.edu.co` asociado a GitHub y un UID activo en la colección `editores` de Firestore.
- **Pasos:**
  1. Ingresar a `/admin`.
  2. Hacer clic en **Iniciar sesión con GitHub**.
  3. Autenticarse con la cuenta institucional autorizada.
  4. Para terminar, usar **Cerrar sesión** en la barra superior del panel.

Si el correo no pertenece al dominio institucional o el UID no está activo, el sistema mostrará una página de acceso restringido y no permitirá mutaciones.

## 👥 2. Gestión de Editores

- **Ubicación:** Firebase Console > Firestore Database > colección `editores`.
- **Añadir editor:** crear un documento con el **ID igual al UID de Firebase Authentication** y el campo `activo: true` de tipo booleano.
- **Revocar acceso:** cambiar `activo` a `false` o eliminar el documento. Las Server Actions comprobarán nuevamente el permiso antes de cada cambio.

La colección `editores` no se administra desde el sitio para impedir que una persona se otorgue permisos a sí misma.

## 📅 3. Gestión de Agenda y Reuniones

- **Sección:** Panel Admin > **Reuniones**.
- **Campos:** título, fecha, hora, modalidad, lugar o enlace y descripción.
- **Efecto:** las reuniones confirmadas se reflejan automáticamente en la agenda pública y, cuando corresponde, en el resumen de la portada.

Antes de marcar una reunión como confirmada, verifica fecha, hora, modalidad, ubicación y autorización para publicar los datos.

## 🚀 4. Gestión de Proyectos

- **Sección:** Panel Admin > **Proyectos**.
- **Campos:** título, slug o URL amigable, línea de investigación, estado, resumen, integrantes, descripción e imagen principal.
- **Almacenamiento multimedia:** selecciona una imagen JPG, PNG, WebP o AVIF de máximo 8 MB. En Vercel se guarda en Blob; en el servidor local se guarda en `public/imagenes/proyectos/`. Firestore registra la URL o ruta resultante. Si editas una ficha sin seleccionar otro archivo, conserva la imagen existente.

Utiliza `confirmado: false` mientras el proyecto sea ilustrativo o esté pendiente de revisión. No publiques nombres, resultados o imágenes sin validación y autorización.

## 🧭 5. Navegación pública

- **Sección:** Panel Admin > **Navegación pública**.
- Activa o desactiva cada sección según exista contenido listo para publicar.
- Al guardar, el encabezado y el pie del sitio se actualizan con la misma configuración.

Ocultar una sección retira su enlace del menú; no elimina sus documentos de Firestore. Conserva siempre una vía clara hacia **Únete** mientras el portal mantenga su propósito de vinculación.
