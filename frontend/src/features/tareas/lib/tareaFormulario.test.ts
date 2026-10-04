import { describe, expect, it } from 'vitest'
import type { Tarea } from '../types'
import { aActualizarRequest, aCrearRequest, valoresIniciales } from './tareaFormulario'

const tarea = {
  id: 5,
  titulo: 'Diseñar login',
  descripcion: null,
  estadoFlujo: 'EnProgreso',
  prioridad: 'Alta',
  fechaVencimiento: '2026-12-31T00:00:00Z',
  proyectoId: 2,
  asignadoAId: null,
} as Tarea

describe('tareaFormulario', () => {
  it('para crear, empieza vacío con prioridad Media', () => {
    expect(valoresIniciales()).toEqual({
      titulo: '',
      descripcion: '',
      proyectoId: '',
      asignadoAId: '',
      prioridad: 'Media',
      estadoFlujo: 'Pendiente',
      fechaVencimiento: '',
    })
  })

  it('para editar, toma los datos de la tarea (el vencimiento como día, sin zona horaria)', () => {
    expect(valoresIniciales(tarea)).toMatchObject({
      titulo: 'Diseñar login',
      descripcion: '',
      proyectoId: '2',
      asignadoAId: '',
      fechaVencimiento: '2026-12-31',
    })
  })

  it('al crear convierte textos vacíos en null y los ids en números', () => {
    const request = aCrearRequest({
      ...valoresIniciales(),
      titulo: '  Nueva tarea  ',
      descripcion: '   ',
      proyectoId: '2',
      asignadoAId: '',
    })

    expect(request).toEqual({
      titulo: 'Nueva tarea',
      descripcion: null,
      prioridad: 'Media',
      fechaVencimiento: null,
      proyectoId: 2,
      asignadoAId: null,
    })
  })

  it('al editar envía el estado y no envía el proyecto (no se puede cambiar)', () => {
    const request = aActualizarRequest({ ...valoresIniciales(tarea), asignadoAId: '3' })

    expect(request).toEqual({
      titulo: 'Diseñar login',
      descripcion: null,
      estadoFlujo: 'EnProgreso',
      prioridad: 'Alta',
      fechaVencimiento: '2026-12-31',
      asignadoAId: 3,
    })
    expect(request).not.toHaveProperty('proyectoId')
  })
})
