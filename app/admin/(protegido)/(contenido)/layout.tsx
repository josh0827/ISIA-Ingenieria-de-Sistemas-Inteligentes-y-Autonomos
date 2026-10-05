import { redirect } from 'next/navigation'
import { usuarioSesion } from '@/lib/sesion'
import { obtenerUsuarioAutorizado, puedeEditarContenido } from '@/lib/usuarios-autorizados'

export default async function LayoutContenidoAdmin({ children }: { children: React.ReactNode }) {
  const usuario = await usuarioSesion()
  if (!usuario) redirect('/admin/iniciar-sesion')

  const autorizado = await obtenerUsuarioAutorizado(usuario.id)
  if (!puedeEditarContenido(autorizado)) redirect('/admin/practicas')

  return children
}
