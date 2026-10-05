import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { CLAVE_TEMA } from '@/shared/hooks/useTema'
import { BotonTema } from './BotonTema'

describe('BotonTema', () => {
  afterEach(() => document.documentElement.classList.remove('dark'))

  it('cambia a oscuro, lo aplica a la página y lo recuerda', async () => {
    const usuario = userEvent.setup()
    render(<BotonTema />)

    await usuario.click(screen.getByRole('button', { name: 'Cambiar tema' }))
    await usuario.click(await screen.findByRole('menuitem', { name: 'Oscuro' }))

    expect(document.documentElement).toHaveClass('dark')
    expect(JSON.parse(localStorage.getItem(CLAVE_TEMA)!).state.tema).toBe('oscuro')
  })

  it('volver a claro quita el modo oscuro', async () => {
    const usuario = userEvent.setup()
    render(<BotonTema />)

    await usuario.click(screen.getByRole('button', { name: 'Cambiar tema' }))
    await usuario.click(await screen.findByRole('menuitem', { name: 'Oscuro' }))
    await usuario.click(screen.getByRole('button', { name: 'Cambiar tema' }))
    await usuario.click(await screen.findByRole('menuitem', { name: 'Claro' }))

    expect(document.documentElement).not.toHaveClass('dark')
  })
})
