import { describe, expect, it } from 'vitest'
import type { EstadoFlujo } from '../types'
import { situacionVencimiento } from './vencimiento'

// "Hoy" fijo: 15 de marzo de 2026, a las 23:30 hora de Perú (ya es 16 de marzo en UTC).
const hoy = new Date(2026, 2, 15, 23, 30)

function tarea(fechaVencimiento: string | null, estadoFlujo: EstadoFlujo = 'Pendiente') {
  return { fechaVencimiento, estadoFlujo }
}

describe('situacionVencimiento', () => {
  it('sin fecha', () => {
    expect(situacionVencimiento(tarea(null), hoy)).toBe('sin-fecha')
  })

  it('vencida si el día ya pasó', () => {
    expect(situacionVencimiento(tarea('2026-03-14T00:00:00Z'), hoy)).toBe('vencida')
  })

  it('vence hoy, aunque en UTC ya sea el día siguiente', () => {
    expect(situacionVencimiento(tarea('2026-03-15T00:00:00Z'), hoy)).toBe('vence-hoy')
  })

  it('a tiempo si el día es futuro', () => {
    expect(situacionVencimiento(tarea('2026-03-16T00:00:00Z'), hoy)).toBe('a-tiempo')
  })

  it.each<EstadoFlujo>(['Completada', 'Cancelada'])('una tarea %s nunca está vencida', (estado) => {
    expect(situacionVencimiento(tarea('2020-01-01T00:00:00Z', estado), hoy)).toBe('finalizada')
  })
})
