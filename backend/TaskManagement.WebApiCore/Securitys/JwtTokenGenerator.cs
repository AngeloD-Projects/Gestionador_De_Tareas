using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TaskManagement.Domain.ApplicationServices.Auths.Interfaces;
using TaskManagement.Domain.Usuarios;

namespace TaskManagement.WebApiCore.Securitys
{
    public class JwtTokenGenerator : IJwtTokenGenerator
    {
        private readonly IConfiguration _configuration;

        public JwtTokenGenerator(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerarAccessToken(Usuario usuario, string nombreRol)
        {
            var claveSecreta = _configuration["Jwt:ClaveSecreta"]!;
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Name, usuario.NombreUsuario),
                new Claim(ClaimTypes.Role, nombreRol)
            };

            var clave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(claveSecreta));
            var credenciales = new SigningCredentials(clave, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: ObtenerExpiracionAccessToken(),
                signingCredentials: credenciales);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public DateTime ObtenerExpiracionAccessToken()
        {
            var minutos = int.Parse(_configuration["Jwt:MinutosExpiracion"] ?? "30");
            return DateTime.UtcNow.AddMinutes(minutos);
        }
    }
}
