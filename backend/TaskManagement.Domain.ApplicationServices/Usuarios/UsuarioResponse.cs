using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.Roles;
using TaskManagement.Domain.Usuarios;

namespace TaskManagement.Domain.ApplicationServices.Usuarios
{
    public class UsuarioResponse
    {
        public int Id { get; set; }
        public string NombreUsuario { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty;

        public static UsuarioResponse Desde(Usuario usuario)
        {
            return new UsuarioResponse
            {
                Id = usuario.Id,
                NombreUsuario = usuario.NombreUsuario,
                Email = usuario.Email,
                Rol = RolesSistema.ObtenerNombre(usuario.RolId)
            };
        }
    }
}
