import { toast } from 'sonner'
import { configurarAutenticacion } from '@/shared/api/httpClient'
import { authApi } from './api/authApi'
import { useSesionStore } from './store/sesionStore'

/** Ejecuta `accion` cada vez que la sesión se cierra (logout o expiración). Devuelve cómo desuscribirse. */
export function alCerrarSesion(accion: () => void) {
  return useSesionStore.subscribe((actual, anterior) => {
    if (anterior.usuario && !actual.usuario) accion()
  })
}

// Conecta la sesión con el cliente HTTP. Se llama una vez, al arrancar la app (desde app/).
export function conectarSesionConHttpClient() {
  configurarAutenticacion({
    obtenerAccessToken: () => useSesionStore.getState().accessToken,

    refrescarSesion: async () => {
      const { refreshToken, guardarSesion } = useSesionStore.getState()
      if (!refreshToken) throw new Error('No hay sesión para renovar.')

      const respuesta = await authApi.refrescar(refreshToken)
      guardarSesion(respuesta)
      return respuesta.accessToken
    },

    alExpirarSesion: () => {
      if (!useSesionStore.getState().usuario) return
      useSesionStore.getState().cerrarSesion()
      toast.info('Tu sesión expiró. Vuelve a iniciar sesión.')
    },
  })
}
