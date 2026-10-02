using Microsoft.AspNetCore.Mvc;

namespace TaskManagement.WebApiCore.Errores
{
    // Convierte los errores de FluentValidation / binding al mismo formato ErrorResponse.
    public static class ValidacionResponseFactory
    {
        private const string MensajeFormatoInvalido = "El valor enviado no tiene un formato válido.";

        public static IActionResult Crear(ActionContext context)
        {
            var conErrores = context.ModelState
                .Where(entrada => entrada.Value is { Errors.Count: > 0 })
                .ToList();

            // Si el JSON no se pudo leer ("$.campo"), el resto de errores es ruido derivado de eso.
            var erroresDeFormato = conErrores.Where(entrada => entrada.Key.StartsWith('$')).ToList();
            if (erroresDeFormato.Count > 0)
                conErrores = erroresDeFormato;

            var errores = conErrores.ToDictionary(
                entrada => NormalizarCampo(entrada.Key),
                entrada => entrada.Key.StartsWith('$')
                    ? [MensajeFormatoInvalido]
                    : entrada.Value!.Errors.Select(error => error.ErrorMessage).ToArray());

            var respuesta = new ErrorResponse
            {
                Status = StatusCodes.Status400BadRequest,
                Mensaje = errores.Values.FirstOrDefault()?.FirstOrDefault() ?? "La solicitud no es válida.",
                Errores = errores
            };

            return new BadRequestObjectResult(respuesta);
        }

        // "$.prioridad" → "prioridad", "Titulo" → "titulo" (mismo nombre que usa el JSON).
        private static string NormalizarCampo(string clave)
        {
            var campo = clave.TrimStart('$', '.');
            return string.IsNullOrEmpty(campo) ? "general" : char.ToLowerInvariant(campo[0]) + campo[1..];
        }
    }
}
