# Verificación funcional — fases 1 a 5

## Preparación

1. Aplicar `supabase/migrations/202610140001_networking_fases_1_5.sql`.
2. Desplegar la rama de trabajo en Preview con las variables de Supabase y, si se desea probar avisos, Resend.
3. Preparar una cuenta `admin`, una `editor` y una `empresa` activas.

## Navegación y roles

- Confirmar que el encabezado muestre Inicio, Semillero, Proyectos, Oportunidades, Comunidad, Actividades y Participar.
- Recorrer los hubs en escritorio y móvil y verificar que todos los enlaces especializados funcionen.
- Confirmar que admin y editor vean el panel agrupado y que empresa solo vea sus oportunidades.
- Comprobar que una empresa no abra contenido, bandeja, configuración, auditoría ni respaldos mediante URL directa.

## Networking y privacidad

- Abrir un proyecto confirmado, enviar una colaboración válida y verla en Administración > Bandeja.
- Repetir el envío con el mismo correo antes de 15 minutos y comprobar el rechazo.
- Confirmar que un proyecto o idea ilustrativos no habiliten el formulario real.
- Verificar que ningún listado público muestre el correo de propietarios o remitentes.
- Cambiar una solicitud por Nueva, En revisión, Contactada y Cerrada; confirmar que solo admin pueda eliminarla.

## Ideas y retos

- Crear una idea desde el panel con imagen, área, madurez, estado y necesidades.
- Buscarla por texto y filtrarla por área en `/ideas`.
- Revisar su ficha en móvil y escritorio, incluidos textos largos.
- Convertirla en proyecto y confirmar que el proyecto quede como Borrador y En formulación.

## Prototipado

- Crear una capacidad confirmada y activa desde el panel.
- Abrir su ficha pública y enviar un reto relacionado.
- Verificar áreas, consentimiento, aviso de confidencialidad y mensaje de alcance no contractual.
- Confirmar que el reto llegue a la bandeja aunque Resend no esté configurado.

## Oportunidades

- Crear una práctica, un empleo, una convocatoria o un reto en Borrador y comprobar que no aparezca públicamente.
- Cambiarla a Abierta y confirmar que aparezca en Disponibles.
- Cerrarla y comprobar que pase al Histórico y ya no ofrezca postulación.
- Probar el contacto histórico con la opción de correo público apagada y encendida.
- Confirmar que editor y empresa no puedan eliminar; admin sí.

## Calidad

- Ejecutar `npm test`, `npm run lint`, `npm run typecheck` y `npm run build`.
- Revisar consola del navegador y del servidor sin errores.
- Verificar navegación por teclado, foco visible, etiquetas de formulario y ausencia de desbordamiento horizontal.
- Confirmar que no aparezcan animaciones de entrada dependientes del scroll y que movimiento reducido siga respetado.
