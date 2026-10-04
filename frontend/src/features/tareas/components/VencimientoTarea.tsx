import { CalendarDays } from 'lucide-react'
import { formatearDia } from '@/shared/lib/fechas'
import { cn } from '@/shared/lib/utils'
import { situacionVencimiento } from '../lib/vencimiento'
import type { Tarea } from '../types'

const ESTILO = {
  vencida: { prefijo: 'Vencida · ', clase: 'font-medium text-destructive' },
  'vence-hoy': { prefijo: 'Vence hoy · ', clase: 'font-medium text-amber-600 dark:text-amber-400' },
  'a-tiempo': { prefijo: 'Vence ', clase: 'text-muted-foreground' },
  finalizada: { prefijo: 'Vencía ', clase: 'text-muted-foreground' },
} as const

export function VencimientoTarea({ tarea }: { tarea: Tarea }) {
  const situacion = situacionVencimiento(tarea)
  if (situacion === 'sin-fecha' || !tarea.fechaVencimiento) return null

  const { prefijo, clase } = ESTILO[situacion]
  return (
    <p className={cn('flex items-center gap-1.5 text-xs', clase)}>
      <CalendarDays className="size-3.5" />
      {prefijo}
      {formatearDia(tarea.fechaVencimiento)}
    </p>
  )
}
