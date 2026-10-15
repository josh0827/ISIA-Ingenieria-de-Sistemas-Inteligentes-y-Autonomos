'use server'

import { revalidatePath } from 'next/cache'
import { requerirAdministrador, requerirEditor } from '@/lib/admin/datos'
import { registrarAuditoria } from '@/lib/admin/auditoria'
import { esquemaRespuestaPregunta } from '@/lib/preguntas-esquemas'
import { crearClienteAdmin } from '@/lib/supabase/server'
import { z } from 'zod'

export async function responderPregunta(formData: FormData): Promise<void> {
  const usuario = await requerirEditor()
  const datos = esquemaRespuestaPregunta.parse({
    id: formData.get('id'),
    respuesta: formData.get('respuesta'),
    publicar: formData.get('publicar') === 'on',
  })
  const ahora = new Date().toISOString()
  const { error } = await crearClienteAdmin().from('preguntas_comunidad').update({
    respuesta: datos.respuesta,
    estado: datos.publicar ? 'respondida' : 'pendiente',
    respondida_en: datos.publicar ? ahora : null,
    respondida_por: usuario.id,
    actualizado_en: ahora,
  }).eq('id', datos.id)
  if (error) throw new Error('No se pudo guardar la respuesta.')
  await registrarAuditoria({
    usuarioId: usuario.id,
    usuarioEmail: usuario.correo,
    accion: datos.publicar ? 'responder_publicar' : 'guardar_respuesta',
    recursoTipo: 'pregunta',
    recursoId: datos.id,
  })
  revalidatePath('/preguntas')
  revalidatePath('/admin/preguntas')
}

export async function archivarPregunta(formData: FormData): Promise<void> {
  const usuario = await requerirEditor()
  const id = z.uuid().parse(formData.get('id'))
  const { error } = await crearClienteAdmin().from('preguntas_comunidad').update({
    estado: 'archivada', actualizado_en: new Date().toISOString(),
  }).eq('id', id)
  if (error) throw new Error('No se pudo archivar la pregunta.')
  await registrarAuditoria({ usuarioId: usuario.id, usuarioEmail: usuario.correo, accion: 'archivar', recursoTipo: 'pregunta', recursoId: id })
  revalidatePath('/preguntas')
  revalidatePath('/admin/preguntas')
}

export async function eliminarPregunta(formData: FormData): Promise<void> {
  const usuario = await requerirAdministrador()
  const id = z.uuid().parse(formData.get('id'))
  const { error } = await crearClienteAdmin().from('preguntas_comunidad').delete().eq('id', id)
  if (error) throw new Error('No se pudo eliminar la pregunta.')
  await registrarAuditoria({ usuarioId: usuario.id, usuarioEmail: usuario.correo, accion: 'eliminar', recursoTipo: 'pregunta', recursoId: id })
  revalidatePath('/preguntas')
  revalidatePath('/admin/preguntas')
}
