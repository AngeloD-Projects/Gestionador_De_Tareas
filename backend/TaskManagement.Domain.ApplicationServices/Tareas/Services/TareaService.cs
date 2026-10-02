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

        // Solo el Admin llega aquí (el controlador lo restringe).
        public async Task<TareaResponse> ActualizarCompletaAsync(int id, ActualizarTareaRequest request)
        {
            var tarea = new Tarea
            {
                Id = id,
                Titulo = request.Titulo,
                Descripcion = request.Descripcion,
                EstadoFlujo = request.EstadoFlujo,
                Prioridad = request.Prioridad,
                FechaVencimiento = request.FechaVencimiento,
                AsignadoAId = request.AsignadoAId
            };

            var resultado = await _tareaRepository.ActualizarCompletaAsync(tarea);
            ValidarResultadoEscritura(resultado);

            if (resultado == CodigosResultadoTarea.NoEncontrada)
                throw new NotFoundException("La tarea no existe.");

            return await ObtenerResponseAsync(id, esAdmin: true);
        }

        public async Task<TareaResponse> ActualizarEstadoAsync(int id, ActualizarEstadoTareaRequest request, int usuarioActualId, bool esAdmin)
        {
            var tarea = await ObtenerTareaExistenteAsync(id);
            ValidarAcceso(tarea, usuarioActualId, esAdmin, "No tienes permiso para modificar esta tarea.");
            ValidarTransicion(tarea.EstadoFlujo, request.EstadoFlujo, esAdmin);

            var actualizado = await _tareaRepository.ActualizarEstadoFlujoAsync(id, request.EstadoFlujo);
            if (!actualizado)
                throw new NotFoundException("La tarea no existe.");

            return await ObtenerResponseAsync(id, esAdmin);
        }

        // Solo el Admin llega aquí (el controlador lo restringe).
        public async Task<TareaResponse> CrearAsync(CrearTareaRequest request, int usuarioActualId)
        {
            var tarea = new Tarea
            {
                Titulo = request.Titulo,
                Descripcion = request.Descripcion,
                Prioridad = request.Prioridad,
                FechaVencimiento = request.FechaVencimiento,
                ProyectoId = request.ProyectoId,
                AsignadoAId = request.AsignadoAId,
                CreadoPorId = usuarioActualId
            };

            var resultado = await _tareaRepository.CrearAsync(tarea);
            ValidarResultadoEscritura(resultado);

            // Se relee para devolver los datos reales de la BD (fecha, nombres).
            return await ObtenerResponseAsync(resultado, esAdmin: true);
        }

        public async Task EliminarAsync(int id)
        {
            var eliminado = await _tareaRepository.EliminarAsync(id);
            if (!eliminado)
                throw new NotFoundException("La tarea no existe o ya fue eliminada.");
        }

        public async Task<IList<TareaResponse>> ObtenerMisTareasAsync(int usuarioActualId, bool esAdmin)
        {
            var tareas = await _tareaRepository.ObtenerPorUsuarioAsignadoAsync(usuarioActualId);
            return tareas.Select(tarea => MapearAResponse(tarea, esAdmin)).ToList();
        }

        public async Task<TareaResponse> ObtenerPorIdAsync(int id, int usuarioActualId, bool esAdmin)
        {
            var tarea = await ObtenerTareaExistenteAsync(id);
            ValidarAcceso(tarea, usuarioActualId, esAdmin, "No tienes permiso para ver esta tarea.");

            return MapearAResponse(tarea, esAdmin);
        }

        // Solo el Admin llega aquí (el controlador lo restringe).
        public async Task<IList<TareaResponse>> ObtenerTodasAsync(int? proyectoId, EstadoFlujoTarea? estadoFlujo)
        {
            var tareas = await _tareaRepository.ObtenerTodasAsync(proyectoId, estadoFlujo);
            return tareas.Select(tarea => MapearAResponse(tarea, esAdmin: true)).ToList();
        }

        private async Task<TareaDetalle> ObtenerTareaExistenteAsync(int id)
        {
            var tarea = await _tareaRepository.ObtenerPorIdAsync(id);
            if (tarea == null)
                throw new NotFoundException("La tarea no existe.");

            return tarea;
        }

        private async Task<TareaResponse> ObtenerResponseAsync(int id, bool esAdmin)
        {
            var tarea = await ObtenerTareaExistenteAsync(id);
            return MapearAResponse(tarea, esAdmin);
        }

        private static void ValidarAcceso(Tarea tarea, int usuarioActualId, bool esAdmin, string mensaje)
        {
            if (!esAdmin && tarea.AsignadoAId != usuarioActualId)
                throw new ForbiddenException(mensaje);
        }

        private static void ValidarTransicion(EstadoFlujoTarea actual, EstadoFlujoTarea nuevo, bool esAdmin)
        {
            if (actual == nuevo)
                throw new BadRequestException($"La tarea ya se encuentra en estado {actual}.");

            if (!esAdmin && nuevo == EstadoFlujoTarea.Cancelada)
                throw new ForbiddenException("Solo un administrador puede cancelar una tarea.");

            if (!FlujoTarea.EsTransicionPermitida(actual, nuevo, esAdmin))
                throw new BadRequestException($"No se puede pasar una tarea de {actual} a {nuevo}.");
        }

        // Traduce los códigos negativos que devuelven sp_Tarea_Crear y sp_Tarea_ActualizarCompleta.
        private static void ValidarResultadoEscritura(int resultado)
        {
            switch (resultado)
            {
                case CodigosResultadoTarea.ProyectoInvalido:
                    throw new BadRequestException("El proyecto indicado no existe o está inactivo.");
                case CodigosResultadoTarea.UsuarioAsignadoInvalido:
                    throw new BadRequestException("El usuario asignado no existe o está inactivo.");
            }
        }

        private static TareaResponse MapearAResponse(TareaDetalle tarea, bool esAdmin)
        {
            return new TareaResponse
            {
                Id = tarea.Id,
                Titulo = tarea.Titulo,
                Descripcion = tarea.Descripcion,
                EstadoFlujo = tarea.EstadoFlujo,
                Prioridad = tarea.Prioridad,
                FechaVencimiento = tarea.FechaVencimiento,
                ProyectoId = tarea.ProyectoId,
                ProyectoNombre = tarea.ProyectoNombre,
                AsignadoAId = tarea.AsignadoAId,
                AsignadoANombre = tarea.AsignadoANombre,
                CreadoPorId = tarea.CreadoPorId,
                CreadoPorNombre = tarea.CreadoPorNombre,
                FechaCreacion = tarea.FechaCreacion,
                FechaActualizacion = tarea.FechaActualizacion,
                TransicionesPermitidas = FlujoTarea.ObtenerTransicionesPermitidas(tarea.EstadoFlujo, esAdmin)
            };
        }
    }
}
