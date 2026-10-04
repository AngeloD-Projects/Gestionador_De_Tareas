import { httpClient } from '@/shared/api/httpClient'
import type { UsuarioResumen } from '../types'

export const usuariosApi = {
  listar: async () => (await httpClient.get<UsuarioResumen[]>('/usuarios')).data,
}
