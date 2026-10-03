import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { RUTAS } from '@/shared/config/rutas'
import { authApi } from '../api/authApi'
import type { EstadoNavegacionAuth } from '../types'

// El registro NO inicia sesión: lleva al login con el email ya escrito.
export function useRegistro() {
  const navegar = useNavigate()

  return useMutation({
    mutationFn: authApi.registrar,
    onSuccess: (usuario) => {
      toast.success('Cuenta creada. Ya puedes iniciar sesión.')
      const estado: EstadoNavegacionAuth = { email: usuario.email }
      navegar(RUTAS.login, { state: estado })
    },
    meta: { silenciarError: true },
  })
}
