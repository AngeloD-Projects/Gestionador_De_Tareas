import axios from 'axios'

// Mismo formato que devuelve el backend en TODOS sus errores: { status, mensaje, errores? }
export interface ApiError {
  status: number
  mensaje: string
  errores?: Record<string, string[]>
}

const MENSAJE_SIN_CONEXION =
  'No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.'
const MENSAJE_INESPERADO = 'Ocurrió un error inesperado. Intenta nuevamente.'

// Convierte cualquier error (de axios o no) en un ApiError: el resto de la app solo conoce este formato.
export function aApiError(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) return { status: 0, mensaje: MENSAJE_INESPERADO }
  if (!error.response) return { status: 0, mensaje: MENSAJE_SIN_CONEXION }

  const datos = error.response.data as Partial<ApiError> | undefined
  return {
    status: error.response.status,
    mensaje: datos?.mensaje ?? MENSAJE_INESPERADO,
    errores: datos?.errores,
  }
}
