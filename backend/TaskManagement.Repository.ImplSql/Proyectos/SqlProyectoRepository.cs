using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.Proyectos;
using TaskManagement.Domain.Repository.Proyectos;

namespace TaskManagement.Repository.ImplSql.Proyectos
{
    public class SqlProyectoRepository : IProyectoRepository
    {

        private readonly IDbConnection _connection;

        public SqlProyectoRepository(IDbConnection connection)
        {
            _connection = connection;
        }
        public async Task<int> CrearAsync(Proyecto proyecto)
        {
            var parametros = new DynamicParameters();
            parametros.Add("@Nombre", proyecto.Nombre);
            parametros.Add("@Descripcion", proyecto.Descripcion);
            parametros.Add("@CreadoPorId", proyecto.CreadoPorId);

            return await _connection.QuerySingleAsync<int>(
                "sp_Proyecto_Crear",
                parametros,
                commandType: CommandType.StoredProcedure);
        }

        public async Task<Proyecto?> ObtenerPorIdAsync(int id)
        {
            var parametros = new DynamicParameters();
            parametros.Add("@Id", id);

            return await _connection.QueryFirstOrDefaultAsync<Proyecto>(
                "sp_Proyecto_ObtenerPorId",
                parametros,
                commandType: CommandType.StoredProcedure);
        }

        public async Task<IList<Proyecto>> ObtenerTodosAsync()
        {
            var resultado = await _connection.QueryAsync<Proyecto>(
                "sp_Proyecto_ObtenerTodos",
                commandType: CommandType.StoredProcedure);

            return resultado.ToList();
        }
    }
}
