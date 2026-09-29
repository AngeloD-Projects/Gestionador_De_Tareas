using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.Usuarios;

namespace TaskManagement.Domain.ApplicationServices.Auths.Interfaces
{
    public interface IJwtTokenGenerator
    {
        string GenerarAccessToken(Usuario usuario, string nombreRol);
        DateTime ObtenerExpiracionAccessToken();
    }
}
