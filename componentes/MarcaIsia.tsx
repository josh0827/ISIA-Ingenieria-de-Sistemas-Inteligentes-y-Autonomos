import { MARCA_ISIA, type VarianteMarcaIsia } from '@/lib/marca'
import estilos from './MarcaIsia.module.css'

type Props = {
  variante?: VarianteMarcaIsia
  alto?: number
  decorativa?: boolean
  className?: string
}

export default function MarcaIsia({
  variante = 'simbolo',
  alto = 56,
  decorativa = false,
  className,
}: Props) {
  const recurso = MARCA_ISIA[variante]
  const ancho = Math.round(alto * recurso.proporcionVisible)

  return (
    <span
      className={`${estilos.marco} ${className ?? ''}`}
      style={{
        ['--alto-marca' as string]: `${alto}px`,
        ['--ancho-marca' as string]: `${ancho}px`,
      }}
    >
      {/* El JPG original se sirve como archivo reutilizable y el contenedor
          recorta únicamente sus márgenes blancos exteriores. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={recurso.src}
        alt={decorativa ? '' : recurso.alt}
        width={recurso.anchoFuente}
        height={recurso.altoFuente}
        loading={variante === 'completa' ? 'lazy' : 'eager'}
        decoding="async"
        className={estilos.imagen}
      />
    </span>
  )
}
