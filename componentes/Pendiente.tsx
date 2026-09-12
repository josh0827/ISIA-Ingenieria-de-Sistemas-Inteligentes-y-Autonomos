// Marcador de sección en construcción.
//
// Lo pintan las páginas que todavía no ha montado nadie. No es decorativo: le
// dice a quien se encargue de esa sección qué tiene que hacer y con qué piezas,
// y deja claro a cualquiera que entre al sitio que eso está en obras.
//
// Cuando termines tu sección, BORRA el <Pendiente> de tu página.

import { Boton } from './Base'
import estilos from './Pendiente.module.css'

type Props = {
  /** Qué debe acabar mostrando esta página. */
  descripcion: string
  /** Pasos concretos para quien la monte. */
  pasos: string[]
  /** Funciones de lib/contenido.ts que necesitará, si aplica. */
  datos?: string
}

export default function Pendiente({ descripcion, pasos, datos }: Props) {
  return (
    <div className={estilos.caja}>
      <span className={`mono ${estilos.aviso}`}>Sección en construcción</span>
      <p className={estilos.descripcion}>{descripcion}</p>

      <div className={estilos.bloque}>
        <h2 className={`mono ${estilos.tituloBloque}`}>Qué falta</h2>
        <ol className={estilos.pasos}>
          {pasos.map((paso, i) => (
            <li key={paso}>
              <span className={`mono ${estilos.numero}`}>{String(i + 1).padStart(2, '0')}</span>
              <span>{paso}</span>
            </li>
          ))}
        </ol>
      </div>

      {datos && (
        <div className={estilos.bloque}>
          <h2 className={`mono ${estilos.tituloBloque}`}>Datos que ya existen</h2>
          <code className={estilos.codigo}>{datos}</code>
        </div>
      )}

      <p className={estilos.nota}>
        Copia el patrón de <code>app/novedades/page.tsx</code>, que está terminada y hace justo esto. Las
        instrucciones completas están en <code>CONTRIBUTING.md</code>.
      </p>

      <Boton href="/" variante="sutil">
        Volver al inicio
      </Boton>
    </div>
  )
}
