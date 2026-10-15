import type { Metadata } from 'next'
import Link from 'next/link'
import estilos from '../../admin.module.css'

export const metadata: Metadata = { title: 'Panel' }
export const dynamic = 'force-dynamic'

export default function PanelAdmin() {
  return (
    <>
      <div className={estilos.cabeceraPagina}>
        <div>
          <h1>Contenido del sitio</h1>
          <p>Elige qué quieres gestionar. Los cambios se publican de inmediato en el sitio.</p>
        </div>
      </div>
      <div className={estilos.tarjetas}>
        <Link href="/admin/proyectos" className={estilos.tarjeta}>
          <h2>Contenido</h2>
          <p>Proyectos, ideas, novedades, agenda, publicaciones y multimedia.</p>
        </Link>
        <Link href="/admin/practicas" className={estilos.tarjeta}>
          <h2>Oportunidades</h2>
          <p>Prácticas activas, cerradas y archivadas de organizaciones autorizadas.</p>
        </Link>
        <Link href="/admin/grupos" className={estilos.tarjeta}>
          <h2>Comunidad</h2>
          <p>Integrantes y grupos de trabajo que sostienen la red del semillero.</p>
        </Link>
        <Link href="/admin/servicios" className={estilos.tarjeta}>
          <h2>Prototipado</h2>
          <p>Capacidades publicadas para evaluar retos y pruebas de concepto.</p>
        </Link>
        <Link href="/admin/configuracion" className={estilos.tarjeta}>
          <h2>Administración</h2>
          <p>Configuración, auditoría y respaldo del portal.</p>
        </Link>
      </div>
    </>
  )
}
