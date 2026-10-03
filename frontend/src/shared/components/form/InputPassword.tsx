import { Eye, EyeOff } from 'lucide-react'
import { useState, type ComponentProps } from 'react'
import { Input } from '@/shared/components/ui/input'

// Input de contraseña con botón para mostrarla u ocultarla.
export function InputPassword(props: Omit<ComponentProps<'input'>, 'type'>) {
  const [visible, setVisible] = useState(false)
  const Icono = visible ? EyeOff : Eye

  return (
    <div className="relative">
      <Input {...props} type={visible ? 'text' : 'password'} className="pr-9" />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground hover:text-foreground"
      >
        <Icono className="size-4" />
      </button>
    </div>
  )
}
