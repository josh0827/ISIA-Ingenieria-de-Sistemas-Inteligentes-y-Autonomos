import type { Metadata } from 'next'
import Link from 'next/link'
import { AvisoDemo, Boton, EncabezadoPagina, Seccion } from '@/componentes/Base'
import { Antena, Brazo, Brujula, Flecha, Ojo, Onda, Red } from '@/componentes/Iconos'
import { listarProyectos } from '@/lib/contenido'
import { LINEAS } from '@/lib/sitio'
import estilos from '../secundarias.module.css'

export const metadata: Metadata = {
  title: 'Líneas de investigación',
  description: 'Explora las seis líneas de referencia de la demo del semillero ISIA. Contenido provisional pendiente de validación.',
}

const ICONOS = { ojo: Ojo, brujula: Brujula, antena: Antena, red: Red, brazo: Brazo, onda: Onda }

export const dynamic = 'force-dynamic'

export default async function PaginaLineas() {
  const proyectos = await listarProyectos()

  return (
    <>
      <Seccion className={estilos.primeraSeccion}>
        <EncabezadoPagina
          indice="Investigación"
          titulo="Líneas de investigación"
          descripcion="Una mirada a los sistemas que perciben su entorno, procesan información y actúan sobre el mundo físico."
        />
        <AvisoDemo>
          Estas seis líneas son una referencia ilustrativa para la demo. Su denominación y alcance están pendientes de validación por el semillero.
        </AvisoDemo>
        <div className={estilos.lineas}>
          {LINEAS.map((linea, indice) => {
            const Icono = ICONOS[linea.icono as keyof typeof ICONOS] ?? Red
            const relacionados = proyectos.filter((proyecto) => proyecto.linea === linea.titulo)

            return (
              <article className={estilos.linea} key={linea.titulo} id={`linea-${indice + 1}`}>
                <div className={estilos.numeroLinea} aria-hidden="true">
                  <span>{String(indice + 1).padStart(2, '0')}</span>
                  <Icono size={28} />
                </div>
                <div>
                  <h2 className={estilos.tituloLinea}>{linea.titulo}</h2>
                  <p className={estilos.descripcionLinea}>{linea.texto}</p>
                </div>
                <div className={estilos.relacionados}>
                  <h3>Proyectos relacionados</h3>
                  {relacionados.length > 0 ? (
                    <ul>
                      {relacionados.map((proyecto) => (
                        <li key={proyecto.slug}>
                          <Link href={`/proyectos/${proyecto.slug}`} className={estilos.enlaceRelacionado}>
                            <span>{proyecto.titulo}</span>
                            <Flecha size={17} />
                          </Link>
                          {proyecto.ilustrativo && <span className={estilos.nota}>Proyecto ilustrativo</span>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={estilos.nota}>Sin proyectos publicados en esta línea por el momento.</p>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </Seccion>
      <Seccion alterna className={estilos.seccionCompacta}>
        <div className={estilos.cierre}>
          <div>
            <span className={estilos.sobretitulo}>Explorar ISIA</span>
            <h2>De las preguntas a los proyectos</h2>
            <p>Conoce ejemplos de cómo estos temas pueden convertirse en preguntas de investigación.</p>
          </div>
          <Boton href="/proyectos">Ver los proyectos</Boton>
        </div>
      </Seccion>
    </>
  )
}
