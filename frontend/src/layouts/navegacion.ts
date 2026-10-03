import { ClipboardList, FolderKanban, ListTodo, type LucideIcon } from 'lucide-react'
import { ROLES, type Rol } from '@/features/auth'
import { RUTAS } from '@/shared/config/rutas'

interface EnlaceNavegacion {
  ruta: string
  texto: string
  icono: LucideIcon
  roles: Rol[]
}

// Menú principal: para agregar una sección, se agrega una línea aquí con los roles que la ven.
export const ENLACES_NAVEGACION: EnlaceNavegacion[] = [
  {
    ruta: RUTAS.misTareas,
    texto: 'Mis tareas',
    icono: ListTodo,
    roles: [ROLES.Usuario, ROLES.Admin],
  },
  {
    ruta: RUTAS.proyectos,
    texto: 'Proyectos',
    icono: FolderKanban,
    roles: [ROLES.Usuario, ROLES.Admin],
  },
  {
    ruta: RUTAS.gestionTareas,
    texto: 'Gestión de tareas',
    icono: ClipboardList,
    roles: [ROLES.Admin],
  },
]
