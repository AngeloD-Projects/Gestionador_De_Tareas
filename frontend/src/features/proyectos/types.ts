// Contratos de la API (/api/proyectos)
export interface Proyecto {
  id: number
  nombre: string
  descripcion: string | null
  creadoPorId: number
  creadoPorNombre: string
  fechaCreacion: string
  totalTareas: number
  tareasCompletadas: number
}

export interface CrearProyectoRequest {
  nombre: string
  descripcion: string | null
}
