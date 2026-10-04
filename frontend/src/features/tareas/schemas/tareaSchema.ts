import { z } from 'zod'
import { ESTADOS_FLUJO, PRIORIDADES } from '../types'

// Valores del FORMULARIO (todo texto, como los inputs y selectores). La conversión a lo que espera
// la API (números, null) está en lib/tareaFormulario.ts.
// Mismas reglas que CrearTareaRequest__Validador / ActualizarTareaRequest__Validador del backend.
export const tareaSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(1, 'El título de la tarea es obligatorio.')
    .max(150, 'El título no puede superar los 150 caracteres.'),
  descripcion: z.string().trim().max(1000, 'La descripción no puede superar los 1000 caracteres.'),
  proyectoId: z.string().min(1, 'Selecciona un proyecto.'),
  /** '' = sin asignar */
  asignadoAId: z.string(),
  prioridad: z.enum(PRIORIDADES),
  /** Solo se edita al modificar una tarea; al crearla siempre empieza Pendiente. */
  estadoFlujo: z.enum(ESTADOS_FLUJO),
  /** '' = sin vencimiento, o "YYYY-MM-DD" del input de fecha. */
  fechaVencimiento: z.string(),
})

export type TareaFormulario = z.infer<typeof tareaSchema>
