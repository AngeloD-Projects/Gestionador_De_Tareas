import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { aApiError } from '@/shared/api/apiError'
import { AlertaError } from '@/shared/components/AlertaError'
import { BotonCarga } from '@/shared/components/BotonCarga'
import { CampoTexto } from '@/shared/components/form/CampoTexto'
import { FieldGroup } from '@/shared/components/ui/field'
import { aplicarErroresDelServidor } from '@/shared/lib/formularios'
import { useRegistro } from '../hooks/useRegistro'
import { registroSchema, type RegistroFormulario } from '../schemas/authSchemas'

const CAMPOS = ['nombreUsuario', 'email', 'password'] as const

export function RegistroForm() {
  const registro = useRegistro()

  const { control, handleSubmit, setError } = useForm<RegistroFormulario>({
    resolver: zodResolver(registroSchema),
    defaultValues: { nombreUsuario: '', email: '', password: '', confirmarPassword: '' },
  })

  const errorApi = registro.error ? aApiError(registro.error) : null
  const errorGeneral = errorApi && !errorApi.errores ? errorApi.mensaje : null

  // confirmarPassword solo existe en el front: no se envía al backend.
  const enviar = handleSubmit(({ nombreUsuario, email, password }) =>
    registro.mutate(
      { nombreUsuario, email, password },
      { onError: (error) => aplicarErroresDelServidor(aApiError(error), setError, CAMPOS) },
    ),
  )

  return (
    <form onSubmit={enviar} noValidate>
      <FieldGroup>
        {errorGeneral && <AlertaError mensaje={errorGeneral} />}
        <CampoTexto
          control={control}
          name="nombreUsuario"
          etiqueta="Nombre de usuario"
          autoComplete="username"
          autoFocus
        />
        <CampoTexto
          control={control}
          name="email"
          etiqueta="Email"
          type="email"
          autoComplete="email"
        />
        <CampoTexto
          control={control}
          name="password"
          etiqueta="Contraseña"
          type="password"
          autoComplete="new-password"
        />
        <CampoTexto
          control={control}
          name="confirmarPassword"
          etiqueta="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
        />
        <BotonCarga type="submit" cargando={registro.isPending} textoCargando="Creando cuenta...">
          Crear cuenta
        </BotonCarga>
      </FieldGroup>
    </form>
  )
}
