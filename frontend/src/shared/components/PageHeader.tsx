import type { ReactNode } from 'react'

interface PageHeaderProps {
  titulo: string
  descripcion?: string
  /** Botones a la derecha del título (ej: "Nueva tarea"). */
  acciones?: ReactNode
}

// Encabezado común de todas las páginas: mismo tamaño, espaciado y posición de acciones.
export function PageHeader({ titulo, descripcion, acciones }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{titulo}</h1>
        {descripcion && <p className="text-sm text-muted-foreground">{descripcion}</p>}
      </div>
      {acciones && <div className="flex items-center gap-2">{acciones}</div>}
    </header>
  )
}
