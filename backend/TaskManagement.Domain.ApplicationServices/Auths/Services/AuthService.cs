using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.ApplicationServices.Auths.Interfaces;
using TaskManagement.Domain.ApplicationServices.Exceptions;
using TaskManagement.Domain.ApplicationServices.Usuarios;
using TaskManagement.Domain.RefreshTokens;
using TaskManagement.Domain.Repository.RefreshTokens;
using TaskManagement.Domain.Repository.Usuarios;
using TaskManagement.Domain.Roles;
using TaskManagement.Domain.Usuarios;

namespace TaskManagement.Domain.ApplicationServices.Auths.Services
{
    public class AuthService : IAuthService
    {
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

            // Se valida después de la contraseña para no revelar qué emails existen.
            if (usuario.Estado == EstadoRegistro.Inactivo)
                throw new ForbiddenException("Tu cuenta está desactivada. Contacta a un administrador.");

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

            // Solo una petición puede revocarlo: si dos llegan a la vez, la segunda se rechaza.
            var revocado = await _refreshTokenRepository.RevocarAsync(request.RefreshToken);
            if (!revocado)
                throw new UnauthorizedException("El refresh token ya fue utilizado.");

            var usuario = await _usuarioRepository.ObtenerPorIdAsync(tokenGuardado.UsuarioId);
            if (usuario == null || usuario.Estado == EstadoRegistro.Inactivo)
                throw new UnauthorizedException("El usuario asociado a este token ya no está disponible.");

            return await GenerarRespuestaConTokensAsync(usuario);
        }

        public async Task<UsuarioResponse> RegistrarAsync(RegistroUsuarioRequest request)
        {
            var usuario = new Usuario
            {
                NombreUsuario = request.NombreUsuario,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                RolId = RolesSistema.UsuarioId
            };

            // El SP valida email y nombre de usuario dentro de una transacción.
            var resultado = await _usuarioRepository.RegistrarAsync(usuario);

            switch (resultado)
            {
                case CodigosResultadoUsuario.EmailDuplicado:
                    throw new ConflictException("Ya existe una cuenta registrada con ese email.");
                case CodigosResultadoUsuario.NombreUsuarioDuplicado:
                    throw new ConflictException("Ese nombre de usuario ya está en uso.");
            }

            usuario.Id = resultado;
            return UsuarioResponse.Desde(usuario);
        }

        private async Task<LoginResponse> GenerarRespuestaConTokensAsync(Usuario usuario)
        {
            var nombreRol = RolesSistema.ObtenerNombre(usuario.RolId);
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
                ExpiraEn = _jwtTokenGenerator.ObtenerExpiracionAccessToken(),
                Usuario = UsuarioResponse.Desde(usuario)
            };
        }

        private static string GenerarRefreshTokenAleatorio()
        {
            var bytesAleatorios = RandomNumberGenerator.GetBytes(64);
            return Convert.ToBase64String(bytesAleatorios);
        }
    }
}
