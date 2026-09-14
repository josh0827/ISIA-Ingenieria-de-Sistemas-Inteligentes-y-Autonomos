import { NextResponse } from 'next/server'
import { crearCookieSesion, cerrarSesion } from '@/lib/sesion'
import { firebaseListo } from '@/lib/firebase/admin'

export async function POST(request: Request) {
  if (!firebaseListo()) {
    return NextResponse.json({ error: 'Firebase no está configurado en este entorno.' }, { status: 503 })
  }
  const { idToken } = await request.json().catch(() => ({ idToken: undefined }))
  if (typeof idToken !== 'string' || !idToken) {
    return NextResponse.json({ error: 'Falta el token de autenticación.' }, { status: 400 })
  }
  try {
    await crearCookieSesion(idToken)
  } catch {
    return NextResponse.json({ error: 'No se pudo validar la sesión con Firebase.' }, { status: 401 })
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  await cerrarSesion()
  return NextResponse.json({ ok: true })
}
