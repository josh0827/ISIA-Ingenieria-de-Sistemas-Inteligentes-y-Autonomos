export const LIMITE_SOLICITUDES_POR_HORA = 30

export type ResultadoLimite = 'ok' | 'duplicada' | 'limite' | 'error'

/** Regla pura del límite: un duplicado reciente pesa más que el tope global. */
export function decidirLimite(recientesDelCorreo: number, solicitudesUltimaHora: number): ResultadoLimite {
  if (recientesDelCorreo > 0) return 'duplicada'
  if (solicitudesUltimaHora >= LIMITE_SOLICITUDES_POR_HORA) return 'limite'
  return 'ok'
}
