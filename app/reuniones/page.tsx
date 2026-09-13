import type { Metadata } from 'next'
import { Boton, EncabezadoPagina, EstadoVacio, Etiqueta, Fecha, Seccion } from '@/componentes/Base'
import { hoyColombia, listarReuniones, markdownAHtml, type Reunion } from '@/lib/contenido'
import estilos from '../secundarias.module.css'

export const metadata: Metadata = {
  title: 'Reuniones',
  description: 'Consulta el estado de la agenda del semillero ISIA y un archivo de sesiones ilustrativas. Demo sin reuniones ficticias anunciadas como actividades reales.',
}

type ReunionConHtml = Reunion & { html: string }

function FichaReunion({ reunion }: { reunion: ReunionConHtml }) {
  return (
    <details className={estilos.reunion}>
      <summary className={estilos.resumenReunion}>
        <span className={estilos.fechaReunion}>
          {reunion.ilustrativo && <span className={estilos.nota}>Fecha de ejemplo</span>}
          <Fecha iso={reunion.fecha} corta />
        </span>
        <span className={estilos.textoReunion}>
          <strong className={estilos.tituloReunion}>{reunion.titulo}</strong>
          {reunion.resumen && <span className={estilos.resumenBreve}>{reunion.resumen}</span>}
          <span className={estilos.abrirReunion}>Consultar detalles{reunion.ilustrativo ? ' del ejemplo' : ''}</span>
        </span>
      </summary>
      <div className={estilos.contenidoReunion}>
        <dl className={estilos.datosReunion}>
          <div>
            <dt>{reunion.ilustrativo ? 'Fecha ilustrativa' : 'Fecha'}</dt>
            <dd><Fecha iso={reunion.fecha} /></dd>
          </div>
          <div>
            <dt>{reunion.ilustrativo ? 'Hora ilustrativa' : 'Hora (Colombia)'}</dt>
            <dd>{reunion.hora || 'Pendiente de confirmar'}</dd>
          </div>
          <div>
            <dt>{reunion.ilustrativo ? 'Modalidad ilustrativa' : 'Modalidad'}</dt>
            <dd><Etiqueta valor={reunion.modalidad} /></dd>
          </div>
          <div>
            <dt>{reunion.ilustrativo ? 'Lugar del ejemplo' : 'Lugar'}</dt>
            <dd>{reunion.lugar || 'Pendiente de confirmar'}</dd>
          </div>
          {!reunion.ilustrativo && reunion.ponente && <div><dt>Ponente</dt><dd>{reunion.ponente}</dd></div>}
        </dl>
        {reunion.html && <div className="prosa" dangerouslySetInnerHTML={{ __html: reunion.html }} />}
        {!reunion.ilustrativo && reunion.enlace && <Boton href={reunion.enlace} variante="sutil">Consultar enlace de la sesión</Boton>}
      </div>
    </details>
  )
}

export default async function PaginaReuniones() {
  const reuniones = await Promise.all(listarReuniones().map(async (reunion) => ({
    ...reunion,
    html: await markdownAHtml(reunion.cuerpo),
  })))
  const hoy = hoyColombia()
  const agenda = reuniones.filter((reunion) => !reunion.ilustrativo && reunion.fecha >= hoy)
  const historial = reuniones.filter((reunion) => !reunion.ilustrativo && reunion.fecha < hoy).reverse()
  const ejemplos = reuniones.filter((reunion) => reunion.ilustrativo).reverse()

  return (
    <Seccion className={estilos.primeraSeccion}>
      <EncabezadoPagina
        indice="Vida académica"
        titulo="Reuniones"
        descripcion="Consulta la agenda y el registro de encuentros del semillero."
      />
      <section className={estilos.bloqueAgenda} aria-labelledby="agenda">
        <div className={estilos.cabeceraAgenda}>
          <h2 id="agenda">Agenda</h2>
          <p>Hora local de Colombia · UTC−5</p>
        </div>
        {agenda.length > 0 ? agenda.map((reunion) => <FichaReunion key={reunion.slug} reunion={reunion} />) : (
          <EstadoVacio
            titulo="No hay próximas reuniones confirmadas"
            descripcion="Las fechas, los horarios, la modalidad y el lugar se compartirán cuando el semillero confirme su agenda."
          >
            <Boton href="/unete" variante="sutil">Información para participar</Boton>
          </EstadoVacio>
        )}
      </section>
      <section className={estilos.archivo} aria-labelledby="historial">
        <div className={estilos.cabeceraAgenda}><h2 id="historial">Historial de reuniones</h2></div>
        {historial.length > 0 ? historial.map((reunion) => <FichaReunion key={reunion.slug} reunion={reunion} />) : (
          <p className={estilos.introduccionArchivo}>Aún no hay un historial de encuentros confirmados disponible en esta demo.</p>
        )}
      </section>
      {ejemplos.length > 0 && (
        <section className={estilos.archivo} aria-labelledby="archivo-ilustrativo">
          <span className={estilos.sobretitulo}>Contenido de demostración</span>
          <div className={estilos.cabeceraAgenda}><h2 id="archivo-ilustrativo">Archivo ilustrativo</h2></div>
          <p className={estilos.introduccionArchivo}>Estas fichas muestran cómo se podrá consultar una sesión. Los temas, las fechas y los demás datos son ejemplos; no documentan reuniones realizadas ni anuncian actividades programadas.</p>
          {ejemplos.map((reunion) => <FichaReunion key={reunion.slug} reunion={reunion} />)}
        </section>
      )}
    </Seccion>
  )
}
