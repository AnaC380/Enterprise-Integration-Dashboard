using EID.Application.DTOs.Auth;
using EID.Application.Interfaces.Repositories;
using EID.Application.Interfaces.Services;
using EID.Application.Services;
using EID.Domain.Entities;
using FluentAssertions;
using Moq;

namespace EID.Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<ITokenService> _tokenServiceMock;
    private readonly IAuthService _authService;

    public AuthServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _tokenServiceMock = new Mock<ITokenService>();
        _authService = new AuthService(_userRepositoryMock.Object, _tokenServiceMock.Object);
    }

    // ─── REGISTER ────────────────────────────────────────────────────

    [Fact]
    public async Task Register_ShouldAssignViewerRole_Regardless_Of_Input()
    {
        // Arrange
        var request = new RegisterRequestDto
        {
            Name = "Ana Carolina",
            Email = "ana@eid.com",
            Password = "Eid@123456"
        };

        _userRepositoryMock
            .Setup(r => r.GetByEmailAsync(request.Email))
            .ReturnsAsync((User?)null);

        _tokenServiceMock
            .Setup(t => t.GenerateToken(It.IsAny<User>()))
            .Returns("fake-jwt-token");

        User? capturedUser = null;
        _userRepositoryMock
            .Setup(r => r.AddAsync(It.IsAny<User>()))
            .Callback<User>(u => capturedUser = u);

        // Act
        var result = await _authService.RegisterAsync(request);

        // Assert
        capturedUser.Should().NotBeNull();
        capturedUser!.Role.Should().Be("Viewer",
            because: "o servidor sempre define o perfil básico, nunca o cliente");
    }

    [Fact]
    public async Task Register_ShouldHashPassword_NotStoreInPlainText()
    {
        // Arrange
        var request = new RegisterRequestDto
        {
            Name = "Ana Carolina",
            Email = "ana@eid.com",
            Password = "Eid@123456"
        };

        _userRepositoryMock
            .Setup(r => r.GetByEmailAsync(request.Email))
            .ReturnsAsync((User?)null);

        _tokenServiceMock
            .Setup(t => t.GenerateToken(It.IsAny<User>()))
            .Returns("fake-jwt-token");

        User? capturedUser = null;
        _userRepositoryMock
            .Setup(r => r.AddAsync(It.IsAny<User>()))
            .Callback<User>(u => capturedUser = u);

        // Act
        await _authService.RegisterAsync(request);

        // Assert
        capturedUser!.PasswordHash.Should().NotBe("Eid@123456",
            because: "senhas nunca devem ser armazenadas em texto plano");
        BCrypt.Net.BCrypt.Verify("Eid@123456", capturedUser.PasswordHash).Should().BeTrue(
            because: "o hash deve ser verificável com BCrypt");
    }

    [Fact]
    public async Task Register_ShouldThrow_WhenEmailAlreadyExists()
    {
        // Arrange
        var request = new RegisterRequestDto
        {
            Name = "Ana Carolina",
            Email = "ana@eid.com",
            Password = "Eid@123456"
        };

        _userRepositoryMock
            .Setup(r => r.GetByEmailAsync(request.Email))
            .ReturnsAsync(new User { Email = request.Email });

        // Act
        var act = async () => await _authService.RegisterAsync(request);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Email já cadastrado.");
    }

    [Fact]
    public async Task Register_ShouldReturnToken_WhenSuccessful()
    {
        // Arrange
        var request = new RegisterRequestDto
        {
            Name = "Ana Carolina",
            Email = "ana@eid.com",
            Password = "Eid@123456"
        };

        _userRepositoryMock
            .Setup(r => r.GetByEmailAsync(request.Email))
            .ReturnsAsync((User?)null);

        _tokenServiceMock
            .Setup(t => t.GenerateToken(It.IsAny<User>()))
            .Returns("fake-jwt-token");

        // Act
        var result = await _authService.RegisterAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.Token.Should().Be("fake-jwt-token");
        result.Email.Should().Be(request.Email);
        result.Name.Should().Be(request.Name);
    }

    // ─── LOGIN ───────────────────────────────────────────────────────

    [Fact]
    public async Task Login_ShouldReturnToken_WhenCredentialsAreValid()
    {
        // Arrange
        var passwordHash = BCrypt.Net.BCrypt.HashPassword("Eid@123456");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = "Ana Carolina",
            Email = "ana@eid.com",
            PasswordHash = passwordHash,
            Role = "Viewer",
            IsActive = true
        };

        _userRepositoryMock
            .Setup(r => r.GetByEmailAsync("ana@eid.com"))
            .ReturnsAsync(user);

        _tokenServiceMock
            .Setup(t => t.GenerateToken(user))
            .Returns("fake-jwt-token");

        var request = new LoginRequestDto
        {
            Email = "ana@eid.com",
            Password = "Eid@123456"
        };

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        result.Token.Should().Be("fake-jwt-token");
        result.Role.Should().Be("Viewer");
    }

    [Fact]
    public async Task Login_ShouldThrow_WhenPasswordIsWrong()
    {
        // Arrange
        var user = new User
        {
            Email = "ana@eid.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("SenhaCorreta@123"),
            IsActive = true
        };

        _userRepositoryMock
            .Setup(r => r.GetByEmailAsync("ana@eid.com"))
            .ReturnsAsync(user);

        var request = new LoginRequestDto
        {
            Email = "ana@eid.com",
            Password = "SenhaErrada@123"
        };

        // Act
        var act = async () => await _authService.LoginAsync(request);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Email ou senha inválidos.");
    }

    [Fact]
    public async Task Login_ShouldThrow_WhenUserIsInactive()
    {
        // Arrange
        var user = new User
        {
            Email = "ana@eid.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Eid@123456"),
            IsActive = false
        };

        _userRepositoryMock
            .Setup(r => r.GetByEmailAsync("ana@eid.com"))
            .ReturnsAsync(user);

        var request = new LoginRequestDto
        {
            Email = "ana@eid.com",
            Password = "Eid@123456"
        };

        // Act
        var act = async () => await _authService.LoginAsync(request);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Usuário inativo.");
    }

    [Fact]
    public async Task Login_ShouldThrow_WhenUserNotFound()
    {
        // Arrange
        _userRepositoryMock
            .Setup(r => r.GetByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync((User?)null);

        var request = new LoginRequestDto
        {
            Email = "naoexiste@eid.com",
            Password = "Eid@123456"
        };

        // Act
        var act = async () => await _authService.LoginAsync(request);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Email ou senha inválidos.");
    }
}