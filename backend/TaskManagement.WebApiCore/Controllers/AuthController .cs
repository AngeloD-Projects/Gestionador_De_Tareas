using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Domain.ApplicationServices.Auths;
using TaskManagement.Domain.ApplicationServices.Auths.Interfaces;

namespace TaskManagement.WebApiCore.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistroUsuarioRequest request)
        {
            var resultado = await _authService.RegistrarAsync(request);
            return Ok(resultado);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var resultado = await _authService.LoginAsync(request);
            return Ok(resultado);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefrescarTokenRequest request)
        {
            var resultado = await _authService.RefrescarTokenAsync(request);
            return Ok(resultado);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] RefrescarTokenRequest request)
        {
            var revocado = await _authService.LogoutAsync(request);
            return Ok(new { revocado });
        }
    }
}
