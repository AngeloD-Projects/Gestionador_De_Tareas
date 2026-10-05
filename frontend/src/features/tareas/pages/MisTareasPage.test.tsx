import { screen, waitFor, within } from '@testing-library/react'
import { AxiosError, type AxiosAdapter } from 'axios'
import { format } from 'date-fns'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSesionStore } from '@/features/auth/store/sesionStore'
import { httpClient } from '@/shared/api/httpClient'
import { renderizar } from '@/test/renderizar'
import { ESTADOS_FLUJO, type EstadoFlujo, type Tarea } from '../types'
import { MisTareasPage } from './MisTareasPage'

// Backend simulado con la MISMA regla del backend real: el Usuario avanza un paso; el Admin va a cualquiera.
let esAdmin = false
let tareas: Tarea[] = []
const patches: { url?: string; cuerpo: unknown }[] = []
/** Para probar la actualización optimista: el PATCH espera hasta que el test lo libere. */
let liberarPatch: (() => void) | null = null
let demorarPatch = false
let rechazarPatch = false

function transiciones(estado: EstadoFlujo): EstadoFlujo[] {
  if (esAdmin) return ESTADOS_FLUJO.filter((e) => e !== estado)
  const siguiente: Partial<Record<EstadoFlujo, EstadoFlujo>> = {
    Pendiente: 'EnProgreso',
    EnProgreso: 'EnRevision',
    EnRevision: 'Completada',
  }
  return siguiente[estado] ? [siguiente[estado]] : []
}

function tarea(datos: Partial<Tarea>): Tarea {
  const estadoFlujo = datos.estadoFlujo ?? 'Pendiente'
  return {
    id: 1,
    titulo: 'Tarea',
    descripcion: null,
    estadoFlujo,
    prioridad: 'Media',
    fechaVencimiento: null,
    proyectoId: 1,
    proyectoNombre: 'Proyecto QA',
    asignadoAId: 3,
    asignadoANombre: 'QA Usuario',
    creadoPorId: 1,
    creadoPorNombre: 'Angelo Donatto',
    fechaCreacion: '2026-10-01T10:00:00Z',
    fechaActualizacion: null,
    transicionesPermitidas: transiciones(estadoFlujo),
    ...datos,
  }
}

const backendSimulado: AxiosAdapter = async (config) => {
  const respuesta = (data: unknown) => ({ data, status: 200, statusText: '', headers: {}, config })

  if (config.method === 'get' && config.url === '/tareas/mis-tareas') return respuesta(tareas)

  if (config.method === 'patch') {
    const id = Number(config.url?.split('/')[2])
    const { estadoFlujo } = JSON.parse(config.data as string) as { estadoFlujo: EstadoFlujo }
    patches.push({ url: config.url, cuerpo: { estadoFlujo } })
    if (demorarPatch) await new Promise<void>((resolver) => (liberarPatch = resolver))
    if (rechazarPatch) {
      const data = {
        status: 400,
        mensaje: 'No se puede pasar una tarea de Pendiente a EnProgreso.',
      }
      const res = { data, status: 400, statusText: '', headers: {}, config }
      throw new AxiosError('400', 'ERR', config, null, res)
    }
    tareas = tareas.map((t) =>
      t.id === id ? { ...t, estadoFlujo, transicionesPermitidas: transiciones(estadoFlujo) } : t,
    )
    return respuesta(tareas.find((t) => t.id === id))
  }
  // Al cambiar un estado también se refresca el progreso de proyectos.
  if (config.method === 'get' && config.url === '/proyectos') return respuesta([])

  throw new Error(`Ruta no simulada: ${config.method} ${config.url}`)
}

function iniciarSesion(admin: boolean) {
  esAdmin = admin
  useSesionStore.getState().guardarSesion({
    accessToken: 'a',
    refreshToken: 'r',
    expiraEn: '2099-01-01T00:00:00Z',
    usuario: { id: 3, nombreUsuario: 'QA', email: 'qa@test.com', rol: admin ? 'Admin' : 'Usuario' },
  })
}

const columna = (nombre: string) => screen.getByRole('region', { name: nombre })

describe('MisTareasPage', () => {
  beforeEach(() => {
    httpClient.defaults.adapter = backendSimulado
    patches.length = 0
    demorarPatch = false
    rechazarPatch = false
    liberarPatch = null
    iniciarSesion(false)
  })

  it('la tarea cambia de columna AL INSTANTE, antes de que responda el backend', async () => {
    demorarPatch = true
    tareas = [tarea({ id: 4, titulo: 'Optimista', estadoFlujo: 'Pendiente' })]
    const { usuario } = renderizar(<MisTareasPage />)

    const card = await screen.findByRole('generic', { name: 'Optimista' })
    await usuario.click(within(card).getByRole('button', { name: 'Iniciar' }))

    // El backend todavía no respondió, pero la tarjeta ya está en "En progreso".
    expect(await within(columna('En progreso')).findByText('Optimista')).toBeInTheDocument()
    expect(liberarPatch).not.toBeNull()

    liberarPatch?.()
    expect(await screen.findByRole('button', { name: 'Enviar a revisión' })).toBeInTheDocument()
  })

  it('si el backend rechaza el cambio, la tarea vuelve a su columna', async () => {
    rechazarPatch = true
    tareas = [tarea({ id: 5, titulo: 'Rechazada', estadoFlujo: 'Pendiente' })]
    const { usuario } = renderizar(<MisTareasPage />)

    const card = await screen.findByRole('generic', { name: 'Rechazada' })
    await usuario.click(within(card).getByRole('button', { name: 'Iniciar' }))

    await waitFor(() => expect(patches).toHaveLength(1))
    expect(await within(columna('Pendiente')).findByText('Rechazada')).toBeInTheDocument()
    expect(within(columna('En progreso')).queryByText('Rechazada')).not.toBeInTheDocument()
  })

  it('solo las tareas que se pueden mover tienen manija para arrastrar', async () => {
    tareas = [
      tarea({ id: 1, titulo: 'Movible', estadoFlujo: 'Pendiente' }),
      tarea({ id: 2, titulo: 'Terminada', estadoFlujo: 'Completada' }),
    ]
    renderizar(<MisTareasPage />)

    expect(await screen.findByRole('button', { name: 'Arrastrar "Movible"' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Arrastrar "Terminada"' })).not.toBeInTheDocument()
  })

  it('reparte las tareas en columnas por estado y resume lo pendiente', async () => {
    tareas = [
      tarea({ id: 1, titulo: 'Diseñar login', estadoFlujo: 'Pendiente' }),
      tarea({ id: 2, titulo: 'Crear API', estadoFlujo: 'EnProgreso' }),
      tarea({ id: 3, titulo: 'Escribir tests', estadoFlujo: 'Completada' }),
    ]
    renderizar(<MisTareasPage />)

    await screen.findByText('Diseñar login') // espera a que termine de cargar
    expect(within(columna('Pendiente')).getByText('Diseñar login')).toBeInTheDocument()
    expect(within(columna('En progreso')).getByText('Crear API')).toBeInTheDocument()
    expect(within(columna('Completada')).getByText('Escribir tests')).toBeInTheDocument()
    expect(screen.getByText('2 tareas por hacer')).toBeInTheDocument()
    // Sin tareas canceladas, esa columna no aparece.
    expect(screen.queryByRole('region', { name: 'Cancelada' })).not.toBeInTheDocument()
  })

  it('el Usuario avanza una tarea con el botón que indica el backend, y la tarea cambia de columna', async () => {
    tareas = [tarea({ id: 7, titulo: 'Diseñar login', estadoFlujo: 'Pendiente' })]
    const { usuario } = renderizar(<MisTareasPage />)

    const card = await screen.findByRole('generic', { name: 'Diseñar login' })
    await usuario.click(within(card).getByRole('button', { name: 'Iniciar' }))

    expect(await within(columna('En progreso')).findByText('Diseñar login')).toBeInTheDocument()
    expect(patches).toEqual([{ url: '/tareas/7/estado', cuerpo: { estadoFlujo: 'EnProgreso' } }])
    // En la nueva columna, el siguiente paso que ofrece el backend.
    expect(await screen.findByRole('button', { name: 'Enviar a revisión' })).toBeInTheDocument()
  })

  it('una tarea completada no muestra acciones', async () => {
    tareas = [tarea({ id: 1, titulo: 'Listo', estadoFlujo: 'Completada' })]
    renderizar(<MisTareasPage />)

    const card = await screen.findByRole('generic', { name: 'Listo' })
    expect(within(card).queryByRole('button')).not.toBeInTheDocument()
  })

  it('marca las tareas vencidas y las que vencen hoy', async () => {
    const hoy = `${format(new Date(), 'yyyy-MM-dd')}T00:00:00Z`
    tareas = [
      tarea({ id: 1, titulo: 'Atrasada', fechaVencimiento: '2020-01-10T00:00:00Z' }),
      tarea({ id: 2, titulo: 'Para hoy', fechaVencimiento: hoy }),
    ]
    renderizar(<MisTareasPage />)

    expect(await screen.findByText(/Vencida · 10 ene 2020/)).toBeInTheDocument()
    expect(screen.getByText(/Vence hoy/)).toBeInTheDocument()
    expect(screen.getByText('2 tareas por hacer · 1 vencida')).toBeInTheDocument()
  })

  it('sin tareas asignadas muestra el estado vacío', async () => {
    tareas = []
    renderizar(<MisTareasPage />)

    expect(await screen.findByText('No tienes tareas asignadas')).toBeInTheDocument()
  })

  it('el Admin tiene varias opciones: elige desde un menú', async () => {
    iniciarSesion(true)
    tareas = [tarea({ id: 9, titulo: 'Revisar diseño', estadoFlujo: 'EnRevision' })]
    const { usuario } = renderizar(<MisTareasPage />)

    const card = await screen.findByRole('generic', { name: 'Revisar diseño' })
    await usuario.click(within(card).getByRole('button', { name: /Cambiar estado/ }))
    await usuario.click(await screen.findByRole('menuitem', { name: 'Cancelada' }))

    expect(await within(columna('Cancelada')).findByText('Revisar diseño')).toBeInTheDocument()
    expect(patches).toEqual([{ url: '/tareas/9/estado', cuerpo: { estadoFlujo: 'Cancelada' } }])
  })
})
