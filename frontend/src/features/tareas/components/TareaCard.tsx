import { FolderKanban } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'
import type { Tarea } from '../types'
import { CambiarEstadoAcciones } from './CambiarEstadoAcciones'
import { PrioridadBadge } from './PrioridadBadge'
import { VencimientoTarea } from './VencimientoTarea'

interface TareaCardProps {
  tarea: Tarea
  /** Control para arrastrar la tarjeta (lo pone el tablero). */
  manija?: ReactNode
  /** Sin botones: para la copia que sigue al cursor mientras se arrastra. */
  soloLectura?: boolean
}

export function TareaCard({ tarea, manija, soloLectura = false }: TareaCardProps) {
  return (
    <Card size="sm" aria-label={tarea.titulo}>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2">
          {manija}
          <p className="flex-1 leading-snug font-medium">{tarea.titulo}</p>
          <PrioridadBadge prioridad={tarea.prioridad} />
        </div>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <FolderKanban className="size-3.5" />
          {tarea.proyectoNombre}
        </p>

        {tarea.descripcion && (
          <p className="line-clamp-3 text-sm text-muted-foreground">{tarea.descripcion}</p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <VencimientoTarea tarea={tarea} />
          {!soloLectura && (
            <div className="ml-auto">
              <CambiarEstadoAcciones tarea={tarea} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
