import { describe, expect, it } from 'vitest'
import { calcularProgreso } from './progreso'

describe('calcularProgreso', () => {
  it.each([
    [0, 0, 0], // sin tareas: 0 %, no división por cero
    [0, 4, 0],
    [1, 3, 33],
    [2, 3, 67],
    [3, 3, 100],
  ])('%i de %i completadas → %i %%', (completadas, total, esperado) => {
    expect(calcularProgreso(completadas, total)).toBe(esperado)
  })
})
