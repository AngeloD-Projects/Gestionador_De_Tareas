import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { toast, Toaster } from 'sonner'
import { alCerrarSesion, conectarSesionConHttpClient } from '@/features/auth'
import { aApiError } from '@/shared/api/apiError'
import { useTema } from '@/shared/hooks/useTema'

// Una sola instancia para toda la app: es la caché de los datos que vienen de la API.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // Un 4xx no se arregla reintentando (permiso, no existe...); solo se reintentan fallas de red o 5xx.
      retry: (intentos, error) => intentos < 1 && aApiError(error).status >= 500,
    },
  },
  // Errores de acciones (crear, editar, eliminar...): un solo lugar los muestra al usuario.
  // Un formulario que muestra sus propios errores puede silenciarlo con meta: { silenciarError: true }.
  mutationCache: new MutationCache({
    onError: (error, _variables, _contexto, mutacion) => {
      if (mutacion.meta?.silenciarError) return
      toast.error(aApiError(error).mensaje)
    },
  }),
})

// Se hace una vez al cargar la app, fuera de React.
conectarSesionConHttpClient()
// Al cerrar sesión se borra la caché: el próximo usuario no ve datos del anterior.
alCerrarSesion(() => queryClient.clear())

// Siempre montado: mantiene aplicado el tema en toda la app y las notificaciones lo siguen.
function NotificacionesConTema() {
  const { esOscuro } = useTema()
  return <Toaster richColors position="top-right" theme={esOscuro ? 'dark' : 'light'} />
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <NotificacionesConTema />
    </QueryClientProvider>
  )
}
