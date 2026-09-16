export const DOMINIO_INSTITUCIONAL = '@unal.edu.co'
export type MotivoAcceso = 'sesion' | 'correo' | 'editor'

export class ErrorAcceso extends Error {
  readonly codigo: 401 | 403
  readonly motivo: MotivoAcceso

  constructor(message: string, codigo: 401 | 403, motivo: MotivoAcceso) {
    super(message)
    this.name = 'ErrorAcceso'
    this.codigo = codigo
    this.motivo = motivo
  }
}

/** Solo acepta cuentas institucionales con dominio exacto @unal.edu.co. */
export function esCorreoUnal(correo: unknown): correo is string {
  if (typeof correo !== 'string') return false
  return /^[^@\s]+@unal\.edu\.co$/i.test(correo.trim())
}

export function exigirCorreoUnal(correo: unknown): asserts correo is string {
  if (!esCorreoUnal(correo)) {
    throw new ErrorAcceso(
      'El panel está restringido a cuentas institucionales @unal.edu.co.',
      403,
      'correo',
    )
  }
}
