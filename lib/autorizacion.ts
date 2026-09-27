export type MotivoAcceso = 'sesion' | 'editor'

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
