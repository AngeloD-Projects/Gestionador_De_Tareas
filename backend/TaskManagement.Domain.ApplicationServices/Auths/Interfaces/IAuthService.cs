using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.ApplicationServices.Usuarios;

namespace TaskManagement.Domain.ApplicationServices.Auths.Interfaces
{
    public interface IAuthService
    {
        Task<UsuarioResponse> RegistrarAsync(RegistroUsuarioRequest request);
        Task<LoginResponse> LoginAsync(LoginRequest request);
        Task<LoginResponse> RefrescarTokenAsync(RefrescarTokenRequest request);
        Task<bool> LogoutAsync(RefrescarTokenRequest request);
    }
}
