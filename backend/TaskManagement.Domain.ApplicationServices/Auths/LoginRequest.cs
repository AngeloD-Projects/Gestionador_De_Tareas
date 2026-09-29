using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Domain.ApplicationServices.Auths
{
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    namespace Validators
    {
        public class LoginRequest__Validador : AbstractValidator<LoginRequest>
        {
            public LoginRequest__Validador()
            {
                ClassLevelCascadeMode = CascadeMode.Stop;

                RuleFor(model => model.Email)
                    .NotEmpty().WithMessage("El email es obligatorio.");

                RuleFor(model => model.Password)
                    .NotEmpty().WithMessage("La contraseña es obligatoria.");
            }
        }
    }
}
