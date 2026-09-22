import Link from 'next/link'
import { redirect } from 'next/navigation'
import { firebaseListo } from '@/lib/firebase/admin'
import { usuarioSesion } from '@/lib/sesion'
import { esEditor } from '@/lib/editores'
import { COLECCIONES } from '@/lib/contenido'
import { ESQUEMAS } from '@/lib/admin/esquemas'
import CerrarSesionBoton from '@/componentes/admin/CerrarSesionBoton'
import { esCorreoUnal } from '@/lib/autorizacion'
import estilos from '../admin.module.css'

export const dynamic = 'force-dynamic'

export default async function LayoutProtegido({ children }: { children: React.ReactNode }) {
  if (!firebaseListo()) {
    return (
      <div className={estilos.aviso}>
        <h1>Panel de administración no disponible</h1>
        <p>
          Este entorno todavía no tiene configuradas las credenciales de Firebase.
          Copia <code>.env.local.example</code> a <code>.env.local</code>, complétalo con tu
          proyecto de Firebase y reinicia el servidor.
        </p>
      </div>
    )
  }

  const usuario = await usuarioSesion()
  if (!usuario) redirect('/admin/iniciar-sesion')

  if (!esCorreoUnal(usuario.correo)) {
    redirect('/admin/acceso-denegado?motivo=correo')
  }

  const autorizado = await esEditor(usuario.uid)
  if (!autorizado) {
    redirect('/admin/acceso-denegado?motivo=editor')
  }

  return (
    <div className={estilos.envoltorio}>
      <header className={estilos.barraSuperior}>
        <div className={estilos.marca}>
          <Link href="/admin">Panel de administración ISIA</Link>
          <span>Sesión de {usuario.correo ?? usuario.nombre}</span>
        </div>
        <div className={estilos.usuario}>
          <Link href="/" className={estilos.enlaceVolver}>Ver el sitio</Link>
          <CerrarSesionBoton />
        </div>
      </header>
      <div className={estilos.cuerpo}>
        <nav className={estilos.nav} aria-label="Contenido">
          <Link href="/admin" className={estilos.navEnlace}>Panel</Link>
          <Link href="/admin/configuracion" className={estilos.navEnlace}>Configuración</Link>
          {COLECCIONES.map((coleccion) => (
            <Link key={coleccion} href={`/admin/${coleccion}`} className={estilos.navEnlace}>
              {ESQUEMAS[coleccion].etiqueta}
            </Link>
          ))}
        </nav>
        <main className={estilos.contenido}>{children}</main>
      </div>
    </div>
  )
}
