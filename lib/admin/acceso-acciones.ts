'use server'

import { crearClienteServidor } from '@/lib/supabase/server'
import { resolverUsuarioAutorizado } from '@/lib/usuarios-autorizados'

export type ResultadoAcceso = { ok: boolean; destino?: string; error?: string }

/**
 * Segundo paso del acceso con correo y contraseña. El navegador ya abrió la
 * sesión directamente con Supabase (así Supabase limita los intentos por cada
 * persona y no por el servidor); aquí se comprueba que la cuenta esté activa
 * en usuarios_autorizados y se vincula por correo en su primer acceso, igual
 * que hace /api/auth/callback con Google.
 */
export async function confirmarAcceso(siguiente: string): Promise<ResultadoAcceso> {
  const supabase = await crearClienteServidor()
  // getUser valida la sesión contra Supabase Auth y trae email_confirmed_at,
  // que los claims del JWT no incluyen.
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    return { ok: false, error: 'No se pudo abrir la sesión. Intenta de nuevo.' }
  }

  const email = data.user.email?.trim().toLocaleLowerCase('en-US')
  const resultado = await resolverUsuarioAutorizado({
    id: data.user.id,
    email: data.user.email_confirmed_at ? email : undefined,
  })

  if (!resultado.usuario?.activo) {
    if (resultado.error) {
      console.error('[ACCESO] Falló la consulta de autorización.', { usuarioId: data.user.id, causa: resultado.error })
    }
    await supabase.auth.signOut()
    return { ok: false, error: 'Esta cuenta no está registrada como usuario activo del panel.' }
  }

  const destinoSeguro = /^\/(?![\\/])/.test(siguiente) ? siguiente : '/admin'
  return {
    ok: true,
    destino: resultado.usuario.rol === 'empresa' ? '/admin/practicas' : destinoSeguro,
  }
}
