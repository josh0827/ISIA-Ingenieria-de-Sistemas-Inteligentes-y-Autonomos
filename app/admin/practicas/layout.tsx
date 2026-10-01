import { redirect } from 'next/navigation'
import PanelAdminShell from '@/componentes/admin/PanelAdminShell'
import { supabaseServidorListo } from '@/lib/supabase/config'
import { usuarioSesion } from '@/lib/sesion'
import { obtenerUsuarioAutorizado, puedeGestionarPracticas } from '@/lib/usuarios-autorizados'
import estilos from '../admin.module.css'

export const dynamic = 'force-dynamic'

export default async function LayoutPracticasAdmin({ children }: { children: React.ReactNode }) {
  if (!supabaseServidorListo()) return <div className={estilos.aviso}><h1>Panel no disponible</h1><p>Faltan credenciales de Supabase en este entorno.</p></div>
  const usuario = await usuarioSesion()
  if (!usuario) redirect('/admin/iniciar-sesion?next=/admin/practicas')
  const autorizado = await obtenerUsuarioAutorizado(usuario.id)
  if (!puedeGestionarPracticas(autorizado)) redirect('/admin/acceso-denegado?motivo=editor')
  return (
    <PanelAdminShell
      usuario={usuario.correo ?? usuario.nombre}
      soloPracticas={autorizado.rol === 'empresa'}
    >
      {children}
    </PanelAdminShell>
  )
}
