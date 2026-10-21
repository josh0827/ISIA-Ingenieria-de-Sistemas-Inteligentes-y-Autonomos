# Logos de ISIA

- `isia-simbolo.png` y `isia-con-texto.png`: originales, sin modificar.
- `isia-simbolo-recortado.webp` y `isia-con-texto-recortado.webp`: versiones sin márgenes transparentes y ligeras (unos 100 KB). Son las que usa el sitio.

Las rutas y dimensiones están centralizadas en `lib/marca.ts`. Para sustituir los logos, reemplaza los originales y ejecuta `node scripts/optimizar-logos.mjs`; si cambian los márgenes, ajusta los recortes del script y las dimensiones de `lib/marca.ts`.
