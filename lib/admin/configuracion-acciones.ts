'use server'

import { revalidatePath } from 'next/cache'
import { guardarConfiguracion } from '@/lib/supabase/contenido'
import { CLAVES_SECCION, type ConfiguracionNavegacion } from '@/lib/sitio'
import { requerirEditor } from '@/lib/admin/datos'
import { ErrorAcceso } from '@/lib/autorizacion'
import { registrarAuditoria } from '@/lib/admin/auditoria'

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
  let usuario: Awaited<ReturnType<typeof requerirEditor>>
  try {
    usuario = await requerirEditor()
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
  await guardarConfiguracion('contenido_demo', {
    mostrar: formData.get('mostrarContenidoIlustrativo') === 'on',
  })
  await registrarAuditoria({
    usuarioId: usuario.id,
    usuarioEmail: usuario.correo,
    accion: 'actualizar',
    recursoTipo: 'configuracion',
    recursoId: 'navegacion-y-demo',
    detalle: { secciones, mostrarContenidoIlustrativo: formData.get('mostrarContenidoIlustrativo') === 'on' },
  })
  revalidatePath('/', 'layout')
  return { ok: true, mensaje: 'La configuración pública se actualizó correctamente.' }
}
