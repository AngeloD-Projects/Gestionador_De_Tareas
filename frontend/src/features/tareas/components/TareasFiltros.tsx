import { X } from 'lucide-react'
import { useProyectos } from '@/features/proyectos'
import { Selector } from '@/shared/components/Selector'
import { Button } from '@/shared/components/ui/button'
import { useFiltrosTareas } from '../hooks/useFiltrosTareas'
import { OPCIONES_ESTADO } from '../lib/opciones'

export function TareasFiltros() {
  const { filtros, hayFiltros, cambiar, limpiar } = useFiltrosTareas()
  const proyectos = useProyectos()

  const opcionesProyecto = (proyectos.data ?? []).map((p) => ({
    valor: String(p.id),
    etiqueta: p.nombre,
  }))

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <Selector
        aria-label="Filtrar por proyecto"
        className="w-full sm:w-56"
        valor={filtros.proyectoId ? String(filtros.proyectoId) : ''}
        alCambiar={(valor) => cambiar('proyecto', valor)}
        opciones={opcionesProyecto}
        opcionVacia="Todos los proyectos"
      />
      <Selector
        aria-label="Filtrar por estado"
        className="w-full sm:w-44"
        valor={filtros.estadoFlujo ?? ''}
        alCambiar={(valor) => cambiar('estado', valor)}
        opciones={OPCIONES_ESTADO}
        opcionVacia="Todos los estados"
      />
      {hayFiltros && (
        <Button variant="ghost" size="sm" onClick={limpiar}>
          <X className="size-4" />
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}
