import { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { configurarAutenticacion, httpClient } from './httpClient'

// Backend simulado: acepta solo el token "valido-N" vigente; cualquier otro recibe 401.
let tokenVigente = 'valido-1'
const peticionesRecibidas: (string | undefined)[] = []

const backendSimulado: AxiosAdapter = async (config: InternalAxiosRequestConfig) => {
  const autorizacion = config.headers.Authorization as string | undefined
  peticionesRecibidas.push(autorizacion)

  if (autorizacion !== `Bearer ${tokenVigente}`) {
    const respuesta = {
      data: { status: 401, mensaje: 'No autorizado' },
      status: 401,
      statusText: 'Unauthorized',
      headers: {},
      config,
    }
    throw new AxiosError('401', AxiosError.ERR_BAD_REQUEST, config, null, respuesta)
  }
  return { data: { ok: true }, status: 200, statusText: 'OK', headers: {}, config }
}

describe('httpClient', () => {
  let tokenGuardado: string | null
  const refrescarSesion = vi.fn<() => Promise<string>>()
  const alExpirarSesion = vi.fn()

  beforeEach(() => {
    httpClient.defaults.adapter = backendSimulado
    peticionesRecibidas.length = 0
    tokenVigente = 'valido-1'
    tokenGuardado = 'valido-1'
    refrescarSesion.mockReset()
    alExpirarSesion.mockReset()

    configurarAutenticacion({
      obtenerAccessToken: () => tokenGuardado,
      refrescarSesion,
      alExpirarSesion,
    })
  })

  it('envía el token en cada petición', async () => {
    await httpClient.get('/tareas')

    expect(peticionesRecibidas).toEqual(['Bearer valido-1'])
  })

  it('si el token venció, lo renueva y reintenta la petición', async () => {
    tokenVigente = 'valido-2' // el backend ya no acepta valido-1
    refrescarSesion.mockImplementation(async () => (tokenGuardado = 'valido-2'))

    const respuesta = await httpClient.get('/tareas')

    expect(respuesta.status).toBe(200)
    expect(refrescarSesion).toHaveBeenCalledOnce()
    expect(peticionesRecibidas).toEqual(['Bearer valido-1', 'Bearer valido-2'])
  })

  it('con varias peticiones vencidas a la vez, hace UN SOLO refresh y todas se reintentan', async () => {
    tokenVigente = 'valido-2'
    refrescarSesion.mockImplementation(async () => {
      await new Promise((resolver) => setTimeout(resolver, 20)) // el refresh tarda: las demás esperan
      return (tokenGuardado = 'valido-2')
    })

    const respuestas = await Promise.all([
      httpClient.get('/tareas'),
      httpClient.get('/proyectos'),
      httpClient.get('/usuarios'),
      httpClient.get('/tareas/mis-tareas'),
      httpClient.get('/tareas/1'),
    ])

    expect(respuestas.every((r) => r.status === 200)).toBe(true)
    expect(refrescarSesion).toHaveBeenCalledOnce()
    expect(alExpirarSesion).not.toHaveBeenCalled()
  })

  it('si el refresh falla, cierra la sesión y propaga el 401', async () => {
    tokenVigente = 'valido-2'
    refrescarSesion.mockRejectedValue(new Error('Refresh token inválido'))

    await expect(httpClient.get('/tareas')).rejects.toMatchObject({ response: { status: 401 } })
    expect(alExpirarSesion).toHaveBeenCalledOnce()
  })

  it('no entra en un bucle: si tras renovar sigue en 401, no vuelve a refrescar', async () => {
    tokenVigente = 'nunca-coincide'
    refrescarSesion.mockImplementation(async () => (tokenGuardado = 'valido-2'))

    await expect(httpClient.get('/tareas')).rejects.toMatchObject({ response: { status: 401 } })
    expect(refrescarSesion).toHaveBeenCalledOnce()
    expect(peticionesRecibidas).toHaveLength(2)
  })

  it('no intenta refrescar ante errores que no son 401', async () => {
    httpClient.defaults.adapter = async (config) => {
      const respuesta = {
        data: { status: 403, mensaje: 'Prohibido' },
        status: 403,
        statusText: 'Forbidden',
        headers: {},
        config,
      }
      throw new AxiosError('403', AxiosError.ERR_BAD_REQUEST, config, null, respuesta)
    }

    await expect(httpClient.get('/tareas')).rejects.toMatchObject({ response: { status: 403 } })
    expect(refrescarSesion).not.toHaveBeenCalled()
  })
})
