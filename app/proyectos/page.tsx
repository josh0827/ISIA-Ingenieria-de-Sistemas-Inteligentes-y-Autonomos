// SECCIÓN: Proyectos (listado)
//
// Segunda página modelo. Igual que novedades pero con la tarjeta de proyecto.
// Para añadir un proyecto se crea un .md en contenido/proyectos/.

import type { Metadata } from 'next'
import { Seccion, TituloSeccion } from '@/componentes/Base'
import Revelar from '@/componentes/Revelar'
import { TarjetaProyecto } from '@/componentes/Tarjetas'
import { listarProyectos } from '@/lib/contenido'
import estilos from '../listados.module.css'

export const metadata: Metadata = {
  title: 'Proyectos',
  description: 'Proyectos de investigación en curso y completados del grupo ISIA.',
}

export default function PaginaProyectos() {
  const proyectos = listarProyectos()

  return (
    <Seccion className={estilos.primeraSeccion}>
      <TituloSeccion
        indice="Proyectos"
        titulo="En qué estamos trabajando"
        descripcion="Los proyectos activos aparecen primero. Cada ficha recoge el estado, la línea a la que pertenece y quiénes lo llevan."
      />

      {proyectos.length === 0 ? (
        <p className={estilos.vacio}>Todavía no hay proyectos publicados.</p>
      ) : (
        <div className={estilos.rejillaAncha}>
          {proyectos.map((proyecto, i) => (
            <Revelar key={proyecto.slug} retardo={i * 70}>
              <TarjetaProyecto proyecto={proyecto} />
            </Revelar>
          ))}
        </div>
      )}
    </Seccion>
  )
}
