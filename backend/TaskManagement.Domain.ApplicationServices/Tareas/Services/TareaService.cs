using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.ApplicationServices.Exceptions;
using TaskManagement.Domain.ApplicationServices.Tareas.Interfaces;
using TaskManagement.Domain.Repository.Tareas;
using TaskManagement.Domain.Tareas;

namespace TaskManagement.Domain.ApplicationServices.Tareas.Services
{
    public class TareaService : ITareaService
    {
        private readonly ITareaRepository _tareaRepository;

        public TareaService(ITareaRepository tareaRepository)
        {
            _tareaRepository = tareaRepository;
        }

        public async Task<TareaResponse> ActualizarCompletaAsync(int id, ActualizarTareaRequest request)
        {
            var tarea = new Tarea
            {
                Id = id,
                Titulo = request.Titulo,
                Descripcion = request.Descripcion,
                EstadoFlujo = (EstadoFlujoTarea)request.EstadoFlujo,
                Prioridad = (Prioridad)request.Prioridad,
                FechaVencimiento = request.FechaVencimiento,
                AsignadoAId = request.AsignadoAId
            };

            var actualizado = await _tareaRepository.ActualizarCompletaAsync(tarea);
            if (!actualizado)
                throw new NotFoundException("La tarea no existe o no pudo actualizarse.");

            var tareaActualizada = await _tareaRepository.ObtenerPorIdAsync(id);
            return MapearAResponse(tareaActualizada!);
        }

        public async Task<TareaResponse> ActualizarEstadoAsync(int id, ActualizarEstadoTareaRequest request, int usuarioActualId, bool esAdmin)
        {
            var tarea = await _tareaRepository.ObtenerPorIdAsync(id);
            if (tarea == null)
                throw new NotFoundException("La tarea no existe.");

            if (!esAdmin && tarea.AsignadoAId != usuarioActualId)
                throw new ForbiddenException("No tienes permiso para modificar esta tarea.");

            var actualizado = await _tareaRepository.ActualizarEstadoFlujoAsync(
                id, (EstadoFlujoTarea)request.EstadoFlujo);

            if (!actualizado)
                throw new NotFoundException("La tarea no existe o no pudo actualizarse.");

            var tareaActualizada = await _tareaRepository.ObtenerPorIdAsync(id);
            return MapearAResponse(tareaActualizada!);
        }

        public async Task<TareaResponse> CrearAsync(CrearTareaRequest request, int usuarioActualId)
        {
            var tarea = new Tarea
            {
                Titulo = request.Titulo,
                Descripcion = request.Descripcion,
                Prioridad = (Prioridad)request.Prioridad,
                FechaVencimiento = request.FechaVencimiento,
                ProyectoId = request.ProyectoId,
                AsignadoAId = request.AsignadoAId,
                CreadoPorId = usuarioActualId
            };

            var nuevoId = await _tareaRepository.CrearAsync(tarea);
            tarea.Id = nuevoId;

            return MapearAResponse(tarea);
        }

        public async Task EliminarAsync(int id)
        {
            var eliminado = await _tareaRepository.EliminarAsync(id);
            if (!eliminado)
                throw new NotFoundException("La tarea no existe o ya fue eliminada.");
        }

        public async Task<IList<TareaResponse>> ObtenerMisTareasAsync(int usuarioActualId)
        {
            var tareas = await _tareaRepository.ObtenerPorUsuarioAsignadoAsync(usuarioActualId);
            return tareas.Select(MapearAResponse).ToList();
        }

        public async Task<TareaResponse> ObtenerPorIdAsync(int id, int usuarioActualId, bool esAdmin)
        {
            var tarea = await _tareaRepository.ObtenerPorIdAsync(id);
            if (tarea == null)
                throw new NotFoundException("La tarea no existe.");

            if (!esAdmin && tarea.AsignadoAId != usuarioActualId)
                throw new ForbiddenException("No tienes permiso para ver esta tarea.");

            return MapearAResponse(tarea);
        }

        public async Task<IList<TareaResponse>> ObtenerTodasAsync(int? proyectoId, int? estadoFlujo)
        {
            var estado = estadoFlujo.HasValue ? (EstadoFlujoTarea)estadoFlujo.Value : (EstadoFlujoTarea?)null;
            var tareas = await _tareaRepository.ObtenerTodasAsync(proyectoId, estado);
            return tareas.Select(MapearAResponse).ToList();
        }

        private static TareaResponse MapearAResponse(Tarea tarea)
        {
            return new TareaResponse
            {
                Id = tarea.Id,
                Titulo = tarea.Titulo,
                Descripcion = tarea.Descripcion,
                EstadoFlujo = tarea.EstadoFlujo.ToString(),
                Prioridad = tarea.Prioridad.ToString(),
                FechaVencimiento = tarea.FechaVencimiento,
                ProyectoId = tarea.ProyectoId,
                AsignadoAId = tarea.AsignadoAId,
                CreadoPorId = tarea.CreadoPorId,
                FechaCreacion = tarea.FechaCreacion,
                FechaActualizacion = tarea.FechaActualizacion
            };
        }
    }
}
