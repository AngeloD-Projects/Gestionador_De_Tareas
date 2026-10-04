import type { ReactNode } from 'react'
import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/shared/components/ui/field'

export interface CampoBaseProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  etiqueta: string
  /** Texto de ayuda debajo del campo (ej: "Opcional"). */
  ayuda?: string
}

/** Props listas para pasar al control (input, textarea, select...). */
export type PropsControl<T extends FieldValues> = ControllerRenderProps<T, FieldPath<T>> & {
  id: string
  'aria-invalid': boolean
}

interface Props<T extends FieldValues> extends CampoBaseProps<T> {
  renderControl: (props: PropsControl<T>) => ReactNode
}

// Lo común a TODOS los campos de formulario: conexión con React Hook Form, etiqueta, ayuda y error.
// Cada tipo de campo (texto, área de texto, selector...) solo decide qué control dibujar.
export function CampoBase<T extends FieldValues>({
  control,
  name,
  etiqueta,
  ayuda,
  renderControl,
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{etiqueta}</FieldLabel>
          {renderControl({ ...field, id: name, 'aria-invalid': fieldState.invalid })}
          {ayuda && !fieldState.invalid && <FieldDescription>{ayuda}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
