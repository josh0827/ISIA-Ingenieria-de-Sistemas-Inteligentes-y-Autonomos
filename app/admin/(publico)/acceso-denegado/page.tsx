import type { Metadata } from 'next'
import Link from 'next/link'
import CerrarSesionBoton from '@/componentes/admin/CerrarSesionBoton'
import estilos from '../../admin.module.css'

export const metadata: Metadata = { title: 'Acceso restringido' }
export const dynamic = 'force-dynamic'

type Props = { searchParams: Promise<{ motivo?: string }> }

export default async function AccesoDenegado({ searchParams }: Props) {
  const motivo = (await searchParams).motivo
  const correoInvalido = motivo === 'correo'

  return (
    <main className={estilos.pantallaSesion}>
      <section className={`${estilos.tarjetaSesion} ${estilos.tarjetaDenegada}`} aria-labelledby="titulo-acceso">
        <span className={estilos.codigoError}>403</span>
        <h1 id="titulo-acceso">Acceso restringido</h1>
        <p>
          {correoInvalido
            ? 'Se requiere un correo institucional @unal.edu.co asociado a la cuenta de GitHub.'
            : 'Tu cuenta institucional no está activa en la lista de editores del sitio.'}
        </p>
        <div className={estilos.accionesAcceso}>
          <Link href="/" className={estilos.botonInicio}>Volver al inicio</Link>
          <CerrarSesionBoton />
        </div>
      </section>
    </main>
  )
}
