import type { ComponentProps } from 'react'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { InputPassword } from './InputPassword'

type PropsInput = Omit<ComponentProps<'input'>, 'name' | 'value' | 'onChange' | 'onBlur'>

interface CampoTextoProps<T extends FieldValues> extends PropsInput {
  control: Control<T>
  name: FieldPath<T>
  etiqueta: string
}

// Campo de texto conectado a React Hook Form: etiqueta + input + mensaje de error, siempre igual.
// Con type="password" muestra el botón para ver/ocultar la contraseña.
export function CampoTexto<T extends FieldValues>({
  control,
  name,
  etiqueta,
  type = 'text',
  ...props
}: CampoTextoProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const inputProps = {
          ...props,
          ...field,
          id: name,
          value: field.value ?? '',
          'aria-invalid': fieldState.invalid,
        }

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={name}>{etiqueta}</FieldLabel>
            {type === 'password' ? (
              <InputPassword {...inputProps} />
            ) : (
              <Input type={type} {...inputProps} />
            )}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}
