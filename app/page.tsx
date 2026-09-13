// PÁGINA PRINCIPAL
//
// Ocho bloques en este orden:
//   1. Portada: escudo institucional y nombre del grupo, en asimétrico
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
import Escudo from '@/componentes/Escudo'
import Revelar from '@/componentes/Revelar'
import { TarjetaIntegrante, TarjetaNovedad, TarjetaProyecto } from '@/componentes/Tarjetas'
import { Antena, Brazo, Brujula, Ojo, Onda, Persona, Pin, Red, Reloj } from '@/componentes/Iconos'
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
      {/* Composición asimétrica: el escudo a un lado y el texto al otro. Sin
          fondo animado ni degradados: el peso lo lleva el aire. */}
      <section className={estilos.portada}>
        <div className={`contenedor ${estilos.portadaRejilla}`}>
          <div className={estilos.portadaEscudo}>
            <Escudo alto={250} />
          </div>

          <div className={estilos.portadaTexto}>
            {/* El titular va en dos tonos: la parte generica en gris y la que
                identifica al grupo en negro. Un nombre tan largo en un solo
                tono se lee como un parrafo, no como un titulo. */}
            <h1 className={estilos.titulo}>
              <span className={estilos.tituloTenue}>{SITIO.nombreLineas[0]}</span>
              <span className={estilos.tituloFuerte}>{SITIO.nombreLineas[1]}</span>
            </h1>

            <p className={estilos.proposito}>{SITIO.descripcion}</p>

            <div className={estilos.portadaAcciones}>
              <Boton href="/proyectos">Ver los proyectos</Boton>
              <Boton href="/unete" variante="sutil">
                Únete al grupo
              </Boton>
            </div>
          </div>
        </div>

        {/* Cifras del grupo. Sin cajas: solo números separados por una línea. */}
        <div className={`contenedor ${estilos.cifrasCaja}`}>
          <dl className={estilos.cifras}>
            {CIFRAS.map((cifra) => (
              <div key={cifra.etiqueta} className={estilos.cifra}>
                <dd className={estilos.cifraValor}>{cifra.valor}</dd>
                <dt className={estilos.cifraEtiqueta}>{cifra.etiqueta}</dt>
              </div>
            ))}
          </dl>
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
                <span className={estilos.reunionDia}>{partesFecha(reunion.fecha).dia}</span>
                <span className={estilos.reunionMes}>
                  {partesFecha(reunion.fecha).nombreMes} {partesFecha(reunion.fecha).anio}
                </span>
              </div>

              <div className={estilos.reunionCuerpo}>
                <div className={estilos.reunionEtiquetas}>
                  <span className={`mono ${estilos.reunionAviso}`}>Próxima reunión</span>
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
          <Revelar>
            <h2 className={estilos.sobreTitular}>{PRESENTACION.titular}</h2>
          </Revelar>

          <Revelar retardo={80}>
            <div className={estilos.sobreTexto}>
              {PRESENTACION.parrafos.map((parrafo) => (
                <p key={parrafo.slice(0, 24)} className={estilos.sobreParrafo}>
                  {parrafo}
                </p>
              ))}
            </div>
          </Revelar>
        </div>

        {/* Los objetivos van en lista separada por líneas, no en tarjetas.
            Cuatro cajas seguidas pesan mucho más de lo que aportan. */}
        <ol className={estilos.objetivos}>
          {OBJETIVOS.map((objetivo, i) => (
            <Revelar key={objetivo.titulo} retardo={i * 70}>
              <li className={estilos.objetivo}>
                <span className={`mono ${estilos.objetivoNumero}`}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={estilos.objetivoTitulo}>{objetivo.titulo}</h3>
                <p className={estilos.objetivoTexto}>{objetivo.texto}</p>
              </li>
            </Revelar>
          ))}
        </ol>
      </Seccion>

      {/* ------------------------------------------------ 4. LÍNEAS ------- */}
      <Seccion alterna id="lineas">
        <TituloSeccion
          titulo="Líneas de investigación"
          descripcion="Seis frentes de trabajo que se cruzan constantemente. Casi todos nuestros proyectos viven en la frontera entre dos de ellos."
        />

        <div className={estilos.lineas}>
          {LINEAS.map((linea, i) => {
            const Icono = ICONOS[linea.icono] ?? Red
            return (
              <Revelar key={linea.titulo} retardo={i * 60}>
                <article className={estilos.linea}>
                  <span className={estilos.lineaIcono}>
                    <Icono size={21} />
                  </span>
                  <div>
                    <h3 className={estilos.lineaTitulo}>{linea.titulo}</h3>
                    <p className={estilos.lineaTexto}>{linea.texto}</p>
                  </div>
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
            titulo="Proyectos destacados"
            descripcion="Lo que hay montado ahora mismo sobre la mesa del laboratorio."
          />

          <div className={estilos.proyectos}>
            {proyectos.map((proyecto, i) => (
              <Revelar key={proyecto.slug} retardo={i * 80}>
                <TarjetaProyecto proyecto={proyecto} />
              </Revelar>
            ))}
          </div>

          <VerTodo href="/proyectos">Ver todos los proyectos</VerTodo>
        </Seccion>
      )}

      {/* -------------------------------------------- 6. NOVEDADES -------- */}
      {/* En lista y no en tarjetas: una novedad es una línea de titular con su
          fecha, y así se leen las tres de un vistazo. */}
      {novedades.length > 0 && (
        <Seccion alterna id="novedades">
          <TituloSeccion
            titulo="Novedades"
            descripcion="Convocatorias, resultados y todo lo que pasa dentro del grupo."
          />

          <div className={estilos.novedades}>
            {novedades.map((novedad, i) => (
              <Revelar key={novedad.slug} retardo={i * 70}>
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
            titulo="Quiénes somos"
            descripcion="Docentes y estudiantes de distintos semestres trabajando en el mismo laboratorio."
          />

          <div className={estilos.integrantes}>
            {integrantes.slice(0, 8).map((integrante, i) => (
              <Revelar key={integrante.slug} retardo={i * 50}>
                <TarjetaIntegrante integrante={integrante} />
              </Revelar>
            ))}
          </div>

          <VerTodo href="/integrantes">Conocer a todo el equipo</VerTodo>
        </Seccion>
      )}

      {/* ------------------------------------------------ 8. ÚNETE -------- */}
      <section className={estilos.unete}>
        <div className="contenedor">
          <Revelar>
            <div className={estilos.uneteCaja}>
              <span className={estilos.uneteAviso}>Convocatoria abierta</span>
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
