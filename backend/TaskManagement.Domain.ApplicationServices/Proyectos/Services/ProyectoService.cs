using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.ApplicationServices.Exceptions;
using TaskManagement.Domain.ApplicationServices.Proyectos.Interfaces;
using TaskManagement.Domain.Proyectos;
using TaskManagement.Domain.Repository.Proyectos;

namespace TaskManagement.Domain.ApplicationServices.Proyectos.Services
{
    public class ProyectoService : IProyectoService
    {
        private readonly IProyectoRepository _proyectoRepository;

        public ProyectoService(IProyectoRepository proyectoRepository)
        {
            _proyectoRepository = proyectoRepository;
        }

        public async Task<ProyectoResponse> CrearAsync(CrearProyectoRequest request, int usuarioActualId)
        {
            var proyecto = new Proyecto
            {
                Nombre = request.Nombre,
                Descripcion = request.Descripcion,
                CreadoPorId = usuarioActualId
            };

            var nuevoId = await _proyectoRepository.CrearAsync(proyecto);

            // Se relee para devolver los datos reales de la BD (fecha, creador, conteos).
            return await ObtenerPorIdAsync(nuevoId);
        }

        public async Task<ProyectoResponse> ObtenerPorIdAsync(int id)
        {
            var proyecto = await _proyectoRepository.ObtenerPorIdAsync(id);
            if (proyecto == null)
                throw new NotFoundException("El proyecto no existe.");

            return MapearAResponse(proyecto);
        }

        public async Task<IList<ProyectoResponse>> ObtenerTodosAsync()
        {
            var proyectos = await _proyectoRepository.ObtenerTodosAsync();
            return proyectos.Select(MapearAResponse).ToList();
        }

        private static ProyectoResponse MapearAResponse(ProyectoResumen proyecto)
        {
            return new ProyectoResponse
            {
                Id = proyecto.Id,
                Nombre = proyecto.Nombre,
                Descripcion = proyecto.Descripcion,
                CreadoPorId = proyecto.CreadoPorId,
                CreadoPorNombre = proyecto.CreadoPorNombre,
                FechaCreacion = proyecto.FechaCreacion,
                TotalTareas = proyecto.TotalTareas,
                TareasCompletadas = proyecto.TareasCompletadas
            };
        }
    }
}
