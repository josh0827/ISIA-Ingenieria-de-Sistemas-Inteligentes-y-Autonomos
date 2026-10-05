'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requerirAdministrador, requerirEditor } from '@/lib/admin/datos'
import { registrarAuditoria } from '@/lib/admin/auditoria'
import { ESTADOS_SOLICITUD } from '@/lib/admin/solicitudes'
import { crearClienteAdmin } from '@/lib/supabase/server'

const cambioEstado = z.object({
  id: z.uuid(),
  estado: z.enum(ESTADOS_SOLICITUD),
})

export async function actualizarEstadoSolicitud(formData: FormData): Promise<void> {
  const usuario = await requerirEditor()
  const datos = cambioEstado.parse({ id: formData.get('id'), estado: formData.get('estado') })
  const { error } = await crearClienteAdmin()
    .from('solicitudes_participacion')
    .update({ estado: datos.estado, actualizado_en: new Date().toISOString() })
    .eq('id', datos.id)
  if (error) throw new Error('No se pudo actualizar la solicitud.')
  await registrarAuditoria({
    usuarioId: usuario.id,
    usuarioEmail: usuario.correo,
    accion: 'actualizar_estado',
    recursoTipo: 'solicitud_participacion',
    recursoId: datos.id,
    detalle: { estado: datos.estado },
  })
  revalidatePath('/admin/solicitudes')
}

export async function eliminarSolicitud(formData: FormData): Promise<void> {
  const usuario = await requerirAdministrador()
  const id = z.uuid().parse(formData.get('id'))
  const { error } = await crearClienteAdmin().from('solicitudes_participacion').delete().eq('id', id)
  if (error) throw new Error('No se pudo eliminar la solicitud.')
  await registrarAuditoria({
    usuarioId: usuario.id,
    usuarioEmail: usuario.correo,
    accion: 'eliminar',
    recursoTipo: 'solicitud_participacion',
    recursoId: id,
  })
  revalidatePath('/admin/solicitudes')
}
