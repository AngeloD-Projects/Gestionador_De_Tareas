import { useQuery } from '@tanstack/react-query'
import { tareasApi } from '../api/tareasApi'
import { tareasQueryKeys } from './tareasQueryKeys'

export function useMisTareas() {
  return useQuery({
    queryKey: tareasQueryKeys.misTareas(),
    queryFn: tareasApi.misTareas,
  })
}
