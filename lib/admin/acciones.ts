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
import { eliminarImagen, guardarImagen, validarArchivoImagen } from '@/lib/storage/upload'
import { registrarAuditoria } from '@/lib/admin/auditoria'
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

const CAMPOS_ALT: Record<string, { imagen: string; alt: string }> = {
  proyectos: { imagen: 'portada', alt: 'portadaAlt' },
  novedades: { imagen: 'imagen', alt: 'imagenAlt' },
  integrantes: { imagen: 'foto', alt: 'fotoAlt' },
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

function imagenesDelDocumento(
  esquema: NonNullable<ReturnType<typeof esquemaDe>>,
  datos: Record<string, unknown>,
): string[] {
  return esquema.campos
    .filter((campo) => campo.tipo === 'imagen')
    .map((campo) => imagenSegura(obtenerAnidado(datos, campo.clave)))
    .filter((valor): valor is string => Boolean(valor))
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
  let usuario: Awaited<ReturnType<typeof requerirEditor>>
  try {
    usuario = await requerirEditor()
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

  if (datos.estadoEditorial === 'Programado' && !datos.publicarEn) {
    return { ok: false, error: 'Indica la fecha de publicación para el contenido programado.' }
  }

  if (coleccion === 'proyectos') {
    const resultado = esquemaProyectoZod.safeParse(datos)
    if (!resultado.success) {
      return { ok: false, error: resultado.error.issues[0]?.message ?? 'Revisa los datos del proyecto.' }
    }
  }

  const imagenesNuevas: string[] = []
  try {
    for (const { campo, archivo } of imagenesPendientes) {
      const carpeta = CARPETAS_IMAGEN[coleccion]
      if (!carpeta) throw new Error('No existe una carpeta de imágenes para este contenido.')
      const ruta = await guardarImagen(archivo, carpeta)
      imagenesNuevas.push(ruta)
      asignarAnidado(datos, campo.clave, ruta)
    }
  } catch (error) {
    await Promise.all(imagenesNuevas.map(eliminarImagen))
    const mensaje = error instanceof Error ? error.message : ''
    return { ok: false, error: mensaje || 'No se pudo guardar la imagen en el servidor.' }
  }

  const camposAlt = CAMPOS_ALT[coleccion]
  if (camposAlt && imagenSegura(datos[camposAlt.imagen]) && !texto(datos[camposAlt.alt])) {
    await Promise.all(imagenesNuevas.map(eliminarImagen))
    return { ok: false, error: 'La imagen necesita un texto alternativo descriptivo.' }
  }

  if (coleccion === 'proyectos') {
    const resultado = esquemaProyectoZod.safeParse(datos)
    if (!resultado.success) {
      await Promise.all(imagenesNuevas.map(eliminarImagen))
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
      await Promise.all(imagenesNuevas.map(eliminarImagen))
      return { ok: false, error: resultadoImagen.error.issues[0]?.message }
    }
  }

  try {
    await guardarFilaContenido(coleccion, slug, datos, cuerpo)
  } catch {
    await Promise.all(imagenesNuevas.map(eliminarImagen))
    return { ok: false, error: 'No se pudo guardar el contenido. Intenta nuevamente.' }
  }

  const imagenesActuales = new Set(imagenesDelDocumento(esquema, datos))
  const imagenesReemplazadas = imagenesDelDocumento(esquema, datosExistentes)
    .filter((imagen) => !imagenesActuales.has(imagen))
  await Promise.all(imagenesReemplazadas.map(eliminarImagen))
  await registrarAuditoria({
    usuarioId: usuario.id,
    usuarioEmail: usuario.correo,
    accion: slugExistente ? 'actualizar' : 'crear',
    recursoTipo: coleccion,
    recursoId: slug,
    detalle: { estadoEditorial: datos.estadoEditorial, confirmado: datos.confirmado === true },
  })
  revalidarContenido(coleccion, slug)
  redirect(`/admin/${coleccion}?guardado=1`)
}

export async function eliminarDocumento(
  coleccion: string,
  slug: string,
): Promise<EstadoFormulario> {
  let usuario: Awaited<ReturnType<typeof requerirEditor>>
  try {
    usuario = await requerirEditor()
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'No se pudo comprobar la autorización.',
      codigo: error instanceof ErrorAcceso ? error.codigo : undefined,
    }
  }
  const esquema = esquemaDe(coleccion)
  if (!esquema) throw new Error('Tipo de contenido desconocido.')
  const existente = await obtenerFilaContenido(coleccion, slug)
  await eliminarFilaContenido(coleccion, slug)
  if (existente) await Promise.all(imagenesDelDocumento(esquema, existente.datos).map(eliminarImagen))
  await registrarAuditoria({
    usuarioId: usuario.id,
    usuarioEmail: usuario.correo,
    accion: 'eliminar',
    recursoTipo: coleccion,
    recursoId: slug,
  })
  revalidarContenido(coleccion, slug)
  return { ok: true }
}
