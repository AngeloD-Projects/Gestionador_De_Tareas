import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { tareasApi } from '../api/tareasApi'
import { CONFIG_ESTADO } from '../constants'
import type { Tarea } from '../types'
import { refrescarTareasYProyectos, tareasQueryKeys } from './tareasQueryKeys'

// Actualización OPTIMISTA: la tarea se mueve en pantalla al instante (clave al arrastrar en el tablero).
// Si el backend rechaza el cambio, vuelve a donde estaba y la notificación global muestra el motivo.
export function useCambiarEstado() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tareasApi.cambiarEstado,

    onMutate: async ({ id, estadoFlujo }) => {
      // Evita que una respuesta vieja que ya venía en camino pise el cambio optimista.
      await queryClient.cancelQueries({ queryKey: tareasQueryKeys.todos })
      const anteriores = queryClient.getQueriesData<Tarea[]>({ queryKey: tareasQueryKeys.todos })

      // Sin acciones hasta que el backend confirme cuáles son las nuevas transiciones permitidas.
      queryClient.setQueriesData<Tarea[]>({ queryKey: tareasQueryKeys.todos }, (lista) =>
        lista?.map((t) => (t.id === id ? { ...t, estadoFlujo, transicionesPermitidas: [] } : t)),
      )
      return { anteriores }
    },

    onError: (_error, _variables, contexto) => {
      contexto?.anteriores.forEach(([clave, datos]) => queryClient.setQueryData(clave, datos))
    },

    onSuccess: (tarea) => {
      toast.success(`"${tarea.titulo}" pasó a ${CONFIG_ESTADO[tarea.estadoFlujo].etiqueta}.`)
    },

    // Salga bien o mal, se vuelve a pedir lo real al backend (y el progreso de los proyectos).
    onSettled: () => refrescarTareasYProyectos(queryClient),
  })
}
