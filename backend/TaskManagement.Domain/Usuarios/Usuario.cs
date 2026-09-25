using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Domain.Usuarios
{
    public class Usuario
    {
        public int Id { get; set; }
        public string NombreUsuario { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public int RolId { get; set; }
        public EstadoRegistro Estado { get; set; } = EstadoRegistro.Activo;
        public int IntentosFallidos { get; set; }
        public DateTime? BloqueadoHasta { get; set; }
        public DateTime FechaCreacion { get; set; }
    }
    public enum EstadoRegistro
    {
        Activo,
        Inactivo
    }

    namespace Validators
    {
        public class Usuario__RegistroValidador : AbstractValidator<Usuario>
        {
            public Usuario__RegistroValidador()
            {
                ClassLevelCascadeMode = CascadeMode.Stop;

                RuleFor(model => model.NombreUsuario)
                    .NotEmpty().WithMessage("El nombre de usuario es obligatorio.")
                    .MaximumLength(50).WithMessage("El nombre de usuario no puede superar los 50 caracteres.");

                RuleFor(model => model.Email)
                    .NotEmpty().WithMessage("El email es obligatorio.")
                    .EmailAddress().WithMessage("El email no tiene un formato de correo válido.");

                RuleFor(model => model.PasswordHash)
                    .NotEmpty().WithMessage("La contraseña es obligatoria.");
            }
        }
    }
}



