import 'server-only'
import { obtenerUsuarioAutorizado, puedeEditarContenido } from './usuarios-autorizados'

/**
 * Iniciar sesión con Google no basta para escribir contenido: el id debe
 * existir en la tabla "editores" de PostgreSQL. Esa tabla se gestiona
 * desde Supabase (no desde este sitio) para evitar que
 * cualquier persona autenticada obtenga acceso de edición.
 */
export async function esEditor(id: string): Promise<boolean> {
  return puedeEditarContenido(await obtenerUsuarioAutorizado(id))
}
