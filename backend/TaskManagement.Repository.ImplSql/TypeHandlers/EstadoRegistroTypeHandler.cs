using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.Usuarios;

namespace TaskManagement.Repository.ImplSql.TypeHandlers
{
    public class EstadoRegistroTypeHandler : SqlMapper.TypeHandler<EstadoRegistro>
    {
        public override EstadoRegistro Parse(object value)
        {
            var texto = value.ToString();
            return texto == "ACT" ? EstadoRegistro.Activo : EstadoRegistro.Inactivo;
        }

        public override void SetValue(IDbDataParameter parameter, EstadoRegistro value)
        {
            parameter.Value = value == EstadoRegistro.Activo ? "ACT" : "INA";
        }
    }
}
