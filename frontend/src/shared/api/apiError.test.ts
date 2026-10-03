import { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { describe, expect, it } from 'vitest'
import { aApiError } from './apiError'

const config = { headers: {} } as InternalAxiosRequestConfig

function errorHttp(status: number, data: unknown) {
  return new AxiosError('error', 'ERR', config, null, {
    data,
    status,
    statusText: '',
    headers: {},
    config,
  })
}

describe('aApiError', () => {
  it('usa el formato del backend { status, mensaje, errores }', () => {
    const error = errorHttp(400, {
      status: 400,
      mensaje: 'El título es obligatorio.',
      errores: { titulo: ['El título es obligatorio.'] },
    })

    expect(aApiError(error)).toEqual({
      status: 400,
      mensaje: 'El título es obligatorio.',
      errores: { titulo: ['El título es obligatorio.'] },
    })
  })

  it('sin respuesta del servidor, indica problema de conexión', () => {
    const error = new AxiosError('Network Error', 'ERR_NETWORK', config)

    expect(aApiError(error)).toMatchObject({
      status: 0,
      mensaje: expect.stringContaining('conectar'),
    })
  })

  it('con una respuesta sin el formato esperado, da un mensaje genérico', () => {
    expect(aApiError(errorHttp(502, '<html>Bad Gateway</html>'))).toMatchObject({
      status: 502,
      mensaje: expect.stringContaining('inesperado'),
    })
  })

  it('con un error que no es de axios, da un mensaje genérico', () => {
    expect(aApiError(new Error('x'))).toMatchObject({ status: 0 })
  })
})
