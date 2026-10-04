import { ChevronDown, Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { CONFIG_ESTADO } from '../constants'
import { useCambiarEstado } from '../hooks/useCambiarEstado'
import type { Tarea } from '../types'

// Las opciones salen de `transicionesPermitidas` (las decide el backend según el rol):
// el front no repite las reglas del flujo. Sin opciones no se muestra nada.
export function CambiarEstadoAcciones({ tarea }: { tarea: Tarea }) {
  const cambiarEstado = useCambiarEstado()
  const opciones = tarea.transicionesPermitidas

  if (opciones.length === 0) return null

  const mover = (estadoFlujo: Tarea['estadoFlujo']) =>
    cambiarEstado.mutate({ id: tarea.id, estadoFlujo })
  const icono = cambiarEstado.isPending && <Loader2 className="size-4 animate-spin" />

  // Una sola opción (lo habitual para un Usuario): botón directo.
  if (opciones.length === 1) {
    const [destino] = opciones
    return (
      <Button size="sm" disabled={cambiarEstado.isPending} onClick={() => mover(destino)}>
        {icono}
        {CONFIG_ESTADO[destino].accion}
      </Button>
    )
  }

  // Varias opciones (Admin): menú.
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" disabled={cambiarEstado.isPending}>
          {icono}
          Cambiar estado
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Mover a</DropdownMenuLabel>
        {opciones.map((destino) => (
          <DropdownMenuItem
            key={destino}
            onSelect={() => mover(destino)}
            variant={destino === 'Cancelada' ? 'destructive' : 'default'}
          >
            {CONFIG_ESTADO[destino].etiqueta}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
