import { FolderKanban, Plus } from 'lucide-react'
import { useState } from 'react'
import { useSesion } from '@/features/auth'
import { EstadoConsulta } from '@/shared/components/EstadoConsulta'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/components/ui/button'
import { ListaProyectosCargando } from '../components/ListaProyectosCargando'
import { NuevoProyectoDialog } from '../components/NuevoProyectoDialog'
import { ProyectoCard } from '../components/ProyectoCard'
import { useProyectos } from '../hooks/useProyectos'

export function ProyectosPage() {
  const { esAdmin } = useSesion()
  const proyectos = useProyectos()
  const [dialogoAbierto, setDialogoAbierto] = useState(false)

  const botonNuevo = esAdmin && (
    <Button onClick={() => setDialogoAbierto(true)}>
      <Plus className="size-4" />
      Nuevo proyecto
    </Button>
  )

  return (
    <>
      <PageHeader
        titulo="Proyectos"
        descripcion="Avance de cada proyecto según sus tareas completadas."
        acciones={botonNuevo}
      />

      <EstadoConsulta
        consulta={proyectos}
        cargando={<ListaProyectosCargando />}
        esVacio={(lista) => lista.length === 0}
        vacio={
          <EstadoVacio
            icono={FolderKanban}
            titulo="Aún no hay proyectos"
            descripcion={
              esAdmin
                ? 'Crea el primero para empezar a organizar tareas.'
                : 'Cuando un administrador cree proyectos, aparecerán aquí.'
            }
          />
        }
      >
        {(lista) => (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lista.map((proyecto) => (
              <ProyectoCard key={proyecto.id} proyecto={proyecto} />
            ))}
          </div>
        )}
      </EstadoConsulta>

      {esAdmin && (
        <NuevoProyectoDialog abierto={dialogoAbierto} alCambiarAbierto={setDialogoAbierto} />
      )}
    </>
  )
}
