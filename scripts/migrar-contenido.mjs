#!/usr/bin/env node
/**
 * Migra una sola vez el contenido en Markdown (contenido/) hacia Supabase,
 * para que el panel de administración (/admin) pueda editarlo desde ahí.
 *
 * Uso (con Node 20.6+, que soporta --env-file de forma nativa):
 *   node --env-file=.env.local scripts/migrar-contenido.mjs
 *
 * El script es seguro de repetir: usa colección + slug como clave y actualiza
 * las filas que ya existan.
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import matter from 'gray-matter'
import { createClient } from '@supabase/supabase-js'

const RAIZ = path.join(process.cwd(), 'contenido')
const COLECCIONES = ['proyectos', 'novedades', 'reuniones', 'integrantes', 'publicaciones', 'galeria']

function credencialesListas() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

function leerCarpeta(carpeta) {
  const dir = path.join(RAIZ, carpeta)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((archivo) => archivo.endsWith('.md') && !archivo.startsWith('_'))
    .map((archivo) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, archivo), 'utf8'))
      return { slug: archivo.replace(/\.md$/, ''), datos: data, cuerpo: content }
    })
}

async function main() {
  if (!credencialesListas()) {
    console.error(
      'Faltan variables de entorno de Supabase (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).\n' +
        'Ejecuta este script con: node --env-file=.env.local scripts/migrar-contenido.mjs',
    )
    process.exit(1)
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  )

  let total = 0
  for (const carpeta of COLECCIONES) {
    const documentos = leerCarpeta(carpeta)
    const filas = documentos.map(({ slug, datos, cuerpo }) => ({
      coleccion: carpeta,
      slug,
      datos,
      cuerpo,
      actualizado_en: new Date().toISOString(),
    }))
    if (filas.length) {
      const { error } = await supabase
        .from('contenido')
        .upsert(filas, { onConflict: 'coleccion,slug' })
      if (error) throw error
    }
    total += documentos.length
    console.log(`[migrar-contenido] ${carpeta}: ${documentos.length} documento(s) migrado(s).`)
  }
  console.log(`[migrar-contenido] Listo. ${total} documento(s) en total.`)
}

main().catch((error) => {
  console.error('[migrar-contenido] Falló la migración:', error)
  process.exit(1)
})
