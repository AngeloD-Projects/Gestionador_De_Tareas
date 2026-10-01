using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Domain.ApplicationServices.Proyectos.Interfaces
{
    public interface IProyectoService
    {
        Task<ProyectoResponse> CrearAsync(CrearProyectoRequest request, int usuarioActualId);
        Task<IList<ProyectoResponse>> ObtenerTodosAsync();
        Task<ProyectoResponse> ObtenerPorIdAsync(int id);
    }
}
