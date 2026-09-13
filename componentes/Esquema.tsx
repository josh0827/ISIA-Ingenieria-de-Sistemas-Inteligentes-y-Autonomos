import estilos from './Esquema.module.css'

/** Ilustración conceptual propia, estática. No representa un equipo del semillero. */
export default function Esquema({ compacto = false }: { compacto?: boolean }) {
  return (
    <div
      className={compacto ? estilos.compacto : estilos.esquema}
      aria-hidden="true"
    >
      <svg viewBox="0 0 480 380" fill="none">
        <defs>
          <pattern
            id={compacto ? 'cuadricula-mini' : 'cuadricula'}
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path d="M24 0H0V24" stroke="currentColor" strokeWidth=".6" />
          </pattern>
        </defs>
        <rect
          width="480"
          height="380"
          fill={`url(#${compacto ? 'cuadricula-mini' : 'cuadricula'})`}
          className={estilos.reticula}
        />
        <g stroke="currentColor">
          <circle cx="240" cy="190" r="133" strokeWidth=".8" />
          <circle
            cx="240"
            cy="190"
            r="97"
            strokeWidth=".7"
            strokeDasharray="3 7"
          />
          <path
            d="M72 190H408M240 30V350"
            strokeWidth=".7"
            strokeDasharray="3 5"
          />
          <path d="M240 60L352 256H128L240 60Z" strokeWidth="1.5" />
          <path
            d="M240 190V60M240 190L352 256M240 190L128 256"
            strokeWidth="1.5"
          />
          <circle
            cx="240"
            cy="190"
            r="45"
            className={estilos.centro}
            strokeWidth="1.5"
          />
          <circle cx="240" cy="190" r="35" strokeWidth=".6" />
          <circle cx="240" cy="60" r="10" className={estilos.nodo} />
          <circle cx="352" cy="256" r="10" className={estilos.nodo} />
          <circle cx="128" cy="256" r="10" className={estilos.nodo} />
          <path d="M218 190H232L238 178L246 202L252 190H263" strokeWidth="2" />
          <circle cx="107" cy="190" r="3" fill="currentColor" />
          <circle cx="373" cy="190" r="3" fill="currentColor" />
        </g>
        <g
          fill="currentColor"
          fontSize="11"
          fontWeight="550"
          letterSpacing="1.2"
        >
          <text x="240" y="26" textAnchor="middle">
            PERCIBIR
          </text>
          <text x="377" y="283" textAnchor="middle">
            DECIDIR
          </text>
          <text x="101" y="283" textAnchor="middle">
            ACTUAR
          </text>
        </g>
        <g fill="currentColor" fontSize="9" letterSpacing=".4">
          <text x="240" y="355" textAnchor="middle">
            ENTORNO · INFORMACIÓN · RESPUESTA
          </text>
        </g>
      </svg>
    </div>
  )
}
