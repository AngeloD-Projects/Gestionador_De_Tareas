using Dapper;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Data;
using System.Text;
using TaskManagement.Domain.ApplicationServices.Auths;
using TaskManagement.Domain.ApplicationServices.Auths.Interfaces;
using TaskManagement.Domain.ApplicationServices.Auths.Services;
using TaskManagement.Domain.ApplicationServices.Auths.Validators;
using TaskManagement.Domain.ApplicationServices.Proyectos.Interfaces;
using TaskManagement.Domain.ApplicationServices.Proyectos.Services;
using TaskManagement.Domain.ApplicationServices.Tareas.Interfaces;
using TaskManagement.Domain.ApplicationServices.Tareas.Services;
using TaskManagement.Domain.Repository.Proyectos;
using TaskManagement.Domain.Repository.RefreshTokens;
using TaskManagement.Domain.Repository.Tareas;
using TaskManagement.Domain.Repository.Usuarios;
using TaskManagement.Repository.ImplSql.Proyectos;
using TaskManagement.Repository.ImplSql.RefreshTokens;
using TaskManagement.Repository.ImplSql.Tareas;
using TaskManagement.Repository.ImplSql.TypeHandlers;
using TaskManagement.Repository.ImplSql.Usuarios;
using TaskManagement.WebApiCore.Middlewares;
using TaskManagement.WebApiCore.Securitys;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddScoped<IDbConnection>(sp =>
    new SqlConnection(builder.Configuration.GetConnectionString("TaskManagementDb")));

SqlMapper.RemoveTypeMap(typeof(TaskManagement.Domain.Usuarios.EstadoRegistro));
// TypeHandler de Dapper (una sola vez al arrancar)
SqlMapper.AddTypeHandler(new EstadoRegistroTypeHandler());

// Repositorios y Services
builder.Services.AddScoped<IUsuarioRepository, SqlUsuarioRepository>();
builder.Services.AddScoped<IProyectoRepository, SqlProyectoRepository>();
builder.Services.AddScoped<ITareaRepository, SqlTareaRepository>();
builder.Services.AddScoped<IProyectoService, ProyectoService>();
builder.Services.AddScoped<ITareaService, TareaService>();
builder.Services.AddScoped<IRefreshTokenRepository, SqlRefreshTokenRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

// AuthSettings desde appsettings.json
builder.Services.Configure<AuthSettings>(builder.Configuration.GetSection("AuthSettings"));
builder.Services.AddScoped(sp => sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<AuthSettings>>().Value);

// Autenticación JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:ClaveSecreta"]!))
        };
    });

builder.Services.AddAuthorization();

// FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<RegistroUsuarioRequest__Validador>();

// Servicios base de la Web API (Controllers + Swagger)
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Ingresa el token con el formato: Bearer {tu token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();