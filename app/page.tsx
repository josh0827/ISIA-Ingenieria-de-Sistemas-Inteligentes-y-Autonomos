import Link from 'next/link'
import { Boton, Seccion, TituloSeccion, VerTodo } from '@/componentes/Base'
import {
  TarjetaIntegrante,
  TarjetaNovedad,
  TarjetaProyecto,
} from '@/componentes/Tarjetas'
import MarcaIsia from '@/componentes/MarcaIsia'
import { Flecha } from '@/componentes/Iconos'
import {
  listarIntegrantes,
  listarNovedades,
  listarProyectos,
} from '@/lib/contenido'
import { obtenerConfiguracionNavegacion } from '@/lib/configuracion'
import { LINEAS, OBJETIVOS, PRESENTACION, SITIO } from '@/lib/sitio'
import estilos from './pagina.module.css'

export const revalidate = 300

export default async function Inicio() {
  const configuracion = await obtenerConfiguracionNavegacion()
  const [proyectos, novedades, integrantes] = await Promise.all([
    configuracion.proyectos ? listarProyectos(3) : Promise.resolve([]),
    configuracion.novedades ? listarNovedades(3) : Promise.resolve([]),
    configuracion.integrantes ? listarIntegrantes() : Promise.resolve([]),
  ])
  const conexiones = [
    configuracion.practicas && {
      href: '/oportunidades',
      titulo: 'Oportunidades',
      texto: 'Prácticas, convocatorias y retos compartidos por organizaciones.',
    },
    configuracion.proyectos && {
      href: '/prototipado',
      titulo: 'Retos de prototipado',
      texto: 'Si representas a una organización, propón un reto para explorarlo como prototipo.',
    },
    configuracion.proyectos && {
      href: '/ideas',
      titulo: 'Ideas y retos abiertos',
      texto: 'Preguntas por explorar que puedes tomar, discutir o ampliar.',
    },
    (configuracion.integrantes || configuracion.grupos) && {
      href: '/preguntas',
      titulo: 'Preguntas de la comunidad',
      texto: 'Resuelve dudas sobre participación, proyectos y colaboración.',
    },
  ].filter((conexion) => conexion !== false)
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
            <p className={estilos.eyebrow}>Semillero de investigación</p>
            <h1 className={estilos.tituloPortada}>
              <span>{SITIO.nombreLineas[0]}</span>{' '}
              <span className={estilos.tituloAcento}>{SITIO.nombreLineas[1]}</span>
            </h1>
            <p className={estilos.proposito}>
              Un espacio de formación en investigación para explorar cómo los
              sistemas perciben, aprenden e interactúan con su entorno.
            </p>
            <div className={estilos.acciones}>
              {configuracion.proyectos && <Boton href="/proyectos">Ver los proyectos</Boton>}
              <Boton href="/unete" variante="sutil">
                Quiero participar
              </Boton>
            </div>
          </div>
          {/* El logo ocupa el lugar del antiguo esquema y conserva su lenguaje
              visual: cuadrícula, círculos guía y el ciclo percibir, decidir, actuar. */}
          <div className={estilos.escenario} id="logo-portada">
            <svg className={estilos.guias} viewBox="0 0 480 400" fill="none" aria-hidden="true">
              <circle cx="240" cy="200" r="178" strokeWidth=".8" />
              <circle className={estilos.guiaGiro} cx="240" cy="200" r="138" strokeWidth=".8" strokeDasharray="3 8" />
              <path d="M40 200H440M240 10V390" strokeWidth=".6" strokeDasharray="3 6" />
              <circle cx="329" cy="46" r="4" className={estilos.guiaNodo} />
              <circle cx="151" cy="354" r="4" className={estilos.guiaNodo} />
            </svg>
            <MarcaIsia variante="simbolo" alto={150} prioridad className={estilos.logoPortada} />
            <p className={estilos.ciclo} aria-hidden="true">
              Percibir <span>·</span> Decidir <span>·</span> Actuar
            </p>
          </div>
        </div>
      </section>
      <div className={estilos.explorar}>
        <div className="contenedor">
          <span>Explora el semillero</span>
          {configuracion.lineas && (
            <Link href="/lineas">Investigación <Flecha size={15} /></Link>
          )}
          {configuracion.reuniones && (
            <Link href="/reuniones">Encuentros académicos <Flecha size={15} /></Link>
          )}
          {configuracion.publicaciones && (
            <Link href="/publicaciones">Conocimiento y recursos <Flecha size={15} /></Link>
          )}
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
      {configuracion.lineas && <Seccion alterna id="lineas">
        <div className={estilos.cabeceraSeccion}>
          <TituloSeccion
            indice="ÁREAS DE EXPLORACIÓN"
            titulo="Líneas de investigación"
            descripcion="Seis líneas de referencia. Su definición como líneas oficiales está pendiente de validación."
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
      </Seccion>}
      {configuracion.proyectos && <Seccion id="proyectos">
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
      </Seccion>}
      {conexiones.length > 0 && <Seccion alterna id="colabora">
        <TituloSeccion
          indice="NETWORKING"
          titulo="Colabora con el semillero"
          descripcion="Si eres estudiante, egresado u organización, estas son las puertas para conectar con ISIA."
        />
        <div className={estilos.lineas}>
          {conexiones.map((conexion) => (
            <Link href={conexion.href} key={conexion.href} className={estilos.linea}>
              <div>
                <h3>{conexion.titulo}</h3>
                <p>{conexion.texto}</p>
              </div>
              <Flecha size={18} />
            </Link>
          ))}
        </div>
      </Seccion>}
      {configuracion.novedades && <Seccion id="novedades" alterna={conexiones.length === 0}>
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
      </Seccion>}
      {configuracion.integrantes && <Seccion id="integrantes">
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
      </Seccion>}
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
