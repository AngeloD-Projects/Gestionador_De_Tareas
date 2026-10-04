import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { tareasApi } from '../api/tareasApi'
import { refrescarTareasYProyectos } from './tareasQueryKeys'

// Crear y editar comparten formulario: los errores se muestran dentro del modal.

export function useCrearTarea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tareasApi.crear,
    onSuccess: (tarea) => {
      toast.success(`Tarea "${tarea.titulo}" creada.`)
      return refrescarTareasYProyectos(queryClient)
    },
    meta: { silenciarError: true },
  })
}

export function useActualizarTarea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tareasApi.actualizar,
    onSuccess: (tarea) => {
      toast.success(`Tarea "${tarea.titulo}" actualizada.`)
      return refrescarTareasYProyectos(queryClient)
    },
    meta: { silenciarError: true },
  })
}

export function useEliminarTarea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tareasApi.eliminar,
    onSuccess: () => {
      toast.success('Tarea eliminada.')
      return refrescarTareasYProyectos(queryClient)
    },
    // Errores: notificación global (no hay formulario donde mostrarlos).
  })
}
