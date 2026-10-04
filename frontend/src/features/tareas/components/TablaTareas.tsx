import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import type { Tarea } from '../types'
import { CambiarEstadoAcciones } from './CambiarEstadoAcciones'
import { EstadoBadge } from './EstadoBadge'
import { PrioridadBadge } from './PrioridadBadge'
import { VencimientoTarea } from './VencimientoTarea'

interface TablaTareasProps {
  tareas: Tarea[]
  alEditar: (tarea: Tarea) => void
  alEliminar: (tarea: Tarea) => void
}

export function TablaTareas({ tareas, alEditar, alEliminar }: TablaTareasProps) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tarea</TableHead>
            <TableHead>Asignada a</TableHead>
            <TableHead>Prioridad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tareas.map((tarea) => (
            <TableRow key={tarea.id} aria-label={tarea.titulo}>
              <TableCell className="max-w-xs space-y-1 whitespace-normal">
                <p className="font-medium">{tarea.titulo}</p>
                <p className="text-xs text-muted-foreground">{tarea.proyectoNombre}</p>
                <VencimientoTarea tarea={tarea} />
              </TableCell>
              <TableCell>
                {tarea.asignadoANombre ?? (
                  <span className="text-muted-foreground">Sin asignar</span>
                )}
              </TableCell>
              <TableCell>
                <PrioridadBadge prioridad={tarea.prioridad} />
              </TableCell>
              <TableCell>
                <EstadoBadge estado={tarea.estadoFlujo} />
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <CambiarEstadoAcciones tarea={tarea} />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Editar"
                    onClick={() => alEditar(tarea)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Eliminar"
                    className="text-destructive hover:text-destructive"
                    onClick={() => alEliminar(tarea)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
