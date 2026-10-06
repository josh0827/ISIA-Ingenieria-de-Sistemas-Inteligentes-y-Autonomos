import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Boton, EncabezadoPagina, EstadoVacio, Seccion } from '@/componentes/Base'
import { listarGaleria } from '@/lib/contenido'
import { seccionVisible } from '@/lib/configuracion'
import GaleriaFotos from './GaleriaFotos'
import estilos from '../secundarias.module.css'

export const metadata: Metadata = {
  title: 'Galería',
  description: 'Espacio para el registro fotográfico del semillero ISIA. Fotografías reales y pies de foto pendientes de confirmación.',
}

export const revalidate = 300

export default async function PaginaGaleria() {
  if (!(await seccionVisible('galeria'))) notFound()
  const proyectosVisibles = await seccionVisible('proyectos')
  const fotos = await listarGaleria()

  return (
    <Seccion className={estilos.primeraSeccion}>
      <EncabezadoPagina
        indice="Registro visual"
        titulo="Galería"
        descripcion="Un espacio para acercarse a las actividades del semillero a través de fotografías y sus historias."
      />
      {fotos.length > 0 ? <GaleriaFotos fotos={fotos} /> : (
        <>
          <EstadoVacio
            titulo="Registro fotográfico pendiente"
            descripcion="Aún no hay fotografías del semillero publicadas. Aquí se compartirán imágenes autorizadas de proyectos, encuentros y actividades, acompañadas de su contexto."
          >
            {proyectosVisibles && <Boton href="/proyectos" variante="sutil">Conocer los proyectos ilustrativos</Boton>}
          </EstadoVacio>
          <div className={estilos.notaEditorial}>
            <span className={estilos.sobretitulo}>Imágenes con contexto</span>
            <p>Cada fotografía contará con un pie de foto y una descripción accesible. Podrás ampliarla para observarla con más detalle.</p>
          </div>
        </>
      )}
    </Seccion>
  )
}
