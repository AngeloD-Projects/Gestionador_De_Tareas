import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { tareasApi } from '../api/tareasApi'
import type { FiltrosTareas } from '../types'
import { tareasQueryKeys } from './tareasQueryKeys'

/** Todas las tareas (solo Admin). Cada combinación de filtros tiene su propia entrada en la caché. */
export function useTareas(filtros: FiltrosTareas) {
  return useQuery({
    queryKey: tareasQueryKeys.lista(filtros),
    queryFn: () => tareasApi.listar(filtros),
    // Al cambiar un filtro se sigue viendo la lista anterior mientras llega la nueva (sin parpadeo).
    placeholderData: keepPreviousData,
  })
}
