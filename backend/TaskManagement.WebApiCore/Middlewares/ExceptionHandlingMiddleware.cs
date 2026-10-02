using System.Net;
using TaskManagement.Domain.ApplicationServices.Exceptions;
using TaskManagement.WebApiCore.Errores;

namespace TaskManagement.WebApiCore.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await ManejarExcepcionAsync(context, ex);
            }
        }

        private async Task ManejarExcepcionAsync(HttpContext context, Exception ex)
        {
            var (statusCode, mensaje) = ex switch
            {
                BadRequestException => (HttpStatusCode.BadRequest, ex.Message),
                NotFoundException => (HttpStatusCode.NotFound, ex.Message),
                ForbiddenException => (HttpStatusCode.Forbidden, ex.Message),
                UnauthorizedException => (HttpStatusCode.Unauthorized, ex.Message),
                ConflictException => (HttpStatusCode.Conflict, ex.Message),
                LockedException => (HttpStatusCode.Locked, ex.Message),
                _ => (HttpStatusCode.InternalServerError, "Ocurrió un error inesperado. Intenta nuevamente.")
            };

            if (statusCode == HttpStatusCode.InternalServerError)
                _logger.LogError(ex, "Error no controlado en {Path}", context.Request.Path);

            await ErrorResponse.EscribirAsync(context, (int)statusCode, mensaje);
        }
    }
}
