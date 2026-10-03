import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import type { ApiError } from '@/shared/api/apiError'

/**
 * Pasa los errores de validación del backend ({ errores: { campo: [...] } }) a los campos
 * del formulario, para mostrarlos debajo de cada input.
 * Devuelve true si al menos un error se pudo asignar a un campo del formulario.
 */
export function aplicarErroresDelServidor<T extends FieldValues>(
  error: ApiError,
  setError: UseFormSetError<T>,
  campos: readonly Path<T>[],
): boolean {
  let asignado = false

  for (const [campo, mensajes] of Object.entries(error.errores ?? {})) {
    if (!campos.includes(campo as Path<T>) || mensajes.length === 0) continue
    setError(campo as Path<T>, { type: 'server', message: mensajes[0] })
    asignado = true
  }

  return asignado
}
