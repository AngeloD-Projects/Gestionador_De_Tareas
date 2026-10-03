import { Navigate, Outlet, useLocation } from 'react-router'
import { RUTAS } from '@/shared/config/rutas'
import { useSesion } from '../hooks/useSesion'
import type { EstadoNavegacionAuth } from '../types'

// Para login y registro: si hay sesión (por ejemplo, justo después de iniciarla), se sale de aquí
// hacia la página que se intentaba abrir antes del login, o al inicio.
export function RutaPublica() {
  const { estaAutenticado } = useSesion()
  const estado = useLocation().state as EstadoNavegacionAuth | null

  return estaAutenticado ? <Navigate to={estado?.desde ?? RUTAS.inicio} replace /> : <Outlet />
}
