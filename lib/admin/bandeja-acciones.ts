'use server'

import { revalidatePath } from 'next/cache'
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
  const datos = entrada.extend({ estado: z.enum(ESTADOS_SOLICITUD) }).parse({
    id: formData.get('id'), origen: formData.get('origen'), estado: formData.get('estado'),
  })
  const { error } = await crearClienteAdmin().from(ORIGEN_TABLA[datos.origen]).update({
    estado: datos.estado, actualizado_en: new Date().toISOString(),
  }).eq('id', datos.id)
  if (error) throw new Error('No se pudo actualizar la solicitud.')
  await registrarAuditoria({ usuarioId: usuario.id, usuarioEmail: usuario.correo, accion: 'actualizar_estado', recursoTipo: datos.origen, recursoId: datos.id, detalle: { estado: datos.estado } })
  revalidatePath('/admin/bandeja')
}

export async function eliminarEntradaBandeja(formData: FormData): Promise<void> {
  const usuario = await requerirAdministrador()
  const datos = entrada.parse({ id: formData.get('id'), origen: formData.get('origen') })
  const { error } = await crearClienteAdmin().from(ORIGEN_TABLA[datos.origen]).delete().eq('id', datos.id)
  if (error) throw new Error('No se pudo eliminar la solicitud.')
  await registrarAuditoria({ usuarioId: usuario.id, usuarioEmail: usuario.correo, accion: 'eliminar', recursoTipo: datos.origen, recursoId: datos.id })
  revalidatePath('/admin/bandeja')
}
