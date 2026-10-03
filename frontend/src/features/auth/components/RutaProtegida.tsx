import { Navigate, Outlet, useLocation } from 'react-router'
import { RUTAS } from '@/shared/config/rutas'
import { useSesion } from '../hooks/useSesion'
import type { EstadoNavegacionAuth, Rol } from '../types'

interface RutaProtegidaProps {
  /** Si se indica, solo esos roles pueden entrar; el resto va a "Sin acceso". */
  rolesPermitidos?: Rol[]
}

// Envuelve rutas que requieren sesión. Sin sesión → login (recordando a dónde se quería ir).
export function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {
  const { usuario } = useSesion()
  const ubicacion = useLocation()

  if (!usuario) {
    const estado: EstadoNavegacionAuth = { desde: ubicacion.pathname }
    return <Navigate to={RUTAS.login} replace state={estado} />
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to={RUTAS.sinAcceso} replace />
  }

  return <Outlet />
}
