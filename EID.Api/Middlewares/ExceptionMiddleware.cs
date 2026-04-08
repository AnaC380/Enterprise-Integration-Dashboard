using System.Net;
using System.Text.Json;

namespace EID.Api.Middlewares;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
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
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning("Unauthorized: {Message}", ex.Message);
            await WriteErrorAsync(context, HttpStatusCode.Unauthorized, ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("Bad request: {Message}", ex.Message);
            await WriteErrorAsync(context, HttpStatusCode.BadRequest, ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error");
            await WriteErrorAsync(context, HttpStatusCode.InternalServerError, "Ocorreu um erro inesperado.");
        }
    }

    private static async Task WriteErrorAsync(HttpContext context, HttpStatusCode statusCode, string message)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var result = JsonSerializer.Serialize(new { error = message });
        await context.Response.WriteAsync(result);
    }
}