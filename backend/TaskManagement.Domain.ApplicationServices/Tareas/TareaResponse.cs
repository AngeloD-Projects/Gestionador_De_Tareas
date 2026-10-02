using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.Tareas;

namespace TaskManagement.Domain.ApplicationServices.Tareas
{
    public class TareaResponse
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public EstadoFlujoTarea EstadoFlujo { get; set; }
        public Prioridad Prioridad { get; set; }
        public DateTime? FechaVencimiento { get; set; }
        public int ProyectoId { get; set; }
        public string ProyectoNombre { get; set; } = string.Empty;
        public int? AsignadoAId { get; set; }
        public string? AsignadoANombre { get; set; }
        public int CreadoPorId { get; set; }
        public string CreadoPorNombre { get; set; } = string.Empty;
        public DateTime FechaCreacion { get; set; }
        public DateTime? FechaActualizacion { get; set; }

        // Estados a los que el usuario actual puede mover esta tarea (el front pinta los botones con esto).
        public IReadOnlyList<EstadoFlujoTarea> TransicionesPermitidas { get; set; } = [];
    }
}
