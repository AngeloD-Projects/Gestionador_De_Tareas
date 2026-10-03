import { httpClientPublico } from '@/shared/api/httpClient'
import type { LoginRequest, LoginResponse, RegistroRequest, Usuario } from '../types'

// Endpoints públicos: usan el cliente sin interceptores (un 401 aquí NO debe disparar un refresh).
export const authApi = {
  login: async (datos: LoginRequest) =>
    (await httpClientPublico.post<LoginResponse>('/auth/login', datos)).data,

  registrar: async (datos: RegistroRequest) =>
    (await httpClientPublico.post<Usuario>('/auth/register', datos)).data,

  refrescar: async (refreshToken: string) =>
    (await httpClientPublico.post<LoginResponse>('/auth/refresh', { refreshToken })).data,

  cerrarSesion: async (refreshToken: string) => {
    await httpClientPublico.post('/auth/logout', { refreshToken })
  },
}
