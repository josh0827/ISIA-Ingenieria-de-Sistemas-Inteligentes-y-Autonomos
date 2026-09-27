import 'server-only'

import { supabaseServidorListo } from '@/lib/supabase/config'
import { crearClienteAdmin } from '@/lib/supabase/server'
import { ROLES_USUARIO, type RolUsuario, type UsuarioAutorizado } from '@/lib/roles'

export { ROLES_USUARIO }
export { puedeEditarContenido, puedeGestionarPracticas } from '@/lib/roles'
export type { RolUsuario, UsuarioAutorizado }

export async function obtenerUsuarioAutorizado(id: string): Promise<UsuarioAutorizado | undefined> {
  if (!supabaseServidorListo()) return undefined
  const { data, error } = await crearClienteAdmin()
    .from('usuarios_autorizados')
    .select('id, email, rol, activo, nombre_empresa_o_usuario')
    .eq('id', id)
    .maybeSingle()

  if (error || !data || !ROLES_USUARIO.includes(data.rol as RolUsuario)) return undefined
  return {
    id: data.id,
    email: data.email,
    rol: data.rol as RolUsuario,
    activo: data.activo === true,
    nombreEmpresaOUsuario: data.nombre_empresa_o_usuario || undefined,
  }
}
