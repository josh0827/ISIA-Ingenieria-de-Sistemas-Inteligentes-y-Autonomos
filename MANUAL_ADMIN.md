# 📖 Manual de Administración - Sitio Web ISIA (UNAL)

## 🔑 1. Acceso y autenticación

- **Requisito:** autenticarse con Google y tener un usuario activo en la tabla `usuarios_autorizados` de Supabase.
- **Pasos:**
  1. Ingresar a `/admin`.
  2. Hacer clic en **Iniciar sesión con Google**.
  3. Autenticarse con la cuenta de Google autorizada.
  4. Para terminar, usar **Cerrar sesión** en la barra superior.

El servidor verifica la sesión con Supabase Auth y la autorización en la base de datos antes de cada mutación. Las cuentas con rol `admin` o `editor` acceden al panel general; las cuentas con rol `empresa` se dirigen a la gestión de sus prácticas.

## 👥 2. Gestión de usuarios autorizados

- **Ubicación:** Supabase Dashboard > Table Editor > tabla `usuarios_autorizados`.
- **Añadir usuario:** crear una fila con `id` igual al UUID del usuario en **Authentication > Users**, su correo, el rol (`admin`, `editor` o `empresa`) y `activo` igual a `true`.
- **Empresa:** completa `nombre_empresa_o_usuario` para identificarla al publicar prácticas. Las empresas solo pueden consultar y modificar sus propias ofertas.
- **Revocar acceso:** cambiar `activo` a `false` o eliminar la fila. La siguiente comprobación de sesión bloqueará las mutaciones.

La tabla se administra fuera del portal para impedir la autoasignación de permisos.

## 📅 3. Gestión de agenda y reuniones

- **Sección:** Panel Admin > **Reuniones**.
- **Campos:** título, fecha, hora, modalidad, lugar o enlace y descripción.
- **Efecto:** las reuniones confirmadas se reflejan en la agenda pública y, cuando corresponde, en la portada.

Antes de confirmar una reunión, verifica fecha, hora, modalidad, ubicación y autorización para publicar los datos.

## 🚀 4. Gestión de proyectos

- **Sección:** Panel Admin > **Proyectos**.
- **Campos:** título, slug, línea de investigación, estado, resumen, integrantes, descripción e imagen principal.
- **Estados permitidos:** `En formulación`, `Prototipado` y `Fase inicial`.
- **Multimedia:** las imágenes JPG, PNG, WebP o AVIF de máximo 8 MB se guardan en el bucket público `imagenes` de Supabase Storage. La tabla conserva su URL pública. Al editar sin seleccionar otro archivo se mantiene la imagen existente.

Utiliza `confirmado: false` mientras el proyecto sea ilustrativo o esté pendiente de revisión.

## 🧭 5. Navegación pública

- **Sección:** Panel Admin > **Navegación pública**.
- Activa o desactiva cada sección según exista contenido listo para publicar.
- Al guardar, el encabezado y el pie se actualizan mediante `revalidatePath`.

Ocultar una sección retira su enlace del menú y conserva sus filas en PostgreSQL.

## 🧩 6. Grupos de trabajo

- **Sección:** Panel Admin > **Grupos de trabajo**.
- Registra el nombre, descripción e integrantes confirmados, uno por línea.
- Los repositorios y documentos se escriben como `Nombre | https://url`.
- La portada y las imágenes nuevas de galería se almacenan en Supabase Storage.
- Las URLs existentes de la galería pueden retirarse eliminando su línea antes de guardar.

## 💼 7. Prácticas e iniciativas

- **Sección pública:** `/practicas`. Solo presenta ofertas activas.
- **Panel de empresa:** `/admin/practicas`. Permite crear, editar y desactivar únicamente las ofertas vinculadas a la empresa autenticada.
- **Panel ISIA:** administradores y editores ven todas las ofertas y pueden gestionarlas.
- **Campos:** título, empresa, ubicación, modalidad, descripción, temas o requisitos, correo de contacto y URL HTTPS de postulación si existe.

Antes de activar una oferta, confirma con la entidad responsable que el contacto, el proceso de postulación y la disponibilidad siguen vigentes.
