import { describe, expect, it } from 'vitest'
import { esArrastrable, puedeSoltarEn } from './arrastre'

describe('arrastre', () => {
  const pendienteDeUsuario = { transicionesPermitidas: ['EnProgreso' as const] }

  it('solo se puede soltar en un estado que el backend permite', () => {
    expect(puedeSoltarEn(pendienteDeUsuario, 'EnProgreso')).toBe(true)
    expect(puedeSoltarEn(pendienteDeUsuario, 'Completada')).toBe(false)
    expect(puedeSoltarEn(pendienteDeUsuario, 'Cancelada')).toBe(false)
  })

  it('sin transiciones permitidas, la tarea no se puede arrastrar', () => {
    expect(esArrastrable(pendienteDeUsuario)).toBe(true)
    expect(esArrastrable({ transicionesPermitidas: [] })).toBe(false)
  })
})
