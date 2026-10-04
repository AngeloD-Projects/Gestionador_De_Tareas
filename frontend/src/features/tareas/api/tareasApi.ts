import { httpClient } from '@/shared/api/httpClient'
import type { EstadoFlujo, Tarea } from '../types'

export const tareasApi = {
  misTareas: async () => (await httpClient.get<Tarea[]>('/tareas/mis-tareas')).data,

  cambiarEstado: async ({ id, estadoFlujo }: { id: number; estadoFlujo: EstadoFlujo }) =>
    (await httpClient.patch<Tarea>(`/tareas/${id}/estado`, { estadoFlujo })).data,
}
