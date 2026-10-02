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

    // Única conversión entre el código de la BD ('ACT'/'INA') y el enum.
    public static class EstadoRegistroCodigo
    {
        public static EstadoRegistro Parse(string codigo) => codigo switch
        {
            "ACT" => EstadoRegistro.Activo,
            "INA" => EstadoRegistro.Inactivo,
            _ => throw new ArgumentOutOfRangeException(nameof(codigo), codigo, "Código de estado no reconocido.")
        };
    }
}
