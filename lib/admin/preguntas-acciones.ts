'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requerirAdministrador, requerirEditor } from '@/lib/admin/datos'
import { registrarAuditoria } from '@/lib/admin/auditoria'
import { esquemaRespuestaPregunta } from '@/lib/preguntas-esquemas'
import { crearClienteAdmin } from '@/lib/supabase/server'
import { z } from 'zod'

export async function responderPregunta(formData: FormData): Promise<void> {
  const usuario = await requerirEditor()
  const validacion = esquemaRespuestaPregunta.safeParse({
    id: formData.get('id'),
    respuesta: formData.get('respuesta'),
    publicar: formData.get('publicar') === 'on',
  })
  if (!validacion.success) redirect('/admin/preguntas?resultado=datos-invalidos')
  const datos = validacion.data
  const ahora = new Date().toISOString()
  const { error } = await crearClienteAdmin().from('preguntas_comunidad').update({
    respuesta: datos.respuesta,
    estado: datos.publicar ? 'respondida' : 'pendiente',
    respondida_en: datos.publicar ? ahora : null,
    respondida_por: usuario.id,
    actualizado_en: ahora,
  }).eq('id', datos.id)
  if (error) {
    console.error('[preguntas] No se pudo guardar la respuesta.', error.message)
    redirect('/admin/preguntas?resultado=error')
  }
  await registrarAuditoria({
    usuarioId: usuario.id,
    usuarioEmail: usuario.correo,
    accion: datos.publicar ? 'responder_publicar' : 'guardar_respuesta',
    recursoTipo: 'pregunta',
    recursoId: datos.id,
  })
  revalidatePath('/preguntas')
  revalidatePath('/admin/preguntas')
  redirect(`/admin/preguntas?resultado=${datos.publicar ? 'respuesta-publicada' : 'respuesta-guardada'}`)
}

export async function archivarPregunta(formData: FormData): Promise<void> {
  const usuario = await requerirEditor()
  const idValido = z.uuid().safeParse(formData.get('id'))
  if (!idValido.success) redirect('/admin/preguntas?resultado=datos-invalidos')
  const id = idValido.data
  const { error } = await crearClienteAdmin().from('preguntas_comunidad').update({
    estado: 'archivada', actualizado_en: new Date().toISOString(),
  }).eq('id', id)
  if (error) {
    console.error('[preguntas] No se pudo archivar la pregunta.', error.message)
    redirect('/admin/preguntas?resultado=error')
  }
  await registrarAuditoria({ usuarioId: usuario.id, usuarioEmail: usuario.correo, accion: 'archivar', recursoTipo: 'pregunta', recursoId: id })
  revalidatePath('/preguntas')
  revalidatePath('/admin/preguntas')
  redirect('/admin/preguntas?resultado=pregunta-archivada')
}

export async function eliminarPregunta(formData: FormData): Promise<void> {
  const usuario = await requerirAdministrador()
  const idValido = z.uuid().safeParse(formData.get('id'))
  if (!idValido.success) redirect('/admin/preguntas?resultado=datos-invalidos')
  const id = idValido.data
  const { error } = await crearClienteAdmin().from('preguntas_comunidad').delete().eq('id', id)
  if (error) {
    console.error('[preguntas] No se pudo eliminar la pregunta.', error.message)
    redirect('/admin/preguntas?resultado=error')
  }
  await registrarAuditoria({ usuarioId: usuario.id, usuarioEmail: usuario.correo, accion: 'eliminar', recursoTipo: 'pregunta', recursoId: id })
  revalidatePath('/preguntas')
  revalidatePath('/admin/preguntas')
  redirect('/admin/preguntas?resultado=pregunta-eliminada')
}
