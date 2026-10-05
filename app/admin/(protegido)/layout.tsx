import { redirect } from 'next/navigation'
import { supabaseServidorListo } from '@/lib/supabase/config'
import { usuarioSesion } from '@/lib/sesion'
import { obtenerUsuarioAutorizado } from '@/lib/usuarios-autorizados'
import PanelAdminShell from '@/componentes/admin/PanelAdminShell'
import estilos from '../admin.module.css'

export const dynamic = 'force-dynamic'

export default async function LayoutProtegido({ children }: { children: React.ReactNode }) {
  if (!supabaseServidorListo()) {
    return (
      <div className={estilos.aviso}>
        <h1>Panel de administración no disponible</h1>
        <p>
          Este entorno todavía no tiene configuradas las credenciales de Supabase.
          Copia <code>.env.local.example</code> a <code>.env.local</code>, complétalo con tu
          proyecto de Supabase y reinicia el servidor.
        </p>
      </div>
    )
  }

  const usuario = await usuarioSesion()
  if (!usuario) redirect('/admin/iniciar-sesion')

  const autorizado = await obtenerUsuarioAutorizado(usuario.id)
  if (!autorizado?.activo) {
    redirect('/admin/acceso-denegado?motivo=editor')
  }

  return (
    <PanelAdminShell
      usuario={usuario.correo ?? usuario.nombre}
      soloPracticas={autorizado.rol === 'empresa'}
      esAdmin={autorizado.rol === 'admin'}
    >
      {children}
    </PanelAdminShell>
  )
}
