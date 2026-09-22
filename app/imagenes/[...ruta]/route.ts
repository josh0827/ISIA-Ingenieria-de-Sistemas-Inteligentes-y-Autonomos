import { readFile, realpath } from 'node:fs/promises'
import path from 'node:path'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const RAIZ_IMAGENES = path.join(process.cwd(), 'public', 'imagenes')
const TIPOS: Record<string, string> = {
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

function respuestaNoEncontrada() {
  return new Response('Imagen no encontrada.', {
    status: 404,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}

export async function GET(
  _solicitud: Request,
  contexto: { params: Promise<{ ruta: string[] }> },
) {
  const { ruta } = await contexto.params
  if (
    !ruta.length ||
    ruta.some(
      (segmento) =>
        segmento === '.' ||
        segmento === '..' ||
        !/^[a-zA-Z0-9_.-]+$/.test(segmento),
    )
  ) {
    return respuestaNoEncontrada()
  }

  const tipo = TIPOS[path.extname(ruta.at(-1) ?? '').toLowerCase()]
  if (!tipo) return respuestaNoEncontrada()

  try {
    const raizReal = await realpath(RAIZ_IMAGENES)
    const archivoReal = await realpath(path.join(RAIZ_IMAGENES, ...ruta))
    if (!archivoReal.startsWith(`${raizReal}${path.sep}`)) return respuestaNoEncontrada()

    const contenido = await readFile(archivoReal)
    return new Response(contenido, {
      headers: {
        'Content-Type': tipo,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return respuestaNoEncontrada()
  }
}
