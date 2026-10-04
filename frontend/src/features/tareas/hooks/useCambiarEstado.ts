import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { proyectosQueryKeys } from '@/features/proyectos'
import { tareasApi } from '../api/tareasApi'
import { CONFIG_ESTADO } from '../constants'
import { tareasQueryKeys } from './tareasQueryKeys'

export function useCambiarEstado() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tareasApi.cambiarEstado,
    onSuccess: (tarea) => {
      toast.success(`"${tarea.titulo}" pasó a ${CONFIG_ESTADO[tarea.estadoFlujo].etiqueta}.`)
      // Cambia la lista de tareas y también el progreso de su proyecto.
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: tareasQueryKeys.todos }),
        queryClient.invalidateQueries({ queryKey: proyectosQueryKeys.todos }),
      ])
    },
    // Si falla (ej: otra persona ya la movió), el error lo muestra la notificación global.
  })
}
