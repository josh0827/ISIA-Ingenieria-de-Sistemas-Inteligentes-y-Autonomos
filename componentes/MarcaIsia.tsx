import Image from 'next/image'
import { MARCA_ISIA, type VarianteMarcaIsia } from '@/lib/marca'
import estilos from './MarcaIsia.module.css'

type Props = {
  variante?: VarianteMarcaIsia
  alto?: number
  decorativa?: boolean
  prioridad?: boolean
  className?: string
}

export default function MarcaIsia({
  variante = 'simbolo',
  alto = 56,
  decorativa = false,
  prioridad = false,
  className,
}: Props) {
  const recurso = MARCA_ISIA[variante]
  const ancho = Math.round(alto * recurso.recorte.ancho / recurso.recorte.alto)

  return (
    <span
      className={`${estilos.marco} ${className ?? ''}`}
      style={{
        ['--alto-marca' as string]: `${alto}px`,
        ['--ancho-marca' as string]: `${ancho}px`,
        ['--proporcion-marca' as string]: `${recurso.recorte.ancho} / ${recurso.recorte.alto}`,
        ['--imagen-ancho' as string]: `${recurso.anchoFuente / recurso.recorte.ancho * 100}%`,
        ['--imagen-alto' as string]: `${recurso.altoFuente / recurso.recorte.alto * 100}%`,
        ['--imagen-x' as string]: `${-recurso.recorte.x / recurso.recorte.ancho * 100}%`,
        ['--imagen-y' as string]: `${-recurso.recorte.y / recurso.recorte.alto * 100}%`,
      }}
    >
      <Image
        src={recurso.src}
        alt={decorativa ? '' : recurso.alt}
        width={recurso.anchoFuente}
        height={recurso.altoFuente}
        priority={prioridad}
        loading={prioridad ? 'eager' : 'lazy'}
        sizes={`(max-width: 540px) 75vw, ${ancho}px`}
        className={estilos.imagen}
      />
    </span>
  )
}
