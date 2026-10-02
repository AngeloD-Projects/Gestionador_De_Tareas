using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.ApplicationServices.Usuarios;

namespace TaskManagement.Domain.ApplicationServices.Auths
{
    public class LoginResponse
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime ExpiraEn { get; set; }
        public UsuarioResponse Usuario { get; set; } = new();
    }
}
