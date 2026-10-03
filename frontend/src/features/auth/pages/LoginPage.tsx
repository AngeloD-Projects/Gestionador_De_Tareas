import { Link } from 'react-router'
import { RUTAS } from '@/shared/config/rutas'
import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold">Iniciar sesión</h1>
        <p className="text-sm text-muted-foreground">Ingresa con tu email y contraseña.</p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{' '}
        <Link
          to={RUTAS.registro}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Regístrate
        </Link>
      </p>
    </div>
  )
}
