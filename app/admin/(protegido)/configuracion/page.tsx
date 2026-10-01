import type { Metadata } from 'next'
import FormularioConfiguracion from '@/componentes/admin/FormularioConfiguracion'
import {
  obtenerConfiguracionNavegacion,
  obtenerVisibilidadContenidoIlustrativo,
} from '@/lib/configuracion'
import estilos from '../../admin.module.css'

export const metadata: Metadata = { title: 'Configuración' }
export const dynamic = 'force-dynamic'

export default async function PaginaConfiguracion() {
  const [configuracion, mostrarContenidoIlustrativo] = await Promise.all([
    obtenerConfiguracionNavegacion(),
    obtenerVisibilidadContenidoIlustrativo(),
  ])
  return (
    <>
      <div className={estilos.cabeceraPagina}>
        <div>
          <h1>Configuración del sitio</h1>
          <p>Controla la disponibilidad de las secciones y del contenido ilustrativo.</p>
        </div>
      </div>
      <FormularioConfiguracion
        configuracion={configuracion}
        mostrarContenidoIlustrativo={mostrarContenidoIlustrativo}
      />
    </>
  )
}
