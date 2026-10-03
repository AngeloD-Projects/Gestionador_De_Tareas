import { SearchX } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/shared/components/ui/button'
import { RUTAS } from '@/shared/config/rutas'

export function NoEncontradoPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <SearchX className="size-12 text-muted-foreground" />
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Página no encontrada</h1>
        <p className="text-sm text-muted-foreground">La dirección que buscas no existe.</p>
      </div>
      <Button asChild variant="outline">
        <Link to={RUTAS.inicio}>Volver al inicio</Link>
      </Button>
    </div>
  )
}
