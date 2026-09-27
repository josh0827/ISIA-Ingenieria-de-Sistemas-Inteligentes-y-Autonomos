import type { Metadata } from 'next'
import Link from 'next/link'
import CerrarSesionBoton from '@/componentes/admin/CerrarSesionBoton'
import estilos from '../../admin.module.css'

export const metadata: Metadata = { title: 'Acceso restringido' }
export const dynamic = 'force-dynamic'

export default function AccesoDenegado() {
  return (
    <main className={estilos.pantallaSesion}>
      <section className={`${estilos.tarjetaSesion} ${estilos.tarjetaDenegada}`} aria-labelledby="titulo-acceso">
        <span className={estilos.codigoError}>403</span>
        <h1 id="titulo-acceso">Acceso restringido</h1>
        <p>Tu cuenta de Google no está activa en la lista de editores del sitio.</p>
        <div className={estilos.accionesAcceso}>
          <Link href="/" className={estilos.botonInicio}>Volver al inicio</Link>
          <CerrarSesionBoton />
        </div>
      </section>
    </main>
  )
}
