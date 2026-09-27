'use client'

import { useState } from 'react'
import { crearClienteNavegador } from '@/lib/supabase/browser'
import estilos from './BotonAcceso.module.css'

export default function BotonGoogle({ siguiente = '/admin' }: { siguiente?: string }) {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string>()

  async function iniciarSesion() {
    setCargando(true)
    setError(undefined)
    try {
      const supabase = crearClienteNavegador()
      const { error: errorOAuth } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(siguiente)}`,
        },
      })
      if (errorOAuth) throw errorOAuth
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'No fue posible iniciar sesión con Google.')
      setCargando(false)
    }
  }

  return (
    <div className={estilos.contenedor}>
      <button type="button" onClick={iniciarSesion} disabled={cargando} className={estilos.boton}>
        {cargando && <span className={estilos.spinner} aria-hidden="true" />}
        {cargando ? 'Conectando…' : 'Iniciar sesión con Google'}
      </button>
      {error && <p role="alert" className={estilos.error}>{error}</p>}
    </div>
  )
}
