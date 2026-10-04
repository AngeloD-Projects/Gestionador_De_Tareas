import { Loader2 } from 'lucide-react'

// Pantalla completa mientras se descarga el código de la página (primera visita a una ruta diferida).
export function PantallaCarga() {
  return (
    <div className="flex min-h-svh items-center justify-center" role="status" aria-label="Cargando">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </div>
  )
}
