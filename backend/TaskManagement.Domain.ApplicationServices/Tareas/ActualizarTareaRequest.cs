using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.Tareas;

namespace TaskManagement.Domain.ApplicationServices.Tareas
{
    public class ActualizarTareaRequest
    {
        public string Titulo { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public EstadoFlujoTarea EstadoFlujo { get; set; }
        public Prioridad Prioridad { get; set; }
        public DateTime? FechaVencimiento { get; set; }
        public int? AsignadoAId { get; set; }
    }

    namespace Validators
    {
        public class ActualizarTareaRequest__Validador : AbstractValidator<ActualizarTareaRequest>
        {
            public ActualizarTareaRequest__Validador()
            {
                ClassLevelCascadeMode = CascadeMode.Stop;

                RuleFor(model => model.Titulo)
                    .NotEmpty().WithMessage("El título de la tarea es obligatorio.")
                    .MaximumLength(150).WithMessage("El título no puede superar los 150 caracteres.");

                RuleFor(model => model.Descripcion)
                    .MaximumLength(1000).WithMessage("La descripción no puede superar los 1000 caracteres.");

                RuleFor(model => model.EstadoFlujo)
                    .IsInEnum().WithMessage("El estado de flujo indicado no es válido.");

                RuleFor(model => model.Prioridad)
                    .IsInEnum().WithMessage("La prioridad debe ser Baja, Media o Alta.");

                RuleFor(model => model.AsignadoAId)
                    .GreaterThan(0).When(model => model.AsignadoAId.HasValue)
                    .WithMessage("Debe indicar un usuario válido.");
            }
        }
    }
}
