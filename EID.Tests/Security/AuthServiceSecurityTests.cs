using EID.Application.DTOs.Auth;
using EID.Application.Interfaces.Repositories;
using EID.Application.Interfaces.Services;
using EID.Application.Services;
using EID.Domain.Constants;
using EID.Domain.Entities;

namespace EID.Tests.Security;

public sealed class AuthServiceSecurityTests
{
    [Fact]
    public void RegisterRequestDto_MustNotExposeRoleProperty()
    {
        var roleProperty =
            typeof(RegisterRequestDto).GetProperty("Role");

        Assert.Null(roleProperty);
    }

    [Fact]
    public async Task RegisterAsync_MustAlwaysCreateViewerUser()
    {
        var repository = new FakeUserRepository();
        var tokenService = new FakeTokenService();

        var service = new AuthService(
            repository,
            tokenService);

        var request = new RegisterRequestDto
        {
            Name = "Usuário de Teste",
            Email = "usuario.teste@example.com",
            Password = "SenhaSegura123!"
        };

        var response =
            await service.RegisterAsync(request);

        Assert.NotNull(repository.AddedUser);

        Assert.Equal(
            UserRoles.Viewer,
            repository.AddedUser.Role);

        Assert.Equal(
            UserRoles.Viewer,
            response.Role);

        Assert.NotEqual(
            request.Password,
            repository.AddedUser.PasswordHash);

        Assert.True(
            BCrypt.Net.BCrypt.Verify(
                request.Password,
                repository.AddedUser.PasswordHash));
    }

    private sealed class FakeTokenService
        : ITokenService
    {
        public string GenerateToken(User user)
        {
            return "test-token";
        }
    }

    private sealed class FakeUserRepository
        : IUserRepository
    {
        public User? AddedUser { get; private set; }

        public Task<User?> GetByIdAsync(Guid id)
        {
            return Task.FromResult<User?>(null);
        }

        public Task<User?> GetByEmailAsync(
            string email)
        {
            return Task.FromResult<User?>(null);
        }

        public Task<IEnumerable<User>> GetAllAsync()
        {
            return Task.FromResult<IEnumerable<User>>(
                Array.Empty<User>());
        }

        public Task AddAsync(User user)
        {
            AddedUser = user;

            return Task.CompletedTask;
        }

        public Task UpdateAsync(User user)
        {
            return Task.CompletedTask;
        }

        public Task SaveChangesAsync()
        {
            return Task.CompletedTask;
        }
    }
}
