import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LoginResponse, Usuario } from '../types'

interface SesionState {
  accessToken: string | null
  refreshToken: string | null
  usuario: Usuario | null
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
      guardarSesion: ({ accessToken, refreshToken, usuario }) =>
        set({ accessToken, refreshToken, usuario }),
      cerrarSesion: () => set({ accessToken: null, refreshToken: null, usuario: null }),
    }),
    {
      name: 'taskmanagement-sesion',
      partialize: ({ accessToken, refreshToken, usuario }) => ({
        accessToken,
        refreshToken,
        usuario,
      }),
    },
  ),
)
