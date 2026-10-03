import { Navigate, Outlet } from 'react-router'
import { RUTAS } from '@/shared/config/rutas'
import { useSesion } from '../hooks/useSesion'

// Para login y registro: si ya hay sesión, no tiene sentido mostrarlos.
export function RutaPublica() {
  const { estaAutenticado } = useSesion()
  return estaAutenticado ? <Navigate to={RUTAS.inicio} replace /> : <Outlet />
}
