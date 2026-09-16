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
  const { projectId, clientEmail, privateKey } = credencialesServidor()
  return Boolean(projectId && clientEmail && privateKey)
}

function variable(nombre: string): string | undefined {
  const valor = process.env[nombre]?.trim()
  return valor || undefined
}

function normalizarClavePrivada(valor: string | undefined): string | undefined {
  if (!valor) return undefined
  let clave = valor.trim()
  const comillasDobles = clave.startsWith('"') && clave.endsWith('"')
  const comillasSimples = clave.startsWith("'") && clave.endsWith("'")
  if (comillasDobles || comillasSimples) clave = clave.slice(1, -1)
  return clave.replace(/\\n/g, '\n')
}

function credencialesServidor() {
  return {
    projectId: variable('FIREBASE_PROJECT_ID'),
    clientEmail: variable('FIREBASE_CLIENT_EMAIL'),
    privateKey: normalizarClavePrivada(
      variable('FIREBASE_PRIVATE_KEY') ?? variable('FIREBASE_ADMIN_PRIVATE_KEY'),
    ),
  }
}

let app: App | undefined

async function appAdmin(): Promise<App> {
  if (!firebaseListo()) {
    throw new Error('Firebase no está configurado: faltan variables de entorno del servidor.')
  }
  if (app) return app
  const { cert, getApps, initializeApp } = await import('firebase-admin/app')
  const credenciales = credencialesServidor()
  const existente = getApps()[0]
  if (existente) {
    app = existente
    return app
  }
  app = initializeApp({
    credential: cert({
      projectId: credenciales.projectId,
      clientEmail: credenciales.clientEmail,
      privateKey: credenciales.privateKey,
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
