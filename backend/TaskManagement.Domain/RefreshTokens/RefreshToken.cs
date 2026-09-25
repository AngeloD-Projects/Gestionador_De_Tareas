using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Domain.RefreshTokens
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime FechaExpira { get; set; }
        public bool Revocado { get; set; }
        public DateTime FechaCreacion { get; set; }
    }
}
