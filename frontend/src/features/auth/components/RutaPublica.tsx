import { Navigate, Outlet, useLocation } from 'react-router'
import { RUTAS } from '@/shared/config/rutas'
import { useSesion } from '../hooks/useSesion'
import type { EstadoNavegacionAuth } from '../types'

// Para login y registro: si hay sesión (por ejemplo, justo después de iniciarla), se sale de aquí.
// Se vuelve a la página pendiente SOLO si es de esta misma persona (o si nadie la tenía abierta);
// si otro usuario estaba en ella al cerrar su sesión, se va al inicio de quien entró.
export function RutaPublica() {
  const { usuario } = useSesion()
  const estado = useLocation().state as EstadoNavegacionAuth | null

  if (!usuario) return <Outlet />

  const esSuya = estado?.deUsuarioId == null || estado.deUsuarioId === usuario.id
  const destino = estado?.desde && esSuya ? estado.desde : RUTAS.inicio

  return <Navigate to={destino} replace />
}
