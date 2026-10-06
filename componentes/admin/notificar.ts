'use client'

export const EVENTO_NOTIFICACION_ADMIN = 'isia:notificacion-admin'

export type DetalleNotificacionAdmin = {
  mensaje: string
  tipo?: 'exito' | 'error'
}

export function notificarAdmin(mensaje: string, tipo: DetalleNotificacionAdmin['tipo'] = 'exito') {
  window.dispatchEvent(new CustomEvent<DetalleNotificacionAdmin>(EVENTO_NOTIFICACION_ADMIN, {
    detail: { mensaje, tipo },
  }))
}
