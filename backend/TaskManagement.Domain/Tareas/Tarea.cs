using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.Usuarios;

namespace TaskManagement.Domain.Tareas
{
    public enum EstadoFlujoTarea
    {
        Pendiente = 0,
        EnProgreso = 1,
        EnRevision = 2,
        Completada = 3,
        Cancelada = 4
    }

    public enum Prioridad
    {
        Baja = 0,
        Media = 1,
        Alta = 2
    }

    public class Tarea
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public EstadoFlujoTarea EstadoFlujo { get; set; } = EstadoFlujoTarea.Pendiente;
        public Prioridad Prioridad { get; set; } = Prioridad.Media;
        public EstadoRegistro Estado { get; set; } = EstadoRegistro.Activo;
        public DateTime? FechaVencimiento { get; set; }
        public int ProyectoId { get; set; }
        public int? AsignadoAId { get; set; }
        public int CreadoPorId { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime? FechaActualizacion { get; set; }

    }

    // Modelo de lectura: la tarea con los nombres que trae vw_TareasActivas.
    public class TareaDetalle : Tarea
    {
        public string ProyectoNombre { get; set; } = string.Empty;
        public string? AsignadoANombre { get; set; }
        public string CreadoPorNombre { get; set; } = string.Empty;
    }

    // Reglas del flujo: Pendiente → EnProgreso → EnRevision → Completada.
    // El Usuario solo avanza un paso; el Admin puede mover a cualquier estado (incluido Cancelada).
    public static class FlujoTarea
    {
        private static readonly IReadOnlyDictionary<EstadoFlujoTarea, EstadoFlujoTarea> SiguienteEstado =
            new Dictionary<EstadoFlujoTarea, EstadoFlujoTarea>
            {
                [EstadoFlujoTarea.Pendiente] = EstadoFlujoTarea.EnProgreso,
                [EstadoFlujoTarea.EnProgreso] = EstadoFlujoTarea.EnRevision,
                [EstadoFlujoTarea.EnRevision] = EstadoFlujoTarea.Completada
            };

        public static IReadOnlyList<EstadoFlujoTarea> ObtenerTransicionesPermitidas(EstadoFlujoTarea actual, bool esAdmin)
        {
            if (esAdmin)
                return Enum.GetValues<EstadoFlujoTarea>().Where(estado => estado != actual).ToList();

            return SiguienteEstado.TryGetValue(actual, out var siguiente) ? [siguiente] : [];
        }

        public static bool EsTransicionPermitida(EstadoFlujoTarea actual, EstadoFlujoTarea nuevo, bool esAdmin)
        {
            return ObtenerTransicionesPermitidas(actual, esAdmin).Contains(nuevo);
        }
    }
}
