using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Domain.ApplicationServices.Auths
{
    public class AuthSettings
    {
        public int MaxIntentosFallidos { get; set; } = 3;
        public int MinutosBloqueo { get; set; } = 15;
        public int RefreshTokenDiasDuracion { get; set; } = 7;
    }
}
