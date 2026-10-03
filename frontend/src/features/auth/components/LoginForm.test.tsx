import { screen } from '@testing-library/react'
import { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderizar } from '@/test/renderizar'
import { authApi } from '../api/authApi'
import { useSesionStore } from '../store/sesionStore'
import { LoginForm } from './LoginForm'

vi.mock('../api/authApi', () => ({ authApi: { login: vi.fn() } }))
const login = vi.mocked(authApi.login)

function errorDelBackend(status: number, mensaje: string) {
  const config = { headers: {} } as InternalAxiosRequestConfig
  const data = { status, mensaje }
  return new AxiosError(mensaje, 'ERR', config, null, {
    data,
    status,
    statusText: '',
    headers: {},
    config,
  })
}

describe('LoginForm', () => {
  beforeEach(() => {
    login.mockReset()
    useSesionStore.getState().cerrarSesion()
  })

  it('valida los campos antes de llamar a la API', async () => {
    const { usuario } = renderizar(<LoginForm />)

    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(await screen.findByText('El email es obligatorio.')).toBeInTheDocument()
    expect(screen.getByText('La contraseña es obligatoria.')).toBeInTheDocument()
    expect(login).not.toHaveBeenCalled()
  })

  it('avisa si el email no tiene formato válido', async () => {
    const { usuario } = renderizar(<LoginForm />)

    await usuario.type(screen.getByLabelText('Email'), 'no-es-un-email')
    await usuario.type(screen.getByLabelText('Contraseña'), '12345678')
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(await screen.findByText('El email no tiene un formato válido.')).toBeInTheDocument()
    expect(login).not.toHaveBeenCalled()
  })

  it('muestra el mensaje del backend cuando las credenciales son incorrectas', async () => {
    login.mockRejectedValue(errorDelBackend(401, 'Email o contraseña incorrectos.'))
    const { usuario } = renderizar(<LoginForm />)

    await usuario.type(screen.getByLabelText('Email'), 'angelo@gmail.com')
    await usuario.type(screen.getByLabelText('Contraseña'), 'incorrecta')
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(await screen.findByText('Email o contraseña incorrectos.')).toBeInTheDocument()
    expect(useSesionStore.getState().usuario).toBeNull()
  })

  it('con credenciales correctas guarda la sesión', async () => {
    login.mockResolvedValue({
      accessToken: 'access',
      refreshToken: 'refresh',
      expiraEn: '2026-12-31T00:00:00Z',
      usuario: { id: 1, nombreUsuario: 'Angelo', email: 'angelo@gmail.com', rol: 'Admin' },
    })
    const { usuario } = renderizar(<LoginForm />)

    await usuario.type(screen.getByLabelText('Email'), 'angelo@gmail.com')
    await usuario.type(screen.getByLabelText('Contraseña'), '12345678')
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    await vi.waitFor(() => expect(useSesionStore.getState().usuario?.nombreUsuario).toBe('Angelo'))
    expect(login.mock.calls[0][0]).toEqual({ email: 'angelo@gmail.com', password: '12345678' })
  })

  it('precarga el email que llega desde el registro', () => {
    renderizar(<LoginForm />, { ruta: '/login', estado: { email: 'nuevo@test.com' } })

    expect(screen.getByLabelText('Email')).toHaveValue('nuevo@test.com')
  })
})
