// Página 404.

import { Boton, Seccion } from '@/componentes/Base'
import estilos from './listados.module.css'

export default function NoEncontrada() {
  return (
    <Seccion className={estilos.primeraSeccion}>
      <div style={{ maxWidth: '520px' }}>
        <span className="mono" style={{ color: 'var(--verde)' }}>
          Error 404
        </span>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: '1rem 0' }}>
          Esta página no existe
        </h1>
        <p style={{ color: 'var(--texto-tenue)', marginBottom: '2rem' }}>
          Puede que el enlace esté mal escrito o que el contenido se haya
          movido.
        </p>
        <Boton href="/">Volver al inicio</Boton>
      </div>
    </Seccion>
  )
}
