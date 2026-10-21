# Plan de producto y alcance — fases 6 a 9

Este documento completa el plan aprobado en `PLAN_NETWORKING_FASES_0_5.md`. Mantiene el networking como propósito principal y conserva la moderación editorial, la privacidad y el carácter académico del portal.

## Fase 6. Innovación y apoyo responsable

- Crear un punto de entrada que conecte ideas, proyectos, prototipado y formas de apoyo.
- Permitir que una ficha de proyecto reciba propuestas de mentoría, conocimiento, equipos, alianzas o apoyo material mediante la bandeja privada existente.
- Evitar pagos, promesas de inversión o acuerdos contractuales dentro del portal.
- Mantener rutas diferenciadas para pregrado, posgrado, egresados, docentes, empresas y personas externas.

## Fase 7. Integración controlada con GitHub

- Recibir eventos `fork` mediante un webhook con firma HMAC SHA-256.
- Aceptar únicamente el propietario configurado por el semillero.
- Crear un proyecto como **Borrador**, **En formulación** y no confirmado; una persona editora debe revisarlo antes de publicar.
- Registrar metadatos mínimos de cada entrega para evitar duplicados y facilitar la auditoría.
- No consultar correos de GitHub ni asumir que un correo institucional representa una organización de GitHub.

## Fase 8. Preguntas y respuestas moderadas

- Recibir preguntas con categoría, consentimiento y límites contra envíos repetidos.
- Mantener nombre y correo únicamente en el panel privado.
- Publicar una pregunta solo después de que admin o editor escriba y apruebe una respuesta.
- Tratar el espacio como preguntas y respuestas asincrónicas, no como chat abierto en tiempo real.

## Fase 9. Operación, trazabilidad y cierre

- Añadir una ruta de salud sin secretos para verificar aplicación y base de datos.
- Documentar variables, migraciones, operación de GitHub, moderación y criterios de privacidad.
- Consolidar verificaciones funcionales para las nueve fases.
- Mantener auditoría de las acciones administrativas y una vista privada de eventos de integración.

## Decisiones de alcance

- El portal no procesa dinero, contratos ni propiedad intelectual.
- Un fork no equivale a un proyecto aprobado.
- Las preguntas no se publican con identidad o correo.
- Los secretos y el cliente administrativo de Supabase permanecen exclusivamente en el servidor.
- El contenido ilustrativo se conserva identificado y puede ocultarse desde Configuración.
