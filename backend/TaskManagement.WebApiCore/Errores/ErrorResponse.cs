using System.Text.Json.Serialization;

namespace TaskManagement.WebApiCore.Errores
{
    // Forma única de todos los errores de la API: { status, mensaje, errores? }
    public class ErrorResponse
    {
        public int Status { get; set; }
        public string Mensaje { get; set; } = string.Empty;

        // Solo en errores de validación: campo → mensajes.
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public IDictionary<string, string[]>? Errores { get; set; }

        public static Task EscribirAsync(HttpContext context, int status, string mensaje)
        {
            context.Response.StatusCode = status;
            return context.Response.WriteAsJsonAsync(new ErrorResponse { Status = status, Mensaje = mensaje });
        }
    }
}
