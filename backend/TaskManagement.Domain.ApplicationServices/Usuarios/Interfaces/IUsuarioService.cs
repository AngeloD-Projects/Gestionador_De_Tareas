using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Domain.ApplicationServices.Usuarios.Interfaces
{
    public interface IUsuarioService
    {
        Task<IList<UsuarioResponse>> ObtenerTodosAsync();
    }
}
