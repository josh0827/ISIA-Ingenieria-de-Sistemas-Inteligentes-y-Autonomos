'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import estilos from './Transicion.module.css'

/** Difumina la entrada del contenido principal en cada cambio de ruta. */
export default function Transicion({ children }: { children: ReactNode }) {
  const ruta = usePathname()
  return (
    <div key={ruta} className={estilos.difuminado}>
      {children}
    </div>
  )
}
