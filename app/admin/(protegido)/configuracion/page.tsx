import type { Metadata } from 'next'
import FormularioConfiguracion from '@/componentes/admin/FormularioConfiguracion'
import { obtenerConfiguracionNavegacion } from '@/lib/configuracion'
import estilos from '../../admin.module.css'

export const metadata: Metadata = { title: 'Configuración' }
export const dynamic = 'force-dynamic'

export default async function PaginaConfiguracion() {
  const configuracion = await obtenerConfiguracionNavegacion()
  return (
    <>
      <div className={estilos.cabeceraPagina}>
        <div>
          <h1>Configuración del sitio</h1>
          <p>Controla qué secciones aparecen en los menús público y móvil.</p>
        </div>
      </div>
      <FormularioConfiguracion configuracion={configuracion} />
    </>
  )
}
