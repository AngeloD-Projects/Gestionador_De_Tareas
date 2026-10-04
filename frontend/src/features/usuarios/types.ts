// Contrato de la API (/api/usuarios, solo Admin): usuarios activos, sin datos sensibles.
export interface UsuarioResumen {
  id: number
  nombreUsuario: string
  email: string
  rol: 'Admin' | 'Usuario'
}
