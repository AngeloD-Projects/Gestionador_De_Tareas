import { FolderKanban } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import type { Tarea } from '../types'
import { CambiarEstadoAcciones } from './CambiarEstadoAcciones'
import { PrioridadBadge } from './PrioridadBadge'
import { VencimientoTarea } from './VencimientoTarea'

export function TareaCard({ tarea }: { tarea: Tarea }) {
  return (
    <Card size="sm" aria-label={tarea.titulo}>
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <p className="leading-snug font-medium">{tarea.titulo}</p>
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
          <div className="ml-auto">
            <CambiarEstadoAcciones tarea={tarea} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
