import { LogOut } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'
import { useCerrarSesion, useSesion } from '@/features/auth'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { BotonTema } from '@/shared/components/BotonTema'
import { BarraNavegando } from './BarraNavegando'
import { ENLACES_NAVEGACION } from './navegacion'

// Estructura de las páginas con sesión: barra superior + contenido.
export function AppLayout() {
  const { usuario } = useSesion()
  const cerrarSesion = useCerrarSesion()

  // RutaProtegida garantiza que hay usuario; el chequeo es solo para TypeScript.
  if (!usuario) return null

  const enlacesVisibles = ENLACES_NAVEGACION.filter((enlace) => enlace.roles.includes(usuario.rol))

  return (
    <div className="min-h-svh bg-muted/30">
      <BarraNavegando />
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
          <span className="font-semibold">TaskManagement</span>

          <nav className="flex flex-1 items-center gap-1">
            {enlacesVisibles.map(({ ruta, texto, icono: Icono }) => (
              <NavLink
                key={ruta}
                to={ruta}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground',
                    isActive && 'bg-muted font-medium text-foreground',
                  )
                }
              >
                <Icono className="size-4" />
                <span className="hidden sm:inline">{texto}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-right text-sm md:block">
              <p className="font-medium">{usuario.nombreUsuario}</p>
              <p className="text-xs text-muted-foreground">{usuario.rol}</p>
            </div>
            <BotonTema />
            <Button variant="ghost" size="sm" onClick={cerrarSesion} aria-label="Cerrar sesión">
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
