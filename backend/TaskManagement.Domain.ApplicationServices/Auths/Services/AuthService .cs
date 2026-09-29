using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.ApplicationServices.Auths.Interfaces;
using TaskManagement.Domain.ApplicationServices.Exceptions;
using TaskManagement.Domain.RefreshTokens;
using TaskManagement.Domain.Repository.RefreshTokens;
using TaskManagement.Domain.Repository.Usuarios;
using TaskManagement.Domain.Usuarios;

namespace TaskManagement.Domain.ApplicationServices.Auths.Services
{
    public class AuthService : IAuthService
    {
        private const int RolIdUsuarioPorDefecto = 2;

        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly AuthSettings _settings;

        public AuthService(IUsuarioRepository usuarioRepository,IRefreshTokenRepository refreshTokenRepository,IJwtTokenGenerator jwtTokenGenerator,AuthSettings settings)
        {
            _usuarioRepository = usuarioRepository;
            _refreshTokenRepository = refreshTokenRepository;
            _jwtTokenGenerator = jwtTokenGenerator;
            _settings = settings;
        }


        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            var usuario = await _usuarioRepository.ObtenerPorEmailAsync(request.Email);
            if (usuario == null)
                throw new UnauthorizedException("Email o contraseña incorrectos.");

            if (usuario.BloqueadoHasta.HasValue && usuario.BloqueadoHasta.Value > DateTime.UtcNow)
                throw new LockedException("Cuenta bloqueada temporalmente por intentos fallidos. Intenta más tarde.");

            var passwordValido = BCrypt.Net.BCrypt.Verify(request.Password, usuario.PasswordHash);
            if (!passwordValido)
            {
                await _usuarioRepository.RegistrarIntentoFallidoAsync(
                    usuario.Id, _settings.MaxIntentosFallidos, _settings.MinutosBloqueo);

                throw new UnauthorizedException("Email o contraseña incorrectos.");
            }

            await _usuarioRepository.ResetIntentosAsync(usuario.Id);

            return await GenerarRespuestaConTokensAsync(usuario);
        }

        public async Task<bool> LogoutAsync(RefrescarTokenRequest request)
        {
            return await _refreshTokenRepository.RevocarAsync(request.RefreshToken);
        }

        public async Task<LoginResponse> RefrescarTokenAsync(RefrescarTokenRequest request)
        {
            var tokenGuardado = await _refreshTokenRepository.ObtenerValidoAsync(request.RefreshToken);
            if (tokenGuardado == null)
                throw new UnauthorizedException("El refresh token no es válido o ha expirado.");

            var usuario = await _usuarioRepository.ObtenerPorIdAsync(tokenGuardado.UsuarioId);
            if (usuario == null)
                throw new UnauthorizedException("El usuario asociado a este token ya no existe.");

            await _refreshTokenRepository.RevocarAsync(request.RefreshToken);

            return await GenerarRespuestaConTokensAsync(usuario);
        }

        public async Task<UsuarioResponse> RegistrarAsync(RegistroUsuarioRequest request)
        {
            var existente = await _usuarioRepository.ObtenerPorEmailAsync(request.Email);
            if (existente != null)
                throw new ConflictException("Ya existe una cuenta registrada con ese email.");

            var usuario = new Usuario
            {
                NombreUsuario = request.NombreUsuario,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                RolId = RolIdUsuarioPorDefecto
            };

            var nuevoId = await _usuarioRepository.RegistrarAsync(usuario);

            return new UsuarioResponse
            {
                Id = nuevoId,
                NombreUsuario = usuario.NombreUsuario,
                Email = usuario.Email,
                Rol = ObtenerNombreRol(usuario.RolId)
            };
        }

        private async Task<LoginResponse> GenerarRespuestaConTokensAsync(Usuario usuario)
        {
            var nombreRol = ObtenerNombreRol(usuario.RolId);
            var accessToken = _jwtTokenGenerator.GenerarAccessToken(usuario, nombreRol);
            var refreshTokenValor = GenerarRefreshTokenAleatorio();

            var refreshToken = new RefreshToken
            {
                UsuarioId = usuario.Id,
                Token = refreshTokenValor,
                FechaExpira = DateTime.UtcNow.AddDays(_settings.RefreshTokenDiasDuracion)
            };

            await _refreshTokenRepository.CrearAsync(refreshToken);

            return new LoginResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshTokenValor,
                ExpiraEn = _jwtTokenGenerator.ObtenerExpiracionAccessToken()
            };
        }

        private static string GenerarRefreshTokenAleatorio()
        {
            var bytesAleatorios = RandomNumberGenerator.GetBytes(64);
            return Convert.ToBase64String(bytesAleatorios);
        }

        private static string ObtenerNombreRol(int rolId) => rolId switch
        {
            1 => "Admin",
            2 => "Usuario",
            _ => "Usuario"
        };
    }
}
