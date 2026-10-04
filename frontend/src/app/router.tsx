import { createBrowserRouter, type RouteObject } from 'react-router'
import { LoginPage, RegistroPage, ROLES, RutaProtegida, RutaPublica } from '@/features/auth'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { PantallaCarga } from '@/shared/components/PantallaCarga'
import { RUTAS } from '@/shared/config/rutas'
import { InicioPage } from './pages/InicioPage'
import { NoEncontradoPage } from './pages/NoEncontradoPage'
import { SinAccesoPage } from './pages/SinAccesoPage'

// Carga diferida: el código de cada feature se descarga recién al entrar a una de sus páginas.
// El login (lo primero que ve todo el mundo) se carga de inmediato.
const tareas = () => import('@/features/tareas')
const proyectos = () => import('@/features/proyectos')

// Todas las rutas de la aplicación se declaran aquí, en un solo lugar.
const rutasDeLaApp: RouteObject[] = [
  {
    // Sin sesión: login y registro.
    element: <RutaPublica />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: RUTAS.login, element: <LoginPage /> },
          { path: RUTAS.registro, element: <RegistroPage /> },
        ],
      },
    ],
  },
  {
    // Con sesión: cualquier rol.
    element: <RutaProtegida />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: RUTAS.inicio, element: <InicioPage /> },
          {
            path: RUTAS.misTareas,
            lazy: async () => ({ Component: (await tareas()).MisTareasPage }),
          },
          {
            path: RUTAS.proyectos,
            lazy: async () => ({ Component: (await proyectos()).ProyectosPage }),
          },
          { path: RUTAS.sinAcceso, element: <SinAccesoPage /> },
          {
            // Solo Admin.
            element: <RutaProtegida rolesPermitidos={[ROLES.Admin]} />,
            children: [
              {
                path: RUTAS.gestionTareas,
                lazy: async () => ({ Component: (await tareas()).GestionTareasPage }),
              },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NoEncontradoPage /> },
]

// Ruta raíz: si la primera página que se abre es diferida, muestra la pantalla de carga
// mientras llega su código (sin esto, la pantalla queda en blanco).
export const rutas: RouteObject[] = [
  { hydrateFallbackElement: <PantallaCarga />, children: rutasDeLaApp },
]

export const router = createBrowserRouter(rutas)
