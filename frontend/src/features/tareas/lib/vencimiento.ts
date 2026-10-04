import { differenceInCalendarDays } from 'date-fns'
import { aDiaLocal } from '@/shared/lib/fechas'
import { ESTADOS_FINALES } from '../constants'
import type { Tarea } from '../types'

export type SituacionVencimiento = 'sin-fecha' | 'vencida' | 'vence-hoy' | 'a-tiempo' | 'finalizada'

/** Cómo está la tarea respecto a su fecha de vencimiento. Una tarea completada o cancelada nunca está "vencida". */
export function situacionVencimiento(
  tarea: Pick<Tarea, 'fechaVencimiento' | 'estadoFlujo'>,
  hoy: Date = new Date(),
): SituacionVencimiento {
  if (!tarea.fechaVencimiento) return 'sin-fecha'
  if (ESTADOS_FINALES.includes(tarea.estadoFlujo)) return 'finalizada'

  const dias = differenceInCalendarDays(aDiaLocal(tarea.fechaVencimiento), hoy)
  if (dias < 0) return 'vencida'
  if (dias === 0) return 'vence-hoy'
  return 'a-tiempo'
}
