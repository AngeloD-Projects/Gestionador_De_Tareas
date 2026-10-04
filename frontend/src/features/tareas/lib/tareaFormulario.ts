import type { TareaFormulario } from '../schemas/tareaSchema'
import type { ActualizarTareaRequest, CrearTareaRequest, Tarea } from '../types'

// Traducción entre la tarea (API) y los valores del formulario (texto), en un solo lugar.

/** Valores iniciales: vacíos para crear, o los de la tarea para editar. */
export function valoresIniciales(tarea?: Tarea): TareaFormulario {
  return {
    titulo: tarea?.titulo ?? '',
    descripcion: tarea?.descripcion ?? '',
    proyectoId: tarea ? String(tarea.proyectoId) : '',
    asignadoAId: tarea?.asignadoAId ? String(tarea.asignadoAId) : '',
    prioridad: tarea?.prioridad ?? 'Media',
    estadoFlujo: tarea?.estadoFlujo ?? 'Pendiente',
    // El input de fecha usa "YYYY-MM-DD": se toma el día tal cual (sin conversión de zona horaria).
    fechaVencimiento: tarea?.fechaVencimiento?.slice(0, 10) ?? '',
  }
}

const textoONull = (texto: string) => texto.trim() || null
const idONull = (id: string) => (id ? Number(id) : null)

export function aCrearRequest(valores: TareaFormulario): CrearTareaRequest {
  return {
    titulo: valores.titulo.trim(),
    descripcion: textoONull(valores.descripcion),
    prioridad: valores.prioridad,
    fechaVencimiento: valores.fechaVencimiento || null,
    proyectoId: Number(valores.proyectoId),
    asignadoAId: idONull(valores.asignadoAId),
  }
}

export function aActualizarRequest(valores: TareaFormulario): ActualizarTareaRequest {
  return {
    titulo: valores.titulo.trim(),
    descripcion: textoONull(valores.descripcion),
    estadoFlujo: valores.estadoFlujo,
    prioridad: valores.prioridad,
    fechaVencimiento: valores.fechaVencimiento || null,
    asignadoAId: idONull(valores.asignadoAId),
  }
}
