// Genera versiones recortadas y ligeras de los logos de ISIA a partir de los
// originales de public/imagenes/logos (que no se modifican).
// Uso: node scripts/optimizar-logos.mjs
import sharp from 'sharp'

const BASE = 'public/imagenes/logos'
const VARIANTES = [
  { entrada: 'isia-simbolo.png', salida: 'isia-simbolo-recortado.webp', recorte: { left: 71, top: 265, width: 2248, height: 587 }, ancho: 1200 },
  { entrada: 'isia-con-texto.png', salida: 'isia-con-texto-recortado.webp', recorte: { left: 8, top: 284, width: 1432, height: 646 }, ancho: 1000 },
]

for (const { entrada, salida, recorte, ancho } of VARIANTES) {
  const info = await sharp(`${BASE}/${entrada}`)
    .extract(recorte)
    .resize({ width: ancho })
    .webp({ quality: 88, alphaQuality: 100, effort: 6 })
    .toFile(`${BASE}/${salida}`)
  console.log(`${salida}: ${info.width}x${info.height}, ${info.size} bytes`)
}
