import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

export interface OpcionSelector {
  valor: string
  etiqueta: string
}

interface SelectorProps {
  /** '' significa "ninguna opción" (se muestra `opcionVacia` o el placeholder). */
  valor: string
  alCambiar: (valor: string) => void
  opciones: OpcionSelector[]
  placeholder?: string
  /** Opción que representa el valor '' (ej: "Todos los proyectos", "Sin asignar"). */
  opcionVacia?: string
  id?: string
  disabled?: boolean
  'aria-label'?: string
  'aria-invalid'?: boolean
  className?: string
}

// Radix no admite '' como valor de una opción: se traduce internamente a una marca y se devuelve ''.
const VACIO = '__vacio__'

export function Selector({
  valor,
  alCambiar,
  opciones,
  placeholder,
  opcionVacia,
  id,
  disabled,
  className,
  ...aria
}: SelectorProps) {
  const valorInterno = valor === '' ? (opcionVacia ? VACIO : '') : valor

  return (
    <Select
      value={valorInterno}
      onValueChange={(nuevo) => alCambiar(nuevo === VACIO ? '' : nuevo)}
      disabled={disabled}
    >
      <SelectTrigger id={id} className={className ?? 'w-full'} {...aria}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {opcionVacia && <SelectItem value={VACIO}>{opcionVacia}</SelectItem>}
        {opciones.map((opcion) => (
          <SelectItem key={opcion.valor} value={opcion.valor}>
            {opcion.etiqueta}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
