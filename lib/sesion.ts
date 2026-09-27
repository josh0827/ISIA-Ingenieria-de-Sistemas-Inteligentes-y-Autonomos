import 'server-only'
import { supabaseClienteListo } from './supabase/config'
import { crearClienteServidor } from './supabase/server'

export type UsuarioSesion = {
  id: string
  nombre: string
  correo?: string
  foto?: string
}

export async function cerrarSesion(): Promise<void> {
  if (!supabaseClienteListo()) return
  const supabase = await crearClienteServidor()
  await supabase.auth.signOut()
}

/** Devuelve el usuario autenticado validando el JWT con Supabase Auth. */
export async function usuarioSesion(): Promise<UsuarioSesion | undefined> {
  if (!supabaseClienteListo()) return undefined
  const supabase = await crearClienteServidor()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return undefined
  const metadatos = data.user.user_metadata as Record<string, unknown>
  const nombre =
    (typeof metadatos.full_name === 'string' && metadatos.full_name) ||
    (typeof metadatos.user_name === 'string' && metadatos.user_name) ||
    data.user.email ||
    data.user.id
  return {
    id: data.user.id,
    nombre,
    correo: data.user.email,
    foto: typeof metadatos.avatar_url === 'string' ? metadatos.avatar_url : undefined,
  }
}
