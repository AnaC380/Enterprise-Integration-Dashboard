using EID.Api.Middlewares;
using EID.Application.Interfaces.Repositories;
using EID.Application.Interfaces.Services;
using EID.Application.Services;
using EID.Application.Validators;
using EID.Infrastructure.Persistence.Contexts;
using EID.Infrastructure.Persistence.Repositories;
using EID.Infrastructure.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();

// Swagger / OpenAPI
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Enterprise Integration Dashboard API",
        Version = "v1",
        Description = "API REST para integração entre Oracle e SQL Server."
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Informe somente o token JWT."
    });

    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = []
    });
});

// SQL Server
builder.Services.AddDbContext<SqlServerContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("SqlServer")));

// Oracle
builder.Services.AddDbContext<OracleContext>(options =>
    options.UseOracle(
        builder.Configuration.GetConnectionString("Oracle")));

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuditLogRepository, AuditLogRepository>();
builder.Services.AddScoped<ISupplierRepository, SupplierRepository>();
builder.Services.AddScoped<IContractRepository, ContractRepository>();

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();

// JWT
var jwtKey = builder.Configuration["Jwt:Key"]!;

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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
                Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(
                builder.Configuration
                    .GetSection("Cors:AllowedOrigins")
                    .Get<string[]>()!)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Middleware pipeline
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Front-end (EID.Web) servido pela própria API quando o build está em wwwroot,
// o que acontece no dotnet publish. Em desenvolvimento quem serve é o Vite.
var webRoot = app.Environment.WebRootPath;
var hasWebClient = webRoot is not null && File.Exists(Path.Combine(webRoot, "index.html"));

if (hasWebClient)
{
    app.UseDefaultFiles();
    app.UseStaticFiles();
}

app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

if (hasWebClient)
{
    // Rotas do React Router (/dashboard, /suppliers...) devolvem o index.html.
    app.MapFallbackToFile("index.html");
}

app.Run();
