using TaskManagement.WebApiCore.Extensions;
using TaskManagement.WebApiCore.Middlewares;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddPersistenciaSql(builder.Configuration)
    .AddServiciosAplicacion(builder.Configuration)
    .AddAutenticacionJwt(builder.Configuration)
    .AddCorsFrontend(builder.Configuration)
    .AddControllersApi()
    .AddSwaggerConJwt();

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // En desarrollo el front habla por http con el proxy de Vite; redirigir rompería las peticiones.
    app.UseHttpsRedirection();
}

app.UseCors(ServiceCollectionExtensions.PoliticaCorsFrontend);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
