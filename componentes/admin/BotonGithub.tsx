'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { inMemoryPersistence, setPersistence, signInWithPopup, signOut } from 'firebase/auth'
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
    const auth = authCliente()
    try {
      await setPersistence(auth, inMemoryPersistence)
      const credencial = await signInWithPopup(auth, proveedorGithub())
      const idToken = await credencial.user.getIdToken()
      const respuesta = await fetch('/api/sesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })
      if (!respuesta.ok) {
        const cuerpo = await respuesta.json().catch(() => ({ error: undefined, motivo: undefined }))
        if (respuesta.status === 403) {
          await signOut(auth).catch(() => undefined)
          const motivo = cuerpo.motivo === 'correo' ? 'correo' : 'editor'
          router.replace(`/admin/acceso-denegado?motivo=${motivo}`)
          return
        }
        throw new Error(cuerpo.error ?? 'No se pudo iniciar sesión.')
      }
      await signOut(auth)
      router.replace('/admin')
      router.refresh()
    } catch (error_) {
      await signOut(auth).catch(() => undefined)
      setError(error_ instanceof Error ? error_.message : 'No se pudo iniciar sesión con GitHub.')
      setCargando(false)
    }
  }

  return (
    <div className={estilos.contenedor}>
      <button type="button" onClick={iniciarSesion} disabled={cargando} className={estilos.boton}>
        {cargando && <span className={estilos.spinner} aria-hidden="true" />}
        {cargando ? 'Conectando…' : 'Iniciar sesión con GitHub'}
      </button>
      {error && <p role="alert" className={estilos.error}>{error}</p>}
    </div>
  )
}
