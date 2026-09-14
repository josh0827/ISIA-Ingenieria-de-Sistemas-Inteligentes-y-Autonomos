import 'server-only'
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getAuth, type Auth } from 'firebase-admin/auth'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

/**
 * El panel de administración solo funciona cuando existen credenciales reales
 * de Firebase. Sin ellas, el sitio sigue funcionando con el contenido en
 * Markdown (ver lib/contenido.ts), así que aquí nunca se lanza una excepción
 * por falta de configuración: solo se informa con firebaseListo().
 */
export function firebaseListo(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  )
}

let app: App | undefined

function appAdmin(): App {
  if (!firebaseListo()) {
    throw new Error('Firebase no está configurado: faltan variables de entorno del servidor.')
  }
  if (app) return app
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
      privateKey: (process.env.FIREBASE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
    }),
  })
  return app
}

let firestore: Firestore | undefined
let auth: Auth | undefined

export function db(): Firestore {
  if (!firestore) firestore = getFirestore(appAdmin())
  return firestore
}

export function authAdmin(): Auth {
  if (!auth) auth = getAuth(appAdmin())
  return auth
}
