import 'server-only'

import { clavePublicaSupabase, urlSupabase } from './config'

/**
 * Pregunta a Supabase Auth si el acceso con Google está activado. Así el botón
 * solo aparece cuando el proveedor existe y no hay que tocar el código el día
 * que se active. Ante cualquier fallo se oculta: el correo sigue funcionando.
 */
export async function googleHabilitado(): Promise<boolean> {
  const url = urlSupabase()
  const clave = clavePublicaSupabase()
  if (!url || !clave) return false
  try {
    const respuesta = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: clave },
      next: { revalidate: 300 },
    })
    if (!respuesta.ok) return false
    const ajustes = (await respuesta.json()) as { external?: { google?: boolean } }
    return ajustes.external?.google === true
  } catch {
    return false
  }
}
