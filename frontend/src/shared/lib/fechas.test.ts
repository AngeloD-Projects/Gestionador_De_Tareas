import { describe, expect, it } from 'vitest'
import { formatearDia, formatearFecha, formatearFechaHora } from './fechas'

// Los tests corren con TZ = America/Lima (UTC-5), configurado en vite.config.ts.
describe('fechas', () => {
  it('un instante UTC se muestra en hora de Perú', () => {
    expect(formatearFechaHora('2026-10-02T19:02:42Z')).toBe('2 oct 2026, 14:02')
  })

  it('un día de vencimiento se muestra como ese mismo día, sin correrse por la zona horaria', () => {
    expect(formatearDia('2026-12-31T00:00:00Z')).toBe('31 dic 2026')
    expect(formatearDia('2026-01-01T00:00:00Z')).toBe('1 ene 2026')
  })

  it('(por qué existe formatearDia) tratarlo como instante lo correría al día anterior', () => {
    expect(formatearFecha('2026-12-31T00:00:00Z')).toBe('30 dic 2026')
  })
})
