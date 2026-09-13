import type { ReactNode } from 'react'

/** Compatibilidad con contenido previo: siempre visible, sin efectos de scroll. */
export default function Revelar({
  children,
  className,
}: {
  children: ReactNode
  retardo?: number
  className?: string
}) {
  return className ? (
    <div className={className}>{children}</div>
  ) : (
    <>{children}</>
  )
}
