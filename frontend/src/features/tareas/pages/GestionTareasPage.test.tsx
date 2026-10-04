import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { AxiosError, type AxiosAdapter } from 'axios'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSesionStore } from '@/features/auth/store/sesionStore'
import { httpClient } from '@/shared/api/httpClient'
import { renderizar } from '@/test/renderizar'
import { ESTADOS_FLUJO, type EstadoFlujo, type Tarea } from '../types'
import { GestionTareasPage } from './GestionTareasPage'

// ---------------------------------------------------------------------------
// Backend simulado (Admin) con estado: lo que se crea/edita/elimina se refleja en el siguiente GET.
// ---------------------------------------------------------------------------
const proyectos = [
  { id: 1, nombre: 'Web' },
  { id: 2, nombre: 'App móvil' },
]
const usuarios = [
  { id: 1, nombreUsuario: 'Angelo', email: 'a@test.com', rol: 'Admin' },
  { id: 3, nombreUsuario: 'QA Usuario', email: 'qa@test.com', rol: 'Usuario' },
]

let tareas: Tarea[] = []
let siguienteId = 100
let errorAlCrear: { status: number; mensaje: string } | null = null
const peticiones: { metodo?: string; url?: string; params?: unknown; cuerpo?: unknown }[] = []

function tarea(datos: Partial<Tarea>): Tarea {
  const estadoFlujo: EstadoFlujo = datos.estadoFlujo ?? 'Pendiente'
  return {
    id: 1,
    titulo: 'Tarea',
    descripcion: null,
    estadoFlujo,
    prioridad: 'Media',
    fechaVencimiento: null,
    proyectoId: 1,
    proyectoNombre: 'Web',
    asignadoAId: null,
    asignadoANombre: null,
    creadoPorId: 1,
    creadoPorNombre: 'Angelo',
    fechaCreacion: '2026-10-01T10:00:00Z',
    fechaActualizacion: null,
    transicionesPermitidas: ESTADOS_FLUJO.filter((e) => e !== estadoFlujo),
    ...datos,
  }
}

const backendSimulado: AxiosAdapter = async (config) => {
  const respuesta = (data: unknown, status = 200) => ({
    data,
    status,
    statusText: '',
    headers: {},
    config,
  })
  const cuerpo = config.data ? JSON.parse(config.data as string) : undefined
  peticiones.push({ metodo: config.method, url: config.url, params: config.params, cuerpo })

  if (config.url === '/proyectos') return respuesta(proyectos)
  if (config.url === '/usuarios') return respuesta(usuarios)

  if (config.method === 'get' && config.url === '/tareas') {
    const { proyectoId, estadoFlujo } = (config.params ?? {}) as {
      proyectoId?: number
      estadoFlujo?: string
    }
    return respuesta(
      tareas.filter(
        (t) =>
          (!proyectoId || t.proyectoId === proyectoId) &&
          (!estadoFlujo || t.estadoFlujo === estadoFlujo),
      ),
    )
  }
  if (config.method === 'post' && config.url === '/tareas') {
    if (errorAlCrear)
      throw new AxiosError(
        'error',
        'ERR',
        config,
        null,
        respuesta(errorAlCrear, errorAlCrear.status),
      )
    const proyecto = proyectos.find((p) => p.id === cuerpo.proyectoId)!
    const asignado = usuarios.find((u) => u.id === cuerpo.asignadoAId)
    const nueva = tarea({
      ...cuerpo,
      id: siguienteId++,
      proyectoNombre: proyecto.nombre,
      asignadoANombre: asignado?.nombreUsuario ?? null,
    })
    tareas = [nueva, ...tareas]
    return respuesta(nueva, 201)
  }
  const id = Number(config.url?.split('/')[2])
  if (config.method === 'put') {
    tareas = tareas.map((t) => (t.id === id ? tarea({ ...t, ...cuerpo }) : t))
    return respuesta(tareas.find((t) => t.id === id))
  }
  if (config.method === 'delete') {
    tareas = tareas.filter((t) => t.id !== id)
    return respuesta(null, 204)
  }
  throw new Error(`Ruta no simulada: ${config.method} ${config.url}`)
}

const filaDe = (titulo: string) => screen.getByRole('row', { name: titulo })

async function elegir(
  usuario: ReturnType<typeof renderizar>['usuario'],
  campo: HTMLElement,
  opcion: string,
) {
  await usuario.click(campo)
  await usuario.click(await screen.findByRole('option', { name: opcion }))
}

describe('GestionTareasPage', () => {
  beforeEach(() => {
    httpClient.defaults.adapter = backendSimulado
    peticiones.length = 0
    errorAlCrear = null
    tareas = [
      tarea({
        id: 1,
        titulo: 'Diseñar login',
        proyectoId: 1,
        proyectoNombre: 'Web',
        estadoFlujo: 'EnProgreso',
        asignadoAId: 3,
        asignadoANombre: 'QA Usuario',
      }),
      tarea({ id: 2, titulo: 'Publicar en tiendas', proyectoId: 2, proyectoNombre: 'App móvil' }),
    ]
    useSesionStore.getState().guardarSesion({
      accessToken: 'a',
      refreshToken: 'r',
      expiraEn: '2099-01-01T00:00:00Z',
      usuario: { id: 1, nombreUsuario: 'Angelo', email: 'a@test.com', rol: 'Admin' },
    })
  })

  it('lista todas las tareas con su asignado, prioridad y estado', async () => {
    renderizar(<GestionTareasPage />)

    await screen.findByText('Diseñar login')
    expect(within(filaDe('Diseñar login')).getByText('QA Usuario')).toBeInTheDocument()
    expect(within(filaDe('Diseñar login')).getByText('En progreso')).toBeInTheDocument()
    expect(within(filaDe('Publicar en tiendas')).getByText('Sin asignar')).toBeInTheDocument()
  })

  it('filtra por estado pidiéndolo al backend, y avisa cuando no hay coincidencias', async () => {
    const { usuario } = renderizar(<GestionTareasPage />)
    await screen.findByText('Diseñar login')

    await elegir(
      usuario,
      screen.getByRole('combobox', { name: 'Filtrar por estado' }),
      'En progreso',
    )

    await waitFor(() => expect(screen.queryByText('Publicar en tiendas')).not.toBeInTheDocument())
    expect(peticiones).toContainEqual(
      expect.objectContaining({ url: '/tareas', params: { estadoFlujo: 'EnProgreso' } }),
    )

    await elegir(
      usuario,
      screen.getByRole('combobox', { name: 'Filtrar por estado' }),
      'Completada',
    )
    expect(await screen.findByText('Ninguna tarea coincide con los filtros')).toBeInTheDocument()

    await usuario.click(screen.getAllByRole('button', { name: /Limpiar filtros/ })[0])
    expect(await screen.findByText('Publicar en tiendas')).toBeInTheDocument()
  })

  it('crea una tarea: valida, envía los datos convertidos y aparece en la lista', async () => {
    const { usuario } = renderizar(<GestionTareasPage />)
    await screen.findByText('Diseñar login')

    await usuario.click(screen.getByRole('button', { name: /Nueva tarea/ }))
    const modal = await screen.findByRole('dialog')

    await usuario.click(within(modal).getByRole('button', { name: 'Crear tarea' }))
    expect(
      await within(modal).findByText('El título de la tarea es obligatorio.'),
    ).toBeInTheDocument()
    expect(within(modal).getByText('Selecciona un proyecto.')).toBeInTheDocument()

    await usuario.type(within(modal).getByLabelText('Título'), 'Configurar CI')
    await elegir(usuario, within(modal).getByRole('combobox', { name: 'Proyecto' }), 'App móvil')
    await elegir(usuario, within(modal).getByRole('combobox', { name: 'Asignar a' }), 'QA Usuario')
    await elegir(usuario, within(modal).getByRole('combobox', { name: 'Prioridad' }), 'Alta')
    fireEvent.change(within(modal).getByLabelText('Vence'), { target: { value: '2026-12-31' } })
    await usuario.click(within(modal).getByRole('button', { name: 'Crear tarea' }))

    expect(await screen.findByText('Configurar CI')).toBeInTheDocument()
    expect(peticiones.find((p) => p.metodo === 'post')?.cuerpo).toEqual({
      titulo: 'Configurar CI',
      descripcion: null,
      prioridad: 'Alta',
      fechaVencimiento: '2026-12-31',
      proyectoId: 2,
      asignadoAId: 3,
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('si el backend rechaza la creación, muestra su mensaje dentro del modal', async () => {
    errorAlCrear = { status: 400, mensaje: 'El proyecto indicado no existe o está inactivo.' }
    const { usuario } = renderizar(<GestionTareasPage />)
    await screen.findByText('Diseñar login')

    await usuario.click(screen.getByRole('button', { name: /Nueva tarea/ }))
    const modal = await screen.findByRole('dialog')
    await usuario.type(within(modal).getByLabelText('Título'), 'X')
    await elegir(usuario, within(modal).getByRole('combobox', { name: 'Proyecto' }), 'Web')
    await usuario.click(within(modal).getByRole('button', { name: 'Crear tarea' }))

    expect(
      await within(modal).findByText('El proyecto indicado no existe o está inactivo.'),
    ).toBeInTheDocument()
  })

  it('edita una tarea: el formulario viene con sus datos y el proyecto no se puede cambiar', async () => {
    const { usuario } = renderizar(<GestionTareasPage />)
    await screen.findByText('Diseñar login')

    await usuario.click(within(filaDe('Diseñar login')).getByRole('button', { name: 'Editar' }))
    const modal = await screen.findByRole('dialog')

    expect(within(modal).getByLabelText('Título')).toHaveValue('Diseñar login')
    expect(within(modal).getByRole('combobox', { name: 'Proyecto' })).toBeDisabled()

    await usuario.clear(within(modal).getByLabelText('Título'))
    await usuario.type(within(modal).getByLabelText('Título'), 'Diseñar login v2')
    await elegir(usuario, within(modal).getByRole('combobox', { name: 'Estado' }), 'En revisión')
    await usuario.click(within(modal).getByRole('button', { name: 'Guardar cambios' }))

    expect(await screen.findByText('Diseñar login v2')).toBeInTheDocument()
    const put = peticiones.find((p) => p.metodo === 'put')
    expect(put?.url).toBe('/tareas/1')
    expect(put?.cuerpo).toMatchObject({
      titulo: 'Diseñar login v2',
      estadoFlujo: 'EnRevision',
      asignadoAId: 3,
    })
  })

  it('eliminar pide confirmación: "Cancelar" no borra, "Eliminar" sí', async () => {
    const { usuario } = renderizar(<GestionTareasPage />)
    await screen.findByText('Publicar en tiendas')

    await usuario.click(
      within(filaDe('Publicar en tiendas')).getByRole('button', { name: 'Eliminar' }),
    )
    await usuario.click(
      within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Cancelar' }),
    )
    expect(peticiones.some((p) => p.metodo === 'delete')).toBe(false)

    await usuario.click(
      within(filaDe('Publicar en tiendas')).getByRole('button', { name: 'Eliminar' }),
    )
    await usuario.click(
      within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Eliminar' }),
    )

    await waitFor(() => expect(screen.queryByText('Publicar en tiendas')).not.toBeInTheDocument())
    expect(peticiones.find((p) => p.metodo === 'delete')?.url).toBe('/tareas/2')
  })
})
