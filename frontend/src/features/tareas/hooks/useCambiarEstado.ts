import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { tareasApi } from '../api/tareasApi'
import { CONFIG_ESTADO } from '../constants'
import { refrescarTareasYProyectos } from './tareasQueryKeys'

export function useCambiarEstado() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tareasApi.cambiarEstado,
    onSuccess: (tarea) => {
      toast.success(`"${tarea.titulo}" pasó a ${CONFIG_ESTADO[tarea.estadoFlujo].etiqueta}.`)
      return refrescarTareasYProyectos(queryClient)
    },
    // Si falla (ej: otra persona ya la movió), el error lo muestra la notificación global.
  })
}
