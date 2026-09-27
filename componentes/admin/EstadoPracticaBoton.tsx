'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cambiarEstadoPractica } from '@/lib/admin/practicas-acciones'
import estilos from './TablaAdmin.module.css'

export default function EstadoPracticaBoton({ id, activa }: { id: string; activa: boolean }) {
  const router = useRouter()
  const [pendiente, iniciarTransicion] = useTransition()
  const [error, setError] = useState<string>()
  function cambiarEstado() {
    iniciarTransicion(async () => {
      const resultado = await cambiarEstadoPractica(id, !activa)
      if (!resultado.ok) setError(resultado.error ?? 'No se pudo actualizar la oferta.')
      else router.refresh()
    })
  }
  return <div className={estilos.celdaAcciones}><button type="button" className={estilos.enlaceEditar} disabled={pendiente} onClick={cambiarEstado}>{pendiente ? 'Actualizando…' : activa ? 'Desactivar' : 'Activar'}</button>{error && <p role="alert" className={estilos.errorFila}>{error}</p>}</div>
}
