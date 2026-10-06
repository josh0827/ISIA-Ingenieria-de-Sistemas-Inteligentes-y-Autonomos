import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  AvisoDemo,
  EncabezadoPagina,
  EstadoVacio,
  Seccion,
} from '@/componentes/Base'
import { FiltrosProyectos } from '@/componentes/FiltrosContenido'
import { listarProyectos } from '@/lib/contenido'
import { seccionVisible } from '@/lib/configuracion'
import estilos from '../listados.module.css'
export const metadata: Metadata = {
  title: 'Proyectos',
  description:
    'Explora las fichas de proyectos del semillero ISIA. Las propuestas ilustrativas están identificadas y pendientes de validación.',
}
export const revalidate = 300

export default async function PaginaProyectos() {
  if (!(await seccionVisible('proyectos'))) notFound()
  const proyectos = await listarProyectos()
  return (
    <Seccion className={estilos.primeraSeccion}>
      <EncabezadoPagina
        indice="Investigación"
        titulo="Proyectos"
        descripcion="Preguntas, métodos y posibilidades de exploración en sistemas inteligentes y autónomos."
      />
      {proyectos.some((proyecto) => proyecto.ilustrativo) && <AvisoDemo>
        Los proyectos de ejemplo permiten recorrer sus fichas y conocer posibles
        enfoques de investigación. No representan proyectos, resultados ni
        equipos confirmados.
      </AvisoDemo>}
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
