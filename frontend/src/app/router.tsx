import { createBrowserRouter, type RouteObject } from 'react-router'
import { LoginPage, RegistroPage, ROLES, RutaProtegida, RutaPublica } from '@/features/auth'
import { ProyectosPage } from '@/features/proyectos'
import { GestionTareasPage, MisTareasPage } from '@/features/tareas'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { RUTAS } from '@/shared/config/rutas'
import { InicioPage } from './pages/InicioPage'
import { NoEncontradoPage } from './pages/NoEncontradoPage'
import { SinAccesoPage } from './pages/SinAccesoPage'

// Todas las rutas de la aplicación se declaran aquí, en un solo lugar.
export const rutas: RouteObject[] = [
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
          { path: RUTAS.misTareas, element: <MisTareasPage /> },
          { path: RUTAS.proyectos, element: <ProyectosPage /> },
          { path: RUTAS.sinAcceso, element: <SinAccesoPage /> },
          {
            // Solo Admin.
            element: <RutaProtegida rolesPermitidos={[ROLES.Admin]} />,
            children: [{ path: RUTAS.gestionTareas, element: <GestionTareasPage /> }],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NoEncontradoPage /> },
]

export const router = createBrowserRouter(rutas)
