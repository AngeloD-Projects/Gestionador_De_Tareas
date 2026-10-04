import { httpClient } from '@/shared/api/httpClient'
import type {
  ActualizarTareaRequest,
  CrearTareaRequest,
  EstadoFlujo,
  FiltrosTareas,
  Tarea,
} from '../types'

export const tareasApi = {
  /** Solo Admin. Los filtros vacíos no se envían. */
  listar: async (filtros: FiltrosTareas) =>
    (await httpClient.get<Tarea[]>('/tareas', { params: filtros })).data,

  misTareas: async () => (await httpClient.get<Tarea[]>('/tareas/mis-tareas')).data,

  crear: async (datos: CrearTareaRequest) => (await httpClient.post<Tarea>('/tareas', datos)).data,

  actualizar: async ({ id, datos }: { id: number; datos: ActualizarTareaRequest }) =>
    (await httpClient.put<Tarea>(`/tareas/${id}`, datos)).data,

  cambiarEstado: async ({ id, estadoFlujo }: { id: number; estadoFlujo: EstadoFlujo }) =>
    (await httpClient.patch<Tarea>(`/tareas/${id}/estado`, { estadoFlujo })).data,

  eliminar: async (id: number) => {
    await httpClient.delete(`/tareas/${id}`)
  },
}
