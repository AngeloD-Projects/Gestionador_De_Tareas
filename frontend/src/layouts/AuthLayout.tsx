import { Outlet } from 'react-router'

// Estructura de login y registro: tarjeta centrada.
export function AuthLayout() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm space-y-6">
        <p className="text-center text-lg font-semibold">TaskManagement</p>
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
