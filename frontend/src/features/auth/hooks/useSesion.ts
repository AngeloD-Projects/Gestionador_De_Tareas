import { useSesionStore } from '../store/sesionStore'
import { ROLES } from '../types'

// Lo que el resto de la app necesita saber de la sesión, sin tocar el store directamente.
export function useSesion() {
  const usuario = useSesionStore((estado) => estado.usuario)

  return {
    usuario,
    estaAutenticado: usuario !== null,
    esAdmin: usuario?.rol === ROLES.Admin,
  }
}
