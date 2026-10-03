import { useNavigate } from 'react-router'
import { RUTAS } from '@/shared/config/rutas'
import { authApi } from '../api/authApi'
import { useSesionStore } from '../store/sesionStore'

export function useCerrarSesion() {
  const navegar = useNavigate()

  return async () => {
    const { refreshToken, cerrarSesion } = useSesionStore.getState()

    // Se revoca el refresh token en el backend; si falla (ej: sin conexión), igual se cierra en el front.
    if (refreshToken) await authApi.cerrarSesion(refreshToken).catch(() => undefined)

    cerrarSesion()
    navegar(RUTAS.login, { replace: true })
  }
}
