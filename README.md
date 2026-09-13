# Sitio web del grupo ISIA

Sitio público del grupo de investigación **ISIA (Ingeniería de Sistemas Inteligentes y Autónomos)**.

Todo el contenido vive en este repositorio como archivos de texto. Para publicar una novedad o
anunciar una reunión no hace falta instalar nada ni saber programar: se crea un archivo `.md` en la
carpeta `contenido/`, se hace commit y el sitio se actualiza solo.

---

## Publicar sin instalar nada

Esta es la vía normal para la mayoría del grupo.

1. Entra a este repositorio en github.com
2. Abre la carpeta `contenido/` y luego la que te toque (`novedades/`, `reuniones/`, `proyectos/`,
   `integrantes/`)
3. Pulsa **Add file → Create new file**
4. Ponle un nombre en minúsculas, con guiones y terminado en `.md`
   - novedades y reuniones van con la fecha delante: `2026-10-15-titulo-corto.md`
   - proyectos e integrantes no llevan fecha: `nodo-de-medida-autonomo.md`
5. Copia la plantilla que corresponda de [CONTRIBUTING.md](CONTRIBUTING.md), rellénala y guarda
6. En dos o tres minutos aparece en el sitio

Lo más rápido es abrir un archivo que ya exista, pulsar **Copy raw contents** y partir de ahí.

**Lo único que no se puede cambiar** es la parte de arriba entre las dos líneas de `---`: los
nombres de los campos tienen que quedar tal cual, solo se cambia lo que va después de los dos
puntos. Si te equivocas, el sitio no se rompe: ese archivo se ignora y los demás siguen viéndose.

---

## Levantar el sitio en tu equipo

Solo hace falta si vas a tocar código.

```bash
npm install
npm run dev
```

Y abre http://localhost:3000

Otros comandos:

| Comando | Para qué |
|---|---|
| `npm run dev` | Servidor de desarrollo, recarga sola al guardar |
| `npm run build` | Compila el sitio entero. **Pásalo antes de cada pull request** |
| `npm start` | Sirve lo compilado, igual que en producción |
| `npm run lint` | Revisa el código |

Requisitos: Node 20 o superior.

---

## Cómo está organizado

```
app/              una carpeta por sección del sitio
componentes/      piezas compartidas por todas las secciones
lib/
  sitio.ts        nombre, correo, navegación, objetivos y líneas del grupo
  contenido.ts    lee los archivos .md
contenido/        AQUÍ escribe el grupo. Sin tocar código
public/imagenes/  fotos
```

**Dirección visual**: minimalista y clara. Blanco y gris muy claro, una sola tipografía en varios
pesos y un único color de acento, el verde del escudo institucional. Las secciones se separan con
aire y líneas de un píxel, no con cajas. La regla práctica: si dudas entre añadir algo o quitarlo,
quítalo.

**Si quieres cambiar un dato del grupo** (el correo, los objetivos, las cifras de la portada, las
líneas de investigación), está todo en `lib/sitio.ts`. Es un archivo de texto normal y es el único
sitio donde hay que tocarlo: el cambio se propaga a la portada, al pie y a las metaetiquetas a la vez.

---

## Estado de las secciones

| Sección | Ruta | Estado |
|---|---|---|
| Portada | `/` | Terminada |
| Novedades | `/novedades` | Terminada, sirve de modelo |
| Proyectos | `/proyectos` | Terminada, sirve de modelo |
| Reuniones | `/reuniones` | Por montar |
| Líneas | `/lineas` | Por montar |
| Integrantes | `/integrantes` | Por montar |
| Publicaciones | `/publicaciones` | Por montar |
| Galería | `/galeria` | Por montar |
| Únete | `/unete` | Por montar |

Cada página por montar tiene dentro, en comentarios, qué hay que hacer y con qué piezas. El reparto
y las reglas para no pisarnos están en [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Publicación

El sitio se publica en Vercel conectado a este repositorio:

- lo que se mezcla en `main` sale publicado en unos minutos
- **cada pull request genera su propia dirección de vista previa**, así que se puede revisar una
  sección antes de mezclarla

### Puesta en marcha (una sola vez)

1. Crear el repositorio en la organización del grupo y subir este proyecto
2. Entrar en vercel.com con la cuenta de GitHub e importar el repositorio
3. No hay que configurar nada: Vercel detecta Next.js solo. No hay variables de entorno
4. Cuando haya dominio propio, añadirlo en Vercel y actualizar `url` en `lib/sitio.ts`

---

## Pendientes de la primera versión

- [ ] Poner el correo real del grupo en `lib/sitio.ts`
- [ ] Sustituir objetivos y líneas de ejemplo por los oficiales
- [ ] Cambiar las cifras de la portada por las reales
- [ ] Sustituir los `.md` de ejemplo de `contenido/` por contenido real
- [ ] Pedir al director el escudo oficial del manual de identidad de la UNAL. El que hay en
      `public/imagenes/escudo-unal.svg` viene de Wikimedia Commons con licencia de atribución
      (autor: César Puertas Céspedes); es sustituir el archivo y ya
- [ ] Montar las seis secciones pendientes
