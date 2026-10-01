using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.Repository.Tareas;
using TaskManagement.Domain.Tareas;
using TaskManagement.Domain.Usuarios;

namespace TaskManagement.Repository.ImplSql.Tareas
{
    public class SqlTareaRepository : ITareaRepository
    {
        private readonly IDbConnection _connection;

        public SqlTareaRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<bool> ActualizarCompletaAsync(Tarea tarea)
        {
            var parametros = new DynamicParameters();
            parametros.Add("@Id", tarea.Id);
            parametros.Add("@Titulo", tarea.Titulo);
            parametros.Add("@Descripcion", tarea.Descripcion);
            parametros.Add("@EstadoFlujo", (int)tarea.EstadoFlujo);
            parametros.Add("@Prioridad", (int)tarea.Prioridad);
            parametros.Add("@FechaVencimiento", tarea.FechaVencimiento);
            parametros.Add("@AsignadoAId", tarea.AsignadoAId);

            int filasAfectadas = await _connection.QuerySingleAsync<int>(
                "sp_Tarea_ActualizarCompleta",
                parametros,
                commandType: CommandType.StoredProcedure);

            return filasAfectadas > 0;
        }

        public async Task<bool> ActualizarEstadoFlujoAsync(int id, EstadoFlujoTarea estadoFlujo)
        {
            var parametros = new DynamicParameters();
            parametros.Add("@Id", id);
            parametros.Add("@EstadoFlujo", (int)estadoFlujo);

            int filasAfectadas = await _connection.QuerySingleAsync<int>(
                "sp_Tarea_ActualizarEstadoFlujo",
                parametros,
                commandType: CommandType.StoredProcedure);

            return filasAfectadas > 0;
        }

        public async Task<int> CrearAsync(Tarea tarea)
        {
            var parametros = new DynamicParameters();
            parametros.Add("@Titulo", tarea.Titulo);
            parametros.Add("@Descripcion", tarea.Descripcion);
            parametros.Add("@Prioridad", (int)tarea.Prioridad);
            parametros.Add("@FechaVencimiento", tarea.FechaVencimiento);
            parametros.Add("@ProyectoId", tarea.ProyectoId);
            parametros.Add("@AsignadoAId", tarea.AsignadoAId);
            parametros.Add("@CreadoPorId", tarea.CreadoPorId);

            return await _connection.QuerySingleAsync<int>(
                "sp_Tarea_Crear",
                parametros,
                commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var parametros = new DynamicParameters();
            parametros.Add("@Id", id);

            int filasAfectadas = await _connection.QuerySingleAsync<int>(
                "sp_Tarea_Eliminar",
                parametros,
                commandType: CommandType.StoredProcedure);

            return filasAfectadas > 0;
        }

        public async Task<Tarea?> ObtenerPorIdAsync(int id)
        {
            var parametros = new DynamicParameters();
            parametros.Add("@Id", id);

            var fila = await _connection.QueryFirstOrDefaultAsync(
                "sp_Tarea_ObtenerPorId",
                parametros,
                commandType: CommandType.StoredProcedure);

            return fila == null ? null : MapearTarea(fila);
        }

        public async Task<IList<Tarea>> ObtenerPorUsuarioAsignadoAsync(int usuarioId)
        {
            var parametros = new DynamicParameters();
            parametros.Add("@UsuarioId", usuarioId);

            var filas = await _connection.QueryAsync(
                "sp_Tarea_ObtenerPorUsuarioAsignado",
                parametros,
                commandType: CommandType.StoredProcedure);

            return filas.Select(fila => (Tarea)MapearTarea(fila)).ToList();
        }

        public async Task<IList<Tarea>> ObtenerTodasAsync(int? proyectoId, EstadoFlujoTarea? estadoFlujo)
        {
            var parametros = new DynamicParameters();
            parametros.Add("@ProyectoId", proyectoId);
            parametros.Add("@EstadoFlujo", estadoFlujo.HasValue ? (int)estadoFlujo.Value : (int?)null);

            var filas = await _connection.QueryAsync(
                "sp_Tarea_ObtenerTodas",
                parametros,
                commandType: CommandType.StoredProcedure);

            return filas.Select(fila => (Tarea)MapearTarea(fila)).ToList();
        }

        private static Tarea MapearTarea(dynamic fila)
        {
            return new Tarea
            {
                Id = fila.Id,
                Titulo = fila.Titulo,
                Descripcion = fila.Descripcion,
                EstadoFlujo = (EstadoFlujoTarea)fila.EstadoFlujo,
                Prioridad = (Prioridad)fila.Prioridad,
                Estado = fila.Estado == "ACT" ? EstadoRegistro.Activo : EstadoRegistro.Inactivo,
                FechaVencimiento = fila.FechaVencimiento,
                ProyectoId = fila.ProyectoId,
                AsignadoAId = fila.AsignadoAId,
                CreadoPorId = fila.CreadoPorId,
                FechaCreacion = fila.FechaCreacion,
                FechaActualizacion = fila.FechaActualizacion
            };
        }
    }
}
