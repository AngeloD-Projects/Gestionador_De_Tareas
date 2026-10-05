import type { EstadoFlujo, Tarea } from '../types'

/** Una tarea solo se puede soltar en una columna a la que el backend permite moverla. */
export function puedeSoltarEn(tarea: Pick<Tarea, 'transicionesPermitidas'>, destino: EstadoFlujo) {
  return tarea.transicionesPermitidas.includes(destino)
}

/** Sin transiciones permitidas (ej: completada, para un Usuario) la tarea no se puede arrastrar. */
export function esArrastrable(tarea: Pick<Tarea, 'transicionesPermitidas'>) {
  return tarea.transicionesPermitidas.length > 0
}
