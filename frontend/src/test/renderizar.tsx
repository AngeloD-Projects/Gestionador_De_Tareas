import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router'

interface Opciones {
  /** Ruta inicial y su state (ej: { email } que llega al login tras registrarse). */
  ruta?: string
  estado?: unknown
}

// Renderiza un componente con lo mismo que tiene la app real: caché de datos y router.
export function renderizar(ui: ReactElement, { ruta = '/', estado }: Opciones = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  return {
    usuario: userEvent.setup(),
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[{ pathname: ruta, state: estado }]}>{ui}</MemoryRouter>
      </QueryClientProvider>,
    ),
  }
}
