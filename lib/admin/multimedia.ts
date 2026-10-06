import 'server-only'

import { COLECCIONES } from '@/lib/contenido'
import { listarFilasContenido } from '@/lib/supabase/contenido'
import { crearClienteAdmin } from '@/lib/supabase/server'

const CARPETAS = ['proyectos', 'noticias', 'eventos', 'integrantes', 'galeria', 'grupos'] as const

export type ArchivoMultimedia = {
  ruta: string
  url: string
  actualizadoEn?: string
  bytes?: number
  referencias: number
}

async function textosConReferencias(): Promise<string[]> {
  const contenido = await Promise.all(COLECCIONES.map((coleccion) => listarFilasContenido(coleccion)))
  const { data: grupos, error } = await crearClienteAdmin()
    .from('grupos_trabajo')
    .select('imagen_portada, galeria_imagenes')
  if (error) throw new Error(error.message)
  return [
    ...contenido.flat().map((fila) => JSON.stringify(fila.datos)),
    ...(grupos ?? []).map((grupo) => JSON.stringify(grupo)),
  ]
}

export async function contarReferenciasImagen(url: string): Promise<number> {
  return (await textosConReferencias()).filter((texto) => texto.includes(url)).length
}

export async function listarMultimedia(): Promise<ArchivoMultimedia[]> {
  const supabase = crearClienteAdmin()
  const [resultados, referencias] = await Promise.all([
    Promise.all(CARPETAS.map(async (carpeta) => {
      const { data, error } = await supabase.storage.from('imagenes').list(carpeta, {
        limit: 500,
        sortBy: { column: 'updated_at', order: 'desc' },
      })
      if (error) throw new Error(error.message)
      return (data ?? []).filter((archivo) => archivo.name && archivo.id).map((archivo) => {
        const ruta = `${carpeta}/${archivo.name}`
        return {
          ruta,
          url: supabase.storage.from('imagenes').getPublicUrl(ruta).data.publicUrl,
          actualizadoEn: archivo.updated_at ?? undefined,
          bytes: typeof archivo.metadata?.size === 'number' ? archivo.metadata.size : undefined,
        }
      })
    })),
    textosConReferencias(),
  ])
  return resultados
    .flat()
    .map((archivo) => ({
      ...archivo,
      referencias: referencias.filter((texto) => texto.includes(archivo.url)).length,
    }))
    .sort((a, b) => (b.actualizadoEn ?? '').localeCompare(a.actualizadoEn ?? ''))
}
