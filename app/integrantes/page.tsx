import type { Metadata } from 'next'
import { AvisoDemo, Boton, EncabezadoPagina, EstadoVacio, Seccion } from '@/componentes/Base'
import { TarjetaIntegrante } from '@/componentes/Tarjetas'
import { listarIntegrantes, type Integrante } from '@/lib/contenido'
import estilos from '../secundarias.module.css'

export const metadata: Metadata = {
  title: 'Integrantes',
  description: 'Directorio de integrantes del semillero ISIA en modo demo. Identidades, roles y perfiles pendientes de confirmación.',
}

const ROLES: { valor: Integrante['rol']; titulo: string; descripcion: string }[] = [
  { valor: 'director', titulo: 'Coordinación académica', descripcion: 'Información de la persona responsable pendiente de confirmar.' },
  { valor: 'investigador', titulo: 'Docentes e investigadores', descripcion: 'Perfiles de acompañamiento e investigación pendientes de confirmar.' },
  { valor: 'estudiante', titulo: 'Estudiantes', descripcion: 'Directorio estudiantil pendiente de confirmar.' },
  { valor: 'egresado', titulo: 'Egresados', descripcion: 'Información de egresados vinculados pendiente de confirmar.' },
]

export default function PaginaIntegrantes() {
  const integrantes = listarIntegrantes()

  return (
    <>
      <Seccion className={estilos.primeraSeccion}>
        <EncabezadoPagina
          indice="Comunidad"
          titulo="Integrantes"
          descripcion="El espacio para conocer a las personas que dan forma al semillero y sus intereses de investigación."
        />
        <AvisoDemo>
          Los perfiles de esta demo son ilustrativos y no representan personas reales. El directorio, los roles y las fotografías están pendientes de confirmación.
        </AvisoDemo>
        {integrantes.length === 0 ? (
          <EstadoVacio titulo="Directorio pendiente de confirmación" descripcion="Los perfiles se compartirán cuando se disponga de información y fotografías autorizadas." />
        ) : (
          <div className={estilos.grupos}>
            {ROLES.map((rol) => {
              const personas = integrantes.filter((integrante) => integrante.rol === rol.valor)
              if (personas.length === 0) return null
              return (
                <section key={rol.valor} aria-labelledby={`rol-${rol.valor}`} className={estilos.grupo}>
                  <div className={estilos.cabeceraGrupo}>
                    <h2 id={`rol-${rol.valor}`}>{rol.titulo}</h2>
                    {personas.every((persona) => persona.ilustrativo) && <p>{rol.descripcion}</p>}
                  </div>
                  <div className={estilos.rejillaIntegrantes}>
                    {personas.map((integrante) => <TarjetaIntegrante key={integrante.slug} integrante={integrante} />)}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </Seccion>
      <Seccion alterna className={estilos.seccionCompacta}>
        <div className={estilos.cierre}>
          <div>
            <span className={estilos.sobretitulo}>Participación estudiantil</span>
            <h2>¿Te interesa el semillero?</h2>
            <p>Consulta la información disponible sobre participación y los datos que aún están por confirmar.</p>
          </div>
          <Boton href="/unete">Quiero participar</Boton>
        </div>
      </Seccion>
    </>
  )
}
