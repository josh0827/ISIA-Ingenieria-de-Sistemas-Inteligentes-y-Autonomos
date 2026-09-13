import 'server-only'
import { db, firebaseListo } from './firebase/admin'

/**
 * Iniciar sesión con GitHub no basta para escribir contenido: el uid debe
 * existir en la colección "editores" de Firestore. Esa colección se gestiona
 * a mano desde la consola de Firebase (no desde este sitio) para evitar que
 * cualquier persona con cuenta de GitHub obtenga acceso de edición.
 */
export async function esEditor(uid: string): Promise<boolean> {
  if (!firebaseListo()) return false
  const doc = await db().collection('editores').doc(uid).get()
  return doc.exists && doc.data()?.activo !== false
}
