import 'server-only'
import { cookies } from 'next/headers'
import { authAdmin, firebaseListo } from './firebase/admin'

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
  const cookieSesion = await authAdmin().createSessionCookie(idToken, { expiresIn: DURACION_MS })
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
    const decodificado = await authAdmin().verifySessionCookie(cookieSesion, true)
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
