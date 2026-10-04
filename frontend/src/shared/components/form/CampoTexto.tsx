import type { ComponentProps } from 'react'
import type { FieldValues } from 'react-hook-form'
import { Input } from '@/shared/components/ui/input'
import { CampoBase, type CampoBaseProps } from './CampoBase'
import { InputPassword } from './InputPassword'

type PropsInput = Omit<ComponentProps<'input'>, 'name' | 'value' | 'onChange' | 'onBlur' | 'id'>

// Campo de texto de una línea. Con type="password" muestra el botón para ver/ocultar la contraseña.
export function CampoTexto<T extends FieldValues>({
  control,
  name,
  etiqueta,
  ayuda,
  type = 'text',
  ...props
}: CampoBaseProps<T> & PropsInput) {
  return (
    <CampoBase
      control={control}
      name={name}
      etiqueta={etiqueta}
      ayuda={ayuda}
      renderControl={(campo) => {
        const inputProps = { ...props, ...campo, value: campo.value ?? '' }
        return type === 'password' ? (
          <InputPassword {...inputProps} />
        ) : (
          <Input type={type} {...inputProps} />
        )
      }}
    />
  )
}
