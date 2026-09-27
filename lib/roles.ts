export const ROLES_USUARIO = ['admin', 'editor', 'empresa'] as const
export type RolUsuario = (typeof ROLES_USUARIO)[number]

export type UsuarioAutorizado = {
  id: string
  email: string
  rol: RolUsuario
  activo: boolean
  nombreEmpresaOUsuario?: string
}

export function puedeEditarContenido(usuario: UsuarioAutorizado | undefined): usuario is UsuarioAutorizado {
  return Boolean(usuario?.activo && (usuario.rol === 'admin' || usuario.rol === 'editor'))
}

export function puedeGestionarPracticas(usuario: UsuarioAutorizado | undefined): usuario is UsuarioAutorizado {
  return Boolean(usuario?.activo && ROLES_USUARIO.includes(usuario.rol))
}
