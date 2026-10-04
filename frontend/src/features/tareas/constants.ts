import type { EstadoFlujo, Prioridad } from './types'

// ÚNICA fuente de textos y colores de estados y prioridades: badges, columnas, filtros y botones leen de aquí.

interface ConfigEstado {
  /** Cómo se muestra el estado ("En progreso"). */
  etiqueta: string
  /** Texto del botón que lleva a este estado ("Iniciar"). */
  accion: string
  /** Clases del badge. */
  clase: string
}

export const CONFIG_ESTADO: Record<EstadoFlujo, ConfigEstado> = {
  Pendiente: {
    etiqueta: 'Pendiente',
    accion: 'Reabrir',
    clase: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  EnProgreso: {
    etiqueta: 'En progreso',
    accion: 'Iniciar',
    clase: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  },
  EnRevision: {
    etiqueta: 'En revisión',
    accion: 'Enviar a revisión',
    clase: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  },
  Completada: {
    etiqueta: 'Completada',
    accion: 'Completar',
    clase: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  },
  Cancelada: {
    etiqueta: 'Cancelada',
    accion: 'Cancelar tarea',
    clase: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  },
}

export const CONFIG_PRIORIDAD: Record<Prioridad, { etiqueta: string; clase: string }> = {
  Baja: { etiqueta: 'Baja', clase: 'border-slate-300 text-slate-600 dark:text-slate-400' },
  Media: { etiqueta: 'Media', clase: 'border-blue-300 text-blue-700 dark:text-blue-300' },
  Alta: { etiqueta: 'Alta', clase: 'border-red-300 text-red-700 dark:text-red-300' },
}

/** Estados en los que una tarea ya no está "en curso" (no puede estar vencida). */
export const ESTADOS_FINALES: readonly EstadoFlujo[] = ['Completada', 'Cancelada']
