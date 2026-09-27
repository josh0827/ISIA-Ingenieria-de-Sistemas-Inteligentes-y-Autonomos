import 'server-only'
import { supabaseServidorListo } from '@/lib/supabase/config'
import { obtenerConfiguracion } from '@/lib/supabase/contenido'
import {
  CLAVES_SECCION,
  NAVEGACION,
  NAVEGACION_PREDETERMINADA,
  type ClaveSeccion,
  type ConfiguracionNavegacion,
  type ItemNavegacion,
} from '@/lib/sitio'

export type { ConfiguracionNavegacion }

export function claveDesdeHref(href: string): ClaveSeccion | undefined {
  const clave = href.replace(/^\//, '')
  return CLAVES_SECCION.includes(clave as ClaveSeccion) ? clave as ClaveSeccion : undefined
}

export async function obtenerConfiguracionNavegacion(): Promise<ConfiguracionNavegacion> {
  if (!supabaseServidorListo()) return NAVEGACION_PREDETERMINADA
  try {
    const datos = (await obtenerConfiguracion('navegacion'))?.secciones
    if (!datos || typeof datos !== 'object') return NAVEGACION_PREDETERMINADA
    return Object.fromEntries(
      CLAVES_SECCION.map((clave) => [
        clave,
        (datos as Record<string, unknown>)[clave] !== false,
      ]),
    ) as ConfiguracionNavegacion
  } catch {
    return NAVEGACION_PREDETERMINADA
  }
}

export async function navegacionVisible(): Promise<ItemNavegacion[]> {
  const configuracion = await obtenerConfiguracionNavegacion()
  return NAVEGACION.filter((item) => {
    const clave = claveDesdeHref(item.href)
    return !clave || configuracion[clave]
  })
}
