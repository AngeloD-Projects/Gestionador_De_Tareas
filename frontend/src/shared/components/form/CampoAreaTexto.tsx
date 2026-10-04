import type { ComponentProps } from 'react'
import type { FieldValues } from 'react-hook-form'
import { Textarea } from '@/shared/components/ui/textarea'
import { CampoBase, type CampoBaseProps } from './CampoBase'

type PropsTextarea = Omit<
  ComponentProps<'textarea'>,
  'name' | 'value' | 'onChange' | 'onBlur' | 'id'
>

// Campo de texto de varias líneas (descripciones).
export function CampoAreaTexto<T extends FieldValues>({
  control,
  name,
  etiqueta,
  ayuda,
  ...props
}: CampoBaseProps<T> & PropsTextarea) {
  return (
    <CampoBase
      control={control}
      name={name}
      etiqueta={etiqueta}
      ayuda={ayuda}
      renderControl={(campo) => <Textarea {...props} {...campo} value={campo.value ?? ''} />}
    />
  )
}
