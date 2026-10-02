using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.Tareas;

namespace TaskManagement.Domain.ApplicationServices.Tareas.Interfaces
{
    public interface ITareaService
    {
        Task<TareaResponse> CrearAsync(CrearTareaRequest request, int usuarioActualId);
        Task<IList<TareaResponse>> ObtenerTodasAsync(int? proyectoId, EstadoFlujoTarea? estadoFlujo);
        Task<IList<TareaResponse>> ObtenerMisTareasAsync(int usuarioActualId, bool esAdmin);
        Task<TareaResponse> ObtenerPorIdAsync(int id, int usuarioActualId, bool esAdmin);
        Task<TareaResponse> ActualizarCompletaAsync(int id, ActualizarTareaRequest request);
        Task<TareaResponse> ActualizarEstadoAsync(int id, ActualizarEstadoTareaRequest request, int usuarioActualId, bool esAdmin);
        Task EliminarAsync(int id);
    }
}
