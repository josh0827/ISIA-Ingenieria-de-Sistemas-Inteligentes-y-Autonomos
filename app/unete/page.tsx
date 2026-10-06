import type { Metadata } from 'next'
import { Boton, EncabezadoPagina, Seccion } from '@/componentes/Base'
import { Correo, Pin } from '@/componentes/Iconos'
import FormularioParticipacion from '@/componentes/FormularioParticipacion'
import { SITIO } from '@/lib/sitio'
import { obtenerConfiguracionNavegacion } from '@/lib/configuracion'
import estilos from '../secundarias.module.css'

export const metadata: Metadata = {
  title: 'Únete',
  description: 'Conoce los temas de trabajo de ISIA y manifiesta tu interés en participar en el semillero.',
}

export const revalidate = 300

export default async function PaginaUnete() {
  const configuracion = await obtenerConfiguracionNavegacion()
  return (
    <>
      <Seccion className={estilos.primeraSeccion}>
        <EncabezadoPagina
          indice="Participación"
          titulo="Acércate a la investigación"
          descripcion="Si te interesan los sistemas inteligentes y autónomos, este es el espacio para conocer cómo participar en ISIA."
        />
        <div className={estilos.participacion}>
          <div className={estilos.textoParticipacion}>
            <span className={estilos.sobretitulo}>Estudiantes de pregrado</span>
            <h2>Conoce el semillero</h2>
            <p>ISIA es el semillero de investigación en Ingeniería de Sistemas Inteligentes y Autónomos de la Universidad Nacional de Colombia, sede Manizales.</p>
            <p>No exigimos una lista previa de herramientas para acercarte. Nos interesa conocer tu curiosidad técnica, los temas que quieres explorar y tu disposición para aprender mediante proyectos.</p>
            <p>Entre los temas de interés se encuentran Edge AI, TinyML, visión por computador, procesamiento de lenguaje natural, sistemas embebidos y robótica autónoma.</p>
            <div className={estilos.enlacesParticipacion}>
              {configuracion.lineas && <Boton href="/lineas" variante="sutil">Explorar líneas de investigación</Boton>}
              {configuracion.proyectos && <Boton href="/proyectos" variante="sutil">Ver los proyectos</Boton>}
            </div>
          </div>

          <aside className={estilos.contacto} aria-labelledby="titulo-contacto">
            <Correo size={28} />
            <span className={estilos.sobretitulo}>Contacto institucional</span>
            <h2 id="titulo-contacto">Conversemos sobre tus intereses</h2>
            <p>El procedimiento formal de vinculación y las fechas de ingreso siguen pendientes de confirmación. Puedes manifestar tu interés sin que esto constituya una inscripción o admisión.</p>
            <div className={estilos.estadoContacto}><a href={SITIO.correoHref}>{SITIO.correo}</a></div>
          </aside>
        </div>
      </Seccion>
      <Seccion alterna className={estilos.seccionCompacta}>
        <div className={estilos.preguntas}>
          <div>
            <span className={estilos.sobretitulo}>Manifestación de interés</span>
            <h2>Cuéntanos qué quieres explorar</h2>
            <p>El formulario registra tus datos para que el equipo del semillero pueda responder. No completa una inscripción ni garantiza una vinculación.</p>
          </div>
          <FormularioParticipacion />
        </div>
      </Seccion>
      <Seccion alterna className={estilos.seccionCompacta}>
        <div className={estilos.preguntas}>
          <div>
            <span className={estilos.sobretitulo}>Antes de participar</span>
            <h2>Información por confirmar</h2>
          </div>
          <div className={estilos.respuestas}>
            <article>
              <h3>¿Cómo puedo vincularme?</h3>
              <p>Puedes enviar una manifestación de interés o escribir al correo institucional. El procedimiento formal y las fechas todavía deben ser confirmados por el semillero.</p>
            </article>
            <article>
              <h3>¿Cuáles son los requisitos?</h3>
              <p>La sección prioriza la curiosidad y los intereses investigativos. Los compromisos de participación y el proceso de vinculación serán informados por el semillero.</p>
            </article>
            <article>
              <h3>¿Dónde y cuándo se reúne ISIA?</h3>
              <p>Los horarios, la modalidad y el espacio de reunión están pendientes de confirmación. Puedes consultar el estado de la agenda en la sección de reuniones.</p>
              {configuracion.reuniones && <Boton href="/reuniones" variante="sutil">Consultar reuniones</Boton>}
            </article>
          </div>
        </div>
        <div className={estilos.ubicacion}>
          <Pin size={22} />
          <p><strong>Universidad Nacional de Colombia · Sede Manizales</strong><br />Manizales, Colombia. Campus y espacio específico pendientes de confirmar.</p>
        </div>
      </Seccion>
    </>
  )
}
