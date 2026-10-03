import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authApi } from '../api/authApi'
import { useSesionStore } from '../store/sesionStore'

// Al guardar la sesión, RutaPublica redirige sola (a la página pedida antes del login, o al inicio).
export function useLogin() {
  const guardarSesion = useSesionStore((estado) => estado.guardarSesion)

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (respuesta) => {
      guardarSesion(respuesta)
      toast.success(`¡Hola, ${respuesta.usuario.nombreUsuario}!`)
    },
    // El formulario muestra sus propios errores (credenciales, bloqueo...): sin notificación global.
    meta: { silenciarError: true },
  })
}
