import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// El backend envía fechas ISO en UTC ("...Z"); se muestran en la hora local de quien usa la app.

/** "2 oct 2026" */
export function formatearFecha(iso: string): string {
  return format(new Date(iso), 'd MMM yyyy', { locale: es })
}

/** "2 oct 2026, 14:05" */
export function formatearFechaHora(iso: string): string {
  return format(new Date(iso), 'd MMM yyyy, HH:mm', { locale: es })
}
