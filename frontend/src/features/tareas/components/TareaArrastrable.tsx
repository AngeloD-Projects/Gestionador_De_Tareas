import { useDraggable } from '@dnd-kit/core'
import { GripVertical } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { esArrastrable } from '../lib/arrastre'
import type { Tarea } from '../types'
import { TareaCard } from './TareaCard'

// La tarjeta se arrastra desde su manija (⋮⋮), no desde cualquier punto: así los botones de la
// tarjeta siguen funcionando con un clic normal, y con teclado se arrastra con Espacio + flechas.
export function TareaArrastrable({ tarea }: { tarea: Tarea }) {
  const arrastrable = esArrastrable(tarea)
  const { setNodeRef, setActivatorNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: tarea.id,
    data: { tarea },
    disabled: !arrastrable,
  })

  const manija = arrastrable && (
    <button
      ref={setActivatorNodeRef}
      {...listeners}
      {...attributes}
      aria-label={`Arrastrar "${tarea.titulo}"`}
      className="-ml-1 cursor-grab touch-none rounded text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
    >
      <GripVertical className="size-4" />
    </button>
  )

  return (
    // Mientras se arrastra, la original queda tenue: la copia que sigue al cursor es el DragOverlay.
    <div ref={setNodeRef} className={cn(isDragging && 'opacity-40')}>
      <TareaCard tarea={tarea} manija={manija} />
    </div>
  )
}
