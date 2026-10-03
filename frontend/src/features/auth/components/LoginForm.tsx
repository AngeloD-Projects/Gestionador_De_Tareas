import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router'
import { aApiError } from '@/shared/api/apiError'
import { AlertaError } from '@/shared/components/AlertaError'
import { BotonCarga } from '@/shared/components/BotonCarga'
import { CampoTexto } from '@/shared/components/form/CampoTexto'
import { FieldGroup } from '@/shared/components/ui/field'
import { aplicarErroresDelServidor } from '@/shared/lib/formularios'
import { useLogin } from '../hooks/useLogin'
import { loginSchema, type LoginFormulario } from '../schemas/authSchemas'
import type { EstadoNavegacionAuth } from '../types'

const CAMPOS = ['email', 'password'] as const

export function LoginForm() {
  const estado = useLocation().state as EstadoNavegacionAuth | null
  const login = useLogin()

  const { control, handleSubmit, setError } = useForm<LoginFormulario>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: estado?.email ?? '', password: '' },
  })

  // Errores por campo van debajo de cada input; el resto (credenciales, bloqueo, conexión) arriba.
  const errorApi = login.error ? aApiError(login.error) : null
  const errorGeneral = errorApi && !errorApi.errores ? errorApi.mensaje : null

  const enviar = handleSubmit((datos) =>
    login.mutate(datos, {
      onError: (error) => aplicarErroresDelServidor(aApiError(error), setError, CAMPOS),
    }),
  )

  return (
    <form onSubmit={enviar} noValidate>
      <FieldGroup>
        {errorGeneral && <AlertaError mensaje={errorGeneral} />}
        <CampoTexto
          control={control}
          name="email"
          etiqueta="Email"
          type="email"
          autoComplete="email"
          autoFocus={!estado?.email}
        />
        <CampoTexto
          control={control}
          name="password"
          etiqueta="Contraseña"
          type="password"
          autoComplete="current-password"
          autoFocus={Boolean(estado?.email)}
        />
        <BotonCarga type="submit" cargando={login.isPending} textoCargando="Ingresando...">
          Iniciar sesión
        </BotonCarga>
      </FieldGroup>
    </form>
  )
}
