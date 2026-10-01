using EID.Api.Controllers;
using EID.Application.DTOs.Auth;
using EID.Application.Interfaces.Services;
using EID.Application.Validators;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace EID.Tests.Controllers;

public class AuthControllerTests
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        _authServiceMock = new Mock<IAuthService>();
        _controller = new AuthController(
            _authServiceMock.Object,
            new LoginRequestValidator(),
            new RegisterRequestValidator());
    }

    [Fact]
    public async Task Register_ShouldReturn201_WhenSuccessful()
    {
        // Arrange
        var request = new RegisterRequestDto
        {
            Name = "Ana Carolina",
            Email = "ana@eid.com",
            Password = "Eid@123456"
        };

        var response = new AuthResponseDto
        {
            Token = "fake-token",
            Name = "Ana Carolina",
            Email = "ana@eid.com",
            Role = "Viewer"
        };

        _authServiceMock
            .Setup(s => s.RegisterAsync(request))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.Register(request);

        // Assert
        var created = result.Should().BeOfType<CreatedAtActionResult>().Subject;
        created.StatusCode.Should().Be(StatusCodes.Status201Created);
    }

    [Fact]
    public async Task Login_ShouldReturn200_WhenCredentialsAreValid()
    {
        // Arrange
        var request = new LoginRequestDto
        {
            Email = "ana@eid.com",
            Password = "Eid@123456"
        };

        var response = new AuthResponseDto
        {
            Token = "fake-token",
            Name = "Ana Carolina",
            Email = "ana@eid.com",
            Role = "Viewer"
        };

        _authServiceMock
            .Setup(s => s.LoginAsync(request))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.Login(request);

        // Assert
        var ok = result.Should().BeOfType<OkObjectResult>().Subject;
        ok.StatusCode.Should().Be(StatusCodes.Status200OK);
    }

    [Theory]
    [InlineData("", "ana@eid.com", "Eid@123456")]
    [InlineData("Ana", "email-invalido", "Eid@123456")]
    [InlineData("Ana", "ana@eid.com", "curta")]
    [InlineData("Ana", "ana@eid.com", "semmaiuscula1!")]
    [InlineData("Ana", "ana@eid.com", "SemNumero!")]
    [InlineData("Ana", "ana@eid.com", "SemEspecial1")]
    public async Task Register_ShouldReturn400_AndNotCallService_WhenInputIsInvalid(
        string name, string email, string password)
    {
        var request = new RegisterRequestDto { Name = name, Email = email, Password = password };

        var result = await _controller.Register(request);

        result.Should().BeOfType<BadRequestObjectResult>();
        _authServiceMock.Verify(s => s.RegisterAsync(It.IsAny<RegisterRequestDto>()), Times.Never);
    }

    [Theory]
    [InlineData("", "Eid@123456")]
    [InlineData("nao-e-email", "Eid@123456")]
    [InlineData("ana@eid.com", "")]
    public async Task Login_ShouldReturn400_AndNotCallService_WhenInputIsInvalid(
        string email, string password)
    {
        var request = new LoginRequestDto { Email = email, Password = password };

        var result = await _controller.Login(request);

        result.Should().BeOfType<BadRequestObjectResult>();
        _authServiceMock.Verify(s => s.LoginAsync(It.IsAny<LoginRequestDto>()), Times.Never);
    }
}
