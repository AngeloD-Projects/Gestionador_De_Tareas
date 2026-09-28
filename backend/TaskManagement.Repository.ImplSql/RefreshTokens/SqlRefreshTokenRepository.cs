using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.RefreshTokens;
using TaskManagement.Domain.Repository.RefreshTokens;

namespace TaskManagement.Repository.ImplSql.RefreshTokens
{
    public class SqlRefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly IDbConnection _connection;

        public SqlRefreshTokenRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task CrearAsync(RefreshToken refreshToken)
        {
            var parametros = new DynamicParameters();
            parametros.Add("@UsuarioId", refreshToken.UsuarioId);
            parametros.Add("@Token", refreshToken.Token);
            parametros.Add("@FechaExpira", refreshToken.FechaExpira);

            await _connection.ExecuteAsync(
                "sp_RefreshToken_Crear",
                parametros,
                commandType: CommandType.StoredProcedure);
        }

        public async Task<RefreshToken?> ObtenerValidoAsync(string token)
        {
            var parametros = new DynamicParameters();
            parametros.Add("@Token", token);

            return await _connection.QueryFirstOrDefaultAsync<RefreshToken>(
                "sp_RefreshToken_ObtenerValido",
                parametros,
                commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> RevocarAsync(string token)
        {
            var parametros = new DynamicParameters();
            parametros.Add("@Token", token);

            int filasAfectadas = await _connection.ExecuteAsync(
                "sp_RefreshToken_Revocar",
                parametros,
                commandType: CommandType.StoredProcedure);

            return filasAfectadas > 0;
        }
    }
}
