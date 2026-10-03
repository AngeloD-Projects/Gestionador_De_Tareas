// Mismos nombres que el backend (RolesSistema): una sola fuente para los roles en el front.
export const ROLES = {
  Admin: 'Admin',
  Usuario: 'Usuario',
} as const

export type Rol = (typeof ROLES)[keyof typeof ROLES]

// Contratos de la API (/api/auth/*)
export interface Usuario {
  id: number
  nombreUsuario: string
  email: string
  rol: Rol
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegistroRequest {
  nombreUsuario: string
  email: string
  password: string
}

/** Datos que viajan entre pantallas de auth (state de React Router). */
export interface EstadoNavegacionAuth {
  /** Página que se intentaba abrir sin sesión: se vuelve a ella tras el login. */
  desde?: string
  /** Email recién registrado: se precarga en el login. */
  email?: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiraEn: string
  usuario: Usuario
}
