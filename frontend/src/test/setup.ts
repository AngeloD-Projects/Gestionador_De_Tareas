import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Cada test empieza con la pantalla y el almacenamiento limpios.
afterEach(() => {
  cleanup()
  localStorage.clear()
})
