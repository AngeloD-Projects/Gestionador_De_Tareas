import { httpClient } from '@/shared/api/httpClient'
import type { CrearProyectoRequest, Proyecto } from '../types'

export const proyectosApi = {
  listar: async () => (await httpClient.get<Proyecto[]>('/proyectos')).data,

  obtener: async (id: number) => (await httpClient.get<Proyecto>(`/proyectos/${id}`)).data,

  crear: async (datos: CrearProyectoRequest) =>
    (await httpClient.post<Proyecto>('/proyectos', datos)).data,
}
