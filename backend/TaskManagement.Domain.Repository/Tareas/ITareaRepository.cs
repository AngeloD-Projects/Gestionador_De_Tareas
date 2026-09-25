using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.Tareas;

namespace TaskManagement.Domain.Repository.Tareas
{
    public interface ITareaRepository
    {
        Task<int> CrearAsync(Tarea tarea);
        Task<IList<Tarea>> ObtenerTodasAsync(int? proyectoId, EstadoFlujoTarea? estadoFlujo);
        Task<IList<Tarea>> ObtenerPorUsuarioAsignadoAsync(int usuarioId);
        Task<Tarea?> ObtenerPorIdAsync(int id);
        Task ActualizarCompletaAsync(Tarea tarea);
        Task ActualizarEstadoFlujoAsync(int id, EstadoFlujoTarea estadoFlujo);
        Task EliminarAsync(int id);
    }
}
