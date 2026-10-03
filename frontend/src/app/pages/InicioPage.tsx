import { Navigate } from 'react-router'
import { useSesion } from '@/features/auth'
import { RUTAS } from '@/shared/config/rutas'

// "/" no tiene contenido propio: lleva a cada rol a su pantalla principal.
export function InicioPage() {
  const { esAdmin } = useSesion()
  return <Navigate to={esAdmin ? RUTAS.gestionTareas : RUTAS.misTareas} replace />
}
