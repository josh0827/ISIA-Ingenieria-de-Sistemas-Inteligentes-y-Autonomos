import type { Metadata } from 'next'
import BotonGoogle from '@/componentes/admin/BotonGoogle'
import { supabaseServidorListo } from '@/lib/supabase/config'
import estilos from '../../admin.module.css'

export const metadata: Metadata = { title: 'Iniciar sesión' }
export const dynamic = 'force-dynamic'

type Props = { searchParams: Promise<{ error?: string; next?: string }> }

export default async function PaginaIniciarSesion({ searchParams }: Props) {
  const { error, next } = await searchParams
  const siguiente = next && /^\/(?![\\/])/.test(next) ? next : '/admin'

  return (
    <div className={estilos.pantallaSesion}>
      <div className={estilos.tarjetaSesion}>
        <h1>Panel de administración</h1>
        {supabaseServidorListo() ? (
          <>
            <p>
              Inicia sesión con Google. Tu usuario debe estar activo en la lista de
              usuarios autorizados.
            </p>
            {error === 'unauthorized' && (
              <p role="alert" className={estilos.errorSesion}>
                Esta cuenta no está registrada como usuario activo.
              </p>
            )}
            {error === 'oauth' && (
              <p role="alert" className={estilos.errorSesion}>
                No fue posible completar el inicio de sesión con Google.
              </p>
            )}
            <BotonGoogle siguiente={siguiente} />
          </>
        ) : (
          <p>
            Este entorno todavía no tiene configuradas las credenciales de Supabase.
            Revisa el archivo <code>.env.local</code> a partir de{' '}
            <code>.env.local.example</code>.
          </p>
        )}
      </div>
    </div>
  )
}
