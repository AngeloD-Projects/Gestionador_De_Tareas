import { ShieldX } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/shared/components/ui/button'
import { RUTAS } from '@/shared/config/rutas'

export function SinAccesoPage() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <ShieldX className="size-12 text-muted-foreground" />
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">No tienes acceso a esta sección</h1>
        <p className="text-sm text-muted-foreground">
          Tu rol no tiene permiso para ver esta página.
        </p>
      </div>
      <Button asChild variant="outline">
        <Link to={RUTAS.inicio}>Volver al inicio</Link>
      </Button>
    </div>
  )
}
