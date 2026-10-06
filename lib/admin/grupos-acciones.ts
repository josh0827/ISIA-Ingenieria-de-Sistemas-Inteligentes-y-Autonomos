'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requerirEditor } from '@/lib/admin/datos'
import { ErrorAcceso } from '@/lib/autorizacion'
import { crearClienteAdmin } from '@/lib/supabase/server'
import { guardarImagen, validarArchivoImagen } from '@/lib/storage/upload'
import { grupoTrabajoSchema, type GrupoTrabajoEntrada } from '@/lib/validators/grupos'
import { registrarAuditoria } from '@/lib/admin/auditoria'
import { eliminarImagen } from '@/lib/storage/upload'

export type EstadoGrupo = { ok: boolean; error?: string; codigo?: 401 | 403 }

function lineas(valor: FormDataEntryValue | null): string[] {
  return typeof valor === 'string'
    ? valor.split(/\r?\n/).map((linea) => linea.trim()).filter(Boolean)
    : []
}

function enlaces(valor: FormDataEntryValue | null) {
  return lineas(valor).map((linea) => {
    const [nombre, ...partesUrl] = linea.split('|')
    return { nombre: nombre?.trim() ?? '', url: partesUrl.join('|').trim() }
  })
}

function revalidarGrupo(slug: string) {
  revalidatePath('/grupos')
  revalidatePath(`/grupos/${slug}`)
  revalidatePath('/admin/grupos')
}

export async function guardarGrupo(
  slugExistente: string | null,
  _estado: EstadoGrupo,
  formData: FormData,
): Promise<EstadoGrupo> {
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

  const slug = slugExistente ?? String(formData.get('slug') ?? '').trim().toLowerCase()
  const supabase = crearClienteAdmin()
  const { data: existente } = await supabase
    .from('grupos_trabajo')
    .select('id, imagen_portada, galeria_imagenes')
    .eq('slug', slug)
    .maybeSingle()
  if (slugExistente && !existente) return { ok: false, error: 'El grupo que intentas editar ya no existe.' }
  if (!slugExistente && existente) return { ok: false, error: 'Ya existe un grupo con ese slug.' }

  const imagenesAnteriores = [
    typeof existente?.imagen_portada === 'string' ? existente.imagen_portada : undefined,
    ...(Array.isArray(existente?.galeria_imagenes) ? existente.galeria_imagenes.filter((valor): valor is string => typeof valor === 'string') : []),
  ].filter((valor): valor is string => Boolean(valor))
  const imagenesNuevas: string[] = []
  let imagenPortada = typeof existente?.imagen_portada === 'string' ? existente.imagen_portada : undefined
  const portada = formData.get('imagenPortada')
  if (portada instanceof File && portada.size > 0) {
    const error = validarArchivoImagen(portada)
    if (error) return { ok: false, error: `Imagen de portada: ${error}` }
    try {
      imagenPortada = await guardarImagen(portada, 'grupos')
      imagenesNuevas.push(imagenPortada)
    } catch (errorCarga) {
      await Promise.all(imagenesNuevas.map(eliminarImagen))
      return { ok: false, error: errorCarga instanceof Error ? errorCarga.message : 'No se pudo guardar la portada.' }
    }
  }

  const galeriaImagenes = lineas(formData.get('galeriaExistente'))
  for (const archivo of formData.getAll('galeriaNueva')) {
    if (!(archivo instanceof File) || archivo.size === 0) continue
    const error = validarArchivoImagen(archivo)
    if (error) return { ok: false, error: `Galería: ${error}` }
    try {
      const imagen = await guardarImagen(archivo, 'grupos')
      imagenesNuevas.push(imagen)
      galeriaImagenes.push(imagen)
    } catch (errorCarga) {
      await Promise.all(imagenesNuevas.map(eliminarImagen))
      return { ok: false, error: errorCarga instanceof Error ? errorCarga.message : 'No se pudo guardar una imagen.' }
    }
  }

  const entrada: GrupoTrabajoEntrada = {
    slug,
    nombre: String(formData.get('nombre') ?? '').trim(),
    descripcion: String(formData.get('descripcion') ?? '').trim(),
    imagenPortada,
    integrantes: lineas(formData.get('integrantes')),
    repositorios: enlaces(formData.get('repositorios')),
    documentos: enlaces(formData.get('documentos')),
    galeriaImagenes,
  }
  const validacion = grupoTrabajoSchema.safeParse(entrada)
  if (!validacion.success) {
    await Promise.all(imagenesNuevas.map(eliminarImagen))
    return { ok: false, error: validacion.error.issues[0]?.message ?? 'Revisa los datos del grupo.' }
  }

  const grupo = validacion.data
  const { error } = await supabase.from('grupos_trabajo').upsert({
    slug: grupo.slug,
    nombre: grupo.nombre,
    descripcion: grupo.descripcion,
    imagen_portada: grupo.imagenPortada ?? null,
    integrantes: grupo.integrantes,
    repositorios: grupo.repositorios,
    documentos: grupo.documentos,
    galeria_imagenes: grupo.galeriaImagenes,
    actualizado_en: new Date().toISOString(),
  }, { onConflict: 'slug' })
  if (error) {
    await Promise.all(imagenesNuevas.map(eliminarImagen))
    return { ok: false, error: `No se pudo guardar el grupo: ${error.message}` }
  }

  const imagenesActuales = new Set([grupo.imagenPortada, ...grupo.galeriaImagenes].filter((valor): valor is string => Boolean(valor)))
  await Promise.all(imagenesAnteriores.filter((imagen) => !imagenesActuales.has(imagen)).map(eliminarImagen))

  await registrarAuditoria({
    usuarioId: usuario.id,
    usuarioEmail: usuario.correo,
    accion: slugExistente ? 'actualizar' : 'crear',
    recursoTipo: 'grupo',
    recursoId: slug,
  })

  revalidarGrupo(slug)
  redirect('/admin/grupos?guardado=1')
}

export async function eliminarGrupo(slug: string): Promise<EstadoGrupo> {
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
  const supabase = crearClienteAdmin()
  const { data: existente } = await supabase
    .from('grupos_trabajo')
    .select('imagen_portada, galeria_imagenes')
    .eq('slug', slug)
    .maybeSingle()
  const { error } = await supabase.from('grupos_trabajo').delete().eq('slug', slug)
  if (error) return { ok: false, error: `No se pudo eliminar el grupo: ${error.message}` }
  const imagenes = [
    typeof existente?.imagen_portada === 'string' ? existente.imagen_portada : undefined,
    ...(Array.isArray(existente?.galeria_imagenes) ? existente.galeria_imagenes.filter((valor): valor is string => typeof valor === 'string') : []),
  ].filter((valor): valor is string => Boolean(valor))
  await Promise.all(imagenes.map(eliminarImagen))
  await registrarAuditoria({
    usuarioId: usuario.id,
    usuarioEmail: usuario.correo,
    accion: 'eliminar',
    recursoTipo: 'grupo',
    recursoId: slug,
  })
  revalidarGrupo(slug)
  return { ok: true }
}
