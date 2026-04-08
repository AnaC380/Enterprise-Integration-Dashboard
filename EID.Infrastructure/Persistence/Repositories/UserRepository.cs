using EID.Application.Interfaces.Repositories;
using EID.Domain.Entities;
using EID.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace EID.Infrastructure.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly SqlServerContext _context;

    public UserRepository(SqlServerContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(Guid id) =>
        await _context.Users.FindAsync(id);

    public async Task<User?> GetByEmailAsync(string email) =>
        await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

    public async Task<IEnumerable<User>> GetAllAsync() =>
        await _context.Users.ToListAsync();

    public async Task AddAsync(User user) =>
        await _context.Users.AddAsync(user);

    public Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync() =>
        await _context.SaveChangesAsync();
}