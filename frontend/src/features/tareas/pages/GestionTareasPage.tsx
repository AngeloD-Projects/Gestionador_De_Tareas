import { ClipboardList, Plus, SearchX } from 'lucide-react'
import { useState } from 'react'
import { ConfirmarDialog } from '@/shared/components/ConfirmarDialog'
import { EstadoConsulta } from '@/shared/components/EstadoConsulta'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/components/ui/button'
import { TablaTareas } from '../components/TablaTareas'
import { TablaTareasCargando } from '../components/TablaTareasCargando'
import { TareaFormDialog } from '../components/TareaFormDialog'
import { TareasFiltros } from '../components/TareasFiltros'
import { useFiltrosTareas } from '../hooks/useFiltrosTareas'
import { useEliminarTarea } from '../hooks/useGuardarTarea'
import { useTareas } from '../hooks/useTareas'
import type { Tarea } from '../types'

// Qué modal está abierto: el formulario (crear o editar) o ninguno.
type Formulario = { abierto: false } | { abierto: true; tarea?: Tarea }

export function GestionTareasPage() {
  const { filtros, hayFiltros, limpiar } = useFiltrosTareas()
  const tareas = useTareas(filtros)
  const eliminar = useEliminarTarea()

  const [formulario, setFormulario] = useState<Formulario>({ abierto: false })
  const [aEliminar, setAEliminar] = useState<Tarea | null>(null)

  const confirmarEliminacion = () => {
    if (!aEliminar) return
    eliminar.mutate(aEliminar.id, { onSettled: () => setAEliminar(null) })
  }

  return (
    <>
      <PageHeader
        titulo="Gestión de tareas"
        descripcion="Todas las tareas del sistema: asígnalas, edítalas y sigue su avance."
        acciones={
          <Button onClick={() => setFormulario({ abierto: true })}>
            <Plus className="size-4" />
            Nueva tarea
          </Button>
        }
      />

      <TareasFiltros />

      <EstadoConsulta
        consulta={tareas}
        cargando={<TablaTareasCargando />}
        esVacio={(lista) => lista.length === 0}
        vacio={
          hayFiltros ? (
            <EstadoVacio
              icono={SearchX}
              titulo="Ninguna tarea coincide con los filtros"
              accion={
                <Button variant="outline" size="sm" onClick={limpiar}>
                  Limpiar filtros
                </Button>
              }
            />
          ) : (
            <EstadoVacio
              icono={ClipboardList}
              titulo="Todavía no hay tareas"
              descripcion="Crea la primera y asígnala a alguien del equipo."
            />
          )
        }
      >
        {(lista) => (
          <TablaTareas
            tareas={lista}
            alEditar={(tarea) => setFormulario({ abierto: true, tarea })}
            alEliminar={setAEliminar}
          />
        )}
      </EstadoConsulta>

      <TareaFormDialog
        abierto={formulario.abierto}
        alCambiarAbierto={(abierto) => !abierto && setFormulario({ abierto: false })}
        tarea={formulario.abierto ? formulario.tarea : undefined}
      />

      <ConfirmarDialog
        abierto={aEliminar !== null}
        alCambiarAbierto={(abierto) => !abierto && setAEliminar(null)}
        titulo="¿Eliminar esta tarea?"
        descripcion={`"${aEliminar?.titulo}" dejará de aparecer en las listas y en el progreso de su proyecto.`}
        textoConfirmar="Eliminar"
        alConfirmar={confirmarEliminacion}
        cargando={eliminar.isPending}
      />
    </>
  )
}
