import 'server-only'

import { supabaseServidorListo } from '@/lib/supabase/config'
import { crearClienteAdmin } from '@/lib/supabase/server'
import { ROLES_USUARIO, type RolUsuario, type UsuarioAutorizado } from '@/lib/roles'

export { ROLES_USUARIO }
export { puedeEditarContenido, puedeGestionarPracticas } from '@/lib/roles'
export type { RolUsuario, UsuarioAutorizado }

type IdentidadAutenticada = {
  id: string
  email?: string | null
}

type FilaUsuarioAutorizado = {
  id: string | null
  email: string
  rol: string
  activo: boolean
  nombre_empresa_o_usuario: string | null
}

function convertirUsuario(
  fila: FilaUsuarioAutorizado | null,
  idEsperado?: string,
): UsuarioAutorizado | undefined {
  if (!fila || !ROLES_USUARIO.includes(fila.rol as RolUsuario)) return undefined
  const id = fila.id ?? idEsperado
  if (!id) return undefined

  return {
    id,
    email: fila.email,
    rol: fila.rol as RolUsuario,
    activo: fila.activo === true,
    nombreEmpresaOUsuario: fila.nombre_empresa_o_usuario || undefined,
  }
}

export async function obtenerUsuarioAutorizado(id: string): Promise<UsuarioAutorizado | undefined> {
  if (!supabaseServidorListo()) return undefined
  const { data, error } = await crearClienteAdmin()
    .from('usuarios_autorizados')
    .select('id, email, rol, activo, nombre_empresa_o_usuario')
    .eq('id', id)
    .maybeSingle()

  if (error) return undefined
  return convertirUsuario(data)
}

/**
 * Resuelve el acceso por UID y, como respaldo, por correo normalizado. El
 * cliente administrativo se usa solo en servidor y evita ampliar las
 * políticas RLS para revelar la lista de usuarios autorizados.
 */
export async function resolverUsuarioAutorizado(
  identidad: IdentidadAutenticada,
): Promise<{ usuario?: UsuarioAutorizado; vinculadoPorCorreo: boolean; error?: string }> {
  if (!supabaseServidorListo()) {
    return { vinculadoPorCorreo: false, error: 'supabase_no_configurado' }
  }

  const admin = crearClienteAdmin()
  const seleccion = 'id, email, rol, activo, nombre_empresa_o_usuario'
  const { data: porId, error: errorId } = await admin
    .from('usuarios_autorizados')
    .select(seleccion)
    .eq('id', identidad.id)
    .maybeSingle<FilaUsuarioAutorizado>()

  if (errorId) {
    return { vinculadoPorCorreo: false, error: `consulta_id:${errorId.code}` }
  }

  const usuarioPorId = convertirUsuario(porId)
  if (usuarioPorId) return { usuario: usuarioPorId, vinculadoPorCorreo: false }

  const email = identidad.email?.trim().toLocaleLowerCase('en-US')
  if (!email) return { vinculadoPorCorreo: false }

  const { data: candidatos, error: errorEmail } = await admin
    .from('usuarios_autorizados')
    .select(seleccion)
    .ilike('email', email)
    .limit(2)
    .returns<FilaUsuarioAutorizado[]>()

  if (errorEmail) {
    return { vinculadoPorCorreo: false, error: `consulta_email:${errorEmail.code}` }
  }

  const coincidencias = (candidatos ?? []).filter(
    (fila) => fila.email.trim().toLocaleLowerCase('en-US') === email,
  )
  if (coincidencias.length !== 1) {
    return {
      vinculadoPorCorreo: false,
      error: coincidencias.length > 1 ? 'email_duplicado' : undefined,
    }
  }

  const candidato = coincidencias[0]
  const { data: vinculado, error: errorVinculacion } = await admin
    .from('usuarios_autorizados')
    .update({ id: identidad.id, email })
    .eq('email', candidato.email)
    .select(seleccion)
    .single<FilaUsuarioAutorizado>()

  if (errorVinculacion) {
    return { vinculadoPorCorreo: false, error: `vinculacion:${errorVinculacion.code}` }
  }

  return {
    usuario: convertirUsuario(vinculado, identidad.id),
    vinculadoPorCorreo: true,
  }
}
