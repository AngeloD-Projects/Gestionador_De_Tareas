import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EstadoVacioProps {
  icono: LucideIcon
  titulo: string
  descripcion?: string
  /** Botón opcional (ej: "Crear el primero"). */
  accion?: ReactNode
}

// Lo que se muestra cuando una lista no tiene elementos: siempre con el mismo diseño.
export function EstadoVacio({ icono: Icono, titulo, descripcion, accion }: EstadoVacioProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-background px-6 py-12 text-center">
      <Icono className="size-10 text-muted-foreground" />
      <div className="space-y-1">
        <p className="font-medium">{titulo}</p>
        {descripcion && <p className="text-sm text-muted-foreground">{descripcion}</p>}
      </div>
      {accion}
    </div>
  )
}
