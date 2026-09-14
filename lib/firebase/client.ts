'use client'

import { getApps, initializeApp } from 'firebase/app'
import { getAuth, GithubAuthProvider } from 'firebase/auth'

const configuracion = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

/** En el navegador basta con saber si hay una clave pública configurada. */
export function firebaseListoCliente(): boolean {
  return Boolean(configuracion.apiKey && configuracion.authDomain && configuracion.projectId)
}

function appCliente() {
  return getApps()[0] ?? initializeApp(configuracion)
}

export function authCliente() {
  return getAuth(appCliente())
}

export function proveedorGithub() {
  const proveedor = new GithubAuthProvider()
  proveedor.setCustomParameters({ allow_signup: 'false' })
  return proveedor
}
