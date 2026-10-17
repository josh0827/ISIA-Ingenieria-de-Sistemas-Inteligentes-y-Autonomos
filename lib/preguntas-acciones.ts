'use server'

import { revalidatePath } from 'next/cache'
import { esquemaPreguntaPublica, type EstadoFormularioPregunta } from '@/lib/preguntas-esquemas'
import { crearClienteAdmin } from '@/lib/supabase/server'
import { supabaseServidorListo } from '@/lib/supabase/config'

function trampa(formData: FormData): boolean {
  return typeof formData.get('sitioWeb') === 'string' && String(formData.get('sitioWeb')).length > 0
}

export async function enviarPregunta(
  _estado: EstadoFormularioPregunta,
  formData: FormData,
): Promise<EstadoFormularioPregunta> {
  if (trampa(formData)) return { ok: true, mensaje: 'Recibimos tu pregunta.' }
  const validacion = esquemaPreguntaPublica.safeParse({
    nombre: formData.get('nombre'),
    correo: formData.get('correo'),
    categoria: formData.get('categoria'),
    pregunta: formData.get('pregunta'),
    consentimiento: formData.get('consentimiento') === 'on',
  })
  if (!validacion.success) return { ok: false, error: validacion.error.issues[0]?.message }
  if (!supabaseServidorListo()) return { ok: false, error: 'El formulario no está disponible temporalmente.' }

  const datos = validacion.data
  const haceQuinceMinutos = new Date(Date.now() - 15 * 60 * 1000).toISOString()
  const haceUnaHora = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const cliente = crearClienteAdmin()
  const [{ data: duplicada, error: errorDuplicada }, { count, error: errorLimite }] = await Promise.all([
    cliente.from('preguntas_comunidad').select('id').eq('correo', datos.correo).gte('creado_en', haceQuinceMinutos).limit(1),
    cliente.from('preguntas_comunidad').select('id', { count: 'exact', head: true }).gte('creado_en', haceUnaHora),
  ])
  if (errorDuplicada || errorLimite) return { ok: false, error: 'No pudimos comprobar la solicitud. Intenta nuevamente.' }
  if ((duplicada ?? []).length) return { ok: false, error: 'Ya recibimos una pregunta reciente con este correo.' }
  if ((count ?? 0) >= 30) return { ok: false, error: 'Se recibieron muchas preguntas. Intenta de nuevo en una hora.' }

  const { error } = await cliente.from('preguntas_comunidad').insert({
    nombre: datos.nombre,
    correo: datos.correo,
    categoria: datos.categoria,
    pregunta: datos.pregunta,
    consentimiento: true,
  })
  if (error) return { ok: false, error: 'No fue posible registrar la pregunta.' }
  revalidatePath('/admin/preguntas')
  return { ok: true, mensaje: 'Recibimos tu pregunta. Solo se publicará si el equipo la responde y aprueba.' }
}
