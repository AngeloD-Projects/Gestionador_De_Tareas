import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useProyectos } from '@/features/proyectos'
import { useUsuarios } from '@/features/usuarios'
import { aApiError } from '@/shared/api/apiError'
import { AlertaError } from '@/shared/components/AlertaError'
import { BotonCarga } from '@/shared/components/BotonCarga'
import { CampoAreaTexto } from '@/shared/components/form/CampoAreaTexto'
import { CampoSelector } from '@/shared/components/form/CampoSelector'
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
import { useActualizarTarea, useCrearTarea } from '../hooks/useGuardarTarea'
import { OPCIONES_ESTADO, OPCIONES_PRIORIDAD } from '../lib/opciones'
import { aActualizarRequest, aCrearRequest, valoresIniciales } from '../lib/tareaFormulario'
import { tareaSchema, type TareaFormulario } from '../schemas/tareaSchema'
import type { Tarea } from '../types'

const CAMPOS = [
  'titulo',
  'descripcion',
  'proyectoId',
  'asignadoAId',
  'prioridad',
  'estadoFlujo',
  'fechaVencimiento',
] as const

interface TareaFormDialogProps {
  abierto: boolean
  alCambiarAbierto: (abierto: boolean) => void
  /** Sin tarea: crear. Con tarea: editarla. */
  tarea?: Tarea
}

// Un solo formulario para crear y editar.
export function TareaFormDialog({ abierto, alCambiarAbierto, tarea }: TareaFormDialogProps) {
  return (
    <Dialog open={abierto} onOpenChange={alCambiarAbierto}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{tarea ? 'Editar tarea' : 'Nueva tarea'}</DialogTitle>
          <DialogDescription>
            {tarea ? `Proyecto: ${tarea.proyectoNombre}` : 'Se crea en estado Pendiente.'}
          </DialogDescription>
        </DialogHeader>
        {/* key: al pasar de una tarea a otra, el formulario se reinicia con sus datos. */}
        <FormularioTarea
          key={tarea?.id ?? 'nueva'}
          tarea={tarea}
          alGuardar={() => alCambiarAbierto(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function FormularioTarea({ tarea, alGuardar }: { tarea?: Tarea; alGuardar: () => void }) {
  const esEdicion = Boolean(tarea)
  const crear = useCrearTarea()
  const actualizar = useActualizarTarea()
  const mutacion = esEdicion ? actualizar : crear

  const proyectos = useProyectos()
  const usuarios = useUsuarios()

  const { control, handleSubmit, setError } = useForm<TareaFormulario>({
    resolver: zodResolver(tareaSchema),
    defaultValues: valoresIniciales(tarea),
  })

  const errorApi = mutacion.error ? aApiError(mutacion.error) : null
  const errorGeneral = errorApi && !errorApi.errores ? errorApi.mensaje : null

  const opciones = {
    onSuccess: alGuardar,
    onError: (error: Error) => aplicarErroresDelServidor(aApiError(error), setError, CAMPOS),
  }

  const enviar = handleSubmit((valores) =>
    tarea
      ? actualizar.mutate({ id: tarea.id, datos: aActualizarRequest(valores) }, opciones)
      : crear.mutate(aCrearRequest(valores), opciones),
  )

  const opcionesProyecto = (proyectos.data ?? []).map((p) => ({
    valor: String(p.id),
    etiqueta: p.nombre,
  }))
  const opcionesUsuario = (usuarios.data ?? []).map((u) => ({
    valor: String(u.id),
    etiqueta: u.rol === 'Admin' ? `${u.nombreUsuario} (Admin)` : u.nombreUsuario,
  }))

  return (
    <form onSubmit={enviar} noValidate>
      <FieldGroup>
        {errorGeneral && <AlertaError mensaje={errorGeneral} />}

        <CampoTexto control={control} name="titulo" etiqueta="Título" autoFocus />
        <CampoAreaTexto
          control={control}
          name="descripcion"
          etiqueta="Descripción"
          ayuda="Opcional."
          rows={3}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <CampoSelector
            control={control}
            name="proyectoId"
            etiqueta="Proyecto"
            opciones={opcionesProyecto}
            placeholder={proyectos.isPending ? 'Cargando...' : 'Selecciona un proyecto'}
            // El backend no permite mover una tarea a otro proyecto.
            disabled={esEdicion}
          />
          <CampoSelector
            control={control}
            name="asignadoAId"
            etiqueta="Asignar a"
            opciones={opcionesUsuario}
            opcionVacia="Sin asignar"
          />
          <CampoSelector
            control={control}
            name="prioridad"
            etiqueta="Prioridad"
            opciones={OPCIONES_PRIORIDAD}
          />
          <CampoTexto
            control={control}
            name="fechaVencimiento"
            etiqueta="Vence"
            type="date"
            ayuda="Opcional."
          />
          {esEdicion && (
            <CampoSelector
              control={control}
              name="estadoFlujo"
              etiqueta="Estado"
              opciones={OPCIONES_ESTADO}
            />
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <BotonCarga type="submit" cargando={mutacion.isPending} textoCargando="Guardando...">
            {esEdicion ? 'Guardar cambios' : 'Crear tarea'}
          </BotonCarga>
        </DialogFooter>
      </FieldGroup>
    </form>
  )
}
