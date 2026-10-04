import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Progress } from '@/shared/components/ui/progress'
import { formatearFecha } from '@/shared/lib/fechas'
import { calcularProgreso } from '../lib/progreso'
import type { Proyecto } from '../types'

export function ProyectoCard({ proyecto }: { proyecto: Proyecto }) {
  const { nombre, descripcion, totalTareas, tareasCompletadas, creadoPorNombre, fechaCreacion } =
    proyecto
  const progreso = calcularProgreso(tareasCompletadas, totalTareas)

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="truncate" title={nombre}>
          {nombre}
        </CardTitle>
        <CardDescription className="line-clamp-2 min-h-10">
          {descripcion || 'Sin descripción.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-auto space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {totalTareas === 0
              ? 'Sin tareas todavía'
              : `${tareasCompletadas} de ${totalTareas} tareas completadas`}
          </span>
          <span className="font-medium">{progreso}%</span>
        </div>
        <Progress value={progreso} aria-label={`Progreso de ${nombre}`} />
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        Creado por {creadoPorNombre} · {formatearFecha(fechaCreacion)}
      </CardFooter>
    </Card>
  )
}
