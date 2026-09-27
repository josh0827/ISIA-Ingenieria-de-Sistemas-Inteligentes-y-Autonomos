import { NextResponse } from 'next/server'
import { crearClienteServidor } from '@/lib/supabase/server'
import { resolverUsuarioAutorizado } from '@/lib/usuarios-autorizados'

function redireccionError(origen: string, error: string) {
  return NextResponse.redirect(
    new URL(`/admin/iniciar-sesion?error=${encodeURIComponent(error)}`, origen),
  )
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const codigo = url.searchParams.get('code')
  const siguienteSolicitado = url.searchParams.get('next') ?? '/admin'
  const siguiente = /^\/(?![\\/])/.test(siguienteSolicitado)
    ? siguienteSolicitado
    : '/admin'

  if (!codigo) {
    console.error('[AUTH CALLBACK] Solicitud rechazada: falta el código OAuth.')
    return redireccionError(url.origin, 'missing_code')
  }

  const supabase = await crearClienteServidor()
  const { data, error } = await supabase.auth.exchangeCodeForSession(codigo)

  if (error || !data.user) {
    console.error('[AUTH CALLBACK] No fue posible crear la sesión.', {
      codigo: error?.code ?? 'usuario_ausente',
      mensaje: error?.message,
    })
    await supabase.auth.signOut()
    return redireccionError(url.origin, 'session_error')
  }

  const email = data.user.email?.trim().toLocaleLowerCase('en-US')
  console.info('[AUTH CALLBACK] Sesión OAuth verificada.', {
    usuarioId: data.user.id,
    dominioCorreo: email?.split('@')[1] ?? 'sin_correo',
  })

  const resultado = await resolverUsuarioAutorizado({
    id: data.user.id,
    email,
  })

  if (resultado.error) {
    console.error('[AUTH CALLBACK] Falló la consulta de autorización.', {
      usuarioId: data.user.id,
      causa: resultado.error,
    })
  }

  if (resultado.usuario?.activo) {
    console.info('[AUTH CALLBACK] Acceso concedido.', {
      usuarioId: data.user.id,
      rol: resultado.usuario.rol,
      vinculadoPorCorreo: resultado.vinculadoPorCorreo,
    })
    const destino = resultado.usuario.rol === 'empresa' ? '/admin/practicas' : siguiente
    return NextResponse.redirect(new URL(destino, url.origin))
  }

  console.warn('[AUTH CALLBACK] Acceso denegado.', {
    usuarioId: data.user.id,
    motivo: resultado.usuario ? 'usuario_inactivo' : 'usuario_no_registrado',
  })
  await supabase.auth.signOut()
  return redireccionError(url.origin, 'unauthorized')
}
