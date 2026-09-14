#!/usr/bin/env node
/**
 * Migra una sola vez el contenido en Markdown (contenido/) hacia Firestore,
 * para que el panel de administración (/admin) pueda editarlo desde ahí.
 *
 * Uso (con Node 20.6+, que soporta --env-file de forma nativa):
 *   node --env-file=.env.local scripts/migrar-contenido.mjs
 *
 * El script es seguro de repetir: usa el mismo slug (nombre de archivo) como
 * ID de documento y sobrescribe con datos idénticos si ya existían.
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import matter from 'gray-matter'
import { cert, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const RAIZ = path.join(process.cwd(), 'contenido')
const COLECCIONES = ['proyectos', 'novedades', 'reuniones', 'integrantes', 'publicaciones', 'galeria']

function credencialesListas() {
  return Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)
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
      'Faltan variables de entorno de Firebase (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).\n' +
        'Ejecuta este script con: node --env-file=.env.local scripts/migrar-contenido.mjs',
    )
    process.exit(1)
  }

  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  })
  const db = getFirestore()

  let total = 0
  for (const carpeta of COLECCIONES) {
    const documentos = leerCarpeta(carpeta)
    for (const { slug, datos, cuerpo } of documentos) {
      await db.collection(carpeta).doc(slug).set({ ...datos, cuerpo })
      total += 1
    }
    console.log(`[migrar-contenido] ${carpeta}: ${documentos.length} documento(s) migrado(s).`)
  }
  console.log(`[migrar-contenido] Listo. ${total} documento(s) en total.`)
}

main().catch((error) => {
  console.error('[migrar-contenido] Falló la migración:', error)
  process.exit(1)
})
