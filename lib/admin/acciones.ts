'use server'

import { redirect } from 'next/navigation'
import { db } from '@/lib/firebase/admin'
import {
  anioValido,
  correoSeguro,
  enlaceSeguro,
  fechaISO,
  imagenLocal,
  slugValido,
  texto,
} from '@/lib/contenido'
import { esquemaDe, type CampoEsquema } from '@/lib/admin/esquemas'
import { asignarAnidado, requerirEditor } from '@/lib/admin/datos'

export type EstadoFormulario = { ok: boolean; error?: string }

function validarCampo(campo: CampoEsquema, crudo: FormDataEntryValue | null): unknown {
  switch (campo.tipo) {
    case 'texto':
    case 'textarea':
      return texto(crudo) || undefined
    case 'markdown':
      return typeof crudo === 'string' ? crudo.trim() : ''
    case 'fecha':
      return fechaISO(crudo) || undefined
    case 'hora': {
      const s = texto(crudo)
      return /^([01]\d|2[0-3]):[0-5]\d$/.test(s) ? s : undefined
    }
    case 'numero':
      return anioValido(crudo)
    case 'booleano':
      return crudo === 'on' || crudo === 'true'
    case 'select': {
      const s = texto(crudo).toLowerCase()
      return campo.opciones?.includes(s) ? s : undefined
    }
    case 'lista':
      return texto(crudo).split(',').map((s) => s.trim()).filter(Boolean)
    case 'url':
      return enlaceSeguro(crudo)
    case 'imagen':
      return imagenLocal(crudo)
    case 'correo':
      return correoSeguro(crudo)
    default:
      return undefined
  }
}

function esVacio(valor: unknown): boolean {
  return valor === undefined || valor === '' || (Array.isArray(valor) && valor.length === 0)
}

/**
 * Crea o actualiza un documento de una colección de contenido. slugExistente
 * viene enlazado (bind) desde el formulario: si es null se trata de una
 * creación y el slug se toma del propio formulario.
 */
export async function guardarDocumento(
  coleccion: string,
  slugExistente: string | null,
  _estadoPrevio: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  try {
    await requerirEditor()
  } catch (error) {
    return { ok: false, error: (error as Error).message }
  }

  const esquema = esquemaDe(coleccion)
  if (!esquema) return { ok: false, error: 'Tipo de contenido desconocido.' }

  let slug = slugExistente
  if (!slug) {
    slug = slugValido(formData.get('slug')) ?? null
    if (!slug) {
      return { ok: false, error: 'El identificador (slug) es obligatorio: solo minúsculas, números y guiones, sin empezar ni terminar en guion.' }
    }
    const existente = await (await db()).collection(coleccion).doc(slug).get()
    if (existente.exists) return { ok: false, error: 'Ya existe un elemento con ese identificador. Elige otro.' }
  }

  const datos: Record<string, unknown> = {}
  let cuerpo = ''
  for (const campo of esquema.campos) {
    if (campo.clave === 'cuerpo') {
      cuerpo = texto(formData.get('cuerpo'))
      continue
    }
    const valor = validarCampo(campo, formData.get(campo.clave))
    if (campo.requerido && esVacio(valor)) {
      return { ok: false, error: `Revisa el campo "${campo.etiqueta}": es obligatorio o el valor no tiene un formato válido.` }
    }
    if (!esVacio(valor)) asignarAnidado(datos, campo.clave, valor)
  }

  await (await db()).collection(coleccion).doc(slug).set({ ...datos, cuerpo })
  redirect(`/admin/${coleccion}`)
}

export async function eliminarDocumento(coleccion: string, slug: string): Promise<void> {
  await requerirEditor()
  if (!esquemaDe(coleccion)) throw new Error('Tipo de contenido desconocido.')
  await (await db()).collection(coleccion).doc(slug).delete()
}
