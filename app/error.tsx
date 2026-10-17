'use client'

import { useEffect } from 'react'
import { Boton, Seccion } from '@/componentes/Base'
import estilos from './listados.module.css'

export default function ErrorGeneral({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Seccion className={estilos.primeraSeccion}>
      <div style={{ maxWidth: '520px' }}>
        <span className="mono" style={{ color: 'var(--verde)' }}>
          Error
        </span>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: '1rem 0' }}>
          No pudimos cargar esta página
        </h1>
        <p style={{ color: 'var(--texto-tenue)', marginBottom: '2rem' }}>
          Ocurrió un problema inesperado. Puedes intentarlo de nuevo o volver al inicio.
          {error.digest && <> Referencia: <code>{error.digest}</code>.</>}
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button type="button" onClick={reset} className="mono" style={{ cursor: 'pointer', color: 'var(--verde-oscuro)', textDecoration: 'underline', background: 'none', border: 0, font: 'inherit' }}>
            Intentar de nuevo
          </button>
          <Boton href="/">Volver al inicio</Boton>
        </div>
      </div>
    </Seccion>
  )
}
