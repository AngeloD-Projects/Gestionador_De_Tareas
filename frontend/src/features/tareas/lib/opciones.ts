import type { OpcionSelector } from '@/shared/components/Selector'
import { CONFIG_ESTADO, CONFIG_PRIORIDAD } from '../constants'
import { ESTADOS_FLUJO, PRIORIDADES } from '../types'

// Opciones de los selectores, generadas desde las constantes (nunca escritas a mano).
export const OPCIONES_ESTADO: OpcionSelector[] = ESTADOS_FLUJO.map((estado) => ({
  valor: estado,
  etiqueta: CONFIG_ESTADO[estado].etiqueta,
}))

export const OPCIONES_PRIORIDAD: OpcionSelector[] = PRIORIDADES.map((prioridad) => ({
  valor: prioridad,
  etiqueta: CONFIG_PRIORIDAD[prioridad].etiqueta,
}))
