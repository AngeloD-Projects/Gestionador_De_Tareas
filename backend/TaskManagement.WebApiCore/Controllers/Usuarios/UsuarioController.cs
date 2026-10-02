using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Domain.ApplicationServices.Usuarios.Interfaces;
using TaskManagement.Domain.Roles;

namespace TaskManagement.WebApiCore.Controllers.Usuarios
{
    [ApiController]
    [Route("api/usuarios")]
    [Authorize(Roles = RolesSistema.Admin)]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;

        public UsuarioController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        // Usuarios activos, para el selector "Asignar a..." al crear o editar tareas.
        [HttpGet]
        public async Task<IActionResult> ObtenerTodos()
        {
            var resultado = await _usuarioService.ObtenerTodosAsync();
            return Ok(resultado);
        }
    }
}
