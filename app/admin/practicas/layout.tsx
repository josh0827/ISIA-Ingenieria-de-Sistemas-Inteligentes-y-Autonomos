import Link from 'next/link'
import { redirect } from 'next/navigation'
import CerrarSesionBoton from '@/componentes/admin/CerrarSesionBoton'
import { supabaseServidorListo } from '@/lib/supabase/config'
import { usuarioSesion } from '@/lib/sesion'
import { obtenerUsuarioAutorizado, puedeGestionarPracticas } from '@/lib/usuarios-autorizados'
import estilos from '../admin.module.css'

export const dynamic = 'force-dynamic'

export default async function LayoutPracticasAdmin({ children }: { children: React.ReactNode }) {
  if (!supabaseServidorListo()) return <div className={estilos.aviso}><h1>Panel no disponible</h1><p>Faltan credenciales de Supabase en este entorno.</p></div>
  const usuario = await usuarioSesion()
  if (!usuario) redirect('/admin/iniciar-sesion?next=/admin/practicas')
  const autorizado = await obtenerUsuarioAutorizado(usuario.id)
  if (!puedeGestionarPracticas(autorizado)) redirect('/admin/acceso-denegado?motivo=editor')
  return <div className={estilos.envoltorio}>
    <header className={estilos.barraSuperior}><div className={estilos.marca}><Link href="/admin/practicas">Prácticas e iniciativas</Link><span>Sesión de {usuario.correo ?? usuario.nombre}</span></div><div className={estilos.usuario}>{autorizado.rol !== 'empresa' && <Link href="/admin" className={estilos.enlaceVolver}>Panel ISIA</Link>}<Link href="/" className={estilos.enlaceVolver}>Ver el sitio</Link><CerrarSesionBoton /></div></header>
    <main className={`${estilos.cuerpo} ${estilos.contenido}`}>{children}</main>
  </div>
}
