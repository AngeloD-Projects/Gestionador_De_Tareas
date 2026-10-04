// Claves de la caché de proyectos en un solo lugar: invalidar "todos" refresca listas y detalles.
export const proyectosQueryKeys = {
  todos: ['proyectos'] as const,
  lista: () => [...proyectosQueryKeys.todos, 'lista'] as const,
  detalle: (id: number) => [...proyectosQueryKeys.todos, 'detalle', id] as const,
}
