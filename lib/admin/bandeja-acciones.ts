'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { requerirAdministrador, requerirEditor } from '@/lib/admin/datos'
import { registrarAuditoria } from '@/lib/admin/auditoria'
import { ESTADOS_SOLICITUD } from '@/lib/admin/solicitudes'
import { crearClienteAdmin } from '@/lib/supabase/server'

const ORIGEN_TABLA = {
  participacion: 'solicitudes_participacion',
  colaboracion: 'solicitudes_colaboracion',
  prototipado: 'solicitudes_prototipado',
} as const
const entrada = z.object({ id: z.uuid(), origen: z.enum(['participacion', 'colaboracion', 'prototipado']) })

export async function actualizarEstadoBandeja(formData: FormData): Promise<void> {
  const usuario = await requerirEditor()
  const datos = entrada.extend({ estado: z.enum(ESTADOS_SOLICITUD) }).safeParse({
    id: formData.get('id'), origen: formData.get('origen'), estado: formData.get('estado'),
  })
  if (!datos.success) redirect('/admin/bandeja?resultado=datos-invalidos')
  const { id, origen, estado } = datos.data
  const { error } = await crearClienteAdmin().from(ORIGEN_TABLA[origen]).update({
    estado, actualizado_en: new Date().toISOString(),
  }).eq('id', id)
  if (error) {
    console.error('[bandeja] No se pudo actualizar el estado.', error.message)
    redirect('/admin/bandeja?resultado=error-estado')
  }
  await registrarAuditoria({ usuarioId: usuario.id, usuarioEmail: usuario.correo, accion: 'actualizar_estado', recursoTipo: origen, recursoId: id, detalle: { estado } })
  revalidatePath('/admin/bandeja')
  redirect('/admin/bandeja?resultado=estado-guardado')
}

export async function eliminarEntradaBandeja(formData: FormData): Promise<void> {
  const usuario = await requerirAdministrador()
  const datos = entrada.safeParse({ id: formData.get('id'), origen: formData.get('origen') })
  if (!datos.success) redirect('/admin/bandeja?resultado=datos-invalidos')
  const { id, origen } = datos.data
  const { error } = await crearClienteAdmin().from(ORIGEN_TABLA[origen]).delete().eq('id', id)
  if (error) {
    console.error('[bandeja] No se pudo eliminar la solicitud.', error.message)
    redirect('/admin/bandeja?resultado=error-eliminar')
  }
  await registrarAuditoria({ usuarioId: usuario.id, usuarioEmail: usuario.correo, accion: 'eliminar', recursoTipo: origen, recursoId: id })
  revalidatePath('/admin/bandeja')
  redirect('/admin/bandeja?resultado=eliminada')
}
