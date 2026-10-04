import { useNavigation } from 'react-router'

// Barra fina arriba mientras se carga la página a la que se navega: el clic tiene respuesta inmediata.
export function BarraNavegando() {
  const navegando = useNavigation().state === 'loading'
  if (!navegando) return null

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-primary/20"
      role="progressbar"
      aria-label="Cargando página"
    >
      <div className="h-full w-1/3 animate-pulse bg-primary" />
    </div>
  )
}
