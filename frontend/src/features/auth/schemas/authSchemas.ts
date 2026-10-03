import { z } from 'zod'

// Mismas reglas que los validadores del backend (LoginRequest, RegistroUsuarioRequest):
// el usuario ve el error al instante, y el backend sigue validando por seguridad.
const campoEmail = z
  .string()
  .trim()
  .min(1, 'El email es obligatorio.')
  .max(100, 'El email no puede superar los 100 caracteres.')
  .pipe(z.email('El email no tiene un formato válido.'))

export const loginSchema = z.object({
  email: campoEmail,
  password: z.string().min(1, 'La contraseña es obligatoria.'),
})

export const registroSchema = z
  .object({
    nombreUsuario: z
      .string()
      .trim()
      .min(1, 'El nombre de usuario es obligatorio.')
      .max(50, 'El nombre de usuario no puede superar los 50 caracteres.'),
    email: campoEmail,
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
    confirmarPassword: z.string().min(1, 'Confirma la contraseña.'),
  })
  .refine((datos) => datos.password === datos.confirmarPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmarPassword'],
  })

export type LoginFormulario = z.infer<typeof loginSchema>
export type RegistroFormulario = z.infer<typeof registroSchema>
