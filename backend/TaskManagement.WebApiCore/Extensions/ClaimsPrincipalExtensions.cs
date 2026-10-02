using System.Security.Claims;
using TaskManagement.Domain.Roles;

namespace TaskManagement.WebApiCore.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static int ObtenerUsuarioId(this ClaimsPrincipal usuario)
        {
            var valor = usuario.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.Parse(valor!);
        }

        public static bool EsAdmin(this ClaimsPrincipal usuario)
        {
            return usuario.IsInRole(RolesSistema.Admin);
        }
    }
}
