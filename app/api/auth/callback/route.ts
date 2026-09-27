import { NextResponse } from 'next/server'
import { crearClienteServidor } from '@/lib/supabase/server'
import { obtenerUsuarioAutorizado } from '@/lib/usuarios-autorizados'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const codigo = url.searchParams.get('code')
  const siguienteSolicitado = url.searchParams.get('next') ?? '/admin'
  const siguiente = /^\/(?![\\/])/.test(siguienteSolicitado)
    ? siguienteSolicitado
    : '/admin'

  if (!codigo) {
    return NextResponse.redirect(
      new URL('/admin/iniciar-sesion?error=oauth', url.origin),
    )
  }

  const supabase = await crearClienteServidor()
  const { data, error } = await supabase.auth.exchangeCodeForSession(codigo)

  if (!error && data.user) {
    const usuario = await obtenerUsuarioAutorizado(data.user.id)
    if (usuario?.activo) {
      const destino = usuario.rol === 'empresa' ? '/admin/practicas' : siguiente
      return NextResponse.redirect(new URL(destino, url.origin))
    }
  }

  await supabase.auth.signOut()
  return NextResponse.redirect(
    new URL('/admin/iniciar-sesion?error=unauthorized', url.origin),
  )
}
