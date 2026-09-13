import type { Metadata } from 'next'
import BotonGithub from '@/componentes/admin/BotonGithub'
import { firebaseListo } from '@/lib/firebase/admin'
import estilos from '../../admin.module.css'

export const metadata: Metadata = { title: 'Iniciar sesión' }
export const dynamic = 'force-dynamic'

export default function PaginaIniciarSesion() {
  return (
    <div className={estilos.pantallaSesion}>
      <div className={estilos.tarjetaSesion}>
        <h1>Panel de administración</h1>
        {firebaseListo() ? (
          <>
            <p>Inicia sesión con la cuenta de GitHub autorizada para editar el contenido del sitio.</p>
            <BotonGithub />
          </>
        ) : (
          <p>
            Este entorno todavía no tiene configuradas las credenciales de Firebase.
            Revisa el archivo <code>.env.local</code> a partir de{' '}
            <code>.env.local.example</code>.
          </p>
        )}
      </div>
    </div>
  )
}
