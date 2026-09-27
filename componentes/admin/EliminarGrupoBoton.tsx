'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { eliminarGrupo } from '@/lib/admin/grupos-acciones'
import estilos from './TablaAdmin.module.css'

export default function EliminarGrupoBoton({ slug, nombre }: { slug: string; nombre: string }) {
  const router = useRouter()
  const [pendiente, iniciarTransicion] = useTransition()
  const [error, setError] = useState<string>()

  function eliminar() {
    if (!window.confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return
    iniciarTransicion(async () => {
      const resultado = await eliminarGrupo(slug)
      if (!resultado.ok) setError(resultado.error ?? 'No se pudo eliminar el grupo.')
      else router.refresh()
    })
  }

  return (
    <div className={estilos.celdaAcciones}>
      <button type="button" onClick={eliminar} disabled={pendiente} className={estilos.botonEliminar}>
        {pendiente ? 'Eliminando…' : 'Eliminar'}
      </button>
      {error && <p role="alert" className={estilos.errorFila}>{error}</p>}
    </div>
  )
}
