import 'server-only'

import { crearClienteAdmin } from './server'

export type FilaContenido = {
  slug: string
  datos: Record<string, unknown>
  cuerpo: string
}

function lanzarSiError(error: { message: string } | null): void {
  if (error) throw new Error(error.message)
}

export async function listarFilasContenido(coleccion: string): Promise<FilaContenido[]> {
  const { data, error } = await crearClienteAdmin()
    .from('contenido')
    .select('slug, datos, cuerpo')
    .eq('coleccion', coleccion)
    .order('slug')
  lanzarSiError(error)
  return (data ?? []).map((fila) => ({
    slug: String(fila.slug),
    datos: fila.datos && typeof fila.datos === 'object'
      ? fila.datos as Record<string, unknown>
      : {},
    cuerpo: typeof fila.cuerpo === 'string' ? fila.cuerpo : '',
  }))
}

export async function obtenerFilaContenido(
  coleccion: string,
  slug: string,
): Promise<FilaContenido | undefined> {
  const { data, error } = await crearClienteAdmin()
    .from('contenido')
    .select('slug, datos, cuerpo')
    .eq('coleccion', coleccion)
    .eq('slug', slug)
    .maybeSingle()
  lanzarSiError(error)
  if (!data) return undefined
  return {
    slug: String(data.slug),
    datos: data.datos && typeof data.datos === 'object'
      ? data.datos as Record<string, unknown>
      : {},
    cuerpo: typeof data.cuerpo === 'string' ? data.cuerpo : '',
  }
}

export async function guardarFilaContenido(
  coleccion: string,
  slug: string,
  datos: Record<string, unknown>,
  cuerpo: string,
): Promise<void> {
  const { error } = await crearClienteAdmin()
    .from('contenido')
    .upsert(
      {
        coleccion,
        slug,
        datos,
        cuerpo,
        actualizado_en: new Date().toISOString(),
      },
      { onConflict: 'coleccion,slug' },
    )
  lanzarSiError(error)
}

export async function eliminarFilaContenido(
  coleccion: string,
  slug: string,
): Promise<void> {
  const { error } = await crearClienteAdmin()
    .from('contenido')
    .delete()
    .eq('coleccion', coleccion)
    .eq('slug', slug)
  lanzarSiError(error)
}

export async function obtenerConfiguracion(clave: string): Promise<Record<string, unknown> | undefined> {
  const { data, error } = await crearClienteAdmin()
    .from('configuracion')
    .select('datos')
    .eq('clave', clave)
    .maybeSingle()
  lanzarSiError(error)
  return data?.datos && typeof data.datos === 'object'
    ? data.datos as Record<string, unknown>
    : undefined
}

export async function guardarConfiguracion(
  clave: string,
  datos: Record<string, unknown>,
): Promise<void> {
  const { error } = await crearClienteAdmin()
    .from('configuracion')
    .upsert(
      { clave, datos, actualizado_en: new Date().toISOString() },
      { onConflict: 'clave' },
    )
  lanzarSiError(error)
}
