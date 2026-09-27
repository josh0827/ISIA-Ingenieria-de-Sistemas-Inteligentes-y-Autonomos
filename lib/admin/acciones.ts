'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
  eliminarFilaContenido,
  guardarFilaContenido,
  obtenerFilaContenido,
} from '@/lib/supabase/contenido'
import {
  anioValido,
  correoSeguro,
  enlaceSeguro,
  fechaISO,
  imagenSegura,
  slugValido,
  texto,
} from '@/lib/contenido'
import {
  esquemaDe,
  esquemaProyectoZod,
  type CampoEsquema,
} from '@/lib/admin/esquemas'
import { asignarAnidado, obtenerAnidado, requerirEditor } from '@/lib/admin/datos'
import { ErrorAcceso } from '@/lib/autorizacion'
import { guardarImagen, validarArchivoImagen } from '@/lib/storage/upload'
import {
  esquemaGaleriaImagenZod,
  esquemaIntegranteImagenZod,
  esquemaNovedadImagenZod,
} from '@/lib/validators/schemas'

export type EstadoFormulario = { ok: boolean; error?: string; codigo?: 401 | 403 }

const CARPETAS_IMAGEN: Record<string, string> = {
  proyectos: 'proyectos',
  novedades: 'noticias',
  reuniones: 'eventos',
  integrantes: 'integrantes',
  galeria: 'galeria',
}

function revalidarContenido(coleccion: string, slug: string): void {
  revalidatePath('/')
  revalidatePath(`/${coleccion}`)
  revalidatePath(`/${coleccion}/${slug}`)
  revalidatePath(`/admin/${coleccion}`)
}

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
      const s = texto(crudo)
      return campo.opciones?.find(
        (opcion) => opcion.toLocaleLowerCase('es') === s.toLocaleLowerCase('es'),
      )
    }
    case 'lista':
      return texto(crudo).split(',').map((s) => s.trim()).filter(Boolean)
    case 'url':
      return enlaceSeguro(crudo)
    case 'imagen':
      return undefined
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
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'No se pudo comprobar la autorización.',
      codigo: error instanceof ErrorAcceso ? error.codigo : undefined,
    }
  }

  const esquema = esquemaDe(coleccion)
  if (!esquema) return { ok: false, error: 'Tipo de contenido desconocido.' }

  let slug = slugExistente
  let datosExistentes: Record<string, unknown> = {}
  if (!slug) {
    slug = slugValido(formData.get('slug')) ?? null
    if (!slug) {
      return { ok: false, error: 'El identificador (slug) es obligatorio: solo minúsculas, números y guiones, sin empezar ni terminar en guion.' }
    }
    const existente = await obtenerFilaContenido(coleccion, slug)
    if (existente) return { ok: false, error: 'Ya existe un elemento con ese identificador. Elige otro.' }
  } else {
    const existente = await obtenerFilaContenido(coleccion, slug)
    if (!existente) return { ok: false, error: 'El elemento que intentas editar ya no existe.' }
    datosExistentes = existente.datos
  }

  const datos: Record<string, unknown> = {}
  const imagenesPendientes: { campo: CampoEsquema; archivo: File }[] = []
  let cuerpo = ''
  for (const campo of esquema.campos) {
    if (campo.clave === 'cuerpo') {
      cuerpo = texto(formData.get('cuerpo'))
      continue
    }
    if (campo.tipo === 'imagen') {
      const crudo = formData.get(campo.clave)
      const actual = imagenSegura(obtenerAnidado(datosExistentes, campo.clave))
      if (crudo instanceof File && crudo.size > 0) {
        const errorArchivo = validarArchivoImagen(crudo)
        if (errorArchivo) return { ok: false, error: `${campo.etiqueta}: ${errorArchivo}` }
        imagenesPendientes.push({ campo, archivo: crudo })
      } else if (actual) {
        asignarAnidado(datos, campo.clave, actual)
      } else if (campo.requerido) {
        return { ok: false, error: `Revisa el campo "${campo.etiqueta}": debes seleccionar una imagen.` }
      }
      continue
    }
    const valor = validarCampo(campo, formData.get(campo.clave))
    if (campo.requerido && esVacio(valor)) {
      return { ok: false, error: `Revisa el campo "${campo.etiqueta}": es obligatorio o el valor no tiene un formato válido.` }
    }
    if (!esVacio(valor)) asignarAnidado(datos, campo.clave, valor)
  }

  if (coleccion === 'proyectos') {
    const resultado = esquemaProyectoZod.safeParse(datos)
    if (!resultado.success) {
      return { ok: false, error: resultado.error.issues[0]?.message ?? 'Revisa los datos del proyecto.' }
    }
  }

  try {
    for (const { campo, archivo } of imagenesPendientes) {
      const carpeta = CARPETAS_IMAGEN[coleccion]
      if (!carpeta) throw new Error('No existe una carpeta de imágenes para este contenido.')
      const ruta = await guardarImagen(archivo, carpeta)
      asignarAnidado(datos, campo.clave, ruta)
    }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : ''
    return { ok: false, error: mensaje || 'No se pudo guardar la imagen en el servidor.' }
  }

  if (coleccion === 'proyectos') {
    const resultado = esquemaProyectoZod.safeParse(datos)
    if (!resultado.success) {
      return { ok: false, error: resultado.error.issues[0]?.message ?? 'Revisa los datos del proyecto.' }
    }
  }

  const esquemaImagen =
    coleccion === 'novedades'
      ? esquemaNovedadImagenZod
      : coleccion === 'integrantes'
        ? esquemaIntegranteImagenZod
        : coleccion === 'galeria'
          ? esquemaGaleriaImagenZod
          : undefined
  if (esquemaImagen) {
    const resultadoImagen = esquemaImagen.safeParse(datos)
    if (!resultadoImagen.success) {
      return { ok: false, error: resultadoImagen.error.issues[0]?.message }
    }
  }

  await guardarFilaContenido(coleccion, slug, datos, cuerpo)
  revalidarContenido(coleccion, slug)
  redirect(`/admin/${coleccion}`)
}

export async function eliminarDocumento(
  coleccion: string,
  slug: string,
): Promise<EstadoFormulario> {
  try {
    await requerirEditor()
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'No se pudo comprobar la autorización.',
      codigo: error instanceof ErrorAcceso ? error.codigo : undefined,
    }
  }
  if (!esquemaDe(coleccion)) throw new Error('Tipo de contenido desconocido.')
  await eliminarFilaContenido(coleccion, slug)
  revalidarContenido(coleccion, slug)
  return { ok: true }
}
