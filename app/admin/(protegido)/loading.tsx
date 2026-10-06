import estilos from '../admin.module.css'

export default function CargandoAdmin() {
  return (
    <div className={estilos.cargandoPanel} role="status" aria-live="polite">
      <span className={estilos.indicadorCarga} aria-hidden="true" />
      <span>Cargando contenido del panel...</span>
    </div>
  )
}
