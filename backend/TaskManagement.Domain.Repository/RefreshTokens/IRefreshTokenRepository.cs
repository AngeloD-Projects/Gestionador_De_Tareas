using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.RefreshTokens;

namespace TaskManagement.Domain.Repository.RefreshTokens
{
    public interface IRefreshTokenRepository
    {
        Task CrearAsync(RefreshToken refreshToken);
        Task<RefreshToken?> ObtenerValidoAsync(string token);
        Task RevocarAsync(string token);
    }
}
