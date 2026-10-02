using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.Tareas;

namespace TaskManagement.Domain.ApplicationServices.Tareas
{
    public class ActualizarEstadoTareaRequest
    {
        public EstadoFlujoTarea EstadoFlujo { get; set; }
    }

    namespace Validators
    {
        public class ActualizarEstadoTareaRequest__Validador : AbstractValidator<ActualizarEstadoTareaRequest>
        {
            public ActualizarEstadoTareaRequest__Validador()
            {
                RuleFor(model => model.EstadoFlujo)
                    .IsInEnum().WithMessage("El estado de flujo indicado no es válido.");
            }
        }
    }
}
