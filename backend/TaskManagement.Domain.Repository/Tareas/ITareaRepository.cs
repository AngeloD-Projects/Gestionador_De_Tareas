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
        /// <returns>Id de la tarea creada, o un código negativo de <see cref="CodigosResultadoTarea"/>.</returns>
        Task<int> CrearAsync(Tarea tarea);
        Task<IList<TareaDetalle>> ObtenerTodasAsync(int? proyectoId, EstadoFlujoTarea? estadoFlujo);
        Task<IList<TareaDetalle>> ObtenerPorUsuarioAsignadoAsync(int usuarioId);
        Task<TareaDetalle?> ObtenerPorIdAsync(int id);
        /// <returns>1 si se actualizó, o un código de <see cref="CodigosResultadoTarea"/>.</returns>
        Task<int> ActualizarCompletaAsync(Tarea tarea);
        Task<bool> ActualizarEstadoFlujoAsync(int id, EstadoFlujoTarea estadoFlujo);
        Task<bool> EliminarAsync(int id);
    }

    // Códigos que devuelven sp_Tarea_Crear y sp_Tarea_ActualizarCompleta.
    public static class CodigosResultadoTarea
    {
        public const int NoEncontrada = 0;
        public const int ProyectoInvalido = -1;
        public const int UsuarioAsignadoInvalido = -2;
    }
}
