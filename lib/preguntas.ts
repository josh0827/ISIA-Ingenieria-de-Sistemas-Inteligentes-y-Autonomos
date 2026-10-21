import 'server-only'

import { crearClienteAdmin } from '@/lib/supabase/server'
import type { ESTADOS_PREGUNTA } from '@/lib/preguntas-esquemas'

export type EstadoPregunta = (typeof ESTADOS_PREGUNTA)[number]
export type PreguntaPublica = {
  id: string
  categoria: string
  pregunta: string
  respuesta: string
  respondidaEn: string
}
export type PreguntaAdmin = PreguntaPublica & {
  nombre: string
  correo: string
  estado: EstadoPregunta
  creadoEn: string
}

export async function listarPreguntasPublicas(): Promise<PreguntaPublica[]> {
  const { data, error } = await crearClienteAdmin().from('preguntas_comunidad')
    .select('id, categoria, pregunta, respuesta, respondida_en')
    .eq('estado', 'respondida')
    .not('respuesta', 'is', null)
    .order('respondida_en', { ascending: false })
    .limit(100)
  if (error) throw new Error(error.message)
  return (data ?? []).map((fila) => ({
    id: String(fila.id),
    categoria: String(fila.categoria),
    pregunta: String(fila.pregunta),
    respuesta: String(fila.respuesta),
    respondidaEn: String(fila.respondida_en),
  }))
}

export async function listarPreguntasAdmin(): Promise<PreguntaAdmin[]> {
  const { data, error } = await crearClienteAdmin().from('preguntas_comunidad')
    .select('id, nombre, correo, categoria, pregunta, respuesta, estado, creado_en, respondida_en')
    .order('creado_en', { ascending: false })
    .limit(250)
  if (error) throw new Error(error.message)
  return (data ?? []).map((fila) => ({
    id: String(fila.id),
    nombre: String(fila.nombre),
    correo: String(fila.correo),
    categoria: String(fila.categoria),
    pregunta: String(fila.pregunta),
    respuesta: fila.respuesta ? String(fila.respuesta) : '',
    estado: fila.estado as EstadoPregunta,
    creadoEn: String(fila.creado_en),
    respondidaEn: fila.respondida_en ? String(fila.respondida_en) : '',
  }))
}
