// Todas las URLs de la app en un solo lugar: ningún componente escribe una ruta a mano.
export const RUTAS = {
  inicio: '/',
  login: '/login',
  registro: '/registro',
  misTareas: '/mis-tareas',
  proyectos: '/proyectos',
  gestionTareas: '/admin/tareas',
  sinAcceso: '/sin-acceso',
} as const
