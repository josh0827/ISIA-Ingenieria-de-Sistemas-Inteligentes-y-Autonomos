'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import estilos from './BotonGithub.module.css'

export default function CerrarSesionBoton() {
  const router = useRouter()
  const [cargando, setCargando] = useState(false)

  async function cerrar() {
    setCargando(true)
    await fetch('/api/sesion', { method: 'DELETE' })
    router.replace('/admin/iniciar-sesion')
    router.refresh()
  }

  return (
    <button type="button" onClick={cerrar} disabled={cargando} className={estilos.boton}>
      {cargando ? 'Saliendo…' : 'Cerrar sesión'}
    </button>
  )
}
