import 'server-only'
import type { App } from 'firebase-admin/app'
import type { Auth } from 'firebase-admin/auth'
import type { Firestore } from 'firebase-admin/firestore'

/**
 * El panel de administración solo funciona cuando existen credenciales reales
 * de Firebase. Sin ellas, el sitio sigue funcionando con el contenido en
 * Markdown (ver lib/contenido.ts), así que aquí nunca se lanza una excepción
 * por falta de configuración: solo se informa con firebaseListo().
 *
 * El SDK se carga con import() dentro de las funciones, nunca arriba del
 * archivo. Un import normal se ejecuta al cargar el módulo, así que el SDK
 * entero (firebase-admin y todo @google-cloud) entraba en cada página pública
 * aunque no hubiera credenciales: si esa cadena de dependencias falla al
 * cargarse en el servidor, se cae el sitio completo, no solo /admin. Con
 * import() el SDK solo se toca cuando de verdad se va a hablar con Firebase.
 *
 * Solo se importan tipos arriba (import type), que TypeScript borra al
 * compilar y no generan ninguna carga en tiempo de ejecución.
 */
export function firebaseListo(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  )
}

let app: App | undefined

async function appAdmin(): Promise<App> {
  if (!firebaseListo()) {
    throw new Error('Firebase no está configurado: faltan variables de entorno del servidor.')
  }
  if (app) return app
  const { cert, getApps, initializeApp } = await import('firebase-admin/app')
  const existente = getApps()[0]
  if (existente) {
    app = existente
    return app
  }
  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Las claves privadas llegan con "\n" escapados desde el archivo .env.
      privateKey: (process.env.FIREBASE_PRIVATE_KEY ?? '').replace(/\n/g, '\n'),
    }),
  })
  return app
}

let firestore: Firestore | undefined
let auth: Auth | undefined

export async function db(): Promise<Firestore> {
  if (!firestore) {
    const instancia = await appAdmin()
    const { getFirestore } = await import('firebase-admin/firestore')
    firestore = getFirestore(instancia)
  }
  return firestore
}

export async function authAdmin(): Promise<Auth> {
  if (!auth) {
    const instancia = await appAdmin()
    const { getAuth } = await import('firebase-admin/auth')
    auth = getAuth(instancia)
  }
  return auth
}
