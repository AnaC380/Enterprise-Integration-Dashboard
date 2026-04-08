using EID.Domain.Entities;

namespace EID.Application.Interfaces.Services;

public interface ITokenService
{
    string GenerateToken(User user);
}