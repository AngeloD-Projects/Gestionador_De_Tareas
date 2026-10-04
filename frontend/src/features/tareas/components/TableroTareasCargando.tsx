import { Skeleton } from '@/shared/components/ui/skeleton'

// Esqueleto con la forma del tablero (4 columnas) mientras cargan las tareas.
export function TableroTareasCargando() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Cargando tareas">
      {Array.from({ length: 4 }, (_, columna) => (
        <div key={columna} className="space-y-3 rounded-xl bg-muted/50 p-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
      ))}
    </div>
  )
}
