import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/lib/utils'
import { CONFIG_ESTADO } from '../constants'
import type { EstadoFlujo } from '../types'

export function EstadoBadge({ estado }: { estado: EstadoFlujo }) {
  const { etiqueta, clase } = CONFIG_ESTADO[estado]
  return <Badge className={cn('border-transparent', clase)}>{etiqueta}</Badge>
}
