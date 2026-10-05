import Link from 'next/link'
import { COLECCIONES } from '@/lib/contenido'
import { ESQUEMAS } from '@/lib/admin/esquemas'
import CerrarSesionBoton from './CerrarSesionBoton'
import NotificacionesAdmin from './NotificacionesAdmin'
import estilos from '@/app/admin/admin.module.css'

type Props = {
  children: React.ReactNode
  usuario: string
  soloPracticas?: boolean
  esAdmin?: boolean
}

export default function PanelAdminShell({ children, usuario, soloPracticas = false, esAdmin = false }: Props) {
  return (
    <div className={estilos.envoltorio}>
      <NotificacionesAdmin />
      <header className={estilos.barraSuperior}>
        <div className={estilos.marca}>
          <Link href={soloPracticas ? '/admin/practicas' : '/admin'}>
            {soloPracticas ? 'Gestión de prácticas ISIA' : 'Panel de administración ISIA'}
          </Link>
          <span>Sesión de {usuario}</span>
        </div>
        <div className={estilos.usuario}>
          <Link href="/" className={estilos.enlaceSuperior}>Ver el sitio</Link>
          <CerrarSesionBoton />
        </div>
      </header>
      <div className={estilos.cuerpo}>
        <nav className={estilos.nav} aria-label="Contenido administrativo">
          {soloPracticas ? (
            <Link href="/admin/practicas" className={estilos.navEnlace}>Mis prácticas e iniciativas</Link>
          ) : (
            <>
              <Link href="/admin" className={estilos.navEnlace}>Panel</Link>
              <Link href="/admin/configuracion" className={estilos.navEnlace}>Configuración</Link>
              <Link href="/admin/grupos" className={estilos.navEnlace}>Grupos de trabajo</Link>
              <Link href="/admin/practicas" className={estilos.navEnlace}>Prácticas e iniciativas</Link>
              <Link href="/admin/solicitudes" className={estilos.navEnlace}>Solicitudes</Link>
              <Link href="/admin/multimedia" className={estilos.navEnlace}>Multimedia</Link>
              {COLECCIONES.map((coleccion) => (
                <Link key={coleccion} href={`/admin/${coleccion}`} className={estilos.navEnlace}>
                  {ESQUEMAS[coleccion].etiqueta}
                </Link>
              ))}
              {esAdmin && <Link href="/admin/auditoria" className={estilos.navEnlace}>Auditoría</Link>}
              <a href="/api/admin/exportar" className={estilos.navEnlace}>Descargar respaldo</a>
            </>
          )}
        </nav>
        <main className={estilos.contenido}>{children}</main>
      </div>
    </div>
  )
}
