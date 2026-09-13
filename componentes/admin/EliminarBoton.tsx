'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { eliminarDocumento } from '@/lib/admin/acciones'
import estilos from './TablaAdmin.module.css'

export default function EliminarBoton({ coleccion, slug, etiqueta }: { coleccion: string; slug: string; etiqueta: string }) {
  const router = useRouter()
  const [pendiente, iniciarTransicion] = useTransition()
  const [error, setError] = useState<string>()

  function confirmarEliminacion() {
    if (!window.confirm(`¿Eliminar "${etiqueta}"? Esta acción no se puede deshacer.`)) return
    setError(undefined)
    iniciarTransicion(async () => {
      try {
        await eliminarDocumento(coleccion, slug)
        router.refresh()
      } catch (error_) {
        setError(error_ instanceof Error ? error_.message : 'No se pudo eliminar el elemento.')
      }
    })
  }

  return (
    <div className={estilos.celdaAcciones}>
      <button type="button" onClick={confirmarEliminacion} disabled={pendiente} className={estilos.botonEliminar}>
        {pendiente ? 'Eliminando…' : 'Eliminar'}
      </button>
      {error && <p role="alert" className={estilos.errorFila}>{error}</p>}
    </div>
  )
}
