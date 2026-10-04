import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { aApiError } from '@/shared/api/apiError'
import { AlertaError } from '@/shared/components/AlertaError'
import { BotonCarga } from '@/shared/components/BotonCarga'
import { CampoAreaTexto } from '@/shared/components/form/CampoAreaTexto'
import { CampoTexto } from '@/shared/components/form/CampoTexto'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { FieldGroup } from '@/shared/components/ui/field'
import { aplicarErroresDelServidor } from '@/shared/lib/formularios'
import { useCrearProyecto } from '../hooks/useCrearProyecto'
import { proyectoSchema, type ProyectoFormulario } from '../schemas/proyectoSchema'

const CAMPOS = ['nombre', 'descripcion'] as const

interface NuevoProyectoDialogProps {
  abierto: boolean
  alCambiarAbierto: (abierto: boolean) => void
}

export function NuevoProyectoDialog({ abierto, alCambiarAbierto }: NuevoProyectoDialogProps) {
  return (
    <Dialog open={abierto} onOpenChange={alCambiarAbierto}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo proyecto</DialogTitle>
          <DialogDescription>Luego podrás crear tareas dentro de él.</DialogDescription>
        </DialogHeader>
        {/* El formulario solo existe mientras el modal está abierto: cada apertura empieza vacía. */}
        <FormularioNuevoProyecto alCrear={() => alCambiarAbierto(false)} />
      </DialogContent>
    </Dialog>
  )
}

function FormularioNuevoProyecto({ alCrear }: { alCrear: () => void }) {
  const crear = useCrearProyecto()

  const { control, handleSubmit, setError } = useForm<ProyectoFormulario>({
    resolver: zodResolver(proyectoSchema),
    defaultValues: { nombre: '', descripcion: '' },
  })

  const errorApi = crear.error ? aApiError(crear.error) : null
  const errorGeneral = errorApi && !errorApi.errores ? errorApi.mensaje : null

  const enviar = handleSubmit(({ nombre, descripcion }) =>
    crear.mutate(
      { nombre, descripcion: descripcion || null },
      {
        onSuccess: alCrear,
        onError: (error) => aplicarErroresDelServidor(aApiError(error), setError, CAMPOS),
      },
    ),
  )

  return (
    <form onSubmit={enviar} noValidate>
      <FieldGroup>
        {errorGeneral && <AlertaError mensaje={errorGeneral} />}
        <CampoTexto control={control} name="nombre" etiqueta="Nombre" autoFocus />
        <CampoAreaTexto
          control={control}
          name="descripcion"
          etiqueta="Descripción"
          ayuda="Opcional. Máximo 500 caracteres."
          rows={3}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <BotonCarga type="submit" cargando={crear.isPending} textoCargando="Creando...">
            Crear proyecto
          </BotonCarga>
        </DialogFooter>
      </FieldGroup>
    </form>
  )
}
