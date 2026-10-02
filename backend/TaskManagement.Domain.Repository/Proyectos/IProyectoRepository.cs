using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.Proyectos;

namespace TaskManagement.Domain.Repository.Proyectos
{
    public interface IProyectoRepository
    {
        Task<int> CrearAsync(Proyecto proyecto);
        Task<IList<ProyectoResumen>> ObtenerTodosAsync();
        Task<ProyectoResumen?> ObtenerPorIdAsync(int id);
    }
}
