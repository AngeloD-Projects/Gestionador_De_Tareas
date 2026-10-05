import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
} from '@dnd-kit/core'
import { useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { CONFIG_ESTADO } from '../constants'
import { useCambiarEstado } from '../hooks/useCambiarEstado'
import { puedeSoltarEn } from '../lib/arrastre'
import { ESTADOS_FLUJO, type EstadoFlujo, type Tarea } from '../types'
import { EstadoBadge } from './EstadoBadge'
import { TareaArrastrable } from './TareaArrastrable'
import { TareaCard } from './TareaCard'

const tareaDe = (evento: { active: { data: { current?: Record<string, unknown> } } }) =>
  evento.active.data.current?.tarea as Tarea | undefined
const etiqueta = (id: unknown) => CONFIG_ESTADO[id as EstadoFlujo]?.etiqueta ?? ''

// Lo que oye un lector de pantalla al arrastrar con teclado (por defecto, dnd-kit lo dice en inglés).
const anuncios: Announcements = {
  onDragStart: (e) =>
    `Tomaste la tarea "${tareaDe(e)?.titulo}". Usa las flechas y Espacio para soltar.`,
  onDragOver: (e) =>
    e.over ? `Sobre la columna ${etiqueta(e.over.id)}.` : 'Fuera de las columnas.',
  onDragEnd: (e) => (e.over ? `Soltada en ${etiqueta(e.over.id)}.` : 'Soltada fuera: no se movió.'),
  onDragCancel: () => 'Arrastre cancelado.',
}

// Una columna por estado del flujo. "Cancelada" solo aparece si hay alguna tarea cancelada.
// Las tarjetas se pueden arrastrar entre columnas, pero SOLO a los estados que permite el backend.
export function TableroTareas({ tareas }: { tareas: Tarea[] }) {
  const cambiarEstado = useCambiarEstado()
  const [arrastrada, setArrastrada] = useState<Tarea | null>(null)

  const sensores = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    // En el celular hay que mantener presionado un momento: si no, no se podría hacer scroll.
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor),
  )

  const alSoltar = (evento: DragEndEvent) => {
    setArrastrada(null)
    const tarea = tareaDe(evento)
    const destino = evento.over?.id as EstadoFlujo | undefined
    if (tarea && destino && puedeSoltarEn(tarea, destino)) {
      cambiarEstado.mutate({ id: tarea.id, estadoFlujo: destino })
    }
  }

  const columnas = ESTADOS_FLUJO.map((estado) => ({
    estado,
    tareas: tareas.filter((tarea) => tarea.estadoFlujo === estado),
  })).filter(({ estado, tareas }) => estado !== 'Cancelada' || tareas.length > 0)

  return (
    <DndContext
      sensors={sensores}
      accessibility={{
        announcements: anuncios,
        screenReaderInstructions: {
          draggable:
            'Para mover la tarea, presiona Espacio, usa las flechas y vuelve a presionar Espacio.',
        },
      }}
      onDragStart={(evento) => setArrastrada(tareaDe(evento) ?? null)}
      onDragEnd={alSoltar}
      onDragCancel={() => setArrastrada(null)}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columnas.map(({ estado, tareas }) => (
          <ColumnaTablero key={estado} estado={estado} tareas={tareas} arrastrada={arrastrada} />
        ))}
      </div>

      {/* Copia de la tarjeta que sigue al cursor. */}
      <DragOverlay>
        {arrastrada && (
          <div className="rotate-2 shadow-lg">
            <TareaCard tarea={arrastrada} soloLectura />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

interface ColumnaTableroProps {
  estado: EstadoFlujo
  tareas: Tarea[]
  arrastrada: Tarea | null
}

function ColumnaTablero({ estado, tareas, arrastrada }: ColumnaTableroProps) {
  const permitida = arrastrada !== null && puedeSoltarEn(arrastrada, estado)
  const { setNodeRef, isOver } = useDroppable({ id: estado, disabled: !permitida })
  const esOrigen = arrastrada?.estadoFlujo === estado

  return (
    <section
      ref={setNodeRef}
      aria-label={CONFIG_ESTADO[estado].etiqueta}
      className={cn(
        'flex flex-col gap-3 rounded-xl bg-muted/50 p-3 ring-2 ring-transparent transition-all',
        // Mientras se arrastra: se resaltan las columnas válidas y se atenúan las que no lo son.
        permitida && 'ring-primary/30',
        permitida && isOver && 'bg-primary/10 ring-primary/60',
        arrastrada && !permitida && !esOrigen && 'opacity-40',
      )}
    >
      <header className="flex items-center justify-between">
        <EstadoBadge estado={estado} />
        <span className="text-xs text-muted-foreground">{tareas.length}</span>
      </header>

      {tareas.length === 0 ? (
        <p className="py-6 text-center text-xs text-muted-foreground">
          {permitida ? 'Suelta aquí' : 'Sin tareas'}
        </p>
      ) : (
        tareas.map((tarea) => <TareaArrastrable key={tarea.id} tarea={tarea} />)
      )}
    </section>
  )
}
