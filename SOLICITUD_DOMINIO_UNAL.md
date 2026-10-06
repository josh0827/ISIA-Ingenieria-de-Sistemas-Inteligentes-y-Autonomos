# Solicitud de dominio institucional `unal.edu.co` para ISIA

Esta guía organiza el trámite para que el sitio del semillero ISIA pueda utilizar una dirección institucional de la Universidad Nacional de Colombia. La asignación del nombre, el alojamiento y la configuración DNS dependen de la Mesa de Servicios y del aval de UNIMEDIOS; este documento no sustituye su respuesta.

## 1. Confirmar la unidad responsable

Antes de presentar la solicitud deben quedar registrados:

- Nombre oficial del semillero y sigla ISIA.
- Docente responsable.
- Facultad, departamento o unidad académica que respalda el sitio.
- Responsable del contenido.
- Responsable técnico durante toda la vigencia del sitio.
- Correo institucional: `isia_man@unal.edu.co`.
- Vigencia prevista y plan de mantenimiento.

La Guía Web asigna a la dependencia responsable las actividades de infraestructura, seguridad, respaldos, mantenimiento, soporte y actualización. Por ello debe existir al menos una persona encargada mientras el sitio esté publicado.

## 2. Solicitar infraestructura y dirección

Enviar la solicitud a:

- `mesadeservicios@unal.edu.co`
- Alternativa indicada por la guía: `mesadeayuda@unal.edu.co`

Solicitar la evaluación de una dirección institucional. Una propuesta razonable es `isia.manizales.unal.edu.co`, pero la Universidad puede asignar una ruta dentro del sitio de la Sede o de la Facultad. La guía señala que los grupos de investigación pueden solicitar subdominio cuando requieren almacenamiento elevado o una plataforma especializada; ISIA debe justificar técnicamente su aplicación web y aceptar la estructura que determine la Universidad.

La solicitud debe preguntar expresamente:

1. Si el sitio puede permanecer alojado en Vercel con Next.js y utilizar Supabase como backend.
2. Si la Universidad permite apuntar el subdominio mediante CNAME o el mecanismo DNS que defina.
3. Si debe migrarse a infraestructura administrada por la UNAL.
4. Qué requisitos de seguridad, respaldo, protección de datos y continuidad deben cumplirse.
5. Quién será el enlace técnico de la Sede Manizales para el trámite.

## 3. Solicitar asesoría de Imagen Institucional

Cuando la Mesa de Servicios asigne o preapruebe la infraestructura y la dirección, escribir a `imagenun_nal@unal.edu.co` y adjuntar la respuesta recibida. La asesoría de la Oficina de Medios Digitales es un paso requerido para los nuevos sitios.

## 4. Solicitar la plantilla institucional

Ingresar a [Solicitudes UNIMEDIOS](https://solicitudesunimedios.unal.edu.co) y seleccionar la opción **Web**. Solicitar la plantilla y las indicaciones vigentes aplicables al semillero.

Para quedar bajo `unal.edu.co`, el sitio deberá incorporar los componentes obligatorios de la plantilla institucional. La guía vigente exige, entre otros elementos:

- Encabezado y pie institucionales.
- Escudo oficial de la Universidad sin alteraciones.
- Enlace hacia el portal principal de la UNAL.
- Tipografía y estructura institucionales en las áreas definidas por la plantilla.
- Diseño adaptable, accesibilidad y mantenimiento centralizado.

La identidad propia de ISIA puede conservarse dentro del área de contenido que la plantilla permita. El diseño actual deberá revisarse con UNIMEDIOS antes de incorporar recursos oficiales de la Universidad.

## 5. Preparar la URL de pruebas

Entregar una URL de pruebas que permita revisar:

- Navegación pública y móvil.
- Accesibilidad por teclado y contraste.
- Datos institucionales y responsables.
- Formulario de participación y tratamiento de datos.
- Panel administrativo y separación de roles.
- Política de respaldos, actualización y respuesta a incidentes.
- Uso autorizado de logos, fotografías y contenidos.

No cambiar la URL pública ni retirar el modo DEMO hasta que la información real y la identidad institucional hayan sido aprobadas.

## 6. Solicitar revisión y aval

Con el sitio de pruebas terminado, presentar la solicitud de revisión en [Solicitudes UNIMEDIOS](https://solicitudesunimedios.unal.edu.co), opción **Web**. Corregir las observaciones y conservar el aval emitido.

## 7. Solicitar activación del dominio

Enviar el aval a la Mesa de Servicios y solicitar la activación. Si autorizan Vercel, agregar primero el dominio indicado al proyecto de Vercel y entregar a la Universidad el registro DNS solicitado por la plataforma. La UNAL conserva el control de la zona DNS.

Después de la activación se deben actualizar:

- `NEXT_PUBLIC_SITE_URL` en Vercel.
- **Site URL** y **Redirect URLs** en Supabase Auth.
- Orígenes autorizados del cliente OAuth en Google Cloud, si aplican.
- Metadatos, sitemap y política de indexación cuando el sitio deje de ser una demo.
- Enlaces canónicos y documentación operativa.

Crear un nuevo despliegue después de modificar variables. Probar inicio de sesión, callback, carga de imágenes, formulario, rutas públicas y HTTPS.

## Información que debe adjuntarse

- Nombre y descripción del semillero.
- Aval del docente o unidad académica responsable.
- Dirección solicitada y alternativas aceptables.
- URL actual de pruebas.
- Arquitectura: Next.js en Vercel, PostgreSQL/Auth/Storage en Supabase y OAuth de Google.
- Inventario de datos personales tratados.
- Responsables técnico, editorial y de protección de datos.
- Plan de respaldo, mantenimiento, actualizaciones y atención de incidentes.
- Vigencia estimada.
- Solicitud explícita de autorización para alojamiento externo, si se desea conservar Vercel.

## Modelo breve de solicitud

**Asunto:** Solicitud de dirección institucional y lineamientos de alojamiento — Semillero ISIA, Sede Manizales

> Cordial saludo. Solicitamos orientación y asignación de una dirección institucional para el sitio del semillero ISIA — Ingeniería de Sistemas Inteligentes y Autónomos, adscrito a [UNIDAD ACADÉMICA]. El sitio se encuentra en una URL de pruebas y utiliza Next.js en Vercel con Supabase para autenticación, base de datos y almacenamiento. Agradecemos confirmar la estructura de URL correspondiente, la viabilidad del alojamiento externo mediante configuración DNS o la infraestructura institucional requerida. Adjuntamos responsables, arquitectura, plan de mantenimiento, seguridad y respaldo. Docente responsable: [NOMBRE]. Responsable técnico: [NOMBRE]. Correo institucional: isia_man@unal.edu.co.

## Referencias institucionales

- [Creación de nuevos sitios web — Guía Web UNAL](https://identidad.unal.edu.co/guia-web/b-directrices-y-especificaciones/b8-creacion-de-nuevos-sitios-web/)
- [Direcciones URL — Guía Web UNAL](https://identidad.unal.edu.co/guia-web/b-directrices-y-especificaciones/b2-direcciones-url/)
- [Uso de plantilla web — Guía Web UNAL](https://identidad.unal.edu.co/guia-web/b-directrices-y-especificaciones/b3-uso-de-plantilla-web/)
- [Sección de Infraestructura y Gestión de Servicios de TI](https://infraestructurati.unal.edu.co/)
