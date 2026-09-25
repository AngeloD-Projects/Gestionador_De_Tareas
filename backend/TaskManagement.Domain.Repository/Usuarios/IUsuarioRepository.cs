using TaskManagement.Domain.Usuarios;

namespace TaskManagement.Domain.Repository.Usuarios
{
    public interface IUsuarioRepository
    {
        Task<int> RegistrarAsync(Usuario usuario);
        Task<Usuario?> ObtenerPorEmailAsync(string email);
        Task RegistrarIntentoFallidoAsync(int usuarioId, int maxIntentos, int minutosBloqueo);
        Task ResetIntentosAsync(int usuarioId);
    }
}
