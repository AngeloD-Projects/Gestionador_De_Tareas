// Mismos valores que los enums del backend (llegan como texto gracias a JsonStringEnumConverter).
export const ESTADOS_FLUJO = [
  'Pendiente',
  'EnProgreso',
  'EnRevision',
  'Completada',
  'Cancelada',
] as const
export type EstadoFlujo = (typeof ESTADOS_FLUJO)[number]

export const PRIORIDADES = ['Baja', 'Media', 'Alta'] as const
export type Prioridad = (typeof PRIORIDADES)[number]

/** Filtros del listado del Admin (GET /api/tareas?proyectoId=&estadoFlujo=). */
export interface FiltrosTareas {
  proyectoId?: number
  estadoFlujo?: EstadoFlujo
}

// Contratos de escritura (CrearTareaRequest / ActualizarTareaRequest del backend).
// fechaVencimiento: "YYYY-MM-DD" (un día, sin hora) o null.
export interface CrearTareaRequest {
  titulo: string
  descripcion: string | null
  prioridad: Prioridad
  fechaVencimiento: string | null
  proyectoId: number
  asignadoAId: number | null
}

export interface ActualizarTareaRequest {
  titulo: string
  descripcion: string | null
  estadoFlujo: EstadoFlujo
  prioridad: Prioridad
  fechaVencimiento: string | null
  asignadoAId: number | null
}

// Contrato de la API (TareaResponse)
export interface Tarea {
  id: number
  titulo: string
  descripcion: string | null
  estadoFlujo: EstadoFlujo
  prioridad: Prioridad
  /** Fecha sin hora (el día de vencimiento). */
  fechaVencimiento: string | null
  proyectoId: number
  proyectoNombre: string
  asignadoAId: number | null
  asignadoANombre: string | null
  creadoPorId: number
  creadoPorNombre: string
  fechaCreacion: string
  fechaActualizacion: string | null
  /** Estados a los que el usuario actual puede mover la tarea (lo decide el backend). */
  transicionesPermitidas: EstadoFlujo[]
}
