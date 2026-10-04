import { useQuery } from '@tanstack/react-query'
import { proyectosApi } from '../api/proyectosApi'
import { proyectosQueryKeys } from './proyectosQueryKeys'

export function useProyectos() {
  return useQuery({
    queryKey: proyectosQueryKeys.lista(),
    queryFn: proyectosApi.listar,
  })
}
