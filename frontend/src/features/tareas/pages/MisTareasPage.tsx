import { ListTodo } from 'lucide-react'
import { EstadoConsulta } from '@/shared/components/EstadoConsulta'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { PageHeader } from '@/shared/components/PageHeader'
import { TableroTareas } from '../components/TableroTareas'
import { TableroTareasCargando } from '../components/TableroTareasCargando'
import { ESTADOS_FINALES } from '../constants'
import { useMisTareas } from '../hooks/useMisTareas'
import { situacionVencimiento } from '../lib/vencimiento'
import type { Tarea } from '../types'

function resumen(tareas: Tarea[]): string {
  const enCurso = tareas.filter((t) => !ESTADOS_FINALES.includes(t.estadoFlujo)).length
  const vencidas = tareas.filter((t) => situacionVencimiento(t) === 'vencida').length
  const partes = [`${enCurso} ${enCurso === 1 ? 'tarea' : 'tareas'} por hacer`]
  if (vencidas > 0) partes.push(`${vencidas} ${vencidas === 1 ? 'vencida' : 'vencidas'}`)
  return partes.join(' · ')
}

export function MisTareasPage() {
  const misTareas = useMisTareas()

  return (
    <>
      <PageHeader
        titulo="Mis tareas"
        descripcion={misTareas.data ? resumen(misTareas.data) : 'Las tareas que tienes asignadas.'}
      />

      <EstadoConsulta
        consulta={misTareas}
        cargando={<TableroTareasCargando />}
        esVacio={(tareas) => tareas.length === 0}
        vacio={
          <EstadoVacio
            icono={ListTodo}
            titulo="No tienes tareas asignadas"
            descripcion="Cuando un administrador te asigne una tarea, aparecerá aquí."
          />
        }
      >
        {(tareas) => <TableroTareas tareas={tareas} />}
      </EstadoConsulta>
    </>
  )
}
