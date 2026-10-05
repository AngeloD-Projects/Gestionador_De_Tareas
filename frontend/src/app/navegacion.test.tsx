import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, type AxiosAdapter } from 'axios'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { useSesionStore } from '@/features/auth/store/sesionStore'
import { httpClientPublico } from '@/shared/api/httpClient'
import { rutas } from './router'

// Recorridos completos con las MISMAS rutas de la app. Solo se simula la red (el backend).
const usuarios = {
  'admin@test.com': { id: 1, nombreUsuario: 'Angelo', email: 'admin@test.com', rol: 'Admin' },
  'usuario@test.com': {
    id: 3,
    nombreUsuario: 'QA Usuario',
    email: 'usuario@test.com',
    rol: 'Usuario',
  },
} as const

const llamadas: string[] = []

const backendSimulado: AxiosAdapter = async (config) => {
  llamadas.push(config.url ?? '')
  const ok = (data: unknown) => ({ data, status: 200, statusText: 'OK', headers: {}, config })

  if (config.url === '/auth/login') {
    const { email } = JSON.parse(config.data as string) as { email: keyof typeof usuarios }
    const usuario = usuarios[email]
    if (!usuario) {
      const data = { status: 401, mensaje: 'Email o contraseña incorrectos.' }
      throw new AxiosError('401', 'ERR', config, null, {
        data,
        status: 401,
        statusText: '',
        headers: {},
        config,
      })
    }
    return ok({ accessToken: 'a', refreshToken: 'r', expiraEn: '2099-01-01T00:00:00Z', usuario })
  }
  if (config.url === '/auth/logout') return ok({ revocado: true })
  throw new Error(`Ruta no simulada: ${config.url}`)
}

function abrirApp(ruta: string) {
  const router = createMemoryRouter(rutas, { initialEntries: [ruta] })
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return { usuario: userEvent.setup(), router }
}

async function iniciarSesion(usuario: ReturnType<typeof userEvent.setup>, email: string) {
  await usuario.type(await screen.findByLabelText('Email'), email)
  await usuario.type(screen.getByLabelText('Contraseña'), 'Clave1234')
  await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
}

describe('Navegación y permisos', () => {
  // Las páginas diferidas se compilan la primera vez que se importan (en CI siempre en frío).
  // Se precargan aquí, una sola vez, para que ningún test espere esa compilación a mitad de camino.
  beforeAll(async () => {
    await Promise.all([import('@/features/tareas'), import('@/features/proyectos')])
  }, 60_000)

  beforeEach(() => {
    httpClientPublico.defaults.adapter = backendSimulado
    llamadas.length = 0
    // Navegador "nuevo": sin sesión y sin rastro de quién estuvo antes.
    useSesionStore.getState().cerrarSesion()
    useSesionStore.setState({ ultimoUsuarioId: null })
  })

  it('sin sesión, una página protegida lleva al login', async () => {
    abrirApp('/admin/tareas')

    expect(await screen.findByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })

  it('tras iniciar sesión vuelve a la página que se quería abrir', async () => {
    const { usuario, router } = abrirApp('/admin/tareas')

    await iniciarSesion(usuario, 'admin@test.com')

    expect(await screen.findByRole('heading', { name: 'Gestión de tareas' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/admin/tareas')
  })

  it('el Admin ve "Gestión de tareas" en el menú; el Usuario no', async () => {
    const { usuario } = abrirApp('/login')
    await iniciarSesion(usuario, 'usuario@test.com')

    expect(await screen.findByRole('link', { name: /Mis tareas/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Gestión de tareas/ })).not.toBeInTheDocument()
  })

  it('un Usuario que intenta entrar a una página de Admin ve "Sin acceso"', async () => {
    const { usuario } = abrirApp('/admin/tareas')

    await iniciarSesion(usuario, 'usuario@test.com')

    expect(await screen.findByText('No tienes acceso a esta sección')).toBeInTheDocument()
  })

  it('"/" lleva a cada rol a su pantalla principal', async () => {
    const { usuario, router } = abrirApp('/')
    await iniciarSesion(usuario, 'usuario@test.com')

    expect(await screen.findByRole('heading', { name: 'Mis tareas' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/mis-tareas')
  })

  it('con sesión iniciada, el login ya no se muestra', async () => {
    useSesionStore.getState().guardarSesion({
      accessToken: 'a',
      refreshToken: 'r',
      expiraEn: '2099-01-01T00:00:00Z',
      usuario: usuarios['admin@test.com'],
    })
    const { router } = abrirApp('/login')

    expect(await screen.findByRole('heading', { name: 'Gestión de tareas' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/admin/tareas')
  })

  it('"Salir" revoca la sesión en el backend y vuelve al login', async () => {
    const { usuario } = abrirApp('/login')
    await iniciarSesion(usuario, 'admin@test.com')

    await usuario.click(await screen.findByRole('button', { name: 'Cerrar sesión' }))

    expect(await screen.findByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(llamadas).toContain('/auth/logout')
    expect(useSesionStore.getState().usuario).toBeNull()
  })

  it('(bug) el Admin sale desde una página de Admin y entra un Usuario: va a su inicio, no a "Sin acceso"', async () => {
    const { usuario, router } = abrirApp('/login')
    await iniciarSesion(usuario, 'admin@test.com')
    expect(await screen.findByRole('heading', { name: 'Gestión de tareas' })).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    await iniciarSesion(usuario, 'usuario@test.com')

    expect(await screen.findByRole('heading', { name: 'Mis tareas' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/mis-tareas')
  })

  it('si la sesión vence, la MISMA persona vuelve a la página donde estaba', async () => {
    const { usuario, router } = abrirApp('/login')
    await iniciarSesion(usuario, 'admin@test.com')
    await screen.findByRole('heading', { name: 'Gestión de tareas' })

    // Lo que hace el cliente HTTP cuando el refresh token ya no sirve.
    act(() => useSesionStore.getState().cerrarSesion())
    await iniciarSesion(usuario, 'admin@test.com')

    expect(await screen.findByRole('heading', { name: 'Gestión de tareas' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/admin/tareas')
  })

  it('una ruta inexistente muestra "Página no encontrada"', async () => {
    abrirApp('/no-existe')

    expect(await screen.findByText('Página no encontrada')).toBeInTheDocument()
  })
})
