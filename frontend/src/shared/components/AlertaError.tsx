import { CircleAlert } from 'lucide-react'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'

// Mensaje de error destacado (errores generales de un formulario o de una carga de datos).
export function AlertaError({ mensaje }: { mensaje: string }) {
  return (
    <Alert variant="destructive">
      <CircleAlert />
      <AlertDescription>{mensaje}</AlertDescription>
    </Alert>
  )
}
