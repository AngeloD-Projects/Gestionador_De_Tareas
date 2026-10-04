// Claves de la caché de tareas en un solo lugar: invalidar "todos" refresca cualquier lista de tareas.
export const tareasQueryKeys = {
  todos: ['tareas'] as const,
  misTareas: () => [...tareasQueryKeys.todos, 'mis-tareas'] as const,
}
