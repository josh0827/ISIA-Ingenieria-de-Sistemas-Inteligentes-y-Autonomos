import type { Metadata } from 'next'
import { Boton, EncabezadoPagina, EstadoVacio, Seccion } from '@/componentes/Base'
import { listarGaleria } from '@/lib/contenido'
import GaleriaFotos from './GaleriaFotos'
import estilos from '../secundarias.module.css'

export const metadata: Metadata = {
  title: 'Galería',
  description: 'Espacio para el registro fotográfico del semillero ISIA. Fotografías reales y pies de foto pendientes de confirmación en esta demo.',
}

export default function PaginaGaleria() {
  const fotos = listarGaleria()

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
            descripcion="Aún no hay fotografías reales del semillero disponibles para esta demo. Aquí se compartirán imágenes autorizadas de proyectos, encuentros y actividades, acompañadas de su contexto."
          >
            <Boton href="/proyectos" variante="sutil">Conocer los proyectos ilustrativos</Boton>
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
