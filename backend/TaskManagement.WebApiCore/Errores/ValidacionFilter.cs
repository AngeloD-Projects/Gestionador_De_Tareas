using FluentValidation;
using Microsoft.AspNetCore.Mvc.Filters;

namespace TaskManagement.WebApiCore.Errores
{
    // Ejecuta el validador de FluentValidation de cada argumento de la acción (los Request DTO).
    // Reemplaza al paquete FluentValidation.AspNetCore, que está en desuso.
    public class ValidacionFilter : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            foreach (var argumento in context.ActionArguments.Values)
            {
                if (argumento is null)
                    continue;

                var tipoValidador = typeof(IValidator<>).MakeGenericType(argumento.GetType());
                if (context.HttpContext.RequestServices.GetService(tipoValidador) is not IValidator validador)
                    continue;

                var resultado = await validador.ValidateAsync(
                    new ValidationContext<object>(argumento), context.HttpContext.RequestAborted);

                foreach (var error in resultado.Errors)
                    context.ModelState.AddModelError(error.PropertyName, error.ErrorMessage);
            }

            if (!context.ModelState.IsValid)
            {
                context.Result = ValidacionResponseFactory.Crear(context);
                return;
            }

            await next();
        }
    }
}
