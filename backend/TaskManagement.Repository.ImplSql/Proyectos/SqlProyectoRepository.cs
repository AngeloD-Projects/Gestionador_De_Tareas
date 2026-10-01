using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.Proyectos;
using TaskManagement.Domain.Repository.Proyectos;
using TaskManagement.Domain.Usuarios;

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

            var fila = await _connection.QueryFirstOrDefaultAsync(
                "sp_Proyecto_ObtenerPorId",
                parametros,
                commandType: CommandType.StoredProcedure);

            return fila == null ? null : MapearProyecto(fila);
        }

        public async Task<IList<Proyecto>> ObtenerTodosAsync()
        {
            var filas = await _connection.QueryAsync(
                "sp_Proyecto_ObtenerTodos",
                commandType: CommandType.StoredProcedure);

            return filas.Select(fila => (Proyecto)MapearProyecto(fila)).ToList();
        }

        private static Proyecto MapearProyecto(dynamic fila)
        {
            return new Proyecto
            {
                Id = fila.Id,
                Nombre = fila.Nombre,
                Descripcion = fila.Descripcion,
                CreadoPorId = fila.CreadoPorId,
                Estado = fila.Estado == "ACT" ? EstadoRegistro.Activo : EstadoRegistro.Inactivo,
                FechaCreacion = fila.FechaCreacion
            };
        }
    }
}
