import { screen } from '@testing-library/react'
import { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderizar } from '@/test/renderizar'
import { authApi } from '../api/authApi'
import { RegistroForm } from './RegistroForm'

vi.mock('../api/authApi', () => ({ authApi: { registrar: vi.fn() } }))
const registrar = vi.mocked(authApi.registrar)

function errorDelBackend(status: number, data: object) {
  const config = { headers: {} } as InternalAxiosRequestConfig
  return new AxiosError('error', 'ERR', config, null, {
    data,
    status,
    statusText: '',
    headers: {},
    config,
  })
}

async function completarFormulario(
  usuario: ReturnType<typeof renderizar>['usuario'],
  confirmar = 'Clave1234',
) {
  await usuario.type(screen.getByLabelText('Nombre de usuario'), 'Nuevo Usuario')
  await usuario.type(screen.getByLabelText('Email'), 'nuevo@test.com')
  await usuario.type(screen.getByLabelText('Contraseña'), 'Clave1234')
  await usuario.type(screen.getByLabelText('Confirmar contraseña'), confirmar)
  await usuario.click(screen.getByRole('button', { name: 'Crear cuenta' }))
}

describe('RegistroForm', () => {
  beforeEach(() => {
    registrar.mockReset()
  })

  it('avisa si las contraseñas no coinciden y no llama a la API', async () => {
    const { usuario } = renderizar(<RegistroForm />)

    await completarFormulario(usuario, 'OtraClave99')

    expect(await screen.findByText('Las contraseñas no coinciden.')).toBeInTheDocument()
    expect(registrar).not.toHaveBeenCalled()
  })

  it('no envía la confirmación de contraseña al backend', async () => {
    registrar.mockResolvedValue({
      id: 5,
      nombreUsuario: 'Nuevo Usuario',
      email: 'nuevo@test.com',
      rol: 'Usuario',
    })
    const { usuario } = renderizar(<RegistroForm />)

    await completarFormulario(usuario)

    await vi.waitFor(() => expect(registrar).toHaveBeenCalledOnce())
    expect(registrar.mock.calls[0][0]).toEqual({
      nombreUsuario: 'Nuevo Usuario',
      email: 'nuevo@test.com',
      password: 'Clave1234',
    })
  })

  it('muestra el conflicto del backend (email o nombre ya usados)', async () => {
    registrar.mockRejectedValue(
      errorDelBackend(409, { status: 409, mensaje: 'Ese nombre de usuario ya está en uso.' }),
    )
    const { usuario } = renderizar(<RegistroForm />)

    await completarFormulario(usuario)

    expect(await screen.findByText('Ese nombre de usuario ya está en uso.')).toBeInTheDocument()
  })

  it('pone cada error de validación del backend debajo de su campo', async () => {
    registrar.mockRejectedValue(
      errorDelBackend(400, {
        status: 400,
        mensaje: 'El email no tiene un formato válido.',
        errores: { email: ['El email no tiene un formato válido.'] },
      }),
    )
    const { usuario } = renderizar(<RegistroForm />)

    await completarFormulario(usuario)

    const campoEmail = screen.getByLabelText('Email')
    await vi.waitFor(() => expect(campoEmail).toHaveAttribute('aria-invalid', 'true'))
    expect(screen.getByText('El email no tiene un formato válido.')).toBeInTheDocument()
  })
})
