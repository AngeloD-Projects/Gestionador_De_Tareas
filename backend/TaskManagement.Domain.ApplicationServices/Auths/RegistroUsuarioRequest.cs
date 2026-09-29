using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Domain.ApplicationServices.Auths
{
    public class RegistroUsuarioRequest
    {
        public string NombreUsuario { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    namespace Validators
    {
        public class RegistroUsuarioRequest__Validador : AbstractValidator<RegistroUsuarioRequest>
        {
            public RegistroUsuarioRequest__Validador()
            {
                ClassLevelCascadeMode = CascadeMode.Stop;

                RuleFor(model => model.NombreUsuario)
                    .NotEmpty().WithMessage("El nombre de usuario es obligatorio.")
                    .MaximumLength(50).WithMessage("El nombre de usuario no puede superar los 50 caracteres.");

                RuleFor(model => model.Email)
                    .NotEmpty().WithMessage("El email es obligatorio.")
                    .EmailAddress().WithMessage("El email no tiene un formato válido.");

                RuleFor(model => model.Password)
                    .NotEmpty().WithMessage("La contraseña es obligatoria.")
                    .MinimumLength(8).WithMessage("La contraseña debe tener al menos 8 caracteres.");
            }
        }
    }
}
