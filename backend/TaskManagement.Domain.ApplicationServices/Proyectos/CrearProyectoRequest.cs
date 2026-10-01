using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Domain.ApplicationServices.Proyectos
{
    public class CrearProyectoRequest
    {
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
    }

    namespace Validators
    {
        public class CrearProyectoRequest__Validador : AbstractValidator<CrearProyectoRequest>
        {
            public CrearProyectoRequest__Validador()
            {
                ClassLevelCascadeMode = CascadeMode.Stop;

                RuleFor(model => model.Nombre)
                    .NotEmpty().WithMessage("El nombre del proyecto es obligatorio.")
                    .MaximumLength(100).WithMessage("El nombre no puede superar los 100 caracteres.");

                RuleFor(model => model.Descripcion)
                    .MaximumLength(500).WithMessage("La descripción no puede superar los 500 caracteres.");
            }
        }
    }
}
