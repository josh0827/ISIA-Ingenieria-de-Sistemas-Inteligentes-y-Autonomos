// PÁGINA PRINCIPAL
//
// Nueve bloques en este orden:
//   1. Portada con la red de nodos y las cifras del grupo
//   2. Próxima reunión (sale sola de contenido/reuniones)
//   3. Qué es ISIA y objetivos
//   4. Líneas de investigación
//   5. Proyectos destacados
//   6. Novedades recientes
//   7. Integrantes
//   8. Invitación a unirse
//
// Los bloques 2, 5, 6 y 7 se alimentan de los .md de /contenido: no hay que
// tocar este archivo para actualizarlos, basta con añadir o editar un archivo
// en esa carpeta.

import Link from 'next/link'
import type { ReactNode } from 'react'
import { Boton, Etiqueta, Seccion, TituloSeccion, VerTodo, partesFecha } from '@/componentes/Base'
import RedNodos from '@/componentes/RedNodos'
import Revelar from '@/componentes/Revelar'
import { TarjetaIntegrante, TarjetaNovedad, TarjetaProyecto } from '@/componentes/Tarjetas'
import { Antena, Brazo, Brujula, Calendario, Ojo, Onda, Persona, Pin, Red, Reloj } from '@/componentes/Iconos'
import { listarIntegrantes, listarNovedades, listarProyectos, proximaReunion } from '@/lib/contenido'
import { CIFRAS, LINEAS, OBJETIVOS, PRESENTACION, SITIO } from '@/lib/sitio'
import estilos from './pagina.module.css'

// Enlaza el campo "icono" de LINEAS (lib/sitio.ts) con el SVG que le toca.
const ICONOS: Record<string, (p: { size?: number; className?: string }) => ReactNode> = {
  ojo: Ojo,
  brujula: Brujula,
  antena: Antena,
  red: Red,
  brazo: Brazo,
  onda: Onda,
}

export default function Inicio() {
  const reunion = proximaReunion()
  const proyectos = listarProyectos(3)
  const novedades = listarNovedades(3)
  const integrantes = listarIntegrantes()

  return (
    <>
      {/* ------------------------------------------------ 1. PORTADA ------ */}
      <section className={estilos.portada}>
        <RedNodos />

        <div className={`contenedor ${estilos.portadaContenido}`}>
          <h1 className={estilos.sigla}>
            {SITIO.sigla.split('').map((letra, i) => (
              <span key={i} className={estilos.letra} style={{ animationDelay: `${i * 90}ms` }}>
                {letra}
              </span>
            ))}
          </h1>

          <p className={estilos.nombreCompleto}>{SITIO.nombre}</p>
          <p className={estilos.proposito}>{SITIO.descripcion}</p>

          <div className={estilos.portadaAcciones}>
            <Boton href="/proyectos">Ver los proyectos</Boton>
            <Boton href="/unete" variante="sutil">
              Únete al grupo
            </Boton>
          </div>

          <dl className={estilos.cifras}>
            {CIFRAS.map((cifra) => (
              <div key={cifra.etiqueta} className={estilos.cifra}>
                <dt className={`mono ${estilos.cifraEtiqueta}`}>{cifra.etiqueta}</dt>
                <dd className={estilos.cifraValor}>{cifra.valor}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={estilos.universidad}>
          <span className="mono">
            {SITIO.universidad} · {SITIO.sede}
          </span>
        </div>
      </section>

      {/* --------------------------------------- 2. PRÓXIMA REUNIÓN ------ */}
      {/* Si no hay ninguna reunión futura en contenido/reuniones, este bloque
          entero desaparece en vez de mostrar un hueco vacío. */}
      {reunion && (
        <Seccion alterna className={estilos.seccionReunion}>
          <Revelar>
            <article className={estilos.reunion}>
              <div className={estilos.reunionFecha}>
                <span className={`mono ${estilos.reunionMes}`}>{partesFecha(reunion.fecha).mesCorto}</span>
                <span className={estilos.reunionDia}>{partesFecha(reunion.fecha).dia}</span>
                <span className={`mono ${estilos.reunionAnio}`}>{partesFecha(reunion.fecha).anio}</span>
              </div>

              <div className={estilos.reunionCuerpo}>
                <div className={estilos.reunionEtiquetas}>
                  <span className={`mono ${estilos.reunionAviso}`}>
                    <Calendario size={14} />
                    Próxima reunión
                  </span>
                  <Etiqueta valor={reunion.modalidad} />
                </div>

                <h2 className={estilos.reunionTitulo}>{reunion.titulo}</h2>
                {reunion.resumen && <p className={estilos.reunionResumen}>{reunion.resumen}</p>}

                <ul className={estilos.reunionDatos}>
                  {reunion.hora && (
                    <li>
                      <Reloj size={16} />
                      {reunion.hora}
                    </li>
                  )}
                  {reunion.lugar && (
                    <li>
                      <Pin size={16} />
                      {reunion.lugar}
                    </li>
                  )}
                  {reunion.ponente && (
                    <li>
                      <Persona size={16} />
                      {reunion.ponente}
                    </li>
                  )}
                </ul>
              </div>

              <div className={estilos.reunionAccion}>
                <Boton href="/reuniones" variante="sutil">
                  Ver la agenda
                </Boton>
              </div>
            </article>
          </Revelar>
        </Seccion>
      )}

      {/* ----------------------------------- 3. QUÉ ES ISIA Y OBJETIVOS --- */}
      <Seccion id="sobre-el-grupo">
        <div className={estilos.sobre}>
          <Revelar className={estilos.sobreTexto}>
            <span className={`mono ${estilos.indice}`}>
              <span className={estilos.raya} aria-hidden />
              01 · El grupo
            </span>
            <h2 className={estilos.sobreTitular}>{PRESENTACION.titular}</h2>
            {PRESENTACION.parrafos.map((parrafo) => (
              <p key={parrafo.slice(0, 24)} className={estilos.sobreParrafo}>
                {parrafo}
              </p>
            ))}
          </Revelar>

          <ol className={estilos.objetivos}>
            {OBJETIVOS.map((objetivo, i) => (
              <Revelar key={objetivo.titulo} retardo={i * 80}>
                <li className={estilos.objetivo}>
                  <span className={`mono ${estilos.objetivoNumero}`}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className={estilos.objetivoTitulo}>{objetivo.titulo}</h3>
                    <p className={estilos.objetivoTexto}>{objetivo.texto}</p>
                  </div>
                </li>
              </Revelar>
            ))}
          </ol>
        </div>
      </Seccion>

      {/* ------------------------------------------------ 4. LÍNEAS ------- */}
      <Seccion alterna reticula id="lineas">
        <TituloSeccion
          indice="02"
          titulo="Líneas de investigación"
          descripcion="Seis frentes de trabajo que se cruzan constantemente. Casi todos nuestros proyectos viven en la frontera entre dos de ellos."
          centrado
        />

        <div className={estilos.lineas}>
          {LINEAS.map((linea, i) => {
            const Icono = ICONOS[linea.icono] ?? Red
            return (
              <Revelar key={linea.titulo} retardo={i * 70}>
                <article className={estilos.linea}>
                  <span className={estilos.lineaIcono}>
                    <Icono size={22} />
                  </span>
                  <h3 className={estilos.lineaTitulo}>{linea.titulo}</h3>
                  <p className={estilos.lineaTexto}>{linea.texto}</p>
                </article>
              </Revelar>
            )
          })}
        </div>

        <VerTodo href="/lineas">Conocer las líneas a fondo</VerTodo>
      </Seccion>

      {/* -------------------------------------------- 5. PROYECTOS -------- */}
      {proyectos.length > 0 && (
        <Seccion id="proyectos">
          <TituloSeccion
            indice="03"
            titulo="Proyectos destacados"
            descripcion="Lo que hay montado ahora mismo sobre la mesa del laboratorio."
          />

          <div className={estilos.proyectos}>
            {proyectos.map((proyecto, i) => (
              <Revelar key={proyecto.slug} retardo={i * 90}>
                <TarjetaProyecto proyecto={proyecto} />
              </Revelar>
            ))}
          </div>

          <VerTodo href="/proyectos">Ver todos los proyectos</VerTodo>
        </Seccion>
      )}

      {/* -------------------------------------------- 6. NOVEDADES -------- */}
      {novedades.length > 0 && (
        <Seccion alterna id="novedades">
          <TituloSeccion
            indice="04"
            titulo="Novedades"
            descripcion="Convocatorias, resultados y todo lo que pasa dentro del grupo."
          />

          <div className={estilos.novedades}>
            {novedades.map((novedad, i) => (
              <Revelar key={novedad.slug} retardo={i * 90}>
                <TarjetaNovedad novedad={novedad} />
              </Revelar>
            ))}
          </div>

          <VerTodo href="/novedades">Ver todas las novedades</VerTodo>
        </Seccion>
      )}

      {/* ------------------------------------------ 7. INTEGRANTES -------- */}
      {integrantes.length > 0 && (
        <Seccion id="integrantes">
          <TituloSeccion
            indice="05"
            titulo="Quiénes somos"
            descripcion="Docentes y estudiantes de distintos semestres trabajando en el mismo laboratorio."
          />

          <div className={estilos.integrantes}>
            {integrantes.slice(0, 8).map((integrante, i) => (
              <Revelar key={integrante.slug} retardo={i * 60}>
                <TarjetaIntegrante integrante={integrante} />
              </Revelar>
            ))}
          </div>

          <VerTodo href="/integrantes">Conocer a todo el equipo</VerTodo>
        </Seccion>
      )}

      {/* ------------------------------------------------ 8. ÚNETE -------- */}
      <section className={`${estilos.unete} reticula`}>
        <div className="contenedor">
          <Revelar>
            <div className={estilos.uneteCaja}>
              <span className={`mono ${estilos.uneteAviso}`}>Convocatoria abierta</span>
              <h2 className={estilos.uneteTitulo}>¿Te interesa investigar con nosotros?</h2>
              <p className={estilos.uneteTexto}>
                Buscamos estudiantes con ganas de montar cosas y de sostenerlas hasta que funcionen. No hace
                falta experiencia previa en investigación, hace falta constancia y curiosidad.
              </p>
              <div className={estilos.uneteAcciones}>
                <Boton href="/unete">Quiero participar</Boton>
                <Link href={`mailto:${SITIO.correo}`} className={estilos.uneteCorreo}>
                  {SITIO.correo}
                </Link>
              </div>
            </div>
          </Revelar>
        </div>
      </section>
    </>
  )
}
