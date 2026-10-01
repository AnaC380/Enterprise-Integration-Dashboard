using EID.Application.DTOs.Auth;
using EID.Application.Interfaces.Services;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace EID.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IValidator<LoginRequestDto> _loginValidator;
    private readonly IValidator<RegisterRequestDto> _registerValidator;

    public AuthController(
        IAuthService authService,
        IValidator<LoginRequestDto> loginValidator,
        IValidator<RegisterRequestDto> registerValidator)
    {
        _authService = authService;
        _loginValidator = loginValidator;
        _registerValidator = registerValidator;
    }

    /// <summary>Autentica um usuário e retorna o token JWT.</summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var validation = await _loginValidator.ValidateAsync(request);
        if (!validation.IsValid)
            return BadRequest(validation.Errors.Select(e => e.ErrorMessage));

        var response = await _authService.LoginAsync(request);
        return Ok(response);
    }

    /// <summary>Registra um novo usuário.</summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        var validation = await _registerValidator.ValidateAsync(request);
        if (!validation.IsValid)
            return BadRequest(validation.Errors.Select(e => e.ErrorMessage));

        var response = await _authService.RegisterAsync(request);
        return CreatedAtAction(nameof(Login), response);
    }
}
