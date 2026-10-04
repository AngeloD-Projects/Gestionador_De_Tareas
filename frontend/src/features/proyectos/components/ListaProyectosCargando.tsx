import { Skeleton } from '@/shared/components/ui/skeleton'

// Esqueleto con la misma forma que la grilla de proyectos: la página no "salta" al cargar.
export function ListaProyectosCargando() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Cargando proyectos">
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} className="h-52 rounded-xl" />
      ))}
    </div>
  )
}
