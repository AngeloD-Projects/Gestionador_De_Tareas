using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Domain.ApplicationServices.Proyectos
{
    public class ProyectoResponse
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public int CreadoPorId { get; set; }
        public DateTime FechaCreacion { get; set; }
    }
}
