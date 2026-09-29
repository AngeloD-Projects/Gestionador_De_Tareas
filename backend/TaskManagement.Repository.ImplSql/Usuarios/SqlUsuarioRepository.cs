using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.Repository.Usuarios;
using TaskManagement.Domain.Usuarios;

namespace TaskManagement.Repository.ImplSql.Usuarios
{
    public class SqlUsuarioRepository : IUsuarioRepository
    {

        private readonly IDbConnection _connection;

        public SqlUsuarioRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<Usuario?> ObtenerPorEmailAsync(string email)
        {
            var parametros = new DynamicParameters();
            parametros.Add("@Email", email);

            var resultado = await _connection.QueryFirstOrDefaultAsync<Usuario>(
                "sp_Usuario_ObtenerPorEmail",
                parametros,
                commandType: CommandType.StoredProcedure);

            return resultado;
        }

        public async Task<Usuario?> ObtenerPorIdAsync(int id)
        {
            var parametros = new DynamicParameters();
            parametros.Add("@Id", id);

            return await _connection.QueryFirstOrDefaultAsync<Usuario>(
                "sp_Usuario_ObtenerPorId",
                parametros,
                commandType: CommandType.StoredProcedure);
        }

        public async Task<int> RegistrarAsync(Usuario usuario)
        {
            var parametros = new DynamicParameters();
            parametros.Add("@NombreUsuario", usuario.NombreUsuario);
            parametros.Add("@Email", usuario.Email);
            parametros.Add("@PasswordHash", usuario.PasswordHash);
            parametros.Add("@RolId", usuario.RolId);

            var resultado = await _connection.QuerySingleAsync<int>(
                "sp_Usuario_Registrar",
                parametros,
                commandType: CommandType.StoredProcedure);

            return resultado;
        }

        public async Task RegistrarIntentoFallidoAsync(int usuarioId, int maxIntentos, int minutosBloqueo)
        {
            var parametros = new DynamicParameters();
            parametros.Add("@UsuarioId", usuarioId);
            parametros.Add("@MaxIntentos", maxIntentos);
            parametros.Add("@MinutosBloqueo", minutosBloqueo);

            await _connection.ExecuteAsync(
                "sp_Usuario_RegistrarIntentoFallido",
                parametros,
                commandType: CommandType.StoredProcedure);
        }

        public async Task ResetIntentosAsync(int usuarioId)
        {
            var parametros = new DynamicParameters();
            parametros.Add("@UsuarioId", usuarioId);

            await _connection.ExecuteAsync(
                "sp_Usuario_ResetIntentos",
                parametros,
                commandType: CommandType.StoredProcedure);
        }
    }
}
