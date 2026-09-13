'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithPopup } from 'firebase/auth'
import { authCliente, firebaseListoCliente, proveedorGithub } from '@/lib/firebase/client'
import estilos from './BotonGithub.module.css'

export default function BotonGithub() {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()

  if (!firebaseListoCliente()) {
    return (
      <p className={estilos.aviso}>
        Falta configurar las variables públicas de Firebase (NEXT_PUBLIC_FIREBASE_*) en este entorno.
      </p>
    )
  }

  async function iniciarSesion() {
    setCargando(true)
    setError(undefined)
    try {
      const credencial = await signInWithPopup(authCliente(), proveedorGithub())
      const idToken = await credencial.user.getIdToken()
      const respuesta = await fetch('/api/sesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })
      if (!respuesta.ok) {
        const cuerpo = await respuesta.json().catch(() => ({}))
        throw new Error(cuerpo.error ?? 'No se pudo iniciar sesión.')
      }
      router.replace('/admin')
      router.refresh()
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'No se pudo iniciar sesión con GitHub.')
      setCargando(false)
    }
  }

  return (
    <div className={estilos.contenedor}>
      <button type="button" onClick={iniciarSesion} disabled={cargando} className={estilos.boton}>
        {cargando ? 'Conectando…' : 'Iniciar sesión con GitHub'}
      </button>
      {error && <p role="alert" className={estilos.error}>{error}</p>}
    </div>
  )
}
