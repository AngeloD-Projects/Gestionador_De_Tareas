import { Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'
import { Button } from '@/shared/components/ui/button'

interface ConfirmarDialogProps {
  abierto: boolean
  alCambiarAbierto: (abierto: boolean) => void
  titulo: string
  descripcion: string
  textoConfirmar: string
  alConfirmar: () => void
  cargando?: boolean
}

// Confirmación para acciones que no se pueden deshacer fácilmente (eliminar, cancelar...).
export function ConfirmarDialog({
  abierto,
  alCambiarAbierto,
  titulo,
  descripcion,
  textoConfirmar,
  alConfirmar,
  cargando = false,
}: ConfirmarDialogProps) {
  return (
    <AlertDialog open={abierto} onOpenChange={alCambiarAbierto}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{titulo}</AlertDialogTitle>
          <AlertDialogDescription>{descripcion}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={cargando}>Cancelar</AlertDialogCancel>
          {/* Botón normal (no AlertDialogAction): el diálogo se cierra cuando la acción termina, no antes. */}
          <Button variant="destructive" onClick={alConfirmar} disabled={cargando}>
            {cargando && <Loader2 className="size-4 animate-spin" />}
            {textoConfirmar}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
