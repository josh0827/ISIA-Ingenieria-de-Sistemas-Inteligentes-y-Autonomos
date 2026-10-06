import type { Metadata } from 'next'
import BotonGoogle from '@/componentes/admin/BotonGoogle'
import FormularioAcceso from '@/componentes/admin/FormularioAcceso'
import { supabaseServidorListo } from '@/lib/supabase/config'
import { googleHabilitado } from '@/lib/supabase/proveedores'
import estilos from '../../admin.module.css'
import estilosAcceso from '@/componentes/admin/BotonAcceso.module.css'

export const metadata: Metadata = { title: 'Iniciar sesión' }
export const dynamic = 'force-dynamic'

type Props = { searchParams: Promise<{ error?: string; next?: string }> }

export default async function PaginaIniciarSesion({ searchParams }: Props) {
  const { error, next } = await searchParams
  const siguiente = next && /^\/(?![\\/])/.test(next) ? next : '/admin'
  const conGoogle = supabaseServidorListo() && (await googleHabilitado())

  return (
    <div className={estilos.pantallaSesion}>
      <div className={estilos.tarjetaSesion}>
        <h1>Panel de administración</h1>
        {supabaseServidorListo() ? (
          <>
            <p>
              Entra con el correo y la contraseña de tu cuenta. Solo pueden acceder
              los usuarios autorizados del semillero.
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
            {(error === 'missing_code' || error === 'session_error') && (
              <p role="alert" className={estilos.errorSesion}>
                Google no pudo completar la sesión. Intenta iniciar sesión nuevamente.
              </p>
            )}
            <FormularioAcceso siguiente={siguiente} />
            {conGoogle && (
              <>
                <span className={estilosAcceso.separador}>o</span>
                <BotonGoogle siguiente={siguiente} />
              </>
            )}
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
