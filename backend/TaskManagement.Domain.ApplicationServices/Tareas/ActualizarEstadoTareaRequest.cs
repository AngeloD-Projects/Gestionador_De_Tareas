using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Domain.ApplicationServices.Tareas
{
    public class ActualizarEstadoTareaRequest
    {
        public int EstadoFlujo { get; set; }
    }

    namespace Validators
    {
        public class ActualizarEstadoTareaRequest__Validador : AbstractValidator<ActualizarEstadoTareaRequest>
        {
            public ActualizarEstadoTareaRequest__Validador()
            {
                RuleFor(model => model.EstadoFlujo)
                    .InclusiveBetween(0, 4).WithMessage("El estado de flujo indicado no es válido.");
            }
        }
    }
}
