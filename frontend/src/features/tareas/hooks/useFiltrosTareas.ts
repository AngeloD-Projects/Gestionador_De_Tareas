import { useSearchParams } from 'react-router'
import { ESTADOS_FLUJO, type FiltrosTareas } from '../types'

type ClaveFiltro = 'proyecto' | 'estado'

// Los filtros viven en la URL (?proyecto=2&estado=EnProgreso): sobreviven a recargar y se pueden compartir.
// Valores inválidos en la URL se ignoran.
export function useFiltrosTareas() {
  const [params, setParams] = useSearchParams()

  const proyectoId = Number(params.get('proyecto')) || undefined
  const estadoFlujo = ESTADOS_FLUJO.find((estado) => estado === params.get('estado'))

  const filtros: FiltrosTareas = {
    ...(proyectoId && { proyectoId }),
    ...(estadoFlujo && { estadoFlujo }),
  }

  const cambiar = (clave: ClaveFiltro, valor: string) =>
    setParams(
      (actuales) => {
        const nuevos = new URLSearchParams(actuales)
        if (valor) nuevos.set(clave, valor)
        else nuevos.delete(clave)
        return nuevos
      },
      { replace: true },
    )

  return {
    filtros,
    hayFiltros: Boolean(proyectoId || estadoFlujo),
    cambiar,
    limpiar: () => setParams({}, { replace: true }),
  }
}
