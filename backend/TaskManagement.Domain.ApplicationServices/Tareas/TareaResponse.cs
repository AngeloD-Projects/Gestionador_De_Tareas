using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Domain.ApplicationServices.Tareas
{
    public class TareaResponse
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public string EstadoFlujo { get; set; } = string.Empty;
        public string Prioridad { get; set; } = string.Empty;
        public DateTime? FechaVencimiento { get; set; }
        public int ProyectoId { get; set; }
        public int? AsignadoAId { get; set; }
        public int CreadoPorId { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime? FechaActualizacion { get; set; }
    }
}
