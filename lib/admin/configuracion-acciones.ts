'use server'

import { revalidatePath } from 'next/cache'
import { guardarConfiguracion } from '@/lib/supabase/contenido'
import { CLAVES_SECCION, type ConfiguracionNavegacion } from '@/lib/sitio'
import { requerirEditor } from '@/lib/admin/datos'
import { ErrorAcceso } from '@/lib/autorizacion'

export type EstadoConfiguracion = {
  ok: boolean
  mensaje?: string
  error?: string
  codigo?: 401 | 403
}

export async function guardarConfiguracionNavegacion(
  _estado: EstadoConfiguracion,
  formData: FormData,
): Promise<EstadoConfiguracion> {
  try {
    await requerirEditor()
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'No se pudo comprobar la autorización.',
      codigo: error instanceof ErrorAcceso ? error.codigo : undefined,
    }
  }

  const secciones = Object.fromEntries(
    CLAVES_SECCION.map((clave) => [clave, formData.get(clave) === 'on']),
  ) as ConfiguracionNavegacion

  await guardarConfiguracion('navegacion', { secciones })
  revalidatePath('/', 'layout')
  return { ok: true, mensaje: 'La navegación pública se actualizó correctamente.' }
}
