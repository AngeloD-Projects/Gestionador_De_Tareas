using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.Usuario;

namespace TaskManagement.Domain.Tarea
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

    namespace Validators
    {
        public class Tarea__MantenimientoValidador : AbstractValidator<Tarea>
        {
            public Tarea__MantenimientoValidador()
            {
                ClassLevelCascadeMode = CascadeMode.Stop;

                RuleFor(model => model.Titulo)
                    .NotEmpty().WithMessage("El título de la tarea es obligatorio.")
                    .MaximumLength(150).WithMessage("El título no puede superar los 150 caracteres.");

                RuleFor(model => model.Descripcion)
                    .MaximumLength(1000).WithMessage("La descripción no puede superar los 1000 caracteres.");

                RuleFor(model => model.ProyectoId)
                    .GreaterThan(0).WithMessage("La tarea debe pertenecer a un proyecto válido.");

                RuleFor(model => model.Prioridad)
                    .IsInEnum().WithMessage("La prioridad indicada no es válida.");
            }
        }

        public class Tarea__CambioEstadoValidador : AbstractValidator<Tarea>
        {
            public Tarea__CambioEstadoValidador()
            {
                ClassLevelCascadeMode = CascadeMode.Stop;

                RuleFor(model => model.Id)
                    .GreaterThan(0).WithMessage("Debe indicar la tarea a actualizar.");

                RuleFor(model => model.EstadoFlujo)
                    .IsInEnum().WithMessage("El estado de flujo indicado no es válido.");
            }
        }
    }
}
