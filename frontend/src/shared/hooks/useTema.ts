import { useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Tema = 'claro' | 'oscuro' | 'sistema'

/** Clave en localStorage. index.html la lee ANTES de cargar React para evitar el destello blanco. */
export const CLAVE_TEMA = 'taskmanagement-tema'

const consultaOscuro = () => window.matchMedia('(prefers-color-scheme: dark)')

const useTemaStore = create<{ tema: Tema; cambiarTema: (tema: Tema) => void }>()(
  persist((set) => ({ tema: 'sistema', cambiarTema: (tema) => set({ tema }) }), {
    name: CLAVE_TEMA,
  }),
)

function aplicar(tema: Tema) {
  const oscuro = tema === 'oscuro' || (tema === 'sistema' && consultaOscuro().matches)
  document.documentElement.classList.toggle('dark', oscuro)
}

/** Tema elegido + función para cambiarlo. Con "sistema", sigue la configuración del sistema operativo. */
export function useTema() {
  const { tema, cambiarTema } = useTemaStore()

  useEffect(() => {
    aplicar(tema)
    if (tema !== 'sistema') return

    // Si el sistema cambia de claro a oscuro con la app abierta, se actualiza sola.
    const consulta = consultaOscuro()
    const alCambiar = () => aplicar('sistema')
    consulta.addEventListener('change', alCambiar)
    return () => consulta.removeEventListener('change', alCambiar)
  }, [tema])

  const esOscuro = tema === 'oscuro' || (tema === 'sistema' && consultaOscuro().matches)
  return { tema, esOscuro, cambiarTema }
}
