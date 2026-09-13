import Link from 'next/link'
import { Boton, Seccion, TituloSeccion, VerTodo } from '@/componentes/Base'
import {
  TarjetaIntegrante,
  TarjetaNovedad,
  TarjetaProyecto,
} from '@/componentes/Tarjetas'
import Esquema from '@/componentes/Esquema'
import { Flecha } from '@/componentes/Iconos'
import {
  listarIntegrantes,
  listarNovedades,
  listarProyectos,
} from '@/lib/contenido'
import { LINEAS, OBJETIVOS, PRESENTACION, SITIO } from '@/lib/sitio'
import estilos from './pagina.module.css'

export const dynamic = 'force-dynamic'

export default async function Inicio() {
  const [proyectos, novedades, integrantes] = await Promise.all([
    listarProyectos(3),
    listarNovedades(3),
    listarIntegrantes(),
  ])
  const perfilesResumen = integrantes
    .filter(
      (p, i, lista) => lista.findIndex((item) => item.rol === p.rol) === i,
    )
    .slice(0, 3)
  return (
    <>
      <section className={estilos.portada}>
        <div className={`contenedor ${estilos.portadaRejilla}`}>
          <div className={estilos.portadaTexto}>
            <p className={estilos.eyebrow}>
              Universidad Nacional de Colombia · Sede Manizales
            </p>
            <h1>
              <span className={estilos.sigla}>ISIA</span>
              <span className={estilos.nombre}>{SITIO.nombre}</span>
            </h1>
            <p className={estilos.proposito}>
              Un espacio de formación en investigación para explorar cómo los
              sistemas perciben, aprenden e interactúan con su entorno.
            </p>
            <div className={estilos.acciones}>
              <Boton href="/proyectos">Ver los proyectos</Boton>
              <Boton href="/unete" variante="sutil">
                Quiero participar
              </Boton>
            </div>
            <p className={estilos.identificador}>
              Semillero de investigación <span aria-hidden> / </span> Manizales,
              Colombia
            </p>
          </div>
          <figure className={estilos.figura}>
            <div className={estilos.figuraCabecera}>
              <span>SISTEMAS INTELIGENTES Y AUTÓNOMOS</span>
              <span aria-hidden>01 — ISIA</span>
            </div>
            <Esquema />
            <figcaption>
              <span>Del entorno a la acción</span>
              <span>Esquema conceptual · Ilustración</span>
            </figcaption>
          </figure>
        </div>
      </section>
      <div className={estilos.explorar}>
        <div className="contenedor">
          <span>Explora el semillero</span>
          <Link href="/lineas">
            Investigación <Flecha size={15} />
          </Link>
          <Link href="/reuniones">
            Encuentros académicos <Flecha size={15} />
          </Link>
          <Link href="/publicaciones">
            Conocimiento y recursos <Flecha size={15} />
          </Link>
        </div>
      </div>
      <Seccion id="semillero">
        <div className={estilos.presentacion}>
          <div>
            <p className={estilos.eyebrow}>EL SEMILLERO</p>
            <h2>{PRESENTACION.titular}</h2>
            <span className={estilos.nota}>
              Presentación y objetivos ilustrativos
            </span>
          </div>
          <div className={estilos.textoPresentacion}>
            {PRESENTACION.parrafos.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <ol className={estilos.objetivos}>
          {OBJETIVOS.map((o, i) => (
            <li key={o.titulo}>
              <span className={estilos.numero}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3>{o.titulo}</h3>
              <p>{o.texto}</p>
            </li>
          ))}
        </ol>
      </Seccion>
      <Seccion alterna id="lineas">
        <div className={estilos.cabeceraSeccion}>
          <TituloSeccion
            indice="ÁREAS DE EXPLORACIÓN"
            titulo="Líneas de investigación"
            descripcion="Seis líneas de referencia para esta demo. Su definición como líneas oficiales está pendiente de validación."
          />
          <Boton href="/lineas" variante="sutil">
            Explorar las líneas
          </Boton>
        </div>
        <div className={estilos.lineas}>
          {LINEAS.map((linea, i) => (
            <Link
              href={`/lineas#linea-${i + 1}`}
              key={linea.titulo}
              className={estilos.linea}
              data-linea={i + 1}
            >
              <span className={estilos.numero}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3>{linea.titulo}</h3>
                <p>{linea.texto}</p>
              </div>
              <Flecha size={18} />
            </Link>
          ))}
        </div>
      </Seccion>
      <Seccion id="proyectos">
        <div className={estilos.cabeceraSeccion}>
          <TituloSeccion
            indice="INVESTIGACIÓN EN CONTEXTO"
            titulo="Proyectos destacados"
            descripcion="Propuestas ilustrativas para conocer las preguntas y los enfoques que puede reunir el semillero."
          />
          <Boton href="/proyectos" variante="sutil">
            Todos los proyectos
          </Boton>
        </div>
        <div className={estilos.proyectos}>
          {proyectos.map((p) => (
            <TarjetaProyecto key={p.slug} proyecto={p} />
          ))}
        </div>
      </Seccion>
      <Seccion alterna id="novedades">
        <div className={estilos.cabeceraSeccion}>
          <TituloSeccion
            indice="VIDA ACADÉMICA"
            titulo="Novedades recientes"
            descripcion="Notas de ejemplo para explorar esta sección. No constituyen anuncios ni actividades vigentes."
          />
          <Boton href="/novedades" variante="sutil">
            Todas las novedades
          </Boton>
        </div>
        {novedades.map((n) => (
          <TarjetaNovedad key={n.slug} novedad={n} />
        ))}
      </Seccion>
      <Seccion id="integrantes">
        <TituloSeccion
          indice="COMUNIDAD"
          titulo="Personas que hacen posible la investigación"
          descripcion="Vista ilustrativa de los roles del semillero. Los nombres, perfiles y fotografías están pendientes de confirmación."
        />
        <div className={estilos.integrantes}>
          {perfilesResumen.map((p) => (
            <TarjetaIntegrante key={p.slug} integrante={p} />
          ))}
        </div>
        <VerTodo href="/integrantes">Conocer la sección de integrantes</VerTodo>
      </Seccion>
      <section className={estilos.unete}>
        <div className={`contenedor ${estilos.uneteInterior}`}>
          <div>
            <p className={estilos.eyebrow}>PARTICIPACIÓN ESTUDIANTIL</p>
            <h2>
              La investigación empieza
              <br />
              con una pregunta.
            </h2>
            <p>
              Si te interesan los sistemas inteligentes y autónomos, conoce este
              espacio. El procedimiento de vinculación está pendiente de
              confirmación.
            </p>
          </div>
          <Boton href="/unete">Quiero participar</Boton>
        </div>
      </section>
    </>
  )
}
