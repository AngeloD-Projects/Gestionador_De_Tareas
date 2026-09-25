using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.Usuario;

namespace TaskManagement.Domain.Proyecto
{
    public class Proyecto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public int CreadoPorId { get; set; }
        public EstadoRegistro Estado { get; set; } = EstadoRegistro.Activo;
        public DateTime FechaCreacion { get; set; }
    }

    namespace Validators
    {
        public class Proyecto__MantenimientoValidador : AbstractValidator<Proyecto>
        {
            public Proyecto__MantenimientoValidador()
            {
                ClassLevelCascadeMode = CascadeMode.Stop;

                RuleFor(model => model.Nombre)
                    .NotEmpty().WithMessage("El nombre del proyecto es obligatorio.")
                    .MaximumLength(100).WithMessage("El nombre no puede superar los 100 caracteres.");

                RuleFor(model => model.Descripcion)
                    .MaximumLength(500).WithMessage("La descripción no puede superar los 500 caracteres.");

                RuleFor(model => model.CreadoPorId)
                    .GreaterThan(0).WithMessage("El proyecto debe tener un creador válido.");
            }
        }
    }
}
