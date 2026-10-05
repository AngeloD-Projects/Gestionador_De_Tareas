import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { useTema, type Tema } from '@/shared/hooks/useTema'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

const OPCIONES: { tema: Tema; etiqueta: string; icono: typeof Sun }[] = [
  { tema: 'claro', etiqueta: 'Claro', icono: Sun },
  { tema: 'oscuro', etiqueta: 'Oscuro', icono: Moon },
  { tema: 'sistema', etiqueta: 'Según el sistema', icono: Monitor },
]

export function BotonTema() {
  const { tema, esOscuro, cambiarTema } = useTema()
  const Icono = esOscuro ? Moon : Sun

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Cambiar tema">
          <Icono className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {OPCIONES.map(({ tema: opcion, etiqueta, icono: IconoOpcion }) => (
          <DropdownMenuItem key={opcion} onSelect={() => cambiarTema(opcion)}>
            <IconoOpcion />
            {etiqueta}
            {opcion === tema && <Check className="ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
