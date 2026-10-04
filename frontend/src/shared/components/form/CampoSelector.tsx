import type { FieldValues } from 'react-hook-form'
import { Selector, type OpcionSelector } from '@/shared/components/Selector'
import { CampoBase, type CampoBaseProps } from './CampoBase'

interface CampoSelectorProps<T extends FieldValues> extends CampoBaseProps<T> {
  opciones: OpcionSelector[]
  placeholder?: string
  opcionVacia?: string
  disabled?: boolean
}

// Selector conectado a React Hook Form (mismo diseño de etiqueta y error que los demás campos).
export function CampoSelector<T extends FieldValues>({
  opciones,
  placeholder,
  opcionVacia,
  disabled,
  ...base
}: CampoSelectorProps<T>) {
  return (
    <CampoBase
      {...base}
      renderControl={(campo) => (
        <Selector
          id={campo.id}
          valor={campo.value ?? ''}
          alCambiar={campo.onChange}
          opciones={opciones}
          placeholder={placeholder}
          opcionVacia={opcionVacia}
          disabled={disabled || campo.disabled}
          aria-invalid={campo['aria-invalid']}
        />
      )}
    />
  )
}
