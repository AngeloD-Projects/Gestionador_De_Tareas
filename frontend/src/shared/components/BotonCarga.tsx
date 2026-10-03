import { Loader2 } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Button } from '@/shared/components/ui/button'

interface BotonCargaProps extends ComponentProps<typeof Button> {
  cargando: boolean
  /** Texto mientras carga (ej: "Ingresando..."). Si no se indica, se mantiene el texto normal. */
  textoCargando?: string
}

// Botón que se deshabilita y muestra un spinner mientras se envía: evita envíos dobles.
export function BotonCarga({
  cargando,
  textoCargando,
  children,
  disabled,
  ...props
}: BotonCargaProps) {
  return (
    <Button disabled={cargando || disabled} {...props}>
      {cargando && <Loader2 className="size-4 animate-spin" />}
      {cargando && textoCargando ? textoCargando : children}
    </Button>
  )
}
