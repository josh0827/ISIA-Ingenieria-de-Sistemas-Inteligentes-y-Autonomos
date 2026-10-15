# Plan de producto y alcance — fases 0 a 5

## Objetivo del portal

El portal ISIA prioriza el **networking académico y tecnológico**: conecta estudiantes, egresados, docentes, investigadores, organizaciones y personas externas alrededor de ideas, proyectos, oportunidades y retos de prototipado.

## Públicos y formas de participación

- Estudiante de pregrado.
- Estudiante de posgrado.
- Egresado o egresada.
- Docente o investigador.
- Empresa, institución u organización aliada.
- Persona externa interesada.

Las solicitudes pueden proponer incorporación a un equipo, mentoría, conocimiento técnico, equipos o infraestructura, alianzas, apoyo material o financiero e información. El sitio nunca publica datos personales de propietarios: el contacto se gestiona desde la bandeja privada del panel.

## Modelo de contenidos

- **Idea o reto:** necesidad o propuesta temprana que busca validación, equipo o apoyo.
- **Proyecto:** trabajo aceptado por el semillero, con estado, alcance y responsables definidos.
- **Prototipado y colaboración:** capacidades del semillero para evaluar y desarrollar pruebas de concepto, sin prometer resultados comerciales.
- **Oportunidad:** práctica, convocatoria, empleo o reto externo. Las oportunidades cerradas conservan su valor histórico y dejan de aceptar postulaciones.

## Arquitectura aprobada

La navegación pública se concentra en Inicio, Semillero, Proyectos, Oportunidades, Comunidad y Actividades, acompañada por el llamado a participar. Las páginas especializadas existentes siguen disponibles dentro de estas agrupaciones.

El panel se organiza en Resumen, Contenido, Oportunidades, Comunidad, Prototipado y Administración. La bandeja de entrada, usuarios, configuración, auditoría y respaldos pertenecen a Administración. Las opciones visibles dependen del rol: `admin`, `editor` o `empresa`.

## Criterios de privacidad y operación

- Supabase conserva contenido, solicitudes y estados; las claves privadas permanecen en el servidor.
- Los formularios requieren consentimiento y limitan contenido, frecuencia y datos solicitados.
- Los correos de contacto privados solo aparecen en el panel autorizado.
- Los avisos por correo son complementarios: una falla del proveedor no elimina la solicitud guardada.
- El contenido provisional o ilustrativo permanece identificado hasta su validación editorial.

## Entregables por fase

1. Arquitectura pública y administrativa simplificada.
2. Solicitudes comunes de networking y colaboración.
3. Catálogo administrable de ideas y retos con fichas detalladas.
4. Catálogo de prototipado y recepción de retos externos.
5. Oportunidades activas e históricas con estados y fechas de cierre.
