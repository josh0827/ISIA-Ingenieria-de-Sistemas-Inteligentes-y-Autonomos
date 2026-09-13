// Escudo de la Universidad Nacional de Colombia.
//
// El archivo vive en public/imagenes/escudo-unal.svg y se carga como imagen
// externa, no incrustado en el HTML: son 65 KB de trazados y estaría en la
// navegación y el pie de TODAS las páginas. Como archivo aparte, el navegador
// lo descarga una vez y lo reutiliza en todo el sitio.
//
// Se usa <img> y no next/image a propósito: next/image bloquea los SVG salvo
// que se active dangerouslyAllowSVG, que abre la puerta a que un SVG con
// scripts se ejecute. Para un archivo local y fijo como este, <img> es más
// simple y más seguro.

import estilos from './Escudo.module.css'

type Props = {
  /** Alto en píxeles. El ancho sale solo de la proporción del escudo. */
  alto?: number
  /** Fondo claro detrás del escudo. Necesario sobre fondos oscuros: el cóndor
   *  es negro y sin el fondo se pierde. */
  placa?: boolean
  className?: string
}

// Proporción real del archivo (viewBox 590 x 757).
const RATIO = 590 / 757

export default function Escudo({ alto = 34, placa = false, className }: Props) {
  const ancho = Math.round(alto * RATIO)

  return (
    <span
      className={`${estilos.marco} ${placa ? estilos.placa : ''} ${className ?? ''}`}
      style={{ ['--alto-escudo' as string]: `${alto}px` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/imagenes/escudo-unal.svg"
        alt="Escudo de la Universidad Nacional de Colombia"
        width={ancho}
        height={alto}
        className={estilos.escudo}
      />
    </span>
  )
}
