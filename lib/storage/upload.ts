import 'server-only'

import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { esHostSupabasePropio } from '@/lib/supabase/config'
import { crearClienteAdmin } from '@/lib/supabase/server'
import {
  bufferImagenValidada,
  formatoDeImagen,
} from '@/lib/storage/validacion'

export { validarArchivoImagen, validarContenidoImagen } from '@/lib/storage/validacion'

function nombreSeguro(nombre: string): string {
  const base = path.basename(nombre, path.extname(nombre))
  return (
    base
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'imagen'
  )
}

export async function guardarImagen(file: File, folder: string): Promise<string> {
  if (!/^[a-z0-9-]+$/.test(folder)) {
    throw new Error('La carpeta de imágenes solicitada no es válida.')
  }

  const buffer = await bufferImagenValidada(file)
  const formato = formatoDeImagen(file)
  const filename = `${Date.now()}-${nombreSeguro(file.name)}-${randomUUID().slice(0, 8)}.${formato.extension}`

  const bucket = 'imagenes'
  const ruta = `${folder}/${filename}`
  const supabase = crearClienteAdmin()
  const { error: errorCarga } = await supabase.storage
    .from(bucket)
    .upload(ruta, buffer, {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    })
  if (errorCarga) throw new Error(`No se pudo almacenar la imagen: ${errorCarga.message}`)

  const { data } = supabase.storage.from(bucket).getPublicUrl(ruta)
  return data.publicUrl
}

function rutaObjetoDesdeUrl(urlImagen: string): string | undefined {
  try {
    const url = new URL(urlImagen)
    const prefijo = '/storage/v1/object/public/imagenes/'
    if (url.protocol !== 'https:' || !esHostSupabasePropio(url.hostname) || !url.pathname.startsWith(prefijo)) return undefined
    const ruta = decodeURIComponent(url.pathname.slice(prefijo.length))
    if (!ruta || ruta.includes('..') || ruta.startsWith('/')) return undefined
    return ruta
  } catch {
    return undefined
  }
}

/** Elimina solo objetos que pertenecen al bucket público administrado por ISIA. */
export async function eliminarImagen(urlImagen: string): Promise<boolean> {
  const ruta = rutaObjetoDesdeUrl(urlImagen)
  if (!ruta) return false
  const { error } = await crearClienteAdmin().storage.from('imagenes').remove([ruta])
  if (error) console.error('[storage] No se pudo eliminar una imagen que ya no está referenciada.')
  return !error
}
