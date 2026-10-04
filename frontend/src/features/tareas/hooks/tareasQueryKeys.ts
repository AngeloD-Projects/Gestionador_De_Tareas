import type { QueryClient } from '@tanstack/react-query'
import { proyectosQueryKeys } from '@/features/proyectos'
import type { FiltrosTareas } from '../types'

// Claves de la caché de tareas en un solo lugar: invalidar "todos" refresca cualquier lista de tareas.
export const tareasQueryKeys = {
  todos: ['tareas'] as const,
  misTareas: () => [...tareasQueryKeys.todos, 'mis-tareas'] as const,
  lista: (filtros: FiltrosTareas) => [...tareasQueryKeys.todos, 'lista', filtros] as const,
}

/** Tras crear, editar, eliminar o cambiar el estado de una tarea: cambian las listas de tareas
 *  y también el progreso de los proyectos. */
export function refrescarTareasYProyectos(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: tareasQueryKeys.todos }),
    queryClient.invalidateQueries({ queryKey: proyectosQueryKeys.todos }),
  ])
}
