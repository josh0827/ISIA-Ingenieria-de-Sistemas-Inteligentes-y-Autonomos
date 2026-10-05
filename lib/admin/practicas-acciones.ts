'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requerirAdministrador, requerirGestionPracticas } from '@/lib/admin/datos'
import { ErrorAcceso } from '@/lib/autorizacion'
import { crearClienteAdmin } from '@/lib/supabase/server'
import { practicaOfertaSchema, type PracticaOfertaEntrada } from '@/lib/validators/practicas'
import { registrarAuditoria } from '@/lib/admin/auditoria'

export type EstadoPractica = { ok: boolean; error?: string; codigo?: 401 | 403 }

function lineas(valor: FormDataEntryValue | null): string[] {
  return typeof valor === 'string' ? valor.split(/\r?\n/).map((linea) => linea.trim()).filter(Boolean) : []
}

function revalidarPracticas() {
  revalidatePath('/practicas')
  revalidatePath('/admin/practicas')
}

export async function guardarPractica(idExistente: string | null, _estado: EstadoPractica, formData: FormData): Promise<EstadoPractica> {
  let sesion
  try {
    sesion = await requerirGestionPracticas()
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'No se pudo comprobar la autorización.', codigo: error instanceof ErrorAcceso ? error.codigo : undefined }
  }

  const esEmpresa = sesion.autorizado.rol === 'empresa'
  const entrada: PracticaOfertaEntrada = {
    titulo: String(formData.get('titulo') ?? '').trim(),
    empresaNombre: esEmpresa
      ? (sesion.autorizado.nombreEmpresaOUsuario ?? sesion.autorizado.email)
      : String(formData.get('empresaNombre') ?? '').trim(),
    ubicacion: String(formData.get('ubicacion') ?? '').trim() || 'Manizales, Caldas',
    modalidad: String(formData.get('modalidad') ?? '') as PracticaOfertaEntrada['modalidad'],
    descripcion: String(formData.get('descripcion') ?? '').trim(),
    requisitos: lineas(formData.get('requisitos')),
    contactoEmail: String(formData.get('contactoEmail') ?? '').trim(),
    urlPostulacion: String(formData.get('urlPostulacion') ?? '').trim(),
    activa: formData.get('activa') === 'on',
  }
  const validacion = practicaOfertaSchema.safeParse(entrada)
  if (!validacion.success) return { ok: false, error: validacion.error.issues[0]?.message ?? 'Revisa los datos de la oferta.' }

  const supabase = crearClienteAdmin()
  if (idExistente && esEmpresa) {
    const { data, error } = await supabase.from('practicas_ofertas').select('empresa_id').eq('id', idExistente).maybeSingle()
    if (error || !data || data.empresa_id !== sesion.id) return { ok: false, error: 'No puedes modificar una oferta de otra empresa.', codigo: 403 }
  }

  const oferta = validacion.data
  const datos = {
    titulo: oferta.titulo,
    empresa_nombre: oferta.empresaNombre,
    ubicacion: oferta.ubicacion,
    modalidad: oferta.modalidad,
    descripcion: oferta.descripcion,
    requisitos: oferta.requisitos,
    contacto_email: oferta.contactoEmail,
    url_postulacion: oferta.urlPostulacion || null,
    activa: oferta.activa,
    actualizado_en: new Date().toISOString(),
    ...(esEmpresa ? { empresa_id: sesion.id } : {}),
  }
  const { error } = idExistente
    ? await supabase.from('practicas_ofertas').update(datos).eq('id', idExistente)
    : await supabase.from('practicas_ofertas').insert(datos)
  if (error) return { ok: false, error: `No se pudo guardar la oferta: ${error.message}` }

  await registrarAuditoria({
    usuarioId: sesion.id,
    usuarioEmail: sesion.correo,
    accion: idExistente ? 'actualizar' : 'crear',
    recursoTipo: 'practica',
    recursoId: idExistente ?? oferta.titulo,
    detalle: { activa: oferta.activa },
  })

  revalidarPracticas()
  redirect('/admin/practicas?guardado=1')
}

export async function cambiarEstadoPractica(id: string, activa: boolean): Promise<EstadoPractica> {
  let sesion
  try {
    sesion = await requerirGestionPracticas()
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'No se pudo comprobar la autorización.', codigo: error instanceof ErrorAcceso ? error.codigo : undefined }
  }
  const supabase = crearClienteAdmin()
  if (sesion.autorizado.rol === 'empresa') {
    const { data, error } = await supabase.from('practicas_ofertas').select('empresa_id').eq('id', id).maybeSingle()
    if (error || !data || data.empresa_id !== sesion.id) return { ok: false, error: 'No puedes modificar una oferta de otra empresa.', codigo: 403 }
  }
  const { error } = await supabase.from('practicas_ofertas').update({ activa, actualizado_en: new Date().toISOString() }).eq('id', id)
  if (error) return { ok: false, error: `No se pudo actualizar la oferta: ${error.message}` }
  await registrarAuditoria({
    usuarioId: sesion.id,
    usuarioEmail: sesion.correo,
    accion: activa ? 'activar' : 'desactivar',
    recursoTipo: 'practica',
    recursoId: id,
  })
  revalidarPracticas()
  return { ok: true }
}

export async function eliminarPractica(id: string): Promise<EstadoPractica> {
  let sesion: Awaited<ReturnType<typeof requerirAdministrador>>
  try {
    sesion = await requerirAdministrador()
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'No se pudo comprobar la autorización.',
      codigo: error instanceof ErrorAcceso ? error.codigo : undefined,
    }
  }

  const { error } = await crearClienteAdmin()
    .from('practicas_ofertas')
    .delete()
    .eq('id', id)
  if (error) return { ok: false, error: `No se pudo eliminar la oferta: ${error.message}` }
  await registrarAuditoria({
    usuarioId: sesion.id,
    usuarioEmail: sesion.correo,
    accion: 'eliminar',
    recursoTipo: 'practica',
    recursoId: id,
  })
  revalidarPracticas()
  return { ok: true }
}
