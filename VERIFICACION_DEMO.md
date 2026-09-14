# Verificación de la demo ISIA

Fecha: 13 de septiembre de 2026. Rama local: `Prueba`.

## Resultado

Demo académica navegable, con nueve secciones principales y siete páginas de detalle (cuatro proyectos y tres novedades). Conserva Next.js 15, TypeScript, CSS Modules, Geist y contenido Markdown. La demo incluye el escudo existente, sin modificaciones, y su atribución.

Vista previa local: http://127.0.0.1:3000

Para iniciar de nuevo:

```bash
npm ci
npm run build
npm start -- --hostname 127.0.0.1 --port 3000
```

En PowerShell, si la política impide ejecutar `npm.ps1`, usar `npm.cmd`.

## Comprobaciones realizadas

| Comprobación | Resultado |
| --- | --- |
| Compilación final `npm run build` | Correcta: 22 salidas estáticas, incluyendo metadatos y rutas auxiliares |
| ESLint `npm run lint` | Sin errores ni advertencias |
| TypeScript `npm run typecheck` | Sin errores |
| `git diff --check` | Correcto |
| 16 páginas × 4 anchos: 360, 390, 768 y 1440 px | 64 comprobaciones: HTTP 200 y sin desbordamiento horizontal |
| Revisión visual | Capturas de escritorio y móvil de las nueve secciones; detalle de proyecto y novedad, menú móvil y reunión expandida |
| Enlaces internos y anclas | Sin destinos rotos; anclas de las seis líneas existentes |
| CTA principales | Proyectos y participación llegan a sus páginas |
| Menú móvil | Abre, permite navegar, cierra al navegar y con Escape; devuelve el foco al botón |
| Teclado | Enlace de salto enfoca el contenido; detalles de reuniones responden a Enter |
| Accesibilidad automatizada | axe sobre las 16 páginas en escritorio y portada móvil: sin infracciones detectadas en WCAG A/AA y reglas de buenas prácticas probadas |
| Consola | Sin errores de página ni errores de consola durante los recorridos |
| Movimiento | Sin elementos ocultos por opacidad, transformaciones de entrada ni animaciones; movimiento reducido respetado |
| Contenido sin JavaScript | Portada, proyectos e integrantes visibles desde HTML |
| Metadatos | Título, descripción y noindex presentes en cada página; cabecera X-Robots-Tag activa |
| Rutas inexistentes | Respuesta 404 para ruta desconocida y proyecto inexistente |
| Contacto y datos | Sin formularios, envíos, correos ficticios activos, cifras o datos estructurados de ejemplo |

Se corrigió el aviso global DEMO para que sea una región semántica accesible y se repitió la compilación y el análisis de accesibilidad. La comprobación automatizada complementa la revisión visual y de teclado; no constituye una certificación de accesibilidad. Las pruebas se realizaron en Chromium.

## Veracidad y mantenimiento

- Cada ficha publicable declara su estado editorial; sin `confirmado: true` se considera ilustrativa.
- No hay reuniones ficticias dentro de la agenda o el historial confirmado.
- Publicaciones y galería muestran estados vacíos, pues no hay recursos reales disponibles.
- El diálogo de galería está preparado y revisado en código; no se probó con fotografías del semillero porque no se proporcionaron.
- Proyectos y notas de ejemplo no aportan nombres, fechas o resultados ficticios a sus metadatos.
- No se publicaron cambios en producción ni se realizó push al repositorio remoto.

La guía de edición, los campos de Markdown y las condiciones para sustituir ejemplos están en [CONTRIBUTING.md](CONTRIBUTING.md).

## Referencias inspeccionadas

- [Repositorio solicitado](https://github.com/josh0827/ISIA-Ingenieria-de-Sistemas-Inteligentes-y-Autonomos): se tomó como base su revisión `b166beb`, incluyendo la versión institucional clara y el escudo.
- [Stanford AI Lab](https://ai.stanford.edu/): contenido e interfaz inspeccionados. Referencia para identidad académica, navegación y organización de investigación.
- [JPL](https://www.jpl.nasa.gov/): contenido accesible mediante lectura web; el navegador devolvió 403. Se observó la organización en proyectos/misiones y noticias, sin copiar sus imágenes ni contenidos.
- [Max Planck Institute for Intelligent Systems](https://is.mpg.de/): acceso rechazado con 403; no se le atribuyeron características visuales.
- [Escudo en Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Escudo_de_la_Universidad_Nacional_de_Colombia_(2016).svg): César Puertas Céspedes, licencia de atribución. Recurso provisional sin modificaciones. El verde `#456A3E` coincide con el SVG local; la paleta no se presenta como manual oficial.

## Datos pendientes para FULL

Presentación y objetivos aprobados; líneas oficiales; proyectos y participantes reales; directorio y fotografías autorizadas; novedades y calendario confirmados; publicaciones y sus enlaces; canal de contacto y procedimiento de vinculación; facultad/campus/espacio específico; recurso institucional oficial y destino de publicación autorizado.

