import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LoginResponse, Usuario } from '../types'

interface SesionState {
  accessToken: string | null
  refreshToken: string | null
  usuario: Usuario | null
  /** Id de quien tenía la última sesión cerrada: la página pendiente tras el login es solo suya. */
  ultimoUsuarioId: number | null
  guardarSesion: (respuesta: LoginResponse) => void
  cerrarSesion: () => void
}

// La sesión sobrevive a recargar la página (se guarda en localStorage).
export const useSesionStore = create<SesionState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      usuario: null,
      ultimoUsuarioId: null,
      guardarSesion: ({ accessToken, refreshToken, usuario }) =>
        set({ accessToken, refreshToken, usuario }),
      cerrarSesion: () =>
        set((estado) => ({
          accessToken: null,
          refreshToken: null,
          usuario: null,
          ultimoUsuarioId: estado.usuario?.id ?? estado.ultimoUsuarioId,
        })),
    }),
    {
      name: 'taskmanagement-sesion',
      partialize: ({ accessToken, refreshToken, usuario, ultimoUsuarioId }) => ({
        accessToken,
        refreshToken,
        usuario,
        ultimoUsuarioId,
      }),
    },
  ),
)
