using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Data;
using System.Text;
using System.Text.Json.Serialization;
using TaskManagement.Domain.ApplicationServices.Auths;
using TaskManagement.Domain.ApplicationServices.Auths.Interfaces;
using TaskManagement.Domain.ApplicationServices.Auths.Services;
using TaskManagement.Domain.ApplicationServices.Auths.Validators;
using TaskManagement.Domain.ApplicationServices.Proyectos.Interfaces;
using TaskManagement.Domain.ApplicationServices.Proyectos.Services;
using TaskManagement.Domain.ApplicationServices.Tareas.Interfaces;
using TaskManagement.Domain.ApplicationServices.Tareas.Services;
using TaskManagement.Domain.ApplicationServices.Usuarios.Interfaces;
using TaskManagement.Domain.ApplicationServices.Usuarios.Services;
using TaskManagement.Domain.Repository.Proyectos;
using TaskManagement.Domain.Repository.RefreshTokens;
using TaskManagement.Domain.Repository.Tareas;
using TaskManagement.Domain.Repository.Usuarios;
using TaskManagement.Repository.ImplSql.Proyectos;
using TaskManagement.Repository.ImplSql.RefreshTokens;
using TaskManagement.Repository.ImplSql.Tareas;
using TaskManagement.Repository.ImplSql.Usuarios;
using TaskManagement.WebApiCore.Errores;
using TaskManagement.WebApiCore.Securitys;

namespace TaskManagement.WebApiCore.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public const string PoliticaCorsFrontend = "Frontend";

        public static IServiceCollection AddPersistenciaSql(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IDbConnection>(_ =>
                new SqlConnection(configuration.GetConnectionString("TaskManagementDb")));

            services.AddScoped<IUsuarioRepository, SqlUsuarioRepository>();
            services.AddScoped<IProyectoRepository, SqlProyectoRepository>();
            services.AddScoped<ITareaRepository, SqlTareaRepository>();
            services.AddScoped<IRefreshTokenRepository, SqlRefreshTokenRepository>();

            return services;
        }

        public static IServiceCollection AddServiciosAplicacion(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUsuarioService, UsuarioService>();
            services.AddScoped<IProyectoService, ProyectoService>();
            services.AddScoped<ITareaService, TareaService>();
            services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

            // AuthSettings desde appsettings.json
            services.Configure<AuthSettings>(configuration.GetSection("AuthSettings"));
            services.AddScoped(sp => sp.GetRequiredService<IOptions<AuthSettings>>().Value);

            // Validadores de los Request (los ejecuta ValidacionFilter)
            services.AddValidatorsFromAssemblyContaining<RegistroUsuarioRequest__Validador>();

            return services;
        }

        public static IServiceCollection AddControllersApi(this IServiceCollection services)
        {
            services.AddControllers(options => options.Filters.Add<ValidacionFilter>())
                // Enums como texto en las respuestas ("EnProgreso"); en las peticiones acepta texto o número.
                .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

            services.Configure<ApiBehaviorOptions>(options =>
                options.InvalidModelStateResponseFactory = ValidacionResponseFactory.Crear);

            return services;
        }

        public static IServiceCollection AddAutenticacionJwt(this IServiceCollection services, IConfiguration configuration)
        {
            // Falla al arrancar con un mensaje claro, en vez de fallar en el primer login.
            var claveSecreta = configuration["Jwt:ClaveSecreta"];
            if (string.IsNullOrWhiteSpace(claveSecreta) || claveSecreta.Length < 32)
                throw new InvalidOperationException(
                    "Falta 'Jwt:ClaveSecreta' (mínimo 32 caracteres). En desarrollo está en appsettings.Development.json; " +
                    "en producción configúrala con la variable de entorno Jwt__ClaveSecreta.");

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = configuration["Jwt:Issuer"],
                        ValidAudience = configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(claveSecreta)),
                        ClockSkew = TimeSpan.Zero
                    };

                    // 401/403 con el mismo formato JSON que el resto de errores.
                    options.Events = new JwtBearerEvents
                    {
                        OnChallenge = context =>
                        {
                            context.HandleResponse();
                            var mensaje = context.AuthenticateFailure is SecurityTokenExpiredException
                                ? "Tu sesión expiró. Vuelve a iniciar sesión."
                                : "Debes iniciar sesión para acceder a este recurso.";
                            return ErrorResponse.EscribirAsync(context.HttpContext, StatusCodes.Status401Unauthorized, mensaje);
                        },
                        OnForbidden = context =>
                            ErrorResponse.EscribirAsync(context.HttpContext, StatusCodes.Status403Forbidden,
                                "No tienes permisos para realizar esta acción.")
                    };
                });

            services.AddAuthorization();

            return services;
        }

        public static IServiceCollection AddCorsFrontend(this IServiceCollection services, IConfiguration configuration)
        {
            var origenes = configuration.GetSection("Cors:OrigenesPermitidos").Get<string[]>() ?? [];

            services.AddCors(options =>
                options.AddPolicy(PoliticaCorsFrontend, policy =>
                    policy.WithOrigins(origenes)
                          .AllowAnyHeader()
                          .AllowAnyMethod()));

            return services;
        }

        public static IServiceCollection AddSwaggerConJwt(this IServiceCollection services)
        {
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Pega solo el accessToken (sin escribir 'Bearer')."
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

            return services;
        }
    }
}
