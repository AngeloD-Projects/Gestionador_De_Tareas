using TaskManagement.Domain.Usuarios;

namespace TaskManagement.Domain.Repository.Usuarios
{
    public interface IUsuarioRepository
    {
        /// <returns>Id del usuario creado, o un código negativo de <see cref="CodigosResultadoUsuario"/>.</returns>
        Task<int> RegistrarAsync(Usuario usuario);
        Task<Usuario?> ObtenerPorIdAsync(int id);
        Task<Usuario?> ObtenerPorEmailAsync(string email);
        Task<IList<Usuario>> ObtenerTodosAsync();
        Task RegistrarIntentoFallidoAsync(int usuarioId, int maxIntentos, int minutosBloqueo);
        Task ResetIntentosAsync(int usuarioId);
    }

    // Códigos que devuelve sp_Usuario_Registrar.
    public static class CodigosResultadoUsuario
    {
        public const int EmailDuplicado = -1;
        public const int NombreUsuarioDuplicado = -2;
    }
}
