'use client'

import { useState, type FormEvent } from 'react'
import { crearClienteNavegador } from '@/lib/supabase/browser'
import { confirmarAcceso } from '@/lib/admin/acceso-acciones'
import estilos from './BotonAcceso.module.css'

export default function FormularioAcceso({ siguiente = '/admin' }: { siguiente?: string }) {
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string>()

  async function iniciarSesion(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const datos = new FormData(evento.currentTarget)
    const correo = String(datos.get('correo') ?? '').trim()
    const contrasena = String(datos.get('contrasena') ?? '')
    if (!correo || !contrasena) {
      setError('Escribe tu correo y tu contraseña.')
      return
    }

    setEnviando(true)
    setError(undefined)
    try {
      // La contraseña va del navegador a Supabase Auth; nunca pasa por el servidor del sitio.
      const { error: errorAcceso } = await crearClienteNavegador().auth.signInWithPassword({
        email: correo,
        password: contrasena,
      })
      if (errorAcceso) {
        setError(errorAcceso.status === 429
          ? 'Demasiados intentos. Espera unos minutos antes de volver a probar.'
          : 'Correo o contraseña incorrectos.')
        setEnviando(false)
        return
      }
      const resultado = await confirmarAcceso(siguiente)
      if (!resultado.ok || !resultado.destino) {
        setError(resultado.error ?? 'No se pudo abrir la sesión.')
        setEnviando(false)
        return
      }
      // Navegación completa para que el middleware lea la sesión recién creada.
      window.location.assign(resultado.destino)
    } catch {
      setError('No se pudo conectar con el servicio de acceso. Intenta de nuevo.')
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={iniciarSesion} className={estilos.formulario} noValidate>
      <div className={estilos.campo}>
        <label htmlFor="acceso-correo">Correo</label>
        <input id="acceso-correo" name="correo" type="email" autoComplete="username" required />
      </div>
      <div className={estilos.campo}>
        <label htmlFor="acceso-contrasena">Contraseña</label>
        <input id="acceso-contrasena" name="contrasena" type="password" autoComplete="current-password" required />
      </div>
      {error && <p role="alert" className={estilos.error}>{error}</p>}
      <button type="submit" disabled={enviando} className={estilos.boton}>
        {enviando && <span className={estilos.spinner} aria-hidden="true" />}
        {enviando ? 'Entrando…' : 'Entrar al panel'}
      </button>
    </form>
  )
}
