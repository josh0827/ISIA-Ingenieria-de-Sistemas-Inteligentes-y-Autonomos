import type { Metadata } from 'next'
import {
  AvisoDemo,
  EncabezadoPagina,
  EstadoVacio,
  Seccion,
} from '@/componentes/Base'
import { FiltrosProyectos } from '@/componentes/FiltrosContenido'
import { listarProyectos } from '@/lib/contenido'
import estilos from '../listados.module.css'
export const metadata: Metadata = {
  title: 'Proyectos',
  description:
    'Explora las fichas de proyectos de la demo académica de ISIA. Las propuestas ilustrativas están identificadas y pendientes de validación.',
}
export const dynamic = 'force-dynamic'

export default async function PaginaProyectos() {
  const proyectos = await listarProyectos()
  return (
    <Seccion className={estilos.primeraSeccion}>
      <EncabezadoPagina
        indice="Investigación"
        titulo="Proyectos"
        descripcion="Preguntas, métodos y posibilidades de exploración en sistemas inteligentes y autónomos."
      />
      <AvisoDemo>
        Los proyectos de ejemplo permiten recorrer sus fichas y conocer posibles
        enfoques de investigación. No representan proyectos, resultados ni
        equipos confirmados.
      </AvisoDemo>
      {proyectos.length ? (
        <FiltrosProyectos proyectos={proyectos} />
      ) : (
        <EstadoVacio
          titulo="Proyectos por compartir"
          descripcion="Las fichas estarán disponibles cuando se confirme su información."
        />
      )}
    </Seccion>
  )
}
