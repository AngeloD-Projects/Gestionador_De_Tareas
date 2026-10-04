import type { UseQueryResult } from '@tanstack/react-query'
import { RotateCw } from 'lucide-react'
import type { ReactNode } from 'react'
import { aApiError } from '@/shared/api/apiError'
import { AlertaError } from '@/shared/components/AlertaError'
import { Button } from '@/shared/components/ui/button'

interface EstadoConsultaProps<T> {
  consulta: UseQueryResult<T>
  /** Qué mostrar mientras carga (normalmente un esqueleto con la forma del contenido). */
  cargando: ReactNode
  /** Qué mostrar si no hay datos; se usa junto con `esVacio`. */
  vacio?: ReactNode
  esVacio?: (datos: T) => boolean
  children: (datos: T) => ReactNode
}

// Los 4 estados de cualquier pantalla que carga datos (cargando, error, vacío, con datos),
// resueltos en un solo lugar: ninguna página repite estos if.
export function EstadoConsulta<T>({
  consulta,
  cargando,
  vacio,
  esVacio,
  children,
}: EstadoConsultaProps<T>) {
  if (consulta.isPending) return cargando

  if (consulta.isError) {
    return (
      <div className="space-y-3">
        <AlertaError mensaje={aApiError(consulta.error).mensaje} />
        <Button variant="outline" size="sm" onClick={() => consulta.refetch()}>
          <RotateCw className="size-4" />
          Reintentar
        </Button>
      </div>
    )
  }

  if (vacio && esVacio?.(consulta.data)) return vacio

  return children(consulta.data)
}
