import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'

// TEMPORAL: solo comprueba que Tailwind, shadcn/ui y las notificaciones funcionan.
// Se elimina en la Fase 2, cuando existan el login y los layouts.
export function MaquetaPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">TaskManagement</h1>
      <p className="text-muted-foreground">Maqueta del frontend lista.</p>
      <Button onClick={() => toast.success('Tailwind, shadcn/ui y sonner funcionan.')}>
        Probar
      </Button>
    </main>
  )
}
