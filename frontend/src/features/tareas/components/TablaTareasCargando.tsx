import { Skeleton } from '@/shared/components/ui/skeleton'

export function TablaTareasCargando() {
  return (
    <div className="space-y-2 rounded-xl border bg-background p-4" aria-label="Cargando tareas">
      <Skeleton className="h-6 w-full" />
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} className="h-14 w-full" />
      ))}
    </div>
  )
}
