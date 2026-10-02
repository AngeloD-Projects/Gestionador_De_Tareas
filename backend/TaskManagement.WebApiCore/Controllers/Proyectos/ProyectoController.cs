using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Domain.ApplicationServices.Proyectos;
using TaskManagement.Domain.ApplicationServices.Proyectos.Interfaces;
using TaskManagement.Domain.Roles;
using TaskManagement.WebApiCore.Extensions;

namespace TaskManagement.WebApiCore.Controllers.Proyectos
{
    [ApiController]
    [Route("api/proyectos")]
    [Authorize]
    public class ProyectoController : ControllerBase
    {
        private readonly IProyectoService _proyectoService;

        public ProyectoController(IProyectoService proyectoService)
        {
            _proyectoService = proyectoService;
        }

        [HttpPost]
        [Authorize(Roles = RolesSistema.Admin)]
        public async Task<IActionResult> Crear([FromBody] CrearProyectoRequest request)
        {
            var resultado = await _proyectoService.CrearAsync(request, User.ObtenerUsuarioId());
            return CreatedAtAction(nameof(ObtenerPorId), new { id = resultado.Id }, resultado);
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerTodos()
        {
            var resultado = await _proyectoService.ObtenerTodosAsync();
            return Ok(resultado);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var resultado = await _proyectoService.ObtenerPorIdAsync(id);
            return Ok(resultado);
        }
    }
}
