import type { Metadata } from 'next'
import { Boton, EncabezadoPagina, Seccion } from '@/componentes/Base'
import { Correo, Pin } from '@/componentes/Iconos'
import { SITIO } from '@/lib/sitio'
import estilos from '../secundarias.module.css'

export const metadata: Metadata = {
  title: 'Únete',
  description: 'Información sobre participación en el semillero ISIA. Procedimiento de vinculación y canal de contacto pendientes de confirmación en esta demo.',
}

export default function PaginaUnete() {
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
            <p>Esta demo presenta sus posibles temas de trabajo y ejemplos de proyectos para que puedas explorar tus intereses. Las líneas y los contenidos ilustrativos están pendientes de validación.</p>
            <div className={estilos.enlacesParticipacion}>
              <Boton href="/lineas" variante="sutil">Explorar líneas de investigación</Boton>
              <Boton href="/proyectos" variante="sutil">Ver los proyectos</Boton>
            </div>
          </div>

          <aside className={estilos.contacto} aria-labelledby="titulo-contacto">
            <Correo size={28} />
            <span className={estilos.sobretitulo}>Información de vinculación</span>
            <h2 id="titulo-contacto">Procedimiento pendiente de confirmar</h2>
            <p>Las fechas, las condiciones de participación y los pasos para vincularse se compartirán cuando el semillero los confirme.</p>
            <div className={estilos.estadoContacto}>{SITIO.contactoPendiente}</div>
            <p className={estilos.nota}>Esta demo no recibe solicitudes ni registra inscripciones.</p>
          </aside>
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
              <p>El procedimiento y el canal de contacto aún están pendientes. No hay una convocatoria confirmada publicada en esta demo.</p>
            </article>
            <article>
              <h3>¿Cuáles son los requisitos?</h3>
              <p>Los perfiles, requisitos y compromisos de participación deben ser definidos y confirmados por el semillero.</p>
            </article>
            <article>
              <h3>¿Dónde y cuándo se reúne ISIA?</h3>
              <p>Los horarios, la modalidad y el espacio de reunión están pendientes de confirmación. Puedes consultar el estado de la agenda en la sección de reuniones.</p>
              <Boton href="/reuniones" variante="sutil">Consultar reuniones</Boton>
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
