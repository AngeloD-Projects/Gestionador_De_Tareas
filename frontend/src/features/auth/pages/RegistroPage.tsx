import { Link } from 'react-router'
import { RUTAS } from '@/shared/config/rutas'
import { RegistroForm } from '../components/RegistroForm'

export function RegistroPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold">Crear cuenta</h1>
        <p className="text-sm text-muted-foreground">
          Un administrador te asignará tareas después de registrarte.
        </p>
      </div>
      <RegistroForm />
      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{' '}
        <Link
          to={RUTAS.login}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
