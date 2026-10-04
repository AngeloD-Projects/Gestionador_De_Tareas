import { CONFIG_ESTADO } from '../constants'
import { ESTADOS_FLUJO, type Tarea } from '../types'
import { EstadoBadge } from './EstadoBadge'
import { TareaCard } from './TareaCard'

// Una columna por estado del flujo. "Cancelada" solo aparece si hay alguna tarea cancelada.
export function TableroTareas({ tareas }: { tareas: Tarea[] }) {
  const columnas = ESTADOS_FLUJO.map((estado) => ({
    estado,
    tareas: tareas.filter((tarea) => tarea.estadoFlujo === estado),
  })).filter(({ estado, tareas }) => estado !== 'Cancelada' || tareas.length > 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {columnas.map(({ estado, tareas }) => (
        <section
          key={estado}
          aria-label={CONFIG_ESTADO[estado].etiqueta}
          className="flex flex-col gap-3 rounded-xl bg-muted/50 p-3"
        >
          <header className="flex items-center justify-between">
            <EstadoBadge estado={estado} />
            <span className="text-xs text-muted-foreground">{tareas.length}</span>
          </header>

          {tareas.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">Sin tareas</p>
          ) : (
            tareas.map((tarea) => <TareaCard key={tarea.id} tarea={tarea} />)
          )}
        </section>
      ))}
    </div>
  )
}
