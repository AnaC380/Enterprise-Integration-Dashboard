using EID.Application.DTOs.Auth;
using EID.Application.Interfaces.Repositories;
using EID.Application.Interfaces.Services;
using EID.Domain.Entities;

namespace EID.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;

    public AuthService(IUserRepository userRepository, ITokenService tokenService)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Email ou senha inválidos.");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("Usuário inativo.");

        user.LastLoginAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);
        await _userRepository.SaveChangesAsync();

        return new AuthResponseDto
        {
            Token = _tokenService.GenerateToken(user),
            Name = user.Name,
            Email = user.Email,
            Role = user.Role
        };
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        var existing = await _userRepository.GetByEmailAsync(request.Email);

        if (existing is not null)
            throw new InvalidOperationException("Email já cadastrado.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        return new AuthResponseDto
        {
            Token = _tokenService.GenerateToken(user),
            Name = user.Name,
            Email = user.Email,
            Role = user.Role
        };
    }
}