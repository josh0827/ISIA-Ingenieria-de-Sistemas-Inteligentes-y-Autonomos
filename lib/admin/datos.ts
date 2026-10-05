import 'server-only'
import { supabaseServidorListo } from '@/lib/supabase/config'
import { listarResumenesContenido, obtenerFilaContenido } from '@/lib/supabase/contenido'
import { usuarioSesion } from '@/lib/sesion'
import {
  obtenerUsuarioAutorizado,
  puedeEditarContenido,
  puedeEliminarPracticas,
  puedeGestionarPracticas,
} from '@/lib/usuarios-autorizados'
import { ESTADOS_PROYECTO, esquemaDe, type EsquemaColeccion } from '@/lib/admin/esquemas'
import { ErrorAcceso } from '@/lib/autorizacion'

export async function requerirEditor() {
  if (!supabaseServidorListo()) throw new Error('Supabase no está configurado en este entorno.')
  const usuario = await usuarioSesion()
  if (!usuario) throw new ErrorAcceso('No hay una sesión activa.', 401, 'sesion')
  if (!puedeEditarContenido(await obtenerUsuarioAutorizado(usuario.id))) {
    throw new ErrorAcceso('Tu cuenta no está autorizada para editar contenido.', 403, 'editor')
  }
  return usuario
}

export async function requerirGestionPracticas() {
  if (!supabaseServidorListo()) throw new Error('Supabase no está configurado en este entorno.')
  const usuario = await usuarioSesion()
  if (!usuario) throw new ErrorAcceso('No hay una sesión activa.', 401, 'sesion')
  const autorizado = await obtenerUsuarioAutorizado(usuario.id)
  if (!puedeGestionarPracticas(autorizado)) {
    throw new ErrorAcceso('Tu cuenta no está autorizada para gestionar prácticas.', 403, 'editor')
  }
  return { ...usuario, autorizado }
}

export async function requerirAdministrador() {
  if (!supabaseServidorListo()) throw new Error('Supabase no está configurado en este entorno.')
  const usuario = await usuarioSesion()
  if (!usuario) throw new ErrorAcceso('No hay una sesión activa.', 401, 'sesion')
  const autorizado = await obtenerUsuarioAutorizado(usuario.id)
  if (!puedeEliminarPracticas(autorizado)) {
    throw new ErrorAcceso('Solo una cuenta administradora puede eliminar prácticas.', 403, 'editor')
  }
  return { ...usuario, autorizado }
}

export function obtenerAnidado(objeto: Record<string, unknown>, ruta: string): unknown {
  return ruta.split('.').reduce<unknown>((actual, clave) => {
    if (actual && typeof actual === 'object') return (actual as Record<string, unknown>)[clave]
    return undefined
  }, objeto)
}

export function asignarAnidado(objeto: Record<string, unknown>, ruta: string, valor: unknown): void {
  const partes = ruta.split('.')
  let actual = objeto
  for (let i = 0; i < partes.length - 1; i += 1) {
    const clave = partes[i]
    if (typeof actual[clave] !== 'object' || actual[clave] === null) actual[clave] = {}
    actual = actual[clave] as Record<string, unknown>
  }
  actual[partes[partes.length - 1]] = valor
}

export type DocumentoAdmin = { slug: string; datos: Record<string, unknown>; cuerpo: string }

function normalizarDatosAdmin(
  coleccion: string,
  datos: Record<string, unknown>,
): Record<string, unknown> {
  if (coleccion !== 'proyectos') return datos
  if (ESTADOS_PROYECTO.includes(datos.estado as (typeof ESTADOS_PROYECTO)[number])) return datos
  return { ...datos, estado: 'En formulación' }
}

/** Lectura sin filtrar (a diferencia de lib/contenido.ts) para poblar tablas y formularios de edición. */
export async function listarDocumentos(coleccion: string): Promise<DocumentoAdmin[]> {
  await requerirEditor()
  const esquema = esquemaDe(coleccion)
  if (!esquema) throw new Error('Tipo de contenido desconocido.')
  return (await listarResumenesContenido(coleccion))
    .map((fila) => ({
      slug: fila.slug,
      datos: normalizarDatosAdmin(coleccion, fila.datos),
      cuerpo: '',
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug))
}

export async function obtenerDocumento(coleccion: string, slug: string): Promise<DocumentoAdmin | undefined> {
  await requerirEditor()
  const esquema = esquemaDe(coleccion)
  if (!esquema) throw new Error('Tipo de contenido desconocido.')
  const fila = await obtenerFilaContenido(coleccion, slug)
  if (!fila) return undefined
  return {
    slug: fila.slug,
    datos: normalizarDatosAdmin(coleccion, fila.datos),
    cuerpo: fila.cuerpo,
  }
}

export function valorColumna(documento: DocumentoAdmin, clave: string): string {
  const valor = obtenerAnidado(documento.datos, clave)
  if (valor === undefined || valor === null || valor === '') return '—'
  if (Array.isArray(valor)) return valor.join(', ') || '—'
  return String(valor)
}

export type { EsquemaColeccion }
