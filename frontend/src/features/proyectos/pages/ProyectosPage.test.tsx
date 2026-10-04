import { screen, within } from '@testing-library/react'
import { AxiosError, type AxiosAdapter } from 'axios'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSesionStore } from '@/features/auth/store/sesionStore'
import { httpClient } from '@/shared/api/httpClient'
import { renderizar } from '@/test/renderizar'
import type { Proyecto } from '../types'
import { ProyectosPage } from './ProyectosPage'

// Backend simulado con estado: lo que se crea aparece en el siguiente GET.
let proyectos: Proyecto[] = []
let fallarListado = false
const cuerposPost: unknown[] = []

const backendSimulado: AxiosAdapter = async (config) => {
  const respuesta = (data: unknown, status = 200) => ({
    data,
    status,
    statusText: '',
    headers: {},
    config,
  })

  if (config.method === 'get' && config.url === '/proyectos') {
    if (fallarListado) {
      const data = { status: 500, mensaje: 'Ocurrió un error inesperado. Intenta nuevamente.' }
      throw new AxiosError('500', 'ERR', config, null, respuesta(data, 500))
    }
    return respuesta(proyectos)
  }
  if (config.method === 'post' && config.url === '/proyectos') {
    const cuerpo = JSON.parse(config.data as string) as {
      nombre: string
      descripcion: string | null
    }
    cuerposPost.push(cuerpo)
    const nuevo = proyecto({ id: proyectos.length + 1, ...cuerpo })
    proyectos = [nuevo, ...proyectos]
    return respuesta(nuevo, 201)
  }
  throw new Error(`Ruta no simulada: ${config.method} ${config.url}`)
}

function proyecto(datos: Partial<Proyecto>): Proyecto {
  return {
    id: 1,
    nombre: 'Proyecto',
    descripcion: null,
    creadoPorId: 1,
    creadoPorNombre: 'Angelo Donatto',
    fechaCreacion: '2026-10-02T19:02:42Z',
    totalTareas: 0,
    tareasCompletadas: 0,
    ...datos,
  }
}

function iniciarSesionComo(rol: 'Admin' | 'Usuario') {
  useSesionStore.getState().guardarSesion({
    accessToken: 'a',
    refreshToken: 'r',
    expiraEn: '2099-01-01T00:00:00Z',
    usuario: { id: 1, nombreUsuario: 'Angelo', email: 'a@test.com', rol },
  })
}

describe('ProyectosPage', () => {
  beforeEach(() => {
    httpClient.defaults.adapter = backendSimulado
    proyectos = []
    fallarListado = false
    cuerposPost.length = 0
  })

  it('muestra cada proyecto con su progreso', async () => {
    proyectos = [
      proyecto({ id: 1, nombre: 'Web', totalTareas: 4, tareasCompletadas: 1 }),
      proyecto({ id: 2, nombre: 'App móvil', descripcion: 'Versión iOS y Android' }),
    ]
    iniciarSesionComo('Usuario')
    renderizar(<ProyectosPage />)

    expect(await screen.findByText('Web')).toBeInTheDocument()
    expect(screen.getByText('1 de 4 tareas completadas')).toBeInTheDocument()
    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(screen.getByText('App móvil')).toBeInTheDocument()
    expect(screen.getByText('Sin tareas todavía')).toBeInTheDocument()
  })

  it('el Usuario no ve el botón "Nuevo proyecto"; el Admin sí', async () => {
    iniciarSesionComo('Usuario')
    const { unmount } = renderizar(<ProyectosPage />)
    expect(await screen.findByText('Aún no hay proyectos')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Nuevo proyecto/ })).not.toBeInTheDocument()
    unmount()

    iniciarSesionComo('Admin')
    renderizar(<ProyectosPage />)
    expect(await screen.findByRole('button', { name: /Nuevo proyecto/ })).toBeInTheDocument()
  })

  it('si el listado falla, muestra el error y permite reintentar', async () => {
    fallarListado = true
    iniciarSesionComo('Usuario')
    const { usuario } = renderizar(<ProyectosPage />)

    expect(await screen.findByText(/error inesperado/)).toBeInTheDocument()

    fallarListado = false
    proyectos = [proyecto({ nombre: 'Recuperado' })]
    await usuario.click(screen.getByRole('button', { name: /Reintentar/ }))

    expect(await screen.findByText('Recuperado')).toBeInTheDocument()
  })

  it('el Admin crea un proyecto: valida, envía y la lista se actualiza', async () => {
    iniciarSesionComo('Admin')
    const { usuario } = renderizar(<ProyectosPage />)

    await usuario.click(await screen.findByRole('button', { name: /Nuevo proyecto/ }))
    const modal = await screen.findByRole('dialog')

    // Validación: sin nombre no se envía.
    await usuario.click(within(modal).getByRole('button', { name: 'Crear proyecto' }))
    expect(
      await within(modal).findByText('El nombre del proyecto es obligatorio.'),
    ).toBeInTheDocument()
    expect(cuerposPost).toHaveLength(0)

    await usuario.type(within(modal).getByLabelText('Nombre'), 'Portal de clientes')
    await usuario.click(within(modal).getByRole('button', { name: 'Crear proyecto' }))

    // La descripción vacía se envía como null; el modal se cierra y el proyecto aparece.
    expect(await screen.findByText('Portal de clientes')).toBeInTheDocument()
    expect(cuerposPost).toEqual([{ nombre: 'Portal de clientes', descripcion: null }])
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
