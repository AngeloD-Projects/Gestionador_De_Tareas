import { createBrowserRouter } from 'react-router'
import { MaquetaPage } from './MaquetaPage'

// Todas las rutas de la aplicación se declaran aquí, en un solo lugar.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MaquetaPage />,
  },
])
