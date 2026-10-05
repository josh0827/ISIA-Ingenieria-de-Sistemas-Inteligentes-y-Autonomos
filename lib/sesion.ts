import 'server-only'
import { cache } from 'react'
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

/**
 * Devuelve el usuario autenticado validando criptograficamente el JWT.
 * React cache evita repetir esta verificacion entre el layout y la pagina
 * durante una misma navegacion del App Router.
 */
export const usuarioSesion = cache(async (): Promise<UsuarioSesion | undefined> => {
  if (!supabaseClienteListo()) return undefined
  const supabase = await crearClienteServidor()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) return undefined

  const claims = data.claims
  const metadatos = claims.user_metadata && typeof claims.user_metadata === 'object'
    ? claims.user_metadata as Record<string, unknown>
    : {}
  const nombre =
    (typeof metadatos.full_name === 'string' && metadatos.full_name) ||
    (typeof metadatos.user_name === 'string' && metadatos.user_name) ||
    claims.email ||
    claims.sub
  return {
    id: claims.sub,
    nombre,
    correo: claims.email,
    foto: typeof metadatos.avatar_url === 'string' ? metadatos.avatar_url : undefined,
  }
})
