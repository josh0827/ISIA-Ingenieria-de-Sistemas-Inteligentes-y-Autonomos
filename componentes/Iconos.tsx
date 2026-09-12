// Iconos del sitio, dibujados a mano en SVG.
//
// En este proyecto NO se usan emojis. Si necesitas un icono nuevo, añádelo
// aquí siguiendo el mismo patrón: trazo de 1.5, sin relleno, hereda el color
// del texto con currentColor y mide 24x24 en el viewBox.

type Props = { size?: number; className?: string }

function base(size: number, className?: string) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  }
}

/** Monograma del grupo: un nodo central con tres enlaces, la idea de sistema
 *  autónomo reducida a su mínima expresión. Sirve de logo mientras el grupo
 *  no tenga uno oficial. */
export function Monograma({ size = 32, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <circle cx="16" cy="16" r="14.25" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      <path d="M16 16 8 8M16 16l8-8M16 16v10" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
      <circle cx="8" cy="8" r="2.5" fill="currentColor" />
      <circle cx="24" cy="8" r="2.5" fill="currentColor" />
      <circle cx="16" cy="26" r="2.5" fill="currentColor" />
      <circle cx="16" cy="16" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function Ojo({ size = 24, className }: Props) {
  return (
    <svg {...base(size, className)}>
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.75" />
    </svg>
  )
}

export function Brujula({ size = 24, className }: Props) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" />
    </svg>
  )
}

export function Antena({ size = 24, className }: Props) {
  return (
    <svg {...base(size, className)}>
      <path d="M5.5 5.5a9 9 0 0 0 0 13M18.5 5.5a9 9 0 0 1 0 13" />
      <path d="M8.7 8.7a4.5 4.5 0 0 0 0 6.6M15.3 8.7a4.5 4.5 0 0 1 0 6.6" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function Red({ size = 24, className }: Props) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="4.5" r="2.25" />
      <circle cx="4.75" cy="17" r="2.25" />
      <circle cx="19.25" cy="17" r="2.25" />
      <path d="M10.4 6.4 6.3 14.9M13.6 6.4l4.1 8.5M7 17h10" />
    </svg>
  )
}

export function Brazo({ size = 24, className }: Props) {
  return (
    <svg {...base(size, className)}>
      <path d="M4 20h6" />
      <path d="M7 20V9.5" />
      <circle cx="7" cy="7.5" r="2" />
      <path d="m8.7 6.3 6.6-2.1" />
      <rect x="15" y="2" width="6" height="5" rx="1.2" />
      <path d="M18 7v4.5a3 3 0 0 1-3 3h-1" />
    </svg>
  )
}

export function Onda({ size = 24, className }: Props) {
  return (
    <svg {...base(size, className)}>
      <path d="M2 12h3l2.5-7 4 14 3-10 2 3h5.5" />
    </svg>
  )
}

export function Calendario({ size = 24, className }: Props) {
  return (
    <svg {...base(size, className)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  )
}

export function Pin({ size = 24, className }: Props) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

export function Reloj({ size = 24, className }: Props) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 1.9" />
    </svg>
  )
}

export function Persona({ size = 24, className }: Props) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" />
    </svg>
  )
}

export function Flecha({ size = 24, className }: Props) {
  return (
    <svg {...base(size, className)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function Correo({ size = 24, className }: Props) {
  return (
    <svg {...base(size, className)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </svg>
  )
}

export function Github({ size = 24, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .6a11.4 11.4 0 0 0-3.6 22.2c.57.1.78-.25.78-.55v-2c-3.17.69-3.84-1.53-3.84-1.53-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.53-.29-5.19-1.27-5.19-5.63 0-1.24.44-2.26 1.17-3.06-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.13 1.17a10.9 10.9 0 0 1 5.7 0c2.17-1.48 3.13-1.17 3.13-1.17.62 1.57.23 2.73.11 3.02.73.8 1.17 1.82 1.17 3.06 0 4.37-2.67 5.33-5.21 5.62.41.35.78 1.05.78 2.12v3.14c0 .3.2.66.79.55A11.4 11.4 0 0 0 12 .6Z" />
    </svg>
  )
}

export function Menu({ size = 24, className }: Props) {
  return (
    <svg {...base(size, className)}>
      <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
    </svg>
  )
}

export function Cerrar({ size = 24, className }: Props) {
  return (
    <svg {...base(size, className)}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}
