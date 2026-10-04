import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

// Dos tipos de fecha llegan del backend:
// 1. INSTANTES (fechaCreacion...): ISO en UTC ("...Z") → se muestran en la hora local.
// 2. DÍAS sin hora (fechaVencimiento): "2026-12-31T00:00:00Z" significa "el 31 de diciembre",
//    NO medianoche UTC. Convertirlo a hora de Perú daría el 30 de diciembre a las 19:00.

/** Instante → "2 oct 2026" (hora local) */
export function formatearFecha(iso: string): string {
  return format(new Date(iso), 'd MMM yyyy', { locale: es })
}

/** Instante → "2 oct 2026, 14:05" (hora local) */
export function formatearFechaHora(iso: string): string {
  return format(new Date(iso), 'd MMM yyyy, HH:mm', { locale: es })
}

/** Día sin hora → Date a medianoche LOCAL de ese mismo día (sin conversión de zona horaria). */
export function aDiaLocal(iso: string): Date {
  return parseISO(iso.slice(0, 10))
}

/** Día sin hora → "31 dic 2026" */
export function formatearDia(iso: string): string {
  return format(aDiaLocal(iso), 'd MMM yyyy', { locale: es })
}
