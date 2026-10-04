import { z } from 'zod'

// Mismas reglas que CrearProyectoRequest__Validador del backend.
export const proyectoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre del proyecto es obligatorio.')
    .max(100, 'El nombre no puede superar los 100 caracteres.'),
  descripcion: z.string().trim().max(500, 'La descripción no puede superar los 500 caracteres.'),
})

export type ProyectoFormulario = z.infer<typeof proyectoSchema>
