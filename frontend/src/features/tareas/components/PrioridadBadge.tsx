import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/lib/utils'
import { CONFIG_PRIORIDAD } from '../constants'
import type { Prioridad } from '../types'

export function PrioridadBadge({ prioridad }: { prioridad: Prioridad }) {
  const { etiqueta, clase } = CONFIG_PRIORIDAD[prioridad]
  return (
    <Badge variant="outline" className={cn('bg-background', clase)}>
      {etiqueta}
    </Badge>
  )
}
