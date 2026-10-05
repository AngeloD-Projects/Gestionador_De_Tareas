import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterEach } from 'vitest'

// Las páginas diferidas se compilan la primera vez que un test las abre: se da más margen
// que el segundo por defecto para que un PC lento o el servidor de CI no den falsos fallos.
configure({ asyncUtilTimeout: 5000 })

// jsdom no implementa estas APIs del navegador que usan los selectores de Radix (shadcn/ui).
Element.prototype.hasPointerCapture ??= () => false
Element.prototype.releasePointerCapture ??= () => {}
Element.prototype.scrollIntoView ??= () => {}
// jsdom tampoco implementa matchMedia (lo usa el tema "Según el sistema"): se simula en modo claro.
window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }) as unknown as MediaQueryList

// Cada test empieza con la pantalla y el almacenamiento limpios.
afterEach(() => {
  cleanup()
  localStorage.clear()
})
