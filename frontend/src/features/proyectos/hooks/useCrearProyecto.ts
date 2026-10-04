import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { proyectosApi } from '../api/proyectosApi'
import { proyectosQueryKeys } from './proyectosQueryKeys'

export function useCrearProyecto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: proyectosApi.crear,
    onSuccess: (proyecto) => {
      toast.success(`Proyecto "${proyecto.nombre}" creado.`)
      // La lista se vuelve a pedir: así muestra exactamente lo que hay en la BD.
      return queryClient.invalidateQueries({ queryKey: proyectosQueryKeys.todos })
    },
    // El formulario muestra los errores dentro del modal.
    meta: { silenciarError: true },
  })
}
