using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Domain.ApplicationServices.Tareas;
using TaskManagement.Domain.ApplicationServices.Tareas.Interfaces;
using TaskManagement.WebApiCore.Extensions;

namespace TaskManagement.WebApiCore.Controllers.Tareas
{
    [ApiController]
    [Route("api/tareas")]
    [Authorize]
    public class TareaController : ControllerBase
    {
        private readonly ITareaService _tareaService;

        public TareaController(ITareaService tareaService)
        {
            _tareaService = tareaService;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Crear([FromBody] CrearTareaRequest request)
        {
            var resultado = await _tareaService.CrearAsync(request, User.ObtenerUsuarioId());
            return Ok(resultado);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ObtenerTodas([FromQuery] int? proyectoId, [FromQuery] int? estadoFlujo)
        {
            var resultado = await _tareaService.ObtenerTodasAsync(proyectoId, estadoFlujo);
            return Ok(resultado);
        }

        [HttpGet("mis-tareas")]
        public async Task<IActionResult> ObtenerMisTareas()
        {
            var resultado = await _tareaService.ObtenerMisTareasAsync(User.ObtenerUsuarioId());
            return Ok(resultado);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var resultado = await _tareaService.ObtenerPorIdAsync(id, User.ObtenerUsuarioId(), User.EsAdmin());
            return Ok(resultado);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ActualizarCompleta(int id, [FromBody] ActualizarTareaRequest request)
        {
            var resultado = await _tareaService.ActualizarCompletaAsync(id, request);
            return Ok(resultado);
        }

        [HttpPatch("{id}/estado")]
        public async Task<IActionResult> ActualizarEstado(int id, [FromBody] ActualizarEstadoTareaRequest request)
        {
            var resultado = await _tareaService.ActualizarEstadoAsync(
                id, request, User.ObtenerUsuarioId(), User.EsAdmin());
            return Ok(resultado);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Eliminar(int id)
        {
            await _tareaService.EliminarAsync(id);
            return NoContent();
        }
    }
}
