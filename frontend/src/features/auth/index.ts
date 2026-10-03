// Puerta de entrada de la feature: solo lo que se exporte aquí puede usarse desde fuera.
export { RutaProtegida } from './components/RutaProtegida'
export { RutaPublica } from './components/RutaPublica'
export { alCerrarSesion, conectarSesionConHttpClient } from './conectarSesion'
export { useCerrarSesion } from './hooks/useCerrarSesion'
export { useSesion } from './hooks/useSesion'
export { LoginPage } from './pages/LoginPage'
export { RegistroPage } from './pages/RegistroPage'
export { ROLES, type Rol, type Usuario } from './types'
