import 'server-only'
import type { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore'
import { db, firebaseListo } from '@/lib/firebase/admin'
import { esEditor } from '@/lib/editores'
import { usuarioSesion } from '@/lib/sesion'
import { ESTADOS_PROYECTO, esquemaDe, type EsquemaColeccion } from '@/lib/admin/esquemas'
import { ErrorAcceso, exigirCorreoUnal } from '@/lib/autorizacion'

export async function requerirEditor() {
  if (!firebaseListo()) throw new Error('Firebase no está configurado en este entorno.')
  const usuario = await usuarioSesion()
  if (!usuario) throw new ErrorAcceso('No hay una sesión activa.', 401, 'sesion')
  exigirCorreoUnal(usuario.correo)
  if (!(await esEditor(usuario.uid))) {
    throw new ErrorAcceso('Tu cuenta institucional no está autorizada para editar contenido.', 403, 'editor')
  }
  return usuario
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
  const instantanea = await (await db()).collection(coleccion).get()
  return instantanea.docs
    .map((doc: QueryDocumentSnapshot<DocumentData>) => {
      const { cuerpo, ...datos } = doc.data()
      return {
        slug: doc.id,
        datos: normalizarDatosAdmin(coleccion, datos),
        cuerpo: typeof cuerpo === 'string' ? cuerpo : '',
      }
    })
    .sort((a, b) => a.slug.localeCompare(b.slug))
}

export async function obtenerDocumento(coleccion: string, slug: string): Promise<DocumentoAdmin | undefined> {
  await requerirEditor()
  const esquema = esquemaDe(coleccion)
  if (!esquema) throw new Error('Tipo de contenido desconocido.')
  const doc = await (await db()).collection(coleccion).doc(slug).get()
  if (!doc.exists) return undefined
  const { cuerpo, ...datos } = doc.data() ?? {}
  return {
    slug: doc.id,
    datos: normalizarDatosAdmin(coleccion, datos),
    cuerpo: typeof cuerpo === 'string' ? cuerpo : '',
  }
}

export function valorColumna(documento: DocumentoAdmin, clave: string): string {
  const valor = obtenerAnidado(documento.datos, clave)
  if (valor === undefined || valor === null || valor === '') return '—'
  if (Array.isArray(valor)) return valor.join(', ') || '—'
  return String(valor)
}

export type { EsquemaColeccion }
