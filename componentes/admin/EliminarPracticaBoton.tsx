'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { eliminarPractica } from '@/lib/admin/practicas-acciones'
import estilos from './TablaAdmin.module.css'

export default function EliminarPracticaBoton({ id, titulo }: { id: string; titulo: string }) {
  const router = useRouter()
  const [pendiente, iniciarTransicion] = useTransition()
  const [error, setError] = useState<string>()

  function eliminar() {
    if (!window.confirm(`¿Eliminar definitivamente la práctica “${titulo}”?`)) return
    setError(undefined)
    iniciarTransicion(async () => {
      const resultado = await eliminarPractica(id)
      if (!resultado.ok) setError(resultado.error ?? 'No se pudo eliminar la práctica.')
      else router.refresh()
    })
  }

  return (
    <div className={estilos.accionConError}>
      <button
        type="button"
        onClick={eliminar}
        disabled={pendiente}
        className={estilos.botonEliminar}
      >
        {pendiente ? 'Eliminando…' : 'Eliminar'}
      </button>
      {error && <p role="alert" className={estilos.errorFila}>{error}</p>}
    </div>
  )
}
