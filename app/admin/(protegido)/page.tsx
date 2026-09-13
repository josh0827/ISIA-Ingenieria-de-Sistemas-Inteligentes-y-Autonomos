import type { Metadata } from 'next'
import Link from 'next/link'
import { COLECCIONES } from '@/lib/contenido'
import { ESQUEMAS } from '@/lib/admin/esquemas'
import estilos from '../admin.module.css'

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
        {COLECCIONES.map((coleccion) => {
          const esquema = ESQUEMAS[coleccion]
          return (
            <Link key={coleccion} href={`/admin/${coleccion}`} className={estilos.tarjeta}>
              <h2>{esquema.etiqueta}</h2>
              <p>{esquema.descripcion}</p>
            </Link>
          )
        })}
      </div>
    </>
  )
}
