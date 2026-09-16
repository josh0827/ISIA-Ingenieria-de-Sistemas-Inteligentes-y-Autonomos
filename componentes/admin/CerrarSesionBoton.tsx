'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import estilos from './BotonGithub.module.css'

export default function CerrarSesionBoton() {
  const router = useRouter()
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string>()

  async function cerrar() {
    setCargando(true)
    setError(undefined)
    try {
      const respuesta = await fetch('/api/sesion/cerrar', { method: 'POST' })
      if (!respuesta.ok) throw new Error('No se pudo cerrar la sesión.')
      router.replace('/admin/iniciar-sesion')
      router.refresh()
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'No se pudo cerrar la sesión.')
      setCargando(false)
    }
  }

  return (
    <div className={estilos.contenedor}>
      <button type="button" onClick={cerrar} disabled={cargando} className={estilos.boton}>
        {cargando ? 'Saliendo…' : 'Cerrar sesión'}
      </button>
      {error && <p role="alert" className={estilos.error}>{error}</p>}
    </div>
  )
}
