using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Domain.Roles
{
    // Única fuente de verdad de los roles: se usa en el JWT, en [Authorize(Roles = ...)] y en los DTOs.
    public static class RolesSistema
    {
        public const string Admin = "Admin";
        public const string Usuario = "Usuario";

        public const int AdminId = 1;
        public const int UsuarioId = 2;

        public static string ObtenerNombre(int rolId) => rolId switch
        {
            AdminId => Admin,
            _ => Usuario
        };
    }
}
