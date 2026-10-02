using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.Usuarios;

namespace TaskManagement.Domain.Proyectos
{
    public class Proyecto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public int CreadoPorId { get; set; }
        public EstadoRegistro Estado { get; set; } = EstadoRegistro.Activo;
        public DateTime FechaCreacion { get; set; }
    }

    // Modelo de lectura: el proyecto con los datos que trae vw_ProyectosActivos.
    public class ProyectoResumen : Proyecto
    {
        public string CreadoPorNombre { get; set; } = string.Empty;
        public int TotalTareas { get; set; }
        public int TareasCompletadas { get; set; }
    }
}
