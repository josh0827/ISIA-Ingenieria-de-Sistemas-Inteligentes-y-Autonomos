import 'server-only'
import { cookies } from 'next/headers'
import { authAdmin, firebaseListo } from './firebase/admin'
import { ErrorAcceso, exigirCorreoUnal } from './autorizacion'
import { esEditor } from './editores'

const COOKIE_SESION = 'isia_sesion'
const DURACION_MS = 1000 * 60 * 60 * 24 * 5 // 5 días

export type UsuarioSesion = {
  uid: string
  nombre: string
  correo?: string
  foto?: string
}

/** Cambia el ID token del cliente por una cookie de sesión httpOnly firmada por Firebase. */
export async function crearCookieSesion(idToken: string): Promise<void> {
  const auth = await authAdmin()
  const token = await auth.verifyIdToken(idToken, true)
  exigirCorreoUnal(token.email)

  // Firebase recomienda aceptar únicamente tokens procedentes de un inicio de
  // sesión reciente al emitir cookies de larga duración.
  const antiguedadSegundos = Math.floor(Date.now() / 1000) - token.auth_time
  if (!Number.isFinite(antiguedadSegundos) || antiguedadSegundos < 0 || antiguedadSegundos > 5 * 60) {
    throw new ErrorAcceso('Debes iniciar sesión nuevamente para acceder al panel.', 401, 'sesion')
  }
  if (!(await esEditor(token.uid))) {
    throw new ErrorAcceso(
      'Tu cuenta institucional no está autorizada para editar contenido.',
      403,
      'editor',
    )
  }

  const cookieSesion = await auth.createSessionCookie(idToken, { expiresIn: DURACION_MS })
  const almacen = await cookies()
  almacen.set(COOKIE_SESION, cookieSesion, {
    maxAge: DURACION_MS / 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

export async function cerrarSesion(): Promise<void> {
  const almacen = await cookies()
  almacen.delete(COOKIE_SESION)
}

/** Devuelve el usuario autenticado o undefined si no hay sesión válida. No lanza si Firebase no está listo. */
export async function usuarioSesion(): Promise<UsuarioSesion | undefined> {
  if (!firebaseListo()) return undefined
  const almacen = await cookies()
  const cookieSesion = almacen.get(COOKIE_SESION)?.value
  if (!cookieSesion) return undefined
  try {
    const decodificado = await (await authAdmin()).verifySessionCookie(cookieSesion, true)
    return {
      uid: decodificado.uid,
      nombre: typeof decodificado.name === 'string' ? decodificado.name : decodificado.uid,
      correo: typeof decodificado.email === 'string' ? decodificado.email : undefined,
      foto: typeof decodificado.picture === 'string' ? decodificado.picture : undefined,
    }
  } catch {
    return undefined
  }
}
