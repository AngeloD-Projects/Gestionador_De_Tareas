import { Navigate, Outlet, useLocation } from 'react-router'
import { RUTAS } from '@/shared/config/rutas'
import { useSesion } from '../hooks/useSesion'
import { useSesionStore } from '../store/sesionStore'
import type { EstadoNavegacionAuth, Rol } from '../types'

interface RutaProtegidaProps {
  /** Si se indica, solo esos roles pueden entrar; el resto va a "Sin acceso". */
  rolesPermitidos?: Rol[]
}

// Envuelve rutas que requieren sesión. Sin sesión → login, recordando a dónde se quería ir
// y DE QUIÉN era esa página (si la sesión de alguien acaba de cerrarse estando en ella).
export function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {
  const { usuario } = useSesion()
  const ultimoUsuarioId = useSesionStore((estado) => estado.ultimoUsuarioId)
  const ubicacion = useLocation()

  if (!usuario) {
    const estado: EstadoNavegacionAuth = {
      desde: ubicacion.pathname,
      deUsuarioId: ultimoUsuarioId,
    }
    return <Navigate to={RUTAS.login} replace state={estado} />
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to={RUTAS.sinAcceso} replace />
  }

  return <Outlet />
}
