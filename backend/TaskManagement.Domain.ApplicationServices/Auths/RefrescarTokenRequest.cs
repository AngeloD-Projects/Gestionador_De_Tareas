using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Domain.ApplicationServices.Auths
{
    public class RefrescarTokenRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }

    namespace Validators
    {
        public class RefrescarTokenRequest__Validador : AbstractValidator<RefrescarTokenRequest>
        {
            public RefrescarTokenRequest__Validador()
            {
                ClassLevelCascadeMode = CascadeMode.Stop;

                RuleFor(model => model.RefreshToken)
                    .NotEmpty().WithMessage("El refresh token es obligatorio.");
            }
        }
    }
}
