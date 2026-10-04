import { useQuery } from '@tanstack/react-query'
import { usuariosApi } from '../api/usuariosApi'

export const usuariosQueryKeys = {
  todos: ['usuarios'] as const,
}

/** Usuarios activos (solo Admin). Cambian poco: se guardan 5 minutos en caché. */
export function useUsuarios() {
  return useQuery({
    queryKey: usuariosQueryKeys.todos,
    queryFn: usuariosApi.listar,
    staleTime: 5 * 60_000,
  })
}
